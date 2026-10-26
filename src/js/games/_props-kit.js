// Props zone trials (both editions): Property detective (quick-fire), Mechanical or physical? (sort the conveyor) and
// Spot the swap (one phrase in a slide definition was swapped with its look-alike's). Words for both languages live here;
// games/props.js and games/props.en.js pick theirs with propsTrials('ar' | 'en').
import { quickfire, sample } from './_cte-kit.js';
import { marks } from '../ui/icons.js';
import { svg, ductileArt, malleableArt, brittleArt, hardnessArt, toughArt, resilienceArt, castArt, machineArt, weldArt, beamArt, rustArt, uvArt, PHYS_ICON } from '../content/lessons/_props-kit.js';

const shuffle = a => sample(a, a.length);
const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const bare = s => s.replace(/<text[\s\S]*?<\/text>/g, ''); // the lesson drawings without their labels (the label is the answer)
const icon = k => svg('0 0 300 150', `<g style="color:var(--zc)">${PHYS_ICON[k].replace('<svg ', '<svg x="96" y="2" width="108" height="108" ')}</g>`);

/* ---------- names ---------- */
const P = {
  hardness: ['الصلادة', 'Hardness', 'hardness'], ductility: ['المطيلية', 'Ductility', 'ductile'], brittleness: ['القصافة', 'Brittleness', 'brittle'], bending: ['الثني', 'Bending', 'neutralAxis'],
  toughness: ['المتانة', 'Toughness', 'tough'], malleability: ['المطاوعة', 'Malleability', 'malleable'], castability: ['القابلية للصب', 'Castability', 'castable'], resilience: ['امتصاص الصدمات', 'Resilience', 'resilience'],
  machinability: ['قابلية التشغيل', 'Machinability', 'machinable'], weldability: ['قابلية اللحام', 'Weldability', 'weldable'],
  opacity: ['العتامة/الشفافية', 'Opacity/transparency', 'physical'], color: ['اللون', 'Color', 'physical'], density: ['الكثافة', 'Density', 'physical'], electrical: ['التوصيل الكهربي', 'Electrical conductivity', 'conductivity'],
  thermal: ['التوصيل الحراري', 'Thermal conductivity', 'conductivity'], expansion: ['التمدد الحراري', 'Thermal expansion', 'expansion'], magnet: ['المغناطيسية', 'Ferromagnetism', 'magnet'], melting: ['نقطة الانصهار', 'Melting point', 'melting'],
  corrosion: ['مقاومة التآكل', 'Corrosion resistance', 'corrosion'],
  strength: ['الإجهاد', 'Strength (stress)', ''], tensile: ['إجهاد الشد', 'Tensile strength', ''], elasticity: ['المرونة', 'Elasticity', ''], plasticity: ['اللدونة', 'Plasticity', ''], yield: ['حد الخضوع', 'Yield strength', '']
};
const name = (k, lang) => lang === 'ar' ? P[k][0] : P[k][1];

