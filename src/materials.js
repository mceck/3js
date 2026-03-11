import * as THREE from 'three';

// Color palette
export const COLORS = {
  floor: 0x0e1018,
  floorLine: 0x1a1e2a,
  wall: 0x161820,
  wallTop: 0x1e2028,
  wallEdge: 0x2a2e3a,
  block: 0x00ccff,
  blockOnPlate: 0x40ff90,
  plate: 0xaa44ff,
  plateActive: 0x40ff90,
  player: 0x00ccff,
  playerInner: 0x88ddff,
  ambient: 0x080810,
  fog: 0x03030a,
  groundGrid: 0x0c0e16,
  groundLine: 0x141828,
};

// Floor tile material - slightly reflective dark
export const floorMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.floor,
  roughness: 0.6,
  metalness: 0.4,
});

// Wall material with top face variation
export const wallMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.wall,
  roughness: 0.5,
  metalness: 0.5,
});

export const wallTopMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.wallTop,
  roughness: 0.4,
  metalness: 0.6,
});

// Block (energy core) material - bright emissive for bloom
export function createBlockMaterial(onPlate = false) {
  return new THREE.MeshStandardMaterial({
    color: onPlate ? COLORS.blockOnPlate : COLORS.block,
    emissive: onPlate ? COLORS.blockOnPlate : COLORS.block,
    emissiveIntensity: onPlate ? 0.8 : 0.5,
    roughness: 0.1,
    metalness: 0.9,
  });
}

// Plate material - strong emissive for bloom glow
export function createPlateMaterial(active = false) {
  return new THREE.MeshStandardMaterial({
    color: active ? COLORS.plateActive : COLORS.plate,
    emissive: active ? COLORS.plateActive : COLORS.plate,
    emissiveIntensity: active ? 1.0 : 0.4,
    roughness: 0.2,
    metalness: 0.7,
  });
}

// Player material - bright emissive
export const playerMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.player,
  emissive: COLORS.player,
  emissiveIntensity: 0.5,
  roughness: 0.2,
  metalness: 0.8,
});

// Player wireframe aura
export const playerAuraMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.player,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
});
