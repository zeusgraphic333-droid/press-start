// Illustrated scenes — cut (L5 · metal cutting): cutTree · machining · thermal · shearing · clearance · punchDie ★ ·
// punchVsBlank · fineBlank · cutOps · perforating · lancing · cutoffParting · trimShave · nibbling · emboss · coining.
// Contract and look: STYLE.md · names and captions: world/scenes/info.js · facts: docs/COURSE.md.
// The sheet is always the zone colour (INK.ice) with a graphite edge; tools are hatched sections; the clearance is red.

/* ---------- shared bits ---------- */
const f1 = v => Math.round(v * 10) / 10;
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const RP = (x, y, w, h) => `M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
const D2R = Math.PI / 180;
/** a drawn part: white knock-out fill · optional section hatch · thick outline (play() plots `.o`, inks `.h`) */
function pt(k, d, { mat = '', cls = '', w = k.W.thick, fill = '#fff', stroke = k.INK.graphite, extra = '', flip = 0 } = {}) {
  const fl = flip ? ` transform="translate(${2 * flip} 0) scale(-1 1)"` : ''; // mirror the hatch about x = flip (a touching part, same material)
  return `<g class="${cls}" ${extra}>${fill ? `<path d="${d}" fill="${fill}"/>` : ''}${mat ? `<path class="h" d="${fl ? mirrorD(d, flip) : d}" fill="${k.hatch(mat)}"${fl}/>` : ''}<path class="o" d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
}
/** mirror an absolute M/L/H/V/Z path about x = c (only for the plain polygons used with `flip`) */
function mirrorD(d, c) {
  return d.replace(/([MLH])\s*(-?[\d.]+)/g, (m, cmd, x) => `${cmd}${f1(2 * c - +x)}`).replace(/h\s*(-?[\d.]+)/g, (m, x) => `h${f1(-x)}`);
}
/** a flat piece of sheet (zone colour, graphite edge) */
const plate = (k, x, y, w, h, cls = '', color = k.INK.ice) => `<path class="${cls}" d="${RP(x, y, w, h)}" fill="${color}" stroke="${k.INK.graphite}" stroke-width="${k.W.med}" stroke-linejoin="round"/>`;
/** a sheet seen edge-on along any profile: graphite edge stroke under a coloured core stroke on the same mid-line */
function sheet(k, d, T, cls, color = k.INK.ice) {
  return `<path class="${cls} se" d="${d}" fill="none" stroke="${k.INK.graphite}" stroke-width="${T + 2.8}" stroke-linejoin="round"/><path class="${cls} sc" d="${d}" fill="none" stroke="${color}" stroke-width="${T}" stroke-linejoin="round"/>`;
}
/** a red clearance mark: two arrows pointing in at a narrow gap between x1 and x2 at height y, with its label outside */
function gapMark(k, x1, x2, y, label, { side = -1, color = k.INK.red, size = 15 } = {}) {
  const L = 22, a = Math.min(x1, x2), b = Math.max(x1, x2);
  return `<g class="k-gap"><line x1="${f1(a - L)}" y1="${f1(y)}" x2="${f1(a)}" y2="${f1(y)}" stroke="${color}" stroke-width="${k.W.thin}" marker-end="url(#arr-red)"/><line x1="${f1(b + L)}" y1="${f1(y)}" x2="${f1(b)}" y2="${f1(y)}" stroke="${color}" stroke-width="${k.W.thin}" marker-end="url(#arr-red)"/>${k.text(side < 0 ? a - L - 4 : b + L + 4, y + size * .35, label, { size, fill: color, weight: 700, anchor: side < 0 ? 'end' : 'start' })}</g>`;
}

/* ======================================================================================================
   punchDie ★ — a die set in section: the punch (convex, the male) comes down through the sheet into the die (concave, the
   female) with C/2 of clearance each side; the slug is pushed into the die and drops out below. Then the strip feeds on
   one pitch and the next hole is punched. Slow and heavy.
   ====================================================================================================== */
const PD = { ax: 300, a: 55, hole: 58, d2: 61, sy: 256, T: 14, P: 150, tip: 250, travel: 42 };
function punchDieDraw(k) {
  const { INK, W } = k; const { ax, a, hole, d2, sy, T, P, tip } = PD; const by = sy + T;
  // the strip: webs between the holes already punched (left), the slug under the punch, the stock still to come (right)
  const segs = [[-400, ax - 2 * P - hole], [ax - 2 * P + hole, ax - P - hole], [ax - P + hole, ax - hole], [ax + hole, 560 + P + 20]];
  const strip = segs.map(([x1, x2]) => plate(k, x1, sy, x2 - x1, T, 'pd-st')).join('');
  const dieL = `M120 ${by}H${ax - d2}V${by + 30}L${ax - 76} 372H120Z`, dieR = `M480 ${by}H${ax + d2}V${by + 30}L${ax + 76} 372H480Z`;
  return `
  <defs><clipPath id="punchDie-clip"><rect x="40" y="200" width="520" height="120"/></clipPath></defs>
  <g class="pd-axis">${k.center(ax, 36, ax, 470)}</g>
  ${pt(k, `M50 372H${ax - 92}V416H50Z`, { cls: 'pd-p', mat: 'iron' })}${pt(k, `M550 372H${ax + 92}V416H550Z`, { cls: 'pd-p', mat: 'iron' })}
  ${pt(k, dieL, { cls: 'pd-p pd-die', mat: 'steel' })}${pt(k, dieR, { cls: 'pd-p pd-die', mat: 'steel' })}
  <g class="pd-cons" ${k.stroke.construct} stroke-dasharray="5 4"><line x1="${ax - a}" y1="${tip}" x2="${ax - a}" y2="${by + 34}"/><line x1="${ax + a}" y1="${tip}" x2="${ax + a}" y2="${by + 34}"/></g>
  <g clip-path="url(#punchDie-clip)"><g class="pd-strip">${strip}</g></g>
  <g class="pd-slug">${plate(k, ax - hole, sy, hole * 2, T, 'pd-sl')}</g>
  <g class="pd-ram">
    ${k.arrow(ax, 18, ax, 62, { w: 7, extra: 'class="pd-arr"' })}
    ${k.text(ax + 16, 44, 'PUNCHING FORCE', { size: 13, fill: INK.hot, anchor: 'start', weight: 700 })}
    ${pt(k, RP(120, 70, 360, 46), { cls: 'pd-p pd-holder', mat: 'iron' })}
    ${pt(k, `M${ax - a} ${tip}V140H${ax - a - 16}V116H${ax + a + 16}V140H${ax + a}V${tip}Z`, { cls: 'pd-p pd-punch', mat: 'steel' })}
    <g class="pd-hid" ${k.stroke.hidden} fill="none"><path d="M${ax - 34} 74V132M${ax - 22} 74V132M${ax + 22} 74V132M${ax + 34} 74V132"/></g>
    <g class="pd-lb">${k.leader(ax - a + 8, 196, 150, 160, 'PUNCH', { size: 17, weight: 700 })}${k.text(126, 182, 'MALE · CONVEX', { size: 13, fill: INK.graphite2, anchor: 'end' })}</g>
  </g>
  <g class="pd-c2">${gapMark(k, ax - d2, ax - a, by + 16, 'C/2', { side: -1 })}${gapMark(k, ax + a, ax + d2, by + 16, 'C/2', { side: 1 })}</g>
  <g class="pd-lb">
    ${k.leader(470, sy + 4, 486, 196, 'SHEET', { size: 16, weight: 700 })}
    ${k.leader(176, 344, 150, 456, 'DIE', { size: 17, weight: 700 })}${k.text(126, 478, 'FEMALE · CONCAVE', { size: 13, fill: INK.graphite2, anchor: 'end' })}
    ${k.leader(ax + 30, 440, 360, 520, 'SLUG', { size: 16, weight: 700 })}
  </g>`;
}
function punchDiePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const ram = q('.pd-ram'), slug = q('.pd-slug'), strip = q('.pd-strip');
  const st = { y: 0, push: 0, drop: 0, o: 1 };
  const render = () => {
    st.push = Math.max(st.push, st.y - (PD.sy - PD.tip));
    ram.setAttribute('transform', `translate(0 ${f1(st.y)})`);
    slug.setAttribute('transform', `translate(0 ${f1(st.push + st.drop)})`); slug.setAttribute('opacity', st.o.toFixed(2));
  };
  const t = k.tl();
  k.plot(t, qa('.pd-p .o'), { at: 0, stagger: .06, dur: .6 });
  k.plot(t, qa('.pd-axis line'), { at: .2, dur: .8 });
  k.ink(t, qa('.pd-p .h'), { at: .5, stagger: .06 });
  t.from(qa('.pd-st, .pd-sl'), { opacity: 0, duration: .5, stagger: .05 }, .7);
  k.plot(t, qa('.pd-cons line'), { at: 1, dur: .5 });
  t.from(q('.pd-hid'), { opacity: 0, duration: .4 }, .9);
  t.from(q('.pd-arr'), { opacity: 0, duration: .4 }, 1.1);
  k.stamp(t, qa('.pd-lb .k-leader, .pd-c2 .k-gap'), { at: 1.2, stagger: .08 });
  t.from(qa('.pd-lb > text, .pd-ram > text'), { opacity: 0, duration: .4 }, 1.5);
  if (k.reduced()) { st.y = PD.travel; render(); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 2, onUpdate: render });
  c.set(st, { y: 0, push: 0, drop: 0, o: 1 }).set(strip, { x: 0 })
    .to(st, { y: PD.travel, duration: .55, ease: 'power2.in' })              // the stroke: through the sheet
    .to(st, { y: PD.travel, duration: .3 })                                  // a beat at the bottom
    .to(st, { y: 0, duration: 1.3, ease: 'power2.inOut' })                   // back up, slowly
    .to(st, { drop: 190, duration: .75, ease: 'power2.in' }, '-=1.05')       // the slug falls out of the die
    .to(st, { o: 0, duration: .3 }, '-=.3')
    .to(strip, { x: -PD.P, duration: .8, ease: 'power2.inOut' }, '+=.05')    // feed one pitch
    .to({}, { duration: .55 });
  return t;
}

const hatchRect = (k, x, y, w, h, mat, cls = '') => pt(k, RP(x, y, w, h), { mat, cls });
const smoothD = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L');

/* ======================================================================================================
   cutTree — slide L5·S2's tree: Cutting → punching & shearing · chip forming · nonchip forming · thermal/flame cutting,
   each with a small working drawing under it. The families work one at a time.
   ====================================================================================================== */
