// Archive tables — design (Lecture 1). Format: docs/BRIEF.md § Archive.
/** flashcards: { t, ar, lec, d (slide wording), r (simple Arabic), rEn (simple English) } */
export const terms = [
  { t: 'Product designer', ar: 'مصمم المنتج', lec: '01', d: 'The product designer, whether on a design team or acting alone, is responsible for the appearance and form of a product.', r: 'مسؤول عن شكل المنتج وهيئته، في فريق أو لوحده.', rEn: 'Owns the look and shape of the product, in a team or alone.' },
  { t: 'Knowledge base of materials and manufacturing', ar: 'المعرفة بالخامات وطرق التصنيع', lec: '01', d: 'With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an array of possible design solutions and have some confidence that they can be manufactured.', r: 'بيها تقترح حلول كتير، وانت واثق إنها تتصنع.', rEn: 'It lets you propose many solutions with confidence they can be made.' },
  { t: 'Product Design Sequence', ar: 'تسلسل تصميم المنتج', lec: '01', d: 'Product Identification / Design Team Formed → Product Defined → Concept Development → Concept Presentation → Product Development → Product Presentation', r: 'ست خطوات، من تحديد المنتج لحد عرضه.', rEn: 'Six steps, from identifying the product to presenting it.' },
  { t: 'Aesthetics · Analysis · Synthesis', ar: 'الجماليات · التحليل · التركيب', lec: '01', d: 'The three lenses of the Product Design Sequence, in this order.', r: 'التلات عدسات بالترتيب. كل عدسة بتلم حاجات كتير في قرار واحد.', rEn: 'The three lenses, in order. Each focuses many inputs into one decision.' },
  { t: 'Personal and Individual Considerations', ar: 'اعتبارات شخصية وفردية', lec: '01', d: 'Aesthetics: style, ego, marketing/advertising · Analysis: research, sketches, mock-ups, finish color/texture · Synthesis: CAID, material selection, process selection', r: 'حاجات من جوه المصمم: ذوقه وإيده ودماغه.', rEn: 'What comes from the designer: taste, hand and head.' },
  { t: 'Objective Considerations', ar: 'اعتبارات موضوعية', lec: '01', d: 'Aesthetics: ergonomics, engineering, marketing, investment/profit, national/international sales, shipping/distribution, CPSA/UL/FDA · Analysis: ergonomics, breadboard studies, manufacturability, safety, strength of materials · Synthesis: CAD/CAM, material selection, tooling, component selection, vendors, assembly, shipping/packaging, repair/maintenance', r: 'حاجات بتتقاس، ومحدش يختلف عليها.', rEn: 'Things that can be measured, beyond argument.' },
  { t: 'Manufacturing Methods', ar: 'طرق التصنيع', lec: '01', d: 'Forming · Cutting · Joining · Finishing', r: 'أربع عائلات: شكّل، اقطع، وصّل، شطّب.', rEn: 'Four families: form, cut, join, finish.' },
  { t: 'Forming', ar: 'التشكيل', lec: '01', d: 'Liquid State · Plastic State · Solid State', r: 'سايل يتصب. طري يتكبس. ناشف يتثني.', rEn: 'Liquid is poured. Soft is squeezed. Solid is bent.' },
  { t: 'Cutting', ar: 'القطع', lec: '01', d: 'Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser', r: 'خلّي بالك: Chip وNonchip Forming من القطع.', rEn: 'Careful: Chip and Nonchip Forming are Cutting.' },
  { t: 'Joining', ar: 'الوصل', lec: '01', d: 'Solder/Braze · Weld · Adhesive · Mechanical', r: 'حشو بيسيح، قطع بتسيح، لزق، ربط بمسامير.', rEn: 'A melting filler, melting parts, glue, fasteners.' },
  { t: 'Finishing', ar: 'التشطيب', lec: '01', d: 'Formed · Abrasive/Cut · Coatings', r: 'Formed وAbrasive/Cut من التشطيب، مش من التشكيل والقطع.', rEn: 'Formed and Abrasive/Cut are Finishing, not Forming or Cutting.' },
  { t: 'Figure 1-1 · materials and manufacturing', ar: 'شكل ١-١: الخامات وطرق التصنيع', lec: '01', d: 'Materials (rows) × the 14 manufacturing methods (columns), each cell marked All Processes · Most Processes · Some Processes · No Processes.', r: 'الحديدي كله All. الـ thermoset ماينفعش يتلحم. الخشب يتلزق ويتربط بس.', rEn: 'Ferrous is All everywhere. Thermoset can’t be welded. Wood: glue and fasteners.' },
  { t: 'Natural Materials*', ar: 'الخامات الطبيعية', lec: '01', d: '*not within the scope of engineering materials, therefore not covered in this book', r: 'الألياف والخشب: برّه الخامات الهندسية.', rEn: 'Fibers and wood products: outside engineering materials.' }
];
/** exam traps: [A, A in slide words, B, B in slide words, Arabic tip, English tip] */
export const pairs = [
  ['Chip Forming', 'a branch of CUTTING (with Sheet Cutting, Nonchip Forming, Flame/Laser)', 'Forming', 'a family of its own: Liquid State · Plastic State · Solid State', 'Chip Forming فيها كلمة Forming، بس هي فرع من القطع.', 'Chip Forming says “forming”, but it is a branch of Cutting.'],
  ['Abrasive/Cut', 'a branch of FINISHING (with Formed, Coatings)', 'Cutting', 'Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser', 'Abrasive/Cut فيها Cut، بس هي فرع من التشطيب.', 'Abrasive/Cut says “cut”, but it is a branch of Finishing.'],
  ['CAID', 'personal and individual consideration (Synthesis)', 'CAD/CAM', 'objective consideration (Synthesis)', 'CAID شخصي، وCAD/CAM موضوعي. الاتنين تحت Synthesis.', 'CAID is personal, CAD/CAM is objective. Both sit under Synthesis.'],
  ['Concept Development', 'step 3 of the sequence: the Analysis lens', 'Product Development', 'step 5 of the sequence: the Synthesis lens', 'الفكرة الأول (٣)، وبعدين المنتج (٥).', 'Concept first (step 3), product later (step 5).'],
  ['Thermoset (figure 1-1)', 'Liquid State yes · Plastic and Solid State no · Weld and Solder/Braze no', 'Thermoplastics (figure 1-1)', 'Liquid and Plastic State yes · Weld yes · Solder/Braze no', 'اللي يتلحم هو الـ thermoplastic بس.', 'Only the thermoplastics can be welded.'],
  ['marketing/advertising', 'personal consideration under Aesthetics', 'marketing', 'objective consideration under Aesthetics', 'لو معاها advertising يبقى شخصي. لوحدها موضوعي.', 'With “advertising” it is personal; on its own it is objective.']
];
/** trigger words: [what the question says, what to think, lecture] */
export const triggers = [
  ['appearance and form', 'The product designer', '01'],
  ['whether on a design team or acting alone', 'The product designer: same responsibility', '01'],
  ['an array of possible design solutions', 'Knowledge base of materials and manufacturing possibilities', '01'],
  ['three lenses', 'Aesthetics → Analysis → Synthesis', '01'],
  ['style, ego', 'Personal and Individual Considerations (Aesthetics)', '01'],
  ['research, sketches, mock-ups', 'Personal and Individual Considerations (Analysis)', '01'],
  ['breadboard studies, manufacturability, safety', 'Objective Considerations (Analysis)', '01'],
  ['CPSA/UL/FDA, investment/profit', 'Objective Considerations (Aesthetics)', '01'],
  ['tooling, vendors, assembly, repair/maintenance', 'Objective Considerations (Synthesis)', '01'],
  ['Liquid / Plastic / Solid State', 'Forming', '01'],
  ['Chip Forming, Nonchip Forming, Flame/Laser', 'Cutting', '01'],
  ['Solder/Braze, Weld, Adhesive, Mechanical', 'Joining', '01'],
  ['Formed, Abrasive/Cut, Coatings', 'Finishing', '01'],
  ['All Processes in every column', 'Ferrous metals (figure 1-1)', '01'],
  ['not within the scope of engineering materials', 'Natural Materials* (figure 1-1)', '01']
];
