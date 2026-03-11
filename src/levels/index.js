// Cell types: 0=void, 1=wall, 2=floor, 3=plate, 4=player, 5=block, 6=block_on_plate

// Level 1: Chamber of First Light (1 block, 1 plate - tutorial)
const level1 = {
  name: 'Chamber of First Light',
  grid: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 4, 2, 3, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
};

// Level 2: Twin Conduits (2 blocks, 2 plates)
const level2 = {
  name: 'Twin Conduits',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 5, 2, 2, 5, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 3, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

// Level 3: The Narrow Passage (2 blocks, 2 plates, corridors)
const level3 = {
  name: 'The Narrow Passage',
  grid: [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 2, 2, 2, 1, 1],
    [1, 2, 2, 5, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1],
    [1, 3, 2, 5, 2, 3, 1],
    [1, 1, 2, 4, 2, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
};

// Level 4: Architect's Workshop (3 blocks, 3 plates)
const level4 = {
  name: "Architect's Workshop",
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 5, 2, 1, 2, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 2, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 2, 1, 2, 5, 2, 1],
    [1, 2, 2, 2, 1, 2, 3, 2, 1],
    [1, 4, 2, 5, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

// Level 5: The Forgotten Vault (4 blocks, 4 plates)
const level5 = {
  name: 'The Forgotten Vault',
  grid: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 2, 2, 2, 1, 1, 1],
    [1, 2, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 3, 2, 5, 1, 5, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 3, 2, 4, 2, 3, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

export const levels = [level1, level2, level3, level4, level5];
