// Illustrated scenes — bend (L3 · sheet metal bending): formingStates · sheetGauge · stockShapes · solidTree · stamping ·
// neutralAxis ★ · flatLength · kFactor · relief · bendRadius · vBend · airBend · edgeBend · springback · flanging · hemming ·
// rollForm · contRoll · tube. Contract and look: STYLE.md · names and captions: world/scenes/info.js · facts: docs/COURSE.md.
// The workpiece is the zone colour (INK.violet) with a graphite edge (a thin section drawn solid, as drawings do);
// tools are hatched sections; tension is safety orange, compression blue. Sheets are real profiles (legs + inside radius
// + thickness) from walk()/band() below, recomputed as they bend, so the radius, the thickness and the neutral axis stay true.

/* ======================================================================================================
   shared geometry: a sheet's mid-line as straight runs and arcs, offset to its two surfaces
   ====================================================================================================== */
const D2R = Math.PI / 180;
const f = v => Math.round(v * 10) / 10;
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const cs = a => Math.cos(a * D2R), sn = a => Math.sin(a * D2R);
/** walk a mid-line from (x, y), heading h (deg: 0 = +x, 90 = down the page) through segs [{ L }, { r, a }]
 *  (a in deg, + turns clockwise on the page), drawn at offset o (+ = to the right of travel). → { d, x, y, h } (end state) */
function walk(x, y, h, segs, o = 0) {
  let nx = -sn(h), ny = cs(h);
  let d = `M${f(x + nx * o)} ${f(y + ny * o)}`;
  for (const s of segs) {
    if (s.L !== undefined) {
      x += cs(h) * s.L; y += sn(h) * s.L;
      d += `L${f(x + nx * o)} ${f(y + ny * o)}`;
    } else if (Math.abs(s.a) > 1e-3) {
      const g = s.a > 0 ? 1 : -1, cx = x + g * s.r * nx, cy = y + g * s.r * ny;
      h += s.a; nx = -sn(h); ny = cs(h);
      x = cx - g * s.r * nx; y = cy - g * s.r * ny;
      const rad = Math.abs(s.r - g * o);
      d += rad < .05 ? `L${f(x + nx * o)} ${f(y + ny * o)}` : `A${f(rad)} ${f(rad)} 0 ${Math.abs(s.a) > 180 ? 1 : 0} ${g > 0 ? 1 : 0} ${f(x + nx * o)} ${f(y + ny * o)}`;
    }
  }
  return { d, x, y, h };
}
const revSegs = segs => segs.slice().reverse().map(s => s.L !== undefined ? s : { r: s.r, a: -s.a });
/** the closed region between offsets o1 and o2 of a mid-line (a sheet: o1 = T/2, o2 = −T/2) */
function band(x, y, h, segs, o1, o2) {
  const a = walk(x, y, h, segs, o1), b = walk(a.x, a.y, a.h + 180, revSegs(segs), -o2);
  return a.d + 'L' + b.d.slice(1) + 'Z';
}
/** a bent sheet profile — legs + inside radius + thickness: the outline of thickness T about the mid-line segs */
const sheetD = (x, y, h, segs, T) => band(x, y, h, segs, T / 2, -T / 2);
/** the point (and heading, and normal) s along a mid-line */
function pose(x, y, h, segs, s) {
  for (const g of segs) {
    if (s <= 1e-6) break;
    if (g.L !== undefined) { const l = Math.min(s, g.L); x += cs(h) * l; y += sn(h) * l; s -= l; continue; }
    const len = g.r * Math.abs(g.a) * D2R, l = Math.min(s, len);
    if (l > 0) {
      const sg = g.a > 0 ? 1 : -1, cx = x - sg * g.r * sn(h), cy = y + sg * g.r * cs(h);
      h += sg * l / g.r / D2R; x = cx + sg * g.r * sn(h); y = cy - sg * g.r * cs(h);
    }
    s -= l;
  }
  return { x, y, h, nx: -sn(h), ny: cs(h) };
}
const segLen = segs => segs.reduce((a, s) => a + (s.L !== undefined ? s.L : s.r * Math.abs(s.a) * D2R), 0);
/** a V: legs at alpha° to the horizontal, mid-line arc radius r whose lowest point is (cx, ym), total mid-line length L */
function vSegs(cx, ym, alpha, L, r) {
  const leg = Math.max(0, L / 2 - r * alpha * D2R);
  const b = walk(cx, ym, 180, [{ r, a: alpha }, { L: leg }]);
  return { x: b.x, y: b.y, h: b.h + 180, segs: [{ L: leg }, { r, a: -2 * alpha }, { L: leg }] };
}
/** V-die physics: a sheet (T, mid radius r) resting on shoulders half-width hw at dieTop, its legs at alpha° → arc low point */
function vLow(cx, dieTop, hw, T, r, alpha) {
  const sx = cx - hw + T / 2 * sn(alpha), sy = dieTop - T / 2 * cs(alpha);
  const vy = sy + (cx - sx) * Math.tan(alpha * D2R);
  return vy - r * (1 / cs(alpha) - 1);
}
/** the alpha at which the punch tip (touching the inner surface) sits at tipY — bisection on vLow (monotonic) */
function vAlpha(cx, dieTop, hw, T, r, tipY, max = 45) {
  if (vLow(cx, dieTop, hw, T, r, 0) - T / 2 >= tipY) return 0;
  let lo = 0, hi = max;
  if (vLow(cx, dieTop, hw, T, r, hi) - T / 2 <= tipY) return hi;
  for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (vLow(cx, dieTop, hw, T, r, m) - T / 2 < tipY) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/* ---------- drawing bits ---------- */
/** a drawn tool in section: white knock-out · hatch · thick outline (play() pens `.o`, inks `.h`) */
function tool(k, d, mat, cls = '', extra = '') {
  return `<g class="${cls}" ${extra}><path d="${d}" fill="#fff"/><path class="h" d="${d}" fill="${k.hatch(mat)}"/><path class="o" d="${d}" fill="none" stroke="${k.INK.graphite}" stroke-width="${k.W.thick}" stroke-linejoin="round"/></g>`;
}
/** the workpiece seen in section (thin: drawn solid in the zone colour, graphite edge) */
const work = (k, d, cls = '', extra = '') => `<path class="${cls}" d="${d}" fill="${k.INK.violet}" stroke="${k.INK.graphite}" stroke-width="2.2" stroke-linejoin="round" ${extra}/>`;
/** an arrow glyph pointing +x with its tip at the origin — place it with transform (see put()) */
const glyph = (color, len = 34, w = 3.4) => `<line x1="${-len}" y1="0" x2="-9" y2="0" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><path d="M0 0L-13 -6.5L-13 6.5Z" fill="${color}"/>`;
const put = (el, x, y, deg = 0) => el && el.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(deg)})`);
const setD = (el, d) => el && el.setAttribute('d', d);
const setL = (el, x1, y1, x2, y2) => { if (!el) return; el.setAttribute('x1', f(x1)); el.setAttribute('y1', f(y1)); el.setAttribute('x2', f(x2)); el.setAttribute('y2', f(y2)); };
const setXY = (el, x, y) => { if (!el) return; el.setAttribute('x', f(x)); el.setAttribute('y', f(y)); };
/** the plotter pen, dash-aware: solid strokes plot on; dashed ones (centre, hidden, construction) ink in so they keep their dashes */
function pen(k, t, els, { at = 0, stagger = .08, dur = .7 } = {}) {
  [].concat(els).flatMap(e => (e && e.length !== undefined && !e.tagName ? [...e] : [e])).filter(Boolean).forEach((el, i) => {
    if (el.getAttribute('stroke-dasharray') || el.tagName === 'g' || el.tagName === 'text') t.from(el, { opacity: 0, duration: Math.max(.3, dur * .6), ease: 'power1.out' }, at + i * stagger);
    else { if (el.getAttribute('marker-start') || el.getAttribute('marker-end')) t.from(el, { opacity: 0, duration: .12 }, at + i * stagger); k.plot(t, el, { at: at + i * stagger, dur }); }
  });
  return t;
}
/** a live dimension (built once, moved with setDim): extension lines, dimension line with arrows, the label */
function dimEl(k, cls, { color = k.INK.graphite, label = '', size = 18, family = 'dim', weight = 600 } = {}) {
  const mk = color === k.INK.red ? 'arr-red' : color === k.INK.blue ? 'arr-blue' : 'arr';
  return `<g class="${cls}"><line class="e1" stroke="${color}" stroke-width="${k.W.hair}"/><line class="e2" stroke="${color}" stroke-width="${k.W.hair}"/><line class="dl" stroke="${color}" stroke-width="${k.W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${k.text(0, 0, label, { size, fill: color, family, weight, extra: 'class="lb"' })}</g>`;
}
/** move a live dimension between two points (off = distance of the dim line, sign picks the side) */
function setDim(g, x1, y1, x2, y2, off, { text, gap = 8 } = {}) {
  if (!g) return;
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a), s = Math.sign(off) || 1;
  const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
  const [e1, e2, dl, lb] = g.children;
  setL(e1, x1 + nx * 5 * s, y1 + ny * 5 * s, ax + nx * 7 * s, ay + ny * 7 * s);
  setL(e2, x2 + nx * 5 * s, y2 + ny * 5 * s, bx + nx * 7 * s, by + ny * 7 * s);
  setL(dl, ax, ay, bx, by);
  if (lb) { setXY(lb, (ax + bx) / 2 + nx * s * gap, (ay + by) / 2 + ny * s * gap + 6); if (text !== undefined) lb.textContent = text; }
}

/** a note: text sitting above the start of a straight leader that ends on the feature (keeps labels inside the sheet) */
function note(k, x, y, tx, ty, label, { color = k.INK.graphite, size = 16, anchor = 'start', dot = false, family = 'dim', weight = 600 } = {}) {
  const mk = dot ? 'dot' : color === k.INK.red ? 'arr-red' : color === k.INK.blue ? 'arr-blue' : 'arr';
  return `<g class="k-leader"><line x1="${f(tx)}" y1="${f(ty)}" x2="${f(x)}" y2="${f(y)}" stroke="${color}" stroke-width="${k.W.thin}" marker-end="url(#${mk})"/>${k.text(tx, ty - 7, label, { size, fill: color, anchor, family, weight })}</g>`;
}

/* ======================================================================================================
   neutralAxis ★ — a thick sheet in section bends 90° and straightens again. The fibres across the bend fan out: the
   outside half (orange) stretches, the inside half (blue) squeezes, and the dash-dot neutral axis keeps its length.
   The readout (top right) unrolls the three lengths side by side: outside grows, inside shrinks, neutral never moves.
   ====================================================================================================== */
const NA = { x: 60, y: 420, L1: 150, Lb: 180, L2: 130, T: 64, N: 9, rx: 392, ry: [84, 116, 148], sc: .72 };
const naSegs = phi => { const a = Math.max(phi, .02); return [{ L: NA.L1 }, { r: NA.Lb / (a * D2R), a: -a }, { L: NA.L2 }]; };
function naGeo(phi) {
  const { x, y, L1, Lb, T } = NA, segs = naSegs(phi), h = T / 2;
  const b0 = pose(x, y, 0, segs, L1), b1 = pose(x, y, 0, segs, L1 + Lb), mid = pose(x, y, 0, segs, L1 + Lb / 2);
  const bendSeg = [segs[1]];
  return {
    segs, b0, b1, mid,
    out: sheetD(x, y, 0, segs, T),
    leg2: band(b1.x, b1.y, b1.h, [segs[2]], h, -h),
    ten: band(b0.x, b0.y, 0, bendSeg, h, 0),
    com: band(b0.x, b0.y, 0, bendSeg, 0, -h),
    sOut: walk(b0.x, b0.y, 0, bendSeg, h).d,
    sIn: walk(b0.x, b0.y, 0, bendSeg, -h).d,
    axis: walk(x - 16, y, 0, [{ L: NA.L1 + 16 }, segs[1], { L: NA.L2 + 16 }]).d,
    fib: Array.from({ length: NA.N }, (_, i) => pose(x, y, 0, segs, L1 + Lb * i / (NA.N - 1))),
    lOut: Lb + h * Math.max(phi, 0) * D2R, lIn: Lb - h * Math.max(phi, 0) * D2R
  };
}
function neutralAxisDraw(k) {
  const { INK, W } = k, { x, y, L1, T, rx, ry, sc, Lb } = NA, g = naGeo(90);
  const fib = g.fib.map(() => `<line class="na-fib" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`).join('');
  const n0 = rx + Lb * sc;
  return `
  <g class="na-read">
    <line class="na-r0" x1="${n0}" y1="${ry[0] - 16}" x2="${n0}" y2="${ry[2] + 14}" ${k.stroke.construct}/>
    <line class="na-ro" x1="${rx}" y1="${ry[0]}" x2="${rx + g.lOut * sc}" y2="${ry[0]}" stroke="${INK.hot}" stroke-width="9"/>
    ${k.dim(rx, ry[1], n0, ry[1], '', { off: 0, ext: false })}
    <line class="na-ri" x1="${rx}" y1="${ry[2]}" x2="${rx + g.lIn * sc}" y2="${ry[2]}" stroke="${INK.blue}" stroke-width="9"/>
    <line x1="${rx}" y1="${ry[0] - 16}" x2="${rx}" y2="${ry[2] + 14}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    ${k.text(rx - 10, ry[0] + 5, 'OUT', { size: 15, anchor: 'end', fill: INK.hot, weight: 700 })}
    ${k.text(rx - 10, ry[1] + 5, 'N.A.', { size: 15, anchor: 'end', weight: 700 })}
    ${k.text(rx - 10, ry[2] + 5, 'IN', { size: 15, anchor: 'end', fill: INK.blue, weight: 700 })}
    ${k.text((rx + n0) / 2, ry[1] - 7, 'L', { size: 17, weight: 700, family: 'text' })}
    ${k.text(n0 + 22, ry[1] + 6, '=', { size: 22, weight: 700, fill: INK.red })}
  </g>
  <rect class="na-h1" x="${x}" y="${y - T / 2}" width="${L1}" height="${T}" fill="${k.hatch('steel')}"/>
  <path class="na-h2" d="${g.leg2}" fill="${k.hatch('steel')}"/>
  <path class="na-ten" d="${g.ten}" fill="${INK.hot}" opacity=".26"/>
  <path class="na-com" d="${g.com}" fill="${INK.blue}" opacity=".22"/>
  <g class="na-fibs">${fib}</g>
  <path class="na-axis" d="${g.axis}" fill="none" ${k.stroke.center} stroke-width="2"/>
  <path class="na-out" d="${g.out}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
  <path class="na-sout" d="${g.sOut}" fill="none" stroke="${INK.hot}" stroke-width="4.6"/>
  <path class="na-sin" d="${g.sIn}" fill="none" stroke="${INK.blue}" stroke-width="4.6"/>
  <g class="na-ar">${[0, 1].map(() => `<g class="na-at">${glyph(INK.hot, 30, 3)}</g>`).join('')}${[0, 1].map(() => `<g class="na-ac">${glyph(INK.blue, 30, 3)}</g>`).join('')}</g>
  <g class="na-F" opacity="0"><g class="na-Fa">${glyph(INK.hot, 56, 6)}</g>${k.text(0, 0, 'F', { size: 21, fill: INK.hot, weight: 700, family: 'text', extra: 'class="na-Ft"' })}</g>
  ${k.text(0, 0, 'TENSION', { size: 19, fill: INK.hot, weight: 700, extra: 'class="na-lt"' })}
  ${k.text(0, 0, 'COMPRESSION', { size: 19, fill: INK.blue, weight: 700, extra: 'class="na-lc"' })}
  <g class="na-ln">${note(k, 118, y, 156, 520, 'NEUTRAL AXIS', { dot: true, size: 17, anchor: 'end' })}</g>
  <g class="na-tb">${k.titleBlock(366, 522, { title: 'NEUTRAL AXIS', no: 'SH 06', scale: '1:1', w: 190 })}</g>`;
}
function neutralAxisPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), fibs = qa('.na-fib'), at = qa('.na-at'), ac = qa('.na-ac');
  const st = { phi: 90 };
  const render = () => {
    const g = naGeo(st.phi), h = NA.T / 2;
    setD(q('.na-out'), g.out); setD(q('.na-h2'), g.leg2); setD(q('.na-ten'), g.ten); setD(q('.na-com'), g.com);
    setD(q('.na-sout'), g.sOut); setD(q('.na-sin'), g.sIn); setD(q('.na-axis'), g.axis);
    g.fib.forEach((p, i) => setL(fibs[i], p.x - p.nx * h, p.y - p.ny * h, p.x + p.nx * h, p.y + p.ny * h));
    // stretch arrows ride the outside surface pointing apart, squeeze arrows ride the inside pointing together
    const segs = g.segs, P = s => pose(NA.x, NA.y, 0, segs, NA.L1 + NA.Lb * s);
    [[.2, 180], [.8, 0]].forEach(([s, d], i) => { const p = P(s); put(at[i], p.x + p.nx * (h + 16) + cs(p.h + d) * 22, p.y + p.ny * (h + 16) + sn(p.h + d) * 22, p.h + d); });
    [[.18, 0], [.82, 180]].forEach(([s, d], i) => { const p = P(s); put(ac[i], p.x - p.nx * (h + 15) + cs(p.h + d) * 12, p.y - p.ny * (h + 15) + sn(p.h + d) * 12, p.h + d); });
    const m = g.mid;
    setXY(q('.na-lt'), m.x + m.nx * (h + 62), m.y + m.ny * (h + 62) + 6);
    setXY(q('.na-lc'), m.x - m.nx * (h + 58), m.y - m.ny * (h + 58) + 6);
    const e = g.b1, tip = pose(e.x, e.y, e.h, [{ L: NA.L2 - 12 }], NA.L2 - 12);
    put(q('.na-Fa'), tip.x + tip.nx * (h + 8), tip.y + tip.ny * (h + 8), tip.h - 90);
    setXY(q('.na-Ft'), tip.x + tip.nx * (h + 44) - cs(tip.h) * 22, tip.y + tip.ny * (h + 44) - sn(tip.h) * 22 + 7);
    q('.na-ro').setAttribute('x2', f(NA.rx + g.lOut * NA.sc)); q('.na-ri').setAttribute('x2', f(NA.rx + g.lIn * NA.sc));
  };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.phi = 0; render();
  pen(k, t, q('.na-out'), { at: 0, dur: 1.1 });
  t.from([q('.na-h1'), q('.na-h2')], { opacity: 0, duration: .5, stagger: .1 }, .55);
  pen(k, t, fibs, { at: .7, stagger: .05, dur: .3 });
  t.from([q('.na-ten'), q('.na-com')], { opacity: 0, duration: .6 }, 1.0);
  pen(k, t, [q('.na-axis'), q('.na-sout'), q('.na-sin')], { at: 1.0, stagger: .12, dur: .6 });
  pen(k, t, qa('.na-read line'), { at: 1.1, stagger: .05, dur: .45 });
  k.stamp(t, [...qa('.na-read text'), q('.na-lt'), q('.na-lc'), ...at, ...ac], { at: 1.5, stagger: .04 });
  t.from(q('.na-ln'), { opacity: 0, duration: .4 }, 1.7).from(q('.na-tb'), { opacity: 0, y: 8, duration: .5 }, 1.6);
  // bend it, hold, straighten it, rest: the outside stretches and the inside squeezes, the axis keeps its length
  const F = q('.na-F');
  gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .8 })
    .to(F, { opacity: 1, duration: .3 })
    .to(st, { phi: 90, duration: 2.3, ease: 'power2.inOut', onUpdate: render }, '<')
    .to(F, { opacity: 0, duration: .3 }, '-=.15')
    .to(st, { phi: 0, duration: 1.9, ease: 'power2.inOut', onUpdate: render }, '+=1.5');
  return t;
}

