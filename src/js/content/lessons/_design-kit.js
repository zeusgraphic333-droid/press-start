// Design zone kit — the slide data (L1 · S2–S7), the line drawings and the two demos, shared by design.js (Arabic),
// design.en.js (English) and games/_design-trials.js. Drawings are coloured ONLY with CSS variables, so they read on the
// night shift and on the drafting film. Every builder takes the page language ('ar' | 'en').

export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)', line: 'var(--line)', card: 'var(--card)' };
const F = { lat: 'Barlow Condensed', ar: 'Readex Pro' };
/** an inline drawing: line style, left-to-right coordinates (so text anchors never flip on Arabic pages) */
export const svg = (vb, inner, label = '', cls = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr" role="img" aria-label="${label}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
export const tx = (x, y, s, { c = V.ink2, size = 13, anchor = 'middle', font = F.lat, weight = 600, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" direction="${font === F.ar ? 'rtl' : 'ltr'}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${c}" stroke="none"${extra ? ' ' + extra : ''}>${s}</text>`;
const st = (c = V.ink, w = 1.8) => `stroke="${c}" stroke-width="${w}"`;
const steel = (o = '.28') => `fill="${V.steel}" fill-opacity="${o}"`;
const pick = (lang, ar, en) => (lang === 'en' ? en : ar);

/* =====================================================================================================
   SLIDE DATA
   ===================================================================================================== */
/** L1 · S3 — the six steps along the top of the diagram (lenses sit on steps 1, 3, 5; the lines meet on 2, 4, 6) */
export const STEPS = [
  { en: 'Product Identification / Design Team Formed', ar: 'نحدد المنتج، ونكوّن فريق التصميم' },
  { en: 'Product Defined', ar: 'المنتج اتعرّف' },
  { en: 'Concept Development', ar: 'تطوير الفكرة' },
  { en: 'Concept Presentation', ar: 'عرض الفكرة' },
  { en: 'Product Development', ar: 'تطوير المنتج' },
  { en: 'Product Presentation', ar: 'عرض المنتج' }
];
/** L1 · S3 — the three lenses and the two rows of considerations under each (slide wording; ⚠ "shippin" on the slide) */
export const LENSES = [
  { en: 'Aesthetics', ar: 'الجماليات', personal: ['style', 'ego', 'marketing/advertising'], objective: ['ergonomics', 'engineering', 'marketing', 'investment/profit', 'national/international sales', 'shipping/distribution', 'CPSA/UL/FDA'] },
  { en: 'Analysis', ar: 'التحليل', personal: ['research', 'sketches', 'mock-ups', 'finish color/texture'], objective: ['ergonomics', 'breadboard studies', 'manufacturability', 'safety', 'strength of materials'] },
  { en: 'Synthesis', ar: 'التركيب', personal: ['CAID', 'material selection', 'process selection'], objective: ['CAD/CAM', 'material selection', 'tooling', 'component selection', 'vendors', 'assembly', 'shipping/packaging', 'repair/maintenance'] }
];
/** L1 · S7 — Manufacturing Methods: four families, fourteen branches (k = the drawing in PANEL) */
export const FAMILIES = [
  { k: 'forming', en: 'Forming', ar: 'التشكيل', scene: 'forming', br: [{ k: 'liquid', en: 'Liquid State', ar: 'الحالة السائلة' }, { k: 'plastic', en: 'Plastic State', ar: 'الحالة اللدنة' }, { k: 'solid', en: 'Solid State', ar: 'الحالة الصلبة' }] },
  { k: 'cutting', en: 'Cutting', ar: 'القطع', scene: 'cuttingM', br: [{ k: 'sheet', en: 'Sheet Cutting', ar: 'قص الصاج' }, { k: 'chip', en: 'Chip Forming', ar: 'قطع بيطلّع رايش' }, { k: 'nonchip', en: 'Nonchip Forming', ar: 'قطع من غير رايش' }, { k: 'flame', en: 'Flame/Laser', ar: 'لهب أو ليزر' }] },
  { k: 'joining', en: 'Joining', ar: 'الوصل', scene: 'joining', br: [{ k: 'solder', en: 'Solder/Braze', ar: 'لحام بمعدن حشو' }, { k: 'weld', en: 'Weld', ar: 'لحام' }, { k: 'adhesive', en: 'Adhesive', ar: 'لزق' }, { k: 'mechanical', en: 'Mechanical', ar: 'ربط ميكانيكي' }] },
  { k: 'finishing', en: 'Finishing', ar: 'التشطيب', scene: 'finishing', br: [{ k: 'formed', en: 'Formed', ar: 'تشطيب طالع من التشكيل' }, { k: 'abrasive', en: 'Abrasive/Cut', ar: 'صنفرة وتجليخ' }, { k: 'coatings', en: 'Coatings', ar: 'طبقات ودهانات' }] }
];
export const BRANCHES = FAMILIES.flatMap(f => f.br.map(b => ({ ...b, fam: f.k })));

/** L1 · S5 — figure 1-1, read cell by cell from the slide. 14 columns in tree order; 3 All · 2 Most · 1 Some · 0 No Processes.
 *  key: the rows whose cells are clear enough to ask about (Ferrous, Nonferrous, Thermoset/Thermoplastics plastics, Wood). */
export const MX_ROWS = [
  { g: 'Metals', en: 'Ferrous', ar: 'حديدية', v: '33333333333333', key: 1 },
  { g: 'Metals', en: 'Nonferrous', ar: 'غير حديدية', v: '33333323333333', key: 1 },
  { g: 'Plastics', en: 'Thermoset', ar: 'بلاستيك thermoset', v: '30033110033323', key: 1 },
  { g: 'Plastics', en: 'Thermoplastics', ar: 'بلاستيك thermoplastic', v: '33233110333333', key: 1 },
  { g: 'Rubber & Elastomers', en: 'Thermoset', ar: 'مطاط thermoset', v: '30031110033311' },
  { g: 'Rubber & Elastomers', en: 'Thermoplastics', ar: 'مطاط thermoplastic', v: '33331110333311' },
  { g: 'Engineering Materials', en: 'Manufactured Carbon', ar: 'كربون مُصنَّع', v: '30003100022111' },
  { g: 'Engineering Materials', en: 'Glass', ar: 'زجاج', v: '33031201322311' },
  { g: 'Engineering Materials', en: 'Engineered Ceramics', ar: 'سيراميك هندسي', v: '32001000032322' },
  { g: 'Engineering Materials', en: 'Refractory Hard Metals', ar: 'معادن صلبة حرارية', v: '33002223011131' },
  { g: 'Natural Materials*', en: 'Fibers', ar: 'ألياف', v: '32333010023111' },
  { g: 'Natural Materials*', en: 'Wood Products', ar: 'منتجات خشب', v: '11033110033133', key: 1 }
];
export const MX_LEGEND = [
  { en: 'No Processes', ar: 'ولا عملية' },
  { en: 'Some Processes', ar: 'بعض العمليات' },
  { en: 'Most Processes', ar: 'معظم العمليات' },
  { en: 'All Processes', ar: 'كل العمليات' }
];
/** a figure 1-1 symbol (v = 0…3) as a small inline svg; styled by .dsg-sym in 70-design.css */
export const sym = (v, cls = '') => `<svg viewBox="0 0 20 20" class="dsg-sym dsg-sym--${v}${cls ? ' ' + cls : ''}" aria-hidden="true"><circle cx="10" cy="10" r="7"/>${v === 1 ? '<path d="M3 10.5a7 7 0 0 0 14 0z"/>' : ''}</svg>`;
/** the same symbol drawn inside a bigger svg at (x, y) with radius r (figures) */
export const symAt = (v, x, y, r = 7) => {
  const ring = `stroke="${V.zt}" stroke-width="1.4"`;
  if (v === 3) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${V.zc}" ${ring}/>`;
  if (v === 2) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${V.zc}" fill-opacity=".38" ${ring}/>`;
  if (v === 1) return `<path d="M${x - r} ${y + .5}a${r} ${r} 0 0 0 ${2 * r} 0z" fill="${V.zc}" stroke="none"/><circle cx="${x}" cy="${y}" r="${r}" ${ring}/>`;
  return `<circle cx="${x}" cy="${y}" r="${r}" ${ring}/>`;
};

/* =====================================================================================================
   THE FOURTEEN BRANCHES AS LINE DRAWINGS — each panel lives in a 150 × 130 box
   ===================================================================================================== */
/** 45° hatching inside the rectangle (x, y, w, h): lines (x + t + s, y + h − s), clipped to the box */
export const hatch = (x, y, w, h, gap = 7) => {
  let d = '';
  for (let t = -h + gap / 2; t < w; t += gap) {
    const s0 = Math.max(0, -t), s1 = Math.min(h, w - t); if (s1 <= s0) continue;
    d += `M${+(x + t + s0).toFixed(1)} ${+(y + h - s0).toFixed(1)}L${+(x + t + s1).toFixed(1)} ${+(y + h - s1).toFixed(1)}`;
  }
  return `<path d="${d}" stroke="${V.hatch}" stroke-width=".8"/>`;
};
const arrowDown = (x, y1, y2, c = V.hot) => `<path d="M${x} ${y1}V${y2}M${x - 5} ${y2 - 6}L${x} ${y2}l5-6" ${st(c, 2)}/>`;
const arrowUp = (x, y1, y2, c = V.hot) => `<path d="M${x} ${y1}V${y2}M${x - 5} ${y2 + 6}L${x} ${y2}l5 6" ${st(c, 2)}/>`;

export const PANEL = {
  /* Forming */
  liquid: `<g transform="rotate(26 46 30)"><path d="M24 14h42l-6 30H30z" ${steel()} ${st()}/><path d="M24 20H12" ${st(V.ink, 2.6)}/></g>
    <path d="M70 27c4 10 4 26 3 52" ${st(V.hot, 3.2)}/><path d="M76 34c2 8 2 16 1 24" ${st(V.hot, 1)} opacity=".6"/>
    <path d="M22 78h38v28h28V78h40v44H22z" ${steel()} ${st()}/>${hatch(23, 79, 36, 42)}${hatch(89, 79, 38, 42)}
    <rect x="61" y="92" width="26" height="13" fill="${V.hot}" fill-opacity=".45"/><path d="M61 92h26" ${st(V.hot, 1.4)}/>`,
  plastic: `<rect x="30" y="14" width="90" height="28" ${steel()} ${st()}/>${hatch(31, 15, 88, 26)}
    <rect x="30" y="92" width="90" height="28" ${steel()} ${st()}/>${hatch(31, 93, 88, 26)}
    <path d="M48 44h54c10 0 14 8 14 24s-4 22-14 22H48c-10 0-14-6-14-22s4-24 14-24z" fill="${V.hot}" fill-opacity=".18" ${st(V.hot, 2)}/>
    <path d="M56 56c6 4 12 4 18 0s12-4 18 0M56 70c6 4 12 4 18 0s12-4 18 0" ${st(V.hot, 1)} opacity=".55"/>
    ${arrowDown(75, -2, 12)}${arrowUp(75, 134, 122)}`,
  solid: `<path d="M28 120V96h30l17 18 17-18h30v24z" ${steel()} ${st()}/>
    <path d="M24 74h102" ${st(V.ink3, 1.4)} stroke-dasharray="4 4"/>
    <path d="M24 76l51 32 51-32" ${st(V.zc, 3.2)}/>
    <path d="M66 26h18v44l-9 12-9-12z" ${steel()} ${st()}/>${arrowDown(75, 4, 20)}`,
  /* Cutting */
  sheet: `<path d="M16 76h60v42H16z" ${steel()} ${st()}/>${hatch(17, 77, 58, 40)}
    <path d="M80 18h50v52H80z" ${steel()} ${st()}/>${hatch(81, 19, 48, 50)}
    <rect x="8" y="70" width="70" height="6" fill="${V.zc}" fill-opacity=".55" ${st(V.zt, 1.2)}/>
    <rect x="80" y="74" width="62" height="6" fill="${V.zc}" fill-opacity=".55" ${st(V.zt, 1.2)}/>
    <path d="M78 64v18" ${st(V.hot, 1.4)} stroke-dasharray="2 3"/>${arrowDown(105, -2, 13)}`,
  chip: `<path d="M14 80h74v-6h48v46H14z" ${steel()} ${st()}/>${hatch(15, 81, 120, 38, 9)}
    <path d="M92 74L98 26h28L106 74z" fill="${V.ink3}" fill-opacity=".35" ${st()}/>
    <path d="M90 74c-12-2-22-12-18-24s20-12 22-2-8 14-14 8 0-14 6-12" ${st(V.zc, 2.4)}/>
    <path d="M88 78h-70" ${st(V.zc, 1)} stroke-dasharray="2 4"/>`,
  nonchip: `<rect x="14" y="84" width="122" height="30" ${steel()} ${st()}/>
    <path d="M40 84c2 10 12 12 18 6s10-10 18-2 12 6 16-4" ${st(V.zc, 2)} fill="${V.zc}" fill-opacity=".18"/>
    <path d="M66 12l-14 30h13l-9 26 26-36H68l9-20z" fill="${V.zc}" fill-opacity=".25" ${st(V.zt, 1.6)}/>
    <path d="M28 40c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12zM118 34c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z" ${st(V.zt, 1.4)}/>`,
  flame: `<path d="M58 12h34l-8 26H66z" ${steel()} ${st()}/><path d="M66 38h18" ${st()}/>
    <path d="M75 40v46" ${st(V.hot, 7)} opacity=".18"/><path d="M75 40v46" ${st(V.hot, 2.6)}/>
    <rect x="14" y="86" width="58" height="18" ${steel()} ${st()}/><rect x="78" y="86" width="58" height="18" ${steel()} ${st()}/>
    <path d="M75 106l-10 14M75 106l2 18M75 106l12 12M75 106l-18 6M75 106l20 4" ${st(V.hot, 1.6)}/>`,
  /* Joining */
  solder: `<rect x="14" y="62" width="82" height="12" ${steel()} ${st()}/><rect x="54" y="74" width="82" height="12" ${steel()} ${st()}/>
    <path d="M96 62v12h12z" fill="${V.zc}" fill-opacity=".8" ${st(V.zt, 1.2)}/><path d="M54 86V74H42z" fill="${V.zc}" fill-opacity=".8" ${st(V.zt, 1.2)}/>
    <path d="M128 22L106 58" ${st(V.zc, 3)}/><circle cx="104" cy="61" r="3" fill="${V.zc}" stroke="none"/>
    <path d="M30 104h90" ${st(V.ink3, 1)} stroke-dasharray="3 4"/>`,
  weld: `<rect x="14" y="74" width="58" height="18" ${steel()} ${st()}/><rect x="78" y="74" width="58" height="18" ${steel()} ${st()}/>
    <path d="M62 74c4-11 22-11 26 0z" fill="${V.hot}" fill-opacity=".45" ${st(V.hot, 1.8)}/><path d="M68 70c2-3 4-3 6 0M76 70c2-3 4-3 6 0" ${st(V.hot, 1)}/>
    <path d="M75 14v40" ${st(V.ink, 4)}/><path d="M75 56l-6 6M75 56l6 6M75 56l-9-1M75 56l9-1M75 56v8" ${st(V.hot, 1.6)}/>`,
  adhesive: `<rect x="14" y="56" width="86" height="14" ${steel()} ${st()}/><rect x="50" y="76" width="86" height="14" ${steel()} ${st()}/>
    <rect x="50" y="70" width="50" height="6" fill="${V.zc}" fill-opacity=".5" ${st(V.zt, 1)} stroke-dasharray="2 2"/>
    <path d="M100 73c4 0 6 3 6 7" ${st(V.zc, 2)}/>${arrowDown(30, 26, 50, V.ink3)}${arrowUp(120, 120, 96, V.ink3)}`,
  mechanical: `<rect x="14" y="62" width="86" height="12" ${steel()} ${st()}/><rect x="50" y="74" width="86" height="12" ${steel()} ${st()}/>
    <rect x="64" y="50" width="24" height="12" rx="2" fill="${V.zc}" fill-opacity=".55" ${st(V.zt, 1.6)}/>
    <rect x="71" y="62" width="10" height="40" fill="${V.zc}" fill-opacity=".25" ${st(V.zt, 1.4)}/>
    <path d="M62 86h28v12H62z" fill="${V.zc}" fill-opacity=".55" ${st(V.zt, 1.6)}/><path d="M70 86v12M82 86v12" ${st(V.zt, 1)}/>
    <path d="M73 104h6M73 108h6" ${st(V.zt, 1.2)}/>`,
  /* Finishing */
  formed: `<path d="M24 14h102v28H24z" ${steel()} ${st()}/><path d="M24 42l6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8" ${st()}/>
    ${arrowDown(75, 0, 10)}
    <path d="M18 84l6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8V116H18z" ${steel()} ${st()}/>
    <path d="M18 84l6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8" ${st(V.zc, 2.4)}/>`,
  abrasive: `<circle cx="66" cy="42" r="30" fill="${V.ink3}" fill-opacity=".18" ${st()}/><circle cx="66" cy="42" r="6" ${st()}/>
    <g fill="${V.ink2}" stroke="none"><circle cx="50" cy="28" r="1.4"/><circle cx="80" cy="30" r="1.4"/><circle cx="58" cy="58" r="1.4"/><circle cx="82" cy="54" r="1.4"/><circle cx="44" cy="46" r="1.4"/><circle cx="72" cy="20" r="1.4"/><circle cx="88" cy="42" r="1.4"/><circle cx="66" cy="66" r="1.4"/></g>
    <path d="M40 18a32 32 0 0 1 18-9" ${st(V.ink3, 1.6)}/><path d="M58 9l-6-3M58 9l-4 5" ${st(V.ink3, 1.6)}/>
    <rect x="14" y="74" width="122" height="26" ${steel()} ${st()}/><path d="M18 76h46" ${st(V.zc, 2.6)}/>
    <path d="M70 74l14-10M70 74l20-4M70 74l18 4M70 74l10-16" ${st(V.hot, 1.6)}/>`,
  coatings: `<path d="M14 26h26l10 7-10 7H14z" ${steel()} ${st()}/><path d="M22 40l-4 22h10l4-22" ${st()}/>
    <g fill="${V.zc}" stroke="none"><circle cx="58" cy="36" r="1.8"/><circle cx="66" cy="44" r="1.8"/><circle cx="62" cy="54" r="1.8"/><circle cx="74" cy="56" r="1.8"/><circle cx="84" cy="66" r="1.8"/><circle cx="72" cy="68" r="1.8"/><circle cx="94" cy="72" r="1.8"/><circle cx="104" cy="76" r="1.8"/><circle cx="88" cy="78" r="1.8"/><circle cx="116" cy="78" r="1.8"/><circle cx="78" cy="46" r="1.8"/><circle cx="96" cy="60" r="1.8"/></g>
    <rect x="52" y="84" width="84" height="8" fill="${V.zc}" fill-opacity=".7" ${st(V.zt, 1.2)}/>
    <rect x="52" y="92" width="84" height="22" ${steel()} ${st()}/>`
};
/** one branch drawing in its own frame (the trial's job card) */
export const panelSVG = (k, label = '') => svg('0 0 150 130', PANEL[k], label, 'dsg-panel');

/** a row of labelled panels: the drawing for one family (keys = branch keys) */
function familyArt(fam, lang) {
  const f = FAMILIES.find(x => x.k === fam); const n = f.br.length; const cw = n === 4 ? 150 : 170; const W = cw * n;
  const cells = f.br.map((b, i) => `<g transform="translate(${i * cw + (cw - 150) / 2} 0)">${PANEL[b.k]}</g>
    ${tx(i * cw + cw / 2, 148, b.en, { c: V.zt, size: 16, weight: 700 })}${lang === 'en' ? '' : tx(i * cw + cw / 2, 168, b.ar, { c: V.ink3, size: 12, font: F.ar, weight: 400 })}`).join('');
  return svg(`0 0 ${W} ${lang === 'en' ? 158 : 176}`, cells, `${f.en}: ${f.br.map(b => b.en).join(', ')}`, 'dsg-famart');
}
export const artFamily = (fam, lang) => familyArt(fam, lang);

/* =====================================================================================================
   ICONS — the four families (grid cards) and the products from L1 · S8–S18 (currentColor, 64 × 64)
   ===================================================================================================== */
const ico = (inner, vb = '0 0 64 64') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
export const FAM_ICON = {
  forming: ico('<path d="M8 46h18l14-22h16"/><path d="M8 52h20l14-22h14" opacity=".45"/><path d="M40 8v10M35 13l5 5 5-5"/>'),
  cutting: ico('<path d="M14 12l34 34M50 12L16 46"/><circle cx="12" cy="52" r="6"/><circle cx="52" cy="52" r="6"/>'),
  joining: ico('<path d="M6 26h32v8H6zM26 34h32v8H26z"/><path d="M30 18v32"/><path d="M25 18h10M25 50h10"/>'),
  finishing: ico('<path d="M8 20h14l6 4-6 4H8z"/><path d="M34 22l8-4M34 24h10M34 26l8 4"/><path d="M8 50h48"/><path d="M8 44h48" stroke-width="4" opacity=".55"/>')
};
export const PRODUCT_ICON = {
  table: ico('<path d="M6 18h52M8 18v4h48v-4"/><path d="M14 22c-4 8 4 12 0 20s2 10 0 16M50 22c4 8-4 12 0 20s-2 10 0 16"/><circle cx="15" cy="30" r="2"/><circle cx="49" cy="30" r="2"/><circle cx="14" cy="44" r="1.5"/><circle cx="50" cy="44" r="1.5"/>'),
  bed: ico('<path d="M10 54V12M54 54V12M10 12h44M10 40h44"/><circle cx="21" cy="26" r="6"/><circle cx="32" cy="26" r="6"/><circle cx="43" cy="26" r="6"/><path d="M10 26h5M27 26h0M49 26h5"/>'),
  desk: ico('<path d="M6 18h38a14 14 0 0 1 14 14v22"/><path d="M6 18v36M6 36h28v18"/><g stroke-width="1.4"><path d="M10 21h0M16 21h0M22 21h0M28 21h0M34 21h0M40 21h0"/></g>'),
  stand: ico('<rect x="26" y="6" width="12" height="11" rx="1"/><path d="M32 17v3M22 20h20v18H22z"/><path d="M26 38v8l-6 10M38 38v8l6 10"/><path d="M42 24l12 30"/>'),
  lamp: ico('<path d="M18 12l20-6 12 18-18 10z"/><path d="M38 6l-6 28"/><path d="M33 34l-5 18M16 54h22l6-4H22z"/>'),
  basket: ico('<path d="M8 26l24-10 24 10-24 10z"/><path d="M8 26v16l24 10 24-10V26M32 36v16"/><g stroke-width="1.6"><path d="M13 33h0M19 36h0M25 39h0M13 39h0M19 42h0M25 45h0M39 39h0M45 36h0M51 33h0M39 45h0M45 42h0M51 39h0"/></g>'),
  spun: ico('<path d="M28 6h8v6c0 5 12 7 12 15v29H16V27c0-8 12-10 12-15z"/><path d="M16 32h32M16 38h32M16 44h32M16 50h32" opacity=".55"/>'),
  wirecar: ico('<path d="M4 44c1-8 8-10 14-12l9-9h14l9 9c6 1 10 4 10 12z"/><path d="M14 32v12M27 23v21M41 23v21M50 32v12M4 38h56" opacity=".5"/><circle cx="16" cy="46" r="5"/><circle cx="48" cy="46" r="5"/>'),
  crate: ico('<path d="M8 20h48v32H8z"/><path d="M8 20l4-6h40l4 6"/><rect x="14" y="28" width="8" height="16" rx="3"/><rect x="28" y="28" width="8" height="16" rx="3"/><rect x="42" y="28" width="8" height="16" rx="3"/>')
};

/* =====================================================================================================
   ART BLOCKS
   ===================================================================================================== */
/** L1 · S2 — the same pendant lamp, half drawing and half product (reading order: drawing first) */
export function artDesigner(lang) {
  const en = lang === 'en';
  const sx = en ? 0 : 300, mx = en ? 300 : 0; // sketch half / made half
  const body = `<path d="M300 8V52"/><rect x="280" y="52" width="40" height="26" rx="5"/><path d="M283 78C264 128 160 178 128 232H472C440 178 336 128 317 78z"/><ellipse cx="300" cy="232" rx="172" ry="14"/><path d="M278 244a22 22 0 0 0 44 0"/>`;
  const sMid = sx + 150, mMid = mx + 150;
  return svg('0 0 600 300', `
    <defs><clipPath id="dsg-cl-s"><rect x="${sx}" y="0" width="300" height="300"/></clipPath><clipPath id="dsg-cl-m"><rect x="${mx}" y="0" width="300" height="300"/></clipPath></defs>
    <g clip-path="url(#dsg-cl-s)">
      <g ${st(V.ink3, 1.4)} stroke-dasharray="5 4">${body}</g>
      <g ${st(V.zc, 1)} opacity=".75"><circle cx="300" cy="78" r="26"/><path d="M110 232h380"/><path d="M128 232L300 78 472 232" stroke-dasharray="2 5"/>
        <path d="M128 266h344M128 259v14M472 259v14M128 266l9-4M128 266l9 4M472 266l-9-4M472 266l-9 4"/></g>
      <g ${st(V.zt, 1.4)}><path d="M124 228l8 8M132 228l-8 8M468 228l8 8M476 228l-8 8M296 74l8 8M304 74l-8 8"/></g>
    </g>
    <g clip-path="url(#dsg-cl-m)">
      <g ${st(V.ink, 2)} ${steel('.32')}>${body}</g>
      <path d="M295 88C286 132 214 186 180 226M305 88C314 132 386 186 420 226M300 88V226" ${st(V.hatch, 1)}/>
      <ellipse cx="300" cy="232" rx="172" ry="14" ${st(V.zc, 2.2)}/><circle cx="300" cy="250" r="18" fill="${V.zc}" fill-opacity=".3" stroke="none"/>
    </g>
    <path d="M300 4V296" ${st(V.zc, 1.6)} stroke-dasharray="12 4 2 4"/>
    ${tx(sMid, 28, en ? 'the drawing' : 'الرسمة', { c: V.ink2, size: 18, font: en ? F.lat : F.ar, weight: en ? 700 : 600 })}
    ${tx(mMid, 28, en ? 'the product' : 'المنتج', { c: V.zt, size: 18, font: en ? F.lat : F.ar, weight: en ? 700 : 600 })}
    ${tx(sMid, 292, 'appearance and form', { c: V.ink2, size: 16 })}
    ${tx(mMid, 292, 'manufactured', { c: V.zt, size: 16 })}`, en ? 'A pendant lamp: one half is a drawing, the other half is the made product' : 'لمبة معلقة: نصها رسمة ونصها منتج متصنع');
}

/** L1 · S3 — the two rows of considerations as a board: one column per lens, personal chips (dashed) above objective chips (filled) */
export function considerArt(lang) {
  const en = lang === 'en';
  const brk = s => s.replace(/\//g, '/<wbr>');
  const W = en ? { p: 'Personal and Individual', o: 'Objective' } : { p: 'شخصي وفردي', o: 'موضوعي' };
  return `<div class="dsg-cons">
    <p class="dsg-cons__key"><span class="dsg-chip dsg-chip--p">${W.p}</span><span class="dsg-chip dsg-chip--o">${W.o}</span></p>
    <div class="dsg-cons__cols" dir="ltr">${LENSES.map((l, i) => `<section class="dsg-cons__col">
      <h6><span class="hud-num">0${i + 1}</span>${l.en}${en ? '' : `<small>${l.ar}</small>`}</h6>
      <ul class="dsg-cons__list">${l.personal.map(s => `<li class="dsg-chip dsg-chip--p">${brk(s)}</li>`).join('')}</ul>
      <ul class="dsg-cons__list">${l.objective.map(s => `<li class="dsg-chip dsg-chip--o">${brk(s)}</li>`).join('')}</ul>
    </section>`).join('')}</div></div>`;
}

/** L1 · S3 — the Product Design Sequence as a static drawing (marked = index of a lens to hide behind "?", for figures) */
export function seqSVG({ marked = -1, labels = true, w = 640 } = {}) {
  const X = [110, 190, 290, 370, 470, 550], CY = 132, H = 46, OFF = [-40, -30, -20, -10, 0, 10, 20, 30, 40];
  let rays = '';
  OFF.forEach(o => {
    rays += `M20 ${CY + o}H${X[0]}L${X[1]} ${CY}L${X[2]} ${CY + o}L${X[3]} ${CY}L${X[4]} ${CY + o}L${X[5]} ${CY}L${w - 10} ${CY + o * 1.7}`;
  });
  const lens = (x, i) => `<ellipse cx="${x}" cy="${CY}" rx="7" ry="${H + 6}" fill="${V.zc}" fill-opacity=".45" ${st(V.zt, 1.6)}/>${tx(x, CY + H + 32, marked === i ? '?' : LENSES[i].en, { c: marked === i ? V.hot : V.zt, size: marked === i ? 26 : 18, weight: 700 })}`;
  const marks = X.map((x, i) => `<path d="M${x} 44V${i % 2 ? CY - 4 : CY - H - 8}" ${st(V.ink3, 1)}/><circle cx="${x}" cy="30" r="13" ${st(V.ink2, 1.4)}/>${tx(x, 36, i + 1, { c: V.ink, size: 16, weight: 700 })}`).join('');
  return `<path d="${rays}" ${st(V.ink3, 1.1)}/>${[0, 2, 4].map((x, i) => lens(X[x], i)).join('')}${labels ? marks : ''}`;
}

/* =====================================================================================================
   DEMO 1 — the lens bench (L1 · S3): step through the six steps; each lens gathers many lines into one point
   ===================================================================================================== */
const LENS_READ = [
  { ar: 'خطوط كتير داخلة من الشمال: آراء، وأرقام، وطلبات. عدسة <en>Aesthetics</en> بتلمّهم.', en: 'Lots of lines come in from the left: opinions, numbers, wishes. The <b>Aesthetics</b> lens gathers them.' },
  { ar: 'الخطوط اتقابلت في نقطة واحدة: المنتج اتعرّف. قرار واحد واضح.', en: 'The lines meet at one point: the product is defined. One clear decision.' },
  { ar: 'من النقطة دي الخطوط بتفتح تاني: أفكار تصميم كتير. عدسة <en>Analysis</en> بتلمّها.', en: 'From that point the lines spread again: many design ideas. The <b>Analysis</b> lens gathers them.' },
  { ar: 'اتقابلوا تاني في نقطة: فكرة واحدة بتتعرض.', en: 'They meet again at one point: one concept is presented.' },
  { ar: 'وتفتح لآخر مرة: خامات، وعمليات، وقطع، وموردين. عدسة <en>Synthesis</en> بتركّب ده كله.', en: 'They spread one last time: materials, processes, components, vendors. The <b>Synthesis</b> lens puts it all together.' },
  { ar: 'آخر نقطة: المنتج بيتعرض. وبعدها الخطوط بتفتح تاني.', en: 'The last point: the product is presented. After it, the lines spread out again.' }
];
export function lensDemo(lang) {
  const en = lang === 'en';
  const W = en ? { start: 'Start', next: 'Next step', again: 'From the top', back: 'Back', step: 'Step', personal: 'Personal', objective: 'Objective', intro: 'Press <b>Start</b>: watch the lines go through the three lenses.' }
    : { start: 'ابدأ', next: 'الخطوة الجاية', again: 'من الأول', back: 'رجوع', step: 'خطوة', personal: 'شخصي', objective: 'موضوعي', intro: 'اضغط <b>ابدأ</b>، وتابع الخطوط وهي بتعدي من التلات عدسات.' };
  const rich = s => s.replace(/<en>([\s\S]*?)<\/en>/g, '<bdi class="en" dir="ltr">$1</bdi>');
  return function mount(el, api) {
    let k = -1;
    const X = [110, 190, 290, 370, 470, 550], CY = 132, H = 46, OFF = [-40, -30, -20, -10, 0, 10, 20, 30, 40];
    const P = [[20, null], [X[0], null], [X[1], 'f'], [X[2], null], [X[3], 'f'], [X[4], null], [X[5], 'f']];
    const yAt = (i, o) => (P[i][1] === 'f' ? CY : CY + o);
    const segs = Array.from({ length: 7 }, (_, s) => `<path class="dsg-lens__seg" data-s="${s}" d="${OFF.map(o => s < 6 ? `M${P[s][0]} ${yAt(s, o)}L${P[s + 1][0]} ${yAt(s + 1, o)}` : `M${X[5]} ${CY}L630 ${CY + o * 1.7}`).join('')}"/>`).join('');
    const lenses = [0, 2, 4].map((xi, i) => `<g class="dsg-lens__lens" data-l="${i}"><ellipse cx="${X[xi]}" cy="${CY}" rx="7" ry="${H + 6}"/>${tx(X[xi], CY + H + 34, LENSES[i].en, { c: V.zt, size: 19, weight: 700 })}</g>`).join('');
    const foci = [1, 3, 5].map(xi => `<circle class="dsg-lens__focus" data-f="${xi}" cx="${X[xi]}" cy="${CY}" r="5"/>`).join('');
    const marks = X.map((x, i) => `<g class="dsg-lens__mk" data-k="${i}" role="button" tabindex="0" aria-label="${W.step} ${i + 1}: ${STEPS[i].en}"><path d="M${x} 46V${i % 2 ? CY - 6 : CY - H - 10}"/><circle cx="${x}" cy="30" r="15"/>${tx(x, 37, i + 1, { c: 'currentColor', size: 18, weight: 700 })}</g>`).join('');
    el.innerHTML = `<div class="dsg-lens">
      <div class="dsg-lens__fig">${svg('0 0 640 250', segs + lenses + foci + marks, en ? 'The Product Design Sequence: six steps and three lenses' : 'تسلسل تصميم المنتج: ست خطوات وتلات عدسات')}</div>
      <div class="dsg-lens__read" aria-live="polite"></div>
      <div class="dsg-lens__acts"><button type="button" class="btn btn--sm" data-a="back" disabled>${W.back}</button><button type="button" class="btn btn--zone btn--sm" data-a="next">${W.start}</button></div>
    </div>`;
    const read = el.querySelector('.dsg-lens__read'), bNext = el.querySelector('[data-a="next"]'), bBack = el.querySelector('[data-a="back"]');
    const paint = () => {
      const on = k < 0 ? -1 : k;
      el.querySelectorAll('.dsg-lens__seg').forEach(p => { const s = +p.dataset.s; const active = on >= 0 && (s === on || (on === 5 && s === 6)); p.classList.toggle('is-on', active); p.classList.toggle('is-past', on >= 0 && s < on); });
      el.querySelectorAll('.dsg-lens__lens').forEach(g => g.classList.toggle('is-on', on >= 0 && on === +g.dataset.l * 2));
      el.querySelectorAll('.dsg-lens__focus').forEach(c => c.classList.toggle('is-on', on >= 0 && on === +c.dataset.f));
      el.querySelectorAll('.dsg-lens__mk').forEach(g => { const i = +g.dataset.k; g.classList.toggle('is-on', i === on); g.classList.toggle('is-past', on >= 0 && i < on); });
      if (k < 0) read.innerHTML = `<p class="dsg-lens__intro">${W.intro}</p>`;
      else {
        const s = STEPS[k], lens = k % 2 === 0 ? LENSES[k / 2] : null;
        read.innerHTML = `<p class="dsg-lens__h"><span class="hud-num">${String(k + 1).padStart(2, '0')}/06</span><b dir="ltr">${s.en}</b>${en ? '' : `<small>${s.ar}</small>`}</p>
          <p class="dsg-lens__p">${rich(en ? LENS_READ[k].en : LENS_READ[k].ar)}</p>
          ${lens ? `<p class="dsg-lens__c"><span class="chip">${W.personal}</span><span dir="ltr">${lens.personal.join(' · ')}</span></p><p class="dsg-lens__c"><span class="chip chip--zone">${W.objective}</span><span dir="ltr">${lens.objective.join(' · ')}</span></p>` : ''}`;
      }
      bBack.disabled = k < 0;
      bNext.textContent = k < 0 ? W.start : k >= 5 ? W.again : W.next;
    };
    const go = (n, from) => {
      k = n > 5 ? -1 : n; paint(); api.sfx(k < 0 ? 'swoosh' : 'click');
      if (k === 5) api.award(5, { from: from || bNext, key: 'demo:dsg-lens' });
    };
    bNext.addEventListener('click', () => go(k >= 5 ? 6 : k + 1, bNext));
    bBack.addEventListener('click', () => go(Math.max(-1, k - 1), bBack));
    el.querySelectorAll('.dsg-lens__mk').forEach(g => {
      const jump = () => go(+g.dataset.k, g);
      g.addEventListener('click', jump);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(); } });
    });
    paint();
  };
}

/* =====================================================================================================
   DEMO 2 — reading figure 1-1: pick a family of columns, tap a cell, read the symbol
   ===================================================================================================== */
const ROW_SUM = {
  0: { ar: 'الحديدي: كل الخانات <en>All Processes</en>. الصف الوحيد في الجدول اللي كده.', en: 'Ferrous: every cell is <b>All Processes</b>. The only row like that.' },
  1: { ar: 'غير الحديدي: كله <en>All</en>، ماعدا <en>Flame/Laser</en> = <en>Most</en>.', en: 'Nonferrous: all <b>All</b>, except Flame/Laser = <b>Most</b>.' },
  2: { ar: 'الـ <en>Thermoset</en>: <en>Liquid State</en> آه. <en>Plastic</en> و<en>Solid State</en> لأ. <en>Solder/Braze</en> و<en>Weld</en> لأ. اللزق والربط الميكانيكي آه.', en: 'Thermoset: Liquid State yes. Plastic and Solid State no. Solder/Braze and Weld no. Adhesive and Mechanical yes.' },
  3: { ar: 'الـ <en>Thermoplastics</en>: <en>Liquid</en> و<en>Plastic State</en> آه. <en>Weld</en> آه. <en>Solder/Braze</en> لأ.', en: 'Thermoplastics: Liquid and Plastic State yes. Weld yes. Solder/Braze no.' },
  11: { ar: 'الخشب: <en>Weld</en> و<en>Solder/Braze</en> لأ. اللزق <en>Adhesive</en> والربط <en>Mechanical</en> آه.', en: 'Wood products: Weld and Solder/Braze no. Adhesive and Mechanical yes.' }
};
export function matrixDemo(lang) {
  const en = lang === 'en';
  const W = en ? { all: 'All 14', pick: 'Tap a circle (or a row name) to read it.', key: 'the rows the exam likes', group: 'Material' }
    : { all: 'الـ ١٤', pick: 'اضغط على أي دايرة (أو اسم صف) عشان تقراها.', key: 'الصفوف اللي الامتحان بيحبها', group: 'الخامة' };
  const rich = s => s.replace(/<en>([\s\S]*?)<\/en>/g, '<bdi class="en" dir="ltr">$1</bdi>');
  const COLS = FAMILIES.flatMap((f, fi) => f.br.map(b => ({ ...b, fi, fam: f.en })));
  return function mount(el, api) {
    let fam = 0, seen = new Set(), rIdx = 0, cIdx = 0;
    el.innerHTML = `<div class="dsg-mx">
      <div class="dsg-seg" role="tablist" aria-label="${en ? 'Columns' : 'العواميد'}">${FAMILIES.map((f, i) => `<button type="button" role="tab" data-f="${i}" aria-selected="${i === 0}">${f.en}</button>`).join('')}<button type="button" role="tab" data-f="4" aria-selected="false">${W.all}</button></div>
      <div class="dsg-mx__wrap"><table class="dsg-mx__t" dir="ltr"></table></div>
      <p class="dsg-mx__legend" dir="ltr">${[3, 2, 1, 0].map(v => `<span>${sym(v)}${MX_LEGEND[v].en}</span>`).join('')}<span class="dsg-mx__keyhint"><i></i>${W.key}</span></p>
      <div class="dsg-mx__read" aria-live="polite"><p>${W.pick}</p></div>
    </div>`;
    const table = el.querySelector('.dsg-mx__t'), read = el.querySelector('.dsg-mx__read');
    const cols = () => COLS.map((c, i) => ({ ...c, i })).filter(c => fam === 4 || c.fi === fam);
    const draw = () => {
      const cs = cols();
      table.className = 'dsg-mx__t' + (fam === 4 ? ' is-all' : '');
      let lastG = '';
      table.innerHTML = `<thead><tr><th scope="col" class="dsg-mx__corner">${W.group}</th>${cs.map(c => `<th scope="col"><span>${c.en}</span></th>`).join('')}</tr></thead>
        <tbody>${MX_ROWS.map((r, ri) => { const g = r.g !== lastG ? (lastG = r.g) : ''; return `<tr class="${r.key ? 'is-key' : ''}${g ? ' is-g' : ''}"><th scope="row"><button type="button" class="dsg-mx__rh" data-r="${ri}">${g ? `<small>${g}</small>` : ''}${r.en}</button></th>${cs.map(c => { const v = +r.v[c.i]; return `<td><button type="button" class="dsg-mx__c" data-r="${ri}" data-c="${c.i}" tabindex="-1" aria-label="${r.g} ${r.en} × ${c.en}: ${MX_LEGEND[v].en}">${sym(v)}</button></td>`; }).join('')}</tr>`; }).join('')}</tbody>`;
      const first = table.querySelector(`.dsg-mx__c[data-r="${rIdx}"][data-c="${cs.some(c => c.i === cIdx) ? cIdx : cs[0].i}"]`) || table.querySelector('.dsg-mx__c');
      if (first) first.tabIndex = 0;
    };
    const say = (ri, ci) => {
      const r = MX_ROWS[ri], c = COLS[ci], v = +r.v[ci];
      table.querySelectorAll('.is-hit').forEach(x => x.classList.remove('is-hit'));
      table.querySelector(`.dsg-mx__c[data-r="${ri}"][data-c="${ci}"]`)?.closest('td').classList.add('is-hit');
      read.innerHTML = `<p class="dsg-mx__ans" dir="ltr">${sym(v, 'is-big')}<span><b>${r.g} · ${r.en}</b> × <b>${c.en}</b> → <em>${MX_LEGEND[v].en}</em></span></p>${en ? '' : `<p class="dsg-mx__ar">${MX_LEGEND[v].ar}: ${r.ar} × ${c.ar}.</p>`}${ROW_SUM[ri] ? `<p class="dsg-mx__sum">${rich(en ? ROW_SUM[ri].en : ROW_SUM[ri].ar)}</p>` : ''}`;
      seen.add(ri); api.sfx('click');
      if (seen.size >= 4) api.award(5, { from: read, key: 'demo:dsg-matrix' });
    };
    el.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
      fam = +b.dataset.f; el.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
      draw(); api.sfx('click');
    }));
    table.addEventListener('click', e => {
      const c = e.target.closest('.dsg-mx__c'); const h = e.target.closest('.dsg-mx__rh');
      if (c) { rIdx = +c.dataset.r; cIdx = +c.dataset.c; say(rIdx, cIdx); }
      else if (h) { rIdx = +h.dataset.r; const cs = cols(); say(rIdx, cs.some(x => x.i === cIdx) ? cIdx : cs[0].i); }
    });
    // arrow keys move between cells (one cell in the tab order at a time)
    table.addEventListener('keydown', e => {
      const c = e.target.closest('.dsg-mx__c'); if (!c) return;
      const cs = cols().map(x => x.i); let r = +c.dataset.r, ci = cs.indexOf(+c.dataset.c);
      const mv = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (!mv) return;
      e.preventDefault(); r = Math.max(0, Math.min(MX_ROWS.length - 1, r + mv[0])); ci = Math.max(0, Math.min(cs.length - 1, ci + mv[1]));
      const nx = table.querySelector(`.dsg-mx__c[data-r="${r}"][data-c="${cs[ci]}"]`); if (!nx) return;
      c.tabIndex = -1; nx.tabIndex = 0; nx.focus(); rIdx = r; cIdx = cs[ci]; say(r, cs[ci]);
    });
    draw();
  };
}
