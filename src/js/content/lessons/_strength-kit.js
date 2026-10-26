// Strength zone kit — the drawings, the stress–strain curve model and the three demos, shared by strength.js (Arabic)
// and strength.en.js (English), the trials (games/_strength-kit.js) and the question figures (data/figs/strength.js).
// Drawings carry English exam labels only, so both editions use them as they are. Colours: CSS variables only.
// The demos take their words from the lesson file that mounts them (S = strings in that edition's language).

export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)', card: 'var(--card)' };
export const f1 = n => +(+n).toFixed(1);
const P2 = p => `${f1(p[0])} ${f1(p[1])}`;
export const poly = pts => 'M' + pts.map(P2).join('L');
export const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };

/* ---------- drawing helpers ---------- */
export const svg = (vb, inner, label = '', cls = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr" role="img" aria-label="${label}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
/** a label in the drafting face (Barlow Condensed); `knock` cuts it out of the lines behind it */
export function lab(x, y, s, o = {}) {
  const { c = V.ink2, size = 14, a = 'middle', w = 600, ls = '.05em', f = 'Barlow Condensed', knock = false, extra = '' } = o;
  return `<text x="${f1(x)}" y="${f1(y)}" fill="${c}" font-family="${f}" font-size="${size}" font-weight="${w}" letter-spacing="${ls}" text-anchor="${a}"${knock ? ` stroke="${V.card}" stroke-width="6" paint-order="stroke"` : ' stroke="none"'}${extra ? ' ' + extra : ''}>${s}</text>`;
}
/** a straight force arrow with a solid head, drawn from (x1, y1) to the tip (x2, y2) */
export function arrow(x1, y1, x2, y2, o = {}) {
  const { c = V.hot, w = 2.6, h = 10 } = o;
  const a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - Math.cos(a) * h, by = y2 - Math.sin(a) * h;
  const px = Math.cos(a + Math.PI / 2) * h * .5, py = Math.sin(a + Math.PI / 2) * h * .5;
  return `<path d="M${f1(x1)} ${f1(y1)}L${f1(bx)} ${f1(by)}" stroke="${c}" stroke-width="${w}"/><path d="M${f1(x2)} ${f1(y2)}L${f1(bx + px)} ${f1(by + py)}L${f1(bx - px)} ${f1(by - py)}Z" fill="${c}" stroke="none"/>`;
}
/** a thin dimension line with heads at both ends */
export function dim(x1, y1, x2, y2, o = {}) {
  const { c = V.ink3, w = 1.3, h = 7 } = o;
  return arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, { c, w, h }) + arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, { c, w, h });
}
/** an arc arrow on an ellipse (cx, cy, rx, ry) from angle a0 to a1 (degrees, screen coordinates: 90 = down) */
export function arcArrow(cx, cy, rx, ry, a0, a1, o = {}) {
  const { c = V.hot, w = 2.4, h = 9 } = o;
  const pt = a => [cx + Math.cos(a * Math.PI / 180) * rx, cy + Math.sin(a * Math.PI / 180) * ry];
  const n = 18, pts = []; for (let i = 0; i <= n; i++) pts.push(pt(a0 + (a1 - a0) * i / n));
  const prev = pt(a1 - (a1 - a0) * .14), end = pts[n];
  return `<path d="${poly(pts.slice(0, n - 1))}" stroke="${c}" stroke-width="${w}"/>` + arrow(prev[0], prev[1], end[0], end[1], { c, w, h });
}
/** 45° hatching inside a rectangle (a fixed support, a cut section) */
export function hatchRect(x, y, w, h, gap = 7, c = V.hatch) {
  let d = '';
  for (let k = -h + gap / 2; k < w; k += gap) { const lo = Math.max(0, -k), hi = Math.min(h, w - k); if (hi > lo) d += `M${f1(x + k + lo)} ${f1(y + lo)}L${f1(x + k + hi)} ${f1(y + hi)}`; }
  return `<path d="${d}" stroke="${c}" stroke-width="1"/>`;
}

/* ---------- the stress–strain curve (strain e and stress s both 0…1; s = 1 is the ultimate tensile strength) ---------- */
/** ey/sy: the yield point (end of the straight elastic line) · eu: strain at the ultimate tensile strength (M) · ef/sf: fracture (F) */
export const CURVE = { ey: .26, sy: .8, eu: .56, ef: .96, sf: .62 };
export function stressAt(e, c = CURVE) {
  if (e <= 0) return 0;
  if (e <= c.ey) return c.sy * e / c.ey;
  if (e <= c.eu) { const t = (e - c.ey) / (c.eu - c.ey); return c.sy + (1 - c.sy) * (1 - Math.pow(1 - t, 2.2)); }
  const u = Math.min(1, (e - c.eu) / (c.ef - c.eu)); return 1 - (1 - c.sf) * Math.pow(u, 1.8);
}
export const slopeE = c => c.sy / c.ey;
/** sample the curve from 0 to strain `to` */
export function curvePts(c = CURVE, to = c.ef, n = 90) {
  const end = Math.min(to, c.ef), pts = [[0, 0]];
  if (end <= c.ey) { pts.push([end, stressAt(end, c)]); return pts; }
  pts.push([c.ey, c.sy]);
  for (let i = 1; i <= n; i++) { const e = c.ey + (end - c.ey) * i / n; pts.push([e, stressAt(e, c)]); }
  return pts;
}
/** P = the plot box { x0, y0 (the origin, bottom left), w, h } */
export const toXY = (P, e, s) => [P.x0 + e * P.w, P.y0 - s * P.h];
export const curveD = (P, c = CURVE, to = c.ef) => poly(curvePts(c, to).map(([e, s]) => toXY(P, e, s)));
/** the two axes of a plot, with their names (stress up, strain along) */
export function axes(P, o = {}) {
  const { top = P.y0 - P.h - 26, right = P.x0 + P.w + 22, names = true, c = V.ink } = o;
  const ny = (P.y0 + top) / 2;
  return arrow(P.x0, P.y0, P.x0, top, { c, w: 1.8, h: 9 }) + arrow(P.x0, P.y0, right, P.y0, { c, w: 1.8, h: 9 }) +
    (names ? lab(P.x0 - 12, ny, 'stress', { size: 14, c: V.ink2, extra: `transform="rotate(-90 ${f1(P.x0 - 12)} ${f1(ny)})"` }) + lab((P.x0 + right) / 2, P.y0 + 22, 'strain', { size: 14, c: V.ink2 }) : '');
}

