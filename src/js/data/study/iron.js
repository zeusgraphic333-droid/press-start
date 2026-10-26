// Archive tables — iron (L2 · S16–S21). Format: docs/BRIEF.md § Archive. `d` is the slide's own wording.
export const terms = [
  { t: 'Cast irons', ar: 'الحديد الزهر', lec: '02', d: 'All cast irons contains at least 2 percent carbon and from 1–3 percent silicon.', r: 'حديد بيتصب في قالب. فيه كربون 2% على الأقل، وسيليكون من 1 لـ 3%.', rEn: 'Poured iron with at least 2% carbon and 1–3% silicon.' },
  { t: 'Cast or wrought', ar: 'مصبوب أو مشغول', lec: '02', d: 'Irons are available as cast or wrought.', r: 'الحديد بييجي مصبوب أو مشغول. الأنواع الستة كلها مصبوبة.', rEn: 'Iron comes cast or wrought; the six kinds are all cast.' },
  { t: 'Gray iron', ar: 'الحديد الزهر الرمادي', lec: '02', d: 'Gray iron is used in automotive engine blocks, gears, flywheels, disc brakes and drums, and large machine bases.', r: 'بيبلع الاهتزاز. قوي في الضغط، وضعيف في الشد.', rEn: 'Damps vibration; strong in compression, poor in tension.' },
  { t: 'Ability to dampen vibration', ar: 'امتصاص الاهتزاز', lec: '02', d: 'gray iron has excellent fatigue resistance and an ability to dampen vibration. This is important for applications such as machine tools.', r: 'الرمادي بيبلع الرعشة، ودي مهمة لمكن التشغيل. المرن بيبلع أقل.', rEn: 'Gray iron soaks up vibration (machine tools); ductile iron less so.' },
  { t: 'Ductile iron (nodular iron)', ar: 'الحديد الزهر المرن', lec: '02', d: 'Ductile iron, or nodular iron, applications include crankshafts and heavy-duty gears because of its machinability, fatigue strength, and high modulus of elasticity.', r: 'عمود الكرنك والتروس التقيلة. سهل التشغيل، وقوي في الـ fatigue، وجاسئ.', rEn: 'Crankshafts and heavy-duty gears: machinable, fatigue-strong, stiff.' },
  { t: 'Trace magnesium', ar: 'آثار الماغنسيوم', lec: '02', d: 'Ductile iron contains trace amounts of magnesium, which improves the stiffness, strength, and shock resistance gray iron produces.', r: 'رشة ماغنسيوم بتخلي المرن أجسأ وأقوى ويستحمل الصدمة.', rEn: 'A trace of Mg makes ductile iron stiffer, stronger and more shock resistant.' },
  { t: 'White iron', ar: 'الحديد الزهر الأبيض', lec: '02', d: 'White iron is specified where wear and abrasion resistance are required.', r: 'للتآكل والاحتكاك: كسّارات، وبزابيز، وفحمات فرامل قطر، ودرافيل.', rEn: 'For wear and abrasion: crushers, nozzles, railroad brake shoes, mill rolls.' },
  { t: 'Chilling in the mold', ar: 'التبريد في القالب', lec: '02', d: 'White iron gets its name from the whitish appearance of the metal, caused by chilling selected areas of gray or ductile iron in the mold.', r: 'تبريد سريع لأماكن مختارة من الرمادي أو المرن في القالب بيطلّع حديد أبيض.', rEn: 'Fast-cooling chosen areas of gray or ductile iron in the mold makes white iron.' },
  { t: 'Compacted graphite iron (CGI)', ar: 'حديد الجرافيت المضغوط', lec: '02', d: 'Compacted graphic iron (CGI) is used in automotive engine blocks, brake drums, exhaust manifolds, and high pressure gear pumps.', r: 'قوته زي الرمادي، بيوصّل الحرارة، وتشغيله أسهل من المرن. (السلايد كاتبها graphic.)', rEn: 'Strength like gray, high thermal conductivity, machines better than ductile. (The slide says "graphic".)' },
  { t: 'Malleable iron', ar: 'الحديد الزهر المطاوع', lec: '02', d: 'Malleable iron is white iron that has been transformed by a heat-treatment process, providing a malleable and easily machined iron.', r: 'أبيض + معالجة حرارية. لأسطح التحميل التقيلة، والمعدات الزراعية والبناء.', rEn: 'Heat-treated white iron: heavy-duty bearing surfaces, farm and construction machinery.' },
  { t: 'High-alloy irons', ar: 'حديد زهر عالي السبائك', lec: '02', d: 'High-alloy irons are ductile, gray, or white irons that contain up to 35 percent alloy content.', r: 'رمادي أو مرن أو أبيض، فيه سبائك لحد 35%.', rEn: 'Gray, ductile or white iron with up to 35% alloy.' },
  { t: 'High-chromium irons', ar: 'حديد زهر عالي الكروم', lec: '02', d: 'High-chromium irons are oxidation and wear resistant.', r: 'بيقاوم الأكسدة والتآكل.', rEn: 'Resists oxidation and wear.' },
  { t: 'Nickel irons', ar: 'حديد زهر بالنيكل', lec: '02', d: 'Nickel irons are nonmagnetic, have good corrosion resistance, and have an extremely low coefficient of thermal expansion.', r: 'مش مغناطيسي، وبيقاوم الصدأ، وتمدده الحراري قليل جدًا.', rEn: 'Nonmagnetic, corrosion resistant, and barely expands with heat.' }
];

