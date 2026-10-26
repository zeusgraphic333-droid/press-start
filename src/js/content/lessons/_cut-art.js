// Metal cutting (Lecture 5) — the drawings shared by the lesson (both editions), its demos, its trials and its figures.
// Original line drawings coloured ONLY with CSS variables, so one drawing reads on the night shift and on the drafting
// film. Pure functions: no DOM. Labels inside drawings are the slides' English words (the exam's words); Arabic belongs
// in captions, never in here (the English edition imports this file too).
export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)', card: 'var(--card)' };
const f = n => Math.round(n * 10) / 10;
const escA = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** a drawing: <svg class="cut-svg"> (left-to-right labels on both page directions: see 77-cut.css) */
export const svg = (vb, inner, label = '', cls = '') => `<svg viewBox="${vb}" class="cut-svg${cls ? ' ' + cls : ''}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escA(label)}">${inner}</svg>`;
/** a label (Barlow Condensed); halo: a card-coloured outline so it reads over hatching */
export const tx = (x, y, s, { size = 13, fill = V.ink2, anchor = 'middle', weight = 600, font = 'Barlow Condensed', halo = false, ls = '.03em', extra = '' } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" letter-spacing="${ls}" fill="${fill}"${halo ? ` stroke="${V.card}" stroke-width="4" stroke-linejoin="round" paint-order="stroke"` : ' stroke="none"'}${extra ? ' ' + extra : ''}>${s}</text>`;

/* ---------- geometry: every shape is a list of polygons (curves are sampled), so outlines, fills and hatching agree ---------- */
export const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export const circ = (cx, cy, r, n = 44) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
export const ell = (cx, cy, rx, ry, n = 48) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
export const rrect = (x, y, w, h, r, n = 5) => {
  const out = []; const c = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
  for (const [cx, cy, a0] of c) for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
};
/** quadratic curve points from p0 to p2 with control p1 (end point excluded) */
const quad = (p0, p1, p2, n = 10) => Array.from({ length: n }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; });
const cubic = (p0, p1, p2, p3, n = 14) => Array.from({ length: n }, (_, i) => { const t = i / n, u = 1 - t; return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); });
const move = (poly, dx, dy) => poly.map(([x, y]) => [x + dx, y + dy]);
export const P = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
const D = polys => polys.map(P).join('');
const line = (pts, c = V.ink, w = 1.6, extra = '') => `<path d="M${pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L')}" stroke="${c}" stroke-width="${w}"${extra ? ' ' + extra : ''}/>`;

/** 45° section hatching over a set of polygons (even-odd), with no <pattern> ids. dir 1 = "/", dir -1 = "\" */
export function hatch(polys, { gap = 6, c = V.hatch, w = .9, dir = 1 } = {}) {
  let lo = Infinity, hi = -Infinity;
  for (const poly of polys) for (const [x, y] of poly) { const k = x + dir * y; if (k < lo) lo = k; if (k > hi) hi = k; }
  let d = '';
  for (let k = Math.ceil(lo / gap) * gap; k <= hi; k += gap) {
    const hits = [];
    for (const poly of polys) for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
      const a1 = x1 + dir * y1 - k, a2 = x2 + dir * y2 - k;
      if ((a1 < 0) !== (a2 < 0)) { const s = a1 / (a1 - a2); hits.push(x1 + s * (x2 - x1)); }
    }
    hits.sort((a, b) => a - b);
    for (let i = 0; i + 1 < hits.length; i += 2) { const xa = hits[i], xb = hits[i + 1]; d += `M${f(xa)} ${f((k - xa) * dir)}L${f(xb)} ${f((k - xb) * dir)}`; }
  }
  return d ? `<path d="${d}" stroke="${c}" stroke-width="${w}"/>` : '';
}
/** a part seen from above (or in section): thickness shadow, an opaque base, a tint, optional hatching, the outline */
export function plate(polys, { tint = V.steel, op = .28, sw = 1.6, c = V.ink, sh = 3, hat = false, dir = 1, gap = 6, hc = V.hatch, cls = '' } = {}) {
  const d = D(polys);
  return `<g${cls ? ` class="${cls}"` : ''}>` + (sh ? `<path d="${d}" transform="translate(${sh} ${sh})" fill-rule="evenodd" fill="${V.ink3}" fill-opacity=".4"/>` : '')
    + `<path d="${d}" fill-rule="evenodd" fill="${V.card}"/><path d="${d}" fill-rule="evenodd" fill="${tint}" fill-opacity="${op}"/>`
    + (hat ? hatch(polys, { dir, gap, c: hc }) : '') + `<path d="${d}" fill-rule="evenodd" stroke="${c}" stroke-width="${sw}"/></g>`;
}
/** a sectioned tool block (punch, die, blade): hatched steel */
export const block = (poly, { dir = 1, gap = 6, sw = 1.8, tint = V.steel, op = .16 } = {}) => plate([poly], { tint, op, sw, sh: 0, hat: true, dir, gap });

/** a force arrow (filled head) */
export function arrow(x1, y1, x2, y2, { c = V.hot, w = 2.4, h = 8 } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = h * .5, cs = Math.cos(a), sn = Math.sin(a);
  const bx = x2 - h * .7 * cs, by = y2 - h * .7 * sn;
  return `<path d="M${f(x1)} ${f(y1)}L${f(bx)} ${f(by)}" stroke="${c}" stroke-width="${w}"/><path d="M${f(x2)} ${f(y2)}L${f(x2 - h * cs + s * sn)} ${f(y2 - h * sn - s * cs)}L${f(x2 - h * cs - s * sn)} ${f(y2 - h * sn + s * cs)}Z" fill="${c}"/>`;
}
const tick = (x, y, a, c, s = 6) => { const l = a + 2.7, r = a - 2.7; return `<path d="M${f(x + Math.cos(l) * s)} ${f(y + Math.sin(l) * s)}L${f(x)} ${f(y)}L${f(x + Math.cos(r) * s)} ${f(y + Math.sin(r) * s)}" stroke="${c}" stroke-width="1.2"/>`; };
/** a horizontal dimension between x1 and x2 at height y (small spans get their arrows outside) */
export function dimH(x1, x2, y, { c = V.ink2, label = '', ly = -6, size = 13, lc = V.ink } = {}) {
  const inside = x2 - x1 >= 22;
  let s = `<path d="M${f(x1)} ${f(y)}H${f(x2)}" stroke="${c}" stroke-width="1.1"/>`;
  if (inside) s += tick(x1, y, 0, c) + tick(x2, y, Math.PI, c);
  else s += `<path d="M${f(x1 - 14)} ${f(y)}H${f(x1)}M${f(x2)} ${f(y)}H${f(x2 + 14)}" stroke="${c}" stroke-width="1.1"/>` + tick(x1, y, Math.PI, c) + tick(x2, y, 0, c);
  if (label) s += tx((x1 + x2) / 2, y + ly, label, { size, fill: lc, halo: true });
  return s;
}
/** a leader: a dot on the part, a line, and a label at the free end */
export const lead = (x1, y1, x2, y2, s, { anchor = 'middle', dy = -5, c = V.ink, size = 13, lc = V.ink3 } = {}) =>
  `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${lc}" stroke-width="1"/><circle cx="${f(x1)}" cy="${f(y1)}" r="2.2" fill="${lc}"/>` + (s ? tx(x2 + (anchor === 'start' ? 3 : anchor === 'end' ? -3 : 0), y2 + dy, s, { anchor, fill: c, size, halo: true }) : '');

/* =====================================================================================================
   SMALL ICONS (48 × 48, currentColor): the grid cards (the card colours them)
   ===================================================================================================== */
