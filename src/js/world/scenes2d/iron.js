// Illustrated scenes — iron (L2 · cast irons): irons ★ · castIron · grayIron · ductileIron · whiteIron · cgi · malleableIron ·
// alloyIrons · crankshaft. Contract and look: STYLE.md · names and captions: world/scenes/info.js · facts: docs/COURSE.md.
// The inside of each iron is drawn the way a drawing shows a magnified feature: a round DETAIL view (a micrograph at
// ×100) next to the part that iron makes — flakes, nodules, the white chilled edge, worms, temper-carbon clusters, carbides.
// In this zone the section hatch IS the content: parts cut open are filled with their own microstructure (a pattern).
// Every texture is seeded (draw() stays pure) and drawn as ONE path, so a field of 30 flakes is a single element.

/* ======================================================================================================
   shared: seeded scatter, the six microstructures, detail views, a crankshaft that turns
   ====================================================================================================== */
const D2R = Math.PI / 180;
const f = v => Math.round(v * 10) / 10;
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const cs = a => Math.cos(a * D2R), sn = a => Math.sin(a * D2R);
const rng = seed => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; };
/** points spread through a disc (or a rect when r is [w, h]) with a minimum spacing — deterministic for a seed */
function scatter(cx, cy, r, n, minD, seed) {
  const R = rng(seed), pts = [], rect = Array.isArray(r);
  for (let i = 0; i < n * 60 && pts.length < n; i++) {
    let x, y;
    if (rect) { x = cx + R() * r[0]; y = cy + R() * r[1]; } else { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r; x = cx + d * Math.cos(a); y = cy + d * Math.sin(a); }
    if (pts.every(p => Math.hypot(p[0] - x, p[1] - y) >= minD)) pts.push([x, y]);
  }
  return pts;
}
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
/** a graphite flake: a thin crescent, length L, angle a (rad), bow b, half-thickness w */
function flake(x, y, L, a, b, w) {
  const ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux, p0 = [x - ux * L / 2, y - uy * L / 2], p1 = [x + ux * L / 2, y + uy * L / 2];
  return `M${f(p0[0])} ${f(p0[1])}Q${f(x + vx * (b + w))} ${f(y + vy * (b + w))} ${f(p1[0])} ${f(p1[1])}Q${f(x + vx * (b - w))} ${f(y + vy * (b - w))} ${f(p0[0])} ${f(p0[1])}Z`;
}
/** the microstructures, as path data. s scales the feature size (1 = a ×100 detail of radius ~100) */
const TEX = {
  flakes(pts, seed, s = 1) { const R = rng(seed); return pts.map(([x, y]) => {
    const L = (22 + R() * 28) * s, a = R() * Math.PI, b = (R() - .5) * L * .55, w = (2.6 + R() * 1.8) * s;
    let d = flake(x, y, L, a, b, w);
    if (R() < .4) { const a2 = a + (R() < .5 ? 1 : -1) * (.55 + R() * .6), L2 = L * (.45 + R() * .3), bx = x + Math.cos(a) * L * .22, by = y + Math.sin(a) * L * .22; d += flake(bx + Math.cos(a2) * L2 / 2, by + Math.sin(a2) * L2 / 2, L2, a2, (R() - .5) * L2 * .4, w * .8); }
    return d; }).join(''); },
  nodules(pts, seed, s = 1) { const R = rng(seed); return pts.map(([x, y]) => [x, y, (5 + R() * 4) * s]); },
  worms(pts, seed, s = 1) { const R = rng(seed); return pts.map(([x, y]) => {
    let a = R() * Math.PI * 2, d = `M${f(x)} ${f(y)}`; const n = 2 + Math.floor(R() * 3);
    for (let i = 0; i < n; i++) { a += (R() - .5) * 1.7; x += Math.cos(a) * (6 + R() * 5) * s; y += Math.sin(a) * (6 + R() * 5) * s; d += `L${f(x)} ${f(y)}`; }
    return d; }).join(''); },
  clusters(pts, seed, s = 1) { const R = rng(seed); return pts.map(([x, y]) => {
    let d = ''; const n = 4 + Math.floor(R() * 4);
    for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, rr = R() * 6 * s; d += circ(x + Math.cos(a) * rr, y + Math.sin(a) * rr, (2.2 + R() * 2.6) * s); }
    return d; }).join(''); },
  dendrites(pts, seed, s = 1) { const R = rng(seed), fam = [R() * Math.PI, R() * Math.PI, R() * Math.PI]; return pts.map(([x, y]) => {
    const a = fam[Math.floor(R() * 3)] + (R() - .5) * .3, rx = (6 + R() * 10) * s, ry = (2.4 + R() * 2.4) * s, ux = Math.cos(a) * rx, uy = Math.sin(a) * rx, deg = f(a / D2R);
    return `M${f(x - ux)} ${f(y - uy)}A${f(rx)} ${f(ry)} ${deg} 1 0 ${f(x + ux)} ${f(y + uy)}A${f(rx)} ${f(ry)} ${deg} 1 0 ${f(x - ux)} ${f(y - uy)}Z`; }).join(''); },
  carbides(pts, seed, s = 1) { const R = rng(seed); return pts.map(([x, y]) => {
    const a = R() * Math.PI, L = (12 + R() * 14) * s, w = (3 + R() * 2.4) * s, ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux;
    const P = [[L / 2, 0], [L / 2 - w * .8, w], [-L / 2 + w * .8, w], [-L / 2, 0], [-L / 2 + w * .8, -w], [L / 2 - w * .8, -w]].map(([p, q]) => `${f(x + ux * p + vx * q)} ${f(y + uy * p + vy * q)}`);
    return `M${P.join('L')}Z`; }).join(''); }
};
/** a microstructure, ready to drop in a clip: kind = gray | ductile | white | cgi | malleable | alloy | flake2nod */
function micro(k, kind, cx, cy, r, seed, { s = 1 } = {}) {
  const { INK } = k, R = r + 10, dens = (r / 100) ** 2 / (s * s);
  const bg = (o = .55) => `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="${k.hatch('stipple')}" opacity="${o}"/>`;
  if (kind === 'gray') return `${bg(.4)}<path d="${TEX.flakes(scatter(cx, cy, R, Math.round(28 * dens), 17 * s, seed), seed + 1, s)}" fill="${INK.graphite}"/>`;
  if (kind === 'ductile') { const n = TEX.nodules(scatter(cx, cy, R, Math.round(18 * dens), 25 * s, seed), seed + 1, s); return `${bg(.85)}<path d="${n.map(([x, y, rr]) => circ(x, y, rr + 4.5 * s)).join('')}" fill="#fff"/><path d="${n.map(([x, y, rr]) => circ(x, y, rr)).join('')}" fill="${INK.graphite}"/>`; }
  if (kind === 'white') return `<path d="${TEX.dendrites(scatter(cx, cy, R, Math.round(30 * dens), 13 * s, seed), seed + 1, s)}" fill="${INK.graphite2}" opacity=".62"/>`;
  if (kind === 'cgi') return `${bg(.4)}<path d="${TEX.worms(scatter(cx, cy, R, Math.round(24 * dens), 19 * s, seed), seed + 1, s)}" fill="none" stroke="${INK.graphite}" stroke-width="${f(4.4 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (kind === 'malleable') return `<path d="${TEX.clusters(scatter(cx, cy, R, Math.round(14 * dens), 28 * s, seed), seed + 1, s)}" fill="${INK.graphite}"/>`;
  if (kind === 'alloy') return `${bg(.7)}<path d="${TEX.carbides(scatter(cx, cy, R, Math.round(22 * dens), 18 * s, seed), seed + 1, s)}" fill="#fff" stroke="${INK.graphite}" stroke-width="1.3" stroke-linejoin="round"/>`;
  return '';
}
/** a pattern tile of a microstructure, to fill a part cut in section (id must carry the scene's name) */
function texPattern(k, id, kind, size = 46, seed = 5) {
  const { INK } = k, pts = scatter(7, 7, [size - 14, size - 14], 4, 16, seed);
  let inner = '';
  if (kind === 'gray') inner = `<path d="${TEX.flakes(pts, seed, .5)}" fill="${INK.graphite}"/>`;
  if (kind === 'ductile') inner = `<path d="${TEX.nodules(pts, seed, .5).map(([x, y, r]) => circ(x, y, r)).join('')}" fill="${INK.graphite}"/>`;
  if (kind === 'cgi') inner = `<path d="${TEX.worms(pts, seed, .45)}" fill="none" stroke="${INK.graphite}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (kind === 'malleable') inner = `<path d="${TEX.clusters(pts, seed, .45)}" fill="${INK.graphite}"/>`;
  if (kind === 'alloy') inner = `<path d="${TEX.carbides(pts, seed, .5)}" fill="none" stroke="${INK.graphite}" stroke-width="1"/>`;
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${inner}</pattern>`;
}
/** a DETAIL view: a round window at ×100 with its ring, letter and caption (clip ids carry the scene's name) */
function detail(k, id, cx, cy, r, inner, { label = '', sub = '', size = 16 } = {}) {
  const { INK, W } = k;
  return `<g class="dt"><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
    <g clip-path="url(#${id})"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#fff"/>${inner}</g>
    <circle class="dt-o" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    ${label ? k.text(cx, cy + r + 24, label, { size, weight: 700 }) : ''}${sub ? k.text(cx, cy + r + 42, sub, { size: 13, fill: INK.graphite2 }) : ''}</g>`;
}
/** the detail marker on a part: a small circle, its letter, and the thin line to the detail view */
function marker(k, x, y, tx, ty, letter = 'A') {
  const { INK, W } = k, a = Math.atan2(ty - y, tx - x);
  return `<g class="mk"><circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/><line x1="${f(x + 15 * Math.cos(a))}" y1="${f(y + 15 * Math.sin(a))}" x2="${f(tx)}" y2="${f(ty)}" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-dasharray="10 4 2 4"/>${k.text(x + 24 * Math.cos(a + 1.9), y + 24 * Math.sin(a + 1.9) + 6, letter, { size: 17, weight: 700 })}</g>`;
}
/** a note: text above the start of a straight leader ending on the feature */
function note(k, x, y, tx, ty, label, { color = k.INK.graphite, size = 16, anchor = 'start', dot = false, weight = 600, family = 'dim' } = {}) {
  const mk = dot ? 'dot' : color === k.INK.red ? 'arr-red' : 'arr';
  return `<g class="k-leader"><line x1="${f(tx)}" y1="${f(ty)}" x2="${f(x)}" y2="${f(y)}" stroke="${color}" stroke-width="${k.W.thin}" marker-end="url(#${mk})"/>${k.text(tx, ty - 7, label, { size, fill: color, anchor, weight, family })}</g>`;
}
/** the plotter pen, dash-aware (dashed and grouped things ink in so they keep their dashes) */
function pen(k, t, els, { at = 0, stagger = .08, dur = .7 } = {}) {
  [].concat(els).flatMap(e => (e && e.length !== undefined && !e.tagName ? [...e] : [e])).filter(Boolean).forEach((el, i) => {
    if (el.getAttribute('stroke-dasharray') || el.tagName === 'g' || el.tagName === 'text') t.from(el, { opacity: 0, duration: Math.max(.3, dur * .6) }, at + i * stagger);
    else { if (el.getAttribute('marker-start') || el.getAttribute('marker-end')) t.from(el, { opacity: 0, duration: .12 }, at + i * stagger); k.plot(t, el, { at: at + i * stagger, dur }); }
  });
  return t;
}
const setR = (el, x, y, w, h) => { if (!el) return; el.setAttribute('x', f(x)); el.setAttribute('y', f(y)); el.setAttribute('width', f(w)); el.setAttribute('height', f(Math.max(0, h))); };
const setP = (el, pts) => el && el.setAttribute('points', pts.map(p => p.map(f).join(',')).join(' '));
/** a crankshaft in side elevation: mains on the axis, and for each throw two webs and a crank pin that ride round.
 *  o = { axis, xs (throw x), ph (phase°), r (throw radius), pw, ph2 (pin height), ww (web width), W (web breadth), c (counterweight), e, mh (main height), ends } */
function crankDraw(k, cls, o) {
  const { INK, W } = k, { axis, xs, pw, ww, mh, ends } = o;
  const edges = [ends[0], ...xs.flatMap(x => [x - pw / 2 - ww, x + pw / 2 + ww]), ends[1]];
  let mains = ''; for (let i = 0; i < edges.length; i += 2) mains += `<rect x="${f(edges[i])}" y="${axis - mh / 2}" width="${f(edges[i + 1] - edges[i])}" height="${mh}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>`;
  const throws = xs.map(() => `<rect class="${cls}-w" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" rx="5"/><rect class="${cls}-w" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" rx="5"/><rect class="${cls}-p" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>`).join('');
  return `<g class="${cls}"><g class="${cls}-m">${mains}</g>${throws}${k.center(ends[0] - 16, axis, ends[1] + 16, axis)}</g>`;
}
function crankSet(g, cls, o, th) {
  const ws = g.querySelectorAll(`.${cls}-w`), ps = g.querySelectorAll(`.${cls}-p`), { axis, xs, ph, r, pw, ph2, ww, W, c, e } = o;
  xs.forEach((x, i) => {
    const a = th + ph[i], m1 = (r + e) * cs(a), m2 = -c * cs(a), ex = W / 2 * Math.abs(sn(a));
    const top = axis - Math.max(m1, m2) - ex, bot = axis - Math.min(m1, m2) + ex, yp = axis - r * cs(a);
    setR(ws[2 * i], x - pw / 2 - ww, top, ww, bot - top); setR(ws[2 * i + 1], x + pw / 2, top, ww, bot - top);
    setR(ps[i], x - pw / 2, yp - ph2 / 2, pw, ph2);
  });
}

