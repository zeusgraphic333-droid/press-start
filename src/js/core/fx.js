// Feedback light: spark bursts, rings, floating XP, a streak shower for big wins. No confetti.
import { reducedMotion } from './util.js';
import { emit } from './state.js';

/** thin radiating sparks around an element */
export function burst(elm, color = '#FFC93C', n = 12) {
  if (!elm || reducedMotion()) return;
  const r = elm.getBoundingClientRect();
  const b = document.createElement('div'); b.className = 'fx-burst'; b.style.left = (r.left + r.width / 2) + 'px'; b.style.top = (r.top + r.height / 2) + 'px'; b.style.setProperty('--c', color);
  for (let i = 0; i < n; i++) { const s = document.createElement('i'); s.style.setProperty('--a', (i * 360 / n + Math.random() * 8) + 'deg'); b.appendChild(s); }
  document.body.appendChild(b); setTimeout(() => b.remove(), 800);
  ring(elm, color);
}
export const burstAt = burst;
export function ring(elm, color = '#FFC93C') {
  if (!elm || reducedMotion()) return;
  const r = elm.getBoundingClientRect(); const o = document.createElement('div'); o.className = 'fx-ring';
  o.style.left = (r.left + r.width / 2) + 'px'; o.style.top = (r.top + r.height / 2) + 'px'; o.style.setProperty('--c', color);
  document.body.appendChild(o); setTimeout(() => o.remove(), 760);
}
/** a shower of light streaks (big wins). Also asks the world to celebrate. */
let cv = null;
export function confetti(o = {}) {
  emit('celebrate', o);
  if (reducedMotion()) return;
  if (!cv) { cv = document.createElement('canvas'); cv.className = 'fx-streaks'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv); }
  const dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = o.colors || ['#FFC93C', '#EDEBE6', getComputedStyle(document.documentElement).getPropertyValue('--zc').trim() || '#8B7BFF'];
  const n = o.n || (o.big ? 140 : 70);
  const ox = (o.origin?.x ?? .5) * innerWidth, oy = (o.origin?.y ?? 1.02) * innerHeight;
  const S = Array.from({ length: n }, () => { const a = -Math.PI / 2 + (Math.random() - .5) * (o.spread ? o.spread * Math.PI / 180 : 1.6); const v = (o.v || 16) * (.5 + Math.random() * .9); return { x: ox + (Math.random() - .5) * 60, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: cols[Math.floor(Math.random() * cols.length)], l: 10 + Math.random() * 26, life: 1 }; });
  let t0 = performance.now();
  const step = now => {
    const dt = Math.min(2.5, (now - t0) / 16.7); t0 = now;
    x.clearRect(0, 0, innerWidth, innerHeight); let alive = 0;
    for (const s of S) {
      if (s.life <= 0) continue; alive++;
      s.vy += .32 * dt; s.vx *= .985; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= .012 * dt;
      const sp = Math.hypot(s.vx, s.vy) || 1; x.strokeStyle = s.c; x.globalAlpha = Math.max(0, s.life); x.lineWidth = 1.6; x.lineCap = 'round';
      x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x - s.vx / sp * s.l, s.y - s.vy / sp * s.l); x.stroke();
    }
    x.globalAlpha = 1; if (alive) requestAnimationFrame(step); else x.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(step);
}
export function confettiAt(elm, n = 40) {
  if (!elm) return confetti({ n });
  const r = elm.getBoundingClientRect();
  burst(elm, '#FFC93C', 14);
  confetti({ n, v: 11, spread: 70, origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } });
}
/** "+15 XP" floating up from a point */
export function floatText(text, x, y, cls = '') {
  const t = document.createElement('div');
  t.className = 'fx-float ' + cls; t.textContent = text; t.setAttribute('aria-hidden', 'true');
  t.style.left = x + 'px'; t.style.top = y + 'px';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1350);
}
export function floatFrom(elm, text, cls) {
  const r = elm?.getBoundingClientRect?.() || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  floatText(text, r.left + r.width / 2, r.top + 4, cls);
}
export function shake(elm, cls = 'fx-shake') { if (!elm || reducedMotion()) return; elm.classList.remove(cls); void elm.offsetWidth; elm.classList.add(cls); setTimeout(() => elm.classList.remove(cls), 600); }
export function pulse(elm) { shake(elm, 'fx-pulse'); }
