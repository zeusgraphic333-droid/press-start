// Archive tables — bend (Lecture 3). Format: docs/BRIEF.md § Archive. `d` is the slide's own wording.
export const terms = [
  { t: 'Solid state forming', ar: 'التشكيل في الحالة الصلبة', lec: '03', d: 'Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working.', r: 'تشكيل صاج أو سيخ أو سلك أو ماسورة، وغالبًا على البارد.', rEn: 'Shaping sheet, rod, wire or tube, usually cold.' },
  { t: 'Annealing', ar: 'التلدين', lec: '03', d: 'During the forming process, some metals can become brittle and may require annealing before the forming operation is continued.', r: 'لما المعدن يبقى قصيف وسط الشغل، بنلدّنه قبل ما نكمّل.', rEn: 'When metal turns brittle mid-forming, anneal it before going on.' },
  { t: 'Sheet metal', ar: 'الصاج', lec: '03', d: 'A piece of metal whose thickness is between 0.006 (0.15 mm) and 0.25 inches (6.35 mm) called sheet metal.', r: 'تخانته من 0.15 لحد 6.35 mm.', rEn: 'Between 0.15 mm and 6.35 mm thick.' },
  { t: 'Foil · Plate', ar: 'الفويل والبليت', lec: '03', d: 'Anything thinner is referred to as a foil and thicker is considered as a plate.', r: 'أرفع من 0.15 mm = فويل. أتخن من 6.35 mm = بليت.', rEn: 'Thinner than sheet = foil; thicker = plate.' },
  { t: 'Punch-and-die', ar: 'البنش والداي', lec: '03', d: 'Punch-and-die - tooling to perform cutting, bending, and drawing.', r: 'العدة: بتقطع وتثني وتسحب.', rEn: 'The tooling: cuts, bends and draws.' },
  { t: 'Stamping press', ar: 'مكبس الختم', lec: '03', d: 'Stamping press - machine tool that performs most sheet metal operations.', r: 'الماكينة اللي بتعمل معظم عمليات الصاج.', rEn: 'The machine that does most sheet metal work.' },
  { t: 'Stampings', ar: 'المنتجات المكبوسة', lec: '03', d: 'Stampings - sheet metal products.', r: 'المنتجات اللي طالعة من الصاج.', rEn: 'The products made from sheet.' },
  { t: 'Bending', ar: 'الثني', lec: '03', d: 'Bending is a metal forming process in which a force is applied to a piece of sheet metal, causing it to bend at an angle and form the desired shape.', r: 'قوة على الصاج، فيتثني بزاوية وياخد الشكل.', rEn: 'A force bends the sheet to an angle and a shape.' },
  { t: 'Neutral plane (neutral axis)', ar: 'المحور المتعادل', lec: '03', d: 'Metal on inside of neutral plane is compressed, while metal on outside of neutral plane is stretched.', r: 'جوه بيتكبس، بره بيتمط، واللي بينهم طوله ثابت.', rEn: 'Inside squeezes, outside stretches; the neutral axis keeps its length.' },
  { t: 'Bend allowance (BA)', ar: 'سماح الثني', lec: '03', d: 'Length of neutral axis in bend area. Bend allowances are calculated using a K-factor. Lt = A + B + BA.', r: 'طول المحور المتعادل في الثنية. بنجمعه: Lt = A + B + BA.', rEn: 'The neutral axis length in the bend; add it: Lt = A + B + BA.' },
  { t: 'Bend deduction (BD)', ar: 'خصم الثني', lec: '03', d: 'Lt = A + B − BD, where Lt is the total flat length, A and B are shown in the illustration, BD is the bend deduction value.', r: 'لما A وB لحد الركن الخارجي، بنطرح الـ BD.', rEn: 'When A and B run to the outside corner, subtract BD.' },
  { t: 'K-factor', ar: 'معامل K', lec: '03', d: 'K-factor is a ratio that represents the location of the neutral sheet with respect to the thickness of the sheet metal part. K Factor = t/T.', r: 'نسبة بتقول المحور فين جوه التخانة: K = t/T.', rEn: 'Where the neutral axis sits in the thickness: K = t/T.' },
  { t: 'Auto relief (bend relief)', ar: 'فتحة التخفيف', lec: '03', d: 'The size and shape of the relief cut is much important for sheet metal bending. Sheet metal process relief is most important for the accurate bending. Types: Tear-rip, Obround, Rectangle.', r: 'قطع صغير عند آخر الثنية: Tear-rip أو Obround أو Rectangle.', rEn: 'A small cut where a bend stops: tear-rip, obround or rectangle.' },
  { t: 'Bend radius', ar: 'نصف قطر الثني', lec: '03', d: 'Inside curvature, is the minimum radius one can bend a pipe, tube, sheet, cable or hose without kinking it, damaging it, or shortening its life.', r: 'أصغر نص قطر من جوه تثني بيه من غير kink ولا تلف.', rEn: 'The smallest inside radius that bends it without harm.' },
  { t: 'V-bending', ar: 'الثني على V', lec: '03', d: 'V-bending - performed with a V-shaped die. For low production. Performed on a press brake. V-dies are simple and inexpensive.', r: 'داي V، كمية قليلة، press brake، عدة رخيصة.', rEn: 'V-shaped die, low production, press brake, cheap dies.' },
  { t: 'Air bending', ar: 'الثني في الهوا', lec: '03', d: 'If the punch does not force the sheet to the bottom of the die cavity, leaving space or air underneath, it is called "air bending".', r: 'البنش بيقف قبل القاع، وتحت الصاج هوا.', rEn: 'The punch stops short of the bottom, with air under the sheet.' },
  { t: 'Edge bending', ar: 'ثني الحافة', lec: '03', d: 'Edge Bending: For high production. Pressure pad required. Dies are more complicated and costly.', r: 'كمية كبيرة، pressure pad، وداي أعقد وأغلى.', rEn: 'High production, a pressure pad, costlier dies.' },
  { t: 'Spring back', ar: 'الارتداد', lec: '03', d: 'Increase in included angle of bent part relative to included angle of forming tool after tool is removed.', r: 'القطعة بتفتح شوية بعد ما العدة تتشال.', rEn: 'The part opens a little once the tool is removed.' },
  { t: 'Bending operations', ar: 'عمليات الثني', lec: '03', d: 'Straight flanging · Stretch flanging · Shrink flanging · Hemming · Seaming · Curling (drawings only on the slide).', r: 'ست أسماء مع رسوماتهم: ٣ flanging وhemming وseaming وcurling.', rEn: 'Six names with drawings: three flangings, hemming, seaming, curling.' },
  { t: 'Roll forming sheet', ar: 'درفلة الصاج', lec: '03', d: 'Roll forming sheet on one axis is an inexpensive operation. Hand-operated machines with an adjustable roll provide a range of rolling radii (r). These machines are typically used in small model shops.', r: '٣ رولات بالإيد، رخيصة، لورش النماذج.', rEn: 'Three hand-turned rolls: cheap, for small model shops.' },
  { t: 'Continuous roll forming', ar: 'الدرفلة المستمرة', lec: '03', d: 'A long strip of sheet metal is passed through sets of rolls mounted on consecutive stands, each set performing only an incremental part of the bend. Ideal for constant-profile parts with long lengths and in large quantities.', r: 'شريط طويل على محطات، كل واحدة حتة من الثنية.', rEn: 'A strip through stand after stand, a little bend at each.' },
  { t: 'Wire forming', ar: 'تشكيل السلك', lec: '03', d: 'Forming wire requires special tooling but is an economical production process. Formed and spot-welded wire is strong and has applications in many industries.', r: 'عدة خاصة بس اقتصادي، والملحوم بالنقطة قوي.', rEn: 'Special tooling but economical; spot-welded wire is strong.' },
  { t: 'Mandrel', ar: 'المندريل (سند داخلي)', lec: '03', d: 'Forming tubes and other hollow sections require an internal support called a mandrel to prevent buckling of tubes during the bending process.', r: 'سند من جوه الماسورة عشان ما تتطبقش.', rEn: 'An inside support so the tube does not buckle.' }
];

