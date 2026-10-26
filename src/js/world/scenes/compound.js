// Immersive scenes — compound (names and captions: info.js · SCENES_BY_ZONE.compound; what to draw: docs/SCENES.md; how: STYLE.md).
// Lecture 4: spinning, hydroforming, deep drawing. Work on the lathe turns about its own axis (group 12) with bright
// streaks so the turning shows; spun shapes tumble slowly as wireframe shells; presses use the ram clock (7 · 10 · 11).
import { build, C, k, mix } from './kit.js';

const PI = Math.PI, BL = C.blue, W = C.water;
/* ---------------- local helpers ---------------- */
const fit = (draw, t = .97) => (P, n) => { const pt0 = P.pt; let c = 0; P.pt = () => { c++; }; draw(P, n); P.pt = pt0; draw(P, n * Math.min(4, t * n / Math.max(1, c))); };
function zoom(P, s, ox = 0, oy = 0) { const pt = P.pt; P.pt = (x, y, z, c, g, pv) => pt(x * s + ox, y * s + oy, z * s, c, g, pv ? [pv[0] * s + ox, pv[1] * s + oy, pv[2] * s, pv[3]] : pv); }
function glow(P, n, x, y, r, c, g = 0, sy = 1) { for (let q = 0; q < n; q++) { const a = P.r() * PI * 2, d = Math.pow(P.r(), 1.8) * r; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d * sy, P.g() * .05, mix(c, C.white, Math.max(0, .6 - d / r)), g); } }
function path(x, y, a, cmds, step = .03) {
  const pts = [[x, y]];
  for (const [kind, p, q] of cmds) {
    if (kind === 'L') { const m = Math.max(1, Math.ceil(p / step)); for (let i = 1; i <= m; i++) pts.push([x + Math.cos(a) * p * i / m, y + Math.sin(a) * p * i / m]); x += Math.cos(a) * p; y += Math.sin(a) * p; }
    else { const sg = Math.sign(q) || 1, cx = x + Math.cos(a + sg * PI / 2) * p, cy = y + Math.sin(a + sg * PI / 2) * p, a0 = Math.atan2(y - cy, x - cx), m = Math.max(2, Math.ceil(Math.abs(q) * p / step)); for (let i = 1; i <= m; i++) { const t = a0 + q * i / m; pts.push([cx + Math.cos(t) * p, cy + Math.sin(t) * p]); } x = cx + Math.cos(a0 + q) * p; y = cy + Math.sin(a0 + q) * p; a += q; }
  }
  return pts;
}
function walker(pts) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] || 1e-6;
  const at = d => { d = Math.max(0, Math.min(T, d)); let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= d) lo = m; else hi = m; } const A = pts[lo], B = pts[hi], l = (L[hi] - L[lo]) || 1e-6, t = (d - L[lo]) / l; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, -(B[1] - A[1]) / l, (B[0] - A[0]) / l]; };
  return { at, T };
}
function band(P, n, pts, th, col, { g = 0, pv, edge = .45, j = .007 } = {}) {
  const { at, T } = walker(pts); const cf = typeof col === 'function' ? col : (s, u, e) => e ? mix(col, C.white, .12) : k(col, .55);
  for (let q = 0; q < n; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, s = e ? (P.r() < .5 ? -1 : 1) : P.r() * 2 - 1, h = s * th / 2; P.pt(x + nx * h + P.g() * j, y + ny * h + P.g() * j, P.g() * j, cf(s, d / T, e), g, pv); }
}
const DS = { ox: .3, oy: .19, oz: -.5 };
function face(P, n, pts, th, side, c, { D = DS, g = 0, pv, edge = .3 } = {}) {
  const { at, T } = walker(pts);
  for (let q = 0; q < n; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, w = e ? 1 : P.r(), h = side * th / 2; P.pt(x + nx * h + D.ox * w + P.g() * .006, y + ny * h + D.oy * w + P.g() * .006, D.oz * w, e ? k(c, .7) : k(c, .3), g, pv); }
}
function sheet(P, n, pts, th, col, o = {}) { const { side = 1, f = .3 } = o; band(P, n * (1 - f), pts, th, col, o); face(P, n * f, pts, th, side, col, o); }
function dash(P, n, pts, c, { on = .1, per = .17, j = .009, g = 0, pv, z = 0 } = {}) {
  const { at, T } = walker(pts); let q = 0, tries = 0;
  while (q < n && tries++ < n * 8) { const d = P.r() * T; if (d % per > on) continue; const [x, y] = at(d); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); q++; }
}
function oline(P, n, pts, c, { z = 0, closed = true, j = .009, g = 0, pv } = {}) {
  const ps = closed ? [...pts, pts[0]] : pts; const { at, T } = walker(ps);
  for (let q = 0; q < n; q++) { const [x, y] = at(P.r() * T); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); }
}
function prism(P, n, pts, c, { D = DS, g = 0, pv, f = .34, fill = .5, back = .34 } = {}) {
  P.poly(Math.round(n * fill), pts, k(c, f), g, pv);
  oline(P, Math.round(n * (1 - fill) * .62), pts, c, { g, pv });
  oline(P, Math.round(n * (1 - fill) * .26), pts.map(([x, y]) => [x + D.ox, y + D.oy]), k(c, back), { z: D.oz, g, pv });
  const m = Math.round(n * (1 - fill) * .12 / pts.length);
  pts.forEach(([x, y]) => { for (let q = 0; q < m; q++) { const t = P.r(); P.pt(x + D.ox * t, y + D.oy * t, D.oz * t, k(c, back), g, pv); } });
}
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const arrowDown = (P, n, x, y1, y2, c, g = 0) => P.arrow(n, x, y1, x, y2, c, .2, g);
/** a body of revolution about the x axis that turns on the lathe (group 12): surface + bright streaks so the turning shows */
function spun(P, n, prof, c, { cy = 0, speed = 2, marks = 6, mc = C.white, shade = true } = {}) {
  P.lathe(Math.round(n * .82), prof, c, { axis: 'x', cy, speed, shade });
  const pv = [0, cy, 0, speed], { at, T } = walker(prof.map(([r, a]) => [a, r]));
  for (let m = 0; m < marks; m++) { const th = m / marks * PI * 2 + .3; for (let q = 0; q < n * .18 / marks; q++) { const [a, r] = at(P.r() * T); P.pt(a, cy + Math.cos(th) * r, Math.sin(th) * r, mc, 12, pv); } }
}
/** a thin-walled shell lying along its own axis (local x), shown as a wire globe (parallels + meridians + a faint skin) and
 *  turning slowly about the vertical (spin about Y). prof = [[r, along], …]; ph = start angle */
