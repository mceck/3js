import * as THREE from 'three';
import { floorMaterial, wallMaterial, wallTopMaterial, createPlateMaterial, COLORS } from './materials.js';

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
  }

  build(levelData) {
    this.clear();
    this.height = levelData.length;
    this.width = levelData[0].length;
    this.cells = levelData.map(row => [...row]);

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
          this._createFloorTile(worldX, worldZ);
        }

        if (cell === CELL.WALL) {
          this._createWall(worldX, worldZ, x, z, levelData);
        }

        if (cell === CELL.PLATE || cell === CELL.BLOCK_ON_PLATE) {
          this._createPlate(x, z, worldX, worldZ);
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

  _createFloorTile(wx, wz) {
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
