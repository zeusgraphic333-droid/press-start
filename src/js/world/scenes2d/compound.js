// Illustrated scenes — compound (L4 · compound bending): spinning ★ · spinParts · spunShapes · hydro · hydroTube ·
// hydroSheet · drawing · drawSteps. Contract and look: STYLE.md · names and captions: world/scenes/info.js · facts: docs/COURSE.md.
// The workpiece (blank, tube, cup) is always the zone colour (INK.tblue) with a graphite edge; tools are hatched sections.

/* ---------- shared bits ---------- */
const f1 = v => Math.round(v * 10) / 10;
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const RP = (x, y, w, h) => `M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
const D2R = Math.PI / 180;
/** a drawn part: white knock-out fill · optional section hatch · thick outline (play() plots `.o`, inks `.h`) */
function pt(k, d, { mat = '', cls = '', w = k.W.thick, fill = '#fff', stroke = k.INK.graphite, extra = '' } = {}) {
  return `<g class="${cls}" ${extra}>${fill ? `<path d="${d}" fill="${fill}"/>` : ''}${mat ? `<path class="h" d="${d}" fill="${k.hatch(mat)}"/>` : ''}<path class="o" d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
}
/** a sheet seen edge-on along any profile: a graphite edge stroke under a coloured core stroke on the same mid-line */
function sheet(k, d, T, cls, color = k.INK.tblue) {
  return `<path class="${cls} se" d="${d}" fill="none" stroke="${k.INK.graphite}" stroke-width="${T + 2.8}" stroke-linejoin="round"/><path class="${cls} sc" d="${d}" fill="none" stroke="${color}" stroke-width="${T}" stroke-linejoin="round"/>`;
}
/** surface marks on a shaft seen side-on: they ride round with the shaft (rotation you can see in an elevation) */
function shaftMarks(k, x1, x2, cy, r, n, cls) {
  return Array.from({ length: n }, (_, i) => `<line class="${cls}" data-i="${i}" x1="${f1(x1 + 3)}" y1="${cy}" x2="${f1(x2 - 3)}" y2="${cy}" stroke="${k.INK.graphite2}" stroke-width="${k.W.thin}" stroke-linecap="round"/>`).join('');
}
function spinMarks(k, marks, cy, r, { dur = 1.4 } = {}) {
  if (!marks.length) return;
  const st = { a: .5 }, n = marks.length;
  const put = () => marks.forEach((m, i) => {
    const a = st.a + i * 2 * Math.PI / n, y = f1(cy + r * .86 * Math.sin(a));
    m.setAttribute('y1', y); m.setAttribute('y2', y); m.setAttribute('opacity', Math.max(0, Math.cos(a)).toFixed(2));
  });
  put();
  if (!k.reduced()) k.gsap.to(st, { a: 2 * Math.PI + .5, duration: dur, ease: 'none', repeat: -1, onUpdate: put });
}
/** a break line (the zig-zag that says "this part goes on"), vertical at x from y0 to y1, as path commands */
function brk(x, y0, y1) {
  const m = (y0 + y1) / 2, s = Math.sign(y1 - y0);
  return `L${f1(x)} ${f1(m - s * 16)}L${f1(x - 9)} ${f1(m - s * 6)}L${f1(x + 9)} ${f1(m + s * 6)}L${f1(x)} ${f1(m + s * 16)}L${f1(x)} ${f1(y1)}`;
}

/* ======================================================================================================
   spinning ★ — the spinning lathe in elevation, the work in section: a flat disc (blank) clamped against the mandrel,
   the roller tool pushes it round the mandrel's corner and along its side until the disc is a cup. Then the tailstock
   backs off, the cup comes off, a new blank goes on.
   ====================================================================================================== */
