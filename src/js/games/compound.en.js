// Trials — compound (English edition). Same ids as compound.js. Contract: docs/BRIEF.md § Trials. Engines: games/_compound-play.js.
import { which, label, spin } from './_compound-play.js';

const END = { result: 'Your score', again: 'Play again', back: 'All trials' };

const whichGame = which({
  title: 'Which process makes it?', en: 'Spin, flood or draw',
  how: 'A drawn product or a line from the slides, and three answers: spinning, hydroforming or deep drawing? 12 rounds; keys 1–3 answer.',
  procs: { spin: ['Spinning', ''], hydro: ['Hydroforming', ''], draw: ['Deep drawing', ''] },
  clue: 'Which process is this?',
  intro: { title: 'Which process makes it?', text: 'You’ll see a drawn product, or a line from the slides. Say which of the three processes it belongs to.', rules: ['Tap the process, or use keys 1–3.', 'Cups show up in spinning AND drawing: read the rest of the clue.', 'Every round is timed.'] },
  rounds: [
    ['spin', 'venturi', 'A venturi', 'The venturi is on the spinning products slide (L4 · S5).'],
    ['spin', 'hopper', 'A hopper', 'The hopper is a spinning product: a big cone.'],
    ['spin', 'tankhead', 'A tank head', 'The tank head is a spinning product.'],
    ['spin', 'trumpet', 'A trumpet base', 'The trumpet base is a spinning product.'],
    ['spin', 'urn', 'A funeral urn', 'The funeral urn is a spinning product.'],
    ['spin', 'flashing', 'A roof flashing', 'The roof flashing is a spinning product.'],
    ['spin', null, '“A flat disc turns on a lathe while a tool presses it onto a pattern”', 'That’s spinning: a blank on a lathe, a roller tool, a mandrel.'],
    ['spin', null, '“Hemisphere, cone, cylindrical shell”', 'Those are the basic spun shapes.'],
    ['hydro', 'rail', 'A car frame rail', 'The frame rail is the final product on the hydroforming slides (L4 · S11).'],
    ['hydro', 'bulge', 'A tube with a bulge', 'A tube blown up inside a die = tube hydroforming.'],
    ['hydro', null, '“Water pressure makes concave shapes a solid die can’t”', 'That’s hydroforming: water pressure and concavities.'],
    ['hydro', null, '“F axial pushes the ends while pressure P expands the tube”', 'That’s tube hydroforming (L4 · S9).'],
    ['hydro', null, '“Sheet steel is forced into a female cavity by water”', 'That’s sheet hydroforming (L4 · S10).'],
    ['hydro', null, '“Ideal for low to mid-range production”', 'Low to mid-range production = hydroforming.'],
    ['draw', 'can', 'A beverage can', 'Beverage cans are a deep drawing product.'],
    ['draw', 'panel', 'A car body panel', 'Automobile body panels = deep drawing.'],
    ['draw', 'sink', 'A double kitchen sink', 'The double sink appears with drawing (L4 · S17).'],
    ['draw', 'tray', 'A box-shaped tray', 'Box-shaped = drawing. Spinning only makes round things.'],
    ['draw', null, '“A blank holder grips the blank while the punch pushes it into the die”', 'That’s drawing: punch, die, blank holder.'],
    ['draw', null, '“Called deep to tell it apart from wire and bar drawing”', 'That’s deep drawing.']
  ]
});

const labelGame = label({
  ...END,
  title: 'Label the machines', en: 'Name every part',
  how: 'Two drawings: the spinning lathe and the deep drawing die. Pick a label, then tap its place on the drawing. 13 labels; number keys pick a place.',
  board: 'Drawing', score: 'Score', pin: 'Place', labels: 'Labels',
  boards: { lathe: ['The spinning lathe', 'spinning forming process'], die: ['The deep drawing die', 'drawing and deep drawing'] },
  ask: 'Pick a label, then tap its place on the drawing.', nowPin: 'Good. Now tap its place on the drawing.', nowChip: 'Good. Now pick the label for that place.',
  names: { head: 'Head stock', spindle: 'Spindle', mandrel: 'Mandrel', sheet: 'Sheet metal', clamp: 'Clamp', tail: 'Tail stock', roller: 'Roller tool', punch: 'Punch', holder: 'Blank holder', blank: 'Blank', die: 'Die', dforce: 'Drawing force', hforce: 'Holding force' },
  hints: { head: 'The heavy block on the left.', spindle: 'The turning shaft.', mandrel: 'The form the sheet lies on.', sheet: 'The disc being shaped.', clamp: 'Holds the sheet against the mandrel’s face.', tail: 'The block at the other end.', roller: 'The tool that pushes the sheet.', punch: 'Comes down and pushes the blank.', holder: 'Presses on the blank’s edges.', blank: 'The sheet itself.', die: 'The part below, with the opening.', dforce: 'The force on the punch.', hforce: 'The force on the holder.' },
  right: 'Right.', wrong: 'Nope.', notThat: n => `That’s not where the ${n} goes. Try another place.`,
  boardDone: 'Drawing complete. Here it is, fully labelled.', next: 'Next drawing', finish: 'See your score',
  lines: [['A draughtsman’s eye.', 'Every label in its place on the first try.'], ['Close.', 'A few labels got mixed up. Look at both finished drawings and try again.'], ['The labels are still lost.', 'Go back to “The spinning lathe” and “Punch, die and blank holder”.']]
});

const spinGame = spin({
  ...END,
  title: 'Spin it', en: 'Pick the mandrel, hold the roller',
  how: 'Each order is a round product. Mount the mandrel that gives its shape (hemisphere, cone or cylindrical shell), then hold the roller until the disc lies on it. 6 orders.',
  order: 'Order', score: 'Score', ordered: 'The order', lathe: 'The spinning lathe', pick: 'Which mandrel do you mount?',
  holdNow: 'Hold the roller until the sheet lies on the mandrel.', hold: 'Hold: the roller pushes', formed: 'Formed',
  shapes: { hemi: ['Hemisphere', ''], cone: ['Cone', ''], cyl: ['Cylindrical shell', ''] },
  products: { bowl: ['Bowl', ''], domecap: ['Domed end cap', ''], cone: ['Cone', ''], hopper: ['Hopper', ''], ferrule: ['Ferrule', ''], housing: ['Metal housing', ''], lid: ['Lid', ''] },
  right: 'Right.', wrong: 'Nope.', notShape: (s, p) => `A ${s.toLowerCase()} mandrel won’t give you a ${p.toLowerCase()}. Try again.`,
  why: { hemi: 'Hemisphere: one of the three basic spun shapes.', cone: 'Cone: one of the three basic spun shapes.', cyl: 'Cylindrical shell: one of the three basic spun shapes.' },
  made: p => `${p} done. Next order.`,
  lines: [['Master spinner.', 'Every mandrel right on the first try.'], ['Nice work.', 'Remember: bowl = hemisphere, hopper = cone, ferrule = cylindrical shell.'], ['The mandrels got mixed up.', 'Go back to “Spun shapes and products”.']]
});

export default [whichGame, labelGame, spinGame];