const I = inner => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const T = 'fill="currentColor" fill-opacity=".22"';
const pI = (polys, extra = T) => `<path d="${D(polys)}" fill-rule="evenodd" ${extra}/>`;
export const ICON = {
  shearing: I(`${pI([rect(5, 12, 38, 24)])}<path d="M24 6v36" stroke-dasharray="3 3"/><path d="M14 24l-5 0M9 24l3-3M9 24l3 3M34 24l5 0M39 24l-3-3M39 24l-3 3"/>`),
  punching: I(`${pI([rect(5, 8, 30, 26), circ(20, 21, 6, 24)])}<circle cx="40" cy="39" r="4.5" stroke-dasharray="2 2"/>`),
  blanking: I(`${pI([rect(5, 8, 30, 26), circ(20, 21, 8, 24)], 'fill="none" stroke-dasharray="2.5 2.5"')}<circle cx="36" cy="36" r="8" ${T}/>`),
  fine: I(`${pI([circ(24, 24, 9, 28)])}<path d="M24 3v8M20.5 7.5L24 11l3.5-3.5M24 45v-8M20.5 40.5L24 37l3.5 3.5"/>`),
  notching: I(pI([[[5, 12], [18, 12], [18, 23], [30, 23], [30, 12], [43, 12], [43, 38], [5, 38]]])),
  perforating: I(pI([rect(5, 9, 38, 30), ...[0, 1, 2, 3].flatMap(i => [0, 1, 2].map(j => circ(11 + i * 8.6, 16 + j * 8, 2, 12)))])),
  slotting: I(pI([rect(5, 9, 38, 30), ...[0, 1].flatMap(i => [0, 1, 2].map(j => rect(10 + i * 15, 14 + j * 8, 11, 3.6)))])),
  slitting: I(`${pI([rect(5, 10, 38, 8), rect(5, 20, 38, 8), rect(5, 30, 38, 8)])}`),
  lancing: I(`${pI([rect(5, 9, 38, 30)])}<path d="M12 22V16H36V22"/><path d="M12 22H36" stroke-dasharray="2 2"/><path d="M12 32V27H36V32"/><path d="M12 32H36" stroke-dasharray="2 2"/>`),
  parting: I(`${pI([[[4, 14], [17, 14], ...quad([17, 14], [12, 24], [17, 34]), [17, 34], [4, 34]], [[31, 14], [44, 14], [44, 34], [31, 34], ...quad([31, 34], [36, 24], [31, 14])]])}<path d="M17 14Q12 24 17 34M31 14Q36 24 31 34" /><path d="M19 17l9 0M18.5 21l10 0M18 25l11 0M18.5 29l10 0M19 32l9 0" stroke-width="1" />`),
  cutoff: I(`${pI([[[4, 14], [22, 14], [16, 34], [4, 34]], [[25, 14], [44, 14], [44, 34], [19, 34]]])}`),
  shaving: I(`${pI([rect(5, 10, 38, 28), circ(24, 24, 9, 28)])}<circle cx="24" cy="24" r="11.5" stroke-dasharray="1.5 2"/>`),
  trimming: I(`<path d="M15 20v18q0 4 4 4h10q4 0 4-4V20" ${T}/><ellipse cx="24" cy="20" rx="9" ry="3"/><ellipse cx="24" cy="10" rx="18" ry="5" stroke-dasharray="3 2"/><ellipse cx="24" cy="10" rx="9" ry="2.6"/>`),
  nibbling: I(`${pI([rect(5, 9, 38, 30)])}<path d="M10 30c4-1 5-9 10-9s5 8 10 8 4-9 8-10" stroke-width="5" stroke-dasharray=".1 3.2" />`),
  embossing: I(`<path d="M4 30h11l4-10h10l4 10h11" stroke-width="2.4"/><path d="M4 35h11l4-10h10l4 10h11" stroke-dasharray="2 2"/>`),
  coining: I(`<circle cx="16" cy="24" r="11" ${T}/><circle cx="34" cy="24" r="11" ${T}/><path d="M12 24l4-5 4 5-4 5z"/><path d="M31 20h6M34 20v8M31 28h6"/>`),
  press: I(`<rect x="18" y="4" width="12" height="18" ${T}/><path d="M24 0v3"/><path d="M4 28h40" stroke-width="3"/><path d="M4 32h13v12H4zM31 32h13v12H31z" ${T}/><rect x="19" y="36" width="10" height="4"/>`),
  chip: I(`<path d="M4 30h18v-6h22v20H4z" ${T}/><circle cx="31" cy="14" r="8"/><path d="M31 6v3M39 14h-3M31 22v-3M23 14h3"/><path d="M18 22c-4-2-6-6-3-9 2-2 5 0 4 2M10 18c-3-1-4-4-2-6"/>`),
  nonchip: I(`<path d="M4 30h40v14H4z" ${T}/><path d="M22 4l-7 13h7l-4 11 12-15h-7l4-9z"/><path d="M38 8c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8z"/>`),
  thermal: I(`<path d="M18 4h12l-3 12h-6z"/><path d="M24 16v14" stroke-width="2.6"/><path d="M4 30h18M26 30h18" stroke-width="3"/><path d="M24 33l-6 9M24 33l2 10M24 33l7 7"/>`)
};

/* =====================================================================================================
   LESSON DRAWINGS
   ===================================================================================================== */
const A = {};

/* ---- L5 · S2: the cutting tree ---- */
function icoPress(x, y) {
  return block(rect(x - 40, y + 14, 32, 24), { gap: 5 }) + block(rect(x + 8, y + 14, 32, 24), { gap: 5 })
    + plate([rect(x - 40, y + 6, 32, 8)], { sh: 0, sw: 1.3 }) + plate([rect(x + 8, y + 6, 32, 8)], { sh: 0, sw: 1.3 })
    + plate([rect(x - 7, y - 34, 14, 40)], { tint: V.zc, op: .35, sh: 0, sw: 1.6 }) + arrow(x, y - 50, x, y - 37, { w: 2, h: 7 })
    + plate([rect(x - 7, y + 22, 14, 7)], { sh: 0, sw: 1.3 }) + `<path d="M${x - 11} ${y + 18}v-6M${x + 11} ${y + 18}v-6" stroke="${V.ink3}" stroke-width="1"/>`;
}
function icoChip(x, y) {
  const teeth = Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; const r1 = 15, r2 = 19; return `M${f(x + 12 + r1 * Math.cos(a))} ${f(y - 14 + r1 * Math.sin(a))}L${f(x + 12 + r2 * Math.cos(a + .18))} ${f(y - 14 + r2 * Math.sin(a + .18))}`; }).join('');
  return plate([[[x - 38, y + 4], [x + 2, y + 4], [x + 2, y + 12], [x + 38, y + 12], [x + 38, y + 36], [x - 38, y + 36]]], { sh: 2 })
    + `<circle cx="${x + 12}" cy="${y - 14}" r="15" fill="${V.card}" stroke="${V.ink}" stroke-width="1.6"/><path d="${teeth}" stroke="${V.ink}" stroke-width="1.6"/><circle cx="${x + 12}" cy="${y - 14}" r="3.5" stroke="${V.ink2}" stroke-width="1.2"/>`
    + `<path d="M${x - 6} ${y - 2}c-6-3-9-9-4-13 4-3 8 1 5 4M${x - 20} ${y - 12}c-5-2-7-7-3-10 3-2 6 0 4 3" stroke="${V.zc}" stroke-width="1.8"/>`
    + `<path d="M${x + 33} ${y - 26}a24 24 0 0 0 -8 -10" stroke="${V.ink3}" stroke-width="1.2"/>` + tick(x + 25, y - 36, Math.PI * 1.25, V.ink3);
}
function icoNonchip(x, y) {
  return plate([rect(x - 38, y + 6, 76, 30)], { sh: 2 }) + `<path d="M${x - 4} ${y + 6}v14h8v-14" stroke="${V.ink2}" stroke-width="1.3" stroke-dasharray="3 2"/>`
    + `<path d="M${x - 8} ${y - 42}l-10 20h10l-5 17 16-23h-10l6-14z" fill="${V.zc}" fill-opacity=".3" stroke="${V.zc}" stroke-width="1.7"/>`
    + `<path d="M${x + 24} ${y - 34}c5 7 7 10 7 13a7 7 0 0 1 -14 0c0-3 2-6 7-13z" stroke="${V.ink2}" stroke-width="1.6"/>`;
}
function icoThermal(x, y) {
  return plate([rect(x - 40, y + 10, 37, 9)], { sh: 2 }) + plate([rect(x + 3, y + 10, 37, 9)], { sh: 2 })
    + `<path d="M${x - 10} ${y - 44}h20l-5 22h-10z" fill="${V.card}" stroke="${V.ink}" stroke-width="1.6"/>`
    + `<path d="M${x} ${y - 22}V${y + 14}" stroke="${V.hot}" stroke-width="3"/><path d="M${x} ${y + 22}l-9 12M${x} ${y + 22}l2 14M${x} ${y + 22}l10 9M${x - 2} ${y + 26}l-13 3" stroke="${V.hot}" stroke-width="1.5"/>`;
}
A.tree = () => {
  const cx = [57, 157, 263, 363];
  const L = [['Punching and', 'Shearing'], ['Chip', 'Forming'], ['Nonchip', 'Forming'], ['Thermal/Flame', 'Cutting']];
  let s = `<rect x="165" y="8" width="90" height="34" rx="4" fill="${V.card}" stroke="${V.ink}" stroke-width="1.8"/>${tx(210, 31, 'Cutting', { size: 18, fill: V.ink, weight: 700 })}`;
  s += `<path d="M210 42V58M57 58H363M57 58V72M157 58V72M263 58V72M363 58V72" stroke="${V.ink2}" stroke-width="1.4"/>`;
  cx.forEach((x, i) => {
    const hi = i === 0;
    s += `<rect x="${x - 48}" y="72" width="96" height="52" rx="4" fill="${hi ? V.zc : V.card}" fill-opacity="${hi ? .16 : 1}" stroke="${hi ? V.zc : V.ink2}" stroke-width="${hi ? 2.2 : 1.4}"/>`;
    s += tx(x, 94, L[i][0], { size: 14.5, fill: hi ? V.zt : V.ink }) + tx(x, 112, L[i][1], { size: 14.5, fill: hi ? V.zt : V.ink });
  });
  s += icoPress(57, 186) + icoChip(157, 186) + icoNonchip(263, 186) + icoThermal(363, 186);
  return ['0 0 420 236', s, 'Cutting: punching and shearing, chip forming, nonchip forming, thermal/flame cutting'];
};

