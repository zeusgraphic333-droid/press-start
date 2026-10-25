// The drafting-room kit for illustrated scenes. Every scene draws like a sheet from an engineering drawing set:
// graphite lines in ISO weights, section hatching by material, dimension and centre lines, non-photo-blue
// construction lines, a red pencil for what matters, safety orange for force and heat. Lines plot themselves on.
// Scenes are SVG in a 600 × 600 viewBox (unless they set `view`). Read STYLE.md next to this file first.
import gsap from 'gsap';

export const INK = {
  paper: '#FFFFFF',                     // unprinted: the scene multiplies onto the page's drafting film, so white = film
  graphite: '#1B2630', graphite2: '#46545E', graphite3: '#7B8992', // the lines (thick · thin · faint)
  blue: '#3E7BD6', cyan: '#8FB8E8',     // non-photo blue: construction lines, guides, "how it was built"
  red: '#D7263D',                       // red pencil: callouts, the one thing to look at
  hot: '#F05A1E', hazard: '#F7C600',    // safety orange (force, heat, the moving tool) · hazard yellow
  steel: '#AEB9C1', steel2: '#D3DAE0', alu: '#C8CFD6', copper: '#C77B4A', brass: '#C9A646', water: '#5AB4E5', rubber: '#4A4F55',
  // the temper colours (zone accents): straw → blue
  straw: '#E9C46A', gold: '#D99A3A', amber: '#C9822E', bronze: '#B86B3C', plum: '#9B4F7E', violet: '#6A4FC1', tblue: '#3B6FD8', ice: '#7FB2E5'
};
/** ISO line weights for a 600-unit sheet (thick = visible outline, thin = dimensions, hatching, leaders) */
export const W = { thick: 3.4, med: 2.2, thin: 1.3, hair: .8 };
/** section hatch per material (ANSI conventions): fill="${k.hatch('steel')}" */
export const HATCH = ['iron', 'steel', 'bronze', 'plastic', 'refractory', 'glass', 'lead', 'alu', 'water', 'stipple', 'grid'];