/** a test specimen (dog-bone) drawn horizontally around (cx, cy) at strain e of curve c: it stretches, thins, necks, breaks */
export function specimen(cx, cy, e, c = CURVE, o = {}) {
  const { L0 = 150, k = .5, t0 = 20, grip = 30, gt = 36, op = .3 } = o;
  const ee = Math.max(0, Math.min(e, c.ef));
  const L = L0 * (1 + k * ee), half = L / 2;
  const thin = t0 * (1 - .14 * Math.min(1, ee / c.eu));
  const neck = ee > c.eu ? Math.min(1, (ee - c.eu) / (c.ef - c.eu)) : 0;
  const depth = thin / 2 * .74 * neck, sig = 9 + 16 * (1 - neck);
  const edge = (x, sgn) => cy + sgn * (thin / 2 - depth * Math.exp(-(x * x) / (2 * sig * sig)));
  const body = `fill="var(--fig-steel)" fill-opacity="${op}" stroke="${V.ink}" stroke-width="1.8"`;
  const grips = `<path d="M${f1(cx - half - grip)} ${f1(cy - gt / 2)}h${grip}v${gt}h${-grip}zM${f1(cx + half)} ${f1(cy - gt / 2)}h${grip}v${gt}h${-grip}z" fill="var(--fig-steel)" fill-opacity="${op + .16}" stroke="${V.ink}" stroke-width="1.8"/>`;
  const N = 36;
  if (e < c.ef) {
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) { const x = -half + L * i / N; top.push([cx + x, edge(x, -1)]); bot.push([cx + x, edge(x, 1)]); }
    return `<g class="str-spec">${grips}<path d="${poly(top)}L${bot.reverse().map(P2).join('L')}Z" ${body}/></g>`;
  }
  // broken at the neck: two halves, each ending in a thin, rough tip
  const gap = 5;
  const piece = sgn => {
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) { const d = (half - gap) * i / N; const x = cx + sgn * (gap + d); top.push([x, edge(d, -1)]); bot.push([x, edge(d, 1)]); }
    return `<path d="${poly(top)}L${bot.reverse().map(P2).join('L')}L${f1(cx + sgn * (gap - 2.5))} ${f1(cy)}Z" ${body}/>`;
  };
  return `<g class="str-spec">${grips}${piece(-1)}${piece(1)}</g>`;
}
/** the same specimen standing up (as on slide 9) */
export function specimenV(cx, cy, e, c, s = .44) {
  return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(-90) scale(${s})">${specimen(0, 0, e, c, { L0: 110, k: .5, t0: 22, grip: 26, gt: 38 })}</g>`;
}

