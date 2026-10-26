// Lesson — cut (English edition): Lecture 5, metal cutting (L5 · S2–S22). Same chapters, ids, scenes, block order,
// checks and demos as cut.js. The drawings live in _cut-art.js and the demos in _cut-demos.js (shared by both editions).
import { art, ICON } from './_cut-art.js';
import { mountGap, mountKeep, mountStrip } from './_cut-demos.js';

/* the demos' words (English) */
export const GAP = {
  label: 'Clearance c', tight: 'tight', loose: 'loose',
  small: ['Too small', 'The break lines pass each other. The edge gets sheared twice (**double buffing**), and the press needs a larger force.', 'If clearance is too small, break lines pass each other, causing double buffing and larger force'],
  ok: ['Right', 'The two cracks meet in one line. The part comes off clean.', 'The quality of the cut depends on the “c” clearance.'],
  large: ['Too large', 'The metal gets pinched and bent between the two edges instead of shearing cleanly.', 'If too large, metal is pinched and bent between cutting edges.']
};
export const KEEP = {
  figLabel: 'A sheet, and a shape about to be cut out of it',
  punch: 'Punch it', keepSheet: 'Keep the sheet with the hole', keepBlank: 'Keep the piece that fell out', next: 'Another shape',
  start: ['Ready', 'Press “Punch it”. The punch will cut along the dashed line.', ''],
  which: ['Choose', 'Now you have two pieces. Which one goes to the customer?', ''],
  sheet: ['That’s punching (piercing)', 'You kept the sheet. The hole is the product; the piece that fell out is waste.', 'In punching, the hole is the desired product, the material punched out to form the hole being waste.'],
  blank: ['That’s blanking', 'You kept the piece that fell out. It’s called the **blank**, and it is the product. The sheet with the hole is waste.', 'The article punched out is called the blank and is the required product of the operation.']
};
export const STRIP = {
  modeLabel: 'Operation', stroke: 'Strike', strip: 'STRIP', parts: 'PARTS', scrap: 'SCRAP', partsN: 'Parts:', scrapN: 'Scrap:',
  cutoff: ['Cutoff', 'Cutoff: one line, no scrap', '4 parts and no scrap. One line separates each part.'],
  parting: ['Parting', 'Parting: two edges, scrap in between', 'Only 3 parts, and 3 scrap pieces. Every stroke cuts on two paths.']
};

