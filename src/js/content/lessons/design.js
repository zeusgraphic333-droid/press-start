// Lesson — design (Arabic edition). Lecture 1 · S2–S18: why the designer needs production engineering, the Product
// Design Sequence (six steps, three lenses, two rows of considerations), the Manufacturing Methods tree, figure 1-1,
// and the product photos read as exercises. Art and demos: _design-kit.js · block reference: _sample.js · rules: docs/BRIEF.md.
import * as K from './_design-kit.js';

const P = K.PRODUCT_ICON;

export default {
  zone: 'design',
  hero: { say: 'أي حاجة بترسمها، حد في مصنع لازم يعملها. المنطقة دي بتعرّفك المصنع بيفكر إزاي، عشان رسمتك توصل لإيد الزبون.' },
  chapters: [
    {
      id: 'dg-why', title: 'اللي بترسمه لازم يتصنع', en: 'Why the product designer needs production engineering', ref: 'L1 · S2', scene: 'designer',
      blocks: [
        { t: 'say', who: 'designer', text: 'أول سؤال في المادة: انت مصمم، مالك ومال المصنع؟ السلايد بيرد بتلات جمل.' },
        { t: 'quote', ref: 'L1 · S2', text: 'The product designer, whether on a design team or acting alone, is responsible for the appearance and form of a product.', ar: 'مصمم المنتج مسؤول عن شكل المنتج وهيئته. سواء شغال في فريق، أو لوحده.' },
        { t: 'p', text: 'الشكل اللي الناس هتشوفه وتمسكه ده **مسؤوليتك انت**. في فريق كبير، أو لوحدك: نفس المسؤولية. وأول كلمتين تحفظهم: <en>appearance and form</en>.' },
        { t: 'check', q: 'dg01' },
        { t: 'quote', ref: 'L1 · S2', text: 'The product designer need to visualize and develop forms that ultimately will be manufactured.', ar: 'المصمم محتاج يتخيّل ويطوّر أشكال. والأشكال دي في الآخر هتتصنع.' },
        { t: 'art', html: K.artDesigner('ar'), caption: 'نفس اللمبة: نصها رسمة، ونصها منتج. شغلك إن الرسمة توصل للنص التاني.' },
        { t: 'p', text: 'كلمة <en>ultimately</en> معناها «في الآخر». الرسمة مش آخر المشوار. آخر المشوار حاجة متصنعة في إيد حد.' },
        { t: 'quote', ref: 'L1 · S2', text: 'With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an array of possible design solutions and have some confidence that they can be manufactured.', ar: 'لما تبقى فاهم الخامات وطرق التصنيع كويس، تقدر تقترح حلول تصميم كتير، وانت واثق إنها هتتصنع.' },
        { t: 'compare', left: { title: 'مصمم فاهم المصنع', en: 'with the knowledge base', text: 'بيقترح <en>an array of possible design solutions</en>: كذا حل. وكل حل عارف هيتعمل إزاي.' }, right: { title: 'مصمم مش فاهم المصنع', en: 'without it', text: 'رسمة حلوة. بس المصنع يقوله: «دي ماتتعملش». ويرجع من الأول.' }, note: 'الفرق مش في الموهبة. الفرق في المعرفة بالخامات وطرق التصنيع.' },
        { t: 'check', q: 'dg02' },
        { t: 'trap', text: 'السؤال ممكن يقولك إن المصمم مسؤول عن الشكل «لما يشتغل لوحده بس». **غلط**. السلايد قال: <en>whether on a design team or acting alone</en>.', wrong: 'responsible only when acting alone', right: 'whether on a design team or acting alone → responsible for the appearance and form' },
        { t: 'check', q: 'dg03' },
        { t: 'tip', text: 'السلايد ده تلات كلمات: **الشكل** <en>appearance and form</en>. **هيتصنع** <en>manufactured</en>. **حلول كتير بثقة** <en>an array of solutions · some confidence</en>.' }
      ]
    },
    {
      id: 'dg-sequence', title: 'من الفكرة للمنتج: ست خطوات وتلات عدسات', en: 'The Product Design Sequence', ref: 'L1 · S3', scene: 'sequence',
      blocks: [
        { t: 'say', who: 'designer', text: 'المنتج مابيطلعش مرة واحدة. بيعدّي على ست محطات. وفي الطريق، تلات عدسات.' },
        { t: 'p', text: 'السلايد ده رسمة، مش كلام. خطوط كتير جاية من الشمال. بتخبط في عدسة، وتتجمع في نقطة. وبعدين تفتح تاني، وتدخل العدسة اللي بعدها.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Product Identification / Design Team Formed · Product Defined · Concept Development · Concept Presentation · Product Development · Product Presentation', ar: 'الست خطوات اللي فوق الرسمة، بالترتيب ده.' },
        { t: 'list', style: 'num', items: [
          '<en>Product Identification / Design Team Formed</en>: نحدد المنتج، ونكوّن فريق التصميم.',
          '<en>Product Defined</en>: المنتج اتعرّف. هو إيه بالظبط.',
          '<en>Concept Development</en>: نطوّر أفكار التصميم.',
          '<en>Concept Presentation</en>: نعرض الفكرة.',
          '<en>Product Development</en>: نطوّر المنتج نفسه.',
          '<en>Product Presentation</en>: نعرض المنتج.'
        ] },
        { t: 'check', q: 'dg05' },
        { t: 'h', text: 'التلات عدسات', en: 'Aesthetics · Analysis · Synthesis' },
        { t: 'quote', ref: 'L1 · S3', text: 'Aesthetics · Analysis · Synthesis', ar: 'الجماليات، والتحليل، والتركيب. بالترتيب ده.' },
        { t: 'demo', id: 'dsg-lens', title: 'العدسة بتلم، وبعدين تفتح', caption: 'اضغط «الخطوة الجاية». كل عدسة بتلم خطوط كتير في نقطة واحدة. وبعدين الخطوط تفتح تاني للعدسة اللي بعدها.', mount: K.lensDemo('ar') },
        { t: 'why', text: 'ليه عدسة؟ لأن كل مرحلة بيدخلها حاجات كتير: آراء، وأرقام، ورسومات، وطلبات. العدسة بتجمّعهم في **قرار واحد**. والقرار ده بيفتح احتمالات جديدة للمرحلة اللي بعدها.' },
        { t: 'p', text: 'بص على مكان كل عدسة. <en>Aesthetics</en> عند الخطوة ١، والخطوط تتقابل عند ٢. <en>Analysis</en> عند الخطوة ٣، وتتقابل عند ٤. <en>Synthesis</en> عند الخطوة ٥، وتتقابل عند ٦.' },
        { t: 'check', q: 'dg06' },
        { t: 'check', q: 'dg07' },
        { t: 'trap', text: 'متلخبطش بين <en>Concept Development</en> و<en>Product Development</en>. الفكرة الأول (خطوة ٣)، وبعدين المنتج (خطوة ٥). وبينهم <en>Concept Presentation</en>.', wrong: 'Product Development → Concept Development', right: 'Concept Development → Concept Presentation → Product Development' },
        { t: 'tip', text: 'الخطوات: حدّد، عرّف، طوّر الفكرة، اعرضها، طوّر المنتج، اعرضه. والعدسات بالترتيب الأبجدي: <en>Ae → An → Sy</en>.' }
      ]
    },
    {
      id: 'dg-considerations', title: 'ذوقك ولا الأرقام؟', en: 'Personal vs objective considerations', ref: 'L1 · S3', scene: 'considerations',
      blocks: [
        { t: 'say', who: 'designer', text: 'كل عدسة بيدخلها نوعين حاجات. حاجات من جواك انت. وحاجات بتتقاس، ومحدش يختلف عليها.' },
        { t: 'compare', left: { title: 'اعتبارات شخصية وفردية', en: 'Personal and Individual Considerations', text: 'ذوقك واختياراتك: الستايل، والـ <en>ego</en>، والاسكتشات، والماكيتات، واختيارك للخامة والعملية.' }, right: { title: 'اعتبارات موضوعية', en: 'Objective Considerations', text: 'حاجات بتتقاس: جسم الإنسان، والأمان، والفلوس، والتصنيع، والتغليف، والصيانة.' }, note: 'الشخصي: قليل، ومن جواك. الموضوعي: كتير، ومن برّه.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Personal and Individual Considerations — Aesthetics: style, ego, marketing/advertising · Analysis: research, sketches, mock-ups, finish color/texture · Synthesis: CAID, material selection, process selection', ar: 'الصف الأول تحت العدسات: الاعتبارات الشخصية.' },
        { t: 'quote', ref: 'L1 · S3', text: 'Objective Considerations — Aesthetics: ergonomics, engineering, marketing, investment/profit, national/international sales, shippin /distribution, CPSA/UL/FDA · Analysis: ergonomics, breadboard studies, manufacturability, safety, strength of materials · Synthesis: CAD/CAM, material selection, tooling, component selection, vendors, assembly, shipping/packaging, repair/maintenance', ar: 'الصف التاني: الاعتبارات الموضوعية. في السلايد مكتوبة <en>shippin</en>، وصحتها <en>shipping</en>.' },
        { t: 'art', html: K.considerArt('ar'), caption: 'كل عمود عدسة. المتقطّع = شخصي. المليان = موضوعي. نفس ترتيب السلايد.' },
        { t: 'check', q: 'dg09' },
        { t: 'list', style: 'dot', items: [
          '<en>ego</en>: بصمتك وإحساسك انت كمصمم.',
          '<en>mock-ups</en>: ماكيت عشان تشوف الشكل بعينك.',
          '<en>breadboard studies</en>: نموذج تجريبي سريع، عشان تتأكد إن الفكرة شغالة.',
          '<en>CAID</en>: برامج التصميم الصناعي على الكمبيوتر.',
          '<en>CAD/CAM</en>: برامج الرسم الهندسي، وبرامج التصنيع.',
          '<en>CPSA/UL/FDA</en>: قوانين وجهات للأمان والمواصفات.'
        ] },
        { t: 'check', q: 'dg11' },
        { t: 'trap', text: 'فيه كلمات بتتكرر عشان توقعك. <en>material selection</en> مكتوبة في الصفين تحت <en>Synthesis</en>. و<en>ergonomics</en> موضوعية تحت <en>Aesthetics</en> وتحت <en>Analysis</en>. و<en>marketing/advertising</en> شخصية، لكن <en>marketing</en> لوحدها موضوعية.', wrong: 'CAID = objective', right: 'CAID = personal · CAD/CAM = objective (both under Synthesis)' },
        { t: 'check', q: 'dg13' },
        { t: 'tip', text: 'لو الحاجة ليها رقم، أو قانون، أو مورّد: غالبًا موضوعية. لو من إيدك ودماغك (اسكتش، ماكيت، ستايل): شخصية. والاستثناء اللي تحفظه: <en>research</en> شخصية.' }
      ]
    },
    {
      id: 'dg-methods', title: 'طرق التصنيع الأربعة', en: 'Manufacturing methods: four families', ref: 'L1 · S7', scene: 'methods',
      blocks: [
        { t: 'say', who: 'usta', text: 'في الورشة، كل حاجة بتتعمل بأربع أفعال بس: شكّل، اقطع، وصّل، شطّب.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Manufacturing Methods: Forming · Cutting · Joining · Finishing', ar: 'طرق التصنيع: التشكيل، والقطع، والوصل، والتشطيب.' },
        { t: 'fig', id: 'dg-tree', caption: 'الشجرة زي السلايد: ٤ عائلات، و١٤ فرع. كل عيلة ليها فصل جاي.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'التشكيل', en: 'Forming', text: 'تدّي الخامة شكل جديد. <en>Liquid · Plastic · Solid State</en>.', art: K.FAM_ICON.forming },
          { title: 'القطع', en: 'Cutting', text: 'تشيل جزء من الخامة، أو تفصلها. <en>Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser</en>.', art: K.FAM_ICON.cutting },
          { title: 'الوصل', en: 'Joining', text: 'تخلّي جزئين قطعة واحدة. <en>Solder/Braze · Weld · Adhesive · Mechanical</en>.', art: K.FAM_ICON.joining },
          { title: 'التشطيب', en: 'Finishing', text: 'آخر لمسة على السطح. <en>Formed · Abrasive/Cut · Coatings</en>.', art: K.FAM_ICON.finishing }
        ] },
        { t: 'check', q: 'dg16' },
        { t: 'example', title: 'لمبة مكتب صاج', text: 'الصاج **يتقطع** على المقاس. و**يتثني** على شكل الشيد. والأجزاء **تتربط** بمسامير. وفي الآخر **تتدهن**. أربع عائلات في منتج واحد.' },
        { t: 'why', text: 'التقسيمة دي بتفيدك إزاي؟ لما تبص لأي منتج، تفكّه في دماغك لأربع أسئلة: اتشكّل إزاي؟ اتقطع إزاي؟ اتوصّل إزاي؟ اتشطّب إزاي؟ وده بالظبط اللي السلايد ٢ عايزه منك.' },
        { t: 'check', q: 'dg17' },
        { t: 'tip', text: 'شكّل، اقطع، وصّل، شطّب. <en>Form · Cut · Join · Finish</en>. نفس ترتيب السلايد.' }
      ]
    },
    {
      id: 'dg-forming', title: 'التشكيل: سايل، طري، ناشف', en: 'Forming: liquid, plastic and solid state', ref: 'L1 · S7', scene: 'forming',
      blocks: [
        { t: 'say', who: 'usta', text: 'نفس المعدن تقدر تشكّله وهو سايل. أو وهو طري وسخن. أو وهو ناشف وبارد.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Forming: Liquid State · Plastic State · Solid State', ar: 'التشكيل: في الحالة السائلة، والحالة اللدنة، والحالة الصلبة.' },
        { t: 'art', html: K.artFamily('forming', 'ar'), caption: 'سايل يتصب في قالب. طري يتكبس. ناشف يتثني.' },
        { t: 'list', style: 'dot', items: [
          '<en>Liquid State</en>: الخامة سايحة. بتتصب في قالب، وتجمد على شكله.',
          '<en>Plastic State</en>: الخامة طرية (سخنة غالبًا)، بس مش سايحة. بتتكبس أو تتزق لحد ما تاخد الشكل.',
          '<en>Solid State</en>: الخامة ناشفة، وغالبًا باردة. صاج، أو سيخ، أو سلك، أو ماسورة بيتثني.'
        ] },
        { t: 'check', q: 'dg19' },
        { t: 'quote', ref: 'L3 · S3', text: 'Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working', ar: 'من المحاضرة التالتة: التشكيل في الحالة الصلبة = تشكيل الصاج والأسياخ والسلك والمواسير، وغالبًا على البارد.' },
        { t: 'example', title: 'حامل موبايل من حتة صاج', text: 'حتة صاج واحدة اتقطعت على شكل راجل قاعد. وبعدين اتثنت على البارد. الثني ده <en>Forming → Solid State</en>. (صورة في السلايد ١٢)' },
        { t: 'check', q: 'dg21' },
        { t: 'trap', text: 'كلمة <en>Plastic State</en> مش معناها «بلاستيك». معناها إن الخامة **لدنة**: طرية وتتشكل. حتى الحديد ليه <en>plastic state</en>. في <en>figure 1-1</en> الحديدي قدام <en>Plastic State</en> مكتوب <en>All Processes</en>.', wrong: 'Plastic State = forming plastics only', right: 'Plastic State = the material is soft enough to be pushed into shape (metals too)' },
        { t: 'tip', text: 'سايل يتصب. طري يتكبس. ناشف يتثني.' }
      ]
    },
    {
      id: 'dg-cutting', title: 'القطع: أربع طرق', en: 'Cutting: four ways', ref: 'L1 · S7', scene: 'cuttingM',
      blocks: [
        { t: 'say', who: 'usta', text: 'القطع مش مقص وبس. فيه مقص. وفيه سكينة بتقشّر رايش. وفيه كيميا وكهربا. وفيه نار ونور.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Cutting: Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser', ar: 'القطع: قص الصاج، وقطع بيطلّع رايش، وقطع من غير رايش، ولهب أو ليزر.' },
        { t: 'art', html: K.artFamily('cutting', 'ar'), caption: 'مقص، ورايش، ومن غير رايش، ولهب أو ليزر.' },
        { t: 'list', style: 'dot', items: [
          '<en>Sheet Cutting</en>: قص وتخريم الصاج. زي مقص كبير، أو بنش وداي.',
          '<en>Chip Forming</en>: سكينة بتشيل المعدن **رايش** (برادة ملفوفة). ده اللي اسمه <en>machining</en>.',
          '<en>Nonchip Forming</en>: قطع **من غير رايش**. بالكيميا، أو بالكهربا مثلًا.',
          '<en>Flame/Laser</en>: قطع بالحرارة: لهب غاز، أو شعاع ليزر.'
        ] },
        { t: 'p', text: 'الأربعة دول هتقابلهم تاني بالتفصيل في المحاضرة الخامسة.' },
        { t: 'check', q: 'dg22' },
        { t: 'example', title: 'ترابيزة ستانلس برجول مخرّمة', text: 'الزخارف اللي في رجول الترابيزة اتقطعت بشعاع ليزر. ده <en>Cutting → Flame/Laser</en>. (صورة في السلايد ٨)' },
        { t: 'trap', text: 'أشهر فخ في المحاضرة دي: <en>Chip Forming</en> و<en>Nonchip Forming</en> فيهم كلمة <en>Forming</en>. بس هما فروع **القطع**، مش التشكيل!', wrong: 'Chip Forming → Forming', right: 'Chip Forming · Nonchip Forming → Cutting' },
        { t: 'why', text: 'طيب ليه اسمها <en>Chip Forming</en>؟ لأن القطع نفسه **بيكوّن رايش** <en>chips</en>. الكلمة بتوصف الرايش اللي طالع، مش شكل المنتج.' },
        { t: 'check', q: 'dg23' },
        { t: 'tip', text: 'لو فيه مقص، أو رايش، أو نار: يبقى قطع. حتى لو الاسم فيه <en>Forming</en>.' }
      ]
    },
    {
      id: 'dg-joining', title: 'الوصل: جزئين يبقوا واحد', en: 'Joining: four ways to hold parts together', ref: 'L1 · S7', scene: 'joining',
      blocks: [
        { t: 'say', who: 'usta', text: 'جزئين وعايزهم قطعة واحدة؟ قدامك أربع طرق.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Joining: Solder/Braze · Weld · Adhesive · Mechanical', ar: 'الوصل: لحام بمعدن حشو، ولحام، ولزق، وربط ميكانيكي.' },
        { t: 'art', html: K.artFamily('joining', 'ar'), caption: 'حشو بيسيح، قطع بتسيح، غِرا، ومسمار بصامولة.' },
        { t: 'list', style: 'dot', items: [
          '<en>Solder/Braze</en>: معدن حشو بيسيح ويملا الوصلة. القطعتين نفسهم مابيسيحوش.',
          '<en>Weld</en>: اللحام. حرف القطعتين نفسه بيسيح، ويتلحم في بعض.',
          '<en>Adhesive</en>: لزق بمادة لاصقة (غِرا).',
          '<en>Mechanical</en>: ربط ميكانيكي: مسامير، وصواميل، وبرشام.'
        ] },
        { t: 'check', q: 'dg24' },
        { t: 'example', title: 'مكتب صاج بالبرشام', text: 'المكتب ده ألواح صاج ملفوفة، ومتربطة بصفوف برشام. البرشام = <en>Joining → Mechanical</en>. (صورة في السلايد ١١)' },
        { t: 'why', text: 'إيه الفرق بين <en>Solder/Braze</en> و<en>Weld</en>؟ (شرح عام): في الـ <en>Weld</en> القطع نفسها بتسيح. في الـ <en>Solder/Braze</en> الحشو بس اللي بيسيح. عشان كده بيحتاج حرارة أقل.' },
        { t: 'check', q: 'dg25' },
        { t: 'trap', text: 'السؤال ممكن يحط <en>Coatings</en> أو <en>Assembly</en> وسط فروع الوصل. الوصل أربعة بس: <en>Solder/Braze · Weld · Adhesive · Mechanical</en>.', wrong: 'Joining: … Assembly', right: 'Joining: Solder/Braze · Weld · Adhesive · Mechanical' },
        { t: 'tip', text: 'سيّح حشو. سيّح القطع. الزق. اربط. بالترتيب ده.' }
      ]
    },
    {
      id: 'dg-finishing', title: 'التشطيب: آخر لمسة', en: 'Finishing: the last touch', ref: 'L1 · S7', scene: 'finishing',
      blocks: [
        { t: 'say', who: 'designer', text: 'أول حاجة الزبون بيلمسها هي السطح. والتشطيب هو آخر لمسة قبل ما المنتج يخرج.' },
        { t: 'quote', ref: 'L1 · S7', text: 'Finishing: Formed · Abrasive/Cut · Coatings', ar: 'التشطيب: تشطيب طالع من التشكيل، وصنفرة وتجليخ، وطبقات ودهانات.' },
        { t: 'art', html: K.artFamily('finishing', 'ar'), caption: 'ملمس من القالب، وحجر جلخ، ورشّ دهان.' },
        { t: 'list', style: 'dot', items: [
          '<en>Formed</en>: التشطيب بيطلع مع التشكيل نفسه. زي ملمس أو نقشة طالعة من القالب.',
          '<en>Abrasive/Cut</en>: صنفرة، وتجليخ، وتلميع. بتشيل طبقة رفيعة جدًا، عشان السطح ينضف.',
          '<en>Coatings</en>: طبقة فوق السطح: دهان، أو بودرة، أو طلاء.'
        ] },
        { t: 'check', q: 'dg26' },
        { t: 'example', title: 'لمبة مكتب خضرا', text: 'الصاج اتثنى على شكل اللمبة. وبعدين اتدهن أخضر. الدهان = <en>Finishing → Coatings</en>. (صورة في السلايد ١٣)' },
        { t: 'trap', text: '<en>Abrasive/Cut</en> فيها كلمة <en>Cut</en>، بس هي فرع **التشطيب** مش القطع. و<en>Formed</en> فرع التشطيب، مش التشكيل.', wrong: 'Abrasive/Cut → Cutting', right: 'Abrasive/Cut · Formed → Finishing' },
        { t: 'check', q: 'dg28' },
        { t: 'tip', text: 'كلمة <en>form</en> موجودة في الشجرة في ٣ أماكن. <en>Forming</en> = عيلة. <en>Chip / Nonchip Forming</en> = قطع. <en>Formed</en> = تشطيب. اعرف كل واحدة بيتها فين.' }
      ]
    },
    {
      id: 'dg-matrix', title: 'مين يتعمل بإيه؟', en: 'Figure 1-1: materials and manufacturing', ref: 'L1 · S5', scene: 'matrix',
      blocks: [
        { t: 'say', who: 'designer', text: 'السؤال اللي أي مصمم بيسأله: الخامة دي ينفع تتعمل بالطريقة دي؟ الجدول ده بيرد.' },
        { t: 'quote', ref: 'L1 · S5', text: 'figure 1-1. materials and manufacturing — All Processes · Most Processes · Some Processes · No Processes', ar: 'شكل ١-١: الخامات وطرق التصنيع. وكل خانة فيها دايرة من أربعة: كل العمليات، معظمها، بعضها، ولا عملية.' },
        { t: 'p', text: 'الصفوف = الخامات. العواميد = الـ ١٤ فرع اللي لسه شايفينهم، بنفس الترتيب. دايرة مليانة = كل العمليات تنفع. دايرة فاضية = ولا عملية.' },
        { t: 'demo', id: 'dsg-matrix', title: 'اقرا الجدول بنفسك', caption: 'اختار عيلة عواميد، واضغط على أي دايرة. الصفوف المعلّمة هي اللي الامتحان بيحبها.', mount: K.matrixDemo('ar') },
        { t: 'list', style: 'check', items: [
          '**الحديدي** <en>Ferrous</en>: كل الخانات <en>All Processes</en>. الصف الوحيد اللي كده.',
          '**غير الحديدي** <en>Nonferrous</en>: كله <en>All</en>، ماعدا <en>Flame/Laser</en> = <en>Most</en>.',
          '**بلاستيك** <en>Thermoset</en>: <en>Liquid State</en> آه. <en>Plastic</en> و<en>Solid State</en> لأ. لا <en>Weld</en> ولا <en>Solder/Braze</en>. اللزق والربط الميكانيكي آه.',
          '**بلاستيك** <en>Thermoplastics</en>: <en>Liquid</en> و<en>Plastic State</en> آه. <en>Weld</en> آه. <en>Solder/Braze</en> لأ.',
          '**الخشب** <en>Wood Products</en>: لا <en>Weld</en> ولا <en>Solder/Braze</en>. اللزق والربط الميكانيكي آه.'
        ] },
        { t: 'check', q: 'dg30' },
        { t: 'check', q: 'dg31' },
        { t: 'why', text: 'ليه الـ <en>thermoplastic</en> يتلحم والـ <en>thermoset</en> لأ؟ (شرح عام، مش من السلايد): الـ <en>thermoplastic</en> بيطرى تاني لما يسخن، فتقدر تسيّح حرفين وتلزقهم. الـ <en>thermoset</en> بيتجمد مرة واحدة، ومابيطراش تاني.' },
        { t: 'quote', ref: 'L1 · S5', text: '*not within the scope of engineering materials, therefore not covered in this book', ar: 'النجمة اللي على <en>Natural Materials</en> (الألياف والخشب) معناها: مش من الخامات الهندسية، فالكتاب مش بيغطيها.' },
        { t: 'check', q: 'dg35' },
        { t: 'trap', text: 'السؤال المحبوب: «أنهي بلاستيك يتلحم؟». الـ <en>Thermoplastics</en> بس. والـ <en>Thermoset</en> لأ.', wrong: 'Thermoset plastics can be welded', right: 'Thermoplastics: Weld = All Processes · Thermoset: Weld = No Processes' },
        { t: 'tip', text: 'الحديد: كله ينفع. الـ <en>Thermoset</en>: يتصب، ومايتلحمش. الخشب: يتلزق ويتربط، ومايتلحمش.' }
      ]
    },
    {
      id: 'dg-products', title: 'اقرا المنتج', en: 'Read the product', ref: 'L1 · S8–S18', scene: 'designer',
      blocks: [
        { t: 'say', who: 'designer', text: 'آخر المحاضرة صور منتجات من غير ولا كلمة. دي مش استراحة. ده تمرين.' },
        { t: 'p', text: 'خد أي منتج، واسأله أربع أسئلة: اتشكّل إزاي؟ اتقطع إزاي؟ اتوصّل إزاي؟ اتشطّب إزاي؟ اقلب الكروت وشوف.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'ترابيزة ستانلس', en: 'steel table · S8', text: 'الزخارف اللي في الرجول: <en>Cutting → Flame/Laser</en>.', art: P.table },
          { title: 'سرير مواسير', en: 'tube bed · S9–S10', text: 'المواسير اتثنت دواير وأقواس: <en>Forming → Solid State</en>. واتلحمت في الإطار: <en>Joining → Weld</en>.', art: P.bed },
          { title: 'مكتب صاج ملفوف', en: 'rolled desk · S11', text: 'الصاج اتلف: <en>Forming → Solid State</en>. والبرشام: <en>Joining → Mechanical</en>.', art: P.desk },
          { title: 'حامل موبايل', en: 'phone stand · S12', text: 'اتقطع من صاج: <en>Cutting → Sheet Cutting</en>. واتثنى: <en>Forming → Solid State</en>.', art: P.stand },
          { title: 'لمبة صاج متطبّقة', en: 'folded lamp · S13', text: 'اتثنت: <en>Forming → Solid State</en>. واتدهنت: <en>Finishing → Coatings</en>.', art: P.lamp },
          { title: 'سلة صاج مخرّم', en: 'perforated basket · S14', text: 'الخروم الكتير: <en>Cutting → Sheet Cutting</en>. والجناب اتثنت: <en>Forming → Solid State</en>.', art: P.basket },
          { title: 'أشكال ألومنيوم مبرومة', en: 'spun forms · S15', text: 'اتبرمت على مخرطة: <en>Forming → Solid State</en>. والبرم في المحاضرة الرابعة.', art: P.spun },
          { title: 'عربية من سلك', en: 'wire car · S16', text: 'السلك اتثنى على شكل العربية: <en>Forming → Solid State</en>. والسلوك اتوصلت في بعض: <en>Joining</en>.', art: P.wirecar },
          { title: 'صناديق وكراسي بلاستيك', en: 'plastic crates · S17–S18', text: 'البلاستيك اخد شكل القالب: <en>Forming</en>.', art: P.crate }
        ] },
        { t: 'quote', ref: 'L1 · S2', text: 'With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an array of possible design solutions and have some confidence that they can be manufactured.', ar: 'ده نفس الكلام اللي بدأنا بيه. لما تعرف الخامات والطرق، تقرا أي منتج، وتقترح حلول وانت واثق.' },
        { t: 'check', q: 'dg37' },
        { t: 'tip', text: 'في الامتحان، لو لقيت منتج: فكّه لأربع أفعال. شكّل، اقطع، وصّل، شطّب. وبعدين اختار الفرع.' }
      ]
    }
  ]
};
