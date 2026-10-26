// Archive tables — materials (Lecture 1 · S4, S6 · Lecture 2 · S2–S3). Format: docs/BRIEF.md § Archive.
/** flashcards: { t, ar, lec, d (slide wording), r (simple Arabic), rEn (simple English) } */
export const terms = [
  { t: 'Materials (the L1 tree)', ar: 'شجرة الخامات', lec: '01', d: 'Materials → Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials', r: 'أربع عائلات: معادن، وبلاستيك، ومطاط، وخامات هندسية طبيعية.', rEn: 'Four families: metals, plastics, rubber, natural engineering materials.' },
  { t: 'Rubber/Elastomers', ar: 'المطاط والإلاستومرات', lec: '01', d: 'Rubber/Elastomers → Thermoset · Thermoplastic', r: 'نفس تقسيمة البلاستيك بالظبط.', rEn: 'Exactly the same split as plastics.' },
  { t: 'Natural Engineering Materials', ar: 'خامات هندسية طبيعية', lec: '01', d: 'Natural Engineering Materials → Engineering Ceramics · Glass · Manufactured Carbon · Refractory Hard Metals', r: 'أربعة. وRefractory Hard Metals هنا، مش تحت Metals.', rEn: 'Four. Refractory Hard Metals sits here, not under Metals.' },
  { t: 'Metals chart', ar: 'شجرة المعادن', lec: '01', d: 'Metals → Ferrous · Nonferrous · Powdered Metallurgy (dashed line). “Metals are generally divided into ferrous and nonferrous.”', r: 'فرعين أساسيين، وفرع تالت متقطع: المساحيق.', rEn: 'Two main branches, plus a dashed third: powder.' },
  { t: 'Powdered Metallurgy', ar: 'تعدين المساحيق', lec: '01', d: 'The third branch of the metals chart, drawn with a dashed line.', r: 'الفرع المتقطع في شجرة المعادن.', rEn: 'The dashed branch of the metals chart.' },
  { t: 'Pure metal', ar: 'معدن نقي', lec: '01', d: 'Pure metals are composed of atoms of the same type.', r: 'نوع واحد بس من الذرات.', rEn: 'Only one kind of atom.' },
  { t: 'Metal alloy', ar: 'سبيكة', lec: '01', d: 'Metal alloys are composed of two or more chemical elements.', r: 'عنصرين كيميائيين أو أكتر متخلطين.', rEn: 'Two or more chemical elements mixed.' },
  { t: 'Blending of elements', ar: 'خلط العناصر', lec: '01', d: 'This blending of elements gives alloys their greater mechanical properties.', r: 'الخلط بيخلي السبيكة أقوى ميكانيكيًا.', rEn: 'Mixing makes the alloy mechanically stronger.' },
  { t: 'Alloys in engineering', ar: 'السبايك في الشغل الهندسي', lec: '01', d: 'The majority of metals used in engineering applications are alloys. Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.', r: 'أغلب المعادن الهندسية سبايك، وكل سبيكة ليها شغلانة.', rEn: 'Most engineering metals are alloys, each one suited to a job.' },
  { t: 'Classification of engineering materials', ar: 'تصنيف الخامات الهندسية', lec: '02', d: 'ENGINEERING MATERIALS → METALS (FERROUS · NON-FERROUS) · NON-METALS (POLYMERS · CERAMICS)', r: 'فرعين: معادن ولا معادن.', rEn: 'Two branches: metals and non-metals.' },
  { t: 'Ferrous', ar: 'معادن حديدية', lec: '02', d: 'FERROUS (CONTAINS IRON): wrought iron, carbon steels, alloy steels, cast irons', r: 'فيها حديد. كلهم في اسمهم حديد أو صلب.', rEn: 'Contains iron. Every name says iron or steel.' },
  { t: 'Non-ferrous', ar: 'معادن غير حديدية', lec: '02', d: 'NON-FERROUS (CONTAINS NO IRON): aluminium, copper, lead, silver, tin, zinc, etc', r: 'مفيهاش حديد: ستة على السلايد.', rEn: 'No iron: six named on the slide.' },
  { t: 'Non-metals', ar: 'لا معادن', lec: '02', d: 'NON-METALS → POLYMERS · CERAMICS', r: 'بوليمرات وسيراميك.', rEn: 'Polymers and ceramics.' },
  { t: 'Thermosetting polymers', ar: 'بوليمرات متصلّدة بالحرارة', lec: '02', d: 'THERMO SETTING POLYMERS (PLASTICS): phenolformaldehyde (Bakelite), polyesters, epoxy resins', r: 'باكاليت، وبوليستر، وإيبوكسي.', rEn: 'Bakelite, polyesters, epoxy resins.' },
  { t: 'Thermoplastic', ar: 'لدائن حرارية', lec: '02', d: 'THERMO PLASTIC: PVC, polythene, acrylic, resins', r: 'PVC، وبولي إيثيلين، وأكريليك، وresins.', rEn: 'PVC, polythene, acrylic, resins.' },
  { t: 'Ceramics', ar: 'سيراميك', lec: '02', d: 'CERAMICS: refractories, abrasives, glass, cement, concrete', r: 'فرن، وجلخ، وشباك، وشكارة، وصبّة.', rEn: 'Furnace brick, grinding wheel, window, sack, pour.' }
];
/** exam traps: [A, A in slide words, B, B in slide words, Arabic tip, English tip] */
export const pairs = [
  ['Ferrous', 'CONTAINS IRON: wrought iron, carbon steels, alloy steels, cast irons', 'Non-ferrous', 'CONTAINS NO IRON: aluminium, copper, lead, silver, tin, zinc, etc', 'السؤال: فيه حديد ولا لأ؟ أي اسم فيه iron أو steel يبقى حديدي.', 'Ask: is there iron in it? Any name with iron or steel is ferrous.'],
  ['Pure metal', 'composed of atoms of the same type', 'Alloy', 'composed of two or more chemical elements · greater mechanical properties', 'السبيكة هي الأقوى ميكانيكيًا، وهي أغلب المعادن الهندسية.', 'The alloy is the mechanically stronger one, and most engineering metals are alloys.'],
  ['Thermosetting polymers', 'phenolformaldehyde (Bakelite), polyesters, epoxy resins', 'Thermoplastic', 'PVC, polythene, acrylic, resins', 'الإيبوكسي setting. وresins لوحدها plastic.', 'Epoxy resins are setting; plain “resins” are plastic.'],
  ['Glass (Lecture 1)', 'a branch of Natural Engineering Materials (L1 · S4)', 'Glass (Lecture 2)', 'a ceramic, under Non-metals (L2 · S2)', 'الاتنين صح. شوف السؤال بيتكلم عن أنهي شجرة.', 'Both are right. Check which tree the question means.'],
  ['Refractory Hard Metals', 'L1 · S4: a branch of Natural Engineering Materials, not of Metals', 'Refractories', 'L2 · S2: a ceramic', 'الاسمين فيهم Refractory، وولا واحد فيهم تحت المعادن.', 'Both say “refractory”, and neither sits under Metals.'],
  ['L1 Materials tree', 'four families: Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials', 'L2 classification', 'two branches: Metals · Non-metals (Polymers · Ceramics)', 'المحاضرة الأولى: Plastics. التانية: Polymers.', 'Lecture 1 says Plastics; Lecture 2 says Polymers.'],
  ['Alloy steels', 'an alloy, and FERROUS (contains iron)', 'Non-ferrous', 'contains no iron', 'كلمة alloy مالهاش دعوة بالحديد. فيه حديد؟ يبقى حديدي.', '“Alloy” says nothing about iron. Iron inside means ferrous.']
];
/** trigger words: [what the question says, what to think, lecture] */
export const triggers = [
  ['contains iron', 'Ferrous', '02'],
  ['contains no iron', 'Non-ferrous', '02'],
  ['atoms of the same type', 'Pure metal', '01'],
  ['two or more chemical elements', 'Alloy', '01'],
  ['greater mechanical properties', 'Alloys (the blending of elements)', '01'],
  ['the majority of metals used in engineering applications', 'Alloys', '01'],
  ['a good fit for a specific application', 'Each metal alloy', '01'],
  ['dashed branch of the metals chart', 'Powdered Metallurgy', '01'],
  ['Engineering Ceramics, Glass, Manufactured Carbon, Refractory Hard Metals', 'Natural Engineering Materials', '01'],
  ['the same two branches as Plastics', 'Rubber/Elastomers', '01'],
  ['wrought iron, carbon steels, alloy steels, cast irons', 'Ferrous', '02'],
  ['aluminium, copper, lead, silver, tin, zinc', 'Non-ferrous', '02'],
  ['Bakelite, polyesters, epoxy resins', 'Thermosetting polymers', '02'],
  ['PVC, polythene, acrylic', 'Thermoplastic', '02'],
  ['refractories, abrasives, glass, cement, concrete', 'Ceramics', '02'],
  ['polymers and ceramics', 'Non-metals', '02']
];
