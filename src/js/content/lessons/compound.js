// Lesson — compound (Arabic edition). L4: compound bending — spinning, hydroforming (tube + sheet), drawing / deep drawing.
// Block reference: content/lessons/_sample.js · house rules: docs/BRIEF.md. Drawings: _compound-art.js · demos: _compound-demos.js.
import { SHAPES, PROC, PRODUCTS, treeArt, latheArt, productsArt, profilesArt, solidArt, waterArt, railArt, femaleArt, maleArt, drawDieArt, stagesArt, blankCupArt } from './_compound-art.js';
import { spinDemo, tubeDemo, drawDemo } from './_compound-demos.js';

const W_SPIN = {
  label: 'قرص صاج بيلف وبيتشكّل على قالب', hold: 'اضغط واستمر: الرولة تزق', formed: 'اتشكّل', wall: 'سُمك الحيطة', wallSame: 'زي القرص', wallThin: 'أرفع من القرص',
  start: 'القرص مسطّح ومركّب على المخرطة. اضغط على الزرار ومتسيبوش.',
  going: 'القرص بيلف، والرولة بتنيّمه على القالب حتة حتة.',
  paused: 'سبت الزرار، فالرولة وقفت. كمّل.',
  done: 'طلعت كوباية: مقطعها دايرة، وحيطتها أرفع من القرص الأصلي (<bdi class="en" dir="ltr">thickness of metal is reduced in the side of walls</bdi>).',
  reset: 'قرص جديد'
};
const W_TUBE = {
  steps: 'خطوات هيدروفورمنج المواسير', prev: 'الخطوة اللي قبلها', next: 'الخطوة اللي بعدها', prevIcon: '→', nextIcon: '←',
  caps: ['الماسورة بتتحط بين نصّين القالب وهو مفتوح.', 'القالب بيقفل على الماسورة، والطرفين بيتسدّوا.', 'السائل بيدخل ويملا الماسورة.', 'الماسورة اتملت سائل على الآخر.', 'قوة محورية (F axial) بتزق الطرفين، والضغط P جوه بينفخ الماسورة لحد ما تاخد شكل القالب.', 'القالب بيفتح، والحتة بتطلع.']
};
const W_DRAW = {
  label: 'السحب العميق: البنش بيزق البلانك جوه الداي', stroke: 'نزول البنش',
  r0: 'البلانك قاعد فوق فتحة الداي، والـ <bdi class="en" dir="ltr">blank holder</bdi> ماسك أطرافه.',
  r1: 'البنش بيزق المعدن جوه الفتحة. لاحظ الحرف الخارجي للبلانك بيتسحب لجوه.',
  r2: 'خلاص: البلانك بقى جزء مسحوب (<bdi class="en" dir="ltr">drawn part</bdi>) شكل كوباية.'
};

