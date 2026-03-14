import { Grid, CELL } from './grid.js';
import { Player } from './player.js';
import { Block } from './block.js';
import { parseLevel } from './levelLoader.js';
import { levels } from './levels/index.js';
import { UI } from './ui.js';
import { CelebrationBurst } from './particles.js';
import { MODIFIER } from './materials.js';

export class Game {
  constructor(scene) {
    this.scene = scene;
    this.grid = new Grid(scene);
    this.player = null;
    this.blocks = [];
    this.ui = new UI();
    this.currentLevel = 0;
    this.unlockedLevel = 0;
    this.moves = 0;
    this.history = [];
    this.busy = false;
    this.levelData = null;
    this.onLevelLoaded = null;
    this.celebrations = []; // active celebration effects
    this.lastMoveDir = null; // tracks last movement direction for camera follow
    this.brokenFragile = new Set(); // tracks broken fragile tiles

    this._loadProgress();
    this._setupUI();
  }

  _loadProgress() {
    try {
      const saved = localStorage.getItem('vaults_progress');
      if (saved) this.unlockedLevel = parseInt(saved, 10);
    } catch (_) { /* ignore */ }
  }

  _saveProgress() {
    try {
      localStorage.setItem('vaults_progress', this.unlockedLevel.toString());
    } catch (_) { /* ignore */ }
  }

  _setupUI() {
    this.ui.startBtn.addEventListener('click', () => {
      this.ui.hideTitle();
      this.loadLevel(this.currentLevel);
    });

    this.ui.nextLevelBtn.addEventListener('click', () => {
      this.ui.hideComplete();
      this.celebrations.forEach(c => { if (c.alive) c.dispose(); });
      this.celebrations = [];
      if (this.currentLevel < levels.length - 1) {
        this.loadLevel(this.currentLevel + 1);
      } else {
        this.ui.showTitle();
        this._updateLevelSelect();
      }
    });

    this.ui.introStartBtn.addEventListener('click', () => {
      this.ui.hideIntro();
    });

    this._updateLevelSelect();
  }

  _updateLevelSelect() {
    this.ui.buildLevelSelect(levels.length, this.unlockedLevel, (idx) => {
      this.ui.hideTitle();
      this.loadLevel(idx);
    });
  }

  loadLevel(index, showIntro = true) {
    this.currentLevel = index;
    this.moves = 0;
    this.history = [];
    this.busy = false;
    this.lastMoveDir = null;

    const level = levels[index];
    this.levelData = parseLevel(level);

    // Clear old entities
    this.blocks.forEach(b => b.dispose());
    this.blocks = [];
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    this.celebrations.forEach(c => { if (c.alive) c.dispose(); });
    this.celebrations = [];
    this.brokenFragile = new Set();

    // Build grid
    this.grid.build(this.levelData.grid, this.levelData.modifiers);

    // Create player
    this.player = new Player(this.scene);
    this.player.setPosition(this.levelData.playerStart.x, this.levelData.playerStart.z, this.grid);

    // Create blocks
    for (const b of this.levelData.blocks) {
      this.blocks.push(new Block(this.scene, b.x, b.z, this.grid));
    }

    // Update UI
    this.ui.setLevelName(this.levelData.name);
    this.ui.setMoves(0);
    this.ui.hideComplete();

    this._updateBlockStates();

    if (this.onLevelLoaded) {
      this.onLevelLoaded(this.grid.width, this.grid.height);
    }

    // Show level intro with narrative
    if (showIntro && this.levelData.description) {
      this.ui.showIntro(this.levelData.name, this.levelData.description);
    }
  }

  // Check if a one-way arrow allows movement in the given direction
  _isArrowAllowed(gx, gz, dx, dz) {
    const mod = this.grid.getModifier(gx, gz);
    if (mod < MODIFIER.ARROW_UP || mod > MODIFIER.ARROW_LEFT) return true;
    const allowed = {
      [MODIFIER.ARROW_UP]: { dx: 0, dz: -1 },
      [MODIFIER.ARROW_RIGHT]: { dx: 1, dz: 0 },
      [MODIFIER.ARROW_DOWN]: { dx: 0, dz: 1 },
      [MODIFIER.ARROW_LEFT]: { dx: -1, dz: 0 },
    };
    const a = allowed[mod];
    return dx === a.dx && dz === a.dz;
  }

  // Compute where a block slides on ice
  _iceSlideEnd(startX, startZ, dx, dz) {
    let x = startX, z = startZ;
    while (this.grid.getModifier(x, z) === MODIFIER.ICE) {
      const nx = x + dx, nz = z + dz;
      if (!this.grid.isWalkable(nx, nz)) break;
      if (this.blocks.some(b => b.gridX === nx && b.gridZ === nz)) break;
      if (!this._isArrowAllowed(nx, nz, dx, dz)) break;
      x = nx;
      z = nz;
    }
    return { x, z };
  }