/* ---- L5 · S3: three thermal heads ---- */
A.thermal = () => {
  let s = '';
  [[60, 'gas'], [180, 'laser'], [300, 'plasma']].forEach(([x, k]) => {
    s += plate([rect(x - 52, 96, 49, 10)], { sh: 2 }) + plate([rect(x + 3, 96, 49, 10)], { sh: 2 });
    s += `<path d="M${x - 14} 14h28l-6 34h-16z" fill="${V.card}" stroke="${V.ink}" stroke-width="1.7"/><path d="M${x - 8} 22h16" stroke="${V.ink3}" stroke-width="1"/>`;
    if (k === 'gas') s += `<path d="M${x} 50c-7 12-8 22-5 32 2 7 3 10 5 14 2-4 3-7 5-14 3-10 2-20-5-32z" fill="${V.hot}" fill-opacity=".25" stroke="${V.hot}" stroke-width="1.6"/>`;
    if (k === 'laser') s += `<ellipse cx="${x}" cy="31" rx="7" ry="2.6" stroke="${V.ink2}" stroke-width="1.2"/><path d="M${x} 48V100" stroke="${V.hot}" stroke-width="2.6"/><path d="M${x - 5} 48L${x} 98L${x + 5} 48" stroke="${V.hot}" stroke-width="1" stroke-opacity=".6"/>`;
    if (k === 'plasma') s += `<path d="M${x} 48l-5 9 7 6-6 8 7 7-5 8 2 14" stroke="${V.hot}" stroke-width="2.2"/><path d="M${x} 48l4 8-5 7 6 8-4 8 5 9-6 12" stroke="${V.hot}" stroke-width="1" stroke-opacity=".6"/>`;
    s += `<path d="M${x} 110l-9 12M${x} 110l1 14M${x} 110l9 10M${x - 2} 112l-13 3" stroke="${V.hot}" stroke-width="1.4"/>`;
    s += tx(x, 142, k, { size: 16, fill: V.ink });
  });
  return ['0 0 360 150', s, 'Thermal cutting: gas, laser and plasma'];
};

/* ---- L5 · S4: a designer's product made of sheet ---- */
A.pc = () => {
  let s = '';
  // the case: a front face and a side panel in a light oblique
  const fx = 70, fy = 20, fw = 74, fh = 140, k = 64, kv = -10;
  s += `<path d="M${fx + fw} ${fy}l${k} ${kv}v${fh}l${-k} ${-kv}z" fill="${V.card}"/><path d="M${fx + fw} ${fy}l${k} ${kv}v${fh}l${-k} ${-kv}z" fill="${V.steel}" fill-opacity=".2" stroke="${V.ink}" stroke-width="1.7"/>`;
  s += `<path d="M${fx} ${fy}l${k} ${kv}h${fw}l${-k} ${-kv}z" fill="${V.steel}" fill-opacity=".32" stroke="${V.ink}" stroke-width="1.7"/>`;
  s += plate([rect(fx, fy, fw, fh)], { sh: 0, op: .26 });
  // front: a perforated grille + two punched holes
  let holes = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) holes += `<circle cx="${fx + 14 + i * 9.4}" cy="${fy + 64 + j * 9}" r="2.4" fill="${V.card}" stroke="${V.ink2}" stroke-width="1"/>`;
  s += holes + `<circle cx="${fx + 22}" cy="${fy + 22}" r="7" fill="${V.card}" stroke="${V.ink}" stroke-width="1.4"/><rect x="${fx + 36}" y="${fy + 18}" width="26" height="8" rx="2" fill="${V.card}" stroke="${V.ink}" stroke-width="1.4"/>`;
  // side: lanced louvers (cut on three sides, bent out)
  for (let j = 0; j < 5; j++) { const y = fy + 34 + j * 16, x0 = fx + fw + 14, dx = k - 28, dy = kv * dx / k; s += `<path d="M${x0} ${y}l${dx} ${dy}v5l${-dx} ${-dy}z" fill="${V.zc}" fill-opacity=".35" stroke="${V.zt}" stroke-width="1.4"/>`; }
  s += lead(fx + 40, fy + 92, 26, 150, 'perforated grille', { anchor: 'start', dy: 12 }) + lead(fx + 22, fy + 22, 22, 14, 'punched hole', { anchor: 'start' })
    + lead(fx + fw + 44, fy + 34, 250, 20, 'lanced louvers', { anchor: 'start' });
  return ['0 0 330 172', s, 'A computer case made of sheet metal: punched holes, a perforated grille, lanced louvers'];
};

/* ---- L5 · S5: the scissor-like action ---- */
A.scissor = () => {
  let s = '';
  s += block(rect(14, 98, 162, 50), { dir: 1 }) + block([[184, 26], [346, 26], [346, 80], [184, 80]], { dir: -1 });
  s += plate([rect(14, 80, 332, 18)], { sh: 0, op: .3 });
  s += `<path d="M184 80L176 98" stroke="${V.hot}" stroke-width="2.4"/>` + arrow(264, 2, 264, 22);
  s += tx(264, 58, 'upper blade', { size: 15, fill: V.ink, halo: true }) + tx(94, 128, 'lower blade', { size: 15, fill: V.ink, halo: true }) + tx(300, 93.5, 'sheet', { size: 13, fill: V.ink, halo: true });
  s += `<path d="M176 104V166M184 84V166" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="3 2"/>` + dimH(176, 184, 160, { label: 'c', ly: 16, size: 15, lc: V.zt });
  return ['0 0 360 182', s, 'Shearing: the upper blade passes the lower blade; the sheet between them is sheared'];
};

/* ---- L5 · S6: the two shearing machines of the slide, as line drawings ---- */
A.shears = () => {
  let s = '';
  // power shear (front view)
  s += plate([rect(22, 26, 22, 132)], { sh: 2 }) + plate([rect(168, 26, 22, 132)], { sh: 2 });
  s += plate([rect(44, 32, 124, 26)], { sh: 2, tint: V.steel, op: .36 }) + `<path d="M48 62L164 56" stroke="${V.hot}" stroke-width="2.4"/>`;
  s += plate([rect(36, 84, 140, 16)], { sh: 2 }) + `<path d="M40 84H172" stroke="${V.ink}" stroke-width="2.4"/>`;
  s += `<path d="M60 80H156" stroke="${V.zt}" stroke-width="3.2"/>` + plate([rect(26, 152, 160, 10)], { sh: 0 });
  s += `<rect x="94" y="170" width="28" height="9" rx="2" fill="${V.hot}" fill-opacity=".3" stroke="${V.ink}" stroke-width="1.4"/><path d="M108 170V160" stroke="${V.ink2}" stroke-width="1.2"/>`;
  s += tx(106, 18, 'power shear', { size: 14, fill: V.ink }) + lead(60, 61, 70, 124, 'upper blade', { anchor: 'start', dy: 4, size: 12 }) + lead(122, 174, 150, 140, 'foot pedal', { anchor: 'start', dy: 0, size: 12 });
  // hand lever shear (side view)
  s += plate([rect(232, 112, 172, 10)], { sh: 2 }) + `<path d="M248 122L240 178M388 122L396 178M244 156H392" stroke="${V.ink}" stroke-width="1.8"/>`;
  s += `<path d="M238 108Q318 76 398 22" stroke="${V.ink}" stroke-width="7"/><path d="M238 108Q318 76 398 22" stroke="${V.card}" stroke-width="3.6"/><path d="M240 110L330 96" stroke="${V.hot}" stroke-width="2.4"/>`;
  s += `<circle cx="238" cy="108" r="5" fill="${V.card}" stroke="${V.ink}" stroke-width="1.6"/><path d="M394 25l14-10" stroke="${V.ink}" stroke-width="7"/>`;
  s += tx(318, 150, 'hand lever shear', { size: 14, fill: V.ink }) + tx(404, 12, 'lever', { size: 12, anchor: 'end' });
  return ['0 0 420 186', s, 'Two shearing machines: a power shear with a foot pedal, and a hand lever shear'];
};

