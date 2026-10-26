// Iron zone — trial engines shared by games/iron.js (Arabic words) and games/iron.en.js (English words).
//   foundry(W): the pouring floor — orders arrive, you pour the right cast iron before the clock runs out
//   routes(W):  foundry routes — turn the casting you're given into the iron the order asks for (chill, heat-treat, alloy)
//   odd(W):     odd one out — three facts belong to one iron; tap the one that doesn't (quick-fire engine)
import { quickfire, sample } from './_cte-kit.js';
import { marks } from '../ui/icons.js';
import { MICRO, GLY } from '../content/lessons/_iron-art.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = n => String(n).padStart(2, '0');
export const IRONS = ['gray', 'ductile', 'white', 'cgi', 'malleable', 'alloy'];
const SCENE = { gray: 'grayIron', ductile: 'ductileIron', white: 'whiteIron', cgi: 'cgi', malleable: 'malleableIron', alloy: 'alloyIrons' };
/** phones keep the stage above the trial: bring the trial's top into view once */
const fitView = el => requestAnimationFrame(() => { const r = el.getBoundingClientRect(); if (r.bottom > innerHeight || r.top < 0) (el.closest('.gamestage') || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); });

/** the end card every custom iron trial shares */
function endCard(el, api, ctx, id, score, max, W, lines) {
  const pct = max ? score / max : 0;
  const [title, line] = pct >= .95 ? lines[0] : pct >= .6 ? lines[1] : lines[2];
  el.innerHTML = `<div class="g-card g-end irn-end">
    <span class="glyph">${api.GLYPH.ingot}</span>
    <p class="label">${W.result}</p>
    <div class="irn-end__score" dir="ltr"><span class="hud-num">${score}</span><span class="hud-num irn-end__of">/${max}</span></div>
    <div class="irn-end__marks"></div>
    <h3>${title}</h3><p>${line}</p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('.irn-end__score'));
  el.querySelector('.irn-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  setTimeout(() => el.querySelector('[data-a="again"]')?.focus({ preventScroll: true }), 40);
}

/* =====================================================================================================
   1 · FOUNDRY ORDERS — two orders per iron, twelve in all; some parts take two irons (the slides list both)
   ===================================================================================================== */
export const ORDERS = {
  gray: [['g-flywheel', ['gray'], 'flywheel'], ['g-base', ['gray'], 'base'], ['g-engine', ['gray', 'cgi'], 'engine'], ['g-disc', ['gray'], 'brake'], ['g-bed', ['gray'], 'base']],
  ductile: [['d-crank', ['ductile'], 'crank'], ['d-gear', ['ductile'], 'gear'], ['d-mg', ['ductile'], 'ladle']],
  white: [['w-crusher', ['white'], 'crusher'], ['w-nozzle', ['white'], 'nozzle'], ['w-shoe', ['white'], 'shoe'], ['w-rolls', ['white'], 'rolls']],
  cgi: [['c-manifold', ['cgi'], 'manifold'], ['c-pump', ['cgi'], 'pump'], ['c-drum', ['cgi', 'gray'], 'brake']],
  malleable: [['m-bearing', ['malleable'], 'bearing'], ['m-farm', ['malleable'], 'tractor'], ['m-build', ['malleable'], 'digger'], ['m-rail', ['malleable'], 'bearing']],
  alloy: [['a-cr', ['alloy'], 'shield'], ['a-ni', ['alloy'], 'magnet'], ['a-exp', ['alloy'], 'thermo']]
};
export function foundry(W) {
  return {
    id: 'iron-foundry', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const N = 12, LIMIT = reduced() ? 22000 : 15000;
      // two orders per iron, never the same part twice, in a random order
      const set = shuffle(IRONS.flatMap(k => sample(ORDERS[k], 2)));
      let i = 0, score = 0, combo = 0, best = 0, locked = true, raf = 0; const timers = [];
      el.innerHTML = `<div class="irn-fdy">
        <div class="g-hud"><span class="chip" dir="ltr">${W.order} <span class="hud-num" data-n>01</span>/<span class="hud-num">${pad(N)}</span></span>
          <span class="irn-hud-r"><span class="chip irn-combo" hidden>${W.combo} <span class="hud-num" dir="ltr">×2</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></span></div>
        <div class="g-timer"><i style="--t:1"></i></div>
        <div class="irn-fdy__floor">
          <article class="irn-ticket" aria-live="polite"><header><span class="irn-ticket__no hud-num" dir="ltr"></span><span class="irn-ticket__tag">${W.ticket}</span></header>
            <div class="irn-ticket__body"><span class="irn-ticket__g"></span><div><b class="irn-ticket__part"></b><small class="irn-ticket__spec"></small></div></div>
            <span class="irn-stamp" hidden></span></article>
          <div class="irn-mold" aria-hidden="true"><span class="irn-mold__cav"><span class="irn-mold__fill"></span><span class="irn-mold__g"></span></span><small class="irn-mold__n"></small></div>
        </div>
        <p class="irn-fdy__q">${W.ask}</p>
        <div class="irn-ladles" role="group" aria-label="${W.ask}">${IRONS.map((k, n) => `<button type="button" class="g-choice irn-ladle" data-k="${k}"><span class="irn-ladle__g">${MICRO[k]}</span><b>${W.irons[k][0]}</b>${W.irons[k][1] ? `<small dir="ltr">${W.irons[k][1]}</small>` : ''}<span class="irn-key" aria-hidden="true">${n + 1}</span></button>`).join('')}</div>
        <p class="irn-fb" aria-live="polite"></p></div>`;
      fitView(el);
      const $ = s => el.querySelector(s), btns = [...el.querySelectorAll('.irn-ladle')], bar = $('.g-timer i');
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      function round() {
        locked = false;
        const [id, ok, icon] = set[i];
        $('[data-n]').textContent = pad(i + 1);
        $('.irn-ticket__no').textContent = `#${pad(i + 7)}${String.fromCharCode(65 + i % 5)}`;
        $('.irn-ticket__g').innerHTML = GLY[icon] || GLY.ladle;
        $('.irn-ticket__part').textContent = W.orders[id][0];
        $('.irn-ticket__spec').textContent = W.orders[id][1];
        const st = $('.irn-stamp'); st.hidden = true; st.className = 'irn-stamp';
        $('.irn-ticket').classList.remove('is-in'); void $('.irn-ticket').offsetWidth; $('.irn-ticket').classList.add('is-in');
        $('.irn-mold').className = 'irn-mold'; $('.irn-mold__g').innerHTML = ''; $('.irn-mold__n').textContent = '';
        $('.irn-fb').innerHTML = '';
        btns.forEach(b => { b.disabled = false; b.classList.remove('is-right', 'is-wrong'); });
        const t0 = performance.now();
        const tick = now => { if (locked) return; const left = 1 - (now - t0) / LIMIT; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) { pour(null); return; } raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
        (void ok);
      }
      function pour(k) {
        if (locked) return; locked = true; cancelAnimationFrame(raf);
        const [id, ok] = set[i];
        const right = k !== null && ok.includes(k);
        btns.forEach(b => { b.disabled = true; if (ok.includes(b.dataset.k)) b.classList.add('is-right'); else if (b.dataset.k === k) b.classList.add('is-wrong'); });
        const mold = $('.irn-mold'), st = $('.irn-stamp');
        if (k) { mold.classList.add('is-poured'); $('.irn-mold__g').innerHTML = MICRO[k]; $('.irn-mold__n').textContent = W.irons[k][0]; }
        st.hidden = false; st.textContent = k === null ? W.late : right ? W.shipped : W.returned; st.classList.add(right ? 'is-ok' : 'is-no');
        if (right) { score++; combo++; best = Math.max(best, combo); api.sfx('good'); api.burst(btns.find(b => b.dataset.k === k), '#46E3A0', 10); }
        else { combo = 0; api.sfx('bad'); api.shake($('.irn-ticket')); }
        $('[data-s]').textContent = score;
        const cb = $('.irn-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
        $('.irn-fb').innerHTML = `<b class="${right ? 'irn-ok' : 'irn-no'}">${k === null ? W.timeUp : right ? W.right : W.wrong}</b> ${W.orders[id][2]}`;
        api.scene(SCENE[ok[0]]);
        later(() => { i++; if (i < N) round(); else finish(); }, right ? (reduced() ? 1300 : 1600) : 3000);
      }
      function finish() { setKeys(null); endCard(el, api, ctx, 'iron-foundry', score, N, W, W.lines); }
      btns.forEach(b => b.addEventListener('click', () => pour(b.dataset.k)));
      let onKey = null; const setKeys = fn => { if (onKey) document.removeEventListener('keydown', onKey); onKey = fn; if (fn) document.addEventListener('keydown', fn); };
      setKeys(e => { const n = '123456'.indexOf(e.key); if (n >= 0 && !locked) { e.preventDefault(); pour(IRONS[n]); } });
      round();
      return () => { locked = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); setKeys(null); };
    }
  };
}

