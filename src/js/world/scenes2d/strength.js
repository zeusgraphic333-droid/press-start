// Illustrated scenes — strength (Stress & Strain, Lecture 2). Contract and look: STYLE.md · names and captions:
// world/scenes/info.js · what to draw: docs/SCENES.md. Zone marker: INK.amber (a wash on the part under load).
// Forces: tension in safety orange (and red pencil for what it does), compression in non-photo blue — the slides' colours.
// Hub: `curve` — a tensile test plotting its own chart: the pen rides the curve while the specimen beside it necks.

const AMB = '#F4E3CD', AMB2 = '#EACFAB'; // amber washes (opaque: they hide what is drawn behind the part)
const f1 = v => +(+v).toFixed(1);
const P = a => a.map(p => `${f1(p[0])},${f1(p[1])}`).join(' ');
const D = (a, close) => 'M' + a.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L') + (close ? 'Z' : '');
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const set = (el, o) => { if (el) for (const k in o) el.setAttribute(k, typeof o[k] === 'number' ? f1(o[k]) : o[k]); };
/** opacity as inline style — the same property GSAP tweens, so a render() and a tween never fight */
const op = (el, v) => { if (el) el.style.opacity = (+v).toFixed(3); };
const lerp = (a, b, t) => a + (b - a) * t;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const bez = (p0, p1, p2, p3, n) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
});
/** walk a polyline by arc length: at(u) → [x, y] · lenAt(u) */
function walker(pts) {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1];
  const at = u => { const s = cl(u) * L; let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const t = (s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]; };
  return { at, L };
}
/** a force arrow drawn as one shape (shaft + filled head): any colour, constant head, moves as a group */
function force(k, x1, y1, x2, y2, { color = k.INK.hot, w = 6, cls = '', head = 17, hw = 7 } = {}) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - ux * head, by = y2 - uy * head;
  return `<g class="${cls}"><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(bx + ux * 2)}" y2="${f1(by + uy * 2)}" stroke="${color}" stroke-width="${w}"/><polygon points="${P([[x2, y2], [bx - uy * hw, by + ux * hw], [bx + uy * hw, by - ux * hw]])}" fill="${color}"/></g>`;
}
/** a fixed support: a band of ground hatch with its working face as a thick line (face = 'top' | 'bottom' | 'left' | 'right') */
function ground(k, x, y, w, h, face, cls = '') {
  const L = { top: [x, y, x + w, y], bottom: [x, y + h, x + w, y + h], left: [x, y, x, y + h], right: [x + w, y, x + w, y + h] }[face];
  return `<g class="${cls}">${k.rect(x, y, w, h, k.hatch('iron'), 'class="gd-h"')}${k.line(...L, k.INK.graphite, k.W.thick, 'class="gd-f"')}</g>`;
}
/** a dimension line with arrows at both ends and its label (no extension lines) — for live dimensions */
function dline(k, cls, color, label, { size = 16, anchor = 'middle', family = 'dim' } = {}) {
  const mk = color === k.INK.red ? 'arr-red' : color === k.INK.blue ? 'arr-blue' : 'arr';
  return `<g class="${cls}"><line x1="0" y1="0" x2="0" y2="1" stroke="${color}" stroke-width="${k.W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${k.text(0, 0, label, { size, fill: color, anchor, family })}</g>`;
}
/** plot lines that carry arrowheads: each stays hidden until its own pen starts (markers ignore the dash) */
function plotM(k, t, els, { at = 0, stagger = .08, dur = .5 } = {}) {
  const list = [].concat(els).flatMap(e => (e && e.length !== undefined && !e.tagName ? [...e] : [e])).filter(Boolean);
  list.forEach((el, i) => {
    const p = at + i * stagger;
    t.from(el, { opacity: 0, duration: .1 }, p);
    if (el.tagName === 'line') { // a straight line grows from its start, so the arrowhead rides the pen tip
      const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map(a => +el.getAttribute(a));
      t.from(el, { attr: { x2: x1 + (x2 - x1) * .04, y2: y1 + (y2 - y1) * .04 }, duration: dur, ease: 'power2.inOut' }, p);
    } else k.plot(t, el, { at: p, dur });
  });
  return t;
}
function dset(g, x1, y1, x2, y2, tx, ty) { set(g.firstElementChild, { x1, y1, x2, y2 }); set(g.lastElementChild, { x: tx, y: ty }); }
const hair = (k, x1, y1, x2, y2, color = k.INK.graphite, extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${k.W.hair}" ${extra}/>`;
/** status tags (BEFORE · LOADED · AFTER): the lit one is graphite with an amber pointer, the rest faint */
function tags(k, x, y, words, cls) {
  return `<g class="${cls}">${words.map((w, i) => `<g class="tg" data-i="${i}" opacity="${i ? .28 : 1}">${k.text(x, y + i * 34, w, { size: 19, weight: 700, anchor: 'start', spacing: 1.5 })}</g>`).join('')}
    <polygon class="tg-ptr" points="${P([[x - 20, y - 13], [x - 8, y - 6.5], [x - 20, y]])}" fill="${k.INK.amber}"/></g>`;
}
function lightTag(T, svg, cls, i, at) {
  const gs = svg.querySelectorAll(`.${cls} .tg`), ptr = svg.querySelector(`.${cls} .tg-ptr`);
  T.to(gs, { opacity: (j) => (j === i ? 1 : .28), duration: .35 }, at).to(ptr, { y: i * 34, duration: .45, ease: 'power2.inOut' }, at);
}

/* ======================================================================================================
   curve ★ — the tensile test plots its own chart. The pen rides the stress–strain curve (red), the specimen beside
   it stretches (elastic, then uniform plastic), necks after the top of the curve and breaks at F. The curve's
   ghost (non-photo blue) stays on the sheet between tests.
   ====================================================================================================== */
const CV = (() => {
  const O = [78, 470], Pl = [110, 300], M = [272, 150], F = [392, 222];
  const knee = bez(Pl, [121, 241], [208, 150], M, 36), neck = bez(M, [326, 150], [376, 186], F, 30);
  const pts = [O, ...bez(O, O, Pl, Pl, 6).slice(1), ...knee.slice(1), ...neck.slice(1)];
  const Y = knee[7];
  const off = Y[0] - (O[1] - Y[1]) * (Pl[0] - O[0]) / (O[1] - Pl[1]); // the 0.2 % offset line meets the axis here
  // the pen is quick up the elastic line and slows through necking (a constant crosshead speed, not constant ink speed)
  const cum = [0], tim = [0];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), x = pts[i][0];
    cum.push(cum[i - 1] + l); tim.push(tim[i - 1] + l / (x <= Pl[0] ? 1.7 : x <= M[0] ? 1 : .62));
  }
  return { O, Pl, M, F, Y, off, pts, cum, tim, L: cum[cum.length - 1], T: tim[tim.length - 1], cx: 488, yb: 452, L0: 190 };
})();
/** where the pen is at p (0…1 of the test's time): [x, y, inked length] */
function cvAt(p) {
  const { pts, cum, tim, T } = CV; const s = cl(p) * T; let i = 1;
  while (i < tim.length - 1 && tim[i] < s) i++;
  const t = (s - tim[i - 1]) / ((tim[i] - tim[i - 1]) || 1);
  return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t), lerp(cum[i - 1], cum[i], t)];
}
/** the specimen at strain position x (graph px): extension, uniform half-width, neck depth */
function cvState(x) {
  const { O, Pl, M, F } = CV;
  const ext = x <= Pl[0] ? (x - O[0]) / (Pl[0] - O[0]) * 2 : x <= M[0] ? 2 + (x - Pl[0]) / (M[0] - Pl[0]) * 34 : 36 + (x - M[0]) / (F[0] - M[0]) * 16;
  const neck = x <= M[0] ? 0 : Math.pow((x - M[0]) / (F[0] - M[0]), 1.6) * .7;
  return { ext, neck };
}
/** the specimen outline (two halves, split where it will break), its fills and fracture faces */
function cvSpec(ext, neck, brk) {
  const { cx, yb, L0 } = CV; const L = L0 + ext, yt = yb - L, yc = yb - L / 2, g = brk * 12;
  const hu = 12 / Math.sqrt(1 + Math.min(ext, 36) / L0);
  const hwAt = y => hu * (1 - neck * Math.exp(-(((y - yc) / 15) ** 2)));
  const pr = [[520, 22], [470, 22]];
  for (let i = 1; i <= 4; i++) { const f = i / 4; pr.push([470 - 18 * f, lerp(22, hwAt(yb), 1 - (1 - f) * (1 - f))]); }
  const N = 28; for (let i = 1; i <= N; i++) { const y = yb - L * i / N; pr.push([y, hwAt(y)]); }
  for (let i = 1; i <= 4; i++) { const f = i / 4; pr.push([yt - 18 * f, lerp(hwAt(yt), 22, f * f)]); }
  pr.push([yt - 68, 22]);
  const kI = 5 + N / 2; // the sample at the neck centre (profile: 2 end points + 4 shoulder points, then the gauge)
  const lo = pr.slice(0, kI + 1), up = pr.slice(kI).map(([y, w]) => [y - g, w]);
  const R = ([y, w]) => [cx + w, y], Lf = ([y, w]) => [cx - w, y];
  const wN = pr[kI][1], ov = brk ? 0 : 1.2;
  return {
    loOl: D([...lo.slice().reverse().map(Lf), ...lo.map(R)]),
    upOl: D([...up.map(R), ...up.slice().reverse().map(Lf)]),
    loF: D([...lo.map(R), [cx + wN, yc - ov], [cx - wN, yc - ov], ...lo.slice().reverse().map(Lf)], true),
    upF: D([...up.map(R), ...up.slice().reverse().map(Lf)], true),
    loX: D([[cx - wN, yc], [cx - wN * .4, yc + 2.4], [cx, yc + 3.6], [cx + wN * .4, yc + 2.4], [cx + wN, yc]]),
    upX: D([[cx - wN, yc - g], [cx - wN * .4, yc - g + 2.4], [cx, yc - g + 3.6], [cx + wN * .4, yc - g + 2.4], [cx + wN, yc - g]]),
    lift: ext + g
  };
}
function curveDraw(k) {
  const { INK, W } = k; const { O, M, F, Y, off, pts, cx } = CV;
  const s0 = cvSpec(0, 0, 0), top = 106, bot = 432;
  const span = (x1, x2, y, label, cls) => `<g class="${cls}"><line x1="${f1(x1 + 1)}" y1="${y}" x2="${f1(x2 - 1)}" y2="${y}" stroke="${INK.graphite}" stroke-width="${W.thin}" marker-start="url(#arr)" marker-end="url(#arr)"/>${k.text((x1 + x2) / 2, y - 7, label, { size: 15 })}</g>`;
  const vguide = (x, y1) => `<line class="cv-vg" x1="${f1(x)}" y1="${f1(y1)}" x2="${f1(x)}" y2="${O[1]}" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="5 4"/>`;
  const grip = (y, cls) => `<g class="${cls}">${k.rect(cx - 42, y, 20, 50, k.hatch('steel'), 'class="cv-gh"')}${k.rect(cx + 22, y, 20, 50, k.hatch('steel'), 'class="cv-gh"')}
      ${k.rect(cx - 42, y, 20, 50, 'none', `class="cv-go" ${k.stroke.thick}`)}${k.rect(cx + 22, y, 20, 50, 'none', `class="cv-go" ${k.stroke.thick}`)}</g>`;
  return `
  <g class="cv-axes">
    <line class="cv-ax" x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="92" ${k.stroke.thick} marker-end="url(#arr)"/>
    <line class="cv-ax" x1="${O[0]}" y1="${O[1]}" x2="414" y2="${O[1]}" ${k.stroke.thick} marker-end="url(#arr)"/>
    ${k.text(60, 300, 'stress', { size: 17, rotate: -90, weight: 600 })}${k.text(410, 494, 'strain', { size: 17, anchor: 'end' })}
  </g>
  <g class="cv-guides">
    ${vguide(Y[0], top)}${vguide(M[0], M[1])}${vguide(F[0], top)}
    <line class="cv-hg" x1="${O[0]}" y1="${f1(M[1])}" x2="${M[0]}" y2="${f1(M[1])}" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="5 4"/>
    <line class="cv-hg" x1="${O[0]}" y1="${f1(Y[1])}" x2="${f1(Y[0])}" y2="${f1(Y[1])}" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="5 4"/>
    <line class="cv-off" x1="${f1(off)}" y1="${O[1]}" x2="${f1(Y[0])}" y2="${f1(Y[1])}" ${k.stroke.construct} stroke-dasharray="6 5"/>
  </g>
  <g class="cv-spans">${span(O[0], Y[0], top, 'elastic', 'cv-sp')}${span(Y[0], F[0], top, 'plastic', 'cv-sp')}
    ${span(Y[0], M[0], bot, 'uniform elongation', 'cv-sp')}${span(M[0], F[0], bot, 'necking', 'cv-sp')}</g>
  <path class="cv-ghost" d="${D(pts)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" opacity=".8"/>
  <path class="cv-trace" d="${D(pts)}" fill="none" stroke="${INK.red}" stroke-width="${W.thick}" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="${f1(CV.L + 2)} ${f1(CV.L + 2)}" stroke-dashoffset="${f1(CV.L + 2)}"/>
  <g class="cv-labels">
    <g class="cv-lb">${k.text(166, 140, 'ultimate tensile strength', { size: 16 })}</g>
    <g class="cv-lb">${k.text(Y[0] + 12, Y[1] + 20, 'yield strength', { size: 16, anchor: 'start' })}</g>
    <g class="cv-lb">${k.leader(F[0] - 3, F[1] + 5, 352, 292, 'fracture', { size: 16 })}</g>
  </g>
  <g class="cv-pts">${[Y, M].map(p => `<circle class="cv-pt" cx="${f1(p[0])}" cy="${f1(p[1])}" r="5" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}
    <g class="cv-pt cv-fx"><path d="M${F[0] - 6} ${F[1] - 6}l12 12M${F[0] + 6} ${F[1] - 6}l-12 12" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linecap="round"/></g></g>
  <g class="cv-xh" opacity="0"><line class="cv-xh-h" x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="${O[1]}" ${k.stroke.construct} stroke-dasharray="3 4"/><line class="cv-xh-v" x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="${O[1]}" ${k.stroke.construct} stroke-dasharray="3 4"/></g>
  <g class="cv-pen"><circle cx="${O[0]}" cy="${O[1]}" r="7.5" fill="${INK.hot}" stroke="#fff" stroke-width="2.5"/></g>

  <g class="cv-spec">
    <path class="cv-loF" d="${s0.loF}" fill="${AMB}"/><path class="cv-upF" d="${s0.upF}" fill="${AMB}"/>
    <path class="cv-loO" d="${s0.loOl}" fill="none" ${k.stroke.thick}/><path class="cv-upO" d="${s0.upOl}" fill="none" ${k.stroke.thick}/>
    <path class="cv-loX" d="${s0.loX}" fill="none" ${k.stroke.thick} opacity="0"/><path class="cv-upX" d="${s0.upX}" fill="none" ${k.stroke.thick} opacity="0"/>
  </g>
  ${grip(470, 'cv-gl')}
  ${ground(k, cx - 58, 520, 116, 22, 'top', 'cv-base')}
  <g class="cv-up">${grip(194, 'cv-gu')}${k.rect(cx - 58, 172, 116, 22, k.hatch('steel'), 'class="cv-gh"')}${k.rect(cx - 58, 172, 116, 22, 'none', `class="cv-go" ${k.stroke.thick}`)}
    ${force(k, cx, 166, cx, 112, { cls: 'cv-F' })}</g>
  ${k.center(cx, 156, cx, 548, 'class="cv-cl"')}
  <g class="cv-tb">${k.titleBlock(70, 512, { title: 'TENSILE TEST', no: 'ST 09', scale: 'NTS', w: 176 })}</g>`;
}
function curvePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { O } = CV;
  const pen = q('.cv-pen circle'), trace = q('.cv-trace'), xh = q('.cv-xh-h'), xv = q('.cv-xh-v'), up = q('.cv-up');
  const sp = { loF: q('.cv-loF'), upF: q('.cv-upF'), loOl: q('.cv-loO'), upOl: q('.cv-upO'), loX: q('.cv-loX'), upX: q('.cv-upX') };
  const st = { p: 0, brk: 0 }, TL = CV.L + 2;
  const render = () => {
    const [x, y, len] = cvAt(st.p); const { ext, neck } = cvState(x); const s = cvSpec(ext, neck, st.brk);
    set(pen, { cx: x, cy: y }); trace.style.strokeDashoffset = f1(TL - len);
    set(xh, { x1: O[0], y1: y, x2: x, y2: y }); set(xv, { x1: x, y1: O[1], x2: x, y2: y });
    for (const n in sp) set(sp[n], { d: s[n] });
    op(sp.loX, st.brk > 0 ? 1 : 0); op(sp.upX, st.brk > 0 ? 1 : 0);
    up.setAttribute('transform', `translate(0 ${f1(-s.lift)})`);
  };
  const t = k.tl();
  if (k.reduced()) { st.p = 1; st.brk = 1; render(); }
  plotM(k, t, qa('.cv-ax'), { dur: .6, stagger: .1 });
  t.from(qa('.cv-axes text'), { opacity: 0, duration: .3 }, .5);
  k.plot(t, q('.cv-ghost'), { at: .35, dur: 1 });
  k.plot(t, [...qa('.cv-vg'), ...qa('.cv-hg'), q('.cv-off')], { at: .8, stagger: .05, dur: .5 });
  plotM(k, t, qa('.cv-sp line'), { at: 1, stagger: .08, dur: .45 }); t.from(qa('.cv-sp text'), { opacity: 0, duration: .3, stagger: .08 }, 1.2);
  k.stamp(t, [...qa('.cv-pt'), ...qa('.cv-lb')], { at: 1.25, stagger: .07 });
  // the specimen and the machine
  k.plot(t, [q('.cv-loO'), q('.cv-upO'), ...qa('.cv-go'), q('.cv-base .gd-f')], { at: .3, stagger: .06, dur: .6 });
  k.ink(t, [q('.cv-loF'), q('.cv-upF'), ...qa('.cv-gh'), q('.cv-base .gd-h')], { at: .8 });
  t.from(q('.cv-cl'), { opacity: 0, duration: .4 }, 1);
  k.stamp(t, [q('.cv-F'), q('.cv-pen')], { at: 1.5 });
  t.from(q('.cv-tb'), { opacity: 0, y: 8, duration: .5 }, 1.4);
  if (k.reduced()) { gsap.set(q('.cv-xh'), { opacity: 1 }); return t; }
  // the test, forever: pull to fracture (the pen inks the curve), hold, then a fresh specimen
  const L = gsap.timeline({ repeat: -1, delay: 2.1, repeatDelay: .2 });
  L.to(q('.cv-xh'), { opacity: 1, duration: .4 })
    .to(st, { p: 1, duration: 7, ease: 'none', onUpdate: render })
    .to(st, { brk: 1, duration: .38, ease: 'power3.out', onUpdate: render })
    .to(q('.cv-F'), { opacity: 0, duration: .3 }, '<')
    .fromTo(q('.cv-fx'), { scale: 1, svgOrigin: `${CV.F[0]} ${CV.F[1]}` }, { scale: 1.6, svgOrigin: `${CV.F[0]} ${CV.F[1]}`, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, '<')
    .to({}, { duration: 2.4 })
    .to([trace, q('.cv-spec'), up, q('.cv-pen'), q('.cv-xh')], { opacity: 0, duration: .55, ease: 'power1.in' })
    .add(() => { st.p = 0; st.brk = 0; render(); })
    .set(trace, { opacity: 1 })
    .to([q('.cv-spec'), up, q('.cv-pen')], { opacity: 1, duration: .6, ease: 'power1.out' }, '+=.15')
    .set(q('.cv-F'), { opacity: 1 }, '<');
  return t;
}

/* ======================================================================================================
   stress — a bar fixed to a wall, pulled by F. Cut it at A–A and open the cut: inside, the material pulls back
   (red arrows from both cut faces): the internal resistance that balances the outside force.
   ====================================================================================================== */
const SR = { x0: 100, xc: 262, x1: 430, y0: 264, y1: 336, gap: 58 };
function stressDraw(k) {
  const { INK, W } = k; const { x0, xc, x1, y0, y1 } = SR, ym = (y0 + y1) / 2;
  const ys = [275, 287.5, 300, 312.5, 325];
  const inner = dir => ys.map(y => `<line class="sr-in" x1="${xc}" y1="${y}" x2="${xc + dir * .6}" y2="${y}" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)" opacity="0"/>`).join('');
  return `
  ${ground(k, 60, 206, 40, 188, 'right', 'sr-wall')}
  <g class="sr-left">
    <rect class="sr-fill" x="${x0}" y="${y0}" width="${xc - x0 + 1.5}" height="${y1 - y0}" fill="${AMB}"/>
    <path class="sr-ol" d="M${x0} ${y0}H${xc}M${x0} ${y1}H${xc}" fill="none" ${k.stroke.thick}/>
    <line class="sr-cut" x1="${xc}" y1="${y0}" x2="${xc}" y2="${y1}" ${k.stroke.thick} opacity="0"/>${inner(1)}
  </g>
  <g class="sr-right">
    <rect class="sr-fill" x="${xc}" y="${y0}" width="${x1 - xc}" height="${y1 - y0}" fill="${AMB}"/>
    <path class="sr-ol" d="M${xc} ${y0}H${x1}V${y1}H${xc}" fill="none" ${k.stroke.thick}/>
    <line class="sr-cut" x1="${xc}" y1="${y0}" x2="${xc}" y2="${y1}" ${k.stroke.thick} opacity="0"/>${inner(-1)}
    ${force(k, x1 + 7, ym, x1 + 74, ym, { cls: 'sr-F', w: 7 })}
    <g class="sr-Ft">${k.text(x1 + 38, ym - 22, 'F', { size: 28, weight: 700, fill: INK.hot })}</g>
  </g>
  ${k.center(84, ym, x1 + 18, ym, 'class="sr-cl"')}
  <g class="sr-sec">${k.section(xc, y0 - 40, xc, y1 + 40, 'A')}</g>
  <g class="sr-note" opacity="0">${k.leader(xc + SR.gap / 2, y1 - 4, xc + 96, 412, 'internal resistance', { color: INK.red, size: 19 })}</g>
  <g class="sr-view">
    <circle class="sr-vh" cx="176" cy="462" r="38" fill="${k.hatch('steel')}"/>
    <circle class="sr-vo" cx="176" cy="462" r="38" fill="none" ${k.stroke.thick}/>
    ${k.center(126, 462, 226, 462, 'class="sr-vc"')}${k.center(176, 412, 176, 512, 'class="sr-vc"')}
    ${k.text(176, 540, 'SECTION A–A', { size: 15, weight: 700, spacing: 1 })}
  </g>`;
}
function stressPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { xc, gap } = SR;
  const inL = qa('.sr-left .sr-in'), inR = qa('.sr-right .sr-in');
  const t = k.tl();
  k.plot(t, [q('.sr-wall .gd-f'), ...qa('.sr-ol')], { dur: .7, stagger: .14 });
  k.ink(t, [q('.sr-wall .gd-h'), ...qa('.sr-fill')], { at: .5 });
  t.from(q('.sr-cl'), { opacity: 0, duration: .4 }, .7);
  plotM(k, t, qa('.sr-sec line'), { at: .8, stagger: .06, dur: .5 }); t.from(qa('.sr-sec text'), { opacity: 0, duration: .3 }, 1.15);
  k.plot(t, [q('.sr-vo'), ...qa('.sr-vc')], { at: 1, stagger: .08, dur: .5 }); k.ink(t, [q('.sr-vh'), q('.sr-view text')], { at: 1.3 });
  k.stamp(t, [q('.sr-F'), q('.sr-Ft')], { at: 1.1, stagger: .1 });
  const opened = { x: gap };
  if (k.reduced()) {
    gsap.set(q('.sr-sec'), { opacity: 0 }); gsap.set(qa('.sr-cut'), { opacity: 1 }); gsap.set(q('.sr-right'), opened);
    inL.forEach(e => set(e, { x2: xc + gap / 2 - 6, opacity: 1 })); inR.forEach(e => set(e, { x2: xc - gap / 2 + 6, opacity: 1 })); gsap.set(q('.sr-note'), { opacity: 1 });
    return t;
  }
  // open the cut, look inside, close it; then the load comes off and goes back on
  const L = gsap.timeline({ repeat: -1, delay: 2.2 });
  L.to(q('.sr-sec'), { opacity: 0, duration: .35 })
    .to(qa('.sr-cut'), { opacity: 1, duration: .3 }, '<.1')
    .to(q('.sr-right'), { x: gap, duration: 1.1, ease: 'power2.inOut' }, '<')
    .to(inL, { attr: { x2: xc + gap / 2 - 6 }, opacity: 1, duration: .6, stagger: .05, ease: 'power2.out' }, '-=.45')
    .to(inR, { attr: { x2: xc - gap / 2 + 6 }, opacity: 1, duration: .6, stagger: .05, ease: 'power2.out' }, '<')
    .to(q('.sr-note'), { opacity: 1, duration: .4 }, '<.25')
    .to({}, { duration: 1.9 })
    .to(q('.sr-note'), { opacity: 0, duration: .3 })
    .to(inL, { attr: { x2: xc + .6 }, opacity: 0, duration: .4, ease: 'power2.in' }, '<')
    .to(inR, { attr: { x2: xc - .6 }, opacity: 0, duration: .4, ease: 'power2.in' }, '<')
    .to(q('.sr-right'), { x: 0, duration: .9, ease: 'power2.inOut' }, '-=.1')
    .to(qa('.sr-cut'), { opacity: 0, duration: .25 }, '-=.15')
    .to(q('.sr-sec'), { opacity: 1, duration: .35 }, '<')
    .to([q('.sr-F'), q('.sr-Ft')], { opacity: 0, duration: .4 }, '+=.5')
    .to([q('.sr-F'), q('.sr-Ft')], { opacity: 1, duration: .45 }, '+=.7')
    .fromTo(q('.sr-F'), { scaleX: .4, svgOrigin: `${SR.x1 + 7} 300` }, { scaleX: 1, svgOrigin: `${SR.x1 + 7} 300`, duration: .5, ease: 'power2.out', immediateRender: false }, '<')
    .to({}, { duration: .6 });
  return t;
}