/* ---------- the four loads (the L2 · S4 figure as a block that deforms); kind: tension | compression | shear | torsion ---------- */
function gridBlock(map, { cols = 4, rows = 5, op = .22 } = {}) {
  const N = 22, edge = [];
  for (let i = 0; i <= N; i++) edge.push(map(-1 + 2 * i / N, -1));
  for (let i = 1; i <= N; i++) edge.push(map(1, -1 + 2 * i / N));
  for (let i = 1; i <= N; i++) edge.push(map(1 - 2 * i / N, 1));
  for (let i = 1; i < N; i++) edge.push(map(-1, 1 - 2 * i / N));
  let g = '';
  for (let c = 1; c < cols; c++) { const u = -1 + 2 * c / cols, pts = []; for (let i = 0; i <= N; i++) pts.push(map(u, -1 + 2 * i / N)); g += `<path d="${poly(pts)}"/>`; }
  for (let r = 1; r < rows; r++) { const v = -1 + 2 * r / rows, pts = []; for (let i = 0; i <= N; i++) pts.push(map(-1 + 2 * i / N, v)); g += `<path d="${poly(pts)}"/>`; }
  return `<path d="${poly(edge)}Z" fill="var(--fig-steel)" fill-opacity="${op}" stroke="${V.ink}" stroke-width="2.2"/><g stroke="${V.ink3}" stroke-width="1">${g}</g>`;
}
/** the block under one load at amount t (0 = no load, 1 = full): inner SVG for a 240 × 244 view */
export function loadBlock(kind, t = 1, o = {}) {
  const { cx = 120, cy = 122, W = 76, H = 112 } = o;
  if (!kind) return gridBlock((u, v) => [cx + u * W / 2, cy + v * H / 2]);
  const len = 20 + 16 * t;
  if (kind === 'tension') {
    const h = H / 2 * (1 + .24 * t);
    return gridBlock((u, v) => [cx + u * W / 2 * (1 - .24 * t * (1 - v * v)), cy + v * h]) + arrow(cx, cy - h, cx, cy - h - len) + arrow(cx, cy + h, cx, cy + h + len);
  }
  if (kind === 'compression') {
    const h = H / 2 * (1 - .22 * t);
    return gridBlock((u, v) => [cx + u * W / 2 * (1 + .28 * t * (1 - v * v)), cy + v * h]) + arrow(cx, cy - h - len - 4, cx, cy - h - 3) + arrow(cx, cy + h + len + 4, cx, cy + h + 3);
  }
  if (kind === 'shear') {
    const s = 18 * t, q = H / 4;
    return gridBlock((u, v) => [cx + u * W / 2 + s, cy - q + v * (q - .6)], { rows: 3 }) + gridBlock((u, v) => [cx + u * W / 2 - s, cy + q + v * (q - .6)], { rows: 3 }) +
      `<path d="M${cx - W / 2 - 30} ${cy}H${cx + W / 2 + 30}" stroke="${V.zc}" stroke-width="1.4" stroke-dasharray="7 4"/>` +
      arrow(cx - W / 2 + s - 50, cy - q, cx - W / 2 + s - 6, cy - q) + arrow(cx + W / 2 - s + 50, cy + q, cx + W / 2 - s + 6, cy + q);
  }
  // torsion: a round bar from the side; its straight lines turn into a helix as it twists about its long axis
  const rx = W / 2, ry = 9, y0 = cy - H / 2, y1 = cy + H / 2;
  let lines = '';
  for (const k of [-.8, -.4, 0, .4, .8]) {
    const phi0 = Math.asin(k); let seg = [];
    const flush = () => { if (seg.length > 1) lines += `<path d="${poly(seg)}"/>`; seg = []; };
    for (let i = 0; i <= 30; i++) { const v = -1 + 2 * i / 30, phi = phi0 + 1.05 * t * v; if (Math.cos(phi) > 0) seg.push([cx + rx * Math.sin(phi), cy + v * H / 2 + ry * .6 * Math.cos(phi)]); else flush(); }
    flush();
  }
  const sweep = 70 + 70 * t;
  return `<path d="M${cx - rx} ${y0}V${y1}A${rx} ${ry} 0 0 0 ${cx + rx} ${y1}V${y0}" fill="var(--fig-steel)" fill-opacity=".22" stroke="${V.ink}" stroke-width="2.2"/><ellipse cx="${cx}" cy="${y0}" rx="${rx}" ry="${ry}" fill="var(--fig-steel)" fill-opacity=".34" stroke="${V.ink}" stroke-width="2.2"/>` +
    `<g stroke="${V.ink3}" stroke-width="1.1">${lines}</g>` +
    `<path d="M${cx} ${y0 - 36}V${y1 + 36}" stroke="${V.zc}" stroke-width="1.3" stroke-dasharray="10 4 2 4"/>` +
    arcArrow(cx, y0 - 18, rx + 10, 12, 200, 200 + sweep) + arcArrow(cx, y1 + 18, rx + 10, 12, 160, 160 - sweep);
}
/** small 48 × 48 icons of the four loads (currentColor), for grids and choices */
export const LOAD_ICON = {
  tension: svg('0 0 48 48', `<rect x="18" y="15" width="12" height="18" stroke="currentColor" stroke-width="1.8"/><path d="M24 15V4M24 33v11M20 8l4-4 4 4M20 40l4 4 4-4" stroke="currentColor" stroke-width="1.8"/>`),
  compression: svg('0 0 48 48', `<path d="M16 18q-3 6 0 12h16q3-6 0-12z" stroke="currentColor" stroke-width="1.8"/><path d="M24 3v12M24 45V33M20 11l4 4 4-4M20 37l4-4 4 4" stroke="currentColor" stroke-width="1.8"/>`),
  shear: svg('0 0 48 48', `<rect x="17" y="12" width="18" height="11" stroke="currentColor" stroke-width="1.8"/><rect x="11" y="25" width="18" height="11" stroke="currentColor" stroke-width="1.8"/><path d="M3 17.5h11M45 30.5H34M10 14.5l4 3-4 3M38 27.5l-4 3 4 3" stroke="currentColor" stroke-width="1.8"/>`),
  torsion: svg('0 0 48 48', `<path d="M17 12v24a7 2.5 0 0 0 14 0V12" stroke="currentColor" stroke-width="1.8"/><ellipse cx="24" cy="12" rx="7" ry="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M19.5 15l9 18" stroke="currentColor" stroke-width="1.2"/><path d="M11 9a13 4.5 0 0 1 24-2M13 40a13 4.5 0 0 0 24 0" stroke="currentColor" stroke-width="1.8"/><path d="M32 3.5l3.5 3.2-4.3 1.6M33.5 38.5l3.5 1.8-3.4 2.8" stroke="currentColor" stroke-width="1.8"/>`)
};
export const LOADS = ['tension', 'compression', 'shear', 'torsion'];
export const LOAD_SCENE = { tension: 'tension', compression: 'compression', shear: 'shearStress', torsion: 'torsion' };

