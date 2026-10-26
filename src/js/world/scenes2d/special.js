// Illustrated scenes — special: monolith (the boss: The Press) · nebula (raw stock, between things).
// Contract and look: STYLE.md · names and captions: world/scenes/info.js · what to draw: docs/SCENES.md.
// This file is loaded by every build: keep it valid at every save.

const f1 = v => Math.round(v * 10) / 10;
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const RP = (x, y, w, h) => `M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
/** a drawn part: white knock-out fill · optional section hatch · thick outline (play() plots `.o`, inks `.h`) */
function pt(k, d, { mat = '', cls = '', w = k.W.thick, fill = '#fff', stroke = k.INK.graphite, extra = '' } = {}) {
  return `<g class="${cls}" ${extra}>${fill ? `<path d="${d}" fill="${fill}"/>` : ''}${mat ? `<path class="h" d="${d}" fill="${k.hatch(mat)}"/>` : ''}<path class="o" d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
}

/* ======================================================================================================
   monolith — the boss, The Press: an H-frame hydraulic press in elevation (the die set cut in section). Both START
   buttons go in, the ram comes down slow and heavy onto the blank, sparks at the hit, the part is pushed out and the
   next blank goes in. The exam waits under the ram.
   ====================================================================================================== */
const MP = { S: 76, ram: [150, 176, 300, 86], punch: [244, 262, 112, 38], blank: [200, 366, 200, 8], die: [214, 374, 172, 38] };
function monolithDraw(k) {
  const { INK, W } = k;
  const [rx, ry, rw, rh] = MP.ram, [px, py, pw, ph] = MP.punch, [bx, by, bw, bT] = MP.blank, [dx, dy, dw, dh] = MP.die;
  // the die: a block with a shallow dish; the blank flat, and the same blank pressed into the dish
  const dish = `M${dx} ${dy}H${dx + 34}C${dx + 52} ${dy} ${dx + 56} ${dy + 12} ${dx + 72} ${dy + 12}H${dx + dw - 72}C${dx + dw - 56} ${dy + 12} ${dx + dw - 52} ${dy} ${dx + dw - 34} ${dy}H${dx + dw}V${dy + dh}H${dx}Z`;
  const formed = `M${bx} ${by + 4}H${dx + 34}C${dx + 52} ${by + 4} ${dx + 56} ${by + 16} ${dx + 72} ${by + 16}H${dx + dw - 72}C${dx + dw - 56} ${by + 16} ${dx + dw - 52} ${by + 4} ${dx + dw - 34} ${by + 4}H${bx + bw}`;
  const punchD = `M${px} ${py}H${px + pw}V${py + ph - 4}C${px + pw - 6} ${py + ph + 8} ${px + pw - 22} ${py + ph + 8} ${px + pw - 30} ${py + ph + 8}H${px + 30}C${px + 22} ${py + ph + 8} ${px + 6} ${py + ph + 8} ${px} ${py + ph - 4}Z`;
  const sparks = [[-1, 200], [-1, 162], [-1, 228], [-1, 184], [-1, 214], [1, -20], [1, 18], [1, -48], [1, 4], [1, -34]].map(([sd, a], i) => {
    const x0 = sd < 0 ? px + 4 : px + pw - 4, r = a * Math.PI / 180, l0 = 10, l1 = 30 + (i % 3) * 10;
    return `<line class="mo-sp" data-dx="${f1(Math.cos(r) * 22)}" data-dy="${f1(Math.sin(r) * 22)}" x1="${f1(x0 + Math.cos(r) * l0)}" y1="${f1(by + Math.sin(r) * l0)}" x2="${f1(x0 + Math.cos(r) * l1)}" y2="${f1(by + Math.sin(r) * l1)}" stroke="${INK.hot}" stroke-width="3.2" stroke-linecap="round" opacity="0"/>`;
  }).join('');
  const btn = (x, label, sd) => `<g class="mo-btn"><circle cx="${x}" cy="528" r="23" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-dasharray="4 3"/><g class="mo-cap"><circle cx="${x}" cy="528" r="16" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.thick}"/><circle cx="${x - 5}" cy="523" r="4" fill="#fff" opacity=".55"/></g>${k.text(x + sd * 34, 535, label, { size: 19, family: 'stencil', weight: 800, spacing: 2, anchor: sd < 0 ? 'end' : 'start' })}</g>`;
  return `
  <g class="mo-axis">${k.center(300, 14, 300, 500)}</g>
  <!-- the ram, its punch and the piston rod (the crown is drawn over the rod's top) -->
  <g class="mo-ram">
    ${pt(k, RP(284, 40, 32, ry - 34), { cls: 'mo-p' })}
    ${pt(k, RP(rx, ry, rw, rh), { cls: 'mo-p' })}
    <g class="mo-hz">${k.hazard(rx + 2, ry + rh - 16, rw - 4, 14, 'monolith-ram')}</g>
    ${pt(k, RP(rx - 14, ry + 10, 14, 50), { cls: 'mo-p', mat: 'bronze' })}${pt(k, RP(rx + rw, ry + 10, 14, 50), { cls: 'mo-p', mat: 'bronze' })}
    ${pt(k, punchD, { cls: 'mo-p mo-punch', mat: 'steel' })}
    <g class="mo-bolts" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}">${[190, 410].map(x => `<circle cx="${x}" cy="${ry + 30}" r="7"/><path d="M${x - 4} ${ry + 30}h8"/>`).join('')}</g>
  </g>
  <!-- frame: crown with the cylinder, two columns, the bed -->
  ${pt(k, RP(236, 24, 128, 26), { cls: 'mo-p' })}
  ${pt(k, RP(70, 48, 460, 78), { cls: 'mo-p mo-crown' })}
  <g class="mo-hid"><path d="M252 50V126M348 50V126" ${k.stroke.hidden}/></g>
  <g class="mo-pis"><path d="M254 50H346" ${k.stroke.hidden}/></g>
  <g class="mo-plate">${pt(k, RP(116, 64, 108, 46), { cls: 'mo-p', w: W.thin })}${k.text(170, 87, 'PS-50', { size: 22, family: 'stencil', weight: 800, spacing: 1.5 })}${k.text(170, 103, '50 MARKS · 2 H', { size: 11, fill: INK.graphite2 })}</g>
  <g class="mo-plate">${pt(k, RP(376, 64, 108, 46), { cls: 'mo-p', w: W.thin })}<path d="M400 98L412 76L424 98Z" fill="${INK.hazard}" stroke="${INK.graphite}" stroke-width="${W.thin}" stroke-linejoin="round"/><path d="M412 83V91M412 94V95" stroke="${INK.graphite}" stroke-width="2" stroke-linecap="round"/>${k.text(452, 84, 'KEEP', { size: 11, weight: 700 })}${k.text(452, 97, 'HANDS', { size: 11, weight: 700 })}${k.text(452, 108, 'CLEAR', { size: 11, weight: 700, fill: INK.graphite2 })}</g>
  ${pt(k, RP(70, 126, 66, 304), { cls: 'mo-p mo-col' })}${pt(k, RP(464, 126, 66, 304), { cls: 'mo-p mo-col' })}
  <g class="mo-cl">${k.center(103, 112, 103, 444)}${k.center(497, 112, 497, 444)}</g>
  ${pt(k, RP(50, 430, 500, 62), { cls: 'mo-p mo-bed' })}
  <g class="mo-hz">${k.hazard(52, 432, 496, 14, 'monolith-bed')}</g>
  ${pt(k, RP(160, 412, 280, 18), { cls: 'mo-p', mat: 'iron' })}
  ${pt(k, dish, { cls: 'mo-p mo-die', mat: 'steel' })}
  <!-- the blank: flat, and pressed -->
  <g class="mo-work">
    <path class="mo-flat" d="${RP(bx, by, bw, bT)}" fill="${INK.hot}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>
    <g class="mo-formed" opacity="0"><path d="${formed}" fill="none" stroke="${INK.graphite}" stroke-width="${bT + 2.6}" stroke-linejoin="round"/><path d="${formed}" fill="none" stroke="${INK.hot}" stroke-width="${bT}" stroke-linejoin="round"/></g>
  </g>
  ${sparks}
  <!-- two-hand control: both buttons, or nothing moves -->
  <g class="mo-console">${pt(k, `M96 500H504V556H96Z`, { cls: 'mo-p', w: W.med })}<path d="M300 492V500" stroke="${INK.graphite}" stroke-width="${W.thin}"/>${btn(246, 'PRESS', -1)}${btn(354, 'START', 1)}
    <circle class="mo-lamp" cx="300" cy="528" r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>`;
}
function monolithPlay(svg, k) {
  const { gsap, INK } = k; const [q, qa] = sel(svg);
  const ram = q('.mo-ram'), pis = q('.mo-pis'), flat = q('.mo-flat'), formed = q('.mo-formed'), work = q('.mo-work'), caps = qa('.mo-cap'), lamp = q('.mo-lamp'), sp = qa('.mo-sp');
  const t = k.tl();
  k.plot(t, qa('.mo-p .o'), { at: 0, stagger: .045, dur: .6 });
  k.plot(t, qa('.mo-axis line, .mo-cl line'), { at: .2, stagger: .1, dur: .8 });
  k.ink(t, qa('.mo-p .h'), { at: .7, stagger: .05 });
  t.from(qa('.mo-hz'), { opacity: 0, duration: .5, stagger: .1 }, .9);
  t.from(qa('.mo-hid, .mo-pis, .mo-bolts, .mo-plate text, .mo-plate > path'), { opacity: 0, duration: .4, stagger: .04 }, 1);
  t.from(flat, { opacity: 0, x: -40, duration: .6, ease: 'power2.out' }, 1.1);
  k.stamp(t, qa('.mo-btn'), { at: 1.2, stagger: .12 });
  if (k.reduced()) {
    t.set([ram, pis], { y: MP.S }, 1.6).set(flat, { opacity: 0 }, 1.6).set(formed, { opacity: 1 }, 1.6)
      .set(caps, { y: 3 }, 1.6).set(lamp, { attr: { fill: INK.hot } }, 1.6);
    return t;
  }
  const c = gsap.timeline({ repeat: -1, delay: 2.2 });
  c.to(caps, { y: 3, duration: .25, ease: 'power2.out' })                                    // both hands down
    .to(lamp, { attr: { fill: INK.hot }, duration: .2 }, '<.1')
    .to([ram, pis], { y: MP.S, duration: 1.1, ease: 'power2.in' }, '+=.1')                   // the ram, slow and heavy
    .set(flat, { opacity: 0 }).set(formed, { opacity: 1 }, '<')                                // the hit: it takes the die's shape
    .fromTo(sp, { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: (i, el) => +el.dataset.dx, y: (i, el) => +el.dataset.dy, duration: .55, ease: 'power2.out', immediateRender: false }, '<')
    .to([ram, pis], { y: MP.S, duration: .45 })                                                // dwell
    .to([ram, pis], { y: 0, duration: 1.5, ease: 'power2.inOut' })                            // back up
    .to(caps, { y: 0, duration: .3 }, '<').to(lamp, { attr: { fill: '#fff' }, duration: .3 }, '<')
    .to(work, { x: 280, opacity: 0, duration: .6, ease: 'power2.in' }, '-=.4')               // part out…
    .set(formed, { opacity: 0 }).set(flat, { opacity: 1 }).set(work, { x: -260 })
    .to(work, { x: 0, opacity: 1, duration: .7, ease: 'power2.out' })                         // …next blank in
    .to({}, { duration: .5 });
  return t;
}