/* ======================================================================================================
   press-brake tooling: a V-die block, a 90° punch with a nose radius, a ram with hazard stripes
   ====================================================================================================== */
/** a 90° punch whose nose (lowest point) is at (cx, tip): nose radius rp, body width pw, height ph */
function punchD(cx, tip, pw, ph, rp) {
  const tx = rp * .7071, ty = tip - rp * (1 - .7071), ys = ty - (pw / 2 - tx);
  return `M${f(cx - pw / 2)} ${f(tip - ph)}L${f(cx - pw / 2)} ${f(ys)}L${f(cx - tx)} ${f(ty)}A${rp} ${rp} 0 0 0 ${f(cx + tx)} ${f(ty)}L${f(cx + pw / 2)} ${f(ys)}L${f(cx + pw / 2)} ${f(tip - ph)}Z`;
}
/** a V-die block: 90° groove of half-width hw at the top face y = top */
const vDieD = (cx, top, hw, bw, bh) => `M${f(cx - bw / 2)} ${f(top)}H${f(cx - hw)}L${f(cx)} ${f(top + hw)}L${f(cx + hw)} ${f(top)}H${f(cx + bw / 2)}V${f(top + bh)}H${f(cx - bw / 2)}Z`;
/** ground under a machine: a line with short hatch strokes */
const ground = (k, x1, x2, y) => `<g class="gnd"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${k.INK.graphite}" stroke-width="${k.W.med}"/>${Array.from({ length: Math.floor((x2 - x1) / 16) }, (_, i) => `<line x1="${x1 + 12 + i * 16}" y1="${y + 1}" x2="${x1 + 4 + i * 16}" y2="${y + 10}" stroke="${k.INK.graphite}" stroke-width="${k.W.thin}"/>`).join('')}</g>`;
/** a V-bend set: die, sheet on its shoulders, punch on a ram. P = { cx, top, hw, bw, bh, T, r, L, pw, ph, rw } */
function vSet(P) {
  const low = a => vLow(P.cx, P.top, P.hw, P.T, P.r, a);
  return {
    low, tipAt: a => low(a) - P.T / 2,
    alphaAt: (tip, max = 45) => vAlpha(P.cx, P.top, P.hw, P.T, P.r, tip, max),
    sheet: (a, r = P.r) => { const v = vSegs(P.cx, vLow(P.cx, P.top, P.hw, P.T, r, a), a, P.L, r); return sheetD(v.x, v.y, v.h, v.segs, P.T); }
  };
}
/** the ram: hazard-striped beam, the punch hanging under it, the force arrow above (cls = class prefix, scene = id prefix) */
function vRam(k, P, tip, cls, scene, { F = true, label = '', lab = '' } = {}) {
  const { INK } = k, top = tip - P.ph, rw = P.rw || 240, bh = 38;
  return `<g class="${cls}-ram">
    ${F ? `<g class="${cls}-F">${k.arrow(P.cx, top - bh - 46, P.cx, top - bh - 8)}${k.text(P.cx + 22, top - bh - 20, 'F', { size: 22, fill: INK.hot, weight: 700, family: 'text', anchor: 'start' })}</g>` : ''}
    <rect x="${P.cx - rw / 2}" y="${top - bh}" width="${rw}" height="${bh}" fill="#fff"/>
    ${k.hazard(P.cx - rw / 2, top - 14, rw, 14, `${scene}-${cls}`)}
    <rect class="o" x="${P.cx - rw / 2}" y="${top - bh}" width="${rw}" height="${bh}" fill="none" stroke="${INK.graphite}" stroke-width="${k.W.thick}"/>
    ${label ? k.text(P.cx - rw / 2 + 12, top - 20, label, { size: 14, anchor: 'start', weight: 700, spacing: 1 }) : ''}
    ${tool(k, punchD(P.cx, tip, P.pw, P.ph, P.r - P.T / 2), 'steel', `${cls}-punch`)}
    ${lab}
  </g>`;
}

/* ======================================================================================================
   vBend — the press brake: a flat blank slides onto the V-die, the punch comes down and folds it into the V
   (bottoming, 90°), the punch goes back up, the bent part is taken out and the next blank goes in.
   ====================================================================================================== */
const VB = { cx: 300, top: 352, hw: 112, bw: 380, bh: 150, T: 14, r: 22, L: 440, pw: 74, ph: 164, rw: 236 };
const vb = vSet(VB), VB_FULL = vb.tipAt(45), VB_UP = VB.top - VB.T - 52;
function vBendDraw(k) {
  const { INK } = k, P = VB;
  const vy = VB_FULL - (P.r - P.T / 2) * .4142; // the punch's virtual sharp = the part's inside corner
  return `
  ${ground(k, 96, 504, P.top + P.bh)}
  ${tool(k, vDieD(P.cx, P.top, P.hw, P.bw, P.bh), 'iron', 'vb-die')}
  <g class="vb-part">${work(k, vb.sheet(45), 'vb-sheet')}<g class="vb-ang" opacity="0">${k.angle(P.cx, vy, 62, -135, -45, '90°', { color: INK.red, size: 17 })}</g></g>
  ${vRam(k, P, VB_FULL, 'vb', 'vBend', { label: 'PRESS BRAKE', lab: `<g class="vb-lab">${k.leader(P.cx + 30, VB_FULL - 96, 446, VB_FULL - 150, 'PUNCH')}</g>` })}
  <g class="vb-lab">${k.leader(P.cx + 150, P.top + 60, 470, 452, 'V-DIE')}</g>`;
}
function vBendPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg);
  const st = { tip: VB_FULL, a: 45 };
  const render = () => { setD(q('.vb-sheet'), vb.sheet(st.a)); gsap.set(q('.vb-ram'), { y: st.tip - VB_FULL }); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.tip = VB_UP; st.a = 0; render();
  pen(k, t, [q('.vb-die .o'), ...qa('.vb-ram .o'), ...qa('.gnd line')], { at: 0, stagger: .08, dur: .8 });
  t.from(qa('.vb-die .h, .vb-ram .h'), { opacity: 0, duration: .5, stagger: .1 }, .6);
  t.from(q('.vb-part'), { x: -150, opacity: 0, duration: .7, ease: 'power2.out' }, .7);
  t.from(qa('.vb-lab .k-leader'), { opacity: 0, duration: .4, stagger: .15 }, 1.1).from(q('.vb-F'), { opacity: 0, y: -14, duration: .4 }, 1.2);
  // a press-brake cycle: down (it folds on contact), dwell, up, part out, next blank in
  const part = q('.vb-part'), ang = q('.vb-ang');
  gsap.timeline({ repeat: -1, delay: 1.7, repeatDelay: .3 })
    .to(st, { tip: VB_FULL, duration: 1.25, ease: 'power2.in', onUpdate: () => { st.a = vb.alphaAt(st.tip); render(); } })
    .to(st, { tip: VB_UP, duration: .9, ease: 'power2.inOut', onUpdate: render }, '+=.45')
    .to(ang, { opacity: 1, duration: .3 }, '-=.35')
    .to(part, { y: -26, duration: .35, ease: 'power2.out' }, '+=.5')
    .to(part, { x: 190, opacity: 0, duration: .6, ease: 'power2.in' })
    .set(ang, { opacity: 0 }).set(st, { a: 0, onComplete: render }).set(part, { x: -170, y: 0 })
    .to(part, { x: 0, opacity: 1, duration: .7, ease: 'power2.out' });
  return t;
}

/* ======================================================================================================
   airBend — two press-brake sets, same die: AIR BENDING stops the punch high (the sheet touches only the punch
   nose and the two shoulders — air under the bend), BOTTOMING drives it home into the V.
   ====================================================================================================== */
const AB = [158, 442].map(cx => ({ cx, top: 372, hw: 84, bw: 252, bh: 124, T: 11, r: 17, L: 276, pw: 56, ph: 104, rw: 190 }));
const ab = AB.map(vSet), AB_MAX = [27, 45], AB_UP = AB[0].top - AB[0].T - 66;
const AB_TIP = AB_MAX.map((a, i) => ab[i].tipAt(a));
function airBendDraw(k) {
  const { INK } = k;
  const air = (() => { const P = AB[0], yb = ab[0].low(AB_MAX[0]) + P.T / 2; return { yb, y0: P.top + P.hw }; })();
  return AB.map((P, i) => `
  <g class="ab-set" data-i="${i}">
    ${k.text(P.cx, 76, i ? 'BOTTOMING' : 'AIR BENDING', { size: 22, weight: 700, spacing: .5 })}
    ${ground(k, P.cx - 136, P.cx + 136, P.top + P.bh)}
    ${tool(k, vDieD(P.cx, P.top, P.hw, P.bw, P.bh), 'iron', 'ab-die')}
    ${work(k, ab[i].sheet(AB_MAX[i]), 'ab-sheet')}
    ${vRam(k, P, AB_TIP[i], `ab${i}`, 'airBend', { F: true })}
  </g>`).join('') + `
  <g class="ab-air" opacity="1">
    <path d="M${AB[0].cx - 30} ${f(air.y0 - 30)}L${AB[0].cx} ${air.y0}L${AB[0].cx + 30} ${f(air.y0 - 30)}" fill="${INK.cyan}" opacity=".45"/>
    ${k.dim(AB[0].cx, air.yb, AB[0].cx, air.y0, '', { off: 0, color: INK.blue, ext: false })}
    ${k.leader(AB[0].cx + 6, air.y0 - 16, AB[0].cx + 64, 470, 'AIR', { color: INK.blue, size: 18 })}
  </g>
  <g class="ab-home">${k.leader(AB[1].cx + 4, AB[1].top + AB[1].hw - 8, AB[1].cx + 64, 470, 'NO GAP', { size: 16 })}</g>`;
}
function airBendPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), sets = qa('.ab-set');
  const st = [{ tip: AB_TIP[0], a: AB_MAX[0] }, { tip: AB_TIP[1], a: AB_MAX[1] }];
  const render = () => sets.forEach((s, i) => { setD(s.querySelector('.ab-sheet'), ab[i].sheet(st[i].a)); gsap.set(s.querySelector(`.ab${i}-ram`), { y: st[i].tip - AB_TIP[i] }); });
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.forEach(s => { s.tip = AB_UP; s.a = 0; }); render();
  pen(k, t, qa('.ab-die .o, .ab-set .o, .gnd line'), { at: 0, stagger: .05, dur: .7 });
  t.from(qa('.ab-set .h'), { opacity: 0, duration: .5, stagger: .08 }, .5);
  t.from(qa('.ab-sheet'), { x: -110, opacity: 0, duration: .6, stagger: .12, ease: 'power2.out' }, .6);
  k.stamp(t, qa('.ab-set > text'), { at: .3 });
  t.set([q('.ab-air'), q('.ab-home')], { opacity: 0 }, 0);
  const sh = qa('.ab-sheet'), air = q('.ab-air'), home = q('.ab-home');
  const L = gsap.timeline({ repeat: -1, delay: 1.5, repeatDelay: .4 });
  [0, 1].forEach(i => L.to(st[i], { tip: AB_TIP[i], duration: i ? 1.35 : 1.0, ease: 'power2.in', onUpdate: () => { st[i].a = ab[i].alphaAt(st[i].tip, AB_MAX[i]); render(); } }, 0));
  L.to([air, home], { opacity: 1, duration: .4 }, 1.2)
    .to(st, { tip: AB_UP, duration: .9, ease: 'power2.inOut', onUpdate: render }, 3.0)
    .to([air, home], { opacity: 0, duration: .3 }, 3.0)
    .to(sh, { x: 150, opacity: 0, duration: .55, ease: 'power2.in' }, 4.0)
    .set(st, { a: 0, onComplete: render }, 4.6).set(sh, { x: -130 }, 4.6)
    .to(sh, { x: 0, opacity: 1, duration: .6, ease: 'power2.out' }, 4.65);
  return t;
}

