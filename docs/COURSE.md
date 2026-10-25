# Production Engineering — the course, slide by slide

**Course:** Production Engineering · Faculty of Applied Arts, Product Design Dept., Level 1 (on the BUC programme page:
PRD003 Production Engineering (1), level 2 after the foundation year, semester I · 2 credit hours · coursework 50 + exam 50, 2-hour exam).
**Lecturer:** Prof. Dr. M. Mohamed Ryead (Lecture 5's cover says "Assistant Prof."). Five lectures, 2026–2027.

**Sources (read them, don't trust this digest alone):**
- Text layer of every lecture: `/home/claude/pe_src/lecture N.txt` (the Arabic in the text layer is garbled; the
  correct Arabic terms are written below).
- Every slide as an image: `/home/claude/pe_src/hi/LN-SS.png` (1000×750, readable) · contact sheets of 9 slides:
  `/home/claude/pe_src/sheets/LN_0K.png` · two high-resolution slides: `/home/claude/pe_src/hi_L1-03.png` (design
  sequence), `/home/claude/pe_src/hi_L1-05.png` (figure 1-1).
- Slide refs below are `L<lecture> · S<slide>`, matching the image file names (`L2 · S5` = `hi/L2-05.png`).

Quote the slides **as written** (keep their wording, even odd grammar). Where a slide has a typo, quote it and add the
correct term in your explanation (noted below as ⚠).

---

## Zone `design` — Designer × Factory (Lecture 1)

**L1 · S2 — Why the product designer needs production engineering** (exact):
- "The product designer, whether on a design team or acting alone, is responsible for the appearance and form of a product."
- "The product designer need to visualize and develop forms that ultimately will be manufactured."
- "With a comprehensive knowledge base of materials and manufacturing possibilities, The industrial designer can propose an
  array of possible design solutions and have some confidence that they can be manufactured."

**L1 · S3 — Product Design Sequence** (a diagram: parallel lines → three lenses that focus and spread them):
- Six steps across the top: **Product Identification / Design Team Formed → Product Defined → Concept Development →
  Concept Presentation → Product Development → Product Presentation**.
- Three lenses: **Aesthetics**, **Analysis**, **Synthesis** (in that order).
- Two rows of considerations under each lens:
  - **Personal and Individual Considerations** — Aesthetics: style, ego, marketing/advertising · Analysis: research, sketches,
    mock-ups, finish color/texture · Synthesis: CAID, material selection, process selection.
  - **Objective Considerations** — Aesthetics: ergonomics, engineering, marketing, investment/profit, national/international
    sales, shippin /distribution (⚠ "shipping"), CPSA/UL/FDA · Analysis: ergonomics, breadboard studies, manufacturability,
    safety, strength of materials · Synthesis: CAD/CAM, material selection, tooling, component selection, vendors, assembly,
    shipping/packaging, repair/maintenance.
- Reading of the diagram: each lens gathers many inputs into one focus point (a step), then they spread again.

**L1 · S7 — Manufacturing Methods** (tree):
- **Forming:** Liquid State · Plastic State · Solid State
- **Cutting:** Sheet Cutting · Chip Forming · Nonchip Forming · Flame/Laser
- **Joining:** Solder/Braze · Weld · Adhesive · Mechanical
- **Finishing:** Formed · Abrasive/Cut · Coatings

**L1 · S5 — figure 1-1. materials and manufacturing** (a matrix: rows = materials, columns = the 14 methods above;
symbols: ● All Processes · ◕ Most Processes · ◒ Some Processes · ○ No Processes). Safe facts to use:
- **Metals · Ferrous: every cell is "All Processes"** (the only row like that). Nonferrous: all, except Flame/Laser = most.
- **Plastics · Thermoset:** Liquid state forming yes; **plastic- and solid-state forming: no**; **solder/braze and weld: no**;
  adhesive, mechanical joining, formed finish, coatings: yes.
- **Plastics · Thermoplastics:** liquid and plastic state forming yes; solder/braze no; **weld yes**.
- **Wood products:** weld and solder/braze no; adhesive and mechanical yes.
- Footnote: "*not within the scope of engineering materials, therefore not covered in this book" (on Natural Materials).
  Use only these clear cells in questions; the light-blue "most/some" cells are hard to read.

**L1 · S8–S18 — product photos** (no text): a stainless table with laser-cut legs, steel tube beds (S9, S10), a rolled
sheet-steel desk (S11), a bent-sheet phone stand (S12), a folded sheet lamp (S13), desk lamps and a perforated sheet
basket (S14), spun aluminium bottle forms (S15), a bent wire car sculpture (S16), plastic chairs, cups, crates and
kitchen tools (S17), plastic beach chairs, bottles and a kettle (S18). Use them as *ideas* for examples ("a perforated
basket = perforating"), never copy the photos.

## Zone `materials` — Engineering Materials (Lectures 1 + 2)

**L1 · S4 — Materials** (tree): **Metals** (Ferrous, Nonferrous) · **Plastics** (Thermoset, Thermoplastic) ·
**Rubber/Elastomers** (Thermoset, Thermoplastic) · **Natural Engineering Materials** (Engineering Ceramics, Glass,
Manufactured Carbon, Refractory Hard Metals).

**L1 · S6 = L2 · S3 — Metals chart:** Metals → **Ferrous**, **Nonferrous**, and (dashed branch) **Powdered Metallurgy**.
Bullets (exact):
- "Pure metals are composed of atoms of the same type."
- "Metal alloys are composed of two or more chemical elements."
- "This blending of elements gives alloys their greater mechanical properties."
- "The majority of metals used in engineering applications are alloys."
- "Metals are generally divided into ferrous and nonferrous."
- "Each metal alloy has specific mechanical and physical properties that will make it a good fit for a specific application."

**L2 · S2 — CLASSIFICATION OF ENGINEERING MATERIALS** (tree):
- **METALS** → **FERROUS (CONTAINS IRON)**: wrought iron, carbon steels, alloy steels, cast irons ·
  **NON-FERROUS (CONTAINS NO IRON)**: aluminium, copper, lead, silver, tin, zinc, etc.
- **NON-METALS** → **POLYMERS** → **THERMO SETTING POLYMERS (PLASTICS)**: phenolformaldehyde (Bakelite), polysters (⚠
  polyesters), epoxresins (⚠ epoxy resins) · **THERMO PLASTIC**: PVC, polythene, acrylic, resins ·
  **CERAMICS**: refractories, abrasives, glass, cement, concrete.

(The difference between thermosetting and thermoplastic is **not explained on the slides**. If you explain it, keep it to
the basic, standard idea — thermoplastics soften again when heated, thermosets set once — and mark it as background,
not slide content; don't build exam questions on it.)

## Zone `strength` — Stress & Strain (Lecture 2)

Arabic terms are the lecturer's own, from the slides.
- **L2 · S4 — Strength (الإجهاد):** "The Internal Resistance offered by a part to an externally applied Force is called as
  Stress. It is the ability of a Material to resist the externally applied Forces with Breakdown or Yielding." (⚠ the
  standard wording is "without breakdown or yielding"). Figure: four blocks — **Tension, Compression, Shear, Torsion**.
- **L2 · S5:**
  - **Tensile/Tension strength (إجهاد الشد)** "is the maximum tensile (pulling apart) load that a material can resist
    before fracture."
  - **Compression (إجهاد الضغط (الكبس))** "is a measure of the extent to which a material deforms under a compressive load
    prior to fracture."
  - **Shear strength (إجهاد القص)** "is the maximum load a material can resist without separation when subjected to a
    shearing action."
  - **Torsion (إجهاد اللى)** "is the application of torque to a member to cause it to twist about its longitudinal axis. A
    crankshaft must be made of metal with superior torsional strength or it will fail under the stress it is subjected
    to in an engine."
- **L2 · S6 — Elasticity (المرونة):** "describes the recovery of a material back to its original shape and size after being
  deformed, when a stress is removed." (figure: a band stretched by two hands, BEFORE / AFTER).
- **L2 · S7 — Plastic behavior (اللدونة):** "The ability of a material to deform under load and retain its new shape when
  the load is removed is called plasticity." (figure 3-4 plastic behavior / figure 3-3 elastic behavior).
- **L2 · S8 — The yield stress** "is a measure of resistance to plastic deformation". The stress–strain curve: **elastic
  behavior** (the straight start) then **plastic behavior**; marked: **yield strength**, **ultimate tensile strength**,
  **uniform elongation**, **necking**, **fracture**; axes **stress** (up) and **strain** (along).
- **L2 · S9:** a curve with **TS** (the top, point M), the specimen shown before, during and at **"Necking"**, ending at **F**.
- **L2 · S10:**
  - **Yield strength** "is the workable engineering strength of a metal to stay within its elastic limit. Exceeding a
    metal's yield strength puts the metal into permanent deformation."
  - **Percent elongation** "is the increase in length over the original length."
  - **Strain (الانفعال)** "is the change a material go through during elongation or shrinkage. It is given as a measure of
    deformation under load."

## Zone `props` — Properties of Metals (Lecture 2)

**1- Mechanical properties** (continued):
- **L2 · S11:**
  - **Hardness (الصلادة)** "is the ability of a material to resist penetration and scratching."
  - **Ductility (المطيلية)** "It is the ability of a material to be deformed plastically without rupture under tensile load.
    Due to this property material can lengthy into fine wire without fracture."
  - **Brittleness (القصافة (الهشاشة))** "is the property of a material opposite to ductility. So cast iron is a brittle
    material."
  - **Bending (الثنى)** "is characterized by the outside fibers of a beam in tension and the inside fibers in compression."
- **L2 · S12:**
  - **Toughness (المتانة)** "is the ability of a material to resist deformation under stress. is the property of a material
    to resist fracture against impact load like hammer blows. This property of material is decreased when they heated."
  - **Malleability (المطاوعة)** "is the property of a material which allow the material to be rolled or hammered into
    sheets. soft steel and wrought iron are examples of malleable materials."
  - **CASTABILITY (القابلية للصب (السباكة))**: "Castability of metal refer to the ease with which it can be cast into
    different shapes and is concerned with the behavior of metal in its molten state."
- **L2 · S13:**
  - **RESILIENCE (مقاومة او امتصاص الصدمات)**: "It is a property of material to absorb energy and to resist shock and impact
    loads. It is measured by the amount of energy absorbed per unit volume within the elastic limit."
  - **MACHINABILITY (قابلية التشغيل بالماكينات)**: "The ease with which a given material may be worked or shaped with a
    cutting tool is called machinability. Machinability depends on chemical composition, structure and mechanical properties."
  - **WELDABILITY (قابلية اللحام)**: "It is the ability of material to be joined by welding. Weldability depends on chemical
    composition, physical properties and heat treatment to which they are subjected."

**2- Physical properties** (L2 · S14–S15):
- "Physical properties are inherent aspects of a material that are generally not easily altered. Physical properties
  generally remain intact, whereas mechanical properties are changed by work hardening and/or through heat treatment."
- **Opacity/transparency** "is the ability to transmit light." · **Color** "is the characteristic reflected wavelength." ·
  **Density** "is weight per unit volume (specific gravity)." · **Electrical conductivity** "is the ease with which a
  material conducts a current." · **Thermal conductivity** "is the ease with which heat flows within and through a material."
- **Thermal expansion** "is expressed in units of 1/°F or 1/°C. Generally, the coefficient of thermal expansion is inversely
  proportional to the melting point of a material: higher-melt temperature materials have less expansion. Steel is a
  significant exception."
- **Magnetic/nonmagnetic/ferromagnetism** "is the alignment of iron, nickel, and cobalt atoms into domains."
- **Melting point** "is the energy required to separate a material's atoms, changing its state from solid to liquid."
- **Corrosion resistance** "is the ability to resist surface deterioration caused primarily by oxygen, chemicals, or other
  agents. (Degradation in plastics can also be caused by ultraviolet light, moisture, and other environmental factors.)"

## Zone `iron` — Cast Irons (Lecture 2)

- **L2 · S16 — Ferrous Metals:** "Hardness is an important mechanical property for certain applications" · "Irons are
  available as cast or wrought. All cast irons contains at least 2 percent carbon and from 1–3 percent silicon. The six
  kinds of iron are:"
- **1- Gray iron (الحديد الزهر الرمادى)** "is used in automotive engine blocks, gears, flywheels, disc brakes and drums, and
  large machine bases." · "gray iron has excellent fatigue resistance and an ability to dampen vibration. This is important
  for applications such as machine tools." · "Although gray iron has poor tensile strength and a lower impact strength than
  that of most other cast ferrous metals, it has a high compressive strength."
- **L2 · S17 — 2-Ductile iron, or nodular iron (الحديد الزهر المرن)**: "applications include crankshafts and heavy-duty gears
  because of its machinability, fatigue strength, and high modulus of elasticity. But it has less vibration-dampening
  capacity than gray iron." · "Ductile iron contains trace amounts of magnesium, which improves the stiffness, strength, and
  shock resistance gray iron produces." (photos: ductile iron parts; a crankshaft with pistons)
- **L2 · S18 — 3- White iron** "is specified where wear and abrasion resistance are required for applications such as clay
  mixing and brickmaking equipment such as crushers, pulverizes (⚠ pulverizers), and nozzles; railroad brake shoes, and
  rolling-mill rolls." · "White iron gets its name from the whitish appearance of the metal, caused by chilling selected
  areas of gray or ductile iron in the mold." (photos: a crusher, rolling-mill rolls)
- **L2 · S19 — Compacted graphic iron (CGI)** (⚠ "compacted graphite iron") "is used in automotive engine blocks, brake drums,
  exhaust manifolds, and high pressure gear pumps." · "It has a strength similar to those of gray iron, with high thermal
  conductivity and machinability superior to those of ductile iron." (photo: an engine block)
- **L2 · S20 — Malleable iron** "is used for heavy-duty bearing surfaces in automobiles, trucks, and railroad rolling stock." ·
  "It is also used for farm and construction machinery." · "Malleable iron is white iron that has been transformed by a
  heat-treatment process, providing a malleable and easily machined iron."
- **L2 · S21 — High-alloy irons** "are ductile, gray, or white irons that contain up to 35 percent alloy content." ·
  **High-chromium irons** "are oxidation and wear resistant." · **Nickel irons** "are nonmagnetic, have good corrosion
  resistance, and have an extremely low coefficient of thermal expansion."
- Counting: the slide says "six kinds" — gray, ductile, white, CGI, malleable, high-alloy (high-alloy has two examples:
  high-chromium and nickel irons).

## Zone `bend` — Sheet Metal Bending (Lecture 3)

- **L3 · S2 — Metal Forming** (tree): Liquid State Forming · Fluid State Forming (dashed) · Plastic State Forming · Solid State Forming.
- **L3 · S3 — 3- Solid State Forming** (exact):
  - "Solid state forming is the shaping of metal sheet, rod, wire, or tube, usually performed as cold working"
  - "In some cases, heating the metal may be required if it is thick, is not very ductile, or becomes work-hardened during forming."
  - "A piece of metal whose thickness is between 0.006(0.15 mm) and 0.25 inches(6.35 mm) called sheet metal."
  - "Anything thinner is referred to as a foil and thicker is considered as a plate."
  - "During the forming process, some metals can become brittle and may require annealing before the forming operation is continued."
- **L3 · S4:** sheet and plate parts for: automobiles and trucks · airplanes · railway cars and locomotives · farm and
  construction equipment · small and large appliances · office furniture · computers and office equipment.
  **Sheet Metalworking Terminology:** "Punch-and-die - tooling to perform cutting, bending, and drawing" · "Stamping press -
  machine tool that performs most sheet metal operations" · "Stampings - sheet metal products".
- **L3 · S5 — Metal shape:** "Metal can be provided in various shapes and sizes." Pictured: Round Solid · Square Solid ·
  Hexagonal Solid · Angle Iron Solid · Round Hollow (Tube) · Square Hollow (Box Iron) · Hexagonal Hollow · Angle Iron Hollow.
- **L3 · S6 — Solid State Forming** (tree with cost): **Simple Bending — Low to Moderate Cost**: Bend, Roll, Continuous Roll
  Forming · **Compound Bending — Moderate to High Cost**: Spinning, Hydro-forming, Drawing · **Form and Cut (Stamping) —
  High Cost**: Progressive, Transfer Dies, Multiple Action Dies.
- **L3 · S7 — 3-1- Simple Bending · 3-1-1- Sheet Metal Bending:** "Bending is a metal forming process in which a force is
  applied to a piece of sheet metal, causing it to bend at an angle and form the desired shape." · "Metal on inside of
  neutral plane is compressed, while metal on outside of neutral plane is stretched" · "Figure (b) both compression and
  tensile elongation of the metal occur in bending."
- **L3 · S8** (figure): Tension (outside, red) · Compression (inside, blue) · Bend line · Neutral axis · Bend allowance ·
  t and T · K factor = t/T · Flat length.
- **L3 · S9 — SHEET METAL PARAMETERS:** Bend Allowance · Bend Deductions · K-Factor · Bend Relief · Thickness · Bend Radius ·
  Spring Back. **BEND ALLOWANCES:** "length of neutral axis in bend area." "Bend allowances are calculated using a K-factor".
- **L3 · S10** (figure): **Lt = A + B + BA** ("Lt is the total flat length; A and B are shown in the illustration; BA is the
  bend allowance value") · **Lt = A + B − BD** ("BD is the bend deduction value"). In the figure A and B are the two leg
  lengths; for BA they are measured to where the flat legs end (start of the bend), for BD to the outside corner
  (the virtual sharp). Say only what the slide shows.
- **L3 · S11 — K-FACTOR:** "K-factor is a ratio that represents the location of the neutral sheet with respect to the
  thickness of the sheet metal part." Figure: **K Factor = t/T** (t = distance from the inside surface to the neutral axis,
  T = the sheet thickness, as drawn).
- **L3 · S12 — AUTO RELIEF:** "The size and shape of the relief cut is much important for sheet metal bending. However,
  Sheet metal process relief is most important for the accurate bending. For rectangle and ob-round reliefs, The size can
  be determine by ratio to the material thickness, or values can be specified for width and depth." Figure 5 auto relief
  types: **A) Tear-rip · B) Obround · C) Rectangle**.
