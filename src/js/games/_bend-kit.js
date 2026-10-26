// Trials kit — bend: the engines of the three trials. Each edition (bend.js · bend.en.js) passes its own words (W),
// so the English file stays free of Arabic.
//   springTrial(W) — "Beat the springback": pick the tool angle so the part springs back onto the target angle
//   flatTrial(W)   — "Flat length": read the drawing, pick the formula, then do the sum (Lt with BA or BD, K = t/T)
//   spotTrial(W)   — quick-fire: foil/sheet/plate, V or edge, the six operations, the tree, rolls and tubes
import { marks } from '../ui/icons.js';
import { quickfire, shuffleIn } from './_cte-kit.js';
import { C, tx, svg, dim, arcD, ah, vSheet, ART } from '../data/figs/bend.js';

const f = v => +(+v).toFixed(2);
const rad = d => d * Math.PI / 180;
const reduced = () => document.documentElement.dataset.motion === 'reduce' || (document.documentElement.dataset.motion !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);
const fmt = v => String(+(+v).toFixed(3));
const one = v => (Math.round(v * 10) / 10).toFixed(1);
const tier = (pct, lines) => (pct >= .9 ? lines[0] : pct >= .6 ? lines[1] : lines[2]);
const shuffle = a => shuffleIn(a);

/** one keyboard listener at a time per trial */
function keyHub() { let fn = null; return h => { if (fn) document.removeEventListener('keydown', fn); fn = h; if (h) document.addEventListener('keydown', h); }; }
/** timers that die with the trial */
function clock() { const ts = new Set(); let raf = 0; return { later(fn, ms) { const t = setTimeout(() => { ts.delete(t); fn(); }, ms); ts.add(t); }, raf(fn) { raf = requestAnimationFrame(fn); }, stop() { ts.forEach(clearTimeout); ts.clear(); cancelAnimationFrame(raf); } }; }

