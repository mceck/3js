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

// === NEW MECHANIC LEVELS ===
// Modifier types: 1=ice, 2=teleA, 3=teleB, 4=fragile, 5=arrowUp, 6=arrowRight, 7=arrowDown, 8=arrowLeft

const level11 = {
  name: 'Crystalline Depths',
  description: 'The lower vaults are sheathed in ancient ice. Cores slide across frozen surfaces until they strike something solid. Use the chamber\'s geometry to guide them.',
  completionText: 'The ice cracks and refreezes around the activated conduits. Deeper still, warmth stirs — something ancient remembers how to breathe.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level12 = {
  name: 'Glacier Labyrinth',
  description: 'A vast frozen chamber where two cores must reach opposite conduits. On ice, a core will slide endlessly — unless another core blocks its path. Sacrifice position to save position.',
  completionText: 'Two lights ignite across the frozen expanse. The glacier groans, and hidden channels of meltwater begin to flow, carrying energy to systems long dormant.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 4, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level13 = {
  name: 'Rift Portals',
  description: 'The Architect tore holes in space itself. Two shimmering portals link distant corners of this chamber — push a core through one, and it emerges from the other.',
  completionText: 'The portals pulse in sync with the activated conduits, their edges now glowing with stable energy. The Architect\'s mastery of spatial folding was greater than anyone imagined.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 1, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 1, 3, 1],
    [1, 4, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level14 = {
  name: 'Dual Rifts',
  description: 'Two pairs of portals crisscross this chamber, each linked to its twin. Two cores must be threaded through different rifts to reach their conduits — but the portals don\'t discriminate about what enters.',
  completionText: 'Four rifts stabilize into permanent gateways. Through them, you glimpse other chambers — perhaps other vaults entirely. The Architect built not just rooms, but a network.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 3, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 3, 2, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level15 = {
  name: 'Crumbling Foundation',
  description: 'Ages of neglect have weakened the floors. Certain tiles will crumble into the void the moment you step off them — plan your path, for there is no retracing your steps.',
  completionText: 'The conduit activates even as the chamber crumbles around it. Energy leaps across the gaps in the floor, bridging what time has broken. Some things outlast their foundations.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 1],
    [1, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0],
    [0, 0, 4, 0, 4, 0, 0],
    [0, 4, 0, 4, 0, 4, 0],
    [0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
};

const level16 = {
  name: 'The Collapsing Gallery',
  description: 'A grand gallery where almost every tile threatens to give way. Two cores, two conduits, and a floor that vanishes behind you. Every step must count — there are no second chances here.',
  completionText: 'The gallery is more hole than floor now, but the conduits blaze with power. Through the gaps you see the vast emptiness below — and far, far down, a faint blue glow answers back.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 5, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 3, 1],
    [1, 4, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 4, 4, 0, 0, 0, 0],
    [0, 4, 0, 4, 4, 0, 4, 0],
    [0, 0, 4, 0, 4, 4, 0, 0],
    [0, 4, 0, 4, 0, 0, 4, 0],
    [0, 0, 4, 0, 4, 4, 0, 0],
    [0, 4, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level17 = {
  name: 'One-Way Circuits',
  description: 'Ancient flow regulators line certain corridors, permitting passage in only one direction. The cores must follow the current — fight it, and they will not budge.',
  completionText: 'The circuits close. Energy flows in the direction the Architect intended, powering systems that reshape the very walls. The Vaults are alive — and they are changing.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 2, 2, 2, 5, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 4, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 0, 0],
    [0, 0, 0, 0, 0, 0, 5, 0],
    [0, 0, 0, 0, 0, 0, 5, 0],
    [0, 8, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 8, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level18 = {
  name: 'Forced March',
  description: 'A maze of one-way corridors forces a winding path through the chamber. Three cores must navigate the labyrinth — pushing against the flow is impossible, so think ahead.',
  completionText: 'The maze reconfigures as power returns, one-way gates unlocking into open corridors. What was a test is now a thoroughfare. The Architect rewards those who prove worthy.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 5, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 5, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 6, 6, 0, 0, 0, 0, 0],
    [0, 5, 0, 0, 5, 0, 0, 7, 0],
    [0, 5, 0, 0, 0, 6, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 8, 8, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0, 6, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level19 = {
  name: 'Convergence',
  description: 'Ice, portals, and crumbling floors converge in a single chamber. The Architect combined every trick in this penultimate trial. Mastery of each element is required — and the margin for error is razor-thin.',
  completionText: 'Every mechanism fires in concert. Ice refracts the portal light, and the crumbling tiles stabilize mid-fall as energy courses through them. This was not a test — it was a key.',
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 2, 2, 2, 2, 1, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 4, 0, 2, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const level20 = {
  name: 'The Architect\'s Legacy',
  description: 'The final chamber. Ice, rifts, crumbling ground, and flow regulators — every mechanism the Architect devised guards this last sanctum. Three cores must reach their conduits to complete the restoration. This is the end, and the beginning.',
  completionText: 'The final conduits ignite. A cascade of energy sweeps through every vault, every corridor, every forgotten corner. The hologram speaks once more: "The Vaults are complete. What was forgotten is now eternal. Go forth — and build anew."',
  grid: [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 2, 2, 2, 2, 2, 2, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 5, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 1, 2, 5, 2, 2, 2, 3, 1, 1],
    [0, 1, 1, 2, 4, 2, 1, 1, 1, 0],
  ],
  modifiers: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 6, 6, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 5, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 4, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 8, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

export const levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15, level16, level17, level18, level19, level20];
