// Question / lesson figures — bend (Lecture 3). Line drawings coloured only with CSS variables, so the same drawing reads
// on the night shift and on the drafting film. The default export feeds q.fig and { t: 'fig', id }; the named exports
// (ART, ICON and the drawing helpers) are the same drawings for lesson art blocks, demos and trials.
// Labels inside drawings are the slides' English terms (the exam's words), so both editions share every drawing.
import { box } from './box.js';

/* ---------- pen ---------- */
const f = v => +(+v).toFixed(2);
const rad = d => d * Math.PI / 180;
export const C = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)', line: 'var(--line)', card: 'var(--card)' };
/** text in a drawing (Barlow Condensed labels) */
export const tx = (x, y, s, { c = C.ink2, z = 14, a = 'middle', w = 500, ls = 0, it = false, rot = 0 } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" fill="${c}" stroke="none" font-family="Barlow Condensed" font-size="${z}" font-weight="${w}" text-anchor="${a}"${ls ? ` letter-spacing="${ls}"` : ''}${it ? ' font-style="italic"' : ''}${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ''}>${s}</text>`;
/** a full <svg> (for art blocks, grid icons, demos) */
export const svg = (vb, inner, label = '', cls = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr" role="img" aria-label="${label}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
/** figures go through box(): the same pen settings on a group (labels stay left-to-right on Arabic pages too) */
const pen = inner => `<g fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr">${inner}</g>`;
/** arrowhead with its tip at (x, y), pointing along `ang` (radians) */
export const ah = (x, y, ang, c = C.ink3, s = 7) => { const k = .42; return `<path d="M${f(x)} ${f(y)}L${f(x - s * Math.cos(ang - k))} ${f(y - s * Math.sin(ang - k))}L${f(x - s * Math.cos(ang + k))} ${f(y - s * Math.sin(ang + k))}Z" fill="${c}" stroke="none"/>`; };
export const arrow = (x1, y1, x2, y2, c = C.ink3, w = 1.5, s = 8) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${c}" stroke-width="${w}"/>${ah(x2, y2, Math.atan2(y2 - y1, x2 - x1), c, s)}`;
/** dimension line with arrowheads at both ends */
export const dim = (x1, y1, x2, y2, c = C.ink3) => { const a = Math.atan2(y2 - y1, x2 - x1); return `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${c}" stroke-width="1.1"/>${ah(x2, y2, a, c, 6.5)}${ah(x1, y1, a + Math.PI, c, 6.5)}`; };
const ext = (d, c = C.ink3) => `<path d="${d}" stroke="${c}" stroke-width=".9"/>`;
/** a ground line with hatch ticks (under a die) */
const ground = (x1, x2, y) => { let d = `M${x1} ${y}H${x2}`; for (let x = x1 + 6; x <= x2; x += 8) d += `M${x} ${y}l-6 7`; return `<path d="${d}" stroke="${C.ink3}" stroke-width="1"/>`; };
/** a point on a circle (degrees, SVG orientation: 0 = right, 90 = down) */
const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
/** arc path from angle a0 to a1 (degrees); `lead` = 'M' starts a new path, 'L' joins with a line, '' continues */
export const arcD = (cx, cy, r, a0, a1, lead = 'M') => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `${lead ? `${lead}${f(x0)} ${f(y0)}` : ''}A${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f(x1)} ${f(y1)}`; };
/** an angle mark: arc + arrowheads at both ends */
const angMark = (cx, cy, r, a0, a1, c) => { const [x1, y1] = pt(cx, cy, r, a1), [x0, y0] = pt(cx, cy, r, a0); const s = a1 > a0 ? 1 : -1; return `<path d="${arcD(cx, cy, r, a0, a1)}" stroke="${c}" stroke-width="1.2"/>${ah(x1, y1, rad(a1 + 90 * s), c, 6)}${ah(x0, y0, rad(a0 - 90 * s), c, 6)}`; };
const sheetFill = (op = .55) => `fill="${C.zc}" fill-opacity="${op}" stroke="${C.ink}" stroke-width="1.4"`;
const steelFill = (op = .3) => `fill="${C.steel}" fill-opacity="${op}" stroke="${C.ink}" stroke-width="1.4"`;

/**
 * a V-bent sheet: lower-surface apex at (ax, ay), legs rising at `half` degrees from vertical, `len` long, `th` thick,
 * the corner rounded with a quadratic of size `rr` (bigger = a bigger bend radius)
 */
export function vSheet(ax, ay, half, len, th, rr = 6) {
  const s = Math.sin(rad(half)), c = Math.cos(rad(half));
  const L = [ax - len * s, ay - len * c], R = [ax + len * s, ay - len * c];
  const ui = th / s; // upper apex sits higher than the lower one
  const U = [ax, ay - ui];
  const nl = [c * th, -s * th], nr = [-c * th, -s * th];
  const L2 = [L[0] + nl[0], L[1] + nl[1]], R2 = [R[0] + nr[0], R[1] + nr[1]];
  const rl = rr, ru = Math.max(1, rr - th * .8);
  const p = (P, d, k) => `${f(P[0] + d[0] * k)} ${f(P[1] + d[1] * k)}`;
  const dl = [-s, -c], dr = [s, -c];
  return `M${f(L[0])} ${f(L[1])}L${p([ax, ay], dl, rl)}Q${f(ax)} ${f(ay)} ${p([ax, ay], dr, rl)}L${f(R[0])} ${f(R[1])}L${f(R2[0])} ${f(R2[1])}L${p(U, dr, ru)}Q${f(U[0])} ${f(U[1])} ${p(U, dl, ru)}L${f(L2[0])} ${f(L2[1])}Z`;
}
/** a V-die block with its groove (included angle 2·half), top at y; returns the path */
const vDie = (x1, x2, y, cx, half, depth, bottom) => { const w = depth * Math.tan(rad(half)); return `M${f(x1)} ${f(y)}H${f(cx - w)}L${f(cx)} ${f(y + depth)}L${f(cx + w)} ${f(y)}H${f(x2)}V${f(bottom)}H${f(x1)}Z`; };

/* =====================================================================================================
   LESSON / QUESTION DRAWINGS
   ===================================================================================================== */

/** L3·S2 — the four forming states */
function states() {
  const xs = [52, 150, 250, 348], nm = [['Liquid State', 'Forming'], ['Fluid State', 'Forming'], ['Plastic State', 'Forming'], ['Solid State', 'Forming']];
  let s = `<rect x="130" y="8" width="140" height="34" rx="3" ${steelFill(.18)}/>${tx(200, 30, 'Metal Forming', { c: C.ink, z: 17, w: 600 })}
    <path d="M200 42V62M52 62H348" stroke="${C.ink2}" stroke-width="1.4"/>`;
  xs.forEach((x, i) => {
    const dash = i === 1 ? ' stroke-dasharray="5 4"' : '';
    const hi = i === 3;
    s += `<path d="M${x} 62V84" stroke="${C.ink2}" stroke-width="1.4"${dash}/>
      <rect x="${x - 46}" y="84" width="92" height="50" rx="3" fill="${hi ? C.zc : C.steel}" fill-opacity="${hi ? .16 : .1}" stroke="${hi ? C.zc : C.ink2}" stroke-width="${hi ? 2 : 1.3}"${dash}/>
      ${tx(x, 105, nm[i][0], { c: hi ? C.zt : C.ink, z: 15, w: 600 })}${tx(x, 123, nm[i][1], { c: hi ? C.zt : C.ink2, z: 14 })}`;
  });
  s += `${arrow(348, 160, 348, 140, C.zt, 1.4, 7)}${tx(348, 174, 'Lecture 3', { c: C.zt, z: 13, w: 600, ls: .5 })}`;
  return { vb: '0 0 400 180', s, label: 'Metal forming: liquid, fluid, plastic and solid state forming' };
}

/** L3·S3 — foil · sheet · plate on one thickness scale */
function gauge() {
  const slab = (x, w, y, h, op) => `<path d="M${x} ${y}h${w}l8 -8h${-w}z" fill="${C.steel}" fill-opacity="${op * .6}" stroke="${C.ink}" stroke-width="1.2"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.steel}" fill-opacity="${op}" stroke="${C.ink}" stroke-width="1.2"/><path d="M${x + w} ${y}l8 -8v${h}l-8 8z" fill="${C.steel}" fill-opacity="${op * .8}" stroke="${C.ink}" stroke-width="1.2"/>`;
  let s = `<rect x="20" y="118" width="96" height="14" fill="${C.ink3}" fill-opacity=".12"/><rect x="116" y="118" width="164" height="14" fill="${C.zc}" fill-opacity=".28"/><rect x="280" y="118" width="100" height="14" fill="${C.hot}" fill-opacity=".14"/>
    <path d="M20 132H380M116 110V140M280 110V140" stroke="${C.ink2}" stroke-width="1.3"/>
    <path d="M30 96h76" stroke="${C.ink}" stroke-width="1.2"/><path d="M30 96l8 -8h76l-8 8" stroke="${C.ink}" stroke-width=".9" fill="${C.steel}" fill-opacity=".25"/>
    ${slab(150, 92, 86, 10, .45)}${slab(292, 74, 72, 26, .5)}
    ${tx(68, 36, 'FOIL', { c: C.ink, z: 17, w: 700, ls: 1 })}${tx(68, 54, 'thinner', { c: C.ink3, z: 13 })}
    ${tx(198, 36, 'SHEET METAL', { c: C.zt, z: 17, w: 700, ls: 1 })}${tx(198, 54, '0.15 – 6.35 mm', { c: C.ink2, z: 14 })}
    ${tx(330, 36, 'PLATE', { c: C.ink, z: 17, w: 700, ls: 1 })}${tx(330, 54, 'thicker', { c: C.ink3, z: 13 })}
    ${tx(116, 158, '0.15 mm', { c: C.ink, z: 15, w: 600 })}${tx(116, 175, '(0.006 in)', { c: C.ink3, z: 13 })}
    ${tx(280, 158, '6.35 mm', { c: C.ink, z: 15, w: 600 })}${tx(280, 175, '(0.25 in)', { c: C.ink3, z: 13 })}`;
  return { vb: '0 0 400 184', s, label: 'Thickness scale: foil below 0.15 mm, sheet metal 0.15 to 6.35 mm, plate above 6.35 mm' };
}

/** L3·S4 — the terminology: stamping press (machine), punch-and-die (tooling), stampings (products) */
function press() {
  const part = (x, y) => `<path d="M${x} ${y}h9v-10h18v10h9" stroke="${C.ink}" stroke-width="3.4"/><path d="M${x} ${y}h9v-10h18v10h9" stroke="${C.zc}" stroke-width="1.5"/>`;
  // a gap-frame press seen from the side: the open throat lets the leaders reach the punch and the die
  const s = `<path d="M24 10H206V60H92V146H226V176H24Z" ${steelFill(.2)}/>
    <rect x="140" y="60" width="58" height="30" rx="2" ${steelFill(.34)}/>${arrow(186, 64, 186, 84, C.hot, 1.8, 7)}
    <path d="M152 90H186V104H178V118H160V104H152Z" ${steelFill(.5)}/>
    <path d="M136 132H158V140H180V132H202V146H136Z" ${steelFill(.5)}/>
    <rect x="128" y="127" width="82" height="5" ${sheetFill(.65)}/>
    <rect x="18" y="176" width="214" height="10" ${steelFill(.15)}/>${ground(8, 360, 186)}
    ${part(296, 186)}${part(306, 175)}${part(300, 164)}
    ${tx(244, 34, 'Stamping press', { c: C.ink, z: 15, w: 600, a: 'start' })}<path d="M240 30H208" stroke="${C.ink3}" stroke-dasharray="2 3"/>
    ${tx(244, 106, 'Punch', { c: C.ink, z: 15, w: 600, a: 'start' })}<path d="M240 102H188" stroke="${C.ink3}" stroke-dasharray="2 3"/>
    ${tx(244, 144, 'Die', { c: C.ink, z: 15, w: 600, a: 'start' })}<path d="M240 140H204" stroke="${C.ink3}" stroke-dasharray="2 3"/>
    ${tx(320, 126, 'Stampings', { c: C.zt, z: 15, w: 700 })}
    ${tx(56, 102, 'machine', { c: C.ink3, z: 12.5, rot: -90 })}${tx(244, 120, 'tooling', { c: C.ink3, z: 12.5, a: 'start' })}${tx(320, 141, 'products', { c: C.ink3, z: 12.5 })}`;
  return { vb: '0 0 370 196', s, label: 'A stamping press (the machine) holds the punch and die (the tooling); stampings (the products) come out' };
}

/** L3·S6 — the solid state forming tree with its three price tags (stacked so it reads on a phone) */
function tree() {
  const rows = [
    ['Simple Bending', 'Low to Moderate Cost', ['Bend', 'Roll', 'Continuous Roll Forming'], C.ink2, 'L3'],
    ['Compound Bending', 'Moderate to High Cost', ['Spinning', 'Hydro-forming', 'Drawing'], C.zt, 'L4'],
    ['Form and Cut (Stamping)', 'High Cost', ['Progressive', 'Transfer Dies', 'Multiple Action Dies'], C.hot, '']
  ];
  let s = `<rect x="105" y="6" width="190" height="34" rx="3" ${steelFill(.18)}/>${tx(200, 28, 'Solid State Forming', { c: C.ink, z: 17, w: 600 })}
    <path d="M200 40V50H24V${62 + 2 * 80 + 30}" stroke="${C.ink2}" stroke-width="1.4"/>`;
  rows.forEach(([n, cost, leaves, col, tag], i) => {
    const y = 62 + i * 80, hi = i === 0;
    s += `<path d="M24 ${y + 30}H40" stroke="${C.ink2}" stroke-width="1.4"/>
      <rect x="40" y="${y}" width="172" height="60" rx="3" fill="${hi ? C.zc : C.steel}" fill-opacity="${hi ? .15 : .08}" stroke="${hi ? C.zc : C.ink2}" stroke-width="${hi ? 2 : 1.3}"/>
      ${tx(126, y + 25, n, { c: C.ink, z: 15.5, w: 600 })}${tx(126, y + 46, cost, { c: col, z: 14, w: 600 })}
      <path d="M212 ${y + 30}H226M226 ${y + 12}V${y + 48}" stroke="${C.ink2}" stroke-width="1.2"/>`;
    leaves.forEach((l, k) => { const ly = y + 12 + k * 18; s += `<path d="M226 ${ly}H234" stroke="${C.ink2}" stroke-width="1.2"/>${tx(240, ly + 5, l, { c: C.ink, z: 14.5, a: 'start' })}`; });
    if (tag) s += `<rect x="370" y="${y + 2}" width="26" height="17" rx="2" fill="${hi ? C.zc : 'none'}" fill-opacity="${hi ? .25 : 0}" stroke="${hi ? C.zc : C.ink3}"/>${tx(383, y + 15, tag, { c: hi ? C.zt : C.ink3, z: 12.5, w: 700 })}`;
  });
  return { vb: '0 0 400 306', s, label: 'Solid state forming: simple bending low to moderate cost, compound bending moderate to high cost, form and cut stamping high cost' };
}

/** L3·S7–S8 — a bent section: tension outside, compression inside, the neutral axis between (q = the X / Y version) */
function neutral(q = false) {
  const cx = 150, cy = 150, ri = 40, T = 26, ro = ri + T, rn = ri + .42 * T;
  const body = `M360 ${cy - ro}H${cx}${arcD(cx, cy, ro, 270, 180, '')}V248H${cx - ri}V${cy}${arcD(cx, cy, ri, 180, 270, '')}H360Z`;
  const tens = `M${cx} ${cy - ro}${arcD(cx, cy, ro, 270, 180, '')}H${cx - rn}${arcD(cx, cy, rn, 180, 270, '')}Z`;
  const comp = `M${cx} ${cy - rn}${arcD(cx, cy, rn, 270, 180, '')}H${cx - ri}${arcD(cx, cy, ri, 180, 270, '')}Z`;
  let s = `<path d="${body}" fill="${C.steel}" fill-opacity=".22"/>`;
  if (!q) s += `<path d="${tens}" fill="${C.hot}" fill-opacity=".42"/><path d="${comp}" fill="${C.zc}" fill-opacity=".45"/>`;
  s += `<path d="${body}" stroke="${C.ink}" stroke-width="1.6"/>
    <path d="M360 ${cy - rn}H${cx}${arcD(cx, cy, rn, 270, 180, '')}V250" stroke="${C.zt}" stroke-width="1.5" stroke-dasharray="7 4"/>
    <path d="M${cx} ${cy - ro - 6}V${cy - ri + 6}M${cx - ro - 6} ${cy}H${cx - ri + 6}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="3 3"/>`;
  if (!q) {
    // stretching arrows outside, squeezing arrows inside
    const outR = ro + 9, inR = ri - 9;
    s += `<path d="${arcD(cx, cy, outR, 228, 260)}" stroke="${C.hot}" stroke-width="1.8"/>${ah(...pt(cx, cy, outR, 260), rad(260 + 90), C.hot, 8)}
      <path d="${arcD(cx, cy, outR, 222, 190)}" stroke="${C.hot}" stroke-width="1.8"/>${ah(...pt(cx, cy, outR, 190), rad(190 - 90), C.hot, 8)}
      <path d="${arcD(cx, cy, inR, 258, 232)}" stroke="${C.zt}" stroke-width="1.8"/>${ah(...pt(cx, cy, inR, 232), rad(232 - 90), C.zt, 7)}
      <path d="${arcD(cx, cy, inR, 192, 218)}" stroke="${C.zt}" stroke-width="1.8"/>${ah(...pt(cx, cy, inR, 218), rad(218 + 90), C.zt, 7)}
      ${tx(52, 56, 'Tension', { c: C.hot, z: 16, w: 700 })}${tx(52, 72, 'outside: stretched', { c: C.ink2, z: 13 })}
      ${tx(170, 168, 'Compression', { c: C.zt, z: 16, w: 700, a: 'start' })}${tx(170, 184, 'inside: compressed', { c: C.ink2, z: 13, a: 'start' })}
      ${tx(282, 66, 'Neutral axis', { c: C.zt, z: 15, w: 600 })}<path d="M282 71L272 ${cy - rn - 2}" stroke="${C.ink3}"/><circle cx="272" cy="${cy - rn}" r="2.2" fill="${C.zt}" stroke="none"/>
      ${tx(150, 76, 'Bend line', { c: C.ink3, z: 12.5 })}`;
    // T and t at the free end
    s += `${ext(`M362 ${cy - ro}H392M362 ${cy - ri}H392M362 ${cy - rn}H374`)}${dim(386, cy - ro, 386, cy - ri)}${tx(394, cy - ri - 8, 'T', { c: C.ink, z: 15, w: 600, a: 'start' })}
      ${arrow(370, cy - rn - 14, 370, cy - rn, C.ink3, 1, 6)}${arrow(370, cy - ri + 14, 370, cy - ri, C.ink3, 1, 6)}${tx(362, cy - ri + 22, 't', { c: C.zt, z: 15, w: 700, a: 'end' })}
      ${tx(300, 214, 'K factor = t / T', { c: C.ink, z: 15, w: 600 })}`;
  } else {
    s += `<circle cx="${f(pt(cx, cy, (ri + rn) / 2, 225)[0])}" cy="${f(pt(cx, cy, (ri + rn) / 2, 225)[1])}" r="3" fill="${C.ink}" stroke="none"/>
      <path d="M${f(pt(cx, cy, (ri + rn) / 2, 225)[0])} ${f(pt(cx, cy, (ri + rn) / 2, 225)[1])}L188 186" stroke="${C.ink2}" stroke-width="1.1"/>${tx(196, 192, 'X', { c: C.ink, z: 20, w: 700, a: 'start' })}
      <circle cx="${f(pt(cx, cy, (ro + rn) / 2, 225)[0])}" cy="${f(pt(cx, cy, (ro + rn) / 2, 225)[1])}" r="3" fill="${C.ink}" stroke="none"/>
      <path d="M${f(pt(cx, cy, (ro + rn) / 2, 225)[0])} ${f(pt(cx, cy, (ro + rn) / 2, 225)[1])}L58 58" stroke="${C.ink2}" stroke-width="1.1"/>${tx(50, 54, 'Y', { c: C.ink, z: 20, w: 700, a: 'end' })}
      ${tx(282, 66, 'Neutral axis', { c: C.zt, z: 15, w: 600 })}<path d="M282 71L272 ${cy - rn - 2}" stroke="${C.ink3}"/>`;
  }
  return { vb: '0 0 420 262', s, label: q ? 'A bent sheet: X marks the inside of the bend, Y the outside' : 'A bent sheet: the outside in tension, the inside in compression, the neutral axis between' };
}

/** L3·S10 — the two flat-length figures side by side: A and B to the bend start (BA) or to the outside corner (BD) */
function flat() {
  const panel = (x0, bd) => {
    const cx = x0 + 70, cy = 146, ri = 18, T = 10, ro = ri + T, rn = ri + .4 * T, xe = x0 + 192;
    const body = `M${cx - ro} 34V${cy}${arcD(cx, cy, ro, 180, 90, '')}H${xe}V${cy + ri}H${cx}${arcD(cx, cy, ri, 90, 180, '')}V34Z`;
    let s = `<path d="${body}" fill="${C.steel}" fill-opacity=".3" stroke="${C.ink}" stroke-width="1.5"/>`;
    if (!bd) {
      s += `<path d="M${cx - ro} ${cy}${arcD(cx, cy, ro, 180, 90, '')}V${cy + ri}${arcD(cx, cy, ri, 90, 180, '')}Z" fill="${C.zc}" fill-opacity=".55" stroke="none"/>
        <path d="${arcD(cx, cy, rn, 180, 90)}" stroke="${C.zt}" stroke-width="1.6"/>
        ${tx(x0 + 98, 138, 'BA', { c: C.zt, z: 16, w: 700, a: 'start' })}<path d="M${x0 + 96} 134L${f(pt(cx, cy, rn, 135)[0] + 3)} ${f(pt(cx, cy, rn, 135)[1] - 2)}" stroke="${C.ink3}"/>
        ${ext(`M${cx - ro - 3} 34H${x0 + 12}M${cx - ro - 3} ${cy}H${x0 + 12}`)}${dim(x0 + 20, 34, x0 + 20, cy)}${tx(x0 + 9, (34 + cy) / 2 + 5, 'A', { c: C.ink, z: 17, w: 700 })}
        ${ext(`M${cx} ${cy + ro + 3}V${cy + 54}M${xe} ${cy + ri + 3}V${cy + 54}`)}${dim(cx, cy + 46, xe, cy + 46)}${tx((cx + xe) / 2, cy + 68, 'B', { c: C.ink, z: 17, w: 700 })}`;
    } else {
      const vx = cx - ro, vy = cy + ro; // the outside corner: the outer surfaces carried on until they meet
      s += `<path d="M${vx} ${cy}V${vy}H${cx}" stroke="${C.zt}" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${vx}" cy="${vy}" r="3.2" fill="${C.zt}" stroke="none"/>
        ${ext(`M${vx - 3} 34H${x0 + 12}M${vx - 3} ${vy}H${x0 + 12}`)}${dim(x0 + 20, 34, x0 + 20, vy)}${tx(x0 + 9, (34 + vy) / 2 + 5, 'A', { c: C.ink, z: 17, w: 700 })}
        ${ext(`M${vx} ${vy + 3}V${cy + 54}M${xe} ${cy + ri + 3}V${cy + 54}`)}${dim(vx, cy + 46, xe, cy + 46)}${tx((vx + xe) / 2, cy + 68, 'B', { c: C.ink, z: 17, w: 700 })}
        ${tx(x0 + 98, 128, 'outside', { c: C.zt, z: 13, a: 'start' })}${tx(x0 + 98, 143, 'corner', { c: C.zt, z: 13, a: 'start' })}<path d="M${x0 + 96} 140L${vx + 5} ${vy - 4}" stroke="${C.ink3}"/>`;
    }
    s += `${tx(x0 + 132, 52, bd ? 'BEND' : 'BEND', { c: C.ink2, z: 13.5, w: 600, ls: 1 })}${tx(x0 + 132, 68, bd ? 'DEDUCTION' : 'ALLOWANCE', { c: C.ink2, z: 13.5, w: 600, ls: 1 })}
      ${tx(x0 + 110, 246, bd ? 'Lt = A + B − BD' : 'Lt = A + B + BA', { c: C.zt, z: 17, w: 700 })}`;
    return s;
  };
  return { vb: '0 0 420 256', s: panel(0, false) + `<path d="M210 30V236" stroke="${C.ink3}" stroke-opacity=".5" stroke-dasharray="2 4"/>` + panel(210, true), label: 'Bend allowance: A and B end where the bend starts, Lt = A + B + BA. Bend deduction: A and B run to the outside corner, Lt = A + B − BD' };
}

/** L3·S11 — the K-factor section */
function kf() {
  const cx = 150, cy = 130, ri = 26, T = 30, ro = ri + T, rn = ri + .4 * T, xe = 300;
  const body = `M${cx - ro} 34V${cy}${arcD(cx, cy, ro, 180, 90, '')}H${xe}V${cy + ri}H${cx}${arcD(cx, cy, ri, 90, 180, '')}V34Z`;
  const s = `<path d="${body}" fill="${C.steel}" fill-opacity=".22" stroke="${C.ink}" stroke-width="1.6"/>
    <path d="M${cx - rn} 30V${cy}${arcD(cx, cy, rn, 180, 90, '')}H${xe + 4}" stroke="${C.zt}" stroke-width="1.6" stroke-dasharray="2 4"/>
    ${ext(`M${cx - ri} 32V14`)}<path d="M${cx - rn} 30V14" stroke="${C.ink3}" stroke-width=".9" stroke-dasharray="2 3"/>
    ${arrow(cx - rn - 16, 20, cx - rn, 20, C.ink3, 1, 6)}${arrow(cx - ri + 16, 20, cx - ri, 20, C.ink3, 1, 6)}${tx(cx - (ri + rn) / 2, 11, 't', { c: C.zt, z: 17, w: 700 })}
    ${ext(`M${xe + 2} ${cy + ri}H${xe + 24}M${xe + 2} ${cy + ro}H${xe + 24}`)}${dim(xe + 16, cy + ri, xe + 16, cy + ro)}${tx(xe + 27, cy + ri + T / 2 + 6, 'T', { c: C.ink, z: 17, w: 700, a: 'start' })}
    ${tx(232, 100, 'K Factor = t / T', { c: C.ink, z: 19, w: 600 })}
    ${tx(cx - ri + 6, 62, 'inside', { c: C.ink3, z: 12.5, a: 'start' })}${tx(cx - ro - 6, 62, 'outside', { c: C.ink3, z: 12.5, a: 'end' })}`;
  return { vb: '0 0 340 200', s, label: 'K factor equals t over T: t from the inside surface to the neutral axis, T the sheet thickness' };
}

/** L3·S12 — the three auto relief types (oblique: a flange bent up over part of the back edge, the relief where it stops) */
function reliefPanel(x0, kind, label = true) {
  const P = (x, y, z) => [x0 + 4 + x + z * .52, 112 - y - z * .5];
  const pp = (x, y, z) => P(x, y, z).map(f).join(' ');
  const W = 92, D = 62, H = 30, xf = 50, nw = kind === 'tear' ? 0 : 11, nd = kind === 'tear' ? 0 : 20;
  // base plate (y = 0), the notch eats into its back edge right after the flange
  let base = `M${pp(0, 0, 0)}L${pp(W, 0, 0)}L${pp(W, 0, D)}L${pp(xf + nw, 0, D)}`;
  if (kind === 'rect') base += `L${pp(xf + nw, 0, D - nd)}L${pp(xf, 0, D - nd)}`;
  else if (kind === 'ob') { const [ex, ey] = P(xf + nw, 0, D - nd + 5.5), [sx, sy] = P(xf, 0, D - nd + 5.5); base += `L${f(ex)} ${f(ey)}A${f(nw / 2 + .8)} ${f(nw / 2 * .7)} -20 0 1 ${f(sx)} ${f(sy)}`; }
  base += `L${pp(xf, 0, D)}L${pp(0, 0, D)}Z`;
  const flange = `M${pp(0, 0, D)}L${pp(xf, 0, D)}L${pp(xf, H, D)}L${pp(0, H, D)}Z`;
  let s = `<path d="${base}" fill="${C.steel}" fill-opacity=".28" stroke="${C.ink}" stroke-width="1.3"/>
    <path d="${flange}" fill="${C.zc}" fill-opacity=".38" stroke="${C.ink}" stroke-width="1.3"/>
    <path d="M${pp(0, 0, 0)}L${pp(0, -3, 0)}L${pp(W, -3, 0)}L${pp(W, 0, 0)}M${pp(W, -3, 0)}L${pp(W, -3, D)}L${pp(W, 0, D)}" stroke="${C.ink}" stroke-width="1"/>`;
  if (kind === 'tear') s += `<path d="M${pp(xf, 0, D)}L${pp(xf, 0, D - 16)}" stroke="${C.hot}" stroke-width="2.6"/>`;
  else s += `<path d="M${pp(xf, 0, D)}L${pp(xf, 0, D - nd + (kind === 'ob' ? 5.5 : 0))}M${pp(xf + nw, 0, D)}L${pp(xf + nw, 0, D - nd + (kind === 'ob' ? 5.5 : 0))}" stroke="${C.hot}" stroke-width="2"/>`;
  s += `<circle cx="${f(P(xf + nw / 2, 0, D - nd / 2)[0])}" cy="${f(P(xf + nw / 2, 0, D - nd / 2)[1])}" r="17" stroke="${C.hot}" stroke-width="1" stroke-dasharray="3 3"/>`;
  if (label) s += tx(x0 + 70, 142, { tear: 'A) Tear-rip', ob: 'B) Obround', rect: 'C) Rectangle' }[kind], { c: C.ink, z: 15, w: 600 });
  return s;
}
function relief() { return { vb: '0 0 420 152', s: reliefPanel(0, 'tear') + reliefPanel(140, 'ob') + reliefPanel(280, 'rect'), label: 'Auto relief types: A tear-rip, B obround, C rectangle' }; }

/** L3·S13 — the bend radius figure, every label of the slide (q = letters a–d instead of words) */
function radius(q = false) {
  const cx = 175, cy = 168, ri = 42, T = 20, ro = ri + T, rn = ri + .4 * T, al = 55, Ls = 110, xe = 300;
  const sa = Math.sin(rad(al)), ca = Math.cos(rad(al)), d = [-ca, sa];
  const ie = [cx - ri * sa, cy - ri * ca], oe = [cx - ro * sa, cy - ro * ca], ne = [cx - rn * sa, cy - rn * ca];
  const it = [ie[0] + d[0] * Ls, ie[1] + d[1] * Ls], ot = [oe[0] + d[0] * Ls, oe[1] + d[1] * Ls], nt = [ne[0] + d[0] * (Ls + 30), ne[1] + d[1] * (Ls + 30)];
  const body = `M${xe} ${cy - ro}H${cx}${arcD(cx, cy, ro, 270, 270 - al, '')}L${f(ot[0])} ${f(ot[1])}L${f(it[0])} ${f(it[1])}L${f(ie[0])} ${f(ie[1])}${arcD(cx, cy, ri, 270 - al, 270, '')}H${xe}Z`;
  const vs = [oe[0] + d[0] * ((cy - ro - oe[1]) / d[1]), cy - ro]; // the outer surfaces meet here
  const L = (k, word) => (q ? k : word);
  let s = `<path d="${body}" fill="${C.steel}" fill-opacity=".3" stroke="${C.ink}" stroke-width="1.6"/>
    <path d="M${xe} ${cy - rn}H${cx}${arcD(cx, cy, rn, 270, 270 - al, '')}L${f(nt[0])} ${f(nt[1])}" stroke="${C.ink2}" stroke-width="1.2" stroke-dasharray="6 4"/>
    <path d="M${cx} ${cy - ro}H${f(vs[0])}L${f(oe[0])} ${f(oe[1])}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="3 3"/>
    <path d="M${cx} ${cy}V${cy - ri}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="3 3"/><path d="M${cx} ${cy}L${f(ie[0])} ${f(ie[1])}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="3 3"/>
    ${angMark(cx, cy, 18, 270 - al, 270, C.ink2)}${tx(cx - 15, cy - 23, 'α', { c: C.ink, z: 15, w: 600 })}
    ${arrow(cx + 1, cy, cx + 1, cy - ri + 1, q ? C.zt : C.ink, 1.4, 7)}`;
  // labels
  s += `${tx(cx + 10, cy - 8, L('c', 'Bend radius, R'), { c: q ? C.zt : C.ink, z: q ? 19 : 14.5, w: 600, a: 'start' })}`;
  const mid = pt(cx, cy, rn, 270 - al / 2);
  s += `<circle cx="${f(mid[0])}" cy="${f(mid[1])}" r="2.6" fill="${C.ink}" stroke="none"/><path d="M${f(mid[0])} ${f(mid[1])}L${q ? '214 86' : '226 74'}" stroke="${C.ink2}" stroke-width="1"/>
    ${q ? tx(222, 86, 'b', { c: C.zt, z: 19, w: 600, a: 'start' }) : `${tx(232, 70, 'Bend allowance', { c: C.ink, z: 14.5, w: 600, a: 'start' })}${tx(232, 86, 'L<tspan baseline-shift="sub" font-size="10">b</tspan>', { c: C.ink, z: 14.5, w: 600, a: 'start' })}`}`;
  s += `${ext(`M${f(vs[0])} ${cy - ro - 3}V${cy - ro - 22}M${cx} ${cy - ro - 3}V${cy - ro - 22}`)}${dim(vs[0], cy - ro - 15, cx, cy - ro - 15)}
    ${q ? tx(vs[0] - 6, cy - ro - 26, 'a', { c: C.zt, z: 19, w: 600, a: 'end' }) : tx(vs[0] - 4, cy - ro - 26, 'Setback', { c: C.ink, z: 14.5, w: 600, a: 'end' })}`;
  // bend angle at the tip: between the leg and the horizontal (parallel to the flat leg); bevel angle on the other side
  const tipA = Math.atan2(-d[1], -d[0]) * 180 / Math.PI; // up the leg
  s += `<path d="M${f(ot[0] - 34)} ${f(ot[1])}H${q ? f(ot[0] + 40) : 352}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="3 3"/>`;
  if (!q) s += `${angMark(ot[0], ot[1], 24, tipA, 0, C.ink2)}${tx(ot[0] + 32, ot[1] + 18, 'Bend angle', { c: C.ink, z: 14, w: 600, a: 'start' })}
    ${angMark(ot[0], ot[1], 14, -180, tipA, C.ink3)}${tx(ot[0] - 10, ot[1] - 22, 'Bevel angle', { c: C.ink2, z: 13.5, a: 'end' })}
    ${tx(nt[0] - 4, nt[1] + 15, 'Neutral axis', { c: C.ink2, z: 13.5, a: 'middle' })}`;
  // side view: length of bend L and thickness t
  const sx = 352, sw = 44;
  s += `<rect x="${sx}" y="${cy - ro}" width="${sw}" height="${T}" fill="${C.steel}" fill-opacity=".45" stroke="${C.ink}" stroke-width="1.3"/>
    <rect x="${sx}" y="${cy - ri}" width="${sw}" height="${f(it[1] - (cy - ri))}" fill="${C.steel}" fill-opacity=".18" stroke="${C.ink}" stroke-width="1.3"/>
    ${ext(`M${sx} ${cy - ro - 3}V${cy - ro - 22}M${sx + sw} ${cy - ro - 3}V${cy - ro - 22}M${sx + sw + 3} ${cy - ro}H${sx + sw + 22}M${sx + sw + 3} ${cy - ri}H${sx + sw + 22}`)}
    ${dim(sx, cy - ro - 15, sx + sw, cy - ro - 15)}${arrow(sx + sw + 15, cy - ro - 14, sx + sw + 15, cy - ro, C.ink3, 1, 6)}${arrow(sx + sw + 15, cy - ri + 14, sx + sw + 15, cy - ri, C.ink3, 1, 6)}
    ${q ? tx(sx + sw / 2, cy - ro - 26, 'd', { c: C.zt, z: 19, w: 600 }) : `${tx(sx + sw / 2, cy - ro - 42, 'Length of', { c: C.ink, z: 14, w: 600 })}${tx(sx + sw / 2, cy - ro - 26, 'bend L', { c: C.ink, z: 14, w: 600 })}`}
    ${tx(sx + sw + 25, cy - ro + 14, 't', { c: C.ink, z: 16, w: 700, a: 'start' })}`;
  return { vb: '0 0 452 280', s: `<g transform="translate(22 0)">${s}</g>`, label: q ? 'A bend with four parts marked a, b, c and d' : 'The bend radius figure: setback, bend allowance Lb, length of bend L, bend radius R, bend angle, bevel angle, neutral axis and thickness t' };
}

/** L3·S14 — V-bending (1) before and (2) after */
function vbend() {
  const die = x0 => `<path d="${vDie(x0 + 22, x0 + 158, 122, x0 + 90, 45, 30, 168)}" ${steelFill(.42)}/>${ground(x0 + 12, x0 + 168, 168)}`;
  const s = `${die(0)}<rect x="28" y="113" width="124" height="8" rx="1" ${sheetFill()}/>
    <path d="M76 30H104V82L90 98L76 82Z" ${steelFill(.16)}/>${arrow(90, 4, 90, 24, C.hot, 2, 9)}${tx(98, 14, 'v', { c: C.ink, z: 15, it: true, a: 'start' })}
    ${die(180)}<path d="${vSheet(270, 152, 45, 78, 8, 5)}" ${sheetFill()}/>
    <path d="M256 36H284V127L270 141L256 127Z" ${steelFill(.16)}/>${arrow(270, 4, 270, 30, C.hot, 2.4, 10)}${tx(279, 16, 'F', { c: C.ink, z: 15, it: true, a: 'start' })}
    ${tx(180, 70, 'Punch', { c: C.ink, z: 15, w: 600 })}<path d="M162 66H108M198 66H254" stroke="${C.ink3}" stroke-dasharray="2 3"/>
    ${tx(180, 150, 'Die', { c: C.ink, z: 15, w: 600 })}<path d="M168 146H158M192 146H202" stroke="${C.ink3}" stroke-dasharray="2 3"/>
    ${tx(90, 194, '(1)', { c: C.ink2, z: 14 })}${tx(270, 194, '(2)', { c: C.ink2, z: 14 })}`;
  return { vb: '0 0 360 200', s, label: 'V-bending: the punch pushes the sheet into a V-shaped die' };
}

/** L3·S14 — air bending vs bottoming (one panel each; `only` draws a single unlabelled panel for questions) */
function airPanel(x0, kind, label = true) {
  const half = 52, top = 112, depth = 42, cx = x0 + 90;
  const w = depth * Math.tan(rad(half));
  let s = `<path d="${vDie(x0 + 18, x0 + 162, top, cx, half, depth, 160)}" ${steelFill(.42)}/>${ground(x0 + 8, x0 + 172, 160)}`;
  if (kind === 'air') {
    // the sheet rests on the die shoulders, the punch tip stops above the groove bottom
    const ay = top + 18, sh = [cx - w, top], ang = Math.atan2(ay - sh[1], cx - sh[0]); const halfS = 90 - ang * 180 / Math.PI;
    s += `<path d="${vSheet(cx, ay, halfS, 82, 6, 4)}" ${sheetFill()}/>
      <path d="M${cx - 12} 22H${cx + 12}V${ay - 16}L${cx} ${ay - 6}L${cx - 12} ${ay - 16}Z" ${steelFill(.16)}/>
      ${dim(cx, ay + 2, cx, top + depth - 1, C.zt)}${tx(cx + 8, top + depth - 6, 'air', { c: C.zt, z: 14, w: 700, a: 'start', it: true })}`;
  } else {
    s += `<path d="${vSheet(cx, top + depth, half, 82, 6, 3)}" ${sheetFill()}/>
      <path d="M${cx - 12} 22H${cx + 12}V${top + depth - 6 / Math.sin(rad(half)) - 14}L${cx} ${top + depth - 6 / Math.sin(rad(half))}L${cx - 12} ${top + depth - 6 / Math.sin(rad(half)) - 14}Z" ${steelFill(.16)}/>`;
  }
  s += arrow(cx, 0, cx, 18, C.hot, 2, 8);
  if (label) s += tx(cx, 186, kind === 'air' ? 'Air Bending' : 'Bottoming', { c: C.ink, z: 15, w: 600 });
  return s;
}
function air() { return { vb: '0 0 360 196', s: airPanel(0, 'air') + airPanel(180, 'bottom'), label: 'Air bending: the punch stops above the bottom of the die. Bottoming: the sheet is forced to the bottom' }; }

/** L3·S15 — edge bending (1) before and (2) after; q = the pressure pad marked X */
function edge(q = false) {
  const p = (x0, done) => {
    let s = `<path d="M${x0 + 30} 114H${x0 + 104}Q${x0 + 110} 114 ${x0 + 110} 120V168H${x0 + 30}Z" ${steelFill(.42)}/>${ground(x0 + 20, x0 + 120, 168)}
      <rect x="${x0 + 30}" y="70" width="74" height="36" rx="2" fill="${q ? C.zc : C.steel}" fill-opacity="${q ? .3 : .26}" stroke="${C.ink}" stroke-width="1.4"/>`;
    s += done
      ? `<path d="M${x0 + 22} 106H${x0 + 110}A8 8 0 0 1 ${x0 + 118} 114V152H${x0 + 110}V114H${x0 + 22}Z" ${sheetFill()}/><path d="M${x0 + 118} 54H${x0 + 148}V152H${x0 + 118}Z" ${steelFill(.16)}/>`
      : `<rect x="${x0 + 22}" y="106" width="128" height="8" rx="1" ${sheetFill()}/><path d="M${x0 + 116} 18H${x0 + 146}V96H${x0 + 116}Z" ${steelFill(.16)}/>`;
    s += `${arrow(x0 + 58, 36, x0 + 58, 66, C.hot, 2, 9)}${tx(x0 + 66, 46, 'F<tspan baseline-shift="sub" font-size="10">h</tspan>', { c: C.ink, z: 15, it: true, a: 'start' })}`;
    s += done ? `${arrow(x0 + 133, 24, x0 + 133, 50, C.hot, 2.4, 10)}${tx(x0 + 141, 34, 'F', { c: C.ink, z: 15, it: true, a: 'start' })}` : `${arrow(x0 + 131, 0, x0 + 131, 14, C.hot, 2, 8)}${tx(x0 + 139, 10, 'v', { c: C.ink, z: 15, it: true, a: 'start' })}`;
    return s;
  };
  let s = p(0, false) + p(180, true);
  if (q) s += `${tx(67, 94, 'X', { c: C.zt, z: 22, w: 700 })}${tx(247, 94, 'X', { c: C.zt, z: 22, w: 700 })}`;
  else s += `${tx(67, 87, 'Pressure', { c: C.ink, z: 13.5, w: 600 })}${tx(67, 100, 'pad', { c: C.ink, z: 13.5, w: 600 })}
    ${tx(150, 62, 'Punch', { c: C.ink, z: 14, w: 600, a: 'start' })}
    ${tx(160, 146, 'Die', { c: C.ink, z: 15, w: 600 })}<path d="M150 142H112M170 142H208" stroke="${C.ink3}" stroke-dasharray="2 3"/>`;
  s += `${tx(80, 192, '(1)', { c: C.ink2, z: 14 })}${tx(260, 192, '(2)', { c: C.ink2, z: 14 })}`;
  return { vb: '0 0 360 200', s, label: q ? 'Edge bending with one part marked X' : 'Edge bending: a pressure pad holds the sheet, the punch bends the edge over the die' };
}

/** L3·S16 — springback: (1) in the tool, radius Rb and angle αb'; (2) the punch gone, a bigger R and α' */
function spring() {
  const top = 118, depth = 46, half = 45;
  const die = x0 => `<path d="${vDie(x0 + 16, x0 + 164, top, x0 + 90, half, depth, 178)}" ${steelFill(.42)}/>${ground(x0 + 6, x0 + 174, 178)}`;
  const a1 = top + depth, ui = 8 / Math.sin(rad(half));
  let s = `${die(0)}<path d="${vSheet(90, a1, half, 92, 8, 9)}" ${sheetFill()}/>
    <path d="M70 18H110V${f(a1 - ui - 20)}L90 ${f(a1 - ui)}L70 ${f(a1 - ui - 20)}Z" ${steelFill(.16)}/>${arrow(90, 0, 90, 14, C.hot, 2.2, 9)}
    ${angMark(90, a1 - ui, 30, 225, 315, C.zt)}${tx(90, a1 - ui - 38, 'α<tspan baseline-shift="sub" font-size="10">b</tspan>′', { c: C.zt, z: 16, w: 700 })}
    ${tx(108, a1 - 4, 'R<tspan baseline-shift="sub" font-size="10">b</tspan>', { c: C.ink, z: 14, w: 600, a: 'start' })}`;
  // after: the sheet opens (bigger included angle), sits higher, bigger radius
  const h2 = 53, a2 = top + depth - 12;
  s += `${die(180)}<path d="M${270 - 70} ${f(a1 - 70)}L270 ${a1}L${270 + 70} ${f(a1 - 70)}" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="4 3"/>
    <path d="${vSheet(270, a2, h2, 92, 8, 16)}" ${sheetFill()}/>
    ${angMark(270, a2 - 8 / Math.sin(rad(h2)), 30, 270 - h2, 270 + h2, C.zt)}${tx(270, a2 - 8 / Math.sin(rad(h2)) - 38, 'α′', { c: C.zt, z: 16, w: 700 })}
    ${tx(288, a2 - 2, 'R', { c: C.ink, z: 14, w: 600, a: 'start' })}
    ${tx(90, 202, '(1)', { c: C.ink2, z: 14 })}${tx(270, 202, '(2)', { c: C.ink2, z: 14 })}`;
  return { vb: '0 0 360 210', s, label: 'Springback: in the tool the part takes radius Rb and angle alpha b prime; after the punch is removed it springs back to a larger radius R and a larger angle alpha prime' };
}

/** included angle vs bend angle on one bent part */
function angles() {
  const ax = 170, ay = 150, inc = 100, legL = 120; // included angle 100°, bend angle 80°
  const h = inc / 2, a1 = 270 - h, a2 = 270 + h; // leg directions (SVG degrees)
  const L = pt(ax, ay, legL, a1), R = pt(ax, ay, legL, a2), ext2 = pt(ax, ay, 95, a1 + 180);
  const s = `<path d="M${f(L[0])} ${f(L[1])}L${ax} ${ay}L${f(R[0])} ${f(R[1])}" stroke="${C.ink}" stroke-width="7"/><path d="M${f(L[0])} ${f(L[1])}L${ax} ${ay}L${f(R[0])} ${f(R[1])}" stroke="${C.steel}" stroke-width="3.4"/>
    <path d="M${ax} ${ay}L${f(ext2[0])} ${f(ext2[1])}" stroke="${C.ink3}" stroke-width="1.2" stroke-dasharray="5 4"/>
    ${angMark(ax, ay, 40, a1, a2, C.zt)}${tx(ax, ay - 64, 'included angle', { c: C.zt, z: 15, w: 700 })}${tx(ax, ay - 47, '100°', { c: C.zt, z: 14, w: 600 })}
    ${angMark(ax, ay, 56, a2, a1 + 180, C.hot)}${tx(ax + 78, ay + 36, 'bend angle', { c: C.hot, z: 15, w: 700, a: 'start' })}${tx(ax + 78, ay + 52, '80°', { c: C.hot, z: 14, w: 600, a: 'start' })}
    ${tx(ax - 64, ay + 34, '100° + 80° = 180°', { c: C.ink, z: 16, w: 700 })}`;
  return { vb: '0 0 360 222', s, label: 'The included angle between the legs and the bend angle add up to 180 degrees' };
}

/* ---------- the six bending operations (L3·S19) ---------- */
const OB = { kx: .55, ky: .36 };
/** oblique projection of (x right, y up, z back) */
const proj = (ox, oy) => (x, y, z) => [ox + x + z * OB.kx, oy - y - z * OB.ky];
/** a flanged plate seen from the front: the bend line runs along the front edge (straight, curving in, or bulging out)
 *  and the flange hangs down from it towards the viewer */
function flangeOp(x0, y0, kind) {
  const P = proj(x0 + 16, y0 + 30), W = 92, D = 46, H = 28, r = 6, N = 16, A = 14;
  const zb = x => kind === 'stretch' ? A * Math.sin(Math.PI * x / W) : kind === 'shrink' ? -A * Math.sin(Math.PI * x / W) : 0;
  const xs = Array.from({ length: N + 1 }, (_, i) => i * W / N);
  const at = (x, y, z) => P(x, y, z).map(f).join(' ');
  const run = (fn, rev = false) => (rev ? xs.slice().reverse() : xs).map((x, i) => `${i ? 'L' : ''}${at(...fn(x))}`).join('');
  const top = `M${at(0, 0, D)}L${at(W, 0, D)}L${run(x => [x, 0, zb(x)], true)}Z`;
  const band = `M${run(x => [x, 0, zb(x)])}L${run(x => [x, -r, zb(x) - r], true)}Z`;
  const fl = `M${run(x => [x, -r, zb(x) - r])}L${run(x => [x, -H, zb(x) - r], true)}Z`;
  const side = `M${at(W, 0, D)}L${at(W, -3, D)}L${at(W, -3, zb(W) + 1)}`;
  let ticks = ''; for (let i = 1; i < N; i++) { const x = xs[i]; ticks += `M${at(x, -.6, zb(x) - .6)}L${at(x, -r + 1, zb(x) - r + .4)}`; }
  return `<path d="${side}" stroke="${C.ink}" stroke-width="1"/><path d="${top}" fill="${C.steel}" fill-opacity=".2" stroke="${C.ink}" stroke-width="1.3"/>
    <path d="${band}" fill="${C.steel}" fill-opacity=".38" stroke="${C.ink}" stroke-width="1"/><path d="${ticks}" stroke="${C.ink2}" stroke-width=".8"/>
    <path d="${fl}" fill="${C.zc}" fill-opacity=".34" stroke="${C.ink}" stroke-width="1.3"/>`;
}
/**
 * a sheet profile extruded backwards: `paths` are centrelines in local coords (x right, y DOWN from the plate's top),
 * `faces` the flat top faces [x1, x2, y], `sil` the points (on the outer surface) where a silhouette line runs back
 */
const SH = 3.1; // half the ribbon: the sheet's thickness on screen
function extrudeOp(x0, y0, paths, faces, sil, cols = [C.zc]) {
  const D = 50, dx = D * OB.kx, dy = -D * OB.ky, ox = x0 + 10, oy = y0 + 48;
  const at = (x, y, back) => `${f(ox + x + (back ? dx : 0))} ${f(oy + y + (back ? dy : 0))}`;
  let s = faces.map(([a, b, y]) => `<path d="M${at(a, y - SH)}L${at(a, y - SH, 1)}L${at(b, y - SH, 1)}L${at(b, y - SH)}Z" fill="${C.steel}" fill-opacity=".2" stroke="${C.ink}" stroke-width="1.1"/>`).join('');
  s += `<g transform="translate(${f(ox + dx)} ${f(oy + dy)})">${paths.map(d => `<path d="${d}" stroke="${C.ink2}" stroke-width="1.1" stroke-opacity=".75"/>`).join('')}</g>`;
  s += `<path d="${sil.map(([x, y]) => `M${at(x, y)}L${at(x, y, 1)}`).join('')}" stroke="${C.ink}" stroke-width="1"/>`;
  s += `<g transform="translate(${f(ox)} ${f(oy)})">${paths.map(d => `<path d="${d}" stroke="${C.ink}" stroke-width="${SH * 2}"/>`).join('')}${paths.map((d, i) => `<path d="${d}" stroke="${cols[i % cols.length]}" stroke-width="3" stroke-opacity=".9"/>`).join('')}</g>`;
  return s;
}
/** the point of a fold (centre cx, cy · centreline radius r) where the outer surface turns away from view */
const silOf = (cx, cy, r) => { const a = Math.atan2(OB.kx, OB.ky); return [cx + (r + SH) * Math.cos(a), cy + (r + SH) * Math.sin(a)]; };
const HEM = 'M0 0H92A6 6 0 0 1 92 12H64';
const SEAM_A = 'M0 0H74A7 7 0 0 1 74 14H52', SEAM_B = 'M70 7H50A7 7 0 0 0 50 21H132';
const CURL = 'M0 0H84A9.5 9.5 0 1 1 76.9 15.8';
function opDraw(kind, x0 = 0, y0 = 0) {
  if (kind === 'straight' || kind === 'stretch' || kind === 'shrink') return flangeOp(x0, y0, kind);
  if (kind === 'hem') return extrudeOp(x0, y0, [HEM], [[0, 92, 0]], [silOf(92, 6, 6)]);
  if (kind === 'curl') return extrudeOp(x0, y0, [CURL], [[0, 84, 0]], [silOf(84, 9.5, 9.5)]);
  // seaming: two plates hooked into each other; the right one runs on lower down
  return extrudeOp(x0, y0, [SEAM_A, SEAM_B], [[0, 74, 0], [84, 132, 21]], [silOf(74, 7, 7)], [C.zc, C.hot]);
}
const OP_NAME = { straight: 'Straight flanging', stretch: 'Stretch flanging', shrink: 'Shrink flanging', hem: 'Hemming', seam: 'Seaming', curl: 'Curling' };
/** one row of three operations with their names (lesson art) */
function opsRow(kinds) {
  let s = '';
  kinds.forEach((k, i) => { const fl = k === 'straight' || k === 'stretch' || k === 'shrink'; s += opDraw(k, i * 140 + (k === 'seam' ? -4 : fl ? 4 : 6), fl ? 18 : 6) + tx(i * 140 + 70, 112, OP_NAME[k], { c: C.ink, z: 15, w: 600 }); });
  return { vb: '0 0 420 120', s, label: kinds.map(k => OP_NAME[k]).join(', ') };
}
/** a single operation, unlabelled (questions) */
function opOne(kind) { return { vb: '0 0 190 110', s: `<g transform="translate(${kind === 'seam' ? 14 : 26} 10)">${opDraw(kind)}</g>`, label: 'A bending operation' }; }

/** L3·S20 — roll forming sheet: three rolls, the top one adjustable */
function roll3() {
  const cxT = 160, cyT = 64, rT = 32, rb = 30, th = 6, Rs = 260, scy = cyT + rT - Rs; // the sheet's top surface is a big arc
  const d = Rs + th + rb, dx = 58, by = scy + Math.sqrt(d * d - dx * dx);
  const sx = x => { const k = x - cxT; return scy + Math.sqrt(Rs * Rs - k * k); };
  const span = [26, 294];
  const aL = Math.atan2(sx(span[0]) - scy, span[0] - cxT) * 180 / Math.PI, aR = Math.atan2(sx(span[1]) - scy, span[1] - cxT) * 180 / Math.PI;
  const sheet = `${arcD(cxT, scy, Rs, aL, aR)}L${f(pt(cxT, scy, Rs + th, aR)[0])} ${f(pt(cxT, scy, Rs + th, aR)[1])}${arcD(cxT, scy, Rs + th, aR, aL, '')}Z`;
  const roll = (x, y, r, dir) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.steel}" fill-opacity=".22" stroke="${C.ink}" stroke-width="1.5"/><path d="M${f(x - 5)} ${f(y)}h10M${f(x)} ${f(y - 5)}v10" stroke="${C.ink3}"/>
    <path d="${arcD(x, y, r - 8, dir > 0 ? 200 : 340, dir > 0 ? 250 : 290)}" stroke="${C.ink2}" stroke-width="1.3"/>${ah(...pt(x, y, r - 8, dir > 0 ? 250 : 290), rad(dir > 0 ? 340 : 200), C.ink2, 6)}`;
  const s = `<path d="${sheet}" ${sheetFill(.6)}/>${roll(cxT, cyT, rT, 1)}${roll(cxT - dx, by, rb, -1)}${roll(cxT + dx, by, rb, -1)}
    <path d="M${cxT} ${cyT - rT - 4}V${cyT - rT - 26}" stroke="${C.hot}" stroke-width="1.8"/>${ah(cxT, cyT - rT - 28, rad(-90), C.hot, 7)}${ah(cxT, cyT - rT - 3, rad(90), C.hot, 7)}
    ${tx(cxT - 12, cyT - rT - 10, 'adjustable roll', { c: C.ink, z: 14, w: 600, a: 'end' })}
    ${tx(312, 30, 'rolling radius (r)', { c: C.zt, z: 14, w: 600, a: 'end' })}<path d="M262 36L266 ${f(sx(266) - 3)}" stroke="${C.ink3}"/>`;
  return { vb: '0 0 320 186', s, label: 'Roll forming sheet: three rolls; moving the top roll sets the rolling radius r' };
}

/** L3·S23 — continuous roll forming: a strip through five roll stations, the section changing a little at each */
const PROFILES = [
  'M-22 0H22',
  'M-24 -3L-14 0H14L24 -3',
  'M-22 -10L-14 0H14L22 -10',
  'M-20 -16L-16 0H16L20 -16',
  'M-26 -16H-17V0H17V-16H26'
];
function contRoll() {
  const xs = [84, 158, 232, 306, 380];
  let s = `<path d="M8 66H412V74H8Z" ${sheetFill(.45)}/>${arrow(8, 56, 40, 56, C.ink2, 1.4, 7)}${tx(8, 46, 'Sheet metal', { c: C.ink2, z: 13, a: 'start' })}`;
  xs.forEach((x, i) => {
    s += `<circle cx="${x}" cy="47" r="18" fill="${C.steel}" fill-opacity=".22" stroke="${C.ink}" stroke-width="1.4"/><circle cx="${x}" cy="93" r="18" fill="${C.steel}" fill-opacity=".22" stroke="${C.ink}" stroke-width="1.4"/>
      <path d="M${x} 29V18M${x} 111V122" stroke="${C.ink3}"/>${tx(x, 13, '#' + (i + 1), { c: C.ink2, z: 13, w: 600 })}
      <g transform="translate(${x} 158)"><path d="${PROFILES[i]}" stroke="${C.ink}" stroke-width="5.5"/><path d="${PROFILES[i]}" stroke="${C.zc}" stroke-width="2.6"/></g>`;
    if (i < 4) s += arrow(x + 30, 152, x + 46, 152, C.ink3, 1, 5);
  });
  s += tx(210, 186, 'cross-section at each roll station', { c: C.ink3, z: 13 });
  return { vb: '0 0 420 192', s, label: 'Continuous roll forming: the strip passes five roll stations; the cross-section changes a little at each' };
}

/** L3·S25 — a tube bent without and with a mandrel */
function mandrel() {
  const panel = (x0, ok) => {
    const cx = x0 + 70, cy = 128, R = 64, w = 13; // centreline: in from the left at y = cy - R, round the bend, down at x = cx + R
    const ro = R + w, ri = R - w;
    let inner;
    if (ok) inner = `M${x0 + 14} ${cy - ri}H${cx}${arcD(cx, cy, ri, 270, 360, '')}V188`;
    else { inner = `M${x0 + 14} ${cy - ri + 3}H${cx - 4}`; const n = 9; for (let i = 0; i <= n; i++) { const a = 270 + i * 90 / n, r = ri + 2 + (i % 2 ? 7 : -1); const p = pt(cx, cy, r, a); inner += `L${f(p[0])} ${f(p[1])}`; } inner += `L${cx + ri + 3} 188`; }
    const outer = ok ? `M${x0 + 14} ${cy - ro}H${cx}${arcD(cx, cy, ro, 270, 360, '')}V188` : `M${x0 + 14} ${cy - ro}H${cx}${arcD(cx, cy, ro - 6, 270, 360, '')}V188`;
    let s = `<path d="${outer}" stroke="${C.ink}" stroke-width="2"/><path d="${inner}" stroke="${ok ? C.ink : C.bad}" stroke-width="2"/>`;
    if (ok) {
      s += `<rect x="${x0 + 6}" y="${cy - R - 8}" width="${cx - x0 - 4}" height="16" rx="3" fill="${C.good}" fill-opacity=".22" stroke="${C.good}" stroke-width="1.4"/>`;
      [14, 32, 50].forEach(a => { const p = pt(cx, cy, R, 270 + a); s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="7.5" fill="${C.good}" fill-opacity=".22" stroke="${C.good}" stroke-width="1.4"/>`; });
      s += tx(x0 + 34, cy - R - 16, 'mandrel', { c: C.good, z: 14, w: 700 });
    } else s += tx(cx + 2, cy - 2, 'buckling', { c: C.bad, z: 14, w: 700, a: 'start' });
    // the section, seen end on
    const sx = x0 + 162, sy = 40;
    s += ok ? `<circle cx="${sx}" cy="${sy}" r="16" stroke="${C.ink}" stroke-width="2"/><circle cx="${sx}" cy="${sy}" r="9" fill="${C.good}" fill-opacity=".3" stroke="${C.good}"/>`
      : `<ellipse cx="${sx}" cy="${sy}" rx="21" ry="10" stroke="${C.bad}" stroke-width="2"/>`;
    s += tx(sx, sy + 32, 'section', { c: C.ink3, z: 12 });
    s += tx(x0 + 96, 210, ok ? 'with a mandrel' : 'without a mandrel', { c: ok ? C.good : C.bad, z: 15, w: 700 });
    return s;
  };
  return { vb: '0 0 400 218', s: panel(0, false) + panel(200, true), label: 'A tube bent without a mandrel buckles and flattens; with a mandrel inside it stays round' };
}

