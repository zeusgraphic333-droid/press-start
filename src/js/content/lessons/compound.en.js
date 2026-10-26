// Lesson — compound (English edition). Same chapters, ids, scenes, blocks, checks and demos as compound.js. House rules: docs/BRIEF.md.
// L4: compound bending — spinning, hydroforming (tube + sheet), drawing / deep drawing.
import { SHAPES, PROC, PRODUCTS, treeArt, latheArt, productsArt, profilesArt, solidArt, waterArt, railArt, femaleArt, maleArt, drawDieArt, stagesArt, blankCupArt } from './_compound-art.js';
import { spinDemo, tubeDemo, drawDemo } from './_compound-demos.js';

const W_SPIN = {
  label: 'A sheet disc spinning onto a mandrel', hold: 'Hold: the roller pushes', formed: 'Formed', wall: 'Wall thickness', wallSame: 'same as the disc', wallThin: 'thinner than the disc',
  start: 'A flat disc is mounted on the lathe. Press the button and keep holding it.',
  going: 'The disc spins, and the roller lays it down on the mandrel bit by bit.',
  paused: 'You let go, so the roller stopped. Keep going.',
  done: 'A cup: round in cross-section, with walls thinner than the original disc (<b>thickness of metal is reduced in the side of walls</b>).',
  reset: 'New disc'
};
const W_TUBE = {
  steps: 'Tube hydroforming steps', prev: 'Previous step', next: 'Next step', prevIcon: '←', nextIcon: '→',
  caps: ['The tube goes between the two halves of the open die.', 'The die closes on the tube, and its ends are sealed.', 'Fluid flows in and fills the tube.', 'The tube is completely full of fluid.', 'Axial forces (F axial) push the ends while pressure P inside expands the tube into the shape of the die.', 'The die opens and the part comes out.']
};
const W_DRAW = {
  label: 'Deep drawing: the punch pushes the blank into the die', stroke: 'Punch stroke',
  r0: 'The blank sits over the die cavity; the <b>blank holder</b> holds its edges.',
  r1: 'The punch pushes the metal into the opening. Watch the blank’s outer edge being pulled in.',
  r2: 'Done: the blank is now a <b>drawn part</b>, shaped like a cup.'
};