/* ======================================================================================================
   springback — (1) in the tool the sheet takes the tool's included angle αb and radius Rb; (2) the punch leaves and
   the part opens: its included angle grows to α′ and its radius to R. The tool's angle stays behind in blue.
   ====================================================================================================== */
const SB = { cx: 300, top: 336, hw: 120, bw: 404, bh: 150, T: 15, r: 25, L: 470, pw: 86, ph: 124, rw: 270, a2: 38, r2: 38 };
const sb = vSet(SB), SB_FULL = sb.tipAt(45), SB_UP = SB.top - SB.T - 80;
function sbInner(a, r) { // the part's inner virtual sharp (where the inside faces of the legs meet) for legs at a°, mid radius r
  const ym = vLow(SB.cx, SB.top, SB.hw, SB.T, r, a), vy = ym + r * (1 / cs(a) - 1);
  return vy - SB.T / 2 / cs(a);
}
function springbackDraw(k) {
  const { INK } = k, P = SB, y1 = sbInner(45, P.r), y2 = sbInner(P.a2, P.r2);
  const arcs = [-1, 1].map(s => { // the legs opening: short red arcs at the tips, about the inner sharp
    const R = 214, a0 = s < 0 ? 180 + 45 : -45, a1 = s < 0 ? 180 + P.a2 : -P.a2;
    const p = a => [P.cx + R * cs(a), y1 + R * sn(a)];
    const [x0, y0] = p(a0), [x1, yy1] = p(a1);
    return `<path d="M${f(x0)} ${f(y0)}A${R} ${R} 0 0 ${s < 0 ? 0 : 1} ${f(x1)} ${f(yy1)}" fill="none" stroke="${INK.red}" stroke-width="${k.W.med}" marker-end="url(#arr-red)"/>`;
  }).join('');
  return `
  ${ground(k, 88, 512, P.top + P.bh)}
  ${tool(k, vDieD(P.cx, P.top, P.hw, P.bw, P.bh), 'iron', 'sb-die')}
  <path class="sb-ghost" d="${sb.sheet(45)}" fill="none" ${k.stroke.construct} stroke-width="1.6" stroke-dasharray="7 4"/>
  ${work(k, sb.sheet(P.a2, P.r2), 'sb-sheet')}
  <g class="sb-dim1">${k.angle(P.cx, y1, 92, -135, -45, '', { color: INK.blue })}${k.text(P.cx, y1 - 104, 'α<tspan font-size="13" dy="4">b</tspan>', { size: 21, fill: INK.blue, family: 'text', weight: 600 })}</g>
  <g class="sb-dim2">${k.angle(P.cx, y2, 150, -180 + P.a2, -P.a2, '', { color: INK.red })}${k.text(P.cx, y2 - 162, 'α′', { size: 23, fill: INK.red, family: 'text', weight: 700 })}${arcs}</g>
  <g class="sb-rad">${k.leader(P.cx - 8, y1 + 30, 150, 262, 'R<tspan font-size="12" dy="4">b</tspan>', { color: INK.blue, family: 'text', size: 18 })}${k.leader(P.cx + 10, sbInner(P.a2, P.r2) + 34, 452, 262, 'R', { color: INK.red, family: 'text', size: 18 })}</g>
  ${vRam(k, P, SB_FULL, 'sb', 'springback', { F: true })}`;
}
function springbackPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg);
  const st = { tip: SB_UP, a: SB.a2, r: SB.r2 };
  const render = () => { setD(q('.sb-sheet'), sb.sheet(st.a, st.r)); gsap.set(q('.sb-ram'), { y: st.tip - SB_FULL }); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.a = 0; st.r = SB.r; render();
  const after = [q('.sb-ghost'), q('.sb-dim2'), q('.sb-rad')], d1 = q('.sb-dim1');
  gsap.set([...after, d1], { opacity: 0 });
  pen(k, t, [q('.sb-die .o'), ...qa('.sb-ram .o'), ...qa('.gnd line')], { at: 0, stagger: .08, dur: .8 });
  t.from(qa('.sb-die .h, .sb-ram .h'), { opacity: 0, duration: .5 }, .6).from(q('.sb-sheet'), { x: -140, opacity: 0, duration: .7, ease: 'power2.out' }, .7);
  // (1) forced to the tool's angle and radius · (2) the punch leaves, the part opens up: α′ > αb, R > Rb
  gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .3 })
    .to(st, { tip: SB_FULL, duration: 1.25, ease: 'power2.in', onUpdate: () => { st.a = sb.alphaAt(st.tip); render(); } })
    .to(d1, { opacity: 1, duration: .35 }, '-=.2')
    .addLabel('up', '+=.7')
    .to(st, { tip: SB_UP, duration: 1.0, ease: 'power2.inOut', onUpdate: render }, 'up')
    .to(st, { a: SB.a2, r: SB.r2, duration: .75, ease: 'power3.out', onUpdate: render }, 'up+=.08')
    .to(q('.sb-ghost'), { opacity: 1, duration: .4 }, 'up+=.2')
    .to([q('.sb-dim2'), q('.sb-rad')], { opacity: 1, duration: .45, stagger: .25 }, 'up+=.55')
    .to([...after, d1], { opacity: 0, duration: .4 }, '+=2.2')
    .to(q('.sb-sheet'), { x: 180, opacity: 0, duration: .6, ease: 'power2.in' }, '<')
    .set(st, { a: 0, r: SB.r, onComplete: render }).set(q('.sb-sheet'), { x: -160 })
    .to(q('.sb-sheet'), { x: 0, opacity: 1, duration: .7, ease: 'power2.out' });
  return t;
}

/* ======================================================================================================
   edgeBend — wipe bending: the pressure pad (Fh) clamps the sheet on the die, then the punch (F) comes down past the
   die's edge and wipes the overhang down round the die radius to 90°. Physics: the punch's corner rides the flange.
   ====================================================================================================== */
const EB = { x0: 70, die: [112, 334, 330, 514], rc: 16, T: 14, Lf: 162, pad: [138, 316, 228, 316], pu: [350, 432], ph: 176, up: 228 };
const EBc = { cx: EB.die[1] - EB.rc, cy: EB.die[2] + EB.rc, rm: EB.rc + EB.T / 2 };
function ebTheta(yp) { // the punch's inner bottom corner (pu[0], yp) touches the flange's outer surface → bend angle
  const A = yp - EBc.cy, B = EB.pu[0] - EBc.cx, ro = EBc.rm + EB.T / 2, R = Math.hypot(A, B);
  if (yp <= EB.die[2] - EB.T || R < ro) return 0;
  return Math.max(0, Math.min(90, (Math.acos(-ro / R) - Math.atan2(B, A)) / D2R));
}
function ebSheet(th) {
  const y = EB.die[2] - EB.T / 2, run = EBc.cx - EB.x0, arc = EBc.rm * th * D2R;
  return sheetD(EB.x0, y, 0, [{ L: run }, { r: EBc.rm, a: th }, { L: EB.Lf - arc }], EB.T);
}
function edgeBendDraw(k) {
  const { INK } = k, [x1, x2, y1, y2] = EB.die, [px1, px2, py1, py2] = EB.pad, yb = 330 + EB.Lf + 4;
  const die = `M${x1} ${y1}H${x2 - EB.rc}A${EB.rc} ${EB.rc} 0 0 1 ${x2} ${y1 + EB.rc}V${y2}H${x1}Z`;
  const pu = `M${EB.pu[0] + 6} ${yb}H${EB.pu[1]}V${yb - EB.ph}H${EB.pu[0]}V${yb - 6}Q${EB.pu[0]} ${yb} ${EB.pu[0] + 6} ${yb}Z`;
  return `
  ${ground(k, 92, 520, y2)}
  ${tool(k, die, 'iron', 'eb-die')}
  ${work(k, ebSheet(90), 'eb-sheet')}
  <g class="eb-pad">${tool(k, `M${px1} ${py1 - 88}H${px2}V${py1}H${px1}Z`, 'plastic')}
    <g class="eb-Fh">${k.arrow(226, py1 - 164, 226, py1 - 98)}${k.text(248, py1 - 126, 'F<tspan font-size="13" dy="4">h</tspan>', { size: 22, fill: INK.hot, weight: 700, family: 'text', anchor: 'start' })}</g></g>
  <g class="eb-punch">${tool(k, pu, 'steel')}<g class="eb-lab">${note(k, EB.pu[1] - 4, yb - 70, 504, yb - 120, 'PUNCH', { anchor: 'middle' })}</g>
    <g class="eb-F">${k.arrow(391, yb - EB.ph - 76, 391, yb - EB.ph - 10)}${k.text(413, yb - EB.ph - 40, 'F', { size: 22, fill: INK.hot, weight: 700, family: 'text', anchor: 'start' })}</g></g>
  <g class="eb-lab">${note(k, 152, 244, 54, 156, 'PRESSURE PAD')}${note(k, 124, 430, 50, 404, 'DIE')}</g>`;
}
function edgeBendPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), yb = 330 + EB.Lf + 4;
  const st = { yp: yb, pad: 0, th: 90 };
  const render = () => { setD(q('.eb-sheet'), ebSheet(st.th)); gsap.set(q('.eb-punch'), { y: st.yp - yb }); gsap.set(q('.eb-pad'), { y: -st.pad }); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.yp = EB.up; st.pad = 64; st.th = 0; render();
  pen(k, t, [q('.eb-die .o'), q('.eb-pad .o'), q('.eb-punch .o'), ...qa('.gnd line')], { at: 0, stagger: .1, dur: .8 });
  t.from(qa('.eb-die .h, .eb-pad .h, .eb-punch .h'), { opacity: 0, duration: .5, stagger: .1 }, .6)
    .from(q('.eb-sheet'), { x: -130, opacity: 0, duration: .7, ease: 'power2.out' }, .7)
    .from(qa('.eb-lab .k-leader'), { opacity: 0, duration: .4, stagger: .12 }, 1.0)
    .from([q('.eb-Fh'), q('.eb-F')], { opacity: 0, duration: .4, stagger: .1 }, 1.1);
  const sheet = q('.eb-sheet');
  gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .3 })
    .to(st, { pad: 0, duration: .5, ease: 'power2.in', onUpdate: render })
    .to(st, { yp: yb, duration: 1.3, ease: 'power1.in', onUpdate: () => { st.th = Math.max(st.th, ebTheta(st.yp)); render(); } }, '+=.15')
    .to(st, { yp: EB.up, duration: .9, ease: 'power2.inOut', onUpdate: render }, '+=.45')
    .to(st, { pad: 64, duration: .5, ease: 'power2.inOut', onUpdate: render }, '-=.3')
    .to(sheet, { y: -40, duration: .4, ease: 'power2.out' })
    .to(sheet, { x: -170, opacity: 0, duration: .55, ease: 'power2.in' })
    .set(st, { th: 0, onComplete: render }).set(sheet, { x: -170, y: 0 })
    .to(sheet, { x: 0, opacity: 1, duration: .7, ease: 'power2.out' });
  return t;
}

/** a static dimension whose text never rotates (vertical dims carry the label beside the line) */
function dimS(k, x1, y1, x2, y2, off, label, { color = k.INK.graphite, size = 18, family = 'dim', weight = 600, cls = '', gap = 13 } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a), s = Math.sign(off) || 1;
  const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
  const mk = color === k.INK.red ? 'arr-red' : color === k.INK.blue ? 'arr-blue' : 'arr';
  const ext = (px, py, qx, qy) => `<line x1="${f(px + nx * 5 * s)}" y1="${f(py + ny * 5 * s)}" x2="${f(qx + nx * 7 * s)}" y2="${f(qy + ny * 7 * s)}" stroke="${color}" stroke-width="${k.W.hair}"/>`;
  const lx = (ax + bx) / 2 + nx * s * gap, ly = (ay + by) / 2 + ny * s * gap + size * .35;
  return `<g class="k-dim ${cls}">${off ? ext(x1, y1, ax, ay) + ext(x2, y2, bx, by) : ''}<line x1="${f(ax)}" y1="${f(ay)}" x2="${f(bx)}" y2="${f(by)}" stroke="${color}" stroke-width="${k.W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${label !== '' ? k.text(lx, ly, label, { size, fill: color, family, weight }) : ''}</g>`;
}
const sub = (a, b, size = 14) => `${a}<tspan font-size="${size}" dy="5">${b}</tspan><tspan dy="-5"></tspan>`;

/* ======================================================================================================
   kFactor — the slide's L in section, magnified: T is the thickness, t the distance from the INSIDE surface to the
   neutral axis, K = t / T. The axis slides between the middle and the inside (where it sits nearer the inside the
   ratio drops), the live ratio follows it. Inside the axis: compression (blue) · outside: tension (orange).
   ====================================================================================================== */
const KF = { x: 184, y: 92, T: 92, R: 52, L1: 270, L2: 284 };
const kfSegs = [{ L: KF.L1 }, { r: KF.R, a: -90 }, { L: KF.L2 }];
// the reference line is the INSIDE surface, walked down the vertical leg and along the horizontal one; + offsets go outward
function kfGeo(t) {
  const { x, y, T } = KF;
  return { out: band(x, y, 90, kfSegs, 0, T), blue: band(x, y, 90, kfSegs, 0, t), hot: band(x, y, 90, kfSegs, t, T), axis: walk(x, y - 18, 90, [{ L: KF.L1 + 18 }, kfSegs[1], { L: KF.L2 + 18 }], t).d };
}
function kFactorDraw(k) {
  const { INK, W } = k, { x, y, T } = KF, t = T * .4, g = kfGeo(t), rx = x + KF.R + KF.L2, iy = y + KF.L1 + KF.R;
  return `
  <path class="kf-blue" d="${g.blue}" fill="${INK.blue}" opacity=".2"/>
  <path class="kf-hot" d="${g.hot}" fill="${INK.hot}" opacity=".18"/>
  <path class="kf-out" d="${g.out}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
  <path class="kf-axis" d="${g.axis}" fill="none" ${k.stroke.center} stroke-width="2.4"/>
  <g class="kf-dims">${dimS(k, rx, iy, rx, iy + T, -34, 'T', { size: 24, family: 'text', weight: 700, gap: 16 })}</g>
  ${dimEl(k, 'kf-t', { color: INK.red, label: 't', family: 'text', size: 24, weight: 700 })}
  <g class="kf-f">${k.text(392, 214, `K = <tspan fill="${INK.red}">t</tspan> / T`, { size: 58, family: 'display', weight: 700 })}
    ${k.text(392, 268, '= 0.40', { size: 34, weight: 600, extra: 'class="kf-v"' })}</g>
  <g class="kf-nl"><line class="kf-nll" x1="476" y1="352" x2="440" y2="${iy + t}" stroke="${INK.graphite}" stroke-width="${W.thin}" marker-end="url(#dot)"/>${k.text(476, 344, 'NEUTRAL AXIS', { size: 17 })}</g>
  <g class="kf-in">${note(k, x + KF.R - KF.R * .7071 + 3, iy - KF.R + KF.R * .7071 - 3, 262, 344, 'INSIDE', { color: INK.blue, size: 16 })}</g>`;
}
function kFactorPlay(svg, k) {
  const { gsap } = k, [q] = sel(svg), { x, y, T } = KF, iy = y + KF.L1 + KF.R;
  const st = { t: T * .4 };
  const render = () => {
    const g = kfGeo(st.t);
    setD(q('.kf-out'), g.out); setD(q('.kf-blue'), g.blue); setD(q('.kf-hot'), g.hot); setD(q('.kf-axis'), g.axis);
    setDim(q('.kf-t'), x - st.t, y, x, y, -34, { gap: 14 });
    q('.kf-v').textContent = `= ${(st.t / T).toFixed(2)}`;
    q('.kf-nll').setAttribute('y2', f(iy + st.t));
  };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.t = T * .5; render();
  pen(k, t, q('.kf-out'), { dur: 1.2 });
  t.from([q('.kf-blue'), q('.kf-hot')], { opacity: 0, duration: .6, stagger: .15 }, .7);
  pen(k, t, [q('.kf-axis'), ...svg.querySelectorAll('.kf-dims line, .kf-t line')], { at: 1.0, stagger: .06, dur: .5 });
  k.stamp(t, [...svg.querySelectorAll('.kf-f text, .kf-dims text, .kf-t text')], { at: 1.4 });
  t.from([q('.kf-nl'), q('.kf-in')], { opacity: 0, duration: .4, stagger: .15 }, 1.6);
  // the axis slides toward the inside and back: t shrinks, K = t/T follows
  gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: .9, yoyo: true })
    .to(st, { t: T * .3, duration: 2.2, ease: 'power2.inOut', onUpdate: render });
  return t;
}

