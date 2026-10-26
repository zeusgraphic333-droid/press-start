// Bundle src/js/main.js + src/styles/*.css into one self-contained dist/index.html
//   node build.mjs [--dev]                  → dist/index.html (the whole game)
//   node build.mjs --dev --zone shape       → dist/dev-shape.html (one zone only: lesson + games, routes #/dev/learn · #/dev/game/<n> · #/dev/quiz)
//   node build.mjs --dev --sample           → dist/dev-sample.html (reference lesson with every block type)
//   node build.mjs --dev --zone gestalt --lang en → dist/dev-gestalt.en.html (the English edition: lessons/gestalt.en.js + games/gestalt.en.js)
//   node build.mjs --dev --scenes2d         → dist/dev-scenes2d.html (drafting scenes: #/ contact sheet · #/z/<zone> · #/s/<name>)
//   node build.mjs --dev --scenes3d         → dist/dev-scenes3d.html (particle scenes: #/s/<name>; qa/scenes3d.js makes contact sheets)
//   --out <file.html> writes to dist/<file.html> instead (parallel work: never two people building the same file)
//   --only <zone[,zone]> builds with every OTHER zone's bank/study/figs/scenes/scenes2d files replaced by empty stubs, so
//     a half-written file elsewhere can't break your build (a --zone build does this for its own zone automatically)
//   any dev page: ?lang=en|ar and ?mode=illustrated|immersive
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

/* The fonts travel inside the page (latin + arabic subsets only, as data: URIs): no third-party requests, and the
   page works the same from file://, a dev server or Vercel. [package, css files, family, subsets] */
const FONTS = [
  ['@fontsource-variable/changa', ['wght.css'], 'Changa', ['arabic', 'latin']],
  ['@fontsource-variable/readex-pro', ['wght.css'], 'Readex Pro', ['arabic', 'latin']],
  ['@fontsource-variable/big-shoulders-display', ['wght.css'], 'Big Shoulders Display', ['latin']],
  ['@fontsource-variable/big-shoulders-stencil-display', ['wght.css'], 'Big Shoulders Stencil Display', ['latin']],
  ['@fontsource/barlow-condensed', ['500.css', '600.css', '700.css'], 'Barlow Condensed', ['latin']],
];
/** the ident's two faces, subset to the letters it shows (assets/fonts/README.md says how they were made) */
const LOCAL_FONTS = [
  ['assets/fonts/italiana-ident.woff2', 'Italiana', 'font-weight: 400; font-style: normal'],
  ['assets/fonts/archivo-ident.woff2', 'Archivo', 'font-weight: 100 900; font-stretch: 62% 125%; font-style: normal']
];
function fontFaces() {
  const nm = path.join(path.dirname(new URL(import.meta.url).pathname), 'node_modules');
  let out = '';
  for (const [pkg, files, family, subsets] of FONTS) for (const f of files) {
    const css = fs.readFileSync(path.join(nm, pkg, f), 'utf8');
    for (const block of css.split('@font-face').slice(1)) {
      const url = (block.match(/url\(\.\/files\/([^)]+\.woff2)\)/) || [])[1]; if (!url) continue;
      if (!subsets.some(sub => new RegExp('-' + sub + '-(?!ext)').test(url))) continue;
      const data = fs.readFileSync(path.join(nm, pkg, 'files', url)).toString('base64');
      const body = block.slice(block.indexOf('{'), block.lastIndexOf('}') + 1)
        .replace(/font-family:\s*'[^']+'/, `font-family: '${family}'`)
        .replace(/url\(\.\/files\/[^)]+\)/, `url(data:font/woff2;base64,${data})`);
      out += '@font-face ' + body + '\n';
    }
  }
  const here = path.dirname(new URL(import.meta.url).pathname);
  for (const [file, family, desc] of LOCAL_FONTS) {
    const data = fs.readFileSync(path.join(here, file)).toString('base64');
    out += `@font-face {\n  font-family: '${family}';\n  ${desc.split('; ').join(';\n  ')};\n  font-display: swap;\n  src: url(data:font/woff2;base64,${data}) format('woff2');\n}\n`;
  }
  return out;
}