/* ---- L5 · S7: the clearance figure (punch P between die halves D, C/2 each side) ---- */
A.clr = () => {
  let s = '';
  s += block([[24, 86], [120, 86], [120, 114], [100, 170], [24, 170]], { dir: 1 }) + block([[296, 86], [200, 86], [200, 114], [220, 170], [296, 170]], { dir: -1 });
  s += plate([rect(132, 24, 56, 62)], { sh: 0, tint: V.zc, op: .16 });
  s += tx(160, 63, 'P', { size: 26, fill: V.ink, weight: 600 }) + tx(62, 136, 'D', { size: 22, fill: V.ink, halo: true }) + tx(258, 136, 'D', { size: 22, fill: V.ink, halo: true });
  s += `<path d="M120 34V84M200 34V84" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="3 2"/>`;
  s += dimH(120, 132, 44, { label: '' }) + dimH(188, 200, 44, { label: '' }) + tx(96, 49, 'C/2', { size: 15, fill: V.zt, anchor: 'end' }) + tx(224, 49, 'C/2', { size: 15, fill: V.zt, anchor: 'start' });
  s += `<path d="M132 88V108M188 88V108" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="3 2"/>` + dimH(132, 188, 104, { label: 'd1', ly: -5, size: 14 });
  s += `<path d="M120 116V156M200 116V156" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="3 2"/>` + dimH(120, 200, 152, { label: 'd', ly: -5, size: 14 });
  s += `<path d="M8 186H312" stroke="${V.ink}" stroke-width="1.8"/>`;
  return ['0 0 320 194', s, 'Clearance: punch P of width d1 between the die halves D; C/2 on each side; die opening d'];
};

/* ---- L5 · S10: punching in section (labels from the slide; x: the slug becomes a mystery "X") ---- */
A.press = ({ x = false } = {}) => {
  let s = '';
  s += block(rect(20, 130, 128, 70), { dir: 1 }) + block(rect(192, 130, 128, 70), { dir: -1 });
  s += plate([rect(20, 118, 132, 12)], { sh: 0, op: .32 }) + plate([rect(188, 118, 132, 12)], { sh: 0, op: .32 });
  s += plate([rect(154, 28, 32, 102)], { sh: 0, tint: V.zc, op: .2 }) + arrow(170, 4, 170, 25);
  s += plate([rect(155, 150, 30, 12)], { sh: 2, op: .4 }) + `<path d="M162 142v-6M170 144v-8M178 142v-6" stroke="${V.ink3}" stroke-width="1"/>`;
  s += tx(184, 15, 'Punching force', { size: 13, fill: V.hot, anchor: 'start' }) + lead(186, 64, 236, 54, 'Punch', { anchor: 'start', dy: 4 });
  s += lead(262, 122, 272, 100, 'Sheet metal', { anchor: 'start', dy: 0 }) + lead(152, 124, 104, 104, 'Clearance', { anchor: 'end', dy: 0 });
  s += lead(286, 176, 296, 214, 'Die', { anchor: 'start', dy: 0 });
  s += x ? lead(158, 158, 110, 214, '', {}) + `<circle cx="102" cy="214" r="10" fill="${V.card}" stroke="${V.zt}" stroke-width="1.8"/>` + tx(102, 219, 'X', { size: 15, fill: V.zt, weight: 700 })
    : lead(158, 158, 110, 214, 'Scrap / slug', { anchor: 'end', dy: 4 });
  return ['0 0 340 228', s, x ? 'Punching in section: punch, sheet metal, clearance, die, and a part marked X' : 'Punching in section: punching force, punch, sheet metal, clearance, scrap or slug, die'];
};

/* ---- L5 · S13: punching vs blanking, same cut, different keeper ---- */
const FIN = (ox, oy, s = 1) => [...cubic([14, 22], [34, 8], [72, 14], [100, 44]), ...cubic([100, 44], [112, 56], [118, 72], [102, 74]), ...cubic([102, 74], [74, 72], [40, 58], [20, 42]), ...cubic([20, 42], [10, 34], [8, 26], [14, 22])].map(([x, y]) => [ox + x * s, oy + y * s]);
function pbPanel(ox, oy, keep, { tag = true } = {}) {
  const frame = rect(ox, oy, 150, 104), shape = FIN(ox + 18, oy + 10, 1.0);
  let s = '';
  if (keep === 'sheet') s += plate([frame, shape], { tint: V.zc, op: .34 }) + plate([shape], { sh: 0, op: .12, hat: true, c: V.ink2, sw: 1.3 });
  else s += plate([frame, shape], { op: .1, hat: true, c: V.ink2, sw: 1.3 }) + plate([shape], { sh: 0, tint: V.zc, op: .5 });
  if (tag) s += tx(ox + (keep === 'sheet' ? 128 : 76), oy + (keep === 'sheet' ? 96 : 56), 'product', { size: 12.5, fill: V.zt, halo: true });
  return s;
}
A.pb = () => {
  let s = pbPanel(14, 30, 'sheet') + pbPanel(196, 30, 'blank');
  s += tx(180, 14, 'Discarded', { size: 15, fill: V.ink }) + `<path d="M162 18L84 74M198 18L218 40" stroke="${V.ink2}" stroke-width="1.2"/>` + tick(84, 74, -2.5, V.ink2, 7) + tick(218, 40, -2.07, V.ink2, 7);
  s += tx(89, 158, 'Punching', { size: 16, fill: V.ink }) + tx(271, 158, 'Blanking', { size: 16, fill: V.ink });
  return ['0 0 360 166', s, 'Punching keeps the sheet with the hole; blanking keeps the shape. The other piece is discarded.'];
};
A.pbQ = () => {
  let s = pbPanel(40, 30, 'blank', { tag: false }) + tx(120, 16, 'Discarded', { size: 15, fill: V.ink }) + `<path d="M138 20L184 38" stroke="${V.ink2}" stroke-width="1.2"/>` + tick(184, 38, -2.75, V.ink2, 7);
  return ['0 0 240 146', s, 'One cut: the arrow marks the discarded piece, the sheet with the hole'];
};

