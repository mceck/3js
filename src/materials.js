import * as THREE from 'three';

// Color palette
export const COLORS = {
  floor: 0x1a2030,
  floorLine: 0x2a3040,
  wall: 0x242830,
  wallTop: 0x303840,
  wallEdge: 0x3a4050,
  block: 0x00ccff,
  blockOnPlate: 0x40ff90,
  plate: 0xaa44ff,
  plateActive: 0x40ff90,
  player: 0x00ccff,
  playerInner: 0x88ddff,
  ambient: 0x1a1a30,
  fog: 0x0a0c18,
  groundGrid: 0x141824,
  groundLine: 0x1e2838,
  // Modifier colors
  ice: 0x66ddff,
  teleA: 0xff8833,
  teleB: 0xdd44ff,
  fragile: 0xaa7744,
  fragileCrack: 0x665533,
  arrow: 0x44ff88,
};

// Floor modifier types
export const MODIFIER = {
  NONE: 0,
  ICE: 1,
  TELE_A: 2,
  TELE_B: 3,
  FRAGILE: 4,
  ARROW_UP: 5,
  ARROW_RIGHT: 6,
  ARROW_DOWN: 7,
  ARROW_LEFT: 8,
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
