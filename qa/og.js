// Renders dist/og.jpg (1200×630): the particle press at work beside the title, glowing in temper colours.
const { chromium } = require('playwright');
const { installRoutes } = require('./fonts');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
  await installRoutes(p);
  await p.addInitScript(() => { try { localStorage.setItem('pressstart.save.v1', JSON.stringify({ v: 1, name: 'OG', sigil: 'gear', settings: { lang: 'ar', mode: 'immersive', sound: false, motion: 'auto' } })); } catch (e) { } });
  await p.goto('file://' + __dirname + '/../dist/index.html?skipintro&hq&lang=ar&mode=immersive');
  await p.waitForTimeout(9000);
  await p.evaluate(() => {
    document.getElementById('hud').style.display = 'none';
    document.querySelectorAll('.cur').forEach(c => c.remove());
    __mg.hub.hide(); const w = __mg.world; w.ring.material.uniforms.uO.value = 0; w.ring.visible = false; w.set('monolith'); w.setStage({ cx: .27, cy: .52, z: 11.5 }, 0);
    const T = 'linear-gradient(270deg, #F6EBC0, #E8C368 22%, #E39B3C 40%, #C97A43 55%, #B9668A 68%, #9468D2 80%, #4F7FE6 92%, #86BDF0)';
    const o = document.createElement('div');
    o.innerHTML = `<div style="position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 76px;direction:rtl;pointer-events:none">
      <p style="font:800 26px/1 'Big Shoulders Stencil Display';letter-spacing:.12em;color:#E39B3C;margin:0 0 14px;direction:ltr">PRESS START</p>
      <h1 style="font:800 128px/1.02 Changa;margin:0;background:${T};-webkit-background-clip:text;background-clip:text;color:transparent">شدّ<br>حيلك.</h1>
      <p style="font:400 23px/1.5 'Readex Pro';color:#B3B6BA;margin:20px 0 0;direction:ltr">Production Engineering · Lectures 1–5</p></div>`;
    document.body.appendChild(o);
  });
  await p.waitForTimeout(5000);
  await p.screenshot({ path: __dirname + '/../dist/og.png' });
  await b.close();
  require('child_process').execSync(`python3 -c "from PIL import Image; Image.open('${__dirname}/../dist/og.png').convert('RGB').save('${__dirname}/../dist/og.jpg', quality=86, optimize=True, progressive=True)" && rm '${__dirname}/../dist/og.png'`);
  console.log('og.jpg written');
})();