/* ---- L5 · S14: fine blanking in section ---- */
A.fine = () => {
  let s = '';
  s += block(rect(92, 150, 84, 62), { dir: 1 }) + block(rect(224, 150, 84, 62), { dir: -1 });
  s += plate([rect(178, 150, 44, 42)], { sh: 0, tint: V.zc, op: .2 }) + `<path d="M182 160h36M182 170h36M182 180h36" stroke="${V.zt}" stroke-width=".9" stroke-opacity=".7"/>`;
  s += plate([rect(92, 138, 86, 12)], { sh: 0, op: .3 }) + plate([rect(222, 138, 86, 12)], { sh: 0, op: .3 }) + plate([rect(178, 138, 44, 12)], { sh: 0, tint: V.zc, op: .55 });
  s += block(rect(92, 112, 82, 26), { dir: -1, gap: 5 }) + block(rect(226, 112, 82, 26), { dir: 1, gap: 5 });
  s += `<path d="M158 138l5 7 5-7M232 138l5 7 5-7" fill="${V.ink}" stroke="${V.ink}" stroke-width="1.2"/>`;
  s += plate([rect(178, 36, 44, 102)], { sh: 0, op: .2 });
  s += arrow(200, 6, 200, 33) + arrow(122, 76, 122, 109) + arrow(278, 76, 278, 109) + arrow(200, 240, 200, 196);
  s += tx(210, 19, 'Blanking force', { anchor: 'start', fill: V.hot }) + tx(134, 82, 'Holding force', { anchor: 'start', fill: V.hot, halo: true }) + tx(210, 236, 'Counterforce', { anchor: 'start', fill: V.hot });
  s += lead(214, 60, 318, 52, 'Punch', { anchor: 'start', dy: 4 }) + lead(300, 124, 318, 104, 'Guide plate', { anchor: 'start', dy: 0 });
  s += lead(163, 142, 84, 120, 'Impingement', { anchor: 'end', dy: -4 }) + tx(81, 130, 'ring/stinger', { anchor: 'end', fill: V.ink });
  s += lead(300, 144, 318, 146, 'Sheet metal', { anchor: 'start', dy: 4 }) + lead(204, 144, 318, 168, 'Blank', { anchor: 'start', dy: 4 });
  s += lead(186, 184, 84, 184, 'Cushion/ejector', { anchor: 'end', dy: 4 }) + lead(300, 200, 318, 200, 'Die', { anchor: 'start', dy: 4 });
  return ['0 0 400 248', s, 'Fine blanking in section: punch with blanking force, guide plate with holding force and impingement ring, sheet, blank, die, cushion or ejector with counterforce'];
};
/* the finished blank's edge (the slide's zoom) */
A.edge = () => {
  let s = '';
  const body = [[40, 30], ...quad([40, 30], [70, 30], [72, 44], 8), [72, 44], [74, 108], [77, 112], [74, 114], [40, 114]];
  s += plate([body], { tint: V.zc, op: .28, sh: 2 }) + `<path d="M72 50L74 104" stroke="${V.zt}" stroke-width="3" stroke-opacity=".6"/>`;
  s += `<path d="M30 26H120" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="4 3"/>`;
  s += lead(66, 34, 112, 44, 'Die roll', { anchor: 'start', dy: 4 }) + lead(73, 78, 112, 78, 'Sheared edge', { anchor: 'start', dy: 4 }) + lead(76, 112, 112, 112, 'Burr', { anchor: 'start', dy: 4 }) + tx(30, 18, 'Flatness', { anchor: 'start', fill: V.ink });
  return ['0 0 210 126', s, 'The edge of the finished blank: die roll, sheared edge, burr, and its flatness'];
};

/* ---- L5 · S15–S16: notching, perforating, slotting ---- */
A.notch = () => {
  const sheet = [[16, 26], [60, 26], [60, 50], [92, 50], [92, 26], [144, 26], [144, 104], [16, 104]];
  const s = plate([sheet]) + `<path d="M60 6H92V50H60Z" stroke="${V.zt}" stroke-width="1.4" stroke-dasharray="4 3"/>` + tx(98, 17, 'punch', { size: 13, fill: V.zt, anchor: 'start' });
  return ['0 0 160 112', s, 'Notching: a notch punched in the edge of the sheet, in the shape of a portion of the punch'];
};
A.perf = () => {
  const holes = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) holes.push(circ(28 + i * 13, 34 + j * 12, 3.4, 14));
  return ['0 0 160 112', plate([rect(14, 22, 132, 80), ...holes]), 'Perforating: a close arrangement of a large number of holes'];
};
A.slot = () => {
  const sl = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sl.push(rrect(26 + i * 38, 34 + j * 20, 28, 8, 1.5, 2));
  return ['0 0 160 112', plate([rect(14, 22, 132, 80), ...sl]), 'Slotting: rectangular holes in the sheet'];
};

/* ---- L5 · S16–S17: lancing (louvers) and slitting (rotary knives) ---- */
A.lance = () => {
  let s = plate([rect(14, 20, 176, 116)]);
  for (let j = 0; j < 3; j++) { const y = 40 + j * 30; s += `<path d="M40 ${y + 12}V${y}H164V${y + 12}" stroke="${V.ink}" stroke-width="1.8"/><path d="M40 ${y + 12}H164" stroke="${V.zt}" stroke-width="1.4" stroke-dasharray="4 3"/><path d="M42 ${y + 2}h120v8h-120z" fill="${V.zc}" fill-opacity=".3"/>`; }
  // section
  s += plate([[[206, 102], [236, 102], [236, 108], [206, 108]], [[262, 102], [278, 102], [278, 108], [262, 108]], [[304, 102], [348, 102], [348, 108], [304, 108]]], { sh: 0 });
  s += plate([[[262, 102], [262, 108], [238, 86], [242, 82]], [[304, 102], [304, 108], [280, 86], [284, 82]]], { sh: 0, tint: V.zc, op: .55 });
  s += tx(278, 140, 'section', { size: 12 }) + lead(40, 52, 26, 152, 'partial cut', { anchor: 'start', dy: 6 }) + lead(130, 52, 130, 152, 'bend', { anchor: 'start', dy: 6 }) + lead(252, 90, 268, 60, 'tab · vent · louver', { anchor: 'middle', dy: -6 });
  return ['0 0 360 160', s, 'Lancing: a partial cut on three sides; the tab stays attached and is bent up into a louver. No material is removed.'];
};
A.knives = () => {
  let s = '';
  s += plate([rect(10, 94, 194, 7)], { sh: 0, op: .35 });
  s += `<circle cx="112" cy="52" r="44" fill="${V.card}" fill-opacity=".7" stroke="${V.ink}" stroke-width="1.8"/><circle cx="112" cy="142" r="44" fill="${V.card}" fill-opacity=".7" stroke="${V.ink}" stroke-width="1.8"/>`;
  s += `<circle cx="112" cy="52" r="7" stroke="${V.ink2}" stroke-width="1.4"/><circle cx="112" cy="142" r="7" stroke="${V.ink2}" stroke-width="1.4"/><path d="M112 94V101" stroke="${V.hot}" stroke-width="2.6"/>`;
  s += `<path d="M76 30a40 40 0 0 1 30 -16" stroke="${V.ink3}" stroke-width="1.3"/>` + tick(106, 14, Math.PI * .95, V.ink3) + `<path d="M76 164a40 40 0 0 0 30 16" stroke="${V.ink3}" stroke-width="1.3"/>` + tick(106, 180, -Math.PI * .95, V.ink3);
  s += lead(80, 40, 30, 22, 'UPPER KNIFE', { anchor: 'middle', dy: -4, size: 12 }) + lead(80, 156, 36, 176, 'LOWER KNIFE', { anchor: 'middle', dy: 14, size: 12 }) + lead(180, 97, 186, 78, 'WORKPIECE', { anchor: 'middle', dy: -4, size: 12 });
  // plan view of the strip: one piece in, two strips out
  s += plate([[[232, 64], [290, 64], [290, 130], [232, 130]]], { sh: 2 }) + plate([rect(290, 62, 62, 32)], { sh: 2, tint: V.zc, op: .3 }) + plate([rect(290, 100, 62, 32)], { sh: 2, tint: V.zc, op: .3 });
  s += `<path d="M290 97H352" stroke="${V.hot}" stroke-width="1.4" stroke-dasharray="2 3"/>` + arrow(238, 48, 270, 48, { c: V.ink3, w: 1.4, h: 6 }) + tx(292, 156, 'no scrap', { size: 14, fill: V.zt });
  return ['0 0 360 200', s, 'Slitting: an upper and a lower rotary knife cut the workpiece in straight lines; the strip comes out as two strips, no scrap'];
};

/* ---- L5 · S18–S19: cutoff vs parting on the same strip ---- */
/** the pieces of a 300-unit strip at (x0, y0), height h, in feed order: cutoff → 4 nested parts; parting → part, scrap, part, scrap, part, scrap */
export function stripPieces(mode, x0 = 20, y0 = 0, h = 44) {
  const yb = y0 + h, ym = y0 + h / 2, out = [];
  if (mode === 'cutoff') {
    const b = 13;
    for (let k = 0; k < 4; k++) {
      const a = x0 + 75 * k, e = a + 75;
      out.push({ kind: 'part', poly: [[a, y0], [e, y0], ...quad([e, y0], [e + 2 * b, ym], [e, yb]), [e, yb], [a, yb], ...quad([a, yb], [a + 2 * b, ym], [a, y0])] });
    }
  } else {
    const b = 9, parts = [[x0 + 9, x0 + 81], [x0 + 106, x0 + 178], [x0 + 203, x0 + 275]];
    parts.forEach(([a, e], k) => {
      out.push({ kind: 'part', poly: [[a, y0], [e, y0], ...quad([e, y0], [e + 2 * b, ym], [e, yb]), [e, yb], [a, yb], ...quad([a, yb], [a - 2 * b, ym], [a, y0])] });
      const nx = k < 2 ? parts[k + 1][0] : null;
      out.push({ kind: 'scrap', poly: nx ? [[e, y0], [nx, y0], ...quad([nx, y0], [nx - 2 * b, ym], [nx, yb]), [nx, yb], [e, yb], ...quad([e, yb], [e + 2 * b, ym], [e, y0])]
        : [[e, y0], [x0 + 300, y0], [x0 + 300, yb], [e, yb], ...quad([e, yb], [e + 2 * b, ym], [e, y0])] });
    });
  }
  return out;
}
export const pieceSVG = (p, { cls = '', state = '' } = {}) => p.kind === 'part'
  ? plate([p.poly], { tint: V.zc, op: state === 'done' ? .45 : .3, sh: 2, cls })
  : plate([p.poly], { op: .12, hat: true, sh: 2, cls, c: V.ink2, sw: 1.3 });
