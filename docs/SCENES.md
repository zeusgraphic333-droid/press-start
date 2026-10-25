# The scene catalogue — what each scene pictures

Every scene exists twice: as **particles** (immersive, `world/scenes/<zone>.js`, "night shift": metal glowing in a dark
plant) and as a **drawing** (illustrated, `world/scenes2d/<zone>.js`, "drafting room": an engineering drawing that works
like the machine it shows). Same name, same idea, each in its own medium. Names and captions: `world/scenes/info.js`.
The facts behind each scene: `docs/COURSE.md`. A scene is ONE idea that reads in two seconds at 220 px tall.

Motion matters as much as the picture: the subject is machines and processes, so most scenes should *perform* the
process in a calm loop (the ram comes down, the sheet bends, the disc spins onto the mandrel, the slug drops).
`★` marks the zone's hub scene (shown big on the hub and behind the level): it must be the best one in the zone.

## design — Designer × Factory (L1)
- **designer ★** — one product, half sketch, half made: a desk lamp (the lecture's recurring example: articulated arm,
  shade, base) whose left half is construction lines/dots and whose right half is solid metal. Loop: the "made" half sweeps
  across, sketch → part, and back.
- **sequence** — the Product Design Sequence diagram (L1·S3): parallel rays enter, three lenses (Aesthetics · Analysis ·
  Synthesis) focus them to points and they spread again; the six step names along the top (drawing) / the rays flowing
  through the lenses (particles, group 9 conveyor works well for the rays).
- **considerations** — the two rows: personal and individual (warm, few, loose) vs objective (cool, many, ordered) feeding
  the same lens.
- **methods** — four families side by side, each as its icon-process: Forming (a part pressed), Cutting (a blade/kerf),
  Joining (two parts and a bead or bolt), Finishing (a spray coat / grit). Loop: each one "works" in turn.
- **forming** — the three states: liquid metal poured into a mould · plastic state (a hot billet squeezed) · solid state
  (a cold sheet bent).
- **cuttingM** — the four cutting families: sheet cutting (shear), chip forming (a tool peeling curly chips), nonchip
  forming (no chips: chemical/electrical), flame/laser (a beam and sparks).
- **joining** — solder/braze (a fillet flowing), weld (a bead between two plates, sparks), adhesive (a glue line),
  mechanical (a bolt and nut clamping).
- **finishing** — formed finish (a textured sheet), abrasive/cut (a grinding wheel spinning, group 6), coatings (spray).
- **matrix** — figure 1-1 as a dot matrix: 14 columns grouped Forming · Cutting · Joining · Finishing, rows of materials;
  the Ferrous row lights up fully ("all processes"), Thermoset shows its empty cells (no weld, no solder).

## materials — Engineering Materials (L1 + L2)
- **materialsTree ★** — the L1·S4 tree as a structure: Materials → Metals · Plastics · Rubber/Elastomers · Natural
  Engineering Materials, each branch ending in a small sample (an ingot, a moulded part, a rubber band, a glass pane).
