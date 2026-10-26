// Metal cutting — the three trials, shared by both editions. Each language file passes its own words (W); the engines
// hold no text of their own except the exam's English operation names.
//   keepOrScrap · cut-keep : the press stamps a part; tap the scrap (or "no scrap"). The zone's thread: what is kept?
//   setTheGap   · cut-gap  : set the clearance until the break lines meet and punch; then read cuts: small · right · large
//   nameTheCut  · cut-name : quick-fire: a finished piece and the customer's order; name the operation (uses _cte-kit.js)
import { piece, art, clrInner, svg } from '../content/lessons/_cut-art.js';
import { quickfire } from './_cte-kit.js';
import { marks } from '../ui/icons.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** phones keep the stage above the level: bring the trial into view so no timed control sits below the fold */
function fitView(el) { requestAnimationFrame(() => { if (!el.isConnected) return; const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) (el.previousElementSibling || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); }); }
function timerBar(bar, ms, onEnd) {
  const t0 = performance.now(); let raf = 0, dead = false;
  const step = now => { if (dead) return; const left = 1 - (now - t0) / ms; bar.style.setProperty('--t', Math.max(0, left).toFixed(3)); if (left <= 0) { dead = true; onEnd(); } else raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  return () => { dead = true; cancelAnimationFrame(raf); };
}
/** the end card shared by the two hand-made trials */
function endCard(el, api, ctx, { id, score, max, W, misses = [] }) {
  const pct = max ? score / max : 0, win = W.wins.find(([p]) => pct >= p);
  el.innerHTML = `<div class="g-card g-end cut-end">
    <span class="glyph">${api.GLYPH.punch}</span>
    <p class="label">${W.result}</p>
    <div class="cut-end__score" dir="ltr"><span class="hud-num">${score}</span><span class="hud-num cut-end__of">/${max}</span></div>
    <div class="cut-end__marks"></div>
    <h3>${win[1]}</h3><p class="cut-end__line">${win[2]}</p>
    ${misses.length ? `<div class="cut-miss"><p class="label">${W.review}</p><ul>${misses.map(m => `<li>${m}</li>`).join('')}</ul></div>` : ''}
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('.cut-end__score'));
  el.querySelector('.cut-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  setTimeout(() => el.querySelector('[data-a="again"]')?.focus({ preventScroll: true }), 30);
}
const BIN = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14h28l-3 26H13z"/><path d="M6 14h36M19 14v-4h10v4"/><path d="M4 4l40 40" stroke-width="2.4"/></svg>`;

/* =====================================================================================================
   1 · KEEP OR SCRAP? — the press stamps; which piece goes in the scrap bin?
   ===================================================================================================== */
/** [piece drawing, is it scrap?] in the order they come off the press */
const KCASES = {
  punch: { op: 'Punching (Piercing)', pcs: [['sheetHole', 0], ['slug', 1]] },
  blank: { op: 'Blanking', pcs: [['sheetBig', 1], ['blank', 0]] },
  fine: { op: 'Fine blanking', pcs: [['sheetBig', 1], ['blankFine', 0]] },
  perf: { op: 'Perforating', pcs: [['sheetPerf', 0], ['slugsTiny', 1]] },
  slot: { op: 'Slotting', pcs: [['sheetSlots', 0], ['slugsRect', 1]] },
  notch: { op: 'Notching', pcs: [['sheetNotch', 0], ['notchPiece', 1]] },
  trim: { op: 'Trimming', pcs: [['cup', 0], ['flange', 1]] },
  shave: { op: 'Shaving', pcs: [['partShaved', 0], ['sliver', 1]] },
  part: { op: 'Parting', pcs: [['lens', 0], ['hourglass', 1], ['lens', 0]], fixed: true },
  cutoff: { op: 'Cutoff', pcs: [['cPart', 0], ['stripRest', 0]] },
  slit: { op: 'Slitting', pcs: [['strip', 0], ['strip', 0]], fixed: true },
  lance: { op: 'Lancing', pcs: [['louver', 0]] },
  emboss: { op: 'Embossing', pcs: [['ribs', 0]] },
  coin: { op: 'Coining', pcs: [['coin', 0]] }
};
export function keepOrScrap(W) {
  return {
    id: 'cut-keep', title: W.title, en: 'Keep or scrap?', how: W.how,
    mount(el, api, ctx) {
      const ROUNDS = 10, LIMIT = reduced() ? 20000 : 14000;
      const must = ['punch', 'blank', 'part', 'cutoff'];
      const deck = shuffle([...must, ...shuffle(Object.keys(KCASES).filter(k => !must.includes(k))).slice(0, ROUNDS - must.length)]);
      let i = 0, score = 0, combo = 0, best = 0, locked = true, stopT = () => { }, next = 0, pcs = [];
      const misses = [];
      el.innerHTML = `<div class="cut-t cut-kg">
        <div class="g-hud"><span class="chip">${W.round} <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="cut-hud-r"><span class="chip cut-combo" hidden>${W.combo} <span class="hud-num">×0</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></span></div>
        <div class="g-timer"><i></i></div>
        <div class="g-card cut-kg__card">
          <div class="cut-kg__op"><span class="cut-kg__name" dir="ltr"></span><p class="cut-kg__order"></p></div>
          <p class="cut-kg__q">${W.prompt}</p>
          <div class="cut-kg__pcs"></div>
          <p class="cut-kg__fb" aria-live="polite"></p>
        </div>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s), bar = $('.g-timer i'), card = $('.cut-kg__card'), box = $('.cut-kg__pcs'), fb = $('.cut-kg__fb');
      function round() {
        const id = deck[i], C = KCASES[id];
        pcs = (C.fixed ? C.pcs : shuffle(C.pcs)).map(([kind, scrap]) => ({ kind, scrap: !!scrap }));
        const none = !pcs.some(p => p.scrap);
        $('[data-r]').textContent = i + 1; $('.cut-kg__name').textContent = C.op; $('.cut-kg__order').innerHTML = W.cases[id][0]; fb.textContent = '';
        box.innerHTML = pcs.map((p, j) => `<button type="button" class="cut-pc" data-k="${j}" aria-label="${j + 1}: ${W.pieces[p.kind]}"><span class="cut-pc__n hud-num">${j + 1}</span><span class="cut-pc__art">${piece(p.kind)}</span><span class="cut-pc__tag"></span></button>`).join('')
          + `<button type="button" class="cut-pc cut-pc--none" data-k="none" aria-label="${pcs.length + 1}: ${W.none}"><span class="cut-pc__n hud-num">${pcs.length + 1}</span><span class="cut-pc__bin">${BIN}</span><b>${W.none}</b></button>`;
        box.dataset.n = pcs.length + 1;
        box.querySelectorAll('.cut-pc').forEach(b => b.addEventListener('click', () => answer(b.dataset.k, b)));
        card.classList.remove('is-stamp'); void card.offsetWidth; card.classList.add('is-stamp');
        api.sfx('whoosh'); locked = false; void none;
        stopT(); stopT = timerBar(bar, LIMIT, () => answer(null, null));
      }
      function answer(k, btn) {
        if (locked) return; locked = true; stopT();
        const id = deck[i], none = !pcs.some(p => p.scrap);
        const ok = k === null ? false : k === 'none' ? none : pcs[+k].scrap;
        box.querySelectorAll('.cut-pc').forEach(b => {
          b.disabled = true;
          if (b.dataset.k === 'none') { if (none) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); return; }
          const p = pcs[+b.dataset.k];
          b.querySelector('.cut-pc__art').innerHTML = piece(p.kind, p.scrap ? 'scrap' : 'product');
          b.querySelector('.cut-pc__tag').textContent = p.scrap ? W.scrap : W.product;
          b.classList.add(p.scrap ? 'is-scrap' : 'is-product');
          if (p.scrap) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong');
        });
        if (ok) { score++; combo++; best = Math.max(best, combo); api.sfx('good'); api.burst(btn, '#46E3A0', 10); }
        else { combo = 0; api.sfx('bad'); api.shake(card); misses.push(`<b dir="ltr">${KCASES[id].op}</b> — ${W.cases[id][1]}`); }
        $('[data-s]').textContent = score; const cb = $('.cut-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
        fb.innerHTML = `<b class="${ok ? 'cut-ok' : 'cut-no'}">${k === null ? W.timeUp : ok ? W.right : W.wrong}</b> ${W.cases[id][1]}`;
        i++;
        next = setTimeout(() => { if (i < ROUNDS) round(); else stop(true); }, ok ? 1500 : 3200);
      }
      const onKey = e => { if (!el.isConnected || locked) return; const n = '123456'.indexOf(e.key); const b = box.querySelectorAll('.cut-pc')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); b.click(); } };
      document.addEventListener('keydown', onKey);
      function stop(finished) { stopT(); clearTimeout(next); document.removeEventListener('keydown', onKey); if (finished) endCard(el, api, ctx, { id: 'cut-keep', score, max: ROUNDS, W, misses: misses.slice(0, 5) }); }
      round();
      return () => stop(false);
    }
  };
}

/* =====================================================================================================
   2 · SET THE CLEARANCE — aim the gap, punch, read the edge
   ===================================================================================================== */
export function setTheGap(W) {
  return {
    id: 'cut-gap', title: W.title, en: 'Set the clearance', how: W.how,
    mount(el, api, ctx) {
      const tan = a => Math.tan(a * Math.PI / 180);
      const ts = shuffle([42, 50, 58, 66, 46]), as = shuffle([18, 20, 22, 24, 26]);
      const states = shuffle(['small', 'ok', 'large', ...shuffle(['small', 'large', 'ok']).slice(0, 2)]);
      const plan = Array.from({ length: 10 }, (_, n) => n % 2 === 0 ? { k: 'set', t: ts[n / 2], a: as[n / 2] } : { k: 'read', st: states[(n - 1) / 2], txt: Math.random() < .4 });
      let i = 0, score = 0, locked = true, next = 0, g = 0, cur = null;
      const misses = [];
      el.innerHTML = `<div class="cut-t cut-gg">
        <div class="g-hud"><span class="chip">${W.round} <span class="hud-num" data-r>1</span>/<span class="hud-num">10</span></span><span class="chip cut-gg__kind"></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></div>
        <div class="g-card cut-gg__card"><p class="cut-gg__q"></p><div class="cut-gg__fig"></div><div class="cut-gg__ctrl"></div><p class="cut-gg__fb" aria-live="polite"></p></div>
      </div>`;
      fitView(el);
      const $ = s => el.querySelector(s), fig = $('.cut-gg__fig'), ctrl = $('.cut-gg__ctrl'), fb = $('.cut-gg__fb');
      const draw = (o) => { const r = clrInner(o); fig.innerHTML = svg(r.vb, r.inner, W.figLabel); return r; };
      function round() {
        cur = plan[i]; locked = false; fb.textContent = ''; $('[data-r]').textContent = i + 1; $('.cut-gg__kind').textContent = cur.k === 'set' ? W.kindSet : W.kindRead;
        fig.classList.remove('is-hit'); fig.hidden = false;
        if (cur.k === 'set') {
          const ideal = cur.t * tan(cur.a), off = (10 + Math.random() * 10) * (Math.random() < .5 ? -1 : 1);
          g = Math.round(Math.max(2, Math.min(50, ideal + off)) * 2) / 2;
          if (Math.abs(g - ideal) < 7) g = Math.min(50, ideal + 12);
          $('.cut-gg__q').innerHTML = W.setPrompt;
          draw({ g, t: cur.t, a: cur.a, cracks: false, guides: true, force: false, punchUp: 10 });
          ctrl.innerHTML = `<label class="cut-range"><span class="label">${W.gapLabel}</span><input type="range" min="2" max="50" step="0.5" value="${g}" aria-label="${W.gapLabel}"></label><button type="button" class="btn btn--zone cut-gg__go">${W.punch}</button><span class="cut-kbd">${W.keys}</span>`;
          const range = ctrl.querySelector('input');
          range.addEventListener('input', () => { g = +range.value; draw({ g, t: cur.t, a: cur.a, cracks: false, guides: true, force: false, punchUp: 10 }); });
          ctrl.querySelector('.cut-gg__go').addEventListener('click', punch);
          setTimeout(() => range.focus({ preventScroll: true }), 40);
        } else {
          $('.cut-gg__q').innerHTML = W.readPrompt;
          const t = 50 + Math.round(Math.random() * 12), a = 22, ideal = t * tan(a);
          const gg = cur.st === 'small' ? ideal - 10 - Math.random() * 6 : cur.st === 'large' ? ideal + 14 + Math.random() * 8 : ideal + (Math.random() - .5) * 2;
          if (cur.txt) { fig.hidden = true; $('.cut-gg__q').innerHTML = W.readPromptTxt + `<span class="cut-gg__sym">«${W.symptoms[cur.st]}»</span>`; }
          else draw({ g: Math.max(2, gg), t, a, cracks: true, force: true });
          ctrl.innerHTML = `<div class="g-choices cut-gg__ch">${['small', 'ok', 'large'].map((k, n) => `<button type="button" class="g-choice" data-k="${k}"><span class="cut-pc__n hud-num">${n + 1}</span><b>${W.states[k]}</b><small dir="ltr">${W.statesEn[k]}</small></button>`).join('')}</div>`;
          ctrl.querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => read(b.dataset.k, b)));
          setTimeout(() => ctrl.querySelector('.g-choice')?.focus({ preventScroll: true }), 40);
        }
      }
      function punch() {
        if (locked || cur.k !== 'set') return; locked = true;
        const r = draw({ g, t: cur.t, a: cur.a, cracks: true, guides: false, force: true });
        fig.classList.add('is-hit');
        ctrl.querySelectorAll('input, button').forEach(x => { x.disabled = true; });
        const ok = r.st === 'ok';
        if (ok) { score++; api.sfx('good'); api.burst(fig, '#46E3A0', 12); } else { api.sfx('bad'); api.shake(fig); misses.push(W.res[r.st][1]); }
        fb.innerHTML = `<b class="${ok ? 'cut-ok' : 'cut-no'}">${W.res[r.st][0]}</b> ${W.res[r.st][1]}`;
        $('[data-s]').textContent = score; i++;
        next = setTimeout(() => { if (i < 10) round(); else stop(true); }, ok ? 1700 : 3200);
      }
      function read(k, btn) {
        if (locked || cur.k !== 'read') return; locked = true;
        const ok = k === cur.st;
        ctrl.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.k === cur.st) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); });
        if (ok) { score++; api.sfx('good'); api.burst(btn, '#46E3A0', 10); } else { api.sfx('bad'); api.shake($('.cut-gg__card')); misses.push(W.res[cur.st][1]); }
        fb.innerHTML = `<b class="${ok ? 'cut-ok' : 'cut-no'}">${ok ? W.right : W.wrong}</b> ${W.res[cur.st][1]}`;
        $('[data-s]').textContent = score; i++;
        next = setTimeout(() => { if (i < 10) round(); else stop(true); }, ok ? 1500 : 3000);
      }
      const onKey = e => {
        if (!el.isConnected || locked || !cur) return;
        if (cur.k === 'set' && e.key === 'Enter') { e.preventDefault(); punch(); return; }
        if (cur.k === 'read') { const n = '123'.indexOf(e.key); const b = ctrl.querySelectorAll('.g-choice')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); b.click(); } }
      };
      document.addEventListener('keydown', onKey);
      function stop(finished) { clearTimeout(next); document.removeEventListener('keydown', onKey); if (finished) endCard(el, api, ctx, { id: 'cut-gap', score, max: 10, W, misses: [...new Set(misses)].slice(0, 4) }); }
      round();
      return () => stop(false);
    }
  };
}

/* =====================================================================================================
   3 · NAME THE CUT — quick-fire (the shared engine), a finished piece and the customer's order
   ===================================================================================================== */
export const NAME = { punch: 'Punching (Piercing)', blank: 'Blanking', fine: 'Fine blanking', notch: 'Notching', perf: 'Perforating', slot: 'Slotting', slit: 'Slitting', lance: 'Lancing', part: 'Parting', cutoff: 'Cutoff', shave: 'Shaving', trim: 'Trimming', nibble: 'Nibbling', emboss: 'Embossing', coin: 'Coining', shear: 'Shearing' };
const NCASES = [
  { id: 'punch', art: ['pb1', { keep: 'sheet' }], confuse: ['blank', 'perf', 'slot', 'notch'] },
  { id: 'blank', art: ['pb1', { keep: 'blank' }], confuse: ['punch', 'fine', 'cutoff', 'part'] },
  { id: 'fine', art: ['fineMini'], confuse: ['blank', 'shave', 'coin', 'emboss'] },
  { id: 'notch', art: ['notch'], confuse: ['nibble', 'trim', 'slot', 'punch'] },
  { id: 'perf', art: ['perf'], confuse: ['punch', 'slot', 'nibble', 'slit'] },
  { id: 'slot', art: ['slot'], confuse: ['slit', 'perf', 'lance', 'part'] },
  { id: 'slit', art: ['slitMini'], confuse: ['slot', 'cutoff', 'shear', 'lance'] },
  { id: 'lance', art: ['lance'], confuse: ['slit', 'slot', 'notch', 'emboss'] },
  { id: 'part', art: ['stripOne', { mode: 'parting' }], confuse: ['cutoff', 'blank', 'trim', 'slit'] },
  { id: 'cutoff', art: ['stripOne', { mode: 'cutoff' }], confuse: ['part', 'slit', 'shear', 'blank'] },
  { id: 'shave', art: ['shave'], confuse: ['trim', 'fine', 'punch', 'notch'] },
  { id: 'trim', art: ['trim'], confuse: ['shave', 'notch', 'cutoff', 'blank'] },
  { id: 'nibble', art: ['nibble'], confuse: ['notch', 'perf', 'slit', 'punch'] },
  { id: 'emboss', art: ['ribs'], confuse: ['coin', 'lance', 'blank', 'fine'] },
  { id: 'coin', art: ['coinFaces'], confuse: ['emboss', 'blank', 'punch', 'fine'] },
  { id: 'shear', art: ['scissor'], confuse: ['slit', 'cutoff', 'blank', 'trim'] }
];
export function nameTheCut(W) {
  return {
    id: 'cut-name', title: W.title, en: 'Name the cut', how: W.how,
    mount(el, api, ctx) {
      // the punching/blanking pair always plays: it is the lecture's most asked question
      const pick = shuffle([...NCASES.filter(c => c.id === 'punch' || c.id === 'blank'), ...shuffle(NCASES.filter(c => c.id !== 'punch' && c.id !== 'blank')).slice(0, 10)]);
      const rounds = pick.map(c => ({
        prompt: W.prompt, sub: W.orders[c.id], art: art(c.art[0], c.art[1]),
        choices: shuffle([c.id, ...shuffle(c.confuse).slice(0, 3)]).map(k => ({ html: `<b dir="ltr">${NAME[k]}</b>`, ok: k === c.id, label: NAME[k] })),
        explain: `<b dir="ltr">${NAME[c.id]}</b> — ${W.why[c.id]}`
      }));
      el.innerHTML = '<div class="cut-qf"></div>';
      fitView(el);
      return quickfire(el.firstElementChild, api, ctx, { id: 'cut-name', intro: W.intro, rounds, time: reduced() ? 24 : 16, layout: 'grid', wins: W.wins });
    }
  };
}
