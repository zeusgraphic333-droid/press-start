// Trials — iron (Arabic edition). Contract: docs/BRIEF.md § Trials. Engines: games/_iron-play.js (shared with iron.en.js).
import { foundry, routes, odd } from './_iron-play.js';

const END = { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات' };
const IRON_NAMES = { gray: ['رمادي', 'Gray'], ductile: ['مرن', 'Ductile'], white: ['أبيض', 'White'], cgi: ['CGI', 'Compacted'], malleable: ['مطاوع', 'Malleable'], alloy: ['عالي السبائك', 'High-alloy'] };

const foundryGame = foundry({
  ...END,
  title: 'طلبات المسبك', en: 'Foundry orders',
  how: 'الطلبات بتنزل على أرضية المسبك: بلوك موتور، عمود كرنك، درفيل، سطح تحميل… اختار الحديد الصح قبل ما الوقت يخلص. 12 طلب، وتقدر تصب بالأرقام من 1 لـ 6.',
  order: 'طلب', combo: 'كومبو', score: 'سكور', ticket: 'أمر شغل', ask: 'تصب أنهي حديد؟',
  irons: IRON_NAMES,
  late: 'اتأخر', shipped: 'اتشحن', returned: 'مرتجع', timeUp: 'الوقت خلص.', right: 'صح.', wrong: 'لأ.',
  orders: {
    'g-flywheel': ['حدّافة', 'قرص تقيل بيلف مع الموتور', 'الحدّافة (Flywheels) في سلايد الرمادي.'],
    'g-base': ['قاعدة مخرطة', 'لازم تبلع الرعشة عشان القطع يطلع مظبوط', 'امتصاص الاهتزاز في مكن التشغيل = رمادي.'],
    'g-engine': ['بلوك موتور', 'لعربية ملاكي', 'بلوك الموتور: رمادي أو CGI. الاتنين صح.'],
    'g-disc': ['ديسك فرامل', 'لعربية ملاكي', 'Disc brakes and drums = رمادي.'],
    'g-bed': ['قاعدة مكنة تقيلة', 'شايلة أطنان في الضغط، وما ينفعش ترعش', 'قوي في الضغط وبيبلع الاهتزاز = رمادي.'],
    'd-crank': ['عمود كرنك', 'بيلف ويتلوي مع كل شوطة', 'الكرنك = مرن: تشغيل سهل، وfatigue strength، وmodulus عالي.'],
    'd-gear': ['ترس تقيل', 'محتاج fatigue strength ومعامل مرونة عالي', 'Heavy-duty gears = مرن.'],
    'd-mg': ['صبة جاسئة', 'فيها آثار ماغنسيوم، وبتستحمل الصدمة', 'الماغنسيوم بتاع المرن (nodular).'],
    'w-crusher': ['كسّارة', 'لمصنع طوب', 'معدات الطين والطوب = أبيض: تآكل واحتكاك.'],
    'w-nozzle': ['بزبوز طين', 'لخط خلط الطين', 'Nozzles = أبيض.'],
    'w-shoe': ['فحمات فرامل قطر', 'بتحتك في عجل القطر', 'Railroad brake shoes = أبيض، مش المطاوع.'],
    'w-rolls': ['درافيل درفلة', 'بتعصر ألواح الصلب طول اليوم', 'Rolling-mill rolls = أبيض.'],
    'c-manifold': ['مجمّع عادم', 'بيسخن جامد، والحرارة لازم تطلع', 'Exhaust manifolds = CGI: بيوصّل الحرارة.'],
    'c-pump': ['طلمبة تروس', 'شغالة على ضغط عالي', 'High pressure gear pumps = CGI.'],
    'c-drum': ['طنبورة فرامل', 'للوري', 'Brake drums: CGI أو رمادي. الاتنين صح.'],
    'm-bearing': ['سطح تحميل تقيل', 'لدنجل لوري', 'Heavy-duty bearing surfaces = مطاوع.'],
    'm-farm': ['جزء جرار', 'معدات زراعية', 'Farm machinery = مطاوع.'],
    'm-build': ['جزء حفار', 'معدات بناء', 'Construction machinery = مطاوع.'],
    'm-rail': ['سطح تحميل', 'لعربيات القطر (rolling stock)', 'Railroad rolling stock = مطاوع، مش الأبيض.'],
    'a-cr': ['جزء بيتأكسد ويتحك', 'لازم يقاوم الأكسدة والتآكل', 'Oxidation + wear = عالي السبائك (الكروم العالي).'],
    'a-ni': ['جراب جهاز قياس', 'لازم ما يبقاش مغناطيسي', 'Nonmagnetic = عالي السبائك (النيكل).'],
    'a-exp': ['جزء أداة دقيقة', 'مقاسه ما يكبرش لما يسخن', 'Extremely low thermal expansion = عالي السبائك (النيكل).']
  },
  lines: [['المسبك بتاعك.', 'ولا طلب رجع. انت عارف كل حديد شغلانته.'], ['شغل نضيف.', 'كام طلب رجعوا. اقرا سبب كل مرتجع وجرب تاني.'], ['المخزن اتملى مرتجعات.', 'ارجع لفصل «الشغلانة دي لمين؟» وبعدين تعالى.']]
});

const routesGame = routes({
  ...END,
  title: 'من حديد لحديد', en: 'Foundry routes',
  how: 'معاك صبة رمادي أو مرن أو أبيض، والطلب نوع تاني. ضيف الخطوات بالترتيب: تبريد في القالب، معالجة حرارية، سبائك… وبعدين صب. 5 طلبات.',
  round: 'طلب', score: 'سكور', make: 'المطلوب', ask: 'ضيف خطوة', undo: 'شيل آخر خطوة', pour: 'صب وشوف',
  steps: { chill: ['تبريد في القالب', 'chill selected areas in the mold'], heat: ['معالجة حرارية', 'heat-treatment process'], mg: ['رشة ماغنسيوم', 'trace magnesium'], cr: ['سبائك كروم', 'up to 35% chromium'], ni: ['سبائك نيكل', 'up to 35% nickel'] },
  names: { gray: ['رمادي', 'Gray iron'], ductile: ['مرن', 'Ductile iron'], white: ['أبيض', 'White iron'], malleable: ['مطاوع', 'Malleable iron'], highcr: ['كروم عالي', 'High-chromium iron'], nickel: ['نيكل', 'Nickel iron'] },
  orders: { 'r-crusher': 'لكسّارات مصنع طوب', 'r-bearing': 'لأسطح تحميل في لوري', 'r-oxid': 'لجزء لازم يقاوم الأكسدة والتآكل', 'r-nonmag': 'لجراب جهاز لازم ما يبقاش مغناطيسي', 'r-farm': 'لأجزاء جرار', 'r-rolls': 'لدرافيل درفلة' },
  right: 'صح. ده المطلوب.', lost: 'السكة دي مش في السلايدات.', other: n => `طلعلك ${n}، مش المطلوب.`,
  howto: {
    white: 'الأبيض = رمادي أو مرن + تبريد أماكن مختارة في القالب.',
    malleable: 'المطاوع = أبيض + معالجة حرارية. يعني تبريد في القالب الأول، وبعدين معالجة حرارية.',
    highcr: 'الكروم العالي = رمادي أو مرن أو أبيض + سبائك كروم لحد 35%.',
    nickel: 'النيكل = رمادي أو مرن أو أبيض + سبائك نيكل لحد 35%.'
  },
  lines: [['أسطى سباكة.', 'كل الطلبات طلعت زي ما اتطلبت.'], ['قربت.', 'افتكر: أبيض + فرن = مطاوع، وأي واحد + 35% سبائك = عالي السبائك.'], ['السكك اتلخبطت.', 'ارجع لفصل «المطاوع» وبص على السلسلة.']]
});

const oddGame = odd({
  title: 'مين الغريب؟', en: 'Odd one out',
  how: 'أربع حاجات: تلاتة بتوع نوع واحد من الحديد الزهر، وواحدة دخيلة من نوع تاني. لاقي الدخيلة قبل الوقت. 10 جولات.',
  irons: { gray: 'الرمادي <bdi class="en" dir="ltr">Gray iron</bdi>', ductile: 'المرن <bdi class="en" dir="ltr">Ductile iron</bdi>', white: 'الأبيض <bdi class="en" dir="ltr">White iron</bdi>', cgi: 'الـ <bdi class="en" dir="ltr">CGI</bdi>', malleable: 'المطاوع <bdi class="en" dir="ltr">Malleable iron</bdi>', alloy: 'عالي السبائك <bdi class="en" dir="ltr">High-alloy irons</bdi>' },
  prompt: n => `تلاتة من دول بتوع ${n}. مين اللي مش منهم؟`,
  intro: { title: 'مين الغريب؟', text: 'الامتحان بيحب سؤال <bdi class="en" dir="ltr">NOT</bdi>. هنا هتتدرب عليه: تلات حقايق بتوع نوع واحد، والرابعة دخيلة.', rules: ['اضغط على الدخيلة، أو استخدم الأرقام من 1 لـ 4.', 'الدخيلة دايمًا بتاعة نوع تاني من الستة.', 'كل إجابة صح ورا التانية بتعمل كومبو.'] },
  rounds: [
    ['gray', ['Engine blocks', 'Flywheels', 'Large machine bases'], 'Crankshafts', 'الكرنك بتاع المرن (ductile).'],
    ['gray', ['Excellent fatigue resistance', 'Ability to dampen vibration', 'High compressive strength'], 'Oxidation and wear resistant', 'الأكسدة والتآكل بتوع الكروم العالي.'],
    ['ductile', ['Crankshafts', 'Heavy-duty gears', 'Trace amounts of magnesium'], 'Rolling-mill rolls', 'الدرافيل بتاعة الأبيض.'],
    ['ductile', ['Machinability', 'Fatigue strength', 'High modulus of elasticity'], 'Nonmagnetic', 'Nonmagnetic ده النيكل.'],
    ['white', ['Crushers', 'Pulverizers', 'Railroad brake shoes'], 'Railroad rolling stock bearing surfaces', 'Railroad rolling stock بتاع المطاوع، مش الأبيض.'],
    ['white', ['Nozzles', 'Rolling-mill rolls', 'Chilled areas in the mold'], 'Exhaust manifolds', 'مجمّع العادم بتاع الـ CGI.'],
    ['cgi', ['Exhaust manifolds', 'High pressure gear pumps', 'Brake drums'], 'Farm machinery', 'المعدات الزراعية بتاعة المطاوع.'],
    ['cgi', ['Strength similar to gray iron', 'High thermal conductivity', 'Machinability superior to ductile iron'], 'Extremely low thermal expansion', 'التمدد القليل جدًا بتاع النيكل.'],
    ['malleable', ['Heavy-duty bearing surfaces', 'Farm machinery', 'Construction machinery'], 'Clay-mixing nozzles', 'البزابيز بتاعة الأبيض.'],
    ['malleable', ['Made from white iron', 'Heat-treatment process', 'Easily machined'], 'Up to 35% alloy content', 'الـ 35% سبائك بتاعة عالي السبائك.'],
    ['alloy', ['Up to 35% alloy content', 'High-chromium: oxidation and wear resistant', 'Nickel: nonmagnetic'], 'Trace amounts of magnesium', 'الماغنسيوم بتاع المرن.'],
    ['alloy', ['Nonmagnetic', 'Good corrosion resistance', 'Extremely low thermal expansion'], 'Ability to dampen vibration', 'امتصاص الاهتزاز بتاع الرمادي.']
  ]
});

export default [foundryGame, routesGame, oddGame];