const CT = { xs: [96, 232, 368, 504], by: 150, bh: 56 };
function cutTreeDraw(k) {
  const { INK, W } = k; const { xs, by, bh } = CT;
  const names = [['PUNCHING &', 'SHEARING'], ['CHIP', 'FORMING'], ['NONCHIP', 'FORMING'], ['THERMAL /', 'FLAME']];
  const boxes = xs.map((x, i) => `<g class="ct-b" data-i="${i}"><rect class="ct-bf" x="${x - 56}" y="${by}" width="112" height="${bh}" fill="${INK.ice}" opacity="0"/><path class="ct-bo" d="${RP(x - 56, by, 112, bh)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.text(x, by + 24, names[i][0], { size: 14, weight: 700 })}${k.text(x, by + 42, names[i][1], { size: 14, weight: 700 })}</g>`).join('');
  const tree = `M300 96V126M${xs[0]} 126H${xs[3]}` + xs.map(x => `M${x} 126V${by}`).join('');
  // 1 · punch & die
  const [a, b, c, d] = xs;
  const i1 = `<g class="ct-i ct-i0">
    <g class="ct-pun">${hatchRect(k, a - 18, 246, 36, 80, 'steel', 'ct-p')}</g>
    ${plate(k, a - 52, 330, 34, 9, 'ct-sh')}${plate(k, a + 18, 330, 34, 9, 'ct-sh')}<g class="ct-slug">${plate(k, a - 18, 330, 36, 9, 'ct-sh')}</g>
    ${hatchRect(k, a - 52, 339, 32, 56, 'steel', 'ct-p')}${hatchRect(k, a + 20, 339, 32, 56, 'steel', 'ct-p')}</g>`;
  // 2 · chip forming: a tool peels a curly chip off a block
  const i2 = `<g class="ct-i ct-i1">
    ${hatchRect(k, b - 52, 352, 104, 52, 'steel', 'ct-p')}
    <rect class="ct-layer" x="${b - 52}" y="341" width="74" height="11" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <g class="ct-tool"><path d="M${b + 22} 352L${b + 50} 296H${b + 70}L${b + 34} 352Z" fill="#fff" stroke="${INK.hot}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <path class="ct-chip" d="M${b + 20} 341C${b + 16} 326 ${b + 22} 312 ${b + 34} 310C${b + 46} 308 ${b + 52} 320 ${b + 44} 326C${b + 38} 330 ${b + 32} 324 ${b + 36} 318" fill="none" stroke="${INK.graphite}" stroke-width="${W.med + .6}" stroke-linecap="round"/></g></g>`;
  // 3 · nonchip: an electrode sparks its shape into the work, no chips
  const sparks = [-14, 0, 14].map((dx, i) => `<path class="ct-sp" d="M${c + dx} 344l-3 4l5 2l-3 5" fill="none" stroke="${INK.hot}" stroke-width="2" stroke-linecap="round" opacity="${i === 1 ? 1 : .6}"/>`).join('');
  const i3 = `<g class="ct-i ct-i2">
    ${hatchRect(k, c - 52, 352, 104, 52, 'steel', 'ct-p')}
    <rect class="ct-cav" x="${c - 22}" y="352" width="44" height="0" fill="#fff"/>
    <g class="ct-el">${hatchRect(k, c - 22, 262, 44, 78, 'bronze', 'ct-p')}${sparks}</g></g>`;
  // 4 · thermal: a torch flame through a plate, sparks below
  const i4 = `<g class="ct-i ct-i3">
    ${pt(k, `M${d - 12} 250H${d + 12}L${d + 6} 304H${d - 6}Z`, { cls: 'ct-p' })}
    <path class="ct-fl" d="M${d} 304C${d + 9} 312 ${d + 7} 326 ${d} 344C${d - 7} 326 ${d - 9} 312 ${d} 304Z" fill="${INK.hot}" fill-opacity=".3" stroke="${INK.hot}" stroke-width="${W.med}"/>
    ${hatchRect(k, d - 52, 330, 48, 18, 'steel', 'ct-p')}${hatchRect(k, d + 4, 330, 48, 18, 'steel', 'ct-p')}
    <g class="ct-tsp">${[-10, -3, 4, 11].map(dx => `<line x1="${d + dx * .3}" y1="352" x2="${d + dx}" y2="372" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g></g>`;
  return `
  <g class="ct-root"><path class="ct-ro" d="${RP(236, 52, 128, 44)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.text(300, 81, 'CUTTING', { size: 20, weight: 700, spacing: 2 })}</g>
  <path class="ct-tree" d="${tree}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  ${boxes}${i1}${i2}${i3}${i4}
  <g class="ct-hint">${['SHEAR · BLANK · PUNCH', 'MACHINING', 'CHEMICAL · ELECTRICAL', 'GAS · LASER · PLASMA'].map((s, i) => k.text(xs[i], 440, s, { size: 11.5, weight: 600, fill: INK.graphite2 })).join('')}</g>`;
}
function cutTreePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, q('.ct-ro'), { at: 0, dur: .5 });
  t.from(q('.ct-root text'), { opacity: 0, duration: .3 }, .3);
  k.plot(t, q('.ct-tree'), { at: .35, dur: .8 });
  k.plot(t, qa('.ct-bo'), { at: .7, stagger: .1, dur: .5 });
  t.from(qa('.ct-b text'), { opacity: 0, duration: .3, stagger: .05 }, 1);
  k.plot(t, qa('.ct-p .o'), { at: .9, stagger: .04, dur: .5 });
  k.ink(t, qa('.ct-p .h, .ct-sh, .ct-layer, .ct-tool, .ct-fl, .ct-tsp, .ct-sp, .ct-hint text'), { at: 1.2, stagger: .02 });
  if (k.reduced()) return t;
  const c = gsap.timeline({ repeat: -1, delay: 2.2 });
  const lit = (i, at) => c.to(qa('.ct-bf')[i], { opacity: .55, duration: .3 }, at).to(qa('.ct-bf')[i], { opacity: 0, duration: .4 }, at + 2);
  // 1 · the punch goes through, the slug drops
  lit(0, 0);
  c.to(q('.ct-pun'), { y: 13, duration: .35, ease: 'power2.in' }, .1).to(q('.ct-slug'), { y: 4, duration: .1 }, .4)
    .to(q('.ct-slug'), { y: 70, opacity: 0, duration: .6, ease: 'power2.in' }, .6).to(q('.ct-pun'), { y: 0, duration: .7, ease: 'power2.inOut' }, .7)
    .set(q('.ct-slug'), { y: 0 }, 2.2).to(q('.ct-slug'), { opacity: 1, duration: .3 }, 2.2);
  // 2 · the tool travels, the layer comes off as a chip
  lit(1, 2.4);
  c.to(q('.ct-tool'), { x: -54, duration: 1.6, ease: 'sine.inOut' }, 2.5).to(q('.ct-layer'), { attr: { width: 20 }, duration: 1.6, ease: 'sine.inOut' }, 2.5)
    .to(q('.ct-chip'), { scale: 1.35, rotation: -20, transformOrigin: '20% 90%', duration: 1.6, ease: 'sine.inOut' }, 2.5)
    .to(q('.ct-tool'), { opacity: 0, duration: .3 }, 4.3).set(q('.ct-tool'), { x: 0 }, 4.6).set(q('.ct-chip'), { scale: 1, rotation: 0 }, 4.6)
    .to(q('.ct-layer'), { attr: { width: 74 }, duration: .01 }, 4.6).to(q('.ct-tool'), { opacity: 1, duration: .3 }, 4.65);
  // 3 · the electrode sinks with sparks, the cavity takes its shape
  lit(2, 4.8);
  c.to(q('.ct-el'), { y: 26, duration: 1.6, ease: 'sine.inOut' }, 4.9).to(q('.ct-cav'), { attr: { height: 26 }, duration: 1.6, ease: 'sine.inOut' }, 4.9)
    .to(qa('.ct-sp'), { opacity: .2, duration: .4, yoyo: true, repeat: 3, stagger: .12 }, 4.9)
    .to(q('.ct-el'), { y: 0, duration: .7, ease: 'power2.inOut' }, 6.6).to(q('.ct-cav'), { attr: { height: 0 }, duration: .4 }, 7.2);
  // 4 · the flame cuts, sparks fall
  lit(3, 7.2);
  c.to(q('.ct-fl'), { scaleY: 1.18, transformOrigin: '50% 0%', duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 7.3)
    .fromTo(qa('.ct-tsp line'), { y: 0, opacity: 1 }, { y: 26, opacity: 0, duration: .5, stagger: .1, repeat: 2, ease: 'power1.in', immediateRender: false }, 7.3)
    .to({}, { duration: .4 }, 9.4);
  return t;
}

/* ======================================================================================================
   machining — chip forming to a tolerance: a toothed milling cutter, turning, traverses the block and takes off the
   machining allowance; chips curl away; then the finished surface gets its machining symbol and a toleranced size.
   ====================================================================================================== */
const MC = { y: 372, raw: 352, R: 72, x0: 70, x1: 470 };
function machiningDraw(k) {
  const { INK, W } = k; const { y, raw, R, x0, x1 } = MC;
  const teeth = Array.from({ length: 28 }, (_, i) => { const a = i * Math.PI / 14, r = i % 2 ? R - 12 : R; const b = a + (i % 2 ? .08 : 0); return `${f1(r * Math.cos(b))} ${f1(r * Math.sin(b))}`; });
  const chips = Array.from({ length: 6 }, (_, i) => `<path class="mc-chip" d="M0 0c-4 -6 -2 -13 5 -14c6 -1 9 5 5 9" fill="none" stroke="${INK.hot}" stroke-width="2.4" stroke-linecap="round" opacity="0"/>`).join('');
  return `
  <defs><clipPath id="machining-clip"><rect class="mc-clip" x="${x0}" y="${raw - 2}" width="${x1 - x0}" height="${y - raw + 4}"/></clipPath></defs>
  <g class="mc-part">
    ${hatchRect(k, x0, y, x1 - x0, 104, 'steel', 'mc-p')}
    <g clip-path="url(#machining-clip)"><rect x="${x0}" y="${raw}" width="${x1 - x0}" height="${y - raw}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
    <path class="mc-fin" d="M${x0} ${y}H${x1}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <g class="mc-sym" opacity="0"><path d="M150 ${y}L139 ${y - 19}H161M150 ${y}L172 ${y - 38}H206" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin + .3}" stroke-linejoin="round"/></g>
    <g class="mc-dim" opacity="0">${k.dim(x1, y + 104, x1, y, 'h ±0.02', { off: -40, color: INK.red, size: 14 })}</g>
  </g>
  ${hatchRect(k, 40, 52, 520, 14, 'iron', 'mc-p')}
  <g class="mc-feed">${k.arrow(540, 36, 470, 36, { w: 5 })}${k.text(462, 41, 'FEED', { size: 13, weight: 700, fill: INK.hot, anchor: 'end' })}</g>
  <g class="mc-cut" transform="translate(530 ${y - R})">
    ${pt(k, RP(-48, 66 - y + R, 96, 40), { cls: 'mc-p', mat: 'steel' })}
    ${pt(k, RP(-11, 106 - y + R, 22, y - R - 106), { cls: 'mc-p' })}
    <g class="mc-rot"><path d="M${teeth.join('L')}Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <circle r="${R - 22}" fill="none" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>
      <path d="M-18 0A18 18 0 1 0 18 0A18 18 0 1 0 -18 0ZM-5 -18V-24H5V-18" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
    <path d="M-30 0H30M0 -30V30" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>
    <path d="M-${R + 14} -18A${R + 14} ${R + 14} 0 0 1 -18 -${R + 14}" fill="none" stroke="${INK.graphite2}" stroke-width="${W.thin}" marker-end="url(#arr)"/>
    <g class="mc-chips" transform="translate(-50 -20)">${chips}</g>
  </g>`;
}
function machiningPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const { y, R, x0, x1 } = MC; const cut = q('.mc-cut'), rot = q('.mc-rot'), clip = q('.mc-clip'), part = q('.mc-part');
  const st = { x: 530, lift: 0, a: 0 };
  const render = () => {
    cut.setAttribute('transform', `translate(${f1(st.x)} ${f1(y - R - st.lift)})`); rot.setAttribute('transform', `rotate(${f1(st.a)})`);
    clip.setAttribute('width', f1(Math.max(0, Math.min(x1, st.x - 50) - x0)));
  };
  render();
  const t = k.tl();
  k.plot(t, qa('.mc-p .o'), { at: 0, dur: .7 });
  k.ink(t, qa('.mc-p .h'), { at: .5 });
  t.from(q('[clip-path="url(#machining-clip)"]'), { opacity: 0, duration: .5 }, .6);
  t.from(cut, { opacity: 0, duration: .6 }, .7);
  t.from(q('.mc-feed'), { opacity: 0, duration: .4 }, 1);
  if (k.reduced()) { st.x = 200; render(); t.set(qa('.mc-sym, .mc-dim'), { opacity: 1 }, 1); return t; }
  gsap.to(st, { a: 360, duration: 1.6, ease: 'none', repeat: -1, onUpdate: render });
  const chips = qa('.mc-chip');
  const fly = gsap.timeline({ repeat: -1, paused: true });
  chips.forEach((ch, i) => fly.fromTo(ch, { x: 0, y: 0, rotation: 0, opacity: 1, transformOrigin: '50% 50%' }, { x: -40 - (i % 3) * 14, y: -70 - (i % 2) * 22, rotation: -220, opacity: 0, duration: .9, ease: 'power1.out', immediateRender: false }, i * .16));
  const c = gsap.timeline({ repeat: -1, delay: 1.6, onUpdate: render });
  c.call(() => fly.play(0)).to(st, { x: 104, duration: 4.4, ease: 'sine.inOut' })                // the cut
    .call(() => fly.pause()).set(chips, { opacity: 0 })
    .to(qa('.mc-sym, .mc-dim'), { opacity: 1, duration: .4, stagger: .25 }, '+=.1')           // finished to size
    .to({}, { duration: 1.6 })
    .to(part, { opacity: 0, duration: .5 })
    .to(st, { x: 530, duration: 1, ease: 'power2.inOut' }, '<')                                  // the head runs back
    .set(qa('.mc-sym, .mc-dim'), { opacity: 0 })
    .to(part, { opacity: 1, duration: .5 })
    .to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   thermal — gas, laser and plasma, one above the other's plan: in elevation the three heads cut through the plate
   (a flame, a focused beam, a constricted arc) with sparks falling below; in plan each kerf is traced as the head moves
   (straight, a circle, a curve), the views tied by projection lines.
   ====================================================================================================== */
const TH = { py: 214, pt: 18, plan: ['M90 404H210', 'M346 404A46 46 0 1 1 346 403.9', 'M390 368C430 368 410 440 450 440C490 440 470 380 510 380'] };
function thermalDraw(k) {
  const { INK, W } = k; const { py, pt: T } = TH;
  const head = (i) => {
    if (i === 0) return `<path d="M-10 66H10V112L6 196H-6L-10 112Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><path d="M-4 70V180M4 70V180" ${k.stroke.hidden} stroke-width="1.3"/>
      <path class="th-fl" d="M0 196C9 204 8 222 0 ${py + T + 14}C-8 222 -9 204 0 196Z" fill="${INK.hot}" fill-opacity=".28" stroke="${INK.hot}" stroke-width="${W.med}"/><path d="M0 196C3 200 3 206 0 212C-3 206 -3 200 0 196Z" fill="${INK.hot}"/>`;
    if (i === 1) return `<path d="M-16 66H16V150L6 196H-6L-16 150Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><ellipse cx="0" cy="124" rx="13" ry="5" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
      <path d="M-10 124L0 ${py + T / 2}L10 124" fill="none" stroke="${INK.red}" stroke-width="1.6"/><line x1="0" y1="70" x2="0" y2="124" stroke="${INK.red}" stroke-width="2.2"/>`;
    return `<path d="M-14 66H14V160L6 196H-6L-14 160Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><path d="M-3 70V174H3V70" fill="none" ${k.stroke.hidden} stroke-width="1.3"/>
      <path class="th-arc" d="M-3 196L3 202L-3 208L3 ${py + 4}L-2 ${py + T + 12}L2 ${py + T + 12}L-1 ${py + 4}" fill="${INK.hot}" fill-opacity=".3" stroke="${INK.hot}" stroke-width="${W.med}" stroke-linejoin="round"/>`;
  };
  const names = ['GAS', 'LASER', 'PLASMA'];
  const heads = [150, 300, 450].map((x, i) => `<g class="th-h" data-i="${i}" transform="translate(${x} 0)">
      ${head(i)}<rect x="-3" y="${py}" width="6" height="${T}" fill="#fff"/><path d="M-3 ${py}V${py + T}M3 ${py}V${py + T}" stroke="${INK.hot}" stroke-width="1.6"/>
      <g class="th-sp">${[-14, -6, 2, 10, 17].map((dx, j) => `<line x1="${f1(dx * .25)}" y1="${py + T + 2}" x2="${dx}" y2="${py + T + 22 + (j % 2) * 8}" stroke="${INK.hot}" stroke-width="2" stroke-linecap="round"/>`).join('')}</g>
      <line class="th-pj" x1="0" y1="${py + T + 40}" x2="0" y2="404" ${k.stroke.construct} stroke-dasharray="5 5"/>
      ${k.text(0, 54, names[i], { size: 17, family: 'stencil', weight: 800, spacing: 2 })}</g>`).join('');
  return `
  ${hatchRect(k, 50, py, 500, T, 'steel', 'th-p')}
  ${heads}
  <path class="th-pl" d="${RP(60, 340, 480, 140)}" fill="${INK.ice}" fill-opacity=".35" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  ${TH.plan.map((d, i) => `<path class="th-guide" d="${d}" fill="none" ${k.stroke.construct} stroke-dasharray="3 5"/><path class="th-kerf" data-i="${i}" d="${d}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/><circle class="th-dot" data-i="${i}" r="5" fill="${INK.hot}"/>`).join('')}
  ${k.text(60, 500, 'PLAN', { size: 12, weight: 700, fill: INK.graphite2, anchor: 'start', spacing: 1 })}`;
}
function thermalPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const heads = qa('.th-h'), kerfs = qa('.th-kerf'), dots = qa('.th-dot'), pjs = qa('.th-pj');
  const L = kerfs.map(e => { try { return e.getTotalLength(); } catch (er) { return 300; } });
  const st = { u: 0 };
  const render = () => kerfs.forEach((e, i) => {
    let P = { x: [90, 392, 390][i], y: 404 }; try { P = e.getPointAtLength(L[i] * st.u); } catch (er) { }
    e.style.strokeDasharray = `${f1(L[i])} ${f1(L[i])}`; e.style.strokeDashoffset = f1(L[i] * (1 - st.u));
    dots[i].setAttribute('cx', f1(P.x)); dots[i].setAttribute('cy', f1(P.y));
    heads[i].setAttribute('transform', `translate(${f1(P.x)} 0)`); pjs[i].setAttribute('y2', f1(P.y - 6));
  });
  const t = k.tl();
  k.plot(t, qa('.th-p .o'), { at: 0, dur: .7 });
  k.ink(t, qa('.th-p .h'), { at: .4 });
  t.from(heads, { opacity: 0, y: -20, duration: .6, stagger: .12 }, .3);
  k.plot(t, q('.th-pl'), { at: .6, dur: .8 });
  k.plot(t, qa('.th-guide'), { at: .9, stagger: .1, dur: .6 });
  if (k.reduced()) { st.u = .62; render(); return t; }
  st.u = 0; render();
  qa('.th-fl, .th-arc').forEach((f, i) => k.loop(f, { scaleY: 1.12, transformOrigin: '50% 0%', duration: .5 + i * .13 }));
  qa('.th-sp line').forEach((l, i) => gsap.fromTo(l, { opacity: 1, y: 0 }, { opacity: 0, y: 26, duration: .55, ease: 'power1.in', repeat: -1, delay: (i * .37) % .55 }));
  const c = gsap.timeline({ repeat: -1, delay: 1.6, onUpdate: render });
  c.to(st, { u: 1, duration: 5.5, ease: 'none' }).to({}, { duration: 1 })
    .to(kerfs, { opacity: 0, duration: .5 }).set(st, { u: 0 }).to(kerfs, { opacity: 1, duration: .3 });
  return t;
}

/* ======================================================================================================
   shearing — a guillotine shear cut through: the hold-down clamps the sheet, the upper blade (the punch) comes down
   past the lower blade (the die) a clearance c away, the piece cut to size drops; the sheet feeds to the back gauge.
   ====================================================================================================== */
const SHR = { y: 290, T: 10, edge: 300, c: 4, L: 170 };
function shearingDraw(k) {
  const { INK, W } = k; const { y, T, edge, c, L } = SHR;
  return `
  <defs><clipPath id="shearing-clip"><rect x="40" y="220" width="520" height="120"/></clipPath></defs>
  ${pt(k, `M40 ${y + T}H246V${y + T + 40}H${edge}V440H40Z`, { cls: 'sh-p', mat: 'iron' })}
  ${pt(k, RP(246, y + T, edge - 246, 40), { cls: 'sh-p', mat: 'steel' })}
  <g clip-path="url(#shearing-clip)"><g class="sh-strip">${plate(k, -360, y, edge + 360, T, 'sh-s')}</g></g>
  <g class="sh-piece">${plate(k, edge, y, L, T, 'sh-s')}</g>
  ${pt(k, `M${edge + L} ${y - 40}H${edge + L + 14}V${y + T}H${edge + L}Z`, { cls: 'sh-p', mat: 'steel' })}
  ${pt(k, `M${edge + L + 14} ${y - 40}H550V${y - 28}H${edge + L + 14}Z`, { cls: 'sh-p' })}
  <g class="sh-hold">${pt(k, RP(186, y - 62, 52, 62), { cls: 'sh-p', mat: 'iron' })}<path d="M212 150V${y - 62}" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-dasharray="3 3"/></g>
  <g class="sh-ram">
    ${k.arrow(430, 40, 430, 96, { w: 7 })}
    ${pt(k, RP(290, 104, 270, 50), { cls: 'sh-p', mat: 'iron' })}
    ${pt(k, `M${edge + c} 154H${edge + c + 54}V${y - 18}L${edge + c + 42} ${y - 8}H${edge + c}Z`, { cls: 'sh-p', mat: 'steel' })}
    <g class="sh-lb">${k.leader(edge + c + 40, 210, 420, 196, 'UPPER BLADE', { size: 15, weight: 700 })}${k.text(444, 214, 'THE PUNCH', { size: 12, fill: INK.graphite2, anchor: 'start' })}</g>
  </g>
  <g class="sh-c">${gapMark(k, edge, edge + c, y + T + 18, 'c', { side: -1 })}</g>
  <g class="sh-lb">
    ${k.leader(272, 330, 230, 470, 'LOWER BLADE', { size: 15, weight: 700 })}${k.text(206, 488, 'THE DIE', { size: 12, fill: INK.graphite2, anchor: 'end' })}
    ${k.leader(200, y - 40, 150, 210, 'HOLD-DOWN', { size: 15, weight: 700 })}
  </g>
  <g class="sh-dim">${k.dim(edge, y + T, edge + L, y + T, 'SIZE', { off: 70, size: 14 })}</g>`;
}
function shearingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const ram = q('.sh-ram'), hold = q('.sh-hold'), piece = q('.sh-piece'), strip = q('.sh-strip');
  const t = k.tl();
  k.plot(t, qa('.sh-p .o'), { at: 0, stagger: .07, dur: .6 });
  k.ink(t, qa('.sh-p .h'), { at: .5, stagger: .05 });
  t.from(qa('.sh-s'), { opacity: 0, duration: .5 }, .7);
  k.stamp(t, qa('.sh-lb .k-leader, .sh-c .k-gap, .sh-dim'), { at: 1.1, stagger: .08 });
  t.from(qa('.sh-lb > text, .sh-ram > line'), { opacity: 0, duration: .4 }, 1.3);
  if (k.reduced()) { t.set(ram, { y: 30 }, 1.5).set(piece, { y: 10, rotation: 6, svgOrigin: `${SHR.edge + SHR.L} ${SHR.y}` }, 1.5); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 2 });
  c.set(hold, { y: -14 }).set(ram, { y: 0 }).set(piece, { y: 0, x: 0, rotation: 0, opacity: 1 }).set(strip, { x: 0 })
    .to(hold, { y: 0, duration: .4, ease: 'power2.in' })                                                     // clamp
    .to(ram, { y: 30, duration: .55, ease: 'power2.in' }, '+=.1')                                            // the blade comes down past the lower blade
    .to(piece, { y: 12, rotation: 3, svgOrigin: `${SHR.edge + SHR.L} ${SHR.y}`, duration: .25, ease: 'power2.in' }, '-=.25')
    .to(piece, { y: 190, x: 30, rotation: 16, opacity: 0, duration: .8, ease: 'power2.in' })                   // the piece drops
    .to(ram, { y: 0, duration: 1, ease: 'power2.inOut' }, '-=.7')
    .to(hold, { y: -14, duration: .4, ease: 'power2.inOut' }, '-=.4')
    .to(strip, { x: SHR.L, duration: .9, ease: 'power2.inOut' })                                               // feed to the gauge
    .set(strip, { x: 0 }).set(piece, { y: 0, x: 0, rotation: 0, opacity: 1 })
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   clearance — the same cutting edges three times, close up: the gap c too small (the break lines pass each other:
   double burnish, more force), right (they meet: a clean break), too large (the metal is pinched and bent).
   ====================================================================================================== */
const CLR = [{ cx: 108, g: 4, name: 'TOO SMALL', note: ['break lines pass', 'each other'] }, { cx: 300, g: 16, name: 'RIGHT', note: ['the cracks meet:', 'a clean break'] }, { cx: 492, g: 38, name: 'TOO LARGE', note: ['metal pinched', 'and bent'] }];
function clFrac(C) {
  const xp = C.cx - C.g / 2, xd = C.cx + C.g / 2;
  if (C.g < 8) return [[xp, 240], [xp + 8, 262], [xd - 8, 278], [xd, 300]];
  if (C.g < 20) return [[xp, 240], [xd, 300]];
  return [[xp, 240], [xp + 3, 256], [xp + 12, 276], [xd - 14, 294], [xd - 2, 306], [xd, 300]];
}
function clearanceDraw(k) {
  const { INK, W } = k;
  return CLR.map((C, i) => {
    const xp = C.cx - C.g / 2, xd = C.cx + C.g / 2, a = C.cx - 78, b = C.cx + 78, fr = clFrac(C);
    const slug = `M${a} 240` + fr.map(p => `L${f1(p[0])} ${f1(p[1])}`).join('') + `L${a} 300Z`;
    const rest = `M${b} 240` + fr.map(p => `L${f1(p[0])} ${f1(p[1])}`).join('') + `L${b} 300Z`;
    const crack = smoothD(fr);
    return `<g class="cl-pan" data-i="${i}">
      ${k.text(C.cx, 112, C.name, { size: 17, weight: 700, spacing: 1, fill: i === 1 ? INK.graphite : INK.red })}
      <path class="cl-rest" d="${rest}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
      <g class="cl-slug"><path d="${slug}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/></g>
      <g class="cl-pun">${pt(k, `M${a} 140H${xp}V240H${a}Z`, { cls: 'cl-p', mat: 'steel' })}</g>
      ${pt(k, `M${xd} 300H${b}V400H${xd}Z`, { cls: 'cl-p', mat: 'steel' })}
      <path class="cl-cr" d="${crack}" fill="none" stroke="${INK.red}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M${xd} 300V218" stroke="${INK.red}" stroke-width="${W.hair}" stroke-dasharray="3 3"/>
      <g class="cl-g">${gapMark(k, xp, xd, 226, 'c', { side: 1, size: 16 })}</g>
      ${k.text(C.cx, 444, C.note[0], { size: 13.5, fill: INK.graphite2, extra: 'class="cl-n"' })}${k.text(C.cx, 462, C.note[1], { size: 13.5, fill: INK.graphite2, extra: 'class="cl-n"' })}
    </g>`;
  }).join('') + `<path class="cl-sep" d="M204 100V470M396 100V470" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>`;
}
function clearancePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.cl-p .o'), { at: 0, stagger: .06, dur: .6 });
  k.ink(t, qa('.cl-p .h'), { at: .45, stagger: .04 });
  t.from(qa('.cl-rest, .cl-slug'), { opacity: 0, duration: .5 }, .5);
  k.stamp(t, qa('.cl-g'), { at: .9, stagger: .1 });
  t.from(qa('.cl-pan > text, .cl-sep'), { opacity: 0, duration: .4, stagger: .04 }, 1);
  const cracks = qa('.cl-cr');
  if (k.reduced()) { t.set(qa('.cl-pun'), { y: 16 }, 1.4).set(qa('.cl-slug'), { y: 16 }, 1.4); return t; }
  t.set(cracks, { opacity: 0 }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 2 });
  c.to(qa('.cl-pun, .cl-slug'), { y: 16, duration: .55, ease: 'power2.in' })                       // the punch bites in
    .set(cracks, { opacity: 1 });
  k.plot(c, cracks, { at: .55, stagger: 0, dur: .5 });                                             // break lines run from both edges
  c.to(qa('.cl-slug'), { y: 150, opacity: 0, duration: .7, ease: 'power2.in' }, 1.5)               // the slug goes
    .to(qa('.cl-pun'), { y: 0, duration: .9, ease: 'power2.inOut' }, 1.6)
    .to({}, { duration: 1.6 })
    .to(cracks, { opacity: 0, duration: .4 })
    .set(qa('.cl-slug'), { y: 0 }).to(qa('.cl-slug'), { opacity: 1, duration: .4 });
  return t;
}

/* ======================================================================================================
   punchVsBlank — slide L5·S13: the same cut, two answers. Punching keeps the sheet with the hole (the punched-out piece
   is discarded); blanking keeps the blank (the sheet left behind is discarded).
   ====================================================================================================== */
const PB_SHAPE = 'M-66 -30C-44 -46 4 -12 52 22C62 30 60 44 46 44C8 42 -40 22 -64 -6C-72 -15 -73 -25 -66 -30Z';
function punchVsBlankDraw(k) {
  const { INK, W } = k;
  const panel = (cx, keepSheet, title) => {
    const sx = cx - 100, sy = 170;
    const shp = `<path d="${PB_SHAPE}" transform="translate(${cx} 246)"`;
    return `<g class="pb-pan" data-k="${keepSheet ? 1 : 0}">
      ${k.text(cx, 132, title, { size: 21, weight: 700, spacing: 2, family: 'stencil' })}
      <g class="pb-sheet"><path d="${RP(sx, sy, 200, 150)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
        ${shp} fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
        <path class="pb-scrapS" d="${RP(sx, sy, 200, 150)}" fill="${k.hatch('lead')}" opacity="0"/></g>
      <g class="pb-piece">${shp} fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
        ${shp} class="pb-scrapP" fill="${k.hatch('lead')}" opacity="0"/></g>
      ${shp} class="pb-cut" fill="none" stroke="${INK.hot}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <g class="pb-keep" opacity="0">${keepSheet ? tag(k, cx + 52, 160, 'KEEP', INK.graphite) + tag(k, cx - 30, 512, 'DISCARDED', INK.red) : tag(k, cx + 52, 160, 'DISCARDED', INK.red) + tag(k, cx - 30, 512, 'KEEP', INK.graphite)}</g>
    </g>`;
  };
  return panel(160, true, 'PUNCHING') + panel(440, false, 'BLANKING') + `<path d="M300 110V540" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>`;
}
function tag(k, x, y, s, color) { return `<g><path d="${RP(x - s.length * 4.6 - 10, y - 16, s.length * 9.2 + 20, 24)}" fill="#fff" stroke="${color}" stroke-width="${k.W.thin}"/>${k.text(x, y + 1, s, { size: 14, weight: 700, fill: color, spacing: 1 })}</g>`; }
function punchVsBlankPlay(svg, k) {
  const { gsap, INK } = k; const [q, qa] = sel(svg);
  const pans = qa('.pb-pan'), cuts = qa('.pb-cut'), pieces = qa('.pb-piece');
  const t = k.tl();
  t.from(qa('.pb-pan > text'), { opacity: 0, y: -8, duration: .5, stagger: .1 }, 0);
  t.from(qa('.pb-sheet, .pb-piece'), { opacity: 0, duration: .6, stagger: .08 }, .2);
  const fin = (tl, at) => {
    pans.forEach(p => { const keepSheet = p.dataset.k === '1'; tl.to(p.querySelector(keepSheet ? '.pb-scrapP' : '.pb-scrapS'), { opacity: 1, duration: .4 }, at).to(p.querySelector('.pb-keep'), { opacity: 1, duration: .4 }, at + .2); });
  };
  if (k.reduced()) { t.set(pieces, { y: 200 }, 1).set(cuts, { opacity: 0 }, 1); fin(t, 1); return t; }
  t.set(cuts, { opacity: 0 }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 1.4 });
  c.set(cuts, { opacity: 1 });
  k.plot(c, cuts, { at: 0, stagger: 0, dur: 1 });                                                // the same cut line in both
  c.to(pieces, { y: 200, duration: 1, ease: 'power2.inOut' }, 1.2).to(cuts, { opacity: 0, duration: .3 }, 1.2); // the piece comes out
  fin(c, 2.2);
  c.to(qa('.pb-keep, .pb-scrapS, .pb-scrapP'), { opacity: 0, duration: .4 }, 5)
    .to(pieces, { y: 0, duration: .8, ease: 'power2.inOut' }, 5.2).to({}, { duration: .6 }, 6);
  return t;
}

/* ======================================================================================================
   fineBlank — slide L5·S14: the guide plate's impingement ring bites the sheet (holding force), the punch comes down
   while an ejector pushes back up from below, directly opposite (counterforce); the blank is pushed out and back.
   Detail A: the edge it leaves — smooth and flat, against a conventional blanked edge.
   ====================================================================================================== */
function fineBlankDraw(k) {
  const { INK, W } = k; const ax = 300, sy = 236, T = 16;
  const guide = side => { const x0 = side < 0 ? 70 : ax + 62, x1 = side < 0 ? ax - 62 : 530, vx = side < 0 ? ax - 92 : ax + 92; return `M${x0} 186H${x1}V${sy}H${vx + 7}L${vx} ${sy + 8}L${vx - 7} ${sy}H${x0}Z`; };
  const det = (cx, fine) => {
    const id = `fineBlank-d${fine ? 1 : 0}`, cy = 482, top = cy - 30, bot = cy + 30, ex = cx + 6;
    const edge = fine ? `M${cx - 70} ${top}H${ex - 7}Q${ex} ${top} ${ex} ${top + 6}V${bot}L${ex + 2} ${bot + 3}L${ex - 1} ${bot}H${cx - 70}Z` : `M${cx - 70} ${top}H${ex - 14}Q${ex} ${top} ${ex} ${top + 14}V${top + 26}L${ex + 4} ${top + 34}L${ex + 2} ${top + 40}L${ex + 7} ${top + 46}L${ex + 5} ${top + 52}L${ex + 10} ${bot}L${ex + 13} ${bot + 9}L${ex + 6} ${bot}H${cx - 70}Z`;
    const marks = fine ? Array.from({ length: 7 }, (_, i) => `M${ex - 1} ${top + 8 + i * 7.5}h-7`).join('') : `M${ex - 1} ${top + 17}h-6M${ex - 1} ${top + 22}h-6`;
    return `<g class="fb-det"><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="52"/></clipPath>
      <g clip-path="url(#${id})"><rect x="${cx - 60}" y="${cy - 60}" width="1" height="1" fill="#fff"/><path d="${edge}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/><path d="${marks}" stroke="${INK.graphite2}" stroke-width="${W.hair}"/></g>
      <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
      ${k.text(cx, cy + 70, fine ? 'FINE BLANKED' : 'CONVENTIONAL', { size: 13, weight: 700, fill: fine ? INK.graphite : INK.graphite2 })}
      ${k.text(cx + 62, cy - 30, fine ? 'smooth, flat' : 'burr', { size: 12, fill: fine ? INK.red : INK.graphite2, anchor: 'start' })}</g>`;
  };
  return `
  <g class="fb-ax">${k.center(ax, 40, ax, 400)}</g>
  ${pt(k, `M70 ${sy + T}H${ax - 61}V360H70Z`, { cls: 'fb-p', mat: 'steel' })}${pt(k, `M530 ${sy + T}H${ax + 61}V360H530Z`, { cls: 'fb-p', mat: 'steel' })}
  <g class="fb-ej">${pt(k, RP(ax - 59, sy + T, 118, 76), { cls: 'fb-p', mat: 'bronze' })}${k.arrow(ax, 394, ax, 352, { w: 6 })}${k.text(ax + 12, 386, 'COUNTERFORCE', { size: 12, weight: 700, fill: INK.hot, anchor: 'start' })}</g>
  <path class="fb-sh" d="${RP(50, sy, ax - 60 - 50, T)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/><path class="fb-sh" d="${RP(ax + 60, sy, 490 - ax, T)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="fb-bl"><path d="${RP(ax - 60, sy, 120, T)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
  <g class="fb-gd">${pt(k, guide(-1), { cls: 'fb-p', mat: 'iron' })}${pt(k, guide(1), { cls: 'fb-p', mat: 'iron' })}
    ${k.arrow(120, 140, 120, 180, { w: 5 })}${k.arrow(480, 140, 480, 180, { w: 5 })}${k.text(132, 158, 'HOLDING FORCE', { size: 12, weight: 700, fill: INK.hot, anchor: 'start' })}</g>
  <g class="fb-pun">${pt(k, RP(ax - 60, 74, 120, sy - 74), { cls: 'fb-p', mat: 'steel' })}${k.arrow(ax, 26, ax, 68, { w: 6 })}${k.text(ax + 12, 46, 'BLANKING FORCE', { size: 12, weight: 700, fill: INK.hot, anchor: 'start' })}</g>
  <g class="fb-call"><circle cx="${ax + 61}" cy="${sy + T / 2}" r="15" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-dasharray="4 3"/>${k.text(ax + 84, sy + T / 2 + 30, 'A', { size: 15, weight: 700 })}</g>
  ${det(190, false)}${det(410, true)}
  ${k.text(300, 430, 'DETAIL A', { size: 12, weight: 700, fill: INK.graphite2, spacing: 1, extra: 'class="fb-dl"' })}`;
}
function fineBlankPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const gd = q('.fb-gd'), pun = q('.fb-pun'), ej = q('.fb-ej'), bl = q('.fb-bl');
  const t = k.tl();
  k.plot(t, qa('.fb-p .o'), { at: 0, stagger: .06, dur: .6 });
  k.ink(t, qa('.fb-p .h'), { at: .5, stagger: .05 });
  k.plot(t, qa('.fb-ax line'), { at: .1, dur: .8 });
  t.from(qa('.fb-sh, .fb-bl'), { opacity: 0, duration: .5 }, .6);
  t.from(qa('.fb-gd > line, .fb-pun > line, .fb-ej > line, .fb-gd > text, .fb-pun > text, .fb-ej > text'), { opacity: 0, duration: .4 }, 1);
  k.stamp(t, qa('.fb-call, .fb-det'), { at: 1.2, stagger: .15 });
  t.from(q('.fb-dl'), { opacity: 0, duration: .4 }, 1.5);
  if (k.reduced()) { t.set([pun, bl, ej], { y: 18 }, 1.6); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 2 });
  c.set(gd, { y: -14 }).set(pun, { y: -26 })
    .to(gd, { y: 0, duration: .5, ease: 'power2.in' })                                            // the V-ring bites, the sheet is held
    .to(pun, { y: 0, duration: .5, ease: 'power2.inOut' })
    .to([pun, bl, ej], { y: 18, duration: 1.3, ease: 'sine.inOut' })                             // punch down, ejector pushing back: slow, squeezed
    .to({}, { duration: .3 })
    .to(pun, { y: -26, duration: .9, ease: 'power2.inOut' })
    .to([bl, ej], { y: 0, duration: .9, ease: 'power2.inOut' }, '<')                              // the ejector pushes the blank back
    .to(gd, { y: -14, duration: .4, ease: 'power2.inOut' })
    .to(bl, { y: -54, opacity: 0, duration: .6, ease: 'power2.in' })                             // part out
    .to(qa('.fb-det'), { scale: 1.06, transformOrigin: '50% 50%', duration: .3, yoyo: true, repeat: 1, stagger: .15 }, '<')
    .set(bl, { y: 0 }).to(bl, { opacity: 1, duration: .4 }).to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   cutOps — slide L5·S12 as a reference sheet of fourteen samples, numbered like specimens: what each operation leaves
   in the sheet. A red frame moves from sample to sample and its cut is plotted again.
   ====================================================================================================== */
function cutOpsSamples(k) {
  const { INK, W } = k;
  const sh = (d = RP(-40, -28, 80, 56)) => `<path d="${d}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>`;
  const cut = (d, extra = '') => `<path class="co-cut" d="${d}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round" ${extra}/>`;
  const hole = d => `<path d="${d}" fill="#fff"/>` + cut(d);
  const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const gear = (r1, r2, n) => 'M' + Array.from({ length: n * 4 }, (_, i) => { const a = (i / (n * 4)) * 2 * Math.PI, r = (i % 4 < 2) ? r1 : r2; return `${f1(r * Math.cos(a))} ${f1(r * Math.sin(a))}`; }).join('L') + 'Z';
  let perf = ''; for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) perf += circ(-30 + i * 10, -20 + j * 10, 2.8);
  const slots = [-14, 2, 18].map(y => [-20, 12].map(x => `M${x - 10} ${y - 4}h20a4 4 0 0 1 0 8h-20a4 4 0 0 1 0 -8Z`).join('')).join('');
  return [
    ['PUNCHING', sh() + hole(circ(0, 0, 15))],
    ['BLANKING', `<path d="${RP(-40, -28, 80, 56)}" fill="none" ${k.stroke.construct} stroke-dasharray="4 3"/><path d="${circ(0, 0, 21)}" fill="${INK.ice}"/>` + cut(circ(0, 0, 21), `stroke-width="${W.thick}"`)],
    ['FINE BLANKING', `<path d="${gear(25, 20, 10)}" fill="${INK.ice}"/>` + cut(gear(25, 20, 10), `stroke-width="${W.thick}"`) + `<circle r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`],
    ['NOTCHING', sh('M-40 -28H-8L0 -14L8 -28H40V-8H26V8H40V28H-40Z') + cut('M-8 -28L0 -14L8 -28M40 -8H26V8H40')],
    ['PERFORATING', sh() + hole(perf)],
    ['SLOTTING', sh() + hole(slots)],
    ['SLITTING', [-28, -8.5, 11].map(y => `<path d="${RP(-40, y, 80, 17)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`).join('') + cut('M-40 -10.5H40M-40 9H40', `stroke="${INK.graphite}"`)],
    ['LANCING', sh() + [-22, 0, 22].map(x => `<path d="M${x - 7} -16V16" stroke="${INK.graphite2}" stroke-width="${W.hair}" stroke-dasharray="3 2"/><path d="${RP(x - 7, -16, 11, 32)}" fill="#fff" opacity=".55"/>`).join('') + cut([-22, 0, 22].map(x => `M${x - 7} -16H${x + 6}V16H${x - 7}`).join(''))],
    ['PARTING', `<path d="M-44 -18H-8Q-15 0 -8 18H-44Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/><path d="M44 -18H8Q15 0 8 18H44Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/><path d="M-8 -18H8Q15 0 8 18H-8Q-15 0 -8 -18Z" fill="${k.hatch('lead')}"/>` + cut('M-8 -18Q-15 0 -8 18M8 -18Q15 0 8 18')],
    ['CUTOFF', `<path d="${RP(-44, -18, 88, 36)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>` + cut('M-14 -18Q-2 0 -14 18M16 -18Q28 0 16 18')],
    ['SHAVING', sh() + `<path d="${circ(0, 0, 19)}" fill="${INK.red}" opacity=".3"/><path d="${circ(0, 0, 16)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>` + cut(circ(0, 0, 19))],
    ['TRIMMING', `<path d="M-30 -14V18H30V-14" fill="none" stroke="${INK.graphite}" stroke-width="7.6" stroke-linejoin="round"/><path d="M-30 -14V18H30V-14" fill="none" stroke="${INK.ice}" stroke-width="5" stroke-linejoin="round"/><path d="M-46 -26H-36M36 -26H46" stroke="${INK.graphite}" stroke-width="5.6"/><path d="M-46 -26H-36M36 -26H46" stroke="${INK.ice}" stroke-width="3.2"/>` + cut('M-33 -21V-8M33 -21V-8')],
    ['EMBOSSING', cut('M-42 8H-26C-22 8 -22 -8 -16 -8H-8C-2 -8 -2 8 2 8H8C12 8 12 -8 18 -8H26C32 -8 32 8 36 8H42', `stroke="${INK.ice}" stroke-width="6"`) + cut('M-42 5H-26C-22 5 -22 -11 -16 -11H-8C-2 -11 -2 5 2 5H8C12 5 12 -11 18 -11H26C32 -11 32 5 36 5H42M-42 11H-26C-22 11 -22 -5 -16 -5H-8C-2 -5 -2 11 2 11H8C12 11 12 -5 18 -5H26C32 -5 32 11 36 11H42', `stroke-width="${W.thin}"`)],
    ['COINING', `<path d="M-40 -9H40V9H-40Z" fill="${INK.ice}"/>` + cut('M-40 -9H-26V-13H-20V-9H-6V-14H6V-9H20V-13H26V-9H40V9H30V12H22V9H4V13H-4V9H-22V12H-30V9H-40Z', `stroke-width="${W.med}"`)]
  ];
}
function cutOpsDraw(k) {
  const { INK, W } = k; const S = cutOpsSamples(k);
  const cell = (i, [name, art]) => {
    const cx = 40 + (i % 4) * 130 + 65, cy = 40 + Math.floor(i / 4) * 130 + 58;
    return `<g class="co-c" data-i="${i}"><path class="co-f" d="${RP(cx - 61, cy - 54, 122, 122)}" fill="none" stroke="${INK.graphite3}" stroke-width="${W.hair}"/>
      ${k.text(cx - 54, cy - 39, String(i + 1).padStart(2, '0'), { size: 11, weight: 700, fill: INK.graphite3, anchor: 'start' })}
      <g class="co-art" transform="translate(${cx} ${cy})">${art}</g>
      ${k.text(cx, cy + 56, name, { size: 12.5, weight: 700, spacing: .4 })}</g>`;
  };
  return S.map((s, i) => cell(i, s)).join('') + `
  <g class="co-tb"><path d="${RP(304, 434, 252, 122)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/><path d="M304 488H556M430 488V556" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    ${k.text(318, 468, 'CUTTING OPERATIONS', { size: 19, weight: 700, anchor: 'start', spacing: 1 })}
    ${k.text(318, 512, 'SHEET', { size: 10, fill: INK.graphite3, anchor: 'start', weight: 600 })}${k.text(318, 538, 'L5 · S12', { size: 17, weight: 700, anchor: 'start' })}
    ${k.text(444, 512, 'SAMPLES', { size: 10, fill: INK.graphite3, anchor: 'start', weight: 600 })}${k.text(444, 541, '14', { size: 26, family: 'display', weight: 800, anchor: 'start' })}</g>
  <g class="co-hl" transform="translate(105 98)"><path d="M-61 -34V-54H-41M41 -54H61V-34M61 48V68H41M-41 68H-61V48" fill="none" stroke="${INK.red}" stroke-width="${W.med + .4}"/></g>`;
}
function cutOpsPlay(svg, k) {
  const { gsap, INK } = k; const [q, qa] = sel(svg);
  const cells = qa('.co-c'), hl = q('.co-hl');
  const t = k.tl();
  t.from(qa('.co-f'), { opacity: 0, duration: .4, stagger: .03 }, 0);
  t.from(qa('.co-art'), { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: .5, stagger: .05, ease: 'back.out(1.8)' }, .2);
  t.from(qa('.co-c > text'), { opacity: 0, duration: .3, stagger: .02 }, .6);
  t.from(q('.co-tb'), { opacity: 0, y: 8, duration: .5 }, 1);
  t.from(hl, { opacity: 0, duration: .4 }, 1.3);
  if (k.reduced()) return t;
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  cells.forEach((cel, i) => {
    const cx = 40 + (i % 4) * 130 + 65, cy = 40 + Math.floor(i / 4) * 130 + 58, at = i * 1.15;
    const cuts = [...cel.querySelectorAll('.co-cut')];
    c.to(hl, { x: cx, y: cy, duration: .45, ease: 'power3.inOut' }, at);
    cuts.forEach(cu => {
      let L = 200; try { L = Math.ceil(cu.getTotalLength()) + 2; } catch (e) { }
      const orig = cu.getAttribute('stroke');
      c.fromTo(cu, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L, stroke: INK.hot }, { strokeDashoffset: 0, duration: .55, ease: 'power2.inOut', immediateRender: false }, at + .35)
        .to(cu, { stroke: orig, duration: .3, onComplete: () => { cu.style.strokeDasharray = ''; cu.style.strokeDashoffset = ''; } }, at + .95);
    });
  });
  c.to({}, { duration: .4 }, cells.length * 1.15);
  return t;
}