- **classTree** — the L2·S2 split: Metals (ferrous / non-ferrous) vs Non-metals (polymers / ceramics), a fork.
- **metalsChart** — Metals → Ferrous · Nonferrous · Powdered Metallurgy (the dashed branch: powder pressed into a part).
- **atoms** — pure metal: a lattice of identical atoms (one size, one colour), calm.
- **alloy** — the same lattice with a second element mixed in (other size/colour); stronger, maybe a bar resisting a push.
- **ferrous** — the iron family: wrought iron, carbon steels, alloy steels, cast irons (a magnet pulling them is a nice
  "contains iron" sign — but magnetism isn't on the slide for ferrous, so keep it a visual hint only, no text claim).
- **nonferrous** — aluminium, copper, lead, silver, tin, zinc: six ingots in their own colours.
- **polymers** — thermosetting (a rigid cross-linked net) vs thermoplastic (loose chains that slide); Bakelite vs PVC.
- **ceramics** — refractories, abrasives, glass, cement, concrete: a brick, a grit wheel, a pane, a slab.
- **elastomers** — rubber stretched and released (it comes back).

## strength — Stress & Strain (L2)
- **stress** — a bar with an outside force, and the internal resistance inside it (arrows meeting arrows).
- **fourLoads** — the L2·S4 figure: four blocks deforming under tension · compression · shear · torsion.
- **tension** — a bar pulled apart: it lengthens and thins.
- **compression** — a block squashed: it shortens and bulges.
- **shearStress** — two layers sliding past each other (a pair of blocks, or a rivet between plates).
- **torsion** — a shaft twisting about its long axis (a crankshaft is the slide's example).
- **elastic** — load on, it stretches; load off, back to the original (a spring or band: BEFORE / AFTER).
- **plastic** — load on, it stretches; load off, it stays stretched.
- **curve ★** — the stress–strain curve drawn live: straight elastic line, yield point, the rise to ultimate tensile
  strength, uniform elongation, necking, fracture; a specimen beside it necks in sync with a point riding the curve.
- **yield** — the elastic limit: below it the bar springs back, above it it stays bent (one marker line).
- **necking** — a specimen narrowing in one place, then snapping in two.
- **elongation** — original length L0 and the increased length; strain = the change (show the ΔL).

## props — Properties of Metals (L2)
- **anvil ★** — an anvil with a hammer striking, sparks flying: the "character" of metal (hardness + toughness), and the
  property names orbiting it (drawing) / embers (particles).
- **hardness** — an indenter pressing into a surface and a scratch line.
- **ductile** — metal drawn out into a fine wire through a die.
- **brittle** — cast iron snapping into shards with no stretch.
- **tough** — a hammer blow absorbed without fracture (the metal dents, doesn't break).
- **malleable** — a slab rolled/hammered into a thin sheet.
- **castable** — molten metal poured from a ladle into a mould, filling it.
- **resilience** — a spring/bumper absorbing a shock and springing back.
- **machinable** — a cutting tool on a turning bar, chips curling off.
- **weldable** — two plates joined by a weld bead.
- **physical** — a quiet panel of the physical properties as glyphs: opacity, colour, density, conductivity, expansion,
  magnetism, melting, corrosion ("hard to change").
- **conductivity** — current/heat travelling along a bar (electrical vs thermal).
- **expansion** — a bar growing when heated; a caption-free hint that higher melting point = less expansion.
- **magnet** — domains (little arrows) scattered, then lining up: iron, nickel, cobalt.
- **melting** — solid → liquid: a block slumping into a pool.
- **corrosion** — a surface eaten by oxygen/chemicals (rust spots growing), a protected part beside it staying clean.

## iron — Cast Irons (L2)
- **irons ★** — six ingots/cast parts in a row, each with its own inside: gray (flakes), ductile (nodules), white (bright,
  chilled), CGI (worm-like), malleable (clusters), high-alloy (with Cr / Ni marks). Loop: each one presents its job.
- **castIron** — molten iron with its recipe: at least 2% carbon, 1–3% silicon (carbon and silicon particles in the melt).
- **grayIron** — graphite flakes in the matrix + an engine block / flywheel that damps a vibration wave.
- **ductileIron** — round graphite nodules + a crankshaft (magnesium makes the nodules).
- **whiteIron** — chilled edge (white) on gray iron in a mould + crusher rolls grinding.
- **cgi** — compacted (vermicular, worm-like) graphite + an engine block / brake drum.
- **malleableIron** — white iron going through a heat-treatment furnace and coming out malleable (a bearing part).
- **alloyIrons** — up to 35% alloy: high-chromium (shield: oxidation + wear) and nickel (non-magnetic, no expansion).
- **crankshaft** — a crankshaft turning with pistons (torsion; ductile iron's job). Shared by strength and iron.

## bend — Sheet Metal Bending (L3)
- **formingStates** — the four forming states as a row: liquid · fluid (dashed, like the slide) · plastic · solid.
- **sheetGauge** — a thickness scale: foil (< 0.15 mm) · sheet (0.15–6.35 mm) · plate (> 6.35 mm), three edge-on slabs.
- **stockShapes** — the eight metal stock shapes: round/square/hex/angle, solid and hollow (end views or short bars).
- **solidTree** — simple bending (low–moderate cost) · compound bending (moderate–high) · form & cut stamping (high):
  three branches, cost rising.
- **stamping** — the terminology: a stamping press with punch and die making stampings (parts dropping out).
- **neutralAxis ★** — a sheet bending: the outside stretches (hot colour, lines spreading), the inside compresses (cool,
  lines bunching), the neutral axis stays the same length. Loop: bend and straighten.
- **flatLength** — the two equations: Lt = A + B + BA (flat legs + the bend's neutral length) and Lt = A + B − BD (legs to
  the outside corner, minus the deduction). The part unfolds into its flat length.
- **kFactor** — the sheet section: T = thickness, t = inside surface to the neutral axis, K = t/T; the axis slides.
- **relief** — a corner flange with the three reliefs: tear-rip, obround, rectangle.
- **bendRadius** — the inside radius, and what too small does (a kink/crack on the outside).
- **vBend** — punch (group 7 ram) into a V-die, the sheet folding into a V on contact (groups 10/11 swap flat/bent).
- **airBend** — air bending (punch stops above the die bottom, air under the sheet) vs bottoming.
- **edgeBend** — edge bending: pressure pad clamps the sheet, the punch wipes the edge down over the die.
- **springback** — bent inside the tool at the tool's angle, then the punch lifts and the part opens a little: included
  angle grows, radius grows.
- **flanging** — straight, stretch and shrink flanging (three flanged edges).
- **hemming** — hemming (edge folded flat on itself), seaming (two edges locked), curling (edge rolled into a tube).
- **rollForm** — three rolls (group 6 spin) rolling a sheet into a curve/cylinder.
- **contRoll** — a strip (group 9 conveyor) passing stands of rolls, the profile changing a little at each station.
- **tube** — a tube bent around a former with a mandrel inside it; without the mandrel it would buckle.

## compound — Compound Bending (L4)
- **spinning ★** — a disc (blank) spinning on a lathe (spin it: particles group 12 / P.lathe axis 'x'), the roller tool
  pushing it onto the mandrel until it becomes a cup.
- **spinParts** — the lathe labelled: head stock, spindle, mandrel, sheet metal, clamp, tail stock, roller tool.
- **spunShapes** — the three basic spun shapes: hemisphere, cone, cylindrical shell (turning slowly).
- **hydro** — water pressure doing the forming: a sheet or tube pushed into a shape with a concavity a solid die couldn't make.
- **hydroTube** — the six-step tube hydroforming: tube in the open die, die closes, fluid fills, axial push + pressure
  bulges it into the cavity, part out.
- **hydroSheet** — sheet forced into a female cavity by water pressure (or a male punch pressing against the fluid).
- **drawing** — deep drawing: blank holder clamps the blank, the punch pushes it into the die, a cup forms.
- **drawSteps** — the sequence: flat blank → shallow cup → deep cup; products: a beverage can, a car body panel.

## cut — Metal Cutting (L5)
- **cutTree** — the four cutting families: punching & shearing · chip forming · nonchip forming · thermal/flame.
- **machining** — chip forming to a tolerance: a cutter (spinning) taking a precise cut, chips flying.
- **thermal** — gas, laser and plasma: three heads cutting, a kerf line glowing, sparks (group 8).
- **shearing** — a guillotine shear: the upper blade comes down past the lower one, cutting the sheet to size.
- **clearance** — punch and die with the gap c (C/2 each side): too small (break lines miss: double burnish, more force),
  right, too large (metal pinched and bent). Three cases side by side.
- **punchDie ★** — the punch (convex, male) comes down through the sheet into the die (concave, female); the slug drops
  out below. A press stroke, slow and heavy (particles: group 7 + group 10/11 for the slug).
- **punchVsBlank** — the same cut, two answers: punching keeps the sheet with the hole (slug = waste); blanking keeps the
  blank (sheet = waste).
- **fineBlank** — fine blanking: the ejector pushes up from below against the punch; the edge comes out smooth and flat.
- **cutOps** — the operations as a sheet of samples (14 small swatches): punching, blanking, fine blanking, notching,
  perforating, slotting, slitting, lancing, parting, cutoff, shaving, trimming, embossing, coining.
- **perforating** — notching (edge bite), perforating (many holes in one hit), slotting (rectangular holes).
- **lancing** — lancing (a partial cut bent into a tab/louver, nothing removed) + slitting (straight cuts, no scrap: two
  rotary knives).
- **cutoffParting** — cutoff (one cut line, no scrap) vs parting (two edges, a scrap piece between parts).
- **trimShave** — trimming the flange off a drawn cup + shaving a hair off an edge (±0.025 mm).
- **nibbling** — a punch nibbling small overlapping bites along a curved path.
- **emboss** — raised lettering/ribs: punch and die with the same contour, opposite direction (male/female).
- **coining** — a coin struck: impressions on both sides.

## special
- **monolith** — the boss, **The Press**: a big H-frame press whose ram slams down on a blank (sparks). It is the exam: it
  should feel heavy, rhythmic and a little threatening. (Particles: groups 7/10/11/8; drawing: hazard stripes, a
  two-hand START button.)
- **nebula** — between things: raw stock. Particles: a slow vortex of embers. Drawing: blank sheets/bars waiting on the
  table (construction lines only).
- **title:ar / title:en** — the site name (owned by the integrator; particles: world/titles.js, drawing: scenes2d/title.js).
