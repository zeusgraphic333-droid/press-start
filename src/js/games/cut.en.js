// Trials — cut (English edition). Same ids as cut.js. Contract: docs/BRIEF.md § Trials. The engines live in _cut-kit.js;
// this file only carries the English words.
import { keepOrScrap, setTheGap, nameTheCut } from './_cut-kit.js';

const COMMON = { round: 'Round', combo: 'Combo', score: 'Score', right: 'Right.', wrong: 'Nope.', timeUp: 'Time’s up.', result: 'Your score', review: 'Look at these again', again: 'Play again', back: 'All trials' };

const KEEP = {
  ...COMMON,
  title: 'Keep or scrap?',
  how: 'The press strikes and the pieces land in front of you. Tap the piece that goes in the scrap bin, or “no scrap”. 10 rounds; number keys work.',
  prompt: 'Which piece goes in the scrap bin?',
  none: 'None of them: no scrap',
  product: 'product', scrap: 'scrap',
  wins: [[1, 'Not one mistake.', 'You can tell product from scrap before the punch even lifts.'], [.8, 'Strong.', 'A little more focus on the ones you missed and it’s perfect.'], [.5, 'Halfway there.', 'Go back to “Punching vs blanking”, then try again.'], [0, 'Not yet.', 'Remember the only question: which piece do we want? Then play again.']],
  pieces: { sheetHole: 'a sheet with a hole', slug: 'the piece that fell out', sheetBig: 'a sheet with a big hole', blank: 'the disc that fell out', blankFine: 'the disc that fell out, smooth-edged', sheetPerf: 'a sheet full of holes', slugsTiny: 'a pile of tiny pieces', sheetSlots: 'a sheet with rectangular holes', slugsRect: 'small rectangular pieces', sheetNotch: 'a sheet with a notch in its edge', notchPiece: 'the notch piece', cup: 'the cup', flange: 'the flange ring', partShaved: 'the part after shaving', sliver: 'a very thin ring', lens: 'a part', hourglass: 'the piece between two parts', cPart: 'the part that came off', stripRest: 'the rest of the strip', strip: 'a strip', louver: 'a sheet with louvers', ribs: 'a sheet with reinforcement ribs', coin: 'the coin' },
  cases: {
    punch: ['The customer wants a sheet with a round hole.', 'In <b>punching</b> the hole is the desired product; the material punched out is waste.'],
    blank: ['The customer wants round discs.', 'In <b>blanking</b> the blank that falls out is the product; the sheet with the hole is waste.'],
    fine: ['The customer wants flat discs with smooth edges.', '<b>Fine blanking</b> is blanking: the blank is the product, the sheet is waste.'],
    perf: ['The customer wants a grille with lots of holes, close together.', 'In <b>perforating</b> the sheet full of holes is the product; the tiny pieces are scrap.'],
    slot: ['The customer wants a shelf with rectangular holes.', 'In <b>slotting</b> the sheet is the product; the rectangular pieces are scrap.'],
    notch: ['The customer wants a sheet with a notch in its edge.', 'In <b>notching</b> the sheet is the product; the notch piece is scrap.'],
    trim: ['The customer wants the cup without its extra flange.', 'In <b>trimming</b> the cup is the product; the flange ring is scrap.'],
    shave: ['The customer wants an accurate hole with a clean edge.', 'In <b>shaving</b> the part is the product; the thin shaved ring is scrap.'],
    part: ['The customer wants parts cut from the strip.', 'In <b>parting</b> the punch has two cutting edges; the piece between two parts is scrap.'],
    cutoff: ['The customer wants parts cut from the strip.', '<b>Cutoff</b> separates without producing any scrap: both pieces are good.'],
    slit: ['The customer wants the sheet cut into strips.', '<b>Slitting</b> cuts straight lines and produces no scrap.'],
    lance: ['The customer wants air louvers in the sheet.', 'In <b>lancing</b> no material is removed: the louver stays attached, bent up.'],
    emboss: ['The customer wants reinforcement ribs in the sheet.', '<b>Embossing</b> creates hollows without removing any metal.'],
    coin: ['The customer wants a coin with an impression on both sides.', '<b>Coining</b> impresses both sides without removing any metal.']
  }
};