const root = path.dirname(new URL(import.meta.url).pathname);
const src = p => path.join(root, 'src', p);
const argv = process.argv.slice(2);
const minify = !argv.includes('--dev');
const zone = argv.includes('--zone') ? argv[argv.indexOf('--zone') + 1] : null;
const sample = argv.includes('--sample');
const scenes2d = argv.includes('--scenes2d');
const scenes3d = argv.includes('--scenes3d');
const identArg = argv.includes('--ident');
const langArg = argv.includes('--lang') ? argv[argv.indexOf('--lang') + 1] : '';

const ZONE_IDS = ['design', 'materials', 'strength', 'props', 'iron', 'bend', 'compound', 'cut'];
const onlyArg = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : zone && ZONE_IDS.includes(zone) ? [zone] : null;
/** --only: other zones' per-zone files become stubs (lessons/games are only imported by the full build) */
const isolate = !onlyArg ? [] : [{
  name: 'isolate-zones',
  setup(b) {
    const re = new RegExp(`/(data/bank|data/study|data/figs|world/scenes|world/scenes2d)/(${ZONE_IDS.join('|')})\\.js$`);
    b.onLoad({ filter: /\.js$/ }, args => {
      const m = args.path.match(re); if (!m || onlyArg.includes(m[2])) return;
      const kind = m[1];
      const contents = kind === 'data/bank' ? 'export default [];' : kind === 'data/study' ? 'export const terms = [], pairs = [], triggers = [];' : kind === 'world/scenes' ? 'export default () => ({});' : 'export default {};';
      return { contents, loader: 'js' };
    });
  }
}];
const common = { plugins: isolate, bundle: true, format: 'iife', target: ['es2020'], minify, write: false, legalComments: 'none', charset: 'utf8', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'error' };
let opts;
const sfx = langArg === 'en' ? '.en' : '';
if (zone || sample) {
  const imp = sample
    ? `import lesson, { games } from './content/lessons/_sample.js'; devBoot('bend', lesson, games);`
    : `import lesson from './content/lessons/${zone}${sfx}.js'; import games from './games/${zone}${sfx}.js'; devBoot('${zone}', lesson, games, '${langArg}');`;
  opts = { ...common, stdin: { contents: `import { devBoot } from './devboot.js'; ${imp}`, resolveDir: src('js'), sourcefile: 'dev-entry.js', loader: 'js' } };
} else if (scenes2d) opts = { ...common, entryPoints: [src('js/dev2d.js')] };
else if (scenes3d) opts = { ...common, entryPoints: [src('js/dev3d.js')] };
else if (identArg) opts = { ...common, entryPoints: [src('js/devident.js')] };
else opts = { ...common, entryPoints: [src('js/main.js')] };

const js = await esbuild.build(opts);
const cssFiles = fs.readdirSync(src('styles')).filter(f => f.endsWith('.css')).sort();
const cssRaw = fontFaces() + cssFiles.map(f => fs.readFileSync(src('styles/' + f), 'utf8')).join('\n');
const css = await esbuild.transform(cssRaw, { loader: 'css', minify, charset: 'utf8', logLevel: 'error' });
let html = fs.readFileSync(src('index.html'), 'utf8');
const jsCode = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
html = html.replace('/*%CSS%*/', () => css.code).replace('/*%JS%*/', () => jsCode);
const outArg = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : '';
const outName = outArg || (zone ? `dev-${zone}${sfx}.html` : sample ? 'dev-sample.html' : scenes2d ? 'dev-scenes2d.html' : scenes3d ? 'dev-scenes3d.html' : identArg ? 'dev-ident.html' : 'index.html');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', outName), html);
const kb = n => (n / 1024).toFixed(0) + 'KB';
console.log('built dist/' + outName, kb(Buffer.byteLength(html)), '(js', kb(Buffer.byteLength(jsCode)), 'css', kb(Buffer.byteLength(css.code)) + ')');