- **L3 · S13 — BEND RADIUS:** "Inside curvature, is the minimum radius one can bend a pipe, tube, sheet, cable or hose
  Without kinking it, damaging it, or shortening its life." Figure labels: Setback · Bend allowance Lb · Length of bend L ·
  Bend radius R · Bend angle · Bevel angle · Neutral axis · t.
- **L3 · S14 — Types of Sheet Metal Bending · V-bending** "performed with a V-shaped die": "For low production" ·
  "Performed on a press brake" · "V-dies are simple and inexpensive" · "Air bending: If the punch does not force the sheet to
  the bottom of the die cavity, leaving space or air underneath, it is called "air bending"." Figure (a): punch, die, sheet;
  Air Bending vs Bottoming.
- **L3 · S15 — Edge Bending:** "For high production" · "Pressure pad required" · "Dies are more complicated and costly".
  Figure (b): pressure pad (Fh), punch (F), die.
- **L3 · S16 — Spring back:** "Increase in included angle of bent part relative to included angle of forming tool after tool
  is removed" · Figure: "Springback in bending is seen as a decrease in bend angle and an increase in bend radius: (1) during
  bending, the work is forced to take radius Rb and included angle αb' of the bending tool, (2) after punch is removed, the
  work springs back to radius R and angle α'."
  (Note: the *included* angle gets bigger while the *bend* angle gets smaller — the same fact said two ways. Teach both.)
