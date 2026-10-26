// Lesson — materials (English edition). Same chapters, ids, scenes, block order, checks and demos as materials.js.
// Art and demos: _materials-kit.js · house rules: docs/BRIEF.md.
import * as K from './_materials-kit.js';

const I = K.ITEM_ICON;

export default {
  zone: 'materials',
  hero: { say: 'Before you shape anything, know which family it belongs to. Iron? Plastic? Ceramic? Here we draw the whole family tree.' },
  chapters: [
    {
      id: 'mt-tree', title: 'The materials family', en: 'The materials family tree', ref: 'L1 · S4', scene: 'materialsTree',
      blocks: [
        { t: 'say', who: 'lattice', text: 'All materials fall into four families. Each family has branches. And the branches are what the exam asks about.' },
        { t: 'quote', ref: 'L1 · S4', text: 'Materials: Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials', ar: 'Four families under “Materials”.' },
        { t: 'fig', id: 'mt-l1tree', caption: 'The tree exactly as on the slide: four families under <en>Materials</en>.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Metals', en: 'two branches', text: '<en>Ferrous</en> and <en>Nonferrous</en>.', art: K.FAM_ICON.metals },
          { title: 'Plastics', en: 'two branches', text: '<en>Thermoset</en> and <en>Thermoplastic</en>.', art: K.FAM_ICON.plastics },
          { title: 'Rubber/Elastomers', en: 'two branches', text: '<en>Thermoset</en> and <en>Thermoplastic</en> again: the same split as plastics.', art: K.FAM_ICON.rubber },
          { title: 'Natural Engineering Materials', en: 'four branches', text: '<en>Engineering Ceramics · Glass · Manufactured Carbon · Refractory Hard Metals</en>.', art: K.FAM_ICON.natural }
        ] },
        { t: 'check', q: 'mt01' },
        { t: 'p', text: 'Count the branches: metals 2, plastics 2, rubber 2, natural 4. That’s 10 branches under 4 families.' },
        { t: 'check', q: 'mt02' },
        { t: 'why', text: 'Why sort materials at all? Because each family has methods that work on it and methods that don’t. Remember <en>figure 1-1</en> in the Designer × Factory district: its rows are these same families.' },
        { t: 'tip', text: 'Metal, plastic, rubber, natural. Under metal: ferrous and nonferrous. Under plastic and rubber: <en>Thermoset</en> and <en>Thermoplastic</en>.' }
      ]
    },
    {
      id: 'mt-natural', title: 'Rubber, and the natural ones', en: 'Rubber and the natural engineering materials', ref: 'L1 · S4', scene: 'elastomers',
      blocks: [
        { t: 'say', who: 'spring', text: 'Rubber stretches and comes back. But in the tree, it splits exactly like plastics.' },
        { t: 'quote', ref: 'L1 · S4', text: 'Rubber/Elastomers: Thermoset · Thermoplastic', ar: 'The same two branches as Plastics.' },
        { t: 'compare', left: { title: 'Plastics', en: 'Plastics', text: '<en>Thermoset · Thermoplastic</en>' }, right: { title: 'Rubber', en: 'Rubber/Elastomers', text: '<en>Thermoset · Thermoplastic</en>' }, note: 'Two different families, exactly the same split.' },
        { t: 'check', q: 'mt03' },
        { t: 'h', text: 'The natural engineering materials', en: 'Natural Engineering Materials' },
        { t: 'quote', ref: 'L1 · S4', text: 'Natural Engineering Materials: Engineering Ceramics · Glass · Manufactured Carbon · Refractory Hard Metals', ar: 'Four branches.' },
        { t: 'art', html: K.artNatural('en'), caption: 'The four, as pictures. The slide doesn’t explain them, it only names them.' },
        { t: 'trap', text: '<en>Refractory Hard Metals</en> has the word <en>Metals</en> in it. But in this tree it sits under <en>Natural Engineering Materials</en>, not under <en>Metals</en>!', wrong: 'Refractory Hard Metals → Metals', right: 'Refractory Hard Metals → Natural Engineering Materials' },
        { t: 'check', q: 'mt05' },
        { t: 'check', q: 'mt04' },
        { t: 'tip', text: 'The natural four: ceramics, glass, carbon, refractory hard metals. <en>Ceramics · Glass · Carbon · Refractory</en>.' }
      ]
    },
    {
      id: 'mt-metals', title: 'The metals chart', en: 'The metals chart', ref: 'L1 · S6 · L2 · S3', scene: 'metalsChart',
      blocks: [
        { t: 'say', who: 'ingot', text: 'Metals are a big family on their own. The slide draws two branches with solid lines, and a third with a dashed line.' },
        { t: 'fig', id: 'mt-metals', caption: 'The two main branches on solid lines. <en>Powdered Metallurgy</en> on a dashed one.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Metals are generally divided into ferrous and nonferrous.', ar: 'Two main groups of metals.' },
        { t: 'p', text: '<en>Generally</en> is the key word: the main split is just two. The dashed branch, <en>Powdered Metallurgy</en>, is the third. This slide is repeated word for word at the start of Lecture 2 (L2 · S3).' },
        { t: 'check', q: 'mt07' },
        { t: 'why', text: 'What is <en>Powdered Metallurgy</en>? (General background, not on the slide.) Metal powder is pressed in a mould, then heated until the grains bond together. The slide doesn’t explain it. Just remember where it sits: the dashed branch.' },
        { t: 'check', q: 'mt08' },
        { t: 'compare', left: { title: 'Ferrous', en: 'Ferrous', text: 'It has iron in it: <en>CONTAINS IRON</en>.' }, right: { title: 'Nonferrous', en: 'Nonferrous', text: 'No iron in it: <en>CONTAINS NO IRON</en>.' }, note: 'These definitions come from the Lecture 2 tree (L2 · S2), coming up in detail.' },
        { t: 'tip', text: 'Ferrous, nonferrous, and powder (the dashed one).' }
      ]
    },
    {
      id: 'mt-pure', title: 'Pure metal or alloy?', en: 'Pure metal or alloy?', ref: 'L1 · S6', scene: 'atoms',
      blocks: [
        { t: 'say', who: 'lattice', text: 'Look inside the metal. If all the atoms are alike, it’s a pure metal. If there’s more than one kind, it’s an alloy.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Pure metals are composed of atoms of the same type.', ar: 'One kind of atom.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Metal alloys are composed of two or more chemical elements.', ar: 'Two or more elements mixed.' },
        { t: 'compare', left: { title: 'Pure metal', en: 'Pure metal', art: K.latticeSVG('pure', 3), text: '<en>atoms of the same type</en>: one kind of atom only.' }, right: { title: 'Alloy', en: 'Alloy', art: K.latticeSVG('alloy', 7), text: '<en>two or more chemical elements</en>, mixed together.' } },
        { t: 'check', q: 'mt09' },
        { t: 'demo', id: 'mat-alloy', title: 'Mix an alloy yourself', caption: 'Add a second element, then push the layers. Try the pure metal, try the alloy, and compare.', mount: K.alloyDemo('en') },
        { t: 'quote', ref: 'L1 · S6', text: 'This blending of elements gives alloys their greater mechanical properties.', ar: 'Mixing is what makes alloys mechanically stronger.' },
        { t: 'why', text: 'Why does mixing make it stronger? (General background.) Atoms of a different size act like bumps inside the metal. The layers find it harder to slide over each other, so the metal resists more.' },
        { t: 'check', q: 'mt10' },
        { t: 'check', q: 'mt11' },
        { t: 'trap', text: 'A question may flip it and say the pure metal is “mechanically stronger”. **Wrong**. The slide says the blending gives <en>greater mechanical properties</en>: to the alloy.', wrong: 'Pure metals have greater mechanical properties', right: 'This blending of elements gives alloys their greater mechanical properties' },
        { t: 'tip', text: 'Pure = one kind. Alloy = two or more = mechanically stronger.' }
      ]
    },
    {
      id: 'mt-alloys', title: 'Why most metals are alloys', en: 'Why most metals are alloys', ref: 'L1 · S6', scene: 'alloy',
      blocks: [
        { t: 'say', who: 'usta', text: 'In the workshop you rarely hold a pure metal. What you work with all day are alloys.' },
        { t: 'quote', ref: 'L1 · S6', text: 'The majority of metals used in engineering applications are alloys.', ar: 'Most engineering metals are alloys.' },
        { t: 'check', q: 'mt14' },
        { t: 'quote', ref: 'L1 · S6', text: 'Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.', ar: 'Each alloy’s properties suit one job.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Gray iron', en: 'Lecture 2 · S16', text: 'Engine blocks, gears, flywheels.', art: I.engine },
          { title: 'Ductile iron', en: 'Lecture 2 · S17', text: 'Crankshafts and heavy-duty gears.', art: I.crank },
          { title: 'White iron', en: 'Lecture 2 · S18', text: 'Crushers, and anything that has to resist wear.', art: I.crusher }
        ] },
        { t: 'example', title: 'Every alloy has its job', text: 'These three come from Lecture 2: three kinds of cast iron, each with a different use. That’s exactly what <en>a good fit for a specific application</en> means.' },
        { t: 'check', q: 'mt15' },
        { t: 'list', style: 'check', items: [
          '**Pure**: <en>atoms of the same type</en>.',
          '**Alloy**: <en>two or more chemical elements</en>.',
          '**Blending** gives alloys <en>greater mechanical properties</en>.',
          '**Most** engineering metals are alloys: <en>the majority … are alloys</en>.',
          '**The split**: <en>ferrous and nonferrous</en>.',
          '**Each alloy** has properties that fit <en>a specific application</en>.'
        ] },
        { t: 'trap', text: 'True or false: “Most engineering metals are pure metals.” **False**. Most are alloys.', wrong: 'The majority of engineering metals are pure metals', right: 'The majority of metals used in engineering applications are alloys' },
        { t: 'check', q: 'mt16' },
        { t: 'tip', text: 'This slide is six sentences, and each one can become a question. Learn the keywords: <en>same type · two or more · greater mechanical · majority · ferrous and nonferrous · specific application</en>.' }
      ]
    },
    {
      id: 'mt-classify', title: 'Metal or non-metal?', en: 'Classification of engineering materials', ref: 'L2 · S2', scene: 'classTree',
      blocks: [
        { t: 'say', who: 'lattice', text: 'Lecture 2 draws the tree a different way. Just two branches at the top: metals and non-metals.' },
        { t: 'quote', ref: 'L2 · S2', text: 'CLASSIFICATION OF ENGINEERING MATERIALS — ENGINEERING MATERIALS: METALS (FERROUS (CONTAINS IRON) · NON-FERROUS (CONTAINS NO IRON)) · NON-METALS (POLYMERS · CERAMICS)', ar: 'Metals (ferrous, non-ferrous) and non-metals (polymers, ceramics).' },
        { t: 'fig', id: 'mt-l2tree', caption: 'The tree as on the slide. The materials under each box come in the next chapters.' },
        { t: 'check', q: 'mt17' },
        { t: 'demo', id: 'mat-path', title: 'Find the material in the tree', caption: 'Tap any material and watch its path from the top down. That’s the same thinking you’ll do in the exam.', mount: K.pathDemo('en') },
        { t: 'check', q: 'mt18' },
        { t: 'compare', left: { title: 'The Lecture 1 tree', en: 'L1 · S4', text: 'Four families: <en>Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials</en>.' }, right: { title: 'The Lecture 2 tree', en: 'L2 · S2', text: 'Two branches: <en>Metals</en> and <en>Non-metals</en>. Non-metals = <en>Polymers</en> and <en>Ceramics</en>.' }, note: 'Same materials, two different drawings. Check which tree the question is talking about.' },
        { t: 'trap', text: 'Polymers and ceramics are branches of the **non-metals**. And in this tree the family is called <en>Polymers</en>, not <en>Plastics</en> as in Lecture 1.', wrong: 'In L2, polymers are a branch of metals', right: 'NON-METALS → POLYMERS · CERAMICS' },
        { t: 'tip', text: 'Ask in order: a metal? Then does it contain iron? Not a metal? Then polymer or ceramic? A polymer? Then <en>setting</en> or <en>plastic</en>?' }
      ]
    },
    {
      id: 'mt-ferrous', title: 'Ferrous: iron inside', en: 'Ferrous: it contains iron', ref: 'L2 · S2', scene: 'ferrous',
      blocks: [
        { t: 'say', who: 'ingot', text: 'The first branch of metals: the ones with iron in them. That’s what you’ll meet most in the workshop.' },
        { t: 'quote', ref: 'L2 · S2', text: 'FERROUS (CONTAINS IRON): WROUGHT IRON · CARBON STEELS · ALLOY STEELS · CAST IRONS', ar: 'Four ferrous materials.' },
        { t: 'grid', cols: 4, items: [
          { title: 'Wrought iron', en: 'wrought iron', text: 'Decorative ironwork and gates. In Lecture 2 it’s an example of a <en>malleable</en> material.', art: I.wrought },
          { title: 'Carbon steels', en: 'carbon steels', text: 'Everyday steel: beams, bars, sheet.', art: I.carbon },
          { title: 'Alloy steels', en: 'alloy steels', text: 'Steel with other elements added. The name tells you it’s an alloy.', art: I.alloy },
          { title: 'Cast irons', en: 'cast irons', text: 'At least 2% carbon. It has a whole district of its own.', art: I.cast }
        ] },
        { t: 'check', q: 'mt21' },
        { t: 'check', q: 'mt22' },
        { t: 'trap', text: '<en>Alloy steels</en> has the word <en>Alloy</en> in it. But it’s still **ferrous**, because it contains iron. An alloy and ferrous at the same time.', wrong: 'Alloy steels → Non-ferrous', right: 'Alloy steels → Ferrous (contains iron)' },
        { t: 'check', q: 'mt24' },
        { t: 'tip', text: 'All four have “iron” or “steel” in the name: <en>wrought IRON · carbon STEELS · alloy STEELS · cast IRONS</en>.' }
      ]
    },
    {
      id: 'mt-nonferrous', title: 'Non-ferrous: no iron inside', en: 'Non-ferrous: no iron inside', ref: 'L2 · S2', scene: 'nonferrous',
      blocks: [
        { t: 'say', who: 'ingot', text: 'The second branch: metals with no iron at all. Six on the slide, then an <en>etc</en>.' },
        { t: 'quote', ref: 'L2 · S2', text: 'NON-FERROUS (CONTAINS NO IRON): ALUMINIUM · COPPER · LEAD · SILVER · TIN · ZINC, etc', ar: 'Six named non-ferrous metals.' },
        { t: 'art', html: K.artIngots('en'), caption: 'Six ingots, and not one of them contains iron.' },
        { t: 'p', text: 'The <en>etc</en> at the end means “and others”: there are more non-ferrous metals. But the exam asks about these six.' },
        { t: 'check', q: 'mt25' },
        { t: 'check', q: 'mt26' },
        { t: 'trap', text: 'A question may slip <en>wrought iron</en> or <en>cast irons</en> in among copper and aluminium. Anything named <en>iron</en> or <en>steel</en> = ferrous.', wrong: 'Wrought iron → Non-ferrous', right: 'Wrought iron → Ferrous' },
        { t: 'tip', text: 'The six: aluminium, copper, lead, silver, tin, zinc. Their symbols: <en>Al · Cu · Pb · Ag · Sn · Zn</en>.' }
      ]
    },
    {
      id: 'mt-polymers', title: 'Polymers: two kinds', en: 'Polymers: thermosetting and thermoplastic', ref: 'L2 · S2', scene: 'polymers',
      blocks: [
        { t: 'say', who: 'spark', text: 'Non-metals have two branches. The first is polymers. Under it are two kinds, and the exam loves to mix them up.' },
        { t: 'quote', ref: 'L2 · S2', text: 'POLYMERS — THERMO SETTING POLYMERS (PLASTICS): PHENOLFORMALDEHYDE (BAKELITE) · POLYSTERS · EPOXRESINS — THERMO PLASTIC: PVC · POLYTHENE · ACRYLIC · RESINS', ar: 'The slide says POLYSTERS and EPOXRESINS; it means polyesters and epoxy resins.' },
        { t: 'compare', left: { title: 'Thermosetting', en: 'THERMO SETTING POLYMERS (PLASTICS)', art: K.NET, text: '<en>Bakelite (phenolformaldehyde) · polyesters · epoxy resins</en>' }, right: { title: 'Thermoplastic', en: 'THERMO PLASTIC', art: K.CHAINS, text: '<en>PVC · polythene · acrylic · resins</en>' }, note: 'The two drawings only picture the idea: a linked net, and loose chains.' },
        { t: 'why', text: 'What’s the difference? (General background, not on the slide.) A <en>thermoplastic</en> softens again when you heat it, so it can be reshaped. A <en>thermosetting</en> polymer sets once and that’s it: heat it again and it won’t soften. The slide doesn’t explain this, so the questions are about the **examples**.' },
        { t: 'check', q: 'mt28' },
        { t: 'check', q: 'mt29' },
        { t: 'example', title: 'Around the house', text: 'The black pot handle that never gets hot is often Bakelite. The grey drain pipe is often <en>PVC</en>. These are only there to help you picture them.' },
        { t: 'trap', text: '<en>Epoxy resins</en> are under <en>thermosetting</en>. But plain <en>resins</en> are listed under <en>thermoplastic</en>. Don’t mix them up: epoxy = <en>thermosetting</en>.', wrong: 'Epoxy resins → Thermoplastic', right: 'Epoxy resins → Thermosetting · (plain “resins” → Thermoplastic)' },
        { t: 'check', q: 'mt30' },
        { t: 'tip', text: '<en>Setting</en>: Bakelite, polyesters, epoxy. <en>Plastic</en>: <en>PVC</en>, polythene, acrylic.' }
      ]
    },
    {
      id: 'mt-ceramics', title: 'Ceramics', en: 'Ceramics', ref: 'L2 · S2', scene: 'ceramics',
      blocks: [
        { t: 'say', who: 'anvil', text: 'The second branch of non-metals: ceramics. Five things under it, some of them you wouldn’t guess.' },
        { t: 'quote', ref: 'L2 · S2', text: 'CERAMICS: REFRACTORIES · ABRASIVES · GLASS · CEMENT · CONCRETE', ar: 'Five ceramics.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Refractories', en: 'refractories', text: 'The bricks that line furnaces.', art: I.refractory },
          { title: 'Abrasives', en: 'abrasives', text: 'Grinding wheels and sandpaper.', art: I.abrasive },
          { title: 'Glass', en: 'glass', text: 'Windows and drinking glasses.', art: I.glass },
          { title: 'Cement', en: 'cement', text: 'The grey powder in the sacks.', art: I.cement },
          { title: 'Concrete', en: 'concrete', text: 'Cement, sand, gravel and water, poured and left to set.', art: I.concrete }
        ] },
        { t: 'check', q: 'mt33' },
        { t: 'p', text: 'Careful: <en>Abrasives</en> here are a **material** (the grinding wheel itself). Not the same as <en>Abrasive/Cut</en> in Finishing, which is a **process**.' },
        { t: 'check', q: 'mt34' },
        { t: 'trap', text: 'In Lecture 2, glass is under <en>Ceramics</en>. But in the Lecture 1 tree it was under <en>Natural Engineering Materials</en>. Both are right, each in its own tree.', wrong: 'Glass is a polymer', right: 'Glass: L2 → Ceramics · L1 → Natural Engineering Materials' },
        { t: 'check', q: 'mt35' },
        { t: 'tip', text: 'Five: <en>refractories · abrasives · glass · cement · concrete</en>. Picture them: a furnace, a grinding wheel, a window, a sack, a pour.' }
      ]
    }
  ]
};
