// Metal cutting — the three lesson demos, shared by both editions. Each language file passes its own words (W).
//   mountGap   · ct-clearance: set the gap c and watch the break lines pass, meet, or miss (L5 · S5)
//   mountKeep  · ct-punchblank: punch a shape, then choose which piece goes to the customer (L5 · S13)
//   mountStrip · ct-cutoff: the same strip, cut off on one path or parted on two (L5 · S18)
// Each returns a cleanup function. No text in here: every word comes from W.
import { svg, clrInner, plate, rect, circ, rrect, P, stripPieces, pieceSVG, tx, V } from './_cut-art.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };

/* ---------- 1 · the clearance gap ---------- */
export function mountGap(el, api, W) {
  const T = 56, A = 22; let g = 8; const seen = new Set();
  el.innerHTML = `<div class="cut-gap">
    <div class="cut-gap__fig"></div>
    <div class="cut-gap__side">
      <label class="cut-range"><span class="label">${W.label}</span><input type="range" min="2" max="50" step="0.5" value="${g}" aria-label="${W.label}"></label>
      <div class="cut-gap__scale" aria-hidden="true"><span>${W.tight}</span><span>${W.loose}</span></div>
      <div class="cut-read" aria-live="polite"><b></b><span class="cut-read__line"></span><small dir="ltr"></small></div>
      <div class="cut-seen" aria-hidden="true">${['small', 'ok', 'large'].map(k => `<i data-k="${k}" title="${W[k][0]}"></i>`).join('')}</div>
    </div>
  </div>`;
  const fig = el.querySelector('.cut-gap__fig'), range = el.querySelector('input'), read = el.querySelector('.cut-read');
  let last = '';
  const paint = () => {
    const r = clrInner({ g, t: T, a: A });
    fig.innerHTML = svg(r.vb, r.inner, W[r.st][0]);
    fig.dataset.st = r.st;
    if (r.st !== last) {
      last = r.st; seen.add(r.st);
      const [title, line, quote] = W[r.st];
      read.dataset.st = r.st; read.querySelector('b').textContent = title; read.querySelector('.cut-read__line').innerHTML = api.rich(line); read.querySelector('small').textContent = quote;
      el.querySelectorAll('.cut-seen i').forEach(i => i.classList.toggle('on', seen.has(i.dataset.k)));
    }
    if (seen.size === 3 && r.st === 'ok') api.award(5, { from: range, key: 'demo:ct-gap' });
  };
  range.addEventListener('input', () => { g = +range.value; paint(); });
  range.addEventListener('change', () => api.sfx(last === 'ok' ? 'good' : 'click'));
  paint();
  return () => { };
}