- **L3 · S17–S18:** a press brake in use; a chart of press-brake die profiles (no text).
- **L3 · S19 — Bending Operations:** Straight flanging · Stretch flanging · Shrink flanging · Hemming · Seaming · Curling
  (drawings only, no definitions on the slide).
- **L3 · S20 — 3-1-2 Roll forming sheet:** "Roll forming sheet on one axis is an inexpensive operation." · "Hand-operated
  machines with an adjustable roll provide a range of rolling radii (r)." · "These machines are typically used in small model
  shops." (figure: three rolls; S21–S22 slip roll machines)
- **L3 · S23 — 3-1-3 Continuous Roll Forming:** "Roll forming is a continuous bending operation in which a long strip of sheet
  metal is passed through sets of rolls mounted on consecutive stands, each set performing only an incremental part of the
  bend, until the desired cross-section profile is obtained." · "Roll forming is ideal for producing constant-profile parts
  with long lengths and in large quantities." (S24: roll-formed profiles)
- **L3 · S25 — 3-1-3 Wire and Tube Forming:** "forming wire requires special tooling but is an economical production process." ·
  "Formed and spot-welded wire is strong and has applications in many industries." · "forming tubes and other hollow sections
  require an internal support called a mandrel to prevent buckling of tubes during the bending process."
  (S26: wrought-iron scrollwork; S27: a video still; S28: ring/tube benders)

