// Cell types: 0=void, 1=wall, 2=floor, 3=plate, 4=player, 5=block, 6=block_on_plate

const level1 = {
  name: 'Chamber of First Light',
  description: 'The entrance to the Vaults lies dormant. A single energy core rests in the darkness, waiting to be guided to the power plate that will reawaken this forgotten chamber.',
  completionText: 'Light returns to the first chamber. The ancient mechanisms hum with renewed purpose. Deeper corridors beckon beyond.',
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

const level2 = {
  name: 'Twin Conduits',
  description: 'Two conduits, long severed from their power source. The Architect designed them as a pair \u2014 both must be restored together for the chamber to function.',
  completionText: 'The twin conduits flare to life in unison. Energy courses through pathways unseen for millennia. The Architect\'s design holds true.',
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

const level3 = {
  name: 'The Narrow Passage',
  description: 'Collapsed corridors force a careful approach. The Architect built these passages narrow by design \u2014 one wrong push, and the cores become lodged beyond recovery.',
  completionText: 'Energy flows through the narrow passages like blood through veins. The deeper vaults tremble as power reaches systems thought permanently dead.',
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

const level4 = {
  name: "Architect's Workshop",
  description: 'The Architect\'s own workspace, divided by walls placed with deliberate intention. Three cores must find their homes among partitioned chambers \u2014 a puzzle left as a test for any who would follow.',
  completionText: 'The workshop awakens. Holographic blueprints flicker into existence along the walls \u2014 designs for chambers that may never be built. Or perhaps they already were, deeper still.',
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

const level5 = {
  name: 'The Forgotten Vault',
  description: 'The deepest chamber. Four cores scattered across a symmetrical maze \u2014 the Architect\'s final masterwork. Solve this, and the Vaults will be restored to their former glory.',
  completionText: 'The Forgotten Vault remembers. All chambers pulse with energy. Somewhere in the restored circuitry, a message from the Architect echoes: "To those who completed what I began \u2014 these Vaults are now yours."',
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