/* ======================================================================================================
   perforating — notching (a bite out of the edge), perforating (many holes in one hit), slotting (rectangular holes):
   each punch strokes in elevation and its result appears in the plan below, tied by projection lines.
   ====================================================================================================== */
function perforatingDraw(k) {
  const { INK, W } = k;
  const col = (cx, i) => {
    let punch = '', plan = '', die = '', proj = '';
    if (i === 0) { punch = pt(k, RP(cx + 22, 104, 36, 134), { cls: 'pf-p', mat: 'steel' }); die = pt(k, `M${cx - 62} 262H${cx + 20}V302H${cx - 62}Z`, { cls: 'pf-p', mat: 'steel' }); plan = `<path class="pf-r" d="${RP(cx + 22, 376, 18, 38)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`; proj = `M${cx + 22} 270V376M${cx + 40} 270V376`; }
    if (i === 1) { punch = [-50, -30, -10, 10, 30, 50].map(x => pt(k, RP(cx + x - 4, 104, 8, 134), { cls: 'pf-p', mat: '' })).join(''); die = pt(k, RP(cx - 62, 262, 124, 40), { cls: 'pf-p', mat: 'steel' }); let h = ''; for (let a = 0; a < 6; a++) for (let b = 0; b < 5; b++) h += `M${cx - 54 + a * 20} ${352 + b * 22}a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z`; plan = `<path class="pf-r" d="${h}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`; proj = `M${cx - 50} 270V346M${cx + 50} 270V346`; }
    if (i === 2) { punch = pt(k, RP(cx - 22, 104, 44, 134), { cls: 'pf-p', mat: 'steel' }); die = pt(k, `M${cx - 62} 262H${cx - 24}V302H${cx - 62}ZM${cx + 24} 262H${cx + 62}V302H${cx + 24}Z`, { cls: 'pf-p', mat: 'steel' }); plan = `<path class="pf-r" d="${[356, 390, 424].map(y => `M${cx - 16} ${y}h32a6 6 0 0 1 0 12h-32a6 6 0 0 1 0 -12Z`).join('')}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`; proj = `M${cx - 22} 270V350M${cx + 22} 270V350`; }
    const sheetW = i === 0 ? [cx - 62, cx + 40] : [cx - 62, cx + 62];
    return `<g class="pf-col" data-i="${i}">
      <path d="${proj}" fill="none" ${k.stroke.construct} stroke-dasharray="4 4" class="pf-pj"/>
      ${die}
      <path class="pf-sh" d="${RP(sheetW[0], 252, sheetW[1] - sheetW[0], 10)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      <g class="pf-pun">${pt(k, RP(cx - 62, 80, 124, 24), { cls: 'pf-p', mat: 'iron' })}${punch}</g>
      <path class="pf-sh" d="${RP(sheetW[0], 334, sheetW[1] - sheetW[0], 116)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      <g class="pf-res">${plan}</g>
      ${k.text(cx, 488, ['NOTCHING', 'PERFORATING', 'SLOTTING'][i], { size: 16, weight: 700, spacing: 1 })}
      ${k.text(cx, 507, ['a bite out of the edge', 'many holes, one hit', 'rectangular holes'][i], { size: 12.5, fill: INK.graphite2 })}
    </g>`;
  };
  return [110, 300, 490].map(col).join('') + `${k.text(44, 326, 'PLAN', { size: 11, weight: 700, fill: INK.graphite3, anchor: 'start', spacing: 1 })}`;
}
function perforatingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const pun = qa('.pf-pun'), res = qa('.pf-res');
  const t = k.tl();
  k.plot(t, qa('.pf-p .o'), { at: 0, stagger: .03, dur: .5 });
  k.ink(t, qa('.pf-p .h'), { at: .4, stagger: .04 });
  t.from(qa('.pf-sh'), { opacity: 0, duration: .5, stagger: .05 }, .5);
  k.plot(t, qa('.pf-pj'), { at: .9, stagger: .1, dur: .5 });
  t.from(qa('.pf-col > text'), { opacity: 0, duration: .4, stagger: .05 }, 1);
  if (k.reduced()) return t;
  t.set(res, { opacity: 0 }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  pun.forEach((p, i) => {
    const at = i * 1.5;
    c.to(p, { y: 30, duration: .45, ease: 'power2.in' }, at)
      .fromTo(res[i], { opacity: 0, scale: .85, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, at + .45)
      .to(p, { y: 0, duration: .8, ease: 'power2.inOut' }, at + .6);
  });
  c.to(res, { opacity: 0, duration: .5 }, 6).to({}, { duration: .5 }, 6.5);
  return t;
}

/* ======================================================================================================
   lancing — two operations that remove nothing. Lancing: a partial cut, the tab bent down (a louver), seen in section and
   in plan. Slitting: two rotary knives cut the moving sheet along a straight line — no scrap.
   ====================================================================================================== */
function lancingDraw(k) {
  const { INK, W } = k;
  const knife = (cx, cy, cls) => `<g class="${cls}"><circle cx="${cx}" cy="${cy}" r="56" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>
    <g class="ln-spk" data-c="${cx} ${cy}">${[0, 60, 120].map(a => `<path d="M${f1(cx + 13 * Math.cos(a * D2R))} ${f1(cy + 13 * Math.sin(a * D2R))}L${f1(cx + 40 * Math.cos(a * D2R))} ${f1(cy + 40 * Math.sin(a * D2R))}M${f1(cx - 13 * Math.cos(a * D2R))} ${f1(cy - 13 * Math.sin(a * D2R))}L${f1(cx - 40 * Math.cos(a * D2R))} ${f1(cy - 40 * Math.sin(a * D2R))}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="12" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>`;
  const ticks = Array.from({ length: 12 }, (_, i) => `M${330 + i * 22} 205v6`).join('');
  const ticksP = Array.from({ length: 12 }, (_, i) => `M${330 + i * 22} 360v8M${330 + i * 22} 430v8`).join('');
  return `
  ${k.text(160, 70, 'LANCING', { size: 21, family: 'stencil', weight: 800, spacing: 2 })}
  ${k.text(440, 70, 'SLITTING', { size: 21, family: 'stencil', weight: 800, spacing: 2 })}
  <path d="M300 54V530" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>
  <!-- lancing, section -->
  ${pt(k, `M60 216H140V236H206V216H264V262H60Z`, { cls: 'ln-p', mat: 'steel' })}
  <path class="ln-s" d="M60 206H140V216H60Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/><path class="ln-s" d="M200 206H264V216H200Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="ln-tab"><path d="M140 206H200V216H140Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
  <g class="ln-pun">${pt(k, `M138 96H204V204L138 194Z`, { cls: 'ln-p', mat: 'steel' })}</g>
  <!-- lancing, plan -->
  <path class="ln-s" d="${RP(70, 330, 184, 120)}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="ln-tabP"><path d="${RP(132, 362, 70, 56)}" fill="${INK.ice}" stroke="none"/><path d="${RP(132, 362, 70, 56)}" fill="${k.hatch('lead')}" opacity=".35"/></g>
  <path class="ln-open" d="${RP(195, 362, 7, 56)}" fill="#fff" opacity="0"/>
  <path class="ln-cut" d="M132 362H202V418H132" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
  <path d="M132 356V424" stroke="${INK.graphite2}" stroke-width="${W.thin}" stroke-dasharray="6 3 2 3"/>
  ${k.text(160, 488, 'partial cut, bent into a tab', { size: 12.5, fill: INK.graphite2 })}${k.text(160, 508, 'NO MATERIAL REMOVED', { size: 14, weight: 700, fill: INK.red })}
  <!-- slitting, side view -->
  ${knife(440, 147, 'ln-k1')}
  <path class="ln-s" d="M326 202H554V214H326Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="ln-tk"><path d="${ticks}" stroke="${INK.graphite2}" stroke-width="${W.thin}"/></g>
  ${knife(440, 269, 'ln-k2')}
  <!-- slitting, plan -->
  <path class="ln-s" d="M326 350H440L554 346V397.5H440H326Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <path class="ln-s" d="M326 402.5H440H554V454L440 450H326Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="ln-tkp"><path d="${ticksP}" stroke="${INK.graphite2}" stroke-width="${W.thin}"/></g>
  ${pt(k, RP(382, 397, 116, 6), { cls: 'ln-p', mat: 'steel' })}
  <path d="M326 400H440" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4" opacity=".8"/>
  ${k.arrow(500, 476, 548, 476, { w: 4 })}
  ${k.text(440, 488, 'straight cuts', { size: 12.5, fill: INK.graphite2 })}${k.text(440, 508, 'NO SCRAP', { size: 14, weight: 700, fill: INK.red })}`;
}
function lancingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.ln-p .o, .ln-k1 circle, .ln-k2 circle'), { at: 0, stagger: .05, dur: .6 });
  k.ink(t, qa('.ln-p .h'), { at: .4, stagger: .05 });
  t.from(qa('.ln-s, .ln-tab, .ln-tabP, .ln-spk'), { opacity: 0, duration: .5, stagger: .03 }, .5);
  k.plot(t, q('.ln-cut'), { at: .9, dur: .6 });
  if (k.reduced()) { t.set(q('.ln-tab'), { rotation: 28, svgOrigin: '140 211' }, 1).set(q('.ln-tabP'), { scaleX: .88, svgOrigin: '132 390' }, 1).set(q('.ln-open'), { opacity: 1 }, 1); return t; }
  // the knives turn and pull the sheet through
  qa('.ln-spk').forEach((s, i) => gsap.to(s, { rotation: i ? 360 : -360, svgOrigin: s.dataset.c, duration: 4, ease: 'none', repeat: -1 }));
  gsap.fromTo(qa('.ln-tk path, .ln-tkp path'), { x: 0 }, { x: 22, duration: 1.1, ease: 'none', repeat: -1 });
  // lance: punch down, the tab bends down about its uncut edge; it stays bent
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  c.to(q('.ln-pun'), { y: 24, duration: .6, ease: 'power2.in' })
    .to(q('.ln-tab'), { rotation: 28, svgOrigin: '140 211', duration: .6, ease: 'power2.in' }, 0)
    .to(q('.ln-tabP'), { scaleX: .88, svgOrigin: '132 390', duration: .6, ease: 'power2.in' }, 0).to(q('.ln-open'), { opacity: 1, duration: .3 }, .3)
    .to(q('.ln-pun'), { y: 0, duration: .9, ease: 'power2.inOut' }, .8)
    .to({}, { duration: 1.6 })
    .to([q('.ln-tab'), q('.ln-tabP'), q('.ln-open')], { opacity: 0, duration: .4 })
    .set(q('.ln-tab'), { rotation: 0, svgOrigin: '140 211' }).set(q('.ln-tabP'), { scaleX: 1, svgOrigin: '132 390' }).set(q('.ln-open'), { opacity: 0 })
    .to([q('.ln-tab'), q('.ln-tabP')], { opacity: 1, duration: .4 }).to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   cutoffParting — two strips in plan, slide L5·S18. Cutoff: one cut line per stroke separates part from part, no scrap.
   Parting: a punch with two cutting edges takes out a piece between the parts — that piece is scrap.
   ====================================================================================================== */
const CP = { xs: [168, 300, 432], top: [150, 236], bot: [356, 442] };
function cutoffPartingDraw(k) {
  const { INK, W } = k; const [t0, t1] = CP.top, [b0, b1] = CP.bot, xs = CP.xs, mid = (t0 + t1) / 2, midB = (b0 + b1) / 2;
  const cutL = x => `M${x} ${t0}Q${x + 44} ${mid} ${x} ${t1}`;
  const edges = [40, ...xs, 560];
  const partsT = edges.slice(0, -1).map((a, i) => { const b = edges[i + 1]; const left = i === 0 ? `L${a} ${t1}L${a} ${t0}` : `L${a} ${t1}Q${a + 44} ${mid} ${a} ${t0}`; const right = i === edges.length - 2 ? `L${b} ${t0}L${b} ${t1}` : `L${b} ${t0}Q${b + 44} ${mid} ${b} ${t1}`; return `<path class="cp-pt" data-i="${i}" d="M${a} ${t0}${right.replace(/^L[^L]*/, m => m)}${left}Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-linejoin="round"/>`; });
  const g = 14, bulge = 22;
  const partsB = edges.slice(0, -1).map((a, i) => {
    const b = edges[i + 1], A = i === 0 ? a : a + g, B = i === edges.length - 2 ? b : b - g;
    const rightEnd = i === edges.length - 2 ? `L${B} ${b1}` : `Q${B + bulge} ${midB} ${B} ${b1}`, leftEnd = i === 0 ? `L${A} ${b0}` : `Q${A - bulge} ${midB} ${A} ${b0}`;
    return `<path class="cp-pb" data-i="${i}" d="M${A} ${b0}L${B} ${b0}${rightEnd}L${A} ${b1}${leftEnd}Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-linejoin="round"/>`;
  });
  const scraps = xs.map(x => `<g class="cp-sc"><path d="M${x - g} ${b0}H${x + g}Q${x + g - bulge} ${midB} ${x + g} ${b1}H${x - g}Q${x - g + bulge} ${midB} ${x - g} ${b0}Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/><path d="M${x - g} ${b0}H${x + g}Q${x + g - bulge} ${midB} ${x + g} ${b1}H${x - g}Q${x - g + bulge} ${midB} ${x - g} ${b0}Z" fill="${k.hatch('lead')}"/></g>`).join('');
  const cutsB = xs.map(x => `<path class="cp-cb" d="M${x - g} ${b0}Q${x - g + bulge} ${midB} ${x - g} ${b1}M${x + g} ${b0}Q${x + g - bulge} ${midB} ${x + g} ${b1}" fill="none" stroke="${INK.hot}" stroke-width="${W.thick}"/>`).join('');
  return `
  ${k.text(40, 128, 'CUTOFF', { size: 21, family: 'stencil', weight: 800, spacing: 2, anchor: 'start' })}${k.text(560, 128, 'one cut line · no scrap', { size: 13.5, fill: INK.graphite2, anchor: 'end' })}
  ${partsT.join('')}
  ${xs.map(x => `<path class="cp-ct" d="${cutL(x)}" fill="none" stroke="${INK.hot}" stroke-width="${W.thick}"/>`).join('')}
  ${k.text(40, 334, 'PARTING', { size: 21, family: 'stencil', weight: 800, spacing: 2, anchor: 'start' })}${k.text(560, 334, 'two cutting edges · scrap between', { size: 13.5, fill: INK.graphite2, anchor: 'end' })}
  ${partsB.join('')}${scraps}${cutsB}
  <g class="cp-tag">${k.leader(xs[2], b1 + 40, 470, 530, 'SCRAP', { size: 15, weight: 700, color: INK.red })}</g>
  <path d="M40 290H560" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>`;
}
function cutoffPartingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const ct = qa('.cp-ct'), cb = qa('.cp-cb'), pt_ = qa('.cp-pt'), pb = qa('.cp-pb'), sc = qa('.cp-sc');
  const t = k.tl();
  t.from(qa('svg > text, text'), { opacity: 0, duration: .4, stagger: .05 }, 0);
  t.from([...pt_, ...pb, ...sc], { opacity: 0, duration: .5, stagger: .03 }, .2);
  if (k.reduced()) { t.set(pt_, { x: i => i * 8 }, 1).set(pb, { x: i => i * 8 }, 1).set(sc, { y: 60, opacity: 0 }, 1).set([...ct, ...cb], { opacity: 0 }, 1); return t; }
  t.set([...ct, ...cb, q('.cp-tag')], { opacity: 0 }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 1.4 });
  [0, 1, 2].forEach(i => {                                                                     // one stroke at a time, left to right
    const at = i * 1.1;
    c.set([ct[i], cb[i]], { opacity: 1 }, at);
    k.plot(c, [ct[i], cb[i]], { at, stagger: 0, dur: .45 });
    c.to(sc[i], { y: 90, opacity: 0, duration: .6, ease: 'power2.in' }, at + .55)              // parting: the piece between drops out
      .to(q('.cp-tag'), { opacity: 1, duration: .3 }, at + .5);
  });
  c.to([...ct, ...cb], { opacity: 0, duration: .4 }, 3.4)
    .to(pt_, { x: i => i * 9, duration: .7, ease: 'power2.inOut' }, 3.4)                        // the parts come apart
    .to(pb, { x: i => i * 9, duration: .7, ease: 'power2.inOut' }, 3.4)
    .to({}, { duration: 1.5 }, 4.1)
    .to([...pt_, ...pb], { x: 0, duration: .6, ease: 'power2.inOut' }, 5.6).to(q('.cp-tag'), { opacity: 0, duration: .3 }, 5.6)
    .set(sc, { y: 0 }, 6.2).to(sc, { opacity: 1, duration: .4 }, 6.2).to({}, { duration: .4 }, 6.6);
  return t;
}