/* ---------- lesson art ---------- */
/** a bar pulled by two outside forces; cut it in your head, and the inside answers back */
export const stressArt = () => {
  const y = 106, h = 40;
  const piece = (x, w) => `<rect x="${x}" y="${y - h / 2}" width="${w}" height="${h}" fill="var(--fig-steel)" fill-opacity=".26" stroke="${V.ink}" stroke-width="2.2"/>`;
  let inner = '';
  for (const yy of [y - 11, y, y + 11]) inner += arrow(238, yy, 270, yy, { c: V.zc, w: 2, h: 8 }) + arrow(330, yy, 298, yy, { c: V.zc, w: 2, h: 8 });
  return svg('0 0 560 200',
    piece(120, 158) + piece(290, 158) +
    `<path d="M284 70V142" stroke="${V.ink3}" stroke-width="1.2" stroke-dasharray="5 4"/>` +
    arrow(120, y, 42, y, { w: 3.2, h: 13 }) + arrow(448, y, 526, y, { w: 3.2, h: 13 }) + inner +
    lab(80, y - 24, 'EXTERNAL FORCE', { c: V.hot, size: 13 }) + lab(487, y - 24, 'EXTERNAL FORCE', { c: V.hot, size: 13 }) +
    lab(284, 60, 'imaginary cut', { c: V.ink3, size: 12, w: 500 }) +
    `<path d="M256 166l16-34M312 166l-16-34" stroke="${V.zt}" stroke-width="1.1"/>` +
    lab(284, 184, 'INTERNAL RESISTANCE = STRESS', { c: V.zt, size: 15 }),
    'A bar pulled by two external forces; at an imaginary cut, the internal resistance pulls back: that is stress');
};
/** the slide's figure: four blocks, four loads */
export const fourLoadsArt = () => {
  const s = .74; let g = '';
  LOADS.forEach((k, i) => { const cx = 70 + i * 140; g += `<g transform="translate(${f1(cx - 120 * s)} 2) scale(${s})">${loadBlock(k, 1)}</g>` + lab(cx, 206, k.toUpperCase(), { size: 15, c: V.zt }); });
  return svg('0 0 560 216', g, 'Four blocks: tension, compression, shear and torsion');
};
/** a pendant lamp on its cable: tension */
export const lampArt = () => svg('0 0 320 206',
  `<path d="M60 18H260" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(60, 6, 200, 12, 8) +
  `<rect x="148" y="18" width="24" height="8" fill="var(--fig-steel)" fill-opacity=".4" stroke="${V.ink}" stroke-width="1.6"/>` +
  `<path d="M160 26V128" stroke="${V.ink}" stroke-width="2.4"/>` +
  `<path d="M128 156L144 128H176L192 156Z" fill="var(--fig-steel)" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/><path d="M150 156a10 10 0 0 0 20 0" stroke="${V.zc}" stroke-width="2"/>` +
  arrow(180, 84, 180, 44, { w: 2.4 }) + arrow(180, 92, 180, 132, { w: 2.4 }) +
  lab(200, 92, 'TENSION', { a: 'start', c: V.zt, size: 15 }) + lab(160, 192, 'the weight pulls down · the ceiling holds up', { size: 12, w: 500, c: V.ink3 }),
  'A pendant lamp hangs on a cable: the cable is pulled apart, in tension');
/** a heavy crate on a stool: the legs are squeezed */
export const stoolArt = () => svg('0 0 320 210',
  `<rect x="106" y="22" width="108" height="62" fill="var(--fig-steel)" fill-opacity=".24" stroke="${V.ink}" stroke-width="2"/><path d="M106 22l108 62M214 22l-108 62" stroke="${V.ink3}" stroke-width="1"/>` +
  `<path d="M96 84H224V96H96z" fill="var(--fig-steel)" fill-opacity=".36" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M108 96l-6 76M212 96l6 76M140 96v76M180 96v76" stroke="${V.ink}" stroke-width="5"/>` +
  `<path d="M70 174H250" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(70, 174, 180, 10, 8) +
  arrow(66, 100, 66, 136, { w: 2.4 }) + arrow(66, 188, 66, 152, { w: 2.4 }) +
  lab(232, 140, 'COMPRESSION', { a: 'start', c: V.zt, size: 14 }) + lab(160, 204, 'the load pushes down · the floor pushes up', { size: 12, w: 500, c: V.ink3 }),
  'A heavy crate on a stool: the legs are squeezed, in compression');
/** a rivet in a lap joint: the two plates try to slide past each other */
export const rivetArt = () => svg('0 0 320 200',
  `<rect x="40" y="70" width="160" height="20" fill="var(--fig-steel)" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/>` +
  `<rect x="120" y="90" width="160" height="20" fill="var(--fig-steel)" fill-opacity=".16" stroke="${V.ink}" stroke-width="2"/>` +
  `<rect x="150" y="60" width="20" height="60" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/><path d="M144 60a16 9 0 0 1 32 0M144 120a16 9 0 0 0 32 0" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M116 90H206" stroke="${V.zc}" stroke-width="1.6" stroke-dasharray="6 4"/>` +
  arrow(40, 80, 6, 80, { w: 2.4 }) + arrow(280, 100, 314, 100, { w: 2.4 }) +
  lab(230, 146, 'SHEAR PLANE', { c: V.zt, size: 14 }) + `<path d="M222 134L196 94" stroke="${V.zt}" stroke-width="1.1"/>` +
  lab(160, 186, 'one plate pulled left, the other right', { size: 12, w: 500, c: V.ink3 }),
  'A rivet holds two overlapping plates pulled in opposite directions: the rivet is sheared at the plane between them');