/* ======================================================================================================
   fourLoads — the L2·S4 figure as drawn blocks: tension (longer, waisted), compression (shorter, barrelled), shear (two
   layers slide), torsion (twisted). Each block loads in turn; the unloaded block stays as a blue ghost.
   ====================================================================================================== */
const FL = { cx: [102, 230, 358, 486], base: 384, a: 35, h: 150, d: 56, kx: .39, ky: .3, kinds: ['tension', 'compression', 'shear', 'torsion'] };
const FL_DEF = {
  tension: (x, y, z, l) => { const s = 1 - .1 * l - .1 * l * Math.sin(Math.PI * y / FL.h), c = FL.h / 2; return [x * s, c + (y - c) * (1 + .17 * l), FL.d / 2 + (z - FL.d / 2) * s]; },
  compression: (x, y, z, l) => { const s = 1 + .05 * l + .13 * l * Math.sin(Math.PI * y / FL.h), c = FL.h / 2; return [x * s, c + (y - c) * (1 - .2 * l), FL.d / 2 + (z - FL.d / 2) * s]; },
  shear: (x, y, z) => [x, y, z],
  torsion: (x, y, z, l) => { const p = .6 * l * (y / FL.h - .5), zc = z - FL.d / 2; return [x * Math.cos(p) - zc * Math.sin(p), y, FL.d / 2 + x * Math.sin(p) + zc * Math.cos(p)]; }
};
function flPart(cx, def, l, y0, y1, xo) {
  const N = 8, a = FL.a, d = FL.d;
  const p = (x, y, z) => { const [X, Y, Z] = def(x, y, z, l); return [cx + xo + X + Z * FL.kx, FL.base - Y - Z * FL.ky]; };
  const edge = (x, z) => Array.from({ length: N + 1 }, (_, i) => p(x, y0 + (y1 - y0) * i / N, z));
  const fl = edge(-a, 0), fr = edge(a, 0), br = edge(a, d), blt = p(-a, y1, d);
  return {
    front: D([...fl, ...fr.slice().reverse()], true), right: D([...fr, ...br.slice().reverse()], true), top: D([fl[N], fr[N], br[N], blt], true),
    lines: D(fl) + D(fr) + D(br) + D([fl[0], fr[0], br[0]]) + D([fl[N], fr[N], br[N], blt], true),
    topC: p(0, y1, d / 2), botC: p(0, y0, d / 2), midL: p(-a, (y0 + y1) / 2, d / 2), midR: p(a, (y0 + y1) / 2, d / 2)
  };
}
function flGeom(i, l) {
  const kind = FL.kinds[i], cx = FL.cx[i], def = FL_DEF[kind];
  if (kind === 'shear') return [flPart(cx, def, l, 0, FL.h / 2, -14 * l), flPart(cx, def, l, FL.h / 2, FL.h, 14 * l)];
  return [flPart(cx, def, l, 0, FL.h, 0)];
}
/** an elliptical arc arrow (torsion) from a0° to a1°, head at a1 */
function earc(k, cx, cy, rx, ry, a0, a1, color, cls) {
  const pt = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const pts = Array.from({ length: 25 }, (_, i) => pt(lerp(a0, a1 - Math.sign(a1 - a0) * 14, i / 24)));
  const e = pt(a1), b = pts[pts.length - 1], L = Math.hypot(e[0] - b[0], e[1] - b[1]), ux = (e[0] - b[0]) / L, uy = (e[1] - b[1]) / L;
  return `<g class="${cls}"><path d="${D(pts)}" fill="none" stroke="${color}" stroke-width="5"/><polygon points="${P([[e[0] + ux * 4, e[1] + uy * 4], [b[0] - uy * 7, b[1] + ux * 7], [b[0] + uy * 7, b[1] - ux * 7]])}" fill="${color}"/></g>`;
}
function fourLoadsDraw(k) {
  const { INK } = k;
  return FL.kinds.map((kind, i) => {
    const g = flGeom(i, 0), cx = FL.cx[i], c0 = g[0], cN = g[g.length - 1];
    const parts = g.map(p => `<path class="fl-f" d="${p.front}" fill="${AMB}"/><path class="fl-r" d="${p.right}" fill="${AMB2}"/><path class="fl-t" d="${p.top}" fill="#fff"/><path class="fl-l" d="${p.lines}" fill="none" ${k.stroke.thick}/>`).join('');
    const ghost = `<path class="fl-g" d="${g.map(p => p.lines).join('')}" fill="none" stroke="${INK.blue}" stroke-width="1.4" stroke-dasharray="5 4" opacity="0"/>`;
    let ar = '';
    if (kind === 'tension') ar = force(k, cN.topC[0], cN.topC[1] - 8, cN.topC[0], cN.topC[1] - 70, { cls: 'fl-a fl-up' }) + force(k, c0.botC[0], c0.botC[1] + 14, c0.botC[0], c0.botC[1] + 74, { cls: 'fl-a fl-dn' });
    if (kind === 'compression') ar = force(k, cN.topC[0], cN.topC[1] - 76, cN.topC[0], cN.topC[1] - 10, { color: INK.blue, cls: 'fl-a fl-up' }) + force(k, c0.botC[0], c0.botC[1] + 78, c0.botC[0], c0.botC[1] + 16, { color: INK.blue, cls: 'fl-a fl-dn' });
    if (kind === 'shear') ar = force(k, cN.midL[0] - 66, cN.midL[1], cN.midL[0] - 9, cN.midL[1], { cls: 'fl-a fl-up' }) + force(k, c0.midR[0] + 66, c0.midR[1], c0.midR[0] + 9, c0.midR[1], { cls: 'fl-a fl-dn' });
    if (kind === 'torsion') ar = earc(k, cN.topC[0], cN.topC[1] - 30, 40, 12, 150, 400, INK.hot, 'fl-a fl-up') + earc(k, c0.botC[0], c0.botC[1] + 34, 40, 12, 30, -220, INK.hot, 'fl-a fl-dn');
    return `<g class="fl-b" data-i="${i}">${parts}${ghost}${ar}${k.text(cx + 11, 520, kind.toUpperCase(), { size: 19, weight: 700, spacing: 1, extra: 'class="fl-lab"' })}</g>`;
  }).join('');
}
function fourLoadsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const blocks = qa('.fl-b');
  const st = blocks.map(() => ({ l: 0 })), g0 = blocks.map((_, i) => flGeom(i, 0));
  const render = i => {
    const b = blocks[i], g = flGeom(i, st[i].l), ps = ['fl-f', 'fl-r', 'fl-t', 'fl-l'].map(c => b.querySelectorAll('.' + c));
    g.forEach((p, j) => { set(ps[0][j], { d: p.front }); set(ps[1][j], { d: p.right }); set(ps[2][j], { d: p.top }); set(ps[3][j], { d: p.lines }); });
    const kind = FL.kinds[i], a0 = g0[i], up = b.querySelector('.fl-up'), dn = b.querySelector('.fl-dn');
    const N = g.length - 1;
    if (kind === 'tension' || kind === 'compression') {
      set(up, { transform: `translate(0 ${f1(g[N].topC[1] - a0[N].topC[1])})` }); set(dn, { transform: `translate(0 ${f1(g[0].botC[1] - a0[0].botC[1])})` });
    } else if (kind === 'shear') {
      set(up, { transform: `translate(${f1(g[N].midL[0] - a0[N].midL[0])} 0)` }); set(dn, { transform: `translate(${f1(g[0].midR[0] - a0[0].midR[0])} 0)` });
    }
    op(b.querySelector('.fl-g'), cl(st[i].l * 3) * .85);
    b.querySelectorAll('.fl-a').forEach(a => op(a, cl(.25 + st[i].l * 1.5)));
  };
  const t = k.tl();
  if (k.reduced()) blocks.forEach((_, i) => { st[i].l = 1; render(i); });
  else blocks.forEach((_, i) => render(i));
  k.plot(t, qa('.fl-l'), { dur: .8, stagger: .1 });
  k.ink(t, [...qa('.fl-f'), ...qa('.fl-r')], { at: .55, stagger: .03 });
  k.stamp(t, qa('.fl-lab'), { at: .9, stagger: .08 });
  t.from(qa('.fl-a'), { opacity: 0, duration: .4, stagger: .06 }, 1.1);
  if (k.reduced()) return t;
  // each block takes its load in turn, holds, lets go
  const L = gsap.timeline({ repeat: -1, delay: 1.9, repeatDelay: 1 });
  blocks.forEach((_, i) => {
    L.to(st[i], { l: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: () => render(i) }, i * .45)
      .to(st[i], { l: 0, duration: .9, ease: 'power2.inOut', onUpdate: () => render(i) }, i * .45 + 2.6);
  });
  return t;
}

