// Illustrated scenes — props (Properties of Metals, Lecture 2). Contract and look: STYLE.md · names and captions:
// world/scenes/info.js · what to draw: docs/SCENES.md. Zone marker: INK.bronze (a wash on the metal being tested).
// Hub: `anvil` — a hammer strikes a hot bar on an anvil; each blow indexes a ring of the mechanical properties.

const BRZ = '#EFDED2', BRZ2 = '#E2C3AE', CU = '#F1DACB', WOOD = '#F2E6D3', TOOL = '#E3E8EC'; // washes (opaque)
const f1 = v => +(+v).toFixed(1);
const P = a => a.map(p => `${f1(p[0])},${f1(p[1])}`).join(' ');
const D = (a, close) => 'M' + a.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L') + (close ? 'Z' : '');
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const set = (el, o) => { if (el) for (const k in o) el.setAttribute(k, typeof o[k] === 'number' ? f1(o[k]) : o[k]); };
/** opacity as inline style — the same property GSAP tweens, so a render() and a tween never fight */
const op = (el, v) => { if (el) el.style.opacity = (+v).toFixed(3); };
const lerp = (a, b, t) => a + (b - a) * t;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
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
/** a fixed support: a band of ground hatch with its working face as a thick line */
function ground(k, x, y, w, h, face, cls = '') {
  const L = { top: [x, y, x + w, y], bottom: [x, y + h, x + w, y + h], left: [x, y, x, y + h], right: [x + w, y, x + w, y + h] }[face];
  return `<g class="${cls}">${k.rect(x, y, w, h, k.hatch('iron'), 'class="gd-h"')}${k.line(...L, k.INK.graphite, k.W.thick, 'class="gd-f"')}</g>`;
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
/** a dimension line with arrows at both ends and its label (no extension lines) — for live dimensions */
function dline(k, cls, color, label, { size = 16, anchor = 'middle' } = {}) {
  const mk = color === k.INK.red ? 'arr-red' : color === k.INK.blue ? 'arr-blue' : 'arr';
  return `<g class="${cls}"><line x1="0" y1="0" x2="0" y2="1" stroke="${color}" stroke-width="${k.W.thin}" marker-start="url(#${mk})" marker-end="url(#${mk})"/>${k.text(0, 0, label, { size, fill: color, anchor, weight: 700 })}</g>`;
}
function dset(g, x1, y1, x2, y2, tx, ty) { set(g.firstElementChild, { x1, y1, x2, y2 }); set(g.lastElementChild, { x: tx, y: ty }); }
const hair = (k, x1, y1, x2, y2, color = k.INK.graphite, extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${k.W.hair}" ${extra}/>`;
/** a flame (heat source): a teardrop standing on (x, y), s = scale */
function flame(k, x, y, s = 1, cls = 'fl') {
  const tear = (w, h) => `M${f1(x)} ${f1(y)}C${f1(x - w)} ${f1(y)} ${f1(x - w * 1.15)} ${f1(y - h * .5)} ${f1(x)} ${f1(y - h)}C${f1(x + w * 1.15)} ${f1(y - h * .5)} ${f1(x + w)} ${f1(y)} ${f1(x)} ${f1(y)}Z`;
  return `<g class="${cls}"><path d="${tear(10 * s, 30 * s)}" fill="${k.INK.hot}"/><path d="${tear(5 * s, 15 * s)}" fill="${k.INK.hazard}"/></g>`;
}
/** an elliptical arc arrow from a0° to a1° (SVG angles), head at a1 */
function earc(k, cx, cy, rx, ry, a0, a1, color, cls, w = 5) {
  const pt = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const pts = Array.from({ length: 25 }, (_, i) => pt(lerp(a0, a1 - Math.sign(a1 - a0) * 12, i / 24)));
  const e = pt(a1), b = pts[pts.length - 1], L = Math.hypot(e[0] - b[0], e[1] - b[1]), ux = (e[0] - b[0]) / L, uy = (e[1] - b[1]) / L;
  return `<g class="${cls}"><path d="${D(pts)}" fill="none" stroke="${color}" stroke-width="${w}"/><polygon points="${P([[e[0] + ux * 4, e[1] + uy * 4], [b[0] - uy * 7, b[1] + ux * 7], [b[0] + uy * 7, b[1] - ux * 7]])}" fill="${color}"/></g>`;
}
/** a thermometer: tube from yT to yB, bulb under it; the column (class cls-c) is scaled from the bulb */
function thermo(k, x, yT, yB, cls) {
  const { INK, W } = k;
  return `<g class="${cls}"><rect x="${x - 6}" y="${yT}" width="12" height="${yB - yT}" rx="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <rect class="${cls}-c" x="${x - 2.6}" y="${yT + 5}" width="5.2" height="${yB - yT}" fill="${INK.hot}"/>
    <circle cx="${x}" cy="${yB + 8}" r="10" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>`;
}

/* ======================================================================================================
   anvil ★ — the character of metal. A hammer strikes a hot bar on an anvil (hardened steel face plate, hardy and
   pritchel holes as hidden lines), sparks fly, and every blow indexes a ring of the mechanical properties around
   the anvil's waist; the one at the front is inked in bronze.
   ====================================================================================================== */
const AV = { rc: [300, 458], rx: 226, ry: 82, pv: [592, 240], up: 34 };
const AV_NAMES = ['HARDNESS', 'TOUGHNESS', 'DUCTILITY', 'MALLEABILITY', 'RESILIENCE', 'CASTABILITY', 'MACHINABILITY', 'WELDABILITY'];
const AV_BODY = 'M96 326C128 314 160 312 188 312L220 312L220 300L470 300L470 324C452 330 420 334 404 364C396 382 398 404 418 428L452 440L452 454L364 454C352 438 274 438 262 454L174 454L174 440L208 428C228 404 230 382 222 366C206 348 150 336 96 326Z';
const AV_SP = (() => { const r = rng(5); return Array.from({ length: 14 }, (_, i) => {
  const right = i % 2, a = (right ? -80 + r() * 72 : 188 + r() * 72) * Math.PI / 180;
  return { ox: right ? 358 : 316, oy: 283, a, d: 48 + r() * 62, g: 10 + r() * 26 };
}); })();
function avAt(i, a) { const th = (90 + i * 45 - a) * Math.PI / 180, d = Math.sin(th); return { x: AV.rc[0] + AV.rx * Math.cos(th), y: AV.rc[1] + AV.ry * Math.sin(th), d }; }
function anvilDraw(k) {
  const { INK, W } = k; const [rcx, rcy] = AV.rc;
  const half = (a0, a1) => D(Array.from({ length: 33 }, (_, i) => { const a = lerp(a0, a1, i / 32) * Math.PI / 180; return [rcx + AV.rx * Math.cos(a), rcy + AV.ry * Math.sin(a)]; }));
  const name = (i, back) => { const p = avAt(i, 0), s = .76 + .24 * (p.d + 1) / 2; return `<g class="av-n" data-i="${i}" transform="translate(${f1(p.x)} ${f1(p.y)}) scale(${f1(s)})">${k.text(0, 6, AV_NAMES[i], { size: 17, weight: 700, spacing: 1.2, fill: back ? INK.graphite3 : INK.graphite })}</g>`; };
  const sparks = AV_SP.map(s => `<line class="av-sp" x1="${f1(s.ox + Math.cos(s.a) * 6)}" y1="${f1(s.oy + Math.sin(s.a) * 6)}" x2="${f1(s.ox + Math.cos(s.a) * 17)}" y2="${f1(s.oy + Math.sin(s.a) * 17)}" stroke="${INK.hot}" stroke-width="2.6" stroke-linecap="round" opacity="0"/>`).join('');
  return `
  <g class="av-tb">${k.titleBlock(54, 50, { title: 'PROPERTIES OF METALS', no: 'PR 01', scale: '1:10', w: 236 })}</g>
  <path class="av-ring av-rb" d="${half(180, 360)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="22 4 3 4" opacity=".7"/>
  <g class="av-back">${AV_NAMES.map((_, i) => name(i, true)).join('')}</g>
  ${ground(k, 150, 454, 324, 16, 'top', 'av-floor')}
  <path class="av-wash" d="${AV_BODY}" fill="${BRZ}"/>
  <rect class="av-plh" x="220" y="300" width="250" height="14" fill="${k.hatch('steel')}"/>
  <path class="av-ol" d="${AV_BODY}" fill="none" ${k.stroke.thick}/>
  <line class="av-pl" x1="220" y1="314" x2="470" y2="314" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <path class="av-hid" d="M432 314V331M452 314V327M408 314V349M416 314V343" fill="none" ${k.stroke.hidden}/>
  <ellipse class="av-glow" cx="337" cy="292" rx="74" ry="20" fill="${INK.hot}" opacity="0"/>
  <rect class="av-bar" x="282" y="284" width="112" height="16" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
  <path class="av-ring av-rf" d="${half(0, 180)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="22 4 3 4" opacity=".7"/>
  <g class="av-front">${AV_NAMES.map((_, i) => name(i, false)).join('')}</g>
  <g class="av-ham">
    <path class="av-hdl" d="M356 228L540 232Q554 240 540 248L356 244Z" fill="${WOOD}" ${k.stroke.thick}/>
    <path class="av-hw" d="M318 284L356 284L356 222L346 194L328 194L318 222Z" fill="#fff"/>
    <path class="av-hh" d="M318 284L356 284L356 222L346 194L328 194L318 222Z" fill="${k.hatch('steel')}"/>
    <path class="av-ho" d="M318 284L356 284L356 222L346 194L328 194L318 222Z" fill="none" ${k.stroke.thick}/>
    <path class="av-eye" d="M318 228H356M318 244H356" fill="none" ${k.stroke.hidden}/>
  </g>
  <g class="av-sparks">${sparks}</g>`;
}
function anvilPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { INK } = k;
  const ham = q('.av-ham'), fr = qa('.av-front .av-n'), bk = qa('.av-back .av-n'), sp = qa('.av-sp'), pv = `${AV.pv[0]} ${AV.pv[1]}`;
  const ring = { a: 0 };
  const renderRing = () => AV_NAMES.forEach((_, i) => {
    const p = avAt(i, ring.a), s = .76 + .24 * (p.d + 1) / 2, tr = `translate(${f1(p.x)} ${f1(p.y)}) scale(${(+s).toFixed(3)})`, front = cl((p.d + .1) / .2);
    fr[i].setAttribute('transform', tr); bk[i].setAttribute('transform', tr); op(fr[i], front); op(bk[i], (1 - front) * .75);
    fr[i].firstElementChild.setAttribute('fill', p.d > .94 ? INK.bronze : INK.graphite);
  });
  const burst = (T, at) => {
    T.fromTo(sp, { x: 0, y: 0, opacity: 1 }, { x: i => Math.cos(AV_SP[i].a) * AV_SP[i].d, y: i => Math.sin(AV_SP[i].a) * AV_SP[i].d + AV_SP[i].g, opacity: 0, duration: .7, ease: 'power2.out', stagger: .008, immediateRender: false }, at)
      .fromTo(q('.av-glow'), { opacity: 0 }, { opacity: .32, duration: .12, yoyo: true, repeat: 1, repeatDelay: .1, ease: 'power1.out', immediateRender: false }, '<');
  };
  renderRing();
  gsap.set(ham, { rotation: k.reduced() ? 0 : AV.up, svgOrigin: pv });
  const t = k.tl();
  k.plot(t, [q('.av-ol'), q('.av-floor .gd-f')], { dur: 1.1, stagger: .2 });
  k.ink(t, [q('.av-wash'), q('.av-plh'), q('.av-floor .gd-h')], { at: .7, stagger: .08 });
  k.plot(t, [q('.av-pl'), q('.av-hid')], { at: .9, stagger: .1, dur: .5 });
  k.stamp(t, q('.av-bar'), { at: 1.1 });
  k.plot(t, [q('.av-ho'), q('.av-hdl')], { at: .8, stagger: .15, dur: .8 });
  k.ink(t, [q('.av-hw'), q('.av-hh'), q('.av-eye')], { at: 1.3 });
  k.plot(t, qa('.av-ring'), { at: 1, stagger: .2, dur: .9 });
  t.from([...fr, ...bk].map(e => e.firstElementChild), { opacity: 0, duration: .4, stagger: .04 }, 1.4);
  t.from(q('.av-tb'), { opacity: 0, y: 8, duration: .5 }, 1.2);
  if (k.reduced()) { sp.forEach((e, i) => gsap.set(e, { x: Math.cos(AV_SP[i].a) * AV_SP[i].d * .45, y: Math.sin(AV_SP[i].a) * AV_SP[i].d * .45, opacity: .9 })); return t; }
  // eight blows = one full turn of the ring, so the loop closes on itself
  const L = gsap.timeline({ repeat: -1, delay: 2.2 });
  AV_NAMES.forEach((_, i) => {
    L.to(ham, { rotation: 0, svgOrigin: pv, duration: .3, ease: 'power2.in' });
    burst(L, '>');
    L.to(ham, { rotation: 7, svgOrigin: pv, duration: .16, ease: 'power2.out' })
      .to(ham, { rotation: AV.up, svgOrigin: pv, duration: .85, ease: 'power2.inOut' })
      .to(ring, { a: (i + 1) * 45, duration: 1.05, ease: 'power2.inOut', onUpdate: renderRing }, '<-.05')
      .to({}, { duration: i % 2 ? .9 : .35 });
  });
  return t;
}

/* ======================================================================================================
   hardness — a Vickers indenter (136° diamond) presses into a sectioned block and lifts; the plan view below shows
   the square impression and its diagonal d. Then a scriber drags across: the scratch.
   ====================================================================================================== */
const HD = { up: 62, pen: 8, hb: 19.8 };
function hardnessDraw(k) {
  const { INK, W } = k; const hb = HD.hb;
  return `
  <rect class="hd-bh" x="70" y="250" width="460" height="68" fill="${k.hatch('steel')}"/>
  <rect class="hd-bo" x="70" y="250" width="460" height="68" fill="none" ${k.stroke.thick}/>
  <g class="hd-dent" opacity="0"><polygon points="${P([[300 - hb - 1.6, 248.2], [300 + hb + 1.6, 248.2], [300, 258.6]])}" fill="#fff"/><path d="M${f1(300 - hb)} 250L300 258L${f1(300 + hb)} 250" fill="none" ${k.stroke.thick}/></g>
  <g class="hd-ind">
    ${force(k, 300, 52, 300, 112, { cls: 'hd-F' })}
    <rect class="hd-io" x="274" y="118" width="52" height="78" fill="#fff" ${k.stroke.thick}/>
    <path class="hd-io" d="M274 196L326 196L316 222L284 222Z" fill="#fff" ${k.stroke.thick}/>
    <rect class="hd-io" x="287" y="222" width="26" height="18" fill="#fff" ${k.stroke.thick}/>
    <polygon class="hd-dia" points="${P([[300 - 24.75, 240], [300 + 24.75, 240], [300, 250]])}" fill="#DCEBF8" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>
    <path class="hd-ang" d="M${f1(300 + 46 * Math.cos(-158 * Math.PI / 180))} ${f1(250 + 46 * Math.sin(-158 * Math.PI / 180))}A46 46 0 0 1 ${f1(300 + 46 * Math.cos(-22 * Math.PI / 180))} ${f1(250 + 46 * Math.sin(-22 * Math.PI / 180))}" fill="none" stroke="${INK.red}" stroke-width="${W.thin}" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
    ${k.text(352, 228, '136°', { size: 19, fill: INK.red, weight: 700, anchor: 'start', extra: 'class="hd-at"' })}
  </g>
  <g class="hd-sty" transform="translate(372 0)" opacity="0">
    <line x1="19" y1="216" x2="66" y2="135" stroke="${INK.graphite2}" stroke-width="10" stroke-linecap="round"/>
    <polygon points="0,250 23.5,212.5 14.5,219" fill="${INK.graphite}"/>
    ${force(k, 30, 112, 88, 112, { cls: 'hd-sf', w: 4, head: 12, hw: 5 })}
  </g>
  <rect class="hd-po" x="70" y="372" width="460" height="148" fill="#fff" ${k.stroke.thick}/>
  <g class="hd-proj" opacity="0">${hair(k, 300 - hb, 262, 300 - hb, 372, INK.blue, 'stroke-dasharray="4 4"')}${hair(k, 300 + hb, 262, 300 + hb, 372, INK.blue, 'stroke-dasharray="4 4"')}</g>
  <g class="hd-imp" opacity="0">
    <polygon points="${P([[300 - hb, 442], [300, 442 - hb], [300 + hb, 442], [300, 442 + hb]])}" fill="${BRZ}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <path d="M${f1(300 - hb)} 442H${f1(300 + hb)}M300 ${f1(442 - hb)}V${f1(442 + hb)}" stroke="${INK.graphite}" stroke-width="${W.hair}"/>
    ${k.dim(300 - hb, 442, 300 + hb, 442, 'd', { off: 34, color: INK.red, size: 18 })}
    ${k.text(300, 512, 'penetration', { size: 16, fill: INK.graphite2 })}
  </g>
  <line class="hd-scr" x1="372" y1="413.5" x2="500" y2="413.5" stroke="${INK.graphite}" stroke-width="3"/>
  <circle class="hd-tip" cx="372" cy="413.5" r="4.5" fill="${INK.graphite}" opacity="0"/>
  <g class="hd-scl" opacity="0">${k.text(436, 440, 'scratch', { size: 16, fill: INK.graphite2 })}</g>`;
}
function hardnessPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const ind = q('.hd-ind'), sty = q('.hd-sty'), scr = q('.hd-scr'), tip = q('.hd-tip'), SL = 130;
  scr.style.strokeDasharray = `${SL} ${SL}`;
  const sc = { u: 0 };
  const scratch = () => { scr.style.strokeDashoffset = f1(SL * (1 - sc.u)); const x = 372 + 128 * sc.u; set(sty, { transform: `translate(${f1(x)} 0)` }); set(tip, { cx: x }); };
  scratch();
  gsap.set(ind, { y: k.reduced() ? 0 : -HD.up });
  const t = k.tl();
  k.plot(t, [q('.hd-bo'), q('.hd-po')], { dur: .8, stagger: .2 });
  k.ink(t, q('.hd-bh'), { at: .5 });
  k.plot(t, qa('.hd-io'), { at: .6, stagger: .1, dur: .5 }); k.ink(t, q('.hd-dia'), { at: 1 });
  plotM(k, t, q('.hd-ang'), { at: 1.1, dur: .5 }); k.stamp(t, [q('.hd-at'), q('.hd-F')], { at: 1.3, stagger: .1 });
  if (k.reduced()) {
    gsap.set([q('.hd-dent'), q('.hd-proj'), q('.hd-imp'), sty, tip, q('.hd-scl')], { opacity: 1 }); sc.u = 1; scratch();
    return t;
  }
  const L = gsap.timeline({ repeat: -1, delay: 1.9 });
  L.to(ind, { y: HD.pen, duration: .85, ease: 'power2.in' })
    .to({}, { duration: .7 })
    .set(q('.hd-dent'), { opacity: 1 })
    .to(ind, { y: -HD.up, duration: .8, ease: 'power2.inOut' })
    .to(q('.hd-proj'), { opacity: 1, duration: .4 }, '<.2')
    .fromTo(q('.hd-imp'), { opacity: 0, scale: .2, svgOrigin: '300 442' }, { opacity: 1, scale: 1, svgOrigin: '300 442', duration: .55, ease: 'back.out(1.8)', immediateRender: false }, '<.25')
    // the scriber
    .to([sty, tip], { opacity: 1, duration: .35 }, '+=.3')
    .to(sc, { u: 1, duration: 1.8, ease: 'power1.inOut', onUpdate: scratch })
    .to(q('.hd-scl'), { opacity: 1, duration: .4 }, '-=.4')
    .to({}, { duration: 1.3 })
    .to([q('.hd-dent'), q('.hd-proj'), q('.hd-imp'), sty, tip, q('.hd-scl'), scr], { opacity: 0, duration: .5 })
    .add(() => { sc.u = 0; scratch(); })
    .set(scr, { opacity: 1 })
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   ductile — wire drawing in section: a copper rod is pulled through a die (steel casing, carbide nib) and leaves as
   fine wire, wound on a drum. The flow marks show it: the wire runs much faster than the rod (same volume).
   ====================================================================================================== */
const DU = { hw0: 28, hw1: 13, cx: 300, ent: 46, sp0: 34, sp1: 158, drum: [476, 363] };
function ductileDraw(k) {
  const { INK, W } = k; const { hw0, hw1 } = DU; const [dx, dy] = DU.drum;
  const xc = 252 + (DU.ent - hw0) * 48 / (DU.ent - hw1); // where the rod meets the cone
  const up = [[252, 172], [352, 172], [352, 280], [316, 287], [300, 287], [252, 254]], lo = up.map(([x, y]) => [x, 600 - y]);
  const nibU = [[262, 228], [342, 228], [342, 281.9], [316, 287], [300, 287], [262, 260.9]], nibL = nibU.map(([x, y]) => [x, 600 - y]);
  const work = `M60 ${300 - hw0}L${f1(xc)} ${300 - hw0}L300 ${300 - hw1}L${dx} ${300 - hw1}L${dx} ${300 + hw1}L300 ${300 + hw1}L${f1(xc)} ${300 + hw0}L60 ${300 + hw0}`;
  let rt = '', wt = '';
  for (let i = -1; i < 8; i++) rt += `<line x1="${60 + i * DU.sp0}" y1="${300 - hw0 + 5}" x2="${60 + i * DU.sp0}" y2="${300 + hw0 - 5}" stroke="${INK.copper}" stroke-width="${W.med}"/>`;
  for (let i = -1; i < 2; i++) wt += `<line x1="${380 + i * DU.sp1}" y1="${300 - hw1 + 4}" x2="${380 + i * DU.sp1}" y2="${300 + hw1 - 4}" stroke="${INK.copper}" stroke-width="${W.med}"/>`;
  const spokes = [0, 120, 240].map(a => { const r = a * Math.PI / 180; return `<line x1="${f1(dx + 13 * Math.cos(r))}" y1="${f1(dy + 13 * Math.sin(r))}" x2="${f1(dx + 49 * Math.cos(r))}" y2="${f1(dy + 49 * Math.sin(r))}" ${k.stroke.thick}/>`; }).join('');
  return `
  <clipPath id="ductile-cr"><rect x="60" y="${300 - hw0}" width="${f1(xc - 60)}" height="${hw0 * 2}"/></clipPath>
  <clipPath id="ductile-cw"><rect x="352" y="${300 - hw1}" width="${dx - 46 - 352}" height="${hw1 * 2}"/></clipPath>
  <path class="du-wf" d="${work}Z" fill="${CU}"/>
  <g clip-path="url(#ductile-cr)"><g class="du-rt">${rt}</g></g>
  <g clip-path="url(#ductile-cw)"><g class="du-wt">${wt}</g></g>
  <path class="du-wo" d="${work}" fill="none" ${k.stroke.thick}/>
  ${k.center(48, 300, 380, 300, 'class="du-cl"')}
  <g class="du-die">
    <path class="du-dh" d="${D(up, true)}${D(lo, true)}" fill="${k.hatch('steel')}"/>
    <path class="du-nw" d="${D(nibU, true)}${D(nibL, true)}" fill="#fff"/><path class="du-nh" d="${D(nibU, true)}${D(nibL, true)}" fill="${k.hatch('refractory')}"/>
    <path class="du-no" d="M262 ${f1(nibU[5][1])}V228H342V${f1(nibU[2][1])}M262 ${f1(nibL[5][1])}V372H342V${f1(nibL[2][1])}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <path class="du-do" d="${D(up, true)}${D(lo, true)}" fill="none" ${k.stroke.thick}/>
  </g>
  <g class="du-drum">
    <circle class="du-ring" cx="${dx}" cy="${dy}" r="63" fill="none" stroke="${CU}" stroke-width="26"/>
    <circle class="du-rgo" cx="${dx}" cy="${dy}" r="76" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <circle class="du-bo" cx="${dx}" cy="${dy}" r="50" fill="#fff" ${k.stroke.thick}/>
    <g class="du-spk">${spokes}</g>
    <circle class="du-hub" cx="${dx}" cy="${dy}" r="13" fill="#fff" ${k.stroke.thick}/>
    ${k.center(dx - 90, dy, dx + 90, dy, 'class="du-dc"')}${k.center(dx, dy - 90, dx, dy + 90, 'class="du-dc"')}
  </g>
  ${earc(k, dx, dy, 100, 100, -116, -62, INK.hot, 'du-rot', 4)}
  ${force(k, 368, 254, 432, 254, { cls: 'du-F' })}${k.text(400, 238, 'F', { size: 24, weight: 700, fill: INK.hot, extra: 'class="du-Ft"' })}
  <g class="du-dims">
    ${dline(k, 'du-d0', INK.graphite, 'd₀', { size: 20, anchor: 'end' })}
    ${dline(k, 'du-d1', INK.red, 'd₁', { size: 20, anchor: 'start' })}
  </g>
  <g class="du-lab">${k.leader(326, 178, 376, 136, 'die', { size: 18 })}</g>`;
}
function ductilePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { hw0, hw1 } = DU; const [dx, dy] = DU.drum;
  dset(q('.du-d0'), 118, 300 - hw0, 118, 300 + hw0, 108, 307); dset(q('.du-d1'), 402, 300 - hw1, 402, 300 + hw1, 412, 330);
  const t = k.tl();
  k.plot(t, [q('.du-do'), q('.du-wo')], { dur: 1, stagger: .2 });
  k.ink(t, [q('.du-dh'), q('.du-nw'), q('.du-nh'), q('.du-wf')], { at: .6, stagger: .08 });
  k.plot(t, [q('.du-no'), q('.du-rgo'), q('.du-bo'), q('.du-hub'), ...qa('.du-spk line')], { at: .7, stagger: .06, dur: .6 });
  k.ink(t, [q('.du-ring'), q('.du-rt'), q('.du-wt')], { at: 1.1 });
  t.from([q('.du-cl'), ...qa('.du-dc')], { opacity: 0, duration: .4 }, 1);
  plotM(k, t, qa('.du-dims line'), { at: 1.2, stagger: .1, dur: .4 }); t.from(qa('.du-dims text'), { opacity: 0, duration: .3 }, 1.4);
  k.stamp(t, [q('.du-F'), q('.du-Ft'), q('.du-rot'), q('.du-lab')], { at: 1.3, stagger: .08 });
  if (k.reduced()) return t;
  // the process runs: same period for both, so the wire's marks run sp1/sp0 ≈ 4.6× faster than the rod's
  gsap.to(q('.du-rt'), { x: DU.sp0, duration: 1.6, ease: 'none', repeat: -1 });
  gsap.to(q('.du-wt'), { x: DU.sp1, duration: 1.6, ease: 'none', repeat: -1 });
  gsap.to(q('.du-spk'), { rotation: 360, svgOrigin: `${dx} ${dy}`, duration: 360 / ((DU.sp1 / 1.6) / 63 * 180 / Math.PI), ease: 'none', repeat: -1 });
  return t;
}