A.strip = ({ q = false } = {}) => {
  let s = '';
  stripPieces('cutoff', 20, 34, 40).forEach(p => { s += pieceSVG(p); });
  stripPieces('parting', 20, 126, 40).forEach(p => { s += pieceSVG(p); });
  s += tx(20, 24, q ? 'A' : 'CUTOFF', { anchor: 'start', size: 15, fill: V.ink }) + tx(20, 116, q ? 'B' : 'PARTING', { anchor: 'start', size: 15, fill: V.ink });
  s += tx(320, 24, q ? 'PART(4)' : 'PART(4) · one path · no scrap', { anchor: 'end', size: 12.5, fill: V.zt }) + tx(320, 116, q ? 'PART(3)' : 'PART(3) · two paths', { anchor: 'end', size: 12.5, fill: V.zt });
  s += lead(211, 150, 196, 192, 'WASTED MATERIAL', { anchor: 'middle', dy: 2, size: 12 }) + `<path d="M196 186L118 152" stroke="${V.ink3}" stroke-width="1"/><circle cx="118" cy="152" r="2.2" fill="${V.ink3}"/>`;
  return ['0 0 340 200', s, q ? 'Strip A gives 4 parts on one path; strip B gives 3 parts on two paths with wasted material between' : 'Cutoff: 4 parts, one path, no scrap. Parting: 3 parts, two paths, wasted material between.'];
};