export default {
  zone: 'compound',
  hero: { say: 'تلات طرق تعمل بيهم حاجة مجوّفة من لوح صاج: تلفّه على مخرطة، أو تزقه بضغط الميّه، أو تسحبه ببنش جوه داي.' },
  chapters: [
    {
      id: 'cp-family', title: 'الثني المركّب: تلات عمليات', en: 'Compound bending', ref: 'L4 · S2', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'usta', text: 'في محاضرة 3 ثنينا الصاج على خط مستقيم. النهارده الصاج هيتقعّر في كذا اتجاه مرة واحدة. ده الثني المركّب.' },
        { t: 'quote', ref: 'L4 · S2', text: 'Solid State Forming → Compound Bending · Moderate to High Cost → Spinning · Hydro-forming · Drawing', ar: 'التشكيل في الحالة الصلبة ← الثني المركّب (تكلفة من متوسطة لعالية) ← البرم، والتشكيل بالسوائل، والسحب.' },
        { t: 'art', html: treeArt('شجرة التشكيل في الحالة الصلبة، والثني المركّب في النص'), caption: 'الشجرة كاملة من محاضرة 3 (L3 · S6). الفرع اللي في النص هو بتاعنا النهارده.' },
        { t: 'p', text: 'الثني المركّب هو الفرع التاني في التشكيل في الحالة الصلبة (<en>solid state forming</en>). تكلفته **من متوسطة لعالية** (<en>moderate to high</en>). أغلى من الثني البسيط، وأرخص من الـ <en>stamping</en>.' },
        { t: 'grid', cols: 3, items: [
          { title: 'البرم', en: 'Spinning', art: PROC.spin, text: 'قرص بيلف على مخرطة، وأداة بتنيّمه على قالب.' },
          { title: 'التشكيل بالسوائل', en: 'Hydroforming', art: PROC.hydro, text: 'ضغط الميّه بيشكّل الصاج أو الماسورة.' },
          { title: 'السحب', en: 'Drawing', art: PROC.draw, text: 'بنش بيزق البلانك جوه الداي.' }
        ] },
        { t: 'check', q: 'cp01' },
        { t: 'trap', text: 'التكلفة بتتلخبط: البسيط = <en>low to moderate</en>. المركّب = <en>moderate to high</en>. الـ <en>stamping</en> = <en>high</en>.', wrong: 'Compound bending: low to moderate cost', right: 'Compound bending: moderate to high cost' },
        { t: 'check', q: 'cp02' },
        { t: 'tip', text: 'الثني المركّب في تلات كلمات: «لف، ميّه، سحب». <en>Spin · Hydro · Draw</en>.' }
      ]
    },
    {
      id: 'cp-spin', title: 'البرم: قرص بيلف ويبقى كوباية', en: 'Spinning', ref: 'L4 · S3', scene: 'spinning',
      blocks: [
        { t: 'say', who: 'usta', text: 'تخيّل قرص ألومنيوم بيلف بسرعة على مخرطة. وأداة بتزقه بالراحة على قالب. القرص بينام على القالب وياخد شكله. ده البرم.' },
        { t: 'quote', ref: 'L4 · S3', text: 'Spinning is commonly used to produce symmetrical, cup like shapes discs. · Metal spinning is a forming process that produces hollow parts that are typically circular in cross-section.', ar: 'البرم بيعمل أشكال متماثلة شبه الكوباية. وبيطلّع أجزاء مجوّفة، مقطعها غالبًا دايرة.' },
        { t: 'p', text: 'ليه دايرة؟ لأن الشغل كله بيلف حوالين محور واحد. أي حاجة بتتشكّل وهي بتلف، بتطلع مدورة ومتماثلة.' },
        { t: 'check', q: 'cp04' },
        { t: 'quote', ref: 'L4 · S3', text: 'The basic metal spinning process starts with a flat metal disc (blank), which rotates on a lathe. · A forming tool forces the metal sheet onto a wooden or metal pattern as it spins on a special lathe .', ar: 'البداية قرص معدن مسطّح اسمه blank، بيلف على مخرطة. وأداة تشكيل بتزق الصاج على قالب خشب أو معدن وهو بيلف.' },
        { t: 'demo', id: 'cmp-spin', title: 'لِف واضغط', caption: 'اضغط على الزرار ومتسيبوش. القرص هينام على القالب حتة حتة. وبص على سُمك الحيطة.', mount: spinDemo(W_SPIN) },
        { t: 'list', style: 'num', items: ['قرص مسطّح (<en>blank</en>) بيتركّب على المخرطة.', 'بيلف مع القالب (<en>mandrel</en>).', 'أداة التشكيل (<en>roller tool</en>) بتزقه على القالب.', 'يطلع جزء مجوّف ومتماثل، مقطعه دايرة.'] },
        { t: 'quote', ref: 'L4 · S3', text: 'The maximum diameter of cup at bottom of shape and then thickness of metal is reduced in the side of walls.', ar: 'أكبر قطر للكوباية بيبقى عند قاعدة الشكل، وسُمك المعدن بيقل في الحيطان.' },
        { t: 'why', text: 'القرص كان عريض ومسطّح. لما بننيّمه على قالب أضيق منه، المعدن بيتشد على الجوانب. فالحيطة تطلع أرفع من القرص الأصلي.' },
        { t: 'trap', text: 'آخر سطر في السلايد «<en>Flow forming assignment report</en>» ده **تكليف** (بحث تعمله)، مش جزء من الشرح. وخد بالك: <en>flow forming</en> غير <en>fluid forming</en>. الـ <en>fluid forming</en> اسم تاني للـ <en>hydroforming</en>.', wrong: 'Flow forming = fluid forming (hydroforming)', right: 'Fluid forming = hydroforming · Flow forming = an assignment report' },
        { t: 'check', q: 'cp07' },
        { t: 'tip', text: 'البرم = «لف + قالب + رولة». القرص بيلف، والرولة بتزق، والقالب بيدّي الشكل.' }
      ]
    },
    {
      id: 'cp-lathe', title: 'مخرطة البرم حتة حتة', en: 'The spinning lathe', ref: 'L4 · S4', scene: 'spinParts',
      blocks: [
        { t: 'say', who: 'usta', text: 'السلايد ده رسمة واحدة فيها سبع كلمات. السبعة دول ممكن ييجوا في الامتحان على رسمة بأرقام.' },
        { t: 'quote', ref: 'L4 · S4', text: 'spinning forming process — Head stock · Spindle · Mandrel · Sheet metal · Clamp · Tail stock · Roller tool', ar: 'عملية البرم: الغراب الثابت، والعمود الدوّار، والقالب، والصاج، والماسك، والغراب المتحرك، وأداة الرولة.' },
        { t: 'art', html: latheArt('names', 'مخرطة البرم بأجزائها السبعة'), caption: 'رسمة جديدة لنفس الفكرة: الصاج نام نصّه على القالب، والرولة لسه بتزق من تحت.' },
        { t: 'list', style: 'dot', items: [
          '<en>Head stock</en>: الراس التقيلة على الشمال. منها بتطلع الحركة.',
          '<en>Spindle</en>: العمود اللي بيلف، طالع من الـ <en>head stock</en>.',
          '<en>Mandrel</en>: القالب. الصاج بيتشكّل عليه. ده الـ <en>pattern</en> (خشب أو معدن) اللي في السلايد اللي فات.',
          '<en>Sheet metal</en>: القرص (البلانك) اللي بيتشكّل.',
          '<en>Clamp</en>: بيمسك الصاج في وش القالب.',
          '<en>Tail stock</en>: الناحية التانية. بيزق الـ <en>clamp</en> عشان الصاج ما يتحركش.',
          '<en>Roller tool</en>: الأداة اللي بتزق الصاج على القالب.'
        ] },
        { t: 'check', q: 'cp09' },
        { t: 'trap', text: 'الـ <en>blank holder</en> **مش** في مخرطة البرم. ده بتاع الـ <en>deep drawing</en>. في البرم، اللي بيمسك الصاج هو الـ <en>clamp</en>.', wrong: 'Spinning uses a blank holder', right: 'Spinning: clamp + tail stock · Deep drawing: blank holder' },
        { t: 'check', q: 'cp12' },
        { t: 'tip', text: 'من الشمال لليمين: <en>Head stock → Spindle → Mandrel → Sheet metal → Clamp → Tail stock</en>. والـ <en>Roller tool</en> من تحت.' }
      ]
    },
    {
      id: 'cp-shapes', title: 'أشكال البرم ومنتجاته', en: 'Spun shapes, products and profiles', ref: 'L4 · S3 · S5–S6', scene: 'spunShapes',
      blocks: [
        { t: 'say', who: 'usta', text: 'أي حاجة البرم بيعملها، أصلها واحد من تلات أشكال. وبعدين السلايدات بتوريك منتجات وبروفايلات كتير.' },
        { t: 'quote', ref: 'L4 · S3', text: 'The basic metal spun shapes are the hemisphere, cone, cylindrical shell.', ar: 'الأشكال الأساسية للبرم: نص كورة، ومخروط، واسطوانة مجوّفة.' },
        { t: 'grid', cols: 3, items: [
          { title: 'نص كورة', en: 'Hemisphere', art: SHAPES.hemi, text: 'سلطانية، غطا مقبب.' },
          { title: 'مخروط', en: 'Cone', art: SHAPES.cone, text: 'قمع، هوبر.' },
          { title: 'اسطوانة مجوّفة', en: 'Cylindrical shell', art: SHAPES.cyl, text: 'غطا، جلبة، جراب.' }
        ] },
        { t: 'check', q: 'cp13' },
        { t: 'h', text: 'منتجات البرم', en: 'Some of Spinning products example' },
        { t: 'quote', ref: 'L4 · S5', text: 'Some of Spinning products example: Ball · Bowl · Cap · Cone · Domed End Cap · Ferrule · Flag Base Stand · Funeral Urn · Garbage Lid · Hopper · Lid · Metal Housing · Recessed Lighting · Roof Flashing · Roof Drain · Spear Top · Tank Head · Trumpet Base · Vacuum Drum Head · Venturi', ar: 'عشرين منتج اتعملوا بالبرم: كورة، وسلطانية، وغطا، ومخروط، وقمع، وراس تنك، وفنتوري…' },
        { t: 'art', html: productsArt([['bowl', 'Bowl'], ['cone', 'Cone'], ['hopper', 'Hopper'], ['venturi', 'Venturi'], ['tankhead', 'Tank head'], ['trumpet', 'Trumpet base'], ['lid', 'Lid'], ['urn', 'Funeral urn'], ['light', 'Recessed lighting'], ['flashing', 'Roof flashing'], ['ferrule', 'Ferrule'], ['housing', 'Metal housing']]), caption: 'رسومات جديدة لبعض منتجات السلايد. كلهم مدورين حوالين محور.' },
        { t: 'p', text: 'كلهم مدورين ومتماثلين حوالين محور. ده توقيع البرم. شوف الـ <en>venturi</en>: ماسورة بتضيق في النص وترجع توسع. والـ <en>hopper</en>: قمع كبير. والـ <en>tank head</en>: راس تنك مقببة.' },
        { t: 'check', q: 'cp15' },
        { t: 'quote', ref: 'L4 · S6', text: 'Some of Spinning profiles example: Dished · Domed · Domed with flange · Flanged · Flanged and flued · Flanged, dished and flued · Flanged and dished · Hemisphere · Semi-elliptical · Tube cap · Trumpet', ar: 'بروفايلات البرم: شكل الحتة من الجنب.' },
        { t: 'art', html: profilesArt(), caption: 'البروفايل = شكل الحتة لو قطعتها من النص وبصيت عليها من الجنب. الخط المنقّط هو محور اللف.' },
        { t: 'trap', text: 'الـ <en>box</en> مش من أشكال البرم. «<en>box-shaped</en>» دي في سلايد الـ <en>drawing</en>. البرم بيعمل حاجات مدورة بس.', wrong: 'Box is a basic spun shape', right: 'Hemisphere · cone · cylindrical shell' },
        { t: 'check', q: 'cp14' },
        { t: 'tip', text: '«كورة، قمع، كوباية»: <en>Hemisphere, Cone, Cylindrical shell</en>.' }
      ]
    },
    {
      id: 'cp-hydro', title: 'الميّه تشتغل مكبس', en: 'Hydroforming (fluid forming)', ref: 'L4 · S8 · S12–S13', scene: 'hydro',
      blocks: [
        { t: 'say', who: 'usta', text: 'هنا مفيش داي ناشف من الناحيتين. الميّه هي اللي بتزق الصاج.' },
        { t: 'quote', ref: 'L4 · S8', text: 'Hydroforming is an economical way to form malleable sheet into lightweight, structurally stiff, and strong compound shapes.', ar: 'التشكيل بالسوائل طريقة اقتصادية بتحوّل الصاج المطاوع لأشكال مركّبة: خفيفة، وجاسئة، وقوية.' },
        { t: 'p', text: 'اسمه بين قوسين في السلايد: <en>Fluid Forming</en>، يعني التشكيل بالسوائل. وكلمة <en>malleable</en> هنا معناها صاج سهل يتشكّل (فاكر الـ <en>malleability</en>؟).' },
        { t: 'quote', ref: 'L4 · S8', text: 'The process uses water pressure, which allows complex shapes with concavities to be formed; this would be difficult or impossible with standard solid die stamping.', ar: 'العملية بتستخدم ضغط الميّه. ده بيسمح بأشكال معقدة فيها تجاويف، كانت هتبقى صعبة أو مستحيلة بالـ stamping العادي بداي ناشف.' },
        { t: 'compare', left: { title: 'داي ناشف', en: 'Solid die stamping', art: solidArt('بنش ناشف مش بيملا التجويف'), text: 'البنش الناشف بيدخل على قده. الأركان اللي جوه التجويف بتفضل فاضية.' }, right: { title: 'ضغط الميّه', en: 'Hydroforming', art: waterArt('الميّه بتزق الصاج في كل تجويف'), text: 'الميّه بتوصل لكل ركن، فبتزق الصاج في كل التجاويف.' }, note: 'التجاويف (<en>concavities</en>) = شغلانة الهيدروفورمنج.' },
        { t: 'check', q: 'cp21' },
        { t: 'why', text: 'الميّه ما لهاش شكل. بتملا أي فراغ، وبتزق بنفس الضغط في كل اتجاه. عشان كده بتوصل لأماكن الداي الناشف ما يوصلهاش.' },
        { t: 'quote', ref: 'L4 · S8', text: 'hydroforming an ideal process for low to mid-range production. · There are two types of Hydro forming. 1. Tube Hydro forming 2. Sheet Hydro forming', ar: 'الهيدروفورمنج مثالي للإنتاج القليل والمتوسط. وليه نوعين: مواسير، وصاج.' },
        { t: 'check', q: 'cp20' },
        { t: 'trap', text: 'الإنتاج هنا <en>low to mid-range</en>. ما تقولش <en>high production</en>. (الـ <en>high production</en> ده كلام الـ <en>edge bending</en> في محاضرة 3.)', wrong: 'Hydroforming is ideal for high production', right: 'Hydroforming is ideal for low to mid-range production' },
        { t: 'p', text: 'السلايدات اللي بعد كده (L4 · S12–S13) بتوري حتت اتعملت بالطريقة دي: قطعة مخروطية، وكوبايات وعلب، ومواسير متنية، وماسورة مربعة عليها انتفاخات. وصورة مكبس في المصنع والميّه حواليه.' },
        { t: 'tip', text: '<en>Hydro</en> = ميّه. «ميّه، تجاويف، إنتاج قليل لمتوسط، ونوعين».' }
      ]
    },
    {
      id: 'cp-tube', title: 'ماسورة بتتنفخ جوه قالب', en: 'Tube hydroforming', ref: 'L4 · S9 · S11', scene: 'hydroTube',
      blocks: [
        { t: 'say', who: 'usta', text: 'ست خطوات من a لحد f: ماسورة تدخل، القالب يقفل، الميّه تملا، الضغط يشتغل، والحتة تطلع.' },
        { t: 'quote', ref: 'L4 · S9', text: 'Tube Hydroforming — (a) … (f) · F axial · P', ar: 'هيدروفورمنج المواسير: ست مراحل في الرسمة، فيها قوة محورية F axial، وضغط P جوه الماسورة.' },
        { t: 'demo', id: 'cmp-tube', title: 'خطوة خطوة', caption: 'دوس على الحروف من a لـ f، أو على الأسهم. نفس فكرة رسمة السلايد، متقسّمة.', mount: tubeDemo(W_TUBE) },
        { t: 'list', style: 'num', items: ['(a) الماسورة بتتحط بين نصّين القالب وهو مفتوح.', '(b) القالب بيقفل، والطرفين بيتسدّوا.', '(c–d) السائل بيملا الماسورة.', '(e) قوة محورية (<en>F axial</en>) بتزق الطرفين، والضغط (<en>P</en>) جوه بينفخ الماسورة لحد ما تاخد شكل القالب.', '(f) القالب بيفتح، والحتة بتطلع.'] },
        { t: 'check', q: 'cp24' },
        { t: 'h', text: 'شاسيه العربية', en: 'Fig. Final Product' },
        { t: 'quote', ref: 'L4 · S11', text: 'Step 1 · Step 2 (DIE FORCE · WATER) · Step 3 · Fig. Final Product', ar: 'تلات خطوات، وصورة للمنتج النهائي: كمرة شاسيه عربية.' },
        { t: 'art', html: railArt('ماسورة بتتني، وتتقفل في قالب والميّه جواها، وتطلع كمرة مربعة'), caption: 'ماسورة بتتني (Step 1)، تدخل القالب ويتقفل عليها بقوة والميّه جواها (Step 2)، وتطلع بقطاع مربع (Step 3).' },
        { t: 'p', text: 'النتيجة كمرة شاسيه العربية (<en>frame rail</en>): حتة واحدة، خفيفة، وجاسئة. نفس الكلام اللي قاله أول سلايد عن الهيدروفورمنج.' },
        { t: 'check', q: 'cp26' },
        { t: 'trap', text: 'الـ <en>F axial</en> بتزق **طرفين** الماسورة من برا. والـ <en>P</en> ضغط **جوه** الماسورة. ما تبدّلهمش.', wrong: 'F axial is the pressure inside the tube', right: 'F axial pushes the tube ends · P is the pressure inside' },
        { t: 'tip', text: 'المواسير في خمس كلمات: «حط، اقفل، املا، انفخ، طلّع».' }
      ]
    },
    {
      id: 'cp-sheet', title: 'صاج على مخدة ميّه', en: 'Sheet hydroforming', ref: 'L4 · S10', scene: 'hydroSheet',
      blocks: [
        { t: 'say', who: 'usta', text: 'النوع التاني: لوح صاج. مرة الميّه هي اللي بتزقه، ومرة البنش هو اللي بيزق والميّه بتقاومه.' },
        { t: 'quote', ref: 'L4 · S10', text: 'Sheet steel is forced into a female cavity by water under pressure from a pump or by press action', ar: 'الصاج بيتزق جوه تجويف «أنثى» بميّه مضغوطة. الضغط جاي من طلمبة، أو من حركة المكبس.' },
        { t: 'quote', ref: 'L4 · S10', text: 'Sheet steel is deformed by a male punch, which acts against the fluid under pressure.', ar: 'أو الصاج بيتشكّل ببنش «ذكر» بيزق ضد سائل مضغوط.' },
        { t: 'compare', left: { title: 'الميّه بتزق', en: 'into a female cavity', art: femaleArt('ميّه مضغوطة بتزق الصاج جوه تجويف'), text: 'الميّه المضغوطة من فوق بتزق الصاج لتحت، جوه التجويف.' }, right: { title: 'البنش بيزق', en: 'male punch vs fluid', art: maleArt('بنش بيزق الصاج ضد سائل مضغوط'), text: 'البنش بيزق الصاج، والسائل المضغوط تحته بيقاومه ويسنده.' }, note: '<en>female</en> = تجويف. <en>male</en> = بنش بارز.' },
        { t: 'why', text: 'في الحالتين، نص واحد بس ناشف (تجويف أو بنش)، والنص التاني سائل. فبدل ما تعمل داي ناشف من الناحيتين، بتعمل نص واحد.' },
        { t: 'trap', text: '<en>female</en> = التجويف (الحفرة). <en>male</en> = البنش (البارز). نفس الكلمتين هتقابلهم تاني في محاضرة 5 مع الـ <en>embossing</en>.', wrong: 'Water forces the sheet into a male cavity', right: 'Water → female cavity · Male punch → against the fluid' },
        { t: 'check', q: 'cp27' },
        { t: 'check', q: 'cp28' },
        { t: 'tip', text: '«الميّه تزقه في الحفرة، أو البنش يزقه في الميّه».' }
      ]
    },
    {
      id: 'cp-draw', title: 'بنش وداي وماسك', en: 'Drawing and deep drawing', ref: 'L4 · S14–S15', scene: 'drawing',
      blocks: [
        { t: 'say', who: 'usta', text: 'السحب ده الأشهر. علبة الكانز اللي في إيدك اتعملت كده.' },
        { t: 'quote', ref: 'L4 · S14', text: 'Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved, hollow-shaped parts · Sheet metal blank is positioned over die cavity and then punch pushes metal into opening', ar: 'تشكيل صاج بيعمل أجزاء مجوّفة: شكل كوباية، أو علبة، أو أي شكل منحني معقد. البلانك بيتحط فوق فتحة الداي، والبنش بيزق المعدن جوه الفتحة.' },
        { t: 'check', q: 'cp29' },
        { t: 'demo', id: 'cmp-draw', title: 'انزل بالبنش', caption: 'حرّك السلايدر. البنش هينزل ويسحب البلانك جوه الداي، والماسك ماسك الأطراف.', mount: drawDemo(W_DRAW) },
        { t: 'quote', ref: 'L4 · S15', text: 'Drawing force · Holding force · Punch · Blank · Blank holder · Die', ar: 'قوة السحب، وقوة المسك، والبنش، والبلانك، وماسك البلانك، والداي.' },
        { t: 'art', html: drawDieArt(.5, 'names', 'داي السحب العميق بأجزائه وقواه'), caption: 'في نص الشوطة: البنش نازل، والماسك ضاغط على الأطراف.' },
        { t: 'list', style: 'dot', items: ['<en>Punch</en>: بينزل ويزق البلانك.', '<en>Die</en>: الحتة اللي تحت، وفيها الفتحة (<en>die cavity</en>).', '<en>Blank</en>: قرص الصاج المسطّح.', '<en>Blank holder</en>: بيضغط على أطراف البلانك.', '<en>Drawing force</en>: القوة اللي على البنش.', '<en>Holding force</en>: القوة اللي على الماسك.'] },
        { t: 'why', text: 'السلايد ما شرحش ليه الماسك. الفكرة ببساطة: لو أطراف البلانك سايبة وهي داخلة الداي، هتتكرمش. الماسك بيضغط عليها، فتدخل ناعمة ومن غير كرمشة.' },
        { t: 'trap', text: '<en>Drawing force</en> على **البنش**. <en>Holding force</en> على **الماسك**. السؤال بيحب يبدّلهم.', wrong: 'Holding force pushes the punch', right: 'Drawing force → punch · Holding force → blank holder' },
        { t: 'check', q: 'cp31' },
        { t: 'tip', text: 'السحب في تلات خطوات: «حط البلانك، امسكه، انزل بالبنش».' }
      ]
    },
    {
      id: 'cp-drawsteps', title: 'من بلانك لعلبة', en: 'From blank to drawn part', ref: 'L4 · S14 · S16–S17', scene: 'drawSteps',
      blocks: [
        { t: 'say', who: 'usta', text: 'قرص مسطّح، وبعد شوطة واحدة يبقى كوباية. سحر؟ لأ. بنش وداي.' },
        { t: 'quote', ref: 'L4 · S16', text: 'Drawing force · Blank → Drawn part', ar: 'البلانك ← الجزء المسحوب.' },
        { t: 'art', html: stagesArt(['البداية', 'نص الشوطة', 'آخر الشوطة']), caption: 'تلات لقطات من نفس الشوطة (L4 · S16): الحرف الخارجي بيتسحب لجوه لحد ما يخلص.' },
        { t: 'art', html: blankCupArt('قرص مسطّح بيبقى كوباية'), caption: 'من قرص مسطّح (<en>Blank</en>) لكوباية (<en>Drawn part</en>).' },
        { t: 'quote', ref: 'L4 · S14', text: 'Products: beverage cans, automobile body panels', ar: 'منتجات: علب المشروبات، وألواح جسم العربية.' },
        { t: 'grid', cols: 4, items: [
          { title: 'علبة كانز', en: 'Beverage cans', art: PRODUCTS.can },
          { title: 'باب عربية', en: 'Automobile body panels', art: PRODUCTS.panel },
          { title: 'كوباية مسحوبة', en: 'Drawn cup', art: PRODUCTS.cup },
          { title: 'حوض مطبخ', en: 'Double sink', art: PRODUCTS.sink }
        ] },
        { t: 'check', q: 'cp34' },
        { t: 'quote', ref: 'L4 · S14', text: 'Also known as deep drawing (to distinguish it from wire and bar drawing)', ar: 'اسمه كمان deep drawing، عشان نفرّقه عن سحب السلك والقضبان.' },
        { t: 'p', text: 'سحب السلك (<en>wire drawing</en>) إنك تشد السلك من فتحة أضيق منه عشان يرفع. حاجة تانية خالص. عشان كده بنقول <en>deep drawing</en> لما نقصد الصاج.' },
        { t: 'trap', text: 'الكلمة واحدة، والعملية مختلفة: <en>deep drawing</en> = سحب صاج لكوباية. <en>wire and bar drawing</en> = سحب سلك وقضبان.', wrong: 'Deep drawing is wire and bar drawing', right: 'Deep drawing (sheet) is named to distinguish it from wire and bar drawing' },
        { t: 'check', q: 'cp35' },
        { t: 'tip', text: 'كانز، وباب عربية، وحوض مطبخ = <en>deep drawing</en>.' }
      ]
    },
    {
      id: 'cp-which', title: 'مين يعمل إيه؟', en: 'Spin, flood or draw?', ref: 'L4 · S2–S17', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'press', text: 'أنا المكبس. هديك منتج، وانت تقولي اتعمل إزاي. جاهز؟' },
        { t: 'quote', ref: 'L4 · S3 · S14', text: 'Spinning is commonly used to produce symmetrical, cup like shapes discs. · Drawing: Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved, hollow-shaped parts', ar: 'الكوباية جت في البرم وفي السحب. الفرق في الأداة.' },
        { t: 'table', head: ['العملية', 'مين بيزق الصاج؟', 'كلمات السلايد', 'منتجات'], rows: [
          ['<en>Spinning</en>', 'رولة، والقرص بيلف على مخرطة', '<en>blank · lathe · mandrel · roller tool · clamp</en>', '<en>venturi · hopper · tank head · bowl</en>'],
          ['<en>Hydroforming</en>', 'ضغط الميّه', '<en>tube · sheet · F axial · P · female cavity · male punch</en>', '<en>car frame rail</en>، وأشكال فيها تجاويف'],
          ['<en>Deep drawing</en>', 'بنش جوه داي', '<en>blank · die cavity · punch · blank holder</en>', '<en>beverage cans · car body panels · sinks</en>']
        ] },
        { t: 'check', q: 'cp37' },
        { t: 'trap', text: 'كلمة «<en>cup</en>» جت في البرم وفي السحب. بص على باقي الكلام: مخرطة ورولة = <en>spinning</en>. بنش وداي و<en>box-shaped</en> = <en>drawing</en>.', wrong: 'Cup-shaped → always deep drawing', right: 'Lathe + roller tool → spinning · Punch + die → drawing' },
        { t: 'check', q: 'cp38' },
        { t: 'tip', text: 'اسأل سؤال واحد: مين بيزق الصاج؟ رولة = <en>spinning</en>. ميّه = <en>hydroforming</en>. بنش في داي = <en>drawing</en>.' }
      ]
    }
  ]
};