/** a crankshaft twisted about its longitudinal axis */
export const crankArt = () => {
  const y = 100; let g = '';
  const journal = x => `<rect x="${x}" y="${y - 12}" width="40" height="24" fill="var(--fig-steel)" fill-opacity=".26" stroke="${V.ink}" stroke-width="2"/>`;
  const crankThrow = (x, up) => { const wy = up ? y - 52 : y - 14, py = up ? y - 48 : y + 26; return `<rect x="${x}" y="${wy}" width="12" height="66" fill="var(--fig-steel)" fill-opacity=".36" stroke="${V.ink}" stroke-width="2"/><rect x="${x + 36}" y="${wy}" width="12" height="66" fill="var(--fig-steel)" fill-opacity=".36" stroke="${V.ink}" stroke-width="2"/><rect x="${x + 12}" y="${py}" width="24" height="22" fill="${V.zc}" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/>`; };
  g += journal(70) + crankThrow(110, true) + journal(158) + crankThrow(198, false) + journal(246) + crankThrow(286, true) + journal(334) + crankThrow(374, false) + journal(422);
  return svg('0 0 560 214',
    `<path d="M36 ${y}H524" stroke="${V.zc}" stroke-width="1.4" stroke-dasharray="14 5 3 5"/>` + g +
    arcArrow(50, y, 15, 44, 120, 400) + arcArrow(492, y, 15, 44, 60, -220) +
    lab(50, 172, 'TORQUE', { c: V.hot, size: 13 }) + lab(492, 172, 'TORQUE', { c: V.hot, size: 13 }) +
    lab(280, 204, 'LONGITUDINAL AXIS', { c: V.zt, size: 14 }) + `<path d="M280 190V${y + 30}" stroke="${V.zt}" stroke-width="1" stroke-dasharray="2 3"/>` +
    lab(280, 26, 'CRANKSHAFT', { c: V.ink2, size: 15 }),
    'A crankshaft with a torque at each end, twisting it about its longitudinal axis');
};
/** the elastic band: before, loaded, after (back to the same length) */
export const bandArt = () => {
  const band = (x1, x2, y, h) => `<rect x="${x1}" y="${y - h / 2}" width="${x2 - x1}" height="${h}" rx="${h / 2}" fill="${V.zc}" fill-opacity=".26" stroke="${V.ink}" stroke-width="2"/><rect x="${x1 - 12}" y="${y - 16}" width="14" height="32" rx="3" fill="var(--fig-steel)" fill-opacity=".4" stroke="${V.ink}" stroke-width="1.8"/><rect x="${x2 - 2}" y="${y - 16}" width="14" height="32" rx="3" fill="var(--fig-steel)" fill-opacity=".4" stroke="${V.ink}" stroke-width="1.8"/>`;
  return svg('0 0 560 244',
    `<path d="M200 22V222M380 22V222" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="4 5"/>` +
    band(200, 380, 44, 22) + band(150, 430, 122, 15) + band(200, 380, 200, 22) +
    arrow(136, 122, 84, 122, { w: 2.6 }) + arrow(444, 122, 496, 122, { w: 2.6 }) +
    lab(28, 49, 'BEFORE', { a: 'start', size: 14 }) + lab(28, 127, 'LOADED', { a: 'start', size: 14, c: V.hot }) + lab(28, 205, 'AFTER', { a: 'start', size: 14 }) +
    lab(534, 196, 'same shape', { a: 'end', size: 13, c: V.zt }) + lab(534, 212, 'and size', { a: 'end', size: 13, c: V.zt }) + lab(290, 240, 'stress removed → it recovers', { size: 12, w: 500, c: V.ink3 }),
    'An elastic band: before, stretched under load, and after the load is removed, back to its original length');
};
/** figure 3-4 (plastic) and figure 3-3 (elastic): a pulled bar in five stages; the broken pieces tell them apart */
export function behaviorFig(kind) {
  const xc = 130, h = 26; let g = '';
  const bar = (w, d, y) => { const x0 = xc - w / 2, x1 = xc + w / 2, yt = y - h / 2, yb = y + h / 2; return `<path d="M${f1(x0)} ${yt}Q${xc} ${f1(yt + 2 * d)} ${f1(x1)} ${yt}V${yb}Q${xc} ${f1(yb - 2 * d)} ${f1(x0)} ${yb}Z" fill="${V.zc}" fill-opacity=".26" stroke="${V.ink}" stroke-width="1.8"/>`; };
  [[96, 0], [126, 3], [152, 5.5], [178, 9]].forEach(([w, d], i) => { g += bar(w, d, 50 + i * 52); });
  const y = 50 + 4 * 52, yt = y - h / 2, yb = y + h / 2;
  const sty = `fill="${V.zc}" fill-opacity=".26" stroke="${V.ink}" stroke-width="1.8"`;
  if (kind === 'plastic') {
    // the pieces keep their stretched, necked shape
    g += `<path d="M36 ${yt}Q100 ${yt + 4} 122 ${y - 3}V${y + 3}Q100 ${yb - 4} 36 ${yb}Z" ${sty}/><path d="M224 ${yt}Q160 ${yt + 4} 138 ${y - 3}V${y + 3}Q160 ${yb - 4} 224 ${yb}Z" ${sty}/>`;
  } else {
    // the pieces go back to plain blocks with a rough break
    g += `<path d="M52 ${yt}H116L111 ${yt + 6}L116 ${yt + 12}L111 ${yt + 19}L116 ${yb}H52Z" ${sty}/><path d="M208 ${yt}H144L149 ${yt + 6}L144 ${yt + 12}L149 ${yt + 19}L144 ${yb}H208Z" ${sty}/>`;
  }
  g += lab(xc, 20, kind === 'plastic' ? 'figure 3-4 · plastic behavior' : 'figure 3-3 · elastic behavior', { size: 14, c: V.zt, ls: '.03em' });
  return svg('0 0 260 284', g, kind === 'plastic' ? 'Figure 3-4, plastic behavior: the broken pieces keep their stretched, necked shape' : 'Figure 3-3, elastic behavior: the broken pieces go back to plain blocks');
}
/** the slide's stress–strain curve (L2 · S8), every label in place */
export const C8 = { ey: .26, sy: .8, eu: .56, ef: .97, sf: .62 };
export const curveArt = () => {
  const P = { x0: 134, y0: 330, w: 420, h: 248 }, c = C8;
  const Y = toXY(P, c.ey, c.sy), U = toXY(P, c.eu, 1), F = toXY(P, c.ef, c.sf);
  const midY = P.y0 - .36 * P.h;
  return svg('0 0 600 372',
    axes(P, { top: 44, right: 584 }) +
    `<g stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="5 5"><path d="M${P.x0} ${f1(Y[1])}H${f1(Y[0])}M${P.x0} ${f1(U[1])}H${f1(U[0])}M${f1(Y[0])} 40V${P.y0}M${f1(U[0])} ${f1(U[1])}V${P.y0}M${f1(F[0])} 40V${P.y0}"/></g>` +
    dim(P.x0, 40, Y[0], 40) + dim(Y[0], 40, F[0], 40) +
    lab((P.x0 + Y[0]) / 2, 30, 'Elastic Behavior', { size: 14, c: V.ink }) + lab((Y[0] + F[0]) / 2, 30, 'Plastic Behavior', { size: 14, c: V.ink }) +
    dim(P.x0, midY, U[0], midY) + dim(U[0], midY, F[0], midY) +
    lab((P.x0 + U[0]) / 2 + 34, midY + 5, 'uniform elongation', { size: 14, c: V.ink, knock: true }) + lab((U[0] + F[0]) / 2, midY + 5, 'necking', { size: 14, c: V.ink, knock: true }) +
    `<path d="${curveD(P, c)}" stroke="${V.zc}" stroke-width="3.4"/>` +
    `<circle cx="${f1(Y[0])}" cy="${f1(Y[1])}" r="5" fill="${V.zt}"/><circle cx="${f1(U[0])}" cy="${f1(U[1])}" r="5" fill="${V.zt}"/><circle cx="${f1(F[0])}" cy="${f1(F[1])}" r="5" fill="${V.zt}"/>` +
    lab(P.x0 - 10, Y[1] + 5, 'yield strength', { a: 'end', size: 14, c: V.zt }) +
    lab(P.x0 - 10, U[1] - 3, 'ultimate tensile', { a: 'end', size: 14, c: V.zt }) + lab(P.x0 - 10, U[1] + 13, 'strength', { a: 'end', size: 14, c: V.zt }) +
    lab(F[0] - 44, F[1] + 96, 'fracture', { size: 14, c: V.zt }) + arrow(F[0] - 38, F[1] + 82, F[0] - 4, F[1] + 9, { c: V.zt, w: 1.4, h: 8 }),
    'The stress–strain curve: a straight elastic part up to the yield strength, then plastic behavior up to the ultimate tensile strength; uniform elongation, then necking, then fracture');
};
/** slide 9: TS, M and F, with the specimen at four moments */
export const C9 = { ey: .045, sy: .52, eu: .58, ef: .95, sf: .7 };
export const tsmfArt = () => {
  const P = { x0: 70, y0: 330, w: 490, h: 250 }, c = C9;
  const M = toXY(P, c.eu, 1), F = toXY(P, c.ef, c.sf);
  const inset = (e, x, y) => {
    const p = toXY(P, e, stressAt(e, c)), dx = p[0] - x, dy = p[1] - y, k = 1 / Math.hypot(dx / 34, dy / 50);
    return `<ellipse cx="${x}" cy="${y}" rx="34" ry="50" stroke="${V.ink3}" stroke-width="1.2"/>` + specimenV(x, y, e, c) + `<path d="M${f1(x + dx * k)} ${f1(y + dy * k)}L${f1(p[0] - dx / Math.hypot(dx, dy) * 5)} ${f1(p[1] - dy / Math.hypot(dx, dy) * 5)}" stroke="${V.ink3}" stroke-width="1.1"/>`;
  };
  return svg('0 0 600 362',
    axes(P, { top: 50, right: 586 }) +
    `<path d="M${P.x0} ${f1(M[1])}H${f1(M[0])}" stroke="${V.ink3}" stroke-width="1.4" stroke-dasharray="7 5"/>` +
    inset(.012, 132, 262) + inset(.32, 236, 196) + inset(.8, 372, 200) + inset(.951, 506, 256) +
    `<path d="${curveD(P, c)}" stroke="${V.zc}" stroke-width="3.2"/>` +
    `<circle cx="${f1(M[0])}" cy="${f1(M[1])}" r="5.5" fill="${V.zt}"/><circle cx="${f1(F[0])}" cy="${f1(F[1])}" r="5.5" fill="${V.zt}"/>` +
    lab(P.x0 - 10, M[1] + 6, 'TS', { a: 'end', size: 17, c: V.zt, w: 700 }) + lab(M[0], M[1] - 14, 'M', { size: 17, c: V.zt, w: 700 }) + lab(F[0] + 12, F[1] - 6, 'F', { a: 'start', size: 17, c: V.zt, w: 700 }) +
    lab(372, 270, '“Necking”', { size: 15, c: V.hot }),
    'Slide 9: the curve rises to TS at point M; after M the specimen necks, and it fractures at F');
};
/** below the yield strength the ruler springs back; past it, it stays bent */
export function yieldArt(past) {
  const y = 64;
  const fixed = `<rect x="14" y="${y - 34}" width="34" height="68" fill="var(--fig-steel)" fill-opacity=".2" stroke="${V.ink}" stroke-width="1.8"/>` + hatchRect(14, y - 34, 34, 68, 7);
  const ghost = `<path d="M48 ${y}Q150 ${y + 8} 236 ${y + 74}" stroke="${V.ink3}" stroke-width="5" stroke-dasharray="3 7"/>`;
  const now = past ? `<path d="M48 ${y}Q150 ${y + 4} 240 ${y + 40}" stroke="${V.ink}" stroke-width="5"/>` : `<path d="M48 ${y}H246" stroke="${V.ink}" stroke-width="5"/>`;
  return svg('0 0 260 170', fixed + ghost + now + arrow(214, y - 34, 214, y + 22) +
    lab(130, 160, past ? 'load off → it stays bent' : 'load off → it springs back', { size: 14, c: past ? V.hot : V.zt }),
    past ? 'Bent past the yield strength, the ruler stays bent after the load is removed' : 'Bent below the yield strength, the ruler springs back straight');
}
/** a specimen before and after the test: L0 = 50 mm → L = 60 mm */
export const elongationArt = () => {
  const bar = (x1, x2, y) => `<path d="M${x1 - 34} ${y - 18}h34v36h-34zM${x2} ${y - 18}h34v36h-34z" fill="var(--fig-steel)" fill-opacity=".42" stroke="${V.ink}" stroke-width="1.8"/><rect x="${x1}" y="${y - 10}" width="${x2 - x1}" height="20" fill="var(--fig-steel)" fill-opacity=".26" stroke="${V.ink}" stroke-width="1.8"/>`;
  const mark = (x, y) => `<path d="M${x} ${y - 16}V${y + 16}" stroke="${V.zt}" stroke-width="2.2"/>`;
  const a = 170, b0 = 370, b1 = 410;
  return svg('0 0 600 244',
    `<rect x="${b0}" y="150" width="${b1 - b0}" height="36" fill="${V.zc}" fill-opacity=".3" stroke="none"/>` +
    bar(a - 40, b0 + 40, 56) + mark(a, 56) + mark(b0, 56) + dim(a, 90, b0, 90) + lab((a + b0) / 2, 110, 'L0 = 50 mm  (original length)', { size: 14, c: V.ink }) +
    bar(a - 40, b1 + 48, 168) + mark(a, 168) + mark(b1, 168) + dim(a, 202, b1, 202) + lab((a + b1) / 2, 222, 'L = 60 mm  (after the test)', { size: 14, c: V.ink }) +
    `<path d="M${b0} 76V186" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="4 4"/>` + lab((b0 + b1) / 2, 142, '+10 mm', { size: 14, c: V.zt }) +
    arrow(90, 168, 54, 168, { w: 2.2 }) + arrow(498, 168, 534, 168, { w: 2.2 }),
    'A specimen with gauge marks 50 mm apart before the test and 60 mm apart after it: an increase of 10 mm');
};

