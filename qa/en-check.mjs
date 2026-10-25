// English edition parity: every <zone>.en.js lesson/trial file mirrors its Arabic twin (same chapters, scenes,
// block order, quick checks, figures, demos, trial ids) and carries no Arabic text outside comments.
// node qa/en-check.mjs [zone…]
import fs from 'node:fs';
const root = new URL('../src/js/', import.meta.url);
globalThis.document = globalThis.document || { createElement: () => ({ getContext: () => null, style: {} }), documentElement: { style: { setProperty() { } }, dataset: {}, lang: 'en' }, fonts: { load: () => Promise.resolve() } };
globalThis.matchMedia = globalThis.matchMedia || (() => ({ matches: false }));
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem() { }, removeItem() { } };
globalThis.window = globalThis.window || globalThis; window.addEventListener = () => { };

const ZONES = process.argv.slice(2).length ? process.argv.slice(2) : ['design', 'materials', 'strength', 'props', 'iron', 'bend', 'compound', 'cut'];
const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
let errors = 0, warns = 0, pending = 0;
const err = m => { errors++; console.log('  ✗ ' + m); }, warn = m => { warns++; console.log('  ! ' + m); };

/** Arabic letters left in the source, outside comments (an English page should not need any) */
function arabicLines(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  return src.split('\n').map((l, i) => [i + 1, l.replace(/(^|[^:'"`])\/\/.*$/, '$1')]).filter(([, l]) => AR.test(l));
}
const sig = b => [b.t, b.q || '', b.id || '', b.t === 'demo' ? 'demo' : ''].join(':');

for (const z of ZONES) {
  console.log(`\n${z}`);
  for (const kind of ['content/lessons', 'games']) {
    const arF = new URL(`${kind}/${z}.js`, root), enF = new URL(`${kind}/${z}.en.js`, root);
    if (!fs.existsSync(enF)) { err(`${kind}/${z}.en.js missing`); continue; }
    const enSrc = fs.readFileSync(enF, 'utf8');
    if (/export \{ default \} from '\.\/[a-z]+\.js'/.test(enSrc) && enSrc.length < 400) { pending++; console.log(`  … ${kind}/${z}.en.js is still the placeholder`); continue; }
    let A, E;
    try { A = (await import(arF)).default; } catch (e) { err(`${kind}/${z}.js import failed — ${e.message}`); continue; }
    try { E = (await import(enF)).default; } catch (e) { err(`${kind}/${z}.en.js import failed — ${e.message}`); continue; }
    if (kind === 'games') {
      const a = (A || []).map(g => g.id), e = (E || []).map(g => g.id);
      if (a.join() !== e.join()) err(`trials differ: ar [${a}] en [${e}]`); else console.log(`  trials ✓ ${e.length}`);
      for (const g of E || []) { if (!g.title || AR.test(g.title)) err(`trial ${g.id}: title "${g.title}"`); if (typeof g.mount !== 'function') err(`trial ${g.id}: no mount()`); }
    } else {
      const ca = A.chapters || [], ce = E.chapters || [];
      if (ca.length !== ce.length) err(`chapters: ar ${ca.length} en ${ce.length}`);
      let same = 0;
      ca.forEach((c, i) => {
        const d = ce[i]; if (!d) return;
        if (c.id !== d.id) err(`chapter ${i}: id ${c.id} → ${d.id}`);
        if ((c.scene || '') !== (d.scene || '')) err(`${c.id}: scene ${c.scene} → ${d.scene}`);
        const sa = (c.blocks || []).map(sig), se = (d.blocks || []).map(sig);
        if (sa.join('|') !== se.join('|')) warn(`${c.id}: block sequence differs\n      ar ${sa.join(' ')}\n      en ${se.join(' ')}`); else same++;
        if (AR.test(d.title || '')) err(`${d.id}: Arabic in the title`);
      });
      console.log(`  chapters ✓ ${same}/${ca.length} identical block order`);
      for (const k of ['title', 'sub', 'blurb', 'kicker']) if (E[k] && AR.test(E[k])) err(`lesson ${k} has Arabic`);
    }
    const left = arabicLines(enF);
    if (left.length) warn(`${kind}/${z}.en.js: Arabic on ${left.length} line(s): ${left.slice(0, 6).map(([n, l]) => n + ' «' + (l.match(/[؀-ۿ][؀-ۿ\s،.؟]*/) || [''])[0].trim().slice(0, 28) + '»').join(', ')}`);
  }
}
console.log(`\n${errors} error(s), ${warns} warning(s), ${pending} placeholder(s) waiting`);
process.exit(errors ? 1 : 0);