function intro(el, W, go, setKeys) {
  el.innerHTML = `<div class="g-card bnd-intro">
    <h3 class="bnd-intro__t">${W.intro.title}</h3>
    <p class="bnd-intro__p">${W.intro.text}</p>
    <ul class="bnd-rules">${W.intro.rules.map((r, k) => `<li><span class="hud-num">${String(k + 1).padStart(2, '0')}</span><span>${r}</span></li>`).join('')}</ul>
    <div class="g-acts bnd-intro__acts"><button type="button" class="btn btn--zone btn--lg" data-a="go">${W.start}</button><span class="bnd-kbd">${W.orPress} <kbd>Enter</kbd></span></div>
  </div>`;
  el.querySelector('[data-a="go"]').addEventListener('click', go);
  setKeys(e => { if (e.key === 'Enter' && !e.target.closest('button,input')) { e.preventDefault(); go(); } });
  setTimeout(() => el.querySelector('[data-a="go"]')?.focus({ preventScroll: true }), 30);
}
function endCard(el, api, ctx, { id, score, max, W, extra = '' }) {
  const line = tier(max ? score / max : 0, W.lines);
  el.innerHTML = `<div class="g-card g-end bnd-end">
    <span class="glyph">${api.GLYPH.bend}</span>
    <p class="label">${W.result}</p>
    <div class="bnd-end__score" dir="ltr"><span class="hud-num">${score}</span><span class="hud-num bnd-end__of">/${max}</span></div>
    <div class="bnd-end__marks"></div>
    <h3>${line[0]}</h3><p>${line[1]}</p>${extra}
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">${W.again}</button><button type="button" class="btn" data-a="back">${W.back}</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('.bnd-end__score'));
  el.querySelector('.bnd-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  setTimeout(() => el.querySelector('[data-a="again"]')?.focus({ preventScroll: true }), 30);
}

/* =====================================================================================================
   1 · Beat the springback
   ===================================================================================================== */
// A simple shop model (not from the slides): after the punch leaves, the bend angle keeps a fixed share s of what
// the tool gave it, so the included angle opens to 180 − s·(180 − tool). Rounds 1–3 come with a test bend;
// rounds 4–6 give you a free trial bend first: bend, measure, correct — the way a press brake operator works.
export const SPRING_ROUNDS = [
  { target: 90, s: 87 / 90, test: [90, 93] },
  { target: 90, s: 84 / 90, test: [90, 96] },
  { target: 120, s: 58 / 60, test: [120, 122] },
  { target: 60, s: .95, test: null },
  { target: 90, s: .93, test: null },
  { target: 135, s: .92, test: null }
];
export const springAfter = (tool, s) => 180 - s * (180 - tool);
export const bestTool = (target, s) => 180 - (180 - target) / s;
const springPts = err => (err <= .75 ? 3 : err <= 2 ? 2 : err <= 4 ? 1 : 0);

/** the press brake on stage: die and punch at the tool angle, the sheet at `alpha`, the target as a dashed ghost */
function springStage({ tool, alpha, punch, target, done }) {
  const cx = 160, top = 156, th = 7, half = tool / 2;
  let w = 46 * Math.tan(rad(half)), depth = 46;
  if (w > 104) { w = 104; depth = w / Math.tan(rad(half)); }
  const sh = Math.min(Math.max(alpha / 2, .6), 89.9);
  const ay = top + (alpha >= 179.5 ? 0 : Math.min(w / Math.tan(rad(sh)), depth));
  let s = `<path d="M${cx - 150} ${top}H${f(cx - w)}L${cx} ${f(top + depth)}L${f(cx + w)} ${top}H${cx + 150}V${f(top + Math.max(depth, 24) + 20)}H${cx - 150}Z" fill="${C.steel}" fill-opacity=".42" stroke="${C.ink}" stroke-width="1.4"/>`;
  { const tg = target / 2, ty = top + w / Math.tan(rad(tg)), L = 112; s += `<path d="M${f(cx - L * Math.sin(rad(tg)))} ${f(ty - L * Math.cos(rad(tg)))}L${cx} ${f(ty)}L${f(cx + L * Math.sin(rad(tg)))} ${f(ty - L * Math.cos(rad(tg)))}" stroke="${C.good}" stroke-width="1.6" stroke-dasharray="6 4"/>${tx(f(cx + L * Math.sin(rad(tg)) + 4), f(ty - L * Math.cos(rad(tg)) - 4), 'target', { c: C.good, z: 13, w: 600, a: 'start' })}`; }
  s += `<path d="${vSheet(cx, ay, sh, 124, th, 5)}" fill="${C.zc}" fill-opacity=".55" stroke="${C.ink}" stroke-width="1.4"/>`;
  const tipDown = ay - th / Math.sin(rad(sh)), tipUp = top - 104, tip = tipUp + (tipDown - tipUp) * punch;
  const shh = Math.min(20 / Math.tan(rad(half)), 64);
  s += `<path d="M${cx - 20} ${f(tip - shh - 140)}H${cx + 20}V${f(tip - shh)}L${cx} ${f(tip)}L${cx - 20} ${f(tip - shh)}Z" fill="${C.steel}" fill-opacity=".2" stroke="${C.ink}" stroke-width="1.4"/>`;
  if (done) {
    const ua = ay - th / Math.sin(rad(sh)), r = 30;
    s += `<path d="${arcD(cx, ua, r, 270 - sh, 270 + sh)}" stroke="${C.zt}" stroke-width="1.5"/>${ah(f(cx + r * Math.cos(rad(270 + sh))), f(ua + r * Math.sin(rad(270 + sh))), rad(360 + sh), C.zt, 6)}${tx(cx, f(ua - r - 8), 'α′', { c: C.zt, z: 16, w: 700 })}`;
  }
  return svg('0 0 320 232', s, 'A punch and V-die bending a sheet');
}

export function springTrial(W) {
  return {
    id: 'bend-springback', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const setKeys = keyHub(), T = clock();
      let i = 0, score = 0, tool = 90, shot = 0, busy = false;
      const R = () => SPRING_ROUNDS[i];
      const stopAll = () => { T.stop(); setKeys(null); };
      function round() {
        const r = R(); tool = r.target; shot = 0; busy = false;
        el.innerHTML = `<div class="g-card bnd-sb">
          <div class="g-hud"><span class="chip">${W.round} <span class="hud-num" dir="ltr">${i + 1}/${SPRING_ROUNDS.length}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num bnd-sb__s">${score}</span></span></div>
          <div class="bnd-sb__grid">
            <div class="bnd-sb__fig"></div>
            <div class="bnd-sb__side">
              <p class="bnd-sb__target"><span class="label">${W.target}</span><b class="hud-num" dir="ltr">${r.target}°</b></p>
              <p class="bnd-sb__info">${r.test ? W.test(r.test[0], r.test[1]) : W.trial}</p>
              <div class="bnd-tool" dir="ltr"><button type="button" class="btn btn--sm" data-d="-1" aria-label="−0.5°">−</button><output class="hud-num bnd-tool__v"></output><button type="button" class="btn btn--sm" data-d="1" aria-label="+0.5°">+</button></div>
              <label class="bnd-tool__lab"><span class="label">${W.tool}</span><input type="range" dir="ltr" min="40" max="175" step="0.5" value="${tool}" aria-label="${W.tool.replace(/<[^>]+>/g, '')}"></label>
              <button type="button" class="btn btn--zone btn--block" data-a="bend">${W.bend}</button>
              <p class="bnd-fb" aria-live="polite"></p>
              <button type="button" class="btn btn--block" data-a="next" hidden>${i + 1 < SPRING_ROUNDS.length ? W.next : W.finish}</button>
            </div>
          </div></div>`;
        if (i === 0) el.querySelector('.bnd-sb')?.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
        const fig = el.querySelector('.bnd-sb__fig'), out = el.querySelector('.bnd-tool__v'), range = el.querySelector('input'), bend = el.querySelector('[data-a="bend"]'), next = el.querySelector('[data-a="next"]'), fb = el.querySelector('.bnd-fb');
        const paint = (alpha = 180, punch = 0, done = false) => { fig.innerHTML = springStage({ tool, alpha, punch, target: r.target, done }); };
        const setTool = v => { tool = Math.max(40, Math.min(175, Math.round(v * 2) / 2)); out.textContent = one(tool) + '°'; range.value = tool; if (!busy) paint(); };
        el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', e => { if (busy) return; setTool(tool + (+b.dataset.d) * (e.shiftKey ? 5 : .5)); api.sfx('click'); }));
        range.addEventListener('input', () => { if (!busy) setTool(+range.value); });
        bend.addEventListener('click', doBend);
        next.addEventListener('click', advance);
        setKeys(e => {
          if (e.key === 'Enter') { if (!next.hidden) { e.preventDefault(); advance(); } else if (!busy && !e.target.closest('button')) { e.preventDefault(); doBend(); } return; }
          if (e.target === range || busy) return;
          const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, '-': -1, '+': 1, '=': 1 }[e.key];
          if (d) { e.preventDefault(); setTool(tool + d * (e.shiftKey ? 5 : .5)); }
        });
        setTool(tool);
        function doBend() {
          if (busy) return; busy = true; bend.disabled = true; range.disabled = true; el.querySelectorAll('[data-d]').forEach(b => { b.disabled = true; });
          api.sfx('whoosh');
          const part = springAfter(tool, r.s);
          // the punch comes down onto the flat sheet, bends it into the die, waits, lifts; then the part springs open
          const steps = [[300, k => paint(180, k)], [560, k => paint(180 - (180 - tool) * k, 1)], [220, () => paint(tool, 1)], [420, k => paint(tool, 1 - k)], [560, k => paint(tool + (part - tool) * k, 0)]];
          let n = 0;
          const run = () => {
            if (n >= steps.length) return land(part);
            const [ms, fn] = steps[n++];
            if (reduced()) { fn(1); return run(); }
            const t0 = performance.now();
            const tick = now => { const k = Math.min(1, (now - t0) / ms); fn(k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2); if (k < 1) T.raf(tick); else run(); };
            T.raf(tick);
          };
          run();
        }
        function land(part) {
          paint(part, 0, true);
          const err = Math.abs(part - r.target);
          if (!r.test && shot === 0) {
            shot = 1; busy = false; api.sfx('pop');
            fb.innerHTML = W.shot1(one(part), one(part - tool));
            bend.disabled = false; range.disabled = false; el.querySelectorAll('[data-d]').forEach(b => { b.disabled = false; });
            bend.textContent = W.bendAgain; bend.focus({ preventScroll: true });
            return;
          }
          const p = springPts(err); score += p;
          el.querySelector('.bnd-sb__s').textContent = score;
          api.sfx(p >= 2 ? 'good' : p ? 'pop' : 'bad'); if (p === 3) api.burst(fig, '#46E3A0', 12); if (!p) api.shake(fig);
          fb.innerHTML = `${W.scored(one(part), one(err), p)} ${W.best(one(bestTool(r.target, r.s)))}`;
          next.hidden = false; next.focus({ preventScroll: true });
        }
      }
      function advance() { i++; if (i < SPRING_ROUNDS.length) round(); else { stopAll(); endCard(el, api, ctx, { id: 'bend-springback', score, max: SPRING_ROUNDS.length * 3, W }); } }
      api.scene('springback'); // the stage shows the same press while you play
      intro(el, W, () => { api.sfx('pop'); round(); }, setKeys);
      return stopAll;
    }
  };
}

/* =====================================================================================================
   2 · Flat length: read the drawing, pick the formula, do the sum
   ===================================================================================================== */
// two versions of each round; one is picked at random every play. ba = A and B stop where the bend starts,
// bd = A and B run to the outside corner. Numbers are chosen here (the slides give the formulas only).
export const FLAT_SETS = [
  [{ k: 'lt', fig: 'ba', A: 40, B: 30, v: 6 }, { k: 'lt', fig: 'ba', A: 35, B: 50, v: 5 }],
  [{ k: 'lt', fig: 'bd', A: 45, B: 35, v: 4 }, { k: 'lt', fig: 'bd', A: 60, B: 25, v: 3 }],
  [{ k: 'K', t: .8, T: 2 }, { k: 'K', t: .6, T: 1.5 }],
  [{ k: 'lt', fig: 'ba', A: 25, B: 50, v: 4.5 }, { k: 'lt', fig: 'ba', A: 72, B: 18, v: 3.5 }],
  [{ k: 'lt', fig: 'bd', A: 60, B: 40, v: 3.5 }, { k: 'lt', fig: 'bd', A: 38, B: 52, v: 4.5 }],
  [{ k: 't', K: .45, T: 2 }, { k: 't', K: .4, T: 3 }],
  [{ k: 'inv', fig: 'ba', A: 60, B: 55, Lt: 120 }, { k: 'inv', fig: 'ba', A: 42, B: 30, Lt: 78 }],
  [{ k: 'inv', fig: 'bd', A: 50, B: 50, Lt: 96 }, { k: 'inv', fig: 'bd', A: 65, B: 40, Lt: 101 }]
];
/** answer, distractors (the usual slips) and the worked line for one round */
export function flatMath(q) {
  const mm = v => fmt(v) + '\u00a0mm'; // number and unit stay on one line
  if (q.k === 'K') { const a = q.t / q.T; return { ans: fmt(a), opts: [a, q.T / q.t, q.T - q.t, q.t + q.T].map(fmt), work: `K = t / T = ${fmt(q.t)} / ${fmt(q.T)} = ${fmt(a)}` }; }
  if (q.k === 't') { const a = q.K * q.T; return { ans: mm(a), opts: [a, q.T / q.K, q.K / q.T, q.T - a].map(v => mm(+v.toFixed(3))), work: `t = K × T = ${fmt(q.K)} × ${fmt(q.T)} = ${mm(a)}` }; }
  const ba = q.fig === 'ba', s = ba ? '+' : '−', V = ba ? 'BA' : 'BD';
  if (q.k === 'lt') { const a = ba ? q.A + q.B + q.v : q.A + q.B - q.v; return { ans: mm(a), opts: [a, ba ? q.A + q.B - q.v : q.A + q.B + q.v, q.A + q.B, ba ? q.A + q.B + 2 * q.v : q.A + q.B - 2 * q.v].map(mm), work: `Lt = A + B ${s} ${V} = ${fmt(q.A)} + ${fmt(q.B)} ${s} ${fmt(q.v)} = ${mm(a)}` }; }
  const a = ba ? q.Lt - q.A - q.B : q.A + q.B - q.Lt; // inv: find BA or BD
  return { ans: mm(a), opts: [a, q.A + q.B, q.Lt - q.A, ba ? q.Lt - q.B : q.Lt + q.A + q.B].map(mm), work: ba ? `BA = Lt − A − B = ${fmt(q.Lt)} − ${fmt(q.A)} − ${fmt(q.B)} = ${mm(a)}` : `BD = A + B − Lt = ${fmt(q.A)} + ${fmt(q.B)} − ${fmt(q.Lt)} = ${mm(a)}` };
}
/** a dimensioned bracket: A and B to the bend start (ba) or to the outside corner (bd) */
function bracket(fig, A, B) {
  const cx = 118, cy = 150, ri = 18, T = 10, ro = ri + T, xe = 290, yt = 22;
  const body = `M${cx - ro} ${yt}V${cy}${arcD(cx, cy, ro, 180, 90, '')}H${xe}V${cy + ri}H${cx}${arcD(cx, cy, ri, 90, 180, '')}V${yt}Z`;
  let s = `<path d="${body}" fill="${C.steel}" fill-opacity=".3" stroke="${C.ink}" stroke-width="1.6"/>`;
  const e = d => `<path d="${d}" stroke="${C.ink3}" stroke-width=".9"/>`;
  if (fig === 'ba') {
    s += `<path d="M${cx - ro} ${cy}${arcD(cx, cy, ro, 180, 90, '')}V${cy + ri}${arcD(cx, cy, ri, 90, 180, '')}Z" fill="${C.zc}" fill-opacity=".5"/>
      ${e(`M${cx - ro - 3} ${yt}H${cx - ro - 40}M${cx - ro - 3} ${cy}H${cx - ro - 40}`)}${dim(cx - ro - 32, yt, cx - ro - 32, cy)}${tx(cx - ro - 38, (yt + cy) / 2 + 5, `A = ${fmt(A)}`, { c: C.ink, z: 15, w: 700, a: 'end' })}
      ${e(`M${cx} ${cy + ro + 3}V${cy + 58}M${xe} ${cy + ri + 3}V${cy + 58}`)}${dim(cx, cy + 50, xe, cy + 50)}${tx((cx + xe) / 2, cy + 70, `B = ${fmt(B)}`, { c: C.ink, z: 15, w: 700 })}
      ${tx(cx + 24, cy - 10, 'bend', { c: C.zt, z: 13, w: 600, a: 'start' })}`;
  } else {
    const vx = cx - ro, vy = cy + ro;
    s += `<path d="M${vx} ${cy}V${vy}H${cx}" stroke="${C.zt}" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${vx}" cy="${vy}" r="3.4" fill="${C.zt}"/>
      ${e(`M${vx - 3} ${yt}H${vx - 40}M${vx - 3} ${vy}H${vx - 40}`)}${dim(vx - 32, yt, vx - 32, vy)}${tx(vx - 38, (yt + vy) / 2 + 5, `A = ${fmt(A)}`, { c: C.ink, z: 15, w: 700, a: 'end' })}
      ${e(`M${vx} ${vy + 3}V${cy + 58}M${xe} ${cy + ri + 3}V${cy + 58}`)}${dim(vx, cy + 50, xe, cy + 50)}${tx((vx + xe) / 2, cy + 70, `B = ${fmt(B)}`, { c: C.ink, z: 15, w: 700 })}
      ${tx(cx + 24, cy - 10, 'outside corner', { c: C.zt, z: 13, w: 600, a: 'start' })}<path d="M${cx + 22} ${cy - 14}L${vx + 6} ${vy - 6}" stroke="${C.ink3}"/>`;
  }
  return svg('0 0 300 232', s, 'A bracket with its dimensions A and B');
}

export function flatTrial(W) {
  return {
    id: 'bend-flat', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      const setKeys = keyHub(), T = clock();
      const deck = FLAT_SETS.map(v => v[Math.floor(Math.random() * v.length)]);
      const MAX = deck.reduce((a, q) => a + (q.k === 'lt' || q.k === 'inv' ? 2 : 1), 0);
      let i = 0, score = 0;
      const stopAll = () => { T.stop(); setKeys(null); };
      function round() {
        const q = deck[i], m = flatMath(q), twoStep = q.k === 'lt' || q.k === 'inv';
        api.scene(twoStep ? 'flatLength' : 'kFactor');
        const given = q.k === 'K' ? `t = ${fmt(q.t)} mm · T = ${fmt(q.T)} mm` : q.k === 't' ? `K = ${fmt(q.K)} · T = ${fmt(q.T)} mm` : q.k === 'inv' ? `Lt = ${fmt(q.Lt)} mm` : '';
        el.innerHTML = `<div class="g-card bnd-fl">
          <div class="g-hud"><span class="chip">${W.round} <span class="hud-num" dir="ltr">${i + 1}/${deck.length}</span></span><span class="chip chip--zone">${W.score} <span class="hud-num bnd-fl__s">${score}</span></span></div>
          <div class="bnd-fl__fig">${q.k === 'K' || q.k === 't' ? ART['bd-kf']() : bracket(q.fig, q.A, q.B)}</div>
          <p class="bnd-fl__given" dir="ltr">${given}</p>
          <p class="g-prompt bnd-fl__q"></p>
          <div class="g-choices bnd-fl__ch"></div>
          <p class="bnd-fb" aria-live="polite"></p>
          <div class="g-acts"><button type="button" class="btn btn--zone" data-a="next" hidden>${i + 1 < deck.length ? W.next : W.finish}</button></div>
        </div>`;
        if (i === 0) el.querySelector('.bnd-fl')?.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
        const qEl = el.querySelector('.bnd-fl__q'), ch = el.querySelector('.bnd-fl__ch'), fb = el.querySelector('.bnd-fb'), next = el.querySelector('[data-a="next"]'), giv = el.querySelector('.bnd-fl__given');
        next.addEventListener('click', advance);
        const ask = (prompt, opts, correct, onDone) => {
          qEl.innerHTML = prompt;
          ch.innerHTML = opts.map((o, k) => `<button type="button" class="g-choice" data-k="${k}"><span class="bnd-key" aria-hidden="true">${k + 1}</span><span dir="ltr">${o}</span></button>`).join('');
          const btns = [...ch.querySelectorAll('.g-choice')]; let locked = false;
          const pick = k => {
            if (locked) return; locked = true;
            const ok = opts[k] === correct;
            btns.forEach((b, j) => { b.disabled = true; if (opts[j] === correct) b.classList.add('is-right'); else if (j === k) b.classList.add('is-wrong'); });
            if (ok) { score++; el.querySelector('.bnd-fl__s').textContent = score; api.sfx('good'); api.burst(btns[k], '#46E3A0', 10); } else { api.sfx('bad'); api.shake(btns[k]); }
            onDone(ok);
          };
          btns.forEach((b, k) => b.addEventListener('click', () => pick(k)));
          setKeys(e => { const k = '1234'.indexOf(e.key); if (k >= 0 && k < btns.length && !locked) { e.preventDefault(); pick(k); } else if (e.key === 'Enter' && !next.hidden) { e.preventDefault(); advance(); } });
        };
        const valueStep = () => {
          const opts = shuffle(m.opts.filter((v, k, a) => a.indexOf(v) === k));
          const label = q.k === 'K' ? W.askK : q.k === 't' ? W.askT : q.k === 'inv' ? (q.fig === 'ba' ? W.askBA : W.askBD) : W.askLt;
          ask(label, opts, m.ans, ok => { fb.innerHTML = `<b class="${ok ? 'bnd-ok' : 'bnd-no'}">${ok ? W.right : W.wrong}</b> <bdi dir="ltr">${m.work}</bdi>`; next.hidden = false; next.focus({ preventScroll: true }); });
        };
        if (twoStep) {
          const fA = 'Lt = A + B + BA', fD = 'Lt = A + B − BD', good = q.fig === 'ba' ? fA : fD;
          ask(W.pickFormula, [fA, fD], good, ok => {
            fb.innerHTML = `<b class="${ok ? 'bnd-ok' : 'bnd-no'}">${ok ? W.right : W.wrong}</b> ${W.why[q.fig]}`;
            T.later(() => {
              if (q.k === 'lt') giv.textContent = `${q.fig === 'ba' ? 'BA' : 'BD'} = ${fmt(q.v)} mm`;
              fb.innerHTML = ''; valueStep();
            }, ok ? (reduced() ? 900 : 1300) : 2600);
          });
        } else valueStep();
      }
      function advance() { i++; if (i < deck.length) round(); else { stopAll(); endCard(el, api, ctx, { id: 'bend-flat', score, max: MAX, W }); } }
      intro(el, W, () => { api.sfx('pop'); round(); }, setKeys);
      return stopAll;
    }
  };
}

/* =====================================================================================================
   3 · Quick-fire: the right word for the job (rounds come from the edition)
   ===================================================================================================== */
export function spotTrial(W) {
  return {
    id: 'bend-spot', title: W.title, en: W.en, how: W.how,
    mount(el, api, ctx) {
      el.classList.add('bnd-qf');
      const rounds = shuffle(W.rounds).slice(0, 12).map(r => ({ ...r, art: r.art ? r.art() : '', choices: r.fix ? r.choices : shuffle(r.choices) }));
      return quickfire(el, api, ctx, { id: 'bend-spot', intro: W.intro, rounds, time: 10, layout: 'grid', wins: W.wins });
    }
  };
}
export { ART };