const SPN = (() => {
  const A = 272, face = 318, Rm = 100, rc = 26, T = 9, h = T / 2;
  const a = Rm - rc, ro = rc + h, arc = ro * Math.PI / 2, wall = 72;
  return { A, face, Rm, rc, T, h, xf: face + h, a, ro, cx: face - rc, cy: a, arc, R0: a + arc + wall, RR: 24, rest: [428, 432] };
})();
/** a point on the blank's mid-surface s along it from the axis (lower half, y measured down from the axis), with its tangent angle */
function spAt(s) {
  const { xf, a, ro, cx, cy, arc } = SPN;
  if (s <= a) return { x: xf, y: s, ang: 90 };
  if (s <= a + arc) { const p = (s - a) / ro; return { x: cx + ro * Math.cos(p), y: cy + ro * Math.sin(p), ang: 90 + p / D2R }; }
  return { x: cx - (s - a - arc), y: cy + ro, ang: 180 };
}
const spContact = p => SPN.a + p * (SPN.R0 - SPN.a);
/** the free flange lags behind the tool: it leaves the contact point between the radial direction and the mandrel's surface */
const spFlangeAng = (c, p) => 90 + (c.ang - 90) * (.4 + .6 * p);
function spHalf(p, ext, sgn) {
  const { A, xf, a, ro, arc, R0 } = SPN; const Y = y => f1(A + sgn * y);
  const sc = spContact(p), c = spAt(sc);
  let d = `M${f1(xf)} ${f1(A)}L${f1(xf)} ${Y(Math.min(sc, a))}`;
  if (sc > a) { const e = spAt(Math.min(sc, a + arc)); d += `A${f1(ro)} ${f1(ro)} 0 0 ${sgn > 0 ? 1 : 0} ${f1(e.x)} ${Y(e.y)}`; if (sc > a + arc) d += `L${f1(c.x)} ${Y(c.y)}`; }
  const L = R0 - sc + ext, ang = spFlangeAng(c, p) * D2R;
  return d + `L${f1(c.x + L * Math.cos(ang))} ${Y(c.y + L * Math.sin(ang))}`;
}
const spBlank = (p, ext = 0) => spHalf(p, ext, 1) + spHalf(p, ext, -1);
/** where the roller sits: on the flange's tailstock side, just past the bend (w → 1 pulls it back to its rest point) */
function spRoller(p, w) {
  const { A, h, RR, rest } = SPN; const c = spAt(spContact(p)), f = spFlangeAng(c, p) * D2R, n = f - Math.PI / 2;
  const x = c.x + (h + RR) * Math.cos(n) + 5 * Math.cos(f), y = A + c.y + (h + RR) * Math.sin(n) + 5 * Math.sin(f);
  return [x + (rest[0] - x) * w, y + (rest[1] - y) * w];
}
function spinningDraw(k) {
  const { INK, W } = k; const { A, face, Rm, rc, T } = SPN;
  const mandrel = `M152 ${A - 40}H176V${A - Rm}H${face - rc}A${rc} ${rc} 0 0 1 ${face} ${A - Rm + rc}V${A + Rm - rc}A${rc} ${rc} 0 0 1 ${face - rc} ${A + Rm}H176V${A + 40}H152Z`;
  const cl = face + T, [rx, ry] = SPN.rest;
  const arm = `M-7 4L64 98L80 86L9 -8Z`;
  return `
  <g class="spn-axis">${k.center(36, A, 566, A)}</g>
  ${pt(k, `M58 ${A - 118}H104V${A + 132}H58${brk(58, A + 132, A - 118)}Z`, { cls: 'spn-p spn-head' })}
  <g class="spn-hid"><path d="M58 ${A - 22}H104M58 ${A + 22}H104" ${k.stroke.hidden}/></g>
  ${pt(k, RP(104, A - 22, 48, 44), { cls: 'spn-p spn-spindle' })}
  ${shaftMarks(k, 104, 152, A, 22, 3, 'spn-mk')}
  ${pt(k, mandrel, { cls: 'spn-p spn-mandrel', mat: 'iron' })}
  <g class="spn-pass" fill="none" ${k.stroke.construct} stroke-dasharray="7 5"><path d="${spBlank(0)}"/><path d="${spBlank(.42)}"/></g>
  <g class="spn-work">
    ${sheet(k, spBlank(0, 1.4), T, 'spn-bl spn-ble')}
  </g>
  <g class="spn-tail">
    ${pt(k, RP(cl, A - 46, 20, 92), { cls: 'spn-p spn-clamp', mat: 'steel' })}
    ${pt(k, RP(cl + 20, A - 18, 92, 36), { cls: 'spn-p spn-quill' })}
    ${shaftMarks(k, cl + 20, cl + 112, A, 18, 3, 'spn-mk2')}
    ${pt(k, `M${cl + 112} ${A - 74}H530${brk(530, A - 74, A + 74)}H${cl + 112}Z`, { cls: 'spn-p spn-tstock' })}
    <g class="spn-hid"><path d="M${cl + 112} ${A - 18}H${cl + 168}M${cl + 112} ${A + 18}H${cl + 168}" ${k.stroke.hidden}/></g>
  </g>
  <path class="spn-path" d="M${SPN.xf + 30} ${A + 40}V${A + SPN.a}A${SPN.ro + 30} ${SPN.ro + 30} 0 0 1 ${SPN.cx} ${A + SPN.cy + SPN.ro + 30}H${SPN.cx - SPN.R0 + SPN.a + SPN.arc - 6}" fill="none" ${k.stroke.construct} stroke-dasharray="6 6" marker-end="url(#arr-blue)"/>
  <g class="spn-roll" transform="translate(${rx} ${ry})">
    <path d="${arm}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <circle r="${SPN.RR}" fill="#fff" stroke="${INK.hot}" stroke-width="${W.thick + .6}"/>
    <circle r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <path d="M-12 0H12M0 -12V12" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>
    <g class="spn-lb2">${k.leader(36, 47, -14, 98, 'ROLLER TOOL', { size: 15 })}</g>
  </g>
  <g class="spn-rot"><path d="M137 ${A - 32}A11 36 0 1 1 119 ${A + 30}" fill="none" stroke="${INK.hot}" stroke-width="3" marker-end="url(#arr-hot)"/></g>
  <g class="spn-lb">
    ${k.leader(250, A - 60, 214, 104, 'MANDREL', { size: 15 })}
    ${k.leader(SPN.xf, A - 64, 392, 120, 'BLANK', { size: 15 })}
  </g>
  <g class="spn-tb">${k.titleBlock(44, 40, { title: 'METAL SPINNING', no: 'L4 · 03', scale: '1:2', w: 200 })}</g>`;
}
function spinningPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const edge = q('.spn-ble.se'), core = q('.spn-ble.sc'), roll = q('.spn-roll'), work = q('.spn-work');
  const st = { p: 0, w: 1 };
  const render = () => {
    edge.setAttribute('d', spBlank(st.p, 1.4)); core.setAttribute('d', spBlank(st.p, 0));
    const [x, y] = spRoller(st.p, st.w); roll.setAttribute('transform', `translate(${f1(x)} ${f1(y)})`);
  };
  render();
  const t = k.tl();
  k.plot(t, qa('.spn-p .o'), { at: 0, stagger: .07, dur: .6 });
  k.plot(t, qa('.spn-axis line'), { at: .1, dur: .9 });
  k.ink(t, qa('.spn-p .h'), { at: .55, stagger: .08 });
  k.plot(t, [edge, core], { at: .55, stagger: 0, dur: .8 });
  k.plot(t, qa('.spn-pass path'), { at: 1.2, stagger: .15, dur: .7 });
  t.from(qa('.spn-hid, .spn-mk, .spn-mk2'), { opacity: 0, duration: .4 }, .8);
  t.from(roll, { opacity: 0, duration: .5 }, 1);
  k.plot(t, q('.spn-path'), { at: 1.1, dur: .8 });
  k.plot(t, qa('.spn-rot path'), { at: 1, dur: .6 });
  k.stamp(t, qa('.spn-lb .k-leader, .spn-lb2'), { at: 1.3, stagger: .1 });
  t.from(q('.spn-tb'), { opacity: 0, y: 8, duration: .5 }, 1.4);
  spinMarks(k, qa('.spn-mk'), SPN.A, 22, { dur: 1.3 });
  spinMarks(k, qa('.spn-mk2'), SPN.A, 18, { dur: 1.3 });
  if (k.reduced()) { st.p = 1; st.w = 0; render(); return t; }
  const tail = q('.spn-tail');
  const c = gsap.timeline({ repeat: -1, delay: 2, onUpdate: render });
  c.to(st, { w: 0, duration: .7, ease: 'power2.inOut' })                       // the roller comes in to the blank
    .to(st, { p: 1, duration: 3.2, ease: 'sine.inOut' })                       // …and lays it round the mandrel
    .to(st, { w: 1, duration: .7, ease: 'power2.inOut' }, '+=.2')             // backs off
    .to(tail, { x: 44, duration: .6, ease: 'power2.inOut' }, '-=.2')           // the tailstock releases the cup
    .to(work, { x: 86, opacity: 0, duration: .7, ease: 'power2.in' }, '-=.15') // the cup comes off
    .set(st, { p: 0 }).set(work, { x: 0 })
    .to(work, { opacity: 1, duration: .5 })                                   // a new blank…
    .to(tail, { x: 0, duration: .6, ease: 'power2.inOut' }, '-=.2')            // …is clamped
    .to({}, { duration: .7 });
  return t;
}

/* ======================================================================================================
   spinParts — the spinning lathe of slide L4·S4 in elevation, its seven parts ballooned with a parts list. The spindle
   turns; one item at a time lights up in the drawing, on its balloon and in the list.
   ====================================================================================================== */