/* ======================================================================================================
   tension — a bar between grips; the upper crosshead pulls. It gets longer (ΔL, red) and thinner (the red arrows);
   the bar it was stays behind as a blue ghost.
   ====================================================================================================== */
const TN = { cx: 300, yt: 192, yb: 432, hw: 30, dl: 52, dw: 7 };
function tnGeom(l) {
  const { cx, yt, yb, hw, dl, dw } = TN; const top = yt - dl * l, w = hw - dw * l, ym = (top + yb) / 2;
  return { top, w, ym };
}
function tensionDraw(k) {
  const { INK, W } = k; const { cx, yt, yb, hw } = TN;
  const jaw = (y) => `${k.rect(cx - 70, y, 140, 50, k.hatch('steel'), 'class="tn-jh"')}${k.rect(cx - 70, y, 140, 50, 'none', `class="tn-jo" ${k.stroke.thick}`)}`;
  const thin = s => `<line class="tn-th" x1="${cx + s * (hw + 32)}" y1="312" x2="${cx + s * (hw + 6)}" y2="312" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)" opacity="0"/>`;
  return `
  <rect class="tn-ghost" x="${cx - hw}" y="${yt}" width="${hw * 2}" height="${yb - yt}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4" opacity="0"/>
  <rect class="tn-fill" x="${cx - hw}" y="${yt}" width="${hw * 2}" height="${yb - yt}" fill="${AMB}"/>
  <rect class="tn-ol" x="${cx - hw}" y="${yt}" width="${hw * 2}" height="${yb - yt}" fill="none" ${k.stroke.thick}/>
  ${k.center(cx, 140, cx, 470, 'class="tn-cl"')}
  <g class="tn-jb">${jaw(yb)}<path class="tn-hid" d="M${cx - hw} ${yb}v34M${cx + hw} ${yb}v34" fill="none" ${k.stroke.hidden}/>${force(k, cx, yb + 56, cx, yb + 110, { cls: 'tn-F' })}</g>
  <g class="tn-jt">${jaw(yt - 50)}<path class="tn-hidt" d="M${cx - hw} ${yt}v-34M${cx + hw} ${yt}v-34" fill="none" ${k.stroke.hidden}/>${force(k, cx, yt - 56, cx, yt - 110, { cls: 'tn-F' })}
    ${k.text(cx + 26, yt - 86, 'F', { size: 26, weight: 700, fill: INK.hot, anchor: 'start' })}</g>
  ${k.text(cx + 26, yb + 98, 'F', { size: 26, weight: 700, fill: INK.hot, anchor: 'start', extra: 'class="tn-Fb"' })}
  ${thin(-1)}${thin(1)}
  <g class="tn-dims">
    ${hair(k, cx - hw - 6, yt, cx - hw - 96, yt, INK.blue)}${hair(k, cx - hw - 6, yb, cx - hw - 96, yb, INK.blue)}
    <line x1="${cx - hw - 86}" y1="${yt}" x2="${cx - hw - 86}" y2="${yb}" stroke="${INK.blue}" stroke-width="${W.thin}" marker-start="url(#arr-blue)" marker-end="url(#arr-blue)"/>
    ${k.text(cx - hw - 96, (yt + yb) / 2 + 7, 'L₀', { size: 22, fill: INK.blue, anchor: 'end', weight: 700 })}
  </g>
  <g class="tn-dl" opacity="0">${hair(k, cx + hw + 6, yt, cx + hw + 92, yt, INK.red)}<line class="tn-dlx" x1="${cx + 76}" y1="${yt}" x2="${cx + hw + 92}" y2="${yt}" stroke="${INK.red}" stroke-width="${W.hair}"/>
    ${dline(k, 'tn-dld', INK.red, 'ΔL', { size: 22, anchor: 'start' })}</g>`;
}
function tensionPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { cx, yb } = TN;
  const fill = q('.tn-fill'), ol = q('.tn-ol'), jt = q('.tn-jt'), hidT = q('.tn-hidt'), hidB = q('.tn-hid'), th = qa('.tn-th'), dlx = q('.tn-dlx'), dld = q('.tn-dld');
  const st = { l: 0 };
  const render = () => {
    const { top, w, ym } = tnGeom(st.l);
    [fill, ol].forEach(e => set(e, { x: cx - w, y: top, width: w * 2, height: yb - top }));
    set(jt, { transform: `translate(0 ${f1(top - TN.yt)})` });
    set(hidT, { d: `M${f1(cx - w)} ${f1(TN.yt)}v-34M${f1(cx + w)} ${f1(TN.yt)}v-34` }); set(hidB, { d: `M${f1(cx - w)} ${yb}v34M${f1(cx + w)} ${yb}v34` });
    th.forEach((e, i) => { const s = i ? 1 : -1; set(e, { x1: cx + s * (w + 32), x2: cx + s * (w + 5), y1: ym, y2: ym }); op(e, cl(st.l * 2.5)); });
    set(dlx, { x1: cx + 76, y1: top, y2: top });
    dset(dld, cx + TN.hw + 80, TN.yt, cx + TN.hw + 80, top, cx + TN.hw + 92, (TN.yt + top) / 2 + 8);
    op(q('.tn-dl'), cl(st.l * 3)); op(q('.tn-ghost'), cl(st.l * 3) * .85);
  };
  const t = k.tl();
  if (k.reduced()) st.l = 1;
  render();
  k.plot(t, [ol, ...qa('.tn-jo')], { dur: .7, stagger: .12 });
  k.ink(t, [fill, ...qa('.tn-jh')], { at: .5 });
  t.from([q('.tn-cl'), hidT, hidB], { opacity: 0, duration: .4 }, .7);
  plotM(k, t, qa('.tn-dims line'), { at: .9, stagger: .06, dur: .5 }); t.from(q('.tn-dims text'), { opacity: 0, duration: .3 }, 1.2);
  k.stamp(t, [...qa('.tn-F'), ...qa('.tn-jt text'), q('.tn-Fb')], { at: 1.1, stagger: .08 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .9 });
  L.to(st, { l: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: render })
    .to({}, { duration: 1.3 })
    .to(st, { l: 0, duration: 1.2, ease: 'power2.inOut', onUpdate: render });
  return t;
}

