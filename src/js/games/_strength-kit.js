// Strength zone trials (both editions): Name the load (quick-fire), Read the curve (tap the point), Hold & release
// (load a specimen along the curve and let go at the right moment). Words for both languages live here; games/strength.js
// and games/strength.en.js pick theirs with strengthTrials('ar' | 'en').
import { quickfire, sample } from './_cte-kit.js';
import { marks } from '../ui/icons.js';
import { V, svg, lab, arrow, arcArrow, hatchRect, LOAD_ICON, LOADS, LOAD_SCENE, stressAt, slopeE, curvePts, toXY, axes, specimen, poly, f1, reduced } from '../content/lessons/_strength-kit.js';

const shuffle = a => sample(a, a.length);
const steel = (o = .26) => `fill="var(--fig-steel)" fill-opacity="${o}" stroke="${V.ink}" stroke-width="2"`;

/* ---------- the end card every custom trial shares ---------- */
const END = {
  ar: { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات' },
  en: { result: 'Your score', again: 'Play again', back: 'All trials' }
};
function endCard(el, api, ctx, id, score, max, lines, lang) {
  const w = END[lang], pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end str-end">
    <span class="glyph">${api.GLYPH.curve}</span>
    <p class="label">${w.result}</p>
    <h3 dir="ltr"><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="str-end__marks"></div>
    <p>${pct >= .9 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${w.again}</button><button type="button" class="btn" data-a="back">${w.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('h3'));
  el.querySelector('.str-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}

/* ---------- 1 · Name the load: small drawings with no names on them ---------- */
const PIC = {
  lamp: () => svg('0 0 300 150', `<path d="M70 20H230" stroke="${V.ink}" stroke-width="2"/>${hatchRect(70, 8, 160, 12, 8)}<path d="M150 20V92" stroke="${V.ink}" stroke-width="2.6"/><path d="M118 120L134 92H166L182 120Z" ${steel(.3)}/><path d="M140 120a10 9 0 0 0 20 0" stroke="${V.zc}" stroke-width="2"/>${arrow(172, 62, 172, 28)}${arrow(172, 68, 172, 102)}`),
  tow: () => svg('0 0 300 150', `<rect x="18" y="62" width="84" height="40" rx="6" ${steel()}/><rect x="198" y="62" width="84" height="40" rx="6" ${steel()}/><circle cx="40" cy="106" r="10" ${steel(.5)}/><circle cx="82" cy="106" r="10" ${steel(.5)}/><circle cx="218" cy="106" r="10" ${steel(.5)}/><circle cx="260" cy="106" r="10" ${steel(.5)}/><path d="M102 82H198" stroke="${V.zc}" stroke-width="3"/><path d="M10 118H290" stroke="${V.ink3}" stroke-width="1.4"/>${arrow(58, 46, 16, 46)}${arrow(242, 46, 284, 46)}`),
  crane: () => svg('0 0 300 150', `<path d="M40 14H260" stroke="${V.ink}" stroke-width="7"/><rect x="140" y="18" width="20" height="12" ${steel(.4)}/><path d="M150 30V88" stroke="${V.ink}" stroke-width="4" stroke-dasharray="7 4"/><rect x="108" y="92" width="84" height="50" ${steel()}/><path d="M108 92l84 50M192 92l-84 50" stroke="${V.ink3}" stroke-width="1.2"/>${arrow(176, 64, 176, 34)}${arrow(176, 68, 176, 90)}`),
  line: () => svg('0 0 300 150', `<path d="M28 30V140M272 30V140" stroke="${V.ink}" stroke-width="5"/><path d="M28 40Q150 58 272 40" stroke="${V.zc}" stroke-width="2.4"/><rect x="92" y="48" width="34" height="44" ${steel(.2)}/><rect x="170" y="48" width="30" height="38" ${steel(.2)}/><path d="M10 140H290" stroke="${V.ink3}" stroke-width="1.4"/>${arrow(70, 26, 36, 26, { w: 2.2 })}${arrow(230, 26, 264, 26, { w: 2.2 })}`),
  stool: () => svg('0 0 300 150', `<rect x="96" y="8" width="108" height="50" ${steel(.24)}/><path d="M86 58H214V68H86z" ${steel(.36)}/><path d="M98 68l-6 62M202 68l6 62M130 68v62M170 68v62" stroke="${V.ink}" stroke-width="5"/><path d="M60 132H240" stroke="${V.ink}" stroke-width="2"/>${hatchRect(60, 132, 180, 9, 8)}${arrow(52, 66, 52, 94, { w: 2.4 })}${arrow(52, 128, 52, 104, { w: 2.4 })}`),
  column: () => svg('0 0 300 150', `<rect x="40" y="10" width="220" height="20" ${steel(.3)}/><rect x="130" y="30" width="40" height="92" ${steel(.22)}/><path d="M140 34V118M150 34V118M160 34V118" stroke="${V.ink3}" stroke-width="1"/><rect x="108" y="122" width="84" height="10" ${steel(.36)}/><path d="M40 132H260" stroke="${V.ink}" stroke-width="2"/>${hatchRect(40, 132, 220, 9, 8)}${arrow(206, 40, 206, 70, { w: 2.4 })}${arrow(206, 122, 206, 92, { w: 2.4 })}`),
  press: () => svg('0 0 300 150', `<rect x="112" y="6" width="76" height="40" ${steel(.4)}/><path d="M108 46H192Q198 64 192 82H108Q102 64 108 46Z" fill="${V.zc}" fill-opacity=".26" stroke="${V.ink}" stroke-width="2"/><rect x="80" y="82" width="140" height="34" ${steel(.3)}/>${hatchRect(80, 82, 140, 34, 9)}${arrow(234, 8, 234, 40)}${arrow(234, 112, 234, 88)}`),
  bricks: () => { let b = ''; [[0, 0], [1, 1], [2, 0]].forEach(([r, off]) => { for (let i = 0; i < 4; i++) b += `<rect x="${70 + i * 40 - off * 20}" y="${52 + r * 24}" width="40" height="24" ${steel(.2 + r * .06)}/>`; }); return svg('0 0 300 150', `<rect x="96" y="14" width="88" height="38" ${steel(.42)}/>${b}<path d="M40 124H260" stroke="${V.ink}" stroke-width="2"/>${hatchRect(40, 124, 220, 9, 8)}${arrow(236, 20, 236, 50, { w: 2.4 })}${arrow(236, 120, 236, 92, { w: 2.4 })}`); },
  scissors: () => svg('0 0 300 150', `<rect x="70" y="34" width="78" height="38" ${steel(.4)}/><rect x="152" y="80" width="78" height="38" ${steel(.4)}/><rect x="24" y="72" width="252" height="8" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="1.6"/><path d="M150 20V132" stroke="${V.zc}" stroke-width="1.4" stroke-dasharray="6 4"/>${arrow(109, 4, 109, 30)}${arrow(191, 148, 191, 122)}`),
  rivet: () => svg('0 0 300 150', `<rect x="30" y="52" width="150" height="20" ${steel(.28)}/><rect x="120" y="72" width="150" height="20" ${steel(.16)}/><rect x="140" y="42" width="20" height="60" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/><path d="M134 42a16 9 0 0 1 32 0M134 102a16 9 0 0 0 32 0" stroke="${V.ink}" stroke-width="2"/>${arrow(30, 62, 4, 62, { w: 2.4 })}${arrow(270, 82, 296, 82, { w: 2.4 })}`),
  punch: () => svg('0 0 300 150', `<rect x="128" y="8" width="44" height="58" ${steel(.4)}/><rect x="30" y="66" width="240" height="12" fill="${V.zc}" fill-opacity=".28" stroke="${V.ink}" stroke-width="1.8"/><rect x="30" y="78" width="96" height="48" ${steel(.3)}/>${hatchRect(30, 78, 96, 48, 9)}<rect x="174" y="78" width="96" height="48" ${steel(.3)}/>${hatchRect(174, 78, 96, 48, 9)}<rect x="130" y="92" width="40" height="12" fill="${V.zc}" fill-opacity=".4" stroke="${V.ink}" stroke-width="1.4" stroke-dasharray="4 3"/>${arrow(200, 12, 200, 50)}`),
  towel: () => { let t = ''; for (let x = 74; x <= 222; x += 16) t += `<path d="M${x} 66l12 36" stroke="${V.ink3}" stroke-width="1.4"/>`; return svg('0 0 300 150', `<path d="M64 66H234V102H64Z" fill="${V.zc}" fill-opacity=".22" stroke="${V.ink}" stroke-width="2"/>${t}${arcArrow(48, 84, 12, 34, 110, 390)}${arcArrow(252, 84, 12, 34, 70, -210)}`); },
  crank: () => svg('0 0 300 150', `<path d="M14 75H286" stroke="${V.zc}" stroke-width="1.3" stroke-dasharray="10 4 2 4"/><rect x="40" y="65" width="34" height="20" ${steel()}/><rect x="74" y="35" width="10" height="52" ${steel(.36)}/><rect x="84" y="39" width="22" height="18" fill="${V.zc}" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/><rect x="106" y="35" width="10" height="52" ${steel(.36)}/><rect x="116" y="65" width="34" height="20" ${steel()}/><rect x="150" y="63" width="10" height="52" ${steel(.36)}/><rect x="160" y="93" width="22" height="18" fill="${V.zc}" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/><rect x="182" y="63" width="10" height="52" ${steel(.36)}/><rect x="192" y="65" width="34" height="20" ${steel()}/>${arcArrow(24, 75, 11, 32, 110, 390)}${arcArrow(254, 75, 11, 32, 70, -210)}`),
  screw: () => svg('0 0 300 150', `<rect x="30" y="58" width="70" height="34" rx="12" ${steel(.4)}/><path d="M100 75H196" stroke="${V.ink}" stroke-width="6"/><path d="M196 69l8 6-8 6z" fill="${V.ink}"/><rect x="204" y="62" width="22" height="26" ${steel(.3)}/><path d="M226 66h16M226 72h16M226 78h16M226 84h16" stroke="${V.ink3}" stroke-width="1.4"/><rect x="244" y="40" width="40" height="70" ${steel(.2)}/>${hatchRect(244, 40, 40, 70, 8)}${arcArrow(65, 75, 14, 40, 110, 390)}`),
  key: () => svg('0 0 300 150', `<circle cx="78" cy="75" r="30" ${steel(.3)}/><circle cx="78" cy="75" r="10" stroke="${V.ink}" stroke-width="2"/><path d="M108 70H210V80H108Z" ${steel(.36)}/><path d="M176 80v10h8v-10M192 80v14h8v-14" stroke="${V.ink}" stroke-width="2"/><rect x="210" y="44" width="60" height="62" rx="8" ${steel(.2)}/><circle cx="240" cy="75" r="14" stroke="${V.ink3}" stroke-width="1.4"/>${arcArrow(78, 75, 46, 46, 200, 330)}`)
};
const LOAD_POOL = [
  { k: 'tension', p: 'lamp', ar: 'نجفة متعلقة في السقف بسلك.', en: 'A pendant lamp hangs from the ceiling on a cable.', xa: 'وزنها بيشد السلك لتحت، والسقف ماسكه: السلك بيتشد.', xe: 'Its weight pulls the cable apart along its length.' },
  { k: 'tension', p: 'tow', ar: 'حبل بيجر عربية عطلانة ورا عربية تانية.', en: 'A rope tows a broken-down car behind another car.', xa: 'العربيتين بيشدوا الحبل من الطرفين: شد.', xe: 'The two cars pull the rope from both ends: tension.' },
  { k: 'tension', p: 'crane', ar: 'سلسلة ونش شايلة صندوق في الهوا.', en: 'A crane chain lifts a crate into the air.', xa: 'الصندوق بيشد السلسلة لتحت، والونش لفوق: شد.', xe: 'The crate pulls the chain down; the crane pulls it up.' },
  { k: 'tension', p: 'line', ar: 'حبل غسيل مشدود بين عمودين.', en: 'A washing line is stretched between two posts.', xa: 'العمودين ماسكين الحبل من الطرفين وهو بيتمط: شد.', xe: 'The posts hold both ends while the line is pulled apart.' },
  { k: 'compression', p: 'stool', ar: 'رجول كرسي تحت صندوق تقيل.', en: 'The legs of a stool carry a heavy crate.', xa: 'الحمل بيزق لتحت والأرض لفوق: الرجول بتتكبس.', xe: 'The load pushes down, the floor pushes up: the legs are squeezed.' },
  { k: 'compression', p: 'column', ar: 'عمود شايل سقف.', en: 'A column holds up a roof slab.', xa: 'السقف بيزق لتحت والأرض لفوق: ضغط.', xe: 'The roof pushes down and the ground pushes up: compression.' },
  { k: 'compression', p: 'press', ar: 'بلوك تحت مكبس نازل عليه.', en: 'A block sits under a press ram coming down on it.', xa: 'المكبس بيزق من فوق والسندان من تحت: البلوك بيتكبس وبيتخن.', xe: 'The ram pushes from above, the anvil from below: it shortens and bulges.' },
  { k: 'compression', p: 'bricks', ar: 'آخر صف طوب في حيطة عليه تقل الحيطة كلها.', en: 'The bottom row of bricks carries the weight of the whole wall.', xa: 'التقل من فوق والأرض من تحت: الطوب بيتكبس.', xe: 'Weight from above, ground from below: the bricks are squeezed.' },
  { k: 'shear', p: 'scissors', ar: 'مقص صاج بيقطع لوح: سلاح نازل وسلاح طالع.', en: 'A shear cuts a sheet: one blade comes down, the other pushes up.', xa: 'القوتين عكس بعض ومش على نفس الخط: قص.', xe: 'Opposite forces, not on the same line: shear.' },
  { k: 'shear', p: 'rivet', ar: 'مسمار برشام بين لوحين بيتشدوا عكس بعض.', en: 'A rivet joins two plates that are pulled in opposite directions.', xa: 'نص المسمار بيحاول يزحلق على النص التاني: قص.', xe: 'One half of the rivet tries to slide past the other: shear.' },
  { k: 'shear', p: 'punch', ar: 'بنش بيخرم صاج فوق داي.', en: 'A punch pushes through a sheet into a die.', xa: 'البنش والداي بيعملوا إجهادات قص في الصاج (المحاضرة 5).', xe: 'Punch and die put shearing stresses in the sheet (Lecture 5).' },
  { k: 'torsion', p: 'towel', ar: 'فوطة مبلولة بتتعصر: طرف بيلف ناحية والتاني عكسه.', en: 'A wet towel is wrung out: one end turns one way, the other end the other way.', xa: 'عزم بيلفها حوالين طولها: لي.', xe: 'A torque twists it about its length: torsion.' },
  { k: 'torsion', p: 'crank', ar: 'عمود كرنك جوه موتور.', en: 'A crankshaft turns inside an engine.', xa: 'السلايد نفسه: الكرنك لازم يبقى عنده superior torsional strength.', xe: 'The slide itself: it needs superior torsional strength.' },
  { k: 'torsion', p: 'screw', ar: 'مفك بيربط مسمار قلاووظ ناشف.', en: 'A screwdriver turns a stiff screw.', xa: 'إيدك بتلف والمسمار بيقاوم: العمود بيتلوي.', xe: 'Your hand turns, the screw resists: the shaft twists.' },
  { k: 'torsion', p: 'key', ar: 'مفتاح بيلف في كالون ناشف.', en: 'A key is turned in a stiff lock.', xa: 'عزم على راس المفتاح والكالون بيقاوم: لي.', xe: 'A torque on the head, the lock resists: torsion.' }
];
const LOAD_NAME = { ar: { tension: 'شد', compression: 'ضغط', shear: 'قص', torsion: 'لي' }, en: { tension: 'Tension', compression: 'Compression', shear: 'Shear', torsion: 'Torsion' } };
const W1 = {
  ar: { title: 'سمّي الحمل', en: 'Name the load', how: 'قطعة شغالة قدامك. إيه الحمل اللي عليها: شد ولا ضغط ولا قص ولا لي؟ ١٠ جولات، ١٠ ثواني للجولة. اضغط <b>1</b> لـ <b>4</b>.',
    intro: { title: 'سمّي الحمل', text: 'كل جولة فيها قطعة من الدنيا الحقيقية وهي شغالة. اختار الحمل اللي عليها. الاختيارات ثابتة في مكانها، عشان إيدك تتعود.', rules: ['شد = بيتشد لبره. ضغط = بيتكبس.', 'قص = نص بيزحلق على نص. لي = عزم بيلف.', 'الأسهم البرتقالي هي القوى.'] },
    prompt: 'إيه الحمل؟',
    wins: [[1, 'ولا غلطة.', 'عينك بتشوف القوة قبل ما تشوف القطعة.'], [.8, 'جامد.', 'شوية تركيز في القص واللي وتبقى كاملة.'], [.5, 'مش بطال.', 'ارجع لفصل «أربع طرق تحمّل بيها قطعة» دقيقة.'], [0, 'لسه.', 'جرّب الديمو بتاع المكعب الأول، وبعدين ارجع.']] },
  en: { title: 'Name the load', en: 'Name the load', how: 'A part is at work. Which load is on it: tension, compression, shear or torsion? 10 rounds, 10 seconds each. Press <b>1</b> to <b>4</b>.',
    intro: { title: 'Name the load', text: 'Each round shows a real-world part at work. Pick the load it carries. The four answers never move, so your hand learns where they are.', rules: ['Tension pulls it apart. Compression squeezes it.', 'Shear slides one half past the other. Torsion twists it.', 'The orange arrows are the forces.'] },
    prompt: 'Which load is it?',
    wins: [[1, 'Not one mistake.', 'You see the force before you see the part.'], [.8, 'Strong.', 'A little more care with shear and torsion and it’s perfect.'], [.5, 'Not bad.', 'Spend a minute on the chapter “Four ways to load a part”.'], [0, 'Not yet.', 'Play with the block demo first, then come back.']] }
};
function loadsTrial(lang) {
  const w = W1[lang];
  return {
    id: 'strength-loads', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      // ten rounds, at least two of each load
      const by = Object.fromEntries(LOADS.map(k => [k, shuffle(LOAD_POOL.filter(x => x.k === k))]));
      let set = LOADS.flatMap(k => by[k].slice(0, 2));
      set = shuffle(set.concat(shuffle(LOADS.flatMap(k => by[k].slice(2))).slice(0, 2)));
      const rounds = set.map(it => ({
        prompt: w.prompt, sub: it[lang], art: PIC[it.p](),
        choices: LOADS.map(k => ({ html: `<span class="str-qf__ic" aria-hidden="true">${LOAD_ICON[k]}</span><b>${LOAD_NAME[lang][k]}</b>${lang === 'ar' ? `<small dir="ltr">${LOAD_NAME.en[k]}</small>` : ''}`, ok: k === it.k, label: LOAD_NAME[lang][k] })),
        explain: lang === 'ar' ? it.xa : it.xe
      }));
      // the stage shows the right load after each answer (the engine plays exactly one good/bad sound per answer)
      let n = 0; const A = Object.create(api);
      A.sfx = s => { api.sfx(s); if ((s === 'good' || s === 'bad') && set[n]) { api.scene(LOAD_SCENE[set[n].k]); n++; } };
      el.innerHTML = '<div class="str-qf"></div>';
      return quickfire(el.firstChild, A, ctx, { id: 'strength-loads', intro: w.intro, rounds, time: 10, layout: 'grid', wins: w.wins });
    }
  };
}

/* ---------- 2 · Read the curve: tap the point the question names ---------- */
const PTS = ['el', 'yield', 'uni', 'uts', 'neck', 'frac'];
const ASK = [
  { k: 'uts', ar: 'دوس على أقصى مقاومة شد <bdi dir="ltr">(ultimate tensile strength)</bdi>.', en: 'Tap the ultimate tensile strength.' },
  { k: 'yield', ar: 'دوس على حد الخضوع <bdi dir="ltr">(yield strength)</bdi>.', en: 'Tap the yield strength.' },
  { k: 'frac', ar: 'دوس على نقطة الكسر <bdi dir="ltr">(F)</bdi>.', en: 'Tap the fracture point (F).' },
  { k: 'neck', ar: 'دوس على نقطة العينة فيها بتعمل رقبة <bdi dir="ltr">(necking)</bdi>.', en: 'Tap a point where the specimen is necking.' },
  { k: 'el', ar: 'دوس على نقطة لو سبت العينة عندها، هترجع لطولها.', en: 'Tap a point where the specimen would spring back if you let go.' },
  { k: 'uni', ar: 'دوس على نقطة استطالة منتظمة بعد الخضوع: بتطول بالتساوي، بس مش هترجع كاملة.', en: 'Tap a point of uniform elongation after yielding: it stretches evenly but won’t fully spring back.' },
  { k: 'uts', ar: 'سلايد 9 سمّى أعلى نقطة <bdi dir="ltr">M</bdi>. دوس عليها.', en: 'Slide 9 calls the top point M. Tap it.' },
  { k: 'yield', ar: 'لو عدّيت أنهي نقطة، المعدن يدخل في تشوه دائم؟', en: 'Past which point does the metal go into permanent deformation?' }
];
const PT_NAME = {
  ar: { el: 'سلوك مرن', yield: 'حد الخضوع', uni: 'استطالة منتظمة', uts: 'أقصى مقاومة شد (M)', neck: 'رقبة', frac: 'كسر (F)' },
  en: { el: 'elastic behavior', yield: 'yield strength', uni: 'uniform elongation', uts: 'ultimate tensile strength (M)', neck: 'necking', frac: 'fracture (F)' }
};
const PT_WHY = {
  ar: { el: 'على الخط المستقيم: لو سبتها ترجع.', yield: 'آخر الخط المستقيم: بعده تشوه دائم.', uni: 'بعد الخضوع وقبل القمة: العينة كلها بتطول بالتساوي.', uts: 'أعلى نقطة على المنحنى: أكبر إجهاد.', neck: 'بعد القمة: حتة واحدة بتخس، والمنحنى نازل.', frac: 'آخر المنحنى: العينة اتقطعت.' },
  en: { el: 'On the straight line: let go and it springs back.', yield: 'The end of the straight line: past it, permanent deformation.', uni: 'After yield, before the top: the whole specimen stretches evenly.', uts: 'The highest point of the curve: the biggest stress.', neck: 'After the top: one spot thins and the curve falls.', frac: 'The end of the curve: the specimen broke.' }
};
const W2 = {
  ar: { title: 'اقرا المنحنى', en: 'Read the curve', how: 'منحنى إجهاد وانفعال عليه ٦ نقط مترقمة. السؤال بيسمّي نقطة، وانت تدوس عليها. المنحنى بيتغير كل جولة. ٨ جولات، من غير تايمر.',
    round: 'جولة', score: 'صح', next: 'اللي بعده', finish: 'النتيجة', right: 'صح.', wrong: 'لأ.', tapped: 'دي', isAt: 'الصح:',
    lines: ['بتقرا المنحنى زي ما بتقرا اسمك.', 'كويس. القمة والخضوع بقوا واضحين.', 'لسه بيتلخبطوا. ارجع لفصل «منحنى الإجهاد والانفعال» وجرّب الديمو.'], aria: 'منحنى إجهاد وانفعال عليه نقط مترقمة' },
  en: { title: 'Read the curve', en: 'Read the curve', how: 'A stress–strain curve with 6 numbered points. The question names a point; you tap it. The curve changes every round. 8 rounds, no clock.',
    round: 'Round', score: 'Right', next: 'Next', finish: 'See your score', right: 'Right.', wrong: 'No.', tapped: 'That’s', isAt: 'The answer:',
    lines: ['You read the curve like your own name.', 'Good. The top and the yield point are clear now.', 'They still mix. Go back to “The stress–strain curve” and try its demo.'], aria: 'A stress–strain curve with numbered points' }
};
function curveTrial(lang) {
  const w = W2[lang];
  return {
    id: 'strength-curve', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      const N = 8, asks = shuffle(ASK).slice(0, N);
      const P = { x0: 40, y0: 206, w: 300, h: 172 };
      let i = 0, score = 0, locked = false, onKey = null; const timers = new Set();
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
      const setKeys = fn => { if (onKey) document.removeEventListener('keydown', onKey); onKey = fn; if (fn) document.addEventListener('keydown', fn); };
      const stop = () => { timers.forEach(clearTimeout); timers.clear(); setKeys(null); };
      function round() {
        locked = false;
        const r = Math.random, ey = .2 + r() * .08, eu = ey + .27 + r() * .07, ef = Math.min(.97, eu + .3 + r() * .06);
        const c = { ey, sy: .58 + r() * .24, eu, ef, sf: .55 + r() * .18 };
        const at = { el: ey * .5, yield: ey, uni: (ey + eu) / 2, uts: eu, neck: (eu + ef) / 2, frac: ef };
        const xy = k => toXY(P, at[k], stressAt(at[k], c));
        const order = shuffle(PTS); // the numbers 1–6 land on the points in a new order every round
        const q = asks[i];
        el.innerHTML = `<div class="g-card str-rc">
          <div class="g-hud"><span class="chip">${w.round} <span class="hud-num" dir="ltr">${i + 1}/${N}</span></span><span class="chip chip--zone">${w.score} <span class="hud-num">${score}</span></span></div>
          <p class="g-prompt str-rc__q">${q[lang]}</p>
          <div class="str-rc__plot">${svg('0 0 360 236', axes(P, { top: 14, right: 352 }) + `<path d="${poly(curvePts(c).map(([e, s]) => toXY(P, e, s)))}" stroke="${V.zc}" stroke-width="3.2"/><g class="str-rc__labels"></g>`, w.aria)}
            ${order.map((k, n) => { const p = xy(k); return `<button type="button" class="str-rc__pt" data-k="${k}" style="left:${f1(p[0] / 3.6)}%;top:${f1(p[1] / 2.36)}%" aria-label="${n + 1}">${n + 1}</button>`; }).join('')}
          </div>
          <p class="str-rc__fb" aria-live="polite"></p>
          <div class="g-acts str-rc__acts" hidden><button type="button" class="btn btn--zone str-rc__next">${i + 1 < N ? w.next : w.finish}</button></div>
        </div>`;
        const pts = [...el.querySelectorAll('.str-rc__pt')];
        const answer = k => {
          if (locked) return; locked = true;
          const ok = k === q.k, right = pts.find(b => b.dataset.k === q.k), mine = pts.find(b => b.dataset.k === k);
          pts.forEach(b => { b.disabled = true; }); el.querySelector('.str-rc__plot').classList.add('is-done');
          right.classList.add('is-right'); if (!ok) mine.classList.add('is-wrong');
          if (ok) { score++; api.sfx('good'); api.burst(right, 'var(--good)', 10); } else { api.sfx('bad'); api.shake(mine); }
          el.querySelector('.g-hud .chip--zone .hud-num').textContent = score;
          // reveal every point's name on the drawing
          el.querySelector('.str-rc__labels').innerHTML = PTS.map(kk => { const p = xy(kk), up = kk === 'uts' || kk === 'neck'; return lab(Math.min(340, Math.max(36, p[0] + (kk === 'el' || kk === 'yield' ? 12 : 0))), p[1] + (up ? -16 : 22), PT_NAME.en[kk], { a: kk === 'el' || kk === 'yield' ? 'start' : 'middle', size: 11.5, c: kk === q.k ? V.zt : V.ink3, w: 600, knock: true }); }).join('');
          const fb = el.querySelector('.str-rc__fb');
          fb.innerHTML = ok ? `<b class="str-ok">${w.right}</b> ${PT_WHY[lang][q.k]}` : `<b class="str-no">${w.wrong}</b> ${w.tapped} <b>${PT_NAME[lang][k]}</b>. ${w.isAt} <b>${PT_NAME[lang][q.k]}</b>: ${PT_WHY[lang][q.k]}`;
          api.scene(q.k === 'neck' || q.k === 'frac' ? 'necking' : q.k === 'yield' ? 'yield' : 'curve');
          const acts = el.querySelector('.str-rc__acts'); acts.hidden = false;
          const nx = el.querySelector('.str-rc__next'); nx.addEventListener('click', next); later(() => nx.focus({ preventScroll: true }), 30);
          setKeys(e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); next(); } });
        };
        pts.forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
        setKeys(e => { const n = '123456'.indexOf(e.key); if (n >= 0 && e.key.length === 1) { e.preventDefault(); answer(order[n]); } });
      }
      function next() { setKeys(null); i++; if (i < N) round(); else { stop(); endCard(el, api, ctx, 'strength-curve', score, N, w.lines, lang); } }
      round();
      return stop;
    }
  };
}