/* ======================================================================================================
   flatLength — the slide's two answers for the same L. Bend allowance: A and B are the straight legs, BA the neutral
   axis round the bend → Lt = A + B + BA. Bend deduction: A and B run to the outside corner (the virtual sharp), so
   unfolded they overlap by BD → Lt = A + B − BD. The part unfolds onto its flat pattern (blue) to prove it.
   ====================================================================================================== */
const FL = (() => { const o = { T: 16, rm: 38, A: 160, B: 250, xr: 522, yb: 322, yf: 476 }; o.BA = o.rm * Math.PI / 2; o.Lt = o.A + o.B + o.BA; o.xl = o.xr - o.Lt; o.vs = [o.xr - o.B - o.rm - o.T / 2, o.yb + o.T / 2]; o.ext = o.rm + o.T / 2; return o; })();
const flPath = u => sheetD(FL.xr, FL.yb + (FL.yf - FL.yb) * u, 180, [{ L: FL.B }, { r: FL.rm, a: 90 * (1 - u) }, { L: FL.A }], FL.T);
function flatLengthDraw(k) {
  const { INK } = k, [vx, vy] = FL.vs, top = FL.yb - FL.rm - FL.A, tA = FL.yb - FL.rm, bx = FL.xr - FL.B;
  const fy0 = FL.yf - FL.T / 2, fy1 = FL.yf + FL.T / 2, xa = FL.xl + FL.A, xb = xa + FL.BA, xd = FL.xr - FL.B - FL.ext, xe = FL.xl + FL.A + FL.ext;
  const arc = walk(bx, FL.yb, 180, [{ r: FL.rm, a: 90 }]).d;
  return `
  <g class="fl-eq">
    <g class="fl-eA">${k.text(160, 66, `${sub('L', 't')} = A + B + BA`, { size: 27, family: 'text', weight: 600 })}</g>
    <g class="fl-eD" opacity=".3">${k.text(440, 66, `${sub('L', 't')} = A + B − BD`, { size: 27, family: 'text', weight: 600 })}</g>
    <line class="fl-ul" x1="72" y1="84" x2="248" y2="84" stroke="${INK.violet}" stroke-width="4" stroke-linecap="round"/>
  </g>
  <path class="fl-ghost" d="${flPath(1)}" fill="none" ${k.stroke.construct} stroke-dasharray="7 4"/>
  ${work(k, flPath(0), 'fl-part')}
  <g class="fl-bA">${dimS(k, vx, top, vx, tA, 32, 'A', { size: 22, family: 'text', gap: 16 })}${dimS(k, bx, vy, FL.xr, vy, 32, 'B', { size: 22, family: 'text' })}
    <path d="${arc}" fill="none" stroke="${INK.red}" stroke-width="4.5" stroke-linecap="round"/>${note(k, bx - 24, FL.yb - 14, 330, 250, 'BA', { color: INK.red, size: 24, family: 'text', weight: 700 })}</g>
  <g class="fl-bD" opacity="0">${dimS(k, vx, top, vx, vy, 32, 'A', { size: 22, family: 'text', gap: 16 })}${dimS(k, vx, vy, FL.xr, vy, 32, 'B', { size: 22, family: 'text' })}
    <line x1="${vx}" y1="${tA - 30}" x2="${vx}" y2="${vy + 12}" ${k.stroke.construct}/><line x1="${vx - 12}" y1="${vy}" x2="${bx + 30}" y2="${vy}" ${k.stroke.construct}/>
    <circle cx="${vx}" cy="${vy}" r="5" fill="none" stroke="${INK.blue}" stroke-width="1.6"/></g>
  <g class="fl-fA">${[xa, xb].map(xx => `<line x1="${f(xx)}" y1="${fy0 - 6}" x2="${f(xx)}" y2="${fy1 + 6}" stroke="${INK.graphite}" stroke-width="1.3" stroke-dasharray="5 4"/>`).join('')}
    ${dimS(k, FL.xl, fy1, xa, fy1, 26, 'A', { family: 'text' })}${dimS(k, xa, fy1, xb, fy1, 26, 'BA', { color: INK.red, family: 'text', weight: 700 })}${dimS(k, xb, fy1, FL.xr, fy1, 26, 'B', { family: 'text' })}
    ${dimS(k, FL.xl, fy0, FL.xr, fy0, -34, sub('L', 't'), { color: INK.red, family: 'text', weight: 700, size: 20 })}</g>
  <g class="fl-fD" opacity="0">${dimS(k, FL.xl, fy0, xe, fy0, -32, 'A', { family: 'text' })}${dimS(k, xd, fy1, FL.xr, fy1, 26, 'B', { family: 'text' })}
    <rect x="${f(xd)}" y="${fy0 - 3}" width="${f(xe - xd)}" height="${FL.T + 6}" fill="${INK.red}" opacity=".22" stroke="${INK.red}" stroke-width="1.6"/>
    ${note(k, (xd + xe) / 2, fy0 - 4, 300, 410, 'BD', { color: INK.red, size: 24, family: 'text', weight: 700 })}</g>`;
}
function flatLengthPlay(svg, k) {
  const { gsap } = k, [q] = sel(svg), st = { u: 0 };
  const render = () => setD(q('.fl-part'), flPath(st.u));
  const t = k.tl();
  if (k.reduced()) { q('.fl-fA').setAttribute('opacity', 1); return t; }
  const [bA, bD, fA, fD, eA, eD, ul] = ['.fl-bA', '.fl-bD', '.fl-fA', '.fl-fD', '.fl-eA', '.fl-eD', '.fl-ul'].map(s => q(s));
  gsap.set([bA, bD, fA, fD], { opacity: 0 });
  t.from(q('.fl-part'), { opacity: 0, x: -30, duration: .8, ease: 'power2.out' }, 0).from(q('.fl-ghost'), { opacity: 0, duration: .6 }, .4);
  k.stamp(t, [eA, eD], { at: .3, stagger: .15 });
  t.from(ul, { scaleX: 0, transformOrigin: '0% 50%', duration: .5 }, .8);
  const L = gsap.timeline({ repeat: -1, delay: 1.2 });
  const phase = (on, off, bent, flat, dx) => L
    .to(on, { opacity: 1, duration: .35 }).to(off, { opacity: .3, duration: .35 }, '<').to(ul, { x: dx, duration: .6, ease: 'power2.inOut' }, '<')
    .to(bent, { opacity: 1, duration: .4 }, '<.1')
    .to(bent, { opacity: 0, duration: .3 }, '+=2.1')
    .to(st, { u: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: render })
    .to(flat, { opacity: 1, duration: .4 })
    .to(flat, { opacity: 0, duration: .3 }, '+=2.3')
    .to(st, { u: 0, duration: 1.2, ease: 'power2.inOut', onUpdate: render });
  phase(eA, eD, bA, fA, 0); phase(eD, eA, bD, fD, 280);
  return t;
}

/* ======================================================================================================
   bendRadius — a folding machine wraps the sheet round the clamping beam's nose; the nose radius IS the inside bend
   radius R. Three noses, smaller each time: the outside fibres stretch harder (orange deepens) and on the last one the
   outside cracks — too small a radius kinks it.
   ====================================================================================================== */
const BR = { x: 64, y: 410, T: 24, x0: 284, L2: 236, Rs: [62, 28, 5] };
function brGeo(R, phi) {
  const a = Math.max(phi, .01), rm = R + BR.T / 2, run = BR.x0 - BR.x, arc = rm * a * D2R;
  const segs = [{ L: run }, { r: rm, a: -a }, { L: BR.L2 - arc }];
  const b0 = pose(BR.x, BR.y, 0, segs, run), b1 = pose(BR.x, BR.y, 0, segs, run + arc), fb = pose(b1.x, b1.y, b1.h, [segs[2]], Math.max(0, segs[2].L - 104));
  return {
    segs, b0, arc, out: sheetD(BR.x, BR.y, 0, segs, BR.T), strain: band(b0.x, b0.y, 0, [segs[1]], 0, BR.T / 2),
    beam: band(fb.x, fb.y, fb.h, [{ L: 92 }], BR.T / 2 + 1, BR.T / 2 + 34),
    cracks: [.28, .52, .76].map(s => pose(b0.x, b0.y, 0, [segs[1]], arc * s))
  };
}
const brNose = R => { const x0 = BR.x0, yb = BR.y - BR.T / 2; return `M${BR.x - 10} ${yb}H${x0}A${R} ${R} 0 0 0 ${x0 + R} ${yb - R}L${x0 + R - 12} ${yb - R - 56}L${x0 - 50} 186H${BR.x - 10}Z`; };
function bendRadiusDraw(k) {
  const { INK } = k, g = brGeo(BR.Rs[2], 90);
  return `
  ${ground(k, 50, 290, 512)}
  ${tool(k, `M${BR.x - 10} ${BR.y + BR.T / 2}H${BR.x0 - 10}V512H${BR.x - 10}Z`, 'iron', 'br-low')}
  ${BR.Rs.map((R, i) => tool(k, brNose(R), 'steel', 'br-nose', `opacity="${i === 2 ? 1 : 0}"`)).join('')}
  <path class="br-beam" d="${g.beam}" fill="${k.hatch('plastic')}" stroke="${INK.graphite}" stroke-width="${k.W.med}"/>
  ${work(k, g.out, 'br-sheet')}
  <path class="br-strain" d="${g.strain}" fill="${INK.hot}" opacity=".66"/>
  <g class="br-cracks">${g.cracks.map(() => `<polyline class="br-ck" fill="none" stroke="${INK.red}" stroke-width="2.6" stroke-linejoin="round"/>`).join('')}</g>
  <g class="br-tag">${k.text(64, 96, 'INSIDE RADIUS', { size: 16, anchor: 'start', fill: INK.graphite2 })}${k.text(64, 140, 'R = 5', { size: 40, family: 'display', weight: 700, anchor: 'start', fill: INK.red, extra: 'class="br-R"' })}
    ${k.text(64, 166, 'too small: it cracks', { size: 17, anchor: 'start', fill: INK.red, weight: 600, extra: 'class="br-msg"' })}</g>
  <g class="br-note">${note(k, 309, 420, 400, 480, 'CRACK', { color: INK.red, size: 18, weight: 700, anchor: 'middle' })}</g>`;
}
function bendRadiusPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), noses = qa('.br-nose'), cks = qa('.br-ck');
  const st = { phi: 90, i: 2 };
  const render = () => {
    const R = BR.Rs[st.i], g = brGeo(R, st.phi), h = BR.T / 2;
    setD(q('.br-sheet'), g.out); setD(q('.br-strain'), g.strain); setD(q('.br-beam'), g.beam);
    g.cracks.forEach((p, j) => { const w = [[0, 0], [-3, 5], [3, 9], [-2, 13], [1, 15]]; cks[j].setAttribute('points', w.map(([a, d]) => `${f(p.x + p.nx * (h - d) + cs(p.h) * a)},${f(p.y + p.ny * (h - d) + sn(p.h) * a)}`).join(' ')); });
  };
  const stage = i => { st.i = i; const R = BR.Rs[i], e = (BR.T / 2) / (R + BR.T / 2); q('.br-R').textContent = `R = ${R}`; q('.br-R').setAttribute('fill', i === 2 ? k.INK.red : k.INK.graphite); q('.br-msg').textContent = i === 2 ? 'too small: it cracks' : i ? 'smaller: more stretch outside' : 'generous: it bends clean'; q('.br-msg').setAttribute('fill', i === 2 ? k.INK.red : k.INK.graphite2); q('.br-strain').style.opacity = (.12 + .8 * e).toFixed(2); render(); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.phi = 0; stage(0); gsap.set(noses, { opacity: (j) => j === 0 ? 1 : 0 }); gsap.set([q('.br-cracks'), q('.br-note')], { opacity: 0 });
  pen(k, t, [q('.br-low .o'), noses[0].querySelector('.o'), ...qa('.gnd line')], { stagger: .1, dur: .8 });
  t.from([q('.br-low .h'), noses[0].querySelector('.h')], { opacity: 0, duration: .5 }, .6).from([q('.br-sheet'), q('.br-beam')], { opacity: 0, duration: .5 }, .8);
  k.stamp(t, qa('.br-tag text'), { at: 1.0 });
  const L = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .4 });
  BR.Rs.forEach((R, i) => {
    if (i) L.to(noses, { opacity: (j) => j === i ? 1 : 0, duration: .4 }).call(stage, [i], '<.2');
    L.to(st, { phi: 90, duration: 1.4, ease: 'power2.inOut', onUpdate: render });
    if (i === 2) L.to([q('.br-cracks'), q('.br-note')], { opacity: 1, duration: .3 }, '-=.35');
    L.to(st, { phi: 0, duration: 1.0, ease: 'power2.inOut', onUpdate: render }, '+=1.3');
    if (i === 2) L.to([q('.br-cracks'), q('.br-note')], { opacity: 0, duration: .3 }, '<');
  });
  L.to(noses, { opacity: (j) => j === 0 ? 1 : 0, duration: .4 }).call(stage, [0], '<.2');
  return t;
}

/* ======================================================================================================
   hemming — three edge treatments in section: HEMMING folds the edge flat under itself, SEAMING hooks two edges
   into each other and presses the lock, CURLING rolls the edge into a tube.
   ====================================================================================================== */
