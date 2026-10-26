// Materials zone kit — the slide data (L1 · S4, S6 · L2 · S2–S3), the line drawings and the two demos, shared by
// materials.js (Arabic), materials.en.js (English), data/figs/materials.js and games/_materials-trials.js.
// Colours: CSS variables only. Every builder takes the page language ('ar' | 'en').

export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)' };
const F = { lat: 'Barlow Condensed', ar: 'Readex Pro' };
export const svg = (vb, inner, label = '', cls = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr" role="img" aria-label="${label}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
export const tx = (x, y, s, { c = V.ink2, size = 13, anchor = 'middle', font = F.lat, weight = 600, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" direction="${font === F.ar ? 'rtl' : 'ltr'}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${c}" stroke="none"${extra ? ' ' + extra : ''}>${s}</text>`;
const st = (c = V.ink, w = 1.8) => `stroke="${c}" stroke-width="${w}"`;
const steel = (o = '.28') => `fill="${V.steel}" fill-opacity="${o}"`;
const ico = inner => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/* =====================================================================================================
   SLIDE DATA
   ===================================================================================================== */
/** L1 · S4 — Materials: four families and their branches */
export const L1_TREE = [
  { k: 'metals', en: 'Metals', ar: 'المعادن', br: [{ en: 'Ferrous', ar: 'حديدية' }, { en: 'Nonferrous', ar: 'غير حديدية' }] },
  { k: 'plastics', en: 'Plastics', ar: 'البلاستيك', br: [{ en: 'Thermoset', ar: 'ثيرموسِت' }, { en: 'Thermoplastic', ar: 'ثيرموبلاستيك' }] },
  { k: 'rubber', en: 'Rubber/Elastomers', ar: 'المطاط والإلاستومرات', br: [{ en: 'Thermoset', ar: 'ثيرموسِت' }, { en: 'Thermoplastic', ar: 'ثيرموبلاستيك' }] },
  { k: 'natural', en: 'Natural Engineering Materials', ar: 'خامات هندسية طبيعية', br: [{ en: 'Engineering Ceramics', ar: 'سيراميك هندسي' }, { en: 'Glass', ar: 'زجاج' }, { en: 'Manufactured Carbon', ar: 'كربون مُصنَّع' }, { en: 'Refractory Hard Metals', ar: 'معادن صلبة حرارية' }] }
];
/** L2 · S2 — the five leaf groups of the classification (slide = the box as written on the slide) */
export const L2_GROUPS = {
  ferrous: { en: 'Ferrous', slide: 'FERROUS (CONTAINS IRON)', ar: 'حديدية (فيها حديد)', path: ['Metals', 'Ferrous'], scene: 'ferrous' },
  nonferrous: { en: 'Non-ferrous', slide: 'NON-FERROUS (CONTAINS NO IRON)', ar: 'غير حديدية (مفيهاش حديد)', path: ['Metals', 'Non-ferrous'], scene: 'nonferrous' },
  thermoset: { en: 'Thermosetting', slide: 'THERMO SETTING POLYMERS (PLASTICS)', ar: 'بوليمرات thermosetting', path: ['Non-metals', 'Polymers', 'Thermosetting'], scene: 'polymers' },
  thermoplastic: { en: 'Thermoplastic', slide: 'THERMO PLASTIC', ar: 'بوليمرات thermoplastic', path: ['Non-metals', 'Polymers', 'Thermoplastic'], scene: 'polymers' },
  ceramics: { en: 'Ceramics', slide: 'CERAMICS', ar: 'سيراميك', path: ['Non-metals', 'Ceramics'], scene: 'ceramics' }
};
/** L2 · S2 — every material on the slide (slide typos corrected in `en`; `slide` keeps the slide's spelling) */
export const L2_LEAVES = [
  { en: 'Wrought iron', ar: 'حديد مطاوع', g: 'ferrous' },
  { en: 'Carbon steels', ar: 'صلب كربوني', g: 'ferrous' },
  { en: 'Alloy steels', ar: 'صلب سبائكي', g: 'ferrous' },
  { en: 'Cast irons', ar: 'حديد زهر', g: 'ferrous' },
  { en: 'Aluminium', ar: 'ألومنيوم', g: 'nonferrous' },
  { en: 'Copper', ar: 'نحاس', g: 'nonferrous' },
  { en: 'Lead', ar: 'رصاص', g: 'nonferrous' },
  { en: 'Silver', ar: 'فضة', g: 'nonferrous' },
  { en: 'Tin', ar: 'قصدير', g: 'nonferrous' },
  { en: 'Zinc', ar: 'زنك', g: 'nonferrous' },
  { en: 'Bakelite', long: 'Bakelite (phenolformaldehyde)', slide: 'Phenolformaldehyde (Bakelite)', ar: 'باكاليت', g: 'thermoset' },
  { en: 'Polyesters', slide: 'Polysters', ar: 'بوليستر', g: 'thermoset' },
  { en: 'Epoxy resins', slide: 'Epoxresins', ar: 'راتنج الإيبوكسي', g: 'thermoset' },
  { en: 'PVC', ar: 'بي في سي', g: 'thermoplastic' },
  { en: 'Polythene', ar: 'بولي إيثيلين', g: 'thermoplastic' },
  { en: 'Acrylic', ar: 'أكريليك', g: 'thermoplastic' },
  { en: 'Resins', ar: 'راتنجات', g: 'thermoplastic', odd: 1 }, // as listed under THERMO PLASTIC (not "epoxy resins")
  { en: 'Refractories', ar: 'حراريات', g: 'ceramics' },
  { en: 'Abrasives', ar: 'مواد كاشطة', g: 'ceramics' },
  { en: 'Glass', ar: 'زجاج', g: 'ceramics' },
  { en: 'Cement', ar: 'أسمنت', g: 'ceramics' },
  { en: 'Concrete', ar: 'خرسانة', g: 'ceramics' }
];
/** L1 · S6 = L2 · S3 — the six bullets under the metals chart */
export const METAL_BULLETS = [
  'Pure metals are composed of atoms of the same type.',
  'Metal alloys are composed of two or more chemical elements.',
  'This blending of elements gives alloys their greater mechanical properties.',
  'The majority of metals used in engineering applications are alloys.',
  'Metals are generally divided into ferrous and nonferrous.',
  'Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application.'
];

/* =====================================================================================================
   TREES (figures and lesson art) — slide labels, CSS-variable ink
   ===================================================================================================== */
const box = (x, y, w, h, { fill = V.zc, fo = '.14', stroke = V.zt, sw = 1.3, dash = '' } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" fill-opacity="${fo}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const lines = (x, y, arr, o = {}) => arr.map((s, i) => tx(x, y + i * ((o.size || 11) + 2), s, o)).join('');

/** L1 · S4 as a drawing (hide = index of a family whose name becomes "?") */
export function l1TreeSVG(hide = -1) {
  const cx = [46, 136, 226, 316];
  const names = [['Metals'], ['Plastics'], ['Rubber/', 'Elastomers'], ['Natural', 'Engineering', 'Materials']];
  const br = [[['Ferrous'], ['Nonferrous']], [['Thermoset'], ['Thermoplastic']], [['Thermoset'], ['Thermoplastic']], [['Engineering', 'Ceramics'], ['Glass'], ['Manufactured', 'Carbon'], ['Refractory', 'Hard Metals']]];
  let g = `${box(130, 4, 100, 24, { fo: '.32' })}${tx(180, 21, 'Materials', { c: V.ink, size: 14, weight: 700 })}
    <path d="M180 28v8M${cx[0]} 36H${cx[3]}${cx.map(x => `M${x} 36v8`).join('')}" ${st(V.ink3, 1.2)}/>`;
  cx.forEach((x, i) => {
    const n = hide === i ? ['?'] : names[i]; const h = 42;
    g += `${box(x - 42, 44, 84, h, { stroke: hide === i ? V.hot : V.zt })}${lines(x, 44 + h / 2 - (n.length - 1) * 6.5 + 4, n, { c: hide === i ? V.hot : V.ink, size: hide === i ? 18 : 11.5, weight: 700 })}`;
    let y = 96; const spineTop = 86;
    br[i].forEach(b => { const bh = b.length > 1 ? 28 : 20; g += `<path d="M${x - 38} ${y + bh / 2}h5" ${st(V.ink3, 1.1)}/>${box(x - 33, y, 75, bh, { fill: 'none', stroke: V.ink3, sw: 1 })}${lines(x + 4.5, y + (b.length > 1 ? 11.5 : 14), b, { c: V.ink2, size: 10.5 })}`; y += bh + 6; });
    g += `<path d="M${x - 38} ${spineTop}V${y - 6 - (br[i][br[i].length - 1].length > 1 ? 14 : 10)}" ${st(V.ink3, 1.1)}/>`;
  });
  return g;
}
/** L1 · S6 — the metals chart (Powdered Metallurgy hangs on a dashed line); hide = the dashed branch becomes "?" */
export function metalsSVG(hide = false) {
  return `${box(122, 6, 76, 26, { fo: '.32' })}${tx(160, 24, 'Metals', { c: V.ink, size: 15, weight: 700 })}
    <path d="M160 32v18M50 50H160M50 50v14M160 50v14" ${st(V.ink3, 1.4)}/>
    <path d="M160 50H270v14" ${st(V.ink3, 1.4)} stroke-dasharray="6 5"/>
    ${box(12, 64, 76, 34, { fill: V.zc, fo: '.14' })}${tx(50, 86, 'Ferrous', { c: V.ink, size: 13.5, weight: 700 })}
    ${box(122, 64, 76, 34, { fill: V.zc, fo: '.14' })}${tx(160, 86, 'Nonferrous', { c: V.ink, size: 13.5, weight: 700 })}
    ${box(226, 64, 88, 34, { fill: V.zc, fo: '.14', stroke: hide ? V.hot : V.zt, dash: '' })}${hide ? tx(270, 89, '?', { c: V.hot, size: 22, weight: 700 }) : lines(270, 78, ['Powdered', 'Metallurgy'], { c: V.ink, size: 12.5, weight: 700 })}
    ${tx(160, 120, 'metals chart', { c: V.ink3, size: 11, weight: 500, extra: 'font-style="italic"' })}`;
}
/** L2 · S2 — the top levels of the classification (hide = 'polymers' puts "?" on that box) */
export function l2TreeSVG(hide = '') {
  const B = (k, x, y, w, rowsTxt, o = {}) => { const hid = hide === k; return `${box(x - w / 2, y, w, o.h || 24, { stroke: hid ? V.hot : V.zt, fo: o.fo || '.14' })}${hid ? tx(x, y + (o.h || 24) / 2 + 7, '?', { c: V.hot, size: 20, weight: 700 }) : lines(x, y + (rowsTxt.length > 1 ? 11 : 16.5), rowsTxt, { c: V.ink, size: o.size || 11, weight: 700 })}`; };
  return `${B('root', 170, 4, 150, ['ENGINEERING MATERIALS'], { fo: '.3' })}
    <path d="M170 28v10M85 38H255M85 38v8M255 38v8" ${st(V.ink3, 1.3)}/>
    ${B('metals', 85, 46, 84, ['METALS'])}${B('nonmetals', 255, 46, 96, ['NON-METALS'])}
    <path d="M85 70v10M40 80H130M40 80v8M130 80v8M255 70v10M210 80H300M210 80v8M300 80v8" ${st(V.ink3, 1.3)}/>
    ${B('ferrous', 40, 88, 76, ['FERROUS', '(CONTAINS IRON)'], { h: 30, size: 9.5 })}${B('nonferrous', 130, 88, 88, ['NON-FERROUS', '(CONTAINS NO IRON)'], { h: 30, size: 9.5 })}
    ${B('polymers', 210, 88, 76, ['POLYMERS'])}${B('ceramics', 300, 88, 70, ['CERAMICS'])}
    <path d="M210 112v10M172 122H252M172 122v8M252 122v8" ${st(V.ink3, 1.3)}/>
    ${B('thermoset', 172, 130, 80, ['THERMO SETTING', 'POLYMERS'], { h: 30, size: 9.5 })}${B('thermoplastic', 256, 130, 80, ['THERMO', 'PLASTIC'], { h: 30, size: 9.5 })}
    ${lines(172, 174, ['Bakelite · polyesters', 'epoxy resins'], { c: V.ink3, size: 9.5, weight: 500 })}${lines(256, 174, ['PVC · polythene', 'acrylic · resins'], { c: V.ink3, size: 9.5, weight: 500 })}`;
}

/* =====================================================================================================
   ATOMS — pure metal vs alloy (one lattice, one or two kinds of atom)
   ===================================================================================================== */
const rng = seed => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; }; };
/** a lattice of atoms; alloy = how many atoms (0…1) are a second element */
export function lattice({ alloy = 0, seed = 3, cols = 8, rows = 5, x0 = 22, y0 = 22, gap = 24, hex = false } = {}) {
  const r = rng(seed); let out = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = x0 + i * gap + (hex && j % 2 ? gap / 2 : 0), y = y0 + j * gap * (hex ? .88 : 1);
    const other = alloy && r() < alloy;
    out += other ? `<circle cx="${x}" cy="${y}" r="11.5" fill="${V.zc}" fill-opacity=".75" ${st(V.zt, 1.4)}/>` : `<circle cx="${x}" cy="${y}" r="8.5" ${steel('.5')} ${st(V.ink2, 1.3)}/>`;
  }
  return out;
}
export const latticeSVG = (kind, seed = 3, label = '') => svg('0 0 218 136', lattice({ alloy: kind === 'alloy' ? .3 : 0, seed, hex: seed % 2 === 0 }), label || (kind === 'alloy' ? 'atoms of two kinds' : 'atoms of one kind'), 'mat-lat');

/* =====================================================================================================
   ICONS AND ART BLOCKS
   ===================================================================================================== */
export const FAM_ICON = {
  metals: ico('<path d="M8 44l8-16h32l8 16z"/><path d="M16 28l5-8h22l5 8" opacity=".7"/><path d="M8 44v4h48v-4"/>'),
  plastics: ico('<path d="M26 8h12v6l6 8v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V22l6-8z"/><path d="M20 30h24M20 40h24" opacity=".5"/>'),
  rubber: ico('<path d="M10 32c0-10 10-14 22-14s22 4 22 14-10 14-22 14-22-4-22-14z"/><path d="M18 32c0-5 6-8 14-8s14 3 14 8-6 8-14 8-14-3-14-8z" opacity=".55"/>'),
  natural: ico('<path d="M10 12h22v40H10z"/><path d="M14 18l8 8M14 28l12 12" opacity=".5"/><path d="M42 20l8-6 8 6v20l-8 6-8-6z"/><path d="M42 20l8 6 8-6M50 26v20" opacity=".55"/>')
};
export const ITEM_ICON = {
  wrought: ico('<path d="M32 56V24"/><path d="M32 24c0-8-6-14-13-12s-7 12 0 12 6-6 2-7"/><path d="M32 24c0-8 6-14 13-12s7 12 0 12-6-6-2-7"/><path d="M32 40c-6 0-12 4-12 10M32 40c6 0 12 4 12 10"/><path d="M22 56h20"/>'),
  carbon: ico('<path d="M10 14h44v8H36v20h18v8H10v-8h18V22H10z"/>'),
  alloy: ico('<path d="M42 8a12 12 0 0 0-11.6 15.4L10 43.8a4.6 4.6 0 0 0 6.5 6.5l20.4-20.4A12 12 0 0 0 52 18l-7 7-6-6 7-7a12 12 0 0 0-4-4z"/>'),
  cast: ico('<path d="M6 30h40v8a10 10 0 0 1-10 10H16A10 10 0 0 1 6 38z"/><path d="M46 34h14"/><path d="M14 22c2-3 2-6 0-9M24 22c2-3 2-6 0-9M34 22c2-3 2-6 0-9" opacity=".5"/>'),
  refractory: ico('<path d="M8 50h48M8 50V22a24 24 0 0 1 48 0v28"/><path d="M8 38h48M8 28h48M20 50V38M32 38V28M44 50V38M20 28v-8M44 28v-8" opacity=".55"/>'),
  abrasive: ico('<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="6"/><g stroke-width="2.6"><path d="M20 20h0M44 22h0M18 38h0M40 46h0M28 48h0M48 34h0M24 28h0M38 16h0"/></g>'),
  glass: ico('<path d="M14 8h36v48H14z"/><path d="M22 16l10 10M22 28l18 18M36 14l8 8" opacity=".5"/>'),
  cement: ico('<path d="M16 12h32l4 40H12z"/><path d="M16 12c4 4 28 4 32 0" opacity=".6"/><path d="M22 28h20M24 36h16" opacity=".5"/>'),
  concrete: ico('<path d="M8 22l24-10 24 10v24L32 56 8 46z"/><path d="M8 22l24 10 24-10M32 32v24" opacity=".6"/><g stroke-width="2.4"><path d="M16 34h0M22 42h0M40 40h0M46 32h0M28 22h0M38 20h0"/></g>'),
  engine: ico('<path d="M10 24h40v24H10z"/><path d="M16 24V14h8v10M28 24V14h8v10M40 24V14h8v10" opacity=".7"/><path d="M50 30h6v12h-6M4 32h6v8H4"/>'),
  crank: ico('<path d="M4 32h10M24 32h16M50 32h10"/><path d="M14 32v-12h10v24h16V20h10v12" /><circle cx="19" cy="20" r="3"/><circle cx="45" cy="44" r="3"/>'),
  crusher: ico('<circle cx="22" cy="34" r="14"/><circle cx="42" cy="34" r="14"/><path d="M22 34l6-6M42 34l-6-6" opacity=".5"/><path d="M28 8l4 8 4-8M26 12l2 6M38 12l-2 6" opacity=".7"/>')
};

/** L1 · S4 — the four natural engineering materials as objects (background pictures, no claims) */
export function artNatural(lang) {
  const en = lang === 'en';
  const items = [
    ['Engineering Ceramics', 'سيراميك هندسي', `<path d="M-18 -28h36l-4 10h-28zM-14 -18h28v30h-28z" ${steel('.35')} ${st()}/><path d="M-14 -8h28M-14 2h28" ${st(V.ink3, 1)}/><path d="M-20 12h40v6h-40z" ${steel('.35')} ${st()}/>`],
    ['Glass', 'زجاج', `<path d="M-22 -30h44v48h-44z" fill="${V.zc}" fill-opacity=".12" ${st(V.zt, 1.8)}/><path d="M-14 -20l12 12M-14 -6l22 22M4 -24l12 12" ${st(V.zt, 1.2)} opacity=".7"/>`],
    ['Manufactured Carbon', 'كربون مُصنَّع', `<path d="M-20 -14l20-10 20 10v22l-20 10-20-10z" fill="${V.ink3}" fill-opacity=".45" ${st()}/><path d="M-20 -14l20 10 20-10M0 -4v22" ${st(V.ink, 1.2)}/>`],
    ['Refractory Hard Metals', 'معادن صلبة حرارية', `<path d="M-6 -32h12v34l-6 14-6-14z" ${steel('.4')} ${st()}/><path d="M-6 -20l12 -6M-6 -10l12 -6M-6 0l12 -6" ${st(V.ink2, 1.1)}/><path d="M0 16l-8 6M0 16l8 6M0 16v9" ${st(V.hot, 1.5)}/>`]
  ];
  return svg(`0 0 520 ${en ? 132 : 150}`, items.map(([e, a, g], i) => `<g transform="translate(${65 + i * 130} 54)">${g}</g>${tx(65 + i * 130, 112, e, { c: V.zt, size: 15, weight: 700 })}${en ? '' : tx(65 + i * 130, 132, a, { c: V.ink3, size: 12, font: F.ar, weight: 400 })}`).join(''), en ? 'Engineering ceramics, glass, manufactured carbon, refractory hard metals' : 'سيراميك هندسي، زجاج، كربون مُصنَّع، معادن صلبة حرارية');
}
/** L2 · S2 — the six non-ferrous metals as ingots */
export function artIngots(lang) {
  const en = lang === 'en';
  const list = L2_LEAVES.filter(l => l.g === 'nonferrous');
  return svg(`0 0 600 ${en ? 128 : 146}`, list.map((l, i) => { const x = 50 + i * 100; return `<path d="M${x - 38} 78l10-34h56l10 34z" ${steel('.32')} ${st()}/><path d="M${x - 28} 44l6-14h44l6 14" ${st(V.ink2, 1.4)} fill="${V.zc}" fill-opacity=".12"/><path d="M${x - 38} 78v6h76v-6" ${st(V.ink2, 1.4)}/>${tx(x, 106, l.en, { c: V.zt, size: 16, weight: 700 })}${en ? '' : tx(x, 128, l.ar, { c: V.ink3, size: 12.5, font: F.ar, weight: 400 })}`; }).join(''), en ? 'Six non-ferrous ingots: aluminium, copper, lead, silver, tin, zinc' : 'ست سبايك غير حديدية');
}
/** background picture: a thermosetting net (cross-linked) vs thermoplastic chains (loose) */
export const NET = svg('0 0 200 120', (() => {
  const P = [[30, 30], [70, 22], [110, 34], [150, 24], [176, 50], [40, 66], [82, 60], [124, 72], [164, 84], [28, 98], [70, 100], [112, 104], [150, 108]];
  const E = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 7], [4, 8], [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 11], [8, 12], [9, 10], [10, 11], [11, 12], [1, 5], [2, 6], [6, 11]];
  return E.map(([a, b]) => `<path d="M${P[a][0]} ${P[a][1]}L${P[b][0]} ${P[b][1]}" ${st(V.zt, 1.6)}/>`).join('') + P.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${V.zc}" ${st(V.zt, 1)}/>`).join('');
})(), 'a rigid net of linked chains');
export const CHAINS = svg('0 0 200 120', [20, 44, 68, 92].map((y, i) => `<path d="M${14 + i * 6} ${y}c14-14 22 14 36 0s22 14 36 0 22 14 36 0 22 14 36 0" ${st(i % 2 ? V.ink2 : V.zt, 2)}/>`).join(''), 'loose chains that can slide past each other');

