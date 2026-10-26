// Compound zone — the lesson's demos. Each factory takes the page's words (W) and returns mount(el, api) → cleanup.
// compound.js passes Arabic words, compound.en.js English ones; the code is shared.
import { svg, spinStatic, spinSheet, tubeArt, drawDieArt } from './_compound-art.js';

const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };

/** press-and-hold on a button (mouse, finger, Space/Enter): onHold(true|false) */
export function holdButton(btn, onHold) {
  let on = false;
  const set = v => { if (v === on) return; on = v; btn.classList.toggle('is-held', v); onHold(v); };
  const down = e => { if (btn.disabled) return; e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (err) { /* a pointer the browser no longer tracks */ } set(true); };
  const up = () => set(false);
  btn.addEventListener('pointerdown', down);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => btn.addEventListener(t, up));
  btn.addEventListener('contextmenu', e => e.preventDefault());
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); set(true); } });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); set(false); } });
  btn.addEventListener('blur', up);
  return () => set(false);
}

/* ---------- 1 · spin it: hold the roller, the blank lies down on the mandrel and its walls thin (S3–S4) ---------- */
export function spinDemo(W) {
  return function mount(el, api) {
    let p = 0, raf = 0, held = false, last = 0;
    el.innerHTML = `<div class="cmp-spin">
      <div class="cmp-spin__fig">${svg('0 0 360 220', spinStatic('cyl', { spin: true }) + `<g class="cmp-spin__sheet">${spinSheet(0, 'cyl')}</g>`, W.label, 'cmp-art cmp-spinart')}</div>
      <div class="cmp-spin__side">
        <button type="button" class="btn btn--zone btn--block cmp-hold">${W.hold}</button>
        <div class="cmp-meter"><span class="label">${W.formed}</span><b class="hud-num" data-v>0%</b><div class="bar"><i style="--p:0"></i></div></div>
        <div class="cmp-meter"><span class="label">${W.wall}</span><b class="cmp-meter__w" data-w>${W.wallSame}</b><div class="bar bar--wall"><i style="--p:1"></i></div></div>
        <p class="cmp-read" aria-live="polite">${W.start}</p>
        <button type="button" class="btn btn--sm cmp-reset" hidden>${W.reset}</button>
      </div></div>`;
    const box = el.querySelector('.cmp-spin'), sheet = el.querySelector('.cmp-spin__sheet'), hold = el.querySelector('.cmp-hold'), reset = el.querySelector('.cmp-reset'), read = el.querySelector('.cmp-read');
    const paint = () => {
      sheet.innerHTML = spinSheet(p, 'cyl');
      el.querySelector('[data-v]').textContent = Math.round(p * 100) + '%';
      el.querySelector('.cmp-meter .bar i').style.setProperty('--p', p);
      el.querySelector('.bar--wall i').style.setProperty('--p', 1 - .35 * p);
      el.querySelector('[data-w]').textContent = p > .45 ? W.wallThin : W.wallSame;
    };
    const step = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (held && p < 1) { p = Math.min(1, p + dt * .34); paint(); }
      if (p >= 1) { finish(); return; }
      raf = held ? requestAnimationFrame(step) : 0;
    };
    const finish = () => { held = false; box.classList.remove('is-spinning'); hold.disabled = true; read.innerHTML = W.done; reset.hidden = false; api.sfx('good'); api.award(5, { from: hold, key: 'demo:cmp-spin' }); };
    const stopHold = holdButton(hold, v => {
      held = v; box.classList.toggle('is-spinning', v && !reduced());
      if (v) { if (p === 0) read.innerHTML = W.going; api.sfx('swoosh'); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }
      else if (p < 1 && p > 0) read.innerHTML = W.paused;
    });
    reset.addEventListener('click', () => { p = 0; paint(); hold.disabled = false; reset.hidden = true; read.innerHTML = W.start; hold.focus({ preventScroll: true }); });
    return () => { cancelAnimationFrame(raf); stopHold(); };
  };
}

/* ---------- 2 · tube hydroforming, step by step: (a) … (f) (S9) ---------- */
export function tubeDemo(W) {
  return function mount(el, api) {
    let k = 0; const seen = new Set([0]);
    el.innerHTML = `<div class="cmp-tube">
      <div class="cmp-tube__fig"></div>
      <div class="cmp-tube__bar"><button type="button" class="btn btn--sm btn--icon cmp-tube__prev" aria-label="${W.prev}">${W.prevIcon}</button>
        <div class="cmp-steps" role="group" aria-label="${W.steps}">${'abcdef'.split('').map((l, i) => `<button type="button" class="cmp-step" data-k="${i}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
        <button type="button" class="btn btn--sm btn--icon cmp-tube__next" aria-label="${W.next}">${W.nextIcon}</button></div>
      <p class="cmp-read" aria-live="polite"></p></div>`;
    const fig = el.querySelector('.cmp-tube__fig'), read = el.querySelector('.cmp-read');
    const go = n => {
      k = Math.max(0, Math.min(5, n)); seen.add(k);
      fig.innerHTML = tubeArt(k, W.caps[k]);
      el.querySelectorAll('.cmp-step').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.k === k)));
      read.innerHTML = `<b dir="ltr">(${'abcdef'[k]})</b> ${W.caps[k]}`;
      el.querySelector('.cmp-tube__prev').disabled = k === 0; el.querySelector('.cmp-tube__next').disabled = k === 5;
      if (seen.size === 6) api.award(5, { from: fig, key: 'demo:cmp-tube' });
    };
    el.querySelectorAll('.cmp-step').forEach(b => b.addEventListener('click', () => { api.sfx('click'); go(+b.dataset.k); }));
    el.querySelector('.cmp-tube__prev').addEventListener('click', () => { api.sfx('click'); go(k - 1); });
    el.querySelector('.cmp-tube__next').addEventListener('click', () => { api.sfx('click'); go(k + 1); });
    go(0);
  };
}

/* ---------- 3 · deep drawing: drag the stroke, the punch pushes the blank into the die (S14–S16) ---------- */
export function drawDemo(W) {
  return function mount(el, api) {
    el.innerHTML = `<div class="cmp-draw">
      <div class="cmp-draw__fig"></div>
      <label class="cmp-range"><span class="cmp-range__top"><span class="label">${W.stroke}</span><b class="hud-num" data-v>0%</b></span><input type="range" dir="ltr" min="0" max="100" value="0" aria-label="${W.stroke}"></label>
      <p class="cmp-read" aria-live="polite"></p></div>`;
    const fig = el.querySelector('.cmp-draw__fig'), inp = el.querySelector('input'), read = el.querySelector('.cmp-read');
    const paint = () => {
      const s = +inp.value / 100;
      fig.innerHTML = drawDieArt(s, 'names', W.label);
      el.querySelector('[data-v]').textContent = inp.value + '%';
      read.innerHTML = s < .04 ? W.r0 : s < .97 ? W.r1 : W.r2;
      if (s >= .97) api.award(5, { from: inp, key: 'demo:cmp-draw' });
    };
    inp.addEventListener('input', paint);
    inp.addEventListener('change', () => { if (+inp.value >= 97) api.sfx('good'); });
    paint();
  };
}