/* ---------- 3 · Hold & release: load it along the curve, let go at the right moment ---------- */
const GOALS = [
  { g: 'elastic', T: 4.4, c: { ey: .3, sy: .7, eu: .62, ef: .95, sf: .64 } },
  { g: 'elastic', T: 3.8, c: { ey: .22, sy: .8, eu: .56, ef: .93, sf: .6 } },
  { g: 'window', T: 3.8, c: { ey: .2, sy: .62, eu: .6, ef: .96, sf: .66 } },
  { g: 'elastic', T: 3.1, c: { ey: .17, sy: .76, eu: .52, ef: .9, sf: .62 } },
  { g: 'top', T: 3.6, c: { ey: .24, sy: .74, eu: .58, ef: .95, sf: .64 } }
];
const W3 = {
  ar: { title: 'شد وسيب', en: 'Hold & release', how: 'اضغط مطوّل عشان تشد العينة على المنحنى، وسيب في اللحظة الصح. مرة تفضل مرنة، ومرة تعدّي الخضوع وتقف قبل القمة. ٥ جولات. <b>Space</b> مطوّل كمان شغال.',
    goal: { elastic: 'خليها مرنة: سيب أقرب ما يكون لحد الخضوع، من غير ما تعدّيه.', window: 'عدّي حد الخضوع، بس سيب قبل أعلى نقطة.', top: 'سيب أقرب ما يكون لأعلى نقطة على المنحنى.' },
    hold: 'اضغط مطوّل عشان تشد', holding: 'بتشد…', round: 'جولة', score: 'نقط', next: 'اللي بعده', finish: 'النتيجة',
    res: {
      perfect: 'في الجون. على حد الخضوع بالظبط، ورجعت لطولها.', good: 'حلوة. رجعت لطولها، بس كان فيه مسافة لحد الخضوع.', weak: 'رجعت لطولها، بس سبتها بدري قوي.', timid: 'بدري جدًا. لسه بعيد عن حد الخضوع.',
      over: 'عدّيت حد الخضوع: تشوه دائم. الخط المتقطع بيوريك العينة فضلت أطول قد إيه.', neckFail: 'عدّيت القمة: العينة بدأت تعمل رقبة.', broke: 'اتقطعت! وصلت للكسر.',
      winOk: 'بالظبط: عدّيت الخضوع (تشوه دائم) ووقفت قبل القمة، من غير رقبة.', winEarly: 'لسه ما عدّيتش الخضوع: رجعت لطولها.',
      topPerfect: 'على القمة بالظبط: الـ ultimate tensile strength.', topGood: 'قريب من القمة.', topWeak: 'بعيد شوية عن القمة.', topFar: 'بعيد عن القمة.'
    },
    lines: ['إيدك بقت تحس بحد الخضوع.', 'كويس. الخط المستقيم والقمة بقوا واضحين.', 'افتكر: حد الخضوع = آخر الخط المستقيم. والقمة = أعلى نقطة. جرّب تاني.'], aria: 'منحنى إجهاد وانفعال بيترسم وانت بتشد' },
  en: { title: 'Hold & release', en: 'Hold & release', how: 'Press and hold to pull the specimen along its curve; let go at the right moment. Sometimes keep it elastic, sometimes pass the yield point and stop before the top. 5 rounds. Holding <b>Space</b> works too.',
    goal: { elastic: 'Keep it elastic: let go as close to the yield strength as you can, without passing it.', window: 'Pass the yield strength, but let go before the highest point.', top: 'Let go as close as you can to the highest point of the curve.' },
    hold: 'Press and hold to pull', holding: 'Pulling…', round: 'Round', score: 'Points', next: 'Next', finish: 'See your score',
    res: {
      perfect: 'Spot on. Right at the yield strength, and it sprang back.', good: 'Nice. It sprang back, with a little room left before yield.', weak: 'It sprang back, but you let go quite early.', timid: 'Far too early. Nowhere near the yield strength.',
      over: 'You passed the yield strength: permanent deformation. The dashed line shows how much longer it stayed.', neckFail: 'You passed the top: the specimen started necking.', broke: 'It broke! You reached fracture.',
      winOk: 'Exactly: past the yield strength (a permanent stretch) and stopped before the top, no necking.', winEarly: 'You hadn’t passed the yield strength yet: it sprang back.',
      topPerfect: 'Right on the top: the ultimate tensile strength.', topGood: 'Close to the top.', topWeak: 'A bit off the top.', topFar: 'Far from the top.'
    },
    lines: ['Your hands can feel the yield point now.', 'Good. The straight line and the top are clear.', 'Remember: yield = the end of the straight line; the top = the highest point. Try again.'], aria: 'A stress–strain curve that draws itself as you pull' }
};
function holdTrial(lang) {
  const w = W3[lang];
  return {
    id: 'strength-hold', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      const N = GOALS.length, P = { x0: 40, y0: 198, w: 300, h: 164 }, SPEC = { L0: 150, k: .42, t0: 20, grip: 28, gt: 34 };
      let i = 0, score = 0, raf = 0, state = 'idle', e = 0, t0 = 0, onDown = null, onUp = null; const timers = new Set();
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
      const keys = (d, u) => { if (onDown) document.removeEventListener('keydown', onDown); if (onUp) document.removeEventListener('keyup', onUp); onDown = d; onUp = u; if (d) document.addEventListener('keydown', d); if (u) document.addEventListener('keyup', u); };
      const stop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers.clear(); keys(null, null); };
      function round() {
        const G = GOALS[i], c = G.c, E = slopeE(c);
        state = 'ready'; e = 0;
        el.innerHTML = `<div class="g-card str-hr">
          <div class="g-hud"><span class="chip">${w.round} <span class="hud-num" dir="ltr">${i + 1}/${N}</span></span><span class="chip chip--zone">${w.score} <span class="hud-num">${score}</span></span></div>
          <p class="str-hr__goal">${w.goal[G.g]}</p>
          <div class="str-hr__plot">${svg('0 0 360 300', axes(P, { top: 14, right: 352 }) + `<path d="${poly(curvePts(c).map(([x, s]) => toXY(P, x, s)))}" stroke="${V.ink3}" stroke-width="2" opacity=".55"/><g class="str-hr__labels"></g><path class="str-hr__trace" stroke="${V.zc}" stroke-width="3.8"/><path class="str-hr__back" stroke="${V.zt}" stroke-width="2.2" stroke-dasharray="7 5"/><circle class="str-hr__dot" r="7" cx="${P.x0}" cy="${P.y0}" fill="${V.zc}" stroke="${V.ink}" stroke-width="1.6"/><g class="str-hr__spec"></g>`, w.aria)}</div>
          <button type="button" class="btn btn--zone btn--lg btn--block str-hr__hold">${w.hold}</button>
          <p class="str-hr__fb" aria-live="polite"></p>
          <div class="g-acts str-hr__acts" hidden><button type="button" class="btn btn--zone str-hr__next">${i + 1 < N ? w.next : w.finish}</button></div>
        </div>`;
        const $ = s => el.querySelector(s);
        const trace = $('.str-hr__trace'), back = $('.str-hr__back'), dot = $('.str-hr__dot'), spec = $('.str-hr__spec'), hold = $('.str-hr__hold');
        const put = (x, s) => { const p = toXY(P, x, s); dot.setAttribute('cx', f1(p[0])); dot.setAttribute('cy', f1(p[1])); };
        const draw = x => { const xx = Math.min(x, c.ef); trace.setAttribute('d', xx > 0 ? poly(curvePts(c, xx).map(([q, s]) => toXY(P, q, s))) : ''); put(xx, stressAt(xx, c)); spec.innerHTML = specimen(190, 262, x, c, SPEC); };
        draw(0);
        const tick = now => { if (state !== 'pull') return; e = Math.min(c.ef, (now - t0) / (G.T * 1000) * c.ef); draw(e); if (e >= c.ef) { draw(c.ef + .001); release(true); return; } raf = requestAnimationFrame(tick); };
        const press = () => { if (state !== 'ready') return; state = 'pull'; hold.classList.add('is-on'); hold.textContent = w.holding; api.sfx('click'); t0 = performance.now(); raf = requestAnimationFrame(tick); };
        const release = broke => {
          if (state !== 'pull') return; state = 'done'; cancelAnimationFrame(raf);
          hold.classList.remove('is-on'); hold.disabled = true; hold.textContent = w.hold;
          const s = stressAt(e, c), eRes = e <= c.ey ? 0 : Math.max(0, e - s / E);
          let pts = 0, msg = '', ok = false;
          if (broke) msg = w.res.broke;
          else if (G.g === 'elastic') {
            if (e > c.ey) msg = w.res.over;
            else { const r = e / c.ey; pts = r >= .86 ? 3 : r >= .66 ? 2 : r >= .42 ? 1 : 0; msg = pts === 3 ? w.res.perfect : pts === 2 ? w.res.good : pts === 1 ? w.res.weak : w.res.timid; ok = pts >= 2; }
          } else if (G.g === 'window') {
            if (e <= c.ey) msg = w.res.winEarly; else if (e >= c.eu) msg = w.res.neckFail; else { pts = 3; ok = true; msg = w.res.winOk; }
          } else {
            const d = Math.abs(e - c.eu); pts = d <= .035 ? 3 : d <= .075 ? 2 : d <= .13 ? 1 : 0; ok = pts >= 2;
            msg = pts === 3 ? w.res.topPerfect : pts === 2 ? w.res.topGood : pts === 1 ? w.res.topWeak : w.res.topFar;
          }
          score += pts;
          el.querySelector('.g-hud .chip--zone .hud-num').textContent = score;
          // let go: back down the straight line (elastic) or along a parallel line to a permanent stretch (plastic)
          if (!broke) {
            const from = toXY(P, e, s), to = toXY(P, eRes, 0);
            if (eRes > 0) back.setAttribute('d', `M${f1(from[0])} ${f1(from[1])}L${f1(to[0])} ${f1(to[1])}`);
            if (reduced()) { put(eRes, 0); spec.innerHTML = specimen(190, 262, eRes, c, SPEC); }
            else { const a0 = performance.now(); const step = now => { const k = Math.min(1, (now - a0) / 700), q = 1 - Math.pow(1 - k, 3); const x = e + (eRes - e) * q; put(x, s * (1 - q)); spec.innerHTML = specimen(190, 262, x, c, SPEC); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
          }
          // name the two landmarks now that the round is over
          const Y = toXY(P, c.ey, c.sy), U = toXY(P, c.eu, 1);
          $('.str-hr__labels').innerHTML = `<circle cx="${f1(Y[0])}" cy="${f1(Y[1])}" r="4.5" fill="${V.zt}"/><circle cx="${f1(U[0])}" cy="${f1(U[1])}" r="4.5" fill="${V.zt}"/>` + lab(Y[0] + 10, Y[1] + 16, 'yield strength', { a: 'start', size: 12, c: V.zt, knock: true }) + lab(U[0], U[1] - 10, 'ultimate tensile strength', { size: 12, c: V.zt, knock: true });
          const fb = $('.str-hr__fb'); fb.innerHTML = `<b class="${ok ? 'str-ok' : 'str-no'}" dir="ltr">+${pts}</b> ${msg}`;
          if (ok) { api.sfx('good'); api.burst(fb, 'var(--good)', 10); } else { api.sfx('bad'); if (!reduced()) api.shake(fb); }
          api.scene(broke || e >= c.eu ? 'necking' : eRes > 0 ? 'plastic' : 'elastic');
          const acts = $('.str-hr__acts'); acts.hidden = false; const nx = $('.str-hr__next'); nx.addEventListener('click', next); later(() => nx.focus({ preventScroll: true }), 30);
          keys(ev => { if ((ev.key === 'Enter' || ev.key === ' ') && !ev.repeat && !ev.target.closest('button')) { ev.preventDefault(); next(); } }, null);
        };
        hold.addEventListener('pointerdown', ev => { ev.preventDefault(); try { hold.setPointerCapture(ev.pointerId); } catch (e) { /* a synthetic or already-gone pointer: pointerup still releases */ } press(); });
        hold.addEventListener('pointerup', () => release(false));
        hold.addEventListener('pointercancel', () => release(false));
        hold.addEventListener('lostpointercapture', () => release(false));
        hold.addEventListener('contextmenu', ev => ev.preventDefault());
        keys(ev => { if ((ev.key === ' ' || ev.key === 'Enter') && !ev.repeat) { ev.preventDefault(); press(); } }, ev => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); release(false); } });
      }
      function next() { keys(null, null); cancelAnimationFrame(raf); i++; if (i < N) round(); else { stop(); endCard(el, api, ctx, 'strength-hold', score, N * 3, w.lines, lang); } }
      round();
      return stop;
    }
  };
}

export const strengthTrials = lang => [loadsTrial(lang), curveTrial(lang), holdTrial(lang)];
