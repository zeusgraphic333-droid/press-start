// Immersive scenes — bend (names and captions: info.js · SCENES_BY_ZONE.bend; what to draw: docs/SCENES.md; how: STYLE.md).
// Lecture 3, simple bending. Sheets are drawn in section (front face) with an oblique back face so they read as plates;
// tools are steel prisms. The ram clock does the work: 7 = punch, 10 = the bent state (ram down), 11 = flat (ram up).
import { build, C, k, mix, inside, reg } from './kit.js';

const PI = Math.PI, V = C.violet;
/* ---------------- local helpers ---------------- */
/** turtle path: start (x, y) heading a (rad); cmds: ['L', len] | ['A', radius, turn (rad, + = left)] → [[x, y], …] */
function path(x, y, a, cmds, step = .035) {
  const pts = [[x, y]];
  for (const [kind, p, q] of cmds) {
    if (kind === 'L') { const m = Math.max(1, Math.ceil(p / step)); for (let i = 1; i <= m; i++) pts.push([x + Math.cos(a) * p * i / m, y + Math.sin(a) * p * i / m]); x += Math.cos(a) * p; y += Math.sin(a) * p; }
    else { const sg = Math.sign(q) || 1, cx = x + Math.cos(a + sg * PI / 2) * p, cy = y + Math.sin(a + sg * PI / 2) * p, a0 = Math.atan2(y - cy, x - cx), m = Math.max(2, Math.ceil(Math.abs(q) * p / step)); for (let i = 1; i <= m; i++) { const t = a0 + q * i / m; pts.push([cx + Math.cos(t) * p, cy + Math.sin(t) * p]); } x = cx + Math.cos(a0 + q) * p; y = cy + Math.sin(a0 + q) * p; a += q; }
  }
  return pts;
}
/** arc-length sampler for a polyline → at(d) = [x, y, nx, ny] (n = left normal), total length T */
function walker(pts) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] || 1e-6;
  const at = d => { d = Math.max(0, Math.min(T, d)); let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= d) lo = m; else hi = m; } const A = pts[lo], B = pts[hi], l = (L[hi] - L[lo]) || 1e-6, t = (d - L[lo]) / l; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, -(B[1] - A[1]) / l, (B[0] - A[0]) / l]; };
  return { at, T };
}
/** a sheet in section along a path, th thick. col: colour, or (s, u, edge) → colour; s = −1 (right of travel) … +1 (left), u = 0…1 along */
function band(P, n, pts, th, col, { g = 0, pv, edge = .45, j = .007, caps = .04 } = {}) {
  const { at, T } = walker(pts); const cf = typeof col === 'function' ? col : (s, u, e) => e ? mix(col, C.white, .12) : k(col, .55);
  const nc = Math.round(n * caps);
  for (let q = 0; q < n - nc; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, s = e ? (P.r() < .5 ? -1 : 1) : P.r() * 2 - 1, h = s * th / 2; P.pt(x + nx * h + P.g() * j, y + ny * h + P.g() * j, P.g() * j, cf(s, d / T, e), g, pv); }
  for (let q = 0; q < nc; q++) { const d = q % 2 ? T : 0, [x, y, nx, ny] = at(d), s = P.r() * 2 - 1, h = s * th / 2; P.pt(x + nx * h, y + ny * h, P.g() * j, cf(s, d / T, true), g, pv); }
}
const DS = { ox: .34, oy: .2, oz: -.55 };   // the oblique depth of sheets and tools
/** the visible face of a sheet in oblique 3D: the surface on `side` (±1) swept back by D; col(u, w, edge) w = 0 front … 1 back */
function face(P, n, pts, th, side, col, { D = DS, g = 0, pv, edge = .3 } = {}) {
  const { at, T } = walker(pts); const cf = typeof col === 'function' ? col : (u, w, e) => e ? k(col, .7) : k(col, .3);
  for (let q = 0; q < n; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, w = e ? 1 : P.r(), h = side * th / 2; P.pt(x + nx * h + D.ox * w + P.g() * .006, y + ny * h + D.oy * w + P.g() * .006, D.oz * w, cf(d / T, w, e), g, pv); }
}
/** a sheet: section + its upper face (side = which side faces up/back) */
function sheet(P, n, pts, th, col, o = {}) { const { side = 1, f = .3 } = o; band(P, n * (1 - f), pts, th, col, o); face(P, n * f, pts, th, side, o.fcol || (typeof col === 'function' ? k(V, .3) : col), o); }
/** dashed line along a path: dashes `on` long every `per` (in arc length) */
function dash(P, n, pts, c, { on = .1, per = .17, j = .009, g = 0, pv, off = 0, z = 0 } = {}) {
  const { at, T } = walker(pts); let q = 0, tries = 0;
  while (q < n && tries++ < n * 8) { const d = P.r() * T; if (((d + off) % per) > on) continue; const [x, y] = at(d); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); q++; }
}
/** polyline (closed by default) at depth z */
function oline(P, n, pts, c, { z = 0, closed = true, j = .009, g = 0, pv } = {}) {
  const ps = closed ? [...pts, pts[0]] : pts; const { at, T } = walker(ps);
  for (let q = 0; q < n; q++) { const [x, y] = at(P.r() * T); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); }
}
/** a tool block: polygon front face (dim fill + bright outline), extruded back (dim back outline + corner edges) */
function prism(P, n, pts, c, { D = DS, g = 0, pv, f = .36, fill = .5, back = .34 } = {}) {
  P.poly(Math.round(n * fill), pts, k(c, f), g, pv);
  oline(P, Math.round(n * (1 - fill) * .62), pts, c, { g, pv });
  oline(P, Math.round(n * (1 - fill) * .26), pts.map(([x, y]) => [x + D.ox, y + D.oy]), k(c, back), { z: D.oz, g, pv });
  const m = Math.round(n * (1 - fill) * .12 / pts.length);
  pts.forEach(([x, y]) => { for (let q = 0; q < m; q++) { const t = P.r(); P.pt(x + D.ox * t, y + D.oy * t, D.oz * t, k(c, back), g, pv); } });
}
/** an arrow along an arc (centre cx, cy, radius r) from angle a0 to a1, head at a1 */
function carrow(P, n, cx, cy, r, a0, a1, c, { g = 0, head = .16 } = {}) {
  P.arc(Math.round(n * .72), cx, cy, r, Math.min(a0, a1), Math.max(a0, a1), c, .012, g);
  const x = cx + Math.cos(a1) * r, y = cy + Math.sin(a1) * r, dir = a1 > a0 ? a1 + PI / 2 : a1 - PI / 2;
  [dir + PI - .5, dir + PI + .5].forEach(b => P.seg(Math.round(n * .14), x, y, x + Math.cos(b) * head, y + Math.sin(b) * head, c, .01, g));
}
/** a glow: a soft cloud of points (contact, heat) */
function glow(P, n, x, y, r, c, g = 0, sy = 1) { for (let q = 0; q < n; q++) { const a = P.r() * PI * 2, d = Math.pow(P.r(), 1.8) * r; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d * sy, P.g() * .05, mix(c, C.white, Math.max(0, .6 - d / r)), g); } }
/** a smooth roll that turns about Z: rim, inner ring, spokes, hub (group 6) */
function roll(P, n, cx, cy, R, c, speed, { spokes = 3, z = 0 } = {}) {
  const pv = [cx, cy, z, speed], g = 6;
  P.arc(Math.round(n * .36), cx, cy, R, 0, PI * 2, c, .012, g, pv);
  for (let q = 0; q < n * .22; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * R * .97; P.pt(cx + Math.cos(a) * d, cy + Math.sin(a) * d, z + P.g() * .02, k(c, .16), g, pv); }
  P.arc(Math.round(n * .12), cx, cy, R * .7, 0, PI * 2, k(c, .5), .01, g, pv);
  for (let s = 0; s < spokes; s++) { const a = s / spokes * PI * 2 + .3; P.seg(Math.round(n * .22 / spokes), cx + Math.cos(a) * R * .16, cy + Math.sin(a) * R * .16, cx + Math.cos(a) * R * .7, cy + Math.sin(a) * R * .7, k(c, .85), .012, g, pv); }
  P.arc(Math.round(n * .08), cx, cy, R * .14, 0, PI * 2, C.chalk, .008, g, pv);
}
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
/** draw the rest of the scene s× bigger about the origin, then offset (pivots follow). Not for scenes with a ram stroke to fit. */
/** two passes: count what the drawing places, then draw again scaled so the subject fills `t` of its budget */
const fit = (draw, t = .97) => (P, n) => { const pt0 = P.pt; let c = 0; P.pt = () => { c++; }; draw(P, n); P.pt = pt0; draw(P, n * Math.min(4, t * n / Math.max(1, c))); };
function zoom(P, s, ox = 0, oy = 0) { const pt = P.pt; P.pt = (x, y, z, c, g, pv) => pt(x * s + ox, y * s + oy, z * s, c, g, pv ? [pv[0] * s + ox, pv[1] * s + oy, pv[2] * s, pv[3]] : pv); }
const arrowDown = (P, n, x, y1, y2, c, g = 0) => P.arrow(n, x, y1, x, y2, c, .2, g);