/* ======================================================================================================
   brittle / tough — the same impact rig (two knife-edge supports, a drop weight with a hazard band). Cast iron
   (ANSI31 hatch) cracks from the tension side and snaps into pieces with no stretch; steel (ANSI32) takes the blow,
   bends and stays in one piece.
   ====================================================================================================== */
const RG = { x0: 110, x1: 490, yt: 304, yb: 344, s0: 176, s1: 424, drop: 112 };
const BR_Z = [[300, 304], [295, 311], [304, 318], [296, 325], [305, 332], [298, 339], [300, 344]];
const BR_SH = [[[296, 309], [303, 306], [301, 315]], [[304, 320], [310, 324], [303, 327]], [[295, 330], [289, 333], [296, 337]], [[302, 337], [308, 341], [301, 343]], [[297, 316], [291, 320], [298, 322]], [[304, 330], [309, 334], [304, 336]]];
const BR_SV = [[-46, -62, -160], [58, -40, 220], [-62, 18, 190], [48, 30, -240], [-30, -84, 140], [70, -14, -180]];
function rigDraw(k, id) {
  const { INK, W } = k; const { yb, s0, s1 } = RG;
  const sup = x => `<polygon class="rg-sw" points="${P([[x, yb], [x - 26, 404], [x + 26, 404]])}" fill="#fff"/><polygon class="rg-sh" points="${P([[x, yb], [x - 26, 404], [x + 26, 404]])}" fill="${k.hatch('steel')}"/><polygon class="rg-so" points="${P([[x, yb], [x - 26, 404], [x + 26, 404]])}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>`;
  return {
    base: `${ground(k, 112, 404, 376, 18, 'top', 'rg-base')}${sup(s0)}${sup(s1)}`,
    tup: `<g class="rg-tup">
      <rect class="rg-ro" x="290" y="112" width="20" height="78" fill="#fff" ${k.stroke.thick}/>
      <rect class="rg-bh" x="262" y="206" width="76" height="74" fill="${k.hatch('steel')}"/>
      <g class="rg-hz">${k.hazard(262, 190, 76, 16, id)}</g>
      <path class="rg-bo" d="M262 190H338V280H324L300 304L276 280H262Z" fill="none" ${k.stroke.thick}/>
      <line x1="276" y1="280" x2="324" y2="280" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    </g>`
  };
}
function rigPlay(svg, k, t) {
  const [q, qa] = sel(svg);
  k.plot(t, [q('.rg-base .gd-f'), ...qa('.rg-so')], { dur: .7, stagger: .1 });
  k.ink(t, [q('.rg-base .gd-h'), ...qa('.rg-sw'), ...qa('.rg-sh')], { at: .5 });
  k.plot(t, [q('.rg-ro'), q('.rg-bo')], { at: .7, stagger: .12, dur: .6 });
  k.ink(t, [q('.rg-bh'), q('.rg-hz')], { at: 1.1 });
}
function brittleDraw(k) {
  const { INK, W } = k; const { x0, x1, yt, yb } = RG; const rig = rigDraw(k, 'brittle');
  const lf = [[x0, yt], ...BR_Z, [x0, yb]], rf = [[x1, yt], [x1, yb], ...BR_Z.slice().reverse()];
  const half = (pts, ol, z, cls) => `<g class="${cls}"><path class="br-w" d="${D(pts, true)}" fill="#fff"/><path class="br-h" d="${D(pts, true)}" fill="${k.hatch('iron')}"/><path class="br-o" d="${ol}" fill="none" ${k.stroke.thick}/><path class="br-z" d="${D(z)}" fill="none" ${k.stroke.thick} opacity="0"/></g>`;
  return `
  ${rig.base}
  <rect class="br-ghost" x="${x0}" y="${yt}" width="${x1 - x0}" height="${yb - yt}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4" opacity="0"/>
  ${half(lf, `M300 ${yt}H${x0}V${yb}H300`, BR_Z, 'br-l')}${half(rf, `M300 ${yt}H${x1}V${yb}H300`, BR_Z, 'br-r')}
  <path class="br-crack" d="${D(BR_Z.slice().reverse())}" fill="none" stroke="${INK.red}" stroke-width="${W.med}"/>
  <g class="br-sh">${BR_SH.map(s => `<polygon points="${P(s)}" fill="${INK.graphite}" opacity="0"/>`).join('')}</g>
  ${rig.tup}
  <g class="br-lab">${k.leader(140, yt + 6, 96, 246, 'cast iron', { size: 19 })}</g>
  <g class="br-say" opacity="0">${k.text(300, 470, 'no stretch — it snaps', { size: 19, weight: 700, fill: INK.red })}</g>`;
}
function brittlePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { s0, s1, yb, drop } = RG;
  const tup = q('.rg-tup'), l = q('.br-l'), r = q('.br-r'), crack = q('.br-crack'), sh = qa('.br-sh polygon');
  const CL = Math.ceil(crack.getTotalLength ? crack.getTotalLength() : 60) + 2; crack.style.strokeDasharray = `${CL} ${CL}`; crack.style.strokeDashoffset = CL;
  const t = k.tl();
  rigPlay(svg, k, t);
  k.plot(t, qa('.br-o'), { at: .4, stagger: .1, dur: .7 }); k.ink(t, [...qa('.br-w'), ...qa('.br-h')], { at: .8 });
  plotM(k, t, qa('.br-lab polyline, .br-lab line'), { at: 1.2 }); t.from(q('.br-lab text'), { opacity: 0, duration: .3 }, 1.4);
  const broken = T => {
    T.to(crack, { strokeDashoffset: 0, duration: .14, ease: 'none' })
      .set(qa('.br-z'), { opacity: 1 }).set(crack, { opacity: 0 })
      .to(l, { rotation: 19, svgOrigin: `${s0} ${yb}`, y: 8, duration: .5, ease: 'power2.in' })
      .to(r, { rotation: -19, svgOrigin: `${s1} ${yb}`, y: 8, duration: .5, ease: 'power2.in' }, '<')
      .to(tup, { y: 30, duration: .3, ease: 'power2.out' }, '<')
      .to(q('.br-ghost'), { opacity: .9, duration: .4 }, '<.2');
    sh.forEach((s, i) => T.fromTo(s, { x: 0, y: 0, rotation: 0, opacity: 1, transformOrigin: '50% 50%' }, { x: BR_SV[i][0], y: BR_SV[i][1] + 70, rotation: BR_SV[i][2], transformOrigin: '50% 50%', opacity: 0, duration: .9, ease: 'power1.in', immediateRender: false }, '<'));
    return T;
  };
  if (k.reduced()) { gsap.set(tup, { y: 30 }); gsap.set(l, { rotation: 19, svgOrigin: `${s0} ${yb}`, y: 8 }); gsap.set(r, { rotation: -19, svgOrigin: `${s1} ${yb}`, y: 8 }); gsap.set([...qa('.br-z'), q('.br-ghost'), q('.br-say')], { opacity: 1 }); gsap.set(crack, { opacity: 0 }); return t; }
  gsap.set(tup, { y: -drop });
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to(tup, { y: 0, duration: .42, ease: 'power2.in' });
  broken(L);
  L.to(q('.br-say'), { opacity: 1, duration: .4 }, '-=.3')
    .to({}, { duration: 1.6 })
    .to([l, r, q('.br-ghost'), q('.br-say')], { opacity: 0, duration: .45 })
    .to(tup, { y: -drop, duration: .9, ease: 'power2.inOut' }, '<')
    .set([l, r], { rotation: 0, y: 0 }).set(qa('.br-z'), { opacity: 0 }).set(crack, { opacity: 1, strokeDashoffset: CL })
    .to([l, r], { opacity: 1, duration: .5 })
    .to({}, { duration: .6 });
  return t;
}
const TG = { dmax: 34, r: 14 };
function tgBar(d) {
  const { x0, x1, yt, yb, s0 } = RG; const half = 300 - s0, g = u => Math.sqrt(u * u + TG.r * TG.r) - TG.r, gS = g(half);
  const f = x => { const u = Math.abs(x - 300); return u <= half ? 1 - g(u) / gS : -(u - half) / gS * (half / Math.sqrt(half * half + TG.r * TG.r)); };
  const xs = []; for (let x = x0; x <= x1; x += 5) xs.push(x);
  const top = xs.map(x => [x, yt + d * f(x) + 5 * (d / TG.dmax) * Math.exp(-(((x - 300) / 7) ** 2))]), bot = xs.map(x => [x, yb + d * f(x)]);
  return { fill: D([...top, ...bot.slice().reverse()], true), ol: D([...top, ...bot.slice().reverse()], true) };
}
function toughDraw(k) {
  const { INK, W } = k; const { x0, x1, yt, yb } = RG; const rig = rigDraw(k, 'tough'), b = tgBar(0);
  return `
  ${rig.base}
  <rect class="tg-ghost" x="${x0}" y="${yt}" width="${x1 - x0}" height="${yb - yt}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4" opacity="0"/>
  <g class="tg-bar"><path class="tg-w" d="${b.fill}" fill="#fff"/><path class="tg-h" d="${b.fill}" fill="${k.hatch('steel')}"/><path class="tg-o" d="${b.ol}" fill="none" ${k.stroke.thick}/></g>
  ${rig.tup}
  <g class="tg-lab">${k.leader(140, yt + 6, 96, 246, 'steel', { size: 19 })}</g>
  <g class="tg-say" opacity="0">${k.text(300, 470, 'bends, no fracture', { size: 19, weight: 700, fill: INK.graphite })}</g>`;
}
function toughPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { drop } = RG;
  const tup = q('.rg-tup'), w = q('.tg-w'), h = q('.tg-h'), o = q('.tg-o'), st = { d: 0 };
  const render = () => { const b = tgBar(st.d); set(w, { d: b.fill }); set(h, { d: b.fill }); set(o, { d: b.ol }); };
  const t = k.tl();
  rigPlay(svg, k, t);
  k.plot(t, o, { at: .4, dur: .8 }); k.ink(t, [w, h], { at: .8 });
  plotM(k, t, qa('.tg-lab polyline, .tg-lab line'), { at: 1.2 }); t.from(q('.tg-lab text'), { opacity: 0, duration: .3 }, 1.4);
  if (k.reduced()) { st.d = TG.dmax; render(); gsap.set(tup, { y: TG.dmax - 4 }); gsap.set([q('.tg-ghost'), q('.tg-say')], { opacity: 1 }); return t; }
  gsap.set(tup, { y: -drop });
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to(tup, { y: 0, duration: .42, ease: 'power2.in' })
    .to(st, { d: TG.dmax, duration: .32, ease: 'power3.out', onUpdate: render })
    .to(tup, { y: TG.dmax, duration: .32, ease: 'power3.out' }, '<')
    .to(q('.tg-ghost'), { opacity: .9, duration: .4 }, '<.1')
    .to(tup, { y: TG.dmax - 12, duration: .3, ease: 'power2.out' })
    .to(tup, { y: TG.dmax - 4, duration: .35, ease: 'power2.in' })
    .to(q('.tg-say'), { opacity: 1, duration: .4 }, '<')
    .to(tup, { y: -drop, duration: 1.1, ease: 'power2.inOut' }, '+=1.2')
    .to([q('.tg-bar'), q('.tg-ghost'), q('.tg-say')], { opacity: 0, duration: .45 }, '-=.5')
    .add(() => { st.d = 0; render(); })
    .to(q('.tg-bar'), { opacity: 1, duration: .5 }, '+=.1')
    .to({}, { duration: .6 });
  return t;
}