export default {
  zone: 'cut',
  hero: { say: 'The punch comes down, the die waits, the sheet sits in between. And in the end only one question matters: which piece goes to the customer?' },
  chapters: [
    /* ---------------------------------------------------------------- S2 */
    {
      id: 'ct-tree', title: 'Four ways to cut metal', en: 'Metal cutting: four families', ref: 'L5 · S2', scene: 'cutTree',
      blocks: [
        { t: 'say', who: 'usta', text: 'Before we pick up the shears, let’s look at the map. The lecture splits metal cutting into four families.' },
        { t: 'art', html: art('tree'), caption: 'The cutting tree, as on slide 2. The first family (the press) is where we’ll spend the rest of this district.' },
        { t: 'list', style: 'dot', items: [
          '**Punching and Shearing**: a punch and a die cut sheet metal on a press.',
          '**Chip Forming**: a cutter peels the metal off, and chips fly.',
          '**Nonchip Forming**: cutting without chips: chemical, electrical, mechanical or thermal.',
          '**Thermal/Flame Cutting**: cutting with heat: gas, laser or plasma.'
        ] },
        { t: 'quote', ref: 'L5 · S2', text: 'In the sheet metal industry the words shear, blank, nibble, or punch are used to describe hole making in sheet metal.', ar: 'In plain words: shear, blank, nibble and punch are the shop words for cutting holes in sheet.' },
        { t: 'p', text: 'So when the foreman says “blank this” or “nibble that piece”, he’s talking about cutting the sheet. You’ll meet all four words again in this lesson, each in its own chapter.' },
        { t: 'check', q: 'ct02' },
        { t: 'quote', ref: 'L5 · S2', text: 'In addition to the standard operations, laser cutting of sheet metal is now standard in the industry.', ar: 'In plain words: besides the usual operations, cutting sheet with a laser is now normal in industry.' },
        { t: 'check', q: 'ct03' },
        { t: 'trap', text: 'A “which is NOT a branch of cutting?” question likes to slip in a forming process such as **bending**. Bending shapes metal; it doesn’t cut it.', wrong: 'Bending is one of the four cutting branches', right: 'Punching and Shearing · Chip Forming · Nonchip Forming · Thermal/Flame Cutting' },
        { t: 'check', q: 'ct01' },
        { t: 'tip', text: 'Tie each family to its tool: a press (punch and die) · a cutter that makes chips · no chips · heat.' }
      ]
    },
    /* ---------------------------------------------------------------- S3 */
    {
      id: 'ct-chip', title: 'Chips, no chips, or heat?', en: 'Machining, nonchip and thermal cutting', ref: 'L5 · S3', scene: 'machining',
      blocks: [
        { t: 'say', who: 'gear', text: 'Cut into a heavy block of metal and the name changes. Here we don’t say “shearing”. We say “machining”.' },
        { t: 'quote', ref: 'L5 · S3', text: 'When cutting into a block of metal (using a chip-forming cutter), the word machining is used to describe the processes, even though a specific cutter or cutting tool is used.', ar: 'In plain words: cutting a block with a cutter that makes chips is called machining, whatever the tool.' },
        { t: 'p', text: 'A **chip** is the curl of metal that flies off as you cut. The cutter peels the metal away, layer after layer.' },
        { t: 'quote', ref: 'L5 · S3', text: 'The word machining is used because a special machine (that powers the cutting tool) is required to achieve a cut to a given precise tolerance.', ar: 'In plain words: it’s called machining because you need a machine to drive the tool to a precise size.' },
        { t: 'why', text: 'Your hand alone can’t cut to a fraction of a millimetre. The machine holds the tool and drives it exactly. That’s why the name comes from the machine, not from the cutter.' },
        { t: 'check', q: 'ct05' },
        { t: 'h', text: 'No chips', en: 'Nonchip forming cutting' },
        { t: 'quote', ref: 'L5 · S3', text: 'In nonchip forming cutting, chemical, chemical/electrical, electrical, mechanical, and/or thermal processes are used to cut materials.', ar: 'In plain words: without chips, materials are cut by chemical, chemical/electrical, electrical, mechanical or thermal processes.' },
        { t: 'compare', left: { title: 'Makes chips', en: 'Chip forming · machining', art: ICON.chip, text: 'A cutter peels a metal block, and a machine drives it to a precise size.' }, right: { title: 'No chips', en: 'Nonchip forming', art: ICON.nonchip, text: '5 kinds of process: chemical, chemical/electrical, electrical, mechanical, thermal.' }, note: 'The question: are there chips or not?' },
        { t: 'check', q: 'ct06' },
        { t: 'h', text: 'Cutting with heat', en: 'Thermal cutting' },
        { t: 'quote', ref: 'L5 · S3', text: 'Thermal cutting processes use gas, laser, and/or plasma.', ar: 'In plain words: thermal cutting uses gas, laser or plasma.' },
        { t: 'art', html: art('thermal'), caption: 'Three cutting heads: a gas flame, a laser beam, a plasma arc. The heat opens the cut line, and sparks fly out underneath.' },
        { t: 'check', q: 'ct07' },
        { t: 'tip', text: 'Chips = **machining** (and the machine is why it’s called that). No chips = 5 kinds of process. Heat = **gas · laser · plasma**.' }
      ]
    },
    /* ---------------------------------------------------------------- S4 */
    {
      id: 'ct-sheet', title: 'Sheet metal on the press', en: 'Sheet punching and shearing', ref: 'L5 · S4', scene: 'punchDie',
      blocks: [
        { t: 'say', who: 'usta', text: 'Back to sheet metal. This is our trade: a thin sheet, a press, a punch and a die.' },
        { t: 'quote', ref: 'L5 · S4', text: 'Sheet metal punching or shearing is limited to sheet 0.635 mm." thick (T) or less.', ar: 'In plain words: punching or shearing only works on sheet up to a certain thickness (T). The slide writes the number as 0.635 mm.' },
        { t: 'why', text: 'That number is odd. The stray inch mark (") gives it away: a quarter inch is 6.35 mm, the same sheet limit as Lecture 3. So the slide most likely means 6.35 mm. But if a question quotes this slide, it will use the slide’s number: 0.635 mm.' },
        { t: 'check', q: 'ct08' },
        { t: 'quote', ref: 'L5 · S4', text: 'Sheet metal is important in industrial design, especially in office products and equipment design, including computers, copiers, and a large array of industrial, medical, and research equipment.', ar: 'In plain words: designers use sheet metal a lot, above all for office products and equipment.' },
        { t: 'example', title: 'Where will you meet it as a designer?', art: art('pc'), text: 'A computer case. The copier in the library. The equipment cart in a clinic. All of them are sheets that were sheared and punched before they were bent. Look at the case: a punched hole, a grille of holes, and air louvers. You’ll know the name of each one by the end of this lesson.' },
        { t: 'check', q: 'ct09' },
        { t: 'quote', ref: 'L5 · S4', text: 'Three principal operations in press working that cut sheet metal: • Shearing to separate large sheets • Blanking to cut part boundaries out of sheet metal • Punching/ Piercing to make holes in sheet metal', ar: 'In plain words: shearing splits big sheets, blanking cuts a part’s outline out, punching makes holes.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Shearing', art: ICON.shearing, text: 'Separates large sheets.' },
          { title: 'Blanking', art: ICON.blanking, text: 'Cuts a part’s outline out of the sheet.' },
          { title: 'Punching / Piercing', art: ICON.punching, text: 'Makes holes in the sheet.' }
        ] },
        { t: 'check', q: 'ct10' },
        { t: 'trap', text: '**Punching** and **piercing** are two names for one operation. The slide writes “Punching/ Piercing”, and the exam may use only one of them.', wrong: 'Piercing is a different operation from punching', right: 'Punching/ Piercing — to make holes in sheet metal' },
        { t: 'check', q: 'ct11' },
        { t: 'tip', text: 'Shearing = splits a sheet. Blanking = takes a shape out. Punching = makes a hole.' }
      ]
    },
    /* ---------------------------------------------------------------- S5–S6 */
    {
      id: 'ct-shearing', title: 'Shearing: scissors as long as a table', en: 'Shearing', ref: 'L5 · S5–S6', scene: 'shearing',
      blocks: [
        { t: 'say', who: 'usta', text: 'First operation: scissors. Only these scissors are as long as a table, and one stroke cuts a whole sheet.' },
        { t: 'quote', ref: 'L5 · S5', text: 'Shearing is a process for cutting sheet metal to size out of a larger stock.', ar: 'In plain words: shearing cuts sheet down to the size you need from a bigger sheet.' },
        { t: 'p', text: 'Sheet arrives from the mill in big sizes. Shearing cuts it into pieces of exactly the size you need.' },
        { t: 'check', q: 'ct12' },
        { t: 'quote', ref: 'L5 · S5', text: 'The shearing process is a scissor-like action between a punch and a die', ar: 'In plain words: shearing works like scissors, between a punch and a die.' },
        { t: 'art', html: art('scissor'), caption: 'An upper edge comes down, a lower edge stays put. The metal between them is sheared. Exactly like scissors, except the two edges never touch: there’s a small gap between them called c.' },
        { t: 'why', text: 'In a pair of scissors the two blades slide past each other. Same here: the upper edge passes beside the lower edge, and the metal in between is sheared. Neither edge hits the other.' },
        { t: 'check', q: 'ct13' },
        { t: 'art', html: art('shears'), caption: 'Slide 6 shows two shearing machines: a power shear with a foot pedal, and a hand lever shear. Here they are as line drawings.' },
        { t: 'tip', text: '**Shearing** = cutting to size out of a larger stock = a scissor-like action between a punch and a die.' }
      ]
    },
    /* ---------------------------------------------------------------- S5, S7 */
    {
      id: 'ct-clearance', title: 'Clearance: the gap that decides', en: 'Clearance', ref: 'L5 · S5, S7', scene: 'clearance',
      blocks: [
        { t: 'say', who: 'usta', text: 'The punch and the die don’t touch. There’s a small gap between them, and that gap decides whether the cut comes out clean.' },
        { t: 'quote', ref: 'L5 · S5', text: 'The quality of the cut depends on the “c” clearance.', ar: 'In plain words: a good or bad cut depends on the clearance c.' },
        { t: 'check', q: 'ct14' },
        { t: 'quote', ref: 'L5 · S7', text: 'Clearance between Punch and Die or Clearance between two cutting blades · CLEARANCE = THE MEASURED SPACE BETWEEN THE MATING MEMBERS OF A DIE SET (C)', ar: 'In plain words: clearance is the measured gap between the two parts of a die set that meet, or between two blades.' },
        { t: 'fig', id: 'ct-clr', caption: 'Slide 7’s figure: the punch P between the two die halves D. The clearance C is split in two: C/2 on each side.' },
        { t: 'p', text: 'Look at the figure. The punch is **d1** wide. The die opening is **d**. The difference between them is the whole clearance **C**: half of it on the left, half on the right. So **d = d1 + C**.' },
        { t: 'check', q: 'ct19' },
        { t: 'h', text: 'Too small, or too large?', en: 'Too small · too large' },
        { t: 'quote', ref: 'L5 · S5', text: 'If clearance is too small, break lines pass each other, causing double buffing and larger force · If too large, metal is pinched and bent between cutting edges.', ar: 'In plain words: too small, the cracks miss each other, the edge is sheared twice and the press pushes harder; too large, the metal is squeezed and bent.' },
        { t: 'demo', id: 'ct-gap', title: 'Set the gap', caption: 'Move the slider. One crack starts at the punch’s edge, one at the die’s edge. When they meet in one line, the cut comes out clean. Try all three cases.', mount: (el, api) => mountGap(el, api, GAP) },
        { t: 'p', text: 'Here’s what happens: the punch presses, a crack starts at the punch’s edge and another at the die’s edge. They run toward each other. With the right clearance they meet, and the part comes off clean.' },
        { t: 'compare', left: { title: 'Clearance too small', en: 'too small', art: art('clrSmall'), text: 'The break lines pass each other. The edge is sheared twice (**double buffing**). The press needs a larger force.' }, right: { title: 'Clearance too large', en: 'too large', art: art('clrLarge'), text: 'The metal is **pinched and bent** between the two edges instead of shearing cleanly.' } },
        { t: 'check', q: 'ct16' },
        { t: 'trap', text: 'The exam loves to swap the two results. Remember: too small = **double buffing** + larger force. Too large = **pinched and bent**.', wrong: 'Too large → double buffing and larger force', right: 'Too small → double buffing and larger force · Too large → pinched and bent' },
        { t: 'check', q: 'ct18' },
        { t: 'tip', text: 'Too small = jammed (more force, cut twice). Too large = slack (pinched and bent).' }
      ]
    },
    /* ---------------------------------------------------------------- S9–S10 */
    {
      id: 'ct-punchdie', title: 'Punch and die', en: 'Punch and die', ref: 'L5 · S9–S10', scene: 'punchDie',
      blocks: [
        { t: 'say', who: 'punch', text: 'I’m the punch. I come down, I push, I cut. And under me the die is waiting.' },
        { t: 'quote', ref: 'L5 · S9', text: 'In this operation, the workpiece is stressed beyond its ultimate strength. The stresses caused in the metal by the applied forces will be shearing stresses.', ar: 'In plain words: the metal is loaded past its ultimate strength, and the stress in it is shear.' },
        { t: 'why', text: 'Remember the stress–strain curve? The **ultimate strength** is its highest point. Go past it and the metal separates. Here we want it to separate, so we go past it on purpose. And the stress is **shear**: two layers sliding past each other, not pulling or pushing.' },
        { t: 'check', q: 'ct21' },
        { t: 'check', q: 'ct22' },
        { t: 'quote', ref: 'L5 · S9', text: 'Punch A convex tool for making holes by shearing, or making surface or displacing metal with a hammer.', ar: 'In plain words: the punch is the convex tool: it makes holes by shearing, or shapes and pushes metal.' },
        { t: 'quote', ref: 'L5 · S9', text: 'Die A concave die, which is the female part as opposed to punch which is the male part.', ar: 'In plain words: the die is concave, the female part; the punch is the male part.' },
        { t: 'compare', left: { title: 'The punch', en: 'Punch · convex · male', art: art('punchIco'), text: 'Bulges outward. Comes down and goes in.' }, right: { title: 'The die', en: 'Die · concave · female', art: art('dieIco'), text: 'Hollowed inward. Receives the punch.' } },
        { t: 'check', q: 'ct24' },
        { t: 'fig', id: 'ct-press', caption: 'Slide 10’s figure as a section: the punching force, the punch, the sheet metal, the clearance, and the slug that dropped into the die.' },
        { t: 'p', text: 'The piece that drops into the die opening is called the **slug**. The slide labels it **Scrap / slug**. In punching, it’s waste.' },
        { t: 'check', q: 'ct25' },
        { t: 'trap', text: 'Convex and concave get mixed up. The punch is the one that bulges (**convex**); the die is the hollow one (**concave**).', wrong: 'Punch = concave, female · Die = convex, male', right: 'Punch = convex, male · Die = concave, female' },
        { t: 'tip', text: 'The punch bulges and goes in = **male**. The die is hollow and receives = **female**.' }
      ]
    },
    /* ---------------------------------------------------------------- S12 */
    {
      id: 'ct-ops', title: '14 operations on the sheet', en: 'The cutting operations', ref: 'L5 · S12', scene: 'cutOps',
      blocks: [
        { t: 'say', who: 'usta', text: 'Slide 12 is a long list: 14 names. Don’t panic. They’re all a punch and a die, in different shapes.' },
        { t: 'quote', ref: 'L5 · S12', text: 'The cutting operations include: Punching (Piercing) · Blanking · Fine blanking · Notching · Perforating · Slotting · Slitting · Lancing · Parting · Cutoff · Shaving · Trimming · Embossing · Coining', ar: 'In plain words: 14 names. (Nibbling is defined too, on slide 20, but it isn’t on this list.)' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Punching (Piercing)', art: ICON.punching, text: 'Makes a hole. The sheet is the product; the piece that falls out is scrap.' },
          { title: 'Blanking', art: ICON.blanking, text: 'Takes a shape out. The **blank** that falls out is the product; the sheet is scrap.' },
          { title: 'Fine blanking', art: ICON.fine, text: 'Blanking + an **ejector** from below: flatter, with smoother edges.' },
          { title: 'Notching', art: ICON.notching, text: 'Punching the edge of the sheet, in the shape of part of the punch.' },
          { title: 'Perforating', art: ICON.perforating, text: 'Lots of holes, close together, in one operation.' },
          { title: 'Slotting', art: ICON.slotting, text: 'Punching rectangular holes.' },
          { title: 'Slitting', art: ICON.slitting, text: 'Straight lines. No scrap.' },
          { title: 'Lancing', art: ICON.lancing, text: 'No metal removed. A tab, a vent or a louver.' },
          { title: 'Parting', art: ICON.parting, text: 'A punch with two edges. Scrap between the parts.' },
          { title: 'Cutoff', art: ICON.cutoff, text: 'One line separates the part. No scrap.' },
          { title: 'Shaving', art: ICON.shaving, text: 'A hair off the edge, with a small clearance. ±0.025 mm.' },
          { title: 'Trimming', art: ICON.trimming, text: 'The excess around the part, like a cup’s flange.' },
          { title: 'Embossing', art: ICON.embossing, text: 'Hollows: raised or sunken lettering, or reinforcement ribs.' },
          { title: 'Coining', art: ICON.coining, text: 'Impressions on both sides.' },
          { title: 'Nibbling', en: 'slide 20 · not on the list', art: ICON.nibbling, text: 'Small overlapping hits along a path cut out a big shape.' }
        ] },
        { t: 'h', text: 'Three questions for every operation', en: 'Three questions for every operation' },
        { t: 'list', style: 'num', items: ['Was any metal removed from the sheet?', 'What went to the scrap bin?', 'What ships to the customer?'] },
        { t: 'table', head: ['Answer', 'Operations'], rows: [
          ['A piece is thrown away (scrap)', 'Punching · Blanking · Fine blanking · Notching · Perforating · Slotting · Parting · Shaving · Trimming · Nibbling'],
          ['It cuts, but there’s no scrap', 'Slitting · Cutoff'],
          ['No metal is removed at all', 'Lancing · Embossing · Coining']
        ] },
        { t: 'check', q: 'ct26' },
        { t: 'check', q: 'ct27' },
        { t: 'tip', text: '**Embossing** and **coining** are on the list of cutting operations, but they don’t cut anything. They press a shape into the sheet.' }
      ]
    },
    /* ---------------------------------------------------------------- S13 */
    {
      id: 'ct-punchblank', title: 'Punching or blanking?', en: 'Punching vs blanking', ref: 'L5 · S13', scene: 'punchVsBlank',
      blocks: [
        { t: 'say', who: 'press', text: 'This is the lecture’s most famous question. Same punch, same die, same stroke. The whole difference: which piece are you keeping?' },
        { t: 'quote', ref: 'L5 · S13', text: '1-2-1- Punching (Piercing): It is a cutting operation by which various shaped holes are made in sheet metal. Punching is similar to blanking except that in punching, the hole is the desired product, the material punched out to form the hole being waste.', ar: 'In plain words: punching makes holes; the sheet with the hole is what you want, and the piece that falls out is waste.' },
        { t: 'quote', ref: 'L5 · S13', text: '1-2-2- Blanking: Blanking is the operation of cutting a flat shape sheet metal. The article punched out is called the blank and is the required product of the operation. The hole and metal left behind is discarded as waste.', ar: 'In plain words: blanking cuts a flat shape out; the piece that falls out (the blank) is what you want, and the sheet left behind is waste.' },
        { t: 'art', html: art('pb'), caption: 'As in slide 13’s figure: the same cut. In punching we keep the sheet with the hole. In blanking we keep the piece that fell out. The hatched piece is the one discarded.' },
        { t: 'demo', id: 'ct-keep', title: 'Keep or scrap?', caption: 'Press “Punch it”, then choose the piece that goes to the customer. The operation’s name appears. Try both choices.', mount: (el, api) => mountKeep(el, api, KEEP) },
        { t: 'check', q: 'ct28' },
        { t: 'check', q: 'ct29' },
        { t: 'example', title: 'A pot lid, and a switch plate', text: 'A round pot lid: we cut a disc out of the sheet, and the disc is the product. That’s **blanking**, and it’s the same **blank** that goes into deep drawing in Lecture 4. A switch plate needs a hole for the switch: the piece that falls out is scrap, and the plate is the product. That’s **punching**.' },
        { t: 'check', q: 'ct30' },
        { t: 'trap', text: 'The question will describe a piece that fell out and ask: scrap or product? Don’t guess. Ask yourself: which piece do we want?', wrong: 'Blanking: the hole is the desired product', right: 'Blanking: the blank is the product · Punching: the hole is the product' },
        { t: 'check', q: 'ct33' },
        { t: 'tip', text: '**Blanking** → the **blank** is the product. **Punching** → the hole is the product. The operation’s name tells you what you keep.' }
      ]
    },
    /* ---------------------------------------------------------------- S14 */
    {
      id: 'ct-fine', title: 'Fine blanking', en: 'Fine blanking', ref: 'L5 · S14', scene: 'fineBlank',
      blocks: [
        { t: 'say', who: 'usta', text: 'Ordinary blanking leaves a slightly rough edge. If you want a smooth edge and a flat part, add a force from underneath.' },
        { t: 'quote', ref: 'L5 · S14', text: 'A second force is applied under the sheet, directly opposite the punch, by a “ejector".', ar: 'In plain words: an ejector pushes up from under the sheet, right opposite the punch.' },
        { t: 'fig', id: 'ct-fine', caption: 'Slide 14’s figure, simplified: the punch comes down with the blanking force, the cushion/ejector pushes up from below (counterforce), and the guide plate holds the sheet with the impingement ring.' },
        { t: 'check', q: 'ct34' },
        { t: 'quote', ref: 'L5 · S14', text: 'This technique produces a part with better flatness and smoother edges.', ar: 'In plain words: the part comes out flatter, with smoother edges.' },
        { t: 'why', text: 'The blank is clamped from above and below at the same time. It gets no chance to bend or stretch while it’s being cut. So it comes out flat, with a smooth edge.' },
        { t: 'art', html: art('edge'), caption: 'The blank’s edge, as on the slide: die roll, sheared edge, burr, and flatness.' },
        { t: 'check', q: 'ct35' },
        { t: 'trap', text: 'The second force is **under** the sheet, opposite the punch. The force on top of the sheet is the **holding force**, applied through the **guide plate**.', wrong: 'The ejector pushes down on top of the sheet', right: 'A second force is applied under the sheet, directly opposite the punch, by an ejector' },
        { t: 'tip', text: '**Fine blanking** = blanking + an **ejector** from below = better **flatness** + smoother **edges**.' }
      ]
    },
    /* ---------------------------------------------------------------- S15–S16 */
    {
      id: 'ct-holes', title: 'A notch, a hundred holes, and slots', en: 'Notching · perforating · slotting', ref: 'L5 · S15–S16', scene: 'perforating',
      blocks: [
        { t: 'say', who: 'punch', text: 'Three operations from the same family: a punch making holes. The difference is where, what shape, and how many.' },
        { t: 'quote', ref: 'L5 · S15', text: 'Notching: Punching the edge of a sheet, forming a notch in the shape of a portion of the punch.', ar: 'In plain words: a bite punched out of the sheet’s edge, shaped like part of the punch.' },
        { t: 'quote', ref: 'L5 · S15', text: 'Perforating: Punching a close arrangement of a large number of holes in a single operation.', ar: 'In plain words: many holes, close together, in one stroke.' },
        { t: 'quote', ref: 'L5 · S16', text: 'Slotting: A punching operation that forms rectangular holes in the sheet.', ar: 'In plain words: punching rectangular holes.' },
        { t: 'grid', cols: 3, items: [
          { title: 'On the edge', en: 'Notching', art: art('notch'), text: 'The notch is shaped like part of the punch. The rest of the punch is outside the sheet.' },
          { title: 'Many, close together', en: 'Perforating', art: art('perf'), text: 'A large number of holes, in one stroke.' },
          { title: 'Rectangular', en: 'Slotting', art: art('slot'), text: 'Rectangular holes in the sheet.' }
        ] },
        { t: 'check', q: 'ct36' },
        { t: 'check', q: 'ct37' },
        { t: 'example', title: 'A speaker grille, and a warehouse shelf', text: 'A speaker grille: hundreds of small holes in one stroke. That’s **perforating**. A warehouse shelf with rectangular holes for hooks: that’s **slotting**. A corner bite cut from a sheet before it’s bent: that’s **notching**. In all three, what falls out is scrap and the sheet is what ships.' },
        { t: 'trap', text: '**Slotting** (rectangular holes) is not **slitting** (straight cuts, no scrap). Two letters apart, and the exam knows it.', wrong: 'Slitting forms rectangular holes', right: 'Slotting forms rectangular holes · Slitting cuts straight lines, no scrap' },
        { t: 'check', q: 'ct38' },
        { t: 'tip', text: '**Notch** = on the edge. **Perforate** = many, close together. **Slot** = rectangular.' }
      ]
    },
    /* ---------------------------------------------------------------- S16–S17 */
    {
      id: 'ct-lance', title: 'A cut, and nothing falls out', en: 'Lancing and slitting', ref: 'L5 · S16–S17', scene: 'lancing',
      blocks: [
        { t: 'say', who: 'usta', text: 'Two operations that cut the sheet, and still not a single piece of scrap. How?' },
        { t: 'quote', ref: 'L5 · S16', text: 'Lancing: Creating a partial cut in the sheet, so that no material is removed. The material is left attached to be bent and form a shape, such as a tab, vent, or louver.', ar: 'In plain words: a part-way cut; nothing is removed; the cut piece stays attached and is bent into a tab, vent or louver.' },
        { t: 'art', html: art('lance'), caption: 'The cut runs on three sides only. The fourth side bends. The tab lifts up and becomes a louver.' },
        { t: 'check', q: 'ct39' },
        { t: 'example', title: 'Air louvers', text: 'The slanted vents on the back of a computer or a fridge: that’s **lancing**. Air gets through, and the sheet hasn’t lost a gram.' },
        { t: 'quote', ref: 'L5 · S17', text: 'Slitting: Cutting straight lines in the sheet. No scrap material is produced.', ar: 'In plain words: straight cuts, and no scrap at all.' },
        { t: 'art', html: art('knives'), caption: 'As in slide 17’s figure: two rotating knives (upper knife and lower knife). The sheet runs between them and splits into strips, and nothing falls out.' },
        { t: 'check', q: 'ct40' },
        { t: 'compare', left: { title: 'A partial cut', en: 'Lancing', art: ICON.lancing, text: 'Cut along part of the shape; the rest bends. The tab stays attached.' }, right: { title: 'Straight lines', en: 'Slitting', art: ICON.slitting, text: 'The sheet splits into strips. No scrap.' }, note: 'Both: zero scrap.' },
        { t: 'trap', text: 'An air vent? Don’t assume a piece was removed. In **lancing** no metal is removed: the piece is still there, just bent.', wrong: 'Lancing removes a small tab of material to make a vent', right: 'Lancing: no material is removed; the material is left attached and bent' },
        { t: 'tip', text: '**Lancing** = partial cut + bend = **tab · vent · louver**. **Slitting** = straight lines = **no scrap**.' }
      ]
    },
    /* ---------------------------------------------------------------- S18–S19 */
    {
      id: 'ct-cutoff', title: 'Split with a line, or with a scrap piece?', en: 'Cutoff vs parting', ref: 'L5 · S18–S19', scene: 'cutoffParting',
      blocks: [
        { t: 'say', who: 'usta', text: 'You have a strip of sheet and you want parts from it. You can separate each part with a single line. Or cut with two edges and throw away what’s between them.' },
        { t: 'quote', ref: 'L5 · S18', text: 'Cutoff - Separating a part from the remaining sheet, without producing any scrap. · The punch will produce a cut line that may be straight, angled, or curved.', ar: 'In plain words: cutoff separates a part with no scrap at all; the cut line can be straight, angled or curved.' },
        { t: 'check', q: 'ct41' },
        { t: 'quote', ref: 'L5 · S19', text: 'Parting involves cutting a sheet metal strip by a punch with two cutting edges that match the opposite sides of the blank.', ar: 'In plain words: parting cuts a strip with a punch that has two cutting edges, one for each opposite side of the blank.' },
        { t: 'art', html: art('strip'), caption: 'As in slide 18’s figure: cutoff cuts along one path, with no scrap: 4 parts. Parting cuts along two paths at once, and what’s between them is scrap: only 3 parts.' },
        { t: 'demo', id: 'ct-strip', title: 'One strip, two operations', caption: 'Pick the operation and press “Strike” until the strip runs out. Count the parts and the scrap.', mount: (el, api) => mountStrip(el, api, STRIP) },
        { t: 'check', q: 'ct42' },
        { t: 'why', text: 'The parting punch has two edges. Every stroke cuts two lines at once, and what lies between the lines falls out. That’s the scrap. In cutoff there’s one line, so nothing sits between one part and the next.' },
        { t: 'check', q: 'ct43' },
        { t: 'trap', text: 'Both separate parts from a strip. The only difference is the scrap.', wrong: 'Parting separates parts without producing any scrap', right: 'Cutoff: no scrap · Parting: wasted material between the parts' },
        { t: 'tip', text: '**Cutoff** = one line = zero scrap. **Parting** = two edges = scrap in between.' }
      ]
    },
    /* ---------------------------------------------------------------- S19–S20 */
    {
      id: 'ct-edge', title: 'Clean the edge, trim the excess, nibble the shape', en: 'Shaving · trimming · nibbling', ref: 'L5 · S19–S20', scene: 'trimShave',
      blocks: [
        { t: 'say', who: 'usta', text: 'The part is out. But its edge needs fixing, or there’s extra metal around it, or the shape is too big for the punch. That’s where these three come in.' },
        { t: 'quote', ref: 'L5 · S19', text: 'Shaving: Shearing away minimal material from the edges of a feature or part, using a small die clearance. Used to improve accuracy or finish. Tolerances of ±0.025 mm are possible.', ar: 'In plain words: a tiny amount is sheared off an edge with a small clearance, for accuracy or finish, down to ±0.025 mm.' },
        { t: 'art', html: art('shave'), caption: 'A hair of metal comes off the edge of the hole. The hole grows a touch, and the edge becomes accurate.' },
        { t: 'check', q: 'ct44' },
        { t: 'quote', ref: 'L5 · S20', text: 'Trimming: Punching away excess material from the perimeter of a part, such as trimming the flange from a drawn cup.', ar: 'In plain words: punching off the extra metal around a part, like the flange of a drawn cup.' },
        { t: 'art', html: art('trim'), caption: 'A cup straight out of deep drawing (Lecture 4) has an extra flange. Trimming removes it: the ring is scrap, and the cup is the product (the trimmed part).' },
        { t: 'check', q: 'ct46' },
        { t: 'quote', ref: 'L5 · S20', text: 'Nibbling: Punching a series of small overlapping slits or holes along a path to cut-out a larger contoured shape.', ar: 'In plain words: many small overlapping holes along a path cut out a big curved shape.' },
        { t: 'art', html: art('nibble'), caption: 'A small punch, many overlapping hits, and in the end a big curved shape.' },
        { t: 'check', q: 'ct47' },
        { t: 'compare', left: { title: 'Clean the edge', en: 'Shaving', art: ICON.shaving, text: 'A tiny amount off the edge, with a small clearance. For accuracy and finish: ±0.025 mm.' }, right: { title: 'Cut the excess', en: 'Trimming', art: ICON.trimming, text: 'The extra metal around the part, like a cup’s flange.' } },
        { t: 'trap', text: 'Both remove metal from an edge. But **shaving** takes a hair for accuracy, while **trimming** takes the excess from all around the part.', wrong: 'Shaving uses a large die clearance to remove the flange', right: 'Shaving: minimal material, small die clearance · Trimming: excess material from the perimeter' },
        { t: 'tip', text: '**Shave** = a hair + accuracy ±0.025 mm. **Trim** = the excess round the edges. **Nibble** = small overlapping bites.' }
      ]
    },
    /* ---------------------------------------------------------------- S21–S22 */
    {
      id: 'ct-emboss', title: 'Embossing and coining', en: 'Embossing and coining', ref: 'L5 · S21–S22', scene: 'emboss',
      blocks: [
        { t: 'say', who: 'usta', text: 'The last two on the list don’t cut at all. They press a shape into the sheet.' },
        { t: 'quote', ref: 'L5 · S21', text: 'Embossing: Creates hollows in sheet, such as elevated (or indented) lettering or reinforcement ribs · Certain designs are embossed on the sheet metal. · Punch and die are of the same contour but in opposite direction.', ar: 'In plain words: embossing presses hollows into the sheet, such as raised letters or ribs, with a punch and die of the same shape facing each other.' },
        { t: 'art', html: art('ribs'), caption: 'Reinforcement ribs embossed into a sheet: the sheet gets stiffer without getting thicker.' },
        { t: 'check', q: 'ct48' },
        { t: 'fig', id: 'ct-emb', caption: 'As in slide 21’s figure: MALE on top, FEMALE below. The same shape, reversed. The sheet is pressed between them.' },
        { t: 'check', q: 'ct49' },
        { t: 'quote', ref: 'L5 · S22', text: 'Coining: Similar to embossing with the difference that similar or different impressions are obtained on both the sides of the sheet metal.', ar: 'In plain words: like embossing, but both sides of the sheet get an impression, the same or different.' },
        { t: 'compare', left: { title: 'One shape, reversed', en: 'Embossing', art: art('emboss', { small: true }), text: 'One shape: raised on one face, sunken on the other. Punch and die have the same contour, reversed.' }, right: { title: 'Both faces', en: 'Coining', art: art('coin'), text: 'An impression on each face. The same one, or a different one. Like a coin.' } },
        { t: 'example', title: 'A coin, and a street sign', art: art('coinFaces'), text: 'A metal coin: a picture on one face and a number on the other. That’s **coining**. A street-name sign with raised letters: that’s **embossing**.' },
        { t: 'check', q: 'ct50' },
        { t: 'trap', text: 'If the question says “on both the sides”, it’s **coining**. If it says “same contour but in opposite direction”, it’s **embossing**.', wrong: 'Embossing gives different impressions on both sides', right: 'Embossing: same contour, opposite direction · Coining: impressions on both sides' },
        { t: 'tip', text: '**Emboss** = one hollow shape (raised on one face, sunken on the other). **Coin** = an impression on both faces.' }
      ]
    }
  ]
};
