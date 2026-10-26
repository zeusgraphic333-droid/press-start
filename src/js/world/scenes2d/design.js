// Illustrated scenes — design (L1 · Designer × Factory). Contract and look: STYLE.md · names and captions:
// world/scenes/info.js · what to draw: docs/SCENES.md. Zone marker: INK.straw — light, glue, paint, the highlighter.
// The machines (press brake, shear, bolted joint, spray gun) are drawn once in local coordinates and reused by
// methods · forming · cuttingM · joining · finishing; each has a `work` that appends its stroke to a loop timeline.

const f1 = v => +(+v).toFixed(1);
const RAD = Math.PI / 180;
const D = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L');
const DZ = pts => D(pts) + 'Z';
const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
const along = (o, u, s, n = [0, 0], t = 0) => [o[0] + u[0] * s + n[0] * t, o[1] + u[1] * s + n[1] * t];
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const seeded = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
/** a smooth curve through points (Catmull-Rom as cubic Béziers) */
function smooth(pts) {
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
/** a part cut in section: hatch (.h) under its outline (.o). flip = hatch the other way (two touching parts) */
function sec(k, pts, mat, { cls = '', flip = false, tint = '', w } = {}) {
  let hp = pts, tr = '';
  if (flip) { const xs = pts.map(p => p[0]), c2 = Math.min(...xs) + Math.max(...xs); hp = pts.map(([x, y]) => [c2 - x, y]); tr = ` transform="matrix(-1 0 0 1 ${f1(c2)} 0)"`; }
  return `<g${cls ? ` class="${cls}"` : ''}>${tint ? `<path class="h" d="${DZ(pts)}" fill="${tint}"/>` : ''}<path class="h" d="${DZ(hp)}" fill="${k.hatch(mat)}"${tr}/><path class="o" d="${DZ(pts)}" fill="none" stroke="${k.INK.graphite}" stroke-width="${w || k.W.thick}" stroke-linejoin="round"/></g>`;
}
/** an outside view of a part: a flat fill (.h) under its outline (.o) */
const solid = (k, pts, fill, cls = '') => `<g${cls ? ` class="${cls}"` : ''}><path class="h" d="${DZ(pts)}" fill="${fill}"/><path class="o" d="${DZ(pts)}" fill="none" stroke="${k.INK.graphite}" stroke-width="${k.W.thick}" stroke-linejoin="round"/></g>`;
const thinPath = (k, d, cls = 'o', w) => `<path class="${cls}" d="${d}" fill="none" stroke="${k.INK.graphite}" stroke-width="${w || k.W.thin}" stroke-linecap="round"/>`;
/** a balloon with its leader ending on a dot */
function bal(k, bx, by, n, tx, ty, cls) {
  const a = Math.atan2(ty - by, tx - bx);
  return `<g class="${cls}"><line x1="${f1(bx + Math.cos(a) * 13)}" y1="${f1(by + Math.sin(a) * 13)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="${k.INK.graphite}" stroke-width="${k.W.thin}" marker-end="url(#dot)"/>${k.balloon(bx, by, n)}</g>`;
}
/** set up a stroke so a loop can draw it on (dashoffset len → 0) and wipe it off (0 → −len) */
const CL = 'line[stroke-dasharray="22 4 3 4"]'; // the kit's centre lines (chain), to ink them in after the outlines
function primeStroke(el) { let L = 0; try { L = Math.ceil(el.getTotalLength()) + 2; } catch (e) { L = 400; } el.style.strokeDasharray = `${L} ${L}`; el.style.strokeDashoffset = L; return L; }

/* ======================================================================================================
   the machines — local coordinates, reused across the zone
   ====================================================================================================== */
/* press brake: punch, V-die and a sheet (die top y=30, V bottom (0,56); the bend line is at (0,27)) */
function vpressDraw(k, { sheet = k.INK.steel2 } = {}) {
  const leg = x0 => solid(k, box(x0, 24, 68, 6), sheet);
  return `${sec(k, [[-72, 30], [-26, 30], [0, 56], [26, 30], [72, 30], [72, 86], [-72, 86]], 'steel')}
    <g class="vp-sheet"><g class="vp-l">${leg(-68)}</g><g class="vp-r">${leg(0)}</g></g>
    <g class="vp-ram">${sec(k, box(-34, -72, 68, 18), 'steel', { flip: true })}${sec(k, [[0, 2], [15, -13], [15, -54], [-15, -54], [-15, -13]], 'steel')}<g class="fx">${k.arrow(0, -110, 0, -78)}</g></g>`;
}
const VP_O = '0 27';
function vpressWork(L, g, at) {
  const q = s => g.querySelector(s), ram = q('.vp-ram'), l = q('.vp-l'), r = q('.vp-r');
  L.to(ram, { y: 22, duration: .4, ease: 'power1.in' }, at)
    .to(ram, { y: 45.6, duration: .7, ease: 'power1.inOut' }, at + .4)
    .to(l, { y: 24.8, rotation: 45, svgOrigin: VP_O, duration: .7, ease: 'power1.inOut' }, at + .4)
    .to(r, { y: 24.8, rotation: -45, svgOrigin: VP_O, duration: .7, ease: 'power1.inOut' }, at + .4)
    .to(ram, { y: 0, duration: .8, ease: 'power2.inOut' }, at + 1.4)
    .to(l, { rotation: 42, svgOrigin: VP_O, duration: .5, ease: 'power2.out' }, at + 1.45) // springback, a hair
    .to(r, { rotation: -42, svgOrigin: VP_O, duration: .5, ease: 'power2.out' }, at + 1.45);
  return 2.2;
}
function vpressReset(L, g, at) {
  const q = s => g.querySelector(s), sh = q('.vp-sheet'), legs = [q('.vp-l'), q('.vp-r')];
  L.to(sh, { opacity: 0, duration: .35 }, at).set(legs, { y: 0, rotation: 0, svgOrigin: VP_O }, at + .36).to(sh, { opacity: 1, duration: .35 }, at + .4);
}

/* guillotine shear: lower blade fixed, sheet overhanging, upper blade comes down past the edge (cutting edge (0,20)) */
function shearDraw(k) {
  return `${sec(k, [[-80, 20], [0, 20], [0, 32], [-5, 80], [-80, 80]], 'steel')}
    ${solid(k, box(-80, 14, 80, 6), k.INK.steel2)}
    <g class="sh-cut">${solid(k, box(0, 14, 76, 6), k.INK.steel2)}</g>
    ${sec(k, box(-72, -22, 46, 36), 'steel', { flip: true })}
    <g class="sh-blade">${sec(k, [[2, 6], [2, -70], [62, -70], [62, -2]], 'steel', { flip: true })}<g class="fx">${k.arrow(32, -114, 32, -78)}</g></g>`;
}
function shearWork(L, g, at) {
  const q = s => g.querySelector(s), blade = q('.sh-blade'), cut = q('.sh-cut');
  L.to(blade, { y: 8, duration: .35, ease: 'power1.in' }, at)
    .to(blade, { y: 26, duration: .45, ease: 'power1.inOut' }, at + .35)
    .to(cut, { y: 8, rotation: -8, svgOrigin: '76 17', duration: .45, ease: 'power1.inOut' }, at + .35)
    .to(cut, { y: 62, rotation: -30, opacity: 0, duration: .65, ease: 'power2.in' }, at + .85)
    .to(blade, { y: 0, duration: .8, ease: 'power2.inOut' }, at + 1);
  return 1.8;
}
function shearReset(L, g, at) {
  const cut = g.querySelector('.sh-cut');
  L.set(cut, { y: 0, rotation: 0, svgOrigin: '76 17', x: 34 }, at).to(cut, { opacity: 1, x: 0, duration: .6, ease: 'power2.out' }, at + .01); // the sheet is fed in again
}

/* bolted joint, in section: two plates, a bolt (not sectioned), the nut draws the lower plate up and closes the gap */
function boltDraw(k) {
  const { INK, W } = k;
  const faces = y => thinPath(k, `M-9 ${y}V${y + 18}M9 ${y}V${y + 18}`);
  return `<g>${sec(k, box(-88, -22, 75, 22), 'steel')}${sec(k, box(13, -22, 75, 22), 'steel')}</g>
    <g class="bt-low">${sec(k, box(-88, 6, 75, 22), 'steel', { flip: true })}${sec(k, box(13, 6, 75, 22), 'steel', { flip: true })}</g>
    ${solid(k, box(-10, -24, 20, 80), INK.steel2)}${thinPath(k, 'M-7 34V54M7 34V54')}
    <g>${solid(k, box(-25, -42, 50, 18), INK.steel2)}${faces(-42)}</g>
    <g class="bt-nut">${solid(k, box(-25, 28, 50, 18), INK.steel2)}${faces(28)}</g>
    <path class="bt-tq" d="M-30 64A30 8 0 0 0 30 64" fill="none" stroke="${INK.hot}" stroke-width="3" marker-end="url(#arr-hot)" opacity="0"/>`;
}
function boltWork(L, g, at) {
  const q = s => g.querySelector(s), mv = [q('.bt-low'), q('.bt-nut')], tq = q('.bt-tq');
  L.to(tq, { opacity: 1, duration: .3 }, at).to(mv, { y: -6, duration: 1, ease: 'power1.inOut' }, at + .15).to(tq, { opacity: 0, duration: .3 }, at + 1.1);
  return 1.4;
}
function boltReset(L, g, at) { L.to([g.querySelector('.bt-low'), g.querySelector('.bt-nut')], { y: 0, duration: .7, ease: 'power2.inOut' }, at); }

/* spray gun + its mist (nozzle tip (0,-36), the cone reaches y=22) */
function gunDraw(k) {
  return `<path class="sp-cone" d="M0 -36L34 22L-34 22Z" fill="${k.hatch('stipple')}" stroke="${k.INK.graphite3}" stroke-width="${k.W.hair}" stroke-dasharray="3 3" opacity="0"/>
    ${solid(k, [[-16, -100], [16, -100], [16, -62], [7, -50], [7, -36], [-7, -36], [-7, -50], [-16, -62]], k.INK.steel2)}
    ${thinPath(k, 'M16 -88H44', 'o', k.W.med)}`;
}
/* spray coating: a plate in section, the coat (straw) builds behind the gun */
function sprayDraw(k, id, { mat = 'steel' } = {}) {
  return `<clipPath id="${id}-coat"><rect class="sp-clip" x="-96" y="10" width="0" height="24"/></clipPath>
    ${sec(k, box(-96, 30, 192, 30), mat)}
    <g class="sp-coat" clip-path="url(#${id}-coat)"><rect x="-96" y="22" width="192" height="8" fill="${k.INK.straw}" stroke="${k.INK.graphite}" stroke-width="${k.W.thin}"/></g>
    <g class="sp-gun" transform="translate(-72 0)">${gunDraw(k)}</g>`;
}
function sprayWork(L, g, at, dur = 1.6) {
  const q = s => g.querySelector(s), gun = q('.sp-gun'), cone = q('.sp-cone');
  L.to(cone, { opacity: 1, duration: .3 }, at)
    .to(gun, { x: 72, duration: dur, ease: 'sine.inOut' }, at + .15)
    .to(q('.sp-clip'), { attr: { width: 192 }, duration: dur, ease: 'sine.inOut' }, at + .15)
    .to(cone, { opacity: 0, duration: .3 }, at + .15 + dur);
  return dur + .5;
}
function sprayReset(L, g, at) {
  const q = s => g.querySelector(s), coat = q('.sp-coat');
  L.to(coat, { opacity: 0, duration: .4 }, at).set(q('.sp-clip'), { attr: { width: 0 } }, at + .42).set(coat, { opacity: 1 }, at + .44)
    .to(q('.sp-gun'), { x: -72, duration: .9, ease: 'power2.inOut' }, at);
}

/* ======================================================================================================
   designer ★ — one product, half drawn, half made: an articulated desk lamp. Left of the line it is still
   construction (non-photo blue: axes, reach arcs, pivots, the bulb hidden in the shade, dimensions); right of it,
   it is a part (graphite outlines, steel and aluminium, the cast base cut in section, balloons, a title block, and
   it lights). The made half sweeps across the whole lamp, the head nods once, and it sweeps back.
   ====================================================================================================== */
const LAMP = (() => {
  const A = [182, 448], B = [292, 168];
  const C = [B[0] + 180 * Math.cos(19.3 * RAD), B[1] + 180 * Math.sin(19.3 * RAD)];
  return { A, B, C, tilt: 10 }; // tilt: the shade's axis, degrees past straight down
})();
function designerDraw(k) {
  const { INK, W } = k;
  const { A, B, C, tilt } = LAMP;
  const u1 = unit(A, B), n1 = [-u1[1], u1[0]], u2 = unit(B, C), n2 = [-u2[1], u2[0]];
  const cap = (a, b, w) => { const u = unit(a, b), n = [-u[1], u[0]]; const p = (o, s) => [o[0] + n[0] * s, o[1] + n[1] * s]; const [a1, b1, b2, a2] = [p(a, w), p(b, w), p(b, -w), p(a, -w)]; return `M${f1(a1[0])} ${f1(a1[1])}L${f1(b1[0])} ${f1(b1[1])}A${w} ${w} 0 0 0 ${f1(b2[0])} ${f1(b2[1])}L${f1(a2[0])} ${f1(a2[1])}A${w} ${w} 0 0 0 ${f1(a1[0])} ${f1(a1[1])}Z`; };
  const arms = [cap(A, B, 9), cap(B, C, 8)];
  // the counterbalance spring, beside the lower arm
  const zig = []; for (let i = 0; i <= 14; i++) zig.push(along(A, u1, 40 + 110 * i / 14, n1, -24 + (i === 0 || i === 14 ? 0 : i % 2 ? 7 : -7)));
  const spring = D(zig) + D([along(A, u1, 40, n1, -24), along(A, u1, 40, n1, -9)]) + D([along(A, u1, 150, n1, -24), along(A, u1, 150, n1, -9)]);
  const base = [[110, 500], [126, 480], [238, 480], [254, 500]], collar = box(168, 458, 28, 22);
  // the shade, drawn with its axis pointing down from the knuckle C, then turned by `tilt`
  const SHADE = 'M-10 8H10V24C26 26 38 38 44 56L68 116H-68L-44 56C-38 38 -26 26 -10 24Z';
  const headT = `translate(${f1(C[0])} ${f1(C[1])}) rotate(${tilt})`;
  const toG = ([x, y]) => { const c = Math.cos(tilt * RAD), s = Math.sin(tilt * RAD); return [C[0] + x * c - y * s, C[1] + x * s + y * c]; };
  const ray = (p, deg) => { const d = [Math.cos(deg * RAD), Math.sin(deg * RAD)], t = (500 - p[1]) / d[1]; return [p[0] + d[0] * t, 500]; };
  const m1 = toG([-62, 118]), m2 = toG([62, 118]), ax = 90 + tilt;
  const r1 = ray(m1, ax + 16), r2 = ray(m2, ax - 16), mid = ray(toG([0, 118]), ax);
  const light = DZ([m1, m2, r2, r1]);
  // non-photo blue, a touch heavier than the kit's construction line so the sketch half still reads at 220 px
  const BLUE = (w = 1.5, ex = '') => `fill="none" stroke="${INK.blue}" stroke-width="${w >= 1.6 ? 2.3 : w >= 1.3 ? 1.6 : 1.3}" stroke-linecap="round" stroke-linejoin="round" ${ex}`;
  const arcAt = (c, r, a0, a1) => { const p = a => [c[0] + r * Math.cos(a * RAD), c[1] + r * Math.sin(a * RAD)]; const [s, e] = [p(a0), p(a1)]; return `M${f1(s[0])} ${f1(s[1])}A${f1(r)} ${f1(r)} 0 0 1 ${f1(e[0])} ${f1(e[1])}`; };
  const aAB = Math.atan2(B[1] - A[1], B[0] - A[0]) / RAD, aBC = Math.atan2(C[1] - B[1], C[0] - B[0]) / RAD;
  const ext = (a, u, s0, b, s1) => D([along(a, u, -s0), along(b, u, s1)]);
  const dot = p => `<circle class="pt" cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.2" fill="${INK.blue}"/>`;
  const bdim = (p, q2, lab, off) => k.dim(p[0], p[1], q2[0], q2[1], lab, { off, color: INK.blue, size: 15 });
  const sketch = `
    <g class="fd">
      <path d="${ext(A, u1, 38, B, 40)}" ${BLUE(1.1, 'stroke-dasharray="20 4 3 4"')}/>
      <path d="${ext(B, u2, 34, C, 40)}" ${BLUE(1.1, 'stroke-dasharray="20 4 3 4"')}/>
      <path d="M182 414V526" ${BLUE(1.1, 'stroke-dasharray="20 4 3 4"')}/>
      <path d="${arcAt(A, Math.hypot(B[0] - A[0], B[1] - A[1]), aAB - 15, aAB + 13)}" ${BLUE(1.1, 'stroke-dasharray="7 5"')}/>
      <path d="${arcAt(B, 180, aBC - 20, aBC + 22)}" ${BLUE(1.1, 'stroke-dasharray="7 5"')}/>
      ${[A, B, C].map(p => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="26" ${BLUE(1, 'stroke-dasharray="4 4"')}/>`).join('')}
    </g>
    <path class="pl" d="${DZ(base)}" ${BLUE(1.7)}/><path class="pl" d="${DZ(collar)}" ${BLUE(1.7)}/>
    ${arms.map(d => `<path class="pl" d="${d}" ${BLUE(1.7)}/>`).join('')}
    <path class="pl" d="${spring}" ${BLUE(1.3)}/>
    ${[A, B].map(p => `<circle class="pl" cx="${f1(p[0])}" cy="${f1(p[1])}" r="14" ${BLUE(1.7)}/>`).join('')}
    <g class="dz-head"><g transform="${headT}">
      <path class="pl" d="${SHADE}" ${BLUE(1.7)}/>
      <circle class="pl" cx="0" cy="0" r="13" ${BLUE(1.7)}/>
      <g class="fd"><path d="M0 -6L78 140M0 -6L-78 140" ${BLUE(1, 'stroke-dasharray="7 5"')}/><path d="M0 -22V150" ${BLUE(1.1, 'stroke-dasharray="20 4 3 4"')}/>
      <circle cx="0" cy="86" r="22" ${BLUE(1.4, 'stroke-dasharray="6 4"')}/><path d="M-9 64V40H9V64" ${BLUE(1.4, 'stroke-dasharray="6 4"')}/></g>
    </g></g>
    <g clip-path="url(#designer-lt)"><g class="dz-beam fd"><path d="${D([m1, r1])}${D([m2, r2])}" ${BLUE(1.2, 'stroke-dasharray="9 6"')}/></g></g>
    <g class="dzd">${bdim(A, B, '300', 34)}${bdim(B, C, '180', -30)}${bdim([110, 500], [254, 500], 'Ø144', 28)}</g>
    ${[A, B, C, mid].map(dot).join('')}`;
  const made = `
    <g clip-path="url(#designer-lt)"><g class="dz-beam"><path d="${light}" fill="${INK.straw}" opacity=".55"/></g></g>
    ${sec(k, base, 'iron')}${sec(k, collar, 'steel', { flip: true })}
    ${k.center(182, 414, 182, 526)}
    ${arms.map(d => `<path d="${d}" fill="${INK.steel2}" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>`).join('')}
    ${k.center(...along(A, u1, -20), ...along(B, u1, 20))}${k.center(...along(B, u2, -20), ...along(C, u2, 22))}
    <path d="${spring}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round" stroke-linecap="round"/>
    <g class="dz-head"><g transform="${headT}">
      <path d="${SHADE}" fill="${INK.alu}" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><path d="M-68 116H68" stroke="${INK.graphite}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="86" r="22" fill="none" ${k.stroke.hidden}/><path d="M-9 64V40H9V64" fill="none" ${k.stroke.hidden}/>
      ${k.center(0, -20, 0, 136)}
      <circle cx="0" cy="0" r="13" fill="${INK.steel}" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="0" cy="0" r="4.5" fill="${INK.graphite}"/>
    </g></g>
    ${[A, B].map(p => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="14" fill="${INK.steel}" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.5" fill="${INK.graphite}"/>`).join('')}
    ${bal(k, 74, 424, 1, 140, 491, 'dz-bal')}${bal(k, 160, 196, 2, ...along(A, u1, 212, n1, -9), 'dz-bal')}
    ${bal(k, 368, 108, 3, ...along(B, u2, 96, n2, -8), 'dz-bal')}${bal(k, 544, 262, 4, ...toG([42, 76]), 'dz-bal')}
    <g class="dz-tb">${k.titleBlock(348, 520, { title: 'DESK LAMP', no: 'SH 01', scale: '1:5', w: 196 })}</g>`;
  return `
    <clipPath id="designer-sk"><rect class="dz-skc" x="0" y="0" width="300" height="600"/></clipPath>
    <clipPath id="designer-mk"><rect class="dz-mkc" x="300" y="0" width="300" height="600"/></clipPath>
    <clipPath id="designer-lt"><rect x="0" y="0" width="600" height="500"/></clipPath>
    <line class="dz-desk" x1="62" y1="500" x2="548" y2="500" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/>
    <rect class="dz-deskh" x="62" y="500" width="486" height="9" fill="${k.hatch('iron')}"/>
    <g class="dz-sk" clip-path="url(#designer-sk)"><rect width="1" height="1" fill="#fff"/>${sketch}</g>
    <g class="dz-mk" clip-path="url(#designer-mk)"><rect width="1" height="1" fill="#fff"/>${made}</g>
    <g class="dz-sweep">
      <line x1="300" y1="66" x2="300" y2="514" stroke="${INK.hot}" stroke-width="${W.med}"/>
      <rect x="291" y="52" width="18" height="14" fill="${INK.hot}"/>
      <g class="dz-drawn">${k.text(286, 63, 'DRAWN', { size: 14, anchor: 'end', fill: INK.blue, weight: 700, spacing: 1.6 })}</g>
      ${k.text(314, 63, 'MADE', { size: 14, anchor: 'start', weight: 700, spacing: 1.6 })}
    </g>`;
}
function designerPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const sk = q('.dz-skc'), mk = q('.dz-mkc'), sw = q('.dz-sweep'), o = `${f1(LAMP.C[0])} ${f1(LAMP.C[1])}`;
  const turn = [...qa('.dz-head'), ...qa('.dz-beam')];
  const t = k.tl();
  k.plot(t, q('.dz-desk'), { dur: .6 });
  k.ink(t, q('.dz-deskh'), { at: .35 });
  k.plot(t, qa('.dz-sk .pl'), { at: .15, stagger: .05, dur: .8 });
  k.ink(t, qa('.dz-sk .fd'), { at: .6, stagger: .04, dur: .6 });
  k.plot(t, qa('.dz-sk .dzd line'), { at: .9, stagger: .03, dur: .4 });
  k.ink(t, qa('.dz-sk .dzd text'), { at: 1.2 });
  k.stamp(t, qa('.dz-sk .pt'), { at: 1.1, stagger: .06 });
  // the made half arrives from the right and stops at the middle
  const E = 'power2.inOut';
  t.fromTo(mk, { attr: { x: 600, width: 0 } }, { attr: { x: 300, width: 300 }, duration: 1.3, ease: E }, 1.5)
    .fromTo(sk, { attr: { width: 600 } }, { attr: { width: 300 }, duration: 1.3, ease: E }, 1.5)
    .fromTo(sw, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3, ease: E }, 1.5);
  k.stamp(t, qa('.dz-bal'), { at: 2.6, stagger: .08 });
  t.from(q('.dz-tb'), { opacity: 0, y: 8, duration: .5 }, 2.5);
  if (k.reduced()) return t;
  // sketch → part across the whole lamp; it works (the head nods, the light moves); then back to half and half
  gsap.timeline({ repeat: -1, delay: 4.2, repeatDelay: 1.6 })
    .to(mk, { attr: { x: 62, width: 538 }, duration: 1.9, ease: E })
    .to(sk, { attr: { width: 62 }, duration: 1.9, ease: E }, '<')
    .to(sw, { x: -238, duration: 1.9, ease: E }, '<')
    .to(q('.dz-drawn'), { opacity: 0, duration: .5 }, '<.9')
    .to(turn, { rotation: 9, svgOrigin: o, duration: 1.1, ease: E }, '>.1')
    .to(turn, { rotation: 0, svgOrigin: o, duration: 1.1, ease: E }, '>.3')
    .to(mk, { attr: { x: 300, width: 300 }, duration: 1.9, ease: E }, '>.2')
    .to(sk, { attr: { width: 300 }, duration: 1.9, ease: E }, '<')
    .to(sw, { x: 0, duration: 1.9, ease: E }, '<')
    .to(q('.dz-drawn'), { opacity: 1, duration: .5 }, '<.9');
  return t;
}


/* ======================================================================================================
   sequence — the Product Design Sequence (L1·S3) as an optics drawing: parallel rays enter, three lenses (glass,
   in section) focus them to points and they spread again; the six steps stand on the stations (balloons) and the
   parts list names them. Loop: a band of light travels through; each station it reaches lights its balloon and row.
   ====================================================================================================== */
const SQ = { y0: 392, H: 76, xs: [124, 200, 276, 352, 428, 500], h: [-64, -50, -36, -22, -8, 8, 22, 36, 50, 64] };
const SQ_STEPS = ['Product Identification / Design Team Formed', 'Product Defined', 'Concept Development', 'Concept Presentation', 'Product Development', 'Product Presentation'];
const lensD = (x, y0, H, sag) => { const R = f1((H * H + sag * sag) / (2 * sag)); return `M${x} ${y0 - H}A${R} ${R} 0 0 1 ${x} ${y0 + H}A${R} ${R} 0 0 1 ${x} ${y0 - H}Z`; };
function sequenceDraw(k) {
  const { INK, W } = k; const { y0, H, xs, h } = SQ;
  const rays = h.map(v => D([[44, y0 + v], [xs[0], y0 + v], [xs[1], y0], [xs[2], y0 - v], [xs[3], y0], [xs[4], y0 + v], [xs[5], y0], [562, y0 - v * 62 / 72]]));
  const T = { x: 70, y: 46, w: 460, rh: 24, c: 110 };
  const rowY = i => T.y + T.rh * (i + 1);
  let tab = SQ_STEPS.map((_, i) => `<rect class="sq-hi" x="${T.x}" y="${rowY(i)}" width="${T.w}" height="${T.rh}" fill="${INK.straw}" opacity="0"/>`).join('');
  tab += `<rect class="pl" x="${T.x}" y="${T.y}" width="${T.w}" height="${T.rh * 7}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>`;
  tab += `<line class="pl" x1="${T.x}" y1="${rowY(0)}" x2="${T.x + T.w}" y2="${rowY(0)}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`;
  tab += `<line class="pl" x1="${T.c}" y1="${T.y}" x2="${T.c}" y2="${T.y + T.rh * 7}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`;
  for (let i = 1; i < 6; i++) tab += `<line class="pl" x1="${T.x}" y1="${rowY(i)}" x2="${T.x + T.w}" y2="${rowY(i)}" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>`;
  tab += k.text((T.x + T.c) / 2, T.y + 16.5, 'ITEM', { size: 12, weight: 700, spacing: 1 }) + k.text(T.c + 12, T.y + 16.5, 'PRODUCT DESIGN SEQUENCE', { size: 12, weight: 700, spacing: 1.4, anchor: 'start' });
  tab += SQ_STEPS.map((s, i) => k.text((T.x + T.c) / 2, rowY(i) + 17, i + 1, { size: 15, weight: 700 }) + k.text(T.c + 12, rowY(i) + 17, s, { size: 16, weight: 500, anchor: 'start' })).join('');
  const lenses = [0, 2, 4].map(i => `<g class="sq-lens"><path class="h" d="${lensD(xs[i], y0, H, 11)}" fill="${INK.straw}" opacity=".35"/><path class="h" d="${lensD(xs[i], y0, H, 11)}" fill="${k.hatch('glass')}"/><path class="o" d="${lensD(xs[i], y0, H, 11)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>`).join('');
  const by = 268;
  const ticks = xs.map((x, i) => `<line class="sq-tick" x1="${x}" y1="${by + 14}" x2="${x}" y2="${i % 2 ? y0 - 6 : y0 - H - 4}" stroke="${INK.graphite}" stroke-width="${W.hair}"/>`).join('');
  const balloons = xs.map((x, i) => `<g class="sq-b"><circle cx="${x}" cy="${by}" r="14" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/><circle class="sq-bh" cx="${x}" cy="${by}" r="12.5" fill="${INK.straw}" opacity="0"/>${k.text(x, by + 5.5, i + 1, { size: 15, weight: 700 })}</g>`).join('');
  return `
    <g class="sq-tab">${tab}</g>
    <clipPath id="sequence-pulse"><rect class="sq-pc" x="-100" y="290" width="84" height="210"/></clipPath>
    <g clip-path="url(#sequence-pulse)"><rect width="1" height="1" fill="#fff"/>${rays.map(d => `<path d="${d}" fill="none" stroke="${INK.straw}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}</g>
    <g class="sq-axis">${k.center(36, y0, 566, y0)}</g>
    ${rays.map(d => `<path class="sq-ray" d="${d}" fill="none" stroke="${INK.graphite}" stroke-width="1.4" stroke-linejoin="round"/>`).join('')}
    ${lenses}${ticks}${balloons}
    ${['Aesthetics', 'Analysis', 'Synthesis'].map((s, i) => `<g class="sq-lab">${k.text(xs[i * 2], y0 + H + 36, s, { size: 22, weight: 700 })}</g>`).join('')}`;
}
function sequencePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.ink(t, q('.sq-axis'), { at: 0, dur: .6 });
  k.plot(t, qa('.sq-lens .o'), { at: .05, stagger: .14, dur: .7 });
  k.ink(t, qa('.sq-lens .h'), { at: .55, stagger: .1 });
  k.plot(t, qa('.sq-ray'), { at: .25, stagger: .035, dur: 1.2, ease: 'power1.inOut' });
  k.stamp(t, qa('.sq-lab'), { at: .9, stagger: .1 });
  k.plot(t, qa('.sq-tab .pl'), { at: .8, stagger: .03, dur: .5 });
  k.ink(t, qa('.sq-tab text'), { at: 1.1, stagger: .025 });
  k.plot(t, qa('.sq-tick'), { at: 1.25, stagger: .05, dur: .35 });
  k.stamp(t, qa('.sq-b'), { at: 1.4, stagger: .07 });
  if (k.reduced()) return t;
  const pc = q('.sq-pc'), bh = qa('.sq-bh'), hi = qa('.sq-hi'), v = 140, run = 720 / v;
  const L = gsap.timeline({ repeat: -1, delay: 2.8, repeatDelay: .9 });
  L.fromTo(pc, { attr: { x: -100 } }, { attr: { x: 620 }, duration: run, ease: 'none', immediateRender: false }, 0);
  SQ.xs.forEach((x, i) => { const at = (x - 84 + 100) / v; L.to(bh[i], { opacity: 1, duration: .35 }, at).to(hi[i], { opacity: .55, duration: .35 }, at); });
  L.to([...bh, ...hi], { opacity: 0, duration: .7 }, run + .5);
  return t;
}

/* ======================================================================================================
   considerations — the two rows that feed one lens: personal & individual (red pencil, freehand, few, loose)
   and objective (blue, ruled, many, in order). The words are the slide's, under Aesthetics. Loop: the personal
   ones arrive at their own pace, the objective ones march in step; both focus to one point — the decision.
   ====================================================================================================== */
const CN = { lx: 380, y0: 300, H: 150, F: [520, 300] };
const CN_PER = [['style', 56, 178, 200], ['ego', 98, 224, 232], ['marketing/advertising', 52, 272, 264]];
const CN_OBJ = ['ergonomics', 'engineering', 'marketing', 'investment/profit', 'national/international sales', 'shipping/distribution', 'CPSA/UL/FDA'];
function considerationsDraw(k) {
  const { INK, W } = k; const { lx, y0, H, F } = CN;
  const per = CN_PER.map(([w, sx, sy, ly], i) => {
    const r = seeded(17 + i * 31), pts = [];
    for (let j = 0; j <= 8; j++) { const p = j / 8, tp = Math.sin(p * Math.PI); pts.push([sx + (lx - sx) * p, sy + (ly - sy) * p + tp * (r() - .5) * 30]); }
    return { w, sx, sy, d: smooth(pts) + `L${F[0]} ${F[1]}` };
  });
  const obj = CN_OBJ.map((w, i) => { const y = 328 + i * 20; return { w, y, d: `M224 ${y - 4.5}H${lx}L${F[0]} ${F[1]}` }; });
  const lens = lensD(lx, y0, H, 20);
  return `
    <g class="cn-head">${k.text(52, 140, 'PERSONAL &amp; INDIVIDUAL', { size: 15, weight: 700, spacing: 1.4, anchor: 'start', fill: INK.red })}</g>
    <g class="cn-head">${k.text(216, 304, 'OBJECTIVE', { size: 15, weight: 700, spacing: 1.4, anchor: 'end', fill: INK.blue })}</g>
    ${obj.map(o => `<path class="cn-obj" d="${o.d}" fill="none" stroke="${INK.blue}" stroke-width="1.8" stroke-linejoin="round"/>`).join('')}
    ${obj.map(o => `<g class="cn-objw">${k.text(216, o.y, o.w, { size: 14, weight: 600, anchor: 'end', fill: INK.blue })}</g>`).join('')}
    ${per.map(p => `<path class="cn-per" d="${p.d}" fill="none" stroke="${INK.red}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}
    ${per.map(p => `<g class="cn-perw">${k.text(p.sx, p.sy - 12, p.w, { size: 17, weight: 500, anchor: 'start', fill: INK.red, family: 'text', extra: 'font-style="italic"' })}</g>`).join('')}
    ${per.map(p => `<path class="cn-pp" d="${p.d}" fill="none" stroke="${INK.red}" stroke-width="6" stroke-linecap="round" opacity="0"/>`).join('')}
    ${obj.map(o => `<path class="cn-op" d="${o.d}" fill="none" stroke="${INK.blue}" stroke-width="5" stroke-linecap="round" opacity="0"/>`).join('')}
    <g class="cn-lens"><path class="h" d="${lens}" fill="${INK.straw}" opacity=".35"/><path class="h" d="${lens}" fill="${k.hatch('glass')}"/><path class="o" d="${lens}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.center(lx - 40, y0, lx + 40, y0)}</g>
    <g class="cn-lab">${k.text(lx, y0 + H + 36, 'Aesthetics', { size: 21, weight: 700 })}</g>
    <g class="cn-f">
      <circle class="cn-dec" cx="${F[0]}" cy="${F[1]}" r="11" fill="${INK.straw}" opacity="0"/>
      <circle class="cn-rr" cx="${F[0]}" cy="${F[1]}" r="16" fill="none" stroke="${INK.red}" stroke-width="${W.med}" opacity="0"/>
      <circle class="cn-br" cx="${F[0]}" cy="${F[1]}" r="23" fill="none" stroke="${INK.blue}" stroke-width="${W.med}" opacity="0"/>
      <circle cx="${F[0]}" cy="${F[1]}" r="5.5" fill="${INK.graphite}"/>
      ${k.arrow(F[0] + 12, F[1], 562, F[1], { color: INK.graphite, w: 3 })}
    </g>`;
}
function considerationsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(qa('.cn-head'), { opacity: 0, y: 6, duration: .5, stagger: .15 }, 0);
  k.plot(t, qa('.cn-lens .o'), { at: .05, dur: .8 });
  k.ink(t, qa(`.cn-lens .h, ${CL}`), { at: .5 });
  k.plot(t, qa('.cn-obj'), { at: .3, stagger: .07, dur: .9, ease: 'power1.inOut' });   // in order: an even rhythm
  k.ink(t, qa('.cn-objw'), { at: .3, stagger: .07 });
  k.plot(t, qa('.cn-per'), { at: .45, stagger: .26, dur: 1.3, ease: 'sine.inOut' });   // loose: slower, uneven
  k.ink(t, qa('.cn-perw'), { at: .45, stagger: .26 });
  k.ink(t, q('.cn-lab'), { at: 1.1 });
  k.stamp(t, q('.cn-f'), { at: 1.6 });
  if (k.reduced()) return t;
  const per = qa('.cn-pp'), obj = qa('.cn-op');
  const prime = el => { const L = Math.ceil(el.getTotalLength()) + 2; gsap.set(el, { strokeDasharray: `36 ${L + 60}`, strokeDashoffset: 36, opacity: 1 }); return L; };
  const Lp = per.map(prime), Lo = obj.map(prime);
  const C = gsap.timeline({ repeat: -1, delay: 2.6, repeatDelay: 1 });
  [[0, 1.9], [.4, 1.5], [.15, 2.3]].forEach(([at, d], i) => C.fromTo(per[i], { strokeDashoffset: 36 }, { strokeDashoffset: -Lp[i], duration: d, ease: 'sine.inOut', immediateRender: false }, at));
  C.to(q('.cn-rr'), { opacity: 1, duration: .4 }, 2.25);
  obj.forEach((el, i) => C.fromTo(el, { strokeDashoffset: 36 }, { strokeDashoffset: -Lo[i], duration: 1.5, ease: 'none', immediateRender: false }, 2.8 + i * .09));
  C.to(q('.cn-br'), { opacity: 1, duration: .4 }, 4.75)
    .to(q('.cn-dec'), { opacity: 1, scale: 1.25, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, 5.1)
    .to([q('.cn-rr'), q('.cn-br'), q('.cn-dec')], { opacity: 0, scale: 1, duration: .7 }, 6.5);
  return t;
}

/* ======================================================================================================
   the four-view sheet shared by methods · cuttingM · joining: a frame cut into four views, each with its title,
   each a machine that works in turn (its title is underlined in straw while it runs)
   ====================================================================================================== */
const CELLS = [[48, 56], [302, 56], [48, 306], [302, 306]];
function cellsDraw(k, cells) {
  const { INK, W } = k;
  return `<g class="cl-frame"><rect class="pl" x="48" y="56" width="504" height="494" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
      <line class="pl" x1="300" y1="56" x2="300" y2="550" stroke="${INK.graphite}" stroke-width="${W.thin}"/><line class="pl" x1="48" y1="303" x2="552" y2="303" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>
    ${cells.map((c, i) => `<g class="cell" transform="translate(${CELLS[i][0]} ${CELLS[i][1]})">
      <g class="cl-lab">${k.text(16, 33, c.label, { size: 21, anchor: 'start', weight: 700, spacing: 1.4 })}<rect class="cl-ul" x="16" y="40" width="${f1(c.label.length * 11.6)}" height="5" fill="${INK.straw}" opacity="0"/></g>
      <g transform="translate(${c.at[0]} ${c.at[1]}) scale(${c.s})">${c.body}</g></g>`).join('')}`;
}
function cellsPlay(svg, k, works, resets, preps = []) {
  const { gsap } = k; const [, qa] = sel(svg);
  const cells = qa('.cell');
  if (!k.reduced()) cells.forEach((c, i) => preps[i] && preps[i](c, gsap));
  const t = k.tl();
  k.plot(t, qa('.cl-frame .pl'), { dur: .6, stagger: .08 });
  cells.forEach((c, i) => {
    const at = .25 + i * .14;
    t.from(c.querySelector('.cl-lab text'), { opacity: 0, x: -8, duration: .45 }, at);
    k.plot(t, c.querySelectorAll('.o'), { at: at + .05, stagger: .03, dur: .55 });
    k.ink(t, c.querySelectorAll('.h'), { at: at + .5, stagger: .012 });
    k.ink(t, c.querySelectorAll(`.fx, ${CL}`), { at: at + .8 });
  });
  if (k.reduced()) return t;
  gsap.set(qa('.cl-ul'), { transformOrigin: '0% 50%' }); // set once, before any scale: changing it mid-transform leaves an offset
  const L = gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: .4 });
  let at = 0;
  cells.forEach((c, i) => {
    const ul = c.querySelector('.cl-ul');
    L.fromTo(ul, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power2.out', immediateRender: false }, at);
    const d = works[i](L, c, at + .15);
    L.to(ul, { opacity: 0, duration: .4 }, at + .15 + d);
    at += d + .2;
  });
  cells.forEach((c, i) => resets[i] && resets[i](L, c, at + .2));
  L.to({}, { duration: .2 }, at + 1.2);
  return t;
}

/* methods — the four families of manufacturing methods (L1·S7), each as its machine: a part pressed, a sheet
   sheared, a joint bolted, a coat sprayed. They work in turn. */
function methodsDraw(k) {
  return cellsDraw(k, [
    { label: 'FORMING', body: vpressDraw(k), at: [125, 150], s: 1 },
    { label: 'CUTTING', body: shearDraw(k), at: [132, 158], s: .97 },
    { label: 'JOINING', body: boltDraw(k), at: [125, 132], s: 1.25 },
    { label: 'FINISHING', body: sprayDraw(k, 'methods'), at: [114, 164], s: 1.1 }
  ]);
}
const methodsPlay = (svg, k) => cellsPlay(svg, k, [vpressWork, shearWork, boltWork, sprayWork], [vpressReset, shearReset, boltReset, sprayReset]);

/* ======================================================================================================
   forming — the three forming states (L1·S7), hottest to coldest: liquid (a ladle tips into a sand mould, the metal
   rises and freezes) · plastic (a hot billet squeezed between flat dies: it shortens and barrels) · solid (a cold
   sheet bent in a press brake). A temperature bar under the floor ranks them. They work in turn.
   ====================================================================================================== */
const FM_CAV = [[66, 386], [148, 386], [148, 330], [160, 330], [160, 386], [172, 386], [172, 410], [138, 410], [138, 446], [100, 446], [100, 410], [66, 410]];
const FM_BILLET = 'M270 330L330 330Q336 375 330 420L270 420Q264 375 270 330Z';
function formingDraw(k) {
  const { INK, W } = k; const cx = [120, 300, 480];
  const labels = ['LIQUID', 'PLASTIC', 'SOLID'].map((s, i) => `<g class="fm-lab">${k.text(cx[i], 86, s, { size: 27, weight: 700, spacing: 1.5 })}${k.text(cx[i], 106, 'STATE', { size: 13, weight: 600, spacing: 3, fill: INK.graphite3 })}</g>`).join('');
  const ladle = `<g class="fm-ladle">
      <path class="o" d="M82 228C82 150 148 150 148 228" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      ${sec(k, [[78, 196], [152, 196], [144, 264], [86, 264]], 'refractory')}
      <path d="${DZ([[89, 205], [141, 205], [135.5, 254], [94.5, 254]])}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
      <path class="h" d="${DZ([[90, 214], [140, 214], [135, 253], [95, 253]])}" fill="${INK.hot}"/>
    </g>`;
  const mould = `${sec(k, box(52, 330, 136, 70), 'stipple')}${sec(k, box(52, 400, 136, 70), 'stipple')}
    <path d="${DZ(FM_CAV)}" fill="#fff"/>
    <clipPath id="forming-melt"><rect class="fm-lvl" x="52" y="446" width="136" height="0"/></clipPath>
    <g clip-path="url(#forming-melt)"><path class="fm-hot" d="${DZ(FM_CAV)}" fill="${INK.hot}"/><path class="fm-cold" d="${DZ(FM_CAV)}" fill="${INK.steel}" opacity="0"/></g>
    <path class="o" d="${DZ(FM_CAV)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <line class="fm-stream" x1="154" y1="200" x2="154" y2="331" stroke="${INK.hot}" stroke-width="7" stroke-linecap="round" opacity="0"/>`;
  const plastic = `${sec(k, box(236, 420, 128, 50), 'steel')}
    <g class="fm-billet"><path class="h" d="${FM_BILLET}" fill="${INK.hot}" opacity=".85"/><path class="o" d="${FM_BILLET}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
    <g class="fm-ram">${sec(k, box(236, 184, 128, 50), 'steel', { flip: true })}<g class="fx">${k.arrow(300, 124, 300, 176)}</g></g>`;
  return `
    <defs><linearGradient id="forming-temp" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${INK.hot}"/><stop offset=".5" stop-color="${INK.straw}"/><stop offset="1" stop-color="${INK.steel}"/></linearGradient></defs>
    ${labels}
    <g class="fm-div">${[210, 390].map(x => `<line x1="${x}" y1="64" x2="${x}" y2="456" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>`).join('')}</g>
    ${mould}${ladle}${plastic}
    <g class="fm-vp" transform="translate(480 388) scale(.95)">${vpressDraw(k)}</g>
    <line class="o" x1="44" y1="470" x2="556" y2="470" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/>
    <rect class="h" x="44" y="470" width="512" height="8" fill="${k.hatch('iron')}"/>
    <g class="fm-temp"><rect x="60" y="494" width="480" height="8" fill="url(#forming-temp)" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
      ${cx.map(x => `<path d="M${x} 505l6 10h-12z" fill="${INK.graphite}"/>`).join('')}
      ${k.text(60, 532, 'HOT', { size: 13, weight: 700, spacing: 2, anchor: 'start', fill: INK.hot })}${k.text(540, 532, 'COLD', { size: 13, weight: 700, spacing: 2, anchor: 'end', fill: INK.graphite2 })}</g>`;
}
function formingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.stamp(t, qa('.fm-lab'), { stagger: .12 });
  k.ink(t, q('.fm-div'), { at: .1 });
  k.plot(t, qa('.o'), { at: .15, stagger: .025, dur: .6 });
  k.ink(t, qa('.h'), { at: .7, stagger: .015 });
  k.ink(t, qa(`.fx, ${CL}`), { at: 1.1 });
  t.from(q('.fm-temp'), { opacity: 0, y: 8, duration: .6 }, 1);
  if (k.reduced()) return t;
  const ladle = q('.fm-ladle'), st = q('.fm-stream'), lvl = q('.fm-lvl'), hot = q('.fm-hot'), cold = q('.fm-cold');
  const ram = q('.fm-ram'), bil = q('.fm-billet'), vp = q('.fm-vp');
  const Ls = primeStroke(st); st.setAttribute('opacity', 1);
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .4 });
  // liquid: tip, pour, the metal rises in the mould, stop, right the ladle, it freezes
  L.to(ladle, { rotation: 52, svgOrigin: '152 196', duration: .8, ease: 'power2.inOut' }, 0)
    .fromTo(st, { strokeDashoffset: Ls }, { strokeDashoffset: 0, duration: .35, ease: 'power1.in', immediateRender: false }, .65)
    .to(lvl, { attr: { y: 330, height: 116 }, duration: 1.4, ease: 'power1.inOut' }, .95)
    .to(st, { strokeDashoffset: -Ls, duration: .35, ease: 'power1.in' }, 2.3)
    .to(ladle, { rotation: 0, svgOrigin: '152 196', duration: .8, ease: 'power2.inOut' }, 2.35)
    .to(hot, { opacity: 0, duration: 1 }, 2.6).to(cold, { opacity: 1, duration: 1 }, 2.6);
  // plastic: the dies close on the hot billet
  L.to(ram, { y: 96, duration: .5, ease: 'power1.in' }, 2.5)
    .to(ram, { y: 141, duration: .6, ease: 'power1.out' }, 3)
    .to(bil, { scaleY: .5, scaleX: 1.5, svgOrigin: '300 420', duration: .6, ease: 'power1.out' }, 3)
    .to(ram, { y: 0, duration: .9, ease: 'power2.inOut' }, 3.9);
  // solid: the cold sheet is bent
  vpressWork(L, vp, 4.5);
  const r = 7.2;
  L.to([hot, cold], { opacity: 0, duration: .4 }, r).set(lvl, { attr: { y: 446, height: 0 } }, r + .42).set(hot, { opacity: 1 }, r + .44)
    .to(bil, { opacity: 0, duration: .35 }, r).set(bil, { scaleX: 1, scaleY: 1, svgOrigin: '300 420' }, r + .36).to(bil, { opacity: 1, duration: .35 }, r + .4);
  vpressReset(L, vp, r);
  L.to({}, { duration: .1 }, r + 1);
  return t;
}

