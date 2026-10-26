// Materials zone trials, both editions (games/materials.js → makeTrials('ar'), materials.en.js → makeTrials('en')).
//  1 · materials-stockroom «المخزن / The stockroom» — a delivery of 14 materials, five shelves of the L2 · S2 tree, a clock
//  2 · materials-tree      «ابني الشجرة / Rebuild the tree» — fill the L1 · S4 tree, the metals chart, then the L2 · S2 tree
//  3 · materials-pure      «نقي ولا سبيكة؟ / Pure or alloy?» — quick-fire on the six bullets of L1 · S6
import { marks } from '../ui/icons.js';
import { quickfire } from './_cte-kit.js';
import { L2_LEAVES, L2_GROUPS, latticeSVG } from '../content/lessons/_materials-kit.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const bdi = s => `<bdi class="en" dir="ltr">${s}</bdi>`;
function fitView(el) {
  requestAnimationFrame(() => { if (el.getBoundingClientRect().bottom <= innerHeight) return; (el.previousElementSibling || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); });
}
const WORDS = {
  ar: { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات', crate: 'صندوق', score: 'نقط', combo: 'كومبو', right: 'صح.', wrong: 'لأ.', timeUp: 'الوقت خلص.', tree: 'شجرة', slips: 'غلطات', here: 'إيه اللي ييجي هنا؟', done: 'الشجرة كملت!', placed: 'اتحطت مكانها:', notHere: 'مش هنا.', under: 'مكانها تحت' },
  en: { result: 'Your score', again: 'Play again', back: 'All trials', crate: 'Crate', score: 'Score', combo: 'Combo', right: 'Right.', wrong: 'Nope.', timeUp: 'Time’s up.', tree: 'Tree', slips: 'Slips', here: 'What goes here?', done: 'Tree complete!', placed: 'Placed for you:', notHere: 'Not here.', under: 'It belongs under' }
};
function endCard(el, api, ctx, { id, score, max, lines, W }) {
  el._matStop?.();
  const pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end mat-end">
    <span class="glyph">${api.GLYPH.lattice}</span>
    <p class="label">${W.result}</p>
    <h3 dir="ltr"><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="mat-end__marks"></div>
    <p>${pct >= .95 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
    <p class="mat-end__xp"></p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('h3'));
  el.querySelector('.mat-end__marks').innerHTML = marks(r.stars, 3, 'marks--big');
  el.querySelector('.mat-end__xp').innerHTML = `<span class="chip chip--zone"><span class="hud-num" dir="ltr">+${r.xp} XP</span></span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}

/* =====================================================================================================
   1 · The stockroom — sort 14 materials onto the five shelves of L2 · S2 (keys 1–5), against the clock
   ===================================================================================================== */
const SHELVES = ['ferrous', 'nonferrous', 'thermoset', 'thermoplastic', 'ceramics'];
const SHELF_SUB = { ferrous: 'contains iron', nonferrous: 'contains no iron', thermoset: 'polymer', thermoplastic: 'polymer', ceramics: 'non-metal' };
function stockroomTrial(lang) {
  const en = lang === 'en'; const W = WORDS[lang];
  return {
    id: 'materials-stockroom', title: en ? 'The stockroom' : 'المخزن', en: en ? 'Sort the delivery' : 'The stockroom',
    how: en ? 'A delivery of 14 materials. Put each crate on its shelf of the Lecture 2 tree: ferrous, non-ferrous, thermosetting, thermoplastic or ceramics (keys 1–5). 10 seconds a crate.'
      : 'وصلت شحنة فيها ١٤ خامة. حط كل صندوق على رفّه في شجرة المحاضرة التانية: حديدي، غير حديدي، <en>thermosetting</en>، <en>thermoplastic</en>، ولا سيراميك (زراير 1–5). ١٠ ثواني لكل صندوق.',
    mount(el, api, ctx) {
      const items = shuffle(L2_LEAVES.filter(l => !l.odd)).slice(0, 14);
      const N = items.length, LIMIT = reduced() ? 15000 : 10000;
      let i = 0, score = 0, combo = 0, best = 0, locked = false, raf = 0, timers = [], lastScene = '';
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      const bin = (g, k) => `<button type="button" class="mat-sr__bin" data-g="${g}"><span class="mat-key">${k}</span><b>${L2_GROUPS[g].en}</b><small>${SHELF_SUB[g]}</small><span class="mat-sr__n hud-num">0</span></button>`;
      el.innerHTML = `<div class="mat-sr">
        <div class="g-hud"><span class="chip">${W.crate} <span class="hud-num" data-r>1</span>/<span class="hud-num">${N}</span></span><span class="mat-sr__hr"><span class="chip mat-sr__combo" hidden>${W.combo} <span class="hud-num">×0</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></span></div>
        <div class="g-timer"><i style="--t:1"></i></div>
        <div class="g-card mat-sr__crate" aria-live="polite"><b dir="ltr"></b><small></small></div>
        <div class="mat-sr__board" dir="ltr">
          <section class="mat-sr__grp"><h6>METALS</h6><div class="mat-sr__bins mat-sr__bins--m">${bin('ferrous', 1)}${bin('nonferrous', 2)}</div></section>
          <section class="mat-sr__grp"><h6>NON-METALS</h6><div class="mat-sr__bins mat-sr__bins--n"><span class="mat-sr__poly">POLYMERS</span>${bin('thermoset', 3)}${bin('thermoplastic', 4)}${bin('ceramics', 5)}</div></section>
        </div>
        <p class="mat-sr__fb" aria-live="polite"></p>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s);
      const bins = Object.fromEntries([...el.querySelectorAll('.mat-sr__bin')].map(b => [b.dataset.g, b]));
      const bar = $('.g-timer i'), fb = $('.mat-sr__fb'), crate = $('.mat-sr__crate');
      function show() {
        locked = false; const it = items[i];
        $('[data-r]').textContent = i + 1;
        crate.querySelector('b').textContent = it.long || it.en;
        crate.querySelector('small').textContent = en ? '' : it.ar;
        crate.classList.remove('is-in'); void crate.offsetWidth; crate.classList.add('is-in');
        Object.values(bins).forEach(b => b.classList.remove('is-right', 'is-wrong'));
        fb.innerHTML = '';
        const t0 = performance.now();
        const tick = now => { if (locked) return; const left = 1 - (now - t0) / LIMIT; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) { answer(null); return; } raf = requestAnimationFrame(tick); };
        cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
      }
      function answer(g) {
        if (locked) return; locked = true; cancelAnimationFrame(raf);
        const it = items[i]; const ok = g === it.g; const grp = L2_GROUPS[it.g];
        bins[it.g].classList.add('is-right');
        if (ok) { score++; combo++; best = Math.max(best, combo); const n = bins[g].querySelector('.mat-sr__n'); n.textContent = +n.textContent + 1; api.sfx('good'); api.burst(bins[g], '#46E3A0', 10); }
        else { combo = 0; if (g) { bins[g].classList.add('is-wrong'); api.shake(bins[g]); } api.sfx('bad'); }
        $('[data-s]').textContent = score;
        const cb = $('.mat-sr__combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
        fb.innerHTML = `<b class="${ok ? 'mat-ok' : 'mat-no'}">${g === null ? W.timeUp : ok ? W.right : W.wrong}</b> ${bdi(`${it.en} → ${grp.path.join(' → ')}`)}${en ? '' : ` <span>(${grp.ar})</span>`}`;
        if (grp.scene !== lastScene) { lastScene = grp.scene; api.scene(grp.scene); }
        later(() => { i++; if (i < N) show(); else endCard(el, api, ctx, { id: 'materials-stockroom', score, max: N, W, lines: en
          ? [`Every crate on its shelf. Longest run: ${best}.`, 'A tidy stockroom. Check the misses against the Lecture 2 tree.', 'The shelves are mixed up. Tap through the path demo in “Metal or non-metal?”, then try again.']
          : [`كل صندوق على رفّه. أطول كومبو: ${best}.`, 'مخزن مترتب. راجع اللي غلطت فيه على شجرة المحاضرة التانية.', 'الرفوف متلخبطة. افتح ديمو الطريق في فصل «معادن ولا لا معادن؟» وجرّب تاني.'] }); }, ok ? (reduced() ? 1100 : 950) : 2300);
      }
      Object.entries(bins).forEach(([g, b]) => b.addEventListener('click', () => answer(g)));
      const onKey = e => { const k = '12345'.indexOf(e.key); if (k >= 0) { e.preventDefault(); answer(SHELVES[k]); } };
      document.addEventListener('keydown', onKey);
      show();
      return (el._matStop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; document.removeEventListener('keydown', onKey); });
    }
  };
}