let installed = false;
/** shared <defs>: hatch patterns, arrowheads, the pencil filter. Installed once per page (ids are page-wide). */
export function installDefs() {
  if (installed || typeof document === 'undefined') return; installed = true;
  const G = INK.graphite;
  const ln = (x1, y1, x2, y2, w = .9, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${G}" stroke-width="${w}" ${extra}/>`;
  const pat = (id, size, inner, rot = 45) => `<pattern id="hatch-${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})">${inner}</pattern>`;
  let p = '';
  p += pat('iron', 9, ln(0, 0, 0, 9));                                                     // ANSI31 · cast iron, general
  p += pat('steel', 12, ln(0, 0, 0, 12) + ln(2.6, 0, 2.6, 12));                             // ANSI32 · steel
  p += pat('bronze', 14, ln(0, 0, 0, 14) + ln(7, 0, 7, 14, .9, 'stroke-dasharray="3 2.4"')); // ANSI33 · bronze, brass, copper
  p += pat('plastic', 16, ln(0, 0, 0, 16) + ln(2.4, 0, 2.4, 16) + ln(4.8, 0, 4.8, 16));     // ANSI34 · plastic, rubber
  p += pat('refractory', 14, ln(0, 0, 0, 14, 1.4) + ln(7, 0, 7, 14, .7, 'stroke-dasharray="1 2.2"')); // ANSI35 · refractory, fire brick
  p += pat('glass', 13, ln(0, 0, 0, 13, .9, 'stroke-dasharray="7 3"') + ln(4, 0, 4, 13, .6, 'stroke-dasharray="2 8"')); // ANSI36 · glass
  p += pat('lead', 10, ln(0, 0, 0, 10) + ln(0, 5, 10, 5));                                  // ANSI37 · lead, zinc, magnesium
  p += pat('alu', 12, ln(0, 0, 0, 12) + ln(0, 6, 12, 6, .8, 'stroke-dasharray="2.5 2.5"'));  // ANSI38 · aluminium
  p += `<pattern id="hatch-water" width="26" height="12" patternUnits="userSpaceOnUse"><line x1="2" y1="4" x2="14" y2="4" stroke="${INK.water}" stroke-width="1.3" stroke-linecap="round"/><line x1="16" y1="10" x2="22" y2="10" stroke="${INK.water}" stroke-width="1.3" stroke-linecap="round"/></pattern>`;
  p += `<pattern id="hatch-stipple" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".9" fill="${G}"/><circle cx="9" cy="6" r=".7" fill="${G}"/><circle cx="5" cy="11" r=".8" fill="${G}"/><circle cx="12" cy="12" r=".6" fill="${G}"/></pattern>`;
  p += `<pattern id="hatch-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="${INK.cyan}" stroke-width=".7"/></pattern>`;
  // arrowheads (dimension lines, leaders, forces): marker-start / marker-end
  const head = (id, c, w = 10, h = 7) => `<marker id="${id}" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="${w}" markerHeight="${h}" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L10 3.5L0 7z" fill="${c}"/></marker>`;
  p += head('arr', G) + head('arr-red', INK.red) + head('arr-blue', INK.blue) + head('arr-hot', INK.hot, 16, 12);
  p += `<marker id="dot" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.6" fill="${G}"/></marker>`;
  // a hand-drawn wobble for pencil marks (use sparingly: filters cost)
  p += `<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/></filter>`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `<defs>${p}</defs>`;
  document.body.appendChild(svg);
}

/* ---------- drawing helpers (return SVG markup strings) ---------- */
const f1 = v => +(+v).toFixed(1);
const attr = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '').map(([k, v]) => `${k}="${v}"`).join(' ');
export const hatch = (material = 'iron') => `url(#hatch-${material})`;
/** a line; default = thick graphite outline. extra: any attributes (class, opacity, stroke-dasharray…) */
export const line = (x1, y1, x2, y2, stroke = INK.graphite, w = W.thick, extra = '') => `<line ${attr({ x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), stroke, 'stroke-width': w, 'stroke-linecap': 'round' })} ${extra}/>`;
export const path = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
/** an outlined part: fill + graphite outline (pass fill 'none' for a line drawing) */
export const part = (d, fill = 'none', { stroke = INK.graphite, w = W.thick, extra = '' } = {}) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" ${extra}/>`;
export const rect = (x, y, w, h, fill = 'none', extra = '') => `<rect ${attr({ x: f1(x), y: f1(y), width: f1(w), height: f1(h), fill })} ${extra}/>`;
export const circle = (cx, cy, r, fill = 'none', extra = '') => `<circle ${attr({ cx: f1(cx), cy: f1(cy), r: f1(r), fill })} ${extra}/>`;
export const poly = (pts, fill = 'none', extra = '') => `<polygon points="${pts.map(p => p.map(f1).join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
export const polyline = (pts, stroke = INK.graphite, w = W.thick, extra = '') => `<polyline points="${pts.map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
/** stroke styles as attribute strings: `<path … ${k.stroke.hidden}/>` */
export const stroke = {
  thick: `stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round" stroke-linecap="round"`,
  thin: `stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-linecap="round"`,
  hidden: `stroke="${INK.graphite2}" stroke-width="${W.med}" stroke-dasharray="8 5"`,
  center: `stroke="${INK.graphite2}" stroke-width="${W.thin}" stroke-dasharray="22 4 3 4"`,
  construct: `stroke="${INK.blue}" stroke-width="${W.thin}" opacity=".75"`,
  red: `stroke="${INK.red}" stroke-width="${W.med}" stroke-linecap="round"`
};
/** a centre line (dash-dot chain): axes of symmetry, pitch circles, the neutral axis */
export const center = (x1, y1, x2, y2, extra = '') => `<line ${attr({ x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2) })} ${stroke.center} ${extra}/>`;
/** regular polygon / star points */
export const ngon = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a))]; });
export const star = (cx, cy, r1, r2, n = 5, rot = -90) => Array.from({ length: n * 2 }, (_, i) => { const r = i % 2 ? r2 : r1; const a = (rot + i * 180 / n) * Math.PI / 180; return [f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a))]; });

const FAM = {
  display: "'Big Shoulders Display', 'Changa', 'Arial Narrow', sans-serif",
  stencil: "'Big Shoulders Stencil Display', 'Big Shoulders Display', sans-serif",
  text: "'Readex Pro', 'Changa', Arial, sans-serif",
  ar: "'Changa', 'Readex Pro', sans-serif",
  dim: "'Barlow Condensed', 'Arial Narrow', sans-serif"
};
/** text. family: 'dim' (Barlow Condensed: dimensions, labels — the default) · 'display' · 'stencil' · 'text' · 'ar' */
export function text(x, y, s, { size = 16, fill = INK.graphite, family = 'dim', weight = 600, anchor = 'middle', extra = '', dir = '', rotate = 0, spacing = 0 } = {}) {
  const fam = FAM[family] || family;
  // the page may be RTL: anchors would flip with it, so each text carries its own direction (Arabic text → rtl)
  const d = dir || (/[؀-ۿ]/.test(String(s)) ? 'rtl' : 'ltr');
  const tr = rotate ? ` transform="rotate(${f1(rotate)} ${f1(x)} ${f1(y)})"` : '';
  return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}"${spacing ? ` letter-spacing="${spacing}"` : ''}${tr} ${extra} direction="${d}">${s}</text>`;
}
/** an aligned dimension between two points: extension lines, a dimension line with arrows, the value on top.
 *  off = distance from the feature (sign picks the side) · color for a highlighted dimension (INK.red) */
