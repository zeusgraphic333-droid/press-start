// Archive tables — compound (L4). Format: docs/BRIEF.md § Archive. `d` is the slide's own wording.
export const terms = [
  { t: 'Compound bending', ar: 'الثني المركّب', lec: '04', d: 'Compound Bending — Moderate to High Cost: Spinning · Hydro-forming · Drawing', r: 'فرع من التشكيل في الحالة الصلبة: برم، وهيدروفورمنج، وسحب. تكلفته من متوسطة لعالية.', rEn: 'Spinning, hydroforming and drawing; moderate to high cost.' },
  { t: 'Spinning', ar: 'البرم', lec: '04', d: 'Metal spinning is a forming process that produces hollow parts that are typically circular in cross-section.', r: 'قرص بيلف على مخرطة، وأداة بتزقه على قالب. بيعمل حاجات مجوّفة مدورة.', rEn: 'A disc spun on a lathe and pressed onto a form: round hollow parts.' },
  { t: 'Blank', ar: 'البلانك', lec: '04', d: 'The basic metal spinning process starts with a flat metal disc (blank), which rotates on a lathe.', r: 'القرص المسطّح اللي بنبدأ بيه، في البرم وفي السحب.', rEn: 'The flat disc you start from, in spinning and in drawing.' },
  { t: 'Mandrel (pattern)', ar: 'القالب', lec: '04', d: 'A forming tool forces the metal sheet onto a wooden or metal pattern as it spins on a special lathe.', r: 'القالب (خشب أو معدن) اللي الصاج بينام عليه وهو بيلف.', rEn: 'The wooden or metal form the spinning sheet is pressed onto.' },
  { t: 'Roller tool', ar: 'أداة الرولة', lec: '04', d: 'spinning forming process: Head stock · Spindle · Mandrel · Sheet metal · Clamp · Tail stock · Roller tool', r: 'الأداة اللي بتزق الصاج على القالب. وفي الرسمة كمان: head stock، spindle، clamp، tail stock.', rEn: 'The tool that presses the sheet onto the mandrel; the figure also labels head stock, spindle, clamp, tail stock.' },
  { t: 'Basic spun shapes', ar: 'أشكال البرم الأساسية', lec: '04', d: 'The basic metal spun shapes are the hemisphere, cone, cylindrical shell.', r: 'نص كورة، ومخروط، واسطوانة مجوّفة.', rEn: 'Hemisphere, cone, cylindrical shell.' },
  { t: 'Hydroforming (fluid forming)', ar: 'التشكيل بالسوائل', lec: '04', d: 'Hydroforming is an economical way to form malleable sheet into lightweight, structurally stiff, and strong compound shapes.', r: 'ضغط الميّه بيشكّل الصاج: خفيف، وجاسئ، وقوي. للإنتاج القليل والمتوسط.', rEn: 'Water pressure forms light, stiff, strong shapes; for low to mid-range production.' },
  { t: 'Concavities', ar: 'التجاويف', lec: '04', d: 'The process uses water pressure, which allows complex shapes with concavities to be formed; this would be difficult or impossible with standard solid die stamping.', r: 'تجاويف صعبة أو مستحيلة على الداي الناشف، والميّه بتعملها.', rEn: 'Concave shapes a solid die struggles with; water can form them.' },
  { t: 'Tube hydroforming', ar: 'هيدروفورمنج المواسير', lec: '04', d: 'There are two types of Hydro forming. 1. Tube Hydro forming 2. Sheet Hydro forming', r: 'ماسورة في قالب مقفول: F axial على الطرفين، والضغط P جوه بينفخها.', rEn: 'A tube in a closed die: F axial on its ends, pressure P inside expands it.' },
  { t: 'Sheet hydroforming', ar: 'هيدروفورمنج الصاج', lec: '04', d: 'Sheet steel is forced into a female cavity by water under pressure from a pump or by press action', r: 'الميّه بتزق الصاج في تجويف أنثى، أو بنش ذكر بيزقه ضد السائل المضغوط.', rEn: 'Water forces the sheet into a female cavity, or a male punch pushes it against the fluid.' },
  { t: 'Drawing (deep drawing)', ar: 'السحب العميق', lec: '04', d: 'Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved, hollow-shaped parts', r: 'البلانك فوق فتحة الداي، والبنش بيزقه جوه: كوبايات وعلب.', rEn: 'The blank sits over the die cavity and the punch pushes it in: cups and boxes.' },
  { t: 'Blank holder', ar: 'ماسك البلانك', lec: '04', d: 'Drawing force · Holding force · Punch · Blank · Blank holder · Die', r: 'بيضغط على أطراف البلانك بقوة المسك (holding force).', rEn: 'Presses the blank’s edges with the holding force.' },
  { t: 'Also known as deep drawing', ar: 'ليه اسمه deep', lec: '04', d: 'Also known as deep drawing (to distinguish it from wire and bar drawing)', r: 'عشان نفرّقه عن سحب السلك والقضبان.', rEn: 'Named “deep” to tell it apart from wire and bar drawing.' }
];