const hemD = phi => sheetD(60, 136, 0, [{ L: 330 }, { r: 8.6, a: Math.max(phi, .01) }, { L: 96 }], 16);
const curlD = phi => { const a = Math.max(phi, .01); return sheetD(60, 470, 0, [{ L: 380 - 26 * a * D2R }, { r: 26, a }], 14); };
function hemmingDraw(k) {
  const { INK } = k;
  const A = sheetD(60, 320, 0, [{ L: 240 }, { r: 12, a: 180 }, { L: 45 }], 12), B = sheetD(470, 356, 180, [{ L: 215 }, { r: 12, a: 180 }, { L: 45 }], 12);
  return `
  ${['HEMMING', 'SEAMING', 'CURLING'].map((s, i) => k.text(52, [92, 262, 428][i], s, { size: 20, weight: 700, anchor: 'start', spacing: .6, extra: 'class="hm-t"' })).join('')}
  ${work(k, hemD(180), 'hm-hem')}
  ${work(k, A, 'hm-a')}<g class="hm-b">${work(k, B, '')}</g>
  <g class="hm-press">${tool(k, 'M232 250H324V314H232Z', 'steel')}${k.arrow(278, 212, 278, 244)}</g>
  ${work(k, curlD(300), 'hm-curl')}
  <g class="hm-n">${note(k, 394, 152, 470, 92, 'folded flat', { size: 16, anchor: 'middle' })}${note(k, 304, 340, 420, 282, 'locked', { size: 16, anchor: 'middle' })}${note(k, 290, 522, 380, 552, 'rolled', { size: 16, anchor: 'start' })}</g>`;
}
function hemmingPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), st = { hem: 180, curl: 300 };
  const render = () => { setD(q('.hm-hem'), hemD(st.hem)); setD(q('.hm-curl'), curlD(st.curl)); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.hem = 0; st.curl = 0; render();
  const B = q('.hm-b'), P = q('.hm-press'), N = q('.hm-n');
  gsap.set(B, { x: 80 }); gsap.set(P, { y: -44 }); gsap.set(N, { opacity: 0 });
  k.stamp(t, qa('.hm-t'), { stagger: .12 });
  t.from([q('.hm-hem'), q('.hm-a'), B, q('.hm-curl')], { opacity: 0, x: -40, duration: .7, stagger: .12, ease: 'power2.out' }, .2)
    .from(P, { opacity: 0, duration: .5 }, .6);
  gsap.timeline({ repeat: -1, delay: 1.3, repeatDelay: .5 })
    .to(st, { hem: 180, duration: 1.6, ease: 'power2.inOut', onUpdate: render })
    .to(B, { x: 0, duration: 1.0, ease: 'power2.inOut' }, '-=.2')
    .to(P, { y: 0, duration: .4, ease: 'power2.in' }).to(P, { y: -44, duration: .55, ease: 'power2.inOut' }, '+=.25')
    .to(st, { curl: 300, duration: 1.9, ease: 'power2.inOut', onUpdate: render }, '-=.5')
    .to(N, { opacity: 1, duration: .4 })
    .to(N, { opacity: 0, duration: .3 }, '+=1.6')
    .to(st, { hem: 0, curl: 0, duration: 1.1, ease: 'power2.inOut', onUpdate: render })
    .to(B, { x: 80, duration: .9, ease: 'power2.inOut' }, '<');
  return t;
}

/* ======================================================================================================
   rollForm — a slip roll (three rolls): the pinch rolls drive the flat sheet in, the bend roll behind them lifts it into
   one radius r, and it curls round the upper roll into a cylinder; then it slips off and the next sheet goes in.
   ====================================================================================================== */
const RF = { U: [280, 300], D: [280, 402], B: [390, 345.5], rr: 46, rb: 40, T: 10, y: 351, C: [280, 251], R: 100, Lt: 470, smax: 438 };
const rfD = s => sheetD(RF.U[0] - (RF.Lt - s), RF.y, 0, [{ L: RF.Lt - s }, { r: RF.R, a: -Math.max(s, .01) / RF.R / D2R }], RF.T);
/** a roll seen end-on: white disc, centre lines, a hub and three marks that turn with it */
function rollEnd(k, cx, cy, r, cls) {
  const { INK, W } = k;
  return `<g class="roll"><circle class="o" cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.center(cx - r - 12, cy, cx + r + 12, cy)}${k.center(cx, cy - r - 12, cx, cy + r + 12)}
    <g class="${cls}"><circle cx="${cx}" cy="${cy}" r="${f(r * .3)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>${[30, 150, 270].map(a => `<line x1="${f(cx + r * .46 * cs(a))}" y1="${f(cy + r * .46 * sn(a))}" x2="${f(cx + r * .82 * cs(a))}" y2="${f(cy + r * .82 * sn(a))}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linecap="round"/>`).join('')}</g></g>`;
}
function rollFormDraw(k) {
  const { INK } = k, [cx, cy] = RF.C, e = [cx + (RF.R - RF.T / 2) * cs(-50), cy + (RF.R - RF.T / 2) * sn(-50)];
  return `
  <clipPath id="rollForm-clip"><rect x="46" y="20" width="520" height="560"/></clipPath>
  <g clip-path="url(#rollForm-clip)">${work(k, rfD(RF.smax), 'rf-sheet')}</g>
  ${rollEnd(k, ...RF.U, RF.rr, 'rf-u')}${rollEnd(k, ...RF.D, RF.rr, 'rf-d')}${rollEnd(k, ...RF.B, RF.rb, 'rf-b')}
  <g class="rf-r"><line x1="${cx}" y1="${cy}" x2="${f(e[0])}" y2="${f(e[1])}" stroke="${INK.red}" stroke-width="${k.W.med}" marker-end="url(#arr-red)"/>${k.text(cx + 26, cy - 52, 'r', { size: 28, fill: INK.red, family: 'text', weight: 700 })}</g>
  <g class="rf-lab">${note(k, RF.B[0] + 30, RF.B[1] + 28, 470, 470, 'ADJUSTABLE ROLL', { anchor: 'middle', size: 16 })}${k.arrow(70, 392, 150, 392, { w: 5 })}</g>`;
}
function rollFormPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), st = { s: RF.smax };
  const spin = [['.rf-u', RF.U, -RF.rr], ['.rf-d', RF.D, RF.rr], ['.rf-b', RF.B, RF.rb]].map(([c, o, r]) => [q(c), `${o[0]} ${o[1]}`, r]);
  const render = () => { setD(q('.rf-sheet'), rfD(st.s)); spin.forEach(([el, o, r]) => gsap.set(el, { rotation: st.s / r / D2R, svgOrigin: o })); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.s = 0; render();
  pen(k, t, qa('.roll .o'), { stagger: .12, dur: .7 });
  t.from(qa('.roll line, .roll g'), { opacity: 0, duration: .4, stagger: .02 }, .5).from(q('.rf-sheet'), { opacity: 0, x: -60, duration: .7 }, .7)
    .from(q('.rf-lab'), { opacity: 0, duration: .4 }, 1.0).set(q('.rf-r'), { opacity: 0 }, 0);
  const sheet = q('.rf-sheet');
  gsap.timeline({ repeat: -1, delay: 1.4, repeatDelay: .3 })
    .to(st, { s: RF.smax, duration: 4.4, ease: 'power1.inOut', onUpdate: render })
    .to(q('.rf-r'), { opacity: 1, duration: .4 }, '-=.6')
    .to([sheet, q('.rf-r')], { opacity: 0, duration: .5 }, '+=1.4')
    .set(st, { s: 0, onComplete: render })
    .to(sheet, { opacity: 1, duration: .5 });
  return t;
}

/* ======================================================================================================
   contRoll — continuous roll forming. Above, the line in elevation: a long strip runs through five stands of rolls;
   below, each stand in section (projected down in blue): the same strip, bent a little more at every station, until
   the channel is finished. The strip's head runs through first; after that the line just keeps running.
   ====================================================================================================== */
const CR = { xs: [92, 196, 300, 404, 508], ty: 132, by: 220, r: 34, top: 178, bot: 184, th: [18, 36, 54, 72, 90], sy: 434 };
function crTheta(x) {
  const { xs, th } = CR;
  if (x <= xs[0] - 44) return 0;
  if (x <= xs[0]) return th[0] * (x - xs[0] + 44) / 44;
  for (let i = 0; i < 4; i++) if (x <= xs[i + 1]) return th[i] + (th[i + 1] - th[i]) * (x - xs[i]) / (xs[i + 1] - xs[i]);
  return 90;
}
const crProf = (cx, cy, th) => { const b = walk(cx, cy, 180, [{ L: 20 }, { r: 6, a: th }, { L: 22 }]); return { x: b.x, y: b.y, h: b.h + 180, segs: [{ L: 22 }, { r: 6, a: -th }, { L: 40 }, { r: 6, a: -th }, { L: 22 }] }; };
function crStation(k, cx, cy, th) {
  const p = crProf(cx, cy, th), T = 6, ends = o => { const e = walk(p.x, p.y, p.h, p.segs, o); return [[p.x - sn(p.h) * o, p.y + cs(p.h) * o], [e.x - sn(e.h) * o, e.y + cs(e.h) * o], e.d]; };
  const [l1, r1, d1] = ends(T / 2 + .8), [l2, r2, d2] = ends(-T / 2 - .8);
  const bot = `M${cx - 50} ${f(l1[1])}${d1.replace('M', 'L')}L${cx + 50} ${f(r1[1])}V${cy + 46}H${cx - 50}Z`;
  const top = `M${cx - 50} ${cy - 54}V${f(l2[1] - 1)}L${f(l2[0])} ${f(l2[1] - 1)}${d2.replace('M', 'L')}L${cx + 50} ${f(r2[1] - 1)}V${cy - 54}Z`;
  return `${tool(k, top, 'steel')}${tool(k, bot, 'iron')}${work(k, sheetD(p.x, p.y, p.h, p.segs, T), 'cr-p')}`;
}
function contRollDraw(k) {
  const { INK } = k, { xs, top, bot } = CR;
  let pts = `40,${bot} 560,${bot}`; for (let x = 560; x >= 40; x -= 4) pts += ` ${x},${f(top - 22 * sn(crTheta(x)))}`;
  return `
  <clipPath id="contRoll-clip"><rect class="cr-clip" x="40" y="96" width="520" height="130"/></clipPath>
  <g clip-path="url(#contRoll-clip)"><polygon points="${pts}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="2" stroke-linejoin="round"/>
    <g class="cr-ticks">${Array.from({ length: 18 }, (_, j) => `<line x1="${4 + j * 36}" y1="${top + 1.5}" x2="${4 + j * 36}" y2="${bot - 1.5}" stroke="#fff" stroke-width="2"/>`).join('')}</g></g>
  ${xs.map((x, i) => `<g class="cr-stand">${rollEnd(k, x, CR.ty, CR.r, 'cr-t')}${rollEnd(k, x, CR.by, CR.r, 'cr-b')}</g>`).join('')}
  <g class="cr-proj">${xs.map(x => `<line x1="${x}" y1="${CR.by + CR.r + 16}" x2="${x}" y2="${CR.sy - 62}" ${k.stroke.construct} stroke-dasharray="6 5"/>`).join('')}</g>
  ${xs.map((x, i) => `<g class="cr-st">${crStation(k, x, CR.sy, CR.th[i])}${k.text(x, CR.sy + 74, `#${i + 1}`, { size: 18, weight: 700 })}</g>`).join('')}
  <g class="cr-lab">${note(k, 50, top + 2, 48, 82, 'SHEET METAL', { size: 16 })}${note(k, 214, CR.ty - 22, 264, 72, 'ROLLER DIE', { size: 16 })}${k.text(300, 556, 'ROLL STATIONS', { size: 15, fill: INK.graphite2, spacing: 1 })}</g>`;
}
function contRollPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), stands = qa('.cr-st');
  const t = k.tl();
  if (k.reduced()) return t;
  pen(k, t, qa('.cr-stand .o'), { stagger: .05, dur: .6 });
  t.from(qa('.cr-stand line, .cr-stand g'), { opacity: 0, duration: .4 }, .4).from(q('.cr-proj'), { opacity: 0, duration: .5 }, .6).from(q('.cr-lab'), { opacity: 0, duration: .4 }, .7);
  // the head of the strip runs through the line: each station comes alive as it passes
  const run = 3.4, at0 = .9;
  t.fromTo(q('.cr-clip'), { attr: { width: 0 } }, { attr: { width: 520 }, duration: run, ease: 'none' }, at0);
  CR.xs.forEach((x, i) => t.from(stands[i], { opacity: 0, y: 14, duration: .45, ease: 'power2.out' }, at0 + run * (x - 40) / 520));
  // then it just keeps running: rolls turn, the strip slides, and a pulse walks the stations in order
  const per = 36 / 60;
  gsap.to(q('.cr-ticks'), { x: 36, duration: per, ease: 'none', repeat: -1 });
  qa('.cr-t').forEach((el, i) => gsap.to(el, { rotation: -360, svgOrigin: `${CR.xs[i]} ${CR.ty}`, duration: 2 * Math.PI * CR.r / 60, ease: 'none', repeat: -1 }));
  qa('.cr-b').forEach((el, i) => gsap.to(el, { rotation: 360, svgOrigin: `${CR.xs[i]} ${CR.by}`, duration: 2 * Math.PI * CR.r / 60, ease: 'none', repeat: -1 }));
  const P = gsap.timeline({ repeat: -1, delay: at0 + run + .6, repeatDelay: 1.2 });
  qa('.cr-p').forEach((el, i) => P.to(el, { scale: 1.12, transformOrigin: '50% 60%', duration: .32, yoyo: true, repeat: 1, ease: 'power2.inOut' }, i * .45));
  return t;
}

/* ======================================================================================================
   tube — rotary draw bending in plan, the tube cut open along its axis: the bend die (former) turns and draws the
   clamped tube round it while the mandrel, held still inside, keeps the wall from collapsing at the tangent point.
   The inset: the same bend with no mandrel — the inside wall buckles.
   ====================================================================================================== */
