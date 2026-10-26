// Lesson — design (English edition). Same chapters, ids, scenes, block order, checks and demos as design.js.
// Art and demos: _design-kit.js · house rules: docs/BRIEF.md.
import * as K from './_design-kit.js';

const P = K.PRODUCT_ICON;

export default {
  zone: 'design',
  hero: { say: 'Whatever you draw, someone in a factory has to make. This district shows you how the factory thinks, so your drawing ends up in someone’s hands.' },
  chapters: [
    {
      id: 'dg-why', title: 'If you draw it, it has to be made', en: 'Why the product designer needs production engineering', ref: 'L1 · S2', scene: 'designer',
      blocks: [
        { t: 'say', who: 'designer', text: 'First question of the course: you’re a designer, so why should you care about the factory? The slide answers in three sentences.' },
        { t: 'quote', ref: 'L1 · S2', text: 'The product designer, whether on a design team or acting alone, is responsible for the appearance and form of a product.', ar: 'Whatever the set-up, the look and shape of the product are yours.' },
        { t: 'p', text: 'The shape people will see and hold is **your responsibility**. In a big team or on your own: same job. The first two words to learn: <en>appearance and form</en>.' },
        { t: 'check', q: 'dg01' },
        { t: 'quote', ref: 'L1 · S2', text: 'The product designer need to visualize and develop forms that ultimately will be manufactured.', ar: 'You imagine and develop forms, and in the end those forms get made.' },
        { t: 'art', html: K.artDesigner('en'), caption: 'The same lamp: half drawing, half product. Your job is to get the drawing across to the other half.' },
        { t: 'p', text: '<en>Ultimately</en> means “in the end”. The drawing isn’t the finish line. The finish line is a made thing in someone’s hands.' },
        { t: 'quote', ref: 'L1 · S2', text: 'With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an array of possible design solutions and have some confidence that they can be manufactured.', ar: 'Know your materials and processes, and you can offer many solutions you’re confident can be made.' },
        { t: 'compare', left: { title: 'A designer who knows the factory', en: 'with the knowledge base', text: 'Proposes <en>an array of possible design solutions</en>: several options, and knows how each one gets made.' }, right: { title: 'A designer who doesn’t', en: 'without it', text: 'A lovely drawing. Then the factory says “we can’t make this”, and it’s back to square one.' }, note: 'The difference isn’t talent. It’s knowing materials and manufacturing.' },
        { t: 'check', q: 'dg02' },
        { t: 'trap', text: 'A question may say the designer is responsible for the form “only when acting alone”. **Wrong**. The slide says <en>whether on a design team or acting alone</en>.', wrong: 'responsible only when acting alone', right: 'whether on a design team or acting alone → responsible for the appearance and form' },
        { t: 'check', q: 'dg03' },
        { t: 'tip', text: 'This slide in three words: **form** (<en>appearance and form</en>), **made** (<en>manufactured</en>), **many solutions, with confidence** (<en>an array of solutions · some confidence</en>).' }
      ]
    },
    {
      id: 'dg-sequence', title: 'From idea to product: six steps, three lenses', en: 'The Product Design Sequence', ref: 'L1 · S3', scene: 'sequence',
      blocks: [
        { t: 'say', who: 'designer', text: 'A product doesn’t appear in one go. It passes six stations. And on the way, three lenses.' },
        { t: 'p', text: 'This slide is a drawing, not text. Lots of lines come in from the left. They hit a lens and meet at one point. Then they spread out again and enter the next lens.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Product Identification / Design Team Formed · Product Defined · Concept Development · Concept Presentation · Product Development · Product Presentation', ar: 'The six steps along the top of the diagram, in order.' },
        { t: 'list', style: 'num', items: [
          '<en>Product Identification / Design Team Formed</en>: decide what the product is, and form the design team.',
          '<en>Product Defined</en>: the product is now defined. What exactly is it?',
          '<en>Concept Development</en>: develop the design concepts.',
          '<en>Concept Presentation</en>: present the concept.',
          '<en>Product Development</en>: develop the product itself.',
          '<en>Product Presentation</en>: present the product.'
        ] },
        { t: 'check', q: 'dg05' },
        { t: 'h', text: 'The three lenses', en: 'Aesthetics · Analysis · Synthesis' },
        { t: 'quote', ref: 'L1 · S3', text: 'Aesthetics · Analysis · Synthesis', ar: 'Looks, then analysis, then putting it all together. In that order.' },
        { t: 'demo', id: 'dsg-lens', title: 'The lens gathers, then lets go', caption: 'Press “Next step”. Each lens gathers many lines into one point. Then the lines spread again towards the next lens.', mount: K.lensDemo('en') },
        { t: 'why', text: 'Why a lens? Because every stage takes in a lot: opinions, numbers, drawings, requests. The lens focuses them into **one decision**. And that decision opens up new possibilities for the next stage.' },
        { t: 'p', text: 'Look where each lens sits. <en>Aesthetics</en> is at step 1, and the lines meet at step 2. <en>Analysis</en> is at step 3; they meet at 4. <en>Synthesis</en> is at step 5; they meet at 6.' },
        { t: 'check', q: 'dg06' },
        { t: 'check', q: 'dg07' },
        { t: 'trap', text: 'Don’t mix up <en>Concept Development</en> and <en>Product Development</en>. The concept comes first (step 3), the product later (step 5). <en>Concept Presentation</en> sits between them.', wrong: 'Product Development → Concept Development', right: 'Concept Development → Concept Presentation → Product Development' },
        { t: 'tip', text: 'The steps: identify, define, develop the concept, present it, develop the product, present it. The lenses are in alphabetical order: <en>Ae → An → Sy</en>.' }
      ]
    },
    {
      id: 'dg-considerations', title: 'Your taste, or the numbers?', en: 'Personal vs objective considerations', ref: 'L1 · S3', scene: 'considerations',
      blocks: [
        { t: 'say', who: 'designer', text: 'Two kinds of things go into every lens. Things that come from inside you. And things that can be measured, that nobody can argue with.' },
        { t: 'compare', left: { title: 'Personal and individual', en: 'Personal and Individual Considerations', text: 'Your own taste and choices: style, <en>ego</en>, sketches, mock-ups, the material and process you pick.' }, right: { title: 'Objective', en: 'Objective Considerations', text: 'Things you can measure: the human body, safety, money, manufacturing, packaging, repair.' }, note: 'Personal: few, and from inside. Objective: many, and from outside.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Personal and Individual Considerations — Aesthetics: style, ego, marketing/advertising · Analysis: research, sketches, mock-ups, finish color/texture · Synthesis: CAID, material selection, process selection', ar: 'The first row under the lenses: the personal considerations.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Objective Considerations — Aesthetics: ergonomics, engineering, marketing, investment/profit, national/international sales, shippin /distribution, CPSA/UL/FDA · Analysis: ergonomics, breadboard studies, manufacturability, safety, strength of materials · Synthesis: CAD/CAM, material selection, tooling, component selection, vendors, assembly, shipping/packaging, repair/maintenance', ar: 'The second row: the objective considerations. The slide says “shippin”; it means “shipping”.' },
        { t: 'art', html: K.considerArt('en'), caption: 'One column per lens. Dashed = personal. Filled = objective. Same order as the slide.' },
        { t: 'check', q: 'dg09' },
        { t: 'list', style: 'dot', items: [
          '<en>ego</en>: your own mark and feeling as a designer.',
          '<en>mock-ups</en>: a model, so you can see the form with your own eyes.',
          '<en>breadboard studies</en>: a quick working test rig, to check the idea actually works.',
          '<en>CAID</en>: computer software for industrial design.',
          '<en>CAD/CAM</en>: engineering drawing software, and manufacturing software.',
          '<en>CPSA/UL/FDA</en>: safety and standards laws and bodies.'
        ] },
        { t: 'check', q: 'dg11' },
        { t: 'trap', text: 'Some words repeat to catch you. <en>material selection</en> appears in both rows under <en>Synthesis</en>. <en>ergonomics</en> is objective under both <en>Aesthetics</en> and <en>Analysis</en>. And <en>marketing/advertising</en> is personal, while plain <en>marketing</en> is objective.', wrong: 'CAID = objective', right: 'CAID = personal · CAD/CAM = objective (both under Synthesis)' },
        { t: 'check', q: 'dg13' },
        { t: 'tip', text: 'If it has a number, a law or a supplier: usually objective. If it comes from your hand and head (a sketch, a mock-up, a style): personal. The one exception to remember: <en>research</en> is personal.' }
      ]
    },
    {
      id: 'dg-methods', title: 'The four ways things get made', en: 'Manufacturing methods: four families', ref: 'L1 · S7', scene: 'methods',
      blocks: [
        { t: 'say', who: 'usta', text: 'In the workshop, everything is made with just four verbs: form it, cut it, join it, finish it.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Manufacturing Methods: Forming · Cutting · Joining · Finishing', ar: 'Four families of methods.' },
        { t: 'fig', id: 'dg-tree', caption: 'The tree, exactly as on the slide: 4 families, 14 branches. Each family gets its own chapter next.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Forming', en: 'Liquid · Plastic · Solid', text: 'Give the material a new shape. <en>Liquid · Plastic · Solid State</en>.', art: K.FAM_ICON.forming },
          { title: 'Cutting', en: 'four branches', text: 'Take part of the material away, or split it. <en>Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser</en>.', art: K.FAM_ICON.cutting },
          { title: 'Joining', en: 'four branches', text: 'Make two parts into one. <en>Solder/Braze · Weld · Adhesive · Mechanical</en>.', art: K.FAM_ICON.joining },
          { title: 'Finishing', en: 'three branches', text: 'The last touch on the surface. <en>Formed · Abrasive/Cut · Coatings</en>.', art: K.FAM_ICON.finishing }
        ] },
        { t: 'check', q: 'dg16' },
        { t: 'example', title: 'A sheet-steel desk lamp', text: 'The sheet is **cut** to size. It is **bent** into the shade. The parts are **joined** with screws. Finally, it is **painted**. Four families in one product.' },
        { t: 'why', text: 'Why is this split useful? Look at any product and take it apart in your head with four questions: how was it formed? How was it cut? How was it joined? How was it finished? That’s exactly what slide 2 asks of you.' },
        { t: 'check', q: 'dg17' },
        { t: 'tip', text: 'Form, cut, join, finish. <en>Form · Cut · Join · Finish</en>. Same order as the slide.' }
      ]
    },
    {
      id: 'dg-forming', title: 'Forming: liquid, soft, solid', en: 'Forming: liquid, plastic and solid state', ref: 'L1 · S7', scene: 'forming',
      blocks: [
        { t: 'say', who: 'usta', text: 'You can shape the same metal while it’s liquid. Or while it’s hot and soft. Or while it’s cold and hard.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Forming: Liquid State · Plastic State · Solid State', ar: 'Forming has three states.' },
        { t: 'art', html: K.artFamily('forming', 'en'), caption: 'Liquid is poured into a mould. Soft is squeezed. Solid is bent.' },
        { t: 'list', style: 'dot', items: [
          '<en>Liquid State</en>: the material is molten. It is poured into a mould and sets in its shape.',
          '<en>Plastic State</en>: the material is soft (usually hot) but not melted. It is squeezed or pushed until it takes the shape.',
          '<en>Solid State</en>: the material is solid, usually cold. A sheet, rod, wire or tube is bent.'
        ] },
        { t: 'check', q: 'dg19' },
        { t: 'quote', ref: 'L3 · S3', text: 'Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working', ar: 'From Lecture 3: solid state forming means shaping sheet, rod, wire and tube, usually cold.' },
        { t: 'example', title: 'A phone stand from one piece of sheet', text: 'One piece of sheet steel, cut into the shape of a sitting figure, then bent cold. That bending is <en>Forming → Solid State</en>. (Photo on slide 12.)' },
        { t: 'check', q: 'dg21' },
        { t: 'trap', text: '<en>Plastic State</en> doesn’t mean “plastic, the material”. It means the material is **plastic**: soft enough to shape. Even iron has a <en>plastic state</en>: in <en>figure 1-1</en>, Ferrous × <en>Plastic State</en> says <en>All Processes</en>.', wrong: 'Plastic State = forming plastics only', right: 'Plastic State = the material is soft enough to be pushed into shape (metals too)' },
        { t: 'tip', text: 'Liquid is poured. Soft is squeezed. Solid is bent.' }
      ]
    },
    {
      id: 'dg-cutting', title: 'Cutting: four ways', en: 'Cutting: four ways', ref: 'L1 · S7', scene: 'cuttingM',
      blocks: [
        { t: 'say', who: 'usta', text: 'Cutting isn’t just scissors. There are scissors. There’s a tool that peels off chips. There’s chemistry and electricity. And there’s fire and light.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Cutting: Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser', ar: 'Cutting has four branches.' },
        { t: 'art', html: K.artFamily('cutting', 'en'), caption: 'Shears, chips, no chips, and flame or laser.' },
        { t: 'list', style: 'dot', items: [
          '<en>Sheet Cutting</en>: shearing and punching sheet. Like giant scissors, or a punch and die.',
          '<en>Chip Forming</en>: a tool removes metal as **chips** (curly swarf). This is what we call <en>machining</en>.',
          '<en>Nonchip Forming</en>: cutting **without chips**. With chemicals or electricity, for example.',
          '<en>Flame/Laser</en>: cutting with heat: a gas flame or a laser beam.'
        ] },
        { t: 'p', text: 'You’ll meet all four again, in detail, in Lecture 5.' },
        { t: 'check', q: 'dg22' },
        { t: 'example', title: 'A stainless table with cut-out legs', text: 'The ornaments in the legs were cut with a laser beam. That’s <en>Cutting → Flame/Laser</en>. (Photo on slide 8.)' },
        { t: 'trap', text: 'The best-known trap in this lecture: <en>Chip Forming</en> and <en>Nonchip Forming</en> have the word <en>Forming</en> in them. But they are branches of **Cutting**, not Forming!', wrong: 'Chip Forming → Forming', right: 'Chip Forming · Nonchip Forming → Cutting' },
        { t: 'why', text: 'So why is it called <en>Chip Forming</en>? Because the cutting itself **forms chips**. The word describes the chips coming off, not the shape of the product.' },
        { t: 'check', q: 'dg23' },
        { t: 'tip', text: 'Shears, chips or fire: it’s cutting. Even when the name says <en>Forming</en>.' }
      ]
    },
    {
      id: 'dg-joining', title: 'Joining: two parts become one', en: 'Joining: four ways to hold parts together', ref: 'L1 · S7', scene: 'joining',
      blocks: [
        { t: 'say', who: 'usta', text: 'Two parts, and you want one piece? You have four ways.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Joining: Solder/Braze · Weld · Adhesive · Mechanical', ar: 'Joining has four branches.' },
        { t: 'art', html: K.artFamily('joining', 'en'), caption: 'A filler that melts, parts that melt, glue, and a bolt with a nut.' },
        { t: 'list', style: 'dot', items: [
          '<en>Solder/Braze</en>: a filler metal melts and fills the joint. The two parts themselves don’t melt.',
          '<en>Weld</en>: the edges of the two parts themselves melt and fuse together.',
          '<en>Adhesive</en>: bonding with glue.',
          '<en>Mechanical</en>: holding parts with screws, bolts, nuts and rivets.'
        ] },
        { t: 'check', q: 'dg24' },
        { t: 'example', title: 'A riveted sheet-steel desk', text: 'This desk is rolled steel sheets held together by rows of rivets. Rivets = <en>Joining → Mechanical</en>. (Photo on slide 11.)' },
        { t: 'why', text: 'What’s the difference between <en>Solder/Braze</en> and <en>Weld</en>? (General background.) In a <en>Weld</en>, the parts themselves melt. In <en>Solder/Braze</en>, only the filler melts, so it needs less heat.' },
        { t: 'check', q: 'dg25' },
        { t: 'trap', text: 'A question may slip <en>Coatings</en> or <en>Assembly</en> in among the joining branches. Joining has only four: <en>Solder/Braze · Weld · Adhesive · Mechanical</en>.', wrong: 'Joining: … Assembly', right: 'Joining: Solder/Braze · Weld · Adhesive · Mechanical' },
        { t: 'tip', text: 'Melt a filler. Melt the parts. Glue. Bolt. In that order.' }
      ]
    },
    {
      id: 'dg-finishing', title: 'Finishing: the last touch', en: 'Finishing: the last touch', ref: 'L1 · S7', scene: 'finishing',
      blocks: [
        { t: 'say', who: 'designer', text: 'The first thing a customer touches is the surface. Finishing is the last touch before the product leaves.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Finishing: Formed · Abrasive/Cut · Coatings', ar: 'Finishing has three branches.' },
        { t: 'art', html: K.artFamily('finishing', 'en'), caption: 'A texture from the mould, a grinding wheel, a spray of paint.' },
        { t: 'list', style: 'dot', items: [
          '<en>Formed</en>: the finish comes out of the forming itself, like a texture or pattern from the mould.',
          '<en>Abrasive/Cut</en>: sanding, grinding, polishing. A very thin layer is removed so the surface comes out clean.',
          '<en>Coatings</en>: a layer on top of the surface: paint, powder, plating.'
        ] },
        { t: 'check', q: 'dg26' },
        { t: 'example', title: 'A green desk lamp', text: 'The sheet was bent into the lamp, then painted green. The paint = <en>Finishing → Coatings</en>. (Photo on slide 13.)' },
        { t: 'trap', text: '<en>Abrasive/Cut</en> has the word <en>Cut</en> in it, but it’s a branch of **Finishing**, not Cutting. And <en>Formed</en> belongs to Finishing, not Forming.', wrong: 'Abrasive/Cut → Cutting', right: 'Abrasive/Cut · Formed → Finishing' },
        { t: 'check', q: 'dg28' },
        { t: 'tip', text: 'The word <en>form</en> shows up in three places in the tree. <en>Forming</en> = a family. <en>Chip / Nonchip Forming</en> = Cutting. <en>Formed</en> = Finishing. Know where each one lives.' }
      ]
    },
    {
      id: 'dg-matrix', title: 'What can be made how?', en: 'Figure 1-1: materials and manufacturing', ref: 'L1 · S5', scene: 'matrix',
      blocks: [
        { t: 'say', who: 'designer', text: 'The question every designer asks: can this material be made this way? This table answers.' },
        { t: 'quote', ref: 'L1 · S5', text: 'figure 1-1. materials and manufacturing — All Processes · Most Processes · Some Processes · No Processes', ar: 'Every cell holds one of four circles.' },
        { t: 'p', text: 'Rows = materials. Columns = the 14 branches you just met, in the same order. A full circle = every process works. An empty circle = none does.' },
        { t: 'demo', id: 'dsg-matrix', title: 'Read the table yourself', caption: 'Pick a family of columns and tap any circle. The marked rows are the ones the exam likes.', mount: K.matrixDemo('en') },
        { t: 'list', style: 'check', items: [
          '**Ferrous**: every cell is <en>All Processes</en>. The only row like that.',
          '**Nonferrous**: all <en>All</en>, except <en>Flame/Laser</en> = <en>Most</en>.',
          '**Thermoset** plastics: <en>Liquid State</en> yes. <en>Plastic</en> and <en>Solid State</en> no. No <en>Weld</en>, no <en>Solder/Braze</en>. Adhesive and mechanical joining yes.',
          '**Thermoplastics**: <en>Liquid</en> and <en>Plastic State</en> yes. <en>Weld</en> yes. <en>Solder/Braze</en> no.',
          '**Wood Products**: no <en>Weld</en>, no <en>Solder/Braze</en>. Adhesive and mechanical joining yes.'
        ] },
        { t: 'check', q: 'dg30' },
        { t: 'check', q: 'dg31' },
        { t: 'why', text: 'Why can a <en>thermoplastic</en> be welded and a <en>thermoset</en> can’t? (General background, not on the slide.) A <en>thermoplastic</en> softens again when heated, so you can melt two edges and press them together. A <en>thermoset</en> sets once and never softens again.' },
        { t: 'quote', ref: 'L1 · S5', text: '*not within the scope of engineering materials, therefore not covered in this book', ar: 'The asterisk on Natural Materials (fibers, wood products).' },
        { t: 'check', q: 'dg35' },
        { t: 'trap', text: 'The favourite question: “Which plastic can be welded?” Only <en>Thermoplastics</en>. Not <en>Thermoset</en>.', wrong: 'Thermoset plastics can be welded', right: 'Thermoplastics: Weld = All Processes · Thermoset: Weld = No Processes' },
        { t: 'tip', text: 'Ferrous: everything works. <en>Thermoset</en>: poured, never welded. Wood: glued and bolted, never welded.' }
      ]
    },
    {
      id: 'dg-products', title: 'Read the product', en: 'Read the product', ref: 'L1 · S8–S18', scene: 'designer',
      blocks: [
        { t: 'say', who: 'designer', text: 'The lecture ends with photos of products and not one word. That’s not a break. It’s an exercise.' },
        { t: 'p', text: 'Take any product and ask it four questions: how was it formed? Cut? Joined? Finished? Flip the cards and see.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'Steel table', en: 'slide 8', text: 'The ornaments in the legs: <en>Cutting → Flame/Laser</en>.', art: P.table },
          { title: 'Tube bed', en: 'slides 9–10', text: 'Tubes bent into rings and arches: <en>Forming → Solid State</en>. Welded into the frame: <en>Joining → Weld</en>.', art: P.bed },
          { title: 'Rolled-sheet desk', en: 'slide 11', text: 'The sheet is rolled: <en>Forming → Solid State</en>. The rivets: <en>Joining → Mechanical</en>.', art: P.desk },
          { title: 'Phone stand', en: 'slide 12', text: 'Cut from sheet: <en>Cutting → Sheet Cutting</en>. Then bent: <en>Forming → Solid State</en>.', art: P.stand },
          { title: 'Folded lamp', en: 'slide 13', text: 'Bent: <en>Forming → Solid State</en>. Painted: <en>Finishing → Coatings</en>.', art: P.lamp },
          { title: 'Perforated basket', en: 'slide 14', text: 'All those holes: <en>Cutting → Sheet Cutting</en>. The bent sides: <en>Forming → Solid State</en>.', art: P.basket },
          { title: 'Spun aluminium forms', en: 'slide 15', text: 'Spun on a lathe: <en>Forming → Solid State</en>. Spinning comes back in Lecture 4.', art: P.spun },
          { title: 'Wire car', en: 'slide 16', text: 'Wire bent into the car: <en>Forming → Solid State</en>. The wires are joined to each other: <en>Joining</en>.', art: P.wirecar },
          { title: 'Plastic crates and chairs', en: 'slides 17–18', text: 'The plastic took the shape of a mould: <en>Forming</en>.', art: P.crate }
        ] },
        { t: 'quote', ref: 'L1 · S2', text: 'With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an array of possible design solutions and have some confidence that they can be manufactured.', ar: 'Right back where we started: know the materials and methods, and you can read any product.' },
        { t: 'check', q: 'dg37' },
        { t: 'tip', text: 'In the exam, when you meet a product: break it into four verbs. Form, cut, join, finish. Then pick the branch.' }
      ]
    }
  ]
};