/* ======================================================================================================
   malleable — a two-high rolling mill: a thick slab goes into the roll gap and comes out a long thin sheet (the same
   metal, h₀ → h₁). The rolls turn the whole time; a fresh slab follows.
   ====================================================================================================== */
const ML = { r: 92, cu: [300, 196], cl: [300, 404], h0: 84, h1: 24, s0: 64 };
const ML_BITE = 300 - Math.sqrt(ML.r * ML.r - (300 - ML.h0 / 2 - ML.cu[1]) ** 2);
function mlPath(xL, xR) {
  const t0 = 300 - ML.h0 / 2, b0 = 300 + ML.h0 / 2, t1 = 300 - ML.h1 / 2, b1 = 300 + ML.h1 / 2, R = ML.r, xb = f1(ML_BITE);
  return `M${f1(xL)} ${t0}L${xb} ${t0}A${R} ${R} 0 0 0 300 ${t1}L${f1(xR)} ${t1}L${f1(xR)} ${b1}L300 ${b1}A${R} ${R} 0 0 0 ${xb} ${b0}L${f1(xL)} ${b0}Z`;
}
function malleableDraw(k) {
  const { INK, W } = k; const xL = ML_BITE - ML.s0;
  const roll = (c, cls) => `<g class="${cls}"><circle class="ml-ro" cx="${c[0]}" cy="${c[1]}" r="${ML.r}" fill="#fff" ${k.stroke.thick}/>
    <circle cx="${c[0]}" cy="${c[1]}" r="28" fill="none" stroke="${INK.graphite2}" stroke-width="${W.thin}" class="ml-neck"/>
    <g class="ml-mk">${[0, 120, 240].map(a => { const r = a * Math.PI / 180; return `<line x1="${f1(c[0] + 36 * Math.cos(r))}" y1="${f1(c[1] + 36 * Math.sin(r))}" x2="${f1(c[0] + 82 * Math.cos(r))}" y2="${f1(c[1] + 82 * Math.sin(r))}" stroke="${INK.graphite2}" stroke-width="${W.med}"/>`; }).join('')}
      <circle cx="${f1(c[0] + 60)}" cy="${c[1]}" r="6" fill="${INK.graphite2}"/></g>
    ${k.center(c[0] - ML.r - 14, c[1], c[0] + ML.r + 14, c[1], 'class="ml-c"')}${k.center(c[0], c[1] - ML.r - 14, c[0], c[1] + ML.r + 14, 'class="ml-c"')}</g>`;
  return `
  <g class="ml-work"><path class="ml-wf" d="${mlPath(xL, 300)}" fill="${BRZ}"/><path class="ml-wo" d="${mlPath(xL, 300)}" fill="none" ${k.stroke.thick}/></g>
  ${roll(ML.cu, 'ml-up')}${roll(ML.cl, 'ml-lo')}
  ${earc(k, ML.cu[0], ML.cu[1], 110, 110, 216, 152, INK.hot, 'ml-ra', 4.5)}${earc(k, ML.cl[0], ML.cl[1], 110, 110, 144, 208, INK.hot, 'ml-ra', 4.5)}
  <g class="ml-d0">${dline(k, 'ml-d0d', INK.graphite, 'h₀', { size: 20, anchor: 'end' })}</g>
  <g class="ml-d1" opacity="0">${dline(k, 'ml-d1d', INK.red, 'h₁', { size: 20, anchor: 'start' })}</g>`;
}
function malleablePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const wf = q('.ml-wf'), wo = q('.ml-wo'), d0 = q('.ml-d0d'), d1 = q('.ml-d1d'), xL0 = ML_BITE - ML.s0, out = ML.s0 * ML.h0 / ML.h1;
  const st = { u: 0 };
  const render = () => {
    const xL = xL0 + ML.s0 * st.u, xR = 300 + out * st.u, p = mlPath(xL, xR); set(wf, { d: p }); set(wo, { d: p });
    dset(d0, xL - 14, 300 - ML.h0 / 2, xL - 14, 300 + ML.h0 / 2, xL - 22, 307); op(q('.ml-d0'), cl((1 - st.u) * 3));
    dset(d1, xR + 14, 300 - ML.h1 / 2, xR + 14, 300 + ML.h1 / 2, xR + 22, 307); op(q('.ml-d1'), cl((xR - 330) / 50));
  };
  const t = k.tl();
  if (k.reduced()) st.u = .62;
  render();
  k.plot(t, [...qa('.ml-ro'), wo], { dur: .9, stagger: .15 });
  k.ink(t, wf, { at: .7 });
  k.plot(t, [...qa('.ml-neck'), ...qa('.ml-mk line')], { at: .8, stagger: .05, dur: .5 });
  t.from([...qa('.ml-c'), ...qa('.ml-mk circle')], { opacity: 0, duration: .4 }, 1);
  k.stamp(t, [...qa('.ml-ra'), q('.ml-d0')], { at: 1.2, stagger: .1 });
  if (k.reduced()) return t;
  const T = 4.2, deg = out / T / ML.r * 180 / Math.PI; // the rolls' surface runs at the sheet's speed
  gsap.to(q('.ml-up .ml-mk'), { rotation: -360, svgOrigin: `${ML.cu[0]} ${ML.cu[1]}`, duration: 360 / deg, ease: 'none', repeat: -1 });
  gsap.to(q('.ml-lo .ml-mk'), { rotation: 360, svgOrigin: `${ML.cl[0]} ${ML.cl[1]}`, duration: 360 / deg, ease: 'none', repeat: -1 });
  const L = gsap.timeline({ repeat: -1, delay: 1.7 });
  L.to(st, { u: 1, duration: T, ease: 'none', onUpdate: render })
    .to(q('.ml-work'), { x: 60, opacity: 0, duration: .7, ease: 'power1.in' })
    .to(q('.ml-d1'), { opacity: 0, duration: .4 }, '<')
    .add(() => { st.u = 0; render(); })
    .set(q('.ml-work'), { x: -30 })
    .to(q('.ml-work'), { x: 0, opacity: 1, duration: .6, ease: 'power2.out' }, '+=.2')
    .to({}, { duration: .3 });
  return t;
}