const TB = { O: [300, 262], R: 110, D: 44, w: 7, y: 372, s0: 250, Lc: 96 };
function tbGeo(phi) {
  const a = Math.max(phi, .01), s1 = TB.s0 - TB.R * a * D2R, segs = [{ L: s1 }, { r: TB.R, a: -a }, { L: TB.Lc }], x = TB.O[0] - s1, y = TB.y, h = TB.D / 2;
  return { wo: band(x, y, 0, segs, h - TB.w, h), wi: band(x, y, 0, segs, -h, -h + TB.w), balls: [15, 41].map(d => pose(x, y, 0, segs, s1 + d)) };
}
function tubeDraw(k) {
  const { INK, W } = k, [ox, oy] = TB.O, g = tbGeo(90), hi = TB.D / 2;
  const inset = (() => { // a 90° bend without a mandrel: the inside wall wrinkles
    const c = [96, 162], R = 50, d = 13;
    let wav = `M58 ${c[1] + R - d}H${c[0]}`;
    for (let i = 0; i <= 30; i++) { const a = 90 - i * 3, rr = R - d + (i > 2 && i < 28 ? 2.6 * Math.sin(i * 1.15) : 0); wav += `L${f(c[0] + rr * cs(a))} ${f(c[1] + rr * sn(a))}`; }
    wav += `V${c[1] - 52}`;
    return `<g class="tb-inset"><rect x="44" y="64" width="170" height="168" rx="6" fill="none" stroke="${INK.red}" stroke-width="1.3" stroke-dasharray="6 4"/>
      ${k.text(56, 88, 'NO MANDREL', { size: 15, anchor: 'start', fill: INK.red, weight: 700 })}
      <path d="M58 ${c[1] + R + d}H${c[0]}A${R + d} ${R + d} 0 0 0 ${c[0] + R + d} ${c[1]}V${c[1] - 52}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      <path d="${wav}" fill="none" stroke="${INK.red}" stroke-width="${W.med}" stroke-linejoin="round"/>
      ${k.center(52, c[1] + R, c[0], c[1] + R)}${note(k, c[0] + 26, c[1] + 26, 156, 222, 'BUCKLES', { color: INK.red, size: 15, anchor: 'middle' })}</g>`;
  })();
  return `
  ${inset}
  <g class="tb-die">${tool(k, `M${f(ox + Math.sqrt(87 * 87 - 59 * 59))} ${oy + 59}A87 87 0 1 0 ${ox} ${oy + 87}H${ox + 96}V${oy + 59}Z`, 'iron')}
    <circle cx="${ox}" cy="${oy}" r="26" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${[45, 135, 225, 315].map(a => `<circle cx="${f(ox + 56 * cs(a))}" cy="${f(oy + 56 * sn(a))}" r="6.5" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}
    <g class="tb-clamp">${tool(k, `M${ox + 4} ${TB.y + hi + 1}H${ox + 96}V${TB.y + hi + 30}H${ox + 4}Z`, 'steel')}</g></g>
  ${k.center(ox - 104, oy, ox + 104, oy)}${k.center(ox, oy - 104, ox, oy + 104)}
  <g class="tb-pd">${tool(k, `M152 ${TB.y + hi + 1}H296V${TB.y + hi + 30}H152Z`, 'steel')}</g>
  <g class="tb-man">${tool(k, `M40 ${TB.y - 12}H292A12 12 0 0 1 292 ${TB.y + 12}H40Z`, 'bronze')}
    ${g.balls.map(() => `<g class="tb-ball"><circle r="11.5" fill="#fff"/><circle r="11.5" fill="${k.hatch('bronze')}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>`).join('')}</g>
  <g class="tb-tube"><path class="tb-wo" d="${g.wo}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.8"/><path class="tb-wi" d="${g.wi}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.8"/></g>
  <g class="tb-lab">${note(k, 96, TB.y + 4, 66, 470, 'MANDREL', { anchor: 'start', size: 17 })}${note(k, ox - 40, oy - 50, 344, 110, 'BEND DIE', { anchor: 'start', size: 17 })}${note(k, 220, TB.y + hi + 16, 236, 470, 'PRESSURE DIE', { anchor: 'start', size: 15 })}</g>`;
}
function tubePlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), balls = qa('.tb-ball'), st = { phi: 90 };
  const render = () => { const g = tbGeo(st.phi); setD(q('.tb-wo'), g.wo); setD(q('.tb-wi'), g.wi); g.balls.forEach((p, i) => put(balls[i], p.x, p.y)); gsap.set(q('.tb-die'), { rotation: -st.phi, svgOrigin: `${TB.O[0]} ${TB.O[1]}` }); };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.phi = 0; render();
  pen(k, t, qa('.tb-die .o, .tb-pd .o, .tb-man .o'), { stagger: .1, dur: .8 });
  t.from(qa('.tb-die .h, .tb-pd .h, .tb-man .h, .tb-die circle'), { opacity: 0, duration: .5, stagger: .03 }, .6)
    .from(q('.tb-tube'), { opacity: 0, x: -60, duration: .7, ease: 'power2.out' }, .8).from(balls, { opacity: 0, duration: .3 }, 1.1)
    .from([q('.tb-lab'), q('.tb-inset')], { opacity: 0, duration: .5, stagger: .2 }, 1.2);
  const tube = q('.tb-tube'), clamp = q('.tb-clamp');
  gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .3 })
    .to(st, { phi: 90, duration: 2.8, ease: 'power1.inOut', onUpdate: render })
    .to(clamp, { y: 18, duration: .35, ease: 'power2.out' }, '+=.8')
    .to(tube, { opacity: 0, duration: .45 })
    .to(st, { phi: 0, duration: .8, ease: 'power2.inOut', onUpdate: render })
    .set(tube, { x: -70 })
    .to(tube, { x: 0, opacity: 1, duration: .6, ease: 'power2.out' })
    .to(clamp, { y: 0, duration: .3, ease: 'power2.in' });
  return t;
}

/* ======================================================================================================
   formingStates — the L3 tree: METAL FORMING → liquid · fluid (dashed, as on the slide) · plastic · solid, each with its
   process working underneath in turn: metal poured into a mould · (fluid, drawn in hidden line) · a hot billet
   squeezed between dies · a cold sheet bent over a die edge.
   ====================================================================================================== */
const FS = [96, 236, 376, 516];
function formingStatesDraw(k) {
  const { INK, W } = k, dash = 'stroke-dasharray="8 5"';
  const box = (x, y, w, h, d = '') => `<rect class="fs-box" x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}" ${d}/>`;
  const names = ['LIQUID', 'FLUID', 'PLASTIC', 'SOLID'];
  const bucket = 'M-36 -4L-28 50Q0 62 28 50L36 -4';
  return `
  <g class="fs-tree">${box(300, 44, 214, 42)}${k.text(300, 72, 'METAL FORMING', { size: 21, weight: 700, spacing: .5 })}
    <line class="fs-l" x1="300" y1="86" x2="300" y2="106" stroke="${INK.graphite}" stroke-width="${W.med}"/><line class="fs-l" x1="${FS[0]}" y1="106" x2="${FS[3]}" y2="106" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    ${FS.map((x, i) => `<line class="fs-l" x1="${x}" y1="106" x2="${x}" y2="126" stroke="${INK.graphite}" stroke-width="${W.med}" ${i === 1 ? dash : ''}/>${box(x, 126, 126, 52, i === 1 ? dash : '')}${k.text(x, 149, `${names[i]} STATE`, { size: 15, weight: 700, fill: i === 1 ? INK.graphite2 : INK.graphite })}${k.text(x, 168, 'FORMING', { size: 13, fill: INK.graphite2 })}`).join('')}</g>
  <g class="fs-liq">
    <clipPath id="formingStates-lad"><path d="${bucket}Z" transform="translate(128 250) rotate(-32)"/></clipPath>
    <rect x="60" y="268" width="130" height="60" fill="${INK.hot}" opacity=".6" clip-path="url(#formingStates-lad)"/>
    <g transform="translate(128 250) rotate(-32)"><path d="${bucket}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><line x1="30" y1="14" x2="88" y2="-2" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/></g>
    <line class="fs-stream" x1="96" y1="268" x2="96" y2="424" stroke="${INK.hot}" stroke-width="6" stroke-dasharray="16 7" opacity="0"/>
    <path d="M44 420H92V446H64V486H128V446H100V420H148V500H44Z" fill="${k.hatch('stipple')}" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <rect class="fs-fill" x="64" y="446" width="64" height="40" fill="${INK.hot}" opacity=".7"/><rect class="fs-sprue" x="92" y="420" width="8" height="26" fill="${INK.hot}" opacity="0"/>
    <path d="M92 420V446H64V486H128V446H100V420" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  </g>
  <g class="fs-flu" opacity=".8"><path d="M236 296C220 324 212 340 212 352A24 24 0 0 0 260 352C260 340 252 324 236 296Z" fill="none" ${k.stroke.hidden}/>
    <rect x="196" y="420" width="80" height="80" fill="none" ${k.stroke.hidden}/><line x1="236" y1="384" x2="236" y2="414" ${k.stroke.hidden}/></g>
  <g class="fs-pla">${tool(k, 'M316 440H436V480H316Z', 'iron')}
    <rect class="fs-bil" x="346" y="372" width="60" height="68" fill="${INK.hot}" opacity=".8" stroke="${INK.graphite}" stroke-width="${W.thick}" vector-effect="non-scaling-stroke"/>
    <g class="fs-ud">${tool(k, 'M326 300H426V340H326Z', 'steel')}</g></g>
  <g class="fs-sol">${tool(k, 'M462 410H520V480H462Z', 'iron')}
    <rect x="458" y="402" width="62" height="8" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.6"/>
    <rect class="fs-leg" x="520" y="402" width="34" height="8" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.6"/>
    <g class="fs-pu">${tool(k, 'M529 336H556V390H529Z', 'steel')}</g></g>`;
}
function formingStatesPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg);
  const [fill, sprue, stream, ud, bil, pu, leg] = ['.fs-fill', '.fs-sprue', '.fs-stream', '.fs-ud', '.fs-bil', '.fs-pu', '.fs-leg'].map(s => q(s));
  const t = k.tl();
  const squash = { scaleY: .62, scaleX: 1.45, svgOrigin: '376 440' };
  if (k.reduced()) { gsap.set(ud, { y: 58 }); gsap.set(bil, squash); gsap.set(pu, { y: 48 }); gsap.set(leg, { rotation: 90, svgOrigin: '520 410' }); gsap.set(sprue, { opacity: 1 }); return t; }
  gsap.set(fill, { attr: { y: 486, height: 0 } });
  pen(k, t, qa('.fs-tree rect, .fs-l'), { stagger: .05, dur: .5 });
  k.stamp(t, qa('.fs-tree text'), { at: .4, stagger: .04 });
  t.from([q('.fs-liq'), q('.fs-flu'), q('.fs-pla'), q('.fs-sol')], { opacity: 0, y: 16, duration: .6, stagger: .12, ease: 'power2.out' }, .7);
  gsap.to(stream, { strokeDashoffset: -46, duration: .4, ease: 'none', repeat: -1 });
  // each state works in turn: pour · squeeze · bend, a beat, then everything goes back
  gsap.timeline({ repeat: -1, delay: 1.7, repeatDelay: .6 })
    .to(stream, { opacity: 1, duration: .25 })
    .to(sprue, { opacity: 1, duration: .3 }, '<.25')
    .to(fill, { attr: { y: 446, height: 40 }, duration: 1.4, ease: 'power1.inOut' }, '<')
    .to(stream, { opacity: 0, duration: .3 })
    .to(ud, { y: 58, duration: .55, ease: 'power2.in' })
    .to(bil, { ...squash, duration: .5, ease: 'power2.in' }, '<.05')
    .to(pu, { y: 48, duration: .55, ease: 'power2.in' }, '+=.25')
    .to(leg, { rotation: 90, svgOrigin: '520 410', duration: .5, ease: 'power2.in' }, '<.05')
    .to([fill, sprue], { opacity: 0, duration: .45 }, '+=1.5')
    .to([ud, pu], { y: 0, duration: .6, ease: 'power2.inOut' }, '<')
    .to(bil, { scaleY: 1, scaleX: 1, svgOrigin: '376 440', duration: .6, ease: 'power2.inOut' }, '<')
    .to(leg, { rotation: 0, svgOrigin: '520 410', duration: .6, ease: 'power2.inOut' }, '<')
    .set(fill, { attr: { y: 486, height: 0 }, opacity: .7 });
  return t;
}

/* ======================================================================================================
   sheetGauge — a thickness scale (log, in mm) with the slide's two limits: below 0.15 mm (0.006 in) it is FOIL,
   up to 6.35 mm (0.25 in) SHEET, thicker is PLATE. Three slabs edge-on underneath (thin sections solid, the plate
   hatched — the drawing convention agrees). A pointer sweeps the scale and lights the class it is in.
   ====================================================================================================== */
const SG = { x0: 50, x1: 550, y: 156, lo: -2, hi: 2 };
const sgX = lv => SG.x0 + (lv - SG.lo) / (SG.hi - SG.lo) * (SG.x1 - SG.x0);
const SG_Z = [[124, 'FOIL', '< 0.15 mm', [62, 397, 124, 3]], [298, 'SHEET', '0.15 – 6.35 mm', [236, 380, 124, 20]], [476, 'PLATE', '> 6.35 mm', [414, 334, 124, 66]]];
function sheetGaugeDraw(k) {
  const { INK, W } = k, L1 = Math.log10(.15), L2 = Math.log10(6.35);
  let ticks = '';
  for (let d = SG.lo; d <= SG.hi; d++) {
    const x = sgX(d); ticks += `<line x1="${f(x)}" y1="${SG.y - 9}" x2="${f(x)}" y2="${SG.y + 9}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>${k.text(x, SG.y + 30, ['0.01', '0.1', '1', '10', '100 mm'][d + 2], { size: 14, fill: INK.graphite2 })}`;
    if (d < SG.hi) for (let m = 2; m < 10; m++) { const xm = sgX(d + Math.log10(m)); ticks += `<line x1="${f(xm)}" y1="${SG.y - 4}" x2="${f(xm)}" y2="${SG.y + 4}" stroke="${INK.graphite2}" stroke-width="${W.hair}"/>`; }
  }
  const lim = (lv, mm, inch) => `<line x1="${f(sgX(lv))}" y1="${SG.y - 26}" x2="${f(sgX(lv))}" y2="${SG.y + 16}" stroke="${INK.red}" stroke-width="${W.med}"/>${k.text(sgX(lv), SG.y - 34, mm, { size: 19, fill: INK.red, weight: 700 })}${k.text(sgX(lv), SG.y - 56, inch, { size: 13, fill: INK.graphite2 })}`;
  return `
  <g class="sg-scale"><line x1="${SG.x0}" y1="${SG.y}" x2="${SG.x1}" y2="${SG.y}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${ticks}</g>
  <g class="sg-lim">${lim(L1, '0.15 mm', '0.006 in')}${lim(L2, '6.35 mm', '0.25 in')}</g>
  <g class="sg-ptr"><path d="M0 8L-9 24H9Z" fill="${INK.red}"/>${k.text(0, 46, '', { size: 16, fill: INK.red, weight: 700, extra: 'class="sg-v"' })}</g>
  ${SG_Z.map(([x, name, range, [rx, ry, rw, rh]], i) => `<g class="sg-z" data-i="${i}"><g class="sg-zi">
    ${k.text(x, 262, name, { size: 30, family: 'display', weight: 700 })}
    <line x1="${x}" y1="274" x2="${x}" y2="${ry - 12}" ${k.stroke.construct} stroke-dasharray="6 5"/>
    ${i === 2 ? `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${INK.violet}" opacity=".3"/><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>`
      : `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="${i ? 2 : 1}"/>`}
    ${k.text(x, 436, range, { size: 17, weight: 600 })}</g></g>`).join('')}
  ${ground(k, 50, 550, 400)}`;
}
function sheetGaugePlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), zs = qa('.sg-zi'), ptr = q('.sg-ptr'), v = q('.sg-v');
  const L1 = Math.log10(.15), L2 = Math.log10(6.35), st = { lv: 0 };
  const sig = x => 1 / (1 + Math.exp(-x / .05));
  const render = () => {
    const a = 1 - sig(st.lv - L1), c = sig(st.lv - L2), w = [a, 1 - a - c, c];
    zs.forEach((z, i) => { z.style.opacity = (.25 + .75 * w[i]).toFixed(2); });
    put(ptr, sgX(st.lv), SG.y);
    const mm = Math.pow(10, st.lv); v.textContent = `${mm < 10 ? mm.toPrecision(2) : Math.round(mm)} mm`;
  };
  const t = k.tl();
  if (k.reduced()) { ptr.setAttribute('opacity', 0); return t; }
  st.lv = -1.6; render();
  pen(k, t, qa('.sg-scale line'), { stagger: .01, dur: .4 });
  k.stamp(t, qa('.sg-scale text, .sg-lim text'), { at: .4, stagger: .03 });
  pen(k, t, qa('.sg-lim line'), { at: .5, stagger: .1, dur: .4 });
  t.from(qa('.sg-z'), { opacity: 0, y: 20, duration: .6, stagger: .12, ease: 'power2.out' }, .7).from(ptr, { opacity: 0, duration: .4 }, 1.2);
  gsap.timeline({ repeat: -1, delay: 1.5, repeatDelay: .6, yoyo: true })
    .to(st, { lv: 1.55, duration: 4.6, ease: 'power1.inOut', onUpdate: render });
  return t;
}

/* ======================================================================================================
   stockShapes — the slide's eight stock shapes as sections (end views, hatched): round · square · hex · angle, solid
   and hollow. In turn, each column pulls out into a short bar (oblique), so the section reads as stock.
   ====================================================================================================== */