  async handleMove(dx, dz) {
    if (this.busy || !this.player) return;

    const newX = this.player.gridX + dx;
    const newZ = this.player.gridZ + dz;

    if (!this.grid.isWalkable(newX, newZ)) return;

    // Check one-way arrow constraint on target tile
    if (!this._isArrowAllowed(newX, newZ, dx, dz)) return;

    const prevPlayerX = this.player.gridX;
    const prevPlayerZ = this.player.gridZ;

    const blockAtTarget = this.blocks.find(b => b.gridX === newX && b.gridZ === newZ);

    if (blockAtTarget) {
      let pushX = newX + dx;
      let pushZ = newZ + dz;

      if (!this.grid.isWalkable(pushX, pushZ)) return;
      if (this.blocks.some(b => b.gridX === pushX && b.gridZ === pushZ)) return;
      // Check one-way arrow on push destination
      if (!this._isArrowAllowed(pushX, pushZ, dx, dz)) return;

      this._saveState();
      this.busy = true;

      // Ice sliding for block
      const ice = this._iceSlideEnd(pushX, pushZ, dx, dz);
      pushX = ice.x;
      pushZ = ice.z;

      await Promise.all([
        blockAtTarget.moveTo(pushX, pushZ, this.grid),
        this.player.moveTo(newX, newZ, this.grid),
      ]);

      // Teleporter for block
      await this._handleTeleport(blockAtTarget, pushX, pushZ);
    } else {
      this._saveState();
      this.busy = true;
      await this.player.moveTo(newX, newZ, this.grid);
    }

    // Break fragile tile the player LEFT
    const prevMod = this.grid.getModifier(prevPlayerX, prevPlayerZ);
    if (prevMod === MODIFIER.FRAGILE && !this.brokenFragile.has(`${prevPlayerX},${prevPlayerZ}`)) {
      this.brokenFragile.add(`${prevPlayerX},${prevPlayerZ}`);
      this.grid.breakFragile(prevPlayerX, prevPlayerZ);
    }

    this.lastMoveDir = { dx, dz };
    this.moves++;
    this.ui.setMoves(this.moves);
    this._updateBlockStates();
    this.busy = false;

    if (this._checkWin()) {
      this.busy = true;

      // Spawn celebration bursts from each plate
      for (const plate of this.levelData.plates) {
        const world = this.grid.gridToWorld(plate.x, plate.z);
        setTimeout(() => {
          this.celebrations.push(
            new CelebrationBurst(this.scene, { x: world.x, y: 0.5, z: world.z })
          );
        }, Math.random() * 300);
      }

      if (this.currentLevel + 1 > this.unlockedLevel) {
        this.unlockedLevel = this.currentLevel + 1;
        this._saveProgress();
      }
      setTimeout(() => {
        this.ui.showComplete(
          this.moves,
          this.currentLevel >= levels.length - 1,
          this.levelData.completionText
        );
        this._updateLevelSelect();
      }, 800);
    }
  }

  async _handleTeleport(block, bx, bz) {
    const mod = this.grid.getModifier(bx, bz);
    if (mod !== MODIFIER.TELE_A && mod !== MODIFIER.TELE_B) return;
    const targetType = mod === MODIFIER.TELE_A ? MODIFIER.TELE_B : MODIFIER.TELE_A;
    const paired = this.levelData.teleporters.find(t => t.type === targetType);
    if (!paired) return;
    // Don't teleport if paired destination is occupied
    if (this.blocks.some(b => b.gridX === paired.x && b.gridZ === paired.z)) return;
    if (this.player.gridX === paired.x && this.player.gridZ === paired.z) return;
    block.gridX = paired.x;
    block.gridZ = paired.z;
    const world = this.grid.gridToWorld(paired.x, paired.z);
    block.group.position.set(world.x, 0, world.z);
  }

  undo() {
    if (this.busy || this.history.length === 0) return;
    const state = this.history.pop();

    // Restore fragile tiles that were broken after this state was saved
    const oldBroken = this.brokenFragile;
    this.brokenFragile = new Set(state.brokenFragile || []);
    for (const key of oldBroken) {
      if (!this.brokenFragile.has(key)) {
        const [gx, gz] = key.split(',').map(Number);
        this.grid.restoreFragile(gx, gz);
      }
    }

    this.player.setPosition(state.player.x, state.player.z, this.grid);
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].setPosition(state.blocks[i].x, state.blocks[i].z, this.grid);
    }

    this.moves = state.moves;
    this.ui.setMoves(this.moves);
    this._updateBlockStates();
  }

  reset() {
    if (this.busy) return;
    this.loadLevel(this.currentLevel, false); // skip intro on reset
  }

  _saveState() {
    this.history.push({
      player: { x: this.player.gridX, z: this.player.gridZ },
      blocks: this.blocks.map(b => ({ x: b.gridX, z: b.gridZ })),
      moves: this.moves,
      brokenFragile: [...this.brokenFragile],
    });
  }

  _updateBlockStates() {
    const blockPositions = this.blocks.map(b => ({ x: b.gridX, z: b.gridZ }));

    this.grid.updatePlates(blockPositions);

    for (const block of this.blocks) {
      const onPlate = this.levelData.plates.some(
        p => p.x === block.gridX && p.z === block.gridZ
      );
      block.setOnPlate(onPlate);
    }
  }

  _checkWin() {
    return this.levelData.plates.every(plate =>
      this.blocks.some(b => b.gridX === plate.x && b.gridZ === plate.z)
    );
  }

  update(time) {
    if (this.player) this.player.update(time);
    for (const block of this.blocks) block.update(time);
    this.grid.update(time);

    // Update celebration effects
    for (let i = this.celebrations.length - 1; i >= 0; i--) {
      this.celebrations[i].update();
      if (!this.celebrations[i].alive) {
        this.celebrations.splice(i, 1);
      }
    }
  }
}