const SPP_NAMES = ['HEAD STOCK', 'SPINDLE', 'MANDREL', 'SHEET METAL', 'CLAMP', 'TAIL STOCK', 'ROLLER TOOL'];
function spinPartsDraw(k) {
  const { INK, W } = k; const A = 190;
  const it = (n, d, o = {}) => pt(k, d, { ...o, cls: `spp-p spp-i${n}` });
  const half = s => `M290 ${A}V${A + s * 46}Q290 ${A + s * 58} 280 ${A + s * 60}L232 ${A + s * 73}L205 ${A + s * 126}`;
  const balloons = [[1, 88, 132, 72, 46], [2, 143, A - 10, 134, 46], [3, 169, A - 82, 190, 46], [4, 216, A - 100, 252, 46], [5, 301, A - 18, 308, 46], [6, 470, A - 30, 470, 46], [7, 253, 278, 362, 278]];
  let table = `<g class="spp-tab">`;
  const tx = [70, 110, 300, 340, 530], ty = [404, 426, 456, 486, 516, 546];
  for (let n = 1; n <= 7; n++) { const c = n <= 4 ? 0 : 2, r = (n - 1) % 4; table += `<rect class="spp-row spp-r${n}" x="${tx[c]}" y="${ty[r + 1]}" width="${tx[c + 2] - tx[c]}" height="${ty[r + 2] - ty[r + 1]}" fill="${INK.tblue}" opacity="0"/>`; }
  table += `<path class="spp-tl" d="M70 404H530V546H70ZM70 426H530M70 456H530M70 486H530M70 516H530M110 404V546M300 404V546M340 404V546" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`;
  table += [0, 2].map(c => k.text(tx[c] + 20, 420, 'ITEM', { size: 11, weight: 700, fill: INK.graphite2 }) + k.text(tx[c + 1] + 12, 420, 'DESCRIPTION', { size: 11, weight: 700, fill: INK.graphite2, anchor: 'start' })).join('');
  SPP_NAMES.forEach((nm, i) => { const c = i < 4 ? 0 : 2, r = i % 4, y = ty[r + 1] + 21; table += k.text(tx[c] + 20, y, i + 1, { size: 15, weight: 700 }) + k.text(tx[c + 1] + 12, y, nm, { size: 15, anchor: 'start' }); });
  table += k.text(70, 396, 'PARTS LIST', { size: 12, weight: 700, anchor: 'start', fill: INK.graphite2, spacing: 1 }) + `</g>`;
  return `
  <g class="spp-axis">${k.center(40, A, 560, A)}</g>
  ${pt(k, RP(40, 336, 520, 22), { cls: 'spp-p spp-bed' })}
  ${it(1, `M50 ${A - 98}H124V336H50Z`)}
  ${it(2, RP(124, A - 18, 38, 36))}${shaftMarks(k, 124, 162, A, 18, 3, 'spp-mk')}
  ${it(3, `M162 ${A - 96}H176V${A - 84}L278 ${A - 56}Q286 ${A - 54} 286 ${A - 46}V${A + 46}Q286 ${A + 54} 278 ${A + 56}L176 ${A + 84}V${A + 96}H162Z`)}
  <g class="spp-i4">${sheet(k, half(-1) + half(1), 8, 'spp-sh')}</g>
  ${it(5, RP(294, A - 24, 14, 48))}
  ${pt(k, `M404 ${A + 48}H520V336H404Z`, { cls: 'spp-p spp-i6' })}
  ${it(6, RP(308, A - 12, 108, 24))}${shaftMarks(k, 308, 416, A, 12, 3, 'spp-mk2')}
  ${it(6, `M416 ${A - 52}H490A18 18 0 0 1 508 ${A - 34}V${A + 34}A18 18 0 0 1 490 ${A + 52}H416Z`)}
  ${pt(k, RP(282, 312, 44, 24), { cls: 'spp-p' })}
  <g class="spp-p spp-i7"><path class="o" d="M233 287L291 325L298 314L241 276Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><circle class="o" cx="237" cy="282" r="16" fill="#fff" stroke="${INK.hot}" stroke-width="${W.thick}"/><circle cx="237" cy="282" r="4" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>
  <g class="spp-bl">${balloons.map(([n, x, y, bx, by]) => `<g class="spp-b" data-n="${n}"><line x1="${x}" y1="${y}" x2="${bx}" y2="${by}" stroke="${INK.graphite}" stroke-width="${W.thin}"/><circle cx="${x}" cy="${y}" r="2.6" fill="${INK.graphite}"/><circle class="spp-bc" cx="${bx}" cy="${by}" r="14" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>${k.text(bx, by + 5.5, n, { size: 15, weight: 700, extra: 'class="spp-bn"' })}</g>`).join('')}</g>
  ${table}`;
}
function spinPartsPlay(svg, k) {
  const { gsap, INK } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.spp-p .o'), { at: 0, stagger: .06, dur: .6 });
  k.plot(t, qa('.spp-sh'), { at: .5, stagger: 0, dur: .7 });
  k.plot(t, qa('.spp-axis line'), { at: .2, dur: .8 });
  k.stamp(t, qa('.spp-b'), { at: 1, stagger: .08 });
  k.plot(t, qa('.spp-tl'), { at: 1.1, dur: 1 });
  t.from(qa('.spp-tab text'), { opacity: 0, duration: .3, stagger: .02 }, 1.4);
  spinMarks(k, qa('.spp-mk'), 190, 18, { dur: 1.2 });
  spinMarks(k, qa('.spp-mk2'), 190, 12, { dur: 1.2 });
  if (k.reduced()) return t;
  // one part at a time: drawing, balloon and list light up together
  const c = gsap.timeline({ repeat: -1, delay: 2.4 });
  for (let n = 1; n <= 7; n++) {
    const outl = qa(`.spp-i${n} .o, .spp-i${n} .se`), b = q(`.spp-b[data-n="${n}"]`), at = (n - 1) * 1.5;
    c.to(outl, { stroke: INK.tblue, duration: .3 }, at).to(b.querySelector('.spp-bc'), { attr: { fill: INK.tblue, stroke: INK.tblue }, duration: .3 }, at)
      .to(b.querySelector('.spp-bn'), { attr: { fill: '#fff' }, duration: .3 }, at).to(q(`.spp-r${n}`), { opacity: .16, duration: .3 }, at)
      .to(outl, { stroke: (i, el) => el.classList.contains('se') ? INK.graphite : (n === 7 && el.tagName === 'circle' ? INK.hot : INK.graphite), duration: .4 }, at + 1.15)
      .to(b.querySelector('.spp-bc'), { attr: { fill: '#fff', stroke: INK.graphite }, duration: .4 }, at + 1.15)
      .to(b.querySelector('.spp-bn'), { attr: { fill: INK.graphite }, duration: .4 }, at + 1.15).to(q(`.spp-r${n}`), { opacity: 0, duration: .4 }, at + 1.15);
  }
  c.to({}, { duration: 1.2 });
  return t;
}

/* ======================================================================================================
   spunShapes — the three basic spun shapes, hemisphere · cone · cylindrical shell, each in elevation with its inside as
   a hidden line, turning slowly on its axis (the meridians ride round).
   ====================================================================================================== */
const SB = 400; // the base line the three shells stand on
const SSH = [
  { cx: 126, R: 80, out: (c, R) => `M${c - R} ${SB}A${R} ${R} 0 0 1 ${c + R} ${SB}Z`, hid: (c, R) => `M${c - R + 9} ${SB}A${R - 9} ${R - 9} 0 0 1 ${c + R - 9} ${SB}`, mer: (c, R) => `M${c} ${SB - R}A${R} ${R} 0 0 1 ${c + R} ${SB}`, top: SB - 80, name: 'HEMISPHERE' },
  { cx: 302, R: 74, out: (c, R) => `M${c - R} ${SB}L${c - 13} 200H${c + 13}L${c + R} ${SB}Z`, hid: (c, R) => `M${c - R + 11} ${SB}L${c - 9} 211H${c + 9}L${c + R - 11} ${SB}`, mer: (c, R) => `M${c + 13} 200L${c + R} ${SB}`, top: 200, name: 'CONE' },
  { cx: 478, R: 64, out: (c, R) => `M${c - R} ${SB}V238Q${c - R} 224 ${c - R + 14} 224H${c + R - 14}Q${c + R} 224 ${c + R} 238V${SB}Z`, hid: (c, R) => `M${c - R + 9} ${SB}V233H${c + R - 9}V${SB}`, mer: (c, R) => `M${c + R} 240V${SB}`, top: 224, name: 'CYLINDRICAL SHELL' }
];
function spunShapesDraw(k) {
  const { INK, W } = k;
  return SSH.map((S, i) => `
  <g class="ssh-s" data-i="${i}">
    ${k.center(S.cx, S.top - 40, S.cx, SB + 22, 'class="ssh-ax"')}
    <path class="ssh-o" d="${S.out(S.cx, S.R)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="ssh-h" d="${S.hid(S.cx, S.R)}" fill="none" ${k.stroke.hidden}/>
    <g class="ssh-m">${[0, 1, 2, 3].map(() => `<path d="${S.mer(S.cx, S.R)}" fill="none" stroke="${INK.tblue}" stroke-width="${W.med}" stroke-linecap="round"/>`).join('')}</g>
    <path class="ssh-o" d="${S.out(S.cx, S.R)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="ssh-r" d="M${S.cx - 16} ${S.top - 24}A16 5.5 0 1 0 ${S.cx + 14} ${S.top - 26}" fill="none" stroke="${INK.graphite2}" stroke-width="${W.thin}" marker-end="url(#arr)"/>
    <g class="ssh-d">${k.dim(S.cx - S.R, SB, S.cx + S.R, SB, 'Ø D', { off: 26, size: 14 })}</g>
    ${k.text(S.cx, SB + 70, S.name, { size: 17, weight: 700, spacing: .5, extra: 'class="ssh-n"' })}
  </g>`).join('') + `<path class="ssh-g" d="M40 ${SB}H560" stroke="${INK.graphite3}" stroke-width="${W.thin}" opacity=".7"/>`;
}
function spunShapesPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const groups = qa('.ssh-s'), mer = groups.map(g => [...g.querySelectorAll('.ssh-m path')]);
  const st = { a: 0 };
  const put = () => groups.forEach((g, i) => {
    const cx = SSH[i].cx;
    mer[i].forEach((m, j) => {
      const ph = ((st.a + j * 45 + i * 15) % 180 - 90) * D2R, s = Math.sin(ph);
      m.setAttribute('transform', `matrix(${s.toFixed(3)} 0 0 1 ${f1(cx - s * cx)} 0)`); m.setAttribute('opacity', Math.min(1, Math.cos(ph) * 1.6).toFixed(2));
    });
  });
  put();
  const t = k.tl();
  k.plot(t, qa('.ssh-o'), { at: 0, stagger: .12, dur: .8 });
  k.plot(t, qa('.ssh-ax'), { at: .2, stagger: .1, dur: .6 });
  k.plot(t, q('.ssh-g'), { at: 0, dur: 1 });
  t.from(qa('.ssh-h'), { opacity: 0, duration: .5, stagger: .1 }, .7);
  t.from(qa('.ssh-m'), { opacity: 0, duration: .6, stagger: .1 }, .9);
  k.stamp(t, qa('.ssh-d, .ssh-r'), { at: 1.1, stagger: .06 });
  t.from(qa('.ssh-n'), { opacity: 0, y: 6, duration: .5, stagger: .1 }, 1.2);
  if (k.reduced()) return t;
  gsap.to(st, { a: 45, duration: 2.6, ease: 'none', repeat: -1, onUpdate: put });
  return t;
}

