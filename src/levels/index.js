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
  description: 'The Architect\'s own workspace, divided by pillars placed with deliberate intention. Three cores must weave through the gaps to reach their conduits \u2014 a puzzle left as a test for any who would follow.',
  completionText: 'The workshop awakens. Holographic blueprints flicker into existence along the walls \u2014 designs for chambers that may never be built. Or perhaps they already were, deeper still.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 5, 2, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 5, 2, 1],
    [1, 2, 2, 5, 2, 2, 3, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

const level5 = {
  name: 'The Forgotten Vault',
  description: 'Three cores scattered across a chamber with a single pillar at its heart. The Architect left this as a trial \u2014 order matters, and careless moves cannot be undone.',
  completionText: 'The vault stirs. Forgotten conduits light up across the walls, revealing passages deeper than any map has charted. The Architect\'s legacy runs deeper still.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 1, 2, 2, 1],
    [1, 2, 5, 2, 5, 2, 1],
    [1, 2, 2, 5, 2, 2, 1],
    [1, 2, 2, 4, 2, 3, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
};

const level6 = {
  name: 'The Crossing',
  description: 'An ancient pillar divides this chamber in two. The cores must cross paths around it \u2014 what seems simple demands foresight.',
  completionText: 'The paths converge. Energy spirals around the central pillar, and the chamber hums a frequency not heard in aeons. The way forward opens.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 5, 2, 3, 2, 1],
    [1, 2, 2, 1, 2, 2, 1],
    [1, 2, 3, 2, 5, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
};

const level7 = {
  name: 'Antechamber',
  description: 'The antechamber to the inner sanctum. Three cores rest close together \u2014 but pushing one may block another. Sequence is everything.',
  completionText: 'Three locks turn as one. The inner sanctum\'s seal weakens, its barriers flickering. The Architect\'s most guarded secrets lie just beyond.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 5, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 3, 2, 2, 1],
    [1, 2, 2, 2, 4, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

const level8 = {
  name: 'The Divided Chamber',
  description: 'A rift of ancient stone splits this grand chamber down the center. Four cores must be guided to the corners \u2014 but the rift allows only narrow crossing.',
  completionText: 'The rift pulses with light as all four conduits activate. The two halves of the chamber resonate in harmony, a frequency that shakes dust from ceilings untouched for millennia.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 3, 2, 1, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 5, 2, 1, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 1, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 3, 2, 1, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

const level9 = {
  name: 'Pressure Points',
  description: 'Twin pillars guard the energy conduits of this deep chamber. Three cores must navigate around them \u2014 a wrong push against a pillar means starting over.',
  completionText: 'The pillars glow as conduits activate around them. Deep within the walls, something vast begins to move \u2014 the heart of the Architect\'s creation stirs.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 5, 2, 2, 2, 5, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 3, 2, 2, 2, 1],
    [1, 2, 2, 2, 4, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

const level10 = {
  name: 'Heart of the Architect',
  description: 'The deepest chamber. The Architect\'s final masterwork \u2014 four cores, four conduits, and a single pillar at the heart of it all. Restore this, and the Vaults live again.',
  completionText: 'The Heart beats once more. Every chamber, every corridor, every forgotten passage floods with light. A hologram of the Architect flickers to life: "You have done what I could not finish. These Vaults \u2014 and all their secrets \u2014 are now yours."',
  grid: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 2, 2, 2, 1, 1, 0],
    [1, 1, 2, 2, 2, 2, 2, 1, 1],
    [1, 2, 2, 5, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 5, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 3, 2, 4, 2, 3, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
};

export const levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];