/* ======================================================================================================
   castable — a ladle tilts and pours into a sand mould (section: cope and drag, sprue, runner, riser); the metal
   rises through the cavity, the ladle comes back, and the casting freezes into its shape.
   ====================================================================================================== */
const CA = { pv: [170, 160], tilt: 55, lvl0: 444, lvl1: 296 };
const CA_CAV = 'M234 300L248 316L248 404L300 404L300 440L460 440L460 400L410 400L410 350L395 350L395 300L365 300L365 350L350 350L350 400L300 400L300 392L260 392L260 316L274 300Z';
function castableDraw(k) {
  const { INK, W } = k;
  return `
  <clipPath id="castable-lvl"><rect class="ca-lv" x="214" y="${CA.lvl0}" width="312" height="${500 - CA.lvl0}"/></clipPath>
  <clipPath id="castable-lm"><rect x="90" y="126" width="140" height="100"/></clipPath>
  <rect class="ca-sand" x="214" y="300" width="312" height="200" fill="${k.hatch('stipple')}"/>
  <path class="ca-cw" d="${CA_CAV}" fill="#fff"/>
  <path class="ca-hot" d="${CA_CAV}" fill="${INK.hot}" clip-path="url(#castable-lvl)"/>
  <g class="ca-solid" opacity="0"><path d="${CA_CAV}" fill="${BRZ}"/><path d="${CA_CAV}" fill="${k.hatch('iron')}"/></g>
  <path class="ca-co" d="${CA_CAV}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
  <rect class="ca-fo" x="214" y="300" width="312" height="200" fill="none" ${k.stroke.thick}/>
  <line class="ca-pl" x1="200" y1="390" x2="540" y2="390" ${k.stroke.thick}/>
  ${k.text(532, 352, 'cope', { size: 15, anchor: 'start', fill: INK.graphite2, extra: 'class="ca-t"' })}${k.text(532, 452, 'drag', { size: 15, anchor: 'start', fill: INK.graphite2, extra: 'class="ca-t"' })}
  <rect class="ca-stream" x="250" y="182" width="8" height="0" fill="${INK.hot}"/>
  <line class="ca-bail" x1="${CA.pv[0]}" y1="40" x2="${CA.pv[0]}" y2="151" ${k.stroke.thick}/>
  <g class="ca-ladle">
    <path class="ca-lh" d="M98 104L216 104L234 97L226 114L206 214L112 214Z" fill="${k.hatch('refractory')}"/>
    <path class="ca-lw" d="M110 116L208 116L196 202L120 202Z" fill="#fff"/>
    <path class="ca-lm" d="M110 116L208 116L196 202L120 202Z" fill="${INK.hot}" clip-path="url(#castable-lm)"/>
    <path class="ca-lo" d="M98 104L216 104L234 97L226 114L206 214L112 214Z" fill="none" ${k.stroke.thick}/>
    <path class="ca-li" d="M110 116L208 116L196 202L120 202Z" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  </g>
  <circle class="ca-tr" cx="${CA.pv[0]}" cy="${CA.pv[1]}" r="9" fill="#fff" ${k.stroke.thick}/>
  <g class="ca-lab">${k.leader(262, 236, 318, 206, 'molten metal', { size: 17, color: INK.hot })}</g>`;
}
function castablePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const pv = `${CA.pv[0]} ${CA.pv[1]}`;
  const lv = q('.ca-lv'), stream = q('.ca-stream'), lad = q('.ca-ladle'), st = { y: CA.lvl0 };
  const level = () => set(lv, { y: st.y, height: 500 - st.y });
  const t = k.tl();
  k.plot(t, [q('.ca-fo'), q('.ca-pl'), q('.ca-co')], { dur: .8, stagger: .15 });
  k.ink(t, [q('.ca-sand'), q('.ca-cw')], { at: .5 });
  k.plot(t, [q('.ca-lo'), q('.ca-li'), q('.ca-bail'), q('.ca-tr')], { at: .6, stagger: .1, dur: .6 });
  k.ink(t, [q('.ca-lh'), q('.ca-lw'), q('.ca-lm')], { at: 1 });
  t.from(qa('.ca-t'), { opacity: 0, duration: .4 }, 1.1);
  gsap.set(q('.ca-lab'), { opacity: 0 });
  if (k.reduced()) { gsap.set(lad, { rotation: CA.tilt, svgOrigin: pv }); st.y = 360; level(); set(stream, { height: 118 }); gsap.set(q('.ca-lab'), { opacity: 1 }); return t; }
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to(lad, { rotation: CA.tilt, svgOrigin: pv, duration: 1.1, ease: 'power2.inOut' })
    .to(stream, { attr: { height: 118 }, duration: .25, ease: 'power1.in' })
    .to(q('.ca-lab'), { opacity: 1, duration: .4 }, '<')
    .to(st, { y: CA.lvl1, duration: 2.9, ease: 'power1.inOut', onUpdate: level })
    .to(stream, { attr: { y: 300, height: 0 }, duration: .3, ease: 'power1.in' })
    .to(q('.ca-lab'), { opacity: 0, duration: .3 }, '<')
    .to(lad, { rotation: 0, svgOrigin: pv, duration: 1, ease: 'power2.inOut' }, '<')
    .to(q('.ca-solid'), { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, '<.3')
    .to(q('.ca-hot'), { opacity: 0, duration: 1.3, ease: 'power1.inOut' }, '<')
    .to({}, { duration: 1.4 })
    .to(q('.ca-solid'), { opacity: 0, duration: .6 })
    .add(() => { st.y = CA.lvl0; level(); })
    .set(stream, { attr: { y: 182, height: 0 } }).set(q('.ca-hot'), { opacity: 1 })
    .to({}, { duration: .6 });
  return t;
}

/* ======================================================================================================
   resilience — a weight drops on a spring: it takes the shock, stores it and throws the weight back up. Beside it the
   stress–strain chart: the energy absorbed is the bronze triangle under the elastic line — inside the elastic limit.
   ====================================================================================================== */
const RS = { cx: 216, r: 56, base: 486, plate: 324, mass: 168, mh: 76, cmax: 54, O: [364, 486], E: [434, 356] };
function rsSpring(c) {
  const top = RS.plate + 12 + c, n = 6, p = (RS.base - top) / n, { cx, r } = RS;
  let fr = '', bk = '';
  for (let i = 0; i < n; i++) { const y = top + i * p; fr += `M${cx - r} ${f1(y)}L${cx + r} ${f1(y + p / 2)}`; bk += `M${cx + r} ${f1(y + p / 2)}L${cx - r} ${f1(y + p)}`; }
  return { fr, bk };
}
function resilienceDraw(k) {
  const { INK, W } = k; const { O, E } = RS; const s = rsSpring(0);
  return `
  ${ground(k, 110, RS.base, 216, 18, 'top', 'rs-base')}
  <path class="rs-bk" d="${s.bk}" fill="none" stroke="${INK.graphite2}" stroke-width="${W.med}" stroke-linecap="round"/>
  <path class="rs-fr" d="${s.fr}" fill="none" ${k.stroke.thick}/>
  <rect class="rs-pl" x="${RS.cx - 70}" y="${RS.plate}" width="140" height="12" fill="${TOOL}" ${k.stroke.thick}/>
  <g class="rs-m"><rect class="rs-mw" x="${RS.cx - 46}" y="${RS.mass}" width="92" height="${RS.mh}" fill="#fff"/><rect class="rs-mh" x="${RS.cx - 46}" y="${RS.mass}" width="92" height="${RS.mh}" fill="${k.hatch('lead')}"/>
    <rect class="rs-mo" x="${RS.cx - 46}" y="${RS.mass}" width="92" height="${RS.mh}" fill="none" ${k.stroke.thick}/></g>
  ${k.center(RS.cx, 150, RS.cx, RS.base + 10, 'class="rs-cl"')}
  <g class="rs-graph">
    <line class="rs-ax" x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="292" ${k.stroke.thick} marker-end="url(#arr)"/>
    <line class="rs-ax" x1="${O[0]}" y1="${O[1]}" x2="556" y2="${O[1]}" ${k.stroke.thick} marker-end="url(#arr)"/>
    ${k.text(348, 400, 'stress', { size: 16, rotate: -90 })}${k.text(556, 510, 'strain', { size: 16, anchor: 'end' })}
    <polygon class="rs-tri" points="${P([O, O, O])}" fill="${BRZ2}" stroke="${INK.bronze}" stroke-width="${W.thin}"/>
    <path class="rs-pc" d="M${E[0]} ${E[1]}C462 336 500 330 548 328" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 4"/>
    <line class="rs-el" x1="${O[0]}" y1="${O[1]}" x2="${E[0]}" y2="${E[1]}" ${k.stroke.thick}/>
    <circle class="rs-E" cx="${E[0]}" cy="${E[1]}" r="5.5" fill="#fff" stroke="${INK.red}" stroke-width="${W.med}"/>
    ${k.text(E[0] + 14, E[1] + 20, 'elastic limit', { size: 16, fill: INK.red, weight: 700, anchor: 'start', extra: 'class="rs-Et"' })}
    <g class="rs-lab" opacity="0"><line x1="432" y1="512" x2="420" y2="480" stroke="${INK.bronze}" stroke-width="${W.thin}" marker-end="url(#arr)"/>${k.text(440, 530, 'energy absorbed', { size: 16, fill: INK.bronze, weight: 700 })}</g>
  </g>`;
}
function resiliencePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { O, E } = RS;
  const fr = q('.rs-fr'), bk = q('.rs-bk'), pl = q('.rs-pl'), m = q('.rs-m'), tri = q('.rs-tri');
  const st = { drop: 0, c: 0 };
  const render = () => {
    const c = st.c * RS.cmax, s = rsSpring(c); set(fr, { d: s.fr }); set(bk, { d: s.bk });
    set(pl, { y: RS.plate + c }); set(m, { transform: `translate(0 ${f1(st.drop + c)})` });
    const f = st.c * .9, Px = lerp(O[0], E[0], f), Py = lerp(O[1], E[1], f); set(tri, { points: P([O, [Px, Py], [Px, O[1]]]) });
  };
  const t = k.tl();
  if (k.reduced()) { st.drop = RS.plate - RS.mass - RS.mh; st.c = 1; }
  render();
  k.plot(t, [q('.rs-base .gd-f'), fr, bk, pl, q('.rs-mo')], { dur: .7, stagger: .1 });
  k.ink(t, [q('.rs-base .gd-h'), q('.rs-mw'), q('.rs-mh')], { at: .6 });
  t.from(q('.rs-cl'), { opacity: 0, duration: .4 }, .8);
  plotM(k, t, qa('.rs-ax'), { at: .5, stagger: .1, dur: .6 }); t.from(qa('.rs-graph > text:not(.rs-Et)'), { opacity: 0, duration: .3 }, 1);
  k.plot(t, [q('.rs-el'), q('.rs-pc')], { at: .9, stagger: .2, dur: .6 }); k.stamp(t, [q('.rs-E'), q('.rs-Et')], { at: 1.3, stagger: .1 });
  if (k.reduced()) { gsap.set(q('.rs-lab'), { opacity: 1 }); return t; }
  const fall = RS.plate - RS.mass - RS.mh;
  const L = gsap.timeline({ repeat: -1, delay: 1.9, repeatDelay: .4 });
  L.to(st, { drop: fall, duration: .55, ease: 'power2.in', onUpdate: render })
    .to(st, { c: 1, duration: .3, ease: 'power2.out', onUpdate: render })
    .to(q('.rs-lab'), { opacity: 1, duration: .35 }, '<.1')
    .to(st, { c: 0, duration: .28, ease: 'power2.in', onUpdate: render })
    .to(st, { drop: 0, duration: .6, ease: 'power2.out', onUpdate: render })
    .to(q('.rs-lab'), { opacity: 0, duration: .5 }, '<.3')
    .to({}, { duration: .9 });
  return t;
}

/* ======================================================================================================
   machinable — turning on a lathe (plan view): a bar in the chuck, a tool with a carbide tip feeding along it,
   taking the diameter down; chips curl off the tool.
   ====================================================================================================== */