/* ======================================================================================================
   irons ★ — the six cast irons as six specimen mounts, each with its own inside (balloons 1–6, as the slide numbers
   them): GRAY flakes · DUCTILE nodules · WHITE (no graphite: chilled) · CGI worms · MALLEABLE clusters · HIGH-ALLOY
   carbides. In turn, each presents its job: the micrograph dims and the part it makes is drawn in its place and works.
   ====================================================================================================== */
const IR = { xs: [110, 300, 490], ys: [160, 398], r: 72 };
const IR_K = [['gray', 'GRAY', 'machine bases · flywheels'], ['ductile', 'DUCTILE', 'crankshafts · gears'], ['white', 'WHITE', 'crushers · mill rolls'], ['cgi', 'CGI', 'engine blocks · drums'], ['malleable', 'MALLEABLE', 'heavy-duty bearings'], ['alloy', 'HIGH-ALLOY', 'Cr · Ni, up to 35 %']];
const IR_CK = { axis: 0, xs: [0], ph: [0], r: 20, pw: 26, ph2: 16, ww: 10, W: 50, c: 14, e: 10, mh: 18, ends: [-62, 62] };
function ironPart(k, i) { // the part each iron makes, centred on (0, 0), about 120 across
  const { INK, W } = k, o = `stroke="${INK.graphite}" stroke-width="${W.thick}" fill="#fff"`, m = `stroke="${INK.graphite}" stroke-width="${W.med}" fill="none"`;
  if (i === 0) return `<g class="ip-spin"><circle r="58" ${o}/><circle r="46" ${m}/>${[0, 72, 144, 216, 288].map(a => `<line x1="${f(15 * cs(a - 90))}" y1="${f(15 * sn(a - 90))}" x2="${f(46 * cs(a - 90))}" y2="${f(46 * sn(a - 90))}" stroke="${INK.graphite}" stroke-width="5" stroke-linecap="round"/>`).join('')}<circle r="15" ${o}/><circle r="6" ${m}/></g>`;
  if (i === 1) return `<g class="ip-ck">${crankDraw(k, 'ipc', IR_CK)}<rect x="62" y="-30" width="9" height="60" ${o}/></g>`;
  if (i === 2) return `${[-31, 31].map((x, j) => `<g class="ip-roll" data-x="${x}"><circle cx="${x}" cy="14" r="29" ${o}/><g class="ip-r">${Array.from({ length: 10 }, (_, q) => `<line x1="${f(x + 29 * cs(q * 36))}" y1="${f(14 + 29 * sn(q * 36))}" x2="${f(x + 35 * cs(q * 36))}" y2="${f(14 + 35 * sn(q * 36))}" stroke="${INK.graphite}" stroke-width="2.6" stroke-linecap="round"/>`).join('')}<circle cx="${x}" cy="14" r="9" ${m}/><line x1="${x}" y1="5" x2="${x}" y2="23" stroke="${INK.graphite}" stroke-width="${W.med}"/></g></g>`).join('')}
    <path class="ip-rock" d="M-12 -52L4 -60L14 -48L9 -36L-6 -34L-14 -42Z" fill="${k.hatch('stipple')}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`;
  if (i === 3) return `<g class="ip-spin"><circle r="57" ${o}/>${Array.from({ length: 16 }, (_, q) => `<line x1="${f(57 * cs(q * 22.5))}" y1="${f(57 * sn(q * 22.5))}" x2="${f(63 * cs(q * 22.5))}" y2="${f(63 * sn(q * 22.5))}" stroke="${INK.graphite}" stroke-width="2.4"/>`).join('')}<circle r="46" ${m}/><circle r="19" ${o}/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${f(30 * cs(a))}" cy="${f(30 * sn(a))}" r="4" ${m}/>`).join('')}<circle r="8" ${m}/></g>`;
  if (i === 4) return `<path d="M-58 44V30H-34A40 40 0 0 1 34 30H58V44Z" ${o}/><circle cx="0" cy="-6" r="40" ${o}/><circle cx="-46" cy="37" r="4" ${m}/><circle cx="46" cy="37" r="4" ${m}/><g class="ip-spin" data-o="0 -6"><circle cx="0" cy="-6" r="21" ${o}/><rect x="-4" y="-27" width="8" height="7" fill="${INK.graphite}"/></g>`;
  return `<path d="M-44 -38H44L52 8H-52Z" ${o}/>${k.text(-18, -6, 'Cr', { size: 24, family: 'stencil', weight: 700, fill: INK.plum })}${k.text(20, -6, 'Ni', { size: 24, family: 'stencil', weight: 700, fill: INK.plum })}
    <rect x="-52" y="24" width="104" height="14" ${m}/><rect class="ip-bar" x="-52" y="24" width="${f(104 * .35)}" height="14" fill="${INK.plum}"/><line x1="${f(-52 + 104 * .35)}" y1="18" x2="${f(-52 + 104 * .35)}" y2="44" stroke="${INK.red}" stroke-width="${W.med}"/>${k.text(-52 + 104 * .35, 58, '≤ 35 %', { size: 14, fill: INK.red, weight: 700 })}`;
}
function ironsDraw(k) {
  const { INK } = k, { xs, ys, r } = IR;
  return IR_K.map(([kind, name, job], i) => {
    const cx = xs[i % 3], cy = ys[Math.floor(i / 3)];
    return `<g class="ir-c" data-i="${i}">
      <clipPath id="irons-c${i}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
      <g class="ir-m" clip-path="url(#irons-c${i})"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#fff"/>${micro(k, kind, cx, cy, r, 11 + i * 17, { s: .82 })}</g>
      <g class="ir-p" opacity="0" transform="translate(${cx} ${cy})">${ironPart(k, i)}</g>
      <circle class="ir-o" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK.graphite}" stroke-width="${k.W.thick}"/>
      ${k.balloon(cx - r * .76, cy - r * .76, i + 1, { r: 13 })}
      ${k.text(cx, cy + r + 26, name, { size: 20, weight: 700, spacing: .6 })}
      ${k.text(cx, cy + r + 45, job, { size: 14, fill: INK.graphite2, extra: 'class="ir-j"' })}</g>`;
  }).join('');
}
function ironsPlay(svg, k) {
  const { gsap, INK, W } = k, [q, qa] = sel(svg), cells = qa('.ir-c');
  const t = k.tl();
  if (k.reduced()) return t;
  cells.forEach((c, i) => {
    t.from(c.querySelector('.ir-o'), { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(1.7)' }, .1 + i * .1)
      .from(c.querySelector('.ir-m'), { opacity: 0, duration: .6 }, .35 + i * .1);
  });
  k.stamp(t, qa('.k-balloon'), { at: .7, stagger: .06 });
  t.from(qa('.ir-c > text'), { opacity: 0, y: 6, duration: .4, stagger: .04 }, .8);
  // in turn: the micrograph dims, the part it makes is drawn in, works, and the inside comes back
  const L = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: .6 }), ck = { a: 0 }, ckg = q('.ip-ck');
  const ckRender = () => crankSet(ckg, 'ipc', IR_CK, ck.a);
  ckRender();
  cells.forEach((c, i) => {
    const m = c.querySelector('.ir-m'), p = c.querySelector('.ir-p'), o = c.querySelector('.ir-o'), j = c.querySelector('.ir-j'), at = `s${i}`;
    L.addLabel(at)
      .to(m, { opacity: .1, duration: .45 }, at).to(o, { stroke: INK.plum, strokeWidth: 6, duration: .45 }, at).to(j, { fill: INK.plum, duration: .3 }, at)
      .to(p, { opacity: 1, duration: .45 }, `${at}+=.25`);
    const w = `${at}+=.6`;
    if (i === 0 || i === 3) L.fromTo(p.querySelector('.ip-spin'), { rotation: 0 }, { rotation: i ? 160 : 300, svgOrigin: '0 0', duration: 1.6, ease: 'power1.inOut', immediateRender: false }, w);
    if (i === 1) L.fromTo(ck, { a: 0 }, { a: 360, duration: 1.6, ease: 'power1.inOut', onUpdate: ckRender, immediateRender: false }, w);
    if (i === 2) { const rl = p.querySelectorAll('.ip-r'); L.fromTo(rl[0], { rotation: 0 }, { rotation: 150, svgOrigin: '-31 14', duration: 1.6, ease: 'none', immediateRender: false }, w).fromTo(rl[1], { rotation: 0 }, { rotation: -150, svgOrigin: '31 14', duration: 1.6, ease: 'none', immediateRender: false }, w).fromTo(p.querySelector('.ip-rock'), { y: 0, scale: 1, opacity: 1 }, { y: 50, scale: .3, opacity: 0, svgOrigin: '0 -48', duration: 1.2, ease: 'power2.in', immediateRender: false }, w); }
    if (i === 4) L.fromTo(p.querySelector('.ip-spin'), { rotation: 0 }, { rotation: 360, svgOrigin: '0 -6', duration: 1.6, ease: 'power1.inOut', immediateRender: false }, w);
    if (i === 5) L.fromTo(p.querySelector('.ip-bar'), { scaleX: 0 }, { scaleX: 1, svgOrigin: '-52 0', duration: 1.1, ease: 'power2.out', immediateRender: false }, w);
    L.to(p, { opacity: 0, duration: .4 }, `${at}+=2.4`).to(m, { opacity: 1, duration: .45 }, `${at}+=2.45`)
      .to(o, { stroke: INK.graphite, strokeWidth: W.thick, duration: .45 }, `${at}+=2.45`).to(j, { fill: INK.graphite2, duration: .3 }, `${at}+=2.45`);
  });
  return t;
}

/* ======================================================================================================
   castIron — an induction furnace in section: refractory lining, the copper coil, the melt stirring itself (the dome
   of an induction melt). In the melt, carbon flakes and silicon grains ride the stirring; the parts list beside it is
   the recipe — at least 2 % C, 1–3 % Si, the rest iron — and its rows light up with their balloons in turn.
   ====================================================================================================== */
const CI = { melt: 'M122 202Q210 180 298 202V448H122Z', cells: [[166, 330], [254, 330]] };
const ciC = (x, y, a) => flake(x, y, 15, a, 3, 2.2), ciSi = (x, y) => `M${f(x)} ${f(y - 5.5)}L${f(x + 5.5)} ${f(y)}L${f(x)} ${f(y + 5.5)}L${f(x - 5.5)} ${f(y)}Z`;
function castIronDraw(k) {
  const { INK, W } = k;
  const part = (cx, cy, seed) => { const R = rng(seed); let c = '', s = ''; for (let i = 0; i < 9; i++) { const a = i * 40 + R() * 20, rr = 22 + R() * 48, x = cx + rr * cs(a), y = cy + rr * 1.35 * sn(a); if (i % 3 === 2) s += ciSi(x, y); else c += ciC(x, y, R() * Math.PI); } return `<path d="${c}" fill="${INK.graphite}"/><path d="${s}" fill="#fff" stroke="${INK.graphite}" stroke-width="1.4"/>`; };
  const rows = [['1', 'C · carbon', '≥ 2'], ['2', 'Si · silicon', '1 – 3'], ['3', 'Fe · iron', 'rest']];
  return `
  <rect x="52" y="132" width="316" height="364" fill="none" stroke="${INK.graphite2}" stroke-width="${W.med}"/>
  <clipPath id="castIron-melt"><path d="${CI.melt}"/></clipPath>
  <path d="${CI.melt}" fill="${INK.hot}" opacity=".32"/>
  <g clip-path="url(#castIron-melt)"><rect x="122" y="180" width="1" height="1" fill="#fff"/>
    <g class="ci-cell" data-i="0">${part(...CI.cells[0], 3)}</g><g class="ci-cell" data-i="1">${part(...CI.cells[1], 9)}</g></g>
  <path d="M122 202Q210 180 298 202" fill="none" stroke="${INK.hot}" stroke-width="${W.med}"/>
  ${CI.cells.map(([x, y], i) => `<path d="M${x + (i ? 1 : -1) * 52} ${y + 70}A62 84 0 0 ${i ? 0 : 1} ${x + (i ? 1 : -1) * 52} ${y - 70}" fill="none" ${k.stroke.construct} stroke-dasharray="6 5" marker-end="url(#arr-blue)"/>`).join('')}
  <path d="${ciC(150, 404, .4)}" fill="${INK.graphite}"/><path d="${ciSi(270, 250)}" fill="#fff" stroke="${INK.graphite}" stroke-width="1.6"/>
  <g class="ci-lin"><path d="M92 142H122V448H298V142H328V478H92Z" fill="#fff"/><path d="M92 142H122V448H298V142H328V478H92Z" fill="${k.hatch('refractory')}"/><path class="o" d="M92 142H122V448H298V142H328V478H92Z" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>
  <g class="ci-coil">${[74, 346].map(x => Array.from({ length: 8 }, (_, j) => `<g><circle cx="${x}" cy="${168 + 40 * j}" r="11" fill="#fff"/><circle cx="${x}" cy="${168 + 40 * j}" r="11" fill="${k.hatch('bronze')}" stroke="${INK.graphite}" stroke-width="${W.med}"/><circle class="ci-hot" cx="${x}" cy="${168 + 40 * j}" r="11" fill="${INK.hot}" opacity="0"/></g>`).join('')).join('')}</g>
  <g class="ci-b">${note(k, 156, 402, 384, 412, '', {})}${note(k, 276, 252, 384, 262, '', {})}${note(k, 286, 330, 384, 337, '', {})}
    ${[['1', 412], ['2', 262], ['3', 337]].map(([n, y]) => `<g class="ci-bl" data-n="${n}">${k.balloon(398, y - 7, n, { r: 14 })}</g>`).join('')}</g>
  <g class="ci-tab">${k.text(486, 128, 'CAST IRON', { size: 22, family: 'display', weight: 700, spacing: .5 })}
    <rect class="ci-hl" x="420" y="182" width="140" height="34" fill="${INK.plum}" opacity=".18"/>
    <rect x="420" y="148" width="140" height="136" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <path d="M420 182H560M420 216H560M420 250H560M446 148V284M524 148V284" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    ${k.text(433, 171, '#', { size: 14, fill: INK.graphite2, weight: 700 })}${k.text(485, 171, 'ELEMENT', { size: 13, fill: INK.graphite2, weight: 700 })}${k.text(542, 171, '%', { size: 14, fill: INK.graphite2, weight: 700 })}
    ${rows.map(([n, e, p], j) => `${k.text(433, 205 + 34 * j, n, { size: 16, weight: 700 })}${k.text(485, 205 + 34 * j, e, { size: 15 })}${k.text(542, 205 + 34 * j, p, { size: 16, weight: 700, fill: j < 2 ? INK.red : INK.graphite })}`).join('')}</g>
  ${k.text(210, 524, 'INDUCTION FURNACE', { size: 15, fill: INK.graphite2, spacing: 1 })}`;
}
function castIronPlay(svg, k) {
  const { gsap, INK } = k, [q, qa] = sel(svg), hl = q('.ci-hl'), bls = qa('.ci-bl circle');
  const t = k.tl();
  if (k.reduced()) return t;
  pen(k, t, [q('.ci-lin .o')], { dur: 1.1 });
  t.from(q('.ci-lin path[fill^="url"]'), { opacity: 0, duration: .5 }, .7).from(qa('.ci-coil > g'), { opacity: 0, scale: .4, transformOrigin: '50% 50%', duration: .4, stagger: .03 }, .5)
    .from(qa('.ci-cell, :scope > path'), { opacity: 0, duration: .6 }, .9).from(q('.ci-tab'), { opacity: 0, x: 20, duration: .6 }, 1.0).from(q('.ci-b'), { opacity: 0, duration: .5 }, 1.3);
  // the melt stirs itself: two cells turning opposite ways; the coil's current runs up its turns
  qa('.ci-cell').forEach((c, i) => gsap.to(c, { rotation: i ? -360 : 360, svgOrigin: CI.cells[i].join(' '), duration: 11, ease: 'none', repeat: -1 }));
  const hot = qa('.ci-hot');
  gsap.timeline({ repeat: -1, delay: 1.2 }).to(hot, { opacity: .55, duration: .35, yoyo: true, repeat: 1, ease: 'sine.inOut', stagger: { each: .09, from: 'end', grid: [2, 8], axis: 1 } });
  // the recipe, line by line: the row lights up with its balloon
  const L = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: .4 });
  [0, 1, 2].forEach(j => {
    const b = svg.querySelector(`.ci-bl[data-n="${j + 1}"] circle`);
    L.to(hl, { y: 34 * j, duration: .45, ease: 'power2.inOut' }).to(b, { fill: INK.plum, fillOpacity: .3, duration: .3 }, '<').to(b, { fill: '#fff', fillOpacity: 1, duration: .3 }, '+=1.4');
  });
  return t;
}

/* ======================================================================================================
   grayIron — DETAIL A: the graphite flakes. The part: a machine base cut in section — its section fill is those same
   flakes. The motor on the head shakes it; the vibration runs into the base and dies out within a hand's width.
   ====================================================================================================== */
const GI = { c: [170, 192], r: 110, src: 420, y: 420 };
function grayIronDraw(k) {
  const { INK, W } = k, base = 'M290 360H552V480H290ZM322 388V452H520V388Z';
  return `
  <defs>${texPattern(k, 'grayIron-flk', 'gray', 46, 21)}</defs>
  ${detail(k, 'grayIron-d', ...GI.c, GI.r, micro(k, 'gray', ...GI.c, GI.r, 41), { label: 'DETAIL A · GRAPHITE FLAKES', sub: '×100' })}
  ${marker(k, 312, 468, GI.c[0] + GI.r * .62, GI.c[1] + GI.r * .79)}
  <g class="gi-base"><path d="${base}" fill="#fff" fill-rule="evenodd"/><path d="${base}" fill="url(#grayIron-flk)" fill-rule="evenodd"/><path class="o" d="${base}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" fill-rule="evenodd"/>
    <path class="o" d="M300 480V492H332V480M510 480V492H542V480" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
  <line x1="270" y1="492" x2="560" y2="492" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="gi-head"><rect class="o" x="364" y="268" width="112" height="92" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <circle class="o" cx="${GI.src}" cy="312" r="28" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.center(GI.src - 40, 312, GI.src + 40, 312)}${k.center(GI.src, 274, GI.src, 350)}
    <g class="gi-rot"><circle cx="${GI.src}" cy="${312 - 18}" r="6" fill="${INK.hot}"/></g></g>
  <path class="gi-w" fill="none" stroke="${INK.red}" stroke-width="${W.med}" stroke-linejoin="round"/>
  <g class="gi-lab">${note(k, 540, 372, 540, 238, 'MACHINE BASE', { anchor: 'end', size: 16 })}${k.text(GI.src, 252, 'vibration in', { size: 14, fill: INK.red })}${k.text(512, 446, 'quiet', { size: 14, fill: INK.graphite2, anchor: 'end' })}</g>`;
}
function grayIronPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), w = q('.gi-w'), st = { ph: 0 };
  const render = () => { let d = ''; for (let x = 324; x <= 518; x += 3) { const u = Math.abs(x - GI.src), y = GI.y + 19 * Math.exp(-u / 38) * Math.sin(u * .17 - st.ph); d += `${d ? 'L' : 'M'}${x} ${f(y)}`; } w.setAttribute('d', d); };
  st.ph = 1.2; render();
  const t = k.tl();
  if (k.reduced()) return t;
  t.from(q('.dt'), { opacity: 0, scale: .85, transformOrigin: `${GI.c[0]}px ${GI.c[1]}px`, duration: .8, ease: 'back.out(1.5)' }, 0);
  pen(k, t, qa('.gi-base .o, .gi-head .o'), { at: .3, stagger: .12, dur: .8 });
  t.from(q('.gi-base path[fill^="url"]'), { opacity: 0, duration: .6 }, 1.0).from([q('.mk'), q('.gi-lab'), w], { opacity: 0, duration: .5, stagger: .15 }, 1.2);
  gsap.to(q('.gi-rot'), { rotation: 360, svgOrigin: `${GI.src} 312`, duration: .9, ease: 'none', repeat: -1 });
  gsap.to(st, { ph: '+=' + Math.PI * 2, duration: .9, ease: 'none', repeat: -1, onUpdate: render });
  return t;
}

/* ======================================================================================================
   ductileIron — the same iron, with a trace of magnesium: DETAIL A starts as gray iron (flakes); Mg goes in and every
   flake rounds up into a nodule (the white ring is ferrite). The part it makes: a crankshaft, turning below.
   ====================================================================================================== */
const DI = { c: [196, 206], r: 118, ck: { axis: 470, xs: [190, 410], ph: [0, 180], r: 30, pw: 40, ph2: 26, ww: 14, W: 76, c: 24, e: 14, mh: 34, ends: [80, 520] } };
function ductileIronDraw(k) {
  const { INK, W } = k, [cx, cy] = DI.c, r = DI.r;
  const pts = scatter(cx, cy, r + 10, 19, 27, 77), nod = TEX.nodules(pts, 5);
  const inner = `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="${k.hatch('stipple')}" opacity=".8"/>
    <g class="di-fl"><path d="${TEX.flakes(pts, 9)}" fill="${INK.graphite}"/></g>
    <g class="di-nd">${nod.map(([x, y, rr]) => `<g class="di-n" data-o="${f(x)} ${f(y)}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(rr + 4.5)}" fill="#fff"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${INK.graphite}"/></g>`).join('')}</g>`;
  return `
  ${detail(k, 'ductileIron-d', cx, cy, r, inner)}
  <g class="di-cap">${k.text(cx, cy + r + 26, 'DUCTILE (NODULAR) IRON', { size: 17, weight: 700, extra: 'class="di-c2"' })}${k.text(cx, cy + r + 26, 'GRAY IRON · FLAKES', { size: 17, weight: 700, fill: INK.graphite2, extra: 'class="di-c1" opacity="0"' })}</g>
  <g class="di-mg"><rect x="404" y="72" width="104" height="104" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.text(414, 94, '12', { size: 15, anchor: 'start', weight: 700 })}${k.text(456, 146, 'Mg', { size: 52, family: 'display', weight: 700, fill: INK.plum })}${k.text(456, 166, 'magnesium', { size: 13, fill: INK.graphite2 })}</g>
  <path class="di-ar" d="M402 150Q352 168 ${cx + r * .9} ${cy - r * .3}" fill="none" stroke="${INK.plum}" stroke-width="3.4" marker-end="url(#arr)"/>
  ${k.text(372, 194, 'a trace of Mg', { size: 15, fill: INK.plum, weight: 600 })}
  <g class="di-ck">${crankDraw(k, 'dck', DI.ck)}<rect x="520" y="${DI.ck.axis - 50}" width="12" height="100" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
  ${marker(k, 300, DI.ck.axis, cx + r * .55, cy + r * .84)}
  ${note(k, 470, DI.ck.axis - 30, 470, 386, 'CRANKSHAFT', { anchor: 'middle', size: 16 })}`;
}
function ductileIronPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), ns = qa('.di-n'), fl = q('.di-fl'), st = { a: 30 }, g = q('.di-ck');
  const render = () => crankSet(g, 'dck', DI.ck, st.a);
  render();
  gsap.set(fl, { opacity: 0 });
  const t = k.tl();
  if (k.reduced()) return t;
  t.from(q('.dt'), { opacity: 0, scale: .85, transformOrigin: `${DI.c[0]}px ${DI.c[1]}px`, duration: .8, ease: 'back.out(1.5)' }, 0)
    .from(g, { opacity: 0, y: 20, duration: .7 }, .3).from([q('.mk'), q('.k-leader')], { opacity: 0, duration: .5 }, 1.0);
  gsap.to(st, { a: 390, duration: 3.2, ease: 'none', repeat: -1, onUpdate: render });
  // gray → (Mg) → ductile: every flake rounds up into a nodule; then back, and again
  const c1 = q('.di-c1'), c2 = q('.di-c2'), mg = q('.di-mg'), ar = q('.di-ar');
  gsap.set(fl, { opacity: 1 }); gsap.set(ns, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }); gsap.set(c1, { opacity: 1 }); gsap.set(c2, { opacity: 0 }); gsap.set([mg, ar], { opacity: 0 });
  gsap.timeline({ repeat: -1, delay: 1.4, repeatDelay: .2 })
    .fromTo(mg, { opacity: 0, scale: .7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2)', immediateRender: false })
    .to(ar, { opacity: 1, duration: .4 })
    .to(fl, { opacity: 0, duration: .8 }, '+=.2')
    .to(ns, { scale: 1, opacity: 1, duration: .7, stagger: .03, ease: 'back.out(1.8)' }, '<.1')
    .to(c1, { opacity: 0, duration: .4 }, '<').to(c2, { opacity: 1, duration: .4 }, '<.2')
    .to([mg, ar], { opacity: 0, duration: .5 }, '+=2.2')
    .to(ns, { scale: 0, opacity: 0, duration: .5 }, '+=.6').to(fl, { opacity: 1, duration: .5 }, '<.1')
    .to(c2, { opacity: 0, duration: .4 }, '<').to(c1, { opacity: 1, duration: .4 }, '<.2');
  return t;
}

/* ======================================================================================================
   whiteIron — crusher rolls cut in section: each roll was cast against a chill, so its rim froze fast and white (no
   graphite — the columnar chill crystals), while its core stayed gray (flakes). The rolls turn and crush rock: the
   white rim is what takes the wear.
   ====================================================================================================== */
const WI = { cs: [[198, 330], [402, 330]], R: 92, ri: 68 };
function whiteIronDraw(k) {
  const { INK, W } = k, { R, ri } = WI;
  const rolls = WI.cs.map(([cx, cy], i) => {
    let streak = ''; for (let a = 0; a < 360; a += 7.5) streak += `M${f(cx + (ri + 3) * cs(a))} ${f(cy + (ri + 3) * sn(a))}L${f(cx + (R - 3) * cs(a + 2))} ${f(cy + (R - 3) * sn(a + 2))}`;
    return `<g class="wi-roll" data-i="${i}">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff"/>
      <g class="wi-rot"><circle cx="${cx}" cy="${cy}" r="${ri}" fill="url(#whiteIron-flk)"/><path d="${streak}" stroke="${INK.graphite3}" stroke-width="1.1"/>
        <circle cx="${cx}" cy="${cy}" r="20" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="20" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.med}"/><rect x="${cx - 5}" y="${cy - 25}" width="10" height="8" fill="#fff" stroke="${INK.graphite}" stroke-width="1.4"/></g>
      <circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" ${k.stroke.hidden}/>
      <circle class="o" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
      ${k.center(cx - R - 14, cy, cx + R + 14, cy)}${k.center(cx, cy - R - 14, cx, cy + R + 14)}</g>`;
  }).join('');
  const rock = (x, y, s, seed) => { const R2 = rng(seed); return `M${Array.from({ length: 7 }, (_, j) => { const a = j * 51.4 + R2() * 20, rr = s * (.75 + R2() * .4); return `${f(x + rr * cs(a))} ${f(y + rr * sn(a))}`; }).join('L')}Z`; };
  return `
  <defs>${texPattern(k, 'whiteIron-flk', 'gray', 40, 33)}</defs>
  ${rolls}
  <g class="wi-rocks">${[[292, 120, 21], [312, 92, 17], [288, 64, 19]].map(([x, y, s], j) => `<path class="wi-rk" d="${rock(x, y, s, 5 + j)}" fill="${k.hatch('stipple')}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}</g>
  <g class="wi-grav">${Array.from({ length: 7 }, (_, j) => `<path class="wi-gv" d="${rock(286 + (j % 4) * 9, 392 + Math.floor(j / 4) * 12, 4.5 + (j % 3), 20 + j)}" fill="${INK.graphite2}"/>`).join('')}</g>
  <g class="wi-lab">${note(k, WI.cs[0][0] - 64, WI.cs[0][1] - 62, 52, 120, 'CHILLED EDGE · WHITE', { size: 16, weight: 700 })}${note(k, WI.cs[1][0] + 38, WI.cs[1][1] + 20, 548, 520, 'GRAY CORE', { anchor: 'end', size: 16 })}${note(k, WI.cs[0][0] - 20, WI.cs[0][1] + 40, 52, 520, 'STEEL SHAFT', { size: 14 })}</g>
  ${k.text(300, 556, 'CRUSHER ROLLS', { size: 15, fill: INK.graphite2, spacing: 1 })}`;
}
function whiteIronPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), rots = qa('.wi-rot'), rks = qa('.wi-rk'), gvs = qa('.wi-gv');
  const t = k.tl();
  if (k.reduced()) { gsap.set(gvs, { opacity: 0 }); return t; }
  pen(k, t, qa('.wi-roll .o'), { stagger: .15, dur: .9 });
  t.from(qa('.wi-rot'), { opacity: 0, duration: .6, stagger: .15 }, .5).from(qa('.wi-lab .k-leader, :scope > text'), { opacity: 0, duration: .4, stagger: .12 }, 1.0);
  rots.forEach((r, i) => gsap.to(r, { rotation: i ? -360 : 360, svgOrigin: WI.cs[i].join(' '), duration: 7, ease: 'none', repeat: -1 }));
  // rock drops into the nip, is crushed, gravel falls out below; the next one follows
  gsap.set([...gvs, ...rks], { opacity: 0 });
  const L = gsap.timeline({ repeat: -1, delay: 1.4, repeatDelay: .2 });
  rks.forEach((rk, j) => {
    const at = j * 1.3;
    L.fromTo(rk, { y: -40, opacity: 0, scale: 1 }, { y: 0, opacity: 1, duration: .4, immediateRender: false }, at)
      .to(rk, { y: 300 - [120, 92, 64][j] - 10, duration: .7, ease: 'power2.in' }, at + .4)
      .to(rk, { scale: .25, opacity: 0, transformOrigin: '50% 50%', duration: .3 }, at + 1.05);
    gvs.forEach((g, n) => { if (n % 3 === j) L.fromTo(g, { y: -20, opacity: 0 }, { y: 120 + n * 6, opacity: 1, duration: .8, ease: 'power2.in', immediateRender: false }, at + 1.1).to(g, { opacity: 0, duration: .25 }, at + 1.75); });
  });
  return t;
}

