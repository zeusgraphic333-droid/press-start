// Lesson — strength (Arabic edition). Lecture 2 · slides 4–10: stress, the four loads, elasticity, plasticity, the
// stress–strain curve, yield strength, percent elongation and strain. Drawings and demos: _strength-kit.js.
import { stressArt, fourLoadsArt, LOAD_ICON, lampArt, stoolArt, rivetArt, crankArt, bandArt, behaviorFig, curveArt, tsmfArt, yieldArt, elongationArt, loadPicker, curveRider, stretchMeter } from './_strength-kit.js';

/* the demos' words (Arabic) */
const LP = {
  aria: 'مكعب تحت حمل',
  idle: 'اختار حمل من الأربعة.',
  names: { tension: ['شد', 'Tension'], compression: ['ضغط', 'Compression'], shear: ['قص', 'Shear'], torsion: ['لي', 'Torsion'] },
  long: { compression: 'ضغط (كبس)' },
  lines: {
    tension: 'بيطول، وبيرفع من النص. القوتين بيشدوا لبره على نفس الخط.',
    compression: 'بيقصر، وبيتخن، وبينبعج لبره. القوتين بيزقوا لجوه.',
    shear: 'النص اللي فوق بيزحلق على النص اللي تحت. القوتين عكس بعض ومش على نفس الخط.',
    torsion: 'الخطوط المستقيمة بقت حلزونية. عزم بيلفه حوالين محوره الطولي.'
  }
};
const en = s => `<bdi dir="ltr">${s}</bdi>`;
const CR = {
  aria: 'منحنى الإجهاد والانفعال، وعينة بتتشد تحته',
  strain: 'الشد (الانفعال)', release: 'سيبها', reset: 'من الأول',
  regions: {
    start: ['حرّك السلايدر عشان تشد العينة.', 'لسه ما فيش حمل.'],
    elastic: ['سلوك مرن', `${en('Elastic Behavior')} · لو سبتها هنا هترجع`],
    yield: ['حد الخضوع', `${en('yield strength')} · آخر الخط المستقيم`],
    uniform: ['استطالة منتظمة', `${en('uniform elongation')} · ${en('Plastic Behavior')} · العينة كلها بتطول بالتساوي`],
    uts: ['أقصى مقاومة شد', `${en('ultimate tensile strength')} · أعلى نقطة`],
    necking: ['رقبة', `${en('necking')} · حتة واحدة بتخس`],
    fracture: ['كسر!', `${en('fracture')} · العينة اتقطعت`]
  },
  back: {
    elastic: ['رجعت لطولها.', 'كنت تحت حد الخضوع: سلوك مرن.'],
    plastic: ['فضلت أطول.', `عدّيت حد الخضوع: تشوه دائم ${en('(permanent deformation)')}. الخط المتقطع بيوريك رجعت لفين.`],
    broken: ['اتقطعت خلاص.', 'بعد الكسر مفيش رجوع. دوس «من الأول».']
  }
};
const SM = {
  aria: 'عينة بتتمط، وعليها علامتين بينهم 50 mm',
  len: 'الطول بعد الشد',
  goal: 'وصّل لـ:',
  hit: (g, L) => `${g}% بالظبط: الطول ${L} mm.`,
  wrongBase: (L, w) => `لو قسمت على ${L} بالغلط: ${w}% (غلط)`
};

