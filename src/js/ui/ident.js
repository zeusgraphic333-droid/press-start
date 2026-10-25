// The Erebus Studios ident — the loading page, in English, on every visit.
// Erebus is the primordial darkness, so the mark is an eclipse: a black sun whose corona is the loading bar.
// The corona draws itself as the site loads; when it closes, the "diamond ring" flares, then the darkness swallows
// the screen and the site opens out of it.
import gsap from 'gsap';

const NAME = 'Khalid Mohamed Khalid';
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mountIdent({ minMs = 3400, quick = false } = {}) {
  const el = document.createElement('div');
  el.className = 'ident';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Erebus Studios — ${NAME}`);
  el.dir = 'ltr'; el.lang = 'en';
  el.innerHTML = `
    <div class="ident__stage">
      <div class="ident__rays" aria-hidden="true"></div>
      <svg class="ident__ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id="ident-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFF4DA"/><stop offset=".45" stop-color="#E8C77F"/><stop offset="1" stop-color="#9E7337"/>
          </linearGradient>
        </defs>
        <circle class="ident__track" cx="100" cy="100" r="96"/>
        <circle class="ident__halo" cx="100" cy="100" r="96" pathLength="1" transform="rotate(-90 100 100)"/>
        <circle class="ident__arc" cx="100" cy="100" r="96" pathLength="1" transform="rotate(-90 100 100)"/>
      </svg>
      <div class="ident__disc" aria-hidden="true"></div>
      <div class="ident__orbit" aria-hidden="true"><i class="ident__bead"></i></div>
      <div class="ident__word">
        <p class="ident__erebus">EREBUS</p>
        <p class="ident__studios">Studios</p>
      </div>
    </div>
    <div class="ident__credit"><i class="ident__rule"></i><p class="ident__name">${NAME.split('').map(c => c === ' ' ? '<span class="sp"> </span>' : `<span>${c}</span>`).join('')}</p></div>
    <div class="ident__meta"><span>Press Start</span><span class="ident__pct">000</span></div>
    <div class="ident__flare" aria-hidden="true"></div>
    <div class="ident__grain" aria-hidden="true"></div>`;
  document.body.appendChild(el);
  const $ = s => el.querySelector(s), $$ = s => el.querySelectorAll(s);

  const state = { shown: 0, target: 0, t0: performance.now(), done: false, skip: false };
  const arc = $('.ident__arc'), halo = $('.ident__halo'), orbit = $('.ident__orbit'), pct = $('.ident__pct');
  const paint = () => {
    const p = state.shown;
    arc.style.strokeDasharray = `${p} 1`; halo.style.strokeDasharray = `${p} 1`;
    orbit.style.transform = `rotate(${p * 360}deg)`;
    el.style.setProperty('--p', p.toFixed(3));
    pct.textContent = String(Math.round(p * 100)).padStart(3, '0');
  };
  // the corona never runs ahead of the clock (so the motion always plays) nor ahead of real loading
  let last = performance.now();
  const ticker = () => {
    if (state.done) return;
    const now = performance.now(), dt = Math.min(.25, (now - last) / 1000); last = now;
    const clock = Math.min(1, (now - state.t0) / (quick ? 1200 : minMs - 600));
    const goal = Math.min(state.target, state.skip ? 1 : clock);
    state.shown += (goal - state.shown) * (reduced() ? 1 : 1 - Math.exp(-dt / .16));
    if (Math.abs(goal - state.shown) < .0008) state.shown = goal;
    paint();
  };
  gsap.ticker.add(ticker);

  // entrance
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const fsE = parseFloat(getComputedStyle($('.ident__erebus')).fontSize) || 120;
  if (reduced()) {
    tl.from([$('.ident__stage'), $('.ident__credit'), $('.ident__meta')], { opacity: 0, duration: .6, stagger: .1 });
  } else {
    tl.from($('.ident__bead'), { scale: 0, opacity: 0, duration: .9 }, .1)
      .from($('.ident__track'), { opacity: 0, duration: 1.6, ease: 'power2.out' }, .2)
      // the word opens from its centre line outward, out of focus, then settles (one element: background-clip:text needs it)
      .fromTo($('.ident__erebus'), { clipPath: 'inset(-20% 50% -20% 50%)', filter: 'blur(16px)', opacity: 0 }, { clipPath: 'inset(-20% 0% -20% 0%)', filter: 'blur(0px)', opacity: 1, duration: 2.1, ease: 'expo.out' }, .35)
      // the letters track in to their set (px, measured here: GSAP's em conversion on clipped text is unreliable)
      .fromTo($('.ident__erebus'), { letterSpacing: fsE * .14 + 'px' }, { letterSpacing: fsE * .01 + 'px', duration: 2.6, ease: 'expo.out' }, .35)
      .fromTo($('.ident__erebus'), { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', duration: 2.8, ease: 'power2.inOut' }, .6)
      .from($('.ident__studios'), { opacity: 0, letterSpacing: '1.6em', duration: 1.8 }, 1.05)
      .from($('.ident__rule'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, 1.35)
      .from($$('.ident__name span'), { opacity: 0, y: 8, duration: .9, stagger: .022 }, 1.5)
      .from($('.ident__meta'), { opacity: 0, duration: 1 }, 1.7);
  }
  const skip = () => { if (performance.now() - state.t0 > 900) state.skip = true; };
  el.addEventListener('pointerdown', skip);
  const onKey = e => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') skip(); };
  addEventListener('keydown', onKey);

  return {
    el,
    /** 0–100: how much of the site is ready */
    progress(p) { state.target = Math.max(state.target, Math.min(1, p / 100)); },
    /** resolves when the corona has closed and the darkness has covered the screen */
    async finish() {
      state.target = 1;
      await new Promise(res => { const chk = () => (state.shown >= .999 ? res() : setTimeout(chk, 40)); chk(); });
      state.done = true; gsap.ticker.remove(ticker); state.shown = 1; paint();
      removeEventListener('keydown', onKey);
      tl.progress(1);
      if (reduced()) { await gsap.to(el, { opacity: 0, duration: .5 }); el.remove(); return; }
      const D = $('.ident__disc').getBoundingClientRect().width || 300;
      const cover = Math.hypot(innerWidth, innerHeight) / D * 1.15;
      const out = gsap.timeline({ defaults: { ease: 'expo.out' } });
      // the diamond ring: one bead of light flares where the corona closes
      out.to({}, { duration: .3 }) // hold the closed corona for a beat
        .to($('.ident__bead'), { scale: 3.2, duration: .5, ease: 'power3.out' })
        .fromTo($('.ident__flare'), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .55, ease: 'power3.out' }, '<')
        .to(el, { '--glow': 1, duration: .5 }, '<')
        .to($('.ident__flare'), { opacity: 0, duration: .9, ease: 'power2.in' }, '+=.15')
        .to($('.ident__bead'), { scale: 0, opacity: 0, duration: .6, ease: 'power2.in' }, '<')
        // the word leaves, then the darkness swallows everything
        .to([$('.ident__word'), $('.ident__credit'), $('.ident__meta')], { opacity: 0, filter: 'blur(10px)', duration: .7, ease: 'power2.in' }, '<.1')
        .to([$('.ident__ring'), $('.ident__rays')], { opacity: 0, duration: .5, ease: 'power2.in' }, '<.35')
        .to($('.ident__disc'), { scale: cover, duration: 1.05, ease: 'expo.in' }, '<.05');
      await out;
      el.classList.add('is-black');
      return () => el.remove();
    },
    remove() { gsap.to(el, { opacity: 0, duration: .6, onComplete: () => el.remove() }); }
  };
}