export function dim(x1, y1, x2, y2, label = '', { off = 28, color = INK.graphite, size = 16, ext = true, cls = '' } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
  const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
  const g = Math.sign(off) * 5, e = Math.sign(off) * 7;
  const exts = ext ? `<line x1="${f1(x1 + nx * g)}" y1="${f1(y1 + ny * g)}" x2="${f1(ax + nx * e)}" y2="${f1(ay + ny * e)}" stroke="${color}" stroke-width="${W.hair}"/><line x1="${f1(x2 + nx * g)}" y1="${f1(y2 + ny * g)}" x2="${f1(bx + nx * e)}" y2="${f1(by + ny * e)}" stroke="${color}" stroke-width="${W.hair}"/>` : '';
  const mk = color === INK.red ? 'arr-red' : color === INK.blue ? 'arr-blue' : 'arr';
  let deg = a * 180 / Math.PI; if (deg > 90 || deg <= -90) deg += 180;
  const mx = (ax + bx) / 2 + nx * Math.sign(off || 1) * 9, my = (ay + by) / 2 + ny * Math.sign(off || 1) * 9;
  return `<g class="k-dim ${cls}">${exts}<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}" stroke="${color}" stroke-width="${W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${label !== '' ? text(mx, my + size * .35, label, { size, fill: color, rotate: Math.abs(deg) < .5 ? 0 : deg }) : ''}</g>`;
}
/** a leader: from a feature (x, y) to a note at (tx, ty), with a short shoulder; dot = true ends on a dot instead of an arrow */
export function leader(x, y, tx, ty, label = '', { color = INK.graphite, size = 16, dot = false, family = 'dim', weight = 600 } = {}) {
  const right = tx >= x; const sx = tx + (right ? 18 : -18);
  const mk = dot ? 'dot' : color === INK.red ? 'arr-red' : 'arr';
  return `<g class="k-leader"><polyline points="${f1(tx)},${f1(ty)} ${f1(x)},${f1(y)}" fill="none" stroke="${color}" stroke-width="${W.thin}" marker-end="url(#${mk})"/><line x1="${f1(tx)}" y1="${f1(ty)}" x2="${f1(sx)}" y2="${f1(ty)}" stroke="${color}" stroke-width="${W.thin}"/>${label ? text(sx + (right ? 6 : -6), ty + size * .35, label, { size, fill: color, anchor: right ? 'start' : 'end', family, weight }) : ''}</g>`;
}
/** a force / motion arrow: a fat shaft with a filled head (safety orange by default) */
export const arrow = (x1, y1, x2, y2, { color = INK.hot, w = 6, extra = '' } = {}) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="butt" marker-end="url(#${color === INK.hot ? 'arr-hot' : color === INK.red ? 'arr-red' : 'arr'})" ${extra}/>`;
/** an angle dimension: an arc of radius r around (cx, cy) from a0° to a1° (SVG angles: 0 = right, 90 = down) */
export function angle(cx, cy, r, a0, a1, label = '', { color = INK.graphite, size = 15 } = {}) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [sx, sy] = p(a0), [ex, ey] = p(a1), large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
  const [tx, ty] = p((a0 + a1) / 2).map((v, i) => v + (i ? Math.sin((a0 + a1) / 2 * Math.PI / 180) : Math.cos((a0 + a1) / 2 * Math.PI / 180)) * 16);
  const mk = color === INK.red ? 'arr-red' : 'arr';
  return `<g class="k-angle"><path d="M${f1(sx)} ${f1(sy)}A${r} ${r} 0 ${large} ${sweep} ${f1(ex)} ${f1(ey)}" fill="none" stroke="${color}" stroke-width="${W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${label ? text(tx, ty + size * .35, label, { size, fill: color }) : ''}</g>`;
}
/** an item balloon (the numbered circle on assembly drawings) */
export const balloon = (x, y, n, { r = 13, color = INK.graphite } = {}) => `<g class="k-balloon"><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#fff" stroke="${color}" stroke-width="${W.thin}"/>${text(x, y + 5.5, n, { size: 15, fill: color, weight: 700 })}</g>`;
/** a cutting-plane line with its section letters (A–A) */
export function section(x1, y1, x2, y2, letter = 'A', { color = INK.graphite } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * 26, ny = Math.cos(a) * 26;
  return `<g class="k-section"><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${W.med}" stroke-dasharray="26 5 4 5"/>${[[x1, y1], [x2, y2]].map(([x, y]) => `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + nx)}" y2="${f1(y + ny)}" stroke="${color}" stroke-width="${W.med}" marker-end="url(#arr)"/>${text(x + nx * 1.5, y + ny * 1.5 + 6, letter, { size: 18, weight: 700, fill: color })}`).join('')}</g>`;
}
/** the sheet's title block (the studio signature): a small boxed strip in a corner. Use once per scene at most. */
export function titleBlock(x, y, { title = '', no = '', scale = '1:1', w = 190, color = INK.graphite } = {}) {
  return `<g class="k-tb" opacity=".8"><rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="34" fill="#fff" stroke="${color}" stroke-width="${W.thin}"/><line x1="${f1(x + w - 58)}" y1="${f1(y)}" x2="${f1(x + w - 58)}" y2="${f1(y + 34)}" stroke="${color}" stroke-width="${W.hair}"/>${text(x + 9, y + 22, title, { size: 14, anchor: 'start', fill: color, weight: 600 })}${text(x + w - 29, y + 15, no, { size: 11, fill: color, weight: 700 })}${text(x + w - 29, y + 28, scale, { size: 10, fill: INK.graphite3, weight: 500 })}</g>`;
}
/** hazard stripes (yellow and graphite) inside a rectangle — presses, guards, the danger zone */
export function hazard(x, y, w, h, id) {
  const cid = `${id}-hz`;
  let s = ''; for (let i = -h; i < w + h; i += 22) s += `<path d="M${f1(x + i)} ${f1(y + h)}L${f1(x + i + h)} ${f1(y)}h11L${f1(x + i + 11)} ${f1(y + h)}z" fill="${INK.graphite}"/>`;
  return `<clipPath id="${cid}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"/></clipPath><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${INK.hazard}"/><g clip-path="url(#${cid})">${s}</g>`;
}