/* =====================================================================================================
   DEMO 1 — mix an alloy: one kind of atom, then a second element; push the layers and see who resists
   ===================================================================================================== */
export function alloyDemo(lang) {
  const en = lang === 'en';
  const W = en ? { add: 'Add a second element', pure: 'Back to pure', push: 'Push the top layers', pureT: 'Pure metal', pureD: 'atoms of the same type', alloyT: 'Alloy', alloyD: 'two or more chemical elements', slip: 'The layers slide over each other easily: the metal gives way.', jam: 'The odd atoms jam the layers: it resists more. That’s the “greater mechanical properties” of an alloy.', note: 'A picture of the idea: the slide only says that blending gives alloys greater mechanical properties.' }
    : { add: 'ضيف عنصر تاني', pure: 'رجّعه نقي', push: 'ازق الطبقات اللي فوق', pureT: 'معدن نقي', pureD: 'atoms of the same type', alloyT: 'سبيكة', alloyD: 'two or more chemical elements', slip: 'الطبقات اتزحلقت على بعض بسهولة: المعدن استسلم.', jam: 'الذرات المختلفة عطّلت الطبقات: بيقاوم أكتر. ده معنى «خواص ميكانيكية أعلى» للسبيكة.', note: 'دي صورة للفكرة: السلايد بيقول بس إن الخلط بيدّي السبايك خواص ميكانيكية أعلى.' };
  return function mount(el, api) {
    const C = 9, R = 5, G = 26, X0 = 34, Y0 = 26;
    let isAlloy = false, mix = new Set(), done = new Set(), timer = 0;
    const rows = Array.from({ length: R }, (_, j) => `<g class="mat-ax__row" data-r="${j}">${Array.from({ length: C }, (_, i) => `<circle data-i="${j * C + i}" cx="${X0 + i * G}" cy="${Y0 + j * G}" r="9"/>`).join('')}</g>`).join('');
    el.innerHTML = `<div class="mat-ax">
      <div class="mat-ax__fig">${svg('0 0 300 150', `<path class="mat-ax__arrow" d="M6 ${Y0 + G / 2}h18M18 ${Y0 + G / 2 - 6}l6 6-6 6"/>${rows}<path d="M28 ${Y0 + 1.5 * G}H${X0 + (C - 1) * G + 12}" class="mat-ax__plane"/>`, en ? 'A lattice of metal atoms' : 'ذرات معدن مترصّصة')}</div>
      <div class="mat-ax__side">
        <p class="mat-ax__read" aria-live="polite"><b></b><bdi class="en" dir="ltr"></bdi><span></span></p>
        <div class="mat-ax__acts"><button type="button" class="btn btn--zone btn--sm" data-a="mix">${W.add}</button><button type="button" class="btn btn--sm" data-a="pure">${W.pure}</button><button type="button" class="btn btn--sm" data-a="push">${W.push}</button></div>
        <p class="mat-ax__note">${W.note}</p>
      </div>
    </div>`;
    const read = el.querySelector('.mat-ax__read');
    const paint = () => {
      el.querySelectorAll('.mat-ax__row circle').forEach(c => { const on = mix.has(+c.dataset.i); c.classList.toggle('is-b', on); c.setAttribute('r', on ? 11.5 : 9); });
      read.querySelector('b').textContent = isAlloy ? W.alloyT : W.pureT;
      read.querySelector('bdi').textContent = isAlloy ? W.alloyD : W.pureD;
      read.querySelector('span').textContent = '';
      el.querySelector('[data-a="mix"]').disabled = isAlloy; el.querySelector('[data-a="pure"]').disabled = !isAlloy;
    };
    const unpush = () => el.querySelectorAll('.mat-ax__row').forEach(g => g.classList.remove('is-slid', 'is-jam'));
    el.querySelector('[data-a="mix"]').addEventListener('click', () => {
      isAlloy = true; mix = new Set(); const r = rng(Date.now() % 9973);
      for (let k = 0; k < C * R; k++) if (r() < .3) mix.add(k);
      [C + 2, C + 6, 2 * C + 4].forEach(k => mix.add(k)); // a few odd atoms right at the slip plane
      unpush(); paint(); api.sfx('pop'); api.scene('alloy'); done.add('mix');
    });
    el.querySelector('[data-a="pure"]').addEventListener('click', () => { isAlloy = false; mix = new Set(); unpush(); paint(); api.sfx('click'); api.scene('atoms'); done.add('pure'); });
    el.querySelector('[data-a="push"]').addEventListener('click', e => {
      unpush(); clearTimeout(timer);
      const top = [...el.querySelectorAll('.mat-ax__row')].slice(0, 2);
      void el.offsetWidth;
      top.forEach(g => g.classList.add(isAlloy ? 'is-jam' : 'is-slid'));
      read.querySelector('span').textContent = isAlloy ? W.jam : W.slip;
      api.sfx(isAlloy ? 'boop' : 'swoosh'); done.add(isAlloy ? 'pushA' : 'pushP');
      if (done.has('pushA') && done.has('pushP')) api.award(5, { from: e.currentTarget, key: 'demo:mat-alloy' });
      if (!isAlloy) timer = setTimeout(unpush, 2600);
    });
    paint();
    return () => clearTimeout(timer);
  };
}

