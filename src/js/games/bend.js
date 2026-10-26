// Trials — bend (Arabic edition). Engines: games/_bend-kit.js · contract: docs/BRIEF.md § Trials.
//   bend-springback — اغلب الارتداد: اختار زاوية العدة عشان القطعة ترتد على الزاوية المطلوبة
//   bend-flat       — الطول المفرود: اقرا الرسمة، اختار المعادلة، واحسب (Lt بالـ BA أو الـ BD، و K = t/T)
//   bend-spot       — سؤال سريع: فويل/صاج/بليت، V ولا Edge، عمليات الثني، الشجرة، الدرفلة، المواسير
import { springTrial, flatTrial, spotTrial, ART } from './_bend-kit.js';

const E = s => `<bdi dir="ltr">${s}</bdi>`;
const COMMON = { start: 'يلا', orPress: 'أو اضغط', result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات', finish: 'النتيجة' };

const spring = springTrial({
  ...COMMON,
  title: 'اغلب الارتداد', en: 'Beat the springback',
  how: 'الصاج بيفتح شوية بعد ما البنش يطلع. اختار زاوية العدة صح، عشان القطعة ترتد وتقف على الزاوية المطلوبة بالظبط. ٦ قطع.',
  intro: {
    title: 'اثنيها أكتر… عشان تيجي مظبوطة',
    text: `العميل عايز زاوية معينة. بس الصاج ليه رأي: أول ما البنش يطلع، الزاوية المحصورة بتكبر شوية (${E('springback')}). شغلتك تختار زاوية عدة (${E('αb′')}) أصغر شوية، فالقطعة تفتح وتقف على الهدف.`,
    rules: ['الخط الأخضر المتقطّع = الزاوية المطلوبة.', `غيّر زاوية العدة بالأزرار، أو السلايدر، أو الأسهم (${E('Shift')} = ٥ درجات). ${E('Enter')} = اثني.`, 'أول ٣ قطع معاك نتيجة تجربة. آخر ٣: أول ثنية تجربة مجانية، والتانية هي اللي بتتحسب.', 'في حدود ¾ درجة = ٣ نقط. لحد ٢° = نقطتين. لحد ٤° = نقطة.']
  },
  round: 'قطعة', score: 'نقط', target: 'الزاوية المطلوبة', tool: `زاوية العدة ${E('αb′')}`, bend: 'اثني', bendAgain: 'اثني بجد', next: 'القطعة اللي بعدها',
  test: (t, p) => `<b>نتيجة تجربة:</b> عدة ${E(t + '°')} طلّعت قطعة ${E(p + '°')}. يعني الصاج ده بيفتح ${E((p - t) + '°')} عند الزاوية دي.`,
  trial: '<b>مفيش تجربة المرة دي.</b> أول ثنية مجانية: اثني، شوف فتحت قد إيه، وصلّح.',
  shot1: (part, opened) => `<b>تجربة:</b> القطعة طلعت ${E(part + '°')}، يعني فتحت ${E(opened + '°')}. قفّل العدة بنفس القدر تقريبًا، واثني تاني.`,
  scored: (part, err, p) => `<b class="${p >= 2 ? 'bnd-ok' : 'bnd-no'}">${['فاتتك.', 'قريبة.', 'حلوة.', 'بالظبط!'][p]}</b> القطعة ${E(part + '°')}، بعيدة ${E(err + '°')} عن الهدف: ${E('+' + p)}.`,
  best: tool => `أحسن زاوية عدة كانت ${E(tool + '°')}.`,
  lines: [['أسطى ثني.', 'الصاج بقى بيقف في المكان اللي انت عايزه.'], ['إيد كويسة.', 'شوية ضبط وتبقى كاملة. افتكر: الثنية الصغيرة بترجع أقل.'], ['الصاج كسب الجولة دي.', 'ارجع لفصل «الصاج بيرجع شوية»، وبعدين اثني أكتر من الهدف بقد ما بيفتح.']]
});

const flat = flatTrial({
  ...COMMON,
  title: 'الطول المفرود', en: 'Flat length',
  how: `اقرا الرسمة: A وB بيتقاسوا لحد فين؟ اختار المعادلة، وبعدين احسب. وفيها كمان ${E('K = t / T')}. ٨ جولات من غير تايمر.`,
  intro: {
    title: 'قص الصاج صح من أول مرة',
    text: `كل جولة فيها رسمة قطعة. الأول قول المعادلة من الرسمة، وبعدين احسب الرقم. وشوية جولات فيها ${E('K = t / T')}.`,
    rules: [`A وB لحد أول الثنية = ${E('Lt = A + B + BA')}.`, `A وB لحد الركن الخارجي = ${E('Lt = A + B − BD')}.`, `اختار بالماوس أو بالأرقام ١–٤. ${E('Enter')} = اللي بعده.`]
  },
  round: 'جولة', score: 'نقط', next: 'اللي بعده',
  pickFormula: 'من الرسمة: أنهي معادلة؟',
  why: { ba: `A وB واقفين عند أول الثنية، فالثنية نفسها ناقصة: ${E('+ BA')}.`, bd: `A وB لحد الركن الخارجي، فالحتة دي اتحسبت زيادة: ${E('− BD')}.` },
  askLt: `الطول المفرود ${E('Lt')} = ؟`, askBA: `الـ ${E('BA')} = ؟`, askBD: `الـ ${E('BD')} = ؟`, askK: `الـ ${E('K-factor')} = ؟`, askT: `الـ ${E('t')} = ؟`,
  right: 'صح.', wrong: 'لأ.',
  lines: [['المقص في إيدك.', 'المعادلتين والـ K-factor بقوا سهلين عليك.'], ['قربت.', 'ركّز في الرسمة: A وB واقفين فين؟'], ['لسه.', 'ارجع لفصل «الطول المفرود»، وجرّب الديمو، وتعالى تاني.']]
});

/* ---------- the quick-fire pool (12 drawn each play) ---------- */
const GAUGE = (x, k) => ({ prompt: `تخانة ${E(x)}: فويل ولا صاج ولا بليت؟`, layout: 'row', fix: true, choices: [{ html: 'Foil', ok: k === 0 }, { html: 'Sheet metal', ok: k === 1 }, { html: 'Plate', ok: k === 2 }], explain: `الحدود: ${E('0.15 mm')} و${E('6.35 mm')}.` });
const VE = (p, v) => ({ prompt: p, layout: 'yn', choices: [{ html: 'V-bending', ok: v }, { html: 'Edge bending', ok: !v }], explain: v ? `V = إنتاج قليل، ${E('press brake')}، داي بسيط ورخيص.` : `Edge = إنتاج كبير، ${E('pressure pad')}، داي أعقد وأغلى.` });
const OP = (k, name, others, why) => ({ prompt: 'أنهي عملية ثني دي؟', art: () => ART['bd-op-' + k](), choices: [{ html: name, ok: true }, ...others.map(o => ({ html: o }))], explain: why });
const TREE = (x, k) => ({ prompt: `${E(x)}: تحت أنهي فرع؟`, layout: 'row', fix: true, choices: [{ html: 'Simple Bending', ok: k === 0 }, { html: 'Compound Bending', ok: k === 1 }, { html: 'Form and Cut (Stamping)', ok: k === 2 }], explain: 'بسيط: Bend وRoll وContinuous. مركّب: Spinning وHydro وDrawing. Stamping: Progressive وTransfer وMultiple.' });
const spot = spotTrial({
  title: 'العملية الصح', en: 'Right process, right word',
  how: 'سؤال سريع ورا التاني: فويل ولا صاج ولا بليت؟ V ولا Edge؟ أنهي عملية في الرسمة؟ ١٢ سؤال، ١٠ ثواني لكل واحد.',
  intro: { title: 'الأسطى بيسأل بسرعة', text: 'سؤال ورا التاني من المحاضرة كلها. اختار الكلمة الصح قبل ما الوقت يخلص.', rules: ['اضغط على الإجابة، أو رقمها من الكيبورد.', 'الصح ورا بعض بيعمل كومبو.', 'الأسامي بالإنجليزي، زي الامتحان.'] },
  wins: [[1, 'ولا غلطة.', 'الورشة بتاعتك.'], [.8, 'جامد.', 'شوية تركيز وتبقى كاملة.'], [.5, 'مش بطال.', 'راجع الأجزاء اللي وقعت فيها وجرّب تاني.'], [0, 'لسه.', 'الدرس مستنيك، وبعدين التحدي.']],
  rounds: [
    GAUGE('0.08 mm', 0), GAUGE('1.5 mm', 1), GAUGE('5 mm', 1), GAUGE('9 mm', 2), GAUGE('0.5 in', 2), GAUGE('0.12 mm', 0),
    VE(`نموذج أولي: ٢٠ قطعة على ${E('press brake')}.`, true), VE(`خط إنتاج: آلاف القطع في اليوم، ومعاك ${E('pressure pad')}.`, false),
    VE('عايز داي بسيط ورخيص.', true), VE('الداي أعقد وأغلى، بس الكمية كبيرة.', false),
    { prompt: 'البنش وقف هنا. ده اسمه إيه؟', art: () => ART['bd-air-q'](), choices: [{ html: 'Air bending', ok: true }, { html: 'Bottoming' }, { html: 'Edge bending' }], layout: 'row', explain: 'تحت الصاج هوا: البنش ما وصلش للقاع.' },
    OP('hem', 'Hemming', ['Curling', 'Seaming', 'Straight flanging'], 'الحرف اتطبق على نفسه.'),
    OP('curl', 'Curling', ['Hemming', 'Seaming', 'Shrink flanging'], 'الحرف اتلف دايرة.'),
    OP('seam', 'Seaming', ['Hemming', 'Curling', 'Stretch flanging'], 'لوحين اتشبكوا في بعض.'),
    OP('shrink', 'Shrink flanging', ['Stretch flanging', 'Straight flanging', 'Hemming'], 'الشفة على منحنى طالع لبره.'),
    OP('straight', 'Straight flanging', ['Stretch flanging', 'Shrink flanging', 'Seaming'], 'الشفة على خط مستقيم.'),
    TREE('Spinning', 1), TREE('Progressive dies', 2), TREE('Continuous Roll Forming', 0), TREE('Drawing', 1),
    { prompt: 'ورشة نماذج صغيرة عايزة أسطوانة واحدة، بالإيد.', layout: 'yn', choices: [{ html: 'Roll forming sheet', ok: true }, { html: 'Continuous roll forming' }], explain: '٣ رولات بالإيد: رخيصة، لورش النماذج.' },
    { prompt: 'كيلومترات من نفس المجرى، بكميات كبيرة.', layout: 'yn', choices: [{ html: 'Continuous roll forming', ok: true }, { html: 'Roll forming sheet' }], explain: 'مقطع ثابت + طول كبير + كميات = الدرفلة المستمرة.' },
    { prompt: 'ماسورة رفيعة بتتطبق وقت الثني. محتاج:', choices: [{ html: 'A mandrel', ok: true }, { html: 'A pressure pad' }, { html: 'Annealing' }, { html: 'A V-die' }], explain: `الـ ${E('mandrel')} سند من جوه بيمنع الـ ${E('buckling')}.` },
    { prompt: `العدة ${E('90°')}، والقطعة طلعت ${E('93°')}. ده:`, choices: [{ html: 'Springback', ok: true }, { html: 'Air bending' }, { html: 'Bend deduction' }, { html: 'Bottoming' }], explain: 'الزاوية المحصورة كبرت بعد ما العدة اتشالت.' },
    { prompt: `نوع الـ ${E('relief')} اللي في الدايرة:`, art: () => ART['bd-relief-q'](), layout: 'row', choices: [{ html: 'Obround', ok: true }, { html: 'Tear-rip' }, { html: 'Rectangle' }], explain: 'شق طرفه مدوّر.' },
    { prompt: `«${E('machine tool that performs most sheet metal operations')}»`, layout: 'row', choices: [{ html: 'Stamping press', ok: true }, { html: 'Stampings' }, { html: 'Punch-and-die' }], explain: 'المكبس = الماكينة. الـ stampings = المنتجات. البنش والداي = العدة.' }
  ]
});

export default [spring, flat, spot];
