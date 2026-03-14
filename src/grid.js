import * as THREE from 'three';
import { floorMaterial, wallMaterial, wallTopMaterial, createPlateMaterial, COLORS, MODIFIER } from './materials.js';

// Cell types in level data
export const CELL = {
  VOID: 0,
  WALL: 1,
  FLOOR: 2,
  PLATE: 3,
  PLAYER: 4,   // floor + player start
  BLOCK: 5,    // floor + block
  BLOCK_ON_PLATE: 6, // plate + block
};

const TILE_SIZE = 1;
const WALL_HEIGHT = 1.2;
const FLOOR_HEIGHT = 0.1;
const PLATE_HEIGHT = 0.02;

export class Grid {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.plates = [];
    this.width = 0;
    this.height = 0;
    this.cells = [];
    this.modifiers = null;
    this.floorTiles = new Map();
    this.fragileOverlays = new Map();
    this.teleporterObjects = [];
  }

  build(levelData, modifiersData) {
    this.clear();
    this.height = levelData.length;
    this.width = levelData[0].length;
    this.cells = levelData.map(row => [...row]);
    this.modifiers = modifiersData || null;

    const offsetX = -(this.width - 1) / 2;
    const offsetZ = -(this.height - 1) / 2;

    // Ground plane extending beyond the level
    this._createGroundPlane();

    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        const cell = levelData[z][x];
        const worldX = x * TILE_SIZE + offsetX;
        const worldZ = z * TILE_SIZE + offsetZ;

        if (cell === CELL.VOID) continue;

        if (cell !== CELL.WALL) {
          this._createFloorTile(worldX, worldZ, x, z);
        }

        if (cell === CELL.WALL) {
          this._createWall(worldX, worldZ, x, z, levelData);
        }

        if (cell === CELL.PLATE || cell === CELL.BLOCK_ON_PLATE) {
          this._createPlate(x, z, worldX, worldZ);
        }

        // Render modifier overlays
        const mod = this.getModifier(x, z);
        if (mod === MODIFIER.ICE) {
          this._createIceOverlay(worldX, worldZ);
        } else if (mod === MODIFIER.TELE_A || mod === MODIFIER.TELE_B) {
          this._createTeleporterOverlay(worldX, worldZ, mod === MODIFIER.TELE_A);
        } else if (mod === MODIFIER.FRAGILE) {
          this._createFragileOverlay(worldX, worldZ, x, z);
        } else if (mod >= MODIFIER.ARROW_UP && mod <= MODIFIER.ARROW_LEFT) {
          this._createArrowOverlay(worldX, worldZ, mod);
        }
      }
    }

    return { offsetX, offsetZ };
  }

  _createGroundPlane() {
    const size = 40;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS.groundGrid,
      roughness: 0.9,
      metalness: 0.1,
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -FLOOR_HEIGHT - 0.01;
    plane.receiveShadow = true;
    this.group.add(plane);

    // Grid lines on the ground plane
    const gridHelper = new THREE.GridHelper(size, size, COLORS.groundLine, COLORS.groundLine);
    gridHelper.position.y = -FLOOR_HEIGHT;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.12;
    this.group.add(gridHelper);
  }

  _createFloorTile(wx, wz, gx, gz) {
    const geo = new THREE.BoxGeometry(TILE_SIZE * 0.97, FLOOR_HEIGHT, TILE_SIZE * 0.97);
    const mesh = new THREE.Mesh(geo, floorMaterial);
    mesh.position.set(wx, -FLOOR_HEIGHT / 2, wz);
    mesh.receiveShadow = true;
    this.group.add(mesh);

    // Glowing edge lines
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: COLORS.floorLine,
        transparent: true,
        opacity: 0.4,
      })
    );
    line.position.copy(mesh.position);
    this.group.add(line);

    // Store reference for fragile floor hiding
    if (gx !== undefined) {
      this.floorTiles.set(`${gx},${gz}`, { mesh, line });
    }
  }

  _createWall(wx, wz, gx, gz, levelData) {
    // Multi-material wall: darker sides, lighter top
    const geo = new THREE.BoxGeometry(TILE_SIZE, WALL_HEIGHT, TILE_SIZE);

    // Use different materials for top vs sides
    const materials = [
      wallMaterial, // +X
      wallMaterial, // -X
      wallTopMaterial, // +Y (top)
      wallMaterial, // -Y (bottom)
      wallMaterial, // +Z
      wallMaterial, // -Z
    ];

    const mesh = new THREE.Mesh(geo, materials);
    mesh.position.set(wx, WALL_HEIGHT / 2 - FLOOR_HEIGHT, wz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    // Glowing edge highlights
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: COLORS.wallEdge,
        transparent: true,
        opacity: 0.5,
      })
    );
    line.position.copy(mesh.position);
    this.group.add(line);

    // Add emissive accent lines where wall faces a floor tile
    this._addWallAccents(wx, wz, gx, gz, levelData);
  }

  _addWallAccents(wx, wz, gx, gz, levelData) {
    const dirs = [
      { dx: 1, dz: 0, rx: 0, rz: Math.PI / 2 },
      { dx: -1, dz: 0, rx: 0, rz: -Math.PI / 2 },
      { dx: 0, dz: 1, rx: Math.PI / 2, rz: 0 },
      { dx: 0, dz: -1, rx: -Math.PI / 2, rz: 0 },
    ];

    for (const { dx, dz } of dirs) {
      const nx = gx + dx;
      const nz = gz + dz;
      if (nx < 0 || nx >= this.width || nz < 0 || nz >= this.height) continue;
      const neighbor = levelData[nz][nx];
      if (neighbor !== CELL.VOID && neighbor !== CELL.WALL) {
        // This wall face is visible from a floor tile - add subtle accent line
        const lineGeo = new THREE.PlaneGeometry(0.96, 0.02);
        const lineMat = new THREE.MeshBasicMaterial({
          color: 0x2244aa,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const accent = new THREE.Mesh(lineGeo, lineMat);
        accent.position.set(
          wx + dx * 0.501,
          0.02,
          wz + dz * 0.501
        );
        // Rotate to face outward
        if (dx !== 0) {
          accent.rotation.y = Math.PI / 2;
        }
        this.group.add(accent);
      }
    }
  }

  _createPlate(gridX, gridZ, wx, wz) {
    // Recessed plate disc
    const geo = new THREE.CylinderGeometry(0.35, 0.35, PLATE_HEIGHT, 24);
    const mat = createPlateMaterial(false);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(wx, PLATE_HEIGHT / 2 + 0.001, wz);
    this.group.add(mesh);

    // Inner glow ring
    const ringGeo = new THREE.RingGeometry(0.28, 0.42, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.plate,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(wx, 0.02, wz);
    this.group.add(ring);

    // Outer pulse ring (animated in update)
    const outerRingGeo = new THREE.RingGeometry(0.38, 0.44, 32);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: COLORS.plate,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.set(wx, 0.015, wz);
    this.group.add(outerRing);

    // Point light under plate
    const plateLight = new THREE.PointLight(COLORS.plate, 0.3, 2);
    plateLight.position.set(wx, 0.1, wz);
    this.group.add(plateLight);

    this.plates.push({
      x: gridX, z: gridZ,
      mesh, ring, outerRing,
      mat, ringMat, outerRingMat,
      plateLight,
    });
  }

  updatePlates(blockPositions) {
    for (const plate of this.plates) {
      const active = blockPositions.some(b => b.x === plate.x && b.z === plate.z);
      const color = active ? COLORS.plateActive : COLORS.plate;
      plate.mat.color.setHex(color);
      plate.mat.emissive.setHex(color);
      plate.mat.emissiveIntensity = active ? 1.0 : 0.4;
      plate.ringMat.color.setHex(color);
      plate.ringMat.opacity = active ? 0.5 : 0.3;
      plate.outerRingMat.color.setHex(color);
      plate.plateLight.color.setHex(color);
      plate.plateLight.intensity = active ? 0.8 : 0.3;
    }
  }

  // Animate plate pulse rings
  update(time) {
    for (const plate of this.plates) {
      const pulse = 0.5 + Math.sin(time * 2) * 0.5;
      plate.outerRingMat.opacity = 0.08 + pulse * 0.12;
      const scale = 1.0 + Math.sin(time * 2) * 0.08;
      plate.outerRing.scale.set(scale, scale, 1);
    }
  }

  // --- Modifier overlay rendering ---

  _createIceOverlay(wx, wz) {
    // Semi-transparent ice surface
    const geo = new THREE.PlaneGeometry(0.92, 0.92);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.ice,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(wx, 0.02, wz);
    this.group.add(mesh);

    // Crystal cross pattern
    const verts = new Float32Array([
      -0.3, 0, 0, 0.3, 0, 0,
      0, 0, -0.3, 0, 0, 0.3,
      -0.2, 0, -0.2, 0.2, 0, 0.2,
      -0.2, 0, 0.2, 0.2, 0, -0.2,
    ]);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: COLORS.ice,
      transparent: true,
      opacity: 0.25,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.position.set(wx, 0.025, wz);
    this.group.add(lines);
  }

  _createTeleporterOverlay(wx, wz, isA) {
    const color = isA ? COLORS.teleA : COLORS.teleB;

    // Hexagonal portal ring
    const ringGeo = new THREE.RingGeometry(0.28, 0.40, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(wx, 0.025, wz);
    this.group.add(ring);

    // Inner glow disc
    const innerGeo = new THREE.CircleGeometry(0.22, 6);
    const innerMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = -Math.PI / 2;
    inner.position.set(wx, 0.02, wz);
    this.group.add(inner);

    // Outer pulse ring (animated)
    const outerGeo = new THREE.RingGeometry(0.36, 0.44, 6);
    const outerMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.rotation.x = -Math.PI / 2;
    outer.position.set(wx, 0.018, wz);
    this.group.add(outer);

    // Point light
    const light = new THREE.PointLight(color, 0.4, 2);
    light.position.set(wx, 0.15, wz);
    this.group.add(light);

    this.teleporterObjects.push({ ring, ringMat, inner, innerMat, outer, outerMat, light });
  }

  _createFragileOverlay(wx, wz, gx, gz) {
    // Crack pattern
    const verts = new Float32Array([
      -0.35, 0, -0.08, 0.0, 0, 0.06,
      0.0, 0, 0.06, 0.38, 0, -0.12,
      0.0, 0, 0.06, -0.08, 0, 0.32,
      0.0, 0, 0.06, 0.18, 0, 0.28,
      -0.18, 0, -0.04, -0.28, 0, 0.18,
    ]);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: COLORS.fragile,
      transparent: true,
      opacity: 0.6,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.position.set(wx, 0.025, wz);
    this.group.add(lines);

    // Warning tint
    const geo = new THREE.PlaneGeometry(0.92, 0.92);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.fragile,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(wx, 0.018, wz);
    this.group.add(mesh);

    this.fragileOverlays.set(`${gx},${gz}`, { lines, mesh });
  }

  _createArrowOverlay(wx, wz, direction) {
    // Arrow shape (chevron pointing up in shape-space)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.2);
    shape.lineTo(-0.14, 0.0);
    shape.lineTo(-0.05, 0.0);
    shape.lineTo(-0.05, -0.2);
    shape.lineTo(0.05, -0.2);
    shape.lineTo(0.05, 0.0);
    shape.lineTo(0.14, 0.0);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.arrow,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;

    // Rotate arrow to point in correct direction
    // After rotation.x = -PI/2: shape Y -> world -Z (up in grid)
    const yRot = {
      [MODIFIER.ARROW_UP]: 0,           // -Z
      [MODIFIER.ARROW_RIGHT]: -Math.PI / 2, // +X
      [MODIFIER.ARROW_DOWN]: Math.PI,        // +Z
      [MODIFIER.ARROW_LEFT]: Math.PI / 2,   // -X
    };
    mesh.rotation.y = yRot[direction] || 0;
    mesh.position.set(wx, 0.025, wz);
    this.group.add(mesh);
  }

  // --- Modifier helpers ---

  getModifier(gx, gz) {
    if (!this.modifiers) return MODIFIER.NONE;
    if (gz < 0 || gz >= this.modifiers.length) return MODIFIER.NONE;
    if (gx < 0 || gx >= this.modifiers[gz].length) return MODIFIER.NONE;
    return this.modifiers[gz][gx];
  }

  breakFragile(gx, gz) {
    this.cells[gz][gx] = CELL.VOID;
    const floor = this.floorTiles.get(`${gx},${gz}`);
    if (floor) { floor.mesh.visible = false; floor.line.visible = false; }
    const overlay = this.fragileOverlays.get(`${gx},${gz}`);
    if (overlay) { overlay.lines.visible = false; overlay.mesh.visible = false; }
  }

  restoreFragile(gx, gz) {
    this.cells[gz][gx] = CELL.FLOOR;
    const floor = this.floorTiles.get(`${gx},${gz}`);
    if (floor) { floor.mesh.visible = true; floor.line.visible = true; }
    const overlay = this.fragileOverlays.get(`${gx},${gz}`);
    if (overlay) { overlay.lines.visible = true; overlay.mesh.visible = true; }
  }

  isWalkable(gx, gz) {
    if (gx < 0 || gx >= this.width || gz < 0 || gz >= this.height) return false;
    const cell = this.cells[gz][gx];
    return cell !== CELL.VOID && cell !== CELL.WALL;
  }

  gridToWorld(gx, gz) {
    const offsetX = -(this.width - 1) / 2;
    const offsetZ = -(this.height - 1) / 2;
    return {
      x: gx * TILE_SIZE + offsetX,
      z: gz * TILE_SIZE + offsetZ,
    };
  }

  // Animate teleporter pulse rings
  update(time) {
    for (const plate of this.plates) {
      const pulse = 0.5 + Math.sin(time * 2) * 0.5;
      plate.outerRingMat.opacity = 0.08 + pulse * 0.12;
      const scale = 1.0 + Math.sin(time * 2) * 0.08;
      plate.outerRing.scale.set(scale, scale, 1);
    }

    // Animate teleporter overlays
    for (const tp of this.teleporterObjects) {
      const pulse = 0.5 + Math.sin(time * 2.5) * 0.5;
      tp.outerMat.opacity = 0.1 + pulse * 0.15;
      const scale = 1.0 + Math.sin(time * 2.5) * 0.1;
      tp.outer.scale.set(scale, scale, 1);
      tp.ring.rotation.z = time * 0.3;
    }
  }

  clear() {
    while (this.group.children.length) {
      const child = this.group.children[0];
      this.group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
    this.plates = [];
    this.cells = [];
    this.floorTiles.clear();
    this.fragileOverlays.clear();
    this.teleporterObjects = [];
  }
}
