// Lesson — props (Arabic edition). Lecture 2 · slides 11–15: the rest of the mechanical properties (hardness → weldability)
// and the physical properties. Drawings and demos: _props-kit.js.
import { hardnessArt, ductileArt, brittleArt, beamArt, toughArt, malleableArt, castArt, resilienceArt, machineArt, weldArt, PHYS_ICON, domainsArt, rustArt, uvArt, wireSheet, changeIt, heatBars } from './_props-kit.js';

const en = s => `<bdi dir="ltr">${s}</bdi>`;
/* the demos' words (Arabic) */
const WS = {
  aria: 'قضيب معدن بيتشد أو بيتدرفل', matLabel: 'الخامة', actLabel: 'تعمل فيه إيه؟',
  mats: { soft: ['معدن A', 'مطيلي ومطاوع'], cast: ['حديد زهر', 'قصيف'] },
  acts: { pull: ['اشده', 'حمل شد'], roll: ['درفله أو اطرقه', 'عشان يبقى لوح'] },
  idle: 'اختار الخامة، وبعدين اشدها أو درفلها.',
  out: {
    soft_pull: ['بقى سلك رفيع', `دي المطيلية: ${en('fine wire without fracture')}.`],
    soft_roll: ['بقى صاج', `دي المطاوعة: ${en('rolled or hammered into sheets')}.`],
    cast_pull: ['طق!', 'القصافة: عكس المطيلية. اتكسر من غير ما يطول.'],
    cast_roll: ['اتشرخ!', 'الحديد الزهر قصيف: بيتشرخ بدل ما يتفرد لوح.']
  }
};
const CH = {
  aria: 'قضيب معدن بيتطرق على البارد أو بيتعالج حراريًا',
  mechT: 'ميكانيكية', physT: 'فيزيائية',
  mech: ['الصلادة', 'المطيلية', 'المتانة', 'قابلية التشغيل'], phys: ['الكثافة', 'اللون', 'نقطة الانصهار', 'التوصيل الحراري'],
  work: ['اطرقه على البارد', `${en('work hardening')}: الخواص الميكانيكية اتغيرت، والفيزيائية زي ما هي.`],
  heat: ['عالجه حراريًا', `${en('heat treatment')}: نفس الحكاية. الميكانيكي اتغير، والفيزيائي ثابت.`],
  changed: 'اتغيرت', same: 'زي ما هي', idle: 'جرّب الزرارين، وبص على العمودين.'
};
const HB = {
  aria: 'قضيبين بيسخنوا: واحد نقطة انصهاره واطية، والتاني عالية',
  heat: 'السخونية', low: 'انصهاره واطي', high: 'انصهاره عالي', unit: '1/°C · 1/°F', steel: 'الصلب استثناء',
  read: {
    cold: ['باردين', 'الاتنين بطولهم الأصلي (الخط المتقطع).'],
    warm: ['بيسخنوا', 'اللي انصهاره واطي بيتمدد أكتر.'],
    hot: ['سخنين جدًا', 'الفرق بقى واضح: انصهار أعلى = تمدد أقل.'],
    melt: ['ساح!', 'وصل لنقطة انصهاره: الطاقة فصلت الذرات، فاتحول لسايل.']
  }
};

