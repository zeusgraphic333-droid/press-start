// Trials — iron (English edition). Same ids as iron.js. Contract: docs/BRIEF.md § Trials. Engines: games/_iron-play.js.
import { foundry, routes, odd } from './_iron-play.js';

const END = { result: 'Your score', again: 'Play again', back: 'All trials' };
const IRON_NAMES = { gray: ['Gray', ''], ductile: ['Ductile', ''], white: ['White', ''], cgi: ['CGI', ''], malleable: ['Malleable', ''], alloy: ['High-alloy', ''] };

const foundryGame = foundry({
  ...END,
  title: 'Foundry orders', en: 'Pour the right iron',
  how: 'Orders land on the foundry floor: an engine block, a crankshaft, a mill roll, a bearing surface… Pour the right cast iron before the clock runs out. 12 orders; keys 1–6 pour too.',
  order: 'Order', combo: 'Combo', score: 'Score', ticket: 'Work order', ask: 'Which iron do you pour?',
  irons: IRON_NAMES,
  late: 'Late', shipped: 'Shipped', returned: 'Returned', timeUp: 'Time’s up.', right: 'Right.', wrong: 'Nope.',
  orders: {
    'g-flywheel': ['Flywheel', 'A heavy disc that spins with the engine', 'Flywheels are on the gray iron slide.'],
    'g-base': ['Lathe base', 'Must swallow vibration so the cut stays accurate', 'Damping vibration for machine tools = gray iron.'],
    'g-engine': ['Engine block', 'For a family car', 'Engine blocks: gray iron or CGI. Both count.'],
    'g-disc': ['Brake disc', 'For a family car', 'Disc brakes and drums = gray iron.'],
    'g-bed': ['Heavy machine bed', 'Carries tons in compression and must not shake', 'High compressive strength + damps vibration = gray iron.'],
    'd-crank': ['Crankshaft', 'Turns and twists with every stroke', 'Crankshafts = ductile iron: machinability, fatigue strength, high modulus.'],
    'd-gear': ['Heavy-duty gear', 'Needs fatigue strength and a high modulus of elasticity', 'Heavy-duty gears = ductile iron.'],
    'd-mg': ['Stiff casting', 'Trace magnesium; takes shocks', 'Trace magnesium is ductile (nodular) iron.'],
    'w-crusher': ['Crusher', 'For a brick factory', 'Clay and brickmaking equipment = white iron: wear and abrasion.'],
    'w-nozzle': ['Clay nozzle', 'For a clay-mixing line', 'Nozzles = white iron.'],
    'w-shoe': ['Railroad brake shoes', 'They rub against train wheels', 'Railroad brake shoes = white iron, not malleable.'],
    'w-rolls': ['Rolling-mill rolls', 'They squeeze steel slabs all day', 'Rolling-mill rolls = white iron.'],
    'c-manifold': ['Exhaust manifold', 'Runs very hot; the heat must get out', 'Exhaust manifolds = CGI: high thermal conductivity.'],
    'c-pump': ['Gear pump', 'Works at high pressure', 'High pressure gear pumps = CGI.'],
    'c-drum': ['Brake drum', 'For a truck', 'Brake drums: CGI or gray iron. Both count.'],
    'm-bearing': ['Heavy-duty bearing surface', 'For a truck axle', 'Heavy-duty bearing surfaces = malleable iron.'],
    'm-farm': ['Tractor part', 'Farm machinery', 'Farm machinery = malleable iron.'],
    'm-build': ['Digger part', 'Construction machinery', 'Construction machinery = malleable iron.'],
    'm-rail': ['Bearing surface', 'For railroad rolling stock', 'Railroad rolling stock = malleable iron, not white.'],
    'a-cr': ['Part that oxidizes and rubs', 'Must resist oxidation and wear', 'Oxidation + wear = high-alloy (high-chromium).'],
    'a-ni': ['Instrument housing', 'Must not be magnetic', 'Nonmagnetic = high-alloy (nickel).'],
    'a-exp': ['Precision gauge part', 'Its size must not grow when it warms up', 'Extremely low thermal expansion = high-alloy (nickel).']
  },
  lines: [['Your foundry.', 'Not one order came back. You know every iron’s job.'], ['Clean work.', 'A few orders came back. Read why, then pour again.'], ['The yard is full of returns.', 'Go back to “Whose job is this?”, then come back.']]
});

