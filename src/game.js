import { Grid, CELL } from './grid.js';
import { Player } from './player.js';
import { Block } from './block.js';
import { parseLevel } from './levelLoader.js';
import { levels } from './levels/index.js';
import { UI } from './ui.js';

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
    this.history = []; // undo stack
    this.busy = false; // prevent input during animation
    this.levelData = null;
    this.onLevelLoaded = null; // callback for camera resize

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
      if (this.currentLevel < levels.length - 1) {
        this.loadLevel(this.currentLevel + 1);
      } else {
        this.ui.showTitle();
        this._updateLevelSelect();
      }
    });

    this._updateLevelSelect();
  }

  _updateLevelSelect() {
    this.ui.buildLevelSelect(levels.length, this.unlockedLevel, (idx) => {
      this.ui.hideTitle();
      this.loadLevel(idx);
    });
  }

  loadLevel(index) {
    this.currentLevel = index;
    this.moves = 0;
    this.history = [];
    this.busy = false;

    const level = levels[index];
    this.levelData = parseLevel(level);

    // Clear old blocks
    this.blocks.forEach(b => b.dispose());
    this.blocks = [];
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }

    // Build grid
    this.grid.build(this.levelData.grid);

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

    // Notify camera
    if (this.onLevelLoaded) {
      this.onLevelLoaded(this.grid.width, this.grid.height);
    }
  }

  // Handle directional input
  async handleMove(dx, dz) {
    if (this.busy || !this.player) return;

    const newX = this.player.gridX + dx;
    const newZ = this.player.gridZ + dz;

    // Check bounds and walkability
    if (!this.grid.isWalkable(newX, newZ)) return;

    // Check for block at target
    const blockAtTarget = this.blocks.find(b => b.gridX === newX && b.gridZ === newZ);

    if (blockAtTarget) {
      // Try to push block
      const pushX = newX + dx;
      const pushZ = newZ + dz;

      // Block can't be pushed if destination is not walkable or has another block
      if (!this.grid.isWalkable(pushX, pushZ)) return;
      if (this.blocks.some(b => b.gridX === pushX && b.gridZ === pushZ)) return;

      // Save state for undo
      this._saveState();

      // Move block and player
      this.busy = true;
      await Promise.all([
        blockAtTarget.moveTo(pushX, pushZ, this.grid),
        this.player.moveTo(newX, newZ, this.grid),
      ]);
    } else {
      // Just move player
      this._saveState();
      this.busy = true;
      await this.player.moveTo(newX, newZ, this.grid);
    }

    this.moves++;
    this.ui.setMoves(this.moves);
    this._updateBlockStates();
    this.busy = false;

    // Check win
    if (this._checkWin()) {
      this.busy = true;
      // Unlock next level
      if (this.currentLevel + 1 > this.unlockedLevel) {
        this.unlockedLevel = this.currentLevel + 1;
        this._saveProgress();
      }
      setTimeout(() => {
        this.ui.showComplete(this.moves, this.currentLevel >= levels.length - 1);
        this._updateLevelSelect();
      }, 400);
    }
  }

  // Undo last move
  undo() {
    if (this.busy || this.history.length === 0) return;
    const state = this.history.pop();

    this.player.setPosition(state.player.x, state.player.z, this.grid);
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].setPosition(state.blocks[i].x, state.blocks[i].z, this.grid);
    }

    this.moves = state.moves;
    this.ui.setMoves(this.moves);
    this._updateBlockStates();
  }

  // Reset current level
  reset() {
    if (this.busy) return;
    this.loadLevel(this.currentLevel);
  }

  _saveState() {
    this.history.push({
      player: { x: this.player.gridX, z: this.player.gridZ },
      blocks: this.blocks.map(b => ({ x: b.gridX, z: b.gridZ })),
      moves: this.moves,
    });
  }

  _updateBlockStates() {
    const blockPositions = this.blocks.map(b => ({ x: b.gridX, z: b.gridZ }));

    // Update plate visuals
    this.grid.updatePlates(blockPositions);

    // Update block visuals (on plate or not)
    for (const block of this.blocks) {
      const onPlate = this.levelData.plates.some(
        p => p.x === block.gridX && p.z === block.gridZ
      );
      block.setOnPlate(onPlate);
    }
  }

  _checkWin() {
    // All plates must have a block on them
    return this.levelData.plates.every(plate =>
      this.blocks.some(b => b.gridX === plate.x && b.gridZ === plate.z)
    );
  }

  // Called each frame for animations
  update(time) {
    if (this.player) this.player.update(time);
    for (const block of this.blocks) block.update(time);
  }
}
