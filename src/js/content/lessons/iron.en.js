// Lesson — iron (English edition). Same chapters, ids, scenes, blocks, checks and demos as iron.js. House rules: docs/BRIEF.md.
// L2 · S16–S21: the cast irons — the recipe, the six kinds, and which job each one gets.
import { MICRO, GLY, castArt, wroughtArt, tensionArt, compressionArt, crankArt, rollsArt, chillArt, chainArt, alloyArt } from './_iron-art.js';
import { recipeDemo, dampDemo, finderDemo } from './_iron-demos.js';

const W_RECIPE = {
  carbon: 'Carbon C', silicon: 'Silicon Si', pot: 'A crucible of molten iron',
  ok: 'That fits the slide’s rule for every cast iron.',
  lowC: 'Not enough carbon. Every cast iron has at least 2% carbon.',
  lowSi: 'Not enough silicon. It has to be 1–3%.',
  highSi: 'Too much silicon. It has to stay within 1–3%.'
};
const W_DAMP = {
  gray: 'Gray', grayLine: 'Gray iron', ductile: 'Ductile', ductileLine: 'Ductile iron', hit: 'Strike both bases', again: 'Strike again',
  after: 'Gray iron calms down fast: <b>an ability to dampen vibration</b>. Ductile iron keeps ringing: <b>less vibration-dampening capacity than gray iron</b>.'
};
const W_FIND = {
  pick: 'Jobs', hint: 'Tap any job and see who gets it.', two: 'Two irons!',
  irons: { gray: ['Gray', ''], ductile: ['Ductile', ''], white: ['White', ''], cgi: ['CGI', ''], malleable: ['Malleable', ''], alloy: ['High-alloy', ''] },
  apps: {
    engine: ['Engine blocks', 'Engine blocks: listed for gray iron AND for CGI.'],
    gears: ['Gears', 'Gears: on the gray iron slide.'],
    hdgears: ['Heavy-duty gears', 'Heavy-duty gears: on the ductile iron slide, next to crankshafts.'],
    flywheel: ['Flywheels', 'Flywheels: gray iron.'],
    disc: ['Disc brakes', 'Disc brakes: gray iron ("disc brakes and drums").'],
    drum: ['Brake drums', 'Brake drums: gray iron ("drums") and CGI ("brake drums").'],
    bases: ['Machine bases', 'Large machine bases: gray iron. It damps vibration.'],
    crank: ['Crankshafts', 'Crankshafts: ductile iron. Machinability, fatigue strength, high modulus.'],
    crusher: ['Crushers · pulverizers · nozzles', 'Clay and brickmaking equipment: white iron. Wear and abrasion.'],
    shoes: ['Railroad brake shoes', 'Railroad brake shoes: white iron.'],
    rolls: ['Rolling-mill rolls', 'Rolling-mill rolls: white iron.'],
    manifold: ['Exhaust manifolds', 'Exhaust manifolds: CGI. High thermal conductivity.'],
    pump: ['High-pressure gear pumps', 'High-pressure gear pumps: CGI.'],
    bearing: ['Heavy-duty bearing surfaces', 'Heavy-duty bearing surfaces (cars, trucks, railroad rolling stock): malleable iron.'],
    farm: ['Farm & construction machinery', 'Farm and construction machinery: malleable iron.'],
    oxid: ['Oxidation + wear resistant', 'Oxidation and wear resistant: high-alloy (high-chromium irons).'],
    nonmag: ['Nonmagnetic · low expansion', 'Nonmagnetic, extremely low expansion: high-alloy (nickel irons).']
  }
};