export const pairs = [
  ['Spinning', 'a flat disc on a lathe; a roller tool forces it onto a mandrel; symmetrical, cup-like shapes', 'Deep drawing', 'a blank over a die cavity; a punch pushes it in; cup-shaped, box-shaped parts', 'الاتنين بيعملوا كوبايات. البرم = مخرطة ورولة. السحب = بنش وداي.', 'Both make cups: spinning uses a lathe and a roller, drawing a punch and a die.'],
  ['Tube hydroforming', 'a tube in a closed die; F axial on the ends, pressure P inside', 'Sheet hydroforming', 'sheet forced into a female cavity by water, or deformed by a male punch against fluid', 'المواسير = F axial + P. الصاج = female cavity، أو male punch ضد السائل.', 'Tube: F axial + P. Sheet: a female cavity, or a male punch against fluid.'],
  ['Clamp', 'spinning: holds the sheet against the mandrel, pushed by the tail stock', 'Blank holder', 'drawing: presses the blank’s edges with the holding force', 'الـ clamp في البرم. الـ blank holder في السحب.', 'Clamp = spinning. Blank holder = drawing.'],
  ['Drawing force', 'acts on the punch', 'Holding force', 'acts on the blank holder', 'قوة السحب على البنش. قوة المسك على الماسك.', 'Drawing force → punch. Holding force → blank holder.'],
  ['Fluid forming', 'another name for hydroforming', 'Flow forming', 'only an assignment report on the spinning slide', 'fluid = hydroforming. flow = تكليف.', 'Fluid forming is hydroforming; flow forming is only an assignment.'],
  ['Compound bending', 'moderate to high cost', 'Simple bending', 'low to moderate cost (form and cut / stamping: high)', 'المركّب أغلى من البسيط، وأرخص من الـ stamping.', 'Compound costs more than simple bending and less than stamping.']
];

export const triggers = [
  ['lathe · mandrel · roller tool · flat disc (blank)', 'Spinning', '04'],
  ['circular in cross-section · symmetrical, cup-like shapes', 'Spinning', '04'],
  ['hemisphere · cone · cylindrical shell', 'Basic metal spun shapes', '04'],
  ['venturi · hopper · tank head · trumpet base · funeral urn', 'Spinning products', '04'],
  ['thickness reduced in the side walls', 'Spinning', '04'],
  ['water pressure · concavities', 'Hydroforming (fluid forming)', '04'],
  ['low to mid-range production', 'Hydroforming', '04'],
  ['lightweight, structurally stiff, and strong', 'Hydroforming', '04'],
  ['F axial · pressure P · tube in a closed die', 'Tube hydroforming', '04'],
  ['female cavity · male punch against fluid', 'Sheet hydroforming', '04'],
  ['car frame rail', 'Hydroforming', '04'],
  ['blank holder · punch · die cavity', 'Drawing (deep drawing)', '04'],
  ['beverage cans · automobile body panels', 'Deep drawing', '04'],
  ['to distinguish it from wire and bar drawing', 'Deep drawing', '04'],
  ['moderate to high cost', 'Compound bending', '04']
];