/* =====================================================================================================
   2 · FOUNDRY ROUTES — start from the casting you're given, add steps, pour: did you make the iron ordered?
   The slides' links: gray/ductile + chilling in the mold → white (S18) · white + heat treatment → malleable (S20) ·
   gray/ductile/white + up to 35% alloy → high-alloy: chromium or nickel (S21). Ductile contains trace magnesium (S17).
   ===================================================================================================== */
export const STEPS = ['chill', 'heat', 'mg', 'cr', 'ni'];
/** what one step does to a casting ('?' = a route the slides don't give) */
export function stepOf(state, step) {
  if (step === 'chill') return state === 'gray' || state === 'ductile' ? 'white' : '?';
  if (step === 'heat') return state === 'white' ? 'malleable' : '?';
  if (step === 'mg') return state === 'gray' ? 'ductile' : '?';
  if (step === 'cr') return ['gray', 'ductile', 'white'].includes(state) ? 'highcr' : '?';
  if (step === 'ni') return ['gray', 'ductile', 'white'].includes(state) ? 'nickel' : '?';
  return '?';
}
export const ROUTES = [['gray', 'white', 'r-crusher'], ['ductile', 'malleable', 'r-bearing'], ['white', 'highcr', 'r-oxid'], ['gray', 'nickel', 'r-nonmag'], ['gray', 'malleable', 'r-farm'], ['ductile', 'white', 'r-rolls']];
export function routes(W) {
  return {
    id: 'iron-routes', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const set = shuffle(ROUTES).slice(0, 5), N = set.length, MAXSTEPS = 3;
      let i = 0, score = 0, path = [], locked = false; const timers = [];
      el.innerHTML = `<div class="irn-rte">
        <div class="g-hud"><span class="chip" dir="ltr">${W.round} <span class="hud-num" data-n>01</span>/<span class="hud-num">${pad(N)}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num" data-s>0</span></span></div>
        <div class="irn-rte__order"><p class="label">${W.make}</p><b class="irn-rte__target"></b><small class="irn-rte__for"></small></div>
        <ol class="irn-rte__line" aria-live="polite"></ol>
        <p class="irn-rte__q">${W.ask}</p>
        <div class="irn-rte__steps" role="group" aria-label="${W.ask}">${STEPS.map((s, n) => `<button type="button" class="irn-step" data-s="${s}"><span class="irn-key" aria-hidden="true">${n + 1}</span><b>${W.steps[s][0]}</b><small>${W.steps[s][1]}</small></button>`).join('')}</div>
        <div class="g-acts irn-rte__acts"><button type="button" class="btn btn--sm" data-a="undo">${W.undo}</button><button type="button" class="btn btn--zone" data-a="pour">${W.pour}</button></div>
        <p class="irn-fb" aria-live="polite"></p></div>`;
      fitView(el);
      const $ = s => el.querySelector(s), steps = [...el.querySelectorAll('.irn-step')], undoB = $('[data-a="undo"]'), pourB = $('[data-a="pour"]');
      const chip = (k, cls = '') => `<li class="irn-rte__st ${cls}"><span class="irn-rte__g">${MICRO[{ highcr: 'alloy', nickel: 'alloy' }[k] || k] || ''}</span><b>${W.names[k][0]}</b>${W.names[k][1] ? `<small dir="ltr">${W.names[k][1]}</small>` : ''}</li>`;
      function draw(result) {
        const [start] = set[i];
        let st = start, html = chip(start, 'is-start');
        path.forEach(s => { st = result ? stepOf(st, s) : st; html += `<li class="irn-rte__arrow" aria-hidden="true">→</li><li class="irn-rte__step">${W.steps[s][0]}</li>` + (result ? `<li class="irn-rte__arrow" aria-hidden="true">→</li>${st === '?' ? `<li class="irn-rte__st is-bad"><b>?</b></li>` : chip(st)}` : ''); });
        if (!result) html += `<li class="irn-rte__arrow" aria-hidden="true">→</li><li class="irn-rte__st is-q"><b>?</b></li>`;
        $('.irn-rte__line').innerHTML = html;
        undoB.disabled = locked || !path.length; pourB.disabled = locked || !path.length;
        steps.forEach(b => { b.disabled = locked || path.length >= MAXSTEPS; });
      }
      function round() {
        locked = false; path = [];
        const [, target, why] = set[i];
        $('[data-n]').textContent = pad(i + 1);
        $('.irn-rte__target').innerHTML = `${W.names[target][0]}${W.names[target][1] ? ` <small dir="ltr">${W.names[target][1]}</small>` : ''}`;
        $('.irn-rte__for').textContent = W.orders[why];
        $('.irn-fb').innerHTML = '';
        draw(false);
      }
      const add = s => { if (locked || path.length >= MAXSTEPS) return; path.push(s); api.sfx('click'); draw(false); };
      const undo = () => { if (locked || !path.length) return; path.pop(); api.sfx('flip'); draw(false); };
      function pour() {
        if (locked || !path.length) return; locked = true;
        const [start, target, why] = set[i];
        const end = path.reduce(stepOf, start), ok = end === target;
        draw(true);
        if (ok) { score++; api.sfx('good'); api.burst(pourB, '#46E3A0', 12); } else { api.sfx('bad'); api.shake($('.irn-rte__line')); }
        $('[data-s]').textContent = score;
        $('.irn-fb').innerHTML = `<b class="${ok ? 'irn-ok' : 'irn-no'}">${ok ? W.right : end === '?' ? W.lost : W.other(W.names[end][0])}</b> ${W.howto[target]}`;
        api.scene(SCENE[{ highcr: 'alloy', nickel: 'alloy' }[target] || target]);
        timers.push(setTimeout(() => { i++; if (i < N) round(); else { setKeys(null); endCard(el, api, ctx, 'iron-routes', score, N, W, W.lines); } }, ok ? 1900 : 3600));
        (void why);
      }
      steps.forEach(b => b.addEventListener('click', () => add(b.dataset.s)));
      undoB.addEventListener('click', undo); pourB.addEventListener('click', pour);
      let onKey = null; const setKeys = fn => { if (onKey) document.removeEventListener('keydown', onKey); onKey = fn; if (fn) document.addEventListener('keydown', fn); };
      setKeys(e => {
        if (e.target.closest('input, textarea')) return;
        const n = '12345'.indexOf(e.key);
        if (n >= 0) { e.preventDefault(); add(STEPS[n]); }
        else if (e.key === 'Backspace') { e.preventDefault(); undo(); }
        else if (e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); pour(); }
      });
      round();
      return () => { locked = true; timers.forEach(clearTimeout); setKeys(null); };
    }
  };
}

/* =====================================================================================================
   3 · ODD ONE OUT — the quick-fire engine: three facts of one iron + one intruder from another
   ===================================================================================================== */
export function odd(W) {
  return {
    id: 'iron-odd', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const host = document.createElement('div'); host.className = 'irn-qf'; el.replaceChildren(host);
      fitView(el);
      const rounds = sample(W.rounds, 10).map(([iron, three, intruder, why]) => ({
        prompt: W.prompt(W.irons[iron]),
        choices: shuffle([...three.map(t => ({ html: `<span class="irn-qf__t" dir="ltr">${t}</span>`, ok: false })), { html: `<span class="irn-qf__t" dir="ltr">${intruder}</span>`, ok: true }]),
        explain: why
      }));
      return quickfire(host, api, ctx, { id: 'iron-odd', intro: W.intro, rounds, time: reduced() ? 24 : 16, layout: 'list', wins: W.wins });
    }
  };
}