const SS = { xs: [118, 246, 374, 502], ys: [214, 410], d: [30, -22] };
function ssShapes(cx, cy) {
  const P = pts => pts.map(p => p.map(f)), circ = r => ({ c: [cx, cy, r] });
  const hex = r => P(Array.from({ length: 6 }, (_, i) => [cx + r * cs(i * 60), cy + r * sn(i * 60)]));
  const sq = s => P([[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]]);
  const L = (s, t) => P([[cx - s, cy - s], [cx - s + t, cy - s], [cx - s + t, cy + s - t], [cx + s, cy + s - t], [cx + s, cy + s], [cx - s, cy + s]]);
  return [[circ(44)], [sq(42)], [hex(48)], [L(42, 30)], [circ(44), circ(30)], [sq(42), sq(30)], [hex(48), hex(34)], [L(42, 26), L(34, 10)]];
}
function ssPath(c) { if (c.c) { const [x, y, r] = c.c; return `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`; } return 'M' + c.map(p => p.join(' ')).join('L') + 'Z'; }
function ssVerts(c, [dx, dy]) { // the edges that recede from a contour: tangents for circles, every vertex for polygons
  if (c.c) { const [x, y, r] = c.c, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; return [[x + nx * r, y + ny * r], [x - nx * r, y - ny * r]]; }
  return c;
}
function stockShapesDraw(k) {
  const { INK, W } = k, [dx, dy] = SS.d;
  const heads = ['ROUND', 'SQUARE', 'HEX', 'ANGLE'].map((s, i) => k.text(SS.xs[i], 112, s, { size: 18, weight: 700, spacing: .6 })).join('');
  const rows = ['SOLID', 'HOLLOW'].map((s, j) => k.text(46, SS.ys[j], s, { size: 15, weight: 700, fill: INK.graphite2, rotate: -90 })).join('');
  let out = '';
  SS.ys.forEach((cy, j) => SS.xs.forEach((cx, i) => {
    const sh = ssShapes(cx, cy)[j * 4 + i], [o, h] = sh, d = sh.map(ssPath).join('');
    const con = (c, w) => ssVerts(c, SS.d).map(([x, y]) => `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + dx)}" y2="${f(y + dy)}" stroke="${INK.graphite2}" stroke-width="${w}"/>`).join('');
    const ext = `<g class="ss-x" data-c="${i}"><path d="${ssPath(o)}" transform="translate(${dx} ${dy})" fill="#fff" stroke="${INK.graphite2}" stroke-width="${W.med}"/>${con(o, W.med)}
      ${h ? `<path d="${ssPath(h)}" fill="#E3E8EC"/><path d="${ssPath(h)}" transform="translate(${dx} ${dy})" fill="none" stroke="${INK.graphite2}" stroke-width="${W.thin}"/>${con(h, W.thin)}` : ''}</g>`;
    const bb = 50;
    out += `<g class="ss-s">${ext}<path d="${d}" fill="#fff" fill-rule="evenodd"/><path class="h" d="${d}" fill="${k.hatch('steel')}" fill-rule="evenodd"/><path class="o" d="${d}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      ${k.center(cx - bb - 8, cy, cx + bb + 8, cy, 'class="ss-c"')}${k.center(cx, cy - bb - 8, cx, cy + bb + 8, 'class="ss-c"')}</g>`;
  }));
  return `${heads}${rows}${out}`;
}
function stockShapesPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), xs = qa('.ss-x');
  const t = k.tl();
  if (k.reduced()) return t;
  gsap.set(xs, { opacity: 0 });
  pen(k, t, qa('.ss-s .o'), { stagger: .07, dur: .6 });
  t.from(qa('.ss-s .h'), { opacity: 0, duration: .4, stagger: .05 }, .5).from(qa('.ss-c'), { opacity: 0, duration: .3 }, .9);
  k.stamp(t, qa(':scope > text'), { at: .2, stagger: .05 });
  // column by column the sections pull out into bars, then go back to end views
  const L = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .3 });
  [0, 1, 2, 3].forEach(c => {
    const g = xs.filter(x => x.dataset.c == c);
    L.fromTo(g, { opacity: 0, x: -SS.d[0] * .6, y: -SS.d[1] * .6 }, { opacity: 1, x: 0, y: 0, duration: .55, ease: 'power2.out', immediateRender: false })
      .to(g, { opacity: 0, x: -SS.d[0] * .6, y: -SS.d[1] * .6, duration: .4, ease: 'power2.in' }, '+=1.1');
  });
  return t;
}

/* ======================================================================================================
   solidTree — Solid State Forming → three branches standing on pillars whose height is their cost (low–moderate ·
   moderate–high · high), each with its three processes. At the foot of each pillar its kind of part gets made, in turn.
   ====================================================================================================== */
const ST = { xs: [130, 300, 470], tops: [392, 300, 208], bot: 532, w: 140 };
function solidTreeDraw(k) {
  const { INK, W } = k, { xs, tops, bot, w } = ST;
  const heads = [['SIMPLE', 'BENDING'], ['COMPOUND', 'BENDING'], ['FORM & CUT', '(STAMPING)']];
  const cost = ['LOW – MODERATE COST', 'MODERATE – HIGH COST', 'HIGH COST'];
  const leaves = [['Bend', 'Roll', 'Continuous roll'], ['Spinning', 'Hydroforming', 'Drawing'], ['Progressive', 'Transfer dies', 'Multiple action dies']];
  const icon = i => { const x = xs[i], y = bot - 12; // a part being made at the foot of each pillar
    if (i === 0) return `<g class="st-ic"><rect x="${x - 34}" y="${y - 6}" width="34" height="6" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.4"/><rect class="st-a" x="${x}" y="${y - 6}" width="30" height="6" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.4"/></g>`;
    if (i === 1) return `<g class="st-ic"><path class="st-cup" d="M${x - 34} ${y - 22}H${x - 16}V${y}H${x + 16}V${y - 22}H${x + 34}" fill="none" stroke="${INK.violet}" stroke-width="5" stroke-linejoin="round"/><line class="st-flat" x1="${x - 34}" y1="${y - 22}" x2="${x + 34}" y2="${y - 22}" stroke="${INK.violet}" stroke-width="5"/></g>`;
    return `<g class="st-ic"><line x1="${x - 40}" y1="${y - 4}" x2="${x - 12}" y2="${y - 4}" stroke="${INK.violet}" stroke-width="5"/><line x1="${x + 12}" y1="${y - 4}" x2="${x + 40}" y2="${y - 4}" stroke="${INK.violet}" stroke-width="5"/><rect class="st-pu" x="${x - 11}" y="${y - 40}" width="22" height="30" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="1.6"/><rect class="st-bl" x="${x - 12}" y="${y - 6.5}" width="24" height="5" fill="${INK.violet}"/></g>`;
  };
  return `
  <g class="st-root"><rect x="186" y="42" width="228" height="44" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.text(300, 70, 'SOLID STATE FORMING', { size: 19, weight: 700, spacing: .4 })}
    <path class="st-l" d="M300 86V110M${xs[0]} 110H${xs[2]}${xs.map((x, i) => `M${x} 110V${tops[i] - 58}`).join('')}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>
  <g class="st-cost"><line x1="48" y1="${bot}" x2="48" y2="196" stroke="${INK.red}" stroke-width="${W.med}" marker-end="url(#arr-red)"/>${k.text(56, 192, 'COST', { size: 16, fill: INK.red, weight: 700, anchor: 'start' })}</g>
  ${xs.map((x, i) => `<g class="st-p" data-i="${i}">
    <rect class="st-b" x="${x - w / 2}" y="${tops[i]}" width="${w}" height="${bot - tops[i]}" fill="${INK.violet}" opacity=".13"/>
    <rect class="st-o" x="${x - w / 2}" y="${tops[i]}" width="${w}" height="${bot - tops[i]}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <rect x="${x - w / 2}" y="${tops[i] - 58}" width="${w}" height="58" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    ${k.text(x, tops[i] - 34, heads[i][0], { size: 17, weight: 700 })}${k.text(x, tops[i] - 13, heads[i][1], { size: 15, weight: 700 })}
    ${k.text(x, tops[i] + 22, cost[i], { size: 12.5, fill: INK.violet, weight: 700 })}
    ${leaves[i].map((s, j) => k.text(x, tops[i] + 48 + j * 21, s, { size: 15.5 })).join('')}
    ${icon(i)}</g>`).join('')}
  ${ground(k, 52, 548, bot)}`;
}
function solidTreePlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), ps = qa('.st-p');
  const t = k.tl();
  if (k.reduced()) { gsap.set(q('.st-flat'), { opacity: 0 }); gsap.set(q('.st-a'), { rotation: -90, svgOrigin: `${ST.xs[0]} ${ST.bot - 12}` }); return t; }
  gsap.set(q('.st-cup'), { opacity: 0 });
  t.from(q('.st-root'), { opacity: 0, y: -10, duration: .5 }, 0);
  ps.forEach((p, i) => t.from(p.querySelectorAll('.st-b, .st-o'), { scaleY: 0, transformOrigin: '50% 100%', duration: .7, ease: 'power3.out' }, .3 + i * .18)
    .from(p.querySelectorAll('text, rect:not(.st-b):not(.st-o), .st-ic'), { opacity: 0, duration: .4 }, .7 + i * .18));
  t.from(q('.st-cost'), { opacity: 0, duration: .5 }, 1.2);
  // the three kinds of part, made in turn: a bend · a drawn cup · a blank punched out
  const [a, cup, flat, pu, bl] = ['.st-a', '.st-cup', '.st-flat', '.st-pu', '.st-bl'].map(s => q(s)), o0 = `${ST.xs[0]} ${ST.bot - 12}`;
  gsap.timeline({ repeat: -1, delay: 2, repeatDelay: .5 })
    .to(a, { rotation: -90, svgOrigin: o0, duration: .7, ease: 'power2.inOut' })
    .to(ps[0].querySelector('.st-b'), { opacity: .3, duration: .3, yoyo: true, repeat: 1 }, '<')
    .to(flat, { opacity: 0, duration: .35 }, '+=.3').to(cup, { opacity: 1, duration: .35 }, '<')
    .to(ps[1].querySelector('.st-b'), { opacity: .3, duration: .3, yoyo: true, repeat: 1 }, '<')
    .to(pu, { y: 26, duration: .3, ease: 'power2.in' }, '+=.3').to(bl, { y: 30, opacity: 0, duration: .5, ease: 'power2.in' }, '<.25').to(pu, { y: 0, duration: .5, ease: 'power2.inOut' })
    .to(ps[2].querySelector('.st-b'), { opacity: .3, duration: .3, yoyo: true, repeat: 1 }, '<-.3')
    .to(a, { rotation: 0, svgOrigin: o0, duration: .5 }, '+=1.2').to(cup, { opacity: 0, duration: .35 }, '<').to(flat, { opacity: 1, duration: .35 }, '<').set(bl, { y: 0 }).to(bl, { opacity: 1, duration: .3 });
  return t;
}

/* ======================================================================================================
   stamping — the terminology on one machine: a STAMPING PRESS (eccentric drive in the crown, the pitman, the ram)
   drives the PUNCH through the strip into the DIE; the STAMPINGS drop into the bin and the strip feeds one pitch.
   ====================================================================================================== */
