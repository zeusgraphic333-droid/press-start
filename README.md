# Press Start · شدّ حيلك

An immersive study experience for **Production Engineering** (Product Design Dept., Faculty of Applied Arts, Badr
University in Cairo) — Lectures 1–5: the designer and the factory, engineering materials, stress and strain, the
properties of metals, cast irons, sheet-metal bending, spinning / hydroforming / deep drawing, and metal cutting.

Two experiences, two languages:
- **The night shift** (immersive): one GPU particle cloud that becomes each idea — gears turn, rams slam, sparks rise,
  and the title glows in steel's temper colours.
- **The drafting room** (illustrated): engineering drawings on drafting film that plot themselves, then work like the
  machine they show — section hatching by material, dimension lines, a red pencil for what matters.

Every district has a lesson that drives the stage as you scroll, hands-on trials, and a quiz; the Exam has a boss fight
(The Press), a timed portal-style paper and a revenge mode for your mistakes. Progress is saved in the browser.

## Build
```bash
npm install
node build.mjs                            # → dist/index.html (one self-contained file, fonts inlined)
node build.mjs --dev --zone bend [--lang en]   # one district, for writing lessons
node build.mjs --dev --scenes2d | --scenes3d   # scene sheets for the two stages
```
Docs: `docs/BRIEF.md` (how content is written), `docs/COURSE.md` (the lectures, slide by slide), `docs/SCENES.md`
(the scene catalogue), `src/js/world/scenes/STYLE.md` and `src/js/world/scenes2d/STYLE.md` (how scenes are drawn).

Stack: Three.js (custom point shader, bloom) · GSAP · esbuild · vanilla ES modules. Fonts: Changa, Readex Pro, Big
Shoulders Display (+ Stencil), Barlow Condensed (SIL OFL), inlined at build time.

Built on the code of [Mind Games](https://mind-games-peach.vercel.app). Slide wording is quoted from the course
lectures (2026–2027) for study.