/* =====================================================================================================
   2 · Rebuild the tree — three trees, one empty box at a time; pick its label (keys 1–6)
   ===================================================================================================== */
const TREES = [
  { name: 'Materials · L1 · S4', scene: 'materialsTree', head: 'Materials', rows: [
    { label: 'Metals', need: ['Ferrous', 'Nonferrous'] },
    { label: 'Plastics', need: ['Thermoset', 'Thermoplastic'] },
    { label: 'Rubber/Elastomers', need: ['Thermoset', 'Thermoplastic'] },
    { label: 'Natural Engineering Materials', need: ['Engineering Ceramics', 'Glass', 'Manufactured Carbon', 'Refractory Hard Metals'] }],
    decoys: ['Ceramics', 'Powdered Metallurgy', 'Polymers'] },
  { name: 'Metals chart · L1 · S6', scene: 'metalsChart', rows: [{ label: 'Metals', need: ['Ferrous', 'Nonferrous', 'Powdered Metallurgy'] }],
    decoys: ['Cast Irons', 'Alloy Steels', 'Refractory Hard Metals'] },
  { name: 'Engineering materials · L2 · S2', scene: 'classTree', reveal: true, rows: [
    { label: 'Engineering Materials', need: ['Metals', 'Non-metals'] },
    { label: 'Metals', need: ['Ferrous', 'Non-ferrous'] },
    { label: 'Non-metals', need: ['Polymers', 'Ceramics'] },
    { label: 'Polymers', need: ['Thermosetting', 'Thermoplastic'] }],
    decoys: ['Plastics', 'Rubber/Elastomers', 'Natural Engineering Materials'] }
];
const DECOY_WHY = {
  Ceramics: { ar: '«Ceramics» لوحدها من شجرة المحاضرة التانية. هنا اسمها Engineering Ceramics.', en: '“Ceramics” alone is the Lecture 2 name. In this tree it is “Engineering Ceramics”.' },
  'Powdered Metallurgy': { ar: 'ده الفرع المتقطع في شجرة المعادن، مش في الشجرة دي.', en: 'That’s the dashed branch of the metals chart, not this tree.' },
  Polymers: { ar: 'Polymers اسم المحاضرة التانية. المحاضرة الأولى بتقول Plastics.', en: '“Polymers” is the Lecture 2 name. Lecture 1 says Plastics.' },
  'Cast Irons': { ar: 'الحديد الزهر نوع من الـ Ferrous، مش فرع لوحده في الشجرة دي.', en: 'Cast irons are one kind of ferrous metal, not a branch of this chart.' },
  'Alloy Steels': { ar: 'الصلب السبائكي نوع من الـ Ferrous، مش فرع لوحده في الشجرة دي.', en: 'Alloy steels are one kind of ferrous metal, not a branch of this chart.' },
  'Refractory Hard Metals': { ar: 'دي تحت Natural Engineering Materials في شجرة المحاضرة الأولى.', en: 'That sits under Natural Engineering Materials in the Lecture 1 tree.' },
  Plastics: { ar: 'المحاضرة التانية بتقول Polymers، مش Plastics.', en: 'Lecture 2 says Polymers, not Plastics.' },
  'Rubber/Elastomers': { ar: 'المطاط عيلة في شجرة المحاضرة الأولى بس.', en: 'Rubber is a family only in the Lecture 1 tree.' },
  'Natural Engineering Materials': { ar: 'دي عيلة في شجرة المحاضرة الأولى بس.', en: 'That family exists only in the Lecture 1 tree.' }
};
function treeTrial(lang) {
  const en = lang === 'en'; const W = WORDS[lang];
  return {
    id: 'materials-tree', title: en ? 'Rebuild the tree' : 'ابني الشجرة', en: en ? 'Three trees, box by box' : 'Rebuild the tree',
    how: en ? 'Three trees from the slides, with empty boxes: the Lecture 1 materials tree, the metals chart, the Lecture 2 classification. Pick what goes in the glowing box (keys 1–6). Watch out for names from the other tree.'
      : 'تلات شجرات من السلايدات، وفيها صناديق فاضية: شجرة المحاضرة الأولى، وشجرة المعادن، وتصنيف المحاضرة التانية. اختار اللي ييجي في الصندوق المنوّر (زراير 1–6). وخلّي بالك من أسامي الشجرة التانية.',
    mount(el, api, ctx) {
      const MAX = TREES.reduce((s, t) => s + t.rows.reduce((a, r) => a + r.need.length, 0), 0);
      let ti = 0, score = 0, slips = 0, locked = false, timers = [], filled, cur, tries, opts;
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      el.innerHTML = `<div class="mat-tb">
        <div class="g-hud"><span class="chip">${W.tree} <span class="hud-num" data-t>1</span>/<span class="hud-num">${TREES.length}</span></span><span class="mat-sr__hr"><span class="chip">${W.slips} <span class="hud-num" data-m>0</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span>/<span class="hud-num">${MAX}</span></span></span></div>
        <div class="g-card mat-tb__card"><p class="mat-tb__name" dir="ltr"></p><div class="mat-tb__tree" dir="ltr"></div></div>
        <p class="mat-tb__q">${W.here}</p>
        <div class="g-choices mat-tb__ch"></div>
        <p class="mat-tb__fb" aria-live="polite"></p>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s);
      const T = () => TREES[ti];
      const slotsOf = t => t.rows.flatMap((r, ri) => r.need.map((_, si) => ({ ri, si })));
      function startTree() {
        filled = T().rows.map(r => r.need.map(() => null)); cur = 0; tries = 0;
        $('[data-t]').textContent = ti + 1; $('.mat-tb__name').textContent = T().name;
        api.scene(T().scene); next();
      }
      function drawTree() {
        const t = T(); const slots = slotsOf(t); const at = slots[cur];
        $('.mat-tb__tree').innerHTML = `${t.head ? `<p class="mat-tb__head">${t.head}</p>` : ''}${t.rows.map((r, ri) => {
          if (t.reveal && ri > 0 && !(at && ri <= at.ri) && !filled[ri].some(Boolean)) return '';
          return `<div class="mat-tb__row"><b>${r.label}</b><span class="mat-tb__slots">${r.need.map((_, si) => { const f = filled[ri][si]; const isCur = at && at.ri === ri && at.si === si; return `<span class="mat-tb__slot${f ? ' is-full' : ''}${f && f.auto ? ' is-auto' : ''}${isCur ? ' is-cur' : ''}">${f ? f.name : isCur ? '?' : ''}</span>`; }).join('')}</span></div>`;
        }).join('')}`;
      }
      function next() {
        locked = false; tries = 0;
        const t = T(); const slots = slotsOf(t);
        if (cur >= slots.length) { drawTree(); $('.mat-tb__ch').innerHTML = ''; $('.mat-tb__fb').innerHTML = `<b class="mat-ok">${W.done}</b> ${bdi(t.name)}`; api.sfx('level'); locked = true; later(() => { ti++; if (ti < TREES.length) startTree(); else finish(); }, 1700); return; }
        drawTree();
        const at = slots[cur]; const row = t.rows[at.ri];
        const remainingRow = [...new Set(row.need.filter((_, k) => !filled[at.ri][k]))];
        const others = [...new Set([...t.rows.flatMap((r, ri) => ri === at.ri ? [] : r.need.filter((_, k) => !filled[ri][k])), ...t.decoys])].filter(n => !remainingRow.includes(n));
        opts = shuffle([...remainingRow, ...shuffle(others).slice(0, Math.max(0, 6 - remainingRow.length))]);
        $('.mat-tb__ch').innerHTML = opts.map((o, k) => `<button type="button" class="g-choice" data-k="${k}"><span class="mat-key">${k + 1}</span><span dir="ltr">${o}</span></button>`).join('');
        $('.mat-tb__ch').querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => pick(+b.dataset.k)));
      }
      function place(ri, name, auto) { const k = T().rows[ri].need.findIndex((n, j) => n === name && !filled[ri][j]); filled[ri][k] = { name, auto }; }
      function pick(k) {
        if (locked || !opts[k]) return;
        const t = T(); const at = slotsOf(t)[cur]; const row = t.rows[at.ri]; const name = opts[k];
        const btn = $('.mat-tb__ch').children[k];
        const ok = row.need.some((n, j) => n === name && !filled[at.ri][j]);
        if (ok) {
          locked = true; if (!tries) { score++; $('[data-s]').textContent = score; }
          place(at.ri, name, false); btn.classList.add('is-right'); api.sfx('good'); api.burst(btn, '#46E3A0', 8);
          $('.mat-tb__fb').innerHTML = `<b class="mat-ok">${W.right}</b> ${bdi(`${row.label} → ${name}`)}`;
          cur++; later(next, reduced() ? 700 : 600); return;
        }
        tries++; slips++; $('[data-m]').textContent = slips; btn.classList.add('is-wrong'); btn.disabled = true; api.sfx('bad'); api.shake(btn);
        const home = t.rows.find((r, ri) => ri !== at.ri && r.need.includes(name));
        const why = t.decoys.includes(name) && DECOY_WHY[name] ? (en ? DECOY_WHY[name].en : DECOY_WHY[name].ar) : home ? `${W.under} ${bdi(home.label)}.` : '';
        if (tries >= 2) {
          locked = true; const give = row.need.find((n, j) => !filled[at.ri][j]); place(at.ri, give, true);
          $('.mat-tb__fb').innerHTML = `<b class="mat-no">${W.notHere}</b> ${why} ${W.placed} ${bdi(`${row.label} → ${give}`)}.`;
          cur++; later(next, 2600); return;
        }
        $('.mat-tb__fb').innerHTML = `<b class="mat-no">${W.notHere}</b> ${why}`;
      }
      function finish() {
        endCard(el, api, ctx, { id: 'materials-tree', score, max: MAX, W, lines: en
          ? ['Three trees, rebuilt from memory. The exam can draw any of them.', 'Strong. Watch the names that live in only one tree: Plastics/Polymers, Ceramics/Engineering Ceramics.', 'The trees are still fuzzy. Go back to “The materials family” and “Metal or non-metal?”, then try again.']
          : ['تلات شجرات من دماغك. الامتحان يرسم أي واحدة فيهم.', 'جامد. خلّي بالك من الأسامي اللي في شجرة واحدة بس: Plastics/Polymers وCeramics/Engineering Ceramics.', 'الشجرات لسه مش واضحة. ارجع لفصل «عيلة الخامات» و«معادن ولا لا معادن؟» وجرّب تاني.'] });
      }
      const onKey = e => { const k = '123456'.indexOf(e.key); const b = $('.mat-tb__ch')?.children[k]; if (k >= 0 && b && !b.disabled) { e.preventDefault(); pick(k); } };
      document.addEventListener('keydown', onKey);
      startTree();
      return (el._matStop = () => { timers.forEach(clearTimeout); timers = []; document.removeEventListener('keydown', onKey); });
    }
  };
}

/* =====================================================================================================
   3 · Pure or alloy? — quick-fire on L1 · S6: lattices and statements, two answers
   ===================================================================================================== */
function pureTrial(lang) {
  const en = lang === 'en';
  const PURE = { b: 'Pure metal', s: 'atoms of the same type' }, ALLOY = { b: 'Alloy', s: 'two or more chemical elements' };
  const choice = (o, ok, sub) => ({ html: `<b dir="ltr">${o.b}</b>${sub ? `<small dir="ltr">${o.s}</small>` : ''}`, ok, label: o.b });
  const STATE = [
    { t: 'Composed of atoms of the same type.', ar: 'متكوّن من ذرات من نفس النوع.', a: 'pure' },
    { t: 'Composed of two or more chemical elements.', ar: 'متكوّن من عنصرين كيميائيين أو أكتر.', a: 'alloy' },
    { t: 'Its blending of elements gives it greater mechanical properties.', ar: 'الخلط بيدّيه خواص ميكانيكية أعلى.', a: 'alloy' },
    { t: 'Copper melted together with zinc.', ar: 'نحاس ساح واتخلط مع زنك.', a: 'alloy' },
    { t: 'Iron with at least 2% carbon and 1–3% silicon (a cast iron).', ar: 'حديد فيه ٢٪ كربون على الأقل و١–٣٪ سيليكون (حديد زهر).', a: 'alloy' },
    { t: 'Alloy steels.', ar: 'الصلب السبائكي.', a: 'alloy' }
  ];
  const WHY = { pure: en ? 'One kind of atom = a pure metal.' : 'نوع واحد من الذرات = معدن نقي.', alloy: en ? 'Two or more chemical elements = an alloy.' : 'عنصرين أو أكتر = سبيكة.' };
  return {
    id: 'materials-pure', title: en ? 'Pure or alloy?' : 'نقي ولا سبيكة؟', en: en ? 'Quick-fire on L1 · S6' : 'Pure or alloy?',
    how: en ? 'Ten rounds: a lattice of atoms or a line from the slide. Pure metal or alloy? Keys 1 and 2, 8 seconds a round.'
      : '١٠ جولات: رسمة ذرات، أو جملة من السلايد. معدن نقي ولا سبيكة؟ زراير 1 و2، و٨ ثواني لكل جولة.',
    mount(el, api, ctx) {
      const pics = [...[2, 5, 8, 13].map(s => ({ s, a: 'pure' })), ...shuffle([3, 9, 15, 21]).slice(0, 2).map(s => ({ s, a: 'alloy' }))].map(p => ({
        art: latticeSVG(p.a, p.s, en ? 'atoms inside a metal' : 'ذرات جوه معدن'),
        prompt: en ? 'Pure metal or alloy?' : 'المعدن ده نقي ولا سبيكة؟',
        sub: en ? 'Look at the atoms.' : 'بص على الذرات.',
        choices: [choice(PURE, p.a === 'pure', true), choice(ALLOY, p.a === 'alloy', true)],
        explain: WHY[p.a], a: p.a
      }));
      const st = [STATE[0], ...shuffle(STATE.slice(1)).slice(0, 3)].map(s => ({
        prompt: `<span dir="ltr">“${s.t}”</span>`,
        sub: en ? 'Pure metal or alloy?' : `${s.ar} نقي ولا سبيكة؟`,
        choices: [choice(PURE, s.a === 'pure', false), choice(ALLOY, s.a === 'alloy', false)],
        explain: WHY[s.a]
      }));
      const host = document.createElement('div'); host.className = 'mat-qf'; el.appendChild(host);
      api.scene('atoms'); fitView(el);
      return quickfire(host, api, ctx, {
        id: 'materials-pure', time: reduced() ? 12 : 8, layout: 'yn', rounds: shuffle([...pics, ...st]),
        intro: en ? { title: 'Pure or alloy?', text: 'One kind of atom, or two or more chemical elements? Read the drawing or the line, then answer fast.', rules: ['Press 1 for Pure metal, 2 for Alloy.', 'The lines come from L1 · S6 (and one from the cast irons of Lecture 2).', 'A wrong answer shows you why before the next round.'] }
          : { title: 'نقي ولا سبيكة؟', text: 'نوع واحد من الذرات، ولا عنصرين أو أكتر؟ اقرا الرسمة أو الجملة، وجاوب بسرعة.', rules: ['اضغط 1 للمعدن النقي، و2 للسبيكة.', 'الجمل من السلايد ٦ في المحاضرة الأولى (وواحدة من الحديد الزهر في المحاضرة التانية).', 'لو غلطت، هتشوف السبب قبل الجولة اللي بعدها.'] },
        wins: en ? [[1, 'Ten for ten.', 'Same type, two or more: you can see it at a glance.'], [.8, 'Strong.', 'One slip. Read the six bullets of L1 · S6 once more.'], [.5, 'Half way.', 'Play with the alloy demo in “Pure metal or alloy?”, then try again.'], [0, 'Not yet.', 'Back to the lesson first, then the trial.']]
          : [[1, 'عشرة من عشرة.', 'نفس النوع، ولا عنصرين أو أكتر: بقيت تشوفها من أول نظرة.'], [.8, 'جامد.', 'غلطة صغيرة. اقرا الست جمل بتوع السلايد تاني.'], [.5, 'نص الطريق.', 'العب بديمو السبيكة في فصل «معدن نقي ولا سبيكة؟» وجرّب تاني.'], [0, 'لسه.', 'الدرس الأول، وبعدين التحدي.']]
      });
    }
  };
}

export function makeTrials(lang) { return [stockroomTrial(lang), treeTrial(lang), pureTrial(lang)]; }
