// Lesson — props (English edition). Same chapters, ids, scenes, blocks, checks and demos as props.js.
// Lecture 2 · slides 11–15. Drawings and demos: _props-kit.js.
import { hardnessArt, ductileArt, brittleArt, beamArt, toughArt, malleableArt, castArt, resilienceArt, machineArt, weldArt, PHYS_ICON, domainsArt, rustArt, uvArt, wireSheet, changeIt, heatBars } from './_props-kit.js';

/* the demos' words (English) */
const WS = {
  aria: 'A metal bar being pulled or rolled', matLabel: 'Material', actLabel: 'What do you do to it?',
  mats: { soft: ['Metal A', 'ductile and malleable'], cast: ['Cast iron', 'brittle'] },
  acts: { pull: ['Pull it', 'a tensile load'], roll: ['Roll or hammer it', 'to make a sheet'] },
  idle: 'Pick a material, then pull it or roll it.',
  out: {
    soft_pull: ['A fine wire', 'That’s ductility: fine wire without fracture.'],
    soft_roll: ['A sheet', 'That’s malleability: rolled or hammered into sheets.'],
    cast_pull: ['Snap!', 'Brittleness, the opposite of ductility: it broke without stretching.'],
    cast_roll: ['Cracked!', 'Cast iron is brittle: it cracks instead of spreading into a sheet.']
  }
};
const CH = {
  aria: 'A metal bar being hammered cold or heat-treated',
  mechT: 'Mechanical', physT: 'Physical',
  mech: ['Hardness', 'Ductility', 'Toughness', 'Machinability'], phys: ['Density', 'Color', 'Melting point', 'Thermal conductivity'],
  work: ['Hammer it cold', 'Work hardening: the mechanical properties changed; the physical ones stayed put.'],
  heat: ['Heat-treat it', 'Heat treatment: same story. Mechanical changed, physical stayed.'],
  changed: 'changed', same: 'unchanged', idle: 'Try both buttons and watch the two columns.'
};
const HB = {
  aria: 'Two bars being heated: one with a low melting point, one with a high melting point',
  heat: 'Heat', low: 'low melting point', high: 'high melting point', unit: '1/°C · 1/°F', steel: 'Steel is the exception',
  read: {
    cold: ['Cold', 'Both are at their starting length (the dashed line).'],
    warm: ['Warming up', 'The low-melting one is expanding more.'],
    hot: ['Very hot', 'The difference is clear: higher melting point, less expansion.'],
    melt: ['Melted!', 'It reached its melting point: the energy separated its atoms and it turned liquid.']
  }
};