/** L3·S25 — formed and spot-welded wire: a basket */
function wire() {
  let s = '';
  const rings = [[90, 34, 66, 16], [90, 104, 54, 13]];
  const xs = [-1, -.66, -.33, 0, .33, .66, 1];
  xs.forEach(k => { const x1 = 90 + 66 * k, y1 = 34 + 16 * Math.sqrt(1 - k * k), x2 = 90 + 54 * k, y2 = 104 + 13 * Math.sqrt(1 - k * k); s += `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${C.ink}" stroke-width="2.4"/>`; });
  rings.forEach(([x, y, rx, ry]) => { s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="${C.ink}" stroke-width="2.8"/>`; });
  xs.forEach(k => { [[90, 34, 66, 16], [90, 104, 54, 13]].forEach(([x, y, rx, ry]) => { s += `<circle cx="${f(x + rx * k)}" cy="${f(y + ry * Math.sqrt(1 - k * k))}" r="3.2" fill="${C.hot}" stroke="none"/>`; }); });
  s += `<path d="M24 34C10 34 6 20 18 16M156 34C170 34 174 20 162 16" stroke="${C.ink}" stroke-width="2.4"/>${tx(178, 72, 'spot', { c: C.hot, z: 13, w: 600, a: 'start' })}${tx(178, 86, 'welds', { c: C.hot, z: 13, w: 600, a: 'start' })}`;
  return { vb: '0 0 220 130', s, label: 'A wire basket: formed wire with spot welds at every crossing' };
}

/** a single metal shape seen end-on, for a question */
function shapeQ() { return { vb: '0 0 200 130', s: `<g transform="translate(46 8) scale(2.3)" color="${'var(--ink)'}">${SHAPES.squareH}</g>`, label: 'A metal shape seen at an angle' }; }

/* =====================================================================================================
   SMALL ICONS (48 × 48, currentColor — grid cards colour them)
   ===================================================================================================== */
const I = inner => svg('0 0 48 48', inner);
const fillC = 'fill="currentColor" fill-opacity=".18"';
/** the eight metal stock shapes (L3·S5), drawn as short bars: front face + depth */
const SHAPES = {
  roundS: `<path d="M16 10h18M16 38h18" stroke="currentColor" stroke-width="1.6"/><ellipse cx="34" cy="24" rx="7" ry="14" stroke="currentColor" stroke-width="1.6" ${fillC}/><ellipse cx="16" cy="24" rx="7" ry="14" stroke="currentColor" stroke-width="1.6" fill="currentColor" fill-opacity=".45"/>`,
  squareS: `<path d="M8 16h22v22H8zM8 16l10-8h22l-10 8M30 16l10-8v22l-10 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path d="M8 16h22v22H8z" fill="currentColor" fill-opacity=".3"/>`,
  hexS: `<path d="M10 24l6-11h12l6 11-6 11H16zM16 13l8-6h12l-8 6M28 13l8-6 6 11-8 6M34 24l8-6M28 35l8-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path d="M10 24l6-11h12l6 11-6 11H16z" fill="currentColor" fill-opacity=".3"/>`,
  angleS: `<path d="M8 14h8v16h16v8H8zM8 14l10-8h8l-10 8M16 30l10-8h16l-10 8M32 30l10-8v8l-10 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path d="M8 14h8v16h16v8H8z" fill="currentColor" fill-opacity=".3"/><path d="M26 6v16" stroke="currentColor" stroke-width="1.6"/>`,
  roundH: `<path d="M16 10h18M16 38h18" stroke="currentColor" stroke-width="1.6"/><ellipse cx="34" cy="24" rx="7" ry="14" stroke="currentColor" stroke-width="1.6" ${fillC}/><ellipse cx="16" cy="24" rx="7" ry="14" stroke="currentColor" stroke-width="1.6" fill="currentColor" fill-opacity=".45"/><ellipse cx="16" cy="24" rx="4" ry="9" stroke="currentColor" stroke-width="1.4" fill="var(--card)"/>`,
  squareH: `<path d="M8 16h22v22H8zM8 16l10-8h22l-10 8M30 16l10-8v22l-10 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path fill-rule="evenodd" d="M8 16h22v22H8zM12 20v14h14V20z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="1.4"/>`,
  hexH: `<path d="M10 24l6-11h12l6 11-6 11H16zM16 13l8-6h12l-8 6M28 13l8-6 6 11-8 6M34 24l8-6M28 35l8-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path fill-rule="evenodd" d="M10 24l6-11h12l6 11-6 11H16zM15 24l3.5-6.5h7L29 24l-3.5 6.5h-7z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="1.4"/>`,
  angleH: `<path d="M8 14h8v16h16v8H8zM8 14l10-8h8l-10 8M16 30l10-8h16l-10 8M32 30l10-8v8l-10 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path fill-rule="evenodd" d="M8 14h8v16h16v8H8zM11 17v18h18v-2H13V17z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="1.2"/>`
};
/** what solid state forming shapes: sheet, rod, wire, tube */
const FORMS = {
  sheet: `<path d="M5 30l14-12h24L29 30z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="currentColor" fill-opacity=".2"/><path d="M5 30v3h24l14-12v-3M29 30v3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  rod: `<path d="M9 33L35 11" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-opacity=".25"/><path d="M6 30L32 8M12 36L38 14" stroke="currentColor" stroke-width="1.6"/><ellipse cx="9" cy="33" rx="3" ry="4.5" transform="rotate(40 9 33)" stroke="currentColor" stroke-width="1.6" fill="currentColor" fill-opacity=".4"/>`,
  wire: `<path d="M6 34c6 0 6-12 12-12s6 12 12 12 6-20 12-20" stroke="currentColor" stroke-width="2.4"/>`,
  tube: `<path d="M8 30L32 8M15 38L39 16" stroke="currentColor" stroke-width="1.6"/><ellipse cx="11.5" cy="34" rx="4" ry="6" transform="rotate(42 11.5 34)" stroke="currentColor" stroke-width="1.6" fill="currentColor" fill-opacity=".35"/><ellipse cx="11.5" cy="34" rx="1.8" ry="3" transform="rotate(42 11.5 34)" stroke="currentColor" stroke-width="1.2" fill="var(--card)"/>`
};
/** the seven product families of L3·S4 */
const PRODUCTS = {
  car: `<path d="M5 30v-5l5-2 6-7h14l7 7 6 2v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path d="M17 17l-3 6h20l-5-6" stroke="currentColor" stroke-width="1.3"/><circle cx="14" cy="31" r="4" stroke="currentColor" stroke-width="1.6" fill="var(--card)"/><circle cx="35" cy="31" r="4" stroke="currentColor" stroke-width="1.6" fill="var(--card)"/>`,
  plane: `<path d="M6 26h30l6-5c2-2 0-4-2-3l-6 3H22L14 9h-4l4 12H9l-3-4H3l2 9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" ${fillC}/><path d="M20 26l-6 12h4l10-12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
  train: `<path d="M8 32V14c0-3 2-5 5-5h22c3 0 5 2 5 5v18z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><path d="M12 14h24v8H12zM6 38h36M14 32l-3 6M34 32l3 6" stroke="currentColor" stroke-width="1.4"/><circle cx="15" cy="27" r="1.6" fill="currentColor"/><circle cx="33" cy="27" r="1.6" fill="currentColor"/>`,
  tractor: `<path d="M6 30v-8h14V12h10l2 10h8v8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" ${fillC}/><circle cx="14" cy="32" r="7" stroke="currentColor" stroke-width="1.6" fill="var(--card)"/><circle cx="36" cy="34" r="5" stroke="currentColor" stroke-width="1.6" fill="var(--card)"/><path d="M23 12v10" stroke="currentColor" stroke-width="1.3"/>`,
  fridge: `<rect x="13" y="5" width="22" height="38" rx="2" stroke="currentColor" stroke-width="1.6" ${fillC}/><path d="M13 18h22M17 10v4M17 23v7" stroke="currentColor" stroke-width="1.5"/>`,
  cabinet: `<rect x="12" y="5" width="24" height="38" rx="1.5" stroke="currentColor" stroke-width="1.6" ${fillC}/><path d="M12 17.5h24M12 30.5h24M21 11h6M21 24h6M21 37h6" stroke="currentColor" stroke-width="1.5"/>`,
  computer: `<rect x="7" y="8" width="22" height="16" rx="1.5" stroke="currentColor" stroke-width="1.6" ${fillC}/><path d="M18 24v6M12 31h12" stroke="currentColor" stroke-width="1.5"/><rect x="32" y="8" width="9" height="30" rx="1.5" stroke="currentColor" stroke-width="1.6" ${fillC}/><path d="M35 13h3M35 17h3" stroke="currentColor" stroke-width="1.3"/>`
};
export const ICON = {
  shape: k => I(SHAPES[k]),
  form: k => I(FORMS[k]),
  product: k => I(PRODUCTS[k]),
  op: k => svg('0 0 170 100', opDraw(k, 6, 2), OP_NAME[k])
};

/* ---------- the registry ---------- */
const FIGS = {
  'bd-states': states, 'bd-gauge': gauge, 'bd-press': press, 'bd-tree': tree,
  'bd-neutral': () => neutral(false), 'bd-neutral-q': () => neutral(true),
  'bd-flat': flat, 'bd-kf': kf, 'bd-relief': relief, 'bd-relief-q': () => ({ vb: '0 0 150 126', s: reliefPanel(4, 'ob', false), label: 'A flange bent up, with a relief cut where it stops' }),
  'bd-radius': () => radius(false), 'bd-radius-q': () => radius(true),
  'bd-vbend': vbend, 'bd-air': air, 'bd-air-q': () => ({ vb: '0 0 180 168', s: airPanel(0, 'air', false), label: 'A punch pushing a sheet into a V-die' }),
  'bd-edge': () => edge(false), 'bd-edge-q': () => edge(true), 'bd-spring': spring, 'bd-angles': angles,
  'bd-ops-flange': () => opsRow(['straight', 'stretch', 'shrink']), 'bd-ops-hem': () => opsRow(['hem', 'seam', 'curl']),
  'bd-op-straight': () => opOne('straight'), 'bd-op-stretch': () => opOne('stretch'), 'bd-op-shrink': () => opOne('shrink'),
  'bd-op-hem': () => opOne('hem'), 'bd-op-seam': () => opOne('seam'), 'bd-op-curl': () => opOne('curl'),
  'bd-roll3': roll3, 'bd-controll': contRoll, 'bd-mandrel': mandrel, 'bd-wire': wire, 'bd-shape-q': shapeQ
};
/** the same drawings as full <svg> strings (lesson art blocks, trial cards) */
export const ART = Object.fromEntries(Object.entries(FIGS).map(([k, fn]) => [k, () => { const o = fn(); return svg(o.vb, o.s, o.label); }]));
export default Object.fromEntries(Object.entries(FIGS).map(([k, fn]) => [k, () => { const o = fn(); return box(pen(o.s), o.vb, o.label); }]));