/* ======================================================================================================
   trimShave — cleaning up an edge. Trimming: the flange is punched off a drawn cup (scrap ring). Shaving: a small die
   clearance shears a hair off the edge for accuracy and finish — tolerances of ±0.025 mm.
   ====================================================================================================== */
function trimShaveDraw(k) {
  const { INK, W } = k;
  const cup = 'M110 200V318Q110 330 122 330H198Q210 330 210 318V200';
  return `
  ${k.text(160, 70, 'TRIMMING', { size: 21, family: 'stencil', weight: 800, spacing: 2 })}${k.text(440, 70, 'SHAVING', { size: 21, family: 'stencil', weight: 800, spacing: 2 })}
  <path d="M300 54V530" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>
  <!-- trimming: the cup on its die, the trim steels come down outside the wall -->
  ${pt(k, `M116 206H204V324Q204 326 202 326H118Q116 326 116 324Z`, { cls: 'ts-p', mat: 'steel' })}
  ${pt(k, RP(70, 330, 180, 26), { cls: 'ts-p', mat: 'iron' })}
  ${sheet(k, cup, 8, 'ts-cup')}
  <g class="ts-fl">${sheet(k, 'M54 196H106', 8, 'ts-f1')}${sheet(k, 'M214 196H266', 8, 'ts-f2')}</g>
  <g class="ts-tr">${pt(k, RP(52, 120, 54, 70), { cls: 'ts-p', mat: 'steel' })}${pt(k, RP(214, 120, 54, 70), { cls: 'ts-p', mat: 'steel' })}${k.arrow(160, 96, 160, 140, { w: 5 })}</g>
  <g class="ts-sc" opacity="0">${k.leader(76, 240, 74, 300, 'SCRAP', { size: 13, weight: 700, color: INK.red })}</g>
  ${k.text(160, 488, 'the flange off a drawn cup', { size: 12.5, fill: INK.graphite2 })}
  <!-- shaving: a thick edge in close-up -->
  ${pt(k, RP(330, 330, 116, 46), { cls: 'ts-p', mat: 'steel' })}
  <path class="ts-part" d="M330 236H440L444 248L441 262L446 276L442 292L446 306L443 320L446 330H330Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
  <path class="ts-clean" d="M330 236H440V330H330Z" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" opacity="0"/>
  <g class="ts-chip" opacity="0"><path d="M440 330C452 318 456 296 450 276C446 262 452 246 462 240" fill="none" stroke="${INK.hot}" stroke-width="4" stroke-linecap="round"/></g>
  <g class="ts-sh">${pt(k, RP(441, 120, 58, 106), { cls: 'ts-p', mat: 'steel' })}${k.arrow(470, 70, 470, 112, { w: 5 })}</g>
  <path d="M440 226V420" stroke="${INK.red}" stroke-width="${W.hair}" stroke-dasharray="4 3"/>
  <g class="ts-dim">${k.dim(330, 380, 440, 380, 'L ±0.025 mm', { off: 40, color: INK.red, size: 14 })}</g>
  ${k.text(440, 488, 'a hair off the edge: accuracy and finish', { size: 12.5, fill: INK.graphite2 })}`;
}
function trimShavePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const tr = q('.ts-tr'), fl = qa('.ts-fl > path'), sh = q('.ts-sh');
  const t = k.tl();
  t.from(qa('text'), { opacity: 0, duration: .4, stagger: .04 }, 0);
  k.plot(t, qa('.ts-p .o'), { at: .1, stagger: .06, dur: .6 });
  k.ink(t, qa('.ts-p .h'), { at: .5, stagger: .05 });
  k.plot(t, qa('.ts-cup, .ts-f1, .ts-f2'), { at: .5, stagger: 0, dur: .6 });
  t.from(qa('.ts-part, .ts-dim'), { opacity: 0, duration: .5 }, .7);
  if (k.reduced()) { t.set(tr, { y: 10 }, 1).set(q('.ts-fl'), { y: 80, opacity: 0 }, 1).set(q('.ts-sc'), { opacity: 1 }, 1).set(q('.ts-clean'), { opacity: 1 }, 1).set(q('.ts-part'), { opacity: 0 }, 1); return t; }
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  c.to(tr, { y: 10, duration: .45, ease: 'power2.in' })                                        // the trim steels cut the flange off
    .to(q('.ts-fl'), { y: 90, opacity: 0, duration: .8, ease: 'power2.in' }, .5).to(q('.ts-sc'), { opacity: 1, duration: .3 }, .5)
    .to(tr, { y: 0, duration: .8, ease: 'power2.inOut' }, .6)
    .to(sh, { y: 112, duration: 1, ease: 'sine.inOut' }, 1.7)                                   // the shaving punch runs down the edge
    .to(q('.ts-part'), { opacity: 0, duration: .4 }, 2.2).to(q('.ts-clean'), { opacity: 1, duration: .4 }, 2.2)
    .fromTo(q('.ts-chip'), { opacity: 1, scale: .6, transformOrigin: '0% 100%' }, { scale: 1, duration: .7, ease: 'power1.out', immediateRender: false }, 2.2)
    .to(q('.ts-chip'), { opacity: 0, y: 60, duration: .6, ease: 'power2.in' }, 3)
    .to(sh, { y: 0, duration: .9, ease: 'power2.inOut' }, 3)
    .to({}, { duration: 1.4 }, 3.9)
    .to([q('.ts-sc'), q('.ts-clean')], { opacity: 0, duration: .4 }, 5.3).to(q('.ts-part'), { opacity: 1, duration: .4 }, 5.3)
    .set(q('.ts-fl'), { y: 0 }, 5.7).to(q('.ts-fl'), { opacity: 1, duration: .4 }, 5.7).set(q('.ts-chip'), { y: 0 }, 5.7).to({}, { duration: .3 }, 6.1);
  return t;
}