const MC = { x0: 112, x1: 506, t0: 245, b0: 355, t1: 262, b1: 338, txA: 478, txB: 200 };
function mcBar(tx) {
  const { x0, x1, t0, b0, t1, b1 } = MC;
  return `M${x0} ${t0}L${f1(tx - 10)} ${t0}L${f1(tx)} ${t1}L${x1} ${t1}L${x1} ${b1}L${f1(tx)} ${b1}L${f1(tx - 10)} ${b0}L${x0} ${b0}Z`;
}
const MC_CHIP = (() => { const p = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 3.6, r = 2.5 + i * .55; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return D(p); })();
function machinableDraw(k) {
  const { INK, W } = k; const tx = MC.txA, ty = MC.b1;
  const tool = `M0 0L14 6L44 40L44 150L-12 150L-12 30L-4 12Z`;
  return `
  <rect class="mc-chw" x="50" y="190" width="62" height="220" fill="${TOOL}"/>
  <rect class="mc-cho" x="50" y="190" width="62" height="220" fill="none" ${k.stroke.thick}/>
  <rect class="mc-jaw" x="112" y="222" width="30" height="23" fill="${TOOL}" ${k.stroke.thick}/><rect class="mc-jaw" x="112" y="355" width="30" height="23" fill="${TOOL}" ${k.stroke.thick}/>
  <path class="mc-bf" d="${mcBar(tx)}" fill="${BRZ}"/>
  <path class="mc-bo" d="${mcBar(tx)}" fill="none" ${k.stroke.thick}/>
  ${k.center(38, 300, 540, 300, 'class="mc-cl"')}
  ${earc(k, 526, 300, 13, 60, -72, 72, INK.hot, 'mc-rot', 4.5)}
  <g class="mc-chips">${[0, 1, 2, 3].map(() => `<path class="mc-chip" d="${MC_CHIP}" fill="none" stroke="${INK.bronze}" stroke-width="2.8" stroke-linecap="round" opacity="0"/>`).join('')}</g>
  <g class="mc-tool" transform="translate(${tx} ${ty})">
    <path class="mc-tw" d="${tool}" fill="${TOOL}"/>
    <polygon class="mc-ins" points="0,0 16,7 9,24 -6,16" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <path class="mc-to" d="${tool}" fill="none" ${k.stroke.thick}/>
    ${force(k, 96, 96, 54, 96, { cls: 'mc-feed', w: 4.5, head: 13, hw: 5.5 })}${k.text(76, 84, 'feed', { size: 15, fill: INK.hot, weight: 700, extra: 'class="mc-ft"' })}
  </g>`;
}
function machinablePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const bf = q('.mc-bf'), bo = q('.mc-bo'), tool = q('.mc-tool'), chips = qa('.mc-chip'), st = { x: MC.txA, dy: 0 };
  const render = () => { const d = mcBar(st.x); set(bf, { d }); set(bo, { d }); set(tool, { transform: `translate(${f1(st.x)} ${f1(MC.b1 + st.dy)})` }); };
  const t = k.tl();
  if (k.reduced()) st.x = 330;
  render();
  k.plot(t, [q('.mc-cho'), ...qa('.mc-jaw'), bo], { dur: .8, stagger: .12 });
  k.ink(t, [q('.mc-chw'), bf], { at: .6 });
  t.from(q('.mc-cl'), { opacity: 0, duration: .4 }, .8);
  k.plot(t, q('.mc-to'), { at: .9, dur: .7 }); k.ink(t, [q('.mc-tw'), q('.mc-ins')], { at: 1.2 });
  k.stamp(t, [q('.mc-rot'), q('.mc-feed'), q('.mc-ft')], { at: 1.3, stagger: .1 });
  if (k.reduced()) { chips.forEach((c, i) => gsap.set(c, { x: st.x - 14 - i * 16, y: MC.b1 + 22 + i * 18, rotation: i * 70, opacity: 1 })); return t; }
  // chips: each one is born at the tool's tip, curls, drops away; re-aimed every repeat (the tool keeps moving)
  chips.forEach((c, i) => gsap.timeline({ repeat: -1, repeatRefresh: true, delay: 2 + i * .3 })
    .fromTo(c, { x: () => st.x - 4, y: MC.b1 + 10, scale: .55, rotation: 0, transformOrigin: '50% 50%' }, { x: () => st.x - 26 - (i % 2) * 26, y: MC.b1 + 70 + i * 10, scale: 1.15, rotation: 160 + i * 45, duration: 1.2, ease: 'power2.out' })
    .fromTo(c, { opacity: 1 }, { opacity: 0, duration: .45, ease: 'power1.in' }, .75));
  const L = gsap.timeline({ repeat: -1, delay: 1.8 });
  L.to(q('.mc-chips'), { opacity: 1, duration: .2 })
    .to(st, { x: MC.txB, duration: 5, ease: 'none', onUpdate: render })
    .to(q('.mc-chips'), { opacity: 0, duration: .3 })
    .to(st, { dy: 44, duration: .4, ease: 'power2.inOut', onUpdate: render }, '<')
    .to([bf, bo], { opacity: 0, duration: .4 })
    .to(st, { x: MC.txA, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { set(tool, { transform: `translate(${f1(st.x)} ${f1(MC.b1 + st.dy)})` }); } }, '<')
    .add(() => render())
    .to([bf, bo], { opacity: 1, duration: .5 })
    .to(st, { dy: 0, duration: .4, ease: 'power2.inOut', onUpdate: render }, '<.1')
    .to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   weldable — two plates (plan view) joined by a weld: the torch travels the seam and leaves a rippled bead; section
   A–A below shows the 60° V-groove filling with weld metal (solid black once it has cooled, as drawings show it).
   ====================================================================================================== */