function shell(P, n, prof, c, { cx = 0, cy = 0, spin = .4, ph = 0, rings = 7, mer = 10, rim = C.white } = {}) {
  const pv = [cx, cy, 0, spin], cp = Math.cos(ph), sp = Math.sin(ph), { at, T } = walker(prof);
  const put = (r, al, th, col) => { const lx = al, ly = r * Math.cos(th), lz = r * Math.sin(th); P.pt(cx + lx * cp + lz * sp, cy + ly, -lx * sp + lz * cp, col, 0, pv); };
  for (let q = 0; q < n * .25; q++) { const [r, al] = at(P.r() * T); put(r, al, P.r() * PI * 2, k(c, .25)); }
  for (let i = 0; i <= rings; i++) { const [r, al] = at(i / rings * T); for (let q = 0; q < n * .4 / (rings + 1) * (r + .2); q++) put(r, al, P.r() * PI * 2, i === 0 ? rim : k(c, .85)); }
  for (let m = 0; m < mer; m++) { const th = m / mer * PI * 2; for (let q = 0; q < n * .3 / mer; q++) { const [r, al] = at(P.r() * T); put(r, al, th, k(c, .7)); } }
}

/* ---------------- the scenes ---------------- */
export default N => {
  const B = (seed, draw, fill) => () => build(N, seed, fit(draw), fill);
  /* the spinning lathe, shared: the work mid-way, pushed by the roller onto the mandrel */
  const lathe = (P, n, { parts = false } = {}) => {
    const cy = .1, w = 2.2, S2 = mix(C.steel2, BL, .2), th = .07;
    // head stock and tail stock (still)
    prism(P, n * .1, rectP(-3.95, cy - 1.5, 1.05, 2.9), S2, { f: .26 });
    prism(P, n * .07, rectP(2.65, cy - 1.0, 1.1, 1.9), S2, { f: .26 });
    // spindle, mandrel, clamp: they turn
    spun(P, n * .07, [[.34, -2.9], [.34, -2.3], [0, -2.3]], C.steel, { cy, speed: w, marks: 3 });
    spun(P, n * .2, [[.98, -2.3], [.98, -2.12], [.78, -2.04], [.78, .64], [.7, .82], [.52, .9], [0, .9]], mix(C.steel, BL, .35), { cy, speed: w, marks: 4, mc: k(C.alu, .9) });
    spun(P, n * .04, [[.3, .97], [.3, 1.3], [0, 1.3]], C.amber, { cy, speed: w, marks: 2 });
    for (let q = 0; q < n * .03; q++) { const a = P.r() * PI * 2, x = 1.3 + P.r() * 1.35; P.pt(x, cy + Math.cos(a) * .16, Math.sin(a) * .16, k(C.steel, .55 + .4 * Math.max(0, Math.sin(a))), 0); }
    // the work: bottom on the nose, wrapped along the mandrel, the rest still flaring out (it turns too)
    const work = [[0, .9 + th], [.5, .9 + th], [.66, .86], [.8, .7], [.81 + th / 2, .64], [.81 + th / 2, .12], [1.0, .02], [1.78, -.2]];
    spun(P, n * .26, work, BL, { cy, speed: w, marks: 7, mc: C.ice });
    // the roller tool presses where the work leaves the mandrel (below), its arm runs off down-right
    const rx = .34, ry = cy - 1.12, rr = .3;
    P.ring(n * .02, rx, ry, rr, k(C.alu, .8), .012, 6, [rx, ry, 0, -3.5]); for (let q = 0; q < n * .012; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * rr; P.pt(rx + Math.cos(a) * d, ry + Math.sin(a) * d, 0, k(C.alu, .16), 6, [rx, ry, 0, -3.5]); }
    P.seg(n * .008, rx - .2, ry, rx + .2, ry, C.chalk, .01, 6, [rx, ry, 0, -3.5]);
    for (let q = 0; q < n * .05; q++) { const t = P.r(), h = (P.r() - .5) * .2; P.pt(rx + .1 + t * 1.25 + h * .6, ry - .2 - t * 1.05 + h * .8, -.1, k(C.steel, .5), 0); }
    oline(P, n * .02, [[rx + .2, ry - .1], [rx + 1.43, ry - 1.18], [rx + 1.3, ry - 1.34], [rx + .05, ry - .28]], k(C.steel, .8));
    glow(P, n * .012, .1, cy - .9, .22, C.yellow);
    for (let q = 0; q < n * .03; q++) { const a = P.r() * PI * 2; P.pt(.12 + P.g() * .02, cy + Math.cos(a) * .88, Math.sin(a) * .88, mix(C.orange, C.yellow, P.r()), 12, [0, cy, 0, w]); }
    if (parts) return;
    // the flat blank it started as (dashed), and the cup it will become (dashed along the mandrel)
    dash(P, n * .045, Array.from({ length: 73 }, (_, q) => { const a = q / 72 * PI * 2; return [.95 + Math.sin(a) * .42, cy + Math.cos(a) * 2.0]; }), k(C.ice, .55), { on: .07, per: .15 });
    [1, -1].forEach(sg => dash(P, n * .02, [[.66, cy + sg * .9], [-.75, cy + sg * .9]], k(C.ice, .5), { on: .07, per: .15 }));
    // the turning: a curved arrow round the spindle
    for (let q = 0; q < n * .02; q++) { const a = -1.1 + P.r() * 3.6; P.pt(-2.6 + Math.sin(a) * .16, cy + Math.cos(a) * .62, Math.sin(a) * .5, C.orange, 0); }
    { const a = 2.5, hx = -2.6 + Math.sin(a) * .16, hy = cy + Math.cos(a) * .62; P.seg(n * .004, hx, hy, hx + .14, hy + .02, C.orange, .008); P.seg(n * .004, hx, hy, hx + .02, hy + .15, C.orange, .008); }
  };
  return {
    /* ★ spinning: the blank turns on the lathe, the roller presses it onto the mandrel — flat disc (dashed) → cup (dashed) */
    spinning: B(801, (P, n) => { zoom(P, .93, .05, .05); lathe(P, n); }, .66),

    /* the spinning lathe, part by part: head stock · spindle · mandrel · sheet · clamp · tail stock · roller. The tail stock
       brings the clamp in and pins the flat disc to the mandrel (10), then backs off (11) */
    spinParts: B(802, (P, n) => {
      zoom(P, .95, .3, 0);
      const cy = .1, w = 1.8, S2 = mix(C.steel2, BL, .2);
      prism(P, n * .1, rectP(-3.95, cy - 1.5, 1.0, 2.9), S2, { f: .26 });
      spun(P, n * .08, [[.34, -2.95], [.34, -2.35], [0, -2.35]], C.alu, { cy, speed: w, marks: 3 });
      spun(P, n * .22, [[1.0, -2.35], [1.0, -2.15], [.8, -2.08], [.8, -.5], [.72, -.32], [.54, -.24], [0, -.24]], mix(C.steel, BL, .45), { cy, speed: w, marks: 4, mc: k(C.alu, .9) });
      // the flat disc (sheet metal): a disc seen a little from the side
      const disc = (x, g) => { for (let q = 0; q < n * .1; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * 1.65, rim = P.r() < .3; const dd = rim ? 1.65 : d; P.pt(x + Math.sin(a) * dd * .26, cy + Math.cos(a) * dd, Math.sin(a) * dd * .9, rim ? C.white : k(C.chalk, .4), g); } };
      disc(-.2, 10); disc(.3, 11);
      const tail = (dx, g) => {
        prism(P, n * .05, rectP(-.15 + dx, cy - .3, .36, .6), C.amber, { g });
        P.rect(n * .03, .21 + dx, cy - .16, 1.4, .32, k(C.steel, .45), g); P.box(n * .015, .21 + dx, cy - .16, 1.4, .32, C.steel, .01, g);
        prism(P, n * .07, rectP(1.61 + dx, cy - 1.0, 1.15, 1.9), S2, { g, f: .26 });
      };
      tail(0, 10); tail(.55, 11);
      // the roller tool waits below
      const rx = -.6, ry = cy - 1.55;
      P.ring(n * .03, rx, ry, .3, C.hot, .012); P.disc(n * .02, rx, ry, .28, k(C.hot, .3));
      for (let q = 0; q < n * .05; q++) { const t = P.r(), h = (P.r() - .5) * .2; P.pt(rx + .1 + t * 1.2 + h * .6, ry - .15 - t * .7 + h * .8, -.1, k(C.steel, .55), 0); }
      glow(P, n * .02, -.24, cy, .35, C.yellow, 10);
    }, .64),

    /* the three basic spun shapes — hemisphere · cone · cylindrical shell — turning slowly so their hollow shows */
    spunShapes: B(803, (P, n) => {
      const hemi = Array.from({ length: 30 }, (_, q) => { const f = q / 29 * PI / 2; return [Math.sin(f) * 1.05, Math.cos(f) * 1.05 - .5]; }).reverse();
      shell(P, n * .33, hemi.map(([r, a]) => [r, -a]), BL, { cx: -2.45, cy: .05, ph: .9, spin: .42 });
      shell(P, n * .33, [[1.0, -.75], [.5, .1], [0, .95]], mix(BL, C.ice, .3), { cx: 0, cy: .05, ph: 2.6, spin: .42 });
      shell(P, n * .33, [[.85, -.7], [.85, .55], [.55, .62], [0, .62]], mix(BL, C.violet, .25), { cx: 2.45, cy: .05, ph: 4.4, spin: .42 });
    }, .64),

    /* hydroforming: water pressure pushes the sheet up into a die whose cavity bulges back over its own mouth — a shape a
       solid punch could never get into (11 flat · 10 formed, with the pressure gauge swinging up) */
    hydro: B(804, (P, n) => {
      // two types, one idea: water pressure pushes the metal into a cavity that is wider inside than its mouth (no solid
      // punch could get in and out of it). Left: a sheet; right: a tube. 11 before · 10 formed
      zoom(P, 1, 0, -.34);
      const th = .08, pt0 = P.pt;
      { // sheet, drawn at 0.62 scale on the left
        P.pt = (x, y, z, c, g, pv) => pt0(x * .62 - 1.85, y * .62 + .25, z * .62, c, g, pv);
        const yb = .1, R = .8, cyb = .98, a0 = Math.atan2(.35 - cyb, -.45);
        const arc = (rr, from, to, m = 40) => Array.from({ length: m + 1 }, (_, q) => { const a = from + (to - from) * q / m; return [Math.cos(a) * rr, cyb + Math.sin(a) * rr]; });
        const cav = [[-.45, yb], [-.45, .35], ...arc(R, a0, -3 * PI - a0), [.45, .35], [.45, yb]];
        prism(P, n * .16, [[-2.7, yb], ...cav, [2.7, yb], [2.7, 2.05], [-2.7, 2.05]], C.steel, { f: .32 });
        prism(P, n * .07, [[-2.7, yb], [-2.7, -1.75], [2.7, -1.75], [2.7, yb], [2.45, yb], [2.45, -1.5], [-2.45, -1.5], [-2.45, yb]], mix(C.steel, BL, .3), { f: .3 });
        for (let q = 0; q < n * .1; q++) { const x = -2.4 + P.r() * 4.8, y = -1.48 + P.r() * (yb - th + 1.48); P.pt(x, y, P.g() * .05, k(W, .22 + .2 * P.r()), 0); }
        sheet(P, n * .06, path(-2.45, yb - th / 2, 0, [['L', 4.9]]), th, BL, { g: 11, side: -1 });
        const ri = R - th / 2, b0 = Math.atan2(.35 - cyb, -.45 + th / 2);
        sheet(P, n * .08, [[-2.45, yb - th / 2], [-.45 + th / 2 - .06, yb - th / 2], [-.45 + th / 2, yb + .04], [-.45 + th / 2, .35], ...arc(ri, b0, -3 * PI - b0), [.45 - th / 2, .35], [.45 - th / 2, yb + .04], [.45 - th / 2 + .06, yb - th / 2], [2.45, yb - th / 2]], th, BL, { g: 10, side: -1 });
        for (let q = 0; q < n * .05; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * (ri - .06), x = Math.cos(a) * d, y = cyb + Math.sin(a) * d; if (y < .4 && Math.abs(x) > .38) continue; P.pt(x, y, P.g() * .05, k(W, .45), 10); }
        for (let a = 0; a < 7; a++) { const t = -PI * .1 + a / 6 * PI * 1.2; P.arrow(n * .008, Math.cos(t) * .25, cyb + Math.sin(t) * .25, Math.cos(t) * .62, cyb + Math.sin(t) * .62, C.ice, .1, 10); }
        for (let a = 0; a < 5; a++) { const x = -1.6 + a * .8; P.arrow(n * .006, x, -1.2, x, -.3, k(C.ice, .8), .12, 10); }
        P.pt = pt0;
      }
      { // tube, on the right: closed die with a bulb above the bore; the wall swells up into it
        const cx = 1.85, R = .45, cb = .62, half = Math.sqrt(R * R - (.33 - cb) ** 2), t1 = Math.atan2(.33 - cb, -half), t2 = Math.atan2(.33 - cb, half);
        const bulb = (rr, m = 40) => Array.from({ length: m + 1 }, (_, q) => { const a = t1 + (t2 - 2 * PI - t1) * q / m; return [cx + Math.cos(a) * rr, cb + Math.sin(a) * rr]; });
        prism(P, n * .12, [[.45, .33], [cx - half, .33], ...bulb(R).slice(1, -1), [cx + half, .33], [3.3, .33], [3.3, 1.35], [.45, 1.35]], C.steel, { f: .32 });
        prism(P, n * .08, rectP(.45, -1.0, 2.85, .67), C.steel, { f: .32 });
        const wall = (pts, g) => band(P, n * .05, pts, .07, mix(BL, C.chalk, .2), { g });
        const straight = y => Array.from({ length: 60 }, (_, q) => [.3 + q / 59 * 3.15, y]);
        wall(straight(-.29), 0); wall(straight(.29), 11);
        const rin = R - .035, h2 = Math.sqrt(rin * rin - (.29 - cb) ** 2), u1 = Math.atan2(.29 - cb, -h2), u2 = Math.atan2(.29 - cb, h2);
        wall([[.3, .29], [cx - h2, .29], ...Array.from({ length: 41 }, (_, q) => { const a = u1 + (u2 - 2 * PI - u1) * q / 40; return [cx + Math.cos(a) * rin, cb + Math.sin(a) * rin]; }), [cx + h2, .29], [3.45, .29]], 10);
        for (let q = 0; q < n * .08; q++) { const x = .35 + P.r() * 3.05, y = -.25 + P.r() * .5; P.pt(x, y, P.g() * .05, k(W, .4 + .3 * P.r()), 10); }
        for (let q = 0; q < n * .04; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * (rin - .05), x = cx + Math.cos(a) * d, y = cb + Math.sin(a) * d; if (y < .3) continue; P.pt(x, y, P.g() * .05, k(W, .5), 10); }
        for (let a = 0; a < 5; a++) { const t = PI * .15 + a / 4 * PI * .7; P.arrow(n * .008, cx + Math.cos(t) * .1, cb - .1 + Math.sin(t) * .1, cx + Math.cos(t) * .36, cb - .1 + Math.sin(t) * .36, C.white, .09, 10); }
        [[.12, -1], [3.58, 1]].forEach(([x, sg]) => P.arrow(n * .012, x + sg * .35, 0, x - sg * .05, 0, C.orange, .14, 10));
      }
    }, .64),

    /* tube hydroforming: the die closes (7), the tube fills with fluid, the ends are pushed in (F axial) while the pressure
       swells it into the cavity (10); open, it is a plain straight tube again (11) */
    hydroTube: B(805, (P, n) => {
      const S = mix(C.steel, C.copper, .25), cav = x => Math.abs(x) < .78 ? .3 * Math.cos(x / .78 * PI / 2) ** 2 : 0;
      const dieP = (sg) => { const top = Array.from({ length: 41 }, (_, q) => { const x = -.78 + q / 40 * 1.56; return [x, sg * (.35 + cav(x))]; }); return sg < 0 ? [[-2.1, -1.3], [2.1, -1.3], [2.1, -.35], ...top.slice().reverse(), [-2.1, -.35]] : [[-2.1, 1.3], [-2.1, .35], ...top, [2.1, .35], [2.1, 1.3]]; };
      prism(P, n * .16, dieP(-1), S, { f: .3 });
      prism(P, n * .16, dieP(1), S, { g: 7, f: .3 });
      // the tube: straight (11) · swollen into the cavity, ends pushed in (10)
      const wall = (g, x0, x1, bulge) => { for (const sg of [1, -1]) { const pts = Array.from({ length: 81 }, (_, q) => { const x = x0 + q / 80 * (x1 - x0); return [x, sg * (.31 + (bulge ? cav(x) : 0))]; }); band(P, n * .07, pts, .07, mix(BL, C.chalk, .2), { g }); } };
      wall(11, -2.0, 2.0, false); wall(10, -1.82, 1.82, true);
      for (let q = 0; q < n * .1; q++) { const x = -1.8 + P.r() * 3.6, h = .27 + cav(x) - .02; P.pt(x, (P.r() * 2 - 1) * h, P.g() * .05, k(W, .5 + .3 * P.r()), 10); }
      for (let a = 0; a < 6; a++) { const t = a / 6 * PI * 2 + .26, x2 = Math.cos(t) * .55, y2 = Math.sin(t) * .45; P.arrow(n * .007, Math.cos(t) * .1, Math.sin(t) * .08, x2, y2, C.white, .08, 10); }
      // axial punches: pulled back (11) · pushed in (10) with F axial
      [[-1, 'L'], [1, 'R']].forEach(([sg]) => {
        const pun = (x0, g) => { prism(P, n * .045, rectP(sg < 0 ? x0 - 1.3 : x0, -.27, 1.3, .54), C.alu, { g }); };
        pun(sg * 1.82, 10); pun(sg * 2.05, 11);
        P.arrow(n * .02, sg * 3.65, 0, sg * 3.2, 0, C.orange, .18, 10);
      });
      glow(P, n * .02, 0, .66, .5, C.water, 10, .3); glow(P, n * .02, 0, -.66, .5, C.water, 10, .3);
    }, .64),

    /* sheet hydroforming, two ways: water from a pump forces the sheet up into a female cavity (left); a male punch presses the
       sheet down against fluid that pushes back (right). 11 flat · 10 formed */
    hydroSheet: B(806, (P, n) => {
      const th = .07;
      // left: female cavity above, water below
      { const x = -1.95, yb = .15, cav = u => Math.abs(u) < .75 ? .7 * Math.sqrt(1 - (u / .75) ** 2) : 0;
        const top = Array.from({ length: 41 }, (_, q) => { const u = -.75 + q / 40 * 1.5; return [x + u, yb + cav(u)]; });
        prism(P, n * .1, [[x - 1.5, yb], ...top, [x + 1.5, yb], [x + 1.5, 1.6], [x - 1.5, 1.6]], C.steel, { f: .32 });
        prism(P, n * .06, [[x - 1.5, yb], [x - 1.5, -1.5], [x + 1.5, -1.5], [x + 1.5, yb], [x + 1.28, yb], [x + 1.28, -1.28], [x - 1.28, -1.28], [x - 1.28, yb]], mix(C.steel, BL, .3), { f: .3 });
        for (let q = 0; q < n * .07; q++) P.pt(x - 1.25 + P.r() * 2.5, -1.26 + P.r() * (yb - th + 1.26), P.g() * .05, k(W, .22 + .2 * P.r()), 0);
        sheet(P, n * .05, path(x - 1.3, yb - th / 2, 0, [['L', 2.6]]), th, BL, { g: 11, side: -1 });
        const formed = Array.from({ length: 81 }, (_, q) => { const u = -1.3 + q / 80 * 2.6; return [x + u, yb - th / 2 + Math.max(0, cav(u) - th / 2 * (Math.abs(u) < .74 ? 1 : 0))]; });
        sheet(P, n * .06, formed, th, BL, { g: 10, side: -1 });
        for (let q = 0; q < n * .03; q++) { const u = (P.r() * 2 - 1) * .7; P.pt(x + u, yb - .05 + P.r() * Math.max(0, cav(u) - .07), 0, k(W, .5), 10); }
        for (let a = 0; a < 5; a++) { const u = -.5 + a * .25; P.arrow(n * .007, x + u, -.9, x + u, -.35, C.ice, .1, 10); }
        P.seg(n * .02, x + .6, -1.5, x + .6, -2.15, k(C.steel, .7), .03); glow(P, n * .01, x + .6, -2.15, .15, W); }
      // right: a male punch against the fluid
      { const x = 1.95, yb = -.15, nose = u => Math.abs(u) < .55 ? .55 * Math.sqrt(1 - (u / .55) ** 2) : 0;
        prism(P, n * .06, [[x - 1.5, yb], [x - 1.5, -1.6], [x + 1.5, -1.6], [x + 1.5, yb], [x + 1.28, yb], [x + 1.28, -1.38], [x - 1.28, -1.38], [x - 1.28, yb]], mix(C.steel, BL, .3), { f: .3 });
        for (let q = 0; q < n * .08; q++) P.pt(x - 1.25 + P.r() * 2.5, -1.36 + P.r() * (yb - th + 1.36), P.g() * .05, k(W, .25 + .2 * P.r()), 0);
        sheet(P, n * .05, path(x - 1.3, yb - th / 2, 0, [['L', 2.6]]), th, BL, { g: 11 });
        const dent = Array.from({ length: 81 }, (_, q) => { const u = -1.3 + q / 80 * 2.6, d = Math.abs(u) < .62 ? (nose(Math.min(.549, Math.abs(u))) + .02) * (Math.abs(u) < .55 ? 1 : 0) : 0; return [x + u, yb - th / 2 - d - (Math.abs(u) < .75 ? .05 * Math.cos(u / .75 * PI / 2) ** 2 : 0)]; });
        sheet(P, n * .06, dent, th, BL, { g: 10 });
        // the punch (7) with a round nose, drawn down in the sheet
        const pn = [[x - .55, 1.9], [x - .55, yb - .05], ...Array.from({ length: 21 }, (_, q) => { const u = -.55 + q / 20 * 1.1; return [x + u, yb - .05 - nose(u)]; }), [x + .55, yb - .05], [x + .55, 1.9]];
        prism(P, n * .08, pn, C.alu, { g: 7, f: .42 });
        arrowDown(P, n * .02, x, 2.45, 1.95, C.orange, 7);
        [-.85, .85].forEach(u => P.arrow(n * .008, x + u, -1.0, x + u * .8, -.42, C.ice, .1, 10)); }
    }, .64),

    /* deep drawing: the blank holder clamps the blank, the punch pushes it into the die and a cup forms (the flange draws in) */
    drawing: B(807, (P, n) => {
      const S = C.steel, th = .07, y0 = -.6, ry = .1;
      const die = sg => sg < 0 ? [[-2.2, -2.0], [-.4, -2.0], [-.4, y0 - ry], [-.4 - ry + ry * Math.cos(PI / 4), y0 - ry + ry * Math.sin(PI / 4)], [-.4 - ry, y0], [-2.2, y0]] : [[.4, -2.0], [2.2, -2.0], [2.2, y0], [.4 + ry, y0], [.4 + ry - ry * Math.cos(PI / 4), y0 - ry + ry * Math.sin(PI / 4)], [.4, y0 - ry]];
      prism(P, n * .12, die(-1), S); prism(P, n * .12, die(1), S);
      prism(P, n * .08, rectP(-2.05, y0 + th, 1.6, .5), mix(S, BL, .3)); prism(P, n * .08, rectP(.45, y0 + th, 1.6, .5), mix(S, BL, .3));
      // holding force on the blank holder (still), drawing force on the punch (with it)
      [-1.25, 1.25].forEach(x => P.arrow(n * .015, x, y0 + 1.25, x, y0 + .66, C.orange, .15));
      // the blank: flat (11) · the drawn cup (10): its flange has pulled in
      sheet(P, n * .07, path(-1.9, y0 + th / 2, 0, [['L', 3.8]]), th, BL, { g: 11 });
      const cup = path(-1.406, y0 + th / 2, 0, [['L', .906], ['A', .135, -PI / 2], ['L', .36], ['A', .1, PI / 2], ['L', .53], ['A', .1, PI / 2], ['L', .36], ['A', .135, -PI / 2], ['L', .906]]);
      sheet(P, n * .09, cup, th, BL, { g: 10 });
      // the punch (7), round corners, drawn at the bottom of the stroke
      const pr = .09, pb = -1.125, pn = [[-.32, 2.1], [-.32, pb + pr], ...Array.from({ length: 9 }, (_, q) => { const a = PI + q / 8 * PI / 2; return [-.32 + pr + Math.cos(a) * pr, pb + pr + Math.sin(a) * pr]; }), ...Array.from({ length: 9 }, (_, q) => { const a = 1.5 * PI + q / 8 * PI / 2; return [.32 - pr + Math.cos(a) * pr, pb + pr + Math.sin(a) * pr]; }), [.32, 2.1]];
      prism(P, n * .1, pn, C.alu, { g: 7, f: .42 });
      arrowDown(P, n * .022, 0, 2.6, 2.15, C.orange, 7);
      glow(P, n * .015, -.47, y0 - .05, .16, C.yellow, 10); glow(P, n * .015, .47, y0 - .05, .16, C.yellow, 10); glow(P, n * .012, 0, pb - .05, .3, C.orange, 10, .4);
    }, .64),

    /* blank → shallow cup → deep cup, and what comes out of it: a beverage can, a car body panel */
    drawSteps: B(808, (P, n) => {
      const y = .75;
      shell(P, n * .14, [[.8, 0], [0, 0]], mix(BL, C.chalk, .4), { cx: -2.7, cy: y, ph: .4, spin: .45, rings: 5, mer: 8 });
      shell(P, n * .17, [[.85, -.2], [.72, .18], [0, .22]], BL, { cx: -.9, cy: y, ph: 1.3, spin: .45, rings: 5, mer: 10 });
      shell(P, n * .19, [[.56, -.5], [.56, .45], [.45, .55], [0, .55]], BL, { cx: .9, cy: y, ph: 2.2, spin: .45, rings: 6, mer: 10 });
      shell(P, n * .2, [[.36, -.78], [.42, -.65], [.45, -.55], [.45, .5], [.38, .64], [.22, .66], [.09, .6], [0, .57]], mix(BL, C.alu, .4), { cx: 2.7, cy: y, ph: 3.1, spin: .45, rings: 7, mer: 10 });
      [[-2.35, -1.25], [-.55, .55], [1.25, 2.35]].forEach(([a, b]) => P.arrow(n * .012, a, y + 1.1, b, y + 1.1, C.orange, .14));
      // a car body panel: a doubly curved sheet, still
      const panel = (u, v) => [-1.6 + u * 3.2 + .25 * v, -1.55 + v * .95 + .28 * Math.sin(u * PI) - .1 * u, -.5 * Math.sin(u * PI) * Math.sin(v * PI)];
      for (let q = 0; q < n * .08; q++) { const [x, yy, z] = panel(P.r(), P.r()); P.pt(x, yy, z, k(BL, .3), 0); }
      for (let l = 0; l <= 6; l++) for (let q = 0; q < n * .006; q++) { const [x, yy, z] = panel(l / 6, P.r()); P.pt(x, yy, z, k(C.alu, .7), 0); }
      for (let l = 0; l <= 3; l++) for (let q = 0; q < n * .008; q++) { const [x, yy, z] = panel(P.r(), l / 3); P.pt(x, yy, z, l % 3 ? k(C.alu, .6) : C.white, 0); }
    }, .64)
  };
};