## Zone `compound` — Compound Bending (Lecture 4)

- **L4 · S2:** Solid State Forming → Compound Bending (Moderate to High Cost) → Spinning · Hydro-forming · Drawing.
- **L4 · S3 — 3-2- Compound Bending · 3-2-1- Spinning** (exact):
  - "Spinning is commonly used to produce symmetrical, cup like shapes discs."
  - "Metal spinning is a forming process that produces hollow parts that are typically circular in cross-section."
  - "The basic metal spinning process starts with a flat metal disc (blank), which rotates on a lathe."
  - "A forming tool forces the metal sheet onto a wooden or metal pattern as it spins on a special lathe."
  - "The maximum diameter of cup at bottom of shape and then thickness of metal is reduced in the side of walls."
  - "The basic metal spun shapes are the hemisphere, cone, cylindrical shell."
  - "Flow forming assignment report." (an assignment, not content)
- **L4 · S4 — spinning forming process** (figure labels): Head stock · Spindle · Mandrel · Sheet metal · Clamp · Tail stock · Roller tool.
- **L4 · S5 — Some of Spinning products example:** Ball, Bowl, Cap, Cone, Domed End Cap, Ferrule, Flag Base Stand, Funeral Urn,
  Garbage Lid, Hopper, Lid, Metal Housing, Recessed Lighting, Roof Flashing, Roof Drain, Spear Top, Tank Head, Trumpet Base,
  Vacuum Drum Head, Venturi.