/* ---------- 2 · keep or scrap: punching vs blanking ---------- */
const FIN = (cx, cy) => { // the slide's curved shape, centred on (cx, cy)
  const pts = []; const c = (p0, p1, p2, p3) => { for (let i = 0; i < 14; i++) { const t = i / 14, u = 1 - t; pts.push([0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); } };
  c([14, 22], [34, 8], [72, 14], [100, 44]); c([100, 44], [112, 56], [118, 72], [102, 74]); c([102, 74], [74, 72], [40, 58], [20, 42]); c([20, 42], [10, 34], [8, 26], [14, 22]);
  return pts.map(([x, y]) => [cx - 62 + x * 1.1, cy - 48 + y * 1.1]);
};
const SHAPES = [cx => circ(cx, 100, 40, 48), cx => rrect(cx - 44, 64, 88, 72, 12, 5), cx => FIN(cx, 100)];
export function mountKeep(el, api, W) {
  let shape = 0, phase = 'whole', kept = '', timer = 0; const seen = new Set();
  el.innerHTML = `<div class="cut-keep">
    <div class="cut-keep__fig"></div>
    <div class="cut-keep__side">
      <div class="cut-keep__acts"></div>
      <div class="cut-read" aria-live="polite"><b></b><span class="cut-read__line"></span><small dir="ltr"></small></div>
    </div>
  </div>`;
  const fig = el.querySelector('.cut-keep__fig'), acts = el.querySelector('.cut-keep__acts'), read = el.querySelector('.cut-read');
  const draw = () => {
    const sh = SHAPES[shape](110), sheet = rect(20, 20, 180, 160);
    const outX = phase === 'whole' ? 0 : 158;
    const sheetSt = kept === 'sheet' ? { tint: V.zc, op: .34 } : kept === 'blank' ? { op: .1, hat: true, c: V.ink2, sw: 1.3 } : {};
    const slugSt = kept === 'blank' ? { tint: V.zc, op: .5 } : kept === 'sheet' ? { op: .1, hat: true, c: V.ink2, sw: 1.3 } : {};
    let s = plate([sheet, sh], { ...sheetSt, cls: 'cut-keep__sheet' + (phase === 'whole' ? '' : ' is-pick') });
    s += `<g class="cut-keep__slug${phase === 'whole' ? '' : ' is-pick'}" style="transform:translate(${outX}px,${phase === 'whole' ? 0 : 4}px)">${plate([sh], { sh: phase === 'whole' ? 0 : 3, ...slugSt })}</g>`;
    if (phase === 'whole') s += `<path d="${P(sh)}" stroke="${V.zt}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if (kept) s += tx(kept === 'sheet' ? 110 : 268, 196, 'PRODUCT', { size: 13, fill: V.zt, weight: 700 }) + tx(kept === 'sheet' ? 268 : 110, 196, 'SCRAP', { size: 13, fill: V.bad, weight: 700 });
    fig.innerHTML = svg('0 0 360 204', s, W.figLabel);
    fig.querySelectorAll('.is-pick').forEach(g => g.addEventListener('click', () => { if (phase === 'cut') choose(g.classList.contains('cut-keep__sheet') ? 'sheet' : 'blank'); }));
  };
  const btn = (k, label, cls = '') => `<button type="button" class="btn btn--sm ${cls}" data-a="${k}">${label}</button>`;
  const setActs = () => {
    acts.innerHTML = phase === 'whole' ? btn('punch', W.punch, 'btn--zone')
      : phase === 'cut' ? btn('sheet', W.keepSheet) + btn('blank', W.keepBlank)
        : btn('next', W.next, 'btn--zone');
    acts.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const a = b.dataset.a;
      if (a === 'punch') punch(); else if (a === 'next') { shape = (shape + 1) % SHAPES.length; phase = 'whole'; kept = ''; draw(); setActs(); say(W.start); }
      else choose(a);
    }));
  };
  const say = ([title, line, quote]) => { read.querySelector('b').textContent = title; read.querySelector('.cut-read__line').innerHTML = api.rich(line); read.querySelector('small').textContent = quote || ''; read.dataset.st = kept || ''; };
  function punch() {
    api.sfx('whoosh'); phase = 'cut';
    // the slug drops out and slides aside: draw it in place first, then let the transition carry it
    draw(); const g = fig.querySelector('.cut-keep__slug'); g.style.transform = 'translate(0px,0px)'; void g.getBoundingClientRect();
    clearTimeout(timer); timer = setTimeout(() => { g.style.transform = 'translate(158px,4px)'; }, reduced() ? 0 : 30);
    setActs(); say(W.which); acts.querySelector('button')?.focus({ preventScroll: true });
  }
  function choose(k) {
    kept = k; phase = 'done'; seen.add(k); draw(); setActs(); say(k === 'sheet' ? W.sheet : W.blank);
    api.sfx('good'); if (seen.size === 2) api.award(5, { from: fig, key: 'demo:ct-keep' });
    acts.querySelector('button')?.focus({ preventScroll: true });
  }
  draw(); setActs(); say(W.start);
  return () => clearTimeout(timer);
}

/* ---------- 3 · one strip, two ways: cutoff vs parting ---------- */
export function mountStrip(el, api, W) {
  let mode = 'cutoff', done = 0, timers = []; const finished = new Set();
  el.innerHTML = `<div class="cut-strip">
    <div class="cut-strip__top"><div class="cut-seg" role="radiogroup" aria-label="${W.modeLabel}">${['cutoff', 'parting'].map(m => `<button type="button" role="radio" data-m="${m}" aria-checked="${m === mode}">${W[m][0]}</button>`).join('')}</div>
      <button type="button" class="btn btn--zone btn--sm cut-strip__go">${W.stroke}</button></div>
    <div class="cut-strip__fig"></div>
    <p class="cut-strip__count" aria-live="polite"></p>
  </div>`;
  const fig = el.querySelector('.cut-strip__fig'), go = el.querySelector('.cut-strip__go'), count = el.querySelector('.cut-strip__count');
  const strokesOf = m => m === 'cutoff' ? 4 : 3;
  const draw = () => {
    const pcs = stripPieces(mode, 20, 22, 42);
    let s = tx(20, 14, W.strip, { anchor: 'start', size: 12 }) + tx(20, 96, W.parts, { anchor: 'start', size: 12, fill: V.zt }) + tx(20, 166, W.scrap, { anchor: 'start', size: 12, fill: V.bad });
    s += `<path d="M14 82H346M14 152H346M14 224H346" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="2 4"/>`;
    s += pcs.map((p, i) => `<g class="cut-strip__pc" data-i="${i}" data-kind="${p.kind}">${pieceSVG(p)}</g>`).join('');
    fig.innerHTML = svg('0 0 360 230', s, W[mode][1]);
  };
  const tally = () => {
    const pcs = [...fig.querySelectorAll('.cut-strip__pc.is-out')];
    const parts = pcs.filter(g => g.dataset.kind === 'part').length, scrap = pcs.filter(g => g.dataset.kind === 'scrap').length;
    count.innerHTML = `${W.partsN} <b class="hud-num">${parts}</b> · ${W.scrapN} <b class="hud-num">${scrap}</b>${done >= strokesOf(mode) ? ` — ${api.rich(W[mode][2])}` : ''}`;
  };
  function stroke() {
    if (done >= strokesOf(mode)) return;
    const per = mode === 'cutoff' ? 1 : 2, gs = [...fig.querySelectorAll('.cut-strip__pc')].slice(done * per, done * per + per);
    gs.forEach(g => { g.classList.add('is-out'); g.style.transform = `translateY(${g.dataset.kind === 'part' ? 82 : 152}px)`; });
    done++; api.sfx(mode === 'cutoff' ? 'click' : 'pop'); tally();
    if (done >= strokesOf(mode)) { go.disabled = true; finished.add(mode); api.sfx('good'); if (finished.size === 2) api.award(5, { from: go, key: 'demo:ct-strip' }); }
  }
  const setMode = m => { mode = m; done = 0; go.disabled = false; el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.m === m))); draw(); tally(); };
  el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { api.sfx('click'); setMode(b.dataset.m); }));
  go.addEventListener('click', stroke);
  draw(); tally();
  return () => timers.forEach(clearTimeout);
}
