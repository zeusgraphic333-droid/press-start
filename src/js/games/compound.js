// Trials — compound (Arabic edition). Contract: docs/BRIEF.md § Trials. Engines: games/_compound-play.js (shared with compound.en.js).
import { which, label, spin } from './_compound-play.js';

const END = { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات' };
const en = s => `<bdi class="en" dir="ltr">${s}</bdi>`;

const whichGame = which({
  title: 'مين عمله؟', en: 'Which process makes it?',
  how: 'منتج مرسوم أو جملة من السلايدات، وتلات اختيارات: البرم، ولا التشكيل بالسوائل، ولا السحب العميق؟ 12 جولة، والأرقام من 1 لـ 3 بتجاوب.',
  procs: { spin: ['البرم', 'Spinning'], hydro: ['بالسوائل', 'Hydroforming'], draw: ['السحب', 'Deep drawing'] },
  clue: 'العملية دي اسمها إيه؟',
  intro: { title: 'مين عمله؟', text: 'هتشوف منتج مرسوم، أو جملة من السلايدات. قول اتعمل بأنهي عملية من التلاتة.', rules: ['اضغط على العملية، أو استخدم الأرقام من 1 لـ 3.', 'الكوباية جت في البرم وفي السحب: ركّز على باقي الكلام.', 'كل جولة ليها وقت.'] },
  rounds: [
    ['spin', 'venturi', `فنتوري ${en('(Venturi)')}`, 'الـ Venturi من منتجات البرم (L4 · S5).'],
    ['spin', 'hopper', `هوبر ${en('(Hopper)')}`, 'الـ Hopper من منتجات البرم: مخروط كبير.'],
    ['spin', 'tankhead', `راس تنك ${en('(Tank head)')}`, 'الـ Tank head من منتجات البرم.'],
    ['spin', 'trumpet', `قاعدة بوق ${en('(Trumpet base)')}`, 'الـ Trumpet base من منتجات البرم.'],
    ['spin', 'urn', `جرّة ${en('(Funeral urn)')}`, 'الـ Funeral urn من منتجات البرم.'],
    ['spin', 'flashing', `رقبة سقف ${en('(Roof flashing)')}`, 'الـ Roof flashing من منتجات البرم.'],
    ['spin', null, '«قرص مسطّح بيلف على مخرطة، وأداة بتزقه على قالب»', 'ده البرم: blank على lathe، والـ roller tool بيزقه على الـ mandrel.'],
    ['spin', null, `«${en('Hemisphere, cone, cylindrical shell')}»`, 'دي الأشكال الأساسية للبرم.'],
    ['hydro', 'rail', `كمرة شاسيه عربية ${en('(Car frame rail)')}`, 'الـ frame rail هو المنتج النهائي في سلايدات الهيدروفورمنج (L4 · S11).'],
    ['hydro', 'bulge', `ماسورة عليها انتفاخ ${en('(Bulged tube)')}`, 'ماسورة اتنفخت جوه قالب = tube hydroforming.'],
    ['hydro', null, '«ضغط ميّه بيعمل أشكال فيها تجاويف، صعبة على الداي الناشف»', 'ده الهيدروفورمنج: water pressure + concavities.'],
    ['hydro', null, `«${en('F axial')} بتزق الطرفين، والضغط ${en('P')} جوه بينفخ»`, 'ده tube hydroforming (L4 · S9).'],
    ['hydro', null, `«صاج بيتزق جوه ${en('female cavity')} بميّه مضغوطة»`, 'ده sheet hydroforming (L4 · S10).'],
    ['hydro', null, '«مثالي للإنتاج القليل والمتوسط»', 'Low to mid-range production = hydroforming.'],
    ['draw', 'can', `علبة كانز ${en('(Beverage can)')}`, 'Beverage cans من منتجات السحب العميق.'],
    ['draw', 'panel', `باب عربية ${en('(Car body panel)')}`, 'Automobile body panels = deep drawing.'],
    ['draw', 'sink', `حوض مطبخ مزدوج ${en('(Double sink)')}`, 'الحوض المزدوج اتعرض مع السحب العميق (L4 · S17).'],
    ['draw', 'tray', `صينية شكل علبة، البنش بيزق البلانك جوه الداي ${en('(Box-shaped part)')}`, 'Box-shaped = drawing. البرم بيعمل حاجات مدورة بس.'],
    ['draw', null, `«${en('Blank holder')} ماسك البلانك، والبنش بيزقه جوه الداي»`, 'ده السحب: punch + die + blank holder.'],
    ['draw', null, '«اسمه deep عشان نفرّقه عن سحب السلك والقضبان»', 'ده الـ deep drawing.']
  ]
});

const labelGame = label({
  ...END,
  title: 'سمّي الأجزاء', en: 'Label the machines',
  how: 'رسمتين: مخرطة البرم، وداي السحب العميق. اختار اسم، ودوس على مكانه في الرسمة. 13 اسم، والأرقام بتختار المكان.',
  board: 'رسمة', score: 'سكور', pin: 'مكان', labels: 'الأسماء',
  boards: { lathe: ['مخرطة البرم', 'spinning forming process'], die: ['داي السحب العميق', 'drawing and deep drawing'] },
  ask: 'اختار اسم، وبعدين دوس على مكانه في الرسمة.', nowPin: 'تمام. دوس على مكانه في الرسمة.', nowChip: 'تمام. اختار الاسم بتاع المكان ده.',
  names: { head: 'Head stock', spindle: 'Spindle', mandrel: 'Mandrel', sheet: 'Sheet metal', clamp: 'Clamp', tail: 'Tail stock', roller: 'Roller tool', punch: 'Punch', holder: 'Blank holder', blank: 'Blank', die: 'Die', dforce: 'Drawing force', hforce: 'Holding force' },
  hints: { head: 'الراس التقيلة اللي على الشمال.', spindle: 'العمود اللي بيلف.', mandrel: 'القالب اللي الصاج بينام عليه.', sheet: 'القرص اللي بيتشكّل.', clamp: 'بيمسك الصاج في وش القالب.', tail: 'الغراب اللي في الناحية التانية.', roller: 'الأداة اللي بتزق الصاج.', punch: 'بينزل ويزق البلانك.', holder: 'ضاغط على أطراف البلانك.', blank: 'الصاج نفسه.', die: 'الحتة اللي تحت، وفيها الفتحة.', dforce: 'القوة اللي على البنش.', hforce: 'القوة اللي على الماسك.' },
  right: 'صح.', wrong: 'لأ.', notThat: n => `ده مش مكان الـ ${en(n)}. جرّب مكان تاني.`,
  boardDone: 'الرسمة اكتملت. بص عليها كاملة.', next: 'الرسمة اللي بعدها', finish: 'شوف النتيجة',
  lines: [['عينك عين رسّام.', 'كل اسم في مكانه من أول مرة.'], ['قربت.', 'كام اسم اتلخبطوا. بص على الرسمتين كاملين وجرّب تاني.'], ['الأسماء لسه تايهة.', 'ارجع لفصل «مخرطة البرم» وفصل «بنش وداي وماسك».']]
});

const spinGame = spin({
  ...END,
  title: 'لِف كوباية', en: 'Spin it',
  how: 'كل طلب منتج مدور. ركّب القالب اللي بيدّي شكله: نص كورة، أو مخروط، أو اسطوانة. وبعدين اضغط واستمر على الرولة لحد ما القرص ينام على القالب. 6 طلبات.',
  order: 'طلب', score: 'سكور', ordered: 'المطلوب', lathe: 'مخرطة البرم', pick: 'تركّب أنهي قالب؟',
  holdNow: 'اضغط واستمر على الرولة لحد ما الصاج ينام على القالب.', hold: 'اضغط واستمر: الرولة تزق', formed: 'اتشكّل',
  shapes: { hemi: ['نص كورة', 'Hemisphere'], cone: ['مخروط', 'Cone'], cyl: ['اسطوانة', 'Cylindrical shell'] },
  products: { bowl: ['سلطانية', 'Bowl'], domecap: ['غطا مقبب', 'Domed end cap'], cone: ['مخروط', 'Cone'], hopper: ['هوبر', 'Hopper'], ferrule: ['جلبة', 'Ferrule'], housing: ['جراب معدن', 'Metal housing'], lid: ['غطا', 'Lid'] },
  right: 'صح.', wrong: 'لأ.', notShape: (s, p) => `قالب ${s} مش هيطلّع ${p}. جرّب تاني.`,
  why: { hemi: 'نص كورة (hemisphere): شكل أساسي من التلاتة.', cone: 'مخروط (cone): شكل أساسي من التلاتة.', cyl: 'اسطوانة مجوّفة (cylindrical shell): شكل أساسي من التلاتة.' },
  made: p => `${p} خلصت. الطلب اللي بعده.`,
  lines: [['أسطى برم.', 'كل قالب صح من أول مرة.'], ['شغل حلو.', 'افتكر: سلطانية = نص كورة، قمع = مخروط، جلبة = اسطوانة.'], ['القوالب اتلخبطت.', 'ارجع لفصل «أشكال البرم ومنتجاته».']]
});

export default [whichGame, labelGame, spinGame];
