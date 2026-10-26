// Lesson — iron (Arabic edition). L2 · S16–S21: the cast irons — the recipe, the six kinds, and which job each one gets.
// Block reference: content/lessons/_sample.js · house rules: docs/BRIEF.md. Drawings: _iron-art.js · demos: _iron-demos.js.
import { MICRO, GLY, castArt, wroughtArt, tensionArt, compressionArt, crankArt, rollsArt, chillArt, chainArt, alloyArt } from './_iron-art.js';
import { recipeDemo, dampDemo, finderDemo } from './_iron-demos.js';

const W_RECIPE = {
  carbon: 'كربون C', silicon: 'سيليكون Si', pot: 'بوتقة فيها حديد سايح',
  ok: 'تمام. الخلطة دي ماشية مع قاعدة السلايد لكل حديد زهر.',
  lowC: 'الكربون قليل. كل حديد زهر فيه 2% كربون على الأقل.',
  lowSi: 'السيليكون قليل. لازم يبقى من 1 لـ 3%.',
  highSi: 'السيليكون كتير. لازم يبقى من 1 لـ 3% بس.'
};
const W_DAMP = {
  gray: 'رمادي', grayLine: 'Gray iron', ductile: 'مرن', ductileLine: 'Ductile iron', hit: 'اخبط على القاعدتين', again: 'اخبط تاني',
  after: 'الرمادي هدي بسرعة: <bdi class="en" dir="ltr">an ability to dampen vibration</bdi>. المرن لسه بيرعش: <bdi class="en" dir="ltr">less vibration-dampening capacity than gray iron</bdi>.'
};
const W_FIND = {
  pick: 'الشغلانات', hint: 'دوس على أي شغلانة، وشوف مين اللي بياخدها.', two: 'نوعين!',
  irons: { gray: ['رمادي', 'Gray'], ductile: ['مرن', 'Ductile'], white: ['أبيض', 'White'], cgi: ['CGI', 'Compacted graphite'], malleable: ['مطاوع', 'Malleable'], alloy: ['عالي السبائك', 'High-alloy'] },
  apps: {
    engine: ['Engine blocks', 'بلوك الموتور: مكتوب في الرمادي وفي الـ CGI.'],
    gears: ['Gears', 'التروس: في سلايد الرمادي.'],
    hdgears: ['Heavy-duty gears', 'التروس التقيلة: في سلايد المرن، جنب الكرنك.'],
    flywheel: ['Flywheels', 'الحدّافة: رمادي.'],
    disc: ['Disc brakes', 'ديسكات الفرامل: رمادي (disc brakes and drums).'],
    drum: ['Brake drums', 'طنابير الفرامل: الرمادي (drums) والـ CGI (brake drums).'],
    bases: ['Machine bases', 'قواعد المكن الكبيرة: رمادي. بيبلع الاهتزاز.'],
    crank: ['Crankshafts', 'عمود الكرنك: مرن. تشغيل، وfatigue، وmodulus عالي.'],
    crusher: ['Crushers · pulverizers · nozzles', 'معدات الطين والطوب: أبيض. تآكل واحتكاك.'],
    shoes: ['Railroad brake shoes', 'فحمات فرامل القطر: أبيض.'],
    rolls: ['Rolling-mill rolls', 'درافيل الدرفلة: أبيض.'],
    manifold: ['Exhaust manifolds', 'مجمّع العادم: CGI. بيوصّل الحرارة كويس.'],
    pump: ['High-pressure gear pumps', 'طلمبات التروس على ضغط عالي: CGI.'],
    bearing: ['Heavy-duty bearing surfaces', 'أسطح التحميل التقيلة (عربيات، لوريات، قطر): مطاوع.'],
    farm: ['Farm & construction machinery', 'المعدات الزراعية ومعدات البناء: مطاوع.'],
    oxid: ['Oxidation + wear resistant', 'بيقاوم الأكسدة والتآكل: عالي السبائك (الكروم العالي).'],
    nonmag: ['Nonmagnetic · low expansion', 'مش مغناطيسي وتمدده قليل جدًا: عالي السبائك (النيكل).']
  }
};