export const pairs = [
  ['V-bending', 'For low production · performed on a press brake · V-dies are simple and inexpensive', 'Edge bending', 'For high production · pressure pad required · dies are more complicated and costly', 'V = كمية قليلة وعدة رخيصة. Edge = كمية كبيرة وpressure pad وعدة غالية.', 'V: few parts, cheap dies. Edge: many parts, a pressure pad, costly dies.'],
  ['Bend allowance (BA)', 'Lt = A + B + BA · A and B stop where the bend starts', 'Bend deduction (BD)', 'Lt = A + B − BD · A and B run to the outside corner', 'الـ BA بنجمعه، والـ BD بنطرحه. والسر في A وB بيتقاسوا لحد فين.', 'Add BA, subtract BD; it depends on where A and B are measured to.'],
  ['Air bending', 'The punch does not force the sheet to the bottom of the die cavity: air underneath', 'Bottoming', 'The sheet is forced down to the bottom of the V-die', 'هوا تحت الصاج = air bending. لازق في القاع = bottoming.', 'Air under the sheet = air bending; pressed to the bottom = bottoming.'],
  ['Included angle', 'Springback increases it (the part opens)', 'Bend angle', 'Springback decreases it · bend angle + included angle = 180°', 'المحصورة بتكبر وزاوية الثني بتصغر: نفس المعلومة.', 'Included angle up, bend angle down: the same fact.'],
  ['Foil', 'Thinner than sheet metal (below 0.15 mm / 0.006 in)', 'Plate', 'Thicker than sheet metal (above 6.35 mm / 0.25 in)', 'أقل من 0.15 = فويل. أكتر من 6.35 = بليت.', 'Under 0.15 mm = foil; over 6.35 mm = plate.'],
  ['Roll forming sheet', 'One axis · inexpensive · hand-operated, adjustable roll · small model shops', 'Continuous roll forming', 'Consecutive stands · incremental bends · constant profile, long lengths, large quantities', 'باليد للنماذج، والمستمرة للكميات.', 'By hand for models; continuous for mass production.'],
  ['Stamping press', 'Machine tool that performs most sheet metal operations', 'Stampings', 'Sheet metal products', 'الـ press ماكينة، والـ stampings منتجات.', 'The press is the machine; stampings are the products.'],
  ['Simple Bending', 'Low to Moderate Cost: Bend · Roll · Continuous Roll Forming', 'Compound Bending', 'Moderate to High Cost: Spinning · Hydro-forming · Drawing', 'البسيط رخيص لمتوسط، والمركّب متوسط لغالي، والـ stamping غالي.', 'Simple: low–moderate. Compound: moderate–high. Stamping: high.']
];