- **L4 · S6 — Some of Spinning profiles example:** Dished · Domed · Domed with flange · Flanged · Flanged and flued · Flanged,
  dished and flued · Flanged and dished · Hemisphere · Semi-elliptical · Tube cap · Trumpet.
- **L4 · S8 — 3-2-2- Hydroforming (Fluid Forming):** "Hydroforming is an economical way to form malleable sheet into
  lightweight, structurally stiff, and strong compound shapes." · "The process uses water pressure, which allows complex
  shapes with concavities to be formed; this would be difficult or impossible with standard solid die stamping." ·
  "hydroforming an ideal process for low to mid-range production." · "There are two types of Hydro forming. 1. Tube Hydro
  forming 2. Sheet Hydro forming".
- **L4 · S9 — Tube Hydroforming:** six-step figure (a–f): the tube goes into the die, the die closes, it fills with fluid,
  axial forces (F axial) push the ends while pressure inside expands the tube into the die shape, the part comes out.
- **L4 · S10 — SHEET HYDROFORMING:** "Sheet steel is forced into a female cavity by water under pressure from a pump or by
  press action" · "Sheet steel is deformed by a male punch, which acts against the fluid under pressure." (S11 steps 1–3 with
  WATER; final product: a car frame rail; S12–S13 hydroformed parts and a press)
