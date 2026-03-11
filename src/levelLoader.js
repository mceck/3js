import { CELL } from './grid.js';

// Parse level data into game state
export function parseLevel(levelData) {
  const grid = levelData.grid;
  let playerStart = null;
  const blocks = [];
  const plates = [];

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

  return {
    name: levelData.name,
    description: levelData.description || '',
    completionText: levelData.completionText || '',
    grid,
    playerStart,
    blocks,
    plates,
  };
}
