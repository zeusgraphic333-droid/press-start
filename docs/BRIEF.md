# Press Start · شدّ حيلك — the brief

**Press Start** is a study game for **Production Engineering** (Product Design Dept., Faculty of Applied Arts, Badr
University in Cairo; Lectures 1–5). It is built on the code of an earlier site ("Mind Games", for a graphic design course),
re-themed for this subject. Students are first-year product designers: visual people, not engineers, Egyptian, studying
for a written exam **in English** (2 hours, 50 marks) plus quizzes. The site must make them *understand* (pictures,
motion, play) and then *pass* (exam-style questions, exact slide wording).

Two languages (Arabic = Egyptian colloquial, English = plain) and two experiences:
- **Immersive — "the night shift"**: one GPU particle cloud that becomes each idea, glowing like hot metal in a dark plant.
- **Illustrated — "the drafting room"**: engineering drawings on drafting film that plot themselves and then work like
  the machine they show.

The course content, slide by slide, is in **`docs/COURSE.md`** (with the exact slide wording and the lecturer's Arabic
terms). The slides themselves: `/home/claude/pe_src/hi/LN-SS.png` and `/home/claude/pe_src/lecture N.txt`.

## The map: nine districts
| zone | title (AR · EN) | lectures | colour (temper) |
|---|---|---|---|
| `design` | المصمم والمصنع · Designer × Factory | L1 | pale straw |
| `materials` | عيلة الخامات · Engineering Materials | L1 + L2 | straw |
| `strength` | الإجهاد والانفعال · Stress & Strain | L2 | gold/amber |
| `props` | خواص المعادن · Properties of Metals | L2 | bronze |
| `iron` | الحديد الزهر · Cast Irons | L2 | purple-brown |
| `bend` | ثني الصاج · Sheet Metal Bending | L3 | purple |
| `compound` | الثني المركّب · Compound Bending | L4 | blue |
| `cut` | قطع المعادن · Metal Cutting | L5 | pale blue |
| `boss` | الامتحان · The Exam (The Press) | all | forge orange |