/* ======================================================================================================
   compression — a short cylinder between platens; the upper platen comes down. It gets shorter (Δh) and bulges
   (barrels) at its middle; the blue ghost is the block it was.
   ====================================================================================================== */
const CP = { cx: 300, yt: 198, yb: 398, hw: 75, dh: 42 };
function cpPath(l) {
  const { cx, yb, hw } = CP; const top = CP.yt + CP.dh * l, ym = (top + yb) / 2, he = hw + 4 * l, hm = hw + 22 * l, c = 2 * hm - he;
  return { d: `M${f1(cx - he)} ${f1(top)}L${f1(cx + he)} ${f1(top)}Q${f1(cx + c)} ${f1(ym)} ${f1(cx + he)} ${yb}L${f1(cx - he)} ${yb}Q${f1(cx - c)} ${f1(ym)} ${f1(cx - he)} ${f1(top)}Z`, top, ym, hm };
}
function compressionDraw(k) {
  const { INK, W } = k; const { cx, yt, yb, hw } = CP; const p = cpPath(0);
  const platen = (y) => `${k.rect(cx - 130, y, 260, 40, k.hatch('steel'), 'class="cp-ph"')}${k.rect(cx - 130, y, 260, 40, 'none', `class="cp-po" ${k.stroke.thick}`)}`;
  const bulge = s => `<line class="cp-bu" x1="${cx + s * (hw + 6)}" y1="298" x2="${cx + s * (hw + 32)}" y2="298" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)" opacity="0"/>`;
  return `
  <rect class="cp-ghost" x="${cx - hw}" y="${yt}" width="${hw * 2}" height="${yb - yt}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4" opacity="0"/>
  <path class="cp-fill" d="${p.d}" fill="${AMB}"/>
  <path class="cp-ol" d="${p.d}" fill="none" ${k.stroke.thick}/>
  ${k.center(cx, 186, cx, 410, 'class="cp-cl"')}
  <g class="cp-pt">${platen(yt - 40)}${force(k, cx, yt - 112, cx, yt - 48, { color: INK.blue, cls: 'cp-F' })}${k.text(cx + 24, yt - 84, 'F', { size: 26, weight: 700, fill: INK.blue, anchor: 'start' })}</g>
  <g class="cp-pb">${platen(yb)}${force(k, cx, yb + 112, cx, yb + 48, { color: INK.blue, cls: 'cp-F' })}${k.text(cx + 24, yb + 92, 'F', { size: 26, weight: 700, fill: INK.blue, anchor: 'start' })}</g>
  ${bulge(-1)}${bulge(1)}
  <g class="cp-dims">
    ${hair(k, cx - hw - 6, yt, cx - hw - 70, yt, INK.blue)}${hair(k, cx - hw - 6, yb, cx - hw - 70, yb, INK.blue)}
    <line x1="${cx - hw - 60}" y1="${yt}" x2="${cx - hw - 60}" y2="${yb}" stroke="${INK.blue}" stroke-width="${W.thin}" marker-start="url(#arr-blue)" marker-end="url(#arr-blue)"/>
    ${k.text(cx - hw - 70, (yt + yb) / 2 + 7, 'h₀', { size: 22, fill: INK.blue, anchor: 'end', weight: 700 })}
  </g>
  <g class="cp-dh" opacity="0">${hair(k, cx + hw + 6, yt, 476, yt, INK.red)}<line class="cp-dhx" x1="436" y1="${yt}" x2="476" y2="${yt}" stroke="${INK.red}" stroke-width="${W.hair}"/>${dline(k, 'cp-dhd', INK.red, 'Δh', { size: 22, anchor: 'start' })}</g>`;
}
function compressionPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { cx, hw } = CP;
  const fill = q('.cp-fill'), ol = q('.cp-ol'), pt = q('.cp-pt'), bu = qa('.cp-bu'), dh = q('.cp-dhd');
  const st = { l: 0 };
  const render = () => {
    const p = cpPath(st.l); set(fill, { d: p.d }); set(ol, { d: p.d });
    set(pt, { transform: `translate(0 ${f1(p.top - CP.yt)})` });
    bu.forEach((e, i) => { const s = i ? 1 : -1; set(e, { x1: cx + s * (p.hm + 6), x2: cx + s * (p.hm + 34), y1: p.ym, y2: p.ym }); op(e, cl(st.l * 2.5)); });
    dset(dh, 462, CP.yt, 462, p.top, 472, (CP.yt + p.top) / 2 + 8); set(q('.cp-dhx'), { y1: p.top, y2: p.top });
    op(q('.cp-dh'), cl(st.l * 3)); op(q('.cp-ghost'), cl(st.l * 3) * .85);
  };
  const t = k.tl();
  if (k.reduced()) st.l = 1;
  render();
  k.plot(t, [ol, ...qa('.cp-po')], { dur: .7, stagger: .12 });
  k.ink(t, [fill, ...qa('.cp-ph')], { at: .5 });
  t.from(q('.cp-cl'), { opacity: 0, duration: .4 }, .7);
  plotM(k, t, qa('.cp-dims line'), { at: .9, stagger: .06, dur: .5 }); t.from(q('.cp-dims text'), { opacity: 0, duration: .3 }, 1.2);
  k.stamp(t, [...qa('.cp-F'), ...qa('.cp-pt text, .cp-pb text')], { at: 1.1, stagger: .08 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .9 });
  L.to(st, { l: 1, duration: 1.7, ease: 'power2.inOut', onUpdate: render })
    .to({}, { duration: 1.3 })
    .to(st, { l: 0, duration: 1.2, ease: 'power2.inOut', onUpdate: render });
  return t;
}

/* ======================================================================================================
   shearStress — a riveted lap joint in section: the plates are pulled opposite ways and the rivet's two halves slide
   past each other along the shear plane (red). The rivet's centre line shows how far they went.
   ====================================================================================================== */