const SP = { cx: 300, cy: 102, e: 18, ram: [170, 430, 182, 262], pitch: 64, sy: 352, T: 8 };
function stampingDraw(k) {
  const { INK, W } = k, { cx, cy, ram: [rx1, rx2, ry1, ry2], sy, T, pitch } = SP;
  const holes = [1, 2, 3, 4].map(j => cx + pitch * j);
  const segs = [[30, cx - 18], ...holes.map((h, j) => [h + 18, (holes[j + 1] || 620) - 18])];
  return `
  ${k.text(300, 44, 'STAMPING PRESS', { size: 18, weight: 700, spacing: 1 })}
  <g class="sp-frame">
    <rect class="o" x="90" y="60" width="420" height="80" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <path class="o" d="M90 140V${sy - 22}H150V140M450 140V${sy - 22}H510V140M90 ${sy + T + 14}V452H150V${sy + T + 14}ZM450 ${sy + T + 14}V452H510V${sy + T + 14}Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="o" d="M90 452H510V492H470V530H440V492H160V530H130V492H90Z" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <rect x="${cx - 18}" y="452" width="36" height="40" fill="#fff"/><line x1="${cx - 18}" y1="452" x2="${cx - 18}" y2="492" ${k.stroke.hidden}/><line x1="${cx + 18}" y1="452" x2="${cx + 18}" y2="492" ${k.stroke.hidden}/>
  </g>
  ${tool(k, `M${cx - 80} ${sy + T}H${cx - 18}V${sy + T + 62}H${cx - 80}ZM${cx + 18} ${sy + T}H${cx + 80}V${sy + T + 62}H${cx + 18}Z`, 'iron', 'sp-die')}
  <clipPath id="stamping-clip"><rect x="40" y="300" width="520" height="80"/></clipPath>
  <g clip-path="url(#stamping-clip)"><g class="sp-strip">${segs.map(([a, b]) => `<rect x="${a}" y="${sy}" width="${b - a}" height="${T}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.4"/>`).join('')}
    <rect class="sp-h0" x="${cx - 18}" y="${sy - 1}" width="36" height="${T + 2}" fill="#fff" opacity="0"/></g></g>
  <rect class="sp-blank" x="${cx - 18}" y="${sy}" width="36" height="${T}" fill="${INK.violet}" stroke="${INK.graphite}" stroke-width="1.4" opacity="0"/>
  <g class="sp-bin"><path d="M226 496V528H374V496" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>${[[244, 518, -8], [272, 520, 6], [300, 516, -3], [328, 520, 9], [352, 518, -5]].map(([x, y, r]) => `<rect x="${x - 14}" y="${y}" width="28" height="6" fill="${INK.violet}" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>
  <g class="sp-ram"><rect class="o" x="${rx1}" y="${ry1}" width="${rx2 - rx1}" height="${ry2 - ry1}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.hazard(rx1, ry2 - 16, rx2 - rx1, 16, 'stamping-ram')}
    <rect x="${rx1}" y="${ry1}" width="${rx2 - rx1}" height="${ry2 - ry1}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    ${tool(k, `M${cx - 16} ${ry2}H${cx + 16}V${sy - 20}H${cx - 16}Z`, 'steel', 'sp-pu')}
    ${note(k, cx + 18, ry2 + 40, 392, ry2 + 30, 'PUNCH', { size: 16 })}</g>
  <line class="sp-rod" stroke="${INK.graphite}" stroke-width="12" stroke-linecap="round"/><line class="sp-rod2" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <g class="sp-wheel"><circle cx="${cx}" cy="${cy}" r="30" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${[0, 90, 180, 270].map(a => `<line x1="${f(cx + 9 * cs(a + 45))}" y1="${f(cy + 9 * sn(a + 45))}" x2="${f(cx + 27 * cs(a + 45))}" y2="${f(cy + 27 * sn(a + 45))}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`).join('')}<circle class="sp-pin" cx="${cx}" cy="${cy - SP.e}" r="6" fill="${INK.graphite}"/></g>
  ${k.center(cx - 44, cy, cx + 44, cy)}
  <g class="sp-lab">${note(k, cx + 70, sy + T + 30, 400, sy + T + 46, 'DIE', { size: 16 })}${note(k, 352, 516, 420, 552, 'STAMPINGS', { size: 16 })}${note(k, 200, sy + 4, 196, 300, 'STRIP', { size: 15, anchor: 'end' })}</g>`;
}
function stampingPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), { cx, cy, e } = SP, st = { th: 0 };
  const render = () => {
    const off = e * (1 - cs(st.th)), px = cx + e * sn(st.th), py = cy - e * cs(st.th);
    gsap.set(q('.sp-ram'), { y: off }); gsap.set(q('.sp-wheel'), { rotation: st.th, svgOrigin: `${cx} ${cy}` });
    [q('.sp-rod'), q('.sp-rod2')].forEach(l => setL(l, px, py, cx, SP.ram[2] + off + 6));
  };
  st.th = 0; render();
  const t = k.tl();
  if (k.reduced()) { st.th = 180; render(); q('.sp-h0').setAttribute('opacity', 1); return t; }
  pen(k, t, qa('.sp-frame .o'), { stagger: .12, dur: .9 });
  t.from(qa('.sp-die, .sp-strip, .sp-bin, .sp-ram, .sp-wheel, .sp-rod, .sp-rod2'), { opacity: 0, duration: .5, stagger: .07 }, .6)
    .from(qa('.sp-lab .k-leader, :scope > text'), { opacity: 0, duration: .4, stagger: .1 }, 1.1);
  const C = 2.4, at = d => C * d / 360, strip = q('.sp-strip'), h0 = q('.sp-h0'), blank = q('.sp-blank');
  gsap.timeline({ repeat: -1, delay: 1.5 })
    .to(st, { th: 360, duration: C, ease: 'none', onUpdate: render }, 0)
    .set(h0, { opacity: 1 }, at(170)).set(blank, { opacity: 1, y: 0, rotation: 0 }, at(170))
    .to(blank, { y: 150, rotation: 24, svgOrigin: `${cx} ${SP.sy}`, duration: .55, ease: 'power2.in' }, at(178))
    .to(blank, { opacity: 0, duration: .15 }, at(178) + .45)
    .to(strip, { x: SP.pitch, duration: at(80), ease: 'power2.inOut' }, at(262))
    .set(strip, { x: 0 }, C).set(h0, { opacity: 0 }, C);
  return t;
}

/* ======================================================================================================
   relief — where a flange ends partway along an edge, the corner needs a relief cut or it tears. Three detail views
   (flat pattern, magnified) show the three: A) tear-rip (a slit), B) obround, C) rectangle. Below, the part itself:
   its flange folds down past the relief, which opens cleanly — the relief in use changes with the detail in focus.
   ====================================================================================================== */
const RL = { xs: [110, 300, 490], cy: 166, r: 74, o: [64, 466], zx: .42, zy: .5, W: 360, Dz: 160, x1: 140, fw: 66 };
const rlP = (x, z, up = 0) => [RL.o[0] + x + RL.zx * z, RL.o[1] - RL.zy * z - up];
function rlBase(type) { // the base plate outline (x–z) with the relief notch where the flange starts (x1)
  const { W, Dz, x1 } = RL, rw = type ? 26 : 0, rd = 46, P = (x, z) => rlP(x, z).map(f).join(' ');
  let notch = `L${P(x1 - rw, 0)}`;
  if (type === 0) notch += `L${P(x1, rd)}L${P(x1, 0)}`;
  else if (type === 1) { notch += `L${P(x1 - rw, rd - rw / 2)}`; for (let i = 1; i <= 8; i++) { const a = 180 + i * 22.5; notch += `L${P(x1 - rw / 2 + rw / 2 * cs(a), rd - rw / 2 - rw / 2 * sn(a))}`; } notch += `L${P(x1, 0)}`; }
  else notch += `L${P(x1 - rw, rd)}L${P(x1, rd)}L${P(x1, 0)}`;
  return `M${P(0, 0)}${notch}L${P(W, 0)}L${P(W, Dz)}L${P(0, Dz)}Z`;
}
function rlDetail(k, i) { // flat pattern at ×6 round the relief: the base below the bend line, the flange above-right
  const { INK, W } = k, cx = RL.xs[i], cy = RL.cy, by = cy - 4, rw = i ? 20 : 0, rd = 34, R = RL.r;
  let cut = '';
  if (i === 0) cut = `L${cx} ${by}L${cx} ${by + rd}L${cx} ${by}`;
  else if (i === 1) cut = `L${cx - rw} ${by}L${cx - rw} ${by + rd - rw / 2}A${rw / 2} ${rw / 2} 0 0 0 ${cx} ${by + rd - rw / 2}L${cx} ${by}`;
  else cut = `L${cx - rw} ${by}L${cx - rw} ${by + rd}L${cx} ${by + rd}L${cx} ${by}`;
  const base = `M${cx - R - 4} ${by}${cut}L${cx + R + 4} ${by}L${cx + R + 4} ${cy + R + 4}L${cx - R - 4} ${cy + R + 4}Z`;
  const fl = `M${cx} ${by}V${cy - R - 4}H${cx + R + 4}V${by}Z`;
  return `<g class="rl-d" data-i="${i}"><clipPath id="relief-c${i}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff"/>
    <g clip-path="url(#relief-c${i})"><rect x="${cx - R}" y="${cy - R}" width="1" height="1" fill="#fff"/>
      <path d="${base}" fill="${INK.violet}" opacity=".2"/><path d="${base}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <g class="rl-df"><path d="${fl}" fill="${INK.violet}" opacity=".2"/><path d="M${cx} ${cy - R - 4}V${by}" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
      <line x1="${cx}" y1="${by}" x2="${cx + R}" y2="${by}" ${k.stroke.center}/></g>
    <circle class="rl-ring" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    ${k.text(cx, cy + R + 30, ['A) TEAR-RIP', 'B) OBROUND', 'C) RECTANGLE'][i], { size: 18, weight: 700 })}</g>`;
}
function reliefDraw(k) {
  const { INK, W } = k, [mx, my] = rlP(RL.x1 - 12, 20);
  return `
  ${[0, 1, 2].map(i => rlDetail(k, i)).join('')}
  ${k.text(RL.xs[2] + 4, RL.cy - RL.r - 14, 'BEND LINE', { size: 13, fill: INK.graphite2, anchor: 'middle' })}
  ${[0, 1, 2].map(i => `<g class="rl-b" opacity="${i === 1 ? 1 : 0}"><path d="${rlBase(i)}" fill="#fff"/><path d="${rlBase(i)}" fill="${INK.violet}" opacity=".18"/><path d="${rlBase(i)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/></g>`).join('')}
  <g class="rl-fl" transform="matrix(1 0 0 1 ${RL.o[0]} ${RL.o[1]})"><path d="M${RL.x1} 0H${RL.W}V${RL.fw}H${RL.x1}Z" fill="#fff"/><path d="M${RL.x1} 0H${RL.W}V${RL.fw}H${RL.x1}Z" fill="${INK.violet}" opacity=".3"/><path d="M${RL.x1} 0H${RL.W}V${RL.fw}H${RL.x1}Z" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>
  <g class="rl-mk"><circle cx="${f(mx)}" cy="${f(my)}" r="30" fill="none" stroke="${INK.red}" stroke-width="${W.med}"/>${k.text(mx - 42, my - 24, 'B', { size: 18, fill: INK.red, weight: 700, extra: 'class="rl-mt"' })}</g>
  ${note(k, ...rlP(250, 0).map(v => v), 520, 382, 'FLANGE', { size: 16, anchor: 'middle' })}`;
}
function reliefPlay(svg, k) {
  const { gsap } = k, [q, qa] = sel(svg), ds = qa('.rl-d'), bs = qa('.rl-b'), fl = q('.rl-fl'), mt = q('.rl-mt');
  const st = { th: 90 };
  const render = () => { const c = cs(st.th), s = sn(st.th); fl.setAttribute('transform', `matrix(1 0 ${f(-RL.zx * c * 100) / 100} ${(RL.zy * c + s).toFixed(3)} ${RL.o[0]} ${RL.o[1]})`); };
  const focus = i => { bs.forEach((b, j) => gsap.to(b, { opacity: j === i ? 1 : 0, duration: .35 })); ds.forEach((d, j) => gsap.to(d.querySelector('.rl-ring'), { stroke: j === i ? k.INK.violet : k.INK.graphite, strokeWidth: j === i ? 6 : k.W.thick, duration: .35 })); mt.textContent = 'ABC'[i]; };
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.th = 0; render();
  ds.forEach((d, i) => t.from(d, { opacity: 0, scale: .8, transformOrigin: `${RL.xs[i]}px ${RL.cy}px`, duration: .6, ease: 'back.out(1.6)' }, .1 + i * .15));
  t.from([...bs, fl], { opacity: 0, duration: .6 }, .7).from(q('.rl-mk'), { opacity: 0, duration: .4 }, 1.1);
  const L = gsap.timeline({ repeat: -1, delay: 1.5 });
  [0, 1, 2].forEach(i => {
    const df = ds[i].querySelector('.rl-df'), o = `${RL.xs[i]} ${RL.cy - 4}`;
    L.call(focus, [i])
      .to(st, { th: 90, duration: 1.2, ease: 'power2.inOut', onUpdate: render }, '+=.4')
      .to(df, { scaleY: .1, svgOrigin: o, duration: 1.2, ease: 'power2.inOut' }, '<')
      .to(st, { th: 0, duration: .9, ease: 'power2.inOut', onUpdate: render }, '+=1.2')
      .to(df, { scaleY: 1, svgOrigin: o, duration: .9, ease: 'power2.inOut' }, '<');
  });
  return t;
}

/* ======================================================================================================
   flanging — the slide's three flanges on three plates (oblique view), folded down together: STRAIGHT (a straight
   edge), STRETCH (a concave edge: the free edge has to get longer — tension) and SHRINK (a convex edge: it has to get
   shorter — compression). The ticks across each flange show it: they fan in, fan out, then stand parallel.
   ====================================================================================================== */
const FG = { ox: 178, oys: [150, 312, 474], W: 300, Dz: 90, sag: [0, 26, -26], w: 42, zx: .36, zy: .5, N: 24 };
const fgP = (i, x, z, up = 0) => [FG.ox + x + FG.zx * z, FG.oys[i] - FG.zy * z - up];
const fgZ = (i, x) => FG.sag[i] * (1 - (2 * x / FG.W - 1) ** 2), fgZd = (i, x) => FG.sag[i] * (-2 * (2 * x / FG.W - 1) * 2 / FG.W);
function fgGeo(i, th) {
  const E = [], Q = [];
  for (let j = 0; j <= FG.N; j++) {
    const x = FG.W * j / FG.N, z = fgZ(i, x), d = fgZd(i, x), L = Math.hypot(1, d), nx = d / L, nz = -1 / L, c = cs(th) * FG.w;
    E.push(fgP(i, x, z)); Q.push(fgP(i, x + nx * c, z + nz * c, -FG.w * sn(th)));
  }
  const pl = a => a.map(p => p.map(f).join(',')).join(' ');
  return { poly: pl([...E, ...Q.slice().reverse()]), free: pl(Q), ticks: E.map((e, j) => [e, Q[j]]).filter((_, j) => j % 3 === 0 && j && j < FG.N) };
}
function flangingDraw(k) {
  const { INK, W } = k, col = [INK.graphite, INK.hot, INK.blue];
  return FG.oys.map((oy, i) => {
    const g = fgGeo(i, 90), back = [fgP(i, 0, FG.Dz), fgP(i, FG.W, FG.Dz)];
    let front = []; for (let j = 0; j <= FG.N; j++) { const x = FG.W * j / FG.N; front.push(fgP(i, x, fgZ(i, x))); }
    const plate = [...front, back[1], back[0]].map(p => p.map(f).join(',')).join(' ');
    const mid = fgGeo(i, 90).free.split(' ').map(s => s.split(',').map(Number)), a = mid[4], b = mid[FG.N - 4];
    const arr = i ? [[a, -1], [b, 1]].map(([p, s]) => { const dir = (i === 1 ? s : -s) * 1; return `<line x1="${f(p[0] - dir * 6)}" y1="${f(p[1] + 16)}" x2="${f(p[0] + dir * 24)}" y2="${f(p[1] + 16)}" stroke="${col[i]}" stroke-width="3" marker-end="url(#${i === 1 ? 'arr-red' : 'arr-blue'})"/>`; }).join('') : '';
    return `<g class="fg-r" data-i="${i}">
      ${k.text(40, oy - 30, ['STRAIGHT', 'STRETCH', 'SHRINK'][i], { size: 20, weight: 700, anchor: 'start', fill: i ? col[i] : INK.graphite })}${k.text(40, oy - 10, 'FLANGING', { size: 14, anchor: 'start', fill: INK.graphite2 })}
      <polygon points="${plate}" fill="#fff"/><polygon points="${plate}" fill="${INK.violet}" opacity=".16"/><polygon class="o" points="${plate}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <polygon class="fg-f" points="${g.poly}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
      <g class="fg-t">${g.ticks.map(() => `<line stroke="${INK.graphite2}" stroke-width="${W.thin}"/>`).join('')}</g>
      <polyline class="fg-e" points="${g.free}" fill="none" stroke="${col[i]}" stroke-width="${i ? 4 : W.thick}" stroke-linejoin="round"/>
      <g class="fg-a">${arr}</g></g>`;
  }).join('');
}
function flangingPlay(svg, k) {
  const { gsap } = k, [, qa] = sel(svg), rows = qa('.fg-r'), st = [90, 90, 90].map(th => ({ th }));
  const render = () => rows.forEach((r, i) => {
    const g = fgGeo(i, st[i].th);
    r.querySelector('.fg-f').setAttribute('points', g.poly); r.querySelector('.fg-e').setAttribute('points', g.free);
    [...r.querySelectorAll('.fg-t line')].forEach((l, j) => setL(l, ...g.ticks[j][0], ...g.ticks[j][1]));
  });
  render();
  const t = k.tl();
  if (k.reduced()) return t;
  st.forEach(s => { s.th = 0; }); render();
  const arr = qa('.fg-a');
  gsap.set(arr, { opacity: 0 });
  pen(k, t, qa('.fg-r .o'), { stagger: .15, dur: .8 });
  t.from(qa('.fg-f, .fg-e, .fg-t'), { opacity: 0, duration: .5, stagger: .05 }, .6);
  k.stamp(t, qa('.fg-r text'), { at: .2, stagger: .06 });
  const L = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .5 });
  st.forEach((s, i) => L.to(s, { th: 90, duration: 1.5, ease: 'power2.inOut', onUpdate: render }, i * .2));
  L.to(arr, { opacity: 1, duration: .4, stagger: .1 }, '-=.2')
    .to(arr, { opacity: 0, duration: .3 }, '+=1.6');
  st.forEach((s, i) => L.to(s, { th: 0, duration: 1.1, ease: 'power2.inOut', onUpdate: render }, `<${i ? .12 : 0}`));
  return t;
}

export default {
  formingStates: { draw: formingStatesDraw, play: formingStatesPlay },
  sheetGauge: { draw: sheetGaugeDraw, play: sheetGaugePlay },
  stockShapes: { draw: stockShapesDraw, play: stockShapesPlay },
  solidTree: { draw: solidTreeDraw, play: solidTreePlay },
  stamping: { draw: stampingDraw, play: stampingPlay },
  relief: { draw: reliefDraw, play: reliefPlay },
  flanging: { draw: flangingDraw, play: flangingPlay },
  kFactor: { draw: kFactorDraw, play: kFactorPlay },
  flatLength: { draw: flatLengthDraw, play: flatLengthPlay },
  bendRadius: { draw: bendRadiusDraw, play: bendRadiusPlay },
  hemming: { draw: hemmingDraw, play: hemmingPlay },
  rollForm: { draw: rollFormDraw, play: rollFormPlay },
  contRoll: { draw: contRollDraw, play: contRollPlay },
  tube: { draw: tubeDraw, play: tubePlay },
  neutralAxis: { draw: neutralAxisDraw, play: neutralAxisPlay },
  vBend: { draw: vBendDraw, play: vBendPlay },
  airBend: { draw: airBendDraw, play: airBendPlay },
  springback: { draw: springbackDraw, play: springbackPlay },
  edgeBend: { draw: edgeBendDraw, play: edgeBendPlay }
};
