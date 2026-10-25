// Contact sheet of particle scenes: node qa/scenes3d.js <zone|name,name,…> [--lesson] [--w 900 --h 600]
//   needs dist/dev-scenes3d.html (node build.mjs --dev --scenes3d). Writes shots/s3d-<label>.png (a grid) and one PNG per scene
//   in shots/s3d/. --lesson frames each scene where a lesson shows it (beside the text) instead of centred.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { installRoutes } = require('./fonts');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const what = args.find(a => !a.startsWith('--') && !/^\d+$/.test(a)) || 'special';
const W = +opt('w', 900), H = +opt('h', 600), lesson = args.includes('--lesson');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  await installRoutes(p);
  await p.goto('file://' + path.join(ROOT, 'dist', 'dev-scenes3d.html') + '?hq' + (lesson ? '&stage=lesson' : ''));
  await p.waitForFunction(() => window.__go, null, { timeout: 30000 });
  const { SCENES_BY_ZONE } = await import(path.join(ROOT, 'src/js/world/scenes/info.js'));
  const names = what.includes(',') ? what.split(',') : SCENES_BY_ZONE[what] ? Object.keys(SCENES_BY_ZONE[what]) : [what];
  const dir = path.join(ROOT, 'shots', 's3d'); fs.mkdirSync(dir, { recursive: true });
  const files = [];
  for (const n of names) {
    await p.evaluate(n => window.__go(n, .01), n);
    await p.waitForTimeout(1400);
    const f = path.join(dir, n.replace(/[^a-z0-9]/gi, '_') + '.png'); await p.screenshot({ path: f }); files.push([f, n]);
  }
  await b.close();
  const label = what.includes(',') ? 'pick' : what;
  const out = path.join(ROOT, 'shots', `s3d-${label}.png`);
  const py = `import sys,math\nfrom PIL import Image,ImageDraw\nfs=sys.argv[2:]\nims=[Image.open(f) for f in fs[0::2]]\nw,h=ims[0].size\ns=.5\ncols=3 if len(ims)>4 else len(ims)\nrows=math.ceil(len(ims)/cols)\nW,H=int(w*s),int(h*s)\nsheet=Image.new('RGB',(cols*W,rows*(H+22)),(20,22,26))\nd=ImageDraw.Draw(sheet)\nfor i,(im,n) in enumerate(zip(ims,fs[1::2])):\n  x,y=(i%cols)*W,(i//cols)*(H+22)\n  sheet.paste(im.resize((W,H)),(x,y))\n  d.text((x+8,y+H+4),n,fill=(236,233,226))\nsheet.save(sys.argv[1])\n`;
  execFileSync('python3', ['-c', py, out, ...files.flat()]);
  console.log('sheet', out, `(${files.length} scenes)`);
  console.log(errs.length ? 'CONSOLE:\n' + [...new Set(errs)].join('\n') : 'console clean');
})();