const WD = { x0: 80, x1: 522, ys: 258, a: 92, b: 510, sx: 300 };
function weldableDraw(k) {
  const { INK, W } = k; const { ys } = WD;
  let rip = ''; for (let x = WD.x0 + 4; x <= WD.x1 - 4; x += 7) rip += `M${x} ${ys - 12}Q${x + 9} ${ys} ${x} ${ys + 12}`;
  const r = 18.5;
  const lp = [[150, 456], [281.5, 456], [300, 488], [150, 488]], rp = [[454, 456], [322.5, 456], [304, 488], [454, 488]];
  const bead = `M${f1(281.5 - 3)} 456Q302 444 ${f1(322.5 + 3)} 456L304 488Q302 494 300 488Z`;
  const torch = `<g class="wd-torch">
      <path d="M-8 -10L-70 -112L-52 -124L8 -16Z" fill="${TOOL}" ${k.stroke.thick}/>
      <line x1="-61" y1="-118" x2="-96" y2="-176" stroke="${INK.graphite2}" stroke-width="${W.med}"/>
      <circle r="15" fill="#fff" ${k.stroke.thick}/><circle r="6" fill="${INK.graphite}"/>
      <g class="wd-arc">${[0, 60, 120, 180, 240, 300].map(a => { const t = a * Math.PI / 180; return `<line x1="${f1(19 * Math.cos(t))}" y1="${f1(19 * Math.sin(t))}" x2="${f1(28 * Math.cos(t))}" y2="${f1(28 * Math.sin(t))}" stroke="${INK.hot}" stroke-width="2.4" stroke-linecap="round"/>`; }).join('')}</g>
    </g>`;
  return `
  <defs><linearGradient id="weldable-heat" x1="0" x2="1"><stop offset="0" stop-color="${INK.hot}" stop-opacity="0"/><stop offset="1" stop-color="${INK.hot}" stop-opacity=".85"/></linearGradient>
    <clipPath id="weldable-clip"><rect class="wd-cr" x="${WD.x0}" y="${ys - 16}" width="0" height="32"/></clipPath>
    <clipPath id="weldable-sec"><rect class="wd-sr" x="270" y="496" width="60" height="0"/></clipPath></defs>
  <rect class="wd-p" x="${WD.x0 - 10}" y="128" width="${WD.x1 - WD.x0 + 20}" height="${ys - 2 - 128}" fill="#fff" ${k.stroke.thick}/>
  <rect class="wd-p" x="${WD.x0 - 10}" y="${ys + 2}" width="${WD.x1 - WD.x0 + 20}" height="${ys - 2 - 128}" fill="#fff" ${k.stroke.thick}/>
  <g clip-path="url(#weldable-clip)"><rect x="${WD.x0}" y="${ys - 12}" width="${WD.x1 - WD.x0}" height="24" fill="${BRZ2}"/><path d="${rip}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    <path d="M${WD.x0} ${ys - 12}H${WD.x1}M${WD.x0} ${ys + 12}H${WD.x1}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <rect class="wd-heat" x="${WD.x0 - 90}" y="${ys - 12}" width="90" height="24" fill="url(#weldable-heat)"/></g>
  <g class="wd-sec">${k.section(WD.sx, 112, WD.sx, 404, 'A')}</g>
  <g class="wd-view">
    <path class="wd-sh" d="${D(lp, true)}${D(rp, true)}" fill="${k.hatch('steel')}"/>
    <path class="wd-so" d="${D(lp, true)}${D(rp, true)}" fill="none" ${k.stroke.thick}/>
    <path class="wd-bead" d="${bead}" fill="${INK.graphite}" clip-path="url(#weldable-sec)"/>
    <path class="wd-bhot" d="${bead}" fill="${INK.hot}" clip-path="url(#weldable-sec)"/>
    ${k.angle(302, 456 + 32 + 2 / Math.tan(Math.PI / 6), 58, -120, -60, '60°', { color: INK.red, size: 17 })}
    ${k.text(302, 530, 'SECTION A–A', { size: 15, weight: 700, spacing: 1 })}
  </g>
  <g class="wd-t" transform="translate(${WD.x0} ${ys})" opacity="0"><ellipse class="wd-pool" rx="16" ry="12" fill="${INK.hot}"/>${torch}</g>`;
}
function weldablePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { ys } = WD;
  const cr = q('.wd-cr'), heat = q('.wd-heat'), tor = q('.wd-t'), sr = q('.wd-sr'), st = { x: WD.x0, s: 0 };
  const render = () => { set(cr, { width: st.x - WD.x0 }); set(heat, { x: st.x - 90 }); set(tor, { transform: `translate(${f1(st.x)} ${ys})` }); };
  const sec = () => set(sr, { y: 496 - 56 * st.s, height: 56 * st.s });
  const t = k.tl();
  if (k.reduced()) { st.x = WD.x1; st.s = 1; }
  render(); sec();
  k.plot(t, qa('.wd-p'), { dur: .9, stagger: .15 });
  plotM(k, t, qa('.wd-sec line'), { at: .7, stagger: .05, dur: .5 }); t.from(qa('.wd-sec text'), { opacity: 0, duration: .3 }, 1);
  k.plot(t, q('.wd-so'), { at: .8, dur: .8 }); k.ink(t, q('.wd-sh'), { at: 1.2 });
  t.from(qa('.wd-view .k-angle, .wd-view > text'), { opacity: 0, duration: .4 }, 1.3);
  if (k.reduced()) { gsap.set([heat, q('.wd-bhot')], { opacity: 0 }); return t; }
  gsap.to(q('.wd-arc'), { scale: .78, transformOrigin: '50% 50%', duration: .32, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  const L = gsap.timeline({ repeat: -1, delay: 1.9 });
  L.set([heat, q('.wd-bhot')], { opacity: 1 })
    .to(tor, { opacity: 1, duration: .4 })
    .to(st, { x: WD.x1, duration: 5.2, ease: 'none', onUpdate: render })
    .to(st, { s: 1, duration: .9, ease: 'power1.inOut', onUpdate: sec }, 5.2 * (WD.sx - WD.x0) / (WD.x1 - WD.x0) + .1)
    .to(q('.wd-bhot'), { opacity: 0, duration: 1.2 }, '>.3')
    .to(tor, { opacity: 0, duration: .4 }, 4.9)
    .to(heat, { opacity: 0, duration: 1 }, '<.2')
    .to({}, { duration: 1.6 })
    .to([q('.wd-cr'), sr], { attr: { height: 0 }, duration: .5 })
    .add(() => { st.x = WD.x0; st.s = 0; render(); sec(); })
    .to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   physical — the physical properties as a quiet legend of glyphs, eight cells on one sheet. A red-pencil frame steps
   from cell to cell and that glyph does its one move. Stamped across the sheet: NOT EASILY ALTERED.
   ====================================================================================================== */
const PH = { x0: 52, y0: 112, w: 124, h: 160 };
const PH_NAMES = ['OPACITY', 'COLOR', 'DENSITY', 'CONDUCTIVITY', 'EXPANSION', 'MAGNETISM', 'MELTING POINT', 'CORROSION'];
function phGlyph(k, i, gx, gy) {
  const { INK, W } = k;
  switch (i) {
    case 0: return `${[-18, 0, 18].map(d => `<line class="ph-ray" x1="${gx - 46}" y1="${gy + d}" x2="${gx + 6}" y2="${gy + d}" stroke="${INK.blue}" stroke-width="${W.med}" marker-end="url(#arr-blue)"/>`).join('')}
      <rect x="${gx + 10}" y="${gy - 36}" width="16" height="72" fill="${k.hatch('steel')}"/><rect x="${gx + 10}" y="${gy - 36}" width="16" height="72" fill="none" ${k.stroke.thick}/>`;
    case 1: {
      const pts = []; for (let s = 0; s <= 1.0001; s += .025) { const bx = gx + 2 + 40 * s, by = gy + 26 - 64 * s, n = Math.sin(s * Math.PI * 7) * 4.5; pts.push([bx + n * .85, by + n * .53]); }
      return `<rect x="${gx - 46}" y="${gy + 28}" width="92" height="12" fill="${k.hatch('iron')}"/><line x1="${gx - 46}" y1="${gy + 28}" x2="${gx + 46}" y2="${gy + 28}" ${k.stroke.thick}/>
        <line x1="${gx - 40}" y1="${gy - 38}" x2="${gx - 2}" y2="${gy + 24}" stroke="${INK.graphite}" stroke-width="${W.med}" marker-end="url(#arr)"/>
        <path class="ph-wave" d="${D(pts)}" fill="none" stroke="${INK.bronze}" stroke-width="3" stroke-linecap="round"/>`;
    }
    case 2: return `<polygon points="${P([[gx, gy + 6], [gx - 12, gy + 36], [gx + 12, gy + 36]])}" fill="#fff" ${k.stroke.thick}/>
      <g class="ph-beam"><line x1="${gx - 48}" y1="${gy + 6}" x2="${gx + 48}" y2="${gy + 6}" ${k.stroke.thick}/>
        <rect x="${gx - 46}" y="${gy - 22}" width="28" height="28" fill="${k.hatch('lead')}"/><rect x="${gx - 46}" y="${gy - 22}" width="28" height="28" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
        <rect x="${gx + 18}" y="${gy - 22}" width="28" height="28" fill="${k.hatch('alu')}"/><rect x="${gx + 18}" y="${gy - 22}" width="28" height="28" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/></g>`;
    case 3: return `<rect x="${gx - 46}" y="${gy - 13}" width="92" height="26" fill="${CU}"/><rect x="${gx - 46}" y="${gy - 13}" width="92" height="26" fill="none" ${k.stroke.thick}/>
      <line class="ph-cur" x1="${gx - 40}" y1="${gy}" x2="${gx + 40}" y2="${gy}" stroke="${INK.blue}" stroke-width="3" stroke-dasharray="6 8"/>
      ${flame(k, gx - 34, gy + 44, .62, 'ph-fl')}`;
    case 4: return `<line x1="${gx - 44}" y1="${gy - 30}" x2="${gx - 44}" y2="${gy + 30}" ${k.stroke.thick}/>
      <rect class="ph-xb" x="${gx - 44}" y="${gy - 12}" width="66" height="24" fill="${k.hatch('alu')}"/><rect class="ph-xo" x="${gx - 44}" y="${gy - 12}" width="66" height="24" fill="none" ${k.stroke.thick}/>
      <line x1="${gx + 22}" y1="${gy - 26}" x2="${gx + 22}" y2="${gy + 26}" ${k.stroke.construct} stroke-dasharray="4 3"/>
      ${[-24, -2, 20].map(d => `<path class="ph-hw" d="M${gx + d - 6} ${gy + 34}q4 -5 0 -10t0 -10" fill="none" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round" opacity="0"/>`).join('')}`;
    case 5: return `<path d="M${gx - 30} ${gy - 30}V${gy + 4}A30 30 0 0 0 ${gx + 30} ${gy + 4}V${gy - 30}" fill="none" stroke="${INK.graphite}" stroke-width="14"/>
      <path d="M${gx - 30} ${gy - 30}V${gy + 4}A30 30 0 0 0 ${gx + 30} ${gy + 4}V${gy - 30}" fill="none" stroke="#fff" stroke-width="8"/>
      <rect x="${gx - 37}" y="${gy - 34}" width="14" height="14" fill="${INK.red}"/><rect x="${gx + 23}" y="${gy - 34}" width="14" height="14" fill="${INK.blue}"/>
      ${[16, 30].map(h => `<path class="ph-fld" d="M${gx - 30} ${gy - 36}C${gx - 30} ${gy - 36 - h} ${gx + 30} ${gy - 36 - h} ${gx + 30} ${gy - 36}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="4 4"/>`).join('')}`;
    case 6: return `${thermo(k, gx - 26, gy - 40, gy + 22, 'ph-th')}<line x1="${gx - 40}" y1="${gy - 18}" x2="${gx - 12}" y2="${gy - 18}" stroke="${INK.red}" stroke-width="${W.med}"/>
      ${k.text(gx - 8, gy - 13, 'Tm', { size: 14, fill: INK.red, weight: 700, anchor: 'start' })}
      <path class="ph-blk" d="M${gx + 4} ${gy + 30}V${gy + 2}H${gx + 40}V${gy + 30}Z" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      <path class="ph-drop" d="M${gx + 2} ${gy + 30}Q${gx + 22} ${gy + 18} ${gx + 42} ${gy + 30}Z" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.med}" opacity="0"/>`;
    default: return `<rect x="${gx - 46}" y="${gy + 2}" width="92" height="30" fill="${k.hatch('steel')}"/><path d="M${gx - 46} ${gy + 2}H${gx + 46}V${gy + 32}H${gx - 46}Z" fill="none" ${k.stroke.thick}/>
      ${[-24, 2, 26].map((d, j) => `<g class="ph-pit"><ellipse cx="${gx + d}" cy="${gy + 2}" rx="${[8, 10, 7][j]}" ry="${[6, 8, 5][j]}" fill="${INK.copper}" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>`).join('')}
      ${[-30, -6, 18].map((d, j) => `<g class="ph-o2"><circle cx="${gx + d}" cy="${gy - 30 + j * 6}" r="4.2" fill="#fff" stroke="${INK.blue}" stroke-width="1.6"/><circle cx="${gx + d + 7}" cy="${gy - 30 + j * 6}" r="4.2" fill="#fff" stroke="${INK.blue}" stroke-width="1.6"/></g>`).join('')}`;
  }
}
function physicalDraw(k) {
  const { INK, W } = k; const { x0, y0, w, h } = PH;
  let grid = `<rect class="ph-gr" x="${x0}" y="${y0}" width="${w * 4}" height="${h * 2}" fill="none" ${k.stroke.thick}/>`;
  for (let i = 1; i < 4; i++) grid += `<line class="ph-gl" x1="${x0 + w * i}" y1="${y0}" x2="${x0 + w * i}" y2="${y0 + h * 2}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`;
  grid += `<line class="ph-gl" x1="${x0}" y1="${y0 + h}" x2="${x0 + w * 4}" y2="${y0 + h}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>`;
  const cells = PH_NAMES.map((n, i) => { const cx = x0 + w * (i % 4) + w / 2, cy = y0 + h * Math.floor(i / 4); return `<g class="ph-c" data-i="${i}">${phGlyph(k, i, cx, cy + 66)}${k.text(cx, cy + 142, n, { size: 14, weight: 700, spacing: .8, extra: 'class="ph-n"' })}</g>`; }).join('');
  return `${grid}${cells}
  <rect class="ph-hl" x="${x0 + 5}" y="${y0 + 5}" width="${w - 10}" height="${h - 10}" fill="none" stroke="${INK.red}" stroke-width="${W.med}" opacity="0"/>
  <g class="ph-tb">${k.titleBlock(x0, 466, { title: 'PHYSICAL PROPERTIES', no: 'PR 11', scale: 'L2·S14', w: 236 })}</g>
  <g class="ph-stamp"><g transform="rotate(-5 ${x0 + w * 4 - 112} 486)"><rect x="${x0 + w * 4 - 222}" y="466" width="220" height="40" rx="4" fill="none" stroke="${INK.red}" stroke-width="${W.med}"/>
    ${k.text(x0 + w * 4 - 112, 494, 'NOT EASILY ALTERED', { size: 20, family: 'stencil', weight: 800, fill: INK.red, spacing: 1.5 })}</g></g>`;
}
function physicalPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { x0, y0, w, h } = PH;
  const c = qa('.ph-c'), hl = q('.ph-hl'), in_ = (i, s) => c[i].querySelectorAll(s);
  const t = k.tl();
  k.plot(t, [q('.ph-gr'), ...qa('.ph-gl')], { dur: .7, stagger: .06 });
  t.from(c, { opacity: 0, y: 8, duration: .45, stagger: .07 }, .5);
  t.from(q('.ph-tb'), { opacity: 0, y: 8, duration: .5 }, 1.2);
  k.stamp(t, q('.ph-stamp'), { at: 1.5 });
  gsap.set(in_(6, '.ph-th-c'), { scaleY: .3, svgOrigin: `${x0 + w * 2 + w / 2 - 26} ${y0 + h + 66 + 22}` });
  if (k.reduced()) return t;
  // each glyph's one move
  const cx = i => x0 + w * (i % 4) + w / 2, cy = i => y0 + h * Math.floor(i / 4) + 66;
  const moves = [
    T => T.fromTo(in_(0, '.ph-ray'), { strokeDasharray: '54 54', strokeDashoffset: 54 }, { strokeDashoffset: 0, duration: .55, stagger: .12, ease: 'power2.inOut', immediateRender: false }),
    T => T.fromTo(in_(1, '.ph-wave'), { strokeDasharray: '7 5', strokeDashoffset: 0 }, { strokeDashoffset: -48, duration: 1.4, ease: 'none', immediateRender: false }),
    T => T.to(in_(2, '.ph-beam'), { rotation: -11, svgOrigin: `${cx(2)} ${cy(2) + 6}`, duration: .8, ease: 'power2.inOut' }).to(in_(2, '.ph-beam'), { rotation: 0, svgOrigin: `${cx(2)} ${cy(2) + 6}`, duration: .8, ease: 'power2.inOut' }, '+=.3'),
    T => T.fromTo(in_(3, '.ph-cur'), { strokeDashoffset: 0 }, { strokeDashoffset: -42, duration: 1.4, ease: 'none', immediateRender: false }).fromTo(in_(3, '.ph-fl'), { scale: .7, svgOrigin: `${cx(3) - 34} ${cy(3) + 44}` }, { scale: 1.1, svgOrigin: `${cx(3) - 34} ${cy(3) + 44}`, duration: .35, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, '<'),
    T => T.to(in_(4, '.ph-hw'), { opacity: 1, duration: .3, stagger: .08 }).to(in_(4, '.ph-xb, .ph-xo'), { attr: { width: 78 }, duration: .8, ease: 'power2.inOut' }, '<').to(in_(4, '.ph-hw'), { opacity: 0, duration: .3 }, '+=.3').to(in_(4, '.ph-xb, .ph-xo'), { attr: { width: 66 }, duration: .8, ease: 'power2.inOut' }, '<'),
    T => T.fromTo(in_(5, '.ph-fld'), { strokeDashoffset: 0 }, { strokeDashoffset: -32, duration: 1.4, ease: 'none', immediateRender: false }),
    T => T.to(in_(6, '.ph-th-c'), { scaleY: 1, svgOrigin: `${cx(6) - 26} ${cy(6) + 22}`, duration: .8, ease: 'power2.inOut' }).to(in_(6, '.ph-blk'), { opacity: 0, duration: .5 }, '-=.2').to(in_(6, '.ph-drop'), { opacity: 1, duration: .5 }, '<')
      .to(in_(6, '.ph-th-c'), { scaleY: .3, svgOrigin: `${cx(6) - 26} ${cy(6) + 22}`, duration: .7, ease: 'power2.inOut' }, '+=.4').to(in_(6, '.ph-drop'), { opacity: 0, duration: .4 }, '<').to(in_(6, '.ph-blk'), { opacity: 1, duration: .4 }, '<'),
    T => T.fromTo(in_(7, '.ph-o2'), { y: -8, opacity: .3 }, { y: 12, opacity: 1, duration: .7, stagger: .1, ease: 'power1.in', immediateRender: false }).fromTo(in_(7, '.ph-pit ellipse'), { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.35, transformOrigin: '50% 50%', duration: .5, yoyo: true, repeat: 1, stagger: .1, immediateRender: false }, '-=.2')
      .to(in_(7, '.ph-o2'), { y: 0, opacity: 1, duration: .5 })
  ];
  const L = gsap.timeline({ repeat: -1, delay: 2 });
  L.to(hl, { opacity: 1, duration: .4 });
  PH_NAMES.forEach((_, i) => {
    L.to(hl, { x: w * (i % 4), y: h * Math.floor(i / 4), duration: i ? .55 : .01, ease: 'power2.inOut' });
    const sub = gsap.timeline(); moves[i](sub); L.add(sub, '>.05'); L.to({}, { duration: .5 });
  });
  L.to(hl, { opacity: 0, duration: .4 }).set(hl, { x: 0, y: 0 }).to({}, { duration: .8 });
  return t;
}

/* ======================================================================================================
   conductivity — electrical: a copper bar closes a circuit (cell, switch, lamp) and the current runs; thermal: a
   flame heats the end of a copper bar and the heat runs along it, thermometer by thermometer.
   ====================================================================================================== */
function conductivityDraw(k) {
  const { INK, W } = k;
  const loop = 'M150 132H120V182M120 196V252H480V208M480 172V132H380M220 132H190';
  const flow = 'M120 182V132H150M190 132H220M380 132H480V172M480 208V252H120V196';
  return `
  <defs><linearGradient id="conductivity-heat" x1="0" x2="1"><stop offset="0" stop-color="${INK.hot}" stop-opacity=".9"/><stop offset=".72" stop-color="${INK.hot}" stop-opacity=".55"/><stop offset="1" stop-color="${INK.hot}" stop-opacity="0"/></linearGradient></defs>
  ${k.text(52, 92, 'electrical', { size: 18, weight: 700, anchor: 'start', fill: INK.graphite2, extra: 'class="cd-t"' })}
  <path class="cd-w" d="${loop}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <path class="cd-flow" d="${flow}" fill="none" stroke="${INK.blue}" stroke-width="3.4" stroke-dasharray="5 13" opacity="0"/>
  <rect class="cd-bh" x="220" y="116" width="160" height="32" fill="${k.hatch('bronze')}"/><rect class="cd-bo" x="220" y="116" width="160" height="32" fill="none" ${k.stroke.thick}/>
  <g class="cd-cell"><line x1="94" y1="182" x2="146" y2="182" stroke="${INK.graphite}" stroke-width="${W.med}"/><line x1="108" y1="196" x2="132" y2="196" stroke="${INK.graphite}" stroke-width="6"/>
    ${k.text(152, 186, '+', { size: 18, anchor: 'start', weight: 700 })}</g>
  <circle cx="150" cy="132" r="4" fill="${INK.graphite}"/><circle cx="190" cy="132" r="4" fill="${INK.graphite}"/>
  <line class="cd-sw" x1="150" y1="132" x2="186" y2="112" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/>
  <g class="cd-lamp"><circle class="cd-glow" cx="480" cy="190" r="18" fill="${INK.hazard}" opacity="0"/><circle cx="480" cy="190" r="18" fill="none" ${k.stroke.thick}/>
    <path d="M467 177L493 203M493 177L467 203" stroke="${INK.graphite}" stroke-width="${W.med}"/>
    <g class="cd-rays" opacity="0">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return `<line x1="${f1(480 + 25 * Math.cos(r))}" y1="${f1(190 + 25 * Math.sin(r))}" x2="${f1(480 + 35 * Math.cos(r))}" y2="${f1(190 + 35 * Math.sin(r))}" stroke="${INK.graphite2}" stroke-width="${W.thin}"/>`; }).join('')}</g></g>
  <line class="cd-div" x1="52" y1="300" x2="548" y2="300" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="22 4 3 4"/>
  ${k.text(52, 340, 'thermal', { size: 18, weight: 700, anchor: 'start', fill: INK.graphite2, extra: 'class="cd-t"' })}
  ${[250, 340, 430].map((x, i) => thermo(k, x, 314, 372, `cd-th cd-th${i}`)).join('')}
  <rect class="cd-tb" x="150" y="390" width="350" height="36" fill="${CU}"/>
  <rect class="cd-heat" x="150" y="390" width="0" height="36" fill="url(#conductivity-heat)"/>
  <rect class="cd-tbh" x="150" y="390" width="350" height="36" fill="${k.hatch('bronze')}"/>
  <rect class="cd-to" x="150" y="390" width="350" height="36" fill="none" ${k.stroke.thick}/>
  <g class="cd-fl">${flame(k, 168, 470, 1.25, 'cd-f1')}</g>`;
}
function conductivityPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const cols = [0, 1, 2].map(i => q(`.cd-th${i} .cd-th${i}-c`)), sw = q('.cd-sw');
  cols.forEach((c, i) => gsap.set(c, { scaleY: .12, svgOrigin: `${[250, 340, 430][i]} 380` }));
  gsap.set(q('.cd-fl'), { scale: 0, svgOrigin: '168 470' });
  const t = k.tl();
  k.plot(t, [q('.cd-w'), q('.cd-bo'), q('.cd-to')], { dur: .8, stagger: .15 });
  k.ink(t, [q('.cd-bh'), q('.cd-tb'), q('.cd-tbh')], { at: .6 });
  t.from([q('.cd-cell'), q('.cd-lamp'), sw, ...qa('.cd-th'), ...qa('.cd-t'), q('.cd-div')], { opacity: 0, duration: .45, stagger: .05 }, .8);
  const on = (T, at) => T.to(sw, { attr: { x2: 190, y2: 132 }, duration: .35, ease: 'power2.in' }, at)
    .to(q('.cd-flow'), { opacity: 1, duration: .3 }, '>').to([q('.cd-glow'), q('.cd-rays')], { opacity: .9, duration: .45 }, '<');
  if (k.reduced()) {
    gsap.set(sw, { attr: { x2: 190, y2: 132 } }); gsap.set([q('.cd-flow'), q('.cd-glow'), q('.cd-rays')], { opacity: .9 }); gsap.set(q('.cd-fl'), { scale: 1 });
    set(q('.cd-heat'), { width: 300 }); cols.forEach((c, i) => gsap.set(c, { scaleY: [1, .8, .55][i] })); return t;
  }
  gsap.to(q('.cd-flow'), { strokeDashoffset: -36, duration: .9, ease: 'none', repeat: -1 });
  gsap.to(q('.cd-f1'), { scaleY: .86, svgOrigin: '168 470', duration: .45, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  const L = gsap.timeline({ repeat: -1, delay: 1.9 });
  on(L, 0);
  L.to(q('.cd-fl'), { scale: 1, svgOrigin: '168 470', duration: .45, ease: 'back.out(1.6)' }, .3)
    .to(q('.cd-heat'), { attr: { width: 350 }, duration: 3, ease: 'power1.inOut' }, .6);
  cols.forEach((c, i) => L.to(c, { scaleY: [1, .8, .58][i], svgOrigin: `${[250, 340, 430][i]} 380`, duration: 1.2, ease: 'power1.inOut' }, 1 + i * .8));
  L.to({}, { duration: 1.4 })
    .to(sw, { attr: { x2: 186, y2: 112 }, duration: .35, ease: 'power2.out' })
    .to([q('.cd-flow'), q('.cd-glow'), q('.cd-rays')], { opacity: 0, duration: .35 }, '<')
    .to(q('.cd-fl'), { scale: 0, svgOrigin: '168 470', duration: .4, ease: 'power2.in' }, '<')
    .to(q('.cd-heat'), { opacity: 0, duration: 1.1 }, '<.2')
    .to(cols, { scaleY: .12, duration: 1.1, ease: 'power1.inOut' }, '<')
    .set(q('.cd-heat'), { attr: { width: 0 }, opacity: 1 })
    .to({}, { duration: .8 });
  return t;
}

/* ======================================================================================================
   expansion — two bars fixed to a wall, heated alike (their thermometers read the same): lead grows more than
   copper. The red ticks on the thermometers are their melting points — the hint: lower melt, more expansion.
   ====================================================================================================== */
const EX = { x0: 100, x1: 360, bars: [{ y: 156, h: 50, hatch: 'lead', name: 'lead', dl: 66, tm: 327 }, { y: 326, h: 50, hatch: 'bronze', name: 'copper', dl: 38, tm: 1085 }], tx: 506 };
function expansionDraw(k) {
  const { INK, W } = k; const { x0, x1, tx } = EX;
  return `
  ${ground(k, 62, 120, 38, 300, 'right', 'ex-wall')}
  <line class="ex-ref" x1="${x1}" y1="128" x2="${x1}" y2="410" ${k.stroke.construct} stroke-dasharray="6 4"/>
  ${EX.bars.map((b, i) => {
    const ty = b.y - 18, by = b.y + b.h + 6, mk = by - (by - ty) * b.tm / 1200;
    return `<g class="ex-b" data-i="${i}">
      <rect class="ex-bh" x="${x0}" y="${b.y}" width="${x1 - x0}" height="${b.h}" fill="${k.hatch(b.hatch)}"/>
      <rect class="ex-bo" x="${x0}" y="${b.y}" width="${x1 - x0}" height="${b.h}" fill="none" ${k.stroke.thick}/>
      ${k.text(x0 + 12, b.y - 10, b.name, { size: 18, weight: 700, anchor: 'start', extra: 'class="ex-nm"' })}
      <g class="ex-fl">${[150, 230, 310].map(x => flame(k, x, b.y + b.h + 44, .9, 'ex-f')).join('')}</g>
      <g class="ex-dl" opacity="0">${dline(k, 'ex-dld', INK.red, 'ΔL', { size: 20 })}</g>
      ${thermo(k, tx, ty, by, `ex-th ex-th${i}`)}
      <line x1="${tx - 12}" y1="${f1(mk)}" x2="${tx + 12}" y2="${f1(mk)}" stroke="${INK.red}" stroke-width="${W.thick}"/>
      ${k.text(tx - 16, mk + 6, `${b.tm} °C`, { size: 15, fill: INK.red, weight: 700, anchor: 'end', extra: 'class="ex-tm"' })}
    </g>`;
  }).join('')}
  ${k.text(EX.tx, 122, 'Tm', { size: 17, fill: INK.red, weight: 700, extra: 'class="ex-tmh"' })}`;
}
function expansionPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { x0, x1, tx } = EX;
  const bars = qa('.ex-b'), st = { h: 0 };
  const colY = i => EX.bars[i].y + EX.bars[i].h + 6;
  bars.forEach((b, i) => { gsap.set(b.querySelectorAll('.ex-fl .ex-f'), { scale: 0, transformOrigin: '50% 100%' }); gsap.set(b.querySelector(`.ex-th${i}-c`), { scaleY: .15, svgOrigin: `${tx} ${colY(i)}` }); });
  const render = () => bars.forEach((b, i) => {
    const d = EX.bars[i].dl * st.h, y = EX.bars[i].y + EX.bars[i].h / 2;
    b.querySelectorAll('.ex-bh, .ex-bo').forEach(e => set(e, { width: x1 - x0 + d }));
    dset(b.querySelector('.ex-dld'), x1, y, x1 + d, y, x1 + d / 2, y - EX.bars[i].h / 2 - 8); op(b.querySelector('.ex-dl'), cl(st.h * 6));
    gsap.set(b.querySelector(`.ex-th${i}-c`), { scaleY: .15 + .45 * st.h, svgOrigin: `${tx} ${colY(i)}` });
  });
  const t = k.tl();
  if (k.reduced()) { st.h = 1; bars.forEach(b => gsap.set(b.querySelectorAll('.ex-f'), { scale: 1 })); }
  render();
  k.plot(t, [q('.ex-wall .gd-f'), ...qa('.ex-bo')], { dur: .8, stagger: .15 });
  k.ink(t, [q('.ex-wall .gd-h'), ...qa('.ex-bh')], { at: .6 });
  k.plot(t, q('.ex-ref'), { at: .9, dur: .5 });
  t.from([...qa('.ex-nm'), ...qa('.ex-th'), ...qa('.ex-tm'), q('.ex-tmh')], { opacity: 0, duration: .45, stagger: .06 }, 1);
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .8 });
  L.to(qa('.ex-f'), { scale: 1, duration: .5, stagger: .05, ease: 'back.out(1.6)' })
    .to(st, { h: 1, duration: 2.6, ease: 'power1.inOut', onUpdate: render }, '<.2')
    .to(qa('.ex-f'), { scaleY: .82, duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<.4')
    .to({}, { duration: 1.2 })
    .to(qa('.ex-f'), { scale: 0, duration: .4, ease: 'power2.in' })
    .to(st, { h: 0, duration: 2.2, ease: 'power1.inOut', onUpdate: render }, '<.1');
  return t;
}

/* ======================================================================================================
   magnet — a bar of iron cut into domains (each with its arrow pointing its own way). A field H comes on: the domains
   swing into line, the bar becomes a magnet (N · S, field lines). Field off: they scatter again. Fe · Ni · Co.
   ====================================================================================================== */
const MG = (() => {
  const box = [90, 176, 510, 336], r = rng(11), sites = [];
  for (let n = 0; n < 4000 && sites.length < 13; n++) { const p = [box[0] + 22 + r() * (box[2] - box[0] - 44), box[1] + 22 + r() * (box[3] - box[1] - 44)]; if (sites.every(s => Math.hypot(s[0] - p[0], s[1] - p[1]) > 66)) sites.push(p); }
  const clip = (poly, a, b, c) => { const out = []; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length], fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c; if (fp <= 0) out.push(p); if (fp * fq < 0) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } } return out; };
  const cells = sites.map((s, i) => {
    let poly = [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]];
    sites.forEach((o, j) => { if (j !== i) poly = clip(poly, 2 * (o[0] - s[0]), 2 * (o[1] - s[1]), o[0] * o[0] + o[1] * o[1] - s[0] * s[0] - s[1] * s[1]); });
    const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]);
    return { poly, c, a: Math.round(-180 + r() * 360) };
  });
  return { box, cells, cy: (box[1] + box[3]) / 2 };
})();
function magnetDraw(k) {
  const { INK, W } = k; const [x0, y0, x1, y1] = MG.box, cy = MG.cy;
  const arrow = c => `<g class="mg-a"><line x1="${f1(c.c[0] - 17)}" y1="${f1(c.c[1])}" x2="${f1(c.c[0] + 7)}" y2="${f1(c.c[1])}" stroke="${INK.graphite}" stroke-width="3.2"/><polygon points="${P([[c.c[0] + 18, c.c[1]], [c.c[0] + 5, c.c[1] - 6.5], [c.c[0] + 5, c.c[1] + 6.5]])}" fill="${INK.graphite}"/></g>`;
  const cellT = (x, sym, z, nm) => `<g class="mg-el"><rect x="${x}" y="430" width="72" height="76" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.text(x + 8, 448, z, { size: 13, anchor: 'start', fill: INK.graphite2 })}${k.text(x + 36, 484, sym, { size: 34, family: 'display', weight: 800 })}${k.text(x + 36, 500, nm, { size: 12, fill: INK.graphite2 })}</g>`;
  const fld = (h, s) => `M${x1} ${cy + s * 24}C${x1 + 70} ${cy + s * h} ${x0 - 70} ${cy + s * h} ${x0} ${cy + s * 24}`;
  return `
  <rect class="mg-bw" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#fff"/>
  <path class="mg-H" d="M${x0 + 40} ${cy - 18}H${x1 - 110}V${cy - 50}L${x1 - 30} ${cy}L${x1 - 110} ${cy + 50}V${cy + 18}H${x0 + 40}Z" fill="#E4EDF9" stroke="${INK.cyan}" stroke-width="${W.thin}" opacity="0"/>
  <g class="mg-Ht" opacity="0">${k.text(x0 + 66, cy + 9, 'H', { size: 26, weight: 700, fill: INK.blue, family: 'display' })}</g>
  <path class="mg-walls" d="${MG.cells.map(c => D(c.poly, true)).join('')}" fill="none" stroke="${INK.graphite3}" stroke-width="${W.thin}"/>
  ${MG.cells.map(arrow).join('')}
  <rect class="mg-bo" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" ${k.stroke.thick}/>
  <g class="mg-fl" opacity="0">${[[170, -1], [232, -1], [140, 1], [178, 1]].map(([h, s]) => `<path class="mg-f" d="${fld(h, s)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 5"/>`).join('')}</g>
  <g class="mg-ns" opacity="0">${k.text(x1 + 22, cy + 10, 'N', { size: 28, weight: 800, fill: INK.red, family: 'display' })}${k.text(x0 - 22, cy + 10, 'S', { size: 28, weight: 800, fill: INK.blue, family: 'display' })}</g>
  ${cellT(186, 'Fe', '26', 'iron')}${cellT(264, 'Ni', '28', 'nickel')}${cellT(342, 'Co', '27', 'cobalt')}`;
}
function magnetPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const ar = qa('.mg-a'), org = i => `${f1(MG.cells[i].c[0])} ${f1(MG.cells[i].c[1])}`;
  ar.forEach((a, i) => gsap.set(a, { rotation: k.reduced() ? 0 : MG.cells[i].a, svgOrigin: org(i) }));
  const t = k.tl();
  k.plot(t, [q('.mg-bo'), q('.mg-walls')], { dur: .9, stagger: .25 });
  k.stamp(t, ar, { at: .7, stagger: .04 });
  t.from(qa('.mg-el'), { opacity: 0, y: 10, duration: .5, stagger: .1 }, 1);
  if (k.reduced()) { gsap.set([q('.mg-H'), q('.mg-Ht'), q('.mg-fl'), q('.mg-ns')], { opacity: 1 }); return t; }
  gsap.to(qa('.mg-f'), { strokeDashoffset: 22, duration: 1.1, ease: 'none', repeat: -1 });
  const L = gsap.timeline({ repeat: -1, delay: 2.4 });
  L.to([q('.mg-H'), q('.mg-Ht')], { opacity: 1, duration: .5 });
  ar.forEach((a, i) => L.to(a, { rotation: 0, svgOrigin: org(i), duration: .9, ease: 'power2.inOut' }, .4 + i * .07));
  L.to([q('.mg-fl'), q('.mg-ns')], { opacity: 1, duration: .6 }, '>-.1')
    .fromTo(qa('.mg-el'), { y: 0 }, { y: -6, duration: .3, yoyo: true, repeat: 1, stagger: .1, ease: 'power2.out', immediateRender: false }, '<')
    .to({}, { duration: 1.8 })
    .to([q('.mg-H'), q('.mg-Ht'), q('.mg-fl'), q('.mg-ns')], { opacity: 0, duration: .5 });
  const back = L.duration();
  ar.forEach((a, i) => L.to(a, { rotation: MG.cells[i].a, svgOrigin: org(i), duration: 1.1, ease: 'power2.inOut' }, back + i * .06));
  L.to({}, { duration: 1.2 });
  return t;
}

