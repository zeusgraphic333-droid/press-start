// The release matrix: 2 languages × 2 experiences × desktop/phone, through the main routes.
// node qa/matrix.js [file=index.html] [only=ar-il-d,en-im-m…]
// → shots/matrix/<combo>-<route>.png + shots/matrix/_<combo>.png (strip), console errors and sideways overflow per page.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { installRoutes } = require('./fonts');
const ROOT = path.join(__dirname, '..');
const file = process.argv[2] || 'index.html';
const only = (process.argv[3] || '').split(',').filter(Boolean);
const PH = (process.argv[4] || '390x844').split('x').map(Number); // phone viewport (visible area)
const OUT = path.join(ROOT, 'shots', 'matrix');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = [
  ['hub', '/', 0],
  ['learn', '/z/mind/learn', 0],
  ['learn2', '/z/gestalt/learn', 1600],
  ['play', '/z/color/play', 0],
  ['quiz', '/z/space/quiz', 0],
  ['boss', '/boss', 0],
  ['archive', '/archive', 0],
];
const COMBOS = [];
for (const lang of ['ar', 'en']) for (const mode of ['illustrated', 'immersive']) for (const dev of ['d', 'm'])
  COMBOS.push({ id: `${lang}-${mode === 'illustrated' ? 'il' : 'im'}-${dev}`, lang, mode, dev });

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const report = [];
  for (const c of COMBOS.filter(c => !only.length || only.includes(c.id))) {
    const phone = c.dev === 'm';
    const ctx = await b.newContext({ viewport: phone ? { width: PH[0], height: PH[1] } : { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await installRoutes(p);
    const save = JSON.stringify({ name: 'Omar', sigil: 'eye', xp: 120, settings: { sound: false, lang: c.lang, mode: c.mode } });
    await p.addInitScript(s => { try { localStorage.setItem('mindgames.save.v1', s); } catch (e) { } }, save);
    await p.goto('file://' + path.join(ROOT, 'dist', file) + '?skipintro&hq');
    await p.waitForTimeout(c.mode === 'immersive' ? 9000 : 3500);
    const shots = [];
    for (const [name, hash, scroll] of ROUTES) {
      await p.evaluate(h => { location.hash = h; }, hash);
      await p.waitForTimeout(c.mode === 'immersive' ? 4500 : 2500);
      if (scroll) { await p.evaluate(y => { const b = document.querySelector('.screen__body'); if (b) b.scrollTop = y; }, scroll); await p.waitForTimeout(1200); }
      const info = await p.evaluate(() => {
        const de = document.documentElement;
        const ar = /[؀-ۿ]/;
        // visible Arabic text on an English page (outside quotes that are verbatim slide text)
        let stray = [];
        if (de.lang === 'en') {
          const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) {
            const n = w.currentNode, t = n.nodeValue.trim();
            if (!t || !ar.test(t)) continue;
            const el = n.parentElement; if (!el || el.closest('[lang="ar"], .blk-quote, script, style, [hidden], [aria-hidden="true"]')) continue;
            const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
            const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
            stray.push(t.slice(0, 40));
          }
        }
        return { over: de.scrollWidth - de.clientWidth, lang: de.lang, dir: de.dir, mode: de.dataset.mode, stray: [...new Set(stray)].slice(0, 8) };
      });
      const f = path.join(OUT, `${c.id}-${name}.png`);
      await p.screenshot({ path: f });
      shots.push(f);
      report.push(`${c.id} ${name}: ${info.lang}/${info.dir}/${info.mode}${info.over > 0 ? ' OVERFLOW ' + info.over : ''}${info.stray.length ? ' ARABIC: ' + info.stray.join(' | ') : ''}`);
    }
    report.push(`${c.id} console: ${errs.length ? errs.slice(0, 6).join(' || ') : 'clean'}`);
    await ctx.close();
    console.log(report.slice(-ROUTES.length - 1).join('\n'));
  }
  fs.writeFileSync(path.join(OUT, '_report.txt'), report.join('\n'));
  await b.close();
})();