/* ---------- demos ---------- */
/** "Pick a load": the block deforms the way the slide's figure shows. S = { aria, idle, names: {k: [name, sub]}, long?: {k: readout name}, lines: {k: text} } */
export function loadPicker(S) {
  return (el, api) => {
    let cur = null, raf = 0; const seen = new Set();
    el.innerHTML = `<div class="str-lp"><div class="str-lp__fig">${svg('0 0 240 244', loadBlock(null), S.aria)}</div><div class="str-lp__side"><div class="str-seg" role="radiogroup" aria-label="${S.aria}">${LOADS.map((k, i) => `<button type="button" role="radio" aria-checked="false" data-k="${k}"><span class="str-seg__t">${S.names[k][0]}<small dir="ltr">${S.names[k][1]}</small></span><kbd class="str-seg__k" aria-hidden="true">${i + 1}</kbd></button>`).join('')}</div><p class="str-read" aria-live="polite"><b>${S.idle}</b><small></small></p></div></div>`;
    const fig = el.querySelector('.str-lp__fig'), read = el.querySelector('.str-read'), btns = [...el.querySelectorAll('[data-k]')];
    const draw = t => { fig.innerHTML = svg('0 0 240 244', loadBlock(cur, t), S.names[cur]?.[1] || S.aria); };
    const pick = k => {
      cur = k; cancelAnimationFrame(raf);
      btns.forEach(b => b.setAttribute('aria-checked', String(b.dataset.k === k)));
      read.querySelector('b').innerHTML = S.long?.[k] || S.names[k][0]; read.querySelector('small').innerHTML = S.lines[k];
      api.sfx('click'); api.scene(LOAD_SCENE[k]);
      if (reduced()) draw(1);
      else { const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / 650); draw(1 - Math.pow(1 - t, 3)); if (t < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
      seen.add(k); if (seen.size === 4) api.award(5, { from: read, key: 'demo:st-loads' });
    };
    btns.forEach(b => b.addEventListener('click', () => pick(b.dataset.k)));
    const onKey = e => { const n = '1234'.indexOf(e.key); if (n >= 0 && el.contains(document.activeElement)) { e.preventDefault(); btns[n].focus(); pick(LOADS[n]); } };
    el.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('keydown', onKey); };
  };
}