/* ======================================================================================================
   melting — an ingot in a refractory crucible over a flame; the heating curve beside it: the temperature climbs,
   holds flat at the melting point while the block slumps into a pool (the energy goes into separating the atoms),
   then climbs again in the liquid.
   ====================================================================================================== */
const MT = (() => {
  const ring = (pts, n) => { const w = walker([...pts, pts[0]]); return Array.from({ length: n }, (_, i) => w.at(i / n)); };
  const N = 32;
  const block = ring([[270, 450], [150, 450], [150, 332], [270, 332]], N);
  const slump = ring([[292, 450], [128, 450], [134, 420], [160, 396], [210, 386], [260, 396], [286, 420]], N);
  const pool = ring([[300, 450], [120, 450], [120, 412], [140, 416], [210, 417], [280, 416], [300, 412]], N);
  const G = [[372, 458], [424, 392], [490, 392], [544, 334]];
  return { block, slump, pool, G };
})();
function meltingDraw(k) {
  const { INK, W } = k; const G = MT.G;
  return `<g transform="translate(0 -56)">
  <path class="mt-cr" d="M96 296L120 296L120 450L300 450L300 296L324 296L324 472L96 472Z" fill="${k.hatch('refractory')}"/>
  <path class="mt-co" d="M96 296L120 296L120 450L300 450L300 296L324 296L324 472L96 472Z" fill="none" ${k.stroke.thick}/>
  <path class="mt-sol" d="${D(MT.block, true)}" fill="${k.hatch('steel')}"/>
  <path class="mt-liq" d="${D(MT.block, true)}" fill="${INK.hot}" opacity="0"/>
  <path class="mt-ol" d="${D(MT.block, true)}" fill="none" ${k.stroke.thick}/>
  <g class="mt-fl">${[150, 210, 270].map(x => flame(k, x, 520, 1.15, 'mt-f')).join('')}</g>
  <g class="mt-graph">
    <line class="mt-ax" x1="${G[0][0] - 2}" y1="474" x2="${G[0][0] - 2}" y2="290" ${k.stroke.thick} marker-end="url(#arr)"/>
    <line class="mt-ax" x1="${G[0][0] - 2}" y1="474" x2="556" y2="474" ${k.stroke.thick} marker-end="url(#arr)"/>
    ${k.text(G[0][0] - 16, 300, 'T', { size: 20, weight: 700 })}${k.text(556, 498, 'time', { size: 16, anchor: 'end' })}
    <line class="mt-mp" x1="${G[0][0] - 2}" y1="${G[1][1]}" x2="552" y2="${G[1][1]}" stroke="${INK.red}" stroke-width="${W.med}" stroke-dasharray="10 5"/>
    ${k.text(G[0][0] + 4, G[1][1] - 10, 'melting point', { size: 16, fill: INK.red, weight: 700, anchor: 'start', extra: 'class="mt-mpt"' })}
    <path class="mt-gc" d="${D(G)}" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}"/>
    <path class="mt-tr" d="${D(G)}" fill="none" stroke="${INK.red}" stroke-width="${W.thick}" stroke-linejoin="round" stroke-linecap="round"/>
    ${k.text(398, 450, 'solid', { size: 15, fill: INK.graphite2 })}${k.text(512, 382, 'liquid', { size: 15, fill: INK.graphite2, anchor: 'start' })}
    <circle class="mt-pen" cx="${G[0][0]}" cy="${G[0][1]}" r="7" fill="${INK.hot}" stroke="#fff" stroke-width="2.5"/>
  </g></g>`;
}
function meltingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const G = MT.G;
  const sol = q('.mt-sol'), liq = q('.mt-liq'), ol = q('.mt-ol'), pen = q('.mt-pen'), tr = q('.mt-tr'), w = walker(G), TL = w.L + 2;
  const seg = [0, 1, 2].map(i => { const a = walker(G.slice(0, i + 1)).L, b = walker(G.slice(0, i + 2)).L; return [a / w.L, b / w.L]; });
  tr.style.strokeDasharray = `${f1(TL)} ${f1(TL)}`;
  const st = { u: 0, m: 0 };
  const shape = m => { const a = m < .5 ? MT.block : MT.slump, b = m < .5 ? MT.slump : MT.pool, f = m < .5 ? m * 2 : (m - .5) * 2; return D(a.map((p, i) => [lerp(p[0], b[i][0], f), lerp(p[1], b[i][1], f)]), true); };
  const render = () => {
    const [x, y] = w.at(st.u); set(pen, { cx: x, cy: y }); tr.style.strokeDashoffset = f1(TL * (1 - st.u));
    const d = shape(st.m); set(sol, { d }); set(liq, { d }); set(ol, { d }); op(liq, cl(st.m * 1.6)); op(sol, 1 - cl(st.m * 1.4));
  };
  gsap.set(qa('.mt-f'), { scale: 0, transformOrigin: '50% 100%' });
  const t = k.tl();
  if (k.reduced()) { st.u = 1; st.m = 1; gsap.set(qa('.mt-f'), { scale: 1 }); }
  render();
  k.plot(t, [q('.mt-co'), ol], { dur: .8, stagger: .2 });
  k.ink(t, [q('.mt-cr'), sol], { at: .6 });
  plotM(k, t, qa('.mt-ax'), { at: .4, stagger: .1, dur: .6 }); t.from(qa('.mt-graph > text:not(.mt-mpt)'), { opacity: 0, duration: .3, stagger: .05 }, 1);
  k.plot(t, [q('.mt-gc'), q('.mt-mp')], { at: .9, stagger: .15, dur: .7 }); k.stamp(t, [q('.mt-mpt'), pen], { at: 1.3, stagger: .1 });
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 1.9 });
  L.to(qa('.mt-f'), { scale: 1, duration: .45, stagger: .06, ease: 'back.out(1.6)' })
    .to(st, { u: seg[0][1], duration: 1.4, ease: 'power1.inOut', onUpdate: render }, '<.2')
    .to(st, { u: seg[1][1], m: 1, duration: 2.8, ease: 'none', onUpdate: render })
    .to(st, { u: 1, duration: 1.1, ease: 'power1.out', onUpdate: render })
    .to(qa('.mt-f'), { scale: 0, duration: .4, ease: 'power2.in' }, '+=.6')
    .to({}, { duration: 1 })
    .to([sol, liq, ol, tr, pen], { opacity: 0, duration: .5 })
    .add(() => { st.u = 0; st.m = 0; render(); })
    .to([sol, ol, pen], { opacity: 1, duration: .6 }, '+=.15')
    .set(tr, { opacity: 1 })
    .to({}, { duration: .4 });
  return t;
}