/* ======================================================================================================
   hydro — water pressure does the work, in its two kinds: a tube blown out into the die (tube hydroforming) and a sheet
   pushed down into a female cavity with concavities (sheet hydroforming). P rises, both take the die's shape.
   ====================================================================================================== */
const HY = { tc: 160, ty: 300, sc: 440 };
const hyBulge = x => Math.abs(x - HY.tc) < 46 ? 26 * Math.cos(Math.PI * (x - HY.tc) / 92) ** 2 : 0;
const hyCav = x => x <= 362 || x >= 518 ? 306 : 306 + 54 * Math.sin(Math.PI * (x - 362) / 156) ** .45 - 26 * Math.exp(-(((x - HY.sc) / 20) ** 2));
const hySheetY = (x, p) => (x <= 362 || x >= 518) ? 303 : 303 + Math.min(hyCav(x) - 3 - 303, p * 78 * Math.sin(Math.PI * (x - 362) / 156) ** .7);
const hyXs = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
function hyTubeWall(p, sgn, push) { const xs = hyXs(76 + push, 244 - push, 34); return 'M' + xs.map(x => `${f1(x)} ${f1(HY.ty + sgn * (25 + p * hyBulge(x)))}`).join('L'); }
function hyTubeWater(p, push) {
  const xs = hyXs(76 + push, 244 - push, 34);
  return 'M' + xs.map(x => `${f1(x)} ${f1(HY.ty - 22 - p * hyBulge(x))}`).join('L') + 'L' + xs.reverse().map(x => `${f1(x)} ${f1(HY.ty + 22 + p * hyBulge(x))}`).join('L') + 'Z';
}
function hySheet(p, ext = 0) { const xs = hyXs(336 - ext, 544 + ext, 52); return 'M' + xs.map(x => `${f1(x)} ${f1(hySheetY(x, p))}`).join('L'); }
function hySheetWater(p) { const xs = hyXs(354, 526, 43); return `M354 218H526` + xs.reverse().map(x => `L${f1(x)} ${f1(hySheetY(x, p) - 3)}`).join('') + 'Z'; }
function hydroDraw(k) {
  const { INK, W } = k; const { tc, ty } = HY;
  const prof = (sgn) => hyXs(266, 54, 42).map(x => `L${f1(x)} ${f1(ty + sgn * (28 + hyBulge(x)))}`).join('');
  const upper = `M54 206H266V${ty - 28}${prof(-1)}Z`, lower = `M54 394H266V${ty + 28}${prof(1)}Z`;
  const cav = `M334 306H362` + hyXs(362, 518, 52).map(x => `L${f1(x)} ${f1(hyCav(x))}`).join('') + `H546V400H334Z`;
  const punch = sx => { const x0 = sx < 0 ? 26 : 244, x1 = sx < 0 ? 76 : 294; return `<g class="hy-pn" data-s="${sx}">${pt(k, RP(x0, ty - 26, x1 - x0, 52), { cls: 'hy-p', mat: 'steel' })}<rect x="${x0}" y="${ty - 4}" width="${x1 - x0}" height="8" fill="${INK.water}" opacity=".55"/></g>`; };
  const parrows = [380, 410, 440, 470, 500].map(x => `<line class="hy-pa" data-x="${x}" x1="${x}" y1="270" x2="${x}" y2="292" stroke="${INK.blue}" stroke-width="2.2" marker-end="url(#arr-blue)"/>`).join('');
  return `
  <g class="hy-tt">${k.text(tc, 132, '1', { size: 46, family: 'display', weight: 800 })}${k.text(tc, 160, 'TUBE HYDROFORMING', { size: 15, weight: 700, spacing: 1 })}</g>
  <g class="hy-tt">${k.text(440, 132, '2', { size: 46, family: 'display', weight: 800 })}${k.text(440, 160, 'SHEET HYDROFORMING', { size: 15, weight: 700, spacing: 1 })}</g>
  <g class="hy-cl">${k.center(36, ty, 284, ty)}</g>
  ${pt(k, upper, { cls: 'hy-p', mat: 'iron' })}${pt(k, lower, { cls: 'hy-p', mat: 'iron' })}
  <g class="hy-tw">
    <path class="hy-twat" d="${hyTubeWater(0, 0)}" fill="${INK.water}" fill-opacity=".28"/>
    ${sheet(k, hyTubeWall(0, -1, 0), 6, 'hy-tu hy-tu1')}${sheet(k, hyTubeWall(0, 1, 0), 6, 'hy-tu hy-tu2')}
  </g>
  ${punch(-1)}${punch(1)}
  <g class="hy-F">${k.arrow(30, 252, 68, 252, { w: 5 })}${k.arrow(290, 252, 252, 252, { w: 5 })}${k.text(30, 240, 'F', { size: 15, fill: INK.hot, weight: 700, anchor: 'start' })}${k.text(290, 240, 'F', { size: 15, fill: INK.hot, weight: 700, anchor: 'end' })}</g>
  <g class="hy-P">${k.text(tc, ty + 7, 'P', { size: 22, weight: 800, fill: INK.blue })}<path d="M${tc} ${ty - 12}V${ty - 20}M${tc} ${ty + 12}V${ty + 20}" stroke="${INK.blue}" stroke-width="2" marker-end="url(#arr-blue)"/></g>
  ${pt(k, `M334 200H546V300H526V218H354V300H334Z`, { cls: 'hy-p', mat: 'steel' })}
  ${pt(k, cav, { cls: 'hy-p', mat: 'iron' })}
  <g class="hy-sw">
    <path class="hy-swat" d="${hySheetWater(0)}" fill="${INK.water}" fill-opacity=".28"/>
    <path class="hy-swat2" d="${hySheetWater(0)}" fill="${k.hatch('water')}"/>
    ${sheet(k, hySheet(0, 1.4), 6, 'hy-sh')}
  </g>
  <g class="hy-pas">${parrows}</g>
  <g class="hy-in"><path d="M508 172V198" stroke="${INK.water}" stroke-width="${W.thick}"/><path d="M508 168V194" stroke="${INK.blue}" stroke-width="${W.thin}" marker-end="url(#arr-blue)"/>${k.text(520, 188, 'P', { size: 18, weight: 800, fill: INK.blue, anchor: 'start' })}</g>`;
}
function hydroPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const tw1 = qa('.hy-tu1'), tw2 = qa('.hy-tu2'), twat = q('.hy-twat'), sh = qa('.hy-sh'), sw = qa('.hy-swat, .hy-swat2'), pas = qa('.hy-pa'), pn = qa('.hy-pn');
  const st = { p: 0 };
  const render = () => {
    const p = st.p, push = 7 * p;
    tw1.forEach((e, i) => e.setAttribute('d', hyTubeWall(p, -1, push - (i ? 0 : 1.4))));
    tw2.forEach((e, i) => e.setAttribute('d', hyTubeWall(p, 1, push - (i ? 0 : 1.4))));
    twat.setAttribute('d', hyTubeWater(p, push));
    pn.forEach(e => e.setAttribute('transform', `translate(${f1(-e.dataset.s * push)} 0)`));
    const ps = Math.min(1.3, p * 1.3);
    sh.forEach((e, i) => e.setAttribute('d', hySheet(ps, i ? 0 : 1.4)));
    sw.forEach(e => e.setAttribute('d', hySheetWater(ps)));
    pas.forEach(a => { const y = hySheetY(+a.dataset.x, ps) - 3; a.setAttribute('y1', f1(y - 30)); a.setAttribute('y2', f1(y - 8)); });
  };
  render();
  const t = k.tl();
  t.from(qa('.hy-tt'), { opacity: 0, y: -8, duration: .5, stagger: .1 }, 0);
  k.plot(t, qa('.hy-p .o'), { at: .05, stagger: .08, dur: .6 });
  k.plot(t, qa('.hy-cl line'), { at: .1, dur: .7 });
  k.ink(t, qa('.hy-p .h'), { at: .6, stagger: .06 });
  k.plot(t, qa('.hy-tu, .hy-sh'), { at: .7, stagger: 0, dur: .7 });
  t.from(qa('.hy-twat, .hy-swat, .hy-swat2, .hy-pn rect'), { opacity: 0, duration: .6 }, 1.1);
  t.from(qa('.hy-in, .hy-P, .hy-pas'), { opacity: 0, duration: .5 }, 1.3);
  t.set(q('.hy-F'), { opacity: 0 }, 0);
  if (k.reduced()) { st.p = 1; render(); t.set(q('.hy-F'), { opacity: 1 }, 1.4); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 2.2, onUpdate: render });
  c.to(q('.hy-F'), { opacity: 1, duration: .3 })
    .to(st, { p: 1, duration: 2.6, ease: 'sine.inOut' }, '<')                                  // pressure on: both take the die's shape
    .to(q('.hy-P'), { scale: 1.25, transformOrigin: '50% 50%', duration: 1.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
    .to(q('.hy-F'), { opacity: 0, duration: .4 }, '+=.9')
    .to(qa('.hy-tw, .hy-sw, .hy-pas'), { opacity: 0, duration: .5 }, '+=.2')                   // parts out
    .set(st, { p: 0 })
    .to(qa('.hy-tw, .hy-sw, .hy-pas'), { opacity: 1, duration: .6 })                           // new tube, new sheet
    .to({}, { duration: .6 });
  return t;
}

/* ======================================================================================================
   hydroTube — the six steps of slide L4·S9 as one die that works through them: (a) tube in the open die, (b) the die closes
   and the punches seal the ends, (c) fluid fills it, (d) pressure builds, (e) P inside + F axial on the ends: it bulges into
   the cavity, (f) the die opens and the part comes out. The step strip below keeps the count.
   ====================================================================================================== */
const HT = { ax: 300, ay: 288, rc: 32, b0: 34, half: 84, x0: 160, x1: 440 };
const htBulge = x => Math.abs(x - HT.ax) < HT.half ? HT.b0 * Math.cos(Math.PI * (x - HT.ax) / (2 * HT.half)) ** 2 : 0;
function htWall(p, sgn, te, ext = 0) { const xs = hyXs(HT.x0 + te - ext, HT.x1 - te + ext, 40); return 'M' + xs.map(x => `${f1(x)} ${f1(HT.ay + sgn * (28 + p * htBulge(x)))}`).join('L'); }
function htWater(p, te, f) {
  const a = HT.x0 + te, b = a + (HT.x1 - te - a) * f; if (f <= 0) return 'M0 0Z';
  const xs = hyXs(a, b, 40);
  return 'M' + xs.map(x => `${f1(x)} ${f1(HT.ay - 24 - p * htBulge(x))}`).join('L') + 'L' + xs.reverse().map(x => `${f1(x)} ${f1(HT.ay + 24 + p * htBulge(x))}`).join('L') + 'Z';
}
const HT_STEPS = ['TUBE IN THE OPEN DIE', 'DIE CLOSES · ENDS SEALED', 'FLUID FILLS THE TUBE', 'PRESSURE BUILDS', 'P INSIDE + F AXIAL: IT BULGES', 'DIE OPENS · PART OUT'];
function hydroTubeDraw(k) {
  const { INK, W } = k; const { ax, ay, rc } = HT;
  const prof = sgn => hyXs(470, 130, 68).map(x => `L${f1(x)} ${f1(ay + sgn * (rc + htBulge(x)))}`).join('');
  const upper = `M130 160H470V${ay - rc}${prof(-1)}Z`, lower = `M130 420H470V${ay + rc}${prof(1)}Z`;
  const punch = sx => {
    const m = x => sx < 0 ? x : 600 - x; const xa = Math.min(m(70), m(160)), xb = Math.max(m(70), m(160));
    const d = sx < 0 ? `M70 ${ay - 48}H96V${ay - 30}H160V${ay + 30}H96V${ay + 48}H70Z` : `M530 ${ay - 48}H504V${ay - 30}H440V${ay + 30}H504V${ay + 48}H530Z`;
    return `<g class="ht-pn" data-s="${sx}">${pt(k, d, { cls: 'ht-p', mat: 'steel' })}<rect x="${xa}" y="${ay - 4}" width="${xb - xa}" height="8" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.hair}"/><rect class="ht-bore" x="${xa}" y="${ay - 3}" width="${xb - xa}" height="6" fill="${INK.water}" opacity="0"/></g>`;
  };
  const steps = 'abcdef'.split('').map((l, i) => { const x = 120 + i * 72; return `<g class="ht-st" data-i="${i}"><circle cx="${x}" cy="528" r="15" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>${k.text(x, 534, l, { size: 17, weight: 700, family: 'text' })}</g>`; }).join('');
  const names = HT_STEPS.map((s, i) => k.text(300, 492, s, { size: 16, weight: 700, spacing: .6, extra: `class="ht-nm" opacity="${i ? 0 : 1}"` })).join('');
  const parr = [[-1, 0], [1, 0], [-1, -50], [1, -50], [-1, 50], [1, 50]].map(([s, dx]) => `<path d="M${ax + dx} ${ay + s * 9}V${ay + s * 20}" stroke="${INK.blue}" stroke-width="2.2" marker-end="url(#arr-blue)"/>`).join('');
  return `
  <g class="ht-cl">${k.center(36, ay, 564, ay)}</g>
  <g class="ht-up">${pt(k, upper, { cls: 'ht-p', mat: 'iron' })}</g>
  ${pt(k, lower, { cls: 'ht-p', mat: 'iron' })}
  <g class="ht-part">
    <path class="ht-wat" d="${htWater(0, 0, 0)}" fill="${INK.water}" fill-opacity=".32"/>
    ${sheet(k, htWall(0, -1, 0, 1.4), 8, 'ht-w ht-w1')}${sheet(k, htWall(0, 1, 0, 1.4), 8, 'ht-w ht-w2')}
  </g>
  ${punch(-1)}${punch(1)}
  <g class="ht-P" opacity="0">${parr}${k.text(ax, ay + 8, 'P', { size: 24, weight: 800, fill: INK.blue })}</g>
  <g class="ht-F" opacity="0">${k.arrow(56, 214, 112, 214, { w: 6 })}${k.arrow(544, 214, 488, 214, { w: 6 })}${k.text(56, 200, 'F axial', { size: 15, fill: INK.hot, weight: 700, anchor: 'start' })}${k.text(544, 200, 'F axial', { size: 15, fill: INK.hot, weight: 700, anchor: 'end' })}</g>
  <path class="ht-sl" d="M120 528H480" stroke="${INK.graphite3}" stroke-width="${W.thin}"/>
  ${steps}${names}`;
}
function hydroTubePlay(svg, k) {
  const { gsap, INK } = k; const [q, qa] = sel(svg);
  const w1 = qa('.ht-w1'), w2 = qa('.ht-w2'), wat = q('.ht-wat'), up = q('.ht-up'), pns = qa('.ht-pn'), bores = qa('.ht-bore'), part = q('.ht-part');
  const st = { up: -120, pp: -30, te: 0, f: 0, p: 0 };
  const render = () => {
    w1.forEach((e, i) => e.setAttribute('d', htWall(st.p, -1, st.te, i ? 0 : 1.4)));
    w2.forEach((e, i) => e.setAttribute('d', htWall(st.p, 1, st.te, i ? 0 : 1.4)));
    wat.setAttribute('d', htWater(st.p, st.te, st.f));
    up.setAttribute('transform', `translate(0 ${f1(st.up)})`);
    pns.forEach(e => e.setAttribute('transform', `translate(${f1(-e.dataset.s * st.pp)} 0)`));
    bores.forEach(b => b.setAttribute('opacity', st.f > 0 ? .7 : 0));
  };
  const step = (c, i, at) => {
    const sts = qa('.ht-st'), nm = qa('.ht-nm');
    c.to(sts.map(s => s.querySelector('circle')), { attr: { fill: (j) => j === i ? INK.tblue : '#fff', stroke: (j) => j === i ? INK.tblue : INK.graphite }, duration: .3 }, at)
      .to(sts.map(s => s.querySelector('text')), { attr: { fill: (j) => j === i ? '#fff' : INK.graphite }, duration: .3 }, at)
      .to(nm, { opacity: (j) => j === i ? 1 : 0, duration: .35 }, at);
  };
  render();
  const t = k.tl();
  k.plot(t, qa('.ht-p .o'), { at: 0, stagger: .08, dur: .6 });
  k.plot(t, qa('.ht-cl line, .ht-sl'), { at: .1, stagger: .1, dur: .8 });
  k.ink(t, qa('.ht-p .h'), { at: .6, stagger: .06 });
  k.plot(t, qa('.ht-w'), { at: .7, stagger: 0, dur: .7 });
  k.stamp(t, qa('.ht-st'), { at: 1, stagger: .06 });
  t.from(q('.ht-nm'), { opacity: 0, duration: .4 }, 1.3);
  if (k.reduced()) {
    Object.assign(st, { up: 0, pp: 16, te: 16, f: 1, p: 1 }); render();
    step(t, 4, 1.5); t.set([q('.ht-P'), q('.ht-F')], { opacity: 1 }, 1.5);
    return t;
  }
  const c = gsap.timeline({ repeat: -1, delay: 2, onUpdate: render });
  step(c, 0, 0);
  c.to(part, { opacity: 1, y: 0, duration: .5 }, 0);
  step(c, 1, 1.5);
  c.to(st, { up: 0, duration: .8, ease: 'power2.in' }, 1.6).to(st, { pp: 0, duration: .6, ease: 'power2.inOut' }, 2.3);
  step(c, 2, 3.1);
  c.to(st, { f: 1, duration: 1.1, ease: 'power1.inOut' }, 3.2);
  step(c, 3, 4.5);
  c.to(q('.ht-P'), { opacity: 1, duration: .5 }, 4.6).fromTo(q('.ht-P'), { scale: .8, transformOrigin: '50% 50%' }, { scale: 1, duration: .6, ease: 'back.out(2)', immediateRender: false }, 4.6);
  step(c, 4, 5.7);
  c.to(q('.ht-F'), { opacity: 1, duration: .4 }, 5.8).to(st, { p: 1, pp: 16, te: 16, duration: 1.6, ease: 'sine.inOut' }, 5.9);
  step(c, 5, 8);
  c.to([q('.ht-P'), q('.ht-F')], { opacity: 0, duration: .4 }, 8.1).to(st, { f: 0, duration: .4 }, 8.1)
    .to(st, { up: -120, duration: .8, ease: 'power2.inOut' }, 8.4).to(st, { pp: -30, duration: .6, ease: 'power2.inOut' }, 8.5)
    .to(part, { y: -150, opacity: 0, duration: .8, ease: 'power2.in' }, 9.1)
    .set(st, { p: 0, te: 0 }, 9.95).set(part, { y: 0 }, 9.95).to({}, { duration: .3 }, 9.95);
  c.set(part, { opacity: 0 }, 0);
  return t;
}

/* ======================================================================================================
   hydroSheet — sheet steel forced into a female cavity by water under pressure from a pump: a little fluid-power
   schematic (motor, pump, tank, gauge) feeds a chamber clamped on the sheet; the gauge climbs, the sheet bulges and
   settles into every pocket of the cavity.
   ====================================================================================================== */
const HS = { y0: 337 };
const hsCav = x => x <= 150 || x >= 450 ? 340 : 340 + 64 * Math.sin(Math.PI * (x - 150) / 300) ** .35 - 24 * Math.exp(-(((x - 300) / 24) ** 2));
const hsY = (x, p) => (x <= 150 || x >= 450) ? HS.y0 : HS.y0 + Math.min(hsCav(x) - 3 - HS.y0, p * 92 * Math.sin(Math.PI * (x - 150) / 300) ** .6);
function hsSheet(p, ext = 0) { const xs = hyXs(74 - ext, 526 + ext, 75); return 'M' + xs.map(x => `${f1(x)} ${f1(hsY(x, p))}`).join('L'); }
function hsWater(p) { const xs = hyXs(118, 482, 60); return 'M118 194H482' + xs.reverse().map(x => `L${f1(x)} ${f1(hsY(x, p) - 3)}`).join('') + 'Z'; }
function hydroSheetDraw(k) {
  const { INK, W } = k;
  const cav = `M90 340H150` + hyXs(150, 450, 60).map(x => `L${f1(x)} ${f1(hsCav(x))}`).join('') + `H510V452H90Z`;
  const ticks = Array.from({ length: 7 }, (_, i) => { const a = (-210 + i * 40) * D2R; return `<line x1="${f1(386 + 15 * Math.cos(a))}" y1="${f1(112 + 15 * Math.sin(a))}" x2="${f1(386 + 19 * Math.cos(a))}" y2="${f1(112 + 19 * Math.sin(a))}" stroke="${INK.graphite}" stroke-width="${W.hair}"/>`; }).join('');
  const parr = [180, 225, 270, 330, 375, 420].map(x => `<line class="hs-pa" data-x="${x}" x1="${x}" y1="300" x2="${x}" y2="326" stroke="${INK.blue}" stroke-width="2.2" marker-end="url(#arr-blue)"/>`).join('');
  return `
  <g class="hs-sch">
    <circle class="hs-s" cx="78" cy="98" r="18" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.text(78, 104, 'M', { size: 17, weight: 700 })}
    <path class="hs-s" d="M96 95H130M96 101H130" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <circle class="hs-s" cx="152" cy="98" r="22" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/><path d="M142 88L152 77L162 88Z" fill="${INK.graphite}"/>
    <path class="hs-s" d="M152 120V146M132 138V154H172V138" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    ${k.text(182, 104, 'PUMP', { size: 13, weight: 700, fill: INK.graphite2, anchor: 'start' })}
    <path class="hs-pipe" d="M152 76V44H300V166" fill="none" stroke="${INK.water}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="hs-flow" d="M152 76V44H300V166" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="6 10" stroke-linejoin="round"/>
    <path class="hs-s" d="M300 112H364" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <circle class="hs-s" cx="386" cy="112" r="22" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${ticks}
    <line class="hs-needle" x1="386" y1="112" x2="${f1(386 + 15 * Math.cos(-210 * D2R))}" y2="${f1(112 + 15 * Math.sin(-210 * D2R))}" stroke="${INK.red}" stroke-width="2.2" stroke-linecap="round"/><circle cx="386" cy="112" r="2.6" fill="${INK.graphite}"/>
    ${k.text(416, 117, 'P', { size: 15, weight: 700, anchor: 'start', fill: INK.graphite2 })}
  </g>
  <g class="hs-ch">${pt(k, `M90 168H510V334H482V194H118V334H90Z`, { cls: 'hs-p', mat: 'steel' })}
    <g class="hs-w"><path class="hs-wat" d="${hsWater(0)}" fill="${INK.water}" fill-opacity=".26"/><path class="hs-wat" d="${hsWater(0)}" fill="${k.hatch('water')}"/></g>
    ${k.text(300, 244, 'WATER', { size: 15, weight: 700, fill: INK.blue, spacing: 2, extra: 'class="hs-wl"' })}</g>
  ${pt(k, cav, { cls: 'hs-p', mat: 'iron' })}
  <g class="hs-work">${sheet(k, hsSheet(0, 1.4), 6, 'hs-sh')}</g>
  <g class="hs-pas">${parr}</g>
  <g class="hs-lb">${k.leader(232, 404, 182, 500, 'FEMALE CAVITY', { size: 15, weight: 700 })}${k.leader(500, 337, 520, 296, 'SHEET', { size: 15, weight: 700 })}</g>`;
}
function hydroSheetPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const sh = qa('.hs-sh'), wat = qa('.hs-wat'), pas = qa('.hs-pa'), needle = q('.hs-needle'), work = q('.hs-work'), ch = q('.hs-ch');
  const st = { p: 0, g: 0 };
  const render = () => {
    sh.forEach((e, i) => e.setAttribute('d', hsSheet(st.p, i ? 0 : 1.4)));
    const wd = hsWater(st.p); wat.forEach(e => e.setAttribute('d', wd));
    pas.forEach(a => { const y = hsY(+a.dataset.x, st.p) - 3; a.setAttribute('y1', f1(y - 30)); a.setAttribute('y2', f1(y - 7)); });
    const a = (-210 + 200 * st.g) * D2R; needle.setAttribute('x2', f1(386 + 15 * Math.cos(a))); needle.setAttribute('y2', f1(112 + 15 * Math.sin(a)));
  };
  render();
  const t = k.tl();
  k.plot(t, qa('.hs-p .o'), { at: 0, stagger: .1, dur: .7 });
  k.ink(t, qa('.hs-p .h'), { at: .5, stagger: .08 });
  k.plot(t, qa('.hs-sh'), { at: .6, stagger: 0, dur: .7 });
  k.plot(t, qa('.hs-s, .hs-pipe'), { at: .5, stagger: .05, dur: .5 });
  t.from(qa('.hs-w, .hs-wl, .hs-sch text, .hs-pas'), { opacity: 0, duration: .5, stagger: .03 }, 1);
  k.stamp(t, qa('.hs-lb .k-leader'), { at: 1.3, stagger: .1 });
  if (k.reduced()) { st.p = 1; st.g = 1; render(); return t; }
  const flow = gsap.to(q('.hs-flow'), { strokeDashoffset: -64, duration: 1, ease: 'none', repeat: -1, paused: true });
  const c = gsap.timeline({ repeat: -1, delay: 2.2, onUpdate: render });
  c.call(() => flow.play()).to(st, { p: 1, g: 1, duration: 3, ease: 'sine.inOut' })              // the pump runs, the gauge climbs, the sheet goes in
    .to({}, { duration: 1 }).call(() => flow.pause())
    .to(st, { g: 0, duration: .6, ease: 'power2.inOut' })                                     // pressure off
    .to(qa('.hs-w, .hs-wl, .hs-pas'), { opacity: 0, duration: .4 }, '<')
    .to(ch, { y: -40, duration: .6, ease: 'power2.inOut' })                                   // chamber up
    .to(work, { opacity: 0, y: -16, duration: .5, ease: 'power2.in' })                         // part out
    .set(st, { p: 0 }).set(work, { y: 0 })
    .to(work, { opacity: 1, duration: .5 })                                                    // new sheet
    .to(ch, { y: 0, duration: .6, ease: 'power2.inOut' })
    .to(qa('.hs-w, .hs-wl, .hs-pas'), { opacity: 1, duration: .4 })
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   drawing — deep drawing in section (slide L4·S15): the blank holder clamps the blank on the die (holding force), the
   punch pushes it into the die opening (drawing force) and a cup forms — the flange shrinks as its metal is pulled into
   the wall. Punch up, cup out, next blank.
   ====================================================================================================== */
const DR = { ax: 300, yd: 380, T: 8, rp: 70, rn: 14, rd: 78, re: 16, R0: 210 };
/** the drawn blank's mid-line for punch travel h (h ≤ 0: still flat) — punch nose and die radius joined by their common
 *  tangent, the flange whatever length is left. Optionally re-scaled to (ox, oy, s) for the step sheet. */
function drPath(h, ext = 0, ox = DR.ax, oy = DR.yd - DR.T / 2, s = 1) {
  const { ax, yd, T, rp, rn, rd, re, R0 } = DR; const ym = yd - T / 2;
  const X = x => f1(ox + (x - ax) * s), Y = y => f1(oy + (y - ym) * s), M = x => 2 * ax - x;
  if (h <= 0) return `M${X(ax - R0 - ext)} ${Y(ym)}H${X(ax + R0 + ext)}`;
  const yp = yd - T + h, r1 = rn + T / 2, r2 = re + T / 2;
  const Cp = [ax + rp - rn, yp - rn], Cd = [ax + rd + re, yd + re];
  const Dx = Cd[0] - Cp[0], Dy = Cd[1] - Cp[1], R = Math.hypot(Dx, Dy);
  const al = Math.max(0, Math.min(Math.PI / 2, Math.asin(Math.min(1, (r1 + r2) / R)) - Math.atan2(Dy, Dx)));
  const u = [Math.sin(al), Math.cos(al)];
  const B1 = [Cp[0], yp + T / 2], T1 = [Cp[0] + r1 * u[0], Cp[1] + r1 * u[1]], T2 = [Cd[0] - r2 * u[0], Cd[1] - r2 * u[1]], P4 = [Cd[0], ym];
  const Lf = Math.max(4, R0 - (rp - rn) - (r1 + r2) * al - Math.hypot(T2[0] - T1[0], T2[1] - T1[1]));
  const E = [Cd[0] + Lf + ext, ym]; const a1 = f1(r1 * s), a2 = f1(r2 * s);
  return `M${X(M(E[0]))} ${Y(E[1])}L${X(M(P4[0]))} ${Y(P4[1])}A${a2} ${a2} 0 0 1 ${X(M(T2[0]))} ${Y(T2[1])}L${X(M(T1[0]))} ${Y(T1[1])}A${a1} ${a1} 0 0 0 ${X(M(B1[0]))} ${Y(B1[1])}`
    + `L${X(B1[0])} ${Y(B1[1])}A${a1} ${a1} 0 0 0 ${X(T1[0])} ${Y(T1[1])}L${X(T2[0])} ${Y(T2[1])}A${a2} ${a2} 0 0 1 ${X(P4[0])} ${Y(P4[1])}L${X(E[0])} ${Y(E[1])}`;
}
function drawingDraw(k) {
  const { INK } = k; const { ax, yd, T, rp, rn, rd, re } = DR; const yp = yd - T;
  const dieL = `M80 ${yd}H${ax - rd - re}A${re} ${re} 0 0 1 ${ax - rd} ${yd + re}V500H80Z`, dieR = `M520 ${yd}H${ax + rd + re}A${re} ${re} 0 0 0 ${ax + rd} ${yd + re}V500H520Z`;
  const punch = `M${ax - rp} 140V${yp - rn}A${rn} ${rn} 0 0 0 ${ax - rp + rn} ${yp}H${ax + rp - rn}A${rn} ${rn} 0 0 0 ${ax + rp} ${yp - rn}V140Z`;
  return `
  <g class="dr-ax">${k.center(ax, 60, ax, 520)}</g>
  ${pt(k, dieL, { cls: 'dr-p', mat: 'steel' })}${pt(k, dieR, { cls: 'dr-p', mat: 'steel' })}
  <g class="dr-work">${sheet(k, drPath(0, 1.4), T, 'dr-bl')}</g>
  <g class="dr-hold">
    ${pt(k, RP(64, 330, ax - rd - 6 - 64, yd - T - 330), { cls: 'dr-p', mat: 'iron' })}${pt(k, RP(ax + rd + 6, 330, 536 - ax - rd - 6, yd - T - 330), { cls: 'dr-p', mat: 'iron' })}
    ${k.arrow(74, 282, 74, 324, { w: 5 })}${k.arrow(526, 282, 526, 324, { w: 5 })}
    ${k.text(84, 300, 'HOLDING FORCE', { size: 13, fill: INK.hot, weight: 700, anchor: 'start' })}
    <g class="dr-lb">${k.leader(400, 340, 410, 314, 'BLANK HOLDER', { size: 14, weight: 700 })}</g>
  </g>
  <g class="dr-pun">
    ${k.arrow(ax, 84, ax, 134, { w: 7 })}${k.text(ax + 14, 108, 'DRAWING FORCE', { size: 13, fill: INK.hot, weight: 700, anchor: 'start' })}
    ${pt(k, punch, { cls: 'dr-p', mat: 'steel' })}
    <g class="dr-lb">${k.leader(ax + 40, 200, 420, 172, 'PUNCH', { size: 15, weight: 700 })}</g>
  </g>
  <g class="dr-lb">${k.leader(120, 470, 100, 540, 'DIE', { size: 15, weight: 700 })}</g>
  <g class="dr-bll" style="opacity:0">${k.leader(366, 474, 392, 540, 'BLANK', { size: 15, weight: 700 })}</g>`;
}
function drawingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const bl = qa('.dr-bl'), pun = q('.dr-pun'), hold = q('.dr-hold'), work = q('.dr-work');
  const st = { h: -60, hy: -26 };
  const render = () => { bl.forEach((e, i) => e.setAttribute('d', drPath(st.h, i ? 0 : 1.4))); pun.setAttribute('transform', `translate(0 ${f1(st.h)})`); hold.setAttribute('transform', `translate(0 ${f1(st.hy)})`); };
  render();
  const t = k.tl();
  k.plot(t, qa('.dr-p .o'), { at: 0, stagger: .08, dur: .6 });
  k.plot(t, qa('.dr-ax line'), { at: .1, dur: .8 });
  k.ink(t, qa('.dr-p .h'), { at: .5, stagger: .06 });
  k.plot(t, bl, { at: .6, stagger: 0, dur: .7 });
  t.from(qa('.dr-hold > line, .dr-pun > line, .dr-hold > text, .dr-pun > text'), { opacity: 0, duration: .4 }, 1.1);
  k.stamp(t, qa('.dr-lb .k-leader'), { at: 1.2, stagger: .08 });
  // the BLANK leader points at the cup's wall: it shows only once there is a wall
  const bleader = q('.dr-bll');
  if (k.reduced()) { st.h = 110; st.hy = 0; render(); t.set(bleader, { opacity: 1 }, 1.7); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 2, onUpdate: render });
  c.to(st, { hy: 0, duration: .5, ease: 'power2.in' })                                        // the blank holder clamps
    .to(st, { h: 0, duration: .5, ease: 'power2.in' })                                         // the punch arrives
    .to(st, { h: 110, duration: 2.6, ease: 'sine.inOut' })                                     // …and draws the cup
    .to(bleader, { opacity: 1, duration: .3 }, '-=1.6')
    .to({}, { duration: .4 })
    .to(st, { h: -60, duration: 1.2, ease: 'power2.inOut' })                                   // punch up
    .to(st, { hy: -26, duration: .4, ease: 'power2.inOut' }, '-=.5')
    .to(work, { y: -40, opacity: 0, duration: .6, ease: 'power2.in' })                         // the cup comes out
    .to(bleader, { opacity: 0, duration: .3 }, '<')
    .set(st, { h: -60 }).set(work, { y: 0 })
    .call(render).to(work, { opacity: 1, duration: .5 })                                       // next blank
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   drawSteps — blank → partly drawn → drawn cup (slide L4·S16): three stations in non-photo blue, one blank travelling
   through them under the punch; and what it is for: a beverage can (the drawn cup is its body) and a car body panel.
   ====================================================================================================== */