export const triggers = [
  ['pressure pad, high production, costly dies', 'Edge bending', '03'],
  ['V-shaped die, press brake, low production', 'V-bending', '03'],
  ['the punch does not force the sheet to the bottom, air underneath', 'Air bending', '03'],
  ['length of neutral axis in bend area', 'Bend allowance', '03'],
  ['location of the neutral sheet, ratio, t/T', 'K-factor', '03'],
  ['increase in included angle after tool is removed', 'Spring back', '03'],
  ['decrease in bend angle, increase in bend radius', 'Spring back', '03'],
  ['without kinking, damaging, or shortening its life', 'Bend radius', '03'],
  ['internal support, prevent buckling of tubes', 'Mandrel', '03'],
  ['consecutive stands, incremental part of the bend, constant profile', 'Continuous roll forming', '03'],
  ['hand-operated, adjustable roll, small model shops', 'Roll forming sheet', '03'],
  ['thinner than 0.15 mm (0.006 in)', 'Foil', '03'],
  ['thicker than 6.35 mm (0.25 in)', 'Plate', '03'],
  ['become brittle during forming', 'Annealing', '03'],
  ['tear-rip, obround, rectangle', 'Auto relief types', '03'],
  ['machine tool that performs most sheet metal operations', 'Stamping press', '03'],
  ['Lt = A + B − BD', 'Bend deduction', '03'],
  ['special tooling but economical, spot-welded', 'Wire forming', '03']
];