/* ======================================================================================================
   nibbling — a small round punch takes overlapping bites along a programmed curve (blue) and cuts out a larger
   contoured shape, bite by bite.
   ====================================================================================================== */
const NB = (() => {
  const pts = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push([120 + 360 * u, 300 - 92 * Math.sin(2 * Math.PI * u)]); }
  const acc = [0]; for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const step = 25, n = Math.floor(acc[acc.length - 1] / step), c = [];
  for (let j = 0, i = 0; j <= n; j++) { while (i < acc.length - 1 && acc[i] < j * step) i++; c.push(pts[i]); }
  return { pts, c, r: 17 };
})();
function nibblingDraw(k) {
  const { INK, W } = k; const { pts, c, r } = NB;
  const ring = c.map(([x, y], i) => `<circle class="nb-o" data-i="${i}" cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med + .4}"/>`).join('');
  const fill = c.map(([x, y], i) => `<circle class="nb-f" data-i="${i}" cx="${f1(x)}" cy="${f1(y)}" r="${r - 1.2}" fill="#fff"/>`).join('');
  return `
  <path class="nb-sh" d="${RP(60, 120, 480, 360)}" fill="${INK.ice}" fill-opacity=".55" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
  <path class="nb-path" d="${smoothD(pts.filter((_, i) => i % 4 === 0))}" fill="none" ${k.stroke.construct} stroke-dasharray="7 5"/>
  <g class="nb-bites">${ring}${fill}</g>
  <g class="nb-pun" transform="translate(${f1(c[0][0])} ${f1(c[0][1])})"><circle r="${r}" fill="${INK.hot}" fill-opacity="0" stroke="${INK.hot}" stroke-width="${W.thick}" class="nb-pc"/><path d="M-${r + 8} 0H${r + 8}M0 -${r + 8}V${r + 8}" stroke="${INK.hot}" stroke-width="${W.thin}"/></g>
  <g class="nb-lb">${k.leader(f1(c[3][0] + 6), f1(c[3][1] - r + 2), 210, 152, 'ONE BITE = ONE STROKE', { size: 13, weight: 700 })}</g>
  ${k.text(300, 526, 'small overlapping bites along the path', { size: 13.5, fill: INK.graphite2, extra: 'class="nb-n"' })}`;
}
function nibblingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const { c } = NB; const os = qa('.nb-o'), fs = qa('.nb-f'), pun = q('.nb-pun'), pc = q('.nb-pc');
  const t = k.tl();
  k.plot(t, q('.nb-sh'), { at: 0, dur: .8 });
  k.plot(t, q('.nb-path'), { at: .5, dur: 1 });
  t.from(pun, { opacity: 0, duration: .4 }, 1);
  k.stamp(t, q('.nb-lb'), { at: 1.2 });
  t.from(q('.nb-n'), { opacity: 0, duration: .4 }, 1.3);
  if (k.reduced()) return t;
  gsap.set([...os, ...fs], { scale: 0, transformOrigin: '50% 50%' });
  const st = { i: 0 };
  const c2 = gsap.timeline({ repeat: -1, delay: 1.8 });
  const P = .42;                                                                                // one bite per stroke: move, hit
  c.forEach(([x, y], i) => {
    const at = i * P;
    if (i) c2.to(pun, { attr: { transform: `translate(${f1(x)} ${f1(y)})` }, duration: .2, ease: 'power2.inOut' }, at);
    c2.to(pc, { attr: { 'fill-opacity': .3 }, duration: .12 }, at + .2).to(pc, { attr: { 'fill-opacity': 0 }, duration: .1 }, at + .32)
      .to([os[i], fs[i]], { scale: 1, duration: .2, ease: 'power2.out' }, at + .2);
  });
  const end = c.length * P;
  c2.to({}, { duration: 1.2 }, end).to([...os, ...fs], { opacity: 0, duration: .5 }, end + 1.2)
    .to(pun, { attr: { transform: `translate(${f1(c[0][0])} ${f1(c[0][1])})` }, duration: .6, ease: 'power2.inOut' }, end + 1.2)
    .set([...os, ...fs], { scale: 0, opacity: 1 }, end + 1.8);
  return t;
}