/* ======================================================================================================
   cuttingM — the four cutting families (L1·S7): sheet cutting (a shear), chip forming (a tool peels a curling chip
   off the work), nonchip (spark erosion: a copper electrode sinks into steel in a dielectric bath — no chips),
   flame/laser (a beam cuts the plate in two, sparks out of the bottom). They work in turn.
   ====================================================================================================== */
const CHIP = 'M2 6C-1 -14 -1 -34 9 -46C20 -60 44 -56 45 -37C46 -20 27 -15 22 -28C19 -37 29 -43 34 -35';
function chipDraw(k) {
  const { INK } = k;
  return `<clipPath id="cuttingM-layer"><rect class="ch-clip" x="-70" y="-12" width="170" height="24"/></clipPath>
    ${sec(k, box(-100, 10, 200, 52), 'steel')}
    <g class="ch-layer" clip-path="url(#cuttingM-layer)"><rect width="1" height="1" fill="#fff"/>${sec(k, box(-100, -2, 200, 12), 'steel')}</g>
    <g class="ch-tool" transform="translate(-70 0)">
      <path class="ch-c" d="${CHIP}" fill="none" stroke="${INK.graphite}" stroke-width="11"/>
      <path class="ch-c" d="${CHIP}" fill="none" stroke="${INK.steel2}" stroke-width="6"/>
      ${sec(k, [[0, 10], [-4, -52], [-48, -52], [-48, 2]], 'steel', { flip: true })}
      <g class="fx">${k.arrow(-70, -74, -24, -74)}</g>
    </g>`;
}
function chipPrep(g) { g._lc = [...g.querySelectorAll('.ch-c')].map(primeStroke); }
function chipWork(L, g, at) {
  const q = s => g.querySelector(s), c = [...g.querySelectorAll('.ch-c')];
  L.to(q('.ch-tool'), { x: 66, duration: 1.7, ease: 'none' }, at)
    .to(q('.ch-clip'), { attr: { x: 66, width: 34 }, duration: 1.7, ease: 'none' }, at)
    .fromTo(c, { strokeDashoffset: i => g._lc[i] }, { strokeDashoffset: 0, duration: 1.7, ease: 'power1.out', immediateRender: false }, at);
  return 1.8;
}
function chipReset(L, g, at) {
  const q = s => g.querySelector(s), c = [...g.querySelectorAll('.ch-c')], lay = q('.ch-layer');
  L.to(c, { opacity: 0, y: 24, duration: .45, ease: 'power2.in' }, at)          // the chip breaks off
    .to(lay, { opacity: 0, duration: .3 }, at)
    .to(q('.ch-tool'), { x: -70, duration: .9, ease: 'power2.inOut' }, at + .3)
    .set(q('.ch-clip'), { attr: { x: -70, width: 170 } }, at + .35)
    .to(lay, { opacity: 1, duration: .4 }, at + .5)
    .set(c, { opacity: 1, y: 0, strokeDashoffset: i => g._lc[i] }, at + .5);
}
const EDM_HEAD = [[-30, -48], [30, -48], [30, -20], [18, -6], [-18, -6], [-30, -20]];
const EDM_CAV = [[-33, 22], [33, 22], [33, 37], [19.5, 53], [-19.5, 53], [-33, 37]];
function edmDraw(k) {
  const { INK, W } = k;
  return `<path class="h" d="${DZ(box(-98, -28, 196, 98))}" fill="${k.hatch('water')}"/>
    <path class="o" d="M-100 -46V72H100V-46" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
    <path class="o" d="M-98 -28H98" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}"/>
    ${sec(k, box(-74, 22, 148, 48), 'steel')}
    <clipPath id="cuttingM-cav"><rect class="ed-clip" x="-40" y="22" width="80" height="0"/></clipPath>
    <g class="ed-cav" clip-path="url(#cuttingM-cav)"><path d="${DZ(EDM_CAV)}" fill="#fff"/><path d="${DZ(EDM_CAV)}" fill="${k.hatch('water')}"/><path d="${DZ(EDM_CAV)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>
    <g class="ed-el">${sec(k, box(-8, -112, 16, 64), 'bronze')}${sec(k, EDM_HEAD, 'bronze', { flip: true })}
      <g class="ed-sp" opacity="0">${[-17, -7, 3, 13].map(x => `<path d="M${x} -4l4 3l-4 3l4 3" fill="none" stroke="${INK.hot}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g></g>`;
}
function edmWork(L, g, at) {
  const q = s => g.querySelector(s), el = q('.ed-el'), sp = q('.ed-sp');
  L.to(el, { y: 26, duration: .5, ease: 'power1.inOut' }, at)
    .to(sp, { opacity: 1, duration: .25 }, at + .45)
    .to(sp, { opacity: .3, duration: .3, repeat: 4, yoyo: true, ease: 'sine.inOut' }, at + .7)
    .to(el, { y: 56, duration: 1.8, ease: 'none' }, at + .5)
    .to(q('.ed-clip'), { attr: { height: 31 }, duration: 1.8, ease: 'none' }, at + .5)
    .to(sp, { opacity: 0, duration: .25 }, at + 2.25)
    .to(el, { y: 0, duration: .8, ease: 'power2.inOut' }, at + 2.4);
  return 2.6;
}
function edmReset(L, g, at) {
  const q = s => g.querySelector(s);
  L.to(q('.ed-cav'), { opacity: 0, duration: .4 }, at).set(q('.ed-clip'), { attr: { height: 0 } }, at + .42).set(q('.ed-cav'), { opacity: 1 }, at + .44);
}
function laserDraw(k) {
  const { INK, W } = k;
  const sparks = [62, 74, 86, 98, 110, 122].map((a, i) => { const r = [26, 34, 22, 36, 28, 20][i]; return `<line x1="0" y1="50" x2="${f1(Math.cos(a * RAD) * r)}" y2="${f1(50 + Math.sin(a * RAD) * r)}" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
  return `${[-72, 72].map(x => solid(k, [[x, 46], [x + 10, 64], [x - 10, 64]], INK.steel2)).join('')}
    <path class="h" d="${DZ(box(-100, 30, 100, 16))}" fill="${k.hatch('steel')}"/>${thinPath(k, 'M0 30H-100V46H0', 'o', W.thick)}
    <g class="lz-r"><path class="h" d="${DZ(box(0, 30, 100, 16))}" fill="${k.hatch('steel')}"/>${thinPath(k, 'M0 30H100V46H0', 'o', W.thick)}</g>
    <g class="lz-k" opacity="0"><rect x="-2.5" y="30" width="5" height="16" fill="#fff"/><path d="M-2.5 30V46M2.5 30V46" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
    <line class="lz-beam" x1="0" y1="-20" x2="0" y2="50" stroke="${INK.hot}" stroke-width="3.4" opacity="0"/>
    <circle class="lz-spot" cx="0" cy="30" r="6" fill="${INK.hot}" opacity="0"/>
    <g class="lz-sp" opacity="0">${sparks}</g>
    ${solid(k, box(-24, -106, 48, 42), INK.steel2)}${solid(k, [[-18, -64], [18, -64], [6, -20], [-6, -20]], INK.steel2)}`;
}
function laserWork(L, g, at) {
  const q = s => g.querySelector(s);
  L.to([q('.lz-beam'), q('.lz-spot')], { opacity: 1, duration: .25 }, at)
    .to(q('.lz-sp'), { opacity: 1, duration: .25 }, at + .2)
    .fromTo(q('.lz-sp'), { scaleY: .75 }, { scaleY: 1.15, svgOrigin: '0 50', duration: .3, repeat: 3, yoyo: true, ease: 'sine.inOut', immediateRender: false }, at + .2)
    .fromTo(q('.lz-k'), { opacity: 1, scaleY: 0 }, { scaleY: 1, svgOrigin: '0 30', duration: 1.1, ease: 'none', immediateRender: false }, at + .2)
    .to([q('.lz-beam'), q('.lz-spot'), q('.lz-sp')], { opacity: 0, duration: .25 }, at + 1.4)
    .to(q('.lz-r'), { x: 10, y: 6, rotation: -7, svgOrigin: '72 46', duration: .6, ease: 'power2.in' }, at + 1.55);
  return 2.2;
}
function laserReset(L, g, at) {
  const q = s => g.querySelector(s), r = q('.lz-r');
  L.to([r, q('.lz-k')], { opacity: 0, duration: .4 }, at).set(r, { x: 0, y: 0, rotation: 0, svgOrigin: '72 46' }, at + .42).to(r, { opacity: 1, duration: .4 }, at + .45);
}
function cuttingMDraw(k) {
  return cellsDraw(k, [
    { label: 'SHEET CUTTING', body: shearDraw(k), at: [132, 158], s: .97 },
    { label: 'CHIP FORMING', body: chipDraw(k), at: [129, 158], s: 1.02 },
    { label: 'NONCHIP', body: edmDraw(k), at: [125, 162], s: 1.02 },
    { label: 'FLAME / LASER', body: laserDraw(k), at: [125, 150], s: 1.05 }
  ]);
}
const cuttingMPlay = (svg, k) => cellsPlay(svg, k, [shearWork, chipWork, edmWork, laserWork], [shearReset, chipReset, edmReset, laserReset], [null, chipPrep]);

/* ======================================================================================================
   joining — the four joining families (L1·S7) as joints in section: solder/braze (a torch heats a copper lap joint,
   the filler runs into the gap and makes its fillets), weld (the bead fills the V between two plates, then cools
   black, as welds are drawn), adhesive (a glue bead squeezed into a glue line), mechanical (bolt and nut clamp).
   ====================================================================================================== */
const SD_FL = 'M-40 -4Q-42 10 -60 12L-40 12Z', SD_FR = 'M40 28Q42 10 60 8L40 8Z';
function solderDraw(k) {
  const { INK, W } = k; const grey = INK.graphite3;
  const two = d => `<path class="sd-h" d="${d}" fill="${INK.hot}" opacity="0"/><path class="sd-c" d="${d}" fill="${grey}"/>`;
  return `${sec(k, box(-92, 12, 132, 22), 'bronze')}${sec(k, box(-40, -14, 132, 22), 'bronze', { flip: true })}
    <g class="sd-fl">${two(SD_FL)}</g><g class="sd-fr">${two(SD_FR)}</g>
    <clipPath id="joining-film"><rect class="sd-clip" x="-40" y="6" width="80" height="8"/></clipPath>
    <g clip-path="url(#joining-film)">${two(DZ(box(-40, 8, 80, 4)))}</g>
    <line class="sd-rod" x1="-100" y1="-48" x2="-48" y2="-6" stroke="${grey}" stroke-width="5" stroke-linecap="round"/>
    <g class="sd-flame" opacity="0"><path d="M0 37C14 52 12 74 0 82C-12 74 -14 52 0 37Z" fill="${INK.hot}" fill-opacity=".3" stroke="${INK.hot}" stroke-width="${W.med}"/><path d="M0 52C6 59 6 70 0 75C-6 70 -6 59 0 52Z" fill="${INK.hot}"/></g>
    ${solid(k, box(-8, 82, 16, 16), INK.steel2)}`;
}
function solderPrep(g, gsap) {
  const q = s => g.querySelector(s);
  gsap.set(g.querySelectorAll('.sd-h'), { opacity: 1 }); gsap.set(g.querySelectorAll('.sd-c'), { opacity: 0 });
  gsap.set(q('.sd-fl'), { scale: 0, svgOrigin: '-40 12' }); gsap.set(q('.sd-fr'), { scale: 0, svgOrigin: '40 8' }); gsap.set(q('.sd-clip'), { attr: { width: 0 } });
}
function solderWork(L, g, at) {
  const q = s => g.querySelector(s), fx = q('.sd-flame'), rod = q('.sd-rod');
  L.to(fx, { opacity: 1, duration: .3 }, at)
    .fromTo(fx, { scaleY: .92 }, { scaleY: 1.08, svgOrigin: '0 82', duration: .3, repeat: 5, yoyo: true, ease: 'sine.inOut', immediateRender: false }, at)
    .to(rod, { x: 7, y: 6, duration: .4, ease: 'power1.inOut' }, at + .3)
    .to(q('.sd-fl'), { scale: 1, svgOrigin: '-40 12', duration: .5, ease: 'power2.out' }, at + .5)
    .to(q('.sd-clip'), { attr: { width: 80 }, duration: .8, ease: 'power1.inOut' }, at + .85)
    .to(q('.sd-fr'), { scale: 1, svgOrigin: '40 8', duration: .45, ease: 'power2.out' }, at + 1.55)
    .to(rod, { x: 0, y: 0, duration: .4 }, at + 1.6)
    .to(fx, { opacity: 0, duration: .3 }, at + 1.85)
    .to(g.querySelectorAll('.sd-h'), { opacity: 0, duration: .7 }, at + 1.95).to(g.querySelectorAll('.sd-c'), { opacity: 1, duration: .7 }, at + 1.95);
  return 2.7;
}
function solderReset(L, g, at) {
  const q = s => g.querySelector(s), c = g.querySelectorAll('.sd-c');
  L.to(c, { opacity: 0, duration: .4 }, at)
    .set(g.querySelectorAll('.sd-h'), { opacity: 1 }, at + .42).set(q('.sd-fl'), { scale: 0, svgOrigin: '-40 12' }, at + .42)
    .set(q('.sd-fr'), { scale: 0, svgOrigin: '40 8' }, at + .42).set(q('.sd-clip'), { attr: { width: 0 } }, at + .42);
}
const WELD_BEAD = 'M-21 -8Q0 -25 21 -8L16 -8L3 30Q0 36 -3 30L-16 -8Z';
function weldDraw(k) {
  const { INK } = k;
  const sparks = [-160, -130, -105, -80, -50, -25].map((a, i) => { const r = [14, 20, 16, 22, 15, 12][i]; return `<line x1="${f1(8 + Math.cos(a * RAD) * 8)}" y1="${f1(-20 + Math.sin(a * RAD) * 8)}" x2="${f1(8 + Math.cos(a * RAD) * (8 + r))}" y2="${f1(-20 + Math.sin(a * RAD) * (8 + r))}" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
  return `${sec(k, [[-96, -8], [-16, -8], [-3, 30], [-96, 30]], 'steel')}${sec(k, [[16, -8], [96, -8], [96, 30], [3, 30]], 'steel', { flip: true })}
    <clipPath id="joining-bead"><rect class="wd-clip" x="-30" y="-28" width="60" height="66"/></clipPath>
    <g clip-path="url(#joining-bead)"><path class="wd-h" d="${WELD_BEAD}" fill="${INK.hot}" opacity="0"/><path class="wd-c" d="${WELD_BEAD}" fill="${INK.graphite}"/></g>
    <g class="wd-el"><line x1="76" y1="-102" x2="13" y2="-27" stroke="${INK.graphite}" stroke-width="10" stroke-linecap="round"/><line x1="76" y1="-102" x2="15" y2="-29" stroke="${INK.steel2}" stroke-width="4.5" stroke-linecap="round"/>
      <g class="wd-arc" opacity="0"><circle cx="8" cy="-20" r="7" fill="${INK.hot}"/>${sparks}</g></g>`;
}
function weldPrep(g, gsap) { const q = s => g.querySelector(s); gsap.set(q('.wd-h'), { opacity: 1 }); gsap.set(q('.wd-c'), { opacity: 0 }); gsap.set(q('.wd-clip'), { attr: { y: 38, height: 0 } }); }
function weldWork(L, g, at) {
  const q = s => g.querySelector(s), arc = q('.wd-arc');
  L.to(arc, { opacity: 1, duration: .25 }, at)
    .to(q('.wd-clip'), { attr: { y: -28, height: 66 }, duration: 1.5, ease: 'none' }, at + .15)
    .to(q('.wd-el'), { x: -6, duration: .25, repeat: 5, yoyo: true, ease: 'sine.inOut' }, at + .15)
    .to(arc, { opacity: 0, duration: .25 }, at + 1.65)
    .to(q('.wd-h'), { opacity: 0, duration: .8 }, at + 1.75).to(q('.wd-c'), { opacity: 1, duration: .8 }, at + 1.75);
  return 2.55;
}
function weldReset(L, g, at) {
  const q = s => g.querySelector(s);
  L.to(q('.wd-c'), { opacity: 0, duration: .4 }, at).set(q('.wd-clip'), { attr: { y: 38, height: 0 } }, at + .42).set(q('.wd-h'), { opacity: 1 }, at + .44);
}
const AD_BEAD = 'M-24 16C-24 -6 24 -6 24 16Z';
function adhesiveDraw(k) {
  const { INK, W } = k;
  return `${sec(k, box(-90, 16, 180, 26), 'plastic')}
    <rect class="ad-line" x="-90" y="10" width="180" height="6" fill="${INK.straw}" stroke="${INK.graphite}" stroke-width="${W.thin}" opacity="0"/>
    <path class="ad-bead" d="${AD_BEAD}" fill="${INK.straw}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <g class="ad-top">${sec(k, box(-90, -64, 180, 26), 'alu')}<g class="fx">${k.arrow(-50, -106, -50, -70)}${k.arrow(50, -106, 50, -70)}</g></g>`;
}
function adhesiveWork(L, g, at) {
  const q = s => g.querySelector(s);
  L.to(q('.ad-top'), { y: 48, duration: 1.1, ease: 'power2.inOut' }, at)
    .to(q('.ad-bead'), { scaleY: .3, scaleX: 2.6, svgOrigin: '0 16', duration: .45, ease: 'power1.out' }, at + .75)
    .to(q('.ad-line'), { opacity: 1, duration: .3 }, at + .95)
    .to(q('.ad-bead'), { opacity: 0, duration: .25 }, at + 1.05);
  return 1.8;
}
function adhesiveReset(L, g, at) {
  const q = s => g.querySelector(s);
  L.to([q('.ad-top'), q('.ad-line')], { opacity: 0, duration: .4 }, at)
    .set(q('.ad-top'), { y: 0 }, at + .42).set(q('.ad-bead'), { scaleX: 1, scaleY: 1, svgOrigin: '0 16' }, at + .42)
    .to([q('.ad-top'), q('.ad-bead')], { opacity: 1, duration: .4 }, at + .45);
}
function joiningDraw(k) {
  return cellsDraw(k, [
    { label: 'SOLDER / BRAZE', body: solderDraw(k), at: [129, 116], s: 1.15 },
    { label: 'WELD', body: weldDraw(k), at: [125, 182], s: 1.2 },
    { label: 'ADHESIVE', body: adhesiveDraw(k), at: [125, 180], s: 1.2 },
    { label: 'MECHANICAL', body: boltDraw(k), at: [125, 132], s: 1.25 }
  ]);
}
const joiningPlay = (svg, k) => cellsPlay(svg, k, [solderWork, weldWork, adhesiveWork, boltWork], [solderReset, weldReset, adhesiveReset, boltReset], [solderPrep, weldPrep]);

/* ======================================================================================================
   finishing — the three finishing families (L1·S7) as three passes over a plate: formed (a patterned roll presses
   a texture into the sheet), abrasive/cut (a grinding wheel spins over the rough surface and leaves it flat, sparks
   behind it), coatings (a spray gun lays a coat). Each tool makes its pass in turn.
   ====================================================================================================== */
const FN = { x0: 184, x1: 548, ys: [196, 356, 516], t0: 214, t1: 518 };
function finishingDraw(k) {
  const { INK, W } = k; const { x0, x1, ys, t0 } = FN; const w = x1 - x0;
  const clipR = (id, x, y, wd, cls) => `<clipPath id="finishing-${id}"><rect class="${cls}" x="${x}" y="${y}" width="${wd}" height="90"/></clipPath>`;
  const circ = (cx, cy, r, fill, cls = 'h') => `<circle class="${cls}" cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}"/>`;
  const ring = (cx, cy, r, w = W.thick) => `<circle class="o" cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="none" stroke="${INK.graphite}" stroke-width="${w}"/>`;
  const lab = (i, s) => `<g class="fn-lab">${k.text(52, ys[i] - 24, s, { size: 18, weight: 700, spacing: 1.2, anchor: 'start' })}<rect class="fn-ul" x="52" y="${ys[i] - 15}" width="${f1(s.length * 10.2)}" height="5" fill="${INK.straw}" opacity="0"/></g>`;
  // 1 · formed
  const y1 = ys[0], rc = y1 - 36;
  let wave = `M${x0} ${y1}`; for (let x = x0; x + 8 <= x1; x += 8) wave += 'q4 -6 8 0'; wave += `H${x1}`;
  const knurl = Array.from({ length: 20 }, (_, i) => { const a = i * 18 * RAD; return `M${f1(t0 + Math.cos(a) * 26)} ${f1(rc + Math.sin(a) * 26)}L${f1(t0 + Math.cos(a) * 34)} ${f1(rc + Math.sin(a) * 34)}`; }).join('');
  const row1 = `${clipR('a1', x0, y1 - 60, t0 - x0, 'fn-a')}${clipR('b1', t0, y1 - 60, x1 - t0, 'fn-b')}
    <path class="h" d="${DZ(box(x0, y1, w, 26))}" fill="${k.hatch('alu')}"/>${thinPath(k, `M${x0} ${y1}V${y1 + 26}H${x1}V${y1}`, 'o', W.thick)}
    <g class="fn-after" clip-path="url(#finishing-a1)"><path class="o" d="${wave}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>
    <g class="fn-before" clip-path="url(#finishing-b1)"><path class="o" d="M${x0} ${y1}H${x1}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
    <g class="fn-tool"><g class="fx">${k.arrow(t0, rc - 84, t0, rc - 44)}</g>
      <g class="fn-spin">${circ(t0, rc, 34, INK.steel2)}${ring(t0, rc, 34)}${thinPath(k, knurl)}${circ(t0, rc, 10, INK.steel)}${ring(t0, rc, 10, W.med)}${thinPath(k, `M${t0 - 18} ${rc}H${t0 + 18}M${t0} ${rc - 18}V${rc + 18}`)}</g></g>`;
  // 2 · abrasive / cut
  const y2 = ys[1], wc = y2 - 42, rnd = seeded(5);
  let rough = `M${x0} ${y2 - 2}`; for (let x = x0 + 6; x <= x1; x += 6) rough += `L${x} ${f1(y2 - 1 - rnd() * 6)}`;
  const sparks = [200, 211, 222, 234, 247].map((a, i) => { const r = [34, 44, 30, 38, 24][i]; return `<line x1="${t0 - 4}" y1="${y2 - 3}" x2="${f1(t0 - 4 + Math.cos(a * RAD) * r)}" y2="${f1(y2 - 3 + Math.sin(a * RAD) * r)}" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
  const row2 = `${clipR('a2', x0, y2 - 60, t0 - x0, 'fn-a')}${clipR('b2', t0, y2 - 60, x1 - t0, 'fn-b')}
    <path class="h" d="${DZ(box(x0, y2, w, 26))}" fill="${k.hatch('steel')}"/>${thinPath(k, `M${x0} ${y2}V${y2 + 26}H${x1}V${y2}`, 'o', W.thick)}
    <g class="fn-after" clip-path="url(#finishing-a2)"><path class="o" d="M${x0} ${y2}H${x1}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
    <g class="fn-before" clip-path="url(#finishing-b2)"><path class="o" d="${rough}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>
    <g class="fn-tool"><g class="fn-sp" opacity="0">${sparks}</g>
      <g class="fn-spin">${circ(t0, wc, 40, '#fff')}${circ(t0, wc, 40, k.hatch('stipple'))}${ring(t0, wc, 40)}${circ(t0, wc, 16, INK.steel2)}${ring(t0, wc, 16, W.med)}${circ(t0, wc, 5, INK.graphite)}${k.center(t0 - 30, wc, t0 + 30, wc)}${k.center(t0, wc - 30, t0, wc + 30)}</g></g>`;
  // 3 · coatings
  const y3 = ys[2];
  const row3 = `${clipR('a3', x0, y3 - 60, t0 - x0, 'fn-a')}
    ${sec(k, box(x0, y3, w, 26), 'iron')}
    <g class="fn-after" clip-path="url(#finishing-a3)"><rect x="${x0}" y="${y3 - 8}" width="${w}" height="8" fill="${INK.straw}" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>
    <g class="fn-tool"><g transform="translate(${t0} ${f1(y3 - 22 * .8)}) scale(.8)">${gunDraw(k)}</g></g>`;
  return [row1, row2, row3].map((r, i) => `<g class="fn-row">${lab(i, ['FORMED', 'ABRASIVE/CUT', 'COATINGS'][i])}${r}</g>`).join('');
}
function finishingPlay(svg, k) {
  const { gsap } = k; const [, qa] = sel(svg);
  const rows = qa('.fn-row');
  const t = k.tl();
  rows.forEach((r, i) => {
    const at = i * .22;
    t.from(r.querySelector('.fn-lab text'), { opacity: 0, x: -8, duration: .45 }, at);
    k.plot(t, r.querySelectorAll('.o'), { at: at + .05, stagger: .04, dur: .6 });
    k.ink(t, r.querySelectorAll('.h'), { at: at + .45, stagger: .02 });
    k.ink(t, r.querySelectorAll(`.fx, ${CL}`), { at: at + .7 });
  });
  if (k.reduced()) return t;
  const { x0, x1, t0, t1, ys } = FN, dx = t1 - t0, d = 1.9, E = 'power1.inOut';
  gsap.set(qa('.fn-ul'), { transformOrigin: '0% 50%' });
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .4 });
  rows.forEach((r, i) => {
    const at = i * 2.4, q = s => r.querySelector(s), ul = q('.fn-ul'), b = q('.fn-b');
    L.fromTo(ul, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power2.out', immediateRender: false }, at)
      .to(q('.fn-tool'), { x: dx, duration: d, ease: E }, at + .2)
      .to(q('.fn-a'), { attr: { width: t1 - x0 }, duration: d, ease: E }, at + .2);
    if (b) L.to(b, { attr: { x: t1, width: x1 - t1 }, duration: d, ease: E }, at + .2);
    if (i === 0) L.to(q('.fn-spin'), { rotation: dx / 34 / RAD, svgOrigin: `${t0} ${ys[0] - 36}`, duration: d, ease: E }, at + .2);
    if (i === 1) L.to(q('.fn-spin'), { rotation: 1080, svgOrigin: `${t0} ${ys[1] - 42}`, duration: d + .4, ease: E }, at)
      .to(q('.fn-sp'), { opacity: 1, duration: .25 }, at + .25).to(q('.fn-sp'), { opacity: .35, duration: .3, repeat: 3, yoyo: true, ease: 'sine.inOut' }, at + .5)
      .to(q('.fn-sp'), { opacity: 0, duration: .25 }, at + d + .05);
    if (i === 2) L.to(q('.sp-cone'), { opacity: 1, duration: .3 }, at + .05).to(q('.sp-cone'), { opacity: 0, duration: .3 }, at + d + .2);
    L.to(ul, { opacity: 0, duration: .4 }, at + d + .3);
  });
  const r0 = 3 * 2.4 + .5;
  rows.forEach((r, i) => {
    const q = s => r.querySelector(s), after = q('.fn-after'), b = q('.fn-b');
    L.to(after, { opacity: 0, duration: .5 }, r0);
    if (b) L.set(b, { attr: { x: x0, width: x1 - x0 } }, r0);
    L.set(q('.fn-a'), { attr: { width: t0 - x0 } }, r0 + .52).set(after, { opacity: 1 }, r0 + .53);
    if (b) L.set(b, { attr: { x: t0, width: x1 - t0 } }, r0 + .53);
    L.to(q('.fn-tool'), { x: 0, duration: 1, ease: 'power2.inOut' }, r0);
    if (i === 0) L.to(q('.fn-spin'), { rotation: 0, svgOrigin: `${t0} ${ys[0] - 36}`, duration: 1, ease: 'power2.inOut' }, r0);
  });
  L.to({}, { duration: .1 }, r0 + 1.1);
  return t;
}

/* ======================================================================================================
   matrix — figure 1-1 (L1·S5), materials × manufacturing, as a dot matrix: 14 methods in four families across,
   12 materials down. ● all processes · ◕ most (grey) · ◒ some (half) · ○ none — transcribed cell by cell from the
   slide. Loop: the Ferrous row lights up (every process); then the red pencil rings Thermoset's empty cells (no
   plastic- or solid-state forming, no solder/braze, no weld).
   ====================================================================================================== */
const MX_COLS = ['Liquid State', 'Plastic State', 'Solid State', 'Sheet Cutting', 'Chip Forming', 'Nonchip Forming', 'Flame/Laser', 'Solder/Braze', 'Weld', 'Adhesive', 'Mechanical', 'Formed', 'Abrasive/Cut', 'Coatings'];
const MX_GROUPS = [['Forming', 0, 3], ['Cutting', 3, 7], ['Joining', 7, 11], ['Finishing', 11, 14]];
const MX_ROWS = [
  ['Metals', 'Ferrous', 'DDDDDDDDDDDDDD'], ['', 'Nonferrous', 'DDDDDDLDDDDDDD'],
  ['Plastics', 'Thermoset', 'DOODDHHOODDDLD'], ['', 'Thermoplastics', 'DDLDDHHODDDDDD'],
  ['Rubber &amp;|Elastomers', 'Thermoset', 'DOODHHHOODDDHH'], ['', 'Thermoplastics', 'DDDDHHHODDDDHH'],
  ['Engineering|Materials', 'Manufactured|Carbon', 'DOOODHOOOLLHHH'], ['', 'Glass', 'DDODHLOHDLLDHH'],
  ['', 'Engineered|Ceramics', 'DLOOHOOOODLDLL'], ['', 'Refractory|Hard Metals', 'DDOOLLLDOHHHDH'],
  ['Natural|Materials*', 'Fibers', 'DLDDDOHOOLDHHH'], ['', 'Wood|Products', 'HHODDHHOODDHDD']
];
const MX = { x0: 214, cw: 24, y0: 184, rh: 26.5, top: 44 };
function matrixDraw(k) {
  const { INK, W } = k; const { x0, cw, y0, rh, top } = MX;
  const X = c => x0 + cw * c + cw / 2, Y = r => y0 + rh * r + rh / 2, x1 = x0 + cw * 14, y1 = y0 + rh * 12;
  const sym = (ch, x, y, cls) => ch === 'D' ? `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="8" fill="${INK.graphite}"/>`
    : `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="7.4" fill="${ch === 'L' ? INK.steel : ch === 'H' ? 'url(#matrix-half)' : '#fff'}" stroke="${INK.graphite}" stroke-width="1.4"/>`;
  const ln = (a, b, c, d, w = W.thin) => `<line class="mx-ln" x1="${f1(a)}" y1="${f1(b)}" x2="${f1(c)}" y2="${f1(d)}" stroke="${INK.graphite}" stroke-width="${w}"/>`;
  const lines2 = (s, x, y, o) => { const p = s.split('|'); return p.map((t, i) => k.text(x, y + (p.length > 1 ? (i - .5) * 12.5 : 0) + 4.5, t, { size: p.length > 1 ? 12 : 13, weight: o.weight, anchor: 'start' })).join(''); };
  let s = `<defs><linearGradient id="matrix-half" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#fff"/><stop offset=".5" stop-color="${INK.steel}"/></linearGradient></defs>`;
  s += `<rect class="mx-band" x="40" y="${y0}" width="${x1 - 40}" height="${rh}" fill="${INK.straw}" opacity="0"/><rect class="mx-band" x="40" y="${y0 + rh * 2}" width="${x1 - 40}" height="${rh}" fill="${INK.straw}" opacity="0"/>`;
  s += `<rect class="mx-ln" x="40" y="${top}" width="${x1 - 40}" height="${y1 - top}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>`;
  s += ln(x0, top, x0, y1, W.med) + ln(40, y0, x1, y0, W.med) + ln(x0, 68, x1, 68);
  [3, 7, 11].forEach(c => { s += ln(x0 + cw * c, top, x0 + cw * c, y1); });
  [2, 4, 6, 10].forEach(r => { s += ln(40, y0 + rh * r, x1, y0 + rh * r); });
  s += `<g class="mx-tx">${k.text(127, 62, 'MATERIALS ×', { size: 13, weight: 700, spacing: 1.2 })}${k.text(127, 78, 'METHODS', { size: 13, weight: 700, spacing: 1.2 })}</g>`;
  s += MX_GROUPS.map(([g, a, b]) => `<g class="mx-tx">${k.text((X(a) + X(b - 1)) / 2, 61, g, { size: 15, weight: 700 })}</g>`).join('');
  s += MX_COLS.map((c, i) => `<g class="mx-tx">${k.text(X(i) + 4.5, y0 - 7, c, { size: 12.5, weight: 600, anchor: 'start', rotate: -90 })}</g>`).join('');
  s += MX_ROWS.map(([g, sub], r) => `<g class="mx-tx">${g ? lines2(g, 46, Y(r) + (g.includes('|') ? 6 : 0), { weight: 700 }) : ''}${lines2(sub, 120, Y(r), { weight: 500 })}</g>`).join('');
  s += MX_ROWS.map(([, , cells], r) => [...cells].map((ch, c) => sym(ch, X(c), Y(r), r === 0 ? 'mx-d mx-r0' : 'mx-d')).join('')).join('');
  s += `<rect class="mx-red" x="42" y="${y0 + 1.5}" width="${x1 - 44}" height="${rh - 3}" fill="none" stroke="${INK.red}" stroke-width="${W.med}" opacity="0"/>`;
  s += [1, 2, 7, 8].map(c => `<circle class="mx-ring" cx="${f1(X(c))}" cy="${f1(Y(2))}" r="11.5" fill="none" stroke="${INK.red}" stroke-width="${W.med}" opacity="0"/>`).join('');
  const leg = [['D', 'All Processes'], ['L', 'Most Processes'], ['H', 'Some Processes'], ['O', 'No Processes']];
  s += `<g class="mx-leg">${leg.map(([ch, t], i) => { const x = 58 + i * 128; return sym(ch, x, y1 + 26, 'mx-lg') + k.text(x + 14, y1 + 30.5, t, { size: 13, weight: 600, anchor: 'start' }); }).join('')}</g>`;
  return s;
}
function matrixPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.mx-ln'), { stagger: .025, dur: .5 });
  k.ink(t, qa('.mx-tx'), { at: .3, stagger: .012 });
  t.from(qa('.mx-d'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .35, ease: 'back.out(2)', stagger: .0035 }, .6);
  k.ink(t, q('.mx-leg'), { at: 1.3 });
  if (k.reduced()) return t;
  const band = qa('.mx-band'), red = q('.mx-red'), rings = qa('.mx-ring');
  const Lr = primeStroke(red), Lg = rings.map(primeStroke);
  gsap.set([red, ...rings], { opacity: 1 });
  const L = gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: 1 });
  L.to(band[0], { opacity: .6, duration: .4 }, 0)
    .to(qa('.mx-r0'), { scale: 1.3, transformOrigin: '50% 50%', duration: .22, stagger: .07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, .2)
    .fromTo(red, { strokeDashoffset: Lr }, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut', immediateRender: false }, .3)
    .to([band[0], red], { opacity: 0, duration: .5 }, 2.7)
    .to(band[1], { opacity: .6, duration: .4 }, 2.9);
  rings.forEach((r, i) => L.fromTo(r, { strokeDashoffset: Lg[i] }, { strokeDashoffset: 0, duration: .45, ease: 'power1.inOut', immediateRender: false }, 3.3 + i * .28));
  L.to([band[1], ...rings], { opacity: 0, duration: .5 }, 5.8)
    .set(red, { opacity: 1, strokeDashoffset: Lr }, 6.4).set(rings, { opacity: 1, strokeDashoffset: i => Lg[i] }, 6.4);
  return t;
}

export default {
  designer: { draw: designerDraw, play: designerPlay },
  sequence: { draw: sequenceDraw, play: sequencePlay },
  considerations: { draw: considerationsDraw, play: considerationsPlay },
  methods: { draw: methodsDraw, play: methodsPlay },
  forming: { draw: formingDraw, play: formingPlay },
  cuttingM: { draw: cuttingMDraw, play: cuttingMPlay },
  joining: { draw: joiningDraw, play: joiningPlay },
  finishing: { draw: finishingDraw, play: finishingPlay },
  matrix: { draw: matrixDraw, play: matrixPlay }
};