const SH = { yi: 290, t: 38, rx: 300, rw: 17, hr: 31, hh: 21, slide: 17 };
function shearStressDraw(k) {
  const { INK, W } = k; const { yi, t, rx, rw, hr, hh } = SH;
  const yu = yi - t, yl = yi + t;
  const upR = `M${rx - rw} ${yi}V${yu}H${rx - hr}A${hr} ${hh} 0 0 1 ${rx + hr} ${yu}H${rx + rw}V${yi}`;
  const loR = `M${rx - rw} ${yi}V${yl}H${rx - hr}A${hr} ${hh} 0 0 0 ${rx + hr} ${yl}H${rx + rw}V${yi}`;
  const rivet = (d, cls) => `<path class="sh-rw" d="${d}Z" fill="#EFD6C4"/><path class="sh-rh" d="${d}Z" fill="${k.hatch('bronze')}"/><path class="sh-ro ${cls}" d="${d}" fill="none" ${k.stroke.thick}/>`;
  return `
  <g class="sh-lo">
    ${k.rect(228, yi, 276, t, k.hatch('iron'), 'class="sh-ph"')}${k.rect(228, yi, 276, t, 'none', `class="sh-po" ${k.stroke.thick}`)}
    ${rivet(loR, '')}${force(k, 510, yi + t / 2, 560, yi + t / 2, { cls: 'sh-F' })}
  </g>
  <g class="sh-up">
    ${k.rect(96, yu, 276, t, k.hatch('steel'), 'class="sh-ph"')}${k.rect(96, yu, 276, t, 'none', `class="sh-po" ${k.stroke.thick}`)}
    ${rivet(upR, '')}${force(k, 90, yu + t / 2, 40, yu + t / 2, { cls: 'sh-F' })}
  </g>
  ${k.text(66, yu - 16, 'F', { size: 26, weight: 700, fill: INK.hot, extra: 'class="sh-Ft"' })}${k.text(534, yl + 40, 'F', { size: 26, weight: 700, fill: INK.hot, extra: 'class="sh-Ft"' })}
  ${k.center(rx, yu - hh - 18, rx, yl + hh + 18, 'class="sh-cl"')}
  <line class="sh-pl" x1="${rx - 62}" y1="${yi}" x2="${rx + 62}" y2="${yi}" stroke="${INK.red}" stroke-width="${W.med}" stroke-dasharray="14 4 3 4"/>
  <g class="sh-note">${k.leader(rx + 46, yi + 2, rx + 92, 410, 'shear plane', { color: INK.red, size: 19 })}</g>
  <g class="sh-tau" opacity="0">
    <line x1="${rx + 22}" y1="${yi - 10}" x2="${rx - 22}" y2="${yi - 10}" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)"/>
    <line x1="${rx - 22}" y1="${yi + 10}" x2="${rx + 22}" y2="${yi + 10}" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)"/>
  </g>
`;
}
function shearStressPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const s = SH.slide;
  const t = k.tl();
  k.plot(t, [...qa('.sh-po'), ...qa('.sh-ro')], { dur: .7, stagger: .1 });
  k.ink(t, [...qa('.sh-ph'), ...qa('.sh-rh')], { at: .6 });
  t.from(q('.sh-cl'), { opacity: 0, duration: .4 }, .8);
  plotM(k, t, [q('.sh-pl'), ...qa('.sh-note line, .sh-note polyline')], { at: 1, stagger: .06, dur: .5 });
  t.from(q('.sh-note text'), { opacity: 0, duration: .3 }, 1.3);
  k.stamp(t, [...qa('.sh-F'), ...qa('.sh-Ft')], { at: 1.1, stagger: .08 });
  if (k.reduced()) { gsap.set(q('.sh-up'), { x: -s }); gsap.set(q('.sh-lo'), { x: s }); gsap.set(q('.sh-tau'), { opacity: 1 }); return t; }
  const L = gsap.timeline({ repeat: -1, delay: 1.9, repeatDelay: 1 });
  L.to(q('.sh-up'), { x: -s, duration: 1.4, ease: 'power2.inOut' })
    .to(q('.sh-lo'), { x: s, duration: 1.4, ease: 'power2.inOut' }, '<')
    .to(q('.sh-tau'), { opacity: 1, duration: .5 }, '<.5')
    .to({}, { duration: 1.4 })
    .to(q('.sh-tau'), { opacity: 0, duration: .4 })
    .to([q('.sh-up'), q('.sh-lo')], { x: 0, duration: 1.1, ease: 'power2.inOut' }, '<');
  return t;
}

/* ======================================================================================================
   torsion — a shaft fixed in a wall, a torque T at its free end (end view on the right). Its straight surface lines
   wind into helices and the end turns through the angle of twist φ.
   ====================================================================================================== */
const TO = { x0: 104, x1: 410, cy: 300, R: 42, ex: 496, phi: 34 * Math.PI / 180, th: [-56, -28, 0, 28, 56] };
function toGen(th, f) {
  const { x0, x1, cy, R } = TO;
  return Array.from({ length: 15 }, (_, i) => { const s = i / 14, a = (th * Math.PI / 180) + TO.phi * f * s; return [x0 + (x1 - x0) * s, cy - R * Math.sin(a)]; });
}
function torsionDraw(k) {
  const { INK, W } = k; const { x0, x1, cy, R, ex } = TO;
  const rings = [.25, .5, .75].map(s => `<line class="to-ring" x1="${f1(x0 + (x1 - x0) * s)}" y1="${cy - R}" x2="${f1(x0 + (x1 - x0) * s)}" y2="${cy + R}" stroke="${INK.graphite2}" stroke-width="${W.thin}"/>`).join('');
  const gens = TO.th.map((th, i) => `<path class="to-gen" d="${D(toGen(th, 0))}" fill="none" stroke="${th === 0 ? INK.red : INK.graphite2}" stroke-width="${th === 0 ? W.med : W.thin}"/>`).join('');
  return `
  ${ground(k, 62, 196, 42, 208, 'right', 'to-wall')}
  <rect class="to-fill" x="${x0}" y="${cy - R}" width="${x1 - x0}" height="${R * 2}" fill="${AMB}"/>
  ${rings}${gens}
  <path class="to-ol" d="M${x0} ${cy - R}H${x1}V${cy + R}H${x0}" fill="none" ${k.stroke.thick}/>
  ${k.center(86, cy, x1 + 18, cy, 'class="to-cl"')}
  <g class="to-proj">${hair(k, x1 + 8, cy - R, ex + 6, cy - R, INK.blue, 'stroke-dasharray="4 4"')}${hair(k, x1 + 8, cy + R, ex + 6, cy + R, INK.blue, 'stroke-dasharray="4 4"')}</g>
  <g class="to-end">
    <circle class="to-ef" cx="${ex}" cy="${cy}" r="${R}" fill="${AMB}"/>
    <circle class="to-eo" cx="${ex}" cy="${cy}" r="${R}" fill="none" ${k.stroke.thick}/>
    ${k.center(ex - R - 12, cy, ex + R + 12, cy, 'class="to-ec"')}${k.center(ex, cy - R - 12, ex, cy + R + 12, 'class="to-ec"')}
    <line class="to-ref" x1="${ex}" y1="${cy}" x2="${ex}" y2="${cy - R}" stroke="${INK.blue}" stroke-width="${W.med}" stroke-dasharray="5 4"/>
    <line class="to-rad" x1="${ex}" y1="${cy}" x2="${ex}" y2="${cy - R}" stroke="${INK.red}" stroke-width="${W.thick}" stroke-linecap="round"/>
    <circle cx="${ex}" cy="${cy}" r="4" fill="${INK.graphite}"/>
    <path class="to-phi" d="M${ex} ${cy - 26}A26 26 0 0 1 ${ex} ${cy - 26}" fill="none" stroke="${INK.red}" stroke-width="${W.thin}"/>
    <g class="to-phit" opacity="0">${k.text(ex + 21, cy - 9, 'φ', { size: 22, fill: INK.red, weight: 700 })}</g>
  </g>
  ${earc(k, ex, cy, 58, 58, 200, 330, INK.hot, 'to-T')}
  <g class="to-Tt">${k.text(ex - 50, cy - 60, 'T', { size: 28, weight: 700, fill: INK.hot })}</g>`;
}
function torsionPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { ex, cy } = TO;
  const gens = qa('.to-gen'), rad = q('.to-rad'), phi = q('.to-phi');
  const st = { f: 0 };
  const render = () => {
    gens.forEach((g, i) => set(g, { d: D(toGen(TO.th[i], st.f)) }));
    const a = TO.phi * st.f, r = 26, R = TO.R;
    set(rad, { x2: ex + R * Math.sin(a), y2: cy - R * Math.cos(a) });
    set(phi, { d: `M${ex} ${cy - r}A${r} ${r} 0 0 1 ${f1(ex + r * Math.sin(a))} ${f1(cy - r * Math.cos(a))}` });
    op(q('.to-phit'), cl(st.f * 2)); op(q('.to-T'), cl(.3 + st.f * 1.4)); op(q('.to-Tt'), cl(.3 + st.f * 1.4));
  };
  const t = k.tl();
  if (k.reduced()) st.f = 1;
  render();
  k.plot(t, [q('.to-wall .gd-f'), q('.to-ol'), q('.to-eo')], { dur: .7, stagger: .14 });
  k.ink(t, [q('.to-wall .gd-h'), q('.to-fill'), q('.to-ef')], { at: .5 });
  k.plot(t, [...qa('.to-ring'), ...gens], { at: .8, stagger: .05, dur: .5 });
  t.from([q('.to-cl'), ...qa('.to-ec'), q('.to-proj')], { opacity: 0, duration: .4 }, 1);
  k.plot(t, [q('.to-ref'), rad], { at: 1.1, stagger: .1, dur: .4 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.9, repeatDelay: .9 });
  L.to(st, { f: 1, duration: 1.7, ease: 'power2.inOut', onUpdate: render })
    .to({}, { duration: 1.2 })
    .to(st, { f: 0, duration: 1.3, ease: 'power2.inOut', onUpdate: render });
  return t;
}

/* ======================================================================================================
   elastic — a tension spring hanging from a bracket. Load on: it stretches (ΔL). Load off: it comes back to exactly
   L₀ (the blue line). BEFORE · LOADED · AFTER light up in turn.
   ====================================================================================================== */
