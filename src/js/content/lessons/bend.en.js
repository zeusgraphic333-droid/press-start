// Lesson — bend (English edition). Same chapters, ids, scenes, block order, checks, figures and demos as bend.js.
// House rules: docs/BRIEF.md · drawings: data/figs/bend.js · demos: ./_bend-demos.js.
import { ART, ICON } from '../../data/figs/bend.js';
import { mountUnfold, mountK, mountSpring } from './_bend-demos.js';

export default {
  zone: 'bend',
  hero: { say: 'The biggest lecture in the course. But it’s really one idea: bend the sheet to the right size, without cracking it, and without it springing back. Let’s go to the workshop.' },
  chapters: [
    {
      id: 'bd-forming', title: 'Metal, shaped while solid', en: 'Metal forming → solid state forming', ref: 'L3 · S2–S3', scene: 'formingStates',
      blocks: [
        { t: 'say', who: 'usta', text: 'Metal can be shaped more than one way. Molten, or soft. Today we work on it while it’s completely solid.' },
        { t: 'quote', text: 'Metal Forming → Liquid State Forming · Fluid State Forming · Plastic State Forming · Solid State Forming', ref: 'L3 · S2' },
        { t: 'art', html: ART['bd-states'](), caption: 'The slide’s tree: four states. This whole lecture lives in the fourth, <en>Solid State Forming</en>.' },
        { t: 'p', text: 'The slide only gives the names. The idea is simple: in the solid state the metal doesn’t melt and doesn’t go soft. You shape it as a solid piece, by force.' },
        { t: 'check', q: 'bd04' },
        { t: 'quote', text: 'Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working', ref: 'L3 · S3' },
        { t: 'grid', cols: 4, items: [
          { title: 'Sheet', text: 'A thin flat piece.', art: ICON.form('sheet') },
          { title: 'Rod', text: 'A solid bar.', art: ICON.form('rod') },
          { title: 'Wire', text: 'A very thin rod.', art: ICON.form('wire') },
          { title: 'Tube', text: 'Hollow inside.', art: ICON.form('tube') }
        ] },
        { t: 'p', text: '**Cold working** means shaping the metal while it’s cold, at room temperature. No furnace.' },
        { t: 'check', q: 'bd01' },
        { t: 'h', text: 'When do you heat it?', en: 'When heating is needed' },
        { t: 'quote', text: 'In some cases, heating the metal may be required if it is thick, is not very ductile, or becomes work-hardened during forming.', ref: 'L3 · S3' },
        { t: 'list', style: 'check', items: ['**Thick**: it needs a lot of force, and heat makes it easier.', '**Not very ductile**: it can’t take much stretching, so it may crack.', '**Work-hardened during forming**: the more you bend it, the stiffer it gets.'] },
        { t: 'quote', text: 'During the forming process, some metals can become brittle and may require annealing before the forming operation is continued.', ref: 'L3 · S3' },
        { t: 'example', title: 'The paper clip', text: 'Bend a paper clip back and forth. The first few times it’s easy. Then it gets stiff. In the end it snaps. That’s what the slide calls **work-hardened**, then **brittle**. In the factory, before it gets that far, they **anneal** it.' },
        { t: 'why', text: '**Annealing** is a heat treatment: you heat the metal and let it cool slowly, so it goes soft again and can take more forming. (General background: the slide only names it.)' },
        { t: 'trap', text: 'A true/false question says solid state forming needs heat. **False**.', wrong: 'Solid state forming always needs heating', right: 'usually performed as cold working · heating only in some cases' },
        { t: 'check', q: 'bd03' },
        { t: 'tip', text: 'Cold by default. Heat it if it’s thick, not very ductile, or work-hardened. If it turns brittle: anneal.' }
      ]
    },
    {
      id: 'bd-gauge', title: 'Foil, sheet or plate?', en: 'Three names, one rule: thickness', ref: 'L3 · S3', scene: 'sheetGauge',
      blocks: [
        { t: 'say', who: 'caliper', text: 'Foil, sheet and plate aren’t different metals. The only difference is the thickness.' },
        { t: 'quote', text: 'A piece of metal whose thickness is between 0.006(0.15 mm) and 0.25 inches(6.35 mm) called sheet metal. Anything thinner is referred to as a foil and thicker is considered as a plate.', ref: 'L3 · S3' },
        { t: 'art', html: ART['bd-gauge'](), caption: 'Same metal, three names. The limits: 0.15 mm and 6.35 mm.' },
        { t: 'p', text: 'Watch the numbers. The slide writes 0.006 with no unit; it means **inches**. 0.006 in = 0.15 mm, and 0.25 in (a quarter inch) = 6.35 mm.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'Foil', text: 'Thinner than 0.15 mm. Like the aluminium foil you wrap food in.', color: 'var(--ink-3)' },
          { title: 'Sheet metal', text: 'From 0.15 to 6.35 mm. A car door, a cooking pot, a computer case.', color: 'var(--zc)' },
          { title: 'Plate', text: 'Thicker than 6.35 mm. A heavy machine base, or a ship’s hull.', color: 'var(--hot)' }
        ] },
        { t: 'check', q: 'bd05' },
        { t: 'trap', text: 'The classic slip: swapping inches and millimetres. The limits are **0.15 mm and 6.35 mm**, which is **0.006 in and 0.25 in**.', wrong: 'Sheet metal: 0.15 – 6.35 inches', right: '0.006 – 0.25 in = 0.15 – 6.35 mm' },
        { t: 'why', text: 'Why does thickness matter? It changes everything: the force you need, the tooling, sometimes whether you must heat it. Remember? “If it is thick” was the first reason to heat.' },
        { t: 'check', q: 'bd06' },
        { t: 'tip', text: 'Under 0.15 = foil. 0.15 to 6.35 = sheet. Over 6.35 = plate. And 6.35 mm is exactly a quarter inch.' }
      ]
    },
    {
      id: 'bd-shop', title: 'Sheet is everywhere, and the shop has its own words', en: 'Products, terms and metal shapes', ref: 'L3 · S4–S5', scene: 'stamping',
      blocks: [
        { t: 'say', who: 'usta', text: 'Look around: the car, the fridge, the office cabinet. All sheet metal. And walk into the workshop, you’ll hear three words a lot.' },
        { t: 'quote', text: 'Sheet and plate metal parts for consumer and industrial products such as: Automobiles and trucks · Airplanes · Railway cars and locomotives · Farm and construction equipment · Small and large appliances · Office furniture · Computers and office equipment', ref: 'L3 · S4' },
        { t: 'grid', cols: 4, items: [
          { title: 'Automobiles and trucks', art: ICON.product('car') },
          { title: 'Airplanes', art: ICON.product('plane') },
          { title: 'Railway cars and locomotives', art: ICON.product('train') },
          { title: 'Farm and construction equipment', art: ICON.product('tractor') },
          { title: 'Small and large appliances', art: ICON.product('fridge') },
          { title: 'Office furniture', art: ICON.product('cabinet') },
          { title: 'Computers and office equipment', art: ICON.product('computer') }
        ] },
        { t: 'check', q: 'bd10' },
        { t: 'h', text: 'The three shop words', en: 'Sheet metalworking terminology' },
        { t: 'quote', text: 'Punch-and-die - tooling to perform cutting, bending, and drawing · Stamping press - machine tool that performs most sheet metal operations · Stampings - sheet metal products', ref: 'L3 · S4' },
        { t: 'art', html: ART['bd-press'](), caption: 'The press (the machine) holds the punch and die (the tooling), and out come the stampings (the products).' },
        { t: 'table', head: ['Word', 'What it is', 'What it does'], rows: [
          ['Punch-and-die', 'tooling', 'cutting, bending, drawing'],
          ['Stamping press', 'machine tool', 'most sheet metal operations'],
          ['Stampings', 'products', 'the parts made from the sheet']
        ] },
        { t: 'check', q: 'bd08' },
        { t: 'trap', text: '**Stamping press** and **stampings** look alike. The first is the **machine**, the second the **products**.', wrong: 'Stampings = the machine tool', right: 'Stamping press = machine tool · Stampings = sheet metal products' },
        { scene: 'stockShapes', t: 'h', text: 'Stock comes in shapes', en: 'Metal shape' },
        { t: 'quote', text: 'Metal can be provided in various shapes and sizes.', ref: 'L3 · S5' },
        { t: 'grid', cols: 4, items: [
          { title: 'Round Solid', art: ICON.shape('roundS') },
          { title: 'Square Solid', art: ICON.shape('squareS') },
          { title: 'Hexagonal Solid', art: ICON.shape('hexS') },
          { title: 'Angle Iron Solid', art: ICON.shape('angleS') },
          { title: 'Round Hollow (Tube)', art: ICON.shape('roundH') },
          { title: 'Square Hollow (Box Iron)', art: ICON.shape('squareH') },
          { title: 'Hexagonal Hollow', art: ICON.shape('hexH') },
          { title: 'Angle Iron Hollow', art: ICON.shape('angleH') }
        ] },
        { t: 'check', q: 'bd11' },
        { t: 'tip', text: 'Press = machine. Punch-and-die = tooling. Stampings = products. And among the shapes: a **tube** is a round hollow, **box iron** a square hollow.' }
      ]
    },
    {
      id: 'bd-tree', title: 'Three branches, three price tags', en: 'Solid state forming and its cost', ref: 'L3 · S6', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'press', text: 'The more complex the process, the bigger the bill. This slide tells you the price of each branch.' },
        { t: 'quote', text: 'Solid State Forming → Simple Bending (Low to Moderate Cost): Bend · Roll · Continuous Roll Forming | Compound Bending (Moderate to High Cost): Spinning · Hydro-forming · Drawing | Form and Cut (Stamping) (High Cost): Progressive · Transfer Dies · Multiple Action Dies', ref: 'L3 · S6' },
        { t: 'art', html: ART['bd-tree'](), caption: 'This lecture = the first branch. Lecture 4 = the second.' },
        { t: 'table', head: ['Branch', 'Cost', 'What’s in it'], rows: [
          ['Simple Bending', 'Low to Moderate', 'Bend · Roll · Continuous Roll Forming'],
          ['Compound Bending', 'Moderate to High', 'Spinning · Hydro-forming · Drawing'],
          ['Form and Cut (Stamping)', 'High', 'Progressive · Transfer Dies · Multiple Action Dies']
        ] },
        { t: 'check', q: 'bd12' },
        { t: 'why', text: 'Why is stamping the most expensive? Its tooling forms and cuts, so it gets complex. The slide only names the die types: **Progressive**, **Transfer Dies** and **Multiple Action Dies**. Learn the names; there are no definitions to learn.' },
        { t: 'trap', text: '**Continuous Roll Forming** has a big name, but it sits under **Simple Bending**. And **Drawing** is under **Compound**, not Simple.', wrong: 'Continuous Roll Forming = Compound Bending', right: 'Simple Bending: Bend · Roll · Continuous Roll Forming' },
        { t: 'check', q: 'bd13' },
        { t: 'tip', text: 'Low to moderate: bend, roll, continuous. Moderate to high: spinning, hydro, drawing. High: progressive, transfer, multiple action.' }
      ]
    },
    {
      id: 'bd-neutral', title: 'Outside stretches, inside squeezes', en: 'Sheet metal bending and the neutral plane', ref: 'L3 · S7–S8', scene: 'neutralAxis',
      blocks: [
        { t: 'say', who: 'usta', text: 'Bend a plastic ruler. The outside face stretches, the inside face gets squeezed. And in the middle there’s a line that feels nothing.' },
        { t: 'quote', text: 'Bending is a metal forming process in which a force is applied to a piece of sheet metal, causing it to bend at an angle and form the desired shape.', ref: 'L3 · S7' },
        { t: 'check', q: 'bd15' },
        { t: 'quote', text: 'Metal on inside of neutral plane is compressed, while metal on outside of neutral plane is stretched · Figure (b) both compression and tensile elongation of the metal occur in bending.', ref: 'L3 · S7' },
        { t: 'art', html: ART['bd-neutral'](), caption: 'Orange is stretched (tension). Purple is squeezed (compression). The dashed line is the neutral axis: its length doesn’t change.' },
        { t: 'compare', left: { title: 'Inside the bend', en: 'compression', text: 'The metal is squeezed: **compressed**.' }, right: { title: 'Outside the bend', en: 'tension', text: 'The metal is pulled: **stretched**.' }, note: 'Between them: the neutral axis, neither squeezed nor stretched.' },
        { t: 'check', q: 'bd16' },
        { t: 'why', text: 'The outside face travels round a bigger curve, so it has to get longer. The inside travels round a smaller one, so it has to get shorter. In the middle sits a line whose length stays the same: the neutral axis. Lecture 2 said it too: <en>outside fibers in tension, inside fibers in compression</en>.' },
        { t: 'example', title: 'The phone stand', text: 'A phone stand made of bent sheet. If the bend is too sharp, the outside face can crack from all that stretching. That’s why there’s a thing called **bend radius**; we’ll meet it soon.' },
        { t: 'trap', text: 'The exam may flip it on you.', wrong: 'Inside is stretched, outside is compressed', right: 'Inside of neutral plane: compressed · outside: stretched' },
        { t: 'check', q: 'bd17' },
        { t: 'tip', text: 'Inside = compression. Outside = tension. Middle = neutral axis, fixed length. That’s the line the flat length is measured on.' }
      ]
    },
    {
      id: 'bd-flat', title: 'The flat length: BA or BD?', en: 'Bend allowance, bend deduction and the flat length', ref: 'L3 · S9–S10', scene: 'flatLength',
      blocks: [
        { t: 'say', who: 'usta', text: 'Before you bend, you cut the blank to the right length. Too long? The leg comes out long. Too short? The part is scrap.' },
        { t: 'quote', text: 'SHEET METAL PARAMETERS: Bend Allowance · Bend Deductions · K-Factor · Bend Relief · Thickness · Bend Radius · Spring Back', ref: 'L3 · S9' },
        { t: 'list', style: 'num', items: ['**Bend Allowance**: this chapter.', '**Bend Deductions**: this chapter too.', '**K-Factor**: the next chapter.', '**Bend Relief**: the relief cut.', '**Thickness**: remember foil, sheet and plate?', '**Bend Radius**: the inside radius.', '**Spring Back**: the part opening up.'] },
        { t: 'check', q: 'bd18' },
        { t: 'quote', text: 'BEND ALLOWANCES — length of neutral axis in bend area. Bend allowances are calculated using a K-factor', ref: 'L3 · S9' },
        { t: 'p', text: 'So **BA** is the length of the arc in the bend, measured along the neutral axis. Why the neutral axis? Because it’s the only line whose length doesn’t change.' },
        { t: 'check', q: 'bd19' },
        { t: 'h', text: 'Two formulas for the same part', en: 'Lt = A + B + BA · Lt = A + B − BD' },
        { t: 'quote', text: 'Lt = A + B + BA — where: Lt is the total flat length · A and B are shown in the illustration · BA is the bend allowance value  ·  Lt = A + B − BD — BD is the bend deduction value', ref: 'L3 · S10' },
        { t: 'fig', id: 'bd-flat', caption: 'Look at where A and B stop in each drawing.' },
        { t: 'list', style: 'dot', items: ['In the **BA** drawing, A and B stop **where the bend starts**. The bend itself isn’t counted, **so you add it** (+BA).', 'In the **BD** drawing, A and B run **to the outside corner**, where the outer lines would meet. You counted a bit extra, **so you take it off** (−BD).'] },
        { t: 'demo', id: 'bd-unfold', title: 'Unfold the part, and switch how it’s measured', caption: 'Same part: once with A and B to the bend, once to the corner. The numbers change; the flat length stays 76 mm.', mount: mountUnfold },
        { t: 'check', q: 'bd20' },
        { t: 'trap', text: 'Two famous slips: adding BD, or subtracting BA.', wrong: 'Lt = A + B − BA', right: 'Lt = A + B + BA · Lt = A + B − BD' },
        { t: 'check', q: 'bd23' },
        { t: 'tip', text: '**Allowance** = something extra you allow, so add it (+). **Deduction** = something you deduct, so subtract it (−).' }
      ]
    },
    {
      id: 'bd-kfactor', title: 'The K-factor: where exactly is the axis?', en: 'The K-factor', ref: 'L3 · S11', scene: 'kFactor',
      blocks: [
        { t: 'say', who: 'caliper', text: 'The neutral axis doesn’t have to sit in the middle of the thickness. The K-factor tells you where it is.' },
        { t: 'quote', text: 'K-factor is a ratio that represents the location of the neutral sheet with respect to the thickness of the sheet metal part.', ref: 'L3 · S11' },
        { t: 'fig', id: 'bd-kf', caption: '<en>K Factor = t / T</en>. t runs from the inside surface to the axis. T is the whole thickness.' },
        { t: 'p', text: '**T** is the whole sheet thickness. **t** is the distance from the surface on the inside of the bend to the neutral axis. Divide the small one by the big one: <en>K = t / T</en>.' },
        { t: 'demo', id: 'bd-k', title: 'Move the axis through the thickness', caption: 'Notice: the further out the axis sits, the longer its arc, so the bigger the BA.', mount: mountK },
        { t: 'check', q: 'bd24' },
        { t: 'example', title: 'With numbers', text: 'A sheet <en>T = 2 mm</en> thick. The axis is <en>t = 0.8 mm</en> from the inside. So <en>K = 0.8 ÷ 2 = 0.4</en>: the axis sits 40% of the way through the thickness, from the inside.' },
        { t: 'check', q: 'bd26' },
        { t: 'why', text: 'Why care? Because the **bend allowance** is the length of the neutral axis in the bend. Move the axis outward and the arc gets longer; inward and it gets shorter. That’s why the slide says: <en>Bend allowances are calculated using a K-factor</en>.' },
        { t: 'check', q: 'bd25' },
        { t: 'trap', text: 'Mind the order: the small one goes on top.', wrong: 'K = T / t', right: 'K = t / T (t: inside surface → neutral axis · T: thickness)' },
        { t: 'tip', text: '<en>K = t / T</en>: small over big. Need t? Multiply: <en>t = K × T</en>.' }
      ]
    },
    {
      id: 'bd-relief', title: 'The relief cut', en: 'Bend relief (auto relief)', ref: 'L3 · S12', scene: 'relief',
      blocks: [
        { t: 'say', who: 'usta', text: 'Bend part of an edge while the bit next to it stays flat, and the corner pulls and tears wherever it likes. The fix: a small, planned cut before you bend.' },
        { t: 'quote', text: 'The size and shape of the relief cut is much important for sheet metal bending. However, Sheet metal process relief is most important for the accurate bending.', ref: 'L3 · S12' },
        { t: 'art', html: ART['bd-relief'](), caption: '<en>Fig.5 auto relief types</en>: the purple flange is bent up, and the relief (circled) sits where it stops.' },
        { t: 'grid', cols: 3, items: [
          { title: 'A) Tear-rip', text: 'Just a straight cut. The flange separates from the rest without removing any metal.' },
          { title: 'B) Obround', text: 'A small slot with a rounded end, at the end of the bend line.' },
          { title: 'C) Rectangle', text: 'A small rectangular slot, at the end of the bend line.' }
        ] },
        { t: 'check', q: 'bd28' },
        { t: 'quote', text: 'For rectangle and ob-round reliefs, The size can be determine by ratio to the material thickness, or values can be specified for width and depth.', ref: 'L3 · S12' },
        { t: 'p', text: 'So the slot’s size is set one of two ways: as a ratio of the thickness, or as plain numbers for width and depth. (The slide writes “determine”; it means “determined”.)' },
        { t: 'check', q: 'bd30' },
        { t: 'why', text: 'Without relief, the metal at the end of the bend has nowhere to go. It tears, bulges, or the bend comes out crooked. The cut gives it room, so the bend comes out **accurate**.' },
        { t: 'trap', text: 'There are **only three** types. And the “ratio to the thickness” rule is stated for rectangle and obround.', wrong: 'Triangle relief · Circle relief', right: 'A) Tear-rip · B) Obround · C) Rectangle' },
        { t: 'check', q: 'bd31' },
        { t: 'tip', text: 'Three: **tear-rip** (a cut), **obround** (a round-ended slot), **rectangle** (a square-ended slot).' }
      ]
    },
    {
      id: 'bd-radius', title: 'The bend radius', en: 'Bend radius', ref: 'L3 · S13', scene: 'bendRadius',
      blocks: [
        { t: 'say', who: 'usta', text: 'Fold a garden hose sharply and it kinks shut. Sheet metal has a limit too, and you can’t go below it.' },
        { t: 'quote', text: 'Inside curvature, is the minimum radius one can bend a pipe, tube, sheet, cable or hose Without kinking it, damaging it, or shortening its life.', ref: 'L3 · S13' },
        { t: 'fig', id: 'bd-radius', caption: 'The slide’s figure: every name on its part.' },
        { t: 'list', style: 'dot', items: ['**Bend radius, R**: the radius on the **inside** of the bend.', '**Bend allowance L<sub>b</sub>**: the length of the arc along the neutral axis.', '**Neutral axis**: the dashed line; its length stays the same.', '**t**: the sheet thickness.', '**Length of bend L**: the width of the sheet along the bend line (seen in the side view).', '**Setback**: from where the bend starts to the outside corner.', '**Bend angle** and **bevel angle**: two angles marked on the bend. The α at the centre is how far the sheet turned.'] },
        { t: 'check', q: 'bd32' },
        { t: 'why', text: 'If the radius is too small, the outside face is stretched too far (remember tension?). It cracks, or a tube flattens. That’s why there’s a **minimum**.' },
        { t: 'example', title: 'The charger cable', text: 'Bend a charger cable sharply at the plug every day and it breaks in a few months. Let it curve gently and it lasts for years. That’s exactly <en>shortening its life</en>.' },
        { t: 'trap', text: 'The bend radius is measured on the **inside** of the bend, and it’s the **smallest** radius allowed.', wrong: 'Bend radius = the outside curvature', right: 'Inside curvature · the minimum radius without kinking, damaging, or shortening its life' },
        { t: 'check', q: 'bd33' },
        { t: 'tip', text: 'The key words: <en>minimum · inside curvature · without kinking, damaging, or shortening its life</en>.' }
      ]
    },
    {
      id: 'bd-vbend', title: 'V-bending', en: 'V-bending and air bending', ref: 'L3 · S14 · S17–S18', scene: 'vBend',
      blocks: [
        { t: 'say', who: 'usta', text: 'The simplest tooling in the world: a die with a V-shaped groove, and a punch that comes down in the middle. The sheet is pushed in and comes out bent.' },
        { t: 'quote', text: 'V-bending - performed with a V-shaped die · For low production · Performed on a press brake · V-dies are simple and inexpensive', ref: 'L3 · S14' },
        { t: 'fig', id: 'bd-vbend', caption: '(1) The punch above the sheet. (2) The punch is down and the sheet is bent into a V.' },
        { t: 'p', text: 'A **press brake** is a wide machine: a long punch on top, a long die below. It bends whole sheets. Slide 17 shows someone bending a sheet on one; slide 18 is a chart of many punch and die shapes.' },
        { t: 'check', q: 'bd34' },
        { scene: 'airBend', t: 'h', text: 'Bending in the air', en: 'Air bending vs bottoming' },
        { t: 'quote', text: 'Air bending: If the punch does not force the sheet to the bottom of the die cavity, leaving space or air underneath, it is called "air bending".', ref: 'L3 · S14' },
        { t: 'fig', id: 'bd-air', caption: 'The same V-die. The difference: where the punch stops.' },
        { t: 'compare', left: { title: 'Air Bending', text: 'The punch stops before the bottom. There’s air under the sheet.' }, right: { title: 'Bottoming', text: 'The punch pushes the sheet down until it sits on the bottom of the die (as the figure shows).' } },
        { t: 'check', q: 'bd36' },
        { t: 'why', text: 'Why is a V-die cheap? It’s just a V-shaped groove, and the same die makes lots of different parts. So you don’t pay for special tooling for every part, which suits small quantities.' },
        { t: 'trap', text: 'A question may say “high production” and offer V-bending as an option.', wrong: 'V-bending: high production, complicated dies', right: 'V-bending: low production · press brake · simple and inexpensive dies' },
        { t: 'tip', text: 'V = simple, cheap dies + small quantities + a press brake. And if the punch stops short of the bottom: air bending.' }
      ]
    },
    {
      id: 'bd-edge', title: 'Edge bending', en: 'Edge bending', ref: 'L3 · S15', scene: 'edgeBend',
      blocks: [
        { t: 'say', who: 'press', text: 'Making thousands of parts a day? The V-die can’t keep up. That’s where edge bending comes in.' },
        { t: 'quote', text: 'Edge Bending · For high production · Pressure pad required · Dies are more complicated and costly', ref: 'L3 · S15' },
        { t: 'fig', id: 'bd-edge', caption: '(1) The pressure pad holds the sheet on the die with force <en>Fh</en>. (2) The punch comes down with force <en>F</en> and bends the edge that sticks out.' },
        { t: 'p', text: 'The sheet sits on the die with its edge sticking out. The pressure pad presses the sheet down and holds it. The punch comes down beside the die and bends the edge down.' },
        { t: 'check', q: 'bd39' },
        { t: 'compare', left: { title: 'V-bending', text: 'Low production. On a press brake. Simple, inexpensive dies.' }, right: { title: 'Edge bending', text: 'High production. Pressure pad required. More complicated, costly dies.' }, note: 'The difference is in three things: the quantity, the pressure pad, and the cost of the dies.' },
        { t: 'why', text: 'Why the pressure pad? As the punch pushes the edge, the sheet could slide or lift. The pad holds it in place, so every part comes out the same.' },
        { t: 'trap', text: 'The two lines get swapped: “simple and inexpensive” belongs to V. “More complicated and costly” belongs to edge bending.', wrong: 'Edge bending dies are simple and inexpensive', right: 'Edge bending: dies are more complicated and costly' },
        { t: 'check', q: 'bd37' },
        { t: 'tip', text: 'Edge = lots of parts + pressure pad + costly dies. V = the opposite.' }
      ]
    },
    {
      id: 'bd-springback', title: 'The sheet springs back a little', en: 'Springback', ref: 'L3 · S16', scene: 'springback',
      blocks: [
        { t: 'say', who: 'spring', text: 'Bend a steel ruler to 90° and let go. It comes back a little. That’s springback, the bending shop’s number one enemy.' },
        { t: 'quote', text: 'Spring back — Increase in included angle of bent part relative to included angle of forming tool after tool is removed', ref: 'L3 · S16' },
        { t: 'demo', id: 'bd-spring', title: 'Push the punch down, then lift it', caption: 'Try a tiny push once, and all the way once. See when it all comes back, and when only a bit does.', mount: mountSpring },
        { t: 'check', q: 'bd40' },
        { t: 'fig', id: 'bd-spring', caption: '(1) While bending, the part takes the tool’s radius <en>Rb</en> and angle <en>αb′</en>. (2) After the punch lifts: a bigger radius <en>R</en> and a bigger angle <en>α′</en>.' },
        { t: 'quote', text: 'Figure Springback in bending is seen as a decrease in bend angle and an increase in bend radius: (1) during bending, the work is forced to take radius Rb and included angle αb\' of the bending tool, (2) after punch is removed, the work springs back to radius R and angle α\'.', ref: 'L3 · S16' },
        { t: 'h', text: 'Bigger or smaller? Both are true', en: 'Included angle up = bend angle down' },
        { t: 'art', html: ART['bd-angles'](), caption: 'Included angle + bend angle = 180°. When one grows, the other shrinks.' },
        { t: 'p', text: 'This is where people get lost. The definition says the angle **grows**. The figure says the angle **shrinks**. Both are right, because they’re two different angles:' },
        { t: 'list', style: 'dot', items: ['**Included angle**: the opening between the part’s two legs. It **grows**.', '**Bend angle**: how far the sheet has turned from flat. It **shrinks**.', 'Together they make 180°. So if the included angle goes up 4°, the bend angle goes down 4°. The same fact, said two ways.'] },
        { t: 'check', q: 'bd42' },
        { t: 'why', text: 'Why does it come back? Remember Lecture 2? Below the yield strength, metal is **elastic**: it returns to its shape. Past the yield point, part of the bend becomes permanent (**plastic**), but the elastic part is still there. As soon as the punch lifts, that elastic part opens the bend a little.' },
        { t: 'example', title: 'The operator outsmarts the sheet', text: 'To get exactly 90°, the operator bends a little further (overbending). It opens up and lands on 90°. The slide doesn’t give this fix, but it’s what you’ll play in the “Beat the springback” trial.' },
        { t: 'trap', text: 'The trap: “Springback is a decrease in included angle.” **False**. The included angle grows; it’s the bend angle that shrinks.', wrong: 'Springback = decrease in included angle · decrease in radius', right: 'Increase in included angle (= decrease in bend angle) · increase in bend radius' },
        { t: 'check', q: 'bd43' },
        { t: 'tip', text: 'Punch lifted? Included angle ↑, bend angle ↓, radius ↑.' }
      ]
    },
    {
      id: 'bd-ops', title: 'Six bending operations', en: 'Bending operations', ref: 'L3 · S19', scene: 'flanging',
      blocks: [
        { t: 'say', who: 'bend', text: 'This slide is drawings only, not a single definition. So learn each name with its shape, the way you know a friend’s face.' },
        { t: 'quote', text: 'Bending Operations: Straight flanging · Stretch flanging · Shrink flanging · Hemming · Seaming · Curling', ref: 'L3 · S19' },
        { t: 'art', html: ART['bd-ops-flange'](), caption: 'Three kinds of flanging: the edge is bent down along a straight line, a line that curves in, or a line that bulges out.' },
        { t: 'list', style: 'dot', items: ['**Straight flanging**: the edge is bent along a **straight line**.', '**Stretch flanging**: the edge is bent along a curve that **curves in** towards the sheet. The name tells you the flange edge gets stretched.', '**Shrink flanging**: the edge is bent along a curve that **bulges out**. The name tells you the flange edge shrinks.'] },
        { t: 'check', q: 'bd47' },
        { scene: 'hemming', t: 'art', html: ART['bd-ops-hem'](), caption: '<en>Hemming</en>: the edge folded back on itself. <en>Seaming</en>: two edges locked together. <en>Curling</en>: the edge rolled round.' },
        { t: 'example', title: 'Around the house', text: 'The rim of a baking tray is rolled so it won’t cut your hand (curling). A tin can’s lid is locked onto its body (seaming). The inner edge of a car door is folded over (hemming). (Our examples, not the slide’s.)' },
        { t: 'check', q: 'bd45' },
        { t: 'trap', text: 'The three that get mixed up: **hemming** = folded flat. **Curling** = rolled round. **Seaming** = **two** sheets locked together.', wrong: 'Hemming = the edge rolled into a circle', right: 'Hemming: folded flat · Curling: rolled round · Seaming: two edges locked together' },
        { t: 'check', q: 'bd46' },
        { t: 'tip', text: 'Straight flange, stretched flange, shrunk flange. Then: fold it, lock it, roll it.' }
      ]
    },
    {
      id: 'bd-roll', title: 'Rolling: by hand or on a line?', en: 'Roll forming sheet · continuous roll forming', ref: 'L3 · S20–S24', scene: 'rollForm',
      blocks: [
        { t: 'say', who: 'spin', text: 'Need a cylinder? Pass the sheet between three rolls. Need a channel 100 metres long? Pass it through rolls, one set after another.' },
        { t: 'quote', text: 'Roll forming sheet on one axis is an inexpensive operation. · Hand-operated machines with an adjustable roll provide a range of rolling radii (r). · These machines are typically used in small model shops.', ref: 'L3 · S20' },
        { t: 'art', html: ART['bd-roll3'](), caption: 'Three rolls. The top one moves up and down, and that sets the rolling radius <en>r</en>.' },
        { t: 'p', text: 'Slides 21 and 22 show a **slip roll** machine: you turn a handle, the sheet goes in flat and comes out as a cylinder.' },
        { t: 'check', q: 'bd50' },
        { scene: 'contRoll', t: 'h', text: 'Continuous roll forming', en: 'Continuous roll forming' },
        { t: 'quote', text: 'Roll forming is a continuous bending operation in which a long strip of sheet metal is passed through sets of rolls mounted on consecutive stands, each set performing only an incremental part of the bend, until the desired cross-section profile is obtained. · Roll forming is ideal for producing constant-profile parts with long lengths and in large quantities.', ref: 'L3 · S23' },
        { t: 'art', html: ART['bd-controll'](), caption: 'Station after station, the section changes a little at each one (<en>Roll station #1 … #5</en>).' },
        { t: 'compare', left: { title: 'Roll forming sheet', text: 'One axis. By hand. An adjustable roll. Inexpensive. For small model shops.' }, right: { title: 'Continuous roll forming', text: 'A long strip. Stands one after another. Step by step. Constant profile, long lengths, large quantities.' } },
        { t: 'check', q: 'bd51' },
        { t: 'example', title: 'Around you', text: 'Rain gutters, the metal studs behind plasterboard, the uprights of metal shelving. Constant section, long: that’s continuous roll forming. (Slide 24 shows twelve profiles like them.)' },
        { t: 'why', text: 'Why does each station do only a small part? Try to bend the whole section at once and the strip twists or tears. Bending in steps keeps the shape.' },
        { t: 'trap', text: 'Both are called roll forming. But by hand = **inexpensive, small shops**. On a line = **large quantities, long lengths**.', wrong: 'Hand-operated roll forming = large quantities', right: 'Continuous roll forming: constant-profile parts, long lengths, large quantities' },
        { t: 'tip', text: 'Three rolls and a handle = a model in a small shop. Stand after stand = a long profile by the tonne.' }
      ]
    },
    {
      id: 'bd-wire', title: 'Wire and tube', en: 'Wire and tube forming', ref: 'L3 · S25–S28', scene: 'tube',
      blocks: [
        { t: 'say', who: 'usta', text: 'Wire is easy to bend. A tube isn’t: bend it empty and it collapses on the inside. The fix? Something to support it from inside.' },
        { t: 'quote', text: 'forming wire requires special tooling but is an economical production process. · Formed and spot-welded wire is strong and has applications in many industries.', ref: 'L3 · S25' },
        { t: 'art', html: ART['bd-wire'](), caption: 'Formed wire, with a spot weld at every crossing.' },
        { t: 'example', title: 'Wire around you', text: 'The dish rack, the oven shelf, the fan guard, the supermarket basket: all formed, spot-welded wire. And slide 26 shows the wrought-iron scrolls used on gates.' },
        { t: 'check', q: 'bd53' },
        { t: 'quote', text: 'forming tubes and other hollow sections require an internal support called a mandrel to prevent buckling of tubes during the bending process.', ref: 'L3 · S25' },
        { t: 'art', html: ART['bd-mandrel'](), caption: 'Without a mandrel: the inner wall wrinkles and the section flattens. With a mandrel: the section stays round.' },
        { t: 'why', text: 'Remember that the inside of a bend is compressed? In a tube, the inner wall is thin and has nothing behind it. Squeezed, it wrinkles and collapses. The mandrel fills that space.' },
        { t: 'check', q: 'bd55' },
        { t: 'p', text: 'Slide 28 shows two machines: one with three rolls that curves tubes and sections (the same idea as roll forming), and one that bends a tube around a round former.' },
        { t: 'trap', text: 'A mandrel is an **internal** support, and its job is to prevent buckling. It isn’t an outside clamp or a cutting tool.', wrong: 'A mandrel is an outside clamp', right: 'Mandrel: an internal support that prevents buckling of tubes during bending' },
        { t: 'tip', text: 'Wire: special tooling but economical, and spot-welded wire is strong. Tube: a mandrel inside, or it buckles.' }
      ]
    }
  ]
};