const routesGame = routes({
  ...END,
  title: 'Foundry routes', en: 'Iron into iron',
  how: 'You get a gray, ductile or white casting, and the order asks for another iron. Add the steps in order: chill in the mold, heat-treat, alloy… then pour. 5 orders.',
  round: 'Order', score: 'Score', make: 'The order', ask: 'Add a step', undo: 'Undo last step', pour: 'Pour and check',
  steps: { chill: ['Chill in the mold', 'chill selected areas'], heat: ['Heat-treat', 'heat-treatment process'], mg: ['Add magnesium', 'trace amounts'], cr: ['Add chromium', 'up to 35% alloy'], ni: ['Add nickel', 'up to 35% alloy'] },
  names: { gray: ['Gray iron', ''], ductile: ['Ductile iron', ''], white: ['White iron', ''], malleable: ['Malleable iron', ''], highcr: ['High-chromium iron', ''], nickel: ['Nickel iron', ''] },
  orders: { 'r-crusher': 'for brick-plant crushers', 'r-bearing': 'for a truck’s bearing surfaces', 'r-oxid': 'for a part that must resist oxidation and wear', 'r-nonmag': 'for an instrument case that must be nonmagnetic', 'r-farm': 'for tractor parts', 'r-rolls': 'for rolling-mill rolls' },
  right: 'Right. That’s the order.', lost: 'That route isn’t on the slides.', other: n => `You made ${n}, not the order.`,
  howto: {
    white: 'White iron = gray or ductile iron + chilling selected areas in the mold.',
    malleable: 'Malleable iron = white iron + a heat treatment. So: chill in the mold first, then heat-treat.',
    highcr: 'High-chromium iron = gray, ductile or white iron + chromium, up to 35% alloy.',
    nickel: 'Nickel iron = gray, ductile or white iron + nickel, up to 35% alloy.'
  },
  lines: [['Master founder.', 'Every order came out exactly as asked.'], ['Close.', 'Remember: white + furnace = malleable, and any of the three + up to 35% alloy = high-alloy.'], ['The routes got tangled.', 'Go back to the malleable iron chapter and follow the chain.']]
});

const oddGame = odd({
  title: 'Odd one out', en: 'Spot the intruder',
  how: 'Four facts: three belong to one cast iron, one sneaked in from another. Find the intruder before the clock runs out. 10 rounds.',
  irons: { gray: 'gray iron', ductile: 'ductile iron', white: 'white iron', cgi: 'CGI', malleable: 'malleable iron', alloy: 'high-alloy irons' },
  prompt: n => `Three of these belong to <b>${n}</b>. Which one does NOT?`,
  intro: { title: 'Odd one out', text: 'The exam loves a <b>NOT</b> question. Practice it here: three facts of one iron, and an intruder.', rules: ['Tap the intruder, or use keys 1–4.', 'The intruder always belongs to another of the six irons.', 'Right answers in a row build a combo.'] },
  rounds: [
    ['gray', ['Engine blocks', 'Flywheels', 'Large machine bases'], 'Crankshafts', 'Crankshafts belong to ductile iron.'],
    ['gray', ['Excellent fatigue resistance', 'Ability to dampen vibration', 'High compressive strength'], 'Oxidation and wear resistant', 'Oxidation and wear resistance belong to high-chromium irons.'],
    ['ductile', ['Crankshafts', 'Heavy-duty gears', 'Trace amounts of magnesium'], 'Rolling-mill rolls', 'Rolling-mill rolls are white iron.'],
    ['ductile', ['Machinability', 'Fatigue strength', 'High modulus of elasticity'], 'Nonmagnetic', 'Nonmagnetic is nickel iron.'],
    ['white', ['Crushers', 'Pulverizers', 'Railroad brake shoes'], 'Railroad rolling stock bearing surfaces', 'Railroad rolling stock is malleable iron, not white.'],
    ['white', ['Nozzles', 'Rolling-mill rolls', 'Chilled areas in the mold'], 'Exhaust manifolds', 'Exhaust manifolds are CGI.'],
    ['cgi', ['Exhaust manifolds', 'High pressure gear pumps', 'Brake drums'], 'Farm machinery', 'Farm machinery is malleable iron.'],
    ['cgi', ['Strength similar to gray iron', 'High thermal conductivity', 'Machinability superior to ductile iron'], 'Extremely low thermal expansion', 'Extremely low expansion is nickel iron.'],
    ['malleable', ['Heavy-duty bearing surfaces', 'Farm machinery', 'Construction machinery'], 'Clay-mixing nozzles', 'Nozzles are white iron.'],
    ['malleable', ['Made from white iron', 'Heat-treatment process', 'Easily machined'], 'Up to 35% alloy content', 'Up to 35% alloy is high-alloy iron.'],
    ['alloy', ['Up to 35% alloy content', 'High-chromium: oxidation and wear resistant', 'Nickel: nonmagnetic'], 'Trace amounts of magnesium', 'Trace magnesium is ductile iron.'],
    ['alloy', ['Nonmagnetic', 'Good corrosion resistance', 'Extremely low thermal expansion'], 'Ability to dampen vibration', 'Damping vibration is gray iron.']
  ]
});

export default [foundryGame, routesGame, oddGame];