export default {
  zone: 'props',
  hero: { say: 'كل معدن ليه شخصية. واحد يتسحب سلك، وواحد يتفرد صاج، وواحد يتكسر من أول خبطة. المنطقة دي بتعرّفك على الشخصيات دي، بأساميها اللي في الامتحان.' },
  chapters: [
    {
      id: 'pr-hardness', title: 'الصلادة: محدش يخدشه', en: 'Hardness', ref: 'L2 · S11', scene: 'hardness',
      blocks: [
        { t: 'say', who: 'usta', text: 'خد مسمار واخدش سطح. لو المسمار علّم بسهولة، السطح طري. لو ما علّمش، السطح صلد. ده كل الموضوع.' },
        { t: 'p', text: 'إحنا لسه في **الخواص الميكانيكية** <en>Mechanical Properties</en>. منطقة الإجهاد كانت أولها، ودي بقيتها.' },
        { t: 'quote', text: 'Hardness is the ability of a material to resist penetration and scratching.', ref: 'L2 · S11', ar: 'الصلادة: قدرة الخامة إنها تقاوم الغرز (الاختراق) والخدش.' },
        { t: 'art', html: hardnessArt(), caption: 'سن مدبب بيحاول يغرز، وسن تاني بيحاول يخدش. الخامة الصلدة بتقاوم الاتنين.' },
        { t: 'p', text: 'كلمتين بس: <en>penetration</en> = حاجة مدببة بتحاول تخش فيه. <en>scratching</en> = حاجة بتحاول تخدش سطحه.' },
        { t: 'check', q: 'pr01' },
        { t: 'trap', text: 'الصلادة مش المتانة. الصلادة = يقاوم **الغرز والخدش**. المتانة = يقاوم **الكسر من الخبطة**. والامتحان بيحب يحطهم جنب بعض.', wrong: '<en>Hardness = resisting fracture against hammer blows</en>', right: '<en>Hardness = the ability to resist penetration and scratching</en>' },
        { t: 'check', q: 'pr03' },
        { t: 'tip', text: 'Hardness = خدش وغرز. لو السؤال فيه <en>penetration</en> أو <en>scratching</en>، الإجابة الصلادة.' }
      ]
    },
    {
      id: 'pr-ductile', title: 'المطيلية والقصافة: سلك ولا شظايا', en: 'Ductility vs brittleness', ref: 'L2 · S11', scene: 'ductile',
      blocks: [
        { t: 'say', who: 'usta', text: 'شد حتة معدن. واحد بيطول ويرفع لحد ما يبقى سلك. وواحد بيطق نصين من غير ما يطول. الأول مطيلي، والتاني قصيف.' },
        { t: 'quote', text: 'Ductility: It is the ability of a material to be deformed plastically without rupture under tensile load. Due to this property material can lengthy into fine wire without fracture.', ref: 'L2 · S11', ar: 'المطيلية: قدرة الخامة إنها تتشوه تشوه دائم من غير ما تتقطع، تحت حمل شد. وبسببها الخامة تتسحب سلك رفيع من غير كسر.' },
        { t: 'p', text: 'لاحظ ٣ كلمات: **plastically** = تشوه دائم (زي اللدونة في منطقة الإجهاد). **without rupture** = من غير قطع. **under tensile load** = تحت شد. والنتيجة: **fine wire**. وكلمة <en>lengthy</en> في السلايد قصدها «يتسحب ويطول».' },
        { scene: 'brittle', t: 'quote', text: 'Brittleness is the property of a material opposite to ductility. So cast iron is a brittle material.', ref: 'L2 · S11', ar: 'القصافة (الهشاشة): عكس المطيلية. وعشان كده الحديد الزهر خامة قصيفة.' },
        { t: 'compare', left: { title: 'مطيلي', en: 'Ductility', art: ductileArt(), text: 'نفس الشد: بيتمط ويرفع لحد ما يبقى **سلك رفيع**، ومن غير كسر.' }, right: { title: 'قصيف', en: 'Brittleness', art: brittleArt(), text: 'نفس الشد: **بيطق** نصين، تقريبًا من غير ما يطول. زي الحديد الزهر.' }, note: 'نفس الحمل. واحد بيتسحب سلك، والتاني بيتكسر.' },
        { t: 'check', q: 'pr04' },
        { t: 'trap', text: 'السؤال بيقول «opposite to ductility» ويحطلك <en>Malleability</en> أو <en>Elasticity</en> في الاختيارات. السلايد واضح: عكس المطيلية = **القصافة** <en>Brittleness</en>.', wrong: '<en>Brittleness is the opposite of malleability</en>', right: '<en>Brittleness is the property of a material opposite to ductility</en>' },
        { t: 'check', q: 'pr06' },
        { t: 'tip', text: 'Ductile = سلك. Brittle = شظايا. والمثال الوحيد في السلايد: <en>cast iron</en> قصيف. (هتقابله بالتفصيل في منطقة الحديد الزهر.)' }
      ]
    },
    {
      id: 'pr-bending', title: 'الثني: بره شد، وجوه ضغط', en: 'Bending', ref: 'L2 · S11', scene: 'neutralAxis', cap: ['Bending', 'بره شد، وجوه ضغط', 'Outside in tension, inside in compression'],
      blocks: [
        { t: 'say', who: 'usta', text: 'امسك مسطرة بلاستيك واثنيها. الوش اللي بره بيتمط. والوش اللي جوه بيتكبس. الاتنين في نفس اللحظة.' },
        { t: 'quote', text: 'Bending is characterized by the outside fibers of a beam in tension and the inside fibers in compression.', ref: 'L2 · S11', ar: 'الثنى: الألياف اللي بره في الكمرة بتبقى في شد، واللي جوه بتبقى في ضغط.' },
        { t: 'art', html: beamArt(), caption: 'كمرة شايلة حمل في النص. البطن اللي تحت (بره الثنية) بتتمط. الضهر اللي فوق (جوه الثنية) بيتكبس.' },
        { t: 'p', text: '<en>fibers</en> = ألياف: تخيّل القطعة معمولة من خيوط طولية كتير. <en>beam</en> = كمرة: قطعة طويلة شايلة حمل. والخط المتقطع اللي في النص هتعرفه في ثني الصاج باسم المحور المتعادل.' },
        { t: 'check', q: 'pr08' },
        { t: 'trap', text: 'الامتحان بيقلبهم. **بره = شد** (بيتمط). **جوه = ضغط** (بيتكبس). وخلي بالك: الثني بيستخدم اتنين بس من الأربع أحمال: الشد والضغط، مش القص ولا اللي.', wrong: '<en>Outside fibers in compression, inside fibers in tension</en>', right: '<en>Outside fibers in tension, inside fibers in compression</en>' },
        { t: 'check', q: 'pr09' },
        { t: 'tip', text: 'بره = بيتمط = Tension. جوه = بيتزنق = Compression. ونفس الكلام هتشوفه في ثني الصاج (المحاضرة 3).' }
      ]
    },
    {
      id: 'pr-tough', title: 'المتانة: ياخد الخبطة وما يتكسرش', en: 'Toughness', ref: 'L2 · S12', scene: 'tough',
      blocks: [
        { t: 'say', who: 'usta', text: 'راس الشاكوش بتاخد آلاف الخبطات. لو كانت قصيفة، كانت اتفتفتت من أول يوم. اللي مخليها عايشة: المتانة.' },
        { t: 'quote', text: 'Toughness is the ability of a material to resist deformation under stress. is the property of a material to resist fracture against impact load like hammer blows. This property of material is decreased when they heated.', ref: 'L2 · S12', ar: 'المتانة: قدرة الخامة تقاوم التشوه تحت الإجهاد، وتقاوم الكسر قدام حمل صدمة زي خبط الشاكوش. والخاصية دي بتقل لما الخامة تسخن.' },
        { t: 'art', html: toughArt(), caption: 'خبطة شاكوش: اللوح المتين بيتبعج شوية، بس ما بيتكسرش.' },
        { t: 'list', style: 'check', items: ['تقاوم التشوه تحت الإجهاد <en>resist deformation under stress</en>', 'تقاوم الكسر من الصدمة <en>impact load like hammer blows</en>', 'بتقل لما تسخن <en>decreased when heated</en>'] },
        { t: 'check', q: 'pr10' },
        { t: 'trap', text: '«decreased when they heated» = بتقل مع السخونية. الامتحان ممكن يقلبها لـ <en>increased</en>. لأ.', wrong: '<en>Toughness increases when the material is heated</en>', right: '<en>This property of material is decreased when they heated</en>' },
        { t: 'check', q: 'pr11' },
        { t: 'tip', text: 'Toughness = Hammer. لو شفت <en>hammer blows</en> أو <en>impact load</en> ومعاهم <en>fracture</en>، فكّر في المتانة.' }
      ]
    },
    {
      id: 'pr-malleable', title: 'المطاوعة: يتفرد صاج', en: 'Malleability', ref: 'L2 · S12', scene: 'malleable',
      blocks: [
        { t: 'say', who: 'usta', text: 'الحداد بيسخّن الحديدة ويخبط عليها، فتتفرد. ومصنع الدرفلة بيعدّي البلاطة بين درافيل، فتطلع صاج. الخاصية اللي بتسمح بده: المطاوعة.' },
        { t: 'quote', text: 'Malleability is the property of a material which allow the material to be rolled or hammered into sheets. soft steel and wrought iron are examples of malleable materials.', ref: 'L2 · S12', ar: 'المطاوعة: الخاصية اللي بتسمح للخامة تتدرفل أو تتطرق لألواح (صاج). والصلب الطري والحديد المشغول أمثلة لخامات مطاوعة.' },
        { t: 'art', html: malleableArt(), caption: 'طريقتين والنتيجة واحدة: درفلة بين درفيلين، أو طرق على سندان. الاتنين بيطلّعوا لوح.' },
        { t: 'demo', id: 'pr-wire-demo', title: 'سلك ولا صاج؟', caption: 'اختار الخامة، وبعدين اشدها أو درفلها. جرّب التوافيق الأربعة. الشد بيكشف المطيلية، والدرفلة بتكشف المطاوعة، والحديد الزهر بيكشف القصافة.', mount: wireSheet(WS) },
        { t: 'check', q: 'pr12' },
        { t: 'compare', left: { title: 'المطيلية', en: 'Ductility', text: 'تحت **شد** <en>tensile load</en>. النتيجة: **سلك رفيع** <en>fine wire</en>.' }, right: { title: 'المطاوعة', en: 'Malleability', text: 'بالدرفلة أو الطرق <en>rolled or hammered</en>. النتيجة: **ألواح** <en>sheets</en>.' }, note: 'سلك = مطيلية. لوح = مطاوعة.' },
        { t: 'trap', text: 'أشهر لخبطة في المحاضرة: <en>Ductility</en> و<en>Malleability</en>. افتكر النتيجة: سلك ولا لوح؟ وأمثلة المطاوعة في السلايد: <en>soft steel</en> و<en>wrought iron</en> (الحديد المشغول).', wrong: '<en>Malleability = drawn into fine wire</en>', right: '<en>Malleability = rolled or hammered into sheets; ductility = fine wire</en>' },
        { t: 'check', q: 'pr14' },
        { t: 'tip', text: 'Malleable زي <en>mallet</en> (المطرقة): اطرقه يتفرد لوح. Ductile: اسحبه يبقى سلك.' }
      ]
    },
    {
      id: 'pr-castable', title: 'القابلية للصب: سلوكه وهو سايح', en: 'Castability', ref: 'L2 · S12', scene: 'castable',
      blocks: [
        { t: 'say', who: 'usta', text: 'فيه معادن تتصب في الإسطمبة زي المية وتملاها لآخر ركن. وفيه معادن بتتلكك. الفرق ده اسمه القابلية للصب.' },
        { t: 'quote', text: 'Castability of metal refer to the ease with which it can be cast into different shapes and is concerned with the behavior of metal in its molten state.', ref: 'L2 · S12', ar: 'القابلية للصب (السباكة): سهولة إن المعدن يتصب في أشكال مختلفة، وبتهتم بسلوك المعدن وهو منصهر.' },
        { t: 'art', html: castArt(), caption: 'المعدن السايح نازل من البوتقة للإسطمبة. لازم يوصل لكل تفصيلة في الشكل.' },
        { t: 'example', title: 'جسم حنفية المطبخ', text: 'جسم الحنفية شكله معقد: منحنيات وتجاويف. الأشكال دي بتتعمل بالصب. والمصمم بيختار معدن قابليته للصب كويسة، عشان يملا الإسطمبة كلها.' },
        { t: 'check', q: 'pr15' },
        { t: 'trap', text: 'القابلية للصب بتتكلم عن المعدن **وهو سايح** <en>molten state</en>. باقي الخواص اللي فاتت (الصلادة والمطيلية…) بتتكلم عنه وهو صلب.', wrong: '<en>Castability is concerned with the metal in its solid state</en>', right: '<en>Castability is concerned with the behavior of metal in its molten state</en>' },
        { t: 'tip', text: 'Cast = صب. Molten = سايح. لو شفت الكلمتين مع بعض، اختار <en>Castability</en>.' }
      ]
    },
    {
      id: 'pr-resilience', title: 'امتصاص الصدمات: ياخدها ويرجع', en: 'Resilience', ref: 'L2 · S13', scene: 'resilience',
      blocks: [
        { t: 'say', who: 'usta', text: 'سوستة كرسي المكتب. تقعد عليه بخبطة: تمتص الخبطة، وترجع زي ما كانت. ده <en>resilience</en>.' },
        { t: 'quote', text: 'RESILIENCE: It is a property of material to absorb energy and to resist shock and impact loads. It is measured by the amount of energy absorbed per unit volume within the elastic limit.', ref: 'L2 · S13', ar: 'مقاومة أو امتصاص الصدمات: خاصية الخامة إنها تمتص طاقة وتقاوم الصدمات والأحمال المفاجئة. وبتتقاس بكمية الطاقة اللي بتتمتص في وحدة الحجم، جوه حد المرونة.' },
        { t: 'art', html: resilienceArt(), caption: 'وزن بيقع على سوستة: بتتكبس وتمتص الطاقة، وبعدين ترجع لشكلها.' },
        { t: 'compare', left: { title: 'المتانة', en: 'Toughness', text: 'تقاوم **الكسر** قدام الصدمة <en>impact load like hammer blows</en>. السؤال: اتكسر ولا لأ؟' }, right: { title: 'امتصاص الصدمات', en: 'Resilience', text: '**تمتص الطاقة** وتقاوم الصدمة. بتتقاس **جوه حد المرونة** <en>within the elastic limit</en>: يعني بترجع.' }, note: 'الاتنين فيهم صدمة. المتانة = ما يتكسرش. امتصاص الصدمات = يمتص ويرجع.' },
        { t: 'check', q: 'pr17' },
        { t: 'why', text: 'جوه حد المرونة، القطعة بتخزّن الطاقة زي السوستة، وبترجّعها لما الحمل يمشي. عشان كده القياس بيتعمل جوه حد المرونة: الطاقة اللي القطعة تمتصها وهي لسه هترجع.' },
        { t: 'trap', text: '«within the elastic limit» هي مفتاح السؤال. لو الطاقة اتمتصت والقطعة رجعت لشكلها، ده <en>Resilience</en>. ولو السؤال عن الكسر من خبط الشاكوش، ده <en>Toughness</en>.', wrong: '<en>Resilience is measured within the plastic range</en>', right: '<en>Resilience is measured by the energy absorbed per unit volume within the elastic limit</en>' },
        { t: 'check', q: 'pr19' }
      ]
    },
    {
      id: 'pr-machine', title: 'قابلية التشغيل وقابلية اللحام', en: 'Machinability · weldability', ref: 'L2 · S13', scene: 'machinable',
      blocks: [
        { t: 'say', who: 'usta', text: 'المصمم مش بيختار خامة شكلها حلو وبس. بيسأل: هتتخرط بسهولة؟ هتتلحم؟ الإجابة في خاصيتين.' },
        { t: 'quote', text: 'MACHINABILITY: The ease with which a given material may be worked or shaped with a cutting tool is called machinability. Machinability depends on chemical composition, structure and mechanical properties.', ref: 'L2 · S13', ar: 'قابلية التشغيل بالماكينات: سهولة تشكيل الخامة بأداة قطع. وبتعتمد على التركيب الكيميائي، والبنية، والخواص الميكانيكية.' },
        { scene: 'weldable', t: 'quote', text: 'WELDABILITY: It is the ability of material to be joined by welding. Weldability depends on chemical composition, physical properties and heat treatment to which they are subjected.', ref: 'L2 · S13', ar: 'قابلية اللحام: قدرة الخامة إنها تتوصل باللحام. وبتعتمد على التركيب الكيميائي، والخواص الفيزيائية، والمعالجة الحرارية اللي اتعرضت لها.' },
        { t: 'compare', left: { title: 'قابلية التشغيل', en: 'Machinability', art: machineArt(), text: 'أداة قطع <en>cutting tool</en> بتشيل رايش وتشكّل القطعة.' }, right: { title: 'قابلية اللحام', en: 'Weldability', art: weldArt(), text: 'قطعتين بيتوصلوا بخط لحام <en>welding</en>.' } },
        { t: 'table', head: ['', 'التشغيل <en>Machinability</en>', 'اللحام <en>Weldability</en>'], rows: [
          ['1', '<en>chemical composition</en>', '<en>chemical composition</en>'],
          ['2', '<en>structure</en>', '<en>physical properties</en>'],
          ['3', '<en>mechanical properties</en>', '<en>heat treatment</en>']
        ] },
        { t: 'check', q: 'pr20' },
        { t: 'check', q: 'pr21' },
        { t: 'trap', text: 'الاتنين بيبدأوا بـ <en>chemical composition</en>. بعدها بيفترقوا: التشغيل ← <en>structure</en> و<en>mechanical properties</en>. اللحام ← <en>physical properties</en> و<en>heat treatment</en>.', wrong: '<en>Machinability depends on heat treatment</en>', right: '<en>Machinability depends on chemical composition, structure and mechanical properties</en>' },
        { t: 'check', q: 'pr23' },
        { t: 'tip', text: '**M**achinability ← **M**echanical. واللحام سخن ← <en>heat treatment</en> و<en>physical properties</en>.' }
      ]
    },
    {
      id: 'pr-physical', title: 'الخواص الفيزيائية: صعب تتغير', en: 'Physical properties', ref: 'L2 · S14', scene: 'physical',
      blocks: [
        { t: 'say', who: 'usta', text: 'لحد هنا كنا في الخواص الميكانيكية. دلوقتي القسم التاني: **الخواص الفيزيائية**. دي شخصية الخامة اللي اتولدت بيها.' },
        { t: 'quote', text: 'Physical properties are inherent aspects of a material that are generally not easily altered. Physical properties generally remain intact, whereas mechanical properties are changed by work hardening and/or through heat treatment.', ref: 'L2 · S14', ar: 'الخواص الفيزيائية: صفات أصيلة في الخامة، وصعب تتغير. بتفضل زي ما هي، أما الخواص الميكانيكية فبتتغير بالتشغيل على البارد (work hardening) أو بالمعالجة الحرارية.' },
        { t: 'demo', id: 'pr-change-demo', title: 'غيّرها لو تقدر', caption: 'اطرق القضيب على البارد، أو دخّله الفرن. بص العمود الميكانيكي بيتغير، والفيزيائي ثابت.', mount: changeIt(CH) },
        { t: 'check', q: 'pr24' },
        { t: 'quote', text: 'Opacity/transparency is the ability to transmit light. Color is the characteristic reflected wavelength. Density is weight per unit volume (specific gravity). Electrical conductivity is the ease with which a material conducts a current. Thermal conductivity is the ease with which heat flows within and through a material.', ref: 'L2 · S14' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'العتامة/الشفافية', en: 'Opacity/transparency', text: 'بيعدّي الضوء ولا لأ. <en>the ability to transmit light</en>', art: PHYS_ICON.opacity },
          { title: 'اللون', en: 'Color', text: 'الطول الموجي اللي بيرتد منه. <en>the characteristic reflected wavelength</en>', art: PHYS_ICON.color },
          { title: 'الكثافة', en: 'Density', text: 'الوزن في وحدة الحجم. <en>weight per unit volume (specific gravity)</en>', art: PHYS_ICON.density },
          { title: 'التوصيل الكهربي', en: 'Electrical conductivity', text: 'سهولة مرور **التيار**. <en>conducts a current</en>', art: PHYS_ICON.electric },
          { title: 'التوصيل الحراري', en: 'Thermal conductivity', text: 'سهولة مرور **الحرارة** جواه. <en>heat flows within and through</en>', art: PHYS_ICON.thermal },
          { title: 'والباقي في سلايد 15', en: 'expansion · magnetism · melting · corrosion', text: 'التمدد الحراري، والمغناطيسية، ونقطة الانصهار، ومقاومة التآكل. الفصول الجاية.', art: PHYS_ICON.expansion }
        ] },
        { t: 'check', q: 'pr26' },
        { scene: 'conductivity', t: 'trap', text: 'كهربي ولا حراري؟ الاتنين بيبدأوا بـ «the ease with which». الكهربي: <en>conducts a current</en> (تيار). الحراري: <en>heat flows within and through</en> (حرارة).', wrong: '<en>Thermal conductivity = the ease with which a material conducts a current</en>', right: '<en>Thermal conductivity = the ease with which heat flows within and through a material</en>' },
        { t: 'check', q: 'pr30' },
        { t: 'tip', text: 'ميكانيكية = بتتغير (تشغيل على البارد، ومعالجة حرارية). فيزيائية = ثابتة (أصيلة).' }
      ]
    },
    {
      id: 'pr-expansion', title: 'التمدد الحراري ونقطة الانصهار', en: 'Thermal expansion · melting point', ref: 'L2 · S15', scene: 'expansion',
      blocks: [
        { t: 'say', who: 'usta', text: 'قضبان السكة الحديد بيسيبوا بينهم فراغ صغير. ليه؟ عشان في الصيف بتتمدد. لو مفيش فراغ، هتتزنق في بعض وتتعوج.' },
        { t: 'quote', text: 'Thermal expansion is expressed in units of 1/°F or 1/°C. Generally, the coefficient of thermal expansion is inversely proportional to the melting point of a material: higher-melt temperature materials have less expansion. Steel is a significant exception.', ref: 'L2 · S15', ar: 'التمدد الحراري بيتقاس بوحدة <en>1/°F</en> أو <en>1/°C</en>. وفي العموم، معامل التمدد الحراري بيتناسب عكسيًا مع نقطة الانصهار: الخامات اللي بتنصهر على درجة أعلى بتتمدد أقل. والصلب استثناء مهم.' },
        { t: 'demo', id: 'pr-heat-demo', title: 'سخّن القضيبين', caption: 'زوّد السخونية. التمدد مرسوم مكبّر عشان يبان. اللي انصهاره واطي بيطول أكتر… لحد ما يوصل لنقطة انصهاره.', mount: heatBars(HB) },
        { t: 'p', text: 'يعني: **انصهار عالي ← تمدد قليل**. و**انصهار واطي ← تمدد كبير**. ده معنى «تناسب عكسي» <en>inversely proportional</en>. والوحدة <en>1/°C</en>: واحد على درجة، مش درجة.' },
        { t: 'check', q: 'pr32' },
        { scene: 'melting', t: 'quote', text: 'Melting point is the energy required to separate a material’s atoms, changing its state from solid to liquid.', ref: 'L2 · S15', ar: 'نقطة الانصهار: الطاقة اللازمة عشان تفصل ذرات الخامة عن بعض، فتتحول من صلب لسايل.' },
        { t: 'check', q: 'pr36' },
        { t: 'trap', text: '«inversely» = عكسي. الامتحان ممكن يقول <en>directly proportional</en> أو <en>more expansion</en>. لأ: أعلى انصهار = أقل تمدد. وما تنساش الاستثناء: <en>Steel is a significant exception</en>.', wrong: '<en>Higher-melt temperature materials have more expansion</en>', right: '<en>Higher-melt temperature materials have less expansion (steel is a significant exception)</en>' },
        { t: 'check', q: 'pr34' },
        { t: 'tip', text: 'نقطة الانصهار في السلايد متعرّفة كـ **طاقة** بتفصل الذرات. في الامتحان اكتبها زي السلايد بالظبط.' }
      ]
    },
    {
      id: 'pr-magnet', title: 'المغناطيسية: الذرات بتصطف', en: 'Ferromagnetism', ref: 'L2 · S15', scene: 'magnet',
      blocks: [
        { t: 'say', who: 'usta', text: 'قرّب مغناطيس من مسمار حديد، هيشدّه. السر جوه الحديد: ذرات بتصطف في مجموعات اسمها <en>domains</en>.' },
        { t: 'quote', text: 'Magnetic/nonmagnetic/ferromagnetism is the alignment of iron, nickel, and cobalt atoms into domains.', ref: 'L2 · S15', ar: 'المغناطيسية: اصطفاف ذرات الحديد والنيكل والكوبالت في مناطق اسمها domains.' },
        { t: 'art', html: domainsArt(), caption: 'جوه المعدن مناطق صغيرة (domains). الأول كل واحدة متجهة ناحية. ولما يتمغنط، كلهم بيصطفوا ناحية واحدة.' },
        { t: 'p', text: '٣ عناصر بس في السلايد: **الحديد** <en>iron</en>، و**النيكل** <en>nickel</en>، و**الكوبالت** <en>cobalt</en>. و<en>domains</en> = مناطق صغيرة جوه المعدن، كل منطقة ذراتها متجهة نفس الاتجاه.' },
        { t: 'check', q: 'pr37' },
        { t: 'trap', text: 'السلايد ما قالش نحاس ولا ألومنيوم. الليستة: حديد، ونيكل، وكوبالت. بس.', wrong: '<en>Ferromagnetism is the alignment of iron, copper and aluminium atoms</en>', right: '<en>Ferromagnetism is the alignment of iron, nickel, and cobalt atoms into domains</en>' },
        { t: 'tip', text: 'احفظها كلمة واحدة: **حَنَك**. **ح**ديد، **ن**يكل، **ك**وبالت.' }
      ]
    },
    {
      id: 'pr-corrosion', title: 'مقاومة التآكل: السطح بيدافع', en: 'Corrosion resistance', ref: 'L2 · S15', scene: 'corrosion',
      blocks: [
        { t: 'say', who: 'usta', text: 'سور حديد في شارع جنب البحر. بعد سنة، صدا في كل حتة. الأكسجين والملح هاجموا السطح. اللي بيقاوم ده اسمه مقاومة التآكل.' },
        { t: 'quote', text: 'Corrosion resistance is the ability to resist surface deterioration caused primarily by oxygen, chemicals, or other agents. (Degradation in plastics can also be caused by ultraviolet light, moisture, and other environmental factors.)', ref: 'L2 · S15', ar: 'مقاومة التآكل: قدرة الخامة تقاوم تلف السطح اللي سببه الأساسي الأكسجين أو الكيماويات أو عوامل تانية. (وفي البلاستيك، التدهور ممكن يحصل كمان من الأشعة فوق البنفسجية والرطوبة وعوامل بيئية تانية.)' },
        { t: 'compare', left: { title: 'المعادن', en: 'oxygen · chemicals', art: rustArt(), text: 'السبب الأساسي: **الأكسجين** و**الكيماويات** وعوامل تانية.' }, right: { title: 'البلاستيك', en: 'ultraviolet light · moisture', art: uvArt(), text: 'كمان: **الأشعة فوق البنفسجية** و**الرطوبة** وعوامل البيئة.' }, note: 'الجملة اللي بين القوسين في السلايد بتاعة البلاستيك.' },
        { t: 'check', q: 'pr39' },
        { t: 'example', title: 'كرسي البلاستيك في البلكونة', text: 'كرسي بلاستيك قاعد في الشمس سنين: لونه بيبهت، وبيقصف مع الوقت. ده تدهور <en>degradation</en> من الأشعة فوق البنفسجية <en>ultraviolet light</en>.' },
        { t: 'check', q: 'pr40' },
        { t: 'table', head: ['ميكانيكية (S4–S13)', 'فيزيائية (S14–S15)'], rows: [
          ['<en>Strength · tension · compression · shear · torsion</en>', '<en>Opacity/transparency · Color</en>'],
          ['<en>Elasticity · plasticity · yield strength</en>', '<en>Density</en>'],
          ['<en>Hardness · ductility · brittleness · bending</en>', '<en>Electrical · thermal conductivity</en>'],
          ['<en>Toughness · malleability · castability</en>', '<en>Thermal expansion · ferromagnetism</en>'],
          ['<en>Resilience · machinability · weldability</en>', '<en>Melting point · corrosion resistance</en>']
        ] },
        { t: 'tip', text: 'ده آخر خاصية في المحاضرة. الجدول ده هو الخريطة كلها: ميكانيكي على اليمين، وفيزيائي على الشمال. جرّب لعبة «ميكانيكي ولا فيزيائي؟».' }
      ]
    }
  ]
};