const DS = { y: 196, s: .42, xs: [125, 305, 485], hs: [0, 50, 110] };
function drawStepsDraw(k) {
  const { INK, W } = k; const { y, s, xs, hs } = DS;
  const ghosts = xs.map((x, i) => `<path class="ds-gh" d="${drPath(hs[i], 0, x, y, s)}" fill="none" ${k.stroke.construct} stroke-dasharray="6 4"/>`).join('');
  const names = ['BLANK', 'PARTLY DRAWN', 'DRAWN CUP'].map((n, i) => k.text(xs[i], 296, n, { size: 15, weight: 700, extra: 'class="ds-n"' })).join('');
  const arrows = [[215, 240], [395, 420]].map(([a, b]) => `<line class="ds-ar" x1="${a}" y1="${y + 24}" x2="${b}" y2="${y + 24}" stroke="${INK.graphite2}" stroke-width="${W.thin}" marker-end="url(#arr)"/>`).join('');
  const punch = `M-29 -96V-6A6 6 0 0 0 -23 0H23A6 6 0 0 0 29 -6V-96`;
  const can = `M104 500V372L116 352V344H184V352L196 372V500Q196 512 184 512H116Q104 512 104 500Z`;
  const car = `M276 494V478L282 450L320 442L354 412H430L470 446L548 454L556 470V494H530A30 30 0 0 0 470 494H360A30 30 0 0 0 300 494Z`;
  return `
  ${ghosts}${arrows}${names}
  <g class="ds-work">${sheet(k, drPath(0, 1.2, xs[0], y, s), 5, 'ds-bl')}</g>
  <g class="ds-pun" transform="translate(${xs[1]} ${y - 70})"><path d="${punch}" fill="#fff" stroke="${INK.hot}" stroke-width="${W.thick}" stroke-linejoin="round"/>${k.arrow(0, -140, 0, -104, { w: 5 })}</g>
  <path class="ds-rule" d="M60 330H540" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="18 4 3 4"/>
  <g class="ds-can">
    <path class="ds-cb" d="M104 372V500Q104 512 116 512H184Q196 512 196 500V372Z" fill="${INK.tblue}" opacity=".16"/>
    <path class="ds-o" d="${can}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="ds-o" d="M116 352H184M104 372H196" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <path d="M118 512Q150 488 182 512" fill="none" ${k.stroke.hidden}/>
    ${k.center(150, 332, 150, 524)}
    ${k.text(150, 546, 'BEVERAGE CAN', { size: 14, weight: 700 })}
  </g>
  <g class="ds-car">
    <path class="ds-panel" d="M396 448H456L470 452V492H396Z" fill="${INK.tblue}" opacity=".18"/>
    <path class="ds-o" d="${car}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="ds-o" d="M362 418H428L458 444H336ZM396 418V492M336 446V492" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-linejoin="round"/>
    <path class="ds-pe" d="M396 448H456L470 452V492H396Z" fill="none" stroke="${INK.tblue}" stroke-width="${W.med}" stroke-linejoin="round"/>
    <circle cx="330" cy="500" r="23" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="500" cy="500" r="23" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <circle cx="330" cy="500" r="7" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/><circle cx="500" cy="500" r="7" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    ${k.text(416, 546, 'CAR BODY PANEL', { size: 14, weight: 700 })}
  </g>`;
}
function drawStepsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const { y, s, xs } = DS; const bl = qa('.ds-bl'), pun = q('.ds-pun'), work = q('.ds-work');
  const st = { x: xs[0], h: 0, px: xs[1], pd: 0 };
  const faceY = h => y + h * s - 4.5;
  const render = () => {
    bl.forEach((e, i) => e.setAttribute('d', drPath(st.h, i ? 0 : 1.2, st.x, y, s)));
    pun.setAttribute('transform', `translate(${f1(st.px)} ${f1(faceY(st.h) - st.pd)})`);
  };
  st.pd = 60; render();
  const t = k.tl();
  k.plot(t, qa('.ds-gh'), { at: 0, stagger: .15, dur: .7 });
  t.from(qa('.ds-ar, .ds-n'), { opacity: 0, duration: .4, stagger: .06 }, .5);
  k.plot(t, bl, { at: .5, stagger: 0, dur: .6 });
  k.plot(t, qa('.ds-rule, .ds-o'), { at: .7, stagger: .08, dur: .7 });
  t.from(qa('.ds-cb, .ds-panel, .ds-pe, .ds-can > path:not(.ds-o), .ds-can line, .ds-car circle, .ds-can text, .ds-car text'), { opacity: 0, duration: .5 }, 1.2);
  t.from(pun, { opacity: 0, duration: .4 }, 1.2);
  if (k.reduced()) { Object.assign(st, { x: xs[2], h: 110, px: xs[2], pd: 0 }); render(); return t; }
  const glow = (c, el, at) => c.to(el, { opacity: .5, duration: .4 }, at).to(el, { opacity: el.classList.contains('ds-cb') ? .16 : .18, duration: .6 }, at + .9);
  const c = gsap.timeline({ repeat: -1, delay: 2, onUpdate: render });
  c.set(st, { x: xs[0], h: 0, px: xs[1], pd: 60 }).set(work, { opacity: 1 })
    .to(st, { x: xs[1], duration: .8, ease: 'power2.inOut' }, .3)                             // to station 2
    .to(st, { pd: 0, duration: .45, ease: 'power2.in' }, 1.2)                                  // punch down
    .to(st, { h: 50, duration: 1, ease: 'sine.inOut' }, 1.65)                                  // partly drawn
    .to(st, { pd: 60, duration: .5, ease: 'power2.inOut' }, 2.7)
    .to(st, { x: xs[2], px: xs[2], duration: .8, ease: 'power2.inOut' }, 3.2)                  // to station 3, the punch follows
    .to(st, { pd: 0, duration: .45, ease: 'power2.in' }, 4.05)
    .to(st, { h: 110, duration: 1.1, ease: 'sine.inOut' }, 4.5)                               // drawn
    .to(st, { pd: 60, duration: .5, ease: 'power2.inOut' }, 5.65)
    .to(work, { opacity: 0, duration: .5 }, 6.3)
    .to(st, { px: xs[1], duration: .7, ease: 'power2.inOut' }, 6.3);
  glow(c, q('.ds-cb'), 6.2); glow(c, q('.ds-panel'), 6.7);
  c.set(st, { x: xs[0], h: 0 }, 7.6).to(work, { opacity: 1, duration: .5 }, 7.6).to({}, { duration: .4 }, 8.1);
  return t;
}

export default {
  spinning: { draw: spinningDraw, play: spinningPlay },
  spinParts: { draw: spinPartsDraw, play: spinPartsPlay },
  spunShapes: { draw: spunShapesDraw, play: spunShapesPlay },
  hydro: { draw: hydroDraw, play: hydroPlay },
  hydroTube: { draw: hydroTubeDraw, play: hydroTubePlay },
  hydroSheet: { draw: hydroSheetDraw, play: hydroSheetPlay },
  drawing: { draw: drawingDraw, play: drawingPlay },
  drawSteps: { draw: drawStepsDraw, play: drawStepsPlay }
};
