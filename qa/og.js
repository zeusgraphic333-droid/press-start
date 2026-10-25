// Renders dist/og.png (1200×630) from the live eye.
const { chromium } = require('playwright');
const { installRoutes } = require('./fonts');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
  await installRoutes(p);
  await p.addInitScript(() => { try { localStorage.setItem('mindgames.save.v1', JSON.stringify({ v: 2, name: 'OG', sigil: 'circle' })); } catch (e) { } });
  await p.goto('file://' + __dirname + '/../dist/index.html?skipintro&hq');
  await p.waitForTimeout(9000);
  await p.evaluate(() => {
    document.getElementById('hud').style.display = 'none';
    document.querySelectorAll('.cur').forEach(c => c.remove());
    __mg.hub.hide(); const w = __mg.world; w.ring.material.uniforms.uO.value = 0; w.ring.visible = false; w.set('eye'); w.setStage({ cx: .31, cy: .5, z: 11 }, 0);
    const o = document.createElement('div');
    o.innerHTML = `<div style="position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;justify-content:center;padding:0 70px;direction:rtl;pointer-events:none">
      <p style="font:600 22px/1 Handjet;letter-spacing:.1em;color:#8B7BFF;margin:0 0 18px;direction:ltr;text-align:right">MIND GAMES · MDP001</p>
      <h1 style="font:900 104px/1 Alexandria;color:#EDEBE6;margin:0;letter-spacing:-.02em">عقلك<br>بيشتغلك.</h1>
      <p style="font:400 22px/1.5 'IBM Plex Sans Arabic';color:#B6B3C0;margin:22px 0 0">Graphic Fundamentals · Lecture 02 + 03</p></div>`;
    document.body.appendChild(o);
  });
  await p.waitForTimeout(5000);
  await p.screenshot({ path: __dirname + '/../dist/og.png' });
  await b.close();
  require('child_process').execSync(`python3 -c "from PIL import Image; Image.open('${__dirname}/../dist/og.png').convert('RGB').save('${__dirname}/../dist/og.jpg', quality=86, optimize=True, progressive=True)" && rm '${__dirname}/../dist/og.png'`);
  console.log('og.jpg written');
})();
