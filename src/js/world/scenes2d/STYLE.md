# Illustrated scenes — the drafting room

The site has two modes. **Immersive** draws every idea with GPU particles in the dark. **Illustrated** draws the same
ideas as **engineering drawings that work**: a sheet from a drawing set, plotted on drafting film, whose parts then move
the way the real machine does. Same names as `world/scenes/info.js`, so a lesson asks for `scene: 'vBend'` and gets the
right picture in either mode. What each scene pictures: `docs/SCENES.md`. Facts: `docs/COURSE.md`.

## The look
Think of a design office in a factory: a drafting table, film with a faint blue grid (the page already has it — never
paint a background), graphite lines in ISO weights, a red pencil for corrections, non-photo-blue construction lines.
- **Line weights** (`k.W`): `thick` 3.4 = visible outlines · `med` 2.2 = hidden lines, secondary outlines · `thin` 1.3 =
  dimensions, leaders, hatching, centre lines · `hair` .8 = extension lines. A drawing is mostly lines; fills are rare.
- **Line types** (`k.stroke.*` attribute strings): `thick`, `thin`, `hidden` (dashed: edges behind), `center`
  (dash-dot chain: axes, the neutral axis, pitch circles), `construct` (non-photo blue: guides, the "before" state, where
  something will go), `red` (red pencil: the one thing to look at).
- **Section hatching by material** (`fill="${k.hatch('steel')}"`): `iron` (ANSI31, cast iron), `steel` (ANSI32),
  `bronze` (copper, brass), `plastic` (plastic, rubber), `refractory`, `glass`, `lead` (lead, zinc), `alu`, plus `water`
  (fluid), `stipple` (powder, sand, cast surfaces) and `grid`. When you cut through a part, hatch it in its material —
  in the materials zone the hatch IS the content. Hatch lines run at 45°; two touching parts get different hatches.
- **Colour, sparingly**: `INK.graphite` for almost everything. Then one zone marker colour (the temper colours:
  design `straw` · materials `gold` · strength `amber` · props `bronze` · iron `plum` · bend `violet` · compound `tblue` ·
  cut `ice`) as a light fill or highlight, `INK.hot` (safety orange) for force arrows, heat and the moving tool,
  `INK.red` for callouts/the critical dimension, `INK.blue`/`cyan` for construction. Material fills: `steel`, `steel2`,
  `alu`, `copper`, `brass`, `water`, `rubber`. 2–4 colours per scene.
