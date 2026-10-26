// Lesson — cut (Arabic edition): Lecture 5, metal cutting (L5 · S2–S22). Block reference: content/lessons/_sample.js ·
// house rules: docs/BRIEF.md. The drawings live in _cut-art.js and the demos in _cut-demos.js (both editions share them);
// the thread through the whole zone: is anything removed? what is scrap? what goes to the customer?
import { art, ICON } from './_cut-art.js';
import { mountGap, mountKeep, mountStrip } from './_cut-demos.js';

/* the demos' words (Arabic) */
export const GAP = {
  label: 'الخلوص c', tight: 'ضيّق', loose: 'واسع',
  small: ['صغير قوي', 'خطوط الكسر بتعدّي جنب بعض. السطح بيتقص مرتين (<en>double buffing</en>)، والمكبس محتاج قوة أكبر.', 'If clearance is too small, break lines pass each other, causing double buffing and larger force'],
  ok: ['مظبوط', 'الشرخين اتقابلوا في خط واحد. القطعة بتنفصل نضيفة.', 'The quality of the cut depends on the “c” clearance.'],
  large: ['كبير قوي', 'المعدن بيتقرص ويتثني بين الحدّين، بدل ما يتقص نضيف.', 'If too large, metal is pinched and bent between cutting edges.']
};
export const KEEP = {
  figLabel: 'لوح صاج، وشكل هيتقطع منه',
  punch: 'اخرم', keepSheet: 'خد اللوح اللي فيه الفتحة', keepBlank: 'خد الحتة اللي وقعت', next: 'شكل تاني',
  start: ['جاهز', 'اضغط «اخرم». البنش هيقطع على الخط المتقطّع.', ''],
  which: ['اختار', 'بقى عندك حتتين. أنهي واحدة هتروح للزبون؟', ''],
  sheet: ['ده Punching (Piercing)', 'خدت اللوح. الفتحة هي المنتج، والحتة اللي وقعت خردة.', 'In punching, the hole is the desired product, the material punched out to form the hole being waste.'],
  blank: ['ده Blanking', 'خدت الحتة اللي وقعت. اسمها <en>blank</en>، وهي المنتج. واللوح اللي فيه الفتحة خردة.', 'The article punched out is called the blank and is the required product of the operation.']
};
export const STRIP = {
  modeLabel: 'العملية', stroke: 'اضرب', strip: 'STRIP', parts: 'PARTS', scrap: 'SCRAP', partsN: 'قطع:', scrapN: 'خردة:',
  cutoff: ['Cutoff', 'كت أوف: خط واحد، ومفيش خردة', '4 قطع ومفيش خردة. خط واحد بيفصل كل قطعة.'],
  parting: ['Parting', 'بارتينج: حدّين، والخردة في النص', '3 قطع بس، و3 حتت خردة. كل ضربة بتقطع على مسارين.']
};

