// Compound zone — trial engines shared by games/compound.js (Arabic words) and games/compound.en.js (English words).
//   which(W): which process makes it? — a product or a clue; spinning, hydroforming or deep drawing (quick-fire engine)
//   label(W): label the machines — the spinning lathe (S4) and the deep drawing die (S15): tap a label, tap its part
//   spin(W):  spin it — read the order, mount the right mandrel, then hold the roller until the disc lies on it
import { quickfire, sample } from './_cte-kit.js';
import { marks } from '../ui/icons.js';
import { PRODUCTS, PROC, SHAPES, latheArt, latheAnchors, drawDieArt, drawAnchors, svg, spinStatic, spinSheet } from '../content/lessons/_compound-art.js';
import { holdButton } from '../content/lessons/_compound-demos.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = n => String(n).padStart(2, '0');
const fitView = el => requestAnimationFrame(() => { const r = el.getBoundingClientRect(); if (r.bottom > innerHeight || r.top < 0) (el.closest('.gamestage') || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); });
let onKeyAll = null;
const setKeys = fn => { if (onKeyAll) document.removeEventListener('keydown', onKeyAll); onKeyAll = fn; if (fn) document.addEventListener('keydown', fn); };

function endCard(el, api, ctx, id, score, max, W, lines) {
  const pct = max ? score / max : 0;
  const [title, line] = pct >= .95 ? lines[0] : pct >= .6 ? lines[1] : lines[2];
  el.innerHTML = `<div class="g-card g-end cmp-end">
    <span class="glyph">${api.GLYPH.spin}</span>
    <p class="label">${W.result}</p>
    <div class="cmp-end__score" dir="ltr"><span class="hud-num">${score}</span><span class="hud-num cmp-end__of">/${max}</span></div>
    <div class="cmp-end__marks"></div>
    <h3>${title}</h3><p>${line}</p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('.cmp-end__score'));
  el.querySelector('.cmp-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  setTimeout(() => el.querySelector('[data-a="again"]')?.focus({ preventScroll: true }), 40);
}

/* =====================================================================================================
   1 · WHICH PROCESS MAKES IT? — four rounds per process, products and clues from the slides
   ===================================================================================================== */
const PROCS = ['spin', 'hydro', 'draw'];
export function which(W) {
  return {
    id: 'compound-which', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const host = document.createElement('div'); host.className = 'cmp-qf'; el.replaceChildren(host);
      fitView(el);
      const picked = shuffle(PROCS.flatMap(p => sample(W.rounds.filter(r => r[0] === p), 4)));
      const rounds = picked.map(([ans, art, prompt, why]) => ({
        prompt, sub: art ? '' : W.clue,
        art: art ? `<span class="cmp-qf__art">${PRODUCTS[art]}</span>` : '',
        choices: PROCS.map(p => ({ html: `<span class="cmp-qf__g">${PROC[p]}</span><span>${W.procs[p][0]}</span>${W.procs[p][1] ? `<small dir="ltr">${W.procs[p][1]}</small>` : ''}`, ok: p === ans, label: W.procs[p][1] || W.procs[p][0] })),
        explain: why
      }));
      return quickfire(host, api, ctx, { id: 'compound-which', intro: W.intro, rounds, time: reduced() ? 18 : 11, layout: 'row' });
    }
  };
}

/* =====================================================================================================
   2 · LABEL THE MACHINES — board 1: the spinning lathe (7 labels) · board 2: the deep drawing die (6 labels)
   ===================================================================================================== */
const BOARDS = [
  { key: 'lathe', scene: 'spinParts', vb: [400, 262], art: () => latheArt('none', ''), done: () => latheArt('names', ''), pins: () => latheAnchors(), order: ['head', 'spindle', 'mandrel', 'sheet', 'clamp', 'tail', 'roller'] },
  { key: 'die', scene: 'drawing', vb: [360, 262], art: () => drawDieArt(.45, 'pins', ''), done: () => drawDieArt(.45, 'names', ''), pins: () => drawAnchors(.45), order: ['dforce', 'hforce', 'punch', 'blank', 'holder', 'die'] }
];
export function label(W) {
  return {
    id: 'compound-label', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const total = BOARDS.reduce((n, b) => n + b.order.length, 0);
      let bi = 0, score = 0, sel = null, selPin = null, missed = new Set(), placed = new Set(); const timers = [];
      function board() {
        const B = BOARDS[bi], P = B.pins(), [vw, vh] = B.vb;
        placed = new Set(); missed = new Set(); sel = null; selPin = null;
        const pinOrder = B.order.map((k, i) => [k, i + 1]);
        const chips = shuffle(B.order);
        el.innerHTML = `<div class="cmp-lbl">
          <div class="g-hud"><span class="chip" dir="ltr">${W.board} <span class="hud-num">${bi + 1}</span>/<span class="hud-num">${BOARDS.length}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>${score}</span></span></div>
          <p class="cmp-lbl__t"><b>${W.boards[B.key][0]}</b> <small dir="ltr">${W.boards[B.key][1]}</small></p>
          <div class="cmp-lbl__fig" style="aspect-ratio:${vw}/${vh}">${B.art()}
            ${pinOrder.map(([k, n]) => `<button type="button" class="cmp-pin" data-k="${k}" style="left:${(P[k][0] / vw * 100).toFixed(2)}%;top:${(P[k][1] / vh * 100).toFixed(2)}%" aria-label="${W.pin} ${n}">${n}</button>`).join('')}</div>
          <p class="cmp-lbl__q" aria-live="polite">${W.ask}</p>
          <div class="cmp-chips" role="group" aria-label="${W.labels}">${chips.map(k => `<button type="button" class="cmp-chip" data-k="${k}" aria-pressed="false" dir="ltr">${W.names[k]}</button>`).join('')}</div>
          <p class="cmp-fb" aria-live="polite"></p></div>`;
        api.scene(B.scene);
        fitView(el);
        el.querySelectorAll('.cmp-chip').forEach(c => c.addEventListener('click', () => pickChip(c.dataset.k)));
        el.querySelectorAll('.cmp-pin').forEach(p => p.addEventListener('click', () => pickPin(p.dataset.k)));
        setKeys(e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= B.order.length && !e.target.closest('input')) { e.preventDefault(); const k = B.order[n - 1]; el.querySelector(`.cmp-pin[data-k="${k}"]`)?.focus({ preventScroll: true }); pickPin(k); } });
      }
      const $chip = k => el.querySelector(`.cmp-chip[data-k="${k}"]`), $pin = k => el.querySelector(`.cmp-pin[data-k="${k}"]`);
      function pickChip(k) {
        if (placed.has(k)) return;
        sel = sel === k ? null : k;
        el.querySelectorAll('.cmp-chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.k === sel)));
        api.sfx('click');
        if (sel && selPin) { const p = selPin; selPin = null; el.querySelectorAll('.cmp-pin').forEach(x => x.classList.remove('is-sel')); place(sel, p); }
        else el.querySelector('.cmp-lbl__q').textContent = sel ? W.nowPin : W.ask;
      }
      function pickPin(k) {
        if (placed.has(k)) return;
        if (!sel) { selPin = k; el.querySelectorAll('.cmp-pin').forEach(x => x.classList.toggle('is-sel', x.dataset.k === k)); el.querySelector('.cmp-lbl__q').textContent = W.nowChip; api.sfx('click'); return; }
        place(sel, k);
      }
      function place(chipK, pinK) {
        const fb = el.querySelector('.cmp-fb');
        if (chipK === pinK) {
          placed.add(pinK); if (!missed.has(chipK)) score++;
          const pin = $pin(pinK), chip = $chip(chipK);
          pin.classList.add('is-ok'); pin.disabled = true; pin.setAttribute('aria-label', W.names[pinK]);
          chip.disabled = true; chip.setAttribute('aria-pressed', 'false'); chip.classList.add('is-done'); chip.dataset.n = pin.textContent;
          sel = null; api.sfx('good'); api.burst(pin, '#46E3A0', 8);
          fb.innerHTML = `<b class="cmp-ok">${W.right}</b> ${W.hints[pinK]}`;
          el.querySelector('[data-s]').textContent = score;
          el.querySelector('.cmp-lbl__q').textContent = W.ask;
          if (placed.size === BOARDS[bi].order.length) timers.push(setTimeout(boardDone, reduced() ? 500 : 900));
        } else {
          missed.add(chipK); api.sfx('bad'); api.shake($pin(pinK));
          fb.innerHTML = `<b class="cmp-no">${W.wrong}</b> ${W.notThat(W.names[chipK])}`;
        }
      }
      function boardDone() {
        const B = BOARDS[bi], last = bi === BOARDS.length - 1;
        setKeys(null);
        el.querySelector('.cmp-lbl__fig').innerHTML = B.done();
        el.querySelector('.cmp-lbl__q').innerHTML = `<b class="cmp-ok">${W.boardDone}</b>`;
        el.querySelector('.cmp-chips').innerHTML = `<button type="button" class="btn btn--zone" data-a="next">${last ? W.finish : W.next}</button>`;
        const nb = el.querySelector('[data-a="next"]'); nb.focus({ preventScroll: true });
        api.sfx('level');
        nb.addEventListener('click', () => { if (last) endCard(el, api, ctx, 'compound-label', score, total, W, W.lines); else { bi++; board(); } });
      }
      board();
      return () => { timers.forEach(clearTimeout); setKeys(null); };
    }
  };
}

/* =====================================================================================================
   3 · SPIN IT — six orders; mount the mandrel that gives the shape, then hold the roller (S3–S5)
   ===================================================================================================== */
export const SPIN_ORDERS = { hemi: ['bowl', 'domecap'], cone: ['cone', 'hopper'], cyl: ['ferrule', 'housing', 'lid'] };
export function spin(W) {
  return {
    id: 'compound-spin', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const set = shuffle(Object.entries(SPIN_ORDERS).flatMap(([shape, items]) => sample(items, 2).map(k => [k, shape])));
      const N = set.length, MAX = N * 2;
      let i = 0, score = 0, tries = 0, p = 0, raf = 0, last = 0, held = false, phase = 'pick', stopHold = null; const timers = [];
      el.innerHTML = `<div class="cmp-spn">
        <div class="g-hud"><span class="chip" dir="ltr">${W.order} <span class="hud-num" data-n>01</span>/<span class="hud-num">${pad(N)}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></div>
        <div class="cmp-spn__top">
          <div class="cmp-spn__order"><span class="cmp-spn__g"></span><div><p class="label">${W.ordered}</p><b class="cmp-spn__name"></b></div></div>
          <div class="cmp-spn__lathe"></div>
        </div>
        <p class="cmp-spn__q" aria-live="polite"></p>
        <div class="cmp-spn__acts"></div>
        <p class="cmp-fb" aria-live="polite"></p></div>`;
      fitView(el);
      const $ = s => el.querySelector(s);
      const latheSvg = shape => svg('0 0 360 220', (shape ? spinStatic(shape, { spin: true }) : `<g opacity=".35">${spinStatic('cyl')}</g>`) + `<g class="cmp-spin__sheet">${shape ? spinSheet(0, shape) : ''}</g>`, W.lathe, 'cmp-art cmp-spinart');
      function round() {
        const [k] = set[i]; tries = 0; p = 0; phase = 'pick';
        $('[data-n]').textContent = pad(i + 1);
        $('.cmp-spn__g').innerHTML = PRODUCTS[k];
        $('.cmp-spn__name').innerHTML = `${W.products[k][0]}${W.products[k][1] ? ` <small dir="ltr">${W.products[k][1]}</small>` : ''}`;
        $('.cmp-spn__lathe').innerHTML = latheSvg(null);
        $('.cmp-spn__q').textContent = W.pick;
        $('.cmp-fb').innerHTML = '';
        $('.cmp-spn__acts').innerHTML = `<div class="cmp-mandrels" role="group" aria-label="${W.pick}">${['hemi', 'cone', 'cyl'].map((s, n) => `<button type="button" class="g-choice cmp-mandrel" data-s="${s}"><span class="cmp-mandrel__g">${SHAPES[s]}</span><b>${W.shapes[s][0]}</b>${W.shapes[s][1] ? `<small dir="ltr">${W.shapes[s][1]}</small>` : ''}<span class="cmp-key" aria-hidden="true">${n + 1}</span></button>`).join('')}</div>`;
        el.querySelectorAll('.cmp-mandrel').forEach(b => b.addEventListener('click', () => mount(b.dataset.s, b)));
        setKeys(e => { const n = '123'.indexOf(e.key); if (n >= 0 && phase === 'pick') { e.preventDefault(); const b = el.querySelectorAll('.cmp-mandrel')[n]; mount(b.dataset.s, b); } });
      }
      function mount(shape, btn) {
        if (phase !== 'pick' || btn.disabled) return;
        const [k, want] = set[i]; tries++;
        if (shape !== want) {
          btn.disabled = true; btn.classList.add('is-wrong'); api.sfx('bad'); api.shake(btn);
          $('.cmp-fb').innerHTML = `<b class="cmp-no">${W.wrong}</b> ${W.notShape(W.shapes[shape][0], W.products[k][0])}`;
          return;
        }
        const pts = tries === 1 ? 2 : tries === 2 ? 1 : 0; score += pts;
        $('[data-s]').textContent = score; api.sfx('good'); btn.classList.add('is-right');
        $('.cmp-fb').innerHTML = `<b class="cmp-ok">${W.right}</b> ${W.why[want]}`;
        phase = 'spin'; setKeys(null);
        api.scene('spinning');
        $('.cmp-spn__lathe').innerHTML = latheSvg(want);
        $('.cmp-spn__q').textContent = W.holdNow;
        $('.cmp-spn__acts').innerHTML = `<button type="button" class="btn btn--zone btn--block cmp-hold">${W.hold}</button><div class="cmp-meter"><span class="label">${W.formed}</span><b class="hud-num" data-v>0%</b><div class="bar"><i style="--p:0"></i></div></div>`;
        const hb = $('.cmp-hold'); hb.focus({ preventScroll: true });
        const box = $('.cmp-spn'), sheet = () => $('.cmp-spin__sheet');
        const paint = () => { sheet().innerHTML = spinSheet(p, want); $('[data-v]').textContent = Math.round(p * 100) + '%'; $('.cmp-meter .bar i').style.setProperty('--p', p); };
        const step = now => {
          const dt = Math.min(.05, (now - last) / 1000); last = now;
          if (held && p < 1) { p = Math.min(1, p + dt * .45); paint(); }
          if (p >= 1) { formed(); return; }
          raf = held ? requestAnimationFrame(step) : 0;
        };
        stopHold = holdButton(hb, v => { held = v; box.classList.toggle('is-spinning', v && !reduced()); if (v) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(step); } });
      }
      function formed() {
        if (phase !== 'spin') return; phase = 'done'; held = false; stopHold?.(); stopHold = null; cancelAnimationFrame(raf);
        $('.cmp-spn').classList.remove('is-spinning');
        const [k] = set[i];
        $('.cmp-spn__q').innerHTML = `<b class="cmp-ok">${W.made(W.products[k][0])}</b>`;
        $('.cmp-hold').disabled = true; api.sfx('coin');
        timers.push(setTimeout(() => { i++; if (i < N) round(); else { setKeys(null); endCard(el, api, ctx, 'compound-spin', score, MAX, W, W.lines); } }, reduced() ? 900 : 1400));
      }
      round();
      return () => { phase = 'done'; cancelAnimationFrame(raf); stopHold?.(); timers.forEach(clearTimeout); setKeys(null); };
    }
  };
}