const EL = { cx: 266, top: 96, c0: 136, c1: 316, n: 9, r: 34, dl: 92 };
function elSpring(ext) {
  const { cx, c0, n, r } = EL; const c1 = EL.c1 + ext, p = (c1 - c0) / n;
  let fr = '', bk = '';
  for (let i = 0; i < n; i++) {
    const y = c0 + i * p;
    fr += `M${f1(cx - r)} ${f1(y)}L${f1(cx + r)} ${f1(y + p / 2)}`;
    bk += `M${f1(cx + r)} ${f1(y + p / 2)}L${f1(cx - r)} ${f1(y + p)}`;
  }
  return { fr: `M${cx} ${c0 - 8}L${f1(cx - r)} ${c0}` + fr + `M${f1(cx - r)} ${f1(c1)}L${cx} ${f1(c1 + 8)}`, bk, c1 };
}
function elasticDraw(k) {
  const { INK, W } = k; const { cx, top, c1 } = EL; const s = elSpring(0), y1 = c1 + 34;
  return `
  ${ground(k, cx - 104, 62, 208, 34, 'bottom', 'el-sup')}
  <path class="el-hk" d="M${cx} ${top}V${EL.c0 - 22}" fill="none" ${k.stroke.thick}/>
  <circle class="el-hk" cx="${cx}" cy="${EL.c0 - 15}" r="7" fill="none" ${k.stroke.thick}/>
  <path class="el-bk" d="${s.bk}" fill="none" stroke="${INK.graphite2}" stroke-width="${W.med}" stroke-linecap="round"/>
  <path class="el-fr" d="${s.fr}" fill="none" ${k.stroke.thick}/>
  <g class="el-end"><circle class="el-eo" cx="${cx}" cy="${c1 + 18}" r="10" fill="#fff" ${k.stroke.thick}/><line class="el-eo" x1="${cx}" y1="${c1 + 28}" x2="${cx}" y2="${y1}" ${k.stroke.thick}/>
    ${force(k, cx, y1 + 6, cx, y1 + 82, { cls: 'el-F' })}${k.text(cx + 22, y1 + 60, 'F', { size: 26, weight: 700, fill: INK.hot, anchor: 'start', extra: 'class="el-Ft"' })}</g>
  <line class="el-ref" x1="${cx - 120}" y1="${y1}" x2="${cx + 96}" y2="${y1}" stroke="${INK.blue}" stroke-width="${W.med}" stroke-dasharray="10 5"/>
  <g class="el-dims">
    <line x1="${cx - 104}" y1="${top}" x2="${cx - 104}" y2="${y1}" stroke="${INK.blue}" stroke-width="${W.thin}" marker-start="url(#arr-blue)" marker-end="url(#arr-blue)"/>
    ${k.text(cx - 114, (top + y1) / 2 + 8, 'L₀', { size: 24, fill: INK.blue, anchor: 'end', weight: 700 })}
  </g>
  <g class="el-dl" opacity="0">${dline(k, 'el-dld', INK.red, 'ΔL', { size: 22, anchor: 'start' })}</g>
  ${tags(k, 410, 214, ['BEFORE', 'LOADED', 'AFTER'], 'el-tags')}`;
}
function elasticPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { cx } = EL;
  const fr = q('.el-fr'), bk = q('.el-bk'), end = q('.el-end'), dl = q('.el-dld');
  const st = { e: 0 }, y1 = EL.c1 + 34;
  const render = () => {
    const s = elSpring(st.e * EL.dl); set(fr, { d: s.fr }); set(bk, { d: s.bk });
    set(end, { transform: `translate(0 ${f1(st.e * EL.dl)})` });
    dset(dl, cx + 70, y1, cx + 70, y1 + st.e * EL.dl, cx + 80, y1 + st.e * EL.dl / 2 + 8);
    op(q('.el-dl'), cl(st.e * 4));
  };
  render();
  const t = k.tl();
  k.plot(t, [q('.el-sup .gd-f'), ...qa('.el-hk'), fr, bk, ...qa('.el-eo')], { dur: .7, stagger: .1 });
  k.ink(t, [q('.el-sup .gd-h')], { at: .5 });
  plotM(k, t, [q('.el-ref'), q('.el-dims line')], { at: 1, stagger: .1, dur: .5 }); t.from(q('.el-dims text'), { opacity: 0, duration: .3 }, 1.3);
  k.stamp(t, [q('.el-tags')], { at: 1.2 });
  gsap.set([q('.el-F'), q('.el-Ft')], { opacity: 0 });
  if (k.reduced()) { gsap.set(qa('.el-tags .tg'), { opacity: (i) => (i === 2 ? 1 : .28) }); gsap.set(q('.el-tags .tg-ptr'), { y: 68 }); return t; }
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to([q('.el-F'), q('.el-Ft')], { opacity: 1, duration: .4 })
    .to(st, { e: 1, duration: 1.4, ease: 'power2.inOut', onUpdate: render }, '<.1');
  lightTag(L, svg, 'el-tags', 1, '<.2');
  L.to({}, { duration: 1.2 })
    .to([q('.el-F'), q('.el-Ft')], { opacity: 0, duration: .35 })
    .to(st, { e: 0, duration: 1.1, ease: 'elastic.out(1, .55)', onUpdate: render }, '<');
  lightTag(L, svg, 'el-tags', 2, '<.5');
  L.fromTo(q('.el-ref'), { attr: { 'stroke-width': k.W.med } }, { attr: { 'stroke-width': 4 }, duration: .3, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, '<.6')
    .to({}, { duration: 1.6 });
  lightTag(L, svg, 'el-tags', 0, '>');
  L.to({}, { duration: .9 });
  return t;
}

/* ======================================================================================================
   plastic — the same rig with a soft copper bar. Load on: it stretches. Load off: it gives back only a hair and
   stays longer: the red ΔL is permanent. Then a fresh bar.
   ====================================================================================================== */
const PL = { cx: 266, top: 96, yb: 300, hw: 22, dl: 74, back: 9 };
function plGeom(e) { const { cx, yb, hw } = PL; const y = yb + e, w = hw / Math.sqrt(1 + e / (yb - PL.top)); return { y, w, d: `M${f1(cx - w)} ${PL.top}V${f1(y)}H${f1(cx + w)}V${PL.top}` }; }
function plasticDraw(k) {
  const { INK, W } = k; const { cx, top, yb, hw } = PL; const g = plGeom(0), y1 = yb + hw + 30;
  return `
  ${ground(k, cx - 104, 62, 208, 34, 'bottom', 'pl-sup')}
  <rect class="pl-wash" x="${cx - hw}" y="${top}" width="${hw * 2}" height="${yb - top}" fill="#F0DACB"/>
  <rect class="pl-fill" x="${cx - hw}" y="${top}" width="${hw * 2}" height="${yb - top}" fill="${k.hatch('bronze')}"/>
  <path class="pl-ol" d="${g.d}" fill="none" ${k.stroke.thick}/>
  <g class="pl-end">
    <path class="pl-eye" d="M${cx - hw} ${yb}V${yb + 8}A${hw} ${hw} 0 0 0 ${cx + hw} ${yb + 8}V${yb}Z" fill="${AMB}" ${k.stroke.thick}/>
    <circle class="pl-eye" cx="${cx}" cy="${yb + 9}" r="8.5" fill="#fff" ${k.stroke.thick}/>
    <line class="pl-eye" x1="${cx}" y1="${yb + 17.5}" x2="${cx}" y2="${y1}" ${k.stroke.thick}/>
    ${force(k, cx, y1, cx, y1 + 72, { cls: 'pl-F' })}${k.text(cx + 22, y1 + 52, 'F', { size: 26, weight: 700, fill: INK.hot, anchor: 'start', extra: 'class="pl-Ft"' })}
  </g>
  ${k.center(cx, top - 14, cx, yb + 24, 'class="pl-cl"')}
  <line class="pl-ref" x1="${cx - 120}" y1="${yb}" x2="${cx + 96}" y2="${yb}" stroke="${INK.blue}" stroke-width="${W.med}" stroke-dasharray="10 5"/>
  <g class="pl-dims">
    <line x1="${cx - 104}" y1="${top}" x2="${cx - 104}" y2="${yb}" stroke="${INK.blue}" stroke-width="${W.thin}" marker-start="url(#arr-blue)" marker-end="url(#arr-blue)"/>
    ${k.text(cx - 114, (top + yb) / 2 + 8, 'L₀', { size: 24, fill: INK.blue, anchor: 'end', weight: 700 })}
  </g>
  <g class="pl-dlw"><g class="pl-dl" opacity="0">${dline(k, 'pl-dld', INK.red, '', { size: 22, anchor: 'start' })}
    <g class="pl-w0">${k.text(0, 0, 'ΔL', { size: 22, fill: INK.red, anchor: 'start', weight: 700 })}</g>
    <g class="pl-w1" opacity="0">${k.text(0, 0, 'permanent', { size: 20, fill: INK.red, anchor: 'start', weight: 700 })}</g></g></g>
  ${tags(k, 410, 214, ['BEFORE', 'LOADED', 'AFTER'], 'pl-tags')}`;
}
function plasticPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { cx, yb, top } = PL;
  const fill = q('.pl-fill'), wash = q('.pl-wash'), ol = q('.pl-ol'), end = q('.pl-end'), dl = q('.pl-dld'), w0 = q('.pl-w0 text'), w1 = q('.pl-w1 text');
  const st = { e: 0 };
  const render = () => {
    const g = plGeom(st.e); [fill, wash].forEach(e => set(e, { x: cx - g.w, width: g.w * 2, height: g.y - top })); set(ol, { d: g.d });
    set(end, { transform: `translate(0 ${f1(st.e)})` });
    dset(dl, cx + 70, yb, cx + 70, g.y, 0, 0); set(w0, { x: cx + 80, y: yb + st.e / 2 + 8 }); set(w1, { x: cx + 80, y: yb + st.e / 2 + 8 });
    op(q('.pl-dl'), cl(st.e / 12));
  };
  render();
  const t = k.tl();
  k.plot(t, [q('.pl-sup .gd-f'), ol, ...qa('.pl-eye')], { dur: .7, stagger: .1 });
  k.ink(t, [q('.pl-sup .gd-h'), wash, fill], { at: .5 });
  t.from(q('.pl-cl'), { opacity: 0, duration: .4 }, .8);
  plotM(k, t, [q('.pl-ref'), q('.pl-dims line')], { at: 1, stagger: .1, dur: .5 }); t.from(q('.pl-dims text'), { opacity: 0, duration: .3 }, 1.3);
  k.stamp(t, [q('.pl-tags')], { at: 1.2 });
  gsap.set([q('.pl-F'), q('.pl-Ft')], { opacity: 0 });
  const after = PL.dl - PL.back;
  if (k.reduced()) { st.e = after; render(); gsap.set(q('.pl-w0'), { opacity: 0 }); gsap.set(q('.pl-w1'), { opacity: 1 }); gsap.set(qa('.pl-tags .tg'), { opacity: (i) => (i === 2 ? 1 : .28) }); gsap.set(q('.pl-tags .tg-ptr'), { y: 68 }); return t; }
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to([q('.pl-F'), q('.pl-Ft')], { opacity: 1, duration: .4 })
    .to(st, { e: PL.dl, duration: 1.6, ease: 'power2.inOut', onUpdate: render }, '<.1');
  lightTag(L, svg, 'pl-tags', 1, '<.2');
  L.to({}, { duration: 1 })
    .to([q('.pl-F'), q('.pl-Ft')], { opacity: 0, duration: .35 })
    .to(st, { e: after, duration: .6, ease: 'power2.out', onUpdate: render }, '<');
  lightTag(L, svg, 'pl-tags', 2, '<.3');
  L.to(q('.pl-w0'), { opacity: 0, duration: .3 }, '<.3').to(q('.pl-w1'), { opacity: 1, duration: .4 }, '<.1')
    .to({}, { duration: 2.2 })
    // a fresh bar for the next test
    .to([wash, fill, ol, end, q('.pl-dlw')], { opacity: 0, duration: .5 })
    .add(() => { st.e = 0; render(); })
    .set(q('.pl-w0'), { opacity: 1 }).set(q('.pl-w1'), { opacity: 0 }).set(q('.pl-dlw'), { opacity: 1 });
  lightTag(L, svg, 'pl-tags', 0, '<');
  L.to([wash, fill, ol, end], { opacity: 1, duration: .6 }, '+=.2').to({}, { duration: .8 });
  return t;
}

/* ======================================================================================================
   yield — a cantilever and its stress–strain chart, in step. Below the red yield line the bar springs back (the pen
   comes back down the same line); above it, it stays bent (the pen comes down a parallel line: permanent strain).
   ====================================================================================================== */
