// Design zone trials, both editions (games/design.js → makeTrials('ar'), design.en.js → makeTrials('en')).
//  1 · design-family  «مين يعمل إيه؟ / Which family?» — a shop-floor job → its family → its branch; 14 jobs fill the L1 · S7 tree
//  2 · design-lenses  «عدّي من العدسات / Through the lenses» — sort considerations into the six cells of L1 · S3
//  3 · design-matrix  «يتلحم ولا لأ؟ / Can it be welded?» — figure 1-1 quick-fire, clear cells only
import { marks } from '../ui/icons.js';
import { quickfire } from './_cte-kit.js';
import { FAMILIES, LENSES, MX_ROWS, MX_LEGEND, panelSVG, sym } from '../content/lessons/_design-kit.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const enT = s => String(s).replace(/<en>([\s\S]*?)<\/en>/g, '<bdi class="en" dir="ltr">$1</bdi>');
const bdi = s => `<bdi class="en" dir="ltr">${s}</bdi>`;
/** phones keep the stage band above the trial: bring the trial (and its back bar) into view */
function fitView(el) {
  requestAnimationFrame(() => { if (el.getBoundingClientRect().bottom <= innerHeight) return; (el.previousElementSibling || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); });
}

const WORDS = {
  ar: { result: 'النتيجة', again: 'العب تاني', back: 'كل التحديات', job: 'شغلانة', card: 'كارت', score: 'نقط', right: 'صح.', wrong: 'لأ.', fam: 'من أنهي عيلة؟', br: 'تمام. أنهي فرع؟', personal: 'شخصي', objective: 'موضوعي', where: 'حطّه فين؟' },
  en: { result: 'Your score', again: 'Play again', back: 'All trials', job: 'Job', card: 'Card', score: 'Score', right: 'Right.', wrong: 'Nope.', fam: 'Which family?', br: 'Good. Which branch?', personal: 'Personal', objective: 'Objective', where: 'Where does it go?' }
};