- **L4 · S14 — 3-2-2- Drawing and Deep Drawing:** "Sheet metal forming to make cup-shaped, box-shaped, or other complex-curved,
  hollow-shaped parts" · "Sheet metal blank is positioned over die cavity and then punch pushes metal into opening" ·
  "Products: beverage cans, automobile body panels" · "Also known as deep drawing (to distinguish it from wire and bar drawing)".
- **L4 · S15** (figure): Drawing force · Holding force · Punch · Blank · Blank holder · Die. **S16:** three stages, Blank → Drawn
  part. **S17:** a drawn cup, a drawn double sink. **S18:** a press in a factory.

## Zone `cut` — Metal Cutting (Lecture 5)

- **L5 · S2 — Metal Cutting** (tree): Cutting → **Punching and Shearing** · **Chip Forming** · **Nonchip Forming** ·
  **Thermal/Flame Cutting**. "In the sheet metal industry the words shear, blank, nibble, or punch are used to describe hole
  making in sheet metal." · "In addition to the standard operations, laser cutting of sheet metal is now standard in the industry."
- **L5 · S3:** "When cutting into a block of metal (using a chip-forming cutter), the word machining is used to describe the
  processes, even though a specific cutter or cutting tool is used." · "The word machining is used because a special machine
  (that powers the cutting tool) is required to achieve a cut to a given precise tolerance." · "In nonchip forming cutting,
  chemical, chemical/electrical, electrical, mechanical, and/or thermal processes are used to cut materials." · "Thermal
  cutting processes use gas, laser, and/or plasma."