const YD = (() => {
  const O = [112, 520], Y = [160, 392];
  const plast = bez(Y, [196, 378], [250, 370], [306, 366], 12);
  const B1 = plast[plast.length - 1], sl = (Y[0] - O[0]) / (O[1] - Y[1]), B2 = [B1[0] - (O[1] - B1[1]) * sl, O[1]];
  const A1 = [lerp(O[0], Y[0], .72), lerp(O[1], Y[1], .72)];
  return { O, Y, plast, B1, B2, A1, curve: [O, ...plast, [470, 360]], x0: 94, x1: 466, yc: 178, h: 24, kd: .66 };
})();
function ydBar(d) {
  const { x0, x1, yc, h } = YD; const L = x1 - x0, t = yc - h / 2, b = yc + h / 2;
  return `M${x0} ${f1(t)}C${f1(x0 + L / 3)} ${f1(t)} ${f1(x0 + 2 * L / 3)} ${f1(t + d / 2)} ${x1} ${f1(t + d)}L${x1} ${f1(b + d)}C${f1(x0 + 2 * L / 3)} ${f1(b + d / 2)} ${f1(x0 + L / 3)} ${f1(b)} ${x0} ${f1(b)}`;
}
function yieldDraw(k) {
  const { INK, W } = k; const { O, Y, B1, B2, A1, x0, x1, yc, h } = YD;
  return `
  ${ground(k, 54, 110, 40, 136, 'right', 'yd-wall')}
  <rect class="yd-ghost" x="${x0}" y="${yc - h / 2}" width="${x1 - x0}" height="${h}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4"/>
  <path class="yd-fill" d="${ydBar(0)}Z" fill="${AMB}"/>
  <path class="yd-ol" d="${ydBar(0)}" fill="none" ${k.stroke.thick}/>
  <g class="yd-Fg">${force(k, x1 - 14, yc - h / 2 - 74, x1 - 14, yc - h / 2 - 6, { cls: 'yd-F' })}${k.text(x1 - 34, yc - h / 2 - 44, 'F', { size: 26, weight: 700, fill: INK.hot, anchor: 'end' })}</g>
  <g class="yd-say0" opacity="0">${k.text(556, 252, 'springs back', { size: 19, weight: 700, anchor: 'end', fill: INK.graphite2 })}</g>
  <g class="yd-say1" opacity="0">${k.text(556, 252, 'stays bent', { size: 19, weight: 700, anchor: 'end', fill: INK.red })}</g>
  <g class="yd-graph">
    <line class="yd-ax" x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="318" ${k.stroke.thick} marker-end="url(#arr)"/>
    <line class="yd-ax" x1="${O[0]}" y1="${O[1]}" x2="488" y2="${O[1]}" ${k.stroke.thick} marker-end="url(#arr)"/>
    ${k.text(94, 430, 'stress', { size: 16, rotate: -90 })}${k.text(486, 544, 'strain', { size: 16, anchor: 'end' })}
    <path class="yd-cv" d="${D(YD.curve)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}"/>
    <line class="yd-yl" x1="${O[0]}" y1="${Y[1]}" x2="482" y2="${Y[1]}" stroke="${INK.red}" stroke-width="${W.med}" stroke-dasharray="12 5"/>
    ${k.text(482, Y[1] - 10, 'yield strength', { size: 17, anchor: 'end', fill: INK.red, weight: 700, extra: 'class="yd-ylt"' })}
    <path class="yd-tA" d="${D([O, A1])}" fill="none" stroke="${INK.red}" stroke-width="${W.thick}" stroke-linecap="round" opacity="0"/>
    <path class="yd-tB" d="${D([O, Y, ...YD.plast.slice(1)])}" fill="none" stroke="${INK.red}" stroke-width="${W.thick}" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
    <path class="yd-tC" d="${D([B1, B2])}" fill="none" stroke="${INK.red}" stroke-width="${W.med}" stroke-dasharray="7 5" opacity="0"/>
    <g class="yd-perm" opacity="0">${dline(k, 'yd-pd', INK.red, 'permanent', { size: 15 })}</g>
    <circle class="yd-pen" cx="${O[0]}" cy="${O[1]}" r="7" fill="${INK.hot}" stroke="#fff" stroke-width="2.5"/>
  </g>`;
}
function yieldPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { O, Y, B1, B2, A1, kd, x1, yc, h } = YD;
  const fill = q('.yd-fill'), ol = q('.yd-ol'), Fg = q('.yd-Fg'), pen = q('.yd-pen');
  const wA = walker([O, A1]), wB = walker([O, Y, ...YD.plast.slice(1)]), wC = walker([B1, B2]);
  const st = { a: 0, b: 0, c: 0, x: O[0], y: O[1] };
  const bend = (x, y) => { const d = (x - O[0]) * kd; set(fill, { d: ydBar(d) + 'Z' }); set(ol, { d: ydBar(d) }); set(Fg, { transform: `translate(0 ${f1(d)})` }); set(pen, { cx: x, cy: y }); };
  const tr = (el, w, u) => { const L = w.L + 2; el.style.strokeDasharray = `${f1(L)} ${f1(L)}`; el.style.strokeDashoffset = f1(L * (1 - u)); };
  const t = k.tl();
  k.plot(t, [q('.yd-wall .gd-f'), ol], { dur: .7, stagger: .12 }); plotM(k, t, qa('.yd-ax'), { at: .2, dur: .7, stagger: .12 });
  k.ink(t, [q('.yd-wall .gd-h'), fill], { at: .5 });
  t.from(qa('.yd-graph > text:not(.yd-ylt)'), { opacity: 0, duration: .3 }, .9);
  k.plot(t, [q('.yd-ghost'), q('.yd-cv'), q('.yd-yl')], { at: .8, stagger: .12, dur: .7 });
  k.stamp(t, [q('.yd-ylt'), pen], { at: 1.3, stagger: .1 });
  gsap.set(Fg, { opacity: 0 });
  const perm = () => { dset(q('.yd-pd'), O[0], O[1] + 18, B2[0], O[1] + 18, (O[0] + B2[0]) / 2, O[1] + 12); };
  perm();
  if (k.reduced()) {
    bend(B2[0], B2[1]); [q('.yd-tB'), q('.yd-tC'), q('.yd-perm'), q('.yd-say1')].forEach(e => e.setAttribute('opacity', 1));
    return t;
  }
  const ride = (w, key, el, dur, ease) => ({ [key]: 1, duration: dur, ease, onUpdate: () => { const [x, y] = w.at(st[key]); bend(x, y); if (el) tr(el, w, st[key]); } });
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.set(q('.yd-tA'), { opacity: 1 }).add(() => tr(q('.yd-tA'), wA, 0))
    // small load: up the elastic line and back down it — the bar springs back
    .to(Fg, { opacity: 1, duration: .35 })
    .to(st, ride(wA, 'a', q('.yd-tA'), 1.1, 'power2.inOut'), '<')
    .to(Fg, { opacity: 0, duration: .35 }, '+=.4')
    .to(st, { a: 0, duration: 1, ease: 'power2.inOut', onUpdate: () => { const [x, y] = wA.at(st.a); bend(x, y); } }, '<')
    .to(q('.yd-say0'), { opacity: 1, duration: .4 }, '-=.3')
    .to(q('.yd-say0'), { opacity: 0, duration: .4 }, '+=1.1')
    // big load: past the yield line — it comes back down a parallel line and stays bent
    .set(q('.yd-tB'), { opacity: 1 }).add(() => tr(q('.yd-tB'), wB, 0))
    .to(Fg, { opacity: 1, duration: .35 })
    .to(st, ride(wB, 'b', q('.yd-tB'), 2.2, 'power1.inOut'), '<')
    .set(q('.yd-tC'), { opacity: 1 }).add(() => tr(q('.yd-tC'), wC, 0))
    .to(Fg, { opacity: 0, duration: .35 }, '+=.3')
    .to(st, ride(wC, 'c', q('.yd-tC'), 1, 'power2.out'), '<')
    .to([q('.yd-perm'), q('.yd-say1')], { opacity: 1, duration: .45 }, '-=.3')
    .to({}, { duration: 2.2 })
    // a fresh bar
    .to([fill, ol, pen, q('.yd-tA'), q('.yd-tB'), q('.yd-tC'), q('.yd-perm'), q('.yd-say1')], { opacity: 0, duration: .5 })
    .add(() => { st.a = st.b = st.c = 0; bend(O[0], O[1]); })
    .to([fill, ol, pen], { opacity: 1, duration: .6 }, '+=.15')
    .to({}, { duration: .6 });
  return t;
}

/* ======================================================================================================
   necking — a round bar gripped at the left, pulled at the right. It stretches evenly, then thins in one place
   (the red dimension follows the neck) and snaps in two.
   ====================================================================================================== */
const NK = { x0: 112, x1: 452, cy: 280, hw: 32, ext: 40 };
function nkGeom(e, n, brk) {
  const { x0, x1, cy, hw } = NK; const L = x1 - x0 + e, xe = x0 + L, xn = x0 + L / 2, g = brk * 18;
  const hu = hw / Math.sqrt(1 + Math.min(e, 26) / (x1 - x0));
  const w = x => hu * (1 - n * Math.exp(-(((x - xn) / 24) ** 2)));
  const N = 40, xs = Array.from({ length: N + 1 }, (_, i) => x0 + L * i / N);
  const lo = xs.slice(0, N / 2 + 1), hi = xs.slice(N / 2);
  const T = x => [x, cy - w(x)], B = x => [x, cy + w(x)];
  const wn = w(xn);
  return {
    lO: D([...lo.map(T)]) + D([...lo.map(B)]),
    rO: D([...hi.map(x => [x + g, cy - w(x)]), [xe + g, cy + w(xe)], ...hi.slice().reverse().map(x => [x + g, cy + w(x)])]),
    lF: D([...lo.map(T), [xn + (brk ? 0 : 1.2), cy - wn], [xn + (brk ? 0 : 1.2), cy + wn], ...lo.slice().reverse().map(B)], true),
    rF: D([...hi.map(x => [x + g, cy - w(x)]), ...hi.slice().reverse().map(x => [x + g, cy + w(x)])], true),
    lX: D([[xn, cy - wn], [xn + 2.6, cy - wn * .4], [xn + 4, cy], [xn + 2.6, cy + wn * .4], [xn, cy + wn]]),
    rX: D([[xn + g, cy - wn], [xn + g + 2.6, cy - wn * .4], [xn + g + 4, cy], [xn + g + 2.6, cy + wn * .4], [xn + g, cy + wn]]),
    xn, wn, xe
  };
}
function neckingDraw(k) {
  const { INK, W } = k; const { x0, cy, hw } = NK; const g = nkGeom(0, 0, 0);
  return `
  <g class="nk-grip">${k.rect(52, cy - 58, 60, 116, k.hatch('steel'), 'class="nk-gh"')}${k.rect(52, cy - 58, 60, 116, 'none', `class="nk-go" ${k.stroke.thick}`)}
    <path class="nk-hid" d="M${x0} ${cy - hw}H64M${x0} ${cy + hw}H64" fill="none" ${k.stroke.hidden}/></g>
  <path class="nk-lF" d="${g.lF}" fill="${AMB}"/><path class="nk-rF" d="${g.rF}" fill="${AMB}"/>
  <path class="nk-lO" d="${g.lO}" fill="none" ${k.stroke.thick}/><path class="nk-rO" d="${g.rO}" fill="none" ${k.stroke.thick}/>
  <path class="nk-lX" d="${g.lX}" fill="none" ${k.stroke.thick} opacity="0"/><path class="nk-rX" d="${g.rX}" fill="none" ${k.stroke.thick} opacity="0"/>
  ${k.center(40, cy, 556, cy, 'class="nk-cl"')}
  <g class="nk-Fg">${force(k, NK.x1 + 8, cy, NK.x1 + 66, cy, { cls: 'nk-F', w: 7 })}${k.text(NK.x1 + 40, cy - 22, 'F', { size: 26, weight: 700, fill: INK.hot })}</g>
  <g class="nk-d" opacity="0">
    <line class="nk-dl" stroke="${INK.red}" stroke-width="${W.thin}" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
    <line class="nk-dk" stroke="${INK.red}" stroke-width="${W.hair}"/>
    ${k.text(0, 0, 'd', { size: 22, fill: INK.red, weight: 700, extra: 'class="nk-dt"' })}
  </g>
  <g class="nk-say" opacity="0"><polyline class="nk-sl" fill="none" stroke="${INK.red}" stroke-width="${W.thin}" marker-end="url(#arr-red)"/>${k.text(0, 0, 'necking', { size: 21, weight: 700, fill: INK.red, anchor: 'start', extra: 'class="nk-st"' })}</g>
  <g class="nk-frac" opacity="0">${k.text(0, 0, 'fracture', { size: 21, weight: 700, fill: INK.graphite, anchor: 'start', extra: 'class="nk-ft"' })}</g>`;
}
function neckingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { cy } = NK;
  const els = { lF: q('.nk-lF'), rF: q('.nk-rF'), lO: q('.nk-lO'), rO: q('.nk-rO'), lX: q('.nk-lX'), rX: q('.nk-rX') };
  const st = { e: 0, n: 0, brk: 0 };
  const render = () => {
    const g = nkGeom(st.e, st.n, st.brk);
    for (const n in els) set(els[n], { d: g[n] });
    op(els.lX, st.brk > 0 ? 1 : 0); op(els.rX, st.brk > 0 ? 1 : 0);
    set(q('.nk-Fg'), { transform: `translate(${f1(g.xe - NK.x1)} 0)` });
    set(q('.nk-dl'), { x1: g.xn, y1: cy - g.wn, x2: g.xn, y2: cy + g.wn });
    set(q('.nk-dk'), { x1: g.xn, y1: cy + g.wn + 6, x2: g.xn, y2: cy + 70 });
    set(q('.nk-dt'), { x: g.xn, y: cy + 92 });
    set(q('.nk-sl'), { points: `${f1(g.xn + 70)},${cy - 92} ${f1(g.xn + 2)},${f1(cy - g.wn - 6)}` }); set(q('.nk-st'), { x: g.xn + 76, y: cy - 86 });
    set(q('.nk-ft'), { x: g.xn + 76, y: cy - 86 });
    op(q('.nk-d'), cl(st.n * 4) * (1 - st.brk)); op(q('.nk-say'), cl(st.n * 4) * (1 - st.brk)); op(q('.nk-frac'), st.brk);
  };
  const t = k.tl();
  if (k.reduced()) { st.e = NK.ext; st.n = .72; st.brk = 1; }
  render();
  k.plot(t, [q('.nk-go'), els.lO, els.rO], { dur: .8, stagger: .12 });
  k.ink(t, [q('.nk-gh'), els.lF, els.rF], { at: .6 });
  t.from([q('.nk-cl'), q('.nk-hid')], { opacity: 0, duration: .4 }, .8);
  k.stamp(t, [q('.nk-Fg')], { at: 1 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.6 });
  L.to(st, { e: 26, duration: 1.4, ease: 'power1.inOut', onUpdate: render })
    .to(st, { e: NK.ext, n: .72, duration: 2.4, ease: 'power1.in', onUpdate: render })
    .to(st, { brk: 1, duration: .36, ease: 'power3.out', onUpdate: render })
    .to(q('.nk-Fg'), { opacity: 0, duration: .3 }, '<')
    .to({}, { duration: 1.8 })
    .to([els.lF, els.rF, els.lO, els.rO, els.lX, els.rX, q('.nk-frac')], { opacity: 0, duration: .5 })
    .add(() => { st.e = st.n = st.brk = 0; render(); })
    .to([els.lF, els.rF, els.lO, els.rO, q('.nk-Fg')], { opacity: 1, duration: .6 }, '+=.15')
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   elongation — two gauge marks L₀ apart on a flat bar, a steel rule underneath. Pulled, the marks move apart: the
   red ΔL is the increase; ε = ΔL / L₀.
   ====================================================================================================== */
