// Lesson — strength (English edition). Same chapters, ids, scenes, blocks, checks and demos as strength.js.
// Lecture 2 · slides 4–10. Drawings and demos: _strength-kit.js.
import { stressArt, fourLoadsArt, LOAD_ICON, lampArt, stoolArt, rivetArt, crankArt, bandArt, behaviorFig, curveArt, tsmfArt, yieldArt, elongationArt, loadPicker, curveRider, stretchMeter } from './_strength-kit.js';

/* the demos' words (English) */
const LP = {
  aria: 'A block under a load',
  idle: 'Pick one of the four loads.',
  names: { tension: ['Tension', 'pulled apart'], compression: ['Compression', 'pushed together'], shear: ['Shear', 'sliding past'], torsion: ['Torsion', 'twisted'] },
  lines: {
    tension: 'It gets longer and thinner in the middle. Two forces pull outward along one line.',
    compression: 'It gets shorter and fatter, bulging at the sides. Two forces push inward.',
    shear: 'The top half slides over the bottom half. The two forces are opposite but not on the same line.',
    torsion: 'The straight lines turn into a spiral. A torque twists it about its long axis.'
  }
};
const CR = {
  aria: 'A stress–strain curve, with a specimen being pulled below it',
  strain: 'Pull (strain)', release: 'Let go', reset: 'Start over',
  regions: {
    start: ['Move the slider to pull the specimen.', 'No load yet.'],
    elastic: ['Elastic behavior', 'Let go here and it springs back.'],
    yield: ['Yield strength', 'The end of the straight line.'],
    uniform: ['Uniform elongation', 'Plastic behavior: the whole specimen stretches evenly.'],
    uts: ['Ultimate tensile strength', 'The highest point.'],
    necking: ['Necking', 'One spot is getting thinner.'],
    fracture: ['Fracture!', 'The specimen broke.']
  },
  back: {
    elastic: ['Back to its own length.', 'You were below the yield strength: elastic behavior.'],
    plastic: ['It stayed longer.', 'You passed the yield strength: permanent deformation. The dashed line shows where it came back to.'],
    broken: ['It’s broken.', 'After fracture there’s no way back. Press “Start over”.']
  }
};
const SM = {
  aria: 'A specimen being stretched, with gauge marks 50 mm apart',
  len: 'Length after the pull',
  goal: 'Hit:',
  hit: (g, L) => `Exactly ${g}%: the length is ${L} mm.`,
  wrongBase: (L, w) => `Divide by ${L} by mistake: ${w}% (wrong)`
};