- **L5 · S4 — 1- Sheet Punching and Shearing:** "Sheet metal punching or shearing is limited to sheet 0.635 mm." thick (T) or
  less." (⚠ as written: "0.635 mm."" — 0.635 cm = 0.25 in = 6.35 mm, the sheet/plate limit from Lecture 3; quote the slide,
  don't build a trick question on it) · "Sheet metal is important in industrial design, especially in office products and
  equipment design, including computers, copiers, and a large array of industrial, medical, and research equipment." ·
  "Three principal operations in press working that cut sheet metal: **Shearing** to separate large sheets · **Blanking** to
  cut part boundaries out of sheet metal · **Punching/ Piercing** to make holes in sheet metal".
- **L5 · S5 — 1-1- Shearing:** "Shearing is a process for cutting sheet metal to size out of a larger stock." · "The shearing
  process is a scissor-like action between a punch and a die" · "The quality of the cut depends on the "c" clearance." ·
  "If clearance is too small, break lines pass each other, causing double buffing and larger force" · "If too large, metal
  is pinched and bent between cutting edges." (S6: shearing machines)
- **L5 · S7:** "Clearance between Punch and Die or Clearance between two cutting blades" · "CLEARANCE = THE MEASURED SPACE
  BETWEEN THE MATING MEMBERS OF A DIE SET (C)". Figure: punch P (width d1) between die halves D (opening d), **C/2** on each
  side (so the opening d = d1 + C).
- **L5 · S9 — 1-2 – Punching & Blanking Operations:** "In this operation, the workpiece is stressed beyond its ultimate
  strength. The stresses caused in the metal by the applied forces will be shearing stresses." · "Punch A convex tool for
  making holes by shearing, or making surface or displacing metal with a hammer." · "Die A concave die, which is the female
  part as opposed to punch which is the male part."
