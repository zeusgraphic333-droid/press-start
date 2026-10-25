// The illustrated title — the site's name lettered on a drawing sheet: a construction grid in non-photo blue,
// an overall dimension, and a steel bar that bends 90° (and springs back a hair). 'title:ar' / 'title:en'.
function titleDraw(k, lines, { family, size, rtl = false }) {
  const { INK, W } = k;
  const y0 = 268 - (lines.length - 1) * size * .5;
  let grid = '';
  for (let x = 60; x <= 540; x += 40) grid += `<line x1="${x}" y1="70" x2="${x}" y2="520" stroke="${INK.cyan}" stroke-width=".8"/>`;
  for (let y = 70; y <= 520; y += 40) grid += `<line x1="60" y1="${y}" x2="540" y2="${y}" stroke="${INK.cyan}" stroke-width=".8"/>`;
  const words = lines.map((s, i) => k.text(300, y0 + i * size * 1.02, s, { size, family, weight: 800, fill: INK.graphite, dir: rtl ? 'rtl' : 'ltr' })).join('');
  // the bar: a straight leg and a leg that bends about the pivot (bx, by)
  const bx = 392, by = 452, T = 16;
  return `
    <g class="tt-grid" opacity=".55">${grid}</g>
    <g class="tt-dim">${k.dim(84, y0 - size * .78, 516, y0 - size * .78, '1 : 1', { off: -20, size: 14 })}</g>
    <clipPath id="tt-wipe"><rect class="tt-wipe" x="60" y="${y0 - size}" width="480" height="${size * (lines.length + .6)}"/></clipPath>
    <g clip-path="url(#tt-wipe)"><rect x="0" y="0" width="1" height="1" fill="#fff"/>${words}</g>
    <g class="tt-bar">
      <rect class="tt-leg" x="150" y="${by - T}" width="${bx - 150}" height="${T}" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
      <g class="tt-arm"><rect x="${bx}" y="${by - T}" width="110" height="${T}" fill="${k.hatch('steel')}" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
      ${k.center(130, by - T / 2, bx + 130, by - T / 2, 'class="tt-axis"')}
      <g class="tt-ang">${k.angle(bx, by - T / 2, 64, -90, 0, '90°', { color: INK.red })}</g>
    </g>
    <g class="tt-tb">${k.titleBlock(64, 482, { title: 'PRESS START', no: 'SH 00', scale: '1:1', w: 196 })}</g>`;
}
function titlePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s), qa = s => svg.querySelectorAll(s);
  const rtl = svg.closest('[data-scene]')?.dataset.scene === 'title:ar';
  const t = k.tl();
  t.from(q('.tt-grid'), { opacity: 0, duration: .8 }, 0);
  k.plot(t, qa('.tt-dim line'), { at: .1, stagger: .05, dur: .5 });
  t.from(q('.tt-dim text'), { opacity: 0, duration: .3 }, .45);
  // the lettering wipes on in reading order
  t.fromTo(q('.tt-wipe'), { attr: { width: 0, x: rtl ? 540 : 60 } }, { attr: { width: 480, x: 60 }, duration: 1.1, ease: 'power2.inOut' }, .3);
  k.plot(t, [q('.tt-leg'), q('.tt-arm rect')], { at: .9, stagger: .15, dur: .6 });
  t.from(q('.tt-axis'), { opacity: 0, duration: .3 }, 1.2);
  // the bend: the arm swings up about the inside of the bend
  t.fromTo(q('.tt-arm'), { rotation: 0 }, { rotation: -90, svgOrigin: '392 452', duration: 1, ease: 'power3.inOut' }, 1.5);
  t.from(q('.tt-ang'), { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(2)' }, 2.3);
  t.from(q('.tt-tb'), { opacity: 0, y: 8, duration: .5 }, 1.1);
  if (k.reduced()) return t;
  // springback, forever: overbend a hair, let it open back to 90°
  gsap.timeline({ repeat: -1, delay: 3.2, repeatDelay: 2.2 })
    .to(q('.tt-arm'), { rotation: -96, svgOrigin: '392 452', duration: .9, ease: 'power2.inOut' })
    .to(q('.tt-arm'), { rotation: -90, svgOrigin: '392 452', duration: .7, ease: 'elastic.out(1, .5)' });
  return t;
}
export default {
  'title:ar': { draw: k => titleDraw(k, ['شدّ', 'حيلك.'], { family: 'ar', size: 150, rtl: true }), play: titlePlay },
  'title:en': { draw: k => titleDraw(k, ['Bend,', 'don’t break.'], { family: 'display', size: 118 }), play: titlePlay }
};
