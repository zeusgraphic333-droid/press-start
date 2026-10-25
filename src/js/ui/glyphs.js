// Sigils drawn like stamped tool marks (no faces): the player's mark, district emblems, achievement medals. currentColor.
const S = (inner, vb = '0 0 48 48') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const f = v => +v.toFixed(2);
/** a gear outline: `teeth` teeth between radii r1 (root) and r2 (tip) */
function gearPath(cx, cy, r1, r2, teeth) {
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2, w = Math.PI / teeth;
    const p = (r, t) => `${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)}`;
    d += `${i ? 'L' : 'M'}${p(r1, a - w * .55)}L${p(r2, a - w * .32)}L${p(r2, a + w * .32)}L${p(r1, a + w * .55)}`;
  }
  return d + 'Z';
}
export const GLYPH = {
  /* the site's mark: a press frame, the ram over the work */
  brand: S('<path d="M7 6h34M11 6v36M37 6v36M7 42h34"/><rect x="17" y="11" width="14" height="10" fill="currentColor" stroke="none"/><path d="M24 21v7M16 33h16"/>'),
  /* the boss: the same press, the ram down, sparks at the work */
  monolith: S('<path d="M6 5h36M10 5v38M38 5v38M6 43h36"/><rect x="16" y="16" width="16" height="10" fill="currentColor" stroke="none"/><path d="M24 9v7M24 26v6M15 33h18M13 30l-3-3M35 30l3-3M14 36l-4 1M34 36l4 1"/>'),
  gear: S(`<path d="${gearPath(24, 24, 14.5, 19.5, 9)}"/><circle cx="24" cy="24" r="5.5"/>`),
  anvil: S('<path d="M5 13h26c1 5 5 8 12 8v4H32l-5 5v7h5v4H13v-4h5v-7l-5-5H5z"/><path d="M9 13v5" opacity=".4"/>'),
  nut: S('<path d="M24 5l16.5 9.5v19L24 43 7.5 33.5v-19z"/><circle cx="24" cy="24" r="7.5"/><path d="M24 16.5v-3" opacity=".35"/>'),
  spring: S('<path d="M24 3v5l-11 4 22 5-22 5 22 5-22 5 22 5-11 4v4"/>'),
  spark: S('<path d="M24 5l3.5 13.5L41 22l-13.5 3.5L24 39l-3.5-13.5L7 22l13.5-3.5z"/><path d="M38 6l-3 3M41 38l-3-3M8 40l3-3" opacity=".55"/>'),
  beam: S('<path d="M9 7h30v6H28v22h11v6H9v-6h11V13H9z"/>'),
  wrench: S('<path d="M30 6a9 9 0 0 0-8.6 11.6L7 32a3.5 3.5 0 0 0 5 5l14.4-14.4A9 9 0 0 0 38 14l-5.5 5.5-4-4L34 10a9 9 0 0 0-4-4z"/>'),
  caliper: S('<path d="M5 12h38v6H5zM9 18v18l5-6V18M24 18v18l5-6V18"/><path d="M14 12V8M19 12v-2M24 12V8M29 12v-2M34 12V8" opacity=".5"/>'),
  lattice: S('<path d="M10 10h28v28H10zM24 10v28M10 24h28" opacity=".45"/><circle cx="10" cy="10" r="3" fill="currentColor"/><circle cx="24" cy="10" r="3" fill="currentColor"/><circle cx="38" cy="10" r="3" fill="currentColor"/><circle cx="10" cy="24" r="3" fill="currentColor"/><circle cx="24" cy="24" r="4.2"/><circle cx="38" cy="24" r="3" fill="currentColor"/><circle cx="10" cy="38" r="3" fill="currentColor"/><circle cx="24" cy="38" r="3" fill="currentColor"/><circle cx="38" cy="38" r="3" fill="currentColor"/>'),
  curve: S('<path d="M7 5v36h36" opacity=".55"/><path d="M8 40L17 16c5-6 13-7 18-3 3 3 5 9 6 15"/><circle cx="41" cy="29" r="2.4" fill="currentColor" stroke="none"/><path d="M17 16v24" stroke-dasharray="2 3" opacity=".5"/>'),
  indent: S('<path d="M24 5l7 11-7 11-7-11z"/><path d="M5 37h14l5-5 5 5h14"/><path d="M8 42h32" opacity=".35"/>'),
  ingot: S('<path d="M6 34l7-15h22l7 15z"/><path d="M13 19l4-6h14l4 6" opacity=".8"/><path d="M6 34v4h36v-4" opacity=".5"/>'),
  bend: S('<path d="M6 11h17a12 12 0 0 1 12 12v19"/><path d="M6 17h17a6 6 0 0 1 6 6v19"/><path d="M6 14h16.5a9 9 0 0 1 9 9v19" stroke-dasharray="3 3" opacity=".45"/>'),
  spin: S('<path d="M13 13v12a11 11 0 0 0 22 0V13"/><ellipse cx="24" cy="13" rx="11" ry="3.5"/><path d="M8 38c5 4 27 4 32 0"/><path d="M36 35l4 3-4 3" /> '),
  punch: S('<path d="M19 4h10v17H19z"/><path d="M4 26h14v16H4zM30 26h14v16H30z"/><path d="M19 33h10v6H19z" fill="currentColor" stroke="none" opacity=".7"/>'),
  press: S('<path d="M7 6h34M11 6v36M37 6v36M7 42h34"/><rect x="17" y="11" width="14" height="10" fill="currentColor" stroke="none"/><path d="M24 21v7M16 33h16"/>'),
  /* the classics, still useful as medals and voices */
  circle: S('<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>'),
  square: S('<rect x="8" y="8" width="32" height="32"/><path d="M8 40L40 8" opacity=".35"/>'),
  triangle: S('<path d="M24 6L42 40H6z"/><path d="M24 6v34" opacity=".35"/>'),
  star: S('<path d="M24 4c1.6 10.2 9.8 18.4 20 20-10.2 1.6-18.4 9.8-20 20-1.6-10.2-9.8-18.4-20-20 10.2-1.6 18.4-9.8 20-20z"/>'),
  polygon: S('<path d="M24 5l16.5 9.5v19L24 43 7.5 33.5v-19z"/><path d="M24 5v38M7.5 14.5l33 19M40.5 14.5l-33 19" opacity=".3"/>'),
  line: S('<path d="M6 34L42 14"/><path d="M33 12l9 2-3 9"/>'),
  letter: S('<path d="M10 40L22 8h4l12 32M15 28h18"/>'),
  eye: S('<path d="M3 24c6-10 13-15 21-15s15 5 21 15c-6 10-13 15-21 15S9 34 3 24z"/><circle cx="24" cy="24" r="7.5"/><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>'),
  flame: S('<path d="M24 44c-8 0-13-5-13-12 0-8 6-11 7-18 5 3 7 8 6 11 2-1 4-4 4-7 5 4 9 9 9 14 0 7-5 12-13 12z"/>'),
  bolt: S('<path d="M27 4L10 27h12l-3 17 19-24H26z"/>'),
  crown: S('<path d="M7 36l4-22 9 10 4-14 4 14 9-10 4 22z"/><path d="M7 42h34"/>'),
  target: S('<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none"/>'),
  moon: S('<path d="M33 6a19 19 0 1 0 9 26A15 15 0 0 1 33 6z"/>'),
  infinity: S('<path d="M24 24c-4-6-8-9-12-9a9 9 0 0 0 0 18c4 0 8-3 12-9s8-9 12-9a9 9 0 0 1 0 18c-4 0-8-3-12-9z"/>')
};
export const glyph = (k, cls = '') => `<span class="glyph ${cls}">${GLYPH[k] || GLYPH.gear}</span>`;
/** the signs a player can pick (names and readings: strings-entry.js 'sigil.<k>' / 'sigil.<k>.d') */
export const SIGILS = [{ k: 'gear' }, { k: 'anvil' }, { k: 'nut' }, { k: 'spring' }, { k: 'spark' }, { k: 'beam' }];
/** district emblems */
export const ZONE_GLYPH = { design: 'caliper', materials: 'lattice', strength: 'curve', props: 'indent', iron: 'ingot', bend: 'bend', compound: 'spin', cut: 'punch', boss: 'monolith' };