/** "Ride the curve": load the specimen along the curve, then let go.
 *  S = { aria, strain, release, reset, regions: { start, elastic, yield, uniform, uts, necking, fracture: [b, small] }, back: { elastic, plastic, broken: [b, small] } } */
export function curveRider(S) {
  return (el, api) => {
    const c = C8, P = { x0: 46, y0: 232, w: 300, h: 196 }, E = slopeE(c);
    const Y = toXY(P, c.ey, c.sy), U = toXY(P, c.eu, 1);
    const SPEC = { L0: 170, k: .42, t0: 22, grip: 30, gt: 38 };
    let e = 0, raf = 0, region = '', scene = ''; const did = new Set();
    el.innerHTML = `<div class="str-cr"><div class="str-cr__fig"><svg viewBox="0 0 380 360" fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr" role="img" aria-label="${S.aria}">
      ${axes(P, { top: 22, right: 370 })}
      <path d="M${P.x0} ${f1(Y[1])}H${f1(Y[0])}V${P.y0}M${P.x0} ${f1(U[1])}H${f1(U[0])}V${P.y0}" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="4 5"/>
      ${lab(Y[0] + 8, Y[1] + 18, 'yield strength', { a: 'start', size: 12, c: V.ink3, w: 500 })}${lab(P.x0 + 6, U[1] - 7, 'ultimate tensile strength', { a: 'start', size: 12, c: V.ink3, w: 500 })}
      <path d="${curveD(P, c)}" stroke="${V.ink3}" stroke-width="2" opacity=".5"/>
      <path class="str-cr__trace" d="" stroke="${V.zc}" stroke-width="3.6"/>
      <path class="str-cr__back" d="" stroke="${V.zt}" stroke-width="2.2" stroke-dasharray="7 5"/>
      <circle class="str-cr__dot" r="7" fill="${V.zc}" stroke="${V.ink}" stroke-width="1.6"/>
      <g class="str-cr__spec"></g>
    </svg></div>
    <div class="str-cr__side"><label class="str-range"><span class="label">${S.strain}</span><span class="hud-num str-cr__v">0</span><input type="range" min="0" max="100" value="0" aria-label="${S.strain}"></label>
      <div class="str-cr__btns"><button type="button" class="btn btn--zone btn--sm str-cr__rel">${S.release}</button><button type="button" class="btn btn--sm str-cr__reset">${S.reset}</button></div>
      <p class="str-read" aria-live="polite"><b></b><small></small></p></div></div>`;
    const $ = s => el.querySelector(s);
    const range = $('input'), trace = $('.str-cr__trace'), back = $('.str-cr__back'), dot = $('.str-cr__dot'), spec = $('.str-cr__spec'), read = $('.str-read'), rel = $('.str-cr__rel');
    const setScene = n => { if (n !== scene) { scene = n; api.scene(n); } };
    const say = ([b, s]) => { read.querySelector('b').innerHTML = b; read.querySelector('small').innerHTML = s; };
    const regionOf = x => x >= c.ef ? 'fracture' : Math.abs(x - c.ey) < .018 ? 'yield' : x < c.ey ? 'elastic' : Math.abs(x - c.eu) < .02 ? 'uts' : x < c.eu ? 'uniform' : 'necking';
    const putDot = p => { dot.setAttribute('cx', f1(p[0])); dot.setAttribute('cy', f1(p[1])); };
    const paint = ee => {
      const x = Math.min(ee, c.ef);
      trace.setAttribute('d', ee > 0 ? curveD(P, c, x) : '');
      putDot(toXY(P, x, stressAt(x, c)));
      spec.innerHTML = specimen(196, 312, ee, c, SPEC);
      $('.str-cr__v').textContent = Math.round(Math.min(ee, 1) * 100);
    };
    const onInput = () => {
      cancelAnimationFrame(raf); back.setAttribute('d', ''); rel.disabled = false;
      e = range.value / 100; paint(e);
      const r = e <= 0 ? 'start' : regionOf(e); if (r !== region) { region = r; say(S.regions[r]); }
      setScene(e >= c.eu ? 'necking' : 'curve');
    };
    const release = () => {
      if (e <= 0) return;
      cancelAnimationFrame(raf);
      if (e >= c.ef) { say(S.back.broken); api.sfx('boop'); return; }
      const s = stressAt(e, c), eRes = e <= c.ey ? 0 : Math.max(0, e - s / E), plastic = eRes > 0;
      const from = toXY(P, e, s), to = toXY(P, eRes, 0);
      if (plastic) back.setAttribute('d', `M${P2(from)}L${P2(to)}`);
      if (reduced()) { putDot(to); spec.innerHTML = specimen(196, 312, eRes, c, SPEC); }
      else { const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / 700), k = 1 - Math.pow(1 - t, 3); putDot([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]); spec.innerHTML = specimen(196, 312, e + (eRes - e) * k, c, SPEC); if (t < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
      say(plastic ? S.back.plastic : S.back.elastic);
      setScene(plastic ? 'plastic' : 'elastic'); api.sfx(plastic ? 'swoosh' : 'pop');
      did.add(plastic ? 'p' : 'e'); if (did.size === 2) api.award(5, { from: read, key: 'demo:st-curve' });
      rel.disabled = true; region = '';
    };
    range.addEventListener('input', onInput);
    rel.addEventListener('click', release);
    $('.str-cr__reset').addEventListener('click', () => { range.value = 0; onInput(); api.sfx('click'); });
    paint(0); say(S.regions.start); region = 'start';
    return () => cancelAnimationFrame(raf);
  };
}

/** "Stretch and measure": percent elongation from the definition. S = { aria, len, goal, hit(g, L), wrongBase(L, pct) } */
export function stretchMeter(S) {
  return (el, api) => {
    const L0 = 50, goals = [10, 20, 50]; let L = 50; const hit = new Set();
    el.innerHTML = `<div class="str-sm"><div class="str-sm__fig"></div><div class="str-sm__side">
      <label class="str-range"><span class="label">${S.len}</span><span class="hud-num str-sm__L">50 mm</span><input type="range" min="50" max="80" step="1" value="50" aria-label="${S.len}"></label>
      <p class="str-sm__math" dir="ltr">(<b class="hud-num str-sm__l">50</b> − 50) ÷ 50 × 100 = <b class="hud-num str-sm__p">0%</b></p>
      <p class="str-sm__wrong"></p>
      <p class="label str-sm__glabel">${S.goal}</p><div class="str-sm__goals">${goals.map(g => `<span class="chip" data-g="${g}"><span class="hud-num">${g}%</span></span>`).join('')}</div>
      <p class="str-read" aria-live="polite"><b></b><small></small></p></div></div>`;
    const $ = s => el.querySelector(s);
    const range = $('input'), read = $('.str-read');
    const draw = () => {
      const x0 = 70, px = 3.8, x1 = x0 + L0 * px, x2 = x0 + L * px, y = 66;
      $('.str-sm__fig').innerHTML = svg('0 0 460 140',
        `<path d="M${x0 - 46} ${y - 20}h40v40h-40zM${f1(x2 + 14)} ${y - 20}h40v40h-40z" fill="var(--fig-steel)" fill-opacity=".42" stroke="${V.ink}" stroke-width="1.8"/>` +
        `<rect x="${x0 - 6}" y="${y - 11}" width="${f1(x2 - x0 + 20)}" height="22" fill="var(--fig-steel)" fill-opacity=".26" stroke="${V.ink}" stroke-width="1.8"/>` +
        (L > L0 ? `<rect x="${x1}" y="${y - 11}" width="${f1(x2 - x1)}" height="22" fill="${V.zc}" fill-opacity=".4" stroke="none"/>` : '') +
        `<path d="M${x0} ${y - 18}V${y + 18}M${f1(x2)} ${y - 18}V${y + 18}" stroke="${V.zt}" stroke-width="2.2"/><path d="M${x1} ${y + 14}V${y + 42}" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="3 4"/>` +
        dim(x0, y + 36, x1, y + 36) + lab((x0 + x1) / 2, y + 60, 'L0 = 50 mm', { size: 14, c: V.ink }) +
        (L > L0 ? lab(f1((x1 + x2) / 2), y - 24, '+' + (L - L0) + ' mm', { size: 14, c: V.zt }) : '') +
        arrow(x0 - 52, y, x0 - 66, y, { w: 2, h: 8 }) + (L > L0 ? arrow(x2 + 60, y, x2 + 62 + Math.min(20, 6 + (L - L0)), y, { w: 2, h: 8 }) : ''),
        S.aria);
      const pct = (L - L0) / L0 * 100, wrong = (L - L0) / L * 100;
      $('.str-sm__L').textContent = L + ' mm'; $('.str-sm__l').textContent = L; $('.str-sm__p').textContent = (Math.round(pct * 10) / 10) + '%';
      $('.str-sm__wrong').textContent = L > L0 ? S.wrongBase(L, Math.round(wrong * 10) / 10) : '';
      const g = goals.find(x => Math.abs(x - pct) < .01);
      if (g && !hit.has(g)) {
        hit.add(g); const chip = $(`[data-g="${g}"]`); chip.classList.add('chip--good'); api.sfx('good'); api.ring(chip, 'var(--good)');
        read.querySelector('b').innerHTML = S.hit(g, L);
        if (hit.size === goals.length) api.award(5, { from: chip, key: 'demo:st-stretch' });
      }
    };
    range.addEventListener('input', () => { L = +range.value; draw(); });
    draw();
  };
}