/* ---- L5 · S19–S20: shaving, trimming, nibbling ---- */
A.shave = () => {
  let s = plate([rect(16, 18, 168, 92), circ(100, 64, 30, 52)]);
  s += `<circle cx="100" cy="64" r="26" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="3 3"/><path d="${P(circ(100, 64, 30, 52))}${P(circ(100, 64, 26.5, 52))}" fill-rule="evenodd" fill="${V.hot}" fill-opacity=".45"/>`;
  s += lead(78, 44, 44, 30, '±0.025 mm', { anchor: 'middle', dy: -6, c: V.hot });
  s += plate([ell(100, 134, 30, 7, 40), ell(100, 134, 26.5, 5.6, 40)], { op: .12, hat: true, gap: 4, sh: 2, c: V.ink2, sw: 1.2 }) + tx(140, 138, 'shaved away', { anchor: 'start', size: 12 });
  return ['0 0 200 150', s, 'Shaving: a thin ring of minimal material is sheared from the edge of a hole'];
};
A.trim = () => {
  let s = '';
  const cup = [[64, 76], [64, 150], ...quad([64, 150], [64, 160], [76, 160], 4), [124, 160], ...quad([124, 160], [136, 160], [136, 150], 4), [136, 76]];
  s += plate([cup.concat(ell(100, 76, 36, 8, 30).slice(0, 16).reverse())], { tint: V.zc, op: .3, sh: 2 });
  s += `<ellipse cx="100" cy="76" rx="36" ry="8" fill="${V.card}" stroke="${V.ink}" stroke-width="1.6"/><ellipse cx="100" cy="76" rx="36" ry="8" fill="${V.zc}" fill-opacity=".14"/>`;
  s += plate([ell(100, 32, 70, 16, 56), ell(100, 32, 38, 8.4, 48)], { op: .1, hat: true, gap: 5, sh: 2, c: V.ink2, sw: 1.4 });
  s += `<path d="M100 50v18" stroke="${V.ink3}" stroke-width="1.2" stroke-dasharray="2 3"/>` + tick(100, 50, -Math.PI / 2, V.ink3);
  s += lead(166, 34, 178, 58, 'Scrap', { anchor: 'start', dy: 14 }) + lead(130, 120, 160, 132, 'Trimmed part', { anchor: 'start', dy: 4 });
  return ['0 0 230 170', s, 'Trimming: the flange ring is punched away from a drawn cup; the ring is scrap, the cup is the trimmed part'];
};
A.nibble = () => {
  const pts = []; let px = 0, py = 0;
  for (let t = 0; t <= 1.0001; t += .0025) { const x = 40 + 150 * t, y = 72 - 26 * Math.sin(Math.PI * 2 * t); if (!pts.length || Math.hypot(x - px, y - py) >= 7) { pts.push([x, y]); px = x; py = y; } }
  const r = 7.2;
  // the bites are knocked out of the plate with a mask-free trick: a card-coloured fill, then the bite outlines on top
  let s = plate([rect(16, 18, 200, 108)]);
  s += pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${V.card}"/>`).join('') + pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" stroke="${V.ink2}" stroke-width=".9"/>`).join('');
  const [ex, ey] = pts[pts.length - 1];
  s += `<circle cx="${f(ex)}" cy="${f(ey)}" r="${r}" fill="${V.zc}" fill-opacity=".45" stroke="${V.zt}" stroke-width="1.6"/>` + arrow(ex + 18, ey - 30, ex + 6, ey - 9, { w: 1.8, h: 7 });
  s += tx(116, 118, 'small overlapping holes along a path', { size: 12.5 });
  return ['0 0 232 134', s, 'Nibbling: a series of small overlapping holes punched along a path cuts out a larger contoured shape'];
};

/* ---- L5 · S21–S22: embossing (same contour, opposite direction) and coining (both sides) ---- */
A.emboss = ({ small = false } = {}) => {
  const top = [[30, 18], [310, 18], [310, 60], [212, 60], [198, 86], [142, 86], [128, 60], [30, 60]];
  const sheet = [[30, 64], [126, 64], [140, 90], [200, 90], [214, 64], [310, 64], [310, 71], [218, 71], [204, 97], [136, 97], [122, 71], [30, 71]];
  const bot = [[30, 75], [120, 75], [134, 101], [206, 101], [220, 75], [310, 75], [310, 122], [30, 122]];
  let s = block(top, { dir: 1 }) + plate([sheet], { sh: 0, tint: V.zc, op: .5, sw: 1.4 }) + block(bot, { dir: -1 });
  s += tx(70, 44, 'MALE', { size: 16, fill: V.ink, halo: true }) + tx(70, 106, 'FEMALE', { size: 16, fill: V.ink, halo: true }) + tx(260, 44, 'punch', { size: 12, halo: true }) + tx(260, 106, 'die', { size: 12, halo: true });
  if (!small) s += arrow(170, 0, 170, 14) + lead(300, 68, 330, 68, '', {}) + tx(332, 72, 'sheet', { anchor: 'start', size: 13, fill: V.zt });
  return [small ? '0 0 340 128' : '0 0 380 130', s, 'A male punch and a female die of the same contour in opposite direction, with the sheet between'];
};
A.coin = () => {
  const zig = (x0, x1, y, a, n, up) => { const pts = []; for (let i = 0; i <= n; i++) pts.push([x0 + (x1 - x0) * i / n, y + (i % 2 ? (up ? -a : a) : 0)]); return pts; };
  const topFace = zig(110, 230, 58, 7, 12, true), botFace = [];
  for (let i = 0; i <= 24; i++) { const x = 110 + 5 * i; botFace.push([x, 96 + 6 * Math.sin(i / 24 * Math.PI * 4)]); }
  const blank = [[60, 58], ...topFace, [280, 58], [280, 96], ...botFace.slice().reverse(), [60, 96]];
  let s = block([[60, 14], [280, 14], [280, 52], [230, 52], ...topFace.slice().reverse().map(([x, y]) => [x, y - 6]), [110, 52], [60, 52]], { dir: 1 });
  s += plate([blank], { sh: 0, tint: V.zc, op: .45, sw: 1.4 });
  s += block([[60, 102], [110, 102], ...botFace.map(([x, y]) => [x, y + 6]), [280, 102], [280, 140], [60, 140]], { dir: -1 });
  s += tx(84, 38, 'die', { size: 13, halo: true }) + tx(84, 126, 'die', { size: 13, halo: true });
  s += lead(170, 54, 304, 40, 'impression', { anchor: 'start', dy: 4 }) + lead(196, 100, 304, 120, 'impression', { anchor: 'start', dy: 4 });
  return ['0 0 380 150', s, 'Coining: a die on each side; impressions are obtained on both sides of the sheet'];
};
A.coinFaces = () => {
  let s = `<circle cx="64" cy="60" r="44" fill="${V.zc}" fill-opacity=".22" stroke="${V.ink}" stroke-width="1.8"/><circle cx="64" cy="60" r="36" stroke="${V.ink2}" stroke-width="1" stroke-dasharray="1.5 3"/>`;
  s += `<path d="M64 34l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" stroke="${V.ink}" stroke-width="1.6"/>`;
  s += `<circle cx="176" cy="60" r="44" fill="${V.zc}" fill-opacity=".22" stroke="${V.ink}" stroke-width="1.8"/><circle cx="176" cy="60" r="36" stroke="${V.ink2}" stroke-width="1" stroke-dasharray="1.5 3"/>` + tx(176, 74, '10', { size: 40, fill: V.ink, weight: 700, font: 'Big Shoulders Display' });
  s += tx(64, 124, 'front', { size: 13 }) + tx(176, 124, 'back', { size: 13 });
  return ['0 0 240 132', s, 'A coin: one impression on the front, a different one on the back'];
};
A.ribs = () => {
  let s = plate([rect(14, 16, 212, 96)]);
  [44, 82].forEach(y => { s += plate([rrect(34, y - 7, 172, 14, 7, 6)], { tint: V.zc, op: .42, sh: 2.5, sw: 1.4 }) + `<path d="M42 ${y - 3}H198" stroke="${V.card}" stroke-width="2" stroke-opacity=".7"/>`; });
  s += tx(120, 106, 'reinforcement ribs', { size: 12.5 });
  return ['0 0 240 120', s, 'Embossed reinforcement ribs on a sheet'];
};

/* ---- the clearance cut in section, three ways (L5 · S5): too small · right · too large ---- */
/** geometry of one cutting edge: t = sheet thickness, a = break-line angle (deg), g = the gap c on this side */
export function clrState(g, t, a, tol = 3) { const o = g - t * Math.tan(a * Math.PI / 180); return { o, st: o < -tol ? 'small' : o > tol ? 'large' : 'ok' }; }
export function clrInner({ g = 24, t = 56, a = 22, tol = 3, cracks = true, guides = false, force = true, punchUp = 0 } = {}) {
  const yT = 96, yB = yT + t, xd = 166, tan = Math.tan(a * Math.PI / 180), { o, st } = clrState(g, t, a, tol), xp = xd + g;
  const bend = st === 'large' && cracks ? Math.min(24, (o - tol) * 1.1 + 4) : 0;
  let s = '';
  // the die (left, under the sheet) and the punch (right, over it)
  s += block(rect(14, yB, xd - 14, 228 - yB), { dir: 1 });
  s += `<g class="cut-clr__punch" style="transform:translateY(${-punchUp}px)">` + block(rect(xp, 10, 346 - xp, yT - 10 + bend), { dir: -1 }) + '</g>';
  // the sheet: flat, or pinched and bent into a gap that is too wide
  if (!bend) s += plate([rect(14, yT, 332, t)], { sh: 0, op: .3, sw: 1.4 });
  else {
    const mx = (xd + xp) / 2;
    const top = [[14, yT], [xd - 4, yT], ...cubic([xd - 4, yT], [mx, yT], [mx, yT + bend], [xp, yT + bend]), [346, yT + bend]];
    const bot = [[346, yB + bend], [xp + 6, yB + bend], ...cubic([xp + 6, yB + bend], [mx + 6, yB + bend], [xd + 8, yB + 2], [xd, yB]), [14, yB]];
    s += plate([[...top, ...bot]], { sh: 0, op: .3, sw: 1.4 });
  }
  // break lines from the two cutting edges
  const fr = .62, pc = [xp, yT + bend], dc = [xd, yB];
  const pEnd = [pc[0] - fr * t * tan, pc[1] + fr * t], dEnd = [dc[0] + fr * t * tan, dc[1] - fr * t];
  if (guides) s += `<path d="M${f(pc[0] + 40 * tan)} ${f(pc[1] - 40)}L${f(pc[0] - (t + 40) * tan)} ${f(pc[1] + t + 40)}" stroke="${V.zt}" stroke-width="1.2" stroke-dasharray="5 4"/><path d="M${f(dc[0] - 40 * tan)} ${f(dc[1] + 40)}L${f(dc[0] + (t + 40) * tan)} ${f(dc[1] - t - 40)}" stroke="${V.zt}" stroke-width="1.2" stroke-dasharray="5 4"/>`;
  if (cracks) {
    if (st === 'small') {
      const y1 = dEnd[1], y2 = pEnd[1], at = y => [pc[0] - (y - pc[1]) * tan, y], bt = y => [dc[0] + (dc[1] - y) * tan, y];
      s += `<path d="${P([at(y1), at(y2), bt(y2), bt(y1)])}" fill="${V.bad}" fill-opacity=".35" stroke="none"/>`;
    }
    const c = st === 'ok' ? V.good : V.hot;
    s += st === 'ok' ? `<path class="cut-crack" pathLength="1" d="M${f(pc[0])} ${f(pc[1])}L${f(dc[0])} ${f(dc[1])}" stroke="${c}" stroke-width="2.8"/>`
      : `<path class="cut-crack" pathLength="1" d="M${f(pc[0])} ${f(pc[1])}L${f(pEnd[0])} ${f(pEnd[1])}" stroke="${c}" stroke-width="2.6"/><path class="cut-crack" pathLength="1" d="M${f(dc[0])} ${f(dc[1])}L${f(dEnd[0])} ${f(dEnd[1])}" stroke="${c}" stroke-width="2.6"/>`;
  }
  // the gap c on this side
  s += `<path d="M${xd} ${yB}V${yT - 28}" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="3 2"/>` + dimH(xd, xp, yT - 22, { label: 'c', ly: -7, size: 15, lc: V.zt });
  s += tx(xd - 76, yB + 34, 'die', { size: 14, fill: V.ink, halo: true }) + tx(Math.max(xp + 50, 290), 52, 'punch', { size: 14, fill: V.ink, halo: true }) + tx(56, yT + t / 2 + 4, 'sheet', { size: 13, fill: V.ink, halo: true });
  if (force) {
    const fz = st === 'small' ? Math.min(1, .45 + (-o - tol) / 22) : .45;
    s += tx(200, 222, 'force', { size: 12, anchor: 'start' }) + `<rect x="236" y="214" width="104" height="8" rx="2" stroke="${V.ink3}" stroke-width="1"/><rect x="236" y="214" width="${f(104 * fz)}" height="8" rx="2" fill="${st === 'small' ? V.bad : V.ink3}" fill-opacity=".8"/>`;
  }
  return { vb: '0 0 360 232', inner: s, st, o };
}

/* ---- small cross-sections for the lesson's compare (too small / too large) ---- */
A.clrSmall = () => { const r = clrInner({ g: 6, t: 50, a: 22, force: false }); return [r.vb, r.inner, 'Clearance too small: the break lines pass each other']; };
A.clrLarge = () => { const r = clrInner({ g: 48, t: 50, a: 22, force: false }); return [r.vb, r.inner, 'Clearance too large: the metal is pinched and bent']; };

/* ---- punch and die icons for the compare (convex / concave) ---- */
A.punchIco = () => ['0 0 160 110', block([[50, 16], [110, 16], [110, 72], ...quad([110, 72], [110, 100], [80, 100]), [80, 100], ...quad([80, 100], [50, 100], [50, 72]), [50, 72]], { dir: 1 }) + arrow(80, 0, 80, 14) + tx(80, 56, 'male', { size: 14, fill: V.ink, halo: true }), 'The punch: convex, the male part'];
A.dieIco = () => ['0 0 160 110', block([[20, 30], [50, 30], ...quad([50, 30], [50, 66], [80, 66]), [80, 66], ...quad([80, 66], [110, 66], [110, 30]), [110, 30], [140, 30], [140, 100], [20, 100]], { dir: -1 }) + tx(80, 90, 'female', { size: 14, fill: V.ink, halo: true }), 'The die: concave, the female part'];

/* =====================================================================================================
   TRIAL DRAWINGS
   ===================================================================================================== */
/* ---- compact results for "Name the cut" ---- */
A.pb1 = ({ keep = 'sheet' } = {}) => ['0 0 190 140', pbPanel(20, 18, keep), keep === 'sheet' ? 'A sheet with a shaped hole: the sheet is the product, the shape is scrap' : 'A shape cut out of a sheet: the shape is the product, the sheet is scrap'];
A.fineMini = () => {
  let s = block(rect(14, 86, 72, 44), { dir: 1, gap: 5 }) + block(rect(134, 86, 72, 44), { dir: -1, gap: 5 });
  s += plate([rect(88, 86, 44, 30)], { sh: 0, tint: V.zc, op: .2 }) + plate([rect(14, 74, 74, 12)], { sh: 0, op: .3 }) + plate([rect(132, 74, 74, 12)], { sh: 0, op: .3 }) + plate([rect(88, 74, 44, 12)], { sh: 0, tint: V.zc, op: .55 });
  s += block(rect(14, 54, 70, 20), { dir: -1, gap: 5 }) + block(rect(136, 54, 70, 20), { dir: 1, gap: 5 }) + plate([rect(88, 8, 44, 66)], { sh: 0, op: .2 });
  s += arrow(110, -4, 110, 6, { w: 2, h: 7 }) + arrow(48, 30, 48, 51, { w: 2, h: 7 }) + arrow(172, 30, 172, 51, { w: 2, h: 7 }) + arrow(110, 148, 110, 120, { w: 2.4, h: 8 });
  s += tx(110, 44, 'punch', { size: 12, fill: V.ink, halo: true }) + tx(152, 142, 'ejector', { size: 12, fill: V.zt, anchor: 'start' });
  return ['0 -6 220 156', s, 'A punch from above, an ejector pushing up from below, the sheet held between'];
};
A.slitMini = () => {
  let s = plate([rect(14, 30, 60, 66)], { sh: 2 });
  [30, 53, 76].forEach((y, i) => { s += plate([rect(74, y + (i - 1) * 4, 132, 20)], { sh: 2, tint: V.zc, op: .3 }); });
  s += `<path d="M74 51V55M74 74V78" stroke="${V.hot}" stroke-width="2"/>` + arrow(20, 16, 60, 16, { c: V.ink3, w: 1.4, h: 6 }) + tx(140, 120, 'straight lines · no scrap', { size: 12.5, fill: V.zt });
  return ['0 0 220 128', s, 'A sheet cut along straight lines into strips, with no scrap'];
};
A.stripOne = ({ mode = 'cutoff' } = {}) => { let s = ''; stripPieces(mode, 20, 14, 44).forEach(p => { s += pieceSVG(p); }); return ['0 0 340 72', s, mode === 'cutoff' ? 'A strip cut into nested parts with no scrap' : 'A strip cut into parts with wasted material between them']; };

/* ---- the pieces for "Keep or scrap?": each drawn on its own 120 × 90 card ---- */
const lcg = seed => { let x = seed; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
export function piece(kind, role = '') {
  const st = role === 'product' ? { tint: V.zc, op: .42 } : role === 'scrap' ? { op: .08, hat: true, c: V.ink2, sw: 1.3, gap: 5 } : {};
  const pl = polys => plate(polys, { sh: 2.5, ...st });
  const sheet = rect(10, 12, 100, 66);
  let s = '';
  switch (kind) {
    case 'sheetHole': s = pl([sheet, circ(60, 45, 13, 32)]); break;
    case 'slug': s = pl([circ(60, 45, 13, 32)]); break;
    case 'sheetBig': s = pl([sheet, circ(60, 45, 26, 44)]); break;
    case 'blank': s = pl([circ(60, 45, 26, 44)]); break;
    case 'blankFine': s = pl([circ(60, 45, 26, 44)]) + `<circle cx="60" cy="45" r="21.5" stroke="${V.ink3}" stroke-width=".9" stroke-dasharray="1.5 2.5"/>`; break;
    case 'sheetPerf': { const h = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) h.push(circ(20 + i * 11.4, 21 + j * 12, 3, 12)); s = pl([sheet, ...h]); break; }
    case 'slugsTiny': { const r = lcg(7); for (let i = 0; i < 18; i++) s += pl([circ(26 + r() * 68, 24 + r() * 42, 3.2, 12)]); break; }
    case 'sheetSlots': { const h = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) h.push(rrect(20 + i * 30, 22 + j * 17, 22, 7, 1.5, 2)); s = pl([sheet, ...h]); break; }
    case 'slugsRect': { const r = lcg(11); for (let i = 0; i < 7; i++) s += pl([rrect(18 + r() * 62, 18 + r() * 52, 22, 7, 1.5, 2)]); break; }
    case 'sheetNotch': s = pl([[[10, 12], [46, 12], [46, 36], [74, 36], [74, 12], [110, 12], [110, 78], [10, 78]]]); break;
    case 'notchPiece': s = pl([rect(46, 32, 28, 24)]); break;
    case 'cup': { const body = [[36, 30], [36, 76], ...quad([36, 76], [36, 84], [46, 84], 4), [74, 84], ...quad([74, 84], [84, 84], [84, 76], 4), [84, 30]]; s = pl([body.concat(ell(60, 30, 24, 6, 28).slice(0, 14).reverse())]) + `<ellipse cx="60" cy="30" rx="24" ry="6" fill="${V.card}" stroke="${V.ink}" stroke-width="1.5"/>`; break; }
    case 'flange': s = pl([ell(60, 45, 50, 16, 52), ell(60, 45, 26, 7, 40)]); break;
    case 'partShaved': s = pl([sheet, circ(60, 45, 24, 44)]); break;
    case 'sliver': s = pl([circ(60, 45, 27, 48), circ(60, 45, 24, 44)]); break;
    case 'lens': s = pl([[[34, 22], [86, 22], ...quad([86, 22], [104, 45], [86, 68]), [86, 68], [34, 68], ...quad([34, 68], [16, 45], [34, 22])]]); break;
    case 'hourglass': s = pl([[[44, 22], [76, 22], ...quad([76, 22], [58, 45], [76, 68]), [76, 68], [44, 68], ...quad([44, 68], [62, 45], [44, 22])]]); break;
    case 'cPart': s = pl([[[30, 22], [78, 22], ...quad([78, 22], [100, 45], [78, 68]), [78, 68], [30, 68], ...quad([30, 68], [52, 45], [30, 22])]]); break;
    case 'stripRest': s = pl([[[14, 22], [112, 22], [112, 68], [14, 68], ...quad([14, 68], [36, 45], [14, 22])]]); break;
    case 'strip': s = pl([rect(8, 34, 104, 22)]); break;
    case 'louver': { s = pl([sheet]); for (let j = 0; j < 3; j++) { const y = 24 + j * 17; s += `<path d="M24 ${y + 8}V${y}H96V${y + 8}" stroke="${V.ink}" stroke-width="1.5"/><path d="M26 ${y + 1.5}h68v6h-68z" fill="${V.zc}" fill-opacity="${role === 'product' ? .55 : .3}"/><path d="M24 ${y + 8}H96" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="3 2"/>`; } break; }
    case 'ribs': { s = pl([sheet]); [33, 57].forEach(y => { s += plate([rrect(22, y - 6, 76, 12, 6, 5)], { tint: V.zc, op: role === 'product' ? .6 : .4, sh: 2, sw: 1.3 }); }); break; }
    case 'coin': s = `<circle cx="60" cy="45" r="32" fill="${V.card}"/><circle cx="60" cy="45" r="32" fill="${role === 'product' ? V.zc : V.steel}" fill-opacity="${role === 'product' ? .42 : .28}" stroke="${V.ink}" stroke-width="1.6"/><circle cx="60" cy="45" r="25" stroke="${V.ink2}" stroke-width=".9" stroke-dasharray="1.5 3"/><path d="M60 27l5 11 12 1.5-9 8 2.5 12-10.5-6-10.5 6 2.5-12-9-8 12-1.5z" stroke="${V.ink}" stroke-width="1.4"/>`; break;
    default: s = '';
  }
  return svg('0 0 120 90', s, kind);
}

/** a lesson drawing as <svg> */
export const art = (name, o) => { const [vb, inner, label] = A[name](o || {}); return svg(vb, inner, label); };
/** the same drawing as [viewBox, inner markup, label] (figures wrap it with box()) */
export const artParts = (name, o) => A[name](o || {});