Each district has **Learn** (a lesson: chapters of blocks, each chapter driving a scene on the stage), **Play** (2–3
trials), **Test** (a 10-question quiz drawn from the zone's bank). The Exam (boss fight, timed portal exam, revenge mode)
draws from every zone's bank. The **Archive** has flashcards, exam traps and trigger words from every zone.

## Files: who owns what
A zone's content lives in its own files — you only ever edit your own:
- `src/js/content/lessons/<zone>.js` (Arabic) and `<zone>.en.js` (English)
- `src/js/games/<zone>.js` and `<zone>.en.js` (trials)
- `src/js/data/bank/<zone>.js` (questions) · `src/js/data/study/<zone>.js` (archive tables) · `src/js/data/figs/<zone>.js` (figures)
- `src/styles/7N-<zone>.css` (styles for your trials, demos and art)
- scenes (separate agents): `src/js/world/scenes/<zone>.js` (particles), `src/js/world/scenes2d/<zone>.js` (drawings)

Read-only for everyone (ask the integrator for changes): everything else — `core/`, `ui/`, `world/` (except your scene
file), `content/zones.js`, `world/scenes/info.js` (the scene catalogue), `docs/`, `build.mjs`, the shared CSS, `qa/`.
Never touch another zone's files. Never run git commands that change history; don't commit.

## Voice
- **Arabic**: Egyptian colloquial, simple, warm, a little funny; short sentences, one idea per sentence. English technical
  terms stay in English inside `<en>…</en>` (the exam uses them): «الـ <en>springback</en> ده إن الصاج بيفتح شوية بعد ما
  البنش يطلع.» Explain like a friend who gets it, not like a textbook. Workshop flavour is welcome (الأسطى، الورشة،
  المكبس) but never at the cost of clarity.
- **English**: plain, warm and short — a sharp friend, not a textbook. Same content as the Arabic, not a word-for-word
  translation; same chapters, same blocks, same order.
- Numbers in Western digits. Units as on the slides (mm, inches, %). Arabic punctuation in Arabic text.

## Facts
- **Everything the site teaches comes from the slides.** Quote them exactly (`quote` blocks carry the slide's words and
  ref `L3 · S14`). Where the slide is wrong or garbled, quote it as written and give the right term (COURSE.md marks these ⚠).
- You may *explain* with general, uncontroversial engineering knowledge (why a mandrel stops buckling, what a press brake
  is), but say it plainly as explanation, keep it short, and never build questions on facts that aren't on the slides.
  COURSE.md § "Things the slides never say" lists the traps.
- Examples come from everyday products a designer knows (a lamp, a cooking pot, a sink, a can, a car door, a bracket),
  in words or original drawings. No real brand names or logos in art; in text, say "a beverage can", not a brand.

## The lesson (`content/lessons/<zone>.js`)
`export default { zone: '<zone>', hero: { say: 'one-line hook' }, chapters: [ … ] }`. A chapter:
`{ id: '<prefix>-<slug>', title, en: 'English title', ref: 'L3 · S14', scene: '<scene name>', blocks: [ … ] }`.
- **Every block type** is shown in `content/lessons/_sample.js` (build it: `node build.mjs --dev --sample`, open
  `dist/dev-sample.html#/dev/learn`): `say` (a voice: `who: 'usta'` the workshop master · `'press'` the boss · `'designer'`
  · or any glyph key: gear, anvil, nut, spring, spark, beam, wrench, caliper, lattice, curve, indent, ingot, bend, spin,
  punch; tint it with `'gear|#E39B3C'`), `p` (`big: true` for a lead paragraph), `h`, `quote` (text, ref, ar = a simple
  Arabic line), `list` (dot · num · check), `example` (title, text, art), `why`, `trap` (text, wrong, right), `tip`, `art`
  (html, caption, wide), `compare` (left/right: title, en, text, art), `grid` (cols, flip, items: title, en, text, art,
  color), `table` (head, rows), `fig` (id from figs), `demo` (id, title, caption, `mount(el, api)` → cleanup), `check`
  (q = a question id from your bank), `divider`. Rich text: `<en>…</en>`, `**bold**`, `==highlight==`.
- **Chapters**: one idea each, in slide order. Size to the content: roughly 6–12 chapters per zone. Every chapter has a
  `scene` (from `world/scenes/info.js` → your zone's list; you may reuse a scene, and a scene from another zone if it fits),
  at least one `quote` from the slides, and one `check` (a quick question). Most chapters also have a visual (art,
  compare, grid, demo or fig) and one of why / trap / tip.
- **Demos** (1–3 per zone) are small interactive toys inside a chapter: drag the K-factor slider and the neutral axis
  moves; change the clearance and see the burr. `mount(el, api)`; keep them small and fast; return a cleanup function.
- **Art**: original inline SVG, line-drawing style, coloured ONLY with CSS variables so it reads on both the dark night
  shift and the light drafting film: `var(--ink)`, `var(--ink-2)`, `var(--ink-3)` (lines), `var(--zc)` (zone colour),
  `var(--zt)` (the zone colour for text and fine lines: it switches to a dark ink on paper), `var(--hot)` (force/heat), `var(--fig-steel)` (metal fill), `var(--fig-hatch)`
  (hatching), `var(--good)`, `var(--bad)`, `var(--line)`, `var(--card)`. Fonts in SVG: `Barlow Condensed` (labels),
  `Readex Pro` (text). No hard-coded colours except inside `fill-opacity` tints.
- The English edition `<zone>.en.js` has the **same chapter ids, scenes, block types in the same order, the same checks and
  demos** (demo code can be shared: export it from the Arabic file and import it in the English one, or put shared helpers
  in a `_<zone>-kit.js` file you own).

## Trials (`games/<zone>.js`)
`export default [ { id: '<zone>-<slug>', title, en, how, mount(el, api, ctx) { …; return cleanup } } ]` — 2–3 per zone,
English edition with the same ids. They are where the zone becomes a game: *do the engineering* with your hands —
overbend to beat springback, pick the clearance, assemble the flat length, match the iron to the job, read the
stress–strain curve, sort operations by "what is kept / what is scrap". Each round set ends with
`api.finishGame(id, score, max, fromEl)` (returns `{ stars, xp }`), then an end card with Play again (`ctx.again()`) and
All trials (`ctx.back()`).
- `api`: `sfx(name)` (pop · click · good · bad · coin · win · boop · flip · swoosh · whoosh · level · tick · hit · and the
  workshop: press (a slam) · clank (metal) · hiss (hydraulics)), `award`, `once`,
  `confetti`, `confettiAt`, `burst(el, color)`, `ring`, `shake(el)`, `pulse(el)`, `GLYPH`, `glyph(k)`, `fig(id)`, `esc`,
  `rich`, `shuffle`, `seeded`, `sleep`, `pick`, `q(id)`, `optionsOf(q)`, `scene(name)` (asks the stage for a scene!),
  `lang`, `mode`, `L(ar, en)`, `t(key)`. Read `src/js/core/api.js`.
- A quick-fire engine exists: `games/_cte-kit.js` → `quickfire(el, api, ctx, cfg)` (rounds of choices with a timer,
  combo and end card). Use it for one trial if it fits, and build at least one trial of your own design.
- Shared classes (`styles/55-play.css`): `.g-card .g-hud .g-prompt .g-choices .g-choice .g-acts .g-end .g-timer`, plus
  `.btn` (`--zone --solid --sm --lg --block`), `.chip` (`--zone`), `.hud-num`, `.bar`. Look at `55-play.css` first.
- Keyboard + touch: every trial works with a mouse, a finger and the keyboard (number keys for choices). Phones: the
  trial must fit 360 px wide. Timers stop on cleanup. Respect reduced motion (`document.documentElement.dataset.motion ===
  'reduce'` or the media query).

## Questions (`data/bank/<zone>.js`)
About **30 per zone** (more for big zones like bend and cut: ~40). English (like the exam), with explanations in both
languages:
```js
{ id: 'bd07', tp: 'bend', lv: 2, k: 'scn', ref: 'bend-springback',
  q: 'A bent part opens slightly after the punch is removed. What is this called?',
  o: ['Springback', 'Necking', 'Air bending', 'Bend deduction'],          // o[0] is correct (it's shuffled on screen)
  e: 'Springback is the increase in included angle of the bent part after the tool is removed.',
  r: 'ده الـ springback: الصاج بيفتح شوية بعد ما البنش يطلع، فالزاوية تكبر.' }
```
- `id`: your zone's 2-letter prefix + number (design `dg`, materials `mt`, strength `st`, props `pr`, iron `ir`, bend `bd`,
  compound `cp`, cut `ct`). `tp` = the zone id. `lv`: 1 easy · 2 medium · 3 hard (≈ 40% / 40% / 20%). `ref`: the chapter id
  it belongs to. `k`: `def` definition · `cmp` complete the slide sentence · `scn` scenario · `cls` classify ·
  `not` which is NOT (write <b>NOT</b>) · `tf` true/false (`o: ['True','False'], a: 0|1, fx: 1`) · `fig` (with
  `fig: '<id>'`) · `calc` (Lt, K = t/T, the clearance opening).
- `fx: 1` keeps the option order (true/false, "both A and B"); `a: i` = the correct index when it isn't 0.
- Good distractors come from the same family (other bending operations, other cast irons), similar length; never
  "all of the above"; nothing tricky that the slides don't support. Use the slides' wording for the correct answer.
- `e` (English) and `r` (Arabic) explain *why*, in one or two short sentences.

## Archive (`data/study/<zone>.js`)
- `terms`: flashcards `{ t: 'Springback', ar: 'الارتداد', lec: '03', d: 'the slide definition (English, exact)', r: 'سطر
  بسيط بالعربي', rEn: 'one simple English line' }` — every key term of the zone (~10–25).
- `pairs`: exam traps `['V-bending', 'low production, press brake…', 'Edge bending', 'high production, pressure pad…',
  'الفرق بالعربي في سطر', 'the difference in one English line']` (~3–8).
- `triggers`: trigger words `['pressure pad, high production', 'Edge bending', '03']` (~6–15).

## Figures (`data/figs/<zone>.js`)
`export default { 'bd-vdie': () => box(\`<svg inner…>\`, '0 0 320 200', 'accessible label') }` (import `box` from
`./box.js`). Used by questions (`fig: 'bd-vdie'`) and lessons (`{ t: 'fig', id }`). Same colour rule as art (CSS
variables only). Prefix ids with your zone prefix.

## Styles (`styles/7N-<zone>.css`)
Prefix every class with your zone prefix (`.bd-…`). Use the design tokens (`var(--zc)`, `var(--card)`, `var(--line)`,
`var(--f-hud)`, `var(--r-m)`…), never fixed colours, so both experiences work; add `html[data-mode="illustrated"] …`
overrides only where needed. Mobile first: 360 px wide must work.

## Checking your work (do it; look at every screenshot)
```bash
node build.mjs --dev --zone bend              # → dist/dev-bend.html     (Arabic)
node build.mjs --dev --zone bend --lang en    # → dist/dev-bend.en.html  (English)
#   routes: #/dev/learn · #/dev/game/0 · #/dev/quiz   ·  add ?mode=illustrated for the drafting room
node qa/shoot.js '{"file":"dev-bend.html","hash":"/dev/learn","query":"mode=illustrated","w":1440,"h":900,"settle":2500,"steps":[{"shot":"top"},{"eval":"document.querySelector(\".screen__body\").scrollTop=1800","wait":700,"shot":"mid"}],"prefix":"bd"}'
node qa/shoot.js '{"file":"dev-bend.html","hash":"/dev/game/0","w":390,"h":844,"mobile":true,"settle":2500,"prefix":"bd-g0"}'
node qa/content-check.mjs bend                # lesson ↔ bank ↔ scenes ↔ figures integrity, bank sanity
node qa/en-check.mjs bend                     # the English edition mirrors the Arabic one
```
Screenshots land in `shots/` (give yours a prefix of your own). Scenes for other zones may still be missing while you work
(the stage shows a placeholder): that's expected. A build must stay clean (no console errors). Check both languages,
both modes, a phone and a desktop. Add `noworld` to the query (`"query":"noworld"` or `"query":"noworld&mode=illustrated"`)
when you only need the text: the particle stage renders on a software GPU here and is slow.
- Parallel work: several people build at once on a 2-CPU machine. A `--zone` build only includes your zone's data and
  scene files (the others are stubbed), so a half-written file elsewhere can't break you; `--only a,b` does the same for
  other builds, `--out <name>.html` keeps your output from overwriting someone else's. Keep screenshot runs small.
- Node prints a `MODULE_TYPELESS_PACKAGE_JSON` warning for the qa scripts: ignore it.

## Done means
Lesson (AR + EN), 2–3 trials (AR + EN), the bank, the archive tables, figures and styles for your zone; content-check
and en-check pass with 0 errors; screenshots reviewed. Then report: what you made (chapter list, trial list, counts),
anything you couldn't do, facts you were unsure of (with the slide ref), and any change you need in a file you don't own.