/* ---------------- the scenes ---------------- */
export default N => {
  const B = (seed, draw, fill) => () => build(N, seed, fit(draw), fill);
  return {
  /* the forming tree: liquid (poured) · fluid (dashed, as on the slide) · plastic (a hot billet squeezed) · solid (cold sheet bent) */
  formingStates: B(702, (P, n) => {
    const X = [-2.85, -.95, .95, 2.85];
    // the tree header
    P.rect(n * .03, -1.15, 1.72, 2.3, .46, k(C.chalk, .2)); P.box(n * .025, -1.15, 1.72, 2.3, .46, C.chalk);
    P.seg(n * .008, 0, 1.72, 0, 1.4, k(C.chalk, .7)); P.seg(n * .025, X[0], 1.4, X[3], 1.4, k(C.chalk, .7));
    X.forEach((x, i) => { if (i === 1) dash(P, n * .006, [[x, 1.4], [x, 1.0]], k(C.chalk, .7), { on: .05, per: .1 }); else P.seg(n * .006, x, 1.4, x, 1.0, k(C.chalk, .7)); });
    // liquid: a ladle pours, the mould fills, embers rise
    { const x = X[0], rot = -.75, cx = x - .3, cy = .35, R = (u, v) => [cx + u * Math.cos(rot) - v * Math.sin(rot), cy + u * Math.sin(rot) + v * Math.cos(rot)];
      P.line(n * .035, [[-.46, .5], [-.35, -.42], [.35, -.42], [.46, .5]].map(([u, v]) => R(u, v)), C.steel, .012);
      P.poly(n * .045, [[-.4, .18], [-.33, -.38], [.33, -.38], [.42, .34]].map(([u, v]) => R(u, v)), k(C.orange, .65));
      const lip = R(.46, .5); P.line(n * .035, [lip, [lip[0] + .14, lip[1] - .25], [lip[0] + .2, lip[1] - .7], [lip[0] + .22, -1.05]], C.yellow, .03);
      const mx = lip[0] + .22;
      prism(P, n * .06, [[mx - .65, -2.05], [mx + .65, -2.05], [mx + .65, -1.05], [mx + .35, -1.05], [mx + .35, -1.8], [mx - .35, -1.8], [mx - .35, -1.05], [mx - .65, -1.05]], C.steel);
      P.rect(n * .05, mx - .33, -1.78, .66, .45, k(C.hot, .9)); P.seg(n * .012, mx - .33, -1.33, mx + .33, -1.33, C.yellow, .012);
      P.sparks(n * .025, mx, -1.2, .2, C.orange); }
    // fluid: a dashed shape, the way the slide draws that branch
    { const x = X[1], tip = Array.from({ length: 50 }, (_, q) => { const a = PI + q / 49 * PI; return [x + Math.cos(a) * .6, -.85 + Math.sin(a) * .6]; });
      dash(P, n * .035, [...tip, [x + .33, -.15], [x, .6], [x - .33, -.15], [x - .6, -.85]], k(C.chalk, .8), { on: .07, per: .14 });
      dash(P, n * .012, [[x - .28, -.8], [x, -.5], [x + .28, -.8]], k(C.chalk, .4), { on: .05, per: .11 }); }
    // plastic: a hot billet squeezed by a ram (11 tall billet · 10 squashed, barrelled)
    { const x = X[2];
      prism(P, n * .05, rectP(x - .7, -2.1, 1.4, .6), C.steel);
      P.poly(n * .05, rectP(x - .27, -1.5, .54, 1.0), k(C.orange, .8), 11); P.box(n * .015, x - .27, -1.5, .54, 1.0, C.yellow, .012, 11);
      const sq = Array.from({ length: 40 }, (_, q) => { const t = q / 39; return [x + .42 + .12 * Math.sin(t * PI), -1.5 + t * .5]; });
      const bar = [...sq, ...sq.slice().reverse().map(([px, py]) => [2 * x - px, py])];
      P.poly(n * .05, bar, k(C.hot, .9), 10); P.outline(n * .015, bar, C.yellow, .012, 10);
      prism(P, n * .05, rectP(x - .6, -1.0, 1.2, .5), C.alu, { g: 7 }); P.rect(n * .014, x - .12, -.5, .24, 1.0, k(C.steel, .55), 7);
      glow(P, n * .014, x, -1.0, .35, C.orange, 10, .4); }
    // solid: a cold sheet bent in a V-die (11 flat · 10 bent)
    { const x = X[3];
      prism(P, n * .06, [[x - .8, -2.1], [x + .8, -2.1], [x + .8, -1.3], [x + .42, -1.3], [x, -1.72], [x - .42, -1.3], [x - .8, -1.3]], C.steel);
      sheet(P, n * .035, path(x - .85, -1.265, 0, [['L', 1.7]]), .07, V, { g: 11 });
      sheet(P, n * .035, path(x - .63, -1.08, -PI / 4, [['L', .8], ['A', .06, PI / 2], ['L', .8]]), .07, V, { g: 10 });
      prism(P, n * .04, [[x, -1.64], [x + .2, -1.44], [x + .2, -.4], [x - .2, -.4], [x - .2, -1.44]], C.alu, { g: 7 });
      glow(P, n * .012, x, -1.66, .2, C.yellow, 10); }
  }),

  /* foil · sheet · plate: three slabs on one thickness scale (0.15 mm and 6.35 mm are the borders); a cursor runs thin → thick */
  sheetGauge: B(703, (P, n) => {
    const y0 = -.3, slab = (cx, th, c, m, wav = 0) => {
      const w = 1.9, D = { ox: .6, oy: .42, oz: -1.0 }, x0 = cx - w / 2 - .3, yy = x => y0 + wav * Math.sin((x - x0) * 9);
      for (let q = 0; q < m * .4; q++) { const x = x0 + P.r() * w, y = yy(x) + P.r() * th; P.pt(x, y, P.g() * .01, k(c, .5), 0); }
      for (let q = 0; q < m * .34; q++) { const x = x0 + P.r() * w, t = P.r(); P.pt(x + D.ox * t, yy(x) + th + D.oy * t, D.oz * t, k(c, .3), 0); }
      for (let q = 0; q < m * .1; q++) { const t = P.r(), y = y0 + P.r() * th; P.pt(x0 + w + D.ox * t, y + D.oy * t, D.oz * t, k(c, .4), 0); }
      [[0, th], [0, 0]].forEach(([o]) => { for (let q = 0; q < m * .06; q++) { const x = x0 + P.r() * w; P.pt(x, yy(x) + th - o * 0, .01, c, 0); } });
      for (let q = 0; q < m * .05; q++) { const x = x0 + P.r() * w; P.pt(x + D.ox, yy(x) + th + D.oy, D.oz, k(c, .7), 0); }
      for (let q = 0; q < m * .05; q++) { const t = P.r(); P.pt(x0 + w + D.ox * t, yy(x0 + w) + th + D.oy * t, D.oz * t, c, 0); }
    };
    slab(-2.45, .028, C.alu, n * .2, .045);
    slab(0, .2, V, n * .25);
    slab(2.45, .72, mix(C.plum, C.steel, .4), n * .3);
    // the scale: a wedge growing thin → thick, two borders, their numbers
    const wy = -1.25, wedge = [[-3.4, wy], [3.4, wy], [3.4, wy + .34]];
    P.poly(n * .05, wedge, k(C.chalk, .3)); P.outline(n * .03, wedge, k(C.chalk, .8));
    [-1.22, 1.22].forEach(x => P.seg(n * .012, x, wy - .2, x, wy + .5, C.orange, .01));
    P.text(n * .045, '0.15', '800 200px "Big Shoulders Display"', .95, C.orange, null, false, wy - .58, -1.22);
    P.text(n * .045, '6.35', '800 200px "Big Shoulders Display"', .95, C.orange, null, false, wy - .58, 1.22);
    // the cursor riding the scale (conveyor)
    for (let q = 0; q < n * .03; q++) { const t = P.r(); P.pt(-4.4 + P.g() * .03, wy - .05 + t * .5, P.g() * .02, mix(C.yellow, C.white, t), 9); }
    glow(P, n * .015, -4.4, wy + .12, .12, C.yellow, 9);
  }, .64),

  /* the eight stock shapes: solid (top) and hollow (bottom), short bars turning in place */
  stockShapes: B(704, (P, n) => {
    const circ = (r, m = 44) => Array.from({ length: m }, (_, q) => [Math.cos(q / m * PI * 2) * r, Math.sin(q / m * PI * 2) * r]);
    const sq = r => [[-r, -r], [r, -r], [r, r], [-r, r]];
    const hex = r => reg(6, r, 0);
    const L = (a, b) => [[-a, -a], [a, -a], [a, -a + b], [-a + b, -a + b], [-a + b, a], [-a, a]];
    const shapes = [[circ(.42), null, 1], [sq(.38), null], [hex(.45), null], [L(.42, .26), null], [circ(.42), circ(.29), 1], [sq(.38), sq(.26)], [hex(.45), hex(.31)], [L(.42, .34), L(.34, .18).map(([x, y]) => [x - .0, y - .0])]];
    const d = .62; zoom(P, 1.12, 0, -.05);
    shapes.forEach(([out, inn, smooth], i) => {
      const cx = -2.4 + (i % 4) * 1.6, cy = i < 4 ? .88 : -1.02, ph = i * .7, spin = [cx, cy, 0, .38], m = n * .118;
      const put = (x, y, z, c) => { const ca = Math.cos(ph), sa = Math.sin(ph); P.pt(cx + x * ca + z * sa, cy + y, -x * sa + z * ca, c, 0, spin); };
      const c = i < 4 ? V : mix(V, C.ice, .35);
      // front cap (fill), its outlines, back outline, length edges
      const [x0, y0, x1, y1] = [-.5, -.5, .5, .5];
      let q = 0, tries = 0; while (q < m * .3 && tries++ < m * 30) { const x = x0 + P.r() * (x1 - x0), y = y0 + P.r() * (y1 - y0); if (inside(out, x, y) && !(inn && inside(inn, x, y))) { put(x, y, d, k(c, .42)); q++; } }
      const edge = (poly, z, cc, mm) => { const { at, T } = walker([...poly, poly[0]]); for (let w = 0; w < mm; w++) { const [x, y] = at(P.r() * T); put(x + P.g() * .006, y + P.g() * .006, z, cc); } };
      edge(out, d, C.chalk, m * .16); edge(out, -d, k(c, .55), m * .1);
      if (inn) { edge(inn, d, C.chalk, m * .12); edge(inn, -d, k(c, .4), m * .06); }
      if (smooth) { for (let w = 0; w < m * .2; w++) { const a = P.r() * PI * 2, z = -d + P.r() * 2 * d; put(Math.cos(a) * .42, Math.sin(a) * .42, z, k(c, .3 + .25 * Math.max(0, Math.sin(a + ph)))); } }
      else out.forEach(([x, y]) => { for (let w = 0; w < m * .2 / out.length; w++) put(x, y, -d + P.r() * 2 * d, k(c, .7)); });
      if (inn && !smooth) inn.forEach(([x, y]) => { for (let w = 0; w < m * .05 / inn.length; w++) put(x, y, -d + P.r() * 2 * d, k(c, .45)); });
    });
  }, .66),

  /* solid state forming: three branches standing on cost pedestals that rise — simple · compound · form & cut (stamping) */
  solidTree: B(705, (P, n) => {
    P.rect(n * .03, -1.3, 1.78, 2.6, .46, k(V, .3)); P.box(n * .025, -1.3, 1.78, 2.6, .46, C.chalk);
    P.seg(n * .008, 0, 1.78, 0, 1.45, k(C.chalk, .7)); P.seg(n * .03, -2.6, 1.45, 2.6, 1.45, k(C.chalk, .7));
    const X = [-2.6, 0, 2.6], tops = [-1.3, -.8, -.3], cols = [C.amber, C.orange, C.hot];
    X.forEach((x, i) => {
      P.seg(n * .008, x, 1.45, x, 1.15, k(C.chalk, .7)); dash(P, n * .01, [[x, 1.1], [x, tops[i] + 1.2]], k(C.chalk, .3), { on: .05, per: .12 });
      prism(P, n * .09, rectP(x - .75, -2.3, 1.5, tops[i] + 2.3), cols[i], { f: .3 });
    });
    // simple bending: an L bracket bending in a small brake
    { const x = X[0], y = tops[0];
      sheet(P, n * .05, path(x - .6, y + .12, 0, [['L', .8], ['A', .1, PI / 2], ['L', .7]]), .09, V, { g: 10 });
      sheet(P, n * .05, path(x - .6, y + .12, 0, [['L', 1.6]]), .09, V, { g: 11 });
      prism(P, n * .03, [[x + .32, y + .2], [x + .52, y + .2], [x + .52, y + 1.05], [x + .32, y + 1.05]], C.alu, { g: 7 });
    }
    // compound bending: a spun cup
    P.lathe(n * .09, [[0, 0], [.46, 0], [.5, .06], [.5, .78], [.6, .82]], C.blue, { cx: 0, cy: tops[1] + .15, tilt: .5 });
    // form & cut: a punch, a die and the stamping it makes
    { const x = X[2], y = tops[2];
      prism(P, n * .035, [[x - .65, y], [x + .65, y], [x + .65, y + .35], [x + .32, y + .35], [x + .32, y + .12], [x - .32, y + .12], [x - .32, y + .35], [x - .65, y + .35]], C.steel);
      sheet(P, n * .02, path(x - .6, y + .38, 0, [['L', 1.2]]), .05, C.chalk, { g: 11 });
      sheet(P, n * .02, path(x - .6, y + .38, 0, [['L', .26], ['A', .04, -PI / 2], ['L', .17], ['A', .04, PI / 2], ['L', .5], ['A', .04, PI / 2], ['L', .17], ['A', .04, -PI / 2], ['L', .26]]), .05, C.yellow, { g: 10 });
      prism(P, n * .03, rectP(x - .28, y + .17, .56, .95), C.alu, { g: 7 }); glow(P, n * .01, x, y + .2, .3, C.orange, 10, .4);
    }
  }),

  /* stamping terms: a stamping press (frame), punch-and-die (tooling), stampings (the parts) — the blank drops through the die */
  stamping: B(706, (P, n) => {
    const X0 = -.5, S = C.steel2;
    // the stamping press (dim: the machine around the tools)
    prism(P, n * .06, rectP(X0 - 2.55, -2.15, .45, 4.1), S, { f: .22 }); prism(P, n * .06, rectP(X0 + 2.1, -2.15, .45, 4.1), S, { f: .22 });
    prism(P, n * .06, rectP(X0 - 2.75, 1.45, 5.5, .6), S, { f: .22 });
    prism(P, n * .04, rectP(X0 - 2.75, -2.15, 2.2, .6), S, { f: .22 }); prism(P, n * .04, rectP(X0 + .55, -2.15, 2.2, .6), S, { f: .22 });
    // the ram and the punch (drawn down, at the cut)
    prism(P, n * .06, rectP(X0 - 1.6, .25, 3.2, .6), C.steel, { g: 7 }); P.rect(n * .02, X0 - .16, .85, .32, .6, k(C.steel, .55), 7);
    prism(P, n * .08, rectP(X0 - .42, -.86, .84, 1.11), C.alu, { g: 7, f: .5 });
    arrowDown(P, n * .02, X0, 1.3, .95, C.orange, 7);
    // the die on the bolster (a hole through both, for the blank to fall)
    prism(P, n * .06, rectP(X0 - 1.4, -1.55, .95, .72), C.steel, { f: .45 }); prism(P, n * .06, rectP(X0 + .45, -1.55, .95, .72), C.steel, { f: .45 });
    // the strip: holes downstream, the disc still in place while the punch is up
    const SC = mix(V, C.chalk, .3);
    sheet(P, n * .07, path(-3.5, -.8, 0, [['L', X0 - .45 + 3.5]]), .06, SC); sheet(P, n * .07, path(X0 + .45, -.8, 0, [['L', 3.4 - X0 - .45]]), .06, SC);
    sheet(P, n * .015, path(X0 - .45, -.8, 0, [['L', .9]]), .06, SC, { g: 11 });
    [1.05, 2.1, 3.15].forEach(dx => { if (X0 + dx < 3.2) for (let q = 0; q < n * .01; q++) { const a = P.r() * PI * 2; P.pt(X0 + dx + Math.cos(a) * .4 + DS.ox * .5, -.77 + DS.oy * .5 + Math.sin(a) * .09, -.27, C.chalk, 0); } });
    // the stamping: pushed through the die (10); next it is falling below (11); the made ones stack in the tray
    const blank = (y, g, c) => { for (let q = 0; q < n * .035; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()); P.pt(X0 + Math.cos(a) * .4 * d, y + Math.sin(a) * .1 * d, P.g() * .02, d > .85 ? C.white : c, g); } };
    blank(-.96, 10, mix(C.yellow, C.white, .25)); blank(-1.95, 11, k(C.yellow, .85));
    glow(P, n * .018, X0, -.8, .6, C.orange, 10, .25);
    prism(P, n * .04, [[X0 + 2.85, -2.2], [X0 + 3.95, -2.2], [X0 + 4.05, -1.55], [X0 + 2.75, -1.55]], C.steel2, { f: .25 });
    for (let sI = 0; sI < 6; sI++) for (let q = 0; q < n * .009; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()); P.pt(X0 + 3.4 + Math.cos(a) * .4 * d + (sI % 2) * .04, -2.0 + sI * .08 + Math.sin(a) * .08 * d, 0, d > .85 ? C.white : k(C.yellow, .8), 0); }
  }),

  /* ★ the neutral axis: a thick sheet bends and straightens (ram clock: 10 = bent, 11 = flat). Outside stretches (hot,
     fibres spreading), inside squeezes (blue, fibres bunching); the dashed neutral axis keeps every dash: same length. */
  neutralAxis: B(701, (P, n) => {
    // an arch: travel left → right turning right, so s = +1 (left of travel) is the OUTSIDE (top), s = −1 the inside
    const th = .86, Rn = 1.38, Ri = Rn - th / 2, Ro = Rn + th / 2, Lb = Rn * PI / 2, leg = 2.3, y0 = .92;
    const D = { ox: .55, oy: .32, oz: -.8 };
    const strain = (s, inZone, e) => {
      if (!inZone) return e ? mix(V, C.chalk, .3) : k(V, .38);
      const a = Math.min(1, Math.abs(s) * 1.2), c = s > 0 ? mix(V, mix(C.hot, C.orange, a * .5), a) : mix(V, C.blue, a);
      return e ? mix(c, C.white, .2) : k(c, .45 + .55 * a);
    };
    const cx = 0, cy = y0 - Rn, a0 = 3 * PI / 4;
    const sx = cx + Math.cos(a0) * Rn - Math.cos(PI / 4) * leg, sy = cy + Math.sin(a0) * Rn - Math.sin(PI / 4) * leg;
    const bent = path(sx, sy, PI / 4, [['L', leg], ['A', Rn, -PI / 2], ['L', leg]]);
    const Lt = 2 * leg + Lb, z0 = leg / Lt, z1 = (leg + Lb) / Lt, inZ = u => u > z0 && u < z1;
    const flat = path(-Lt / 2, y0, 0, [['L', Lt]]);
    // bent (10): front section with the strain colours + the outer face swept back, hot over the bend
    band(P, n * .27, bent, th, (s, u, e) => strain(s, inZ(u), e), { g: 10, edge: .34 });
    face(P, n * .15, bent, th, 1, (u, w, e) => inZ(u) ? (e ? k(C.orange, .8) : k(mix(C.yellow, C.hot, w), .75 - .35 * w)) : (e ? k(V, .6) : k(V, .26)), { D, g: 10 });
    face(P, n * .03, bent, th, -1, (u, w, e) => k(inZ(u) ? C.blue : V, e ? .55 : .18), { D, g: 10, edge: .6 });
    // flat (11): the same length, unstressed
    band(P, n * .19, flat, th, (s, u, e) => e ? mix(V, C.chalk, .3) : k(V, .36), { g: 11, edge: .34 });
    face(P, n * .1, flat, th, 1, (u, w, e) => e ? k(V, .6) : k(V, .26), { D, g: 11 });
    // the neutral axis: the same dashes over the same length in both states — it neither stretches nor squeezes
    const per = Lb / 9;
    dash(P, n * .05, bent, C.white, { on: per * .5, per, g: 10 });
    dash(P, n * .05, flat, C.white, { on: per * .5, per, g: 11 });
    // fibres across the thickness in the bend zone: radial when bent (spread outside, bunched inside), parallel when flat
    for (let q = 0; q <= 9; q++) {
      const a = a0 - q / 9 * PI / 2, edge = q === 0 || q === 9, c = edge ? C.chalk : k(C.chalk, .5), m = n * (edge ? .007 : .0045);
      P.seg(m, cx + Math.cos(a) * Ri, cy + Math.sin(a) * Ri, cx + Math.cos(a) * Ro, cy + Math.sin(a) * Ro, c, .007, 10);
      const x = -Lb / 2 + q / 9 * Lb; P.seg(m, x, y0 - th / 2, x, y0 + th / 2, c, .007, 11);
    }
    // what each side feels: tension pulls apart along the outside, compression pushes together on the inside
    const ro = Ro + .62, ri = Ri - .3;
    carrow(P, n * .016, cx, cy, ro, PI / 2 + .08, PI / 2 + .6, C.orange, { g: 10, head: .2 });
    carrow(P, n * .016, cx, cy, ro, PI / 2 - .08, PI / 2 - .6, C.orange, { g: 10, head: .2 });
    carrow(P, n * .009, cx, cy, ri, PI / 2 + 1.05, PI / 2 + .3, k(C.ice, .85), { g: 10, head: .12 });
    carrow(P, n * .009, cx, cy, ri, PI / 2 - 1.05, PI / 2 - .3, k(C.ice, .85), { g: 10, head: .12 });
    // a faint ghost of the flat sheet stays while it is bent (the axis is just as long)
    dash(P, n * .012, flat, k(V, .4), { on: .04, per: .09, g: 10 });
  }, .7),

  /* Lt = A + B + BA: the L unfolds into its flat length (10 bent · 11 flat); the bend zone is the hot segment */
  flatLength: B(707, (P, n) => {
    zoom(P, 1.3, .53, .29);
    const th = .3, Rn = .45, Lb = Rn * PI / 2, A = 1.8, B = 2.0, xa = -.6, ya = -.55, yb = ya - Rn;
    const seg = u => u < A / (A + Lb + B) ? 0 : u < (A + Lb) / (A + Lb + B) ? 1 : 2;
    const col = (s, u, e) => { const z = seg(u), c = z === 1 ? C.orange : z === 0 ? V : mix(V, C.ice, .45); return e ? mix(c, C.white, .15) : k(c, .45); };
    const bent = path(xa, ya + A, -PI / 2, [['L', A], ['A', Rn, PI / 2], ['L', B]]);
    const flat = path(xa + Rn - Lb - A, yb, 0, [['L', A + Lb + B]]);
    sheet(P, n * .2, bent, th, col, { g: 10, side: -1, fcol: k(V, .4) });
    sheet(P, n * .2, flat, th, col, { g: 11, fcol: k(V, .4) });
    // dimensions: bent — A up the leg (to the tangent), B along the base; flat — A | BA | B in a row, and the whole Lt
    const dim = (x1, y1, x2, y2, c, g) => { P.seg(n * .012, x1, y1, x2, y2, c, .006, g); const a = Math.atan2(y2 - y1, x2 - x1) + PI / 2; [[x1, y1], [x2, y2]].forEach(([x, y]) => P.seg(n * .0025, x - Math.cos(a) * .1, y - Math.sin(a) * .1, x + Math.cos(a) * .1, y + Math.sin(a) * .1, c, .005, g)); };
    dim(xa - .5, ya, xa - .5, ya + A, k(C.chalk, .8), 10); dim(xa + Rn, yb - .45, xa + Rn + B, yb - .45, k(C.chalk, .8), 10);
    const x0 = xa + Rn - Lb - A, y = yb - .45;
    dim(x0, y, x0 + A, y, k(C.chalk, .8), 11); dim(x0 + A, y, x0 + A + Lb, y, C.orange, 11); dim(x0 + A + Lb, y, x0 + A + Lb + B, y, k(C.chalk, .8), 11);
    dim(x0, y - .32, x0 + A + Lb + B, y - .32, C.white, 11);
    // BD: the outside faces run on to a virtual sharp corner (the deduction is measured from there)
    dash(P, n * .01, [[xa - th / 2, ya], [xa - th / 2, yb - th / 2]], k(C.yellow, .7), { on: .04, per: .08, g: 10 });
    dash(P, n * .01, [[xa + Rn, yb - th / 2], [xa - th / 2, yb - th / 2]], k(C.yellow, .7), { on: .04, per: .08, g: 10 });
    glow(P, n * .012, xa - th / 2, yb - th / 2, .13, C.yellow, 10);
  }),

  /* K = t / T: a thick bend section; the neutral axis slides through the thickness (bob) and a gauge reads where it sits */
  kFactor: B(708, (P, n) => {
    const ox = 0, oy = -12, Ri = 11, T = 2.45, Ro = Ri + T, Kd = .3, th0 = PI / 2 - .225, th1 = PI / 2 + .225;
    const polar = (r, a) => [ox + Math.cos(a) * r, oy + Math.sin(a) * r];
    for (let q = 0; q < n * .3; q++) { const a = th0 + P.r() * (th1 - th0), r = Ri + P.r() * T, [x, y] = polar(r, a); P.pt(x, y, P.g() * .02, k(mix(V, C.blue, .15), .3), 0); }
    for (let l = 1; l < 8; l++) P.arc(n * .01, ox, oy, Ri + T * l / 8, th0, th1, k(V, .45), .006);
    P.arc(n * .06, ox, oy, Ri, th0, th1, C.ice, .01); P.arc(n * .06, ox, oy, Ro, th0, th1, mix(C.orange, C.chalk, .3), .01);
    [th0, th1].forEach(a => { const [x1, y1] = polar(Ri, a), [x2, y2] = polar(Ro, a); P.seg(n * .02, x1, y1, x2, y2, k(C.chalk, .7), .01); });
    // the neutral axis (bob: it slides up and down through the thickness)
    const Rn = Ri + Kd * T;
    for (let q = 0; q < n * .07; q++) { const a = th0 + P.r() * (th1 - th0); if (((a - th0) * Rn) % .2 > .12) { q--; continue; } const [x, y] = polar(Rn, a); P.pt(x + P.g() * .01, y + P.g() * .01, 0, C.white, 5); }
    for (let q = 0; q < n * .03; q++) { const a = th0 + P.r() * (th1 - th0), [x, y] = polar(Rn, a); P.pt(x, y + P.g() * .05, 0, k(C.yellow, .35), 5); }
    // T: the whole thickness, at the left end
    const [lx1, ly1] = polar(Ri, th1), [lx2, ly2] = polar(Ro, th1), bx = lx1 - .45;
    P.arrow(n * .015, bx, (ly1 + ly2) / 2, bx, ly2, C.chalk, .14); P.arrow(n * .015, bx, (ly1 + ly2) / 2, bx, ly1, C.chalk, .14);
    P.text(n * .02, 'T', '800 200px "Big Shoulders Display"', .26, C.chalk, null, false, (ly1 + ly2) / 2, bx - .32);
    // the gauge at the right end: 0 at the inside surface, 1 at the outside; the slider rides with the axis
    const [gx1, gy1] = polar(Ri, th0), [gx2, gy2] = polar(Ro, th0), gx = gx1 + .55;
    P.seg(n * .02, gx, gy1, gx, gy2, k(C.chalk, .8), .008);
    for (let t = 0; t <= 4; t++) { const y = gy1 + (gy2 - gy1) * t / 4; P.seg(n * .004, gx, y, gx + (t % 2 ? .12 : .22), y, k(C.chalk, .8), .006); }
    const sy = gy1 + (gy2 - gy1) * Kd; P.poly(n * .015, [[gx - .06, sy], [gx - .32, sy + .14], [gx - .32, sy - .14]], C.orange, 5);
    P.text(n * .018, 't', '800 200px "Big Shoulders Display"', .14, C.orange, null, false, sy + .02, gx + .45, 5);
    P.text(n * .07, 'K = t / T', '800 200px "Big Shoulders Display"', 2.5, C.chalk, V, false, 2.0, 0);
  }),

  /* bend relief: three corners, the flange folding (10) past a relief cut — tear-rip (a slit) · obround · rectangle */
  relief: B(709, (P, n) => {
    [-2.42, 0, 2.42].forEach((cx, i) => {
      const xr = cx - .34, rw = i === 0 ? 0 : .34, rd = .52, yb = .38, xL = cx - 1.05, xR = cx + 1.05, yB = -1.75;
      let cut = [[xr, yb], [xr, yb - rd]];
      if (i === 2) cut = [[xr, yb], [xr, yb - rd], [xr - rw, yb - rd], [xr - rw, yb]];
      if (i === 1) cut = [[xr, yb], ...Array.from({ length: 16 }, (_, q) => { const a = q / 15 * PI; return [xr - rw / 2 + Math.cos(a) * rw / 2, yb - rd + rw / 2 - Math.sin(a) * rw / 2]; }), [xr - rw, yb]];
      const base = i === 0 ? [[xL, yB], [xR, yB], [xR, yb], [xL, yb]] : [[xL, yB], [xR, yB], [xR, yb], ...cut, [xL, yb]];
      P.poly(n * .1, base, k(V, .34)); P.outline(n * .045, base, mix(V, C.chalk, .4));
      // the flange: flat above the bend line (11), folded back along it (10)
      const fl = [[xr, yb], [xR, yb], [xR, yb + .8], [xr, yb + .8]];
      P.poly(n * .045, fl, k(V, .34), 11); P.outline(n * .025, fl, mix(V, C.chalk, .4), .012, 11);
      for (let q = 0; q < n * .06; q++) { const u = xr + P.r() * (xR - xr), w = P.r(); P.pt(u + w * .62, yb + w * .38, -w * .85, k(V, .26 + .16 * (1 - w)), 10); }
      oline(P, n * .03, [[xr, yb], [xr + .62, yb + .38], [xR + .62, yb + .38], [xR, yb]], mix(V, C.chalk, .5), { closed: false, g: 10 });
      dash(P, n * .01, [[xr, yb], [xR, yb]], C.chalk, { on: .05, per: .1 });
      // the relief cut, drawn bright
      P.line(n * (i === 0 ? .025 : .04), cut, C.white, .008);
      if (i === 0) for (let t = 0; t < 4; t++) P.seg(n * .002, xr, yb - .1 - t * .11, xr + (t % 2 ? .05 : -.05), yb - .15 - t * .11, C.yellow, .005);
      glow(P, n * .005, xr - rw / 2, yb - rd * .55, .26, C.orange, 0, 1.6);
    });
  }),

  /* bend radius: a generous inside radius R bends clean; a too-tight one cracks the outside (embers from the crack) */
  bendRadius: B(710, (P, n) => {
    const th = .32; zoom(P, 1.15, 0, -.5);
    const arch = (cx, y0, Rn, leg, col) => { const a0 = 3 * PI / 4, ccy = y0 - Rn; const sx = cx + Math.cos(a0) * Rn - Math.cos(PI / 4) * leg, sy = ccy + Math.sin(a0) * Rn - Math.sin(PI / 4) * leg; const p = path(sx, sy, PI / 4, [['L', leg], ['A', Rn, -PI / 2], ['L', leg]]); sheet(P, n * .3, p, th, col, { f: .35 }); return ccy; };
    const cy1 = arch(-1.75, .9, .78, 1.45, V);
    P.arrow(n * .02, -1.75, cy1, -1.75, cy1 + .78 - th / 2 - .02, C.chalk, .13); glow(P, n * .005, -1.75, cy1, .06, C.chalk);
    P.text(n * .02, 'R', '800 200px "Big Shoulders Display"', .22, C.chalk, null, false, cy1 + .28, -1.42);
    const cy2 = arch(1.75, .9, .19, 1.55, mix(V, C.red, .25));
    // cracks across the outside of the tight bend
    [-.28, 0, .3].forEach((a, q) => { const ax = 1.75 + Math.sin(a) * (.19 + th / 2), ay = cy2 + Math.cos(a) * (.19 + th / 2); P.line(n * .012, [[ax, ay], [ax - .03 + q * .01, ay - .08], [ax + .03, ay - .15], [ax, ay - .22]], C.white, .006); });
    glow(P, n * .03, 1.75, cy2 + .33, .4, C.hot, 0, .6);
    P.sparks(n * .03, 1.75, cy2 + .4, .16, C.orange);
  }),

  /* V-bending on a press brake: the punch drives the sheet into the V-die (10 bent · 11 flat) */
  vBend: B(711, (P, n) => {
    const S = C.steel;
    prism(P, n * .16, [[-2.15, -2.1], [2.15, -2.1], [2.15, -.5], [.6, -.5], [0, -1.1], [-.6, -.5], [-2.15, -.5]], S);
    sheet(P, n * .11, path(-2.0, -.455, 0, [['L', 4.0]]), .09, V, { g: 11 });
    sheet(P, n * .11, path(-1.428, .393, -PI / 4, [['L', 1.92], ['A', .1, PI / 2], ['L', 1.92]]), .09, V, { g: 10 });
    prism(P, n * .11, [[0, -.965], [.4, -.565], [.4, 1.3], [-.4, 1.3], [-.4, -.565]], C.alu, { g: 7, f: .42 });
    prism(P, n * .08, rectP(-1.15, 1.3, 2.3, .55), S, { g: 7 });
    arrowDown(P, n * .025, 0, 2.55, 1.95, C.orange, 7);
    glow(P, n * .022, 0, -.98, .3, C.yellow, 10); glow(P, n * .012, -.6, -.5, .16, C.orange, 10); glow(P, n * .012, .6, -.5, .16, C.orange, 10);
    // the brake's long bed under the die (it is a long machine)
    oline(P, n * .02, [[-2.7, -2.1], [2.7, -2.1], [2.7 + DS.ox, -2.1 + DS.oy]], k(S, .5), { closed: false });
  }),

  /* air bending (the punch stops above the bottom, air under the sheet) vs bottoming (pressed into the V) */
  airBend: B(712, (P, n) => {
    const S = C.steel;
    // air bending, left
    { const x = -1.92;
      prism(P, n * .09, [[x - 1.4, -2.0], [x + 1.4, -2.0], [x + 1.4, -.6], [x + .75, -.6], [x, -1.35], [x - .75, -.6], [x - 1.4, -.6]], S);
      sheet(P, n * .055, path(x - 1.5, -.56, 0, [['L', 3.0]]), .08, V, { g: 11 });
      sheet(P, n * .055, path(x - 1.305, -.2335, -PI / 6, [['L', 1.42], ['A', .15, PI / 3], ['L', 1.42]]), .08, V, { g: 10 });
      prism(P, n * .06, [[x, -.94], [x + .25, -.51], [x + .25, 1.0], [x - .25, 1.0], [x - .25, -.51]], C.alu, { g: 7, f: .42 });
      P.poly(n * .03, [[x - .68, -.64], [x, -1.0], [x + .68, -.64], [x, -1.3]], k(C.water, .35), 10);
      for (let q = 0; q < 3; q++) P.arc(n * .004, x - .25 + q * .25, -1.12, .07, 0, PI, k(C.water, .8), .006, 10);
      [[x, -.96], [x - .75, -.6], [x + .75, -.6]].forEach(([gx, gy]) => glow(P, n * .01, gx, gy, .16, C.orange, 10));
    }
    // bottoming, right
    { const x = 1.92;
      prism(P, n * .09, [[x - 1.4, -2.0], [x + 1.4, -2.0], [x + 1.4, -.6], [x + .55, -.6], [x, -1.15], [x - .55, -.6], [x - 1.4, -.6]], S);
      sheet(P, n * .055, path(x - 1.5, -.56, 0, [['L', 3.0]]), .08, V, { g: 11 });
      sheet(P, n * .055, path(x - 1.0726, -.0205, -PI / 4, [['L', 1.437], ['A', .08, PI / 2], ['L', 1.437]]), .08, V, { g: 10 });
      prism(P, n * .06, [[x, -1.036], [x + .3, -.736], [x + .3, 1.0], [x - .3, 1.0], [x - .3, -.736]], C.alu, { g: 7, f: .42 });
      P.seg(n * .015, x - .55, -.62, x, -1.13, C.orange, .02, 10); P.seg(n * .015, x + .55, -.62, x, -1.13, C.orange, .02, 10);
      glow(P, n * .012, x, -1.08, .2, C.yellow, 10);
    }
    prism(P, n * .06, rectP(-3.25, 1.0, 6.5, .45), S, { g: 7 });
    arrowDown(P, n * .02, 0, 2.2, 1.55, C.orange, 7);
  }),

  /* edge bending: the pressure pad clamps the sheet on the die, the punch wipes the edge down (10 bent · 11 flat) */
  edgeBend: B(713, (P, n) => {
    zoom(P, 1, .85, 0);
    const S = C.steel, corner = Array.from({ length: 8 }, (_, q) => { const a = q / 7 * PI / 2; return [-.12 + Math.cos(a) * .12, -.55 + Math.sin(a) * .12]; });
    prism(P, n * .13, [[-2.8, -2.0], [0, -2.0], [0, -.55], ...corner.slice(1, -1), [-.12, -.43], [-2.8, -.43]], S);
    sheet(P, n * .07, path(-2.8, -.385, 0, [['L', 3.35]]), .09, V, { g: 11 });
    sheet(P, n * .07, path(-2.8, -.385, 0, [['L', 2.68], ['A', .165, -PI / 2], ['L', .42]]), .09, V, { g: 10 });
    prism(P, n * .1, rectP(-2.35, -.34, 2.28, .9), mix(C.steel, V, .35));
    arrowDown(P, n * .025, -1.2, 1.35, .68, C.orange);
    P.text(n * .018, 'Fh', '800 200px "Big Shoulders Display"', .3, C.orange, null, false, 1.05, -.88);
    prism(P, n * .1, rectP(.1, -.9, .85, 2.15), C.alu, { g: 7 });
    arrowDown(P, n * .025, .52, 2.05, 1.38, C.orange, 7);
    P.text(n * .015, 'F', '800 200px "Big Shoulders Display"', .14, C.orange, null, false, 1.75, .78, 7);
    glow(P, n * .02, -.02, -.47, .22, C.yellow, 10); P.seg(n * .012, .055, -.55, .055, -.95, C.orange, .015, 10);
  }),

  /* springback: in the tool it takes the tool's angle (10); when the punch lifts it opens a little (11) — angle and radius grow */
  springback: B(714, (P, n) => {
    const S = C.steel;
    prism(P, n * .15, [[-2.15, -2.1], [2.15, -2.1], [2.15, -.5], [.65, -.5], [0, -1.15], [-.65, -.5], [-2.15, -.5]], S);
    const tool = path(-1.357, .272, -PI / 4, [['L', 1.82], ['A', .1, PI / 2], ['L', 1.82]]);
    const free = path(-1.553, .211, -.6283, [['L', 1.774], ['A', .2, 1.2566], ['L', 1.774]]);
    sheet(P, n * .11, tool, .09, V, { g: 10 });
    sheet(P, n * .11, free, .09, mix(V, C.orange, .3), { g: 11 });
    dash(P, n * .025, tool, k(C.chalk, .5), { on: .05, per: .1 });
    // the included angle: the tool's (10) and the larger one after springback (11)
    P.arc(n * .022, 0, -.99, .62, PI / 4, 3 * PI / 4, C.ice, .01, 10);
    P.arc(n * .025, 0, -.87, .7, .6283, PI - .6283, C.orange, .01, 11);
    prism(P, n * .1, [[0, -1.02], [.38, -.64], [.38, 1.3], [-.38, 1.3], [-.38, -.64]], C.alu, { g: 7, f: .42 });
    prism(P, n * .07, rectP(-1.1, 1.3, 2.2, .55), S, { g: 7 });
    arrowDown(P, n * .022, 0, 2.55, 1.95, C.orange, 7);
    glow(P, n * .016, 0, -1.03, .22, C.yellow, 10);
  }),

  /* straight · stretch · shrink flanging: the flange folds down (10) along a straight, a concave and a convex edge */
  flanging: B(715, (P, n) => {
    const edges = [u => 0, u => .5 * (1 - u * u / .9), u => -.42 * (1 - u * u / .9)];
    const fc = [mix(V, C.chalk, .15), C.hot, C.blue];
    [-2.4, .02, 2.2].forEach((cx, i) => {
      const cy = -.05, e = edges[i], W = 1.1, o = (u, v, w) => [cx + u + w * .45, cy + v + w * .3, -w * .7];
      const put = (u, v, w, c, g = 0) => { const [x, y, z] = o(u, v, w); P.pt(x + P.g() * .006, y + P.g() * .006, z, c, g); };
      // the top face and its outline
      for (let q = 0; q < n * .06; q++) { const u = -.95 + P.r() * 1.9, w = e(u) + P.r() * (W - e(u)); put(u, 0, w, k(V, .2 + .2 * (1 - (w - e(u)) / (W - e(u))))); }
      for (let q = 0; q < n * .02; q++) { const u = -.95 + P.r() * 1.9; put(u, 0, W, k(V, .4)); put(-.95, 0, e(-.95) + P.r() * (W - e(-.95)), k(V, .4)); put(.95, 0, e(.95) + P.r() * (W - e(.95)), k(V, .4)); }
      for (let q = 0; q < n * .035; q++) { const u = -.95 + P.r() * 1.9; put(u, 0, e(u), mix(V, C.chalk, .6)); }
      // the flange: hanging down (10) or still flat in front (11)
      const h = .66;
      for (let q = 0; q < n * .07; q++) { const u = -.95 + P.r() * 1.9, v = -P.r() * h; put(u, v, e(u), k(fc[i], .55), 10); }
      for (let q = 0; q < n * .03; q++) { const u = -.95 + P.r() * 1.9, wr = i === 2 ? .04 * Math.sin(u * 26) : 0; put(u, -h + wr, e(u), mix(fc[i], C.white, .3), 10); }
      for (let q = 0; q < n * .015; q++) { const v = -P.r() * h; put(-.95, v, e(-.95), fc[i], 10); put(.95, v, e(.95), fc[i], 10); }
      for (let q = 0; q < n * .05; q++) { const u = -.95 + P.r() * 1.9, sI = P.r() * h; put(u, 0, e(u) - sI, k(V, .34), 11); }
      for (let q = 0; q < n * .02; q++) { const u = -.95 + P.r() * 1.9; put(u, 0, e(u) - h, k(V, .85), 11); }
      // stretch: the free edge pulled longer (ticks spreading) · shrink: it wrinkles
      if (i === 1) for (let t = 0; t < 5; t++) { const u = -.72 + t * .36; for (let q = 0; q < n * .003; q++) { const sI = P.r() * .22; put(u + (u > 0 ? sI : -sI) * .35, -h - .07 - sI * .1, e(u), C.orange, 10); } }
    });
  }),

  /* hemming (folded flat on itself) · seaming (two edges locked) · curling (rolled into a tube): flat (11) → formed (10) */
  hemming: B(716, (P, n) => {
    // three rows, each the full width: hem (top) · seam (middle) · curl (bottom)
    const th = .26, c2 = mix(V, C.ice, .55);
    { const cy = 1.5, x0 = -2.2;
      sheet(P, n * .12, path(x0, cy, 0, [['L', 2.3], ['A', .23, PI], ['L', 1.5]]), th, V, { g: 10 });
      sheet(P, n * .12, path(x0, cy, 0, [['L', 2.3 + .23 * PI + 1.5]]), th, V, { g: 11 });
      glow(P, n * .02, x0 + 2.4, cy + .23, .42, C.orange, 10); }
    { const cy = -.05, y0 = cy - .45, y1 = cy - .15, y2 = cy + .15, y3 = cy + .45, x0 = -2.6;
      sheet(P, n * .11, path(x0, y0, 0, [['L', 2.95], ['A', .3, PI], ['L', .75]]), th, V, { g: 10 });
      sheet(P, n * .11, path(-x0, y3, PI, [['L', 2.95], ['A', .3, PI], ['L', .75]]), th, c2, { g: 10 });
      sheet(P, n * .09, path(x0, y0, 0, [['L', 4.6]]), th, V, { g: 11 });
      sheet(P, n * .09, path(-x0, y3 + .2, PI, [['L', 4.6]]), th, c2, { g: 11 });
      glow(P, n * .016, .55, y1, .36, C.orange, 10); glow(P, n * .016, -.55, y2, .36, C.orange, 10); }
    { const cy = -1.95, x0 = -2.0;
      sheet(P, n * .12, path(x0, cy, 0, [['L', 2.45], ['A', .42, 1.75 * PI]]), th, V, { g: 10 });
      sheet(P, n * .12, path(x0, cy, 0, [['L', 2.45 + .42 * 1.75 * PI]]), th, V, { g: 11 });
      glow(P, n * .02, x0 + 2.45, cy + .42, .55, C.orange, 10); }
  }, .64),

  /* roll forming: three rolls turn and the sheet runs through them, curving into a cylinder (the C turns through the rolls) */
  rollForm: B(717, (P, n) => {
    const Rs = 1.7, th = .1, yc = .35, rt = .55, yt = yc - Rs + th / 2 + rt, yb = yc - Math.sqrt((Rs + th / 2 + rt) ** 2 - 1.15 ** 2), w = .3;
    // the sheet: a C that turns about its own centre (group 6) — that is the sheet travelling through the rolls
    const pvS = [0, yc, 0, w];
    for (let q = 0; q < n * .34; q++) { const a = -PI / 2 + .42 + P.r() * (PI * 2 - .84), e = P.r() < .45, s = e ? (P.r() < .5 ? -1 : 1) : P.r() * 2 - 1, r = Rs + s * th / 2, z = e ? 0 : P.r() * -.5; const c = e ? mix(V, C.chalk, .25) : k(V, .4); P.pt(Math.cos(a + PI) * r + z * .3, yc + Math.sin(a + PI) * r + z * .2, z, c, 6, pvS); }
    for (let t = 0; t < 14; t++) { const a = -PI / 2 + .42 + t / 13 * (PI * 2 - .84) + PI; for (let q = 0; q < n * .002; q++) { const r = Rs - th / 2 + P.r() * th; P.pt(Math.cos(a) * r, yc + Math.sin(a) * r, 0, C.chalk, 6, pvS); } }
    roll(P, n * .12, 0, yt, rt, C.steel, w * Rs / rt);
    roll(P, n * .12, -1.15, yb, .55, C.steel, -w * Rs / .55);
    roll(P, n * .12, 1.15, yb, .55, C.steel, -w * Rs / .55);
    // contact: where the rolls press the sheet
    glow(P, n * .015, 0, yc - Rs, .2, C.orange); [-1, 1].forEach(sg => { const a = Math.atan2(yb - yc, 1.15 * sg); glow(P, n * .012, Math.cos(a) * (Rs + th / 2), yc + Math.sin(a) * (Rs + th / 2), .16, C.orange); });
  }, .64),

  /* continuous roll forming: the strip runs through five stands; each stand's profile bends a little more */
  contRoll: B(718, (P, n) => {
    const y = .55, r = .4, X = [-3.2, -1.6, 0, 1.6, 3.2], w = .55 / r;
    // the strip (conveyor) with marks so it is seen moving
    for (let q = 0; q < n * .16; q++) { const e = P.r() < .5, x = -4.4 + P.r() * 8.8, s = e ? (P.r() < .5 ? -1 : 1) : P.r() * 2 - 1; P.pt(x, y + s * .05, P.g() * .02, e ? mix(V, C.chalk, .3) : k(V, .45), 9); }
    for (let m = 0; m < 22; m++) for (let q = 0; q < n * .0015; q++) P.pt(-4.4 + m * .4, y - .05 + P.r() * .1, 0, C.chalk, 9);
    X.forEach((x, i) => {
      P.rect(n * .015, x - .07, y - .95, .14, 1.9, k(C.steel2, .4)); oline(P, n * .012, rectP(x - .55, y - .98, 1.1, 1.96), k(C.steel2, .6));
      roll(P, n * .045, x, y + .05 + r, r, mix(C.steel, V, .2), w, { spokes: 3 });
      roll(P, n * .045, x, y - .05 - r, r, mix(C.steel, V, .2), -w, { spokes: 3 });
      // the profile after this stand
      const t = i / 4, d = .1 + .45 * t, fl = .38 - .12 * t, py = -1.55, c = mix(V, C.yellow, t * .7);
      const prof = i === 0 ? [[x - .5, py], [x + .5, py]] : [[x - .5 - (t > .5 ? .0 : 0), py + (t > .6 ? d * .25 : 0)], [x - fl, py], [x - fl * (1 - t * .3), py - d], [x + fl * (1 - t * .3), py - d], [x + fl, py], [x + .5, py + (t > .6 ? d * .25 : 0)]];
      sheet(P, n * .02, prof, .06, c, { f: .25 });
      dash(P, n * .004, [[x, y - 1.05], [x, py + .2]], k(C.chalk, .3), { on: .04, per: .1 });
    });
  }, .64),

  /* tube bending: around a former with a mandrel inside it bends clean; without one the inside wall buckles (10 bent · 11 straight) */
  tube: B(719, (P, n) => {
    zoom(P, 1.1, .1, .1);
    [[-1.95, true], [1.4, false]].forEach(([cx, mandrel]) => {
      const fy = .1, fR = .58, Rc = fR + .21, D = .4, feed = 1.15, after = .75;
      // the former (bend die)
      P.arc(n * .03, cx, fy, fR, 0, PI * 2, k(C.steel, .7), .012); P.disc(n * .03, cx, fy, fR * .95, k(C.steel, .12)); P.arc(n * .008, cx, fy, .1, 0, PI * 2, k(C.chalk, .6), .008);
      const bent = path(cx - feed, fy - Rc, 0, [['L', feed], ['A', Rc, PI / 2], ['L', after]]);
      const straight = path(cx - feed, fy - Rc, 0, [['L', feed + Rc * PI / 2 + after]]);
      const wall = (pts, g, wrinkle) => {
        const { at, T } = walker(pts);
        for (let q = 0; q < n * .14; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), side = P.r() < .5 ? -1 : 1, inBend = d > feed && d < feed + Rc * PI / 2; let h = side * D / 2; let c = mix(C.alu, V, .45);
          if (wrinkle && inBend && side > 0) { h += .045 * Math.sin((d - feed) * 36); c = mix(C.red, C.orange, .4); }
          if (wrinkle && inBend && side < 0) h *= .8;
          P.pt(x + nx * h + P.g() * .006, y + ny * h + P.g() * .006, 0, c, g); }
        for (let q = 0; q < n * .035; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), h = (P.r() - .5) * D; P.pt(x + nx * h, y + ny * h, -.1, k(V, .18), g); }
      };
      wall(bent, 10, !mandrel); wall(straight, 11, false);
      if (mandrel) {
        P.rect(n * .03, cx - feed - .45, fy - Rc - .09, feed + .45, .18, k(C.alu, .55)); P.box(n * .016, cx - feed - .45, fy - Rc - .09, feed + .45, .18, C.alu);
        [.22, .47, .72].forEach((t, q) => { const a = -PI / 2 + t * PI / 2 * .85; P.ring(n * .007, cx + Math.cos(a) * Rc, fy + Math.sin(a) * Rc, .11, C.alu, .008, 10); P.disc(n * .006, cx + Math.cos(a) * Rc, fy + Math.sin(a) * Rc, .1, k(C.alu, .5), 10); P.ring(n * .007, cx + .05 + q * .23, fy - Rc, .11, C.alu, .008, 11); });
        glow(P, n * .01, cx + Math.cos(-PI / 4) * Rc, fy + Math.sin(-PI / 4) * Rc, .3, C.good, 10);
      } else glow(P, n * .03, cx + Math.cos(-PI / 4) * (Rc - .15), fy + Math.sin(-PI / 4) * (Rc - .15), .32, C.hot, 10);
    });
  })
};
};
