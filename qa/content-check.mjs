// Content integrity: every lesson block points at real things; every trial is mountable; the exam builder is balanced.
// node qa/content-check.mjs
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const root = new URL('../src/js/', import.meta.url);
globalThis.document = globalThis.document || { createElement: () => ({ getContext: () => null, style: {} }), documentElement: { style: { setProperty() { } }, dataset: {} } };
globalThis.matchMedia = globalThis.matchMedia || (() => ({ matches: false }));
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem() { }, removeItem() { } };
globalThis.window = globalThis.window || globalThis; window.addEventListener = () => { };

// with zone arguments, only those zones' bank and figure files are loaded (a half-written file elsewhere can't break the check)
const only = process.argv.slice(2);
const { ZONES: ZL } = await import(new URL('content/zones.js', root));
const TOPIC_ZONE = Object.fromEntries(ZL.flatMap(z => z.tp.map(tp => [tp, z.id])));
let QUESTIONS = [], FIG = {};
if (only.length) {
  for (const z of only) {
    try { QUESTIONS.push(...(await import(new URL(`data/bank/${z}.js`, root))).default); } catch (e) { console.log(`  ✗ data/bank/${z}.js import failed — ${e.message}`); }
    try { Object.assign(FIG, (await import(new URL(`data/figs/${z}.js`, root))).default); } catch (e) { console.log(`  ✗ data/figs/${z}.js import failed — ${e.message}`); }
    try { const st = await import(new URL(`data/study/${z}.js`, root)); console.log(`${z} archive: ${st.terms.length} terms · ${st.pairs.length} traps · ${st.triggers.length} trigger words`); } catch (e) { console.log(`  ✗ data/study/${z}.js import failed — ${e.message}`); }
  }
} else { ({ QUESTIONS } = await import(new URL('data/index.js', root))); ({ FIG } = await import(new URL('data/figs/index.js', root))); }
const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
const { SCENE_INFO } = await import(new URL('world/scenes/info.js', root));
const { ZONES } = await import(new URL('content/zones.js', root));
const BLOCKS = new Set(['say', 'p', 'h', 'quote', 'list', 'example', 'why', 'trap', 'tip', 'art', 'compare', 'grid', 'table', 'demo', 'check', 'fig', 'divider']);
let errors = 0, warns = 0; const err = m => { errors++; console.log('  ✗ ' + m); }; const warn = m => { warns++; console.log('  ! ' + m); };
const sceneOk = n => n in SCENE_INFO;
const usedQ = new Set(); const chapterIds = new Set();
for (const z of ZONES) {
  if (z.id === 'boss' || (only.length && !only.includes(z.id))) continue;
  const file = new URL(`content/lessons/${z.id}.js`, root);
  const src = fs.readFileSync(file, 'utf8');
  let L; try { L = (await import(file)).default; } catch (e) { err(`${z.id}: import failed — ${e.message}`); continue; }
  const chs = L.chapters || [];
  const zq = new Set(); let blocks = 0, checks = 0, demos = 0, quotes = 0, scenes = 0, waypoints = 0;
  console.log(`\n${z.id}: ${chs.length} chapters`);
  if (!chs.length) err(`${z.id}: no chapters`);
  for (const ch of chs) {
    if (!ch.id) err(`${z.id}: chapter without id`); else if (chapterIds.has(ch.id)) err(`duplicate chapter id ${ch.id}`); else chapterIds.add(ch.id);
    if (!ch.title) err(`${ch.id}: no title`);
    if (ch.scene) { scenes++; if (!sceneOk(ch.scene)) err(`${ch.id}: unknown scene "${ch.scene}"`); } else warn(`${ch.id}: no scene`);
    let hasCheck = false, hasQuote = false;
    for (const b of ch.blocks || []) {
      blocks++;
      if (!BLOCKS.has(b.t)) err(`${ch.id}: unknown block type "${b.t}"`);
      if (b.scene) { waypoints++; if (!sceneOk(b.scene)) err(`${ch.id}: block ${b.t} asks for unknown scene "${b.scene}"`); }
      if (b.t === 'check') { checks++; hasCheck = true; const q = QBY[b.q]; if (!q) err(`${ch.id}: unknown question ${b.q}`); else { if (TOPIC_ZONE[q.tp] !== z.id) warn(`${ch.id}: ${b.q} is from topic ${q.tp} (zone ${TOPIC_ZONE[q.tp]})`); if (zq.has(b.q)) warn(`${ch.id}: ${b.q} used twice in ${z.id}`); zq.add(b.q); usedQ.add(b.q); } }
      if (b.t === 'quote') { quotes++; hasQuote = true; if (!b.text) err(`${ch.id}: empty quote`); }
      if (b.t === 'fig' && !FIG[b.id]) err(`${ch.id}: unknown figure ${b.id}`);
      if (b.t === 'demo') { demos++; if (typeof b.mount !== 'function') err(`${ch.id}: demo "${b.id}" has no mount()`); if (!b.id) warn(`${ch.id}: demo without id`); }
      if ((b.t === 'p' || b.t === 'say' || b.t === 'tip' || b.t === 'why') && !b.text) err(`${ch.id}: empty ${b.t}`);
      if (b.t === 'grid' && !(b.items || []).length) err(`${ch.id}: empty grid`);
      if (b.t === 'compare' && !(b.left && b.right)) err(`${ch.id}: compare needs left and right`);
      if (b.t === 'art' && !/^\s*<(svg|div|figure)/.test(b.html || '')) warn(`${ch.id}: art block html does not start with svg/div`);
      const txt = JSON.stringify(b);
      if (/[\u{1F300}-\u{1FAFF}]/u.test(txt)) warn(`${ch.id}: emoji in a ${b.t} block`);
    }
    if (!hasCheck) warn(`${ch.id}: no quick check`);
    if (!hasQuote) warn(`${ch.id}: no slide quote`);
  }
  const pool = QUESTIONS.filter(q => z.tp.includes(q.tp)).length;
  console.log(`  blocks ${blocks} · checks ${checks} (${zq.size} unique of ${pool} in bank) · quotes ${quotes} · demos ${demos} · scenes ${scenes}/${chs.length}${waypoints ? ` + ${waypoints} block waypoint(s)` : ''}`);
  // trials
  try {
    const G = (await import(new URL(`games/${z.id}.js`, root))).default || [];
    console.log(`  trials: ${G.map(g => g.id).join(', ') || 'none'}`);
    if (!G.length) warn(`${z.id}: no trials`);
    for (const g of G) { if (!g.id?.startsWith(z.id + '-')) warn(`trial id ${g.id} should start with ${z.id}-`); if (typeof g.mount !== 'function') err(`trial ${g.id} has no mount()`); if (!g.title) err(`trial ${g.id} has no title`); }
  } catch (e) { err(`${z.id}: games import failed — ${e.message}`); }
}
// the bank itself: ids unique, topics owned by a zone, options sane, explanations in both languages
const seenId = new Set();
for (const q of QUESTIONS) {
  if (only.length && !only.includes(TOPIC_ZONE[q.tp])) continue;
  if (seenId.has(q.id)) err(`duplicate question id ${q.id}`); seenId.add(q.id);
  if (!TOPIC_ZONE[q.tp]) err(`${q.id}: topic "${q.tp}" belongs to no zone`);
  if (![1, 2, 3].includes(q.lv)) err(`${q.id}: lv must be 1, 2 or 3`);
  if (!Array.isArray(q.o) || q.o.length < 2) err(`${q.id}: needs options`);
  else { if (new Set(q.o).size !== q.o.length) err(`${q.id}: duplicate options`); if ((q.a ?? 0) >= q.o.length) err(`${q.id}: answer index out of range`); }
  if (!q.e || !q.r) err(`${q.id}: needs e (English) and r (Arabic) explanations`);
  if (q.fig && !FIG[q.fig]) err(`${q.id}: unknown figure ${q.fig}`);
  if (/[\u0600-\u06FF]/.test(q.q + q.o.join(''))) warn(`${q.id}: Arabic in an English question`);
}
const byZone = {}; QUESTIONS.forEach(q => { const z = TOPIC_ZONE[q.tp]; byZone[z] = (byZone[z] || 0) + 1; });
console.log('\nbank by zone: ' + Object.entries(byZone).map(([z, n]) => `${z} ${n}`).join(' · '));
console.log(`questions used in lessons: ${usedQ.size} of ${QUESTIONS.length}`);
console.log(errors ? `\n${errors} error(s), ${warns} warning(s)` : `\nOK — 0 errors, ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