/* ======================================================================================================
   nebula — between things: raw stock waiting on the drafting table, in construction lines only. A stack of sheets,
   a disc blank, bar stock (round, square, hex) with its end views, a tube and a flat. Now and then the pen goes over
   one of them again.
   ====================================================================================================== */
function nebulaDraw(k) {
  const { INK, W } = k;
  const c = `fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-linejoin="round"`;
  const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const hex = (cx, cy, r) => 'M' + Array.from({ length: 6 }, (_, i) => { const a = (i * 60) * Math.PI / 180; return `${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`; }).join('L') + 'Z';
  const shapes = [
    RP(84, 92, 188, 112), RP(98, 106, 188, 112), RP(112, 120, 188, 112),                   // a stack of sheets
    circ(436, 164, 66),                                                                     // a disc blank
    RP(80, 288, 236, 40),                                                                   // round bar, elevation
    circ(384, 308, 20), RP(434, 291, 34, 34), hex(520, 308, 20),                           // its end view · square · hex
    circ(150, 446, 46), circ(150, 446, 34),                                                // a tube, end view
    RP(234, 424, 286, 18)                                                                   // a flat bar, edge-on
  ];
  const cl = `stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="18 4 3 4"`;
  const centres = [`M64 308H560`, `M436 78V250M356 164H516`, `M150 340V500M90 446H210`, `M384 270V346`, `M451 270V346`, `M520 270V346`].map(d => `<path d="${d}" ${cl} fill="none"/>`).join('');
  const ticks = [[84, 92], [112, 232], [300, 120]].map(([x, y]) => `<path d="M${x - 10} ${y}h20M${x} ${y - 10}v20" stroke="${INK.cyan}" stroke-width="${W.hair}"/>`).join('');
  return `
  <g class="nb-cl">${centres}</g>
  <g class="nb-tk">${ticks}</g>
  <g class="nb-s">${shapes.map((d, i) => `<path class="nb-x" data-i="${i}" d="${d}" ${c} opacity=".8"/>`).join('')}</g>
  <g class="nb-pen">${shapes.map((d, i) => `<path class="nb-y" d="${d}" fill="none" stroke="${INK.blue}" stroke-width="${W.med}" stroke-linejoin="round" opacity="0"/>`).join('')}</g>
  <path class="nb-line" d="M64 520H536" stroke="${INK.graphite3}" stroke-width="${W.thin}" stroke-dasharray="22 4 3 4"/>`;
}
function nebulaPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.nb-x'), { at: 0, stagger: .1, dur: .9 });
  t.from(qa('.nb-cl path, .nb-tk path'), { opacity: 0, duration: .8, stagger: .05 }, .5);
  k.plot(t, q('.nb-line'), { at: .3, dur: 1.2 });
  if (k.reduced()) return t;
  // the pen goes over one piece of stock at a time, slowly, then lifts
  const pens = qa('.nb-y'), order = [3, 0, 4, 8, 6, 2, 10, 5, 1, 9, 7];
  const c = gsap.timeline({ repeat: -1, delay: 2.4 });
  order.forEach((i, n) => {
    const el = pens[i]; let L = 0; try { L = Math.ceil(el.getTotalLength()) + 2; } catch (e) { L = 600; }
    c.fromTo(el, { opacity: .9, strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut', immediateRender: false }, n * 2.2)
      .to(el, { opacity: 0, duration: .9, ease: 'power1.in' }, n * 2.2 + 1.7);
  });
  return t;
}

export default {
  monolith: { draw: monolithDraw, play: monolithPlay },
  nebula: { draw: nebulaDraw, play: nebulaPlay }
};