function endCard(el, api, ctx, { id, score, max, lines, W }) {
  el._dsgStop?.();
  const pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end dsg-end">
    <span class="glyph">${api.GLYPH.caliper}</span>
    <p class="label">${W.result}</p>
    <h3 dir="ltr"><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="dsg-end__marks"></div>
    <p>${pct >= .95 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
    <p class="dsg-end__xp"></p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('h3'));
  el.querySelector('.dsg-end__marks').innerHTML = marks(r.stars, 3, 'marks--big');
  el.querySelector('.dsg-end__xp').innerHTML = `<span class="chip chip--zone"><span class="hud-num" dir="ltr">+${r.xp} XP</span></span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}

/* =====================================================================================================
   1 · Which family? — one job per branch (14), two taps each: the family, then the branch
   ===================================================================================================== */
const JOBS = {
  liquid: [{ ar: 'ألومنيوم سايح بيتصب في قالب، عشان يطلع قاعدة لمبة تقيلة.', en: 'Molten aluminium is poured into a mould to make a heavy lamp base.' }],
  plastic: [{ ar: 'حتة حديد سخنة جدًا، طرية بس مش سايحة، بتتكبس بين اسطمبتين لحد ما تاخد شكل مفتاح ربط.', en: 'A red-hot steel billet, soft but not molten, is squeezed between two dies into the shape of a wrench.' }],
  solid: [{ ar: 'ماسورة حديد باردة بتتثني دواير، عشان راس سرير.', en: 'A cold steel tube is bent into rings for a bed’s headboard.' }, { ar: 'حتة صاج باردة بتتثني على شكل حامل موبايل.', en: 'A cold piece of sheet steel is bent into a phone stand.' }],
  sheet: [{ ar: 'لوح صاج كبير بيتقص على المقاس، بمقص كبير زي المقص بالظبط.', en: 'A big steel sheet is cut to size on a giant shear, just like scissors.' }, { ar: 'مئات الخروم بتتخرم في جناب سلة صاج.', en: 'Hundreds of holes are punched in the sides of a sheet-steel basket.' }],
  chip: [{ ar: 'سكينة ماشية على سيخ معدن، وبتقشّر منه رايش ملفوف.', en: 'A cutting tool runs along a metal bar and peels off curly chips.' }],
  nonchip: [{ ar: 'نقشة بتتحفر في لوح معدن بالكيميا، من غير ولا حتة رايش.', en: 'A pattern is eaten into a metal plate by chemicals, without a single chip.' }],
  flame: [{ ar: 'زخارف بتتقطع في رجل ترابيزة ستانلس بشعاع ليزر.', en: 'Ornaments are cut into a stainless table leg with a laser beam.' }, { ar: 'لوح حديد تخين بيتقطع بلهب غاز.', en: 'A thick steel plate is cut with a gas flame.' }],
  solder: [{ ar: 'وصلة ماسورة نحاس بتتقفل بمعدن حشو سايح. الماسورة نفسها مابتسيحش.', en: 'A copper pipe joint is sealed with a melted filler metal. The pipes themselves don’t melt.' }],
  weld: [{ ar: 'حرف لوحين صلب بيسيح ويتلحم في بعض، ويطلع خط لحام.', en: 'The edges of two steel plates melt and fuse into one weld bead.' }],
  adhesive: [{ ar: 'إيد خشب بتتلزق في غطا حلة بالغِرا.', en: 'A wooden knob is glued onto a pot lid.' }],
  mechanical: [{ ar: 'مكتب صاج متجمّع بصفوف برشام.', en: 'A sheet-steel desk is held together by rows of rivets.' }, { ar: 'دراع لمبة متركّب بمسمار وصامولة.', en: 'A lamp arm is fixed on with a bolt and a nut.' }],
  formed: [{ ar: 'ملمس شبه الجلد طالع على سطح قطعة بلاستيك من القالب نفسه.', en: 'A leather-like texture comes out of the mould on a plastic part’s surface.' }],
  abrasive: [{ ar: 'سطح ألومنيوم بيتصنفر ويتلمع لحد ما يبرق.', en: 'An aluminium surface is sanded and polished until it shines.' }],
  coatings: [{ ar: 'لمبة صاج بتترش دهان أخضر.', en: 'A sheet-steel lamp is sprayed with green paint.' }]
};
const WHY = {
  liquid: { ar: 'الخامة سايحة، واتصبت في قالب.', en: 'The material is molten, poured into a mould.' },
  plastic: { ar: 'الخامة طرية بس مش سايحة، واتكبست.', en: 'Soft but not molten, then squeezed.' },
  solid: { ar: 'ثني على البارد = الحالة الصلبة.', en: 'Bending it cold = solid state.' },
  sheet: { ar: 'قص وتخريم الصاج.', en: 'Shearing and punching sheet.' },
  chip: { ar: 'فيه رايش = <en>Chip Forming</en>. وده قطع، مش تشكيل.', en: 'Chips = Chip Forming, which is Cutting, not Forming.' },
  nonchip: { ar: 'قطع من غير رايش، بالكيميا.', en: 'Cutting without chips, by chemicals.' },
  flame: { ar: 'قطع بالحرارة: ليزر أو لهب.', en: 'Cutting with heat: laser or flame.' },
  solder: { ar: 'الحشو بس اللي ساح.', en: 'Only the filler melted.' },
  weld: { ar: 'القطع نفسها ساحت.', en: 'The parts themselves melted.' },
  adhesive: { ar: 'غِرا = لزق.', en: 'Glue = adhesive.' },
  mechanical: { ar: 'برشام ومسامير = ربط ميكانيكي.', en: 'Rivets and bolts = mechanical.' },
  formed: { ar: 'التشطيب طالع من القالب: <en>Formed</en>. وده فرع تشطيب.', en: 'The finish comes from the mould: Formed, a Finishing branch.' },
  abrasive: { ar: 'صنفرة وتلميع = <en>Abrasive/Cut</en>. وده فرع تشطيب.', en: 'Sanding and polishing = Abrasive/Cut, a Finishing branch.' },
  coatings: { ar: 'طبقة دهان = <en>Coatings</en>.', en: 'A layer of paint = Coatings.' }
};

function familyTrial(lang) {
  const en = lang === 'en'; const W = WORDS[lang];
  return {
    id: 'design-family', title: en ? 'Which family?' : 'مين يعمل إيه؟', en: en ? 'Form · cut · join · finish' : 'Which family?',
    how: en ? 'Fourteen jobs from the shop floor. For each one, pick the family (keys 1–4), then the branch. Every right branch lights up one box of the L1 · S7 tree.'
      : '١٤ شغلانة من الورشة. لكل شغلانة: اختار العيلة (زراير 1–4)، وبعدين الفرع. كل فرع صح بينوّر خانة في شجرة <en>Manufacturing Methods</en>.',
    mount(el, api, ctx) {
      const order = shuffle(FAMILIES.flatMap(f => f.br.map(b => ({ f, b, job: JOBS[b.k][Math.floor(Math.random() * JOBS[b.k].length)] }))));
      const N = order.length, MAX = N * 2;
      let i = 0, score = 0, step = 'fam', locked = false, timers = [];
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      const famLabel = f => en ? f.en : `${f.ar} ${bdi(f.en)}`;
      el.innerHTML = `<div class="dsg-ft">
        <div class="g-hud"><span class="chip">${W.job} <span class="hud-num" data-r>1</span>/<span class="hud-num">${N}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span>/<span class="hud-num">${MAX}</span></span></div>
        <div class="dsg-ft__map" dir="ltr" aria-hidden="true">${FAMILIES.map(f => `<div class="dsg-ft__mf" data-f="${f.k}"><b>${f.en}</b><span>${f.br.map(b => `<i data-b="${b.k}" title="${b.en}"></i>`).join('')}</span></div>`).join('')}</div>
        <div class="g-card dsg-ft__job"><div class="dsg-ft__art"></div><p class="dsg-ft__txt"></p></div>
        <p class="dsg-ft__q"></p>
        <div class="g-choices dsg-ft__ch"></div>
        <p class="dsg-ft__fb" aria-live="polite"></p>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s);
      const choices = $('.dsg-ft__ch'), fb = $('.dsg-ft__fb'), q = $('.dsg-ft__q');
      const draw = (items, onPick) => {
        choices.innerHTML = items.map((it, k) => `<button type="button" class="g-choice" data-k="${k}"><span class="dsg-key">${k + 1}</span>${it.html}</button>`).join('');
        choices.querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => onPick(+b.dataset.k)));
        choices._pick = onPick;
      };
      const mark = (okIdx, pickIdx) => choices.querySelectorAll('.g-choice').forEach((b, j) => { b.disabled = true; if (j === okIdx) b.classList.add('is-right'); else if (j === pickIdx) b.classList.add('is-wrong'); });
      function round() {
        locked = false; step = 'fam';
        const R = order[i];
        $('[data-r]').textContent = i + 1;
        $('.dsg-ft__art').innerHTML = panelSVG(R.b.k, en ? 'The job' : 'الشغلانة');
        $('.dsg-ft__txt').innerHTML = enT(en ? R.job.en : R.job.ar);
        q.textContent = W.fam; fb.innerHTML = '';
        draw(FAMILIES.map(f => ({ html: `<span>${famLabel(f)}</span>` })), pickFam);
      }
      function pickFam(k) {
        if (locked || step !== 'fam') return;
        const R = order[i]; const ok = FAMILIES[k] === R.f; const okIdx = FAMILIES.indexOf(R.f);
        mark(okIdx, k); api.scene(R.f.scene);
        if (!ok) { locked = true; api.sfx('bad'); api.shake($('.dsg-ft__job')); fb.innerHTML = `<b class="dsg-no">${W.wrong}</b> ${bdi(`${R.f.en} → ${R.b.en}`)}. ${enT(en ? WHY[R.b.k].en : WHY[R.b.k].ar)}`; later(next, reduced() ? 2600 : 2400); return; }
        score++; $('[data-s]').textContent = score; api.sfx('good');
        step = 'br';
        later(() => {
          q.textContent = W.br;
          draw(R.f.br.map(b => ({ html: `<span dir="ltr">${b.en}</span>${en ? '' : `<small>${b.ar}</small>`}` })), pickBr);
          choices.querySelector('.g-choice')?.focus({ preventScroll: true });
        }, 380);
      }
      function pickBr(k) {
        if (locked || step !== 'br') return; locked = true;
        const R = order[i]; const okIdx = R.f.br.indexOf(R.b); const ok = k === okIdx;
        mark(okIdx, k);
        if (ok) { score++; $('[data-s]').textContent = score; api.sfx('good'); api.burst(choices.children[k], '#46E3A0', 10); el.querySelector(`.dsg-ft__map i[data-b="${R.b.k}"]`)?.classList.add('is-on'); }
        else { api.sfx('bad'); api.shake($('.dsg-ft__job')); }
        fb.innerHTML = `<b class="${ok ? 'dsg-ok' : 'dsg-no'}">${ok ? W.right : W.wrong}</b> ${bdi(`${R.f.en} → ${R.b.en}`)}. ${enT(en ? WHY[R.b.k].en : WHY[R.b.k].ar)}`;
        later(next, ok ? (reduced() ? 1300 : 1200) : 2400);
      }
      function next() {
        i++;
        if (i < N) round();
        else endCard(el, api, ctx, { id: 'design-family', score, max: MAX, W, lines: en
          ? ['The whole tree, lit. You read a workshop like a book.', 'Good eye. Go over the traps (Chip Forming, Abrasive/Cut, Formed) and try again.', 'The tree isn’t solid yet. Go back to the four method chapters, then try again.']
          : ['الشجرة كلها نوّرت. انت بتقرا الورشة زي الكتاب.', 'عين حلوة. راجع الفخاخ (Chip Forming وAbrasive/Cut وFormed) وجرّب تاني.', 'الشجرة لسه مهزوزة. ارجع لفصول طرق التصنيع الأربعة، وجرّب تاني.'] });
      }
      const onKey = e => { const k = '1234'.indexOf(e.key); const btns = choices.querySelectorAll('.g-choice'); if (k >= 0 && btns[k] && !btns[k].disabled) { e.preventDefault(); choices._pick?.(k); } };
      document.addEventListener('keydown', onKey);
      round();
      return (el._dsgStop = () => { timers.forEach(clearTimeout); timers = []; document.removeEventListener('keydown', onKey); });
    }
  };
}

