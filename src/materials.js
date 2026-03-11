import * as THREE from 'three';

// Color palette
export const COLORS = {
  floor: 0x12141a,
  floorLine: 0x1a1e2a,
  wall: 0x1a1c24,
  wallEdge: 0x252830,
  block: 0x00ccff,
  blockOnPlate: 0x40ff90,
  plate: 0xaa44ff,
  plateActive: 0x40ff90,
  player: 0x00ccff,
  ambient: 0x101020,
  fog: 0x05050f,
};

// Floor tile material
export const floorMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.floor,
  roughness: 0.8,
  metalness: 0.2,
});

// Wall material
export const wallMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.wall,
  roughness: 0.6,
  metalness: 0.4,
});

// Block (energy core) material
export function createBlockMaterial(onPlate = false) {
  return new THREE.MeshStandardMaterial({
    color: onPlate ? COLORS.blockOnPlate : COLORS.block,
    emissive: onPlate ? COLORS.blockOnPlate : COLORS.block,
    emissiveIntensity: onPlate ? 0.6 : 0.4,
    roughness: 0.2,
    metalness: 0.8,
  });
}

// Plate material
export function createPlateMaterial(active = false) {
  return new THREE.MeshStandardMaterial({
    color: active ? COLORS.plateActive : COLORS.plate,
    emissive: active ? COLORS.plateActive : COLORS.plate,
    emissiveIntensity: active ? 0.8 : 0.3,
    roughness: 0.3,
    metalness: 0.6,
  });
}

// Player material
export const playerMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.player,
  emissive: COLORS.player,
  emissiveIntensity: 0.3,
  roughness: 0.3,
  metalness: 0.7,
});