/* ======================================================================================================
   emboss — slide L5·S21: male and female dies of the same contour, in opposite direction, press raised ribs into the
   sheet (same thickness, no metal removed). Plan above with section A–A, the section below in the dies.
   ====================================================================================================== */
const EB = { xs: [240, 360], y0: 314, d: 18, T: 8 };
const ebBump = x => EB.xs.reduce((m, c) => Math.max(m, Math.abs(x - c) < 34 ? (Math.abs(x - c) < 14 ? 1 : .5 + .5 * Math.cos(Math.PI * (Math.abs(x - c) - 14) / 20)) : 0), 0);
function ebSheet(dd, ext = 0) { const xs = Array.from({ length: 91 }, (_, i) => 100 - ext + i * (400 + 2 * ext) / 90); return 'M' + xs.map(x => `${f1(x)} ${f1(EB.y0 + dd * ebBump(x))}`).join('L'); }
function embossDraw(k) {
  const { INK, W } = k; const { y0, d, T } = EB;
  const prof = (yy, sgn) => Array.from({ length: 91 }, (_, i) => 120 + i * 360 / 90).map(x => `L${f1(x)} ${f1(yy + d * ebBump(x))}`).join('');
  const male = `M120 200H480V${y0 - T / 2}` + prof(y0 - T / 2, 1).replace(/^L[^L]*/, '').split('L').filter(Boolean).reverse().map(p => 'L' + p).join('') + `L120 ${y0 - T / 2}Z`;
  const female = `M120 420H480V${y0 + T / 2}` + Array.from({ length: 91 }, (_, i) => 480 - i * 360 / 90).map(x => `L${f1(x)} ${f1(y0 + T / 2 + d * ebBump(x))}`).join('') + 'Z';
  const ribs = EB.xs.map(x => `M${x - 14} 82h28a14 14 0 0 1 0 0v76a14 14 0 0 1 -28 0v-76Z`).join('');
  return `
  <path class="eb-pl" d="${RP(120, 64, 360, 112)}" fill="${INK.ice}" fill-opacity=".5" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <path class="eb-rib" d="${EB.xs.map(x => `M${x - 14} 84H${x + 14}V156H${x - 14}Z`).join('')}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
  ${k.section(100, 120, 500, 120, 'A')}
  <g class="eb-m">${pt(k, male, { cls: 'eb-p', mat: 'steel' })}${k.text(300, 248, 'MALE', { size: 20, family: 'stencil', weight: 800, spacing: 3, fill: INK.graphite })}</g>
  ${pt(k, female, { cls: 'eb-p', mat: 'iron' })}${k.text(300, 396, 'FEMALE', { size: 20, family: 'stencil', weight: 800, spacing: 3, extra: 'class="eb-ft"' })}
  <g class="eb-w">${sheet(k, ebSheet(0, 1.4), T, 'eb-sh')}</g>
  ${k.text(300, 452, 'SECTION A–A', { size: 13, weight: 700, fill: INK.graphite2, spacing: 1, extra: 'class="eb-st"' })}
  ${k.text(300, 480, 'same contour, opposite direction', { size: 13.5, fill: INK.graphite2, extra: 'class="eb-st"' })}`;
}
function embossPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const sh = qa('.eb-sh'), m = q('.eb-m'), rib = q('.eb-rib');
  const st = { y: -50 };
  const render = () => { const dd = Math.max(0, Math.min(EB.d, st.y + EB.d)); sh.forEach((e, i) => e.setAttribute('d', ebSheet(dd, i ? 0 : 1.4))); m.setAttribute('transform', `translate(0 ${f1(st.y)})`); };
  render();
  const t = k.tl();
  k.plot(t, qa('.eb-p .o, .eb-pl'), { at: 0, stagger: .1, dur: .7 });
  k.ink(t, qa('.eb-p .h'), { at: .5, stagger: .1 });
  k.plot(t, sh, { at: .6, stagger: 0, dur: .6 });
  t.from(qa('.k-section, .eb-m text, .eb-ft, .eb-st'), { opacity: 0, duration: .4, stagger: .05 }, .9);
  if (k.reduced()) { st.y = 0; render(); return t; }
  t.set(rib, { opacity: 0 }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 1.8, onUpdate: render });
  c.to(st, { y: 0, duration: 1, ease: 'power2.in' })                                         // the male closes on the female: ribs rise
    .to(rib, { opacity: 1, duration: .4 }, '-=.3')
    .to({}, { duration: .4 })
    .to(st, { y: -50, duration: 1.1, ease: 'power2.inOut' })
    .to({}, { duration: 1.2 })
    .to([q('.eb-w'), rib], { opacity: 0, duration: .4 })                                    // next sheet
    .to(q('.eb-w'), { opacity: 1, duration: .4 });
  // the ribs stay once pressed: the sheet keeps the deepest it reached in this stroke, until it is swapped (t ≥ 4.1)
  let deepest = 0;
  c.eventCallback('onUpdate', () => {
    const dd = Math.max(0, Math.min(EB.d, st.y + EB.d));
    if (c.time() >= 4.1) deepest = 0; else deepest = Math.max(deepest, dd);
    sh.forEach((e, i) => e.setAttribute('d', ebSheet(Math.max(dd, deepest), i ? 0 : 1.4))); m.setAttribute('transform', `translate(0 ${f1(st.y)})`);
  });
  return t;
}