/* ---------- the end card the custom trials share ---------- */
const END = { ar: { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات' }, en: { result: 'Your score', again: 'Play again', back: 'All trials' } };
function endCard(el, api, ctx, id, score, max, lines, lang, extra = '') {
  const w = END[lang], pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end prp-end"><span class="glyph">${api.GLYPH.indent}</span><p class="label">${w.result}</p>
    <h3 dir="ltr"><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3><div class="prp-end__marks"></div>
    <p>${pct >= .9 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>${extra}
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${w.again}</button><button type="button" class="btn" data-a="back">${w.back}</button></div></div>`;
  const r = api.finishGame(id, score, max, el.querySelector('h3'));
  el.querySelector('.prp-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}

/* ---------- 1 · Property detective ---------- */
const CASES = [
  { a: 'ductility', d: ['malleability', 'toughness', 'castability'], pic: () => bare(ductileArt()), ar: 'قضيب بيتسحب من فتحات أضيق وأضيق لحد ما يبقى سلك رفيع، من غير ما يتقطع.', en: 'A rod is pulled through smaller and smaller holes until it is a fine wire, without breaking.', xa: 'سلك رفيع تحت شد = المطيلية.', xe: 'Fine wire under a tensile load = ductility.' },
  { a: 'malleability', d: ['ductility', 'castability', 'hardness'], pic: () => bare(malleableArt()), ar: 'بلاطة معدن بتعدّي بين درافيل تاني وتالت لحد ما تبقى صاج رفيع.', en: 'A metal slab goes between rolls again and again until it becomes a thin sheet.', xa: 'درفلة لألواح = المطاوعة.', xe: 'Rolled into sheets = malleability.' },
  { a: 'brittleness', d: ['ductility', 'toughness', 'resilience'], pic: () => bare(brittleArt()), ar: 'كتيفة حديد زهر طقت نصين من غير ما تطول خالص.', en: 'A cast iron bracket snaps in two without stretching at all.', xa: 'عكس المطيلية، ومثال السلايد الحديد الزهر = القصافة.', xe: 'The opposite of ductility, the slide’s cast iron = brittleness.' },
  { a: 'hardness', d: ['toughness', 'malleability', 'resilience'], pic: () => bare(hardnessArt()), ar: 'سطح ترابيزة شغل لازم ما يتعلّمش من العدد والخدوش.', en: 'A workbench top must not get dented or scratched by tools.', xa: 'يقاوم الغرز والخدش = الصلادة.', xe: 'Resists penetration and scratching = hardness.' },
  { a: 'toughness', d: ['hardness', 'ductility', 'castability'], pic: () => bare(toughArt()), ar: 'راس شاكوش بتاخد آلاف الخبطات من غير ما تتشرخ.', en: 'A hammer head takes thousands of blows without cracking.', xa: 'يقاوم الكسر قدام خبط الشاكوش = المتانة.', xe: 'Resists fracture against hammer blows = toughness.' },
  { a: 'resilience', d: ['toughness', 'malleability', 'castability'], pic: () => bare(resilienceArt()), ar: 'سوستة بتمتص طاقة الخبطة وترجع لشكلها (جوه حد المرونة).', en: 'A spring absorbs the energy of a knock and returns to its shape (within the elastic limit).', xa: 'يمتص طاقة جوه حد المرونة = امتصاص الصدمات.', xe: 'Absorbs energy within the elastic limit = resilience.' },
  { a: 'castability', d: ['malleability', 'weldability', 'machinability'], pic: () => bare(castArt()), ar: 'معدن سايح لازم يملا كل ركن في إسطمبة معقدة.', en: 'Molten metal must fill every corner of a complex mould.', xa: 'سلوكه وهو سايح = القابلية للصب.', xe: 'Behavior in the molten state = castability.' },
  { a: 'machinability', d: ['weldability', 'castability', 'malleability'], pic: () => bare(machineArt()), ar: 'قضيب هيتشكّل على مخرطة بأداة قطع، والورشة عايزاه يتقطع بسهولة.', en: 'A bar will be shaped on a lathe with a cutting tool; the shop wants it to cut easily.', xa: 'سهولة التشكيل بأداة قطع = قابلية التشغيل.', xe: 'Ease of shaping with a cutting tool = machinability.' },
  { a: 'weldability', d: ['machinability', 'castability', 'ductility'], pic: () => bare(weldArt()), ar: 'لوحين في شاسيه هيتوصلوا ببعض باللحام.', en: 'Two plates of a frame will be joined by welding.', xa: 'يتوصل باللحام = قابلية اللحام.', xe: 'Joined by welding = weldability.' },
  { a: 'bending', d: ['ductility', 'malleability', 'hardness'], pic: () => bare(beamArt()), ar: 'رف شايل كتب ومحني: الوش اللي تحت بيتمط، واللي فوق بيتكبس.', en: 'A loaded shelf sags: its bottom face stretches, its top face is squeezed.', xa: 'بره شد وجوه ضغط = الثني.', xe: 'Outside in tension, inside in compression = bending.' },
  { a: 'opacity', d: ['color', 'thermal', 'density'], pic: () => icon('opacity'), ar: 'غطا نجفة لازم يعدّي الضوء.', en: 'A lamp diffuser must let light through.', xa: 'قدرة الخامة تعدّي الضوء = العتامة/الشفافية.', xe: 'The ability to transmit light = opacity/transparency.' },
  { a: 'thermal', d: ['electrical', 'expansion', 'melting'], pic: () => icon('thermal'), ar: 'قاع حلّة لازم يعدّي الحرارة بسرعة للأكل.', en: 'The base of a cooking pot must let heat flow through quickly to the food.', xa: 'الحرارة بتعدي جوه الخامة = التوصيل الحراري.', xe: 'Heat flowing within and through = thermal conductivity.' },
  { a: 'electrical', d: ['thermal', 'magnet', 'density'], pic: () => icon('electric'), ar: 'سلك كهربا لازم يعدّي التيار بسهولة.', en: 'A cable must carry an electric current easily.', xa: 'سهولة مرور التيار = التوصيل الكهربي.', xe: 'The ease of conducting a current = electrical conductivity.' },
  { a: 'density', d: ['hardness', 'expansion', 'color'], pic: () => icon('density'), ar: 'قطعتين نفس الحجم بالظبط، بس واحدة أتقل بكتير.', en: 'Two parts have exactly the same volume, but one is much heavier.', xa: 'الوزن في وحدة الحجم = الكثافة.', xe: 'Weight per unit volume = density.' },
  { a: 'expansion', d: ['thermal', 'melting', 'malleability'], pic: () => icon('expansion'), ar: 'قضبان السكة بيسيبوا بينهم فراغ، عشان بيطولوا في حر الصيف.', en: 'Rails are laid with small gaps because they get longer in summer heat.', xa: 'بيطول لما يسخن = التمدد الحراري.', xe: 'It grows when heated = thermal expansion.' },
  { a: 'magnet', d: ['electrical', 'density', 'corrosion'], pic: () => icon('magnet'), ar: 'مغناطيس بيلقط خردة الحديد والنيكل والكوبالت من كومة مخلوطة.', en: 'A magnet picks iron, nickel and cobalt scrap out of a mixed pile.', xa: 'ذرات الحديد والنيكل والكوبالت بتصطف = المغناطيسية.', xe: 'Iron, nickel and cobalt atoms aligning = ferromagnetism.' },
  { a: 'melting', d: ['castability', 'expansion', 'thermal'], pic: () => icon('melting'), ar: 'الطاقة اللازمة عشان سبيكة صلبة تتحول لسايل.', en: 'The energy needed to turn a solid ingot into a liquid.', xa: 'طاقة تفصل الذرات، من صلب لسايل = نقطة الانصهار.', xe: 'Energy to separate the atoms, solid to liquid = melting point.' },
  { a: 'corrosion', d: ['hardness', 'toughness', 'weldability'], pic: () => bare(rustArt()), ar: 'سور جنب البحر لازم يقاوم الأكسجين والملح اللي بياكلوا سطحه.', en: 'A seaside railing must resist the oxygen and salt that eat its surface.', xa: 'يقاوم تلف السطح من الأكسجين والكيماويات = مقاومة التآكل.', xe: 'Resists surface attack by oxygen and chemicals = corrosion resistance.' },
  { a: 'color', d: ['opacity', 'density', 'corrosion'], pic: () => icon('color'), ar: 'مصمم اختار معدن عشان شكله الدهبي الدافي: الطول الموجي اللي بيعكسه.', en: 'A designer picks a metal for its warm golden look: the wavelength it reflects.', xa: 'الطول الموجي اللي بيرتد = اللون.', xe: 'The characteristic reflected wavelength = color.' },
  { a: 'corrosion', d: ['toughness', 'hardness', 'expansion'], pic: () => bare(uvArt()), ar: 'كرسي بلاستيك في الشمس سنين: لونه بهت وبقى يقصف.', en: 'A plastic garden chair fades and turns brittle after years in the sun.', xa: 'السلايد: في البلاستيك، الأشعة فوق البنفسجية والرطوبة بيعملوا degradation (جملة مقاومة التآكل).', xe: 'The slide: in plastics, ultraviolet light and moisture cause degradation (the corrosion-resistance note).' }
];
const W1 = {
  ar: { title: 'مخبر الخواص', en: 'Property detective', how: 'حالة من الورشة، وانت تقول الخاصية: صلادة؟ مطيلية؟ تمدد حراري؟ ١٠ حالات، و١٢ ثانية للحالة. اضغط <b>1</b> لـ <b>4</b>.',
    intro: { title: 'مخبر الخواص', text: 'كل حالة فيها معدن أو خامة شغالة في حتة. اقرا الحالة، واختار الخاصية اللي بتتكلم عنها. الاختيارات فيها خواص شبه بعض مخصوص.', rules: ['دوّر على الكلمة المفتاح: سلك؟ صاج؟ خبطة؟ خدش؟', 'بعد كل إجابة، المسرح بيوريك الخاصية الصح.', 'السرعة بتكسب كومبو.'] },
    prompt: 'أنهي خاصية؟',
    wins: [[1, 'ولا غلطة.', 'انت كده تعرف شخصية كل معدن.'], [.8, 'جامد.', 'شوية تركيز في الشبيهين وتبقى كاملة.'], [.5, 'مش بطال.', 'راجع فصل المطيلية والمطاوعة، وفصل امتصاص الصدمات.'], [0, 'لسه.', 'لف على الدرس الأول، وبعدين ارجع للتحقيق.']] },
  en: { title: 'Property detective', en: 'Property detective', how: 'A case from the shop floor; you name the property. Hardness? Ductility? Thermal expansion? 10 cases, 12 seconds each. Press <b>1</b> to <b>4</b>.',
    intro: { title: 'Property detective', text: 'Each case shows a metal or a material doing a job. Read the case and pick the property it is about. The options include look-alikes on purpose.', rules: ['Look for the key word: wire? sheet? blow? scratch?', 'After each answer, the stage shows the right property.', 'Speed builds a combo.'] },
    prompt: 'Which property?',
    wins: [[1, 'Not one mistake.', 'You know every metal’s character now.'], [.8, 'Strong.', 'A little more care with the look-alikes and it’s perfect.'], [.5, 'Not bad.', 'Review ductility vs malleability, and resilience.'], [0, 'Not yet.', 'Go through the lesson first, then come back to the case.']] }
};
function detectiveTrial(lang) {
  const w = W1[lang];
  return {
    id: 'props-detective', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      const set = shuffle(CASES).slice(0, 10);
      const rounds = set.map(c => ({
        prompt: w.prompt, sub: c[lang], art: c.pic(),
        choices: shuffle([c.a, ...c.d]).map(k => ({ html: `<b>${name(k, lang)}</b>${lang === 'ar' ? `<small dir="ltr">${P[k][1]}</small>` : ''}`, ok: k === c.a, label: name(k, lang) })),
        explain: lang === 'ar' ? c.xa : c.xe
      }));
      // the stage shows the right property after each answer (the engine plays exactly one good/bad sound per answer)
      let n = 0; const A = Object.create(api);
      A.sfx = s => { api.sfx(s); if ((s === 'good' || s === 'bad') && set[n]) { api.scene(P[set[n].a][2]); n++; } };
      el.innerHTML = '<div class="prp-qf"></div>';
      return quickfire(el.firstChild, A, ctx, { id: 'props-detective', intro: w.intro, rounds, time: 12, layout: 'grid', wins: w.wins });
    }
  };
}

/* ---------- 2 · Mechanical or physical? ---------- */
const MECH = ['strength', 'tensile', 'elasticity', 'plasticity', 'yield', 'hardness', 'ductility', 'brittleness', 'bending', 'toughness', 'malleability', 'castability', 'resilience', 'machinability', 'weldability'];
const PHYS = ['opacity', 'color', 'density', 'electrical', 'thermal', 'expansion', 'magnet', 'melting', 'corrosion'];
const SLIDE = { strength: 'S4', tensile: 'S5', elasticity: 'S6', plasticity: 'S7', yield: 'S10', hardness: 'S11', ductility: 'S11', brittleness: 'S11', bending: 'S11', toughness: 'S12', malleability: 'S12', castability: 'S12', resilience: 'S13', machinability: 'S13', weldability: 'S13', opacity: 'S14', color: 'S14', density: 'S14', electrical: 'S14', thermal: 'S14', expansion: 'S15', magnet: 'S15', melting: 'S15', corrosion: 'S15' };
const W2 = {
  ar: { title: 'ميكانيكي ولا فيزيائي؟', en: 'Mechanical or physical?', how: 'كروت خواص نازلة واحد ورا التاني. ارمي كل كارت في صندوقه: ميكانيكي (بيتغير بالتشغيل والمعالجة الحرارية) ولا فيزيائي (أصيل وثابت). ١٤ كارت. <b>1</b> و<b>2</b> أو الأسهم.',
    mech: 'ميكانيكية', mechS: 'بتتغير بالتشغيل والمعالجة الحرارية', phys: 'فيزيائية', physS: 'أصيلة، وصعب تتغير',
    card: 'كارت', score: 'صح', right: 'صح.', wrong: 'لأ.', timeUp: 'الوقت خلص.', is: k => `${name(k, 'ar')} ${MECH.includes(k) ? 'ميكانيكية' : 'فيزيائية'}: في سلايد ${SLIDE[k].slice(1)} ${MECH.includes(k) ? 'مع الخواص الميكانيكية' : 'مع الخواص الفيزيائية'}.`,
    review: 'الخريطة كلها', lines: ['ولا كارت في الصندوق الغلط.', 'كويس. راجع الكروت اللي وقعت منك تحت.', 'لسه بتتلخبط. افتكر: سلايد 4 لـ 13 ميكانيكي، و14 و15 فيزيائي.'] },
  en: { title: 'Mechanical or physical?', en: 'Mechanical or physical?', how: 'Property cards come down one at a time. Throw each into its bin: mechanical (changed by work hardening and heat treatment) or physical (inherent, hard to change). 14 cards. <b>1</b> and <b>2</b>, or the arrow keys.',
    mech: 'Mechanical', mechS: 'changed by work hardening and heat treatment', phys: 'Physical', physS: 'inherent, not easily altered',
    card: 'Card', score: 'Right', right: 'Right.', wrong: 'No.', timeUp: 'Time’s up.', is: k => `${name(k, 'en')} is ${MECH.includes(k) ? 'mechanical' : 'physical'}: slide ${SLIDE[k].slice(1)}, with the ${MECH.includes(k) ? 'mechanical' : 'physical'} properties.`,
    review: 'The whole map', lines: ['Not one card in the wrong bin.', 'Good. Check the cards you dropped, below.', 'Still mixing them up. Remember: slides 4–13 are mechanical; 14 and 15 are physical.'] }
};
function sortTrial(lang) {
  const w = W2[lang];
  return {
    id: 'props-sort', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      const N = 14, LIMIT = reduced() ? 12000 : 8000;
      const deck = shuffle(shuffle(MECH).slice(0, 7).concat(shuffle(PHYS).slice(0, 7)));
      let i = 0, score = 0, locked = false, raf = 0, onKey = null; const timers = new Set(), missed = [];
      const counts = { mech: 0, phys: 0 };
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
      const stop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers.clear(); if (onKey) document.removeEventListener('keydown', onKey); onKey = null; };
      el.innerHTML = `<div class="g-card prp-st">
        <div class="g-hud"><span class="chip">${w.card} <span class="hud-num prp-st__i" dir="ltr">1/${N}</span></span><span class="chip chip--zone">${w.score} <span class="hud-num prp-st__s">0</span></span></div>
        <div class="g-timer"><i></i></div>
        <div class="prp-st__lane"><div class="prp-st__card" aria-live="polite"></div></div>
        <div class="prp-st__bins">
          <button type="button" class="prp-st__bin" data-b="mech"><span class="hud-num prp-st__k">1</span><b>${w.mech}</b><small>${w.mechS}</small><span class="hud-num prp-st__n">0</span></button>
          <button type="button" class="prp-st__bin" data-b="phys"><span class="hud-num prp-st__k">2</span><b>${w.phys}</b><small>${w.physS}</small><span class="hud-num prp-st__n">0</span></button>
        </div>
        <p class="prp-st__fb" aria-live="polite"></p></div>`;
      const card = el.querySelector('.prp-st__card'), fb = el.querySelector('.prp-st__fb'), bar = el.querySelector('.g-timer i'), bins = [...el.querySelectorAll('.prp-st__bin')];
      const deal = () => {
        locked = false; const k = deck[i];
        el.querySelector('.prp-st__i').textContent = `${i + 1}/${N}`;
        card.className = 'prp-st__card'; void card.offsetWidth; card.classList.add('is-in');
        card.innerHTML = `<b dir="ltr">${P[k][1]}</b>${lang === 'ar' ? `<span>${P[k][0]}</span>` : ''}`;
        const t0 = performance.now(); cancelAnimationFrame(raf);
        const tick = now => { if (locked) return; const left = 1 - (now - t0) / LIMIT; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) { drop(null); return; } raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      };
      const drop = b => {
        if (locked) return; locked = true; cancelAnimationFrame(raf);
        const k = deck[i], truth = MECH.includes(k) ? 'mech' : 'phys', ok = b === truth;
        if (b) card.classList.add(b === 'mech' ? 'is-to-a' : 'is-to-b');
        const bin = bins.find(x => x.dataset.b === (b || truth));
        if (ok) { score++; counts[truth]++; bin.querySelector('.prp-st__n').textContent = counts[truth]; api.sfx('good'); api.burst(bin, 'var(--good)', 8); fb.innerHTML = `<b class="prp-ok">${w.right}</b> ${w.is(k)}`; }
        else { missed.push(k); api.sfx('bad'); if (b) api.shake(bin); fb.innerHTML = `<b class="prp-no">${b ? w.wrong : w.timeUp}</b> ${w.is(k)}`; }
        el.querySelector('.prp-st__s').textContent = score;
        later(() => { i++; if (i < N) deal(); else finish(); }, ok ? (reduced() ? 900 : 1000) : 2300);
      };
      const finish = () => {
        stop();
        const col = (list, t) => `<div class="prp-st__col"><p class="label">${t}</p><div>${list.map(k => `<span class="chip${missed.includes(k) ? ' chip--bad' : ''}" dir="ltr">${P[k][1]}</span>`).join('')}</div></div>`;
        endCard(el, api, ctx, 'props-sort', score, N, w.lines, lang, `<div class="prp-st__map"><p class="label">${w.review}</p><div class="prp-st__cols">${col(MECH, w.mech)}${col(PHYS, w.phys)}</div></div>`);
      };
      bins.forEach(b => b.addEventListener('click', () => drop(b.dataset.b)));
      onKey = e => {
        if (e.key === '1') { e.preventDefault(); drop('mech'); }
        else if (e.key === '2') { e.preventDefault(); drop('phys'); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); const r = bins.map(x => x.getBoundingClientRect().left); const leftBin = r[0] < r[1] ? 'mech' : 'phys'; drop(e.key === 'ArrowLeft' ? leftBin : (leftBin === 'mech' ? 'phys' : 'mech')); }
      };
      document.addEventListener('keydown', onKey);
      deal();
      return stop;
    }
  };
}

/* ---------- 3 · Spot the swap ---------- */
const DEFS = [
  { t: 'ductility', c: ['Ductility is the ability of a material', 'to be deformed plastically', 'without rupture under tensile load.', 'Due to this property material can lengthy', { w: 'into sheets', r: 'into fine wire' }, 'without fracture.'], ar: '«into sheets» بتاعة المطاوعة. المطيلية = سلك رفيع.', en: '“Into sheets” belongs to malleability. Ductility means fine wire.' },
  { t: 'malleability', c: ['Malleability is the property of a material', 'which allow the material', { w: 'to be drawn into fine wire.', r: 'to be rolled or hammered into sheets.' }, 'Soft steel and wrought iron', 'are examples of malleable materials.'], ar: 'السلك بتاع المطيلية. المطاوعة = درفلة أو طرق لألواح.', en: 'Fine wire is ductility. Malleability means rolled or hammered into sheets.' },
  { t: 'brittleness', c: ['Brittleness is the property of a material', { w: 'opposite to malleability.', r: 'opposite to ductility.' }, 'So cast iron', 'is a brittle material.'], ar: 'القصافة عكس **المطيلية**، مش المطاوعة.', en: 'Brittleness is the opposite of **ductility**, not malleability.' },
  { t: 'toughness', c: ['Toughness is the property of a material', 'to resist fracture', 'against impact load like hammer blows.', 'This property of material', { w: 'is increased when they heated.', r: 'is decreased when they heated.' }], ar: 'المتانة **بتقل** بالحرارة (decreased).', en: 'Toughness **decreases** when heated.' },
  { t: 'resilience', c: ['Resilience is a property of material', 'to absorb energy', 'and to resist shock and impact loads.', 'It is measured by the energy absorbed per unit volume', { w: 'within the plastic range.', r: 'within the elastic limit.' }], ar: 'امتصاص الصدمات بيتقاس **جوه حد المرونة**.', en: 'Resilience is measured **within the elastic limit**.' },
  { t: 'hardness', c: ['Hardness', 'is the ability of a material', 'to resist', { w: 'fracture against hammer blows.', r: 'penetration and scratching.' }], ar: 'خبط الشاكوش بتاع المتانة. الصلادة = غرز وخدش.', en: 'Hammer blows belong to toughness. Hardness means penetration and scratching.' },
  { t: 'bending', c: ['Bending is characterized by', 'the outside fibers of a beam', { w: 'in compression and the inside fibers in tension.', r: 'in tension and the inside fibers in compression.' }], ar: 'اتقلبت: بره **شد**، وجوه **ضغط**.', en: 'Flipped: outside in **tension**, inside in **compression**.' },
  { t: 'castability', c: ['Castability of metal refer to the ease', 'with which it can be cast into different shapes', 'and is concerned with the behavior of metal', { w: 'in its solid state.', r: 'in its molten state.' }], ar: 'القابلية للصب بتتكلم عن المعدن **وهو سايح**.', en: 'Castability is about the metal in its **molten** state.' },
  { t: 'machinability', c: ['The ease with which a given material', 'may be worked or shaped with a cutting tool', 'is called machinability.', 'Machinability depends on chemical composition,', { w: 'physical properties and heat treatment.', r: 'structure and mechanical properties.' }], ar: 'الخواص الفيزيائية والمعالجة الحرارية دول بتوع اللحام.', en: 'Physical properties and heat treatment belong to weldability.' },
  { t: 'weldability', c: ['It is the ability of material', 'to be joined by welding.', 'Weldability depends on chemical composition,', { w: 'structure', r: 'physical properties' }, 'and heat treatment to which they are subjected.'], ar: 'البنية (structure) بتاعة التشغيل. اللحام = خواص فيزيائية.', en: 'Structure belongs to machinability. Weldability needs physical properties.' },
  { t: 'physical', c: ['Physical properties are inherent aspects of a material', { w: 'that are easily altered.', r: 'that are generally not easily altered.' }, 'Physical properties generally remain intact,', 'whereas mechanical properties are changed', 'by work hardening and/or through heat treatment.'], ar: 'الفيزيائية **صعب تتغير**. الميكانيكية هي اللي بتتغير.', en: 'Physical properties are **not easily altered**; the mechanical ones change.' },
  { t: 'expansion', c: ['Generally, the coefficient of thermal expansion', 'is inversely proportional', 'to the melting point of a material:', { w: 'higher-melt temperature materials have more expansion.', r: 'higher-melt temperature materials have less expansion.' }, 'Steel is a significant exception.'], ar: 'عكسي: انصهار أعلى = تمدد **أقل**.', en: 'Inverse: higher melting point, **less** expansion.' },
  { t: 'magnet', c: ['Ferromagnetism is the alignment of', { w: 'iron, copper, and aluminium atoms', r: 'iron, nickel, and cobalt atoms' }, 'into domains.'], ar: 'حَنَك: حديد، ونيكل، وكوبالت.', en: 'Iron, nickel and cobalt: nothing else on the slide.' },
  { t: 'thermal', c: ['Thermal conductivity', 'is the ease', { w: 'with which a material conducts a current.', r: 'with which heat flows within and through a material.' }], ar: 'التيار بتاع التوصيل الكهربي. الحراري = حرارة.', en: 'Current belongs to electrical conductivity. Thermal means heat.' },
  { t: 'corrosion', c: ['Corrosion resistance is the ability', 'to resist surface deterioration', { w: 'caused primarily by ultraviolet light,', r: 'caused primarily by oxygen,' }, 'chemicals, or other agents.'], ar: 'الأشعة فوق البنفسجية مذكورة للبلاستيك. السبب الأساسي: الأكسجين.', en: 'Ultraviolet light is named for plastics. The main cause is oxygen.' },
  { t: 'melting', c: ['Melting point is the energy required', { w: 'to join a material’s atoms,', r: 'to separate a material’s atoms,' }, 'changing its state from solid to liquid.'], ar: 'الطاقة بت**فصل** الذرات، مش بتلزقها.', en: 'The energy **separates** the atoms; it doesn’t join them.' },
  { t: 'density', c: ['Density is', { w: 'weight per unit area', r: 'weight per unit volume' }, '(specific gravity).'], ar: 'الكثافة = وزن في وحدة **الحجم**.', en: 'Density is weight per unit **volume**.' }
];
const W3 = {
  ar: { title: 'لقط الكلمة الغلط', en: 'Spot the swap', how: 'تعريف من السلايد، بس فيه جملة اتبدّلت بكلام خاصية شبهها. دوس على الجملة الغلط. ٨ تعريفات. الأرقام <b>1</b> لـ <b>6</b> شغالة.',
    prompt: 'فيه جملة غلط. دوس عليها.', round: 'تعريف', score: 'صح', right: 'لقطتها.', wrong: 'لأ، دي سليمة.', should: 'الصح:', next: 'اللي بعده', finish: 'النتيجة',
    lines: ['حافظ السلايدات بالحرف.', 'كويس. الشبيهين بقوا أوضح.', 'الكلمات الصغيرة هي اللي بتفرق. ارجع للفخاخ في الدرس.'] },
  en: { title: 'Spot the swap', en: 'Spot the swap', how: 'A definition from the slides, but one phrase was swapped with words from a look-alike property. Tap the wrong phrase. 8 definitions. Keys <b>1</b> to <b>6</b> work.',
    prompt: 'One phrase is wrong. Tap it.', round: 'Definition', score: 'Right', right: 'Got it.', wrong: 'No, that one is fine.', should: 'It should say:', next: 'Next', finish: 'See your score',
    lines: ['You know the slides word for word.', 'Good. The look-alikes are getting clearer.', 'The small words make the difference. Go back to the traps in the lesson.'] }
};
function swapTrial(lang) {
  const w = W3[lang];
  return {
    id: 'props-swap', title: w.title, en: lang === 'ar' ? w.en : '', how: w.how,
    mount(el, api, ctx) {
      const N = 8, set = shuffle(DEFS).slice(0, N);
      let i = 0, score = 0, locked = false, onKey = null; const timers = new Set();
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
      const setKeys = fn => { if (onKey) document.removeEventListener('keydown', onKey); onKey = fn; if (fn) document.addEventListener('keydown', fn); };
      const stop = () => { timers.forEach(clearTimeout); timers.clear(); setKeys(null); };
      const tname = k => k === 'physical' ? (lang === 'ar' ? 'الخواص الفيزيائية' : 'Physical properties') : name(k, lang);
      function round() {
        locked = false; const D = set[i], bad = D.c.findIndex(x => typeof x === 'object');
        el.innerHTML = `<div class="g-card prp-sw">
          <div class="g-hud"><span class="chip">${w.round} <span class="hud-num" dir="ltr">${i + 1}/${N}</span></span><span class="chip chip--zone">${w.score} <span class="hud-num">${score}</span></span></div>
          <p class="g-prompt prp-sw__q">${w.prompt}</p>
          <p class="prp-sw__term">${tname(D.t)}${lang === 'ar' ? ` <bdi dir="ltr">${D.t === 'physical' ? 'Physical properties' : P[D.t][1]}</bdi>` : ''}</p>
          <div class="prp-sw__def" dir="ltr">${D.c.map((x, n) => `<button type="button" class="prp-sw__ch" data-n="${n}"><span class="prp-sw__k" aria-hidden="true">${n + 1}</span>${typeof x === 'object' ? x.w : x}</button>`).join(' ')}</div>
          <p class="prp-sw__fb" aria-live="polite"></p>
          <div class="g-acts prp-sw__acts" hidden><button type="button" class="btn btn--zone prp-sw__next">${i + 1 < N ? w.next : w.finish}</button></div></div>`;
        const chunks = [...el.querySelectorAll('.prp-sw__ch')];
        const pick = n => {
          if (locked || n >= chunks.length) return; locked = true;
          const ok = n === bad, swap = D.c[bad];
          chunks.forEach(b => { b.disabled = true; });
          chunks[bad].classList.add('is-swap'); if (!ok) chunks[n].classList.add('is-wrong');
          chunks[bad].insertAdjacentHTML('afterend', ` <span class="prp-sw__fix">${swap.r}</span>`);
          if (ok) { score++; api.sfx('good'); api.burst(chunks[bad], 'var(--good)', 10); } else { api.sfx('bad'); api.shake(chunks[n]); }
          el.querySelector('.g-hud .chip--zone .hud-num').textContent = score;
          el.querySelector('.prp-sw__fb').innerHTML = `<b class="${ok ? 'prp-ok' : 'prp-no'}">${ok ? w.right : w.wrong}</b> ${D[lang].replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}`;
          if (P[D.t]?.[2]) api.scene(P[D.t][2]);
          el.querySelector('.prp-sw__acts').hidden = false;
          const nx = el.querySelector('.prp-sw__next'); nx.addEventListener('click', next); later(() => nx.focus({ preventScroll: true }), 30);
          setKeys(e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); next(); } });
        };
        chunks.forEach((b, n) => b.addEventListener('click', () => pick(n)));
        setKeys(e => { const n = '123456'.indexOf(e.key); if (n >= 0 && e.key.length === 1) { e.preventDefault(); pick(n); } });
      }
      function next() { setKeys(null); i++; if (i < N) round(); else { stop(); endCard(el, api, ctx, 'props-swap', score, N, w.lines, lang); } }
      round();
      return stop;
    }
  };
}

export const propsTrials = lang => [detectiveTrial(lang), sortTrial(lang), swapTrial(lang)];