/* ======================================================================================================
   corrosion — oxygen and water molecules settle on two steel plates. The bare one pits and rusts; the one with a
   zinc coat sheds them and stays clean.
   ====================================================================================================== */
const CR = { y: 330, bare: [64, 280], prot: [320, 536], pits: [[96, 14, 10], [142, 17, 13], [188, 12, 9], [230, 16, 12], [262, 10, 8]], drops: [96, 142, 188, 232, 262, 352, 404, 452, 500] };
function corrosionDraw(k) {
  const { INK, W } = k; const { y } = CR;
  const plate = ([a, b], cls) => `<rect class="${cls}h" x="${a}" y="${y}" width="${b - a}" height="70" fill="${k.hatch('steel')}"/><rect class="${cls}o" x="${a}" y="${y}" width="${b - a}" height="70" fill="none" ${k.stroke.thick}/>`;
  const mol = (x, i) => `<g class="cr-m" data-i="${i}" transform="translate(${x} 0)"><g transform="scale(1.5)">${i % 3 === 2
    ? `<circle cx="0" cy="0" r="6.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/><circle cx="-7" cy="5" r="3.6" fill="#fff" stroke="${INK.blue}" stroke-width="1.5"/><circle cx="7" cy="5" r="3.6" fill="#fff" stroke="${INK.blue}" stroke-width="1.5"/>`
    : `<circle cx="-4.5" cy="0" r="5.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/><circle cx="4.5" cy="0" r="5.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/>`}</g></g>`;
  return `
  ${plate(CR.bare, 'cr-b')}${plate(CR.prot, 'cr-p')}
  <rect class="cr-coat" x="${CR.prot[0]}" y="${y - 10}" width="${CR.prot[1] - CR.prot[0]}" height="10" fill="${INK.alu}" stroke="${INK.graphite}" stroke-width="${W.med}"/>
  <g class="cr-pits">${CR.pits.map(([x, rx, ry]) => `<g class="cr-pit"><path d="M${x - rx - 2} ${y - 1.8}A${rx + 2} ${ry + 3} 0 0 0 ${x + rx + 2} ${y - 1.8}Z" fill="#fff"/>
    <path d="M${x - rx} ${y}A${rx} ${ry} 0 0 0 ${x + rx} ${y}" fill="none" ${k.stroke.thick}/>
    <path d="M${x - rx + 2} ${y}A${rx - 2} ${ry - 2} 0 0 0 ${x + rx - 2} ${y}Q${x + rx * .5} ${y - 7} ${x} ${y - 5}Q${x - rx * .5} ${y - 8} ${x - rx + 2} ${y}Z" fill="${INK.copper}"/>
    <path d="M${x - rx + 2} ${y}A${rx - 2} ${ry - 2} 0 0 0 ${x + rx - 2} ${y}Q${x + rx * .5} ${y - 7} ${x} ${y - 5}Q${x - rx * .5} ${y - 8} ${x - rx + 2} ${y}Z" fill="${k.hatch('stipple')}"/></g>`).join('')}</g>
  <g class="cr-mols">${CR.drops.map(mol).join('')}</g>
  <g class="cr-l"><circle cx="70" cy="80" r="5.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/><circle cx="79" cy="80" r="5.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/>${k.text(92, 87, 'O₂', { size: 19, weight: 700, fill: INK.blue, anchor: 'start' })}
    <circle cx="150" cy="78" r="6.5" fill="#fff" stroke="${INK.blue}" stroke-width="1.8"/><circle cx="143" cy="83" r="3.6" fill="#fff" stroke="${INK.blue}" stroke-width="1.5"/><circle cx="157" cy="83" r="3.6" fill="#fff" stroke="${INK.blue}" stroke-width="1.5"/>${k.text(168, 87, 'H₂O', { size: 19, weight: 700, fill: INK.blue, anchor: 'start' })}</g>
  ${k.text((CR.bare[0] + CR.bare[1]) / 2, 440, 'bare', { size: 20, weight: 700, extra: 'class="cr-l"' })}
  ${k.text((CR.prot[0] + CR.prot[1]) / 2, 440, 'protected', { size: 20, weight: 700, extra: 'class="cr-l"' })}
  <g class="cr-lab">${k.leader(CR.prot[1] - 30, y - 6, CR.prot[1] - 70, 268, 'zinc coat', { size: 16 })}</g>`;
}
function corrosionPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg); const { y } = CR;
  const pits = qa('.cr-pit'), mols = qa('.cr-m');
  pits.forEach((p, i) => gsap.set(p, { scale: k.reduced() ? 1 : 0, svgOrigin: `${CR.pits[i][0]} ${y}` }));
  mols.forEach((m, i) => gsap.set(m, { x: CR.drops[i], y: k.reduced() ? (i < 5 ? y - 12 : 140 + (i % 3) * 30) : 120 + (i % 3) * 24 }));
  const t = k.tl();
  k.plot(t, [q('.cr-bo'), q('.cr-po')], { dur: .8, stagger: .2 });
  k.ink(t, [q('.cr-bh'), q('.cr-ph'), q('.cr-coat')], { at: .6 });
  k.stamp(t, [...mols, ...qa('.cr-l')], { at: .9, stagger: .04 });
  plotM(k, t, qa('.cr-lab polyline, .cr-lab line'), { at: 1.2 }); t.from(q('.cr-lab text'), { opacity: 0, duration: .3 }, 1.4);
  if (k.reduced()) return t;
  const L = gsap.timeline({ repeat: -1, delay: 2 });
  mols.forEach((m, i) => {
    const at = (i % 5) * .55 + (i >= 5 ? .25 : 0), bare = i < 5, land = bare ? y - 12 : y - 23;
    L.to(m, { y: land, duration: 1.1, ease: 'power1.in' }, at);
    if (bare) L.to(pits[i], { scale: 1, svgOrigin: `${CR.pits[i][0]} ${y}`, duration: 1.4, ease: 'power1.out' }, at + 1.05).to(m, { opacity: 0, duration: .5 }, at + 1.3);
    else L.to(m, { y: land - 46, x: CR.drops[i] + (i % 2 ? 22 : -22), opacity: 0, duration: .8, ease: 'power2.out' }, at + 1.1);
  });
  L.to({}, { duration: 1.6 })
    .to(pits, { opacity: 0, duration: .6 })
    .add(() => mols.forEach((m, i) => gsap.set(m, { x: CR.drops[i], y: 120 + (i % 3) * 24, opacity: 0 })))
    .set(pits, { scale: 0, opacity: 1 })
    .to(mols, { opacity: 1, duration: .4, stagger: .03 })
    .to({}, { duration: .3 });
  return t;
}

export default {
  anvil: { draw: anvilDraw, play: anvilPlay },
  hardness: { draw: hardnessDraw, play: hardnessPlay },
  ductile: { draw: ductileDraw, play: ductilePlay },
  brittle: { draw: brittleDraw, play: brittlePlay },
  tough: { draw: toughDraw, play: toughPlay },
  malleable: { draw: malleableDraw, play: malleablePlay },
  castable: { draw: castableDraw, play: castablePlay },
  resilience: { draw: resilienceDraw, play: resiliencePlay },
  machinable: { draw: machinableDraw, play: machinablePlay },
  weldable: { draw: weldableDraw, play: weldablePlay },
  physical: { draw: physicalDraw, play: physicalPlay },
  conductivity: { draw: conductivityDraw, play: conductivityPlay },
  expansion: { draw: expansionDraw, play: expansionPlay },
  magnet: { draw: magnetDraw, play: magnetPlay },
  melting: { draw: meltingDraw, play: meltingPlay },
  corrosion: { draw: corrosionDraw, play: corrosionPlay }
};