export default {
  zone: 'cut',
  hero: { say: 'البنش بينزل، والداي مستنيه، والصاج في النص. وفي الآخر سؤال واحد بس: الحتة اللي هتروح للزبون فين؟' },
  chapters: [
    /* ---------------------------------------------------------------- S2 */
    {
      id: 'ct-tree', title: 'أربع طرق تقطع بيها المعدن', en: 'Metal cutting: four families', ref: 'L5 · S2', scene: 'cutTree',
      blocks: [
        { t: 'say', who: 'usta', text: 'قبل ما نمسك المقص، تعالى نبص على الخريطة. المحاضرة قسمت قطع المعادن لأربع عائلات.' },
        { t: 'art', html: art('tree'), caption: 'شجرة القطع زي السلايد 2. العيلة الأولى (المكبس) هي اللي هنعيش فيها باقي المنطقة.' },
        { t: 'list', style: 'dot', items: [
          '**<en>Punching and Shearing</en>**: بنش وداي بيقطعوا الصاج على المكبس.',
          '**<en>Chip Forming</en>**: أداة بتقشّر المعدن، وبيطلع منها رايش.',
          '**<en>Nonchip Forming</en>**: قطع من غير رايش: كيميا، كهربا، ميكانيكا، أو حرارة.',
          '**<en>Thermal/Flame Cutting</en>**: قطع بالحرارة: غاز، ليزر، أو بلازما.'
        ] },
        { t: 'quote', ref: 'L5 · S2', text: 'In the sheet metal industry the words shear, blank, nibble, or punch are used to describe hole making in sheet metal.', ar: 'في صناعة الصاج، الكلمات shear وblank وnibble وpunch بتوصف عمل الفتحات في الصاج.' },
        { t: 'p', text: 'يعني لو الأسطى قالك «اعمل <en>blank</en>» أو «<en>nibble</en> الحتة دي»، هو بيتكلم عن قطع في الصاج. الأربع كلمات دول هتقابلهم تاني في الدرس ده، كل واحدة في فصلها.' },
        { t: 'check', q: 'ct02' },
        { t: 'quote', ref: 'L5 · S2', text: 'In addition to the standard operations, laser cutting of sheet metal is now standard in the industry.', ar: 'وغير العمليات المعتادة، قطع الصاج بالليزر بقى حاجة أساسية في الصناعة.' },
        { t: 'check', q: 'ct03' },
        { t: 'trap', text: 'سؤال «أنهي واحد مش فرع من فروع القطع؟» بيحطلك عملية تشكيل زي الـ <en>Bending</en>. الثني تشكيل، مش قطع.', wrong: 'Bending is one of the four cutting branches', right: 'Punching and Shearing · Chip Forming · Nonchip Forming · Thermal/Flame Cutting' },
        { t: 'check', q: 'ct01' },
        { t: 'tip', text: 'اربط كل عيلة بأداتها: مكبس (بنش وداي) · سكينة بتعمل رايش · من غير رايش · حرارة.' }
      ]
    },
    /* ---------------------------------------------------------------- S3 */
    {
      id: 'ct-chip', title: 'رايش، ولا من غير رايش، ولا حرارة؟', en: 'Machining, nonchip and thermal cutting', ref: 'L5 · S3', scene: 'machining',
      blocks: [
        { t: 'say', who: 'gear', text: 'لو بتقطع في بلوك معدن تقيل، الاسم بيتغير. هنا مش بنقول «قص». بنقول «تشغيل».' },
        { t: 'quote', ref: 'L5 · S3', text: 'When cutting into a block of metal (using a chip-forming cutter), the word machining is used to describe the processes, even though a specific cutter or cutting tool is used.', ar: 'لما تقطع في بلوك معدن بأداة بتعمل رايش، العملية اسمها machining، حتى لو فيه أداة قطع معينة.' },
        { t: 'p', text: 'الـ <en>chip</en> هو الرايش: البرادة اللي بتطير وانت بتقطع. السكينة بتقشّر المعدن طبقة ورا طبقة.' },
        { t: 'quote', ref: 'L5 · S3', text: 'The word machining is used because a special machine (that powers the cutting tool) is required to achieve a cut to a given precise tolerance.', ar: 'اسمها machining عشان محتاجة ماكينة مخصوص بتشغّل أداة القطع، علشان توصل لمقاس دقيق بالـ tolerance المطلوب.' },
        { t: 'why', text: 'إيدك لوحدها مش هتقطع بدقة جزء من الملّي. الماكينة هي اللي ماسكة الأداة ومشيّاها بالظبط. عشان كده الاسم جاي من الماكينة، مش من السكينة.' },
        { t: 'check', q: 'ct05' },
        { t: 'h', text: 'من غير رايش', en: 'Nonchip forming cutting' },
        { t: 'quote', ref: 'L5 · S3', text: 'In nonchip forming cutting, chemical, chemical/electrical, electrical, mechanical, and/or thermal processes are used to cut materials.', ar: 'في القطع من غير رايش، بنستخدم عمليات كيميائية، أو كيميائية/كهربائية، أو كهربائية، أو ميكانيكية، أو حرارية.' },
        { t: 'compare', left: { title: 'بيطلّع رايش', en: 'Chip forming · machining', art: ICON.chip, text: 'سكينة بتقشّر بلوك معدن، وماكينة بتمشّيها لمقاس دقيق.' }, right: { title: 'من غير رايش', en: 'Nonchip forming', art: ICON.nonchip, text: '5 أنواع عمليات: كيميائية، كيميائية/كهربائية، كهربائية، ميكانيكية، حرارية.' }, note: 'السؤال: فيه رايش ولا لأ؟' },
        { t: 'check', q: 'ct06' },
        { t: 'h', text: 'القطع بالحرارة', en: 'Thermal cutting' },
        { t: 'quote', ref: 'L5 · S3', text: 'Thermal cutting processes use gas, laser, and/or plasma.', ar: 'القطع الحراري بيستخدم الغاز، أو الليزر، أو البلازما.' },
        { t: 'art', html: art('thermal'), caption: 'تلات رؤوس قطع: لهب غاز، وشعاع ليزر، وقوس بلازما. الحرارة بتفتح خط القطع، والشرار بيطير من تحت.' },
        { t: 'check', q: 'ct07' },
        { t: 'tip', text: 'رايش = <en>machining</en> (والماكينة هي سبب الاسم). من غير رايش = 5 عمليات. حرارة = <en>gas · laser · plasma</en>.' }
      ]
    },
    /* ---------------------------------------------------------------- S4 */
    {
      id: 'ct-sheet', title: 'الصاج على المكبس', en: 'Sheet punching and shearing', ref: 'L5 · S4', scene: 'punchDie',
      blocks: [
        { t: 'say', who: 'usta', text: 'نرجع للصاج. ده شغلنا: لوح رفيع، ومكبس، وبنش وداي.' },
        { t: 'quote', ref: 'L5 · S4', text: 'Sheet metal punching or shearing is limited to sheet 0.635 mm." thick (T) or less.', ar: 'التخريم أو القص للصاج محدود بصاج تخانته (T) قد كده أو أقل. الرقم مكتوب في السلايد 0.635 mm.' },
        { t: 'why', text: 'الرقم ده غريب شوية. علامة البوصة (") اللي جنبه بتقول إنه جاي من البوصة: ربع بوصة = 6.35 mm، وده نفس حد الصاج في محاضرة 3. فغالبًا السلايد قصده 6.35 mm. بس لو جه سؤال من السلايد ده، هيجي برقم السلايد: 0.635 mm.' },
        { t: 'check', q: 'ct08' },
        { t: 'quote', ref: 'L5 · S4', text: 'Sheet metal is important in industrial design, especially in office products and equipment design, including computers, copiers, and a large array of industrial, medical, and research equipment.', ar: 'الصاج مهم في التصميم الصناعي، خصوصًا في المنتجات المكتبية وتصميم الأجهزة: الكمبيوتر، وماكينات التصوير، وأجهزة صناعية وطبية وبحثية كتير.' },
        { t: 'example', title: 'انت كمصمم هتقابله فين؟', art: art('pc'), text: 'كيسة الكمبيوتر. ماكينة التصوير اللي في المكتبة. ترابيزة الأجهزة في العيادة. كلهم ألواح صاج اتقصت واتخرمت قبل ما تتثني. وبص على الكيسة: فيها فتحة متخرمة، وشبكة فتحات، وشيش تهوية. هتعرف اسم كل واحدة قبل آخر الدرس.' },
        { t: 'check', q: 'ct09' },
        { t: 'quote', ref: 'L5 · S4', text: 'Three principal operations in press working that cut sheet metal: • Shearing to separate large sheets • Blanking to cut part boundaries out of sheet metal • Punching/ Piercing to make holes in sheet metal', ar: 'تلات عمليات أساسية في شغل المكبس بتقطع الصاج: القص عشان تفصل الألواح الكبيرة، والبلانكينج عشان تقطع حدود القطعة من الصاج، والتخريم عشان تعمل فتحات.' },
        { t: 'grid', cols: 3, items: [
          { title: 'القص', en: 'Shearing', art: ICON.shearing, text: 'يفصل الألواح الكبيرة.' },
          { title: 'البلانكينج', en: 'Blanking', art: ICON.blanking, text: 'يقطع حدود القطعة من اللوح.' },
          { title: 'التخريم', en: 'Punching / Piercing', art: ICON.punching, text: 'يعمل فتحات في اللوح.' }
        ] },
        { t: 'check', q: 'ct10' },
        { t: 'trap', text: '<en>Punching</en> و<en>Piercing</en> اسمين لنفس العملية. السلايد كاتبهم «Punching/ Piercing». والامتحان ممكن يكتب واحد فيهم بس.', wrong: 'Piercing is a different operation from punching', right: 'Punching/ Piercing — to make holes in sheet metal' },
        { t: 'check', q: 'ct11' },
        { t: 'tip', text: 'القص = يفصل لوح. البلانكينج = يطلّع شكل. التخريم = يعمل فتحة.' }
      ]
    },
    /* ---------------------------------------------------------------- S5–S6 */
    {
      id: 'ct-shearing', title: 'القص: مقص قد الترابيزة', en: 'Shearing', ref: 'L5 · S5–S6', scene: 'shearing',
      blocks: [
        { t: 'say', who: 'usta', text: 'أول عملية: مقص. بس مقص طول الترابيزة، وسكينته تقطع لوح صاج في ضربة.' },
        { t: 'quote', ref: 'L5 · S5', text: 'Shearing is a process for cutting sheet metal to size out of a larger stock.', ar: 'القص عملية بتقطع بيها الصاج للمقاس اللي عايزه، من لوح أكبر.' },
        { t: 'p', text: 'اللوح بييجي من المصنع كبير. القص بيقطعه حتت على المقاس اللي انت محتاجه.' },
        { t: 'check', q: 'ct12' },
        { t: 'quote', ref: 'L5 · S5', text: 'The shearing process is a scissor-like action between a punch and a die', ar: 'القص حركة شبه المقص، بين بنش وداي.' },
        { t: 'art', html: art('scissor'), caption: 'حدّ فوق بينزل، وحدّ تحت ثابت. المعدن اللي بينهم بيتقص. زي المقص بالظبط، بس الحدّين مش لازقين: بينهم مسافة صغيرة اسمها c.' },
        { t: 'why', text: 'في المقص، الحدّين بيعدّوا جنب بعض. هنا كمان: الحد اللي فوق بيعدّي جنب الحد اللي تحت، والمعدن اللي في النص بيتقص. مفيش حد بيخبط في التاني.' },
        { t: 'check', q: 'ct13' },
        { t: 'art', html: art('shears'), caption: 'السلايد 6 فيه صورتين لماكينات قص: مقص بموتور ودواسة رجل، ومقص يدوي بدراع طويل. هنا رسمناهم رسم خطي.' },
        { t: 'tip', text: '<en>Shearing</en> = تقطيع للمقاس من لوح أكبر = حركة مقص بين بنش وداي.' }
      ]
    },
    /* ---------------------------------------------------------------- S5, S7 */
    {
      id: 'ct-clearance', title: 'الخلوص: المسافة اللي بتحكم', en: 'Clearance', ref: 'L5 · S5, S7', scene: 'clearance',
      blocks: [
        { t: 'say', who: 'usta', text: 'البنش والداي مش لازقين في بعض. فيه مسافة صغيرة بينهم. المسافة دي هي اللي بتقرر القطع هيطلع نضيف ولا لأ.' },
        { t: 'quote', ref: 'L5 · S5', text: 'The quality of the cut depends on the “c” clearance.', ar: 'جودة القطع بتعتمد على الخلوص c.' },
        { t: 'check', q: 'ct14' },
        { t: 'quote', ref: 'L5 · S7', text: 'Clearance between Punch and Die or Clearance between two cutting blades · CLEARANCE = THE MEASURED SPACE BETWEEN THE MATING MEMBERS OF A DIE SET (C)', ar: 'الخلوص بين البنش والداي، أو بين سكينتين قطع: هو المسافة المقاسة بين الجزئين اللي بيقابلوا بعض في طقم الداي.' },
        { t: 'fig', id: 'ct-clr', caption: 'رسمة السلايد 7: البنش P بين نصّين الداي D. الخلوص C متقسم نصين: C/2 على كل جنب.' },
        { t: 'p', text: 'بص على الرسمة. عرض البنش <en>d1</en>. فتحة الداي <en>d</en>. الفرق بينهم هو الخلوص كله <en>C</en>: نصه على الشمال، ونصه على اليمين. يعني <en>d = d1 + C</en>.' },
        { t: 'check', q: 'ct19' },
        { t: 'h', text: 'صغير زيادة، ولا كبير زيادة؟', en: 'Too small · too large' },
        { t: 'quote', ref: 'L5 · S5', text: 'If clearance is too small, break lines pass each other, causing double buffing and larger force · If too large, metal is pinched and bent between cutting edges.', ar: 'لو الخلوص صغير قوي، خطوط الكسر بتعدّي جنب بعض، فيحصل double buffing ومحتاج قوة أكبر. ولو كبير قوي، المعدن بيتقرص ويتثني بين حدود القطع.' },
        { t: 'demo', id: 'ct-gap', title: 'ظبّط الخلوص', caption: 'حرّك السلايدر. شرخ بيطلع من حد البنش، وشرخ من حد الداي. لما يتقابلوا في خط واحد، القطع بيطلع نضيف. جرّب التلات حالات.', mount: (el, api) => mountGap(el, api, GAP) },
        { t: 'p', text: 'اللي بيحصل: البنش بيضغط، فشرخ بيبدأ من حد البنش، وشرخ تاني من حد الداي. الاتنين ماشيين ناحية بعض. لو الخلوص مظبوط، بيتقابلوا والقطعة تنفصل نضيفة.' },
        { t: 'compare', left: { title: 'خلوص صغير قوي', en: 'too small', art: art('clrSmall'), text: 'خطوط الكسر بتعدّي جنب بعض. السطح بيتقص مرتين (<en>double buffing</en>). والمكبس محتاج قوة أكبر.' }, right: { title: 'خلوص كبير قوي', en: 'too large', art: art('clrLarge'), text: 'المعدن بيتقرص ويتثني بين الحدّين (<en>pinched and bent</en>)، بدل ما يتقص نضيف.' } },
        { t: 'check', q: 'ct16' },
        { t: 'trap', text: 'الامتحان بيحب يبدّل النتيجتين. افتكر: الصغير = <en>double buffing</en> + قوة أكبر. الكبير = <en>pinched and bent</en>.', wrong: 'Too large → double buffing and larger force', right: 'Too small → double buffing and larger force · Too large → pinched and bent' },
        { t: 'check', q: 'ct18' },
        { t: 'tip', text: 'صغير = متزنّق (قوة أكبر، وقص مرتين). كبير = سايب (يتقرص ويتثني).' }
      ]
    },
    /* ---------------------------------------------------------------- S9–S10 */
    {
      id: 'ct-punchdie', title: 'البنش والداي', en: 'Punch and die', ref: 'L5 · S9–S10', scene: 'punchDie',
      blocks: [
        { t: 'say', who: 'punch', text: 'أنا البنش. بنزل، بزق، بقطع. وتحتي الداي مستنيني.' },
        { t: 'quote', ref: 'L5 · S9', text: 'In this operation, the workpiece is stressed beyond its ultimate strength. The stresses caused in the metal by the applied forces will be shearing stresses.', ar: 'في العملية دي، الشغلانة بتتحمّل إجهاد أكبر من مقاومتها القصوى (ultimate strength). والإجهاد اللي بيحصل في المعدن من القوى دي إجهاد قص.' },
        { t: 'why', text: 'فاكر منحنى الإجهاد والانفعال؟ الـ <en>ultimate strength</en> هي أعلى نقطة فيه. لو عدّيتها، المعدن بيتفصل. هنا احنا عايزينه يتفصل، فبنعدّيها بالقصد. والإجهاد إجهاد قص <en>shear</en>: طبقتين بيتزحلقوا على بعض، مش شد ولا ضغط.' },
        { t: 'check', q: 'ct21' },
        { t: 'check', q: 'ct22' },
        { t: 'quote', ref: 'L5 · S9', text: 'Punch A convex tool for making holes by shearing, or making surface or displacing metal with a hammer.', ar: 'البنش: أداة محدّبة (convex) بتعمل فتحات بالقص، أو بتشكّل سطح، أو بتزق المعدن بالدق.' },
        { t: 'quote', ref: 'L5 · S9', text: 'Die A concave die, which is the female part as opposed to punch which is the male part.', ar: 'الداي: داي مقعّر (concave)، وهو الجزء الأنثى (female)، عكس البنش اللي هو الجزء الذكر (male).' },
        { t: 'compare', left: { title: 'البنش', en: 'Punch · convex · male', art: art('punchIco'), text: 'بارز لبرّه. بينزل ويدخل.' }, right: { title: 'الداي', en: 'Die · concave · female', art: art('dieIco'), text: 'مجوّف لجوّه. بيستقبل البنش.' } },
        { t: 'check', q: 'ct24' },
        { t: 'fig', id: 'ct-press', caption: 'رسمة السلايد 10 كقطاع: قوة التخريم، والبنش، والصاج، والخلوص، والـ slug اللي وقع في الداي.' },
        { t: 'p', text: 'الحتة اللي بتقع جوّه فتحة الداي اسمها <en>slug</en>. السلايد كاتبها <en>Scrap / slug</en>. في التخريم، دي خردة.' },
        { t: 'check', q: 'ct25' },
        { t: 'trap', text: 'محدّب ومقعّر بيتلخبطوا. البنش هو اللي بارز (<en>convex</en>)، والداي هو المجوّف (<en>concave</en>).', wrong: 'Punch = concave, female · Die = convex, male', right: 'Punch = convex, male · Die = concave, female' },
        { t: 'tip', text: 'البنش بارز وبيدخل = <en>male</en>. الداي مجوّف وبيستقبل = <en>female</en>.' }
      ]
    },
    /* ---------------------------------------------------------------- S12 */
    {
      id: 'ct-ops', title: '14 عملية على الصاج', en: 'The cutting operations', ref: 'L5 · S12', scene: 'cutOps',
      blocks: [
        { t: 'say', who: 'usta', text: 'السلايد 12 قايمة طويلة: 14 اسم. ما تتخضش. كلهم بنش وداي، بأشكال مختلفة.' },
        { t: 'quote', ref: 'L5 · S12', text: 'The cutting operations include: Punching (Piercing) · Blanking · Fine blanking · Notching · Perforating · Slotting · Slitting · Lancing · Parting · Cutoff · Shaving · Trimming · Embossing · Coining', ar: 'عمليات القطع: 14 اسم. (والـ Nibbling متعرّفة كمان في السلايد 20، بس مش في القايمة دي.)' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'التخريم', en: 'Punching (Piercing)', art: ICON.punching, text: 'بيعمل فتحة. اللوح هو المنتج، والحتة اللي وقعت خردة.' },
          { title: 'البلانكينج', en: 'Blanking', art: ICON.blanking, text: 'بيطلّع شكل. الـ <en>blank</en> اللي وقع هو المنتج، واللوح خردة.' },
          { title: 'البلانكينج الدقيق', en: 'Fine blanking', art: ICON.fine, text: 'بلانكينج + <en>ejector</en> من تحت: أكثر استواءً، وحرف أنعم.' },
          { title: 'حزّة في الحرف', en: 'Notching', art: ICON.notching, text: 'تخريم على حرف اللوح، على شكل جزء من البنش.' },
          { title: 'فتحات كتير', en: 'Perforating', art: ICON.perforating, text: 'فتحات كتير متقاربة، في عملية واحدة.' },
          { title: 'فتحات مستطيلة', en: 'Slotting', art: ICON.slotting, text: 'تخريم بيعمل فتحات مستطيلة.' },
          { title: 'شرايح', en: 'Slitting', art: ICON.slitting, text: 'خطوط مستقيمة. مفيش خردة.' },
          { title: 'قطع جزئي', en: 'Lancing', art: ICON.lancing, text: 'مفيش معدن بيتشال. لسان، أو فتحة تهوية، أو شيش.' },
          { title: 'فصل بحدّين', en: 'Parting', art: ICON.parting, text: 'بنش بحدّين. فيه خردة بين القطع.' },
          { title: 'فصل بخط', en: 'Cutoff', art: ICON.cutoff, text: 'خط واحد بيفصل القطعة. مفيش خردة.' },
          { title: 'كشط الحرف', en: 'Shaving', art: ICON.shaving, text: 'شعرة من الحرف، بخلوص صغير. ±0.025 mm.' },
          { title: 'قص الزيادة', en: 'Trimming', art: ICON.trimming, text: 'الزيادة من حوالين القطعة، زي شفة الكوباية.' },
          { title: 'بصم بارز', en: 'Embossing', art: ICON.embossing, text: 'تجاويف: حروف بارزة أو غاطسة، أو ضلوع تقوية.' },
          { title: 'سكّ', en: 'Coining', art: ICON.coining, text: 'طبعات على الوشّين.' },
          { title: 'قرض', en: 'Nibbling · S20', art: ICON.nibbling, text: 'ضربات صغيرة متداخلة على مسار، بتقطع شكل كبير.' }
        ] },
        { t: 'h', text: 'تلات أسئلة لأي عملية', en: 'Three questions for every operation' },
        { t: 'list', style: 'num', items: ['فيه معدن اتشال من اللوح؟', 'إيه اللي راح الخردة؟', 'إيه اللي هيتشحن للزبون؟'] },
        { t: 'table', head: ['الإجابة', 'العمليات'], rows: [
          ['فيه حتة بتترمي (خردة)', '<en>Punching · Blanking · Fine blanking · Notching · Perforating · Slotting · Parting · Shaving · Trimming · Nibbling</en>'],
          ['بيقطع، ومفيش خردة', '<en>Slitting · Cutoff</en>'],
          ['مفيش معدن اتشال خالص', '<en>Lancing · Embossing · Coining</en>']
        ] },
        { t: 'check', q: 'ct26' },
        { t: 'check', q: 'ct27' },
        { t: 'tip', text: '<en>Embossing</en> و<en>Coining</en> موجودين في قايمة القطع، بس هما مش بيقطعوا حاجة. بيكبسوا شكل في الصاج.' }
      ]
    },
    /* ---------------------------------------------------------------- S13 */
    {
      id: 'ct-punchblank', title: 'تخريم ولا بلانكينج؟', en: 'Punching vs blanking', ref: 'L5 · S13', scene: 'punchVsBlank',
      blocks: [
        { t: 'say', who: 'press', text: 'ده أشهر سؤال في المحاضرة. نفس البنش، ونفس الداي، ونفس الضربة. الفرق كله: انت شايل أنهي حتة؟' },
        { t: 'quote', ref: 'L5 · S13', text: '1-2-1- Punching (Piercing): It is a cutting operation by which various shaped holes are made in sheet metal. Punching is similar to blanking except that in punching, the hole is the desired product, the material punched out to form the hole being waste.', ar: 'التخريم عملية قطع بتعمل فتحات بأشكال مختلفة في الصاج. شبه البلانكينج، بس في التخريم الفتحة هي المنتج المطلوب، والمعدن اللي اتخرم خردة.' },
        { t: 'quote', ref: 'L5 · S13', text: '1-2-2- Blanking: Blanking is the operation of cutting a flat shape sheet metal. The article punched out is called the blank and is the required product of the operation. The hole and metal left behind is discarded as waste.', ar: 'البلانكينج عملية بتقطع شكل مسطح من الصاج. الحتة اللي اتخرمت اسمها blank، وهي المنتج المطلوب. والفتحة والمعدن اللي فاضل بيترموا خردة.' },
        { t: 'art', html: art('pb'), caption: 'زي رسمة السلايد 13: نفس القطع. في التخريم بنشيل اللوح اللي فيه الفتحة. في البلانكينج بنشيل الحتة اللي وقعت. والمتشطّب هو اللي اترمى (Discarded).' },
        { t: 'demo', id: 'ct-keep', title: 'خد ولا ارمي؟', caption: 'اضغط «اخرم»، وبعدين اختار الحتة اللي هتروح للزبون. اسم العملية هيظهر. جرّب الاختيارين.', mount: (el, api) => mountKeep(el, api, KEEP) },
        { t: 'check', q: 'ct28' },
        { t: 'check', q: 'ct29' },
        { t: 'example', title: 'غطا الحلة، ولوحة المفتاح', text: 'غطا حلة مدوّر: بنقطع قرص من الصاج، والقرص هو المنتج. يبقى <en>blanking</en>. وده نفس الـ <en>blank</en> اللي بيدخل السحب العميق في محاضرة 4. لوحة مفتاح الكهربا محتاجة فتحة للمفتاح: الحتة اللي وقعت خردة، واللوح هو المنتج. يبقى <en>punching</en>.' },
        { t: 'check', q: 'ct30' },
        { t: 'trap', text: 'السؤال هيوصفلك حتة وقعت ويسألك: خردة ولا منتج؟ ما تخمّنش. اسأل نفسك: احنا عايزين أنهي حتة؟', wrong: 'Blanking: the hole is the desired product', right: 'Blanking: the blank is the product · Punching: the hole is the product' },
        { t: 'check', q: 'ct33' },
        { t: 'tip', text: '<en>Blanking</en> → الـ <en>blank</en> هو المنتج. <en>Punching</en> → الفتحة هي المنتج. اسم العملية بيقولك على المنتج.' }
      ]
    },
    /* ---------------------------------------------------------------- S14 */
    {
      id: 'ct-fine', title: 'البلانكينج الدقيق', en: 'Fine blanking', ref: 'L5 · S14', scene: 'fineBlank',
      blocks: [
        { t: 'say', who: 'usta', text: 'البلانكينج العادي بيطلّع حرف خشن شوية. لو عايز الحرف ناعم والقطعة مسطحة، هنزوّد قوة من تحت.' },
        { t: 'quote', ref: 'L5 · S14', text: 'A second force is applied under the sheet, directly opposite the punch, by a “ejector".', ar: 'قوة تانية بتتحط تحت الصاج، قصاد البنش بالظبط، عن طريق ejector.' },
        { t: 'fig', id: 'ct-fine', caption: 'رسمة السلايد 14 مبسّطة: البنش بينزل بقوة البلانكينج، والـ cushion/ejector تحت بيزق لفوق (Counterforce)، والـ guide plate ماسك الصاج بالـ impingement ring.' },
        { t: 'check', q: 'ct34' },
        { t: 'quote', ref: 'L5 · S14', text: 'This technique produces a part with better flatness and smoother edges.', ar: 'الطريقة دي بتطلّع قطعة أكثر استواءً (flatness)، وحروفها أنعم.' },
        { t: 'why', text: 'الـ <en>blank</en> متكلبش من فوق ومن تحت في نفس الوقت. مش لاقي فرصة يتني ولا يتشد وهو بيتقطع. فبيطلع مسطّح، وحرفه ناعم.' },
        { t: 'art', html: art('edge'), caption: 'تفاصيل حرف الـ blank زي ما في السلايد: Die roll، وSheared edge، وBurr، والـ Flatness.' },
        { t: 'check', q: 'ct35' },
        { t: 'trap', text: 'القوة التانية **تحت** الصاج، قصاد البنش. اللي فوق الصاج اسمها <en>holding force</en>، وده شغل الـ <en>guide plate</en>.', wrong: 'The ejector pushes down on top of the sheet', right: 'A second force is applied under the sheet, directly opposite the punch, by an ejector' },
        { t: 'tip', text: '<en>Fine blanking</en> = بلانكينج + <en>ejector</en> من تحت = <en>flatness</en> أحسن + <en>edges</en> أنعم.' }
      ]
    },
    /* ---------------------------------------------------------------- S15–S16 */
    {
      id: 'ct-holes', title: 'حزّة، ومية فتحة، وشقوق', en: 'Notching · perforating · slotting', ref: 'L5 · S15–S16', scene: 'perforating',
      blocks: [
        { t: 'say', who: 'punch', text: 'تلات عمليات من نفس العيلة: بنش بيخرم. الفرق في المكان، والشكل، والعدد.' },
        { t: 'quote', ref: 'L5 · S15', text: 'Notching: Punching the edge of a sheet, forming a notch in the shape of a portion of the punch.', ar: 'النوتشينج: تخريم على حرف الصاج، بيعمل حزّة على شكل جزء من البنش.' },
        { t: 'quote', ref: 'L5 · S15', text: 'Perforating: Punching a close arrangement of a large number of holes in a single operation.', ar: 'البيرفوريتنج: تخريم عدد كبير من الفتحات، قريبين من بعض، في عملية واحدة.' },
        { t: 'quote', ref: 'L5 · S16', text: 'Slotting: A punching operation that forms rectangular holes in the sheet.', ar: 'السلوتينج: عملية تخريم بتعمل فتحات مستطيلة في الصاج.' },
        { t: 'grid', cols: 3, items: [
          { title: 'على الحرف', en: 'Notching', art: art('notch'), text: 'الحزّة على شكل جزء من البنش. الجزء التاني من البنش بره اللوح.' },
          { title: 'كتير ومتقاربين', en: 'Perforating', art: art('perf'), text: 'عدد كبير من الفتحات، في ضربة واحدة.' },
          { title: 'مستطيلة', en: 'Slotting', art: art('slot'), text: 'فتحات مستطيلة في اللوح.' }
        ] },
        { t: 'check', q: 'ct36' },
        { t: 'check', q: 'ct37' },
        { t: 'example', title: 'شبكة السماعة، ورف المخزن', text: 'شبكة السماعة: مئات الفتحات الصغيرة في ضربة واحدة. ده <en>perforating</en>. رف المخزن اللي فيه فتحات مستطيلة للخطاطيف: ده <en>slotting</en>. ركن اللوح اللي اتقطع منه حزّة قبل الثني: ده <en>notching</en>. وفي التلاتة: اللي وقع خردة، واللوح هو اللي بيتشحن.' },
        { t: 'trap', text: '<en>Slotting</en> (فتحات مستطيلة) غير <en>Slitting</en> (خطوط مستقيمة من غير خردة). حرفين بس فرق في الاسم، والامتحان عارف كده.', wrong: 'Slitting forms rectangular holes', right: 'Slotting forms rectangular holes · Slitting cuts straight lines, no scrap' },
        { t: 'check', q: 'ct38' },
        { t: 'tip', text: '<en>Notch</en> = على الحرف. <en>Perforate</en> = كتير ومتقاربين. <en>Slot</en> = مستطيل.' }
      ]
    },
    /* ---------------------------------------------------------------- S16–S17 */
    {
      id: 'ct-lance', title: 'قطع، ومفيش حاجة وقعت', en: 'Lancing and slitting', ref: 'L5 · S16–S17', scene: 'lancing',
      blocks: [
        { t: 'say', who: 'usta', text: 'عمليتين بيقطعوا الصاج، ومع ذلك مفيش ولا حتة خردة. إزاي؟' },
        { t: 'quote', ref: 'L5 · S16', text: 'Lancing: Creating a partial cut in the sheet, so that no material is removed. The material is left attached to be bent and form a shape, such as a tab, vent, or louver.', ar: 'اللانسينج: قطع جزئي في الصاج، ومفيش ولا حتة معدن بتتشال. المعدن بيفضل متعلّق عشان يتثني ويعمل شكل: لسان (tab)، أو فتحة تهوية (vent)، أو شيش (louver).' },
        { t: 'art', html: art('lance'), caption: 'القطع على تلات جوانب بس. الجنب الرابع بيتثني. الحتة بتطلع لفوق وتعمل شيش.' },
        { t: 'check', q: 'ct39' },
        { t: 'example', title: 'شيش التهوية', text: 'فتحات التهوية المايلة في ضهر الكمبيوتر أو التلاجة: دي <en>lancing</en>. الهوا بيعدّي، والصاج ما خسرش ولا جرام.' },
        { t: 'quote', ref: 'L5 · S17', text: 'Slitting: Cutting straight lines in the sheet. No scrap material is produced.', ar: 'السليتنج: قطع خطوط مستقيمة في الصاج. ومفيش أي خردة.' },
        { t: 'art', html: art('knives'), caption: 'زي رسمة السلايد 17: سكينتين بيلفّوا (Upper knife وLower knife). اللوح بيعدّي بينهم ويتقسم شرايح، ومفيش حاجة بتقع.' },
        { t: 'check', q: 'ct40' },
        { t: 'compare', left: { title: 'قطع جزئي', en: 'Lancing', art: ICON.lancing, text: 'قطع على جزء من الشكل، والباقي بيتثني. الحتة بتفضل متعلّقة.' }, right: { title: 'خطوط مستقيمة', en: 'Slitting', art: ICON.slitting, text: 'اللوح بيتقسم شرايح. مفيش خردة.' }, note: 'الاتنين: صفر خردة.' },
        { t: 'trap', text: 'فتحة تهوية؟ متفتكرش إن فيه حتة اتشالت. في الـ <en>lancing</en> مفيش معدن بيتشال: الحتة لسه في مكانها، بس متنية.', wrong: 'Lancing removes a small tab of material to make a vent', right: 'Lancing: no material is removed; the material is left attached and bent' },
        { t: 'tip', text: '<en>Lancing</en> = قطع جزئي + ثني = <en>tab · vent · louver</en>. <en>Slitting</en> = خطوط مستقيمة = <en>no scrap</en>.' }
      ]
    },
    /* ---------------------------------------------------------------- S18–S19 */
    {
      id: 'ct-cutoff', title: 'تفصل بخط، ولا بحتة خردة؟', en: 'Cutoff vs parting', ref: 'L5 · S18–S19', scene: 'cutoffParting',
      blocks: [
        { t: 'say', who: 'usta', text: 'عندك شريط صاج، وعايز تقطّعه قطع. ممكن تفصل كل قطعة بخط واحد. أو تقطع بحدّين وترمي اللي بينهم.' },
        { t: 'quote', ref: 'L5 · S18', text: 'Cutoff - Separating a part from the remaining sheet, without producing any scrap. · The punch will produce a cut line that may be straight, angled, or curved.', ar: 'الكت أوف: فصل قطعة عن باقي الصاج من غير أي خردة. والبنش بيعمل خط قطع ممكن يكون مستقيم، أو مايل، أو منحني.' },
        { t: 'check', q: 'ct41' },
        { t: 'quote', ref: 'L5 · S19', text: 'Parting involves cutting a sheet metal strip by a punch with two cutting edges that match the opposite sides of the blank.', ar: 'البارتينج: قطع شريط صاج ببنش ليه حدّين قطع، بيطابقوا الجنبين المتقابلين للـ blank.' },
        { t: 'art', html: art('strip'), caption: 'زي رسمة السلايد 18: الكت أوف بيقطع على مسار واحد، ومفيش خردة: 4 قطع. البارتينج بيقطع على مسارين مع بعض، واللي بينهم خردة: 3 قطع بس.' },
        { t: 'demo', id: 'ct-strip', title: 'نفس الشريط، عمليتين', caption: 'اختار العملية، واضغط «اضرب» لحد ما الشريط يخلص. عِد القطع والخردة.', mount: (el, api) => mountStrip(el, api, STRIP) },
        { t: 'check', q: 'ct42' },
        { t: 'why', text: 'البنش في البارتينج ليه حدّين. كل ضربة بتقطع خطين مع بعض، واللي بين الخطين بيقع. عشان كده فيه خردة. في الكت أوف الخط واحد، فمفيش حاجة بين قطعة والتانية.' },
        { t: 'check', q: 'ct43' },
        { t: 'trap', text: 'الاتنين بيفصلوا قطع من شريط. الفرق في الخردة بس.', wrong: 'Parting separates parts without producing any scrap', right: 'Cutoff: no scrap · Parting: wasted material between the parts' },
        { t: 'tip', text: '<en>Cutoff</en> = خط واحد = صفر خردة. <en>Parting</en> = حدّين = خردة في النص.' }
      ]
    },
    /* ---------------------------------------------------------------- S19–S20 */
    {
      id: 'ct-edge', title: 'تنضيف الحرف، وقص الزيادة، والقرض', en: 'Shaving · trimming · nibbling', ref: 'L5 · S19–S20', scene: 'trimShave',
      blocks: [
        { t: 'say', who: 'usta', text: 'القطعة طلعت. بس حرفها محتاج تظبيط، أو حواليها زيادة، أو الشكل كبير على البنش. هنا بييجي دور التلاتة دول.' },
        { t: 'quote', ref: 'L5 · S19', text: 'Shaving: Shearing away minimal material from the edges of a feature or part, using a small die clearance. Used to improve accuracy or finish. Tolerances of ±0.025 mm are possible.', ar: 'الشيفينج: قص كمية صغيرة جدًا من حروف فتحة أو قطعة، بخلوص داي صغير. بيتعمل عشان الدقة أو التشطيب. وممكن يوصل لتفاوت ±0.025 mm.' },
        { t: 'art', html: art('shave'), caption: 'شعرة معدن بتتشال من حرف الفتحة. الفتحة بتوسع شوية، والحرف بيبقى دقيق.' },
        { t: 'check', q: 'ct44' },
        { t: 'quote', ref: 'L5 · S20', text: 'Trimming: Punching away excess material from the perimeter of a part, such as trimming the flange from a drawn cup.', ar: 'التريمنج: تخريم المعدن الزيادة من حوالين القطعة، زي قص الشفة (flange) من كوباية مسحوبة.' },
        { t: 'art', html: art('trim'), caption: 'الكوباية اللي طالعة من السحب العميق (محاضرة 4) ليها شفة زيادة. التريمنج بيشيلها: الحلقة خردة (Scrap)، والكوباية هي المنتج (Trimmed part).' },
        { t: 'check', q: 'ct46' },
        { t: 'quote', ref: 'L5 · S20', text: 'Nibbling: Punching a series of small overlapping slits or holes along a path to cut-out a larger contoured shape.', ar: 'النيبلنج (القرض): تخريم سلسلة فتحات أو شقوق صغيرة متداخلة على مسار، عشان تقطع شكل كبير بكنتور.' },
        { t: 'art', html: art('nibble'), caption: 'بنش صغير، وضربات كتير متداخلة، وفي الآخر شكل كبير منحني.' },
        { t: 'check', q: 'ct47' },
        { t: 'compare', left: { title: 'كشط الحرف', en: 'Shaving', art: ICON.shaving, text: 'كمية صغيرة جدًا من الحرف، بخلوص صغير. للدقة والتشطيب: ±0.025 mm.' }, right: { title: 'قص الزيادة', en: 'Trimming', art: ICON.trimming, text: 'الزيادة من حوالين القطعة، زي شفة الكوباية.' } },
        { t: 'trap', text: 'الاتنين بيشيلوا معدن من الحرف. بس الـ <en>shaving</en> شعرة صغيرة للدقة، والـ <en>trimming</en> زيادة كبيرة من حوالين القطعة.', wrong: 'Shaving uses a large die clearance to remove the flange', right: 'Shaving: minimal material, small die clearance · Trimming: excess material from the perimeter' },
        { t: 'tip', text: '<en>Shave</en> = شعرة + دقة ±0.025 mm. <en>Trim</en> = الزيادة اللي على الحواف. <en>Nibble</en> = عضّات صغيرة متداخلة.' }
      ]
    },
    /* ---------------------------------------------------------------- S21–S22 */
    {
      id: 'ct-emboss', title: 'البصم والسكّ', en: 'Embossing and coining', ref: 'L5 · S21–S22', scene: 'emboss',
      blocks: [
        { t: 'say', who: 'usta', text: 'آخر اتنين في القايمة مش بيقطعوا خالص. بيكبسوا شكل في الصاج.' },
        { t: 'quote', ref: 'L5 · S21', text: 'Embossing: Creates hollows in sheet, such as elevated (or indented) lettering or reinforcement ribs · Certain designs are embossed on the sheet metal. · Punch and die are of the same contour but in opposite direction.', ar: 'الإمبوسينج بيعمل تجاويف في الصاج، زي حروف بارزة (أو غاطسة)، أو ضلوع تقوية. تصميمات معينة بتتبصم على الصاج. والبنش والداي ليهم نفس الكنتور، بس في اتجاه عكس بعض.' },
        { t: 'art', html: art('ribs'), caption: 'ضلوع تقوية مبصومة في لوح صاج: اللوح بيبقى أنشف من غير ما يتخن.' },
        { t: 'check', q: 'ct48' },
        { t: 'fig', id: 'ct-emb', caption: 'زي رسمة السلايد 21: MALE فوق وFEMALE تحت. نفس الشكل، بالعكس. والصاج بيتكبس بينهم.' },
        { t: 'check', q: 'ct49' },
        { t: 'quote', ref: 'L5 · S22', text: 'Coining: Similar to embossing with the difference that similar or different impressions are obtained on both the sides of the sheet metal.', ar: 'الكوينينج شبه الإمبوسينج، بس الفرق إن فيه طبعات متشابهة أو مختلفة بتطلع على الوشّين بتوع الصاج.' },
        { t: 'compare', left: { title: 'البصم', en: 'Embossing', art: art('emboss', { small: true }), text: 'شكل واحد: بارز على وش، وغاطس على الوش التاني. البنش والداي نفس الكنتور بالعكس.' }, right: { title: 'السكّ', en: 'Coining', art: art('coin'), text: 'طبعة على كل وش. ممكن نفس الطبعة، أو طبعة مختلفة. زي العملة.' } },
        { t: 'example', title: 'العملة، ولوحة الشارع', art: art('coinFaces'), text: 'العملة المعدنية: صورة على وش، ورقم على الوش التاني. ده <en>coining</en>. لوحة اسم الشارع اللي حروفها بارزة: ده <en>embossing</en>.' },
        { t: 'check', q: 'ct50' },
        { t: 'trap', text: 'لو السؤال قال «on both the sides» يبقى <en>coining</en>. ولو قال «same contour but in opposite direction» يبقى <en>embossing</en>.', wrong: 'Embossing gives different impressions on both sides', right: 'Embossing: same contour, opposite direction · Coining: impressions on both sides' },
        { t: 'tip', text: '<en>Emboss</en> = تجويف بشكل واحد (وش بارز، ووش غاطس). <en>Coin</en> = طبعة على الوشّين.' }
      ]
    }
  ]
};