export default {
  zone: 'props',
  hero: { say: 'Every metal has a character. One draws into wire, one spreads into sheet, one breaks at the first blow. This zone introduces those characters, by the names the exam uses.' },
  chapters: [
    {
      id: 'pr-hardness', title: 'Hardness: nothing scratches it', en: 'Hardness', ref: 'L2 · S11', scene: 'hardness',
      blocks: [
        { t: 'say', who: 'usta', text: 'Take a nail and scratch a surface. If the nail leaves a mark easily, the surface is soft. If it doesn’t, the surface is hard. That’s the whole idea.' },
        { t: 'p', text: 'We are still in the **Mechanical Properties**. The stress zone was the first part of the list; this is the rest of it.' },
        { t: 'quote', text: 'Hardness is the ability of a material to resist penetration and scratching.', ref: 'L2 · S11' },
        { t: 'art', html: hardnessArt(), caption: 'One sharp tip tries to dig in, another tries to scratch. A hard material resists both.' },
        { t: 'p', text: 'Two words: **penetration** is something pointed trying to dig in. **Scratching** is something trying to mark the surface.' },
        { t: 'check', q: 'pr01' },
        { t: 'trap', text: 'Hardness is not toughness. Hardness = resisting **penetration and scratching**. Toughness = resisting **fracture from a blow**. The exam loves putting them side by side.', wrong: 'Hardness = resisting fracture against hammer blows', right: 'Hardness = the ability to resist penetration and scratching' },
        { t: 'check', q: 'pr03' },
        { t: 'tip', text: 'Hardness = scratch and dent. If the question says penetration or scratching, the answer is hardness.' }
      ]
    },
    {
      id: 'pr-ductile', title: 'Ductility vs brittleness: wire or shards', en: 'Ductility vs brittleness', ref: 'L2 · S11', scene: 'ductile',
      blocks: [
        { t: 'say', who: 'usta', text: 'Pull a piece of metal. One kind gets longer and thinner until it’s a wire. Another snaps in two without stretching. The first is ductile; the second is brittle.' },
        { t: 'quote', text: 'Ductility: It is the ability of a material to be deformed plastically without rupture under tensile load. Due to this property material can lengthy into fine wire without fracture.', ref: 'L2 · S11' },
        { t: 'p', text: 'Spot three phrases: **plastically** (a permanent change, like plasticity in the stress zone), **without rupture** (it doesn’t tear), **under tensile load** (while being pulled). The result: **fine wire**. The slide’s “lengthy” means “be drawn out longer”.' },
        { scene: 'brittle', t: 'quote', text: 'Brittleness is the property of a material opposite to ductility. So cast iron is a brittle material.', ref: 'L2 · S11' },
        { t: 'compare', left: { title: 'Ductile', en: 'Ductility', art: ductileArt(), text: 'The same pull: it stretches and thins until it is a **fine wire**, without breaking.' }, right: { title: 'Brittle', en: 'Brittleness', art: brittleArt(), text: 'The same pull: it **snaps** in two, almost without stretching. Like cast iron.' }, note: 'Same load. One draws into wire; the other breaks.' },
        { t: 'check', q: 'pr04' },
        { t: 'trap', text: 'A question says “opposite to ductility” and offers malleability or elasticity. The slide is clear: the opposite of ductility is **brittleness**.', wrong: 'Brittleness is the opposite of malleability', right: 'Brittleness is the property of a material opposite to ductility' },
        { t: 'check', q: 'pr06' },
        { t: 'tip', text: 'Ductile = wire. Brittle = shards. The slide’s only example: cast iron is brittle. (You’ll meet it in detail in the cast-iron zone.)' }
      ]
    },
    {
      id: 'pr-bending', title: 'Bending: outside pulls, inside squeezes', en: 'Bending', ref: 'L2 · S11', scene: 'neutralAxis', cap: ['Bending', 'Outside in tension, inside in compression', 'Outside in tension, inside in compression'],
      blocks: [
        { t: 'say', who: 'usta', text: 'Hold a plastic ruler and bend it. The outer face stretches. The inner face gets squeezed. Both at the same moment.' },
        { t: 'quote', text: 'Bending is characterized by the outside fibers of a beam in tension and the inside fibers in compression.', ref: 'L2 · S11' },
        { t: 'art', html: beamArt(), caption: 'A beam with a load in the middle. The bottom face (the outside of the bend) stretches. The top face (the inside) is squeezed.' },
        { t: 'p', text: '**Fibers**: picture the part made of many long threads. A **beam** is a long part carrying a load. The dashed middle line is what sheet-metal bending calls the neutral axis.' },
        { t: 'check', q: 'pr08' },
        { t: 'trap', text: 'The exam flips them. **Outside = tension** (stretched). **Inside = compression** (squeezed). And notice: the slide describes bending with only two of the four loads: tension and compression.', wrong: 'Outside fibers in compression, inside fibers in tension', right: 'Outside fibers in tension, inside fibers in compression' },
        { t: 'check', q: 'pr09' },
        { t: 'tip', text: 'Outside = stretched = tension. Inside = squeezed = compression. You’ll see the same thing in sheet-metal bending (Lecture 3).' }
      ]
    },
    {
      id: 'pr-tough', title: 'Toughness: it takes the blow and doesn’t break', en: 'Toughness', ref: 'L2 · S12', scene: 'tough',
      blocks: [
        { t: 'say', who: 'usta', text: 'A hammer head takes thousands of blows. If it were brittle, it would have crumbled on day one. What keeps it going: toughness.' },
        { t: 'quote', text: 'Toughness is the ability of a material to resist deformation under stress. is the property of a material to resist fracture against impact load like hammer blows. This property of material is decreased when they heated.', ref: 'L2 · S12' },
        { t: 'art', html: toughArt(), caption: 'A hammer blow: the tough plate dents a little, but it does not break.' },
        { t: 'list', style: 'check', items: ['resists deformation under stress', 'resists fracture against impact load like hammer blows', 'is decreased when heated'] },
        { t: 'check', q: 'pr10' },
        { t: 'trap', text: '“Decreased when they heated” means heat lowers it. The exam may flip it to “increased”. No.', wrong: 'Toughness increases when the material is heated', right: 'This property of material is decreased when they heated' },
        { t: 'check', q: 'pr11' },
        { t: 'tip', text: 'Toughness = hammer. If you see hammer blows or impact load together with fracture, think toughness.' }
      ]
    },
    {
      id: 'pr-malleable', title: 'Malleability: it spreads into sheet', en: 'Malleability', ref: 'L2 · S12', scene: 'malleable',
      blocks: [
        { t: 'say', who: 'usta', text: 'The blacksmith heats a bar and hammers it, and it spreads out. The rolling mill passes a slab between rolls, and out comes sheet. The property that allows this: malleability.' },
        { t: 'quote', text: 'Malleability is the property of a material which allow the material to be rolled or hammered into sheets. soft steel and wrought iron are examples of malleable materials.', ref: 'L2 · S12' },
        { t: 'art', html: malleableArt(), caption: 'Two ways, one result: rolled between two rolls, or hammered on an anvil. Both give a sheet.' },
        { t: 'demo', id: 'pr-wire-demo', title: 'Wire or sheet?', caption: 'Pick a material, then pull it or roll it. Try all four combinations. Pulling reveals ductility, rolling reveals malleability, and cast iron reveals brittleness.', mount: wireSheet(WS) },
        { t: 'check', q: 'pr12' },
        { t: 'compare', left: { title: 'Ductility', en: 'Ductility', text: 'Under a **tensile load**. The result: a **fine wire**.' }, right: { title: 'Malleability', en: 'Malleability', text: '**Rolled or hammered**. The result: **sheets**.' }, note: 'Wire = ductility. Sheet = malleability.' },
        { t: 'trap', text: 'The most famous mix-up in the lecture: ductility and malleability. Remember the result: wire or sheet? And the slide’s malleable examples: soft steel and wrought iron.', wrong: 'Malleability = drawn into fine wire', right: 'Malleability = rolled or hammered into sheets; ductility = fine wire' },
        { t: 'check', q: 'pr14' },
        { t: 'tip', text: 'Malleable sounds like **mallet**: hammer it flat into a sheet. Ductile: draw it out into a wire.' }
      ]
    },
    {
      id: 'pr-castable', title: 'Castability: how it behaves when molten', en: 'Castability', ref: 'L2 · S12', scene: 'castable',
      blocks: [
        { t: 'say', who: 'usta', text: 'Some metals pour into a mould like water and fill every corner. Others are sluggish. That difference is called castability.' },
        { t: 'quote', text: 'Castability of metal refer to the ease with which it can be cast into different shapes and is concerned with the behavior of metal in its molten state.', ref: 'L2 · S12' },
        { t: 'art', html: castArt(), caption: 'Molten metal pours from the ladle into the mould. It has to reach every detail of the shape.' },
        { t: 'example', title: 'A kitchen tap body', text: 'A tap body is a complex shape: curves and hollows. Shapes like that are made by casting, so the designer picks a metal with good castability that fills the whole mould.' },
        { t: 'check', q: 'pr15' },
        { t: 'trap', text: 'Castability is about the metal **while molten**. The properties before it (hardness, ductility…) are about the metal as a solid.', wrong: 'Castability is concerned with the metal in its solid state', right: 'Castability is concerned with the behavior of metal in its molten state' },
        { t: 'tip', text: 'Cast = pour. Molten = liquid metal. See the two words together: pick castability.' }
      ]
    },
    {
      id: 'pr-resilience', title: 'Resilience: it takes the shock and springs back', en: 'Resilience', ref: 'L2 · S13', scene: 'resilience',
      blocks: [
        { t: 'say', who: 'usta', text: 'The spring in an office chair. Drop into the seat: it absorbs the knock and goes back to how it was. That’s resilience.' },
        { t: 'quote', text: 'RESILIENCE: It is a property of material to absorb energy and to resist shock and impact loads. It is measured by the amount of energy absorbed per unit volume within the elastic limit.', ref: 'L2 · S13' },
        { t: 'art', html: resilienceArt(), caption: 'A weight lands on a spring: it squeezes, absorbs the energy, then springs back to its shape.' },
        { t: 'compare', left: { title: 'Toughness', en: 'Toughness', text: 'Resists **fracture** against an impact load like hammer blows. The question: did it break?' }, right: { title: 'Resilience', en: 'Resilience', text: '**Absorbs energy** and resists shock. Measured **within the elastic limit**: it comes back.' }, note: 'Both involve a shock. Toughness = it doesn’t break. Resilience = it absorbs and springs back.' },
        { t: 'check', q: 'pr17' },
        { t: 'why', text: 'Within the elastic limit, the part stores the energy like a spring and gives it back when the load goes. That’s why it is measured within the elastic limit: the energy the part can take and still come back.' },
        { t: 'trap', text: '“Within the elastic limit” is the key. If the energy was absorbed and the part came back to its shape, it’s resilience. If the question is about breaking under hammer blows, it’s toughness.', wrong: 'Resilience is measured within the plastic range', right: 'Resilience is measured by the energy absorbed per unit volume within the elastic limit' },
        { t: 'check', q: 'pr19' }
      ]
    },
    {
      id: 'pr-machine', title: 'Machinability and weldability', en: 'Machinability · weldability', ref: 'L2 · S13', scene: 'machinable',
      blocks: [
        { t: 'say', who: 'usta', text: 'A designer doesn’t only pick a material that looks good. They ask: will it machine easily? Will it weld? Two properties answer that.' },
        { t: 'quote', text: 'MACHINABILITY: The ease with which a given material may be worked or shaped with a cutting tool is called machinability. Machinability depends on chemical composition, structure and mechanical properties.', ref: 'L2 · S13' },
        { scene: 'weldable', t: 'quote', text: 'WELDABILITY: It is the ability of material to be joined by welding. Weldability depends on chemical composition, physical properties and heat treatment to which they are subjected.', ref: 'L2 · S13' },
        { t: 'compare', left: { title: 'Machinability', en: 'Machinability', art: machineArt(), text: 'A **cutting tool** takes chips off and shapes the part.' }, right: { title: 'Weldability', en: 'Weldability', art: weldArt(), text: 'Two parts **joined by welding** with a bead.' } },
        { t: 'table', head: ['', 'Machinability', 'Weldability'], rows: [
          ['1', 'chemical composition', 'chemical composition'],
          ['2', 'structure', 'physical properties'],
          ['3', 'mechanical properties', 'heat treatment']
        ] },
        { t: 'check', q: 'pr20' },
        { t: 'check', q: 'pr21' },
        { t: 'trap', text: 'Both start with **chemical composition**. Then they split: machinability → **structure** and **mechanical properties**; weldability → **physical properties** and **heat treatment**.', wrong: 'Machinability depends on heat treatment', right: 'Machinability depends on chemical composition, structure and mechanical properties' },
        { t: 'check', q: 'pr23' },
        { t: 'tip', text: '**M**achinability → **M**echanical. Welding is hot → heat treatment and physical properties.' }
      ]
    },
    {
      id: 'pr-physical', title: 'Physical properties: hard to change', en: 'Physical properties', ref: 'L2 · S14', scene: 'physical',
      blocks: [
        { t: 'say', who: 'usta', text: 'So far, mechanical properties. Now the second group: **physical properties**. These are the character a material is born with.' },
        { t: 'quote', text: 'Physical properties are inherent aspects of a material that are generally not easily altered. Physical properties generally remain intact, whereas mechanical properties are changed by work hardening and/or through heat treatment.', ref: 'L2 · S14' },
        { t: 'demo', id: 'pr-change-demo', title: 'Change it if you can', caption: 'Hammer the bar cold, or put it in the furnace. Watch the mechanical column change while the physical column stays put.', mount: changeIt(CH) },
        { t: 'check', q: 'pr24' },
        { t: 'quote', text: 'Opacity/transparency is the ability to transmit light. Color is the characteristic reflected wavelength. Density is weight per unit volume (specific gravity). Electrical conductivity is the ease with which a material conducts a current. Thermal conductivity is the ease with which heat flows within and through a material.', ref: 'L2 · S14' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'Opacity/transparency', en: 'light', text: 'Does it let light through? “the ability to transmit light”', art: PHYS_ICON.opacity },
          { title: 'Color', en: 'wavelength', text: 'The wavelength that bounces off it. “the characteristic reflected wavelength”', art: PHYS_ICON.color },
          { title: 'Density', en: 'weight ÷ volume', text: 'How heavy for its size. “weight per unit volume (specific gravity)”', art: PHYS_ICON.density },
          { title: 'Electrical conductivity', en: 'current', text: 'How easily a **current** passes. “conducts a current”', art: PHYS_ICON.electric },
          { title: 'Thermal conductivity', en: 'heat', text: 'How easily **heat** flows through it. “heat flows within and through”', art: PHYS_ICON.thermal },
          { title: 'The rest is on slide 15', en: 'expansion · magnetism · melting · corrosion', text: 'Thermal expansion, ferromagnetism, melting point and corrosion resistance. The next chapters.', art: PHYS_ICON.expansion }
        ] },
        { t: 'check', q: 'pr26' },
        { scene: 'conductivity', t: 'trap', text: 'Electrical or thermal? Both start “the ease with which”. Electrical: **conducts a current**. Thermal: **heat flows within and through**.', wrong: 'Thermal conductivity = the ease with which a material conducts a current', right: 'Thermal conductivity = the ease with which heat flows within and through a material' },
        { t: 'check', q: 'pr30' },
        { t: 'tip', text: 'Mechanical = they change (work hardening, heat treatment). Physical = they stay (inherent).' }
      ]
    },
    {
      id: 'pr-expansion', title: 'Thermal expansion and melting point', en: 'Thermal expansion · melting point', ref: 'L2 · S15', scene: 'expansion',
      blocks: [
        { t: 'say', who: 'usta', text: 'Railway rails are laid with small gaps between them. Why? Because they grow in summer heat. Without the gaps, they would jam into each other and buckle.' },
        { t: 'quote', text: 'Thermal expansion is expressed in units of 1/°F or 1/°C. Generally, the coefficient of thermal expansion is inversely proportional to the melting point of a material: higher-melt temperature materials have less expansion. Steel is a significant exception.', ref: 'L2 · S15' },
        { t: 'demo', id: 'pr-heat-demo', title: 'Heat the two bars', caption: 'Turn up the heat. The growth is drawn exaggerated so you can see it. The low-melting bar grows more… until it reaches its melting point.', mount: heatBars(HB) },
        { t: 'p', text: 'So: **high melting point → little expansion**, and **low melting point → more expansion**. That’s what “inversely proportional” means. And the unit 1/°C is one over a degree, not a degree.' },
        { t: 'check', q: 'pr32' },
        { scene: 'melting', t: 'quote', text: 'Melting point is the energy required to separate a material’s atoms, changing its state from solid to liquid.', ref: 'L2 · S15' },
        { t: 'check', q: 'pr36' },
        { t: 'trap', text: '“Inversely” means the opposite way round. The exam may say “directly proportional” or “more expansion”. No: higher melting point, less expansion. And don’t forget the exception: “Steel is a significant exception.”', wrong: 'Higher-melt temperature materials have more expansion', right: 'Higher-melt temperature materials have less expansion (steel is a significant exception)' },
        { t: 'check', q: 'pr34' },
        { t: 'tip', text: 'The slide defines the melting point as an **energy** that separates the atoms. In the exam, write it exactly as the slide does.' }
      ]
    },
    {
      id: 'pr-magnet', title: 'Ferromagnetism: the atoms line up', en: 'Ferromagnetism', ref: 'L2 · S15', scene: 'magnet',
      blocks: [
        { t: 'say', who: 'usta', text: 'Bring a magnet near an iron nail and it pulls it. The secret is inside the iron: atoms lining up in groups called domains.' },
        { t: 'quote', text: 'Magnetic/nonmagnetic/ferromagnetism is the alignment of iron, nickel, and cobalt atoms into domains.', ref: 'L2 · S15' },
        { t: 'art', html: domainsArt(), caption: 'Inside the metal are small regions (domains). At first each points its own way. Magnetised, they all line up.' },
        { t: 'p', text: 'Only three elements on the slide: **iron**, **nickel** and **cobalt**. **Domains** are small regions inside the metal where the atoms all point the same way.' },
        { t: 'check', q: 'pr37' },
        { t: 'trap', text: 'The slide doesn’t mention copper or aluminium. The list is iron, nickel and cobalt. That’s it.', wrong: 'Ferromagnetism is the alignment of iron, copper and aluminium atoms', right: 'Ferromagnetism is the alignment of iron, nickel, and cobalt atoms into domains' },
        { t: 'tip', text: 'Remember the trio as their symbols in a row: **Fe · Ni · Co** (iron, nickel, cobalt).' }
      ]
    },
    {
      id: 'pr-corrosion', title: 'Corrosion resistance: the surface fights back', en: 'Corrosion resistance', ref: 'L2 · S15', scene: 'corrosion',
      blocks: [
        { t: 'say', who: 'usta', text: 'An iron railing on a seaside street. After a year, rust everywhere: oxygen and salt attacked the surface. Resisting that is called corrosion resistance.' },
        { t: 'quote', text: 'Corrosion resistance is the ability to resist surface deterioration caused primarily by oxygen, chemicals, or other agents. (Degradation in plastics can also be caused by ultraviolet light, moisture, and other environmental factors.)', ref: 'L2 · S15' },
        { t: 'compare', left: { title: 'Metals', en: 'oxygen · chemicals', art: rustArt(), text: 'The main causes: **oxygen**, **chemicals** and other agents.' }, right: { title: 'Plastics', en: 'ultraviolet light · moisture', art: uvArt(), text: 'Also: **ultraviolet light**, **moisture** and other environmental factors.' }, note: 'The sentence in brackets on the slide is about plastics.' },
        { t: 'check', q: 'pr39' },
        { t: 'example', title: 'A plastic chair on the balcony', text: 'A plastic chair left in the sun for years: its colour fades and it turns brittle. That’s degradation from ultraviolet light.' },
        { t: 'check', q: 'pr40' },
        { t: 'table', head: ['Mechanical (S4–S13)', 'Physical (S14–S15)'], rows: [
          ['Strength · tension · compression · shear · torsion', 'Opacity/transparency · Color'],
          ['Elasticity · plasticity · yield strength', 'Density'],
          ['Hardness · ductility · brittleness · bending', 'Electrical · thermal conductivity'],
          ['Toughness · malleability · castability', 'Thermal expansion · ferromagnetism'],
          ['Resilience · machinability · weldability', 'Melting point · corrosion resistance']
        ] },
        { t: 'tip', text: 'That’s the last property in the lecture. This table is the whole map: mechanical on the left, physical on the right. Now try the “Mechanical or physical?” trial.' }
      ]
    }
  ]
};
