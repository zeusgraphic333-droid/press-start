// Small DOM + text helpers shared by every screen.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** question text: escaped, except the bank's <b>…</b> emphasis (NOT / WRONG) */
export const qtext = s => esc(s).replace(/&lt;(\/?)b&gt;/g, '<$1b>');
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const reducedMotion = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

export function seeded(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
export function shuffle(a, r = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const pick = (a, r = Math.random) => a[Math.floor(r() * a.length)];

/** Content text: trusted HTML with a few shorthands.
 *  <en>Term</en> → an isolated left-to-right English run; **b** → bold; ==mark== → highlighter. */
export function rich(s) {
  return String(s ?? '')
    .replace(/<en>([\s\S]*?)<\/en>/g, '<bdi class="en" dir="ltr">$1</bdi>')
    .replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>')
    .replace(/==([\s\S]+?)==/g, '<mark>$1</mark>');
}
export function html(el, s) { el.innerHTML = s; return el; }
export function el(tag, cls, inner) { const e = document.createElement(tag); if (cls) e.className = cls; if (inner != null) e.innerHTML = inner; return e; }
export const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
export const arNum = n => String(n); // western digits read fine for this audience; one place to change it
export function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