/* =====================================================================================================
   DEMO 2 — the classification as an outline: tap a material, its path lights up (L2 · S2)
   ===================================================================================================== */
const ROWS = [
  { k: 'root', d: 0, en: 'ENGINEERING MATERIALS', ar: 'الخامات الهندسية' },
  { k: 'metals', d: 1, en: 'METALS', ar: 'معادن', p: 'root' },
  { k: 'ferrous', d: 2, en: 'FERROUS (CONTAINS IRON)', ar: 'حديدية: فيها حديد', p: 'metals', g: 'ferrous' },
  { k: 'nonferrous', d: 2, en: 'NON-FERROUS (CONTAINS NO IRON)', ar: 'غير حديدية: مفيهاش حديد', p: 'metals', g: 'nonferrous' },
  { k: 'nonmetals', d: 1, en: 'NON-METALS', ar: 'لا معادن', p: 'root' },
  { k: 'polymers', d: 2, en: 'POLYMERS', ar: 'بوليمرات', p: 'nonmetals' },
  { k: 'thermoset', d: 3, en: 'THERMO SETTING POLYMERS (PLASTICS)', ar: 'thermosetting', p: 'polymers', g: 'thermoset' },
  { k: 'thermoplastic', d: 3, en: 'THERMO PLASTIC', ar: 'thermoplastic', p: 'polymers', g: 'thermoplastic' },
  { k: 'ceramics', d: 2, en: 'CERAMICS', ar: 'سيراميك', p: 'nonmetals', g: 'ceramics' }
];
export function pathDemo(lang) {
  const en = lang === 'en';
  const W = en ? { pick: 'Tap any material: its path through the tree lights up.' } : { pick: 'اضغط على أي خامة: طريقها في الشجرة هينوّر.' };
  return function mount(el, api) {
    const seen = new Set(); let lastScene = '';
    el.innerHTML = `<div class="mat-tp">
      <ul class="mat-tp__tree" dir="ltr">${ROWS.map(r => `<li class="mat-tp__row" data-k="${r.k}" style="--d:${r.d}"><span class="mat-tp__lbl">${r.en}${en ? '' : ` <small dir="rtl">${r.ar}</small>`}</span>${r.g ? `<span class="mat-tp__leaves">${L2_LEAVES.filter(l => l.g === r.g).map(l => `<button type="button" class="mat-tp__chip" data-m="${l.en}">${l.long || l.en}</button>`).join('')}${r.g === 'nonferrous' ? '<span class="mat-tp__etc">etc.</span>' : ''}</span>` : ''}</li>`).join('')}</ul>
      <p class="mat-tp__read" aria-live="polite">${W.pick}</p>
    </div>`;
    const read = el.querySelector('.mat-tp__read');
    el.querySelectorAll('.mat-tp__chip').forEach(b => b.addEventListener('click', () => {
      const m = L2_LEAVES.find(l => l.en === b.dataset.m); const grp = L2_GROUPS[m.g];
      const row = ROWS.find(r => r.g === m.g); const path = []; let cur = row;
      while (cur) { path.unshift(cur); cur = ROWS.find(r => r.k === cur.p); }
      el.querySelectorAll('.mat-tp__row').forEach(li => li.classList.toggle('is-on', path.some(p => p.k === li.dataset.k)));
      el.querySelectorAll('.mat-tp__chip').forEach(c => c.classList.toggle('is-on', c === b));
      read.innerHTML = `<span dir="ltr" class="mat-tp__crumbs">${path.map(p => `<span>${p.en.replace(/ \(.*\)/, '')}</span>`).join('<i>›</i>')}<i>›</i><b>${m.en}</b></span>${en ? '' : `<small>${m.ar}: ${grp.ar}.</small>`}${m.odd ? `<small>${en ? 'Plain “resins” sit under THERMO PLASTIC on the slide; epoxy resins are THERMO SETTING.' : 'كلمة resins لوحدها مكتوبة تحت THERMO PLASTIC في السلايد، لكن epoxy resins تحت THERMO SETTING.'}</small>` : ''}`;
      api.sfx('click'); if (grp.scene !== lastScene) { lastScene = grp.scene; api.scene(grp.scene); }
      seen.add(m.g); if (seen.size >= 5) api.award(5, { from: read, key: 'demo:mat-path' });
    }));
  };
}