/* =====================================================================================================
   2 · Through the lenses — 12 considerations, six cells (keys 1–6); the board fills up like the slide
   ===================================================================================================== */
const GLOSS = {
  style: 'الستايل', ego: 'بصمة المصمم', 'marketing/advertising': 'التسويق والإعلان', research: 'البحث', sketches: 'الاسكتشات', 'mock-ups': 'الماكيتات', 'finish color/texture': 'لون وملمس التشطيب', CAID: 'برامج التصميم الصناعي', 'material selection': 'اختيار الخامة', 'process selection': 'اختيار العملية',
  ergonomics: 'راحة جسم الإنسان', engineering: 'الهندسة', marketing: 'التسويق', 'investment/profit': 'الاستثمار والربح', 'national/international sales': 'المبيعات جوه وبره البلد', 'shipping/distribution': 'الشحن والتوزيع', 'CPSA/UL/FDA': 'قوانين ومواصفات الأمان', 'breadboard studies': 'نماذج تجريبية سريعة', manufacturability: 'قابلية التصنيع', safety: 'الأمان', 'strength of materials': 'مقاومة الخامات', 'CAD/CAM': 'برامج الرسم والتصنيع', tooling: 'العِدد والاسطمبات', 'component selection': 'اختيار المكونات', vendors: 'الموردين', assembly: 'التجميع', 'shipping/packaging': 'الشحن والتغليف', 'repair/maintenance': 'التصليح والصيانة'
};
/** every consideration with the cells it may go in: cell = row * 3 + lens (row 0 personal, 1 objective) */
function itemsOf() {
  const map = new Map();
  LENSES.forEach((l, li) => { l.personal.forEach(s => map.set(s, [...(map.get(s) || []), li])); l.objective.forEach(s => map.set(s, [...(map.get(s) || []), 3 + li])); });
  return [...map].map(([t, cells]) => ({ t, cells }));
}
function lensesTrial(lang) {
  const en = lang === 'en'; const W = WORDS[lang];
  return {
    id: 'design-lenses', title: en ? 'Through the lenses' : 'عدّي من العدسات', en: en ? 'Personal or objective?' : 'Through the lenses',
    how: en ? 'Twelve considerations from the Product Design Sequence. Drop each one in its lens and its row (keys 1–6). By the end you have rebuilt the slide.'
      : '١٢ اعتبار من <en>Product Design Sequence</en>. حط كل واحد تحت عدسته وفي صفه (زراير 1–6). وفي الآخر تكون بنيت السلايد بإيدك.',
    mount(el, api, ctx) {
      const all = itemsOf();
      const pickOne = c => shuffle(all.filter(x => x.cells.includes(c)))[0];
      const base = [0, 1, 2, 3, 4, 5].map(pickOne);
      const rest = shuffle(all.filter(x => !base.includes(x))).slice(0, 12 - new Set(base).size);
      const deck = shuffle([...new Set(base), ...rest]);
      const N = deck.length;
      let i = 0, score = 0, locked = false, timers = [];
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      const cellName = c => `${c < 3 ? 'Personal' : 'Objective'} · ${LENSES[c % 3].en}`;
      el.innerHTML = `<div class="dsg-lz">
        <div class="g-hud"><span class="chip">${W.card} <span class="hud-num" data-r>1</span>/<span class="hud-num">${N}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></div>
        <div class="g-card dsg-lz__card" aria-live="polite"><span class="label">${W.where}</span><b dir="ltr"></b><small></small></div>
        <div class="dsg-lz__board" dir="ltr">
          <span></span>${LENSES.map(l => `<b class="dsg-lz__lens">${l.en}</b>`).join('')}
          ${[0, 1].map(row => `<span class="dsg-lz__row"><span>${row ? W.objective : W.personal}</span></span>${[0, 1, 2].map(li => { const c = row * 3 + li; return `<button type="button" class="dsg-lz__bin dsg-lz__bin--${row ? 'o' : 'p'}" data-c="${c}" aria-label="${cellName(c)}"><span class="dsg-key">${c + 1}</span><span class="dsg-lz__got"></span></button>`; }).join('')}`).join('')}
        </div>
        <p class="dsg-lz__fb" aria-live="polite"></p>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s);
      const bins = [...el.querySelectorAll('.dsg-lz__bin')], fb = $('.dsg-lz__fb');
      function show() {
        locked = false; const it = deck[i];
        $('[data-r]').textContent = i + 1;
        $('.dsg-lz__card b').textContent = it.t;
        $('.dsg-lz__card small').textContent = en ? '' : (GLOSS[it.t] || '');
        bins.forEach(b => b.classList.remove('is-right', 'is-wrong'));
        fb.innerHTML = '';
      }
      function drop(c) {
        if (locked) return; locked = true;
        const it = deck[i]; const ok = it.cells.includes(c); const home = ok ? c : it.cells[0];
        const chip = document.createElement('span'); chip.className = 'dsg-lz__chip' + (ok ? '' : ' is-fix'); chip.textContent = it.t;
        bins[home].querySelector('.dsg-lz__got').appendChild(chip);
        bins[home].classList.add('is-right');
        if (ok) { score++; $('[data-s]').textContent = score; api.sfx('good'); }
        else { bins[c].classList.add('is-wrong'); api.shake(bins[c]); api.sfx('bad'); }
        const where = it.cells.map(cellName).join(en ? ' and ' : ' و');
        fb.innerHTML = `<b class="${ok ? 'dsg-ok' : 'dsg-no'}">${ok ? W.right : W.wrong}</b> ${bdi(`${it.t} → ${where}`)}${it.cells.length > 1 ? (en ? ' (it appears twice on the slide).' : ' (مكتوبة مرتين في السلايد).') : '.'}`;
        later(() => { i++; if (i < N) show(); else endCard(el, api, ctx, { id: 'design-lenses', score, max: N, W, lines: en
          ? ['Every card in its cell. You could redraw slide 3 from memory.', 'Nearly there. Look again at CAID vs CAD/CAM and research.', 'The two rows still blur. Go back to “Your taste, or the numbers?” and try again.']
          : ['كل كارت في خانته. تقدر ترسم السلايد ٣ من دماغك.', 'قربت. راجع CAID ضد CAD/CAM، وresearch.', 'الصفين لسه متلخبطين. ارجع لفصل «ذوقك ولا الأرقام؟» وجرّب تاني.'] }); }, ok ? 900 : 2100);
      }
      bins.forEach(b => b.addEventListener('click', () => drop(+b.dataset.c)));
      const onKey = e => { const k = '123456'.indexOf(e.key); if (k >= 0) { e.preventDefault(); drop(k); } };
      document.addEventListener('keydown', onKey);
      api.scene('considerations');
      show();
      return (el._dsgStop = () => { timers.forEach(clearTimeout); timers = []; document.removeEventListener('keydown', onKey); });
    }
  };
}

/* =====================================================================================================
   3 · Can it be welded? — figure 1-1 quick-fire (only the clear ● / ○ cells of the five clear rows)
   ===================================================================================================== */
const COLS = FAMILIES.flatMap(f => f.br.map(b => ({ ...b, fam: f.en })));
const CELLS = [[0, 8], [0, 6], [0, 7], [0, 1], [0, 4], [1, 8], [1, 3], [1, 13], [2, 8], [2, 7], [2, 1], [2, 2], [2, 0], [2, 9], [2, 10], [2, 13], [3, 8], [3, 7], [3, 1], [3, 0], [11, 8], [11, 7], [11, 9], [11, 10]];
const ROW_NAME = { 0: 'Ferrous metals', 1: 'Nonferrous metals', 2: 'Thermoset plastics', 3: 'Thermoplastics', 11: 'Wood products' };
const ROW_AR = { 0: 'معادن حديدية', 1: 'معادن غير حديدية', 2: 'بلاستيك thermoset', 3: 'بلاستيك thermoplastic', 11: 'منتجات خشب' };
function cellArt(r, c) {
  const col = COLS[c];
  return `<svg viewBox="0 0 320 100" role="img" aria-label="${ROW_NAME[r]} × ${col.en}" class="dsg-cell" direction="ltr">
    <rect x="150" y="6" width="160" height="34" rx="2" fill="var(--zc)" fill-opacity=".14" stroke="var(--ink-3)"/>
    <text direction="ltr" x="230" y="20" text-anchor="middle" font-family="Barlow Condensed" font-size="11" font-weight="600" fill="var(--ink-3)">${col.fam}</text>
    <text direction="ltr" x="230" y="34" text-anchor="middle" font-family="Barlow Condensed" font-size="15" font-weight="700" fill="var(--ink)">${col.en}</text>
    <rect x="10" y="40" width="140" height="54" rx="2" fill="none" stroke="var(--ink-3)"/>
    <text direction="ltr" x="20" y="62" font-family="Barlow Condensed" font-size="11" font-weight="600" fill="var(--ink-3)">${MX_ROWS[r].g}</text>
    <text direction="ltr" x="20" y="81" font-family="Barlow Condensed" font-size="16" font-weight="700" fill="var(--ink)">${MX_ROWS[r].en}</text>
    <rect x="150" y="40" width="160" height="54" rx="2" fill="none" stroke="var(--zt)" stroke-width="1.6"/>
    <text direction="ltr" x="230" y="78" text-anchor="middle" font-family="Barlow Condensed" font-size="30" font-weight="700" fill="var(--hot)">?</text>
  </svg>`;
}
function matrixTrial(lang) {
  const en = lang === 'en';
  return {
    id: 'design-matrix', title: en ? 'Can it be welded?' : 'يتلحم ولا لأ؟', en: en ? 'Figure 1-1, quick-fire' : 'Can it be welded?',
    how: en ? 'A material and a method. Is that cell of figure 1-1 a full circle (All Processes) or an empty one (No Processes)? 12 rounds, 9 seconds each. Keys 1 and 2.'
      : 'خامة وطريقة تصنيع. الخانة دي في <en>figure 1-1</en> دايرة مليانة (<en>All Processes</en>) ولا فاضية (<en>No Processes</en>)؟ ١٢ جولة، ٩ ثواني لكل جولة. زراير 1 و2.',
    mount(el, api, ctx) {
      const yes = shuffle(CELLS.filter(([r, c]) => MX_ROWS[r].v[c] === '3')).slice(0, 6), no = shuffle(CELLS.filter(([r, c]) => MX_ROWS[r].v[c] === '0')).slice(0, 6);
      const rounds = shuffle([...yes, ...no]).map(([r, c]) => {
        const v = +MX_ROWS[r].v[c]; const col = COLS[c];
        return {
          art: cellArt(r, c),
          prompt: en ? `${ROW_NAME[r]} × ${col.en}?` : `${bdi(ROW_NAME[r])} × ${bdi(col.en)}؟`,
          sub: en ? 'What does figure 1-1 show in this cell?' : 'شكل ١-١ حاطط إيه في الخانة دي؟',
          choices: [3, 0].map(s => ({ html: `${sym(s, 'is-big')}<span dir="ltr">${MX_LEGEND[s].en}</span>${en ? '' : `<small>${MX_LEGEND[s].ar}</small>`}`, ok: s === v, label: MX_LEGEND[s].en })),
          explain: en ? `Figure 1-1: ${ROW_NAME[r]} × ${col.en} = <b>${MX_LEGEND[v].en}</b>.` : `شكل ١-١: ${bdi(`${ROW_NAME[r]} × ${col.en}`)} = ${bdi(MX_LEGEND[v].en)} (${MX_LEGEND[v].ar}).`
        };
      });
      const host = document.createElement('div'); host.className = 'dsg-qf'; el.appendChild(host);
      api.scene('matrix');
      fitView(el);
      return quickfire(host, api, ctx, {
        id: 'design-matrix', time: reduced() ? 14 : 9, layout: 'yn', rounds,
        intro: en ? { title: 'Can it be welded?', text: 'A material and a manufacturing method. Remember figure 1-1: is the cell a full circle or an empty one?', rules: ['Press 1 for All Processes, 2 for No Processes.', 'Every cell comes from the clear rows: Ferrous, Nonferrous, Thermoset, Thermoplastics, Wood products.', 'A mistake? Read the line under the answer before the next round.'] }
          : { title: 'يتلحم ولا لأ؟', text: 'خامة وطريقة تصنيع. افتكر شكل ١-١: الخانة دي دايرة مليانة، ولا فاضية؟', rules: ['اضغط 1 لـ All Processes، و2 لـ No Processes.', 'كل الخانات من الصفوف الواضحة: الحديدي، وغير الحديدي، والـ Thermoset، والـ Thermoplastics، والخشب.', 'غلطت؟ اقرا السطر اللي تحت الإجابة قبل الجولة اللي بعدها.'] },
        wins: en ? [[1, 'Not one cell wrong.', 'You carry figure 1-1 in your head.'], [.75, 'Strong.', 'Check the thermoset row once more: no weld, no solder/braze.'], [.5, 'Half way.', 'Open the figure 1-1 demo in the lesson and tap the five marked rows.'], [0, 'Not yet.', 'Back to “What can be made how?”, then try again.']]
          : [[1, 'ولا خانة غلط.', 'شكل ١-١ محفور في دماغك.'], [.75, 'جامد.', 'راجع صف الـ thermoset تاني: لا Weld ولا Solder/Braze.'], [.5, 'نص الطريق.', 'افتح ديمو شكل ١-١ في الدرس، واضغط على الخمس صفوف المعلّمة.'], [0, 'لسه.', 'ارجع لفصل «مين يتعمل بإيه؟» وبعدين جرّب تاني.']]
      });
    }
  };
}

export function makeTrials(lang) { return [familyTrial(lang), lensesTrial(lang), matrixTrial(lang)]; }