export default {
  zone: 'strength',
  hero: { say: 'أي حتة معدن بتقاوم. اشدها، اكبسها، قصها، الويها: هتقاوم. المنطقة دي بتوريك المقاومة دي شكلها إيه… لحد لحظة الكسر.' },
  chapters: [
    {
      id: 'st-stress', title: 'الإجهاد: المعدن بيرد من جوه', en: 'Strength · stress', ref: 'L2 · S4', scene: 'stress',
      blocks: [
        { t: 'say', who: 'usta', text: 'علّق شنطة تقيلة في خطاف. الشنطة بتشد الخطاف لتحت. والخطاف من جوه بيشد نفسه عشان ما يتفكّش. الشدة اللي جوه دي ليها اسم: <en>stress</en>.' },
        { t: 'p', text: 'سلايد 4 بيبدأ كده: **خواص المعادن**، وأولها **الخواص الميكانيكية** <en>Mechanical Properties</en>. وأول خاصية في الليستة: الإجهاد.' },
        { t: 'quote', text: 'Strength: The Internal Resistance offered by a part to an externally applied Force is called as Stress. It is the ability of a Material to resist the externally applied Forces with Breakdown or Yielding.', ref: 'L2 · S4', ar: 'الإجهاد: المقاومة الداخلية اللي القطعة بتطلعها قدام قوة جاية من بره. يعني قدرة الخامة إنها تقاوم القوى اللي جاية عليها.' },
        { t: 'art', html: stressArt(), caption: 'القوة جاية **من بره** (برتقالي). المعدن بيرد **من جوه** (بلون المنطقة). الرد ده هو الـ <en>stress</en>.' },
        { t: 'p', text: 'كلمتين عليهم الدرجة: <en>externally applied Force</en> = القوة اللي جاية من بره. <en>Internal Resistance</en> = المقاومة اللي طالعة من جوه. القوة سبب. والإجهاد رد.' },
        { t: 'check', q: 'st01' },
        { t: 'trap', text: 'الامتحان بيحب يقلب الكلمتين. القوة **من بره**. المقاومة **من جوه**. والإجهاد هو المقاومة، مش القوة.', wrong: '<en>Stress = the external force applied to a part</en>', right: '<en>Stress = the internal resistance offered by a part to an externally applied force</en>' },
        { t: 'check', q: 'st02' },
        { t: 'p', text: '**ملحوظة على السلايد:** مكتوب <en>with Breakdown or Yielding</en>. المقصود <en>without</en>: الخامة بتقاوم **من غير** ما تنهار أو تخضع. ولو هتكتب التعريف في الامتحان، الجملة الأولى هي الأمان: <en>The Internal Resistance offered by a part to an externally applied Force is called as Stress.</en>' },
        { t: 'tip', text: 'القوة = من بره. الإجهاد = من جوه. وفيه ٤ طرق تحمّل بيها قطعة: شد، ضغط، قص، لي. ده الفصل الجاي.' }
      ]
    },
    {
      id: 'st-loads', title: 'أربع طرق تحمّل بيها قطعة', en: 'Tension · compression · shear · torsion', ref: 'L2 · S4', scene: 'fourLoads',
      blocks: [
        { t: 'say', who: 'usta', text: 'السلايد رسم ٤ مكعبات. نفس المكعب، بس كل مرة بيتحمّل بطريقة. والطريقة هي اللي بتقرر هيتشوه إزاي.' },
        { t: 'art', html: fourLoadsArt(), caption: 'رسمة السلايد 4 بخطوط الورشة. الأسهم البرتقالي هي القوة. والشبكة اللي جوه بتوريك التشوه.' },
        { t: 'quote', text: 'Tension · Compression · Shear · Torsion', ref: 'L2 · S4 · figure', ar: 'شد · ضغط · قص · لي.' },
        { t: 'demo', id: 'st-loads-demo', title: 'اختار الحمل وشوف المكعب', caption: 'دوس على كل حمل (أو 1 لـ 4 من الكيبورد). بص على الشبكة اللي جوه المكعب: هي اللي بتقولك التشوه شكله إيه.', mount: loadPicker(LP) },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'شد', en: 'Tension', text: 'قوتين بيشدوا لبره على نفس الخط. القطعة **بتطول** و**بترفع**.', art: LOAD_ICON.tension },
          { title: 'ضغط (كبس)', en: 'Compression', text: 'قوتين بيزقوا لجوه. القطعة **بتقصر** و**بتتخن**.', art: LOAD_ICON.compression },
          { title: 'قص', en: 'Shear', text: 'قوتين عكس بعض **مش على نفس الخط**. نص بيزحلق على نص.', art: LOAD_ICON.shear },
          { title: 'لي', en: 'Torsion', text: '**عزم** بيلف القطعة حوالين محورها الطولي.', art: LOAD_ICON.torsion }
        ] },
        { t: 'check', q: 'st04' },
        { t: 'tip', text: 'شد = يطوّل. ضغط = يقصّر ويتخن. قص = يزحلق. لي = يتلوي.' }
      ]
    },
    {
      id: 'st-tension', title: 'الشد: أقصى حمل قبل الكسر', en: 'Tensile / tension strength', ref: 'L2 · S5', scene: 'tension',
      blocks: [
        { t: 'say', who: 'usta', text: 'حبل الغسيل، وسلك النجفة، وسلسلة الونش. التلاتة شغالين في حاجة واحدة: الشد.' },
        { t: 'quote', text: 'Tensile/Tension strength is the maximum tensile (pulling apart) load that a material can resist before fracture.', ref: 'L2 · S5', ar: 'إجهاد الشد: أقصى حمل شد (بيحاول يفصل القطعة نصين) الخامة تقدر تستحمله قبل ما تتكسر.' },
        { t: 'example', title: 'سلك النجفة', text: 'النجفة متعلقة في السقف. وزنها بيشد السلك لتحت، والسقف ماسكه من فوق. السلك في النص بيتشد. لو الوزن عدّى أقصى حمل شد السلك يستحمله، السلك يتقطع.', art: lampArt() },
        { t: 'p', text: '٣ كلمات في التعريف عليهم الدرجة: **maximum** = أقصى حمل. **pulling apart** = بيشد القطعة لبره عشان يفصلها. **before fracture** = قبل الكسر.' },
        { t: 'check', q: 'st06' },
        { t: 'check', q: 'st07' },
        { t: 'tip', text: 'Tensile = <en>pulling apart</en> = أقصى حمل **قبل الكسر**.' }
      ]
    },
    {
      id: 'st-compression', title: 'الضغط (الكبس): بيتشوّه قد إيه؟', en: 'Compression', ref: 'L2 · S5', scene: 'compression',
      blocks: [
        { t: 'say', who: 'usta', text: 'رجل الترابيزة شايلة الترابيزة وكل اللي عليها. الحمل بيزق لتحت، والأرض بتزق لفوق. والرجل في النص: مكبوسة.' },
        { t: 'quote', text: 'Compression is a measure of the extent to which a material deforms under a compressive load prior to fracture.', ref: 'L2 · S5', ar: 'إجهاد الضغط (الكبس): مقياس لقد إيه الخامة بتتشوه تحت حمل ضاغط، قبل ما تتكسر.' },
        { t: 'example', title: 'كرسي تحت صندوق تقيل', text: 'الصندوق بيزق القاعدة لتحت. والأرض بتزق الرجلين لفوق. الرجلين بيتكبسوا: بيقصروا شوية وبيتخنوا شوية. ده ضغط.', art: stoolArt() },
        { t: 'compare', left: { title: 'الشد', en: 'Tensile strength', text: '<en>the maximum tensile … load … before fracture</en>. تعريفه **حمل**: أقصى حمل.' }, right: { title: 'الضغط', en: 'Compression', text: '<en>a measure of the extent to which a material deforms</en>. تعريفه **تشوّه**: بيتشوه قد إيه.' }, note: 'الشد والقص تعريفهم **أقصى حمل**. الضغط لوحده تعريفه **مقياس للتشوه**.' },
        { t: 'check', q: 'st08' },
        { t: 'trap', text: 'السؤال ممكن ياخد تعريف الشد، ويبدّل <en>tensile</en> بـ <en>compressive</en>، ويقولك ده إيه. افتكر: الضغط في السلايد مش «أقصى حمل». الضغط = **قد إيه بيتشوه**.', wrong: '<en>Compression is the maximum compressive load a material can resist before fracture</en>', right: '<en>Compression is a measure of the extent to which a material deforms under a compressive load prior to fracture</en>' },
        { t: 'check', q: 'st09' }
      ]
    },
    {
      id: 'st-shear', title: 'القص: من غير ما ينفصل', en: 'Shear strength', ref: 'L2 · S5', scene: 'shearStress',
      blocks: [
        { t: 'say', who: 'usta', text: 'المقص ليه سلاحين. واحد نازل وواحد طالع، ومش على نفس الخط. الورقة اللي في النص بتتقص. ده <en>shear</en>.' },
        { t: 'quote', text: 'Shear strength is the maximum load a material can resist without separation when subjected to a shearing action.', ref: 'L2 · S5', ar: 'إجهاد القص: أقصى حمل الخامة تستحمله **من غير ما تنفصل**، لما تتعرض لفعل قص.' },
        { t: 'example', title: 'مسمار برشام بين لوحين', text: 'لوحين صاج فوق بعض، ومسمار برشام ماسكهم. اللوح اللي فوق بيتشد شمال، واللي تحت بيتشد يمين. نص المسمار بيحاول يزحلق على النص التاني. لو الحمل عدّى الـ <en>shear strength</en>، المسمار ينفصل نصين.', art: rivetArt() },
        { t: 'why', text: 'في الشد، القوتين على **نفس الخط**. في القص، القوتين **مزاحين** عن بعض. فبدل ما يطوّلوا القطعة، بيحاولوا يزحلقوا طبقة منها على طبقة.' },
        { t: 'check', q: 'st11' },
        { t: 'check', q: 'st12' },
        { t: 'tip', text: 'Shear = <en>without separation</en>. Tension = <en>before fracture</en>. ونفس فكرة القص هتقابلها في قطع الصاج (المحاضرة 5).' }
      ]
    },
    {
      id: 'st-torsion', title: 'اللي: لفّة حوالين المحور', en: 'Torsion', ref: 'L2 · S5', scene: 'torsion',
      blocks: [
        { t: 'say', who: 'usta', text: 'اعصر فوطة مبلولة. إيد بتلف ناحية، والتانية بتلف الناحية التانية. الفوطة بتتلوي حوالين طولها. ده <en>torsion</en>.' },
        { t: 'quote', text: 'Torsion is the application of torque to a member to cause it to twist about its longitudinal axis. A crankshaft must be made of metal with superior torsional strength or it will fail under the stress it is subjected to in an engine.', ref: 'L2 · S5', ar: 'إجهاد اللي: عزم (torque) بيتطبق على قطعة فيلفّها حوالين محورها الطولي. وعمود الكرنك لازم يتعمل من معدن مقاومته للي عالية جدًا، وإلا هينهار من الإجهاد اللي جوه الموتور.' },
        { t: 'art', html: crankArt(), caption: 'عمود الكرنك <en>crankshaft</en>: عزم من الناحيتين، والعمود بيتلوي حوالين محوره الطولي (الخط المتقطع).' },
        { t: 'p', text: 'كلمتين جداد: <en>torque</en> = عزم، يعني قوة بتلف. <en>longitudinal axis</en> = المحور الطولي، الخط اللي ماشي في نص القطعة بطولها.' },
        { t: 'check', q: 'st13' },
        { t: 'trap', text: 'الـ <en>Torsion</en> مش شد ولا زق. ده **عزم بيلف**. لو السؤال فيه <en>twist</en> أو <en>torque</en> أو <en>crankshaft</en>، الإجابة <en>Torsion</en>.', wrong: '<en>A crankshaft needs superior shear strength</en>', right: '<en>A crankshaft must be made of metal with superior torsional strength</en>' },
        { t: 'check', q: 'st14' },
        { t: 'tip', text: 'هتقابل عمود الكرنك تاني في منطقة الحديد الزهر: الحديد الزهر المرن <en>ductile iron</en> بيتعمل منه.' }
      ]
    },
    {
      id: 'st-elastic', title: 'المرونة: يرجع زي ما كان', en: 'Elasticity', ref: 'L2 · S6', scene: 'elastic',
      blocks: [
        { t: 'say', who: 'usta', text: 'شد أستك بين صوابعك. سيبه. رجع لطوله بالظبط. خلاص، كده انت فهمت المرونة.' },
        { t: 'quote', text: 'Elasticity: describes the recovery of a material back to its original shape and size after being deformed, when a stress is removed.', ref: 'L2 · S6', ar: 'المرونة: رجوع الخامة لشكلها وحجمها الأصلي بعد ما اتشوهت، لما الإجهاد يتشال.' },
        { t: 'art', html: bandArt(), caption: 'قبل، وانت شادد، وبعد ما سبت. الخطين المتقطعين بيقولوا: نفس الطول بالظبط.' },
        { t: 'p', text: '٣ مفاتيح في التعريف: **recovery** = بيرجع. **original shape and size** = الشكل **والحجم** الأصلي، الاتنين. **when a stress is removed** = الرجوع بيحصل لما الإجهاد يتشال.' },
        { t: 'example', title: 'سوستة القلم الجاف', text: 'دوس على زرار القلم: السوستة بتتكبس. شيل صباعك: بترجع. لو رجعت لطولها بالظبط، ده سلوك مرن. والسوستة متصممة إنها تفضل طول عمرها في المنطقة دي.' },
        { t: 'check', q: 'st16' },
        { t: 'check', q: 'st17' },
        { t: 'tip', text: 'Elastic = رايح جاي. بيتشوه وهو شايل، ويرجع لما يتساب.' }
      ]
    },
    {
      id: 'st-plastic', title: 'اللدونة: يفضل على شكله الجديد', en: 'Plasticity · plastic behavior', ref: 'L2 · S7', scene: 'plastic',
      blocks: [
        { t: 'say', who: 'usta', text: 'افتح مشبك ورق بصوابعك. سيبه. مش هيرجع. المشبك ده عمل سلوك لدن.' },
        { t: 'quote', text: 'The ability of a material to deform under load and retain its new shape when the load is removed is called plasticity.', ref: 'L2 · S7', ar: 'اللدونة: قدرة الخامة إنها تتشوه تحت الحمل، وتحتفظ بشكلها الجديد لما الحمل يتشال.' },
        { t: 'compare', left: { title: 'سلوك لدن', en: 'figure 3-4 · plastic behavior', art: behaviorFig('plastic'), text: 'العينة بتتمط وبتخس من النص. ولما تتكسر، كل حتة **محتفظة بشكلها الممطوط**.' }, right: { title: 'سلوك مرن', en: 'figure 3-3 · elastic behavior', art: behaviorFig('elastic'), text: 'العينة بتتمط برضه. بس لما تتكسر، الحتتين **بيرجعوا مستطيلات** زي الأول.' }, note: 'السر في آخر صف: الحتت المكسورة. هي اللي بتقولك مرن ولا لدن.' },
        { t: 'why', text: 'جوه المعدن، الذرات مترصصة صفوف. في السلوك المرن، الصفوف بتتبعد عن بعض شوية وترجع مكانها. في السلوك اللدن، صفوف كاملة بتزحلق لمكان جديد، ومفيش حاجة ترجّعها.' },
        { t: 'check', q: 'st18' },
        { t: 'trap', text: 'الامتحان بيبدّل الكلمتين. **Elasticity** = يرجع لشكله الأصلي. **Plasticity** = يحتفظ بشكله الجديد <en>retain its new shape</en>. وخلي بالك: السلايد حاطط figure 3-4 (اللدن) **قبل** figure 3-3 (المرن). متعتمدش على الترتيب. اعتمد على الحتت المكسورة.', wrong: '<en>Plasticity = the recovery of a material back to its original shape</en>', right: '<en>Plasticity = deform under load and retain its new shape when the load is removed</en>' },
        { t: 'check', q: 'st19' },
        { t: 'tip', text: 'Elastic يرجع. Plastic يفضل. زي الصلصال: تشكّله، يفضل على شكله.' }
      ]
    },
    {
      id: 'st-curve', title: 'منحنى الإجهاد والانفعال', en: 'The stress–strain curve', ref: 'L2 · S8', scene: 'curve',
      blocks: [
        { t: 'say', who: 'usta', text: 'حط عينة معدن في ماكينة شد. شد بالراحة لحد ما تتقطع. وارسم: الإجهاد لفوق، والانفعال على الجنب. هيطلعلك المنحنى ده. ده أهم رسمة في المحاضرة.' },
        { t: 'art', html: curveArt(), caption: 'رسمة السلايد 8 بكل أساميها. الأسامي دي هي اللي بتتسأل.' },
        { t: 'quote', text: 'The yield stress is a measure of resistance to plastic deformation', ref: 'L2 · S8', ar: 'إجهاد الخضوع: مقياس لمقاومة التشوه اللدن (التشوه الدائم).' },
        { t: 'list', style: 'num', items: [
          '**سلوك مرن** <en>Elastic Behavior</en>: الخط المستقيم في الأول. لو سبت العينة هنا، ترجع.',
          '**حد الخضوع** <en>yield strength</en>: آخر الخط المستقيم. من هنا يبدأ **السلوك اللدن** <en>Plastic Behavior</en>.',
          '**استطالة منتظمة** <en>uniform elongation</en>: العينة كلها بتطول بالتساوي، والمنحنى لسه طالع.',
          '**أقصى مقاومة شد** <en>ultimate tensile strength</en>: أعلى نقطة. أكبر إجهاد العينة تستحمله.',
          '**الرقبة** <en>necking</en>: حتة واحدة بتخس، والمنحنى نازل.',
          '**الكسر** <en>fracture</en>: آخر المنحنى. العينة اتقطعت.'
        ] },
        { t: 'demo', id: 'st-curve-demo', title: 'اركب المنحنى', caption: 'حرّك السلايدر عشان تشد العينة، وبعدين دوس «سيبها». تحت حد الخضوع بترجع لصفر. بعده بتفضل أطول، والخط المتقطع بيوريك رجعت لفين.', mount: curveRider(CR) },
        { t: 'check', q: 'st22' },
        { t: 'check', q: 'st21' },
        { t: 'trap', text: 'أعلى نقطة على المنحنى **مش** الكسر. أعلى نقطة = <en>ultimate tensile strength</en>. الكسر في **آخر** المنحنى، وهو نازل. وكمان: <en>stress</en> لفوق، و<en>strain</en> على الجنب.', wrong: '<en>Fracture is the highest point on the curve</en>', right: '<en>The highest point is the ultimate tensile strength; fracture is at the end of the curve</en>' },
        { t: 'check', q: 'st23' },
        { t: 'tip', text: 'اقرا المنحنى زي جملة: مستقيم (مرن) ← يلين (خضوع) ← يطلع لأعلى نقطة ← ينزل (رقبة) ← يقطع (كسر).' }
      ]
    },
    {
      id: 'st-necking', title: 'الرقبة: TS وM وF', en: 'TS · M · necking · F', ref: 'L2 · S9', scene: 'necking',
      blocks: [
        { t: 'say', who: 'usta', text: 'السلايد اللي بعده نفس الحكاية بحروف: <en>TS</en> و<en>M</en> و<en>F</en>. وجنبهم عينة بتتمط لحد ما تتقطع.' },
        { t: 'art', html: tsmfArt(), caption: 'العينة في ٤ لحظات: في الأول، وهي بتطول بالتساوي، وهي بتعمل رقبة بعد M، ولما اتقطعت عند F.' },
        { t: 'quote', text: 'TS · M · “Necking” · F', ref: 'L2 · S9 · figure', ar: 'TS = مقاومة الشد، أعلى إجهاد، عند النقطة M. بعد M تبدأ الرقبة. والكسر عند F.' },
        { t: 'table', head: ['الحرف', 'يعني', 'فين على المنحنى'], rows: [
          ['<en>TS</en>', 'مقاومة الشد <en>tensile strength</en>', 'الخط المتقطع عند أعلى إجهاد'],
          ['<en>M</en>', 'أعلى نقطة', 'قمة المنحنى'],
          ['<en>Necking</en>', 'الرقبة', 'بعد M، والمنحنى نازل'],
          ['<en>F</en>', 'الكسر <en>fracture</en>', 'آخر نقطة']
        ] },
        { t: 'why', text: 'قبل M، العينة كلها بتطول بالتساوي. بعد M، حتة واحدة بتبدأ تخس أسرع من الباقي. المساحة هناك بتقل، فبتضعف أكتر، فبتخس أكتر… لحد ما تتقطع عند F. عشان كده المنحنى بينزل بعد M.' },
        { t: 'check', q: 'st26' },
        { t: 'check', q: 'st27' },
        { t: 'tip', text: '<en>M</en> = Maximum. <en>F</en> = Fracture. والرقبة بين الاتنين.' }
      ]
    },
    {
      id: 'st-yield', title: 'حد الخضوع: مفيش بعده رجوع', en: 'Yield strength', ref: 'L2 · S10', scene: 'yield',
      blocks: [
        { t: 'say', who: 'usta', text: 'فيه خط على المنحنى، لو عدّيته مفيش رجوع. اسمه <en>yield strength</en>. وأي مصمم شاطر بيحسب حسابه.' },
        { t: 'quote', text: 'Yield strength is the workable engineering strength of a metal to stay within its elastic limit. Exceeding a metal\'s yield strength puts the metal into permanent deformation.', ref: 'L2 · S10', ar: 'حد الخضوع: المقاومة اللي المهندس يقدر يشتغل عليها والمعدن لسه جوه حد المرونة. ولو عدّيته، المعدن يدخل في تشوه دائم.' },
        { t: 'compare', left: { title: 'تحت حد الخضوع', en: 'within the elastic limit', art: yieldArt(false), text: 'المسطرة اتثنت وهي شايلة. شيل الحمل: رجعت مستقيمة.' }, right: { title: 'بعد حد الخضوع', en: 'permanent deformation', art: yieldArt(true), text: 'المسطرة اتثنت أكتر من اللازم. شيل الحمل: فضلت معووجة.' }, note: 'نفس المسطرة. الفرق كله: عدّت حد الخضوع ولا لأ.' },
        { t: 'p', text: '<en>workable engineering strength</en> يعني: ده الحد اللي المهندس **بيشتغل تحته**. القطعة لازم تفضل تحته، عشان ترجع لشكلها كل مرة.' },
        { t: 'check', q: 'st29' },
        { t: 'check', q: 'st30' },
        { t: 'trap', text: 'اتنين بيتلخبطوا: <en>yield strength</en> = **آخر الخط المستقيم** (بعده تشوه دائم). <en>ultimate tensile strength</en> = **أعلى نقطة** على المنحنى. حد الخضوع بييجي الأول.', wrong: '<en>Yield strength is the highest point on the stress–strain curve</en>', right: '<en>Yield strength is where the elastic limit ends; the highest point is the ultimate tensile strength</en>' },
        { t: 'tip', text: 'سلايد 8 قال <en>yield stress</en>: مقياس لمقاومة التشوه اللدن. سلايد 10 قال <en>yield strength</en>: الحد اللي يخلي المعدن جوه المرونة. الاتنين بيتكلموا عن نفس الحد.' }
      ]
    },
    {
      id: 'st-strain', title: 'الانفعال ونسبة الاستطالة', en: 'Percent elongation · strain', ref: 'L2 · S10', scene: 'elongation',
      blocks: [
        { t: 'say', who: 'usta', text: 'الإجهاد هو مقاومة المعدن. الانفعال هو اللي حصله فعلًا: اتغير قد إيه؟ طال؟ قصر؟' },
        { t: 'quote', text: 'Percent elongation is the increase in length over the original length.', ref: 'L2 · S10', ar: 'نسبة الاستطالة: الزيادة في الطول، على الطول الأصلي.' },
        { t: 'art', html: elongationArt(), caption: 'العينة كانت 50 mm بين العلامتين. بعد الشد بقت 60 mm. الزيادة 10 mm.' },
        { t: 'p', text: 'الحساب طالع من التعريف على طول: **الزيادة ÷ الطول الأصلي × 100**. يعني **<en>(60 − 50) ÷ 50 × 100 = 20%</en>**.' },
        { t: 'demo', id: 'st-stretch-demo', title: 'مط العينة واحسب', caption: 'حرّك السلايدر، وجرّب توصل لـ 10% و20% و50%. ولاحظ السطر الأخير: ده اللي بيطلع لو قسمت على الطول الجديد بالغلط.', mount: stretchMeter(SM) },
        { t: 'check', q: 'st33' },
        { t: 'trap', text: 'القسمة على **الطول الأصلي** <en>original length</en>، مش الطول الجديد. <en>10 ÷ 60 = 16.7%</en> إجابة غلط، وبتبقى موجودة في الاختيارات مخصوص.', wrong: '<en>10 ÷ 60 × 100 = 16.7%</en>', right: '<en>10 ÷ 50 × 100 = 20% (over the original length)</en>' },
        { t: 'check', q: 'st32' },
        { t: 'quote', text: 'Strain is the change a material go through during elongation or shrinkage. It is given as a measure of deformation under load.', ref: 'L2 · S10', ar: 'الانفعال: التغيير اللي الخامة بتمر بيه وهي بتطول أو بتنكمش. وبيتقاس كمقياس للتشوه تحت الحمل.' },
        { t: 'compare', left: { title: 'الإجهاد', en: 'Stress', text: 'المقاومة الداخلية قدام قوة من بره. **سبب**. على المنحنى: لفوق.' }, right: { title: 'الانفعال', en: 'Strain', text: 'التغيير اللي حصل في الخامة: تطويل أو انكماش. **نتيجة**. على المنحنى: على الجنب.' } },
        { t: 'check', q: 'st35' },
        { t: 'tip', text: 'Stress = مقاومة. Strain = تغيير. ونسبة الاستطالة = الزيادة ÷ الأصلي × 100.' }
      ]
    }
  ]
};