export default {
  zone: 'iron',
  hero: { say: 'Six cast irons, and each one has a job. The exam gives you the job. You name the iron.' },
  chapters: [
    {
      id: 'ir-intro', title: 'Cast iron: the recipe', en: 'Ferrous metals: what every cast iron contains', ref: 'L2 · S16', scene: 'castIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'Before the six kinds, meet the family. Cast iron is iron that gets melted and poured into a mold.' },
        { t: 'quote', ref: 'L2 · S16', text: 'Hardness is an important mechanical property for certain applications', ar: 'Some jobs need a hard metal.' },
        { t: 'p', text: 'The slide opens with **hardness**: a metal’s ability to resist penetration and scratching. You met it in the properties lesson (L2 · S11).' },
        { t: 'quote', ref: 'L2 · S16', text: 'Irons are available as cast or wrought.', ar: 'Iron comes poured (cast) or worked (wrought).' },
        { t: 'compare', left: { title: 'Cast', en: 'poured into a mold', art: castArt(), text: 'The iron melts, gets poured into a mold, and freezes in its shape. That’s **cast iron**.' }, right: { title: 'Wrought', en: 'worked while solid', art: wroughtArt(), text: 'The iron is shaped while it’s solid: hammered or rolled. That’s **wrought iron**.' }, note: 'All six kinds coming up are **cast** irons.' },
        { t: 'check', q: 'ir03' },
        { t: 'quote', ref: 'L2 · S16', text: 'All cast irons contains at least 2 percent carbon and from 1–3 percent silicon.', ar: 'Every cast iron: carbon 2% or more, silicon 1–3%.' },
        { t: 'demo', id: 'irn-recipe', title: 'Set the recipe', caption: 'Move the carbon and the silicon. The crucible tells you whether the mix fits the slide’s rule.', mount: recipeDemo(W_RECIPE) },
        { t: 'check', q: 'ir01' },
        { t: 'trap', text: 'These numbers get mixed up: carbon is **at least 2%**. Silicon is **1–3%**. And 35% is something else entirely: the alloy content of a different kind, at the end of the lesson.', wrong: 'at least 1–3 percent carbon', right: 'at least 2 percent carbon · 1–3 percent silicon' },
        { t: 'check', q: 'ir02' },
        { t: 'tip', text: '“Carbon two and up, silicon one to three.”' }
      ]
    },
    {
      id: 'ir-six', title: 'Six kinds, six jobs', en: 'The six kinds of iron', ref: 'L2 · S16–S21', scene: 'irons',
      blocks: [
        { t: 'say', who: 'usta', text: 'Cast iron is a family of six siblings. Each has its own character, and its own job.' },
        { t: 'quote', ref: 'L2 · S16–S21', text: 'The six kinds of iron are: 1- Gray iron · 2- Ductile iron, or nodular iron · 3- White iron · Compacted graphic iron (CGI) · Malleable iron · High-alloy irons', ar: 'Gray, ductile (nodular), white, CGI, malleable and high-alloy.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'Gray', en: 'Gray iron', art: MICRO.gray, text: 'Engine blocks, flywheels, machine bases. It soaks up vibration.' },
          { title: 'Ductile', en: 'also called nodular', art: MICRO.ductile, text: 'Crankshafts and heavy-duty gears. It contains magnesium.' },
          { title: 'White', en: 'White iron', art: MICRO.white, text: 'Crushers and rolls. It resists wear and abrasion.' },
          { title: 'CGI', en: 'Compacted graphite', art: MICRO.cgi, text: 'Engine blocks and exhaust manifolds. It conducts heat well.' },
          { title: 'Malleable', en: 'Malleable iron', art: MICRO.malleable, text: 'White iron, heat-treated. For heavy-duty bearing surfaces.' },
          { title: 'High-alloy', en: 'High-alloy irons', art: MICRO.alloy, text: 'Up to 35% alloy: chromium or nickel.' }
        ] },
        { t: 'p', text: 'Flip the cards. The little drawing on each card imagines what the iron looks like inside under a microscope: flakes, balls, worms. It’s only there to help you picture it. The slides don’t show these.' },
        { t: 'check', q: 'ir05' },
        { t: 'why', text: 'Why six? It’s the same iron with one small change: a pinch of magnesium, fast cooling in the mold, a heat treatment, or alloys. Each change gives it a whole new character, and a new job.' },
        { t: 'trap', text: 'The slide says “cast or wrought”. But **wrought iron is not one of the six**. All six are cast irons.', wrong: 'Wrought iron is one of the six kinds', right: 'Gray · Ductile · White · CGI · Malleable · High-alloy' },
        { t: 'check', q: 'ir06' },
        { t: 'tip', text: 'Keep the order with one silly sentence: **G**ray **D**ucks **W**ear **C**ool **M**etal **H**ats = Gray, Ductile, White, CGI, Malleable, High-alloy.' }
      ]
    },
    {
      id: 'ir-gray', title: 'Gray iron swallows the shake', en: 'Gray iron', ref: 'L2 · S16', scene: 'grayIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'The first and most famous of the family. It works in your car and in the workshop.' },
        { t: 'quote', ref: 'L2 · S16', text: '1- Gray iron is used in automotive engine blocks, gears, flywheels, disc brakes and drums, and large machine bases.', ar: 'Engine blocks, gears, flywheels, disc brakes and drums, big machine bases.' },
        { t: 'grid', cols: 5, items: [
          { title: 'Engine blocks', en: 'automotive', art: GLY.engine },
          { title: 'Gears', en: 'gray iron', art: GLY.gear },
          { title: 'Flywheels', en: 'gray iron', art: GLY.flywheel },
          { title: 'Brakes', en: 'disc brakes & drums', art: GLY.brake },
          { title: 'Machine bases', en: 'large ones', art: GLY.base }
        ] },
        { t: 'p', text: 'The lecturer also writes its Arabic name on the slide. And watch out: three of these jobs come back later with other irons. We’ll collect them at the end of the lesson.' },
        { t: 'quote', ref: 'L2 · S16', text: 'gray iron has excellent fatigue resistance and an ability to dampen vibration. This is important for applications such as machine tools.', ar: 'Great fatigue resistance, and it damps vibration: perfect for machine tools.' },
        { t: 'demo', id: 'irn-damp', title: 'Strike the base', caption: 'The same blow on two bases: one gray iron, one ductile iron. Watch which shake dies first.', mount: dampDemo(W_DAMP) },
        { t: 'p', text: '**Fatigue** is a load that repeats millions of times: turn after turn, shake after shake. Gray iron takes it. And if a machine tool shakes, the part comes out badly. That’s why its base is gray iron.' },
        { t: 'check', q: 'ir08' },
        { t: 'quote', ref: 'L2 · S16', text: 'Although gray iron has poor tensile strength and a lower impact strength than that of most other cast ferrous metals, it has a high compressive strength.', ar: 'Weak when pulled or struck, strong when pushed.' },
        { t: 'compare', left: { title: 'Compression', en: 'pushed together', art: compressionArt(), text: 'Strong. Load it heavily and it holds, like a machine base carrying a ton.' }, right: { title: 'Tension', en: 'pulled apart', art: tensionArt(), text: 'Weak. Pull it from both ends and it can break. It doesn’t like a sudden blow (**impact**) either.' }, note: 'Gray iron = **poor tensile · high compressive**' },
        { t: 'trap', text: 'True or false: “Gray iron is strong in tension.” **False**. It has **poor tensile strength** and a **high compressive strength**.', wrong: 'Gray iron has high tensile strength', right: 'Poor tensile strength · lower impact strength · high compressive strength' },
        { t: 'check', q: 'ir10' },
        { t: 'tip', text: 'Gray iron is the calm, heavy one: it swallows the shake, carries the load, and fears pulling and blows.' }
      ]
    },
    {
      id: 'ir-ductile', title: 'Ductile iron turns the crank', en: 'Ductile (nodular) iron', ref: 'L2 · S17', scene: 'ductileIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'The second one is called **ductile**, and its nickname is **nodular**. Two names for the same iron. Learn both.' },
        { t: 'quote', ref: 'L2 · S17', text: '2-Ductile iron, or nodular iron, applications include crankshafts and heavy-duty gears because of its machinability, fatigue strength, and high modulus of elasticity. But it has less vibration-dampening capacity than gray iron.', ar: 'Crankshafts and heavy-duty gears, because it machines well, takes repeated loads and is stiff. But it damps less than gray.' },
        { scene: 'crankshaft', t: 'art', html: crankArt(), caption: 'A crankshaft turns with every stroke of the engine, twists, and never rests. Remember **torsion**? (L2 · S5)' },
        { t: 'list', style: 'check', items: ['**Machinability**: easy to cut and turn on machines.', '**Fatigue strength**: takes a load that repeats and repeats.', '**High modulus of elasticity**: stiff. It doesn’t bend easily under load.'] },
        { t: 'check', q: 'ir13' },
        { t: 'quote', ref: 'L2 · S17', text: 'Ductile iron contains trace amounts of magnesium, which improves the stiffness, strength, and shock resistance gray iron produces.', ar: 'A trace of magnesium makes it stiffer, stronger and tougher against shock than gray.' },
        { t: 'p', text: 'So take what gray iron can do and add a pinch of **magnesium (Mg)**. You get an iron that’s stiffer, stronger, and takes knocks better.' },
        { t: 'compare', left: { title: 'Gray iron', en: 'damps more', text: 'Soaks up **more** vibration. Weak against pulling and blows.' }, right: { title: 'Ductile iron', en: 'stronger, stiffer', text: 'Stiffer, stronger, better against shock. But it damps **less** vibration than gray iron.' }, note: 'Nobody wins at everything. Each one has its job.' },
        { t: 'trap', text: 'Ductile iron is **not** better at damping vibration. The slide says it plainly: **less vibration-dampening capacity than gray iron**.', wrong: 'Ductile iron damps vibration better than gray iron', right: 'Ductile iron has less vibration-dampening capacity than gray iron' },
        { t: 'check', q: 'ir15' },
        { t: 'tip', text: 'Ductile = crankshaft + magnesium. Its other name: **nodular**.' }
      ]
    },
    {
      id: 'ir-white', title: 'White iron: teeth of the crusher', en: 'White iron', ref: 'L2 · S18', scene: 'whiteIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'White iron is the tough guy of the family. Its job is grinding and rubbing, all day long.' },
        { t: 'quote', ref: 'L2 · S18', text: '3- White iron is specified where wear and abrasion resistance are required for applications such as clay mixing and brickmaking equipment such as crushers, pulverizes, and nozzles; railroad brake shoes, and rolling-mill rolls.', ar: 'Wherever things grind and rub: crushers, pulverizers, nozzles, railroad brake shoes, rolling-mill rolls.' },
        { t: 'art', html: rollsArt(), caption: 'Rolling-mill rolls squeeze metal all day. Their surface must not wear away.' },
        { t: 'p', text: '⚠ The slide writes **pulverizes**. The right word is **pulverizers**: mills that grind material down to powder.' },
        { t: 'check', q: 'ir18' },
        { t: 'quote', ref: 'L2 · S18', text: 'White iron gets its name from the whitish appearance of the metal, caused by chilling selected areas of gray or ductile iron in the mold.', ar: 'It looks whitish because chosen areas of gray or ductile iron were cooled fast in the mold.' },
        { t: 'art', html: chillArt(), caption: 'A heavy piece of metal in the mold (a **chill**) pulls the heat out fast. The area next to it comes out white; the rest stays gray.' },
        { t: 'why', text: 'The slide doesn’t say why it turns white. The simple idea: when iron cools very fast, the carbon has no time to come out as gray graphite. So the metal ends up very hard, with a light-coloured break.' },
        { t: 'trap', text: 'The word **railroad** shows up twice: white iron = **railroad brake shoes**. Malleable iron = **railroad rolling stock** (its heavy-duty bearing surfaces). And **brake** also shows up with gray iron (**disc brakes and drums**).', wrong: 'Railroad brake shoes → Malleable iron', right: 'Railroad brake shoes → White iron (wear and abrasion)' },
        { t: 'check', q: 'ir21' },
        { t: 'tip', text: 'White = grinding and rubbing: crusher, pulverizer, nozzle, railroad brake shoe, rolling-mill roll. Its name comes from chilling in the mold.' }
      ]
    },
    {
      id: 'ir-cgi', title: 'CGI: graphite, compacted', en: 'Compacted graphite iron (CGI)', ref: 'L2 · S19', scene: 'cgi',
      blocks: [
        { t: 'say', who: 'usta', text: 'CGI does gray iron’s job in the engine. And on top of that, it conducts heat well and machines easily.' },
        { t: 'quote', ref: 'L2 · S19', text: 'Compacted graphic iron (CGI) is used in automotive engine blocks, brake drums, exhaust manifolds, and high pressure gear pumps.', ar: 'Engine blocks, brake drums, exhaust manifolds, high-pressure gear pumps.' },
        { t: 'grid', cols: 4, items: [
          { title: 'Engine blocks', en: 'automotive', art: GLY.engine },
          { title: 'Brake drums', en: 'CGI', art: GLY.brake },
          { title: 'Exhaust manifolds', en: 'CGI', art: GLY.manifold },
          { title: 'Gear pumps', en: 'high pressure', art: GLY.pump }
        ] },
        { t: 'p', text: '⚠ The slide writes **graphic**. The right term is **compacted graphite iron**: iron with “compacted” graphite inside. Whichever spelling the exam uses, it’s the same iron.' },
        { t: 'check', q: 'ir23' },
        { t: 'quote', ref: 'L2 · S19', text: 'It has a strength similar to those of gray iron, with high thermal conductivity and machinability superior to those of ductile iron.', ar: 'As strong as gray, conducts heat well, machines better than ductile.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Strength like gray', en: 'strength ≈ gray iron', art: GLY.scale },
          { title: 'Moves heat', en: 'high thermal conductivity', art: GLY.heat },
          { title: 'Machines easily', en: 'better than ductile', art: GLY.cutter }
        ] },
        { t: 'why', text: 'Why engine blocks and exhaust manifolds? Both get very hot. An iron that conducts heat well carries that heat away fast, instead of trapping it inside.' },
        { t: 'trap', text: 'Engine blocks are listed for **two** irons: gray iron and CGI. Brake drums too. And watch the comparison: strength similar to **gray**, machinability superior to **ductile**. Don’t swap them.', wrong: 'CGI: strength similar to ductile iron, machinability superior to gray iron', right: 'CGI: strength similar to gray iron · machinability superior to ductile iron' },
        { t: 'check', q: 'ir25' },
        { t: 'tip', text: 'CGI = as strong as gray, machines better than ductile, and moves heat.' }
      ]
    },
    {
      id: 'ir-malleable', title: 'Malleable: white iron after the furnace', en: 'Malleable iron', ref: 'L2 · S20', scene: 'malleableIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'Malleable iron started life as white iron. It went into the furnace for a heat treatment, calmed down, and became easy to work.' },
        { t: 'quote', ref: 'L2 · S20', text: 'Malleable iron is used for heavy-duty bearing surfaces in automobiles, trucks, and railroad rolling stock. It is also used for farm and construction machinery.', ar: 'Heavy-duty bearing surfaces in cars, trucks and trains; farm and construction machinery.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Bearing surfaces', en: 'Heavy-duty bearing surfaces', art: GLY.bearing, text: 'Surfaces that carry heavy loads while something turns on them.' },
          { title: 'Farm machinery', en: 'Farm machinery', art: GLY.tractor, text: 'The tractor and its tools.' },
          { title: 'Construction', en: 'Construction machinery', art: GLY.digger, text: 'Diggers and loaders.' }
        ] },
        { t: 'check', q: 'ir28' },
        { t: 'quote', ref: 'L2 · S20', text: 'Malleable iron is white iron that has been transformed by a heat-treatment process, providing a malleable and easily machined iron.', ar: 'White iron + a heat treatment = malleable and easy to machine.' },
        { t: 'art', html: chainArt(), caption: 'The whole line: gray or ductile → chilled in the mold → white → heat-treatment → malleable.' },
        { t: 'why', text: 'White iron is very hard and difficult to machine. The heat treatment calms it down, so it becomes **malleable** and **easily machined**.' },
        { t: 'trap', text: 'Malleable iron comes from **white** iron. Not gray, not ductile. (White iron itself comes from gray or ductile.)', wrong: 'Malleable iron is gray iron that has been heat-treated', right: 'Malleable iron is white iron transformed by a heat-treatment process' },
        { t: 'check', q: 'ir29' },
        { t: 'tip', text: '“White + furnace = malleable.” And malleable carries heavy loads: cars, trucks, trains, tractors, diggers.' }
      ]
    },
    {
      id: 'ir-alloy', title: 'High-alloy: chromium and nickel', en: 'High-alloy irons', ref: 'L2 · S21', scene: 'alloyIrons',
      blocks: [
        { t: 'say', who: 'usta', text: 'The last one in the family. This is iron with lots of extras added: up to 35%.' },
        { t: 'quote', ref: 'L2 · S21', text: 'High-alloy irons are ductile, gray, or white irons that contain up to 35 percent alloy content.', ar: 'Any ductile, gray or white iron with up to 35% alloy.' },
        { t: 'art', html: alloyArt(), caption: 'Any of the three + up to 35% alloy = high-alloy. The slide gives two examples: chromium and nickel.' },
        { t: 'check', q: 'ir31' },
        { t: 'quote', ref: 'L2 · S21', text: 'High-chromium irons are oxidation and wear resistant. Nickel irons are nonmagnetic, have good corrosion resistance, and have an extremely low coefficient of thermal expansion.', ar: 'Chromium fights oxidation and wear. Nickel: no magnetism, little corrosion, almost no expansion.' },
        { t: 'compare', left: { title: 'High-chromium', en: 'High-chromium irons', text: 'Resists **oxidation** and **wear**.' }, right: { title: 'Nickel', en: 'Nickel irons', text: '**Nonmagnetic**. Good **corrosion** resistance. An **extremely low coefficient of thermal expansion**.' }, note: 'Chromium: oxidation + wear. Nickel: no magnet, no rust, almost no growth.' },
        { t: 'p', text: 'So if a part faces oxidation and rubbing: chromium. If a magnet must not grab it, or its size must not grow when it warms up: nickel.' },
        { t: 'check', q: 'ir34' },
        { t: 'trap', text: '**Wear** shows up twice: white iron = **wear and abrasion**. High-chromium = **oxidation and wear**. See **oxidation**? Think chromium. See **nonmagnetic**? Think nickel.', wrong: 'Nickel irons are oxidation and wear resistant', right: 'High-chromium: oxidation + wear · Nickel: nonmagnetic, corrosion, extremely low expansion' },
        { t: 'check', q: 'ir35' },
        { t: 'tip', text: '**Ni = No**: no magnet, no rust, (almost) no expansion. **Cr** is the shield against oxidation and wear.' }
      ]
    },
    {
      id: 'ir-match', title: 'Whose job is this?', en: 'Match the job to the iron', ref: 'L2 · S16–S21', scene: 'irons',
      blocks: [
        { t: 'say', who: 'press', text: 'I’m The Press. I love this question: “Whose job is this?” And I love it even more upside down: “Which one does NOT do this job?”' },
        { t: 'quote', ref: 'L2 · S3', text: 'Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.', ar: 'Each alloy’s properties make it fit a specific job.' },
        { t: 'demo', id: 'irn-finder', title: 'Tap the job', caption: 'Every job named on the slides, and the iron (or the two irons) the slides give it.', mount: finderDemo(W_FIND) },
        { t: 'table', head: ['Job', 'Iron'], rows: [
          ['Engine blocks', 'Gray + CGI'],
          ['Gears · heavy-duty gears', 'Gray · Ductile'],
          ['Flywheels · large machine bases', 'Gray'],
          ['Disc brakes and drums · brake drums', 'Gray · Gray + CGI'],
          ['Crankshafts', 'Ductile'],
          ['Crushers, pulverizers, nozzles', 'White'],
          ['Railroad brake shoes · rolling-mill rolls', 'White'],
          ['Exhaust manifolds · high pressure gear pumps', 'CGI'],
          ['Heavy-duty bearing surfaces · farm and construction machinery', 'Malleable'],
          ['Oxidation and wear resistant', 'High-alloy: chromium'],
          ['Nonmagnetic · corrosion · low thermal expansion', 'High-alloy: nickel']
        ] },
        { t: 'check', q: 'ir36' },
        { t: 'trap', text: 'Three jobs repeat: engine blocks (gray + CGI), brake drums (gray + CGI), and gears (gray, with heavy-duty gears going to ductile). If both irons are among the options, go back to the question: which one is it describing?', wrong: 'Every job belongs to one iron only', right: 'Engine blocks: gray + CGI · Brake drums: gray + CGI · Gears: gray (heavy-duty gears: ductile)' },
        { t: 'check', q: 'ir37' },
        { t: 'tip', text: 'In a **NOT** question, look for the job that doesn’t belong to the family. A crankshaft among gray iron’s jobs? That one is ductile iron’s.' }
      ]
    }
  ]
};
