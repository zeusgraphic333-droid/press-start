// Lesson — bend (Arabic edition). Lecture 3, slides 2–28: solid state forming, foil · sheet · plate, the shop's words,
// the forming tree and its cost, the neutral axis, BA / BD and the flat length, the K-factor, relief, bend radius,
// V and edge bending, springback, the six bending operations, roll forming, wire and tube forming.
// Block reference: content/lessons/_sample.js · house rules: docs/BRIEF.md · drawings: data/figs/bend.js.
import { ART, ICON } from '../../data/figs/bend.js';
import { mountUnfold, mountK, mountSpring } from './_bend-demos.js';

export default {
  zone: 'bend',
  hero: { say: 'أكبر محاضرة في المادة. بس فكرتها واحدة: إزاي تثني الصاج بالمقاس الصح، من غير ما يتكسر، ومن غير ما يرجع. يلا على الورشة.' },
  chapters: [
    {
      id: 'bd-forming', title: 'المعدن وهو صلب', en: 'Metal forming → solid state forming', ref: 'L3 · S2–S3', scene: 'formingStates',
      blocks: [
        { t: 'say', who: 'usta', text: 'المعدن بيتشكّل بأكتر من طريقة. ممكن وهو سايح، وممكن وهو طري. النهارده هنشتغل عليه وهو صلب خالص.' },
        { t: 'quote', text: 'Metal Forming → Liquid State Forming · Fluid State Forming · Plastic State Forming · Solid State Forming', ref: 'L3 · S2', ar: 'تشكيل المعادن ٤ حالات: سايل، ومايع، ولدن، وصلب. والمايع مرسوم بخط متقطّع.' },
        { t: 'art', html: ART['bd-states'](), caption: 'شجرة السلايد: ٤ حالات. المحاضرة دي كلها في الرابعة، <en>Solid State Forming</en>.' },
        { t: 'p', text: 'السلايد بيدّيك الأسامي بس. الفكرة بسيطة: في الحالة الصلبة المعدن مش بيسيح ولا بيطرى. بنشكّله وهو حتة صلبة، بالقوة.' },
        { t: 'check', q: 'bd04' },
        { t: 'quote', text: 'Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working', ref: 'L3 · S3', ar: 'التشكيل في الحالة الصلبة = تشكيل صاج، أو سيخ، أو سلك، أو ماسورة. وغالبًا على البارد.' },
        { t: 'grid', cols: 4, items: [
          { title: 'صاج', en: 'Sheet', text: 'لوح رفيع.', art: ICON.form('sheet') },
          { title: 'سيخ', en: 'Rod', text: 'عمود مصمت.', art: ICON.form('rod') },
          { title: 'سلك', en: 'Wire', text: 'سيخ رفيع جدًا.', art: ICON.form('wire') },
          { title: 'ماسورة', en: 'Tube', text: 'مفرّغة من جوه.', art: ICON.form('tube') }
        ] },
        { t: 'p', text: '<en>Cold working</en> يعني بنشكّل المعدن وهو بارد، في حرارة الأوضة. من غير فرن.' },
        { t: 'check', q: 'bd01' },
        { t: 'h', text: 'إمتى نسخّن؟', en: 'When heating is needed' },
        { t: 'quote', text: 'In some cases, heating the metal may be required if it is thick, is not very ductile, or becomes work-hardened during forming.', ref: 'L3 · S3', ar: 'أحيانًا لازم نسخّن: لو المعدن تخين، أو مش مطيلي (ductile) أوي، أو اتصلّب من كتر الشغل.' },
        { t: 'list', style: 'check', items: ['**تخين** <en>thick</en>: محتاج قوة كبيرة، والسخونية بتسهّل.', '**مش <en>ductile</en> أوي** <en>not very ductile</en>: مش بيستحمل يتمط، فممكن يشرخ.', '**اتصلّب وهو بيتشكّل** <en>work-hardened during forming</en>: كل ما تثنيه، بيجمد أكتر.'] },
        { t: 'quote', text: 'During the forming process, some metals can become brittle and may require annealing before the forming operation is continued.', ref: 'L3 · S3', ar: 'وسط الشغل، معادن بتبقى قصيفة (brittle)، ومحتاجة annealing قبل ما نكمّل.' },
        { t: 'example', title: 'دبوس الورق', text: 'هات دبوس ورق واثنيه رايح جاي. أول كام مرة سهل. بعدين يجمد. وفي الآخر يتقصف. ده اللي السلايد بيسميه <en>work-hardened</en> وبعدين <en>brittle</en>. في المصنع، قبل ما يوصل لكده، بيعملوله <en>annealing</en>.' },
        { t: 'why', text: 'الـ <en>annealing</en> معالجة حرارية: بنسخّن المعدن ونسيبه يبرد على مهله، فيرجع طري ويستحمل تشكيل تاني. (ده شرح عام. السلايد ذكر الاسم بس.)' },
        { t: 'trap', text: 'سؤال صح وغلط بيقولك إن التشكيل الصلب لازم سخونية. **غلط**.', wrong: 'Solid state forming always needs heating', right: 'usually performed as cold working · heating only in some cases' },
        { t: 'check', q: 'bd03' },
        { t: 'tip', text: 'بارد في العادي. نسخّن لو: تخين، أو مش <en>ductile</en>، أو <en>work-hardened</en>. ولو بقى <en>brittle</en>: <en>annealing</en>.' }
      ]
    },
    {
      id: 'bd-gauge', title: 'فويل ولا صاج ولا بليت؟', en: 'Foil, sheet or plate?', ref: 'L3 · S3', scene: 'sheetGauge',
      blocks: [
        { t: 'say', who: 'caliper', text: 'الفرق بين الفويل والصاج والبليت مش في نوع المعدن. الفرق في التُخن بس.' },
        { t: 'quote', text: 'A piece of metal whose thickness is between 0.006(0.15 mm) and 0.25 inches(6.35 mm) called sheet metal. Anything thinner is referred to as a foil and thicker is considered as a plate.', ref: 'L3 · S3', ar: 'الصاج: تخانته من 0.15 mm لحد 6.35 mm. أرفع من كده = فويل. أتخن من كده = بليت.' },
        { t: 'art', html: ART['bd-gauge'](), caption: 'نفس المعدن، ٣ أسامي. الحدود: 0.15 mm و6.35 mm.' },
        { t: 'p', text: 'خد بالك من الأرقام. السلايد كاتب 0.006 من غير وحدة، والمقصود **بوصة**. 0.006 بوصة = 0.15 mm. و0.25 بوصة (ربع بوصة) = 6.35 mm.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'فويل', en: 'Foil', text: 'أرفع من 0.15 mm. زي ورق الألومنيوم اللي بتلف فيه الأكل.', color: 'var(--ink-3)' },
          { title: 'صاج', en: 'Sheet metal', text: 'من 0.15 لحد 6.35 mm. باب عربية، حلة، جسم كمبيوتر.', color: 'var(--zc)' },
          { title: 'بليت', en: 'Plate', text: 'أتخن من 6.35 mm. قاعدة ماكينة تقيلة، أو جسم مركب.', color: 'var(--hot)' }
        ] },
        { t: 'check', q: 'bd05' },
        { t: 'trap', text: 'أشهر غلطة: تبدّل البوصة بالمللي. الحدود **0.15 mm و6.35 mm**، يعني **0.006 in و0.25 in**.', wrong: 'Sheet metal: 0.15 – 6.35 inches', right: '0.006 – 0.25 in = 0.15 – 6.35 mm' },
        { t: 'why', text: 'ليه التُخن مهم؟ لأنه بيغيّر كل حاجة: القوة اللي محتاجها، والعدة، وأحيانًا لازم تسخّن. فاكر؟ «لو تخين» كانت أول سبب للتسخين.' },
        { t: 'check', q: 'bd06' },
        { t: 'tip', text: 'أقل من 0.15 = فويل. من 0.15 لـ 6.35 = صاج. أكتر من 6.35 = بليت. و6.35 mm دي ربع بوصة بالظبط.' }
      ]
    },
    {
      id: 'bd-shop', title: 'الصاج حواليك، والورشة ليها لغة', en: 'Products, terms and metal shapes', ref: 'L3 · S4–S5', scene: 'stamping',
      blocks: [
        { t: 'say', who: 'usta', text: 'بص حواليك: العربية، والتلاجة، ودولاب المكتب. كلهم صاج. ولما تدخل الورشة، هتسمع ٣ كلمات كتير.' },
        { t: 'quote', text: 'Sheet and plate metal parts for consumer and industrial products such as: Automobiles and trucks · Airplanes · Railway cars and locomotives · Farm and construction equipment · Small and large appliances · Office furniture · Computers and office equipment', ref: 'L3 · S4', ar: 'قطع الصاج والبليت بتدخل في: العربيات والتريلات، الطيارات، القطارات، معدات الزراعة والبناء، الأجهزة المنزلية، أثاث المكاتب، والكمبيوترات.' },
        { t: 'grid', cols: 4, items: [
          { title: 'عربيات', en: 'Automobiles and trucks', art: ICON.product('car') },
          { title: 'طيارات', en: 'Airplanes', art: ICON.product('plane') },
          { title: 'قطارات', en: 'Railway cars and locomotives', art: ICON.product('train') },
          { title: 'معدات زراعة وبناء', en: 'Farm and construction equipment', art: ICON.product('tractor') },
          { title: 'أجهزة منزلية', en: 'Small and large appliances', art: ICON.product('fridge') },
          { title: 'أثاث مكاتب', en: 'Office furniture', art: ICON.product('cabinet') },
          { title: 'كمبيوترات', en: 'Computers and office equipment', art: ICON.product('computer') }
        ] },
        { t: 'check', q: 'bd10' },
        { t: 'h', text: 'تلات كلمات الورشة', en: 'Sheet metalworking terminology' },
        { t: 'quote', text: 'Punch-and-die - tooling to perform cutting, bending, and drawing · Stamping press - machine tool that performs most sheet metal operations · Stampings - sheet metal products', ref: 'L3 · S4', ar: 'البنش والداي = العدة. المكبس = الماكينة. الـ stampings = المنتجات.' },
        { t: 'art', html: ART['bd-press'](), caption: 'المكبس (الماكينة) شايل البنش والداي (العدة)، واللي طالع منه <en>stampings</en> (المنتجات).' },
        { t: 'table', head: ['الكلمة', 'هي إيه', 'بتعمل إيه'], rows: [
          ['<en>Punch-and-die</en>', 'العدة <en>tooling</en>', 'قطع، وثني، وسحب <en>cutting, bending, drawing</en>'],
          ['<en>Stamping press</en>', 'الماكينة <en>machine tool</en>', 'معظم عمليات الصاج <en>most sheet metal operations</en>'],
          ['<en>Stampings</en>', 'المنتجات <en>products</en>', 'القطع اللي خرجت من الصاج']
        ] },
        { t: 'check', q: 'bd08' },
        { t: 'trap', text: '<en>Stamping press</en> و<en>Stampings</en> شبه بعض. الأولى **الماكينة**، والتانية **المنتجات**.', wrong: 'Stampings = the machine tool', right: 'Stamping press = machine tool · Stampings = sheet metal products' },
        { t: 'h', text: 'الخامة بتيجي بأشكال', en: 'Metal shape' },
        { t: 'quote', text: 'Metal can be provided in various shapes and sizes.', ref: 'L3 · S5', ar: 'المعدن بيتباع بأشكال ومقاسات كتير.' },
        { t: 'grid', cols: 4, items: [
          { title: 'دايرة مصمتة', en: 'Round Solid', art: ICON.shape('roundS') },
          { title: 'مربع مصمت', en: 'Square Solid', art: ICON.shape('squareS') },
          { title: 'سداسي مصمت', en: 'Hexagonal Solid', art: ICON.shape('hexS') },
          { title: 'زاوية مصمتة', en: 'Angle Iron Solid', art: ICON.shape('angleS') },
          { title: 'ماسورة', en: 'Round Hollow (Tube)', art: ICON.shape('roundH') },
          { title: 'علبة', en: 'Square Hollow (Box Iron)', art: ICON.shape('squareH') },
          { title: 'سداسي مفرّغ', en: 'Hexagonal Hollow', art: ICON.shape('hexH') },
          { title: 'زاوية مفرّغة', en: 'Angle Iron Hollow', art: ICON.shape('angleH') }
        ] },
        { t: 'check', q: 'bd11' },
        { t: 'tip', text: 'المكبس = ماكينة. البنش والداي = عدة. الـ <en>stampings</en> = منتجات. ومن الأشكال: <en>Tube</en> = دايرة مفرّغة، و<en>Box Iron</en> = مربع مفرّغ.' }
      ]
    },
    {
      id: 'bd-tree', title: 'تلات فروع، تلات أسعار', en: 'Solid state forming and its cost', ref: 'L3 · S6', scene: 'solidTree',
      blocks: [
        { t: 'say', who: 'press', text: 'كل ما العملية تبقى أعقد، الفاتورة بتعلى. السلايد ده بيقولك تمن كل فرع.' },
        { t: 'quote', text: 'Solid State Forming → Simple Bending (Low to Moderate Cost): Bend · Roll · Continuous Roll Forming | Compound Bending (Moderate to High Cost): Spinning · Hydro-forming · Drawing | Form and Cut (Stamping) (High Cost): Progressive · Transfer Dies · Multiple Action Dies', ref: 'L3 · S6', ar: 'التشكيل الصلب ٣ فروع: ثني بسيط (رخيص لمتوسط)، ثني مركّب (متوسط لغالي)، وتشكيل وقطع Stamping (غالي).' },
        { t: 'art', html: ART['bd-tree'](), caption: 'المحاضرة دي = الفرع الأول. محاضرة ٤ = التاني.' },
        { t: 'table', head: ['الفرع', 'التكلفة', 'فيه إيه'], rows: [
          ['<en>Simple Bending</en>', '<en>Low to Moderate</en>', '<en>Bend · Roll · Continuous Roll Forming</en>'],
          ['<en>Compound Bending</en>', '<en>Moderate to High</en>', '<en>Spinning · Hydro-forming · Drawing</en>'],
          ['<en>Form and Cut (Stamping)</en>', '<en>High</en>', '<en>Progressive · Transfer Dies · Multiple Action Dies</en>']
        ] },
        { t: 'check', q: 'bd12' },
        { t: 'why', text: 'ليه الـ <en>Stamping</en> أغلى؟ لأن العدة فيه بتشكّل وتقطع، فبتبقى معقدة. السلايد ذكر أنواعها بالاسم بس: <en>Progressive</en> و<en>Transfer Dies</en> و<en>Multiple Action Dies</en>. فاحفظ الأسامي، من غير تعريفات.' },
        { t: 'trap', text: '<en>Continuous Roll Forming</en> اسمها كبير، بس هي تحت **<en>Simple Bending</en>**. و<en>Drawing</en> تحت **<en>Compound</en>**، مش <en>Simple</en>.', wrong: 'Continuous Roll Forming = Compound Bending', right: 'Simple Bending: Bend · Roll · Continuous Roll Forming' },
        { t: 'check', q: 'bd13' },
        { t: 'tip', text: 'رخيص لمتوسط: <en>Bend, Roll, Continuous</en>. متوسط لغالي: <en>Spinning, Hydro, Drawing</en>. غالي: <en>Progressive, Transfer, Multiple</en>.' }
      ]
    },
    {
      id: 'bd-neutral', title: 'بره بيتشد، وجوه بيتكبس', en: 'Sheet metal bending and the neutral plane', ref: 'L3 · S7–S8', scene: 'neutralAxis',
      blocks: [
        { t: 'say', who: 'usta', text: 'هات مسطرة بلاستيك واثنيها. الوش اللي بره بيتمط، واللي جوه بيتزنق. وفي النص خط مش حاسس بحاجة.' },
        { t: 'quote', text: 'Bending is a metal forming process in which a force is applied to a piece of sheet metal, causing it to bend at an angle and form the desired shape.', ref: 'L3 · S7', ar: 'الثني: قوة على حتة صاج، فتتثني بزاوية وتاخد الشكل اللي عايزه.' },
        { t: 'check', q: 'bd15' },
        { t: 'quote', text: 'Metal on inside of neutral plane is compressed, while metal on outside of neutral plane is stretched · Figure (b) both compression and tensile elongation of the metal occur in bending.', ref: 'L3 · S7', ar: 'اللي جوه المستوى المتعادل بيتكبس، واللي بره بيتمط. يعني في الثني بيحصل ضغط وشد مع بعض.' },
        { t: 'art', html: ART['bd-neutral'](), caption: 'البرتقالي بيتشد (<en>tension</en>). البنفسجي بيتكبس (<en>compression</en>). والخط المتقطّع هو المحور المتعادل: طوله ما بيتغيرش.' },
        { t: 'compare', left: { title: 'جوه الثنية', en: 'Inside · compression', text: 'المعدن بيتزنق ويتكبس <en>compressed</en>.' }, right: { title: 'بره الثنية', en: 'Outside · tension', text: 'المعدن بيتمط ويتشد <en>stretched</en>.' }, note: 'وبينهم: <en>neutral axis</en>، لا متكبس ولا متشد.' },
        { t: 'check', q: 'bd16' },
        { t: 'why', text: 'الوش اللي بره ماشي في لفة أكبر، فلازم يطول. واللي جوه في لفة أصغر، فلازم يقصر. في النص خط طوله ثابت: ده المحور المتعادل. ونفس الكلام اتقال في محاضرة ٢: <en>outside fibers in tension, inside fibers in compression</en>.' },
        { t: 'example', title: 'حامل الموبايل', text: 'حامل موبايل من صاج مثني. لو الثنية حادة أوي، الوش اللي بره ممكن يشرخ من كتر الشد. عشان كده في حاجة اسمها <en>bend radius</en>، هنقابلها كمان شوية.' },
        { t: 'trap', text: 'الامتحان ممكن يعكسها عليك.', wrong: 'Inside is stretched, outside is compressed', right: 'Inside of neutral plane: compressed · outside: stretched' },
        { t: 'check', q: 'bd17' },
        { t: 'tip', text: 'جوه = <en>compression</en>. بره = <en>tension</en>. النص = <en>neutral axis</en>، وطوله ثابت. عليه هنحسب الطول المفرود.' }
      ]
    },
    {
      id: 'bd-flat', title: 'الطول المفرود: BA ولا BD؟', en: 'Bend allowance, bend deduction and the flat length', ref: 'L3 · S9–S10', scene: 'flatLength',
      blocks: [
        { t: 'say', who: 'usta', text: 'قبل ما تثني، لازم تقص الصاج بالطول الصح. أطول؟ الرِجل هتطلع طويلة. أقصر؟ القطعة راحت.' },
        { t: 'quote', text: 'SHEET METAL PARAMETERS: Bend Allowance · Bend Deductions · K-Factor · Bend Relief · Thickness · Bend Radius · Spring Back', ref: 'L3 · S9', ar: 'سبع حاجات بتتحكم في ثني الصاج. وكل واحدة ليها مكان في المنطقة دي.' },
        { t: 'list', style: 'num', items: ['<en>Bend Allowance</en>: الفصل ده.', '<en>Bend Deductions</en>: الفصل ده برضه.', '<en>K-Factor</en>: الفصل الجاي.', '<en>Bend Relief</en>: فتحة التخفيف.', '<en>Thickness</en>: فاكر فويل وصاج وبليت؟', '<en>Bend Radius</en>: نص قطر الثني.', '<en>Spring Back</en>: الارتداد.'] },
        { t: 'check', q: 'bd18' },
        { t: 'quote', text: 'BEND ALLOWANCES — length of neutral axis in bend area. Bend allowances are calculated using a K-factor', ref: 'L3 · S9', ar: 'الـ Bend allowance = طول المحور المتعادل في منطقة الثنية. وبيتحسب بالـ K-factor.' },
        { t: 'p', text: 'يعني الـ <en>BA</en> هو طول القوس اللي في الثنية، مقاس على المحور المتعادل. ليه المحور المتعادل؟ لأنه الخط الوحيد اللي طوله ما بيتغيرش.' },
        { t: 'check', q: 'bd19' },
        { t: 'h', text: 'معادلتين لنفس القطعة', en: 'Lt = A + B + BA · Lt = A + B − BD' },
        { t: 'quote', text: 'Lt = A + B + BA — where: Lt is the total flat length · A and B are shown in the illustration · BA is the bend allowance value  ·  Lt = A + B − BD — BD is the bend deduction value', ref: 'L3 · S10', ar: 'Lt هو الطول المفرود كله. مع الـ BA بنجمع، ومع الـ BD بنطرح.' },
        { t: 'fig', id: 'bd-flat', caption: 'بص A وB بيتقاسوا لحد فين في كل رسمة.' },
        { t: 'list', style: 'dot', items: ['في رسمة الـ <en>BA</en>: A وB بيقفوا **عند أول الثنية**. الثنية نفسها مش محسوبة، **فبنزوّدها** (+BA).', 'في رسمة الـ <en>BD</en>: A وB بيكمّلوا **لحد الركن الخارجي**، المكان اللي الخطوط اللي بره بتتقابل فيه. فإنت حسبت حتة زيادة، **فبنطرحها** (−BD).'] },
        { t: 'demo', id: 'bd-unfold', title: 'افرد القطعة، وبدّل طريقة القياس', caption: 'نفس القطعة: مرة A وB لحد الثنية، ومرة لحد الركن. الأرقام اتغيرت، والطول المفرود فضل 76 mm.', mount: mountUnfold },
        { t: 'check', q: 'bd20' },
        { t: 'trap', text: 'غلطتين مشهورين: تجمع الـ <en>BD</en>، أو تطرح الـ <en>BA</en>.', wrong: 'Lt = A + B − BA', right: 'Lt = A + B + BA · Lt = A + B − BD' },
        { t: 'check', q: 'bd23' },
        { t: 'tip', text: '<en>Allowance</en> = سماح، بنزوّده (+). <en>Deduction</en> = خصم، بنطرحه (−).' }
      ]
    },
    {
      id: 'bd-kfactor', title: 'الـ K-factor: المحور فين بالظبط؟', en: 'The K-factor', ref: 'L3 · S11', scene: 'kFactor',
      blocks: [
        { t: 'say', who: 'caliper', text: 'المحور المتعادل مش لازم يبقى في نص التخانة. والـ <en>K-factor</en> هو اللي بيقولك هو فين.' },
        { t: 'quote', text: 'K-factor is a ratio that represents the location of the neutral sheet with respect to the thickness of the sheet metal part.', ref: 'L3 · S11', ar: 'الـ K-factor نسبة. بتقولك المحور المتعادل فين، بالنسبة لتخانة الصاج.' },
        { t: 'fig', id: 'bd-kf', caption: '<en>K Factor = t / T</en>. الـ t من السطح اللي جوه لحد المحور. والـ T التخانة كلها.' },
        { t: 'p', text: 'الـ <en>T</en> هي تخانة الصاج كلها. الـ <en>t</en> المسافة من السطح اللي جوه الثنية لحد المحور المتعادل. اقسم الصغيرة على الكبيرة: <en>K = t / T</en>.' },
        { t: 'demo', id: 'bd-k', title: 'حرّك المحور جوه التخانة', caption: 'لاحظ: كل ما المحور يبعد ناحية بره، القوس اللي عليه بيطول، فالـ BA بيكبر.', mount: mountK },
        { t: 'check', q: 'bd24' },
        { t: 'example', title: 'مثال بالأرقام', text: 'صاج تخانته <en>T = 2 mm</en>. المحور على بعد <en>t = 0.8 mm</en> من جوه. يبقى <en>K = 0.8 ÷ 2 = 0.4</en>. يعني المحور واقف عند 40% من التخانة، من ناحية جوه.' },
        { t: 'check', q: 'bd26' },
        { t: 'why', text: 'ليه نهتم؟ لأن الـ <en>bend allowance</en> هو طول المحور المتعادل في الثنية. لو المحور اتحرك لبره، القوس يطول. لو اتحرك لجوه، يقصر. عشان كده السلايد قال: <en>Bend allowances are calculated using a K-factor</en>.' },
        { t: 'check', q: 'bd25' },
        { t: 'trap', text: 'خد بالك من الترتيب: الصغيرة فوق.', wrong: 'K = T / t', right: 'K = t / T (t: inside surface → neutral axis · T: thickness)' },
        { t: 'tip', text: '<en>K = t / T</en>: الصغيرة على الكبيرة. ولو عايز t: اضرب، <en>t = K × T</en>.' }
      ]
    },
    {
      id: 'bd-relief', title: 'فتحة التخفيف', en: 'Bend relief (auto relief)', ref: 'L3 · S12', scene: 'relief',
      blocks: [
        { t: 'say', who: 'usta', text: 'لما تثني حتة من حرف الصاج، والحتة اللي جنبها مش هتتثني، الركن بيتشد ويتقطّع على مزاجه. الحل: قطع صغير محسوب قبل الثني.' },
        { t: 'quote', text: 'The size and shape of the relief cut is much important for sheet metal bending. However, Sheet metal process relief is most important for the accurate bending.', ref: 'L3 · S12', ar: 'مقاس وشكل فتحة التخفيف مهمين جدًا في الثني. والـ relief أهم حاجة عشان الثنية تطلع مظبوطة.' },
        { t: 'art', html: ART['bd-relief'](), caption: '<en>Fig.5 auto relief types</en>: الشفة البنفسجي اتثنت لفوق، والفتحة (في الدايرة) عند آخرها.' },
        { t: 'grid', cols: 3, items: [
          { title: 'قطع بس', en: 'A) Tear-rip', text: 'خط قطع مستقيم. الشفة بتنفصل عن الباقي من غير ما يتشال معدن.' },
          { title: 'شق مدوّر', en: 'B) Obround', text: 'شق صغير طرفه مدوّر، عند آخر خط الثني.' },
          { title: 'شق مستطيل', en: 'C) Rectangle', text: 'شق صغير مستطيل، عند آخر خط الثني.' }
        ] },
        { t: 'check', q: 'bd28' },
        { t: 'quote', text: 'For rectangle and ob-round reliefs, The size can be determine by ratio to the material thickness, or values can be specified for width and depth.', ref: 'L3 · S12', ar: 'في المستطيل والـ obround: المقاس يا نسبة من تخانة الخامة، يا تكتب العرض والعمق بالأرقام.' },
        { t: 'p', text: 'يعني مقاس الفتحة بيتحدد بطريقتين: نسبة من التخانة، أو أرقام صريحة للعرض والعمق. (السلايد كاتب <en>determine</en>، والمقصود <en>determined</en>.)' },
        { t: 'check', q: 'bd30' },
        { t: 'why', text: 'من غير <en>relief</en>، المعدن عند طرف الثنية مش لاقي مكان يروح فيه. بيتقطع، أو بيتنفخ، أو الثنية تطلع مايلة. الفتحة بتدّيله مكان، فالثنية تطلع <en>accurate</en>.' },
        { t: 'trap', text: 'الأنواع **٣ بس**. وقاعدة «نسبة من التخانة» السلايد قالها للمستطيل والـ <en>obround</en>.', wrong: 'Triangle relief · Circle relief', right: 'A) Tear-rip · B) Obround · C) Rectangle' },
        { t: 'check', q: 'bd31' },
        { t: 'tip', text: 'تلاتة: <en>Tear-rip</en> (قطع)، <en>Obround</en> (شق مدوّر)، <en>Rectangle</en> (شق مستطيل).' }
      ]
    },
    {
      id: 'bd-radius', title: 'نص قطر الثني', en: 'Bend radius', ref: 'L3 · S13', scene: 'bendRadius',
      blocks: [
        { t: 'say', who: 'usta', text: 'اثني خرطوم الجنينة بزاوية حادة. هيتطبق ويقفل (<en>kink</en>). الصاج كمان ليه حد، ما ينفعش تنزل تحته.' },
        { t: 'quote', text: 'Inside curvature, is the minimum radius one can bend a pipe, tube, sheet, cable or hose Without kinking it, damaging it, or shortening its life.', ref: 'L3 · S13', ar: 'الـ Bend radius هو الانحناء من جوه: أصغر نص قطر تقدر تثني بيه ماسورة أو صاج أو كابل أو خرطوم، من غير ما يتطبق، أو يبوظ، أو عمره يقصر.' },
        { t: 'fig', id: 'bd-radius', caption: 'رسمة السلايد: كل اسم على حتته.' },
        { t: 'list', style: 'dot', items: ['<en>Bend radius, R</en>: نص القطر من **جوه** الثنية.', '<en>Bend allowance L<sub>b</sub></en>: طول القوس على المحور المتعادل.', '<en>Neutral axis</en>: الخط المتقطّع، طوله ثابت.', '<en>t</en>: تخانة الصاج.', '<en>Length of bend L</en>: عرض الصاج على طول خط الثني (باين في المنظر الجانبي).', '<en>Setback</en>: من أول الثنية لحد الركن الخارجي.', '<en>Bend angle</en> و<en>Bevel angle</en>: زاويتين على الرسمة. الـ <en>α</en> عند المركز هي قد إيه الصاج لف.'] },
        { t: 'check', q: 'bd32' },
        { t: 'why', text: 'لو نص القطر صغير أوي، الوش اللي بره بيتشد زيادة عن اللزوم (فاكر <en>tension</en>؟). فيشرخ، أو الماسورة تتطبق. عشان كده في **حد أدنى**.' },
        { t: 'example', title: 'سلك الشاحن', text: 'سلك الشاحن لو بتثنيه حاد عند الفيشة كل يوم، بيتقطع بعد كام شهر. لو سبته يلف براحة، يعيش سنين. ده بالظبط <en>shortening its life</en>.' },
        { t: 'trap', text: 'الـ <en>bend radius</en> بيتقاس من **جوه** الثنية، وهو **أقل** نص قطر مسموح.', wrong: 'Bend radius = the outside curvature', right: 'Inside curvature · the minimum radius without kinking, damaging, or shortening its life' },
        { t: 'check', q: 'bd33' },
        { t: 'tip', text: 'كلمات السر: <en>minimum · inside curvature · without kinking, damaging, or shortening its life</en>.' }
      ]
    },
    {
      id: 'bd-vbend', title: 'الثني على V', en: 'V-bending and air bending', ref: 'L3 · S14 · S17–S18', scene: 'vBend',
      blocks: [
        { t: 'say', who: 'usta', text: 'أبسط عدة في الدنيا: داي فيه مجرى على شكل V، وبنش بينزل في النص. الصاج يتزق جوه، ويطلع مثني.' },
        { t: 'quote', text: 'V-bending - performed with a V-shaped die · For low production · Performed on a press brake · V-dies are simple and inexpensive', ref: 'L3 · S14', ar: 'الثني على V: بداي شكله V، لإنتاج قليل، على ماكينة press brake، والداي بسيط ورخيص.' },
        { t: 'fig', id: 'bd-vbend', caption: '(1) البنش فوق الصاج. (2) البنش نزل، والصاج اتثني على شكل V.' },
        { t: 'p', text: 'الـ <en>press brake</en> ماكينة عريضة: فوق بنش طويل، وتحت داي طويل. بتثني عليها ألواح صاج كاملة. في السلايد ١٧ واحد بيثني لوح عليها، وفي ١٨ جدول فيه أشكال بنشات ودايات كتير.' },
        { t: 'check', q: 'bd34' },
        { t: 'h', text: 'الثني في الهوا', en: 'Air bending vs bottoming' },
        { t: 'quote', text: 'Air bending: If the punch does not force the sheet to the bottom of the die cavity, leaving space or air underneath, it is called "air bending".', ref: 'L3 · S14', ar: 'لو البنش ما زقش الصاج لحد قاع الداي، وفضل تحته هوا، ده اسمه air bending.' },
        { t: 'fig', id: 'bd-air', caption: 'نفس الـ <en>V-die</en>. الفرق: البنش وقف فين.' },
        { t: 'compare', left: { title: 'في الهوا', en: 'Air Bending', text: 'البنش بيقف قبل القاع. تحت الصاج هوا.' }, right: { title: 'لحد القاع', en: 'Bottoming', text: 'البنش بيزق الصاج لحد ما يلزق في قاع الداي (زي ما الرسمة بتوري).' } },
        { t: 'check', q: 'bd36' },
        { t: 'why', text: 'ليه الـ <en>V-die</en> رخيص؟ لأنه مجرد مجرى V. ونفس الداي بيعمل قطع كتير مختلفة. فمش محتاج تصرف على عدة خاصة لكل قطعة، وده يناسب الكميات القليلة.' },
        { t: 'trap', text: 'السؤال ممكن يقولك <en>high production</en> ويحط <en>V-bending</en> في الاختيارات.', wrong: 'V-bending: high production, complicated dies', right: 'V-bending: low production · press brake · simple and inexpensive dies' },
        { t: 'tip', text: 'V = عدة بسيطة ورخيصة + كمية قليلة + <en>press brake</en>. ولو البنش وقف قبل القاع: <en>air bending</en>.' }
      ]
    },
    {
      id: 'bd-edge', title: 'ثني الحافة', en: 'Edge bending', ref: 'L3 · S15', scene: 'edgeBend',
      blocks: [
        { t: 'say', who: 'press', text: 'لو هتعمل آلاف القطع في اليوم، الـ V مش هتلحق. هنا بييجي دور ثني الحافة.' },
        { t: 'quote', text: 'Edge Bending · For high production · Pressure pad required · Dies are more complicated and costly', ref: 'L3 · S15', ar: 'ثني الحافة: لإنتاج كبير، لازم pressure pad، والدايات أعقد وأغلى.' },
        { t: 'fig', id: 'bd-edge', caption: '(1) الـ <en>pressure pad</en> ماسك الصاج على الداي بقوة <en>Fh</en>. (2) البنش نزل بقوة <en>F</en> وثنى الحرف اللي طالع بره.' },
        { t: 'p', text: 'الصاج قاعد على الداي، وحرفه طالع لبره. الـ <en>pressure pad</en> بيدوس على الصاج ويثبّته. البنش ينزل جنب الداي، ويثني الحرف لتحت.' },
        { t: 'check', q: 'bd39' },
        { t: 'compare', left: { title: 'ثني V', en: 'V-bending', text: 'إنتاج قليل. على <en>press brake</en>. داي بسيط ورخيص.' }, right: { title: 'ثني الحافة', en: 'Edge bending', text: 'إنتاج كبير. لازم <en>pressure pad</en>. داي أعقد وأغلى.' }, note: 'الفرق في ٣: الكمية، والـ <en>pressure pad</en>، وتمن الداي.' },
        { t: 'why', text: 'ليه الـ <en>pressure pad</en>؟ البنش وهو بيزق الحرف، الصاج ممكن يتزحلق أو يترفع. الـ <en>pad</en> بيثبّته مكانه، فكل القطع تطلع زي بعض.' },
        { t: 'trap', text: 'بيلخبطوا الجملتين: «<en>simple and inexpensive</en>» بتاعة الـ V. و«<en>more complicated and costly</en>» بتاعة الـ <en>Edge</en>.', wrong: 'Edge bending dies are simple and inexpensive', right: 'Edge bending: dies are more complicated and costly' },
        { t: 'check', q: 'bd37' },
        { t: 'tip', text: '<en>Edge</en> = إنتاج كتير + <en>pressure pad</en> + داي غالي. <en>V</en> = العكس.' }
      ]
    },
    {
      id: 'bd-springback', title: 'الصاج بيرجع شوية', en: 'Springback', ref: 'L3 · S16', scene: 'springback',
      blocks: [
        { t: 'say', who: 'spring', text: 'اثني مسطرة حديد ٩٠ درجة وسيبها. هتلاقيها رجعت شوية. ده الـ <en>springback</en>، وده عدو الأسطى الأول.' },
        { t: 'quote', text: 'Spring back — Increase in included angle of bent part relative to included angle of forming tool after tool is removed', ref: 'L3 · S16', ar: 'الارتداد: الزاوية المحصورة في القطعة بتكبر عن زاوية العدة، بعد ما العدة تتشال.' },
        { t: 'demo', id: 'bd-spring', title: 'انزل بالبنش، وبعدين شيله', caption: 'جرّب مرة تنزل شوية صغيرين، ومرة للآخر. شوف إمتى بيرجع كله، وإمتى بيرجع حتة بس.', mount: mountSpring },
        { t: 'check', q: 'bd40' },
        { t: 'fig', id: 'bd-spring', caption: '(1) وقت الثني: القطعة واخدة نص قطر العدة <en>Rb</en> وزاويتها <en>αb′</en>. (2) بعد ما البنش يطلع: نص القطر <en>R</en> أكبر، والزاوية <en>α′</en> أكبر.' },
        { t: 'quote', text: 'Figure Springback in bending is seen as a decrease in bend angle and an increase in bend radius: (1) during bending, the work is forced to take radius Rb and included angle αb\' of the bending tool, (2) after punch is removed, the work springs back to radius R and angle α\'.', ref: 'L3 · S16', ar: 'الارتداد بيبان في حاجتين: زاوية الثني بتقل، ونص قطر الثني بيكبر.' },
        { t: 'h', text: 'بتكبر ولا بتصغر؟ الاتنين صح', en: 'Included angle up = bend angle down' },
        { t: 'art', html: ART['bd-angles'](), caption: 'الزاوية المحصورة + زاوية الثني = 180°. واحدة تكبر، التانية تصغر.' },
        { t: 'p', text: 'هنا الناس بتتلخبط. التعريف قال الزاوية **بتكبر**. والرسمة قالت الزاوية **بتقل**. الاتنين صح، لأنهم زاويتين مختلفتين:' },
        { t: 'list', style: 'dot', items: ['**الزاوية المحصورة** <en>included angle</en>: الفتحة اللي بين رجلين القطعة. دي **بتكبر**.', '**زاوية الثني** <en>bend angle</en>: الصاج لف قد إيه من وضعه المفرود. دي **بتقل**.', 'مع بعض = 180°. فلو المحصورة زادت 4 درجات، زاوية الثني قلت 4 درجات. نفس المعلومة، بطريقتين.'] },
        { t: 'check', q: 'bd42' },
        { t: 'why', text: 'ليه بيرجع؟ فاكر محاضرة ٢؟ تحت الـ <en>yield strength</en> المعدن <en>elastic</en>: بيرجع لشكله. لما تعدّي الـ <en>yield</en>، جزء من الثنية بيبقى دايم (<en>plastic</en>)، بس الجزء الـ <en>elastic</en> لسه موجود. أول ما البنش يطلع، الجزء ده بيفتح القطعة شوية.' },
        { t: 'example', title: 'الأسطى بيضحك على الصاج', text: 'عشان القطعة تطلع ٩٠ بالظبط، الأسطى بيثنيها أكتر شوية (<en>overbend</en>). تفتح، فتقف على ٩٠. السلايد ما قالش الحل ده، بس هو اللي هتلعبه في تحدي «اغلب الارتداد».' },
        { t: 'trap', text: 'الفخ: «<en>Springback is a decrease in included angle</en>». **غلط**. المحصورة بتكبر. اللي بيقل هو زاوية الثني.', wrong: 'Springback = decrease in included angle · decrease in radius', right: 'Increase in included angle (= decrease in bend angle) · increase in bend radius' },
        { t: 'check', q: 'bd43' },
        { t: 'tip', text: 'البنش طلع؟ الزاوية المحصورة ↑، زاوية الثني ↓، نص القطر ↑.' }
      ]
    },
    {
      id: 'bd-ops', title: 'ست عمليات ثني', en: 'Bending operations', ref: 'L3 · S19', scene: 'flanging',
      blocks: [
        { t: 'say', who: 'bend', text: 'السلايد ده رسومات بس، من غير ولا تعريف. فاحفظ الاسم مع الشكل، زي ما بتحفظ وش صاحبك.' },
        { t: 'quote', text: 'Bending Operations: Straight flanging · Stretch flanging · Shrink flanging · Hemming · Seaming · Curling', ref: 'L3 · S19', ar: 'ست عمليات: ٣ أنواع شفة (flanging)، وتطبيق الحرف، والتشبيك، واللف.' },
        { t: 'art', html: ART['bd-ops-flange'](), caption: 'تلات أنواع <en>flanging</en>: الحرف بيتثني لتحت على خط مستقيم، أو على خط داخل لجوه، أو على خط طالع لبره.' },
        { t: 'list', style: 'dot', items: ['<en>Straight flanging</en>: الحرف اتثني على **خط مستقيم**.', '<en>Stretch flanging</en>: الحرف اتثني على **منحنى داخل لجوه** الصاج. والاسم بيقولك: حرف الشفة بيتمط.', '<en>Shrink flanging</en>: الحرف اتثني على **منحنى طالع لبره**. والاسم بيقولك: حرف الشفة بينكمش.'] },
        { t: 'check', q: 'bd47' },
        { t: 'art', html: ART['bd-ops-hem'](), caption: '<en>Hemming</en>: الحرف اتطبق على نفسه. <en>Seaming</en>: حرفين اتشبكوا في بعض. <en>Curling</en>: الحرف اتلف دايرة.' },
        { t: 'example', title: 'من البيت', text: 'حرف صينية الفرن ملفوف عشان ما يجرحش إيدك (<en>curling</en>). غطا علبة الصلصة متشبك في جسمها (<en>seaming</en>). وحرف باب العربية من جوه متطبق (<en>hemming</en>). (أمثلة من عندنا، مش من السلايد.)' },
        { t: 'check', q: 'bd45' },
        { t: 'trap', text: 'التلاتة اللي بيتلخبطوا: <en>hemming</en> = **يتطبق مسطّح**. <en>curling</en> = **يتلف دايرة**. <en>seaming</en> = **لوحين** بيتشبكوا.', wrong: 'Hemming = the edge rolled into a circle', right: 'Hemming: folded flat · Curling: rolled round · Seaming: two edges locked together' },
        { t: 'check', q: 'bd46' },
        { t: 'tip', text: 'شفة مستقيمة، شفة بتتمط، شفة بتنكمش. وبعدين: طبّق، شبّك، لِف.' }
      ]
    },
    {
      id: 'bd-roll', title: 'الدرفلة: بالإيد ولا على خط؟', en: 'Roll forming sheet · continuous roll forming', ref: 'L3 · S20–S24', scene: 'rollForm',
      blocks: [
        { t: 'say', who: 'spin', text: 'عايز أسطوانة؟ عدّي الصاج بين ٣ رولات. عايز مجرى طوله ١٠٠ متر؟ عدّيه على رولات ورا بعض.' },
        { t: 'quote', text: 'Roll forming sheet on one axis is an inexpensive operation. · Hand-operated machines with an adjustable roll provide a range of rolling radii (r). · These machines are typically used in small model shops.', ref: 'L3 · S20', ar: 'الدرفلة على محور واحد رخيصة. مكن بيشتغل بالإيد، فيه رول بيتظبط، فتعمل أنصاف أقطار كتير (r). وبيتستخدم في ورش النماذج الصغيرة.' },
        { t: 'art', html: ART['bd-roll3'](), caption: '٣ رولات. الرول اللي فوق بيطلع وينزل، وده اللي بيحدد نص قطر اللفة <en>r</en>.' },
        { t: 'p', text: 'في السلايدات ٢١ و٢٢ مكن اسمه <en>slip roll</en>: بتلف ذراع بإيدك، والصاج يدخل مفرود ويطلع أسطوانة.' },
        { t: 'check', q: 'bd50' },
        { t: 'h', text: 'الدرفلة المستمرة', en: 'Continuous roll forming' },
        { t: 'quote', text: 'Roll forming is a continuous bending operation in which a long strip of sheet metal is passed through sets of rolls mounted on consecutive stands, each set performing only an incremental part of the bend, until the desired cross-section profile is obtained. · Roll forming is ideal for producing constant-profile parts with long lengths and in large quantities.', ref: 'L3 · S23', ar: 'شريط صاج طويل بيعدّي على محطات رولات ورا بعض. كل محطة بتعمل حتة صغيرة من الثنية، لحد ما المقطع يكمل. ومثالية لقطع مقطعها ثابت، طويلة، وبكميات كبيرة.' },
        { t: 'art', html: ART['bd-controll'](), caption: 'محطة ورا محطة: المقطع بيتغير شوية في كل واحدة (<en>Roll station #1 … #5</en>).' },
        { t: 'compare', left: { title: 'درفلة الصاج', en: 'Roll forming sheet', text: 'محور واحد. بالإيد. رول بيتظبط. رخيصة. لورش النماذج الصغيرة.' }, right: { title: 'الدرفلة المستمرة', en: 'Continuous roll forming', text: 'شريط طويل. محطات ورا بعض. خطوة خطوة. مقطع ثابت، طول كبير، كميات كتير.' } },
        { t: 'check', q: 'bd51' },
        { t: 'example', title: 'حواليك', text: 'مجرى مية المطر على السطح، والقطاعات اللي بتشيل الجبس بورد، وقوايم الرفوف المعدن. مقطعها ثابت وطويلة، وده شغل الدرفلة المستمرة. (السلايد ٢٤ فيه ١٢ بروفيل زيهم.)' },
        { t: 'why', text: 'ليه كل محطة بتعمل حتة صغيرة بس؟ لأنك لو حاولت تثني المقطع كله مرة واحدة، الشريط هيتلوي أو يتقطع. الثني على خطوات بيحافظ على الشكل.' },
        { t: 'trap', text: 'الاتنين اسمهم <en>roll forming</en>. بس اللي بالإيد = **رخيص + ورش صغيرة**. واللي على خط = **كميات كبيرة + طول كبير**.', wrong: 'Hand-operated roll forming = large quantities', right: 'Continuous roll forming: constant-profile parts, long lengths, large quantities' },
        { t: 'tip', text: '٣ رولات وإيد = نموذج في ورشة صغيرة. محطات ورا بعض = بروفيل طويل بالكوم.' }
      ]
    },
    {
      id: 'bd-wire', title: 'السلك والماسورة', en: 'Wire and tube forming', ref: 'L3 · S25–S28', scene: 'tube',
      blocks: [
        { t: 'say', who: 'usta', text: 'السلك سهل تثنيه. الماسورة لأ: لو ثنيتها وهي فاضية، بتتطبق من جوه. الحل؟ حاجة تسندها من جوه.' },
        { t: 'quote', text: 'forming wire requires special tooling but is an economical production process. · Formed and spot-welded wire is strong and has applications in many industries.', ref: 'L3 · S25', ar: 'تشكيل السلك محتاج عدة خاصة، بس اقتصادي في الإنتاج. والسلك المتشكّل والملحوم بالنقطة قوي، وليه استخدامات في صناعات كتير.' },
        { t: 'art', html: ART['bd-wire'](), caption: 'سلك متشكّل، ونقطة لحام (<en>spot weld</en>) عند كل تقاطع.' },
        { t: 'example', title: 'سلك حواليك', text: 'سبت المطبخ، ورف الفرن، وشبكة المروحة، وسلة السوبر ماركت. كلهم سلك متشكّل وملحوم بالنقطة. وفي السلايد ٢٦: زخارف الحديد المشغول بتاعة البوابات.' },
        { t: 'check', q: 'bd53' },
        { t: 'quote', text: 'forming tubes and other hollow sections require an internal support called a mandrel to prevent buckling of tubes during the bending process.', ref: 'L3 · S25', ar: 'المواسير والقطاعات المفرّغة محتاجة سند من جوه اسمه mandrel، عشان ما تعملش buckling وقت الثني.' },
        { t: 'art', html: ART['bd-mandrel'](), caption: 'من غير <en>mandrel</en>: الجدار اللي جوه يتكرمش، والمقطع يتفلطح. بالـ <en>mandrel</en>: المقطع يفضل مدوّر.' },
        { t: 'why', text: 'فاكر إن جوه الثنية بيتكبس؟ في الماسورة، الجدار اللي جوه رفيع، ومفيش وراه حاجة. فلما يتكبس، يتكرمش ويتطبق. الـ <en>mandrel</en> بيملا الفراغ ده.' },
        { t: 'check', q: 'bd55' },
        { t: 'p', text: 'في السلايد ٢٨ ماكينتين: واحدة بـ ٣ رولات بتلف المواسير والقطاعات (نفس فكرة الدرفلة)، وواحدة بتثني الماسورة حوالين قالب مدوّر.' },
        { t: 'trap', text: 'الـ <en>mandrel</en> سند **من جوه** (<en>internal support</en>)، وشغلته يمنع الـ <en>buckling</en>. مش مسكة من بره، ولا عدة قطع.', wrong: 'A mandrel is an outside clamp', right: 'Mandrel: an internal support that prevents buckling of tubes during bending' },
        { t: 'tip', text: 'السلك: عدة خاصة بس اقتصادي، والملحوم بالنقطة قوي. الماسورة: <en>mandrel</en> من جوه، وإلا <en>buckling</en>.' }
      ]
    }
  ]
};
