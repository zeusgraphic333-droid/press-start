// REFERENCE LESSON — every block type the renderer supports, in the house style (build: node build.mjs --dev --sample → #/dev/learn).
// House rules (full version: docs/BRIEF.md):
//  · Arabic = Egyptian, simple, short sentences, one idea per sentence. English terms inside <en>…</en>.
//  · Art = original line drawings in inline SVG, coloured with CSS variables (var(--ink), var(--zc), var(--hot)…) so the
//    same drawing reads on the dark night shift and on the drafting film. No faces, no mascots, no brand logos, no emoji.
//  · Each chapter sets `scene` (a name from world/scenes/info.js): the stage beside the text shows it, in both modes.
//  · Quotes are the slide's exact words, with the slide ref (L3 · S14).
const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', hot: 'var(--hot)', steel: 'var(--fig-steel)', good: 'var(--good)', bad: 'var(--bad)' };

export default {
  zone: 'bend',
  hero: { say: 'ده درس تجريبي بيورّي كل أنواع البلوكات. <en>Sample</en> بس.' },
  chapters: [
    {
      id: 'sample-1', title: 'كل أنواع البلوكات', en: 'Every block type', ref: 'L3 · S14', scene: 'vBend',
      blocks: [
        { t: 'say', who: 'usta', text: 'أنا الأسطى. الصاج ده مش هيتثني لوحده. محتاج بنش وداي، و<en>press brake</en>.' },
        { t: 'p', text: 'فقرة عادية. جمل قصيرة. فكرة واحدة في كل جملة. المصطلح الإنجليزي يتكتب كده: <en>V-bending</en>. وممكن **تقيل** أو ==مهم==.' },
        { t: 'quote', text: 'V-bending - performed with a V-shaped die · For low production · Performed on a press brake · V-dies are simple and inexpensive', ref: 'L3 · S14', ar: 'الثني على V: داي على شكل V، لإنتاج قليل، على الـ press brake، والداي بسيط ورخيص.' },
        { t: 'h', text: 'عنوان صغير جوه الدرس', en: 'Air bending' },
        { t: 'list', style: 'dot', items: ['أول نقطة فيها <en>punch</en>', 'تاني نقطة', 'تالت نقطة'] },
        { t: 'list', style: 'num', items: ['حط الصاج على الداي', 'البنش ينزل', 'الصاج يتثني'] },
        { t: 'list', style: 'check', items: ['حاجة صح', 'حاجة صح كمان'] },
        { t: 'example', title: 'رف المكتبة', text: 'رف صاج مثني على شكل L. اتعمل على <en>press brake</en> بداي V، لأن الكمية قليلة.', art: `<svg viewBox="0 0 320 110" fill="none"><path d="M70 22v58h170" stroke="${V.ink}" stroke-width="5" stroke-linejoin="round"/><path d="M70 22v58h170" stroke="${V.zc}" stroke-width="1.4" stroke-dasharray="10 3 2 3" transform="translate(-6 6)"/><path d="M250 30v40M244 30h12M244 70h12" stroke="${V.ink3}" stroke-width="1.2"/></svg>` },
        { t: 'why', text: 'الداي V بسيط: فتحة على شكل V وبنش بيزق الصاج جواها. عشان كده رخيص ومناسب للإنتاج القليل.' },
        { t: 'trap', text: 'السؤال ممكن يقولك "high production, pressure pad" ويحطلك <en>V-bending</en> في الاختيارات.', wrong: 'V-bending = high production', right: 'Edge bending = high production · pressure pad required' },
        { t: 'tip', text: 'V = قليل ورخيص. Edge = كتير ومحتاج pressure pad.' },
        { t: 'art', html: `<svg viewBox="0 0 600 200" fill="none" stroke-width="2"><path d="M60 150h170l-40-60h-90z" fill="${V.steel}" fill-opacity=".35" stroke="${V.ink}"/><path d="M115 40h60v50l-30 30-30-30z" stroke="${V.hot}"/><path d="M360 150h180v-70h-100v40h-80z" fill="${V.steel}" fill-opacity=".35" stroke="${V.ink}"/><path d="M440 30h40v80h-40z" stroke="${V.hot}"/><g fill="${V.ink3}" font-family="Barlow Condensed" font-size="17" text-anchor="middle" stroke="none"><text x="145" y="185">V-bending</text><text x="450" y="185">Edge bending</text></g></svg>`, caption: 'رسمة خطية بسيطة بتشرح فكرة' },
        { t: 'compare', left: { title: 'ثني V', en: 'V-bending', text: 'لإنتاج قليل، الداي بسيط ورخيص.' }, right: { title: 'ثني الحافة', en: 'Edge bending', text: 'لإنتاج كتير، محتاج pressure pad، والداي أغلى.' }, note: 'الفرق: الكمية، والـ pressure pad.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'فويل', en: 'Foil', text: 'أرفع من 0.15 mm.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 24h36"/></svg>`, color: 'var(--t-straw)' },
          { title: 'صاج', en: 'Sheet', text: 'من 0.15 لحد 6.35 mm.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="21" width="36" height="6"/></svg>`, color: 'var(--t-amber)' },
          { title: 'بليت', en: 'Plate', text: 'أتخن من 6.35 mm.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="14" width="36" height="20"/></svg>`, color: 'var(--t-violet)' }
        ] },
        { t: 'table', head: ['العملية', 'الإنتاج', 'التكلفة'], rows: [['<en>V-bending</en>', 'قليل', 'رخيص'], ['<en>Edge bending</en>', 'كتير', 'غالي']] },
        { t: 'demo', id: 'sample-demo', title: 'زوّد الزاوية وشوف', caption: 'كل ضغطة بتثني الصاج ١٥ درجة زيادة.', mount(el, api) {
          let a = 0;
          el.innerHTML = `<div class="smp"><button type="button" class="btn">اثني</button><svg viewBox="0 0 200 120" width="200" fill="none"><path class="smp__leg" d="M20 90h80" stroke="var(--ink)" stroke-width="6"/><path class="smp__arm" d="M100 90h80" stroke="var(--zc)" stroke-width="6"/></svg><b class="smp__w hud-num">0°</b></div>`;
          const draw = () => { el.querySelector('.smp__arm').setAttribute('transform', `rotate(${-a} 100 90)`); el.querySelector('.smp__w').textContent = a + '°'; };
          el.querySelector('button').onclick = e => { a = (a + 15) % 105; draw(); api.sfx('pop'); if (a === 90) api.award(5, { from: e.currentTarget, key: 'demo:sample' }); };
          draw();
        } },
        { t: 'divider' }
      ]
    },
    { id: 'sample-2', title: 'الفصل التاني', en: 'Second chapter', scene: 'edgeBend', blocks: [{ t: 'p', text: 'فصل قصير.' }] }
  ]
};

export const games = [{
  id: 'sample-game', title: 'تحدي تجريبي', en: 'Sample trial', how: 'اضغط ٥ مرات بسرعة.',
  mount(el, api, ctx) {
    let n = 0;
    el.innerHTML = `<div class="g-card" style="text-align:center"><p class="g-prompt">اضغط!</p><button type="button" class="btn btn--zone btn--lg">اضغط</button><p class="hud-num" style="font-size:40px">0</p></div>`;
    el.querySelector('button').onclick = e => { n++; el.querySelector('.hud-num').textContent = n; api.sfx('pop'); if (n === 5) { const r = api.finishGame('sample-game', 5, 5, e.currentTarget); el.querySelector('.g-prompt').textContent = 'خلصت! ' + r.stars + ' علامات'; } };
    return () => { };
  }
}];