/* ---------- motion helpers ---------- */
export const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
/** a timeline that the stage will kill when the scene leaves */
export function tl(opts = {}) { return gsap.timeline({ defaults: { ease: 'power3.out' }, ...opts }); }
/** gentle endless motion (yoyo) — skipped under reduced motion */
export function loop(targets, vars) { if (reduced()) return null; return gsap.to(targets, { repeat: -1, yoyo: true, ease: 'sine.inOut', ...vars }); }
/** the plotter pen: strokes draw themselves on, in order (lines, paths, polylines, circles, rects with a stroke) */
export function plot(t, els, { at = 0, stagger = .08, dur = .7, ease = 'power2.inOut' } = {}) {
  [].concat(els).flatMap(e => (e && e.length !== undefined && !e.tagName ? [...e] : [e])).filter(Boolean).forEach((el, i) => {
    let L = 0; try { L = el.getTotalLength(); } catch (e) { }
    if (!L) { t.from(el, { opacity: 0, duration: .3 }, at + i * stagger); return; }
    L = Math.ceil(L) + 2;
    const keep = el.getAttribute('stroke-dasharray');
    t.fromTo(el, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease, onComplete: () => { if (keep) el.setAttribute('stroke-dasharray', keep); else el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; } }, at + i * stagger);
  });
  return t;
}
/** stamp: symbols, balloons, labels pop in (scale from 0, a hair of overshoot) */
export function stamp(t, els, { at = 0, stagger = .06 } = {}) { t.from(els, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .5, stagger, ease: 'back.out(2.2)' }, at); return t; }
/** fade-in layers (hatching, fills) after their outlines are plotted */
export function ink(t, els, { at = 0, stagger = .05, dur = .5 } = {}) { t.from(els, { opacity: 0, duration: dur, stagger, ease: 'power1.out' }, at); return t; }
/** a press stroke for a tool element: down `dist` px fast, hold, back up slowly; repeats (skipped under reduced motion) */
export function pressStroke(el, { dist = 60, period = 2.6, delay = 0, onHit } = {}) {
  if (reduced()) return null;
  return gsap.timeline({ repeat: -1, delay }).to(el, { y: dist, duration: period * .16, ease: 'power2.in', onComplete: onHit }).to(el, { y: dist, duration: period * .18 }).to(el, { y: 0, duration: period * .48, ease: 'power2.inOut' }).to({}, { duration: period * .18 });
}
export const kit = { INK, W, HATCH, hatch, line, path, part, rect, circle, poly, polyline, stroke, center, ngon, star, text, dim, leader, arrow, angle, balloon, section, titleBlock, hazard, reduced, tl, loop, plot, stamp, ink, press: pressStroke, gsap };
export default kit;
