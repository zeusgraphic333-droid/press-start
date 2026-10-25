// Click every control in the hub's top bar (both experiences) and report what each one did.
const { chromium } = require('playwright');
const path = require('path');
const { installRoutes } = require('./fonts');
const file = process.argv[2] || 'dev-me.html';
const [W, H] = (process.argv[3] || '390x664').split('x').map(Number);
const modes = (process.argv[4] || 'illustrated,immersive').split(',');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const mode of modes) {
    const phone = W < 800;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await installRoutes(p);
    const save = JSON.stringify({ name: 'Omar', sigil: 'eye', xp: 120, settings: { sound: false, lang: 'en', mode } });
    await p.addInitScript(s => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mindgames.save.v1', s); sessionStorage.setItem('seeded', '1'); } } catch (e) { } }, save);
    await p.goto('file://' + path.join(__dirname, '..', 'dist', file) + '?skipintro&hq');
    await p.waitForTimeout(mode === 'immersive' ? 9000 : 3500);
    const sel = mode === 'illustrated' ? '.h2-top a, .h2-top button' : '.hud__top a, .hud__top button';
    const n = await p.$$eval(sel, els => els.length);
    console.log(`\n== ${mode} ${W}x${H}: ${n} controls`);
    for (let i = 0; i < n; i++) {
      const before = await p.evaluate(() => ({ hash: location.hash, lang: document.documentElement.lang, mode: document.documentElement.dataset.mode, sound: JSON.parse(localStorage.getItem('mindgames.save.v1') || '{}').settings?.sound, modal: !!document.querySelector('.modal, .sheet, [role=dialog]'), screen: document.querySelector('[data-screen]')?.dataset.screen || '' }));
      const info = await p.evaluate(([s, i]) => { const el = document.querySelectorAll(s)[i]; if (!el) return null; const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { label: (el.getAttribute('aria-label') || el.title || el.textContent || '').trim().slice(0, 30), cls: el.className.toString().slice(0, 40), href: el.getAttribute('href'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth, covered: hit && !el.contains(hit) ? (hit.className?.toString() || hit.tagName).slice(0, 40) : '' }; }, [sel, i]);
      if (!info) continue;
      let clicked = 'ok';
      try { await p.click(`:is(${sel}) >> nth=${i}`, { timeout: 2500 }); } catch (e) { clicked = 'CLICK FAILED: ' + e.message.split('\n')[0].slice(0, 80); }
      await p.waitForTimeout(mode === 'immersive' ? 3500 : 1500);
      const after = await p.evaluate(() => ({ hash: location.hash, lang: document.documentElement.lang, mode: document.documentElement.dataset.mode, sound: JSON.parse(localStorage.getItem('mindgames.save.v1') || '{}').settings?.sound, modal: !!document.querySelector('.modal, .sheet, [role=dialog]'), screen: document.querySelector('[data-screen]')?.dataset.screen || '' }));
      const diff = Object.keys(after).filter(k => JSON.stringify(after[k]) !== JSON.stringify(before[k])).map(k => `${k}: ${before[k]}→${after[k]}`).join(', ');
      console.log(`${i} [${info.label}] .${info.cls} ${info.w}x${info.h}@${info.x},${info.y}${info.visible ? '' : ' OFFSCREEN'}${info.covered ? ' COVERED by ' + info.covered : ''} → ${clicked} ${diff || 'NO EFFECT'}`);
      // restore: back to the hub in the original language/experience
      await p.evaluate(m => { try { const s = JSON.parse(localStorage.getItem('mindgames.save.v1')); s.settings.lang = 'en'; s.settings.mode = m; localStorage.setItem('mindgames.save.v1', JSON.stringify(s)); } catch (e) { } }, mode);
      if (diff) { await p.goto('file://' + path.join(__dirname, '..', 'dist', file) + '?skipintro&hq#/'); await p.waitForTimeout(mode === 'immersive' ? 9000 : 3500); }
    }
    console.log('errors:', errs.length ? errs.slice(0, 5).join(' | ') : 'none');
    await ctx.close();
  }
  await b.close();
})();