const EG = { x0: 96, m0: 150, m1: 390, x1: 432, cy: 214, hw: 20, eps: .17 };
function egGeom(e) {
  const { m0, m1, x1, hw } = EG; return { m1: m0 + (m1 - m0) * (1 + e), xe: m0 + (x1 - m0) * (1 + e), w: hw / Math.sqrt(1 + e) };
}
function elongationDraw(k) {
  const { INK, W } = k; const { x0, m0, m1, x1, cy, hw } = EG;
  let ticks = ''; for (let i = 0; i <= 33; i++) { const x = m0 - 24 + i * 12, lg = (i - 2) % 5 === 0; ticks += `<line x1="${x}" y1="352" x2="${x}" y2="${lg ? 370 : 362}" stroke="${INK.graphite}" stroke-width="${lg ? W.thin : W.hair}"/>`; if (lg && i >= 2) ticks += k.text(x, 388, String((i - 2) * 2), { size: 12, fill: INK.graphite2 }); }
  const mark = (x, cls) => `<g class="${cls}"><line x1="${x}" y1="${cy - hw + 4}" x2="${x}" y2="${cy + hw - 4}" stroke="${INK.graphite}" stroke-width="${W.thin}"/><circle cx="${x}" cy="${cy}" r="4.5" fill="${INK.graphite}"/></g>`;
  return `
  <g class="eg-grip">${k.rect(44, cy - 50, 52, 100, k.hatch('steel'), 'class="eg-gh"')}${k.rect(44, cy - 50, 52, 100, 'none', `class="eg-go" ${k.stroke.thick}`)}
    <path d="M${x0} ${cy - hw}H56M${x0} ${cy + hw}H56" fill="none" ${k.stroke.hidden} class="eg-hid"/></g>
  <rect class="eg-fill" x="${x0}" y="${cy - hw}" width="${x1 - x0}" height="${hw * 2}" fill="${AMB}"/>
  <rect class="eg-ol" x="${x0 - 2}" y="${cy - hw}" width="${x1 - x0 + 2}" height="${hw * 2}" fill="none" ${k.stroke.thick}/>
  ${mark(m0, 'eg-m0')}${mark(m1, 'eg-m1')}
  <g class="eg-Fg">${force(k, x1 + 8, cy, x1 + 62, cy, { cls: 'eg-F', w: 7 })}${k.text(x1 + 36, cy - 22, 'F', { size: 26, weight: 700, fill: INK.hot })}</g>
  <g class="eg-L0">${hair(k, m0, cy - hw - 6, m0, cy - hw - 52, INK.blue)}${hair(k, m1, cy - hw - 6, m1, cy - hw - 52, INK.blue)}
    <line x1="${m0}" y1="${cy - hw - 42}" x2="${m1}" y2="${cy - hw - 42}" stroke="${INK.blue}" stroke-width="${W.thin}" marker-start="url(#arr-blue)" marker-end="url(#arr-blue)"/>
    ${k.text((m0 + m1) / 2, cy - hw - 50, 'L₀', { size: 22, fill: INK.blue, weight: 700 })}</g>
  <g class="eg-dl" opacity="0"><line class="eg-dlx" x1="${m1}" y1="${cy - hw - 6}" x2="${m1}" y2="${cy - hw - 52}" stroke="${INK.red}" stroke-width="${W.hair}"/>
    ${dline(k, 'eg-dld', INK.red, 'ΔL', { size: 22 })}</g>
  <g class="eg-L">${dline(k, 'eg-Ld', INK.graphite, 'L', { size: 20 })}<line class="eg-Lx0" x1="${m0}" y1="${cy + hw + 6}" x2="${m0}" y2="${cy + hw + 52}" stroke="${INK.graphite}" stroke-width="${W.hair}"/><line class="eg-Lx" x1="${m1}" y1="${cy + hw + 6}" x2="${m1}" y2="${cy + hw + 52}" stroke="${INK.graphite}" stroke-width="${W.hair}"/></g>
  <g class="eg-rule">${k.rect(m0 - 36, 340, 420, 56, '#fff', `class="eg-ro" stroke="${INK.graphite}" stroke-width="${W.med}"`)}${ticks}${k.text(m0 + 384 - 36 + 22, 392, 'mm', { size: 12, fill: INK.graphite2, anchor: 'end' })}</g>
  <g class="eg-proj">${hair(k, m0, cy + 14, m0, 352, INK.blue, 'stroke-dasharray="3 4" class="eg-p0"')}${hair(k, m1, cy + 14, m1, 352, INK.blue, 'stroke-dasharray="3 4" class="eg-p1"')}</g>
  <g class="eg-eq">${k.text(300, 470, `ε = <tspan fill="${INK.red}">ΔL</tspan> / <tspan fill="${INK.blue}">L₀</tspan>`, { size: 46, family: 'display', weight: 800 })}
    ${k.text(300, 508, `% elongation = ΔL / L₀ × 100`, { size: 18, fill: INK.graphite2 })}</g>`;
}
function elongationPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { m0, m1, x0, cy, hw } = EG;
  const st = { e: 0 };
  const render = () => {
    const g = egGeom(st.e);
    set(q('.eg-fill'), { y: cy - g.w, height: g.w * 2, width: g.xe - x0 }); set(q('.eg-ol'), { y: cy - g.w, height: g.w * 2, width: g.xe - x0 + 2 });
    set(q('.eg-m1'), { transform: `translate(${f1(g.m1 - m1)} 0)` }); set(q('.eg-Fg'), { transform: `translate(${f1(g.xe - EG.x1)} 0)` });
    set(q('.eg-dlx'), { x1: g.m1, x2: g.m1 }); dset(q('.eg-dld'), m1, cy - hw - 42, g.m1, cy - hw - 42, (m1 + g.m1) / 2, cy - hw - 50);
    op(q('.eg-dl'), cl(st.e * 30));
    set(q('.eg-Lx'), { x1: g.m1, x2: g.m1 }); dset(q('.eg-Ld'), m0, cy + hw + 42, g.m1, cy + hw + 42, (m0 + g.m1) / 2, cy + hw + 36);
    set(q('.eg-p1'), { x1: g.m1, x2: g.m1 });
  };
  const t = k.tl();
  if (k.reduced()) st.e = EG.eps;
  render();
  k.plot(t, [q('.eg-go'), q('.eg-ol')], { dur: .7, stagger: .12 });
  k.ink(t, [q('.eg-gh'), q('.eg-fill')], { at: .5 });
  t.from(q('.eg-hid'), { opacity: 0, duration: .4 }, .7);
  k.stamp(t, [q('.eg-m0'), q('.eg-m1')], { at: .8, stagger: .1 });
  plotM(k, t, [...qa('.eg-L0 line'), ...qa('.eg-L line')], { at: 1, stagger: .05, dur: .45 }); t.from([q('.eg-L0 text'), q('.eg-L text')], { opacity: 0, duration: .3 }, 1.3);
  k.plot(t, [q('.eg-ro'), ...qa('.eg-proj line')], { at: .9, stagger: .1, dur: .6 }); t.from(qa('.eg-rule > line, .eg-rule > text'), { opacity: 0, duration: .3, stagger: .01 }, 1.1);
  k.stamp(t, [q('.eg-Fg'), q('.eg-eq')], { at: 1.3, stagger: .15 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: .8 });
  L.to(st, { e: EG.eps, duration: 1.8, ease: 'power2.inOut', onUpdate: render })
    .to({}, { duration: 1.4 })
    .to(st, { e: 0, duration: 1.2, ease: 'power2.inOut', onUpdate: render });
  return t;
}

export default {
  stress: { draw: stressDraw, play: stressPlay },
  fourLoads: { draw: fourLoadsDraw, play: fourLoadsPlay },
  tension: { draw: tensionDraw, play: tensionPlay },
  compression: { draw: compressionDraw, play: compressionPlay },
  shearStress: { draw: shearStressDraw, play: shearStressPlay },
  torsion: { draw: torsionDraw, play: torsionPlay },
  elastic: { draw: elasticDraw, play: elasticPlay },
  plastic: { draw: plasticDraw, play: plasticPlay },
  curve: { draw: curveDraw, play: curvePlay },
  yield: { draw: yieldDraw, play: yieldPlay },
  necking: { draw: neckingDraw, play: neckingPlay },
  elongation: { draw: elongationDraw, play: elongationPlay }
};