const GAP = {
  ...COMMON,
  title: 'Set the clearance',
  how: 'Five times: move the clearance until the two dashed break lines become one line, then punch. Five times: read a cut and judge it: too small, right, or too large? Arrow keys move, Enter punches.',
  kindSet: 'Set', kindRead: 'Read',
  setPrompt: 'Make the two dashed lines one line, then punch.',
  readPrompt: 'This is how the part was cut. What was the clearance?',
  readPromptTxt: 'The shop report says:',
  gapLabel: 'Clearance c', punch: 'Punch', keys: 'Arrows, then Enter',
  figLabel: 'Section: the punch and die with the sheet between them',
  states: { small: 'Too small', ok: 'Right', large: 'Too large' },
  statesEn: { small: 'double buffing', ok: 'clean cut', large: 'pinched and bent' },
  symptoms: { small: 'The press needed a larger force, and the edge shows double buffing.', ok: 'The break lines met and the part came off clean.', large: 'The metal was pinched and bent between the cutting edges.' },
  res: {
    small: ['Too small.', 'The break lines passed each other: double buffing and a larger force.'],
    ok: ['Right.', 'The break lines met in one line, and the cut is clean.'],
    large: ['Too large.', 'The metal was pinched and bent between the cutting edges.']
  },
  wins: [[1, 'A toolmaker’s hands.', 'Your clearance is spot on, and your eye reads the edge.'], [.8, 'Close.', 'Focus on the case you missed.'], [.5, 'Half and half.', 'Remember: too small = double buffing and larger force. Too large = pinched and bent.'], [0, 'Not yet.', 'Go back to the “Set the gap” demo in the lesson, then try again.']]
};

const NAME = {
  title: 'Name the cut',
  how: 'A piece fresh off the press and the customer’s order. Name the operation before time runs out. 12 rounds; keys 1–4 work.',
  intro: { title: 'Name the cut', text: 'You’ll see a piece fresh off the press, with the customer’s order. Pick the operation’s name, exactly as the exam writes it.', rules: ['4 options, and the names look alike: focus.', 'Every round has a clock.', 'Right after right builds a combo.'] },
  prompt: 'Which operation made this?',
  orders: {
    punch: 'The customer wants the sheet itself, with a hole this shape.', blank: 'The customer wants the shape that fell out; the sheet is thrown away.', fine: 'The customer wants a very flat part with smooth edges.',
    notch: 'A notch in the edge of the sheet, shaped like part of the punch.', perf: 'A large number of holes, close together, in one stroke.', slot: 'Rectangular holes in the sheet.',
    slit: 'Straight lines, and every strip is usable.', lance: 'Air louvers, without losing a gram of metal.', part: 'Parts from a strip, with a scrap piece between every two.',
    cutoff: 'Parts from a strip, with no scrap at all.', shave: 'A hair off the edge of a hole, for accuracy.', trim: 'Remove the excess around a drawn cup.',
    nibble: 'A big curved shape, with a small punch and overlapping hits.', emboss: 'Raised reinforcement ribs in the sheet.', coin: 'A different impression on each side.', shear: 'Cut a big sheet down to a smaller size.'
  },
  why: {
    punch: 'the hole is the product; the piece that fell out is waste.', blank: 'the blank that fell out is the product; the sheet is waste.', fine: 'an ejector from below: better flatness, smoother edges.',
    notch: 'punching the edge of the sheet.', perf: 'a close arrangement of a large number of holes, in one operation.', slot: 'rectangular holes.',
    slit: 'straight lines, no scrap.', lance: 'a partial cut, no material removed.', part: 'a punch with two cutting edges, scrap in between.',
    cutoff: 'one cut line, no scrap.', shave: 'minimal material, small die clearance: ±0.025 mm.', trim: 'excess material from the perimeter, like a flange.',
    nibble: 'small overlapping holes along a path.', emboss: 'hollows such as lettering or ribs; same contour, opposite direction.', coin: 'impressions on both sides.', shear: 'cutting to size out of a larger stock: a scissor-like action.'
  },
  wins: [[1, 'Not one mistake.', 'All 16 names are in your pocket.'], [.8, 'Strong.', 'A little more focus on the look-alike names.'], [.5, 'Not bad.', 'Go back to “14 operations on the sheet” and flip the cards.'], [0, 'Not yet.', 'The lesson is waiting for you. Then the trial.']]
};

export default [keepOrScrap(KEEP), setTheGap(GAP), nameTheCut(NAME)];