/* ======================================================================================================
   coining — slide L5·S22: like embossing, but the blank is trapped in a collar and struck between two engraved dies, so
   both faces are impressed (similar or different). The coin is ejected, both faces shown below.
   ====================================================================================================== */
function coiningDraw(k) {
  const { INK, W } = k;
  const up = `M210 60H390V198H372V204H352V198H312V206H288V198H248V204H228V198H210Z`;
  const lo = `M210 360H390V238H374V232H360V238H330V230H318V238H282V230H270V238H240V232H226V238H210Z`;
  const blank = RP(212, 200, 176, 36);
  const coin = `M212 204H228V208H248V204H288V210H312V204H352V208H372V204H388V234H374V229H360V234H330V226H318V234H282V226H270V234H240V229H226V234H212Z`;
  const face1 = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<circle cx="${f1(196 + 40 * Math.cos(a))}" cy="${f1(470 + 40 * Math.sin(a))}" r="2.4" fill="${INK.graphite}"/>`; }).join('');
  const face2 = 'M' + Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8 - Math.PI / 2, r = i % 2 ? 14 : 30; return `${f1(404 + r * Math.cos(a))} ${f1(470 + r * Math.sin(a))}`; }).join('L') + 'Z';
  return `
  <g class="cn-up">${pt(k, up, { cls: 'cn-p', mat: 'steel' })}${k.arrow(300, 18, 300, 54, { w: 7 })}</g>
  ${pt(k, `M150 166H208V330H150Z`, { cls: 'cn-p', mat: 'iron' })}${pt(k, `M392 166H450V330H392Z`, { cls: 'cn-p', mat: 'iron' })}
  <g class="cn-lo">${pt(k, lo, { cls: 'cn-p', mat: 'steel' })}
    <g class="cn-w"><path class="cn-blank" d="${blank}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}"/><path class="cn-coin" d="${coin}" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round" opacity="0"/></g></g>
  <g class="cn-lb">${k.leader(392, 100, 440, 84, 'UPPER DIE', { size: 14, weight: 700 })}${k.leader(392, 320, 440, 380, 'LOWER DIE', { size: 14, weight: 700 })}${k.leader(160, 280, 104, 300, 'COLLAR', { size: 14, weight: 700 })}</g>
  <g class="cn-faces">
    <g class="cn-f"><circle cx="196" cy="470" r="50" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="196" cy="470" r="44" fill="none" stroke="${INK.graphite}" stroke-width="${W.hair}"/>${face1}${k.text(196, 486, '5', { size: 44, family: 'display', weight: 800 })}</g>
    <g class="cn-f"><circle cx="404" cy="470" r="50" fill="${INK.ice}" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="404" cy="470" r="44" fill="none" stroke="${INK.graphite}" stroke-width="${W.hair}"/><path d="${face2}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/><circle cx="404" cy="470" r="6" fill="${INK.graphite}"/></g>
    ${k.text(196, 548, 'FACE 1', { size: 12, weight: 700, fill: INK.graphite2 })}${k.text(404, 548, 'FACE 2', { size: 12, weight: 700, fill: INK.graphite2 })}
  </g>`;
}
function coiningPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const up = q('.cn-up'), lo = q('.cn-lo'), blank = q('.cn-blank'), coin = q('.cn-coin'), w = q('.cn-w'), faces = qa('.cn-f');
  const t = k.tl();
  k.plot(t, qa('.cn-p .o'), { at: 0, stagger: .08, dur: .6 });
  k.ink(t, qa('.cn-p .h'), { at: .5, stagger: .06 });
  t.from(blank, { opacity: 0, duration: .4 }, .7);
  k.stamp(t, qa('.cn-lb .k-leader'), { at: 1, stagger: .1 });
  t.from(q('.cn-up line'), { opacity: 0, duration: .3 }, 1.1);
  t.from(qa('.cn-faces text'), { opacity: 0, duration: .3 }, 1.2);
  if (k.reduced()) { t.set(blank, { opacity: 0 }, 1.3).set(coin, { opacity: 1 }, 1.3); return t; }
  t.set(faces, { opacity: 0, scale: .7, transformOrigin: '50% 50%' }, 0);
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  c.set(up, { y: -40 })
    .to(up, { y: 0, duration: .55, ease: 'power3.in' })                                         // the strike
    .set(blank, { opacity: 0 }).set(coin, { opacity: 1 })                                        // both faces take the dies
    .to(faces, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.8)', stagger: .12 })
    .to(up, { y: -116, duration: 1, ease: 'power2.inOut' }, '-=.3')
    .to(lo, { y: -84, duration: .7, ease: 'power2.inOut' })                                       // the lower die ejects the coin above the collar
    .to(w, { x: 230, opacity: 0, duration: .6, ease: 'power2.in' }, '+=.4')
    .to(lo, { y: 0, duration: .6, ease: 'power2.inOut' })
    .to(faces, { opacity: 0, duration: .4 }, '<')
    .set(coin, { opacity: 0 }).set(blank, { opacity: 1 }).set(w, { x: 0 })
    .to(w, { opacity: 1, duration: .4 })
    .to(up, { y: -40, duration: .6, ease: 'power2.inOut' }, '<').to({}, { duration: .3 });
  return t;
}

export default {
  cutTree: { draw: cutTreeDraw, play: cutTreePlay },
  machining: { draw: machiningDraw, play: machiningPlay },
  thermal: { draw: thermalDraw, play: thermalPlay },
  shearing: { draw: shearingDraw, play: shearingPlay },
  clearance: { draw: clearanceDraw, play: clearancePlay },
  punchDie: { draw: punchDieDraw, play: punchDiePlay },
  punchVsBlank: { draw: punchVsBlankDraw, play: punchVsBlankPlay },
  fineBlank: { draw: fineBlankDraw, play: fineBlankPlay },
  cutOps: { draw: cutOpsDraw, play: cutOpsPlay },
  perforating: { draw: perforatingDraw, play: perforatingPlay },
  lancing: { draw: lancingDraw, play: lancingPlay },
  cutoffParting: { draw: cutoffPartingDraw, play: cutoffPartingPlay },
  trimShave: { draw: trimShaveDraw, play: trimShavePlay },
  nibbling: { draw: nibblingDraw, play: nibblingPlay },
  emboss: { draw: embossDraw, play: embossPlay },
  coining: { draw: coiningDraw, play: coiningPlay }
};