export const pairs = [
  ['Gray iron', 'excellent fatigue resistance, an ability to dampen vibration; poor tensile, high compressive strength', 'Ductile iron', 'machinability, fatigue strength, high modulus of elasticity; less vibration-dampening capacity than gray iron', 'الرمادي بيبلع الرعشة أكتر. المرن أقوى وأجسأ، بس بيبلع رعشة أقل.', 'Gray damps more; ductile is stiffer and stronger but damps less.'],
  ['White iron', 'gray or ductile iron chilled in the mold; wear and abrasion resistance', 'Malleable iron', 'white iron transformed by a heat-treatment process; malleable and easily machined', 'الأبيض = تبريد في القالب. المطاوع = الأبيض بعد المعالجة الحرارية.', 'White = chilled in the mold. Malleable = white iron, then heat-treated.'],
  ['High-chromium irons', 'oxidation and wear resistant', 'Nickel irons', 'nonmagnetic, good corrosion resistance, extremely low coefficient of thermal expansion', 'كروم = أكسدة وتآكل. نيكل = لا مغناطيس، ولا صدأ، ولا تمدد تقريبًا.', 'Chromium: oxidation + wear. Nickel: no magnet, no rust, almost no expansion.'],
  ['Gray iron', 'engine blocks, gears, flywheels, disc brakes and drums, large machine bases', 'CGI', 'engine blocks, brake drums, exhaust manifolds, high pressure gear pumps', 'بلوك الموتور وطنابير الفرامل في الاتنين. مجمّع العادم وطلمبات التروس للـ CGI بس.', 'Engine blocks and brake drums are in both; manifolds and gear pumps are CGI only.'],
  ['Railroad brake shoes', 'white iron (wear and abrasion resistance)', 'Railroad rolling stock', 'malleable iron (heavy-duty bearing surfaces)', 'فحمات فرامل القطر = أبيض. أسطح التحميل في عربيات القطر = مطاوع.', 'Brake shoes are white iron; rolling-stock bearing surfaces are malleable iron.'],
  ['At least 2% carbon, 1–3% silicon', 'every cast iron', 'Up to 35% alloy', 'high-alloy irons only', 'الـ 2% كربون والـ 1–3% سيليكون لكل الحديد الزهر. الـ 35% سبائك لعالي السبائك بس.', '2% C and 1–3% Si hold for every cast iron; 35% alloy is high-alloy only.']
];

export const triggers = [
  ['dampen vibration · machine tools · flywheels · machine bases', 'Gray iron', '02'],
  ['poor tensile strength · high compressive strength', 'Gray iron', '02'],
  ['crankshafts · heavy-duty gears · trace magnesium', 'Ductile (nodular) iron', '02'],
  ['machinability · fatigue strength · high modulus of elasticity', 'Ductile iron', '02'],
  ['crushers · pulverizers · nozzles · rolling-mill rolls · railroad brake shoes', 'White iron', '02'],
  ['whitish appearance · chilling in the mold', 'White iron', '02'],
  ['exhaust manifolds · high pressure gear pumps', 'Compacted graphite iron (CGI)', '02'],
  ['high thermal conductivity · strength similar to gray iron', 'CGI', '02'],
  ['white iron + heat treatment · heavy-duty bearing surfaces · farm and construction machinery', 'Malleable iron', '02'],
  ['up to 35 percent alloy content', 'High-alloy irons', '02'],
  ['oxidation and wear resistant', 'High-chromium irons', '02'],
  ['nonmagnetic · extremely low thermal expansion', 'Nickel irons', '02'],
  ['at least 2% carbon · 1–3% silicon', 'All cast irons', '02']
];