export default {
  zone: 'iron',
  hero: { say: 'ستة أنواع حديد زهر، وكل نوع ليه شغلانة. الامتحان هيقولك الشغلانة، وانت تقوله النوع.' },
  chapters: [
    {
      id: 'ir-intro', title: 'الحديد الزهر: الوصفة', en: 'Ferrous metals: what every cast iron contains', ref: 'L2 · S16', scene: 'castIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'قبل الأنواع الستة، اعرف العيلة. الحديد الزهر هو الحديد اللي بيسيح ويتصب في قالب.' },
        { t: 'quote', ref: 'L2 · S16', text: 'Hardness is an important mechanical property for certain applications', ar: 'الصلادة خاصية ميكانيكية مهمة في استخدامات معينة.' },
        { t: 'p', text: 'السلايد بيفتح بالصلادة (<en>hardness</en>): إن المعدن يقاوم الخدش والاختراق. افتكرها من درس الخواص (L2 · S11).' },
        { t: 'quote', ref: 'L2 · S16', text: 'Irons are available as cast or wrought.', ar: 'الحديد بييجي زهر (مصبوب) أو مشغول.' },
        { t: 'compare', left: { title: 'مصبوب', en: 'Cast', art: castArt('حديد سايح بيتصب في قالب'), text: 'الحديد بيسيح، ويتصب في قالب، ويتجمد على شكله. ده الحديد الزهر (<en>cast iron</en>).' }, right: { title: 'مشغول', en: 'Wrought', art: wroughtArt('حديد بيتطرق على السندان'), text: 'الحديد بيتشكّل وهو جامد: بالطرق أو بالدرفلة. ده الـ <en>wrought iron</en>.' }, note: 'الأنواع الستة اللي جاية كلها <en>cast</en>.' },
        { t: 'check', q: 'ir03' },
        { t: 'quote', ref: 'L2 · S16', text: 'All cast irons contains at least 2 percent carbon and from 1–3 percent silicon.', ar: 'كل حديد زهر فيه كربون 2% على الأقل، وسيليكون من 1 لـ 3%.' },
        { t: 'demo', id: 'irn-recipe', title: 'اظبط الوصفة', caption: 'حرّك الكربون والسيليكون. البوتقة هتقولك: الخلطة دي ماشية مع قاعدة السلايد ولا لأ.', mount: recipeDemo(W_RECIPE) },
        { t: 'check', q: 'ir01' },
        { t: 'trap', text: 'الأرقام دي بتتلخبط: الكربون **2% على الأقل**. السيليكون **من 1 لـ 3%**. أما الـ 35% فدي نسبة السبائك في نوع تاني خالص، هتقابله في الآخر.', wrong: 'at least 1–3 percent carbon', right: 'at least 2 percent carbon · 1–3 percent silicon' },
        { t: 'check', q: 'ir02' },
        { t: 'tip', text: '«كربون اتنين وفوق، سيليكون من واحد لتلاتة.»' }
      ]
    },
    {
      id: 'ir-six', title: 'ستة أنواع، ستة شغلانات', en: 'The six kinds of iron', ref: 'L2 · S16–S21', scene: 'irons',
      blocks: [
        { t: 'say', who: 'usta', text: 'الحديد الزهر عيلة فيها ستة إخوات. كل واحد ليه طبع، وليه شغلانة.' },
        { t: 'quote', ref: 'L2 · S16–S21', text: 'The six kinds of iron are: 1- Gray iron · 2- Ductile iron, or nodular iron · 3- White iron · Compacted graphic iron (CGI) · Malleable iron · High-alloy irons', ar: 'الأنواع الستة: الرمادي، والمرن (النودولار)، والأبيض، والـ CGI، والمطاوع، وعالي السبائك.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'الرمادي', en: 'Gray iron', art: MICRO.gray, text: 'بلوك الموتور، والحدّافة، وقواعد المكن. بيبلع الاهتزاز.' },
          { title: 'المرن', en: 'Ductile · nodular', art: MICRO.ductile, text: 'عمود الكرنك والتروس التقيلة. فيه ماغنسيوم.' },
          { title: 'الأبيض', en: 'White iron', art: MICRO.white, text: 'الكسّارات والدرافيل. بيقاوم التآكل والاحتكاك.' },
          { title: 'الـ CGI', en: 'Compacted graphite', art: MICRO.cgi, text: 'بلوك الموتور ومجمّع العادم. بيوصّل الحرارة كويس.' },
          { title: 'المطاوع', en: 'Malleable iron', art: MICRO.malleable, text: 'أبيض اتعمله معالجة حرارية. لأسطح التحميل التقيلة.' },
          { title: 'عالي السبائك', en: 'High-alloy irons', art: MICRO.alloy, text: 'سبائك لحد 35%: كروم أو نيكل.' }
        ] },
        { t: 'p', text: 'قلّب الكروت. الرسمة اللي على كل كارت تخيّل لشكل الحديد من جوه تحت الميكروسكوب: قشور، وكور، ودود. دي للتخيّل بس. السلايدات ما فيهاش الرسومات دي.' },
        { t: 'check', q: 'ir05' },
        { t: 'why', text: 'ليه ستة؟ نفس الحديد، بس تغيّر حاجة صغيرة: رشة ماغنسيوم، أو تبريد سريع في القالب، أو معالجة حرارية، أو سبائك. فيطلع بطبع تاني خالص، ولشغلانة تانية.' },
        { t: 'trap', text: 'السلايد قال «<en>cast or wrought</en>». بس الـ <en>wrought iron</en> **مش** من الستة. الستة كلهم حديد زهر.', wrong: 'Wrought iron is one of the six kinds', right: 'Gray · Ductile · White · CGI · Malleable · High-alloy' },
        { t: 'check', q: 'ir06' },
        { t: 'tip', text: 'احفظ الترتيب بجملة: <en>**G**ray **D**ucks **W**ear **C**ool **M**etal **H**ats</en> = <en>Gray, Ductile, White, CGI, Malleable, High-alloy</en>.' }
      ]
    },
    {
      id: 'ir-gray', title: 'الرمادي: بيبلع الرعشة', en: 'Gray iron', ref: 'L2 · S16', scene: 'grayIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'أول واحد في العيلة، وأشهرهم. بيشتغل في العربية، وفي الورشة.' },
        { t: 'quote', ref: 'L2 · S16', text: '1- Gray iron is used in automotive engine blocks, gears, flywheels, disc brakes and drums, and large machine bases.', ar: 'الحديد الزهر الرمادي بيستخدم في بلوك موتور العربية، والتروس، والحدّافات، وديسكات وطنابير الفرامل، وقواعد المكن الكبيرة.' },
        { t: 'grid', cols: 5, items: [
          { title: 'بلوك الموتور', en: 'Engine blocks', art: GLY.engine },
          { title: 'التروس', en: 'Gears', art: GLY.gear },
          { title: 'الحدّافة', en: 'Flywheels', art: GLY.flywheel },
          { title: 'الفرامل', en: 'Disc brakes & drums', art: GLY.brake },
          { title: 'قاعدة المكنة', en: 'Large machine bases', art: GLY.base }
        ] },
        { t: 'p', text: 'الدكتور كاتب اسمه بالعربي على السلايد: **الحديد الزهر الرمادي**. وخد بالك: تلات شغلانات من دول هتقابلهم تاني مع أنواع تانية. هنجمعهم في آخر الدرس.' },
        { t: 'quote', ref: 'L2 · S16', text: 'gray iron has excellent fatigue resistance and an ability to dampen vibration. This is important for applications such as machine tools.', ar: 'الرمادي مقاومته للـ fatigue ممتازة، وبيقدر يمتص الاهتزاز. ودي حاجة مهمة في حاجات زي مكن التشغيل.' },
        { t: 'demo', id: 'irn-damp', title: 'اخبط على القاعدة', caption: 'نفس الخبطة على قاعدتين: واحدة رمادي، وواحدة مرن. بص الرعشة بتموت فين أسرع.', mount: dampDemo(W_DAMP) },
        { t: 'p', text: 'الـ <en>fatigue</en> هو الحمل اللي بيتكرر ملايين المرات: لفة ورا لفة، ورعشة ورا رعشة. الرمادي بيستحمله. ومكنة التشغيل لو بترعش، القطعة بتطلع وحشة. عشان كده قاعدتها رمادي.' },
        { t: 'check', q: 'ir08' },
        { t: 'quote', ref: 'L2 · S16', text: 'Although gray iron has poor tensile strength and a lower impact strength than that of most other cast ferrous metals, it has a high compressive strength.', ar: 'الرمادي ضعيف في الشد، ومقاومته للصدمات أقل من معظم الحديد الزهر التاني. بس قوي جدًا في الضغط.' },
        { t: 'compare', left: { title: 'ضغط', en: 'Compression', art: compressionArt('الرمادي تحت الضغط: قوي'), text: 'قوي. حمّل عليه تقيل، يستحمل. زي قاعدة مكنة شايلة طن.' }, right: { title: 'شد', en: 'Tension', art: tensionArt('الرمادي تحت الشد: ضعيف'), text: 'ضعيف. اسحبه من الطرفين، يتكسر. والخبطة المفاجئة (<en>impact</en>) برضه مش بيحبها.' }, note: 'رمادي = <en>poor tensile · high compressive</en>' },
        { t: 'trap', text: 'صح ولا غلط: «الحديد الرمادي قوي في الشد». **غلط**. هو ضعيف في الشد (<en>poor tensile strength</en>)، وقوي في الضغط (<en>high compressive strength</en>).', wrong: 'Gray iron has high tensile strength', right: 'Poor tensile strength · lower impact strength · high compressive strength' },
        { t: 'check', q: 'ir10' },
        { t: 'tip', text: 'الرمادي «هادي وتقيل»: بيبلع الرعشة، ويشيل في الضغط، ويخاف من الشد والخبط.' }
      ]
    },
    {
      id: 'ir-ductile', title: 'المرن: عمود الكرنك', en: 'Ductile (nodular) iron', ref: 'L2 · S17', scene: 'ductileIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'التاني اسمه <en>ductile</en>، ولقبه <en>nodular</en>. اسمين لنفس الحديد. احفظ الاتنين.' },
        { t: 'quote', ref: 'L2 · S17', text: '2-Ductile iron, or nodular iron, applications include crankshafts and heavy-duty gears because of its machinability, fatigue strength, and high modulus of elasticity. But it has less vibration-dampening capacity than gray iron.', ar: 'الحديد الزهر المرن (النودولار) بيستخدم في عمود الكرنك والتروس التقيلة. ليه؟ عشان سهل يتشغّل، وقوي في الـ fatigue، ومعامل مرونته عالي. بس امتصاصه للاهتزاز أقل من الرمادي.' },
        { scene: 'crankshaft', t: 'art', html: crankArt('عمود كرنك'), caption: 'عمود الكرنك بيلف مع كل شوطة في الموتور، وبيتلوي، وما بيرتاحش. فاكر الـ <en>torsion</en>؟ (L2 · S5)' },
        { t: 'list', style: 'check', items: ['<en>Machinability</en>: سهل يتشغّل ويتخرط على المكن.', '<en>Fatigue strength</en>: يستحمل الحمل اللي بيتكرر.', '<en>High modulus of elasticity</en>: جاسئ. ما بيتنيش بسهولة تحت الحمل.'] },
        { t: 'check', q: 'ir13' },
        { t: 'quote', ref: 'L2 · S17', text: 'Ductile iron contains trace amounts of magnesium, which improves the stiffness, strength, and shock resistance gray iron produces.', ar: 'المرن فيه كميات صغيرة جدًا من الماغنسيوم. الماغنسيوم ده بيحسّن الجساءة والقوة ومقاومة الصدمات اللي الرمادي بيديها.' },
        { t: 'p', text: 'يعني خد اللي الرمادي بيعرف يعمله، وزوّد عليه رشة **ماغنسيوم** (<en>Mg</en>). يطلع حديد أجسأ، وأقوى، ويستحمل الخبط أكتر.' },
        { t: 'compare', left: { title: 'الرمادي', en: 'Gray iron', text: 'بيمتص الاهتزاز **أكتر**. ضعيف في الشد والخبط.' }, right: { title: 'المرن', en: 'Ductile iron', text: 'أجسأ وأقوى ويستحمل الصدمة. بس بيمتص اهتزاز **أقل** من الرمادي.' }, note: 'مفيش حد كسبان في كل حاجة. كل واحد لشغلانته.' },
        { t: 'trap', text: 'المرن **مش** أحسن في امتصاص الاهتزاز. السلايد قالها صريحة: <en>less vibration-dampening capacity than gray iron</en>.', wrong: 'Ductile iron damps vibration better than gray iron', right: 'Ductile iron has less vibration-dampening capacity than gray iron' },
        { t: 'check', q: 'ir15' },
        { t: 'tip', text: 'المرن = كرنك + ماغنسيوم. واسمه التاني <en>nodular</en>.' }
      ]
    },
    {
      id: 'ir-white', title: 'الأبيض: سنان الكسّارة', en: 'White iron', ref: 'L2 · S18', scene: 'whiteIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'الأبيض ده الناشف بتاع العيلة. شغلانته الطحن والاحتكاك، طول اليوم.' },
        { t: 'quote', ref: 'L2 · S18', text: '3- White iron is specified where wear and abrasion resistance are required for applications such as clay mixing and brickmaking equipment such as crushers, pulverizes, and nozzles; railroad brake shoes, and rolling-mill rolls.', ar: 'الحديد الأبيض بيتحدد لما نكون محتاجين مقاومة للتآكل والبري: معدات خلط الطين وعمل الطوب زي الكسّارات والطواحين والبزابيز، وفحمات فرامل القطر، ودرافيل مصانع الدرفلة.' },
        { t: 'art', html: rollsArt('درافيل بتعصر لوح معدن'), caption: 'الدرافيل بتعصر المعدن طول اليوم. محتاجة سطح ما يتآكلش.' },
        { t: 'p', text: '⚠ السلايد كاتبها <en>pulverizes</en>. الصح <en>pulverizers</en>: الطواحين اللي بتطحن الحاجة لحد ما تبقى بودرة.' },
        { t: 'check', q: 'ir18' },
        { t: 'quote', ref: 'L2 · S18', text: 'White iron gets its name from the whitish appearance of the metal, caused by chilling selected areas of gray or ductile iron in the mold.', ar: 'الأبيض اخد اسمه من لونه المايل للأبيض. اللون ده بييجي من تبريد أماكن مختارة من حديد رمادي أو مرن، وهو لسه جوه القالب.' },
        { t: 'art', html: chillArt('قالب فيه حتة معدن بتبرّد جزء من الصبة'), caption: 'حتة معدن تقيلة جوه القالب (<en>chill</en>) بتسحب الحرارة بسرعة. المكان اللي جنبها يطلع أبيض، والباقي يفضل رمادي.' },
        { t: 'why', text: 'السلايد ما قالش ليه بيبيض. الفكرة ببساطة: لما الحديد يبرد بسرعة، الكربون ما يلحقش يطلع جرافيت رمادي. فالمعدن يطلع ناشف، ولون كسرته فاتح.' },
        { t: 'trap', text: 'كلمة <en>railroad</en> جت مرتين: الأبيض = <en>railroad brake shoes</en> (فحمات فرامل القطر). المطاوع = <en>railroad rolling stock</en> (أسطح التحميل في عربيات القطر). وكلمة <en>brake</en> جت كمان مع الرمادي (<en>disc brakes and drums</en>).', wrong: 'Railroad brake shoes → Malleable iron', right: 'Railroad brake shoes → White iron (wear and abrasion)' },
        { t: 'check', q: 'ir21' },
        { t: 'tip', text: 'الأبيض = طحن واحتكاك: «كسّارة، طاحونة، بزبوز، فحمة فرامل قطر، درفيل». واسمه جاي من التبريد في القالب.' }
      ]
    },
    {
      id: 'ir-cgi', title: 'الـ CGI: الجرافيت المضغوط', en: 'Compacted graphite iron (CGI)', ref: 'L2 · S19', scene: 'cgi',
      blocks: [
        { t: 'say', who: 'usta', text: 'الـ CGI بيعمل شغل الرمادي في الموتور. وزيادة عليه: بيوصّل الحرارة كويس، وبيتشغّل بسهولة.' },
        { t: 'quote', ref: 'L2 · S19', text: 'Compacted graphic iron (CGI) is used in automotive engine blocks, brake drums, exhaust manifolds, and high pressure gear pumps.', ar: 'الـ CGI بيستخدم في بلوك موتور العربية، وطنابير الفرامل، ومجمّعات العادم، وطلمبات التروس اللي شغالة على ضغط عالي.' },
        { t: 'grid', cols: 4, items: [
          { title: 'بلوك الموتور', en: 'Engine blocks', art: GLY.engine },
          { title: 'طنابير الفرامل', en: 'Brake drums', art: GLY.brake },
          { title: 'مجمّع العادم', en: 'Exhaust manifolds', art: GLY.manifold },
          { title: 'طلمبة تروس', en: 'High-pressure gear pumps', art: GLY.pump }
        ] },
        { t: 'p', text: '⚠ السلايد كاتبها <en>graphic</en>. الصح <en>Compacted **graphite** iron</en>: حديد جواه جرافيت «مضغوط». لو الكلمة جت في الامتحان بأي شكل من الاتنين، هي هي.' },
        { t: 'check', q: 'ir23' },
        { t: 'quote', ref: 'L2 · S19', text: 'It has a strength similar to those of gray iron, with high thermal conductivity and machinability superior to those of ductile iron.', ar: 'قوته شبه الرمادي. وتوصيله للحرارة عالي. وسهولة تشغيله على المكن أحسن من المرن.' },
        { t: 'grid', cols: 3, items: [
          { title: 'قوة زي الرمادي', en: 'Strength ≈ gray iron', art: GLY.scale },
          { title: 'بيوصّل الحرارة', en: 'High thermal conductivity', art: GLY.heat },
          { title: 'تشغيل أسهل من المرن', en: 'Machinability > ductile', art: GLY.cutter }
        ] },
        { t: 'why', text: 'ليه بلوك الموتور ومجمّع العادم؟ الاتنين بيسخنوا جامد. والحديد اللي بيوصّل الحرارة كويس بيطلّعها بسرعة، بدل ما تتحبس جوه.' },
        { t: 'trap', text: 'بلوك الموتور مكتوب في **نوعين**: الرمادي والـ CGI. وطنابير الفرامل كمان في الاتنين. وخد بالك من المقارنة: القوة زي **الرمادي**، والتشغيل أحسن من **المرن**. ما تقلبهمش.', wrong: 'CGI: strength similar to ductile iron, machinability superior to gray iron', right: 'CGI: strength similar to gray iron · machinability superior to ductile iron' },
        { t: 'check', q: 'ir25' },
        { t: 'tip', text: 'الـ CGI = «زي الرمادي في القوة، أحسن من المرن في التشغيل، وبيوصّل الحرارة».' }
      ]
    },
    {
      id: 'ir-malleable', title: 'المطاوع: أبيض دخل الفرن', en: 'Malleable iron', ref: 'L2 · S20', scene: 'malleableIron',
      blocks: [
        { t: 'say', who: 'usta', text: 'المطاوع ده أصله حديد أبيض. دخل الفرن، واتعمله معالجة حرارية، فهدي وبقى سهل.' },
        { t: 'quote', ref: 'L2 · S20', text: 'Malleable iron is used for heavy-duty bearing surfaces in automobiles, trucks, and railroad rolling stock. It is also used for farm and construction machinery.', ar: 'المطاوع بيستخدم في أسطح التحميل التقيلة في العربيات واللوريات وعربيات القطر. وكمان في المعدات الزراعية ومعدات البناء.' },
        { t: 'grid', cols: 3, items: [
          { title: 'أسطح التحميل', en: 'Heavy-duty bearing surfaces', art: GLY.bearing, text: 'أسطح بتشيل حمل تقيل وبتلف عليها حاجة.' },
          { title: 'معدات زراعية', en: 'Farm machinery', art: GLY.tractor, text: 'الجرار وعدّته.' },
          { title: 'معدات البناء', en: 'Construction machinery', art: GLY.digger, text: 'الحفار واللودر.' }
        ] },
        { t: 'check', q: 'ir28' },
        { t: 'quote', ref: 'L2 · S20', text: 'Malleable iron is white iron that has been transformed by a heat-treatment process, providing a malleable and easily machined iron.', ar: 'المطاوع أصله حديد أبيض، اتحوّل بمعالجة حرارية، فطلع حديد مطاوع وسهل يتشغّل على المكن.' },
        { t: 'art', html: chainArt('رمادي أو مرن، يتبرد في القالب يبقى أبيض، والأبيض بالمعالجة الحرارية يبقى مطاوع'), caption: 'السلسلة كلها: رمادي أو مرن ← تبريد في القالب ← أبيض ← معالجة حرارية ← مطاوع.' },
        { t: 'why', text: 'الأبيض ناشف جدًا، وصعب يتشغّل. المعالجة الحرارية بتهدّيه. فيبقى مطاوع (<en>malleable</en>)، وسهل في التشغيل (<en>easily machined</en>).' },
        { t: 'trap', text: 'المطاوع أصله **أبيض**. مش رمادي، ومش مرن. (والأبيض نفسه أصله رمادي أو مرن.)', wrong: 'Malleable iron is gray iron that has been heat-treated', right: 'Malleable iron is white iron transformed by a heat-treatment process' },
        { t: 'check', q: 'ir29' },
        { t: 'tip', text: '«أبيض + فرن = مطاوع». والمطاوع للحمل التقيل: عربيات، ولوريات، وقطر، وجرار، وحفار.' }
      ]
    },
    {
      id: 'ir-alloy', title: 'عالي السبائك: كروم ونيكل', en: 'High-alloy irons', ref: 'L2 · S21', scene: 'alloyIrons',
      blocks: [
        { t: 'say', who: 'usta', text: 'آخر واحد في العيلة. ده الحديد اللي اتحط عليه إضافات كتير: لحد 35%.' },
        { t: 'quote', ref: 'L2 · S21', text: 'High-alloy irons are ductile, gray, or white irons that contain up to 35 percent alloy content.', ar: 'الحديد عالي السبائك: حديد مرن أو رمادي أو أبيض، فيه سبائك لحد 35%.' },
        { t: 'art', html: alloyArt('رمادي أو مرن أو أبيض، مع سبائك لحد 35%: الكروم العالي والنيكل'), caption: 'أي واحد من التلاتة + سبائك لحد 35% = عالي السبائك. والسلايد ادّى مثالين: الكروم والنيكل.' },
        { t: 'check', q: 'ir31' },
        { t: 'quote', ref: 'L2 · S21', text: 'High-chromium irons are oxidation and wear resistant. Nickel irons are nonmagnetic, have good corrosion resistance, and have an extremely low coefficient of thermal expansion.', ar: 'الكروم العالي بيقاوم الأكسدة والتآكل. والنيكل مش مغناطيسي، وبيقاوم الصدأ كويس، وتمدده الحراري قليل جدًا.' },
        { t: 'compare', left: { title: 'كروم عالي', en: 'High-chromium irons', text: 'بيقاوم الأكسدة (<en>oxidation</en>) والتآكل (<en>wear</en>).' }, right: { title: 'نيكل', en: 'Nickel irons', text: 'مش مغناطيسي (<en>nonmagnetic</en>). بيقاوم الصدأ (<en>corrosion</en>). وتمدده الحراري قليل جدًا (<en>extremely low thermal expansion</en>).' }, note: 'كروم: أكسدة + تآكل. نيكل: لا مغناطيس، ولا صدأ، ولا تمدد تقريبًا.' },
        { t: 'p', text: 'يعني لو الجزء هيتعرض للأكسدة والاحتكاك: كروم. ولو لازم المغناطيس ما يشدهوش، أو لازم مقاسه ما يكبرش لما يسخن: نيكل.' },
        { t: 'check', q: 'ir34' },
        { t: 'trap', text: 'الـ <en>wear</en> جت مرتين: الأبيض = <en>wear and abrasion</en>. الكروم العالي = <en>oxidation and wear</en>. لو شفت <en>oxidation</en> يبقى كروم. ولو شفت <en>nonmagnetic</en> يبقى نيكل.', wrong: 'Nickel irons are oxidation and wear resistant', right: 'High-chromium: oxidation + wear · Nickel: nonmagnetic, corrosion, extremely low expansion' },
        { t: 'check', q: 'ir35' },
        { t: 'tip', text: '<en>Ni = No</en>: لا مغناطيس، ولا صدأ، ولا تمدد تقريبًا. والكروم (<en>Cr</en>) درع ضد الأكسدة والتآكل.' }
      ]
    },
    {
      id: 'ir-match', title: 'الشغلانة دي لمين؟', en: 'Match the job to the iron', ref: 'L2 · S16–S21', scene: 'irons',
      blocks: [
        { t: 'say', who: 'press', text: 'أنا المكبس. وبحب السؤال ده: «الشغلانة دي لمين؟». وبحبه أكتر بالمقلوب: «مين فيهم مش ليه الشغلانة دي؟»' },
        { t: 'quote', ref: 'L2 · S3', text: 'Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.', ar: 'كل سبيكة ليها خواص ميكانيكية وفيزيائية معينة، بتخليها مناسبة لاستخدام معين.' },
        { t: 'demo', id: 'irn-finder', title: 'دوس على الشغلانة', caption: 'كل شغلانة اتذكرت في السلايدات، والنوع (أو النوعين) اللي السلايد اداهولها.', mount: finderDemo(W_FIND) },
        { t: 'table', head: ['الشغلانة', 'النوع'], rows: [
          ['<en>Engine blocks</en>', 'الرمادي + الـ CGI'],
          ['<en>Gears</en> · <en>heavy-duty gears</en>', 'الرمادي · المرن'],
          ['<en>Flywheels</en> · <en>large machine bases</en>', 'الرمادي'],
          ['<en>Disc brakes and drums</en> · <en>brake drums</en>', 'الرمادي · الرمادي + الـ CGI'],
          ['<en>Crankshafts</en>', 'المرن'],
          ['<en>Crushers, pulverizers, nozzles</en>', 'الأبيض'],
          ['<en>Railroad brake shoes</en> · <en>rolling-mill rolls</en>', 'الأبيض'],
          ['<en>Exhaust manifolds</en> · <en>high pressure gear pumps</en>', 'الـ CGI'],
          ['<en>Heavy-duty bearing surfaces</en> · <en>farm and construction machinery</en>', 'المطاوع'],
          ['<en>Oxidation and wear resistant</en>', 'عالي السبائك: الكروم'],
          ['<en>Nonmagnetic · corrosion · low thermal expansion</en>', 'عالي السبائك: النيكل']
        ] },
        { t: 'check', q: 'ir36' },
        { t: 'trap', text: 'تلات شغلانات بتتكرر: بلوك الموتور (رمادي + CGI)، وطنابير الفرامل (رمادي + CGI)، والتروس (رمادي، والتقيلة منها للمرن). لو لقيت الاتنين في الاختيارات، ارجع للسؤال: بيوصف مين؟', wrong: 'Every job belongs to one iron only', right: 'Engine blocks: gray + CGI · Brake drums: gray + CGI · Gears: gray (heavy-duty gears: ductile)' },
        { t: 'check', q: 'ir37' },
        { t: 'tip', text: 'في سؤال <en>NOT</en>: دوّر على الشغلانة الغريبة عن العيلة. كرنك وسط شغلانات الرمادي؟ يبقى ده بتاع المرن.' }
      ]
    }
  ]
};
