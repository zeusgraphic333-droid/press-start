// End-to-end flows across the site: the exam (menu, fight, portal), the archive, a zone quiz answered from the
// keyboard, a trial, in both experiences and languages, desktop and phone. Screenshots go to shots/flow-*.png.
// node qa/flows.js [filter]   (filter: a substring of the scenario names, e.g. "phone" or "boss")
const { chromium } = require('playwright');
const path = require('path');
const { installRoutes } = require('./fonts');
const ROOT = path.join(__dirname, '..');
const only = process.argv[2] || '';
const save = (lang, mode) => JSON.stringify({ v: 1, name: 'QA', sigil: 'gear', settings: { lang, mode, sound: false, motion: 'auto' } });

const SCENARIOS = [];
for (const mode of ['illustrated', 'immersive']) for (const lang of ['ar', 'en']) for (const dev of ['desk', 'phone']) {
  const tag = `${mode === 'illustrated' ? '2d' : '3d'}-${lang}-${dev}`;
  SCENARIOS.push({ name: `boss-menu-${tag}`, mode, lang, dev, hash: '/boss', settle: 4000 });
  SCENARIOS.push({ name: `archive-${tag}`, mode, lang, dev, hash: '/archive', settle: 3500 });
  SCENARIOS.push({ name: `quiz-${tag}`, mode, lang, dev, hash: '/z/cut/quiz', settle: 3500, steps: [
    { click: '.qstart__go', wait: 1500 },
    { press: 'b', wait: 900, check: () => !!document.querySelector('.qc[data-state="right"], .qc[data-state="wrong"]') }
  ] });
  if (dev === 'desk' || lang === 'ar') SCENARIOS.push({ name: `portal-${tag}`, mode, lang, dev, hash: '/boss/portal', settle: 3500, steps: [
    { press: 'c', wait: 700, check: () => !!document.querySelector('.portal .opt.is-picked') }
  ] });
  if (dev === 'desk') SCENARIOS.push({ name: `trial-${tag}`, mode, lang, dev, hash: '/z/compound/play', settle: 3500, steps: [
    { click: '.gamecard', wait: 2000 }
  ] });
}

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  let bad = 0;
  for (const s of SCENARIOS.filter(x => x.name.includes(only))) {
    const phone = s.dev === 'phone';
    const ctx = await b.newContext({ viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await installRoutes(p);
    await p.addInitScript(v => { try { localStorage.setItem('pressstart.save.v1', v); } catch (e) { } }, save(s.lang, s.mode));
    await p.goto('file://' + path.join(ROOT, 'dist', 'index.html') + '?skipintro#' + s.hash);
    await p.waitForTimeout(s.settle);
    const notes = [];
    for (const st of s.steps || []) {
      try {
        if (st.click) await p.click(st.click, { timeout: 4000 });
        if (st.press) await p.keyboard.press(st.press);
      } catch (e) { notes.push('step failed: ' + (st.click || st.press) + ' :: ' + e.message.split('\n')[0]); }
      if (st.wait) await p.waitForTimeout(st.wait);
      if (st.check && !(await p.evaluate(st.check))) notes.push('check failed after ' + (st.click || st.press));
    }
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ov > 0) notes.push('horizontal overflow ' + ov + 'px');
    await p.screenshot({ path: path.join(ROOT, 'shots', `flow-${s.name}.png`) });
    const ok = !errs.length && !notes.length; if (!ok) bad++;
    console.log(`${ok ? '✓' : '✗'} ${s.name}${notes.length ? '  ' + notes.join(' · ') : ''}${errs.length ? '\n    ' + errs.slice(0, 4).join('\n    ') : ''}`);
    await ctx.close();
  }
  await b.close();
  console.log(bad ? `${bad} scenario(s) with problems` : 'all flows clean');
})();