/* ======================================================================================================
   cgi — DETAIL A: compacted (vermicular) graphite, short worms. The part: a brake drum cut in section A–A, its ring
   filled with those worms. The drum turns, the shoes press out, the rubbing heats the drum's inside — and CGI's high
   thermal conductivity carries the heat straight out through the ring.
   ====================================================================================================== */
const CG = { d: [140, 150], dr: 96, c: [384, 350], Ro: 140, Ri: 116 };
function cgiDraw(k) {
  const { INK, W } = k, [cx, cy] = CG.c, { Ro, Ri } = CG;
  const ring = `M${cx - Ro} ${cy}a${Ro} ${Ro} 0 1 0 ${2 * Ro} 0a${Ro} ${Ro} 0 1 0 ${-2 * Ro} 0ZM${cx - Ri} ${cy}a${Ri} ${Ri} 0 1 1 ${2 * Ri} 0a${Ri} ${Ri} 0 1 1 ${-2 * Ri} 0Z`;
  const arcBand = (a0, a1, r0, r1) => `M${f(cx + r1 * cs(a0))} ${f(cy + r1 * sn(a0))}A${r1} ${r1} 0 0 1 ${f(cx + r1 * cs(a1))} ${f(cy + r1 * sn(a1))}L${f(cx + r0 * cs(a1))} ${f(cy + r0 * sn(a1))}A${r0} ${r0} 0 0 0 ${f(cx + r0 * cs(a0))} ${f(cy + r0 * sn(a0))}Z`;
  const shoe = (a0, a1, cls) => `<g class="${cls}"><path d="${arcBand(a0, a1, 92, 106)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><path d="${arcBand(a0 + 4, a1 - 4, 106, 114.5)}" fill="#fff"/><path d="${arcBand(a0 + 4, a1 - 4, 106, 114.5)}" fill="${k.hatch('plastic')}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>`;
  const heat = (a0, a1) => `<path class="cg-h" d="M${f(cx + 116.5 * cs(a0))} ${f(cy + 116.5 * sn(a0))}A116.5 116.5 0 0 1 ${f(cx + 116.5 * cs(a1))} ${f(cy + 116.5 * sn(a1))}" fill="none" stroke="${INK.hot}" stroke-width="6" opacity="0"/>`;
  return `
  <defs>${texPattern(k, 'cgi-wrm', 'cgi', 42, 13)}</defs>
  ${detail(k, 'cgi-d', ...CG.d, CG.dr, micro(k, 'cgi', ...CG.d, CG.dr, 29), { label: 'DETAIL A · WORMS', sub: 'compacted (vermicular) graphite' })}
  <g class="cg-drum"><path d="${ring}" fill="#fff" fill-rule="evenodd"/>
    <g class="cg-rot"><path d="${ring}" fill="url(#cgi-wrm)" fill-rule="evenodd"/>${Array.from({ length: 18 }, (_, j) => `<line x1="${f(cx + Ro * cs(j * 20))}" y1="${f(cy + Ro * sn(j * 20))}" x2="${f(cx + (Ro + 11) * cs(j * 20))}" y2="${f(cy + (Ro + 11) * sn(j * 20))}" stroke="${INK.graphite}" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <circle cx="${cx}" cy="${cy}" r="44" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${f(cx + 28 * cs(a))}" cy="${f(cy + 28 * sn(a))}" r="5.5" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="13" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
    <path class="o" d="${ring}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
  ${shoe(112, 248, 'cg-sl')}${shoe(-68, 68, 'cg-sr')}${heat(116, 244)}${heat(-64, 64)}
  ${k.center(cx - 160, cy, cx + 160, cy)}${k.center(cx, cy - 160, cx, cy + 160)}
  <rect x="${cx - 20}" y="${cy - 104}" width="40" height="14" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.med}"/><circle cx="${cx}" cy="${cy + 100}" r="9" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="cg-heat">${[-40, -15, 15, 40, 140, 165, 195, 220].map(a => `<g class="cg-ha" data-a="${a}"><line x1="${f(cx + 120 * cs(a))}" y1="${f(cy + 120 * sn(a))}" x2="${f(cx + 146 * cs(a))}" y2="${f(cy + 146 * sn(a))}" stroke="${INK.hot}" stroke-width="3.4" marker-end="url(#arr-hot)" opacity="0"/></g>`).join('')}</g>
  ${marker(k, f(cx + 128 * cs(210)), f(cy + 128 * sn(210)), CG.d[0] + CG.dr * .55, CG.d[1] + CG.dr * .84)}
  ${note(k, f(cx + 141 * cs(-48)), f(cy + 141 * sn(-48)), 548, 176, 'BRAKE DRUM', { anchor: 'end', size: 16 })}
  ${note(k, f(cx + 110 * cs(28)), f(cy + 110 * sn(28)), 548, 536, 'SHOE', { anchor: 'end', size: 15 })}`;
}
function cgiPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), [cx, cy] = CG.c;
  const t = k.tl();
  if (k.reduced()) { gsap.set(qa('.cg-h'), { opacity: .8 }); return t; }
  t.from(q('.dt'), { opacity: 0, scale: .85, transformOrigin: `${CG.d[0]}px ${CG.d[1]}px`, duration: .8, ease: 'back.out(1.5)' }, 0);
  pen(k, t, q('.cg-drum .o'), { at: .3, dur: 1 });
  t.from([q('.cg-rot'), q('.cg-sl'), q('.cg-sr')], { opacity: 0, duration: .6, stagger: .12 }, .9).from(qa('.mk, .k-leader'), { opacity: 0, duration: .4, stagger: .1 }, 1.2);
  gsap.to(q('.cg-rot'), { rotation: 360, svgOrigin: `${cx} ${cy}`, duration: 9, ease: 'none', repeat: -1 });
  // brake: shoes press out, the inside of the drum heats up, the heat runs out through the ring; release
  const h = qa('.cg-h'), ha = qa('.cg-ha line');
  const L = gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .9 });
  L.to(q('.cg-sl'), { x: -3, duration: .35, ease: 'power2.in' }).to(q('.cg-sr'), { x: 3, duration: .35, ease: 'power2.in' }, '<')
    .to(h, { opacity: .9, duration: .6 }, '-=.05');
  ha.forEach((a, j) => { const ang = +a.parentNode.dataset.a; L.fromTo(a, { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: 10 * cs(ang), y: 10 * sn(ang), duration: .5, immediateRender: false }, .7 + (j % 4) * .12).to(a, { opacity: 0, x: 24 * cs(ang), y: 24 * sn(ang), duration: .5 }, 1.3 + (j % 4) * .12); });
  L.to(h, { opacity: 0, duration: .8 }, 2.0).to([q('.cg-sl'), q('.cg-sr')], { x: 0, duration: .4, ease: 'power2.out' }, 2.0);
  return t;
}

/* ======================================================================================================
   malleableIron — white iron goes in, malleable iron comes out: castings ride a conveyor through a heat-treatment
   furnace (in section). Left of the soak zone they are white iron (DETAIL: no graphite), right of it malleable
   (DETAIL: temper-carbon clusters). The little chart is the treatment: heat · hold · cool.
   ====================================================================================================== */
const MI = { belt: 352, pitch: 120, cap: 'M0 0H14A14 14 0 0 1 42 0H56V-38H0Z' };
function malleableIronDraw(k) {
  const { INK, W } = k;
  const caps = (look) => Array.from({ length: 6 }, (_, j) => {
    const x = -80 + j * MI.pitch, R = rng(40 + j); let marks = '';
    if (look === 'w') for (let n = 0; n < 6; n++) { const px = x + 6 + R() * 44, py = MI.belt - 34 + R() * 20, a = R() * 180; marks += `M${f(px)} ${f(py)}l${f(7 * cs(a))} ${f(7 * sn(a))}`; }
    else marks = TEX.clusters([[x + 12, MI.belt - 26], [x + 30, MI.belt - 30], [x + 46, MI.belt - 24], [x + 22, MI.belt - 12]], 60 + j, .5);
    return `<g transform="translate(${x} ${MI.belt})"><path d="${MI.cap}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>${look === 'w' ? `<path d="${marks}" stroke="${INK.graphite2}" stroke-width="2.2" stroke-linecap="round"/>` : `<path d="${marks}" fill="${INK.graphite}"/>`}`;
  }).join('');
  const zig = (y) => { let d = `M196 ${y}`; for (let x = 196; x < 404; x += 13) d += `L${x + 6.5} ${y + 7}L${x + 13} ${y}`; return d; };
  const wall = 'M170 210H430V384H170ZM190 230V304H170V364H190V364H410V364H430V304H410V230Z';
  return `
  <clipPath id="malleableIron-w"><rect x="0" y="200" width="300" height="200"/></clipPath><clipPath id="malleableIron-m"><rect x="300" y="200" width="300" height="200"/></clipPath>
  ${detail(k, 'malleableIron-dw', 96, 116, 64, micro(k, 'white', 96, 116, 64, 15, { s: .8 }), { label: 'WHITE IRON', sub: 'no graphite', size: 15 })}
  ${detail(k, 'malleableIron-dm', 504, 116, 64, micro(k, 'malleable', 504, 116, 64, 25, { s: .8 }), { label: 'MALLEABLE IRON', sub: 'temper-carbon clusters', size: 15 })}
  <g class="mi-chart"><path d="M228 182V74M228 182H372" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}" marker-end="url(#arr)"/>
    <path class="mi-cv" d="M232 178L262 104H338L368 178" fill="none" stroke="${INK.red}" stroke-width="${W.med}" stroke-linejoin="round"/><circle class="mi-dot" r="5.5" fill="${INK.red}" cx="232" cy="178"/>
    ${k.text(300, 64, 'HEAT TREATMENT', { size: 15, weight: 700 })}${k.text(244, 130, 'heat', { size: 12, fill: INK.graphite2, anchor: 'end' })}${k.text(300, 96, 'hold', { size: 12, fill: INK.graphite2 })}${k.text(358, 130, 'cool', { size: 12, fill: INK.graphite2, anchor: 'start' })}${k.text(220, 80, 'T', { size: 13, fill: INK.graphite2, anchor: 'end', family: 'text' })}${k.text(372, 196, 'time', { size: 12, fill: INK.graphite2, anchor: 'end' })}</g>
  <g clip-path="url(#malleableIron-w)"><rect x="0" y="200" width="1" height="1" fill="#fff"/><g class="mi-run">${caps('w')}</g></g>
  <g clip-path="url(#malleableIron-m)"><rect x="300" y="200" width="1" height="1" fill="#fff"/><g class="mi-run">${caps('m')}</g></g>
  <g class="mi-fur"><path d="M170 210H430V384H170Z" fill="none"/><path d="M170 210H430V230H170ZM170 230H190V304H170ZM410 230H430V304H410ZM170 364H430V384H170Z" fill="#fff"/><path d="M170 210H430V230H170ZM170 230H190V304H170ZM410 230H430V304H410ZM170 364H430V384H170Z" fill="${k.hatch('refractory')}"/>
    <path class="o" d="M170 304V210H430V304M190 304V230H410V304M170 364H430V384H170Z" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="mi-zig" d="${zig(244)}" fill="none" stroke="${INK.hot}" stroke-width="${W.med}" stroke-linejoin="round"/></g>
  <line x1="300" y1="236" x2="300" y2="362" ${k.stroke.construct} stroke-dasharray="6 5"/>
  <line x1="40" y1="${MI.belt}" x2="560" y2="${MI.belt}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
  ${[60, 100, 140, 460, 500, 540].map(x => `<circle cx="${x}" cy="${MI.belt + 8}" r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}
  ${k.arrow(64, 420, 140, 420, { w: 5 })}${k.text(300, 412, 'HEAT-TREATMENT FURNACE', { size: 15, fill: INK.graphite2, spacing: 1 })}
  ${k.text(500, 412, 'bearing parts', { size: 14, fill: INK.graphite2 })}${k.text(500, 430, 'malleable, easily machined', { size: 13, fill: INK.graphite2 })}`;
}
function malleableIronPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), dot = q('.mi-dot'), cv = q('.mi-cv');
  const t = k.tl();
  if (k.reduced()) return t;
  t.from(qa('.dt'), { opacity: 0, scale: .85, transformOrigin: '50% 50%', duration: .7, stagger: .2, ease: 'back.out(1.5)' }, 0);
  pen(k, t, [q('.mi-fur .o'), cv], { at: .3, stagger: .2, dur: .9 });
  t.from([q('.mi-fur path[fill^="url"]'), q('.mi-zig')], { opacity: 0, duration: .5 }, .9).from(qa('.mi-run'), { opacity: 0, duration: .6 }, 1.0);
  // the line runs: castings go through; the dot rides the treatment curve as one casting crosses the furnace
  gsap.to(qa('.mi-run'), { x: MI.pitch, duration: 3.2, ease: 'none', repeat: -1 });
  gsap.to(q('.mi-zig'), { opacity: .45, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  const L = cv.getTotalLength(), st = { s: 0 };
  gsap.to(st, { s: L, duration: 240 / MI.pitch * 3.2, ease: 'none', repeat: -1, delay: .4, onUpdate: () => { const p = cv.getPointAtLength(st.s); dot.setAttribute('cx', f(p.x)); dot.setAttribute('cy', f(p.y)); } });
  return t;
}

/* ======================================================================================================
   alloyIrons — up to 35 % alloy in a ductile, gray or white iron. HIGH-CHROMIUM: the carbides and a tight oxide film —
   oxygen bounces off, grit skids over without biting. NICKEL: a magnet comes down and nothing jumps (nonmagnetic);
   the heater glows and its length L does not change (extremely low expansion).
   ====================================================================================================== */
function alloyIronsDraw(k) {
  const { INK, W } = k, x35 = 70 + 460 * .35;
  const o2 = (x, y) => `<g class="ai-o2"><circle cx="${x - 6}" cy="${y}" r="7" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/><circle cx="${x + 6}" cy="${y}" r="7" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.text(x, y - 14, 'O₂', { size: 12, fill: INK.graphite2, family: 'text' })}</g>`;
  return `
  <defs>${texPattern(k, 'alloyIrons-cr', 'alloy', 40, 17)}${texPattern(k, 'alloyIrons-ni', 'ductile', 40, 23)}</defs>
  <g class="ai-bar"><rect x="70" y="104" width="460" height="28" fill="#fff"/><rect x="${f(x35)}" y="104" width="${f(530 - x35)}" height="28" fill="${k.hatch('iron')}" opacity=".7"/>
    <rect class="ai-al" x="70" y="104" width="${f(x35 - 70)}" height="28" fill="${INK.plum}"/>
    <rect x="70" y="104" width="460" height="28" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <line x1="${f(x35)}" y1="92" x2="${f(x35)}" y2="146" stroke="${INK.red}" stroke-width="${W.med}"/>${k.text(x35, 164, '35 %', { size: 18, fill: INK.red, weight: 700 })}
    ${k.text(70, 90, 'ALLOY: UP TO 35 %', { size: 17, weight: 700, fill: INK.plum, anchor: 'start' })}${k.text(530, 90, 'the rest: a ductile, gray or white iron', { size: 14, fill: INK.graphite2, anchor: 'end' })}
    ${k.text(70, 150, '0', { size: 12, fill: INK.graphite2 })}${k.text(530, 150, '100 %', { size: 12, fill: INK.graphite2, anchor: 'end' })}</g>
  <line x1="300" y1="196" x2="300" y2="540" stroke="${INK.graphite3}" stroke-width="${W.thin}" stroke-dasharray="3 6"/>
  <g class="ai-cr">${k.text(52, 216, 'HIGH-CHROMIUM', { size: 18, weight: 700, anchor: 'start' })}${k.text(52, 268, 'Cr', { size: 54, family: 'stencil', weight: 700, fill: INK.plum, anchor: 'start' })}${k.text(118, 252, 'oxidation +', { size: 14, anchor: 'start', fill: INK.graphite2 })}${k.text(118, 268, 'wear resistant', { size: 14, anchor: 'start', fill: INK.graphite2 })}
    <rect x="66" y="388" width="210" height="88" fill="#fff"/><rect x="66" y="388" width="210" height="88" fill="url(#alloyIrons-cr)"/><rect x="66" y="380" width="210" height="8" fill="${INK.plum}" opacity=".7"/>
    <rect class="o" x="66" y="380" width="210" height="96" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    ${o2(100, 320)}${o2(168, 296)}${o2(236, 326)}
    <path class="ai-grit" d="M60 366L74 358L84 366L78 376L64 376Z" fill="${INK.graphite}"/>
    ${note(k, 250, 384, 262, 520, 'OXIDE FILM', { anchor: 'end', size: 14 })}</g>
  <g class="ai-ni">${k.text(322, 216, 'NICKEL', { size: 18, weight: 700, anchor: 'start' })}${k.text(322, 268, 'Ni', { size: 54, family: 'stencil', weight: 700, fill: INK.plum, anchor: 'start' })}${k.text(384, 252, 'nonmagnetic ·', { size: 14, anchor: 'start', fill: INK.graphite2 })}${k.text(384, 268, 'very low expansion', { size: 14, anchor: 'start', fill: INK.graphite2 })}
    <g class="ai-mag"><path d="M396 292H486V352H466V312H416V352H396Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><rect x="396" y="340" width="20" height="12" fill="${INK.red}"/><rect x="466" y="340" width="20" height="12" fill="${INK.blue}"/>${k.text(406, 370, 'N', { size: 12, weight: 700 })}${k.text(476, 370, 'S', { size: 12, weight: 700 })}</g>
    <rect x="350" y="400" width="180" height="62" fill="#fff"/><rect x="350" y="400" width="180" height="62" fill="url(#alloyIrons-ni)"/><rect class="ai-warm" x="350" y="400" width="180" height="62" fill="${INK.hot}" opacity="0"/>
    <rect class="o" x="350" y="400" width="180" height="62" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <g class="ai-heat">${[376, 418, 460, 502].map(x => `<path d="M${x} 498c-6-6 6-10 0-16" fill="none" stroke="${INK.hot}" stroke-width="2.6" stroke-linecap="round"/>`).join('')}</g>
    <line x1="350" y1="466" x2="350" y2="528" stroke="${INK.graphite}" stroke-width="${k.W.hair}"/><line x1="530" y1="466" x2="530" y2="528" stroke="${INK.graphite}" stroke-width="${k.W.hair}"/>
    <line x1="350" y1="522" x2="530" y2="522" stroke="${INK.graphite}" stroke-width="${k.W.thin}" marker-start="url(#arr)" marker-end="url(#arr)"/>${k.text(440, 516, 'L', { size: 18, family: 'text', weight: 700 })}
    <g class="ai-same" opacity="0">${k.text(440, 548, 'L stays L', { size: 15, fill: INK.red, weight: 700 })}</g><g class="ai-nop" opacity="0">${k.text(544, 330, 'no pull', { size: 15, fill: INK.red, weight: 700, anchor: 'end' })}</g></g>`;
}
function alloyIronsPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), o2 = qa('.ai-o2');
  const t = k.tl();
  if (k.reduced()) return t;
  t.from(q('.ai-al'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'power2.out' }, .3).from(q('.ai-bar'), { opacity: 0, duration: .5 }, 0);
  pen(k, t, qa('.ai-cr .o, .ai-ni .o'), { at: .5, stagger: .2, dur: .8 });
  t.from([q('.ai-cr'), q('.ai-ni')], { opacity: 0, duration: .6, stagger: .2 }, .6);
  // Cr: oxygen arrives, bounces off the film; grit skids over the surface
  const C = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .8 });
  o2.forEach((m, j) => { const yy = [320, 296, 326][j]; C.fromTo(m, { y: -40, x: 0, opacity: 0 }, { y: 366 - 7 - yy, opacity: 1, duration: .8, ease: 'power2.in', immediateRender: false }, j * .35).to(m, { y: -30, x: (j - 1) * 30, opacity: 0, duration: .9, ease: 'power2.out' }, j * .35 + .8); });
  C.fromTo(q('.ai-grit'), { x: 0, rotation: 0, opacity: 0 }, { x: 200, rotation: 200, svgOrigin: '72 368', opacity: 1, duration: 1.4, ease: 'none', immediateRender: false }, 1.6).to(q('.ai-grit'), { opacity: 0, duration: .2 }, 2.9);
  // Ni: the magnet comes down — nothing jumps; then the heater — L stays L
  const N = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: .6 });
  N.to(q('.ai-mag'), { y: 24, duration: .8, ease: 'power2.inOut' }).to(q('.ai-nop'), { opacity: 1, duration: .3 })
    .to(q('.ai-mag'), { y: 0, duration: .7, ease: 'power2.inOut' }, '+=1').to(q('.ai-nop'), { opacity: 0, duration: .3 }, '<')
    .to(q('.ai-heat'), { opacity: 1, duration: .1 }).fromTo(q('.ai-warm'), { opacity: 0 }, { opacity: .3, duration: 1, immediateRender: false })
    .to(q('.ai-same'), { opacity: 1, duration: .3 }).to([q('.ai-warm'), q('.ai-same')], { opacity: 0, duration: .6 }, '+=1.4');
  gsap.to(q('.ai-heat'), { y: -4, duration: .7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  return t;
}

/* ======================================================================================================
   crankshaft — four throws turning in an engine: the pins ride round (in elevation they rise and fall), the rods
   drive the pistons in the block (cut in section). The torque T twists the shaft about its axis — ductile iron's job.
   ====================================================================================================== */
const CK = { axis: 432, xs: [146, 254, 362, 470], ph: [0, 180, 180, 0], r: 34, pw: 30, ph2: 26, ww: 12, W: 74, c: 30, e: 16, mh: 30, ends: [70, 520], l: 138, top: 200, bot: 300 };
function crankshaftDraw(k) {
  const { INK, W } = k, { xs, top, bot } = CK;
  const block = `M92 ${top}H526V${bot}H92Z` + xs.map(x => `M${x - 34} ${top}V${bot}H${x + 34}V${top}Z`).join('');
  return `
  <g class="ck-block"><path d="M92 ${top - 24}H526V${top}H92Z" fill="#fff"/><path d="M92 ${top - 24}H526V${top}H92Z" fill="${k.hatch('alu')}"/><path class="o" d="M92 ${top - 24}H526V${top}H92Z" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <path d="${block}" fill="#fff" fill-rule="evenodd"/><path d="${block}" fill="${k.hatch('iron')}" fill-rule="evenodd"/><path class="o" d="${block}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" fill-rule="evenodd"/></g>
  ${xs.map(() => `<g class="ck-pist"><rect class="ck-ps" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><line class="ck-g1" stroke="${INK.graphite}" stroke-width="${W.thin}"/><line class="ck-g2" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g><polygon class="ck-rod" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><circle class="ck-gp" r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}
  <g class="ck-shaft">${crankDraw(k, 'ckc', CK)}<rect x="520" y="${CK.axis - 64}" width="12" height="128" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><rect x="52" y="${CK.axis - 9}" width="18" height="18" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
  <g class="ck-T"><path d="M58 ${CK.axis - 46}A16 46 0 0 0 58 ${CK.axis + 46}" fill="none" stroke="${INK.hot}" stroke-width="4" marker-end="url(#arr-hot)"/>${k.text(30, CK.axis - 40, 'T', { size: 24, fill: INK.hot, weight: 700, family: 'text' })}</g>
  ${k.text(58, CK.axis + 92, 'TORSION', { size: 15, fill: INK.red, weight: 700, anchor: 'start', spacing: 1 })}
  ${note(k, CK.xs[1] + 22, CK.axis + 20, 330, 540, 'CRANKSHAFT · DUCTILE IRON', { size: 16 })}
  ${k.text(310, 160, 'PISTONS · RODS · BLOCK (SECTION)', { size: 13, fill: INK.graphite2, spacing: .5 })}`;
}
function crankshaftPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), sh = q('.ck-shaft'), ps = qa('.ck-ps'), g1 = qa('.ck-g1'), g2 = qa('.ck-g2'), rods = qa('.ck-rod'), gps = qa('.ck-gp');
  const st = { a: 24 };
  const render = () => {
    crankSet(sh, 'ckc', CK, st.a);
    CK.xs.forEach((x, i) => {
      const a = st.a + CK.ph[i], yp = CK.axis - CK.r * cs(a), yg = yp - Math.sqrt(CK.l ** 2 - (CK.r * sn(a)) ** 2);
      setR(ps[i], x - 32, yg - 32, 64, 54); setLn(g1[i], x - 32, yg - 22, x + 32, yg - 22); setLn(g2[i], x - 32, yg - 15, x + 32, yg - 15);
      setP(rods[i], [[x - 15, yp], [x + 15, yp], [x + 9, yg], [x - 9, yg]]); gps[i].setAttribute('cx', x); gps[i].setAttribute('cy', f(yg));
    });
  };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  pen(k, t, qa('.ck-block .o'), { stagger: .2, dur: .9 });
  t.from(qa('.ck-block path[fill^="url"]'), { opacity: 0, duration: .5 }, .7).from([sh, ...qa('.ck-pist, .ck-rod, .ck-gp')], { opacity: 0, duration: .6, stagger: .03 }, .6)
    .from([q('.ck-T'), ...qa(':scope > text, .k-leader')], { opacity: 0, duration: .5, stagger: .1 }, 1.2);
  gsap.to(st, { a: 24 + 360, duration: 2.6, ease: 'none', repeat: -1, onUpdate: render });
  gsap.to(q('.ck-T'), { opacity: .45, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
  return t;
}
function setLn(el, x1, y1, x2, y2) { if (!el) return; el.setAttribute('x1', f(x1)); el.setAttribute('y1', f(y1)); el.setAttribute('x2', f(x2)); el.setAttribute('y2', f(y2)); }

export default {
  irons: { draw: ironsDraw, play: ironsPlay },
  castIron: { draw: castIronDraw, play: castIronPlay },
  grayIron: { draw: grayIronDraw, play: grayIronPlay },
  ductileIron: { draw: ductileIronDraw, play: ductileIronPlay },
  whiteIron: { draw: whiteIronDraw, play: whiteIronPlay },
  cgi: { draw: cgiDraw, play: cgiPlay },
  malleableIron: { draw: malleableIronDraw, play: malleableIronPlay },
  alloyIrons: { draw: alloyIronsDraw, play: alloyIronsPlay },
  crankshaft: { draw: crankshaftDraw, play: crankshaftPlay }
};