- **Drafting furniture** (use what the idea needs, not all of it): `k.dim()` dimensions with arrows · `k.leader()` notes ·
  `k.center()` · `k.angle()` angle dimensions · `k.balloon()` item numbers · `k.section()` cutting planes A–A ·
  `k.arrow()` force arrows · `k.hazard()` stripes (presses, guards) · `k.titleBlock()` (a small title block; at most one per
  scene, and not in every scene — it's a signature, not wallpaper).
- **Lettering**: `k.text(x, y, s, { family })` — `dim` (Barlow Condensed, the default: dimensions, labels, item names),
  `display` (Big Shoulders: a big number or one word), `stencil` (Big Shoulders Stencil: sheet numbers, crate marks),
  `text` (Readex Pro: a short Arabic or English note), `ar` (Changa: Arabic words). English technical terms stay in
  English (they are the exam's words); keep words few — the stage is a picture, the lesson beside it has the text.
- **Mature, not childish.** Precise geometry, generous film, confident composition. No faces, no characters or mascots,
  no cartoon eyes on parts, no emoji, no brand logos, no copies of the slide photos or of real drawings.
- **Unprinted areas are `#fff`** (white): the scene multiplies onto the film, so white = film. Use `fill="#fff"` to knock
  a part out over something behind it.

## Motion: the drawing plots itself, then works
- **Entrance** (≈1–2 s): outlines plot on like a pen plotter (`k.plot(t, els)`: in order — main outline first, then
  details, then dimensions), hatching/fills fade in after their outline (`k.ink`), balloons and labels stamp in
  (`k.stamp`). Use `const t = k.tl()`.
- **Idle loop: the machine runs.** The ram comes down (`k.press(el, { dist })`), the sheet bends (rotate a leg about the
  bend with `svgOrigin`), the disc spins, the strip slides through the rolls, the slug drops, the springback opens. Calm
  and mechanical: 2–6 s cycles, eased like a machine (`power2.in` down, `power2.inOut` back), a beat of rest each cycle.
  Use `k.loop()` / `k.press()` / your own `gsap.timeline({ repeat: -1 })`.
- Never flash, never shake continuously, nothing faster than ~0.25 s per movement.
- Reduced motion: `k.reduced()` true → show the final working state, no loops (`k.loop`/`k.press` already return null;
  your own repeating timelines must check `k.reduced()` first). The stage also freezes everything under reduced motion.
- **Pivots in SVG:** GSAP measures a px `transformOrigin` from the element's own box. To rotate about a point in viewBox
  coordinates use `svgOrigin: '392 452'`.
- **Scale/rotate about a point, set once:** give `transformOrigin`/`svgOrigin` on the first tween (or a `gsap.set`) and
  keep it the same afterwards; an origin that appears only on a later "to" side leaves a permanent offset.
- **Loops with fromTo:** a `fromTo` inside a repeating timeline renders its "from" state immediately — give loop
  `fromTo`s `immediateRender: false`.
- **Chrome bug, clip + patterns:** a `clip-path` on a group whose children are *all* pattern fills (hatches) renders
  displaced. Put one plain (non-pattern) element in the group, or clip each child instead.
- **Text direction:** the stage `<svg>` is `direction: ltr`; `k.text()` sets direction per string (rtl if Arabic), so
  `anchor: 'start' | 'end'` lands on the same side in either page direction.
- **Kit extras:** `k.hatch('steel', { flip: true })` hatches the other way (two touching parts of one material);
  `k.center()` lines carry `class="k-center"`; `k.text(x, y, 'L_{0}')` / `'mm^{2}'` for subscripts and superscripts;
  `k.plot()` gives dashed and centre lines their pattern back at the end of the draw, also under reduced motion, and
  holds arrowheads back until the pen reaches them; `k.dim(…, { upright: true })` keeps a value horizontal.
- **One entrance tween per element:** two `from` tweens on the same element (say an `ink` and a `stamp`) leave it frozen
  at the first one's start (invisible). Wrap it in a `<g>` and animate the group for the second effect.
- **Inline styles win:** an entrance `t.from(el, { opacity: 0 })` leaves an inline `opacity` on the element, which
  beats a later `setAttribute('opacity', …)`. Animate it with GSAP again (`gsap.to/set`), not with attributes.
- **Markers:** arrowheads are shared markers (`url(#arr)`, `arr-red`, `arr-blue`, `arr-hot`, `dot`); `plot()` animates
  lines with markers fine.

## Contract
Each zone file default-exports `{ sceneName: { view?, draw(k, name), play?(svg, k, name) } }`.
- `view`: SVG viewBox, default `'0 0 600 600'`. Keep the drawing inside ~40…560 so it breathes in the frame.
- `draw(k)`: returns the **inner** SVG markup (no `<svg>` wrapper). Pure: no DOM, no randomness without a seed.
- `play(svg, k)`: runs when the scene appears. Use `k.gsap` / `k.tl()` / `k.loop()` / `k.plot()` / `k.press()`.
  Everything you create is collected and killed when the scene leaves (GSAP context): no cleanup needed. Query only
  inside `svg`.
- IDs inside a scene (clipPath, gradients, masks, hazard ids) must be prefixed with the scene name (`id="vBend-clip"`):
  two scenes overlap during a transition and the contact sheet renders all of them at once.
- Size budget: < 400 SVG elements per scene; animate transforms/opacity, not path data (except small stroke draws).
- The frame is square and ~220 px tall on phones and ~460–700 px on desktop: **the idea must read at 220 px**.
  Thin lines vanish at 220 px — the thick outline (3.4) and the moving part carry the idea; dimensions are a bonus.

## Checking your work
`node build.mjs --dev --scenes2d` → `dist/dev-scenes2d.html`
- `#/z/<zone>` contact sheet of a zone (MISSING in red until drawn) · `#/` everything · `#/s/<name>` the real stage
  with the entrance and the loop (←/→ to step, R to replay).
- Screenshot: `node qa/shoot.js '{"file":"dev-scenes2d.html","hash":"/z/bend","w":1400,"h":1000,"settle":4000,"steps":[{"shot":"bend","full":true}]}'`
  → `shots/shot-bend.png`; one scene big: `'{"file":"dev-scenes2d.html","hash":"/s/vBend","w":900,"h":900,"settle":3500}'`.
  Also look at one at phone size (`"w":390,"h":390`). Look at every screenshot you make.
- `title.js` (the site title) is a finished reference for the kit's helpers and motion style.
