# Immersive scenes — the night shift

The immersive experience is one GPU point cloud (36 000 particles on desktop, 15 000 on phones) that morphs between
scenes. The look: **a production plant at night** — metal that glows the way hot steel does, sparks, the cold blue-grey of
machined steel, and machines that keep working: gears turn, rams slam, strips run through rolls. Bloom is on, the
background is near-black `#0A0C0F`. What to draw for each scene: `docs/SCENES.md`. Facts: `docs/COURSE.md`.

## Contract
Each zone file default-exports `N => ({ sceneName: () => build(N, seed, (P, n) => { … }, fill) })`.
- `build()` gives you `n` points to place (`fill` = share of the N, default .62; the rest becomes far dust). Every
  helper takes a **count** first: spend the budget on what matters (outlines need fewer points than filled areas).
- Coordinates: x ≈ −4.5 … 4.5, y ≈ −2.6 … 2.6 (the frame is roughly 16:9 on desktop; on a phone or beside a lesson the
  stage is smaller and squarer — keep the idea inside x ±3.6, y ±2.3 so it survives a square crop). z toward the viewer;
  keep |z| < 2 except for real 3D solids.
- Unique `seed` per scene (use the zone's hundred: design 2xx, materials 3xx, strength 4xx, props 5xx, iron 6xx,
  bend 7xx, compound 8xx, cut 9xx, special 1xx).
- Helpers (`kit.js`): `pt seg line outline curve arc ring disc rect box poly hatch arrow gear lathe cuboid text sparks`,
  colours in `C` (scale with `k(c, f)`, blend with `mix(a, b, t)`), `reg()` / `starPts()` for polygons.
- Motion groups (the `g` argument; the GPU animates them, free): 5 bob · 6 spin about Z (pivot) · 7 press ram ·
  8 embers · 9 conveyor · 10 visible while the ram is down · 11 visible while it's up · 12 spin about X (pivot) ·
  spin about Y = any group with a pivot. Details at the top of `kit.js`. **Use them**: a still scene is the exception.
  Group 7's ram is drawn at contact and lifts 0.6; put the work exactly under it; pair 10/11 to swap "before/after"
  shapes in sync with the stroke (flat blank while the ram is up, bent part while it is down).
- Pure: no DOM, no Math.random (use `P.r()` / `P.g()`), no globals. A builder runs once and is cached.
- Text: only when the slide's own words are the idea (`K = t/T`, `Lt`), via `P.text(n, str, font, width, c)` with
  fonts `800 200px "Big Shoulders Display"` (Latin) or `800 200px Changa` (Arabic); keep it to a few characters.

## The palette (`C`)
- **Heat** (moving, working, force, the thing to watch): `white` → `yellow` → `orange` → `hot` → `red`. White-hot is the
  hottest: use it for contact points, sparks, the cutting edge.
- **Cold metal** (tools, frames, dies, finished parts): `steel`, `steel2`, `alu`, `chalk` for crisp outlines.
- **Temper colours** (the zones; also "how far a property goes"): `straw gold amber bronze plum violet blue ice` —
  each zone leans on its own (design straw · materials gold · strength amber · props bronze · iron plum · bend violet ·
  compound blue · cut ice), with heat colours as accents.
- **Others**: `copper brass water good bad`. Tension = hot/orange, compression = blue (the slides' red/blue convention).
- Additive blending: overlapping points brighten; dim with `k(c, .5)` for things that should recede. A scene is mostly
  2–3 colours plus heat accents.

## Making it read
- Outline + fill: a filled area reads as a glow; a crisp `outline`/`box` in `chalk` or `steel` gives it an edge. Most
  machine parts look best as a dim fill with a brighter outline.
- Depth: use z and pivots for parts that are really 3D (cups, cylinders, crankshafts: `lathe`, `cuboid`), keep diagrams
  flat.
- One idea, big. If the slide's diagram has 8 labels, the particle scene shows the 2 parts that matter; labels belong to
  the lesson text and the drawing mode.
- Compare and contrast reads well left/right (e.g. punching vs blanking), and before/after reads well with 10/11.
- Check every scene at desktop and in the lesson position, and keep ≥ 40% of the budget on the subject.

## Checking your work
```bash
node build.mjs --dev --scenes3d            # → dist/dev-scenes3d.html   (#/s/<name>, ←/→ to step)
node qa/scenes3d.js bend                   # contact sheet of a zone → shots/s3d-bend.png (and shots/s3d/<name>.png)
node qa/scenes3d.js vBend,springback --lesson   # chosen scenes, framed where a lesson shows them
```
Screenshots run on a software GPU: slow, but the colours and shapes are true. Look at every sheet you make.