- **L5 · S10** (figure): Punching force · Punch · Sheet metal · Clearance · Scrap / slug · Die.
- **L5 · S12 — The cutting operations include:** Punching (Piercing) · Blanking · Fine blanking · Notching · Perforating ·
  Slotting · Slitting · Lancing · Parting · Cutoff · Shaving · Trimming · Embossing · Coining (14 on the list; Nibbling is
  defined later too).
- **L5 · S13 — 1-2-1- Punching (Piercing):** "It is a cutting operation by which various shaped holes are made in sheet metal.
  Punching is similar to blanking except that in punching, the hole is the desired product, the material punched out to form
  the hole being waste." · **1-2-2- Blanking:** "Blanking is the operation of cutting a flat shape sheet metal. The article
  punched out is called the blank and is the required product of the operation. The hole and metal left behind is discarded
  as waste." (figure: Punching vs Blanking, "Discarded")
- **L5 · S14 — Fine Blanking:** "A second force is applied under the sheet, directly opposite the punch, by a "ejector"." ·
  "This technique produces a part with better flatness and smoother edges." (figure: holding force, blanking force,
  impingement ringfinger, guide plate, cushion/ejector, counterforce, burr, sheared edge, die roll, flatness)
- **L5 · S15 — Notching:** "Punching the edge of a sheet, forming a notch in the shape of a portion of the punch." ·
  **Perforating:** "Punching a close arrangement of a large number of holes in a single operation."
- **L5 · S16 — Slotting:** "A punching operation that forms rectangular holes in the sheet." · **Lancing:** "Creating a partial
  cut in the sheet, so that no material is removed. The material is left attached to be bent and form a shape, such as a
  tab, vent, or louver."
- **L5 · S17 — Slitting:** "Cutting straight lines in the sheet. No scrap material is produced." (figure: upper knife, lower knife)
- **L5 · S18 — Cutoff:** "Separating a part from the remaining sheet, without producing any scrap." · "The punch will produce a
  cut line that may be straight, angled, or curved." (figure: CUTOFF VS PARTING — parting leaves wasted material between parts)
- **L5 · S19 — Parting:** "Parting involves cutting a sheet metal strip by a punch with two cutting edges that match the
  opposite sides of the blank." · **Shaving:** "Shearing away minimal material from the edges of a feature or part, using a
  small die clearance. Used to improve accuracy or finish. Tolerances of ±0.025 mm are possible."
- **L5 · S20 — Trimming:** "Punching away excess material from the perimeter of a part, such as trimming the flange from a drawn
  cup." · **Nibbling:** "Punching a series of small overlapping slits or holes along a path to cut-out a larger contoured shape."
- **L5 · S21 — Embossing:** "Creates hollows in sheet, such as elevated (or indented) lettering or reinforcement ribs" · "Certain
  designs are embossed on the sheet metal." · "Punch and die are of the same contour but in opposite direction." (figure:
  MALE / FEMALE)
- **L5 · S22 — Coining:** "Similar to embossing with the difference that similar or different impressions are obtained on both
  the sides of the sheet metal." (photos: coining dies, a coin)

---

## Things the slides never say (don't invent them)
- No numbers for K-factor values, clearance percentages, springback amounts, or bend allowance formulas beyond the two
  Lt equations and K = t/T. Calculations in questions must use only these, with numbers you choose that make sense
  (e.g. A = 40 mm, B = 30 mm, BA = 5 mm → Lt = 75 mm).
- No definitions of flanging, hemming, seaming, curling, progressive / transfer / multiple-action dies — only names and
  drawings. A lesson may describe what the drawing shows; a question may only ask to recognise the name/drawing.
- No ranking of materials by property values. Don't ask "which is harder, X or Y" unless a slide says it (it says: cast iron
  is brittle; soft steel and wrought iron are malleable; gray iron has poor tensile, high compressive strength; nickel irons
  have extremely low thermal expansion; steel is the exception to the expansion rule).