export default {
  zone: 'strength',
  hero: { say: 'Every piece of metal fights back. Pull it, squeeze it, shear it, twist it: it resists. This zone shows you what that resistance looks like… right up to the moment it breaks.' },
  chapters: [
    {
      id: 'st-stress', title: 'Stress: the metal pushes back from inside', en: 'Strength · stress', ref: 'L2 · S4', scene: 'stress',
      blocks: [
        { t: 'say', who: 'usta', text: 'Hang a heavy bag on a hook. The bag pulls the hook down. Inside, the hook holds itself together so it doesn’t come apart. That inside pull has a name: stress.' },
        { t: 'p', text: 'The lecture starts like this: **Properties of Metals**, and first of all the **Mechanical Properties**. The first property on the list is strength, or stress.' },
        { t: 'quote', text: 'Strength: The Internal Resistance offered by a part to an externally applied Force is called as Stress. It is the ability of a Material to resist the externally applied Forces with Breakdown or Yielding.', ref: 'L2 · S4' },
        { t: 'art', html: stressArt(), caption: 'The force comes **from outside** (orange). The metal answers **from inside** (the zone colour). That answer is the stress.' },
        { t: 'p', text: 'Two phrases carry the marks: **externally applied Force** is the force that comes from outside. **Internal Resistance** is the resistance that comes from inside. The force is the cause. The stress is the answer.' },
        { t: 'check', q: 'st01' },
        { t: 'trap', text: 'The exam likes to swap the two. The force is **outside**. The resistance is **inside**. Stress is the resistance, not the force.', wrong: 'Stress = the external force applied to a part', right: 'Stress = the internal resistance offered by a part to an externally applied force' },
        { t: 'check', q: 'st02' },
        { t: 'p', text: '**A note on the slide:** it says “with Breakdown or Yielding”. It means **without**: the material resists without breaking down or yielding. If you have to write the definition in the exam, the first sentence is the safe one: “The Internal Resistance offered by a part to an externally applied Force is called as Stress.”' },
        { t: 'tip', text: 'Force = outside. Stress = inside. And there are 4 ways to load a part: tension, compression, shear, torsion. That’s the next chapter.' }
      ]
    },
    {
      id: 'st-loads', title: 'Four ways to load a part', en: 'Tension · compression · shear · torsion', ref: 'L2 · S4', scene: 'fourLoads',
      blocks: [
        { t: 'say', who: 'usta', text: 'The slide draws 4 blocks. Same block, loaded a different way each time. And the way you load it decides how it deforms.' },
        { t: 'art', html: fourLoadsArt(), caption: 'Slide 4’s figure, drawn in shop lines. The orange arrows are the forces. The grid inside shows the deformation.' },
        { t: 'quote', text: 'Tension · Compression · Shear · Torsion', ref: 'L2 · S4 · figure' },
        { t: 'demo', id: 'st-loads-demo', title: 'Pick a load and watch the block', caption: 'Tap each load (or press 1 to 4). Watch the grid inside the block: it tells you what the deformation looks like.', mount: loadPicker(LP) },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Tension', en: 'pulled apart', text: 'Two forces pull outward along one line. The part gets **longer** and **thinner**.', art: LOAD_ICON.tension },
          { title: 'Compression', en: 'pushed together', text: 'Two forces push inward. The part gets **shorter** and **fatter**.', art: LOAD_ICON.compression },
          { title: 'Shear', en: 'sliding past', text: 'Two opposite forces **not on the same line**. One half slides past the other.', art: LOAD_ICON.shear },
          { title: 'Torsion', en: 'twisted', text: 'A **torque** twists the part about its long axis.', art: LOAD_ICON.torsion }
        ] },
        { t: 'check', q: 'st04' },
        { t: 'tip', text: 'Tension stretches. Compression shortens and fattens. Shear slides. Torsion twists.' }
      ]
    },
    {
      id: 'st-tension', title: 'Tension: the biggest load before it breaks', en: 'Tensile / tension strength', ref: 'L2 · S5', scene: 'tension',
      blocks: [
        { t: 'say', who: 'usta', text: 'A washing line, a lamp cable, a crane chain. All three do one job: they work in tension.' },
        { t: 'quote', text: 'Tensile/Tension strength is the maximum tensile (pulling apart) load that a material can resist before fracture.', ref: 'L2 · S5' },
        { t: 'example', title: 'The lamp cable', text: 'A pendant lamp hangs from the ceiling. Its weight pulls the cable down, and the ceiling holds it up. The cable in the middle is in tension. If the weight goes past the biggest pulling load the cable can take, the cable snaps.', art: lampArt() },
        { t: 'p', text: 'Three words in the definition carry the marks: **maximum** (the biggest load), **pulling apart** (trying to split the part), **before fracture** (before it breaks).' },
        { t: 'check', q: 'st06' },
        { t: 'check', q: 'st07' },
        { t: 'tip', text: 'Tensile = **pulling apart** = the maximum load **before fracture**.' }
      ]
    },
    {
      id: 'st-compression', title: 'Compression: how much does it deform?', en: 'Compression', ref: 'L2 · S5', scene: 'compression',
      blocks: [
        { t: 'say', who: 'usta', text: 'A table leg carries the table and everything on it. The load pushes down, the floor pushes up. The leg in between gets squeezed.' },
        { t: 'quote', text: 'Compression is a measure of the extent to which a material deforms under a compressive load prior to fracture.', ref: 'L2 · S5' },
        { t: 'example', title: 'A stool under a heavy crate', text: 'The crate pushes the seat down. The floor pushes the legs up. The legs are squeezed: a little shorter, a little fatter. That’s compression.', art: stoolArt() },
        { t: 'compare', left: { title: 'Tension', en: 'Tensile strength', text: '“the maximum tensile … load … before fracture”. Its definition is a **load**: the biggest one.' }, right: { title: 'Compression', en: 'Compression', text: '“a measure of the extent to which a material deforms”. Its definition is a **deformation**: how much it changes shape.' }, note: 'Tension and shear are defined as a **maximum load**. Compression alone is **a measure of deformation**.' },
        { t: 'check', q: 'st08' },
        { t: 'trap', text: 'A question may take the tension definition, swap “tensile” for “compressive”, and ask what it is. Remember: on the slide, compression is not “a maximum load”. Compression = **how much it deforms**.', wrong: 'Compression is the maximum compressive load a material can resist before fracture', right: 'Compression is a measure of the extent to which a material deforms under a compressive load prior to fracture' },
        { t: 'check', q: 'st09' }
      ]
    },
    {
      id: 'st-shear', title: 'Shear: without coming apart', en: 'Shear strength', ref: 'L2 · S5', scene: 'shearStress',
      blocks: [
        { t: 'say', who: 'usta', text: 'Scissors have two blades. One comes down, one comes up, and they are not on the same line. The paper in between gets cut. That’s shear.' },
        { t: 'quote', text: 'Shear strength is the maximum load a material can resist without separation when subjected to a shearing action.', ref: 'L2 · S5' },
        { t: 'example', title: 'A rivet between two plates', text: 'Two sheet-metal plates overlap, held by one rivet. The top plate is pulled left, the bottom plate right. One half of the rivet tries to slide past the other half. If the load goes past the shear strength, the rivet separates in two.', art: rivetArt() },
        { t: 'why', text: 'In tension, the two forces sit **on the same line**. In shear, they are **offset** from each other. So instead of stretching the part, they try to slide one layer of it over the next.' },
        { t: 'check', q: 'st11' },
        { t: 'check', q: 'st12' },
        { t: 'tip', text: 'Shear = **without separation**. Tension = **before fracture**. You’ll meet the same shearing idea when sheet metal is cut (Lecture 5).' }
      ]
    },
    {
      id: 'st-torsion', title: 'Torsion: a twist about the axis', en: 'Torsion', ref: 'L2 · S5', scene: 'torsion',
      blocks: [
        { t: 'say', who: 'usta', text: 'Wring out a wet towel. One hand turns one way, the other hand turns the other way. The towel twists along its length. That’s torsion.' },
        { t: 'quote', text: 'Torsion is the application of torque to a member to cause it to twist about its longitudinal axis. A crankshaft must be made of metal with superior torsional strength or it will fail under the stress it is subjected to in an engine.', ref: 'L2 · S5' },
        { t: 'art', html: crankArt(), caption: 'A crankshaft: a torque at each end, and the shaft twists about its longitudinal axis (the dashed line).' },
        { t: 'p', text: 'Two new words: **torque** is a turning force. The **longitudinal axis** is the line that runs down the middle of the part, along its length.' },
        { t: 'check', q: 'st13' },
        { t: 'trap', text: 'Torsion is not a pull or a push. It is a **turning torque**. If the question says twist, torque or crankshaft, the answer is torsion.', wrong: 'A crankshaft needs superior shear strength', right: 'A crankshaft must be made of metal with superior torsional strength' },
        { t: 'check', q: 'st14' },
        { t: 'tip', text: 'You’ll meet the crankshaft again in the cast-iron zone: ductile iron is one of the metals it’s made from.' }
      ]
    },
    {
      id: 'st-elastic', title: 'Elasticity: back to how it was', en: 'Elasticity', ref: 'L2 · S6', scene: 'elastic',
      blocks: [
        { t: 'say', who: 'usta', text: 'Stretch a rubber band between your fingers. Let go. It goes back to exactly its length. That’s it: you understand elasticity.' },
        { t: 'quote', text: 'Elasticity: describes the recovery of a material back to its original shape and size after being deformed, when a stress is removed.', ref: 'L2 · S6' },
        { t: 'art', html: bandArt(), caption: 'Before, while you pull, and after you let go. The two dashed lines say it: exactly the same length.' },
        { t: 'p', text: 'Three keys in the definition: **recovery** (it comes back), **original shape and size** (both of them), **when a stress is removed** (it comes back once the stress is taken away).' },
        { t: 'example', title: 'The spring in a ballpoint pen', text: 'Click the pen: the spring is squeezed. Let go: it comes back. If it returns to exactly its length, that is elastic behavior. The spring is designed to stay in that zone all its life.' },
        { t: 'check', q: 'st16' },
        { t: 'check', q: 'st17' },
        { t: 'tip', text: 'Elastic = there and back. It deforms while loaded and recovers when let go.' }
      ]
    },
    {
      id: 'st-plastic', title: 'Plasticity: it keeps its new shape', en: 'Plasticity · plastic behavior', ref: 'L2 · S7', scene: 'plastic',
      blocks: [
        { t: 'say', who: 'usta', text: 'Bend a paper clip open with your fingers. Let go. It won’t come back. That paper clip just showed plastic behavior.' },
        { t: 'quote', text: 'The ability of a material to deform under load and retain its new shape when the load is removed is called plasticity.', ref: 'L2 · S7' },
        { t: 'compare', left: { title: 'Plastic behavior', en: 'figure 3-4 · plastic behavior', art: behaviorFig('plastic'), text: 'The bar stretches and thins in the middle. When it breaks, each piece **keeps its stretched shape**.' }, right: { title: 'Elastic behavior', en: 'figure 3-3 · elastic behavior', art: behaviorFig('elastic'), text: 'The bar stretches too. But when it breaks, the two pieces **go back to plain blocks**.' }, note: 'The secret is in the last row: the broken pieces tell you elastic or plastic.' },
        { t: 'why', text: 'Inside a metal, the atoms sit in rows. In elastic behavior, the rows move apart a little and then go back. In plastic behavior, whole rows slide to a new place, and nothing pulls them back.' },
        { t: 'check', q: 'st18' },
        { t: 'trap', text: 'The exam swaps the two words. **Elasticity** = it goes back to its original shape. **Plasticity** = it keeps its new shape (“retain its new shape”). And careful: the slide shows figure 3-4 (plastic) **before** figure 3-3 (elastic). Don’t trust the order. Trust the broken pieces.', wrong: 'Plasticity = the recovery of a material back to its original shape', right: 'Plasticity = deform under load and retain its new shape when the load is removed' },
        { t: 'check', q: 'st19' },
        { t: 'tip', text: 'Elastic goes back. Plastic stays. Like modelling clay: shape it, and it stays that way.' }
      ]
    },
    {
      id: 'st-curve', title: 'The stress–strain curve', en: 'The stress–strain curve', ref: 'L2 · S8', scene: 'curve',
      blocks: [
        { t: 'say', who: 'usta', text: 'Put a metal specimen in a tensile testing machine. Pull it slowly until it breaks. Plot stress going up and strain going along. You get this curve. It’s the most important drawing in the lecture.' },
        { t: 'art', html: curveArt(), caption: 'Slide 8’s curve with every label in place. These names are the ones the exam asks about.' },
        { t: 'quote', text: 'The yield stress is a measure of resistance to plastic deformation', ref: 'L2 · S8' },
        { t: 'list', style: 'num', items: [
          '**Elastic Behavior**: the straight line at the start. Let go here and the specimen springs back.',
          '**Yield strength**: the end of the straight line. **Plastic Behavior** starts here.',
          '**Uniform elongation**: the whole specimen stretches evenly while the curve still climbs.',
          '**Ultimate tensile strength**: the highest point. The biggest stress the specimen can take.',
          '**Necking**: one spot thins, and the curve comes down.',
          '**Fracture**: the end of the curve. The specimen broke.'
        ] },
        { t: 'demo', id: 'st-curve-demo', title: 'Ride the curve', caption: 'Move the slider to pull the specimen, then press “Let go”. Below the yield strength it returns to zero. Past it, it stays longer, and the dashed line shows where it came back to.', mount: curveRider(CR) },
        { t: 'check', q: 'st22' },
        { t: 'check', q: 'st21' },
        { t: 'trap', text: 'The highest point of the curve is **not** fracture. The highest point is the **ultimate tensile strength**. Fracture is at the **end** of the curve, on the way down. And: stress goes up the side, strain along the bottom.', wrong: 'Fracture is the highest point on the curve', right: 'The highest point is the ultimate tensile strength; fracture is at the end of the curve' },
        { t: 'check', q: 'st23' },
        { t: 'tip', text: 'Read the curve like a sentence: straight (elastic) → it bends (yield) → it climbs to the top → it falls (necking) → it snaps (fracture).' }
      ]
    },
    {
      id: 'st-necking', title: 'Necking: TS, M and F', en: 'TS · M · necking · F', ref: 'L2 · S9', scene: 'necking',
      blocks: [
        { t: 'say', who: 'usta', text: 'The next slide tells the same story with letters: TS, M and F. Next to them, a specimen stretches until it breaks.' },
        { t: 'art', html: tsmfArt(), caption: 'The specimen at four moments: at the start, stretching evenly, necking after M, and broken at F.' },
        { t: 'quote', text: 'TS · M · “Necking” · F', ref: 'L2 · S9 · figure' },
        { t: 'table', head: ['Letter', 'Means', 'Where on the curve'], rows: [
          ['TS', 'tensile strength', 'the dashed line at the highest stress'],
          ['M', 'the maximum', 'the top of the curve'],
          ['Necking', 'one spot thins', 'after M, as the curve falls'],
          ['F', 'fracture', 'the last point']
        ] },
        { t: 'why', text: 'Before M, the whole specimen stretches evenly. After M, one spot starts to thin faster than the rest. There is less metal there, so it gets weaker, so it thins even more… until it breaks at F. That’s why the curve falls after M.' },
        { t: 'check', q: 'st26' },
        { t: 'check', q: 'st27' },
        { t: 'tip', text: 'M = Maximum. F = Fracture. Necking sits between the two.' }
      ]
    },
    {
      id: 'st-yield', title: 'Yield strength: no way back after it', en: 'Yield strength', ref: 'L2 · S10', scene: 'yield',
      blocks: [
        { t: 'say', who: 'usta', text: 'There’s a line on the curve that you can’t come back from once you cross it. It’s called the yield strength, and every good designer keeps it in mind.' },
        { t: 'quote', text: 'Yield strength is the workable engineering strength of a metal to stay within its elastic limit. Exceeding a metal\'s yield strength puts the metal into permanent deformation.', ref: 'L2 · S10' },
        { t: 'compare', left: { title: 'Below the yield strength', en: 'within the elastic limit', art: yieldArt(false), text: 'The ruler bends while it’s loaded. Take the load off: it springs back straight.' }, right: { title: 'Past the yield strength', en: 'permanent deformation', art: yieldArt(true), text: 'The ruler was bent too far. Take the load off: it stays bent.' }, note: 'Same ruler. The whole difference: did it cross the yield strength or not?' },
        { t: 'p', text: '**Workable engineering strength** means this is the limit an engineer **works below**. The part has to stay under it so it returns to its shape every time.' },
        { t: 'check', q: 'st29' },
        { t: 'check', q: 'st30' },
        { t: 'trap', text: 'Two that get mixed up: **yield strength** = the **end of the straight line** (past it, permanent deformation). **Ultimate tensile strength** = the **highest point** of the curve. Yield comes first.', wrong: 'Yield strength is the highest point on the stress–strain curve', right: 'Yield strength is where the elastic limit ends; the highest point is the ultimate tensile strength' },
        { t: 'tip', text: 'Slide 8 says **yield stress**: a measure of resistance to plastic deformation. Slide 10 says **yield strength**: the limit that keeps the metal elastic. Both talk about the same boundary.' }
      ]
    },
    {
      id: 'st-strain', title: 'Strain and percent elongation', en: 'Percent elongation · strain', ref: 'L2 · S10', scene: 'elongation',
      blocks: [
        { t: 'say', who: 'usta', text: 'Stress is how the metal resists. Strain is what actually happened to it: how much did it change? Did it get longer? Shorter?' },
        { t: 'quote', text: 'Percent elongation is the increase in length over the original length.', ref: 'L2 · S10' },
        { t: 'art', html: elongationArt(), caption: 'The gauge marks were 50 mm apart. After the pull they are 60 mm apart. The increase is 10 mm.' },
        { t: 'p', text: 'The sum comes straight from the definition: **increase ÷ original length × 100**. So (60 − 50) ÷ 50 × 100 = **20%**.' },
        { t: 'demo', id: 'st-stretch-demo', title: 'Stretch it and work it out', caption: 'Move the slider and try to hit 10%, 20% and 50%. Watch the last line: that’s what you get if you divide by the new length by mistake.', mount: stretchMeter(SM) },
        { t: 'check', q: 'st33' },
        { t: 'trap', text: 'Divide by the **original length**, not the new one. 10 ÷ 60 = 16.7% is a wrong answer, and it’s usually sitting in the options on purpose.', wrong: '10 ÷ 60 × 100 = 16.7%', right: '10 ÷ 50 × 100 = 20% (over the original length)' },
        { t: 'check', q: 'st32' },
        { t: 'quote', text: 'Strain is the change a material go through during elongation or shrinkage. It is given as a measure of deformation under load.', ref: 'L2 · S10' },
        { t: 'compare', left: { title: 'Stress', en: 'the cause', text: 'The internal resistance to a force from outside. The **cause**. On the curve: up the side.' }, right: { title: 'Strain', en: 'the result', text: 'The change in the material: longer or shorter. The **result**. On the curve: along the bottom.' } },
        { t: 'check', q: 'st35' },
        { t: 'tip', text: 'Stress = resistance. Strain = change. Percent elongation = increase ÷ original × 100.' }
      ]
    }
  ]
};
