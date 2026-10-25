// The illustrated mode's stage: animated riso-print SVG scenes in place of the particle world.
// Same calls as world/particles.js where the app needs them (set · morph · setStage · start · stop · scatter · flash),
// so lessons keep asking for scenes by name and do not care which mode is on.
import gsap from 'gsap';
import kit, { installDefs, reduced, INK, star } from './scenes2d/kit.js';
import { sceneFor } from './scenes2d/index.js';

export function createStage2D(host) {
  installDefs();
  host.innerHTML = '';
  host.classList.add('stage2d');
  const frame = document.createElement('div'); frame.className = 'st2-frame'; host.append(frame);
  let cur = null, running = true, fade = 1;
  const place = { cx: .5, cy: .5, z: 13.5 };

  const sizeFor = () => { const s = 13.5 / place.z; return Math.min(innerWidth, innerHeight) * .8 * s; };
  function layout(dur = 0) {
    const size = sizeFor();
    gsap.to(frame, { left: place.cx * innerWidth - size / 2, top: place.cy * innerHeight - size / 2, width: size, height: size, duration: dur, ease: 'expo.inOut', overwrite: true });
  }
  layout(0);
  addEventListener('resize', () => layout(0));

  function build(name) {
    const sc = sceneFor(name);
    const el = document.createElement('div'); el.className = 'st2-scene'; el.dataset.scene = name;
    let inner = '';
    try { inner = sc.draw(kit, name); } catch (e) { console.warn('scene2d draw', name, e); }
    el.innerHTML = `<svg viewBox="${sc.view || '0 0 600 600'}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${inner}</svg>`;
    return { name, el, sc, ctx: null };
  }
  function play(s) {
    const svg = s.el.firstElementChild;
    s.ctx = gsap.context(() => { try { s.sc.play?.(svg, kit, s.name); } catch (e) { console.warn('scene2d play', s.name, e); } }, svg);
    if (reduced()) settle(s);
    else if (!running) pauseScene(s);
  }
  const tweensOf = s => (s?.ctx?.getTweens ? s.ctx.getTweens() : []);
  const pauseScene = s => { tweensOf(s).forEach(t => t.pause()); s?.el.classList.add('is-paused'); };
  const resumeScene = s => { if (s?.still) return; tweensOf(s).forEach(t => t.resume()); s?.el.classList.remove('is-paused'); };
  /** reduced motion: every scene shows its finished picture and nothing moves (entrances jump to the end without
   *  firing their callbacks, so no loop is started from an onComplete; loops stay on their first frame) */
  function settle(s) {
    tweensOf(s).forEach(t => {
      if (t.parent && t.parent !== gsap.globalTimeline) return; // children follow their timeline
      if (t.repeat() !== 0) t.pause(0, true); else t.progress(1, true).pause();
    });
    s.still = true;
  }

  function swap(name, dur) {
    if (cur && cur.name === name) return Promise.resolve();
    const next = build(name); frame.append(next.el);
    const old = cur; cur = next;
    if (old) {
      const rm = reduced();
      gsap.to(old.el, { opacity: 0, scale: rm ? 1 : .92, rotate: rm ? 0 : -2, duration: rm ? .2 : Math.min(.45, dur * .35), ease: 'power2.in', onComplete: () => { old.ctx?.kill(); old.el.remove(); } });
    }
    gsap.fromTo(next.el, { opacity: 0 }, { opacity: 1, duration: .3, delay: old ? .18 : 0 });
    play(next);
    return new Promise(r => setTimeout(r, Math.max(0, dur) * 1000));
  }

  const confettiShapes = () => {
    const c = [INK.blue, INK.pink, INK.yellow, INK.teal, INK.orange];
    const b = document.createElement('div'); b.className = 'st2-burst';
    let s = '';
    for (let i = 0; i < 26; i++) {
      const k = i % 4, col = c[i % c.length], x = 300, y = 300;
      s += k === 0 ? `<circle cx="${x}" cy="${y}" r="${8 + (i % 3) * 4}" fill="${col}"/>`
        : k === 1 ? `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="${col}"/>`
          : k === 2 ? `<polygon points="${x},${y - 12} ${x + 11},${y + 8} ${x - 11},${y + 8}" fill="${col}"/>`
            : `<polygon points="${star(x, y, 13, 6).map(p => p.join(',')).join(' ')}" fill="${col}"/>`;
    }
    b.innerHTML = `<svg viewBox="0 0 600 600">${s}</svg>`;
    frame.append(b);
    const parts = b.querySelectorAll('circle,rect,polygon');
    gsap.fromTo(parts, { x: 0, y: 0, scale: .2, opacity: 1, transformOrigin: '300px 300px' }, {
      x: () => gsap.utils.random(-280, 280), y: () => gsap.utils.random(-280, 220), rotate: () => gsap.utils.random(-220, 220), scale: () => gsap.utils.random(.7, 1.5),
      duration: 1.3, ease: 'expo.out', stagger: .01, onComplete: () => gsap.to(parts, { opacity: 0, y: '+=60', duration: .6, onComplete: () => b.remove() })
    });
  };

  const api = {
    kind: '2d', real: true, mobile: innerWidth < 760, builders: {},
    get current() { return cur?.name || ''; },
    /** an opacity knob shaped like the particle uniform, so boot code can fade either stage */
    uniforms: { uOpacity: { get value() { return fade; }, set value(v) { fade = v; host.style.opacity = v; } } },
    set(name) { swap(name, 0); },
    get() { },
    morph(name, { dur = 1.2 } = {}) { return swap(name, dur); },
    setStage(o, dur = 1.2) { Object.assign(place, o); layout(reduced() ? 0 : dur); },
    start() { if (running) return; running = true; host.classList.remove('is-paused'); resumeScene(cur); },
    stop() { if (!running) return; running = false; host.classList.add('is-paused'); pauseScene(cur); },
    scatter(amount = .5) {
      if (reduced()) return Promise.resolve();
      gsap.fromTo(frame, { scale: 1 }, { scale: 1 + amount * .08, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' });
      if (amount > .6) confettiShapes();
      return Promise.resolve();
    },
    flash() { gsap.fromTo(host, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)', duration: .6 }); },
    project: () => ({ x: -999, y: -999, z: 0 }),
    show() { host.hidden = false; }, hide() { host.hidden = true; },
    destroy() { cur?.ctx?.kill(); host.innerHTML = ''; }
  };
  return api;
}