export default {
  zone: 'compound',
  hero: { say: 'Three ways to make something hollow from a flat sheet: spin it on a lathe, push it with water pressure, or draw it with a punch into a die.' },
  chapters: [
    {
      id: 'cp-family', title: 'Compound bending: three processes', en: 'Compound bending', ref: 'L4 · S2', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'usta', text: 'In Lecture 3 we bent sheet along a straight line. Today the sheet curves in several directions at once. That’s compound bending.' },
        { t: 'quote', ref: 'L4 · S2', text: 'Solid State Forming → Compound Bending · Moderate to High Cost → Spinning · Hydro-forming · Drawing', ar: 'Solid state forming → compound bending (moderate to high cost) → spinning, hydroforming, drawing.' },
        { t: 'art', html: treeArt(), caption: 'The whole tree from Lecture 3 (L3 · S6). The middle branch is today’s.' },
        { t: 'p', text: 'Compound bending is the second branch of **solid state forming**. Its cost is **moderate to high**: more than simple bending, less than stamping.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Spinning', en: 'on a lathe', art: PROC.spin, text: 'A disc spins on a lathe while a tool lays it onto a form.' },
          { title: 'Hydroforming', en: 'fluid forming', art: PROC.hydro, text: 'Water pressure shapes the sheet or the tube.' },
          { title: 'Drawing', en: 'deep drawing', art: PROC.draw, text: 'A punch pushes the blank into the die.' }
        ] },
        { t: 'check', q: 'cp01' },
        { t: 'trap', text: 'The costs get mixed up: simple = **low to moderate**. Compound = **moderate to high**. Stamping = **high**.', wrong: 'Compound bending: low to moderate cost', right: 'Compound bending: moderate to high cost' },
        { t: 'check', q: 'cp02' },
        { t: 'tip', text: 'Compound bending in three words: **spin, flood, draw**.' }
      ]
    },
    {
      id: 'cp-spin', title: 'Spinning: a disc becomes a cup', en: 'Spinning', ref: 'L4 · S3', scene: 'spinning',
      blocks: [
        { t: 'say', who: 'usta', text: 'Picture an aluminium disc spinning fast on a lathe, and a tool gently pushing it onto a form. The disc lies down on the form and takes its shape. That’s spinning.' },
        { t: 'quote', ref: 'L4 · S3', text: 'Spinning is commonly used to produce symmetrical, cup like shapes discs. · Metal spinning is a forming process that produces hollow parts that are typically circular in cross-section.', ar: 'Spinning makes symmetrical, cup-like shapes: hollow parts, usually round in cross-section.' },
        { t: 'p', text: 'Why round? Because everything turns around one axis. Anything shaped while it spins comes out round and symmetrical.' },
        { t: 'check', q: 'cp04' },
        { t: 'quote', ref: 'L4 · S3', text: 'The basic metal spinning process starts with a flat metal disc (blank), which rotates on a lathe. · A forming tool forces the metal sheet onto a wooden or metal pattern as it spins on a special lathe .', ar: 'A flat disc (the blank) turns on a lathe; a forming tool presses it onto a wooden or metal pattern.' },
        { t: 'demo', id: 'cmp-spin', title: 'Spin it', caption: 'Press the button and keep holding. The disc lies down on the mandrel bit by bit. Watch the wall thickness.', mount: spinDemo(W_SPIN) },
        { t: 'list', style: 'num', items: ['A flat disc (the **blank**) is mounted on the lathe.', 'It spins together with the form (the **mandrel**).', 'The forming tool (the **roller tool**) pushes it onto the mandrel.', 'Out comes a hollow, symmetrical part, round in cross-section.'] },
        { t: 'quote', ref: 'L4 · S3', text: 'The maximum diameter of cup at bottom of shape and then thickness of metal is reduced in the side of walls.', ar: 'The cup is widest at the base of the shape, and its side walls end up thinner.' },
        { t: 'why', text: 'The disc started wide and flat. Laying it onto a narrower form stretches the metal along the sides, so the walls come out thinner than the original disc.' },
        { t: 'trap', text: 'The slide’s last line, “Flow forming assignment report”, is **homework** (a report to write), not lesson content. And careful: **flow forming** is not **fluid forming**. Fluid forming is another name for **hydroforming**.', wrong: 'Flow forming = fluid forming (hydroforming)', right: 'Fluid forming = hydroforming · Flow forming = an assignment report' },
        { t: 'check', q: 'cp07' },
        { t: 'tip', text: 'Spinning = spin + form + roller. The disc turns, the roller pushes, the mandrel gives the shape.' }
      ]
    },
    {
      id: 'cp-lathe', title: 'The spinning lathe, part by part', en: 'The spinning lathe', ref: 'L4 · S4', scene: 'spinParts',
      blocks: [
        { t: 'say', who: 'usta', text: 'This slide is one drawing with seven words. Those seven can show up in the exam on a numbered drawing.' },
        { t: 'quote', ref: 'L4 · S4', text: 'spinning forming process — Head stock · Spindle · Mandrel · Sheet metal · Clamp · Tail stock · Roller tool', ar: 'Seven labels: head stock, spindle, mandrel, sheet metal, clamp, tail stock, roller tool.' },
        { t: 'art', html: latheArt('names'), caption: 'A new drawing of the same idea: half the sheet already lies on the mandrel, and the roller is still pushing from below.' },
        { t: 'list', style: 'dot', items: [
          '**Head stock**: the heavy block on the left. The turning comes from here.',
          '**Spindle**: the turning shaft that comes out of the head stock.',
          '**Mandrel**: the form. The sheet is shaped onto it. It’s the wooden or metal **pattern** from the previous slide.',
          '**Sheet metal**: the disc (the blank) being shaped.',
          '**Clamp**: holds the sheet against the face of the mandrel.',
          '**Tail stock**: the other end. It pushes the clamp so the sheet can’t move.',
          '**Roller tool**: the tool that pushes the sheet onto the mandrel.'
        ] },
        { t: 'check', q: 'cp09' },
        { t: 'trap', text: 'There is **no blank holder** on the spinning lathe. That belongs to deep drawing. In spinning, the **clamp** holds the sheet.', wrong: 'Spinning uses a blank holder', right: 'Spinning: clamp + tail stock · Deep drawing: blank holder' },
        { t: 'check', q: 'cp12' },
        { t: 'tip', text: 'Left to right: Head stock → Spindle → Mandrel → Sheet metal → Clamp → Tail stock. The Roller tool comes in from below.' }
      ]
    },
    {
      id: 'cp-shapes', title: 'Spun shapes and products', en: 'Spun shapes, products and profiles', ref: 'L4 · S3 · S5–S6', scene: 'spunShapes',
      blocks: [
        { t: 'say', who: 'usta', text: 'Everything spinning makes starts from one of three shapes. Then the slides show lots of products and profiles.' },
        { t: 'quote', ref: 'L4 · S3', text: 'The basic metal spun shapes are the hemisphere, cone, cylindrical shell.', ar: 'Three basic shapes: hemisphere, cone, cylindrical shell.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Hemisphere', en: 'half a ball', art: SHAPES.hemi, text: 'A bowl, a domed cover.' },
          { title: 'Cone', en: 'pointed', art: SHAPES.cone, text: 'A funnel, a hopper.' },
          { title: 'Cylindrical shell', en: 'a hollow can', art: SHAPES.cyl, text: 'A cap, a ferrule, a housing.' }
        ] },
        { t: 'check', q: 'cp13' },
        { t: 'h', text: 'Spinning products', en: 'Some of Spinning products example' },
        { t: 'quote', ref: 'L4 · S5', text: 'Some of Spinning products example: Ball · Bowl · Cap · Cone · Domed End Cap · Ferrule · Flag Base Stand · Funeral Urn · Garbage Lid · Hopper · Lid · Metal Housing · Recessed Lighting · Roof Flashing · Roof Drain · Spear Top · Tank Head · Trumpet Base · Vacuum Drum Head · Venturi', ar: 'Twenty products made by spinning: a ball, a bowl, a cap, a cone, a hopper, a tank head, a venturi…' },
        { t: 'art', html: productsArt([['bowl', 'Bowl'], ['cone', 'Cone'], ['hopper', 'Hopper'], ['venturi', 'Venturi'], ['tankhead', 'Tank head'], ['trumpet', 'Trumpet base'], ['lid', 'Lid'], ['urn', 'Funeral urn'], ['light', 'Recessed lighting'], ['flashing', 'Roof flashing'], ['ferrule', 'Ferrule'], ['housing', 'Metal housing']]), caption: 'New drawings of some of the slide’s products. Every one is round around an axis.' },
        { t: 'p', text: 'All of them are round and symmetrical around an axis: spinning’s signature. Look at the **venturi**: a tube that narrows in the middle and widens again. The **hopper**: a big funnel. The **tank head**: a domed tank end.' },
        { t: 'check', q: 'cp15' },
        { t: 'quote', ref: 'L4 · S6', text: 'Some of Spinning profiles example: Dished · Domed · Domed with flange · Flanged · Flanged and flued · Flanged, dished and flued · Flanged and dished · Hemisphere · Semi-elliptical · Tube cap · Trumpet', ar: 'Spun profiles: the shape of each part seen from the side.' },
        { t: 'art', html: profilesArt(), caption: 'A profile = the part cut through the middle and seen from the side. The dashed line is the spinning axis.' },
        { t: 'trap', text: 'A **box** is not a spun shape. “Box-shaped” is on the **drawing** slide. Spinning only makes round things.', wrong: 'Box is a basic spun shape', right: 'Hemisphere · cone · cylindrical shell' },
        { t: 'check', q: 'cp14' },
        { t: 'tip', text: 'Ball, funnel, can: **hemisphere, cone, cylindrical shell**.' }
      ]
    },
    {
      id: 'cp-hydro', title: 'Water does the pressing', en: 'Hydroforming (fluid forming)', ref: 'L4 · S8 · S12–S13', scene: 'hydro',
      blocks: [
        { t: 'say', who: 'usta', text: 'No solid die on both sides here. Water does the pushing.' },
        { t: 'quote', ref: 'L4 · S8', text: 'Hydroforming is an economical way to form malleable sheet into lightweight, structurally stiff, and strong compound shapes.', ar: 'An economical way to turn easy-to-shape sheet into light, stiff and strong compound shapes.' },
        { t: 'p', text: 'The slide gives its other name in brackets: **Fluid Forming**. And **malleable** sheet here means sheet that is easy to shape (remember **malleability**?).' },
        { t: 'quote', ref: 'L4 · S8', text: 'The process uses water pressure, which allows complex shapes with concavities to be formed; this would be difficult or impossible with standard solid die stamping.', ar: 'Water pressure makes complex shapes with concavities, which a solid die would struggle with or couldn’t make at all.' },
        { t: 'compare', left: { title: 'Solid die', en: 'Solid die stamping', art: solidArt(), text: 'The solid punch only goes in as wide as itself. The corners inside the cavity stay empty.' }, right: { title: 'Water pressure', en: 'Hydroforming', art: waterArt(), text: 'Water reaches every corner, so it pushes the sheet into every concavity.' }, note: '**Concavities** = hydroforming’s job.' },
        { t: 'check', q: 'cp21' },
        { t: 'why', text: 'Water has no shape of its own. It fills any space and pushes equally in every direction. That’s how it reaches places a solid die can’t.' },
        { t: 'quote', ref: 'L4 · S8', text: 'hydroforming an ideal process for low to mid-range production. · There are two types of Hydro forming. 1. Tube Hydro forming 2. Sheet Hydro forming', ar: 'Ideal for low to mid-range production. Two types: tube and sheet.' },
        { t: 'check', q: 'cp20' },
        { t: 'trap', text: 'Production here is **low to mid-range**. Don’t say **high production** (that’s edge bending, in Lecture 3).', wrong: 'Hydroforming is ideal for high production', right: 'Hydroforming is ideal for low to mid-range production' },
        { t: 'p', text: 'The next slides (L4 · S12–S13) show parts made this way: a cone-shaped part, cups and boxes, bent tubes, and a square tube with bulges. Plus a press in the factory, wet with water.' },
        { t: 'tip', text: '**Hydro** = water. Water, concavities, low to mid-range production, two types.' }
      ]
    },
    {
      id: 'cp-tube', title: 'A tube blown up inside a die', en: 'Tube hydroforming', ref: 'L4 · S9 · S11', scene: 'hydroTube',
      blocks: [
        { t: 'say', who: 'usta', text: 'Six steps, from a to f: the tube goes in, the die closes, fluid fills it, the pressure works, the part comes out.' },
        { t: 'quote', ref: 'L4 · S9', text: 'Tube Hydroforming — (a) … (f) · F axial · P', ar: 'Six stages in the figure, with an axial force F axial and a pressure P inside the tube.' },
        { t: 'demo', id: 'cmp-tube', title: 'Step by step', caption: 'Tap the letters a to f, or the arrows. The idea of the slide’s figure, one step at a time.', mount: tubeDemo(W_TUBE) },
        { t: 'list', style: 'num', items: ['(a) The tube goes between the two halves of the open die.', '(b) The die closes and the tube ends are sealed.', '(c–d) Fluid fills the tube.', '(e) Axial forces (**F axial**) push the ends while the pressure (**P**) inside expands the tube into the die’s shape.', '(f) The die opens and the part comes out.'] },
        { t: 'check', q: 'cp24' },
        { t: 'h', text: 'The car frame rail', en: 'Fig. Final Product' },
        { t: 'quote', ref: 'L4 · S11', text: 'Step 1 · Step 2 (DIE FORCE · WATER) · Step 3 · Fig. Final Product', ar: 'Three steps and a picture of the final product: a car frame rail.' },
        { t: 'art', html: railArt(), caption: 'A tube is bent (Step 1), closed in the die under force with water inside (Step 2), and comes out with a square section (Step 3).' },
        { t: 'p', text: 'The result is a car **frame rail**: one piece, light and stiff, exactly what the first hydroforming slide promised.' },
        { t: 'check', q: 'cp26' },
        { t: 'trap', text: '**F axial** pushes the **ends** of the tube from outside. **P** is the pressure **inside** the tube. Don’t swap them.', wrong: 'F axial is the pressure inside the tube', right: 'F axial pushes the tube ends · P is the pressure inside' },
        { t: 'tip', text: 'Tubes in five words: **place, close, fill, expand, remove**.' }
      ]
    },
    {
      id: 'cp-sheet', title: 'Sheet on a water cushion', en: 'Sheet hydroforming', ref: 'L4 · S10', scene: 'hydroSheet',
      blocks: [
        { t: 'say', who: 'usta', text: 'The second type: a flat sheet. Sometimes the water does the pushing; sometimes a punch pushes and the water pushes back.' },
        { t: 'quote', ref: 'L4 · S10', text: 'Sheet steel is forced into a female cavity by water under pressure from a pump or by press action', ar: 'Water under pressure (from a pump or from the press) forces the sheet into a female cavity.' },
        { t: 'quote', ref: 'L4 · S10', text: 'Sheet steel is deformed by a male punch, which acts against the fluid under pressure.', ar: 'Or a male punch shapes the sheet against fluid under pressure.' },
        { t: 'compare', left: { title: 'Water pushes', en: 'into a female cavity', art: femaleArt(), text: 'Pressurized water above pushes the sheet down into the cavity.' }, right: { title: 'The punch pushes', en: 'male punch vs fluid', art: maleArt(), text: 'The punch pushes the sheet, and the pressurized fluid beneath resists and supports it.' }, note: '**Female** = a cavity. **Male** = a punch that sticks out.' },
        { t: 'why', text: 'Either way, only one half is solid (a cavity or a punch); the other half is fluid. So instead of a solid die on both sides, you only make one half.' },
        { t: 'trap', text: '**Female** = the cavity (the hollow). **Male** = the punch (the bump). You’ll meet the same two words again in Lecture 5, with embossing.', wrong: 'Water forces the sheet into a male cavity', right: 'Water → female cavity · Male punch → against the fluid' },
        { t: 'check', q: 'cp27' },
        { t: 'check', q: 'cp28' },
        { t: 'tip', text: '“Water pushes it into the hollow, or the punch pushes it into the water.”' }
      ]
    },
    {
      id: 'cp-draw', title: 'Punch, die and blank holder', en: 'Drawing and deep drawing', ref: 'L4 · S14–S15', scene: 'drawing',
      blocks: [
        { t: 'say', who: 'usta', text: 'Drawing is the famous one. The can in your hand was made like this.' },
        { t: 'quote', ref: 'L4 · S14', text: 'Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved, hollow-shaped parts · Sheet metal blank is positioned over die cavity and then punch pushes metal into opening', ar: 'Sheet forming for hollow parts (cups, boxes, complex curves): the blank sits over the die cavity and the punch pushes it in.' },
        { t: 'check', q: 'cp29' },
        { t: 'demo', id: 'cmp-draw', title: 'Bring the punch down', caption: 'Move the slider. The punch comes down and draws the blank into the die while the holder grips the edges.', mount: drawDemo(W_DRAW) },
        { t: 'quote', ref: 'L4 · S15', text: 'Drawing force · Holding force · Punch · Blank · Blank holder · Die', ar: 'Two forces and four parts.' },
        { t: 'art', html: drawDieArt(.5, 'names'), caption: 'Halfway through the stroke: the punch is going down, the holder presses the edges.' },
        { t: 'list', style: 'dot', items: ['**Punch**: comes down and pushes the blank.', '**Die**: the part below, with the opening (the **die cavity**).', '**Blank**: the flat sheet disc.', '**Blank holder**: presses on the blank’s edges.', '**Drawing force**: the force on the punch.', '**Holding force**: the force on the holder.'] },
        { t: 'why', text: 'The slide doesn’t explain the holder. The simple idea: if the blank’s edges were loose on their way into the die, they would wrinkle. The holder presses them, so they slide in smoothly.' },
        { t: 'trap', text: '**Drawing force** is on the **punch**. **Holding force** is on the **holder**. Questions love to swap them.', wrong: 'Holding force pushes the punch', right: 'Drawing force → punch · Holding force → blank holder' },
        { t: 'check', q: 'cp31' },
        { t: 'tip', text: 'Drawing in three moves: place the blank, hold it, bring the punch down.' }
      ]
    },
    {
      id: 'cp-drawsteps', title: 'From blank to can', en: 'From blank to drawn part', ref: 'L4 · S14 · S16–S17', scene: 'drawSteps',
      blocks: [
        { t: 'say', who: 'usta', text: 'A flat disc, and after one stroke it’s a cup. Magic? No. A punch and a die.' },
        { t: 'quote', ref: 'L4 · S16', text: 'Drawing force · Blank → Drawn part', ar: 'The blank becomes a drawn part.' },
        { t: 'art', html: stagesArt(['Start', 'Mid-stroke', 'End of stroke']), caption: 'Three snapshots of one stroke (L4 · S16): the outer edge is pulled in until none is left.' },
        { t: 'art', html: blankCupArt(), caption: 'From a flat disc (**Blank**) to a cup (**Drawn part**).' },
        { t: 'quote', ref: 'L4 · S14', text: 'Products: beverage cans, automobile body panels', ar: 'Cans and car body panels.' },
        { t: 'grid', cols: 4, items: [
          { title: 'Beverage can', en: 'beverage cans', art: PRODUCTS.can },
          { title: 'Car body panel', en: 'automobile body panels', art: PRODUCTS.panel },
          { title: 'Drawn cup', en: 'on L4 · S17', art: PRODUCTS.cup },
          { title: 'Double sink', en: 'on L4 · S17', art: PRODUCTS.sink }
        ] },
        { t: 'check', q: 'cp34' },
        { t: 'quote', ref: 'L4 · S14', text: 'Also known as deep drawing (to distinguish it from wire and bar drawing)', ar: 'Also called deep drawing, to tell it apart from wire and bar drawing.' },
        { t: 'p', text: '**Wire drawing** means pulling a wire through a hole smaller than itself so it gets thinner. Something else entirely. That’s why we say **deep drawing** when we mean sheet.' },
        { t: 'trap', text: 'Same word, different process: **deep drawing** = sheet drawn into a cup. **Wire and bar drawing** = pulling wire and bars thinner.', wrong: 'Deep drawing is wire and bar drawing', right: 'Deep drawing (sheet) is named to distinguish it from wire and bar drawing' },
        { t: 'check', q: 'cp35' },
        { t: 'tip', text: 'Can, car door, kitchen sink = **deep drawing**.' }
      ]
    },
    {
      id: 'cp-which', title: 'Who makes what?', en: 'Spin, flood or draw?', ref: 'L4 · S2–S17', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'press', text: 'I’m The Press. I’ll give you a product, and you tell me how it was made. Ready?' },
        { t: 'quote', ref: 'L4 · S3 · S14', text: 'Spinning is commonly used to produce symmetrical, cup like shapes discs. · Drawing: Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved, hollow-shaped parts', ar: 'The cup shows up in spinning and in drawing. The tool tells them apart.' },
        { t: 'table', head: ['Process', 'What pushes the sheet?', 'Slide words', 'Products'], rows: [
          ['Spinning', 'A roller, while the disc spins on a lathe', 'blank · lathe · mandrel · roller tool · clamp', 'venturi · hopper · tank head · bowl'],
          ['Hydroforming', 'Water pressure', 'tube · sheet · F axial · P · female cavity · male punch', 'car frame rail · shapes with concavities'],
          ['Deep drawing', 'A punch, into a die', 'blank · die cavity · punch · blank holder', 'beverage cans · car body panels · sinks']
        ] },
        { t: 'check', q: 'cp37' },
        { t: 'trap', text: '“Cup” appears in spinning AND in drawing. Read the rest: lathe and roller = **spinning**. Punch, die and box-shaped = **drawing**.', wrong: 'Cup-shaped → always deep drawing', right: 'Lathe + roller tool → spinning · Punch + die → drawing' },
        { t: 'check', q: 'cp38' },
        { t: 'tip', text: 'Ask one question: what pushes the sheet? A roller = **spinning**. Water = **hydroforming**. A punch into a die = **drawing**.' }
      ]
    }
  ]
};
