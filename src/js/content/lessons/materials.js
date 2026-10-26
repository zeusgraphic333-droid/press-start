// Lesson — materials (Arabic edition). Lecture 1 · S4 (the materials tree), S6 (metals chart, pure metals vs alloys) and
// Lecture 2 · S2–S3 (the classification of engineering materials). Art and demos: _materials-kit.js · rules: docs/BRIEF.md.
import * as K from './_materials-kit.js';

const I = K.ITEM_ICON;

export default {
  zone: 'materials',
  hero: { say: 'قبل ما تشكّل أي حاجة، لازم تعرف هي من أنهي عيلة. حديد؟ بلاستيك؟ سيراميك؟ هنا هنرسم شجرة العيلة كلها.' },
  chapters: [
    {
      id: 'mt-tree', title: 'عيلة الخامات', en: 'The materials family tree', ref: 'L1 · S4', scene: 'materialsTree',
      blocks: [
        { t: 'say', who: 'lattice', text: 'الخامات كلها أربع عائلات. وكل عيلة ليها فروع. والفروع دي هي اللي بتتسأل.' },
        { t: 'quote', ref: 'L1 · S4', text: 'Materials: Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials', ar: 'الخامات: معادن، وبلاستيك، ومطاط وإلاستومرات، وخامات هندسية طبيعية.' },
        { t: 'fig', id: 'mt-l1tree', caption: 'الشجرة زي السلايد بالظبط: ٤ عائلات تحت كلمة <en>Materials</en>.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'المعادن', en: 'Metals', text: '<en>Ferrous</en> و<en>Nonferrous</en>: حديدية وغير حديدية.', art: K.FAM_ICON.metals },
          { title: 'البلاستيك', en: 'Plastics', text: '<en>Thermoset</en> و<en>Thermoplastic</en>.', art: K.FAM_ICON.plastics },
          { title: 'المطاط', en: 'Rubber/Elastomers', text: 'برضه <en>Thermoset</en> و<en>Thermoplastic</en>. نفس تقسيمة البلاستيك.', art: K.FAM_ICON.rubber },
          { title: 'خامات هندسية طبيعية', en: 'Natural Engineering Materials', text: '<en>Engineering Ceramics · Glass · Manufactured Carbon · Refractory Hard Metals</en>.', art: K.FAM_ICON.natural }
        ] },
        { t: 'check', q: 'mt01' },
        { t: 'p', text: 'عدّ الفروع: المعادن ٢، والبلاستيك ٢، والمطاط ٢، والطبيعية ٤. يعني ١٠ فروع تحت ٤ عائلات.' },
        { t: 'check', q: 'mt02' },
        { t: 'why', text: 'ليه نقسّم الخامات أصلًا؟ لأن كل عيلة ليها طرق تصنيع تنفع معاها، وطرق لأ. افتكر <en>figure 1-1</en> في منطقة «المصمم والمصنع»: صفوفه هي نفس العائلات دي.' },
        { t: 'tip', text: 'معدن، بلاستيك، مطاط، طبيعي. تحت المعدن: حديدي وغير حديدي. وتحت البلاستيك والمطاط: <en>Thermoset</en> و<en>Thermoplastic</en>.' }
      ]
    },
    {
      id: 'mt-natural', title: 'المطاط، والخامات الطبيعية', en: 'Rubber and the natural engineering materials', ref: 'L1 · S4', scene: 'elastomers',
      blocks: [
        { t: 'say', who: 'spring', text: 'المطاط بيتشد ويرجع. بس في الشجرة، اتقسم زي البلاستيك بالظبط.' },
        { t: 'quote', ref: 'L1 · S4', text: 'Rubber/Elastomers: Thermoset · Thermoplastic', ar: 'المطاط والإلاستومرات: Thermoset وThermoplastic.' },
        { t: 'compare', left: { title: 'البلاستيك', en: 'Plastics', text: '<en>Thermoset · Thermoplastic</en>' }, right: { title: 'المطاط', en: 'Rubber/Elastomers', text: '<en>Thermoset · Thermoplastic</en>' }, note: 'عيلتين مختلفتين، ونفس التقسيمة بالظبط.' },
        { t: 'check', q: 'mt03' },
        { t: 'h', text: 'الخامات الهندسية الطبيعية', en: 'Natural Engineering Materials' },
        { t: 'quote', ref: 'L1 · S4', text: 'Natural Engineering Materials: Engineering Ceramics · Glass · Manufactured Carbon · Refractory Hard Metals', ar: 'الخامات الهندسية الطبيعية: سيراميك هندسي، وزجاج، وكربون مُصنَّع، ومعادن صلبة حرارية.' },
        { t: 'art', html: K.artNatural('ar'), caption: 'الأربعة كصور. السلايد مابيشرحهمش، بيسمّيهم بس.' },
        { t: 'trap', text: '<en>Refractory Hard Metals</en> فيها كلمة <en>Metals</en>. بس في الشجرة دي هي تحت <en>Natural Engineering Materials</en>، مش تحت <en>Metals</en>!', wrong: 'Refractory Hard Metals → Metals', right: 'Refractory Hard Metals → Natural Engineering Materials' },
        { t: 'check', q: 'mt05' },
        { t: 'check', q: 'mt04' },
        { t: 'tip', text: 'الطبيعية أربعة: سيراميك، وزجاج، وكربون، ومعادن حرارية. <en>Ceramics · Glass · Carbon · Refractory</en>.' }
      ]
    },
    {
      id: 'mt-metals', title: 'شجرة المعادن', en: 'The metals chart', ref: 'L1 · S6 · L2 · S3', scene: 'metalsChart',
      blocks: [
        { t: 'say', who: 'ingot', text: 'المعادن نفسها عيلة كبيرة. السلايد رسمها فرعين بخط عادي، وفرع تالت بخط متقطع.' },
        { t: 'fig', id: 'mt-metals', caption: 'الفرعين الأساسيين بخط عادي. و<en>Powdered Metallurgy</en> بخط متقطع.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Metals are generally divided into ferrous and nonferrous.', ar: 'المعادن بتتقسم عمومًا لحديدية وغير حديدية.' },
        { t: 'p', text: 'كلمة <en>generally</en> معناها «عمومًا». التقسيمة الأساسية اتنين بس. والفرع المتقطع، <en>Powdered Metallurgy</en> (تعدين المساحيق)، هو التالت. والسلايد ده اتكرر بالظبط في أول المحاضرة التانية (L2 · S3).' },
        { t: 'check', q: 'mt07' },
        { t: 'why', text: 'إيه هو <en>Powdered Metallurgy</en>؟ (شرح عام، مش من السلايد): بودرة معدن بتتكبس في قالب، وبعدين تتسخن لحد ما الحبيبات تمسك في بعض. السلايد مابيشرحوش. احفظ مكانه بس: الفرع المتقطع.' },
        { t: 'check', q: 'mt08' },
        { t: 'compare', left: { title: 'حديدية', en: 'Ferrous', text: 'فيها حديد: <en>CONTAINS IRON</en>.' }, right: { title: 'غير حديدية', en: 'Nonferrous', text: 'مفيهاش حديد: <en>CONTAINS NO IRON</en>.' }, note: 'التعريف ده من شجرة المحاضرة التانية (L2 · S2). جاي بالتفصيل بعد شوية.' },
        { t: 'tip', text: 'حديدي، وغير حديدي، ومساحيق (المتقطع).' }
      ]
    },
    {
      id: 'mt-pure', title: 'معدن نقي ولا سبيكة؟', en: 'Pure metal or alloy?', ref: 'L1 · S6', scene: 'atoms',
      blocks: [
        { t: 'say', who: 'lattice', text: 'بص جوه المعدن. لو كل الذرات شبه بعض، ده معدن نقي. لو فيه أكتر من نوع، دي سبيكة.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Pure metals are composed of atoms of the same type.', ar: 'المعدن النقي متكوّن من ذرات من نفس النوع.' },
        { t: 'quote', ref: 'L1 · S6', text: 'Metal alloys are composed of two or more chemical elements.', ar: 'السبيكة متكوّنة من عنصرين كيميائيين أو أكتر.' },
        { t: 'compare', left: { title: 'معدن نقي', en: 'Pure metal', art: K.latticeSVG('pure', 3), text: '<en>atoms of the same type</en>: نوع واحد بس من الذرات.' }, right: { title: 'سبيكة', en: 'Alloy', art: K.latticeSVG('alloy', 7), text: '<en>two or more chemical elements</en>: عنصرين أو أكتر متخلطين.' } },
        { t: 'check', q: 'mt09' },
        { t: 'demo', id: 'mat-alloy', title: 'اخلط سبيكة بإيدك', caption: 'ضيف عنصر تاني، وبعدين ازق الطبقات. جرّب النقي، وجرّب السبيكة، وقارن.', mount: K.alloyDemo('ar') },
        { t: 'quote', ref: 'L1 · S6', text: 'This blending of elements gives alloys their greater mechanical properties.', ar: 'الخلط ده هو اللي بيدّي السبايك خواص ميكانيكية أعلى.' },
        { t: 'why', text: 'ليه الخلط بيقوّي؟ (شرح عام): الذرات اللي حجمها مختلف بتعمل «مطبات» جوه المعدن. الطبقات بتلاقي صعوبة إنها تتزحلق على بعض. فالمعدن يقاوم أكتر.' },
        { t: 'check', q: 'mt10' },
        { t: 'check', q: 'mt11' },
        { t: 'trap', text: 'السؤال ممكن يعكسها ويقول إن المعدن النقي «أقوى ميكانيكيًا». **غلط**. السلايد قال إن الخلط هو اللي بيدّي <en>greater mechanical properties</en>. يعني السبيكة.', wrong: 'Pure metals have greater mechanical properties', right: 'This blending of elements gives alloys their greater mechanical properties' },
        { t: 'tip', text: 'نقي = نوع واحد. سبيكة = عنصرين أو أكتر = أقوى ميكانيكيًا.' }
      ]
    },
    {
      id: 'mt-alloys', title: 'ليه أغلب المعادن سبايك؟', en: 'Why most metals are alloys', ref: 'L1 · S6', scene: 'alloy',
      blocks: [
        { t: 'say', who: 'usta', text: 'في الورشة، نادر تمسك معدن نقي. اللي بتشتغل بيه طول اليوم سبايك.' },
        { t: 'quote', ref: 'L1 · S6', text: 'The majority of metals used in engineering applications are alloys.', ar: 'معظم المعادن اللي بتستخدم في التطبيقات الهندسية سبايك.' },
        { t: 'check', q: 'mt14' },
        { t: 'quote', ref: 'L1 · S6', text: 'Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.', ar: 'كل سبيكة ليها خواص ميكانيكية وفيزيائية محددة، بتخليها مناسبة لاستخدام معين.' },
        { t: 'grid', cols: 3, items: [
          { title: 'حديد زهر رمادي', en: 'Gray iron', text: 'بلوك الموتور، والتروس، والطارات.', art: I.engine },
          { title: 'حديد زهر مرن', en: 'Ductile iron', text: 'عمود الكرنك، والتروس التقيلة.', art: I.crank },
          { title: 'حديد زهر أبيض', en: 'White iron', text: 'الكسّارات، وأي حاجة بتتآكل بالاحتكاك.', art: I.crusher }
        ] },
        { t: 'example', title: 'كل سبيكة ليها شغلانة', text: 'التلات دول من المحاضرة التانية: تلات أنواع حديد زهر، وكل واحد ليه استخدام مختلف. ده بالظبط معنى <en>a good fit for a specific application</en>.' },
        { t: 'check', q: 'mt15' },
        { t: 'list', style: 'check', items: [
          '**نقي**: <en>atoms of the same type</en>.',
          '**سبيكة**: <en>two or more chemical elements</en>.',
          '**الخلط** بيدّي السبايك <en>greater mechanical properties</en>.',
          '**أغلب** المعادن الهندسية سبايك: <en>the majority … are alloys</en>.',
          '**التقسيمة**: <en>ferrous and nonferrous</en>.',
          '**كل سبيكة** ليها خواص تناسب <en>a specific application</en>.'
        ] },
        { t: 'trap', text: 'صح وغلط: «أغلب المعادن الهندسية معادن نقية». **غلط**. أغلبها سبايك.', wrong: 'The majority of engineering metals are pure metals', right: 'The majority of metals used in engineering applications are alloys' },
        { t: 'check', q: 'mt16' },
        { t: 'tip', text: 'السلايد ده ٦ جمل، وكل جملة ممكن تبقى سؤال. احفظ الكلمات دي: <en>same type · two or more · greater mechanical · majority · ferrous and nonferrous · specific application</en>.' }
      ]
    },
    {
      id: 'mt-classify', title: 'معادن ولا لا معادن؟', en: 'Classification of engineering materials', ref: 'L2 · S2', scene: 'classTree',
      blocks: [
        { t: 'say', who: 'lattice', text: 'المحاضرة التانية رسمت الشجرة بطريقة تانية. فرعين بس في الأول: معادن، ولا معادن.' },
        { t: 'quote', ref: 'L2 · S2', text: 'CLASSIFICATION OF ENGINEERING MATERIALS — ENGINEERING MATERIALS: METALS (FERROUS (CONTAINS IRON) · NON-FERROUS (CONTAINS NO IRON)) · NON-METALS (POLYMERS · CERAMICS)', ar: 'تصنيف الخامات الهندسية: معادن (حديدية وغير حديدية)، ولا معادن (بوليمرات وسيراميك).' },
        { t: 'fig', id: 'mt-l2tree', caption: 'الشجرة زي السلايد. الخامات اللي تحت كل صندوق جاية في الفصول الجاية.' },
        { t: 'check', q: 'mt17' },
        { t: 'demo', id: 'mat-path', title: 'دوّر على الخامة في الشجرة', caption: 'اضغط على أي خامة، وشوف طريقها من فوق لتحت. ده نفس التفكير اللي هتعمله في الامتحان.', mount: K.pathDemo('ar') },
        { t: 'check', q: 'mt18' },
        { t: 'compare', left: { title: 'شجرة المحاضرة الأولى', en: 'L1 · S4', text: '٤ عائلات: <en>Metals · Plastics · Rubber/Elastomers · Natural Engineering Materials</en>.' }, right: { title: 'شجرة المحاضرة التانية', en: 'L2 · S2', text: 'فرعين: <en>Metals</en> و<en>Non-metals</en>. واللا معادن = <en>Polymers</en> و<en>Ceramics</en>.' }, note: 'نفس الخامات، ورسمتين مختلفتين. شوف السؤال بيتكلم عن أنهي شجرة.' },
        { t: 'trap', text: 'البوليمرات والسيراميك فروع **اللا معادن**. وفي الشجرة دي اسم العيلة <en>Polymers</en>، مش <en>Plastics</en> زي المحاضرة الأولى.', wrong: 'In L2, polymers are a branch of metals', right: 'NON-METALS → POLYMERS · CERAMICS' },
        { t: 'tip', text: 'اسأل نفسك بالترتيب: معدن؟ يبقى فيه حديد ولا لأ؟ مش معدن؟ يبقى بوليمر ولا سيراميك؟ بوليمر؟ يبقى <en>setting</en> ولا <en>plastic</en>؟' }
      ]
    },
    {
      id: 'mt-ferrous', title: 'الحديدي: فيه حديد', en: 'Ferrous: it contains iron', ref: 'L2 · S2', scene: 'ferrous',
      blocks: [
        { t: 'say', who: 'ingot', text: 'أول فرع في المعادن: اللي فيها حديد. ودي أكتر حاجة هتقابلها في الورشة.' },
        { t: 'quote', ref: 'L2 · S2', text: 'FERROUS (CONTAINS IRON): WROUGHT IRON · CARBON STEELS · ALLOY STEELS · CAST IRONS', ar: 'الحديدية (فيها حديد): الحديد المطاوع، والصلب الكربوني، والصلب السبائكي، والحديد الزهر.' },
        { t: 'grid', cols: 4, items: [
          { title: 'حديد مطاوع', en: 'Wrought iron', text: 'الشغل المشغول والبوابات. وفي المحاضرة التانية: من أمثلة الخامات المطاوعة <en>malleable</en>.', art: I.wrought },
          { title: 'صلب كربوني', en: 'Carbon steels', text: 'الصلب العادي: كمرات، وأسياخ، وصاج.', art: I.carbon },
          { title: 'صلب سبائكي', en: 'Alloy steels', text: 'صلب متضاف له عناصر تانية. اسمه بيقولك إنه سبيكة.', art: I.alloy },
          { title: 'حديد زهر', en: 'Cast irons', text: 'فيه ٢٪ كربون على الأقل. وليه منطقة كاملة لوحده.', art: I.cast }
        ] },
        { t: 'check', q: 'mt21' },
        { t: 'check', q: 'mt22' },
        { t: 'trap', text: '<en>Alloy steels</en> فيها كلمة <en>Alloy</en>. بس هي برضه **حديدية**، لأن فيها حديد. سبيكة وحديدية في نفس الوقت.', wrong: 'Alloy steels → Non-ferrous', right: 'Alloy steels → Ferrous (contains iron)' },
        { t: 'check', q: 'mt24' },
        { t: 'tip', text: 'الأربعة كلهم في اسمهم «حديد» أو «صلب»: <en>wrought IRON · carbon STEELS · alloy STEELS · cast IRONS</en>.' }
      ]
    },
    {
      id: 'mt-nonferrous', title: 'غير الحديدي: مفيهوش حديد', en: 'Non-ferrous: no iron inside', ref: 'L2 · S2', scene: 'nonferrous',
      blocks: [
        { t: 'say', who: 'ingot', text: 'الفرع التاني: معادن مفيهاش حديد خالص. ستة على السلايد، وبعدهم <en>etc</en>.' },
        { t: 'quote', ref: 'L2 · S2', text: 'NON-FERROUS (CONTAINS NO IRON): ALUMINIUM · COPPER · LEAD · SILVER · TIN · ZINC, etc', ar: 'غير الحديدية (مفيهاش حديد): ألومنيوم، ونحاس، ورصاص، وفضة، وقصدير، وزنك، وغيرهم.' },
        { t: 'art', html: K.artIngots('ar'), caption: 'ست سبايك، ولا واحدة فيها حديد.' },
        { t: 'p', text: 'كلمة <en>etc</en> في الآخر معناها «وغيرهم». يعني فيه معادن غير حديدية تانية. بس الامتحان بيسأل على الستة دول.' },
        { t: 'check', q: 'mt25' },
        { t: 'check', q: 'mt26' },
        { t: 'trap', text: 'السؤال ممكن يحط <en>wrought iron</en> أو <en>cast irons</en> وسط النحاس والألومنيوم. أي حاجة اسمها <en>iron</en> أو <en>steel</en> = حديدية.', wrong: 'Wrought iron → Non-ferrous', right: 'Wrought iron → Ferrous' },
        { t: 'tip', text: 'الستة: ألومنيوم، ونحاس، ورصاص، وفضة، وقصدير، وزنك. ورموزهم: <en>Al · Cu · Pb · Ag · Sn · Zn</en>.' }
      ]
    },
    {
      id: 'mt-polymers', title: 'البوليمرات: نوعين', en: 'Polymers: thermosetting and thermoplastic', ref: 'L2 · S2', scene: 'polymers',
      blocks: [
        { t: 'say', who: 'spark', text: 'اللا معادن فرعين. أولهم البوليمرات. وتحتها نوعين، والامتحان بيحب يلخبط بينهم.' },
        { t: 'quote', ref: 'L2 · S2', text: 'POLYMERS — THERMO SETTING POLYMERS (PLASTICS): PHENOLFORMALDEHYDE (BAKELITE) · POLYSTERS · EPOXRESINS — THERMO PLASTIC: PVC · POLYTHENE · ACRYLIC · RESINS', ar: 'في السلايد مكتوبة <en>POLYSTERS</en> و<en>EPOXRESINS</en>. صحتهم <en>polyesters</en> و<en>epoxy resins</en>.' },
        { t: 'compare', left: { title: 'المتصلّدة بالحرارة', en: 'Thermosetting', art: K.NET, text: '<en>Bakelite (phenolformaldehyde) · polyesters · epoxy resins</en>' }, right: { title: 'اللدائن الحرارية', en: 'Thermoplastic', art: K.CHAINS, text: '<en>PVC · polythene · acrylic · resins</en>' }, note: 'الرسمتين صورة للفكرة بس: شبكة مربوطة، وسلاسل سايبة.' },
        { t: 'why', text: 'إيه الفرق؟ (شرح عام، مش من السلايد): الـ <en>thermoplastic</en> لما تسخّنه يطرى تاني، فينفع يتعاد تشكيله. الـ <en>thermosetting</en> بيتجمد مرة واحدة وخلاص. لو سخّنته تاني مش هيطرى. السلايد مش شارح الفرق ده، فالأسئلة هتبقى على **الأمثلة**.' },
        { t: 'check', q: 'mt28' },
        { t: 'check', q: 'mt29' },
        { t: 'example', title: 'من البيت', text: 'مقبض الحلة الأسود اللي مابيسخنش غالبًا باكاليت. وماسورة الصرف الرمادي غالبًا <en>PVC</en>. الأمثلة دي عشان تتخيل بس.' },
        { t: 'trap', text: '<en>Epoxy resins</en> تحت الـ <en>thermosetting</en>. بس كلمة <en>resins</en> لوحدها مكتوبة تحت الـ <en>thermoplastic</en>. متتلخبطش: الإيبوكسي = <en>thermosetting</en>.', wrong: 'Epoxy resins → Thermoplastic', right: 'Epoxy resins → Thermosetting · (plain “resins” → Thermoplastic)' },
        { t: 'check', q: 'mt30' },
        { t: 'tip', text: 'الـ <en>setting</en>: باكاليت، وبوليستر، وإيبوكسي. الـ <en>plastic</en>: <en>PVC</en>، وبولي إيثيلين، وأكريليك.' }
      ]
    },
    {
      id: 'mt-ceramics', title: 'السيراميك', en: 'Ceramics', ref: 'L2 · S2', scene: 'ceramics',
      blocks: [
        { t: 'say', who: 'anvil', text: 'الفرع التاني من اللا معادن: السيراميك. وتحته خمس حاجات، منهم حاجات مش هتتوقعها.' },
        { t: 'quote', ref: 'L2 · S2', text: 'CERAMICS: REFRACTORIES · ABRASIVES · GLASS · CEMENT · CONCRETE', ar: 'السيراميك: الحراريات، والمواد الكاشطة، والزجاج، والأسمنت، والخرسانة.' },
        { t: 'grid', cols: 3, items: [
          { title: 'حراريات', en: 'Refractories', text: 'الطوب اللي بيبطّن الأفران.', art: I.refractory },
          { title: 'مواد كاشطة', en: 'Abrasives', text: 'حجر الجلخ، وورق الصنفرة.', art: I.abrasive },
          { title: 'زجاج', en: 'Glass', text: 'الشبابيك والكوبايات.', art: I.glass },
          { title: 'أسمنت', en: 'Cement', text: 'البودرة الرمادي اللي في الشكاير.', art: I.cement },
          { title: 'خرسانة', en: 'Concrete', text: 'أسمنت ورمل وزلط وميه، بتتصب وتنشف.', art: I.concrete }
        ] },
        { t: 'check', q: 'mt33' },
        { t: 'p', text: 'خلّي بالك: <en>Abrasives</en> هنا **خامة** (حجر الجلخ نفسه). مش زي <en>Abrasive/Cut</en> اللي في التشطيب، اللي هو **عملية**.' },
        { t: 'check', q: 'mt34' },
        { t: 'trap', text: 'الزجاج في المحاضرة التانية تحت <en>Ceramics</en>. لكن في شجرة المحاضرة الأولى كان تحت <en>Natural Engineering Materials</en>. الاتنين صح، كل واحد في شجرته.', wrong: 'Glass is a polymer', right: 'Glass: L2 → Ceramics · L1 → Natural Engineering Materials' },
        { t: 'check', q: 'mt35' },
        { t: 'tip', text: 'خمسة: <en>refractories · abrasives · glass · cement · concrete</en>. افتكرهم كده: فرن، وجلخ، وشباك، وشكارة، وصبّة.' }
      ]
    }
  ]
};
