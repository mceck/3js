import * as THREE from 'three';
import { floorMaterial, wallMaterial, createPlateMaterial, COLORS } from './materials.js';

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
    this.plates = []; // { x, z, mesh, glowMesh }
    this.width = 0;
    this.height = 0;
    this.cells = [];
  }

  // Build 3D grid from level data
  build(levelData) {
    this.clear();
    this.height = levelData.length;
    this.width = levelData[0].length;
    this.cells = levelData.map(row => [...row]);

    // Center offset so grid is centered at origin
    const offsetX = -(this.width - 1) / 2;
    const offsetZ = -(this.height - 1) / 2;

    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        const cell = levelData[z][x];
        const worldX = x * TILE_SIZE + offsetX;
        const worldZ = z * TILE_SIZE + offsetZ;

        if (cell === CELL.VOID) continue;

        // Floor tile for all non-void, non-wall cells
        if (cell !== CELL.WALL) {
          this._createFloorTile(worldX, worldZ);
        }

        // Wall
        if (cell === CELL.WALL) {
          this._createWall(worldX, worldZ);
        }

        // Plate
        if (cell === CELL.PLATE || cell === CELL.BLOCK_ON_PLATE) {
          this._createPlate(x, z, worldX, worldZ);
        }
      }
    }

    return { offsetX, offsetZ };
  }

  _createFloorTile(wx, wz) {
    const geo = new THREE.BoxGeometry(TILE_SIZE * 0.96, FLOOR_HEIGHT, TILE_SIZE * 0.96);
    const mesh = new THREE.Mesh(geo, floorMaterial);
    mesh.position.set(wx, -FLOOR_HEIGHT / 2, wz);
    mesh.receiveShadow = true;
    this.group.add(mesh);

    // Subtle grid line edges
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x1a1e2a, transparent: true, opacity: 0.3 })
    );
    line.position.copy(mesh.position);
    this.group.add(line);
  }

  _createWall(wx, wz) {
    const geo = new THREE.BoxGeometry(TILE_SIZE, WALL_HEIGHT, TILE_SIZE);
    const mesh = new THREE.Mesh(geo, wallMaterial);
    mesh.position.set(wx, WALL_HEIGHT / 2 - FLOOR_HEIGHT, wz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    // Edge highlights
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: COLORS.wallEdge, transparent: true, opacity: 0.4 })
    );
    line.position.copy(mesh.position);
    this.group.add(line);
  }

  _createPlate(gridX, gridZ, wx, wz) {
    // Recessed plate disc
    const geo = new THREE.CylinderGeometry(0.35, 0.35, PLATE_HEIGHT, 16);
    const mat = createPlateMaterial(false);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(wx, PLATE_HEIGHT / 2, wz);
    this.group.add(mesh);

    // Glow ring
    const ringGeo = new THREE.RingGeometry(0.32, 0.42, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.plate,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(wx, 0.03, wz);
    this.group.add(ring);

    this.plates.push({ x: gridX, z: gridZ, mesh, ring, mat, ringMat });
  }

  // Update plate visuals based on which ones have blocks
  updatePlates(blockPositions) {
    for (const plate of this.plates) {
      const active = blockPositions.some(b => b.x === plate.x && b.z === plate.z);
      const color = active ? COLORS.plateActive : COLORS.plate;
      plate.mat.color.setHex(color);
      plate.mat.emissive.setHex(color);
      plate.mat.emissiveIntensity = active ? 0.8 : 0.3;
      plate.ringMat.color.setHex(color);
      plate.ringMat.opacity = active ? 0.5 : 0.25;
    }
  }

  // Check if a grid position is walkable (not wall, not void, in bounds)
  isWalkable(gx, gz) {
    if (gx < 0 || gx >= this.width || gz < 0 || gz >= this.height) return false;
    const cell = this.cells[gz][gx];
    return cell !== CELL.VOID && cell !== CELL.WALL;
  }

  // Convert grid position to world position
  gridToWorld(gx, gz) {
    const offsetX = -(this.width - 1) / 2;
    const offsetZ = -(this.height - 1) / 2;
    return {
      x: gx * TILE_SIZE + offsetX,
      z: gz * TILE_SIZE + offsetZ,
    };
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
  }
}
