// node qa/shoot.js '{"file":"dev-shape.html","w":1440,"h":900,"hash":"/dev/learn","steps":[...],"prefix":"x","mobile":false}'
// steps: {click|tap|mouse:[x,y]|move:[x,y]|press|type|eval, wait, shot:'name', full:true}
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { installRoutes } = require('./fonts');
const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(process.argv[2] || '{}');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: cfg.w || 1440, height: cfg.h || 900 }, deviceScaleFactor: cfg.dpr || 1, isMobile: !!cfg.mobile, hasTouch: !!cfg.mobile, reducedMotion: cfg.reduced ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' || (cfg.warn && m.type() === 'warning')) errs.push(m.type() + ': ' + m.text()); if (cfg.log && m.type() === 'log') console.log('log:', m.text()); });
  await installRoutes(p);
  if (cfg.storage) await p.addInitScript(s => { try { for (const k in s) localStorage.setItem(k, s[k]); } catch (e) {} }, cfg.storage);
  await p.goto('file://' + path.join(ROOT, 'dist', cfg.file || 'index.html') + (cfg.query ? '?' + cfg.query : '') + (cfg.hash ? '#' + cfg.hash : ''));
  await p.waitForTimeout(cfg.settle || 2000);
  let n = 0;
  for (const s of (cfg.steps || [])) {
    try {
      if (s.click) await p.click(s.click, { timeout: 4000, force: !!s.force });
      if (s.tap) await p.tap(s.tap, { timeout: 4000 });
      if (s.mouse) await p.mouse.click(s.mouse[0], s.mouse[1]);
      if (s.move) await p.mouse.move(s.move[0], s.move[1], { steps: 8 });
      if (s.press) await p.keyboard.press(s.press);
      if (s.type) await p.keyboard.type(s.type);
      if (s.eval) { const r = await p.evaluate(s.eval); if (r !== undefined) console.log('eval:', typeof r === 'string' ? r : JSON.stringify(r)); }
    } catch (e) { errs.push('step failed: ' + JSON.stringify(s).slice(0, 120) + ' :: ' + e.message.split('\n')[0]); }
    if (s.wait) await p.waitForTimeout(s.wait);
    if (s.shot) { const f = path.join(ROOT, 'shots', `${cfg.prefix || 'shot'}-${s.shot}.png`); await p.screenshot({ path: f, fullPage: !!s.full }); console.log('shot', f); }
  }
  if (!(cfg.steps || []).some(s => s.shot)) { const f = path.join(ROOT, 'shots', `${cfg.prefix || 'shot'}.png`); await p.screenshot({ path: f }); console.log('shot', f); }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (ov > 0) console.log('HORIZONTAL OVERFLOW', ov);
  console.log(errs.length ? 'CONSOLE:\n' + errs.join('\n') : 'console clean');
  await b.close();
})();
