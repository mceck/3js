import { CELL } from './grid.js';
import { MODIFIER } from './materials.js';

// Parse level data into game state
export function parseLevel(levelData) {
  const grid = levelData.grid;
  let playerStart = null;
  const blocks = [];
  const plates = [];
  const teleporters = [];

  for (let z = 0; z < grid.length; z++) {
    for (let x = 0; x < grid[z].length; x++) {
      const cell = grid[z][x];
      if (cell === CELL.PLAYER) {
        playerStart = { x, z };
      } else if (cell === CELL.BLOCK) {
        blocks.push({ x, z });
      } else if (cell === CELL.BLOCK_ON_PLATE) {
        blocks.push({ x, z });
        plates.push({ x, z });
      } else if (cell === CELL.PLATE) {
        plates.push({ x, z });
      }
    }
  }

  // Parse modifiers to find teleporter positions
  const modifiers = levelData.modifiers || null;
  if (modifiers) {
    for (let z = 0; z < modifiers.length; z++) {
      for (let x = 0; x < modifiers[z].length; x++) {
        const mod = modifiers[z][x];
        if (mod === MODIFIER.TELE_A || mod === MODIFIER.TELE_B) {
          teleporters.push({ x, z, type: mod });
        }
      }
    }
  }

  return {
    name: levelData.name,
    description: levelData.description || '',
    completionText: levelData.completionText || '',
    grid,
    modifiers,
    playerStart,
    blocks,
    plates,
    teleporters,
  };
}
