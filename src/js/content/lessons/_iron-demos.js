// Iron zone — the lesson's demos. Each factory takes the page's words (W) and returns mount(el, api) → cleanup.
// iron.js passes Arabic words, iron.en.js English ones; the code is shared.
import { potArt, MICRO } from './_iron-art.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };

/* ---------- 1 · the melt check: is this a cast-iron recipe? (L2 · S16) ---------- */
export function recipeDemo(W) {
  return function mount(el, api) {
    let c = 1.2, si = 0.5, moves = 0;
    const slider = (k, v, name) => `<label class="irn-range"><span class="irn-range__top"><span class="label">${name}</span><b class="hud-num" data-v="${k}"></b></span><input type="range" dir="ltr" min="0" max="5" step="0.1" value="${v}" data-k="${k}" aria-label="${name}"></label>`;
    el.innerHTML = `<div class="irn-melt">
      <div class="irn-melt__pot"></div>
      <div class="irn-melt__side">${slider('c', c, W.carbon)}${slider('si', si, W.silicon)}
        <p class="irn-read" aria-live="polite"><b></b><small dir="ltr">C ≥ 2% · Si 1–3%</small></p></div></div>`;
    const pot = el.querySelector('.irn-melt__pot'), read = el.querySelector('.irn-read');
    const paint = () => {
      pot.innerHTML = potArt(c, si, W.pot);
      el.querySelector('[data-v="c"]').textContent = c.toFixed(1) + '%';
      el.querySelector('[data-v="si"]').textContent = si.toFixed(1) + '%';
      const ok = c >= 2 && si >= 1 && si <= 3;
      read.querySelector('b').textContent = ok ? W.ok : c < 2 ? W.lowC : si < 1 ? W.lowSi : W.highSi;
      read.classList.toggle('is-ok', ok);
      return ok;
    };
    el.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
      const v = Math.round(+inp.value * 10) / 10;
      if (inp.dataset.k === 'c') c = v; else si = v;
      moves++;
      if (paint() && moves > 2) api.award(5, { from: inp, key: 'demo:irn-recipe' });
    }));
    paint();
  };
}

/* ---------- 2 · strike the base: gray iron damps the vibration, ductile rings longer (S16–S17) ---------- */
export function dampDemo(W) {
  return function mount(el, api) {
    let raf = 0;
    const rows = [['gray', W.gray, W.grayLine, 6.5], ['ductile', W.ductile, W.ductileLine, 1.4]];
    el.innerHTML = `<div class="irn-damp">${rows.map(([k, n, line]) => `<div class="irn-damp__row" data-k="${k}">
        <div class="irn-damp__name"><b>${n}</b><small>${line}</small></div>
        <svg class="irn-damp__w" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40H300" stroke="var(--line-2)" stroke-width="1" vector-effect="non-scaling-stroke"/><path class="irn-damp__p" d="M0 40" stroke="var(--zc)" stroke-width="2.2" fill="none" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
      </div>`).join('')}
      <div class="irn-damp__acts"><button type="button" class="btn btn--zone btn--sm irn-damp__hit">${W.hit}</button><p class="irn-read" aria-live="polite"></p></div></div>`;
    const paths = [...el.querySelectorAll('.irn-damp__p')], btn = el.querySelector('.irn-damp__hit'), read = el.querySelector('.irn-read');
    const wave = (k, q) => {
      let d = 'M0 40'; const n = Math.max(1, Math.round(150 * q));
      for (let i = 1; i <= n; i++) { const x = i * 2, t = x / 300; d += `L${x} ${(40 - 34 * Math.exp(-k * t) * Math.sin(2 * Math.PI * 9 * t)).toFixed(1)}`; }
      return d;
    };
    const draw = q => paths.forEach((p, i) => p.setAttribute('d', wave(rows[i][3], q)));
    const done = () => { read.innerHTML = W.after; btn.textContent = W.again; api.award(5, { from: btn, key: 'demo:irn-damp' }); };
    btn.addEventListener('click', () => {
      api.sfx('pop'); cancelAnimationFrame(raf); read.textContent = '';
      el.querySelectorAll('.irn-damp__row').forEach(r => { r.classList.remove('is-hit'); void r.offsetWidth; r.classList.add('is-hit'); });
      if (reduced()) { draw(1); done(); return; }
      const t0 = performance.now();
      const step = now => { const q = Math.min(1, (now - t0) / 1700); draw(q); if (q < 1) raf = requestAnimationFrame(step); else done(); };
      raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  };
}

/* ---------- 3 · who gets this job? every application on S16–S21 → the iron(s) the slides give it ---------- */
export const APPS = [
  ['engine', ['gray', 'cgi']], ['gears', ['gray']], ['hdgears', ['ductile']], ['flywheel', ['gray']], ['disc', ['gray']], ['drum', ['gray', 'cgi']],
  ['bases', ['gray']], ['crank', ['ductile']], ['crusher', ['white']], ['shoes', ['white']], ['rolls', ['white']], ['manifold', ['cgi']], ['pump', ['cgi']],
  ['bearing', ['malleable']], ['farm', ['malleable']], ['oxid', ['alloy']], ['nonmag', ['alloy']]
];
export const IRONS = ['gray', 'ductile', 'white', 'cgi', 'malleable', 'alloy'];
export function finderDemo(W) {
  return function mount(el, api) {
    const seen = new Set();
    el.innerHTML = `<div class="irn-find">
      <div class="irn-find__chips" role="group" aria-label="${W.pick}">${APPS.map(([k]) => `<button type="button" class="irn-chip" data-k="${k}" aria-pressed="false">${W.apps[k][0]}</button>`).join('')}</div>
      <div class="irn-find__irons">${IRONS.map(k => `<div class="irn-tile" data-k="${k}"><span class="irn-tile__g">${MICRO[k]}</span><b>${W.irons[k][0]}</b>${W.irons[k][1] ? `<small dir="ltr">${W.irons[k][1]}</small>` : ''}</div>`).join('')}</div>
      <p class="irn-read" aria-live="polite">${W.hint}</p></div>`;
    const tiles = [...el.querySelectorAll('.irn-tile')], read = el.querySelector('.irn-read'), box = el.querySelector('.irn-find');
    el.querySelectorAll('.irn-chip').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, irons = APPS.find(a => a[0] === k)[1];
      el.querySelectorAll('.irn-chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      box.classList.add('is-picking');
      tiles.forEach(t => t.classList.toggle('is-on', irons.includes(t.dataset.k)));
      read.innerHTML = `${irons.length > 1 ? `<b class="irn-two">${W.two}</b> ` : ''}${W.apps[k][1]}`;
      api.sfx(irons.length > 1 ? 'flip' : 'click');
      seen.add(k); if (seen.size >= 6) api.award(5, { from: b, key: 'demo:irn-finder' });
    }));
  };
}
