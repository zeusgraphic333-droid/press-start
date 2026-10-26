// Archive tables — strength (Lecture 2 · slides 4–10). Format: docs/BRIEF.md § Archive.
// Flashcard keys (t) are the slide's own words, so they stay unique across zones.
export const terms = [
  { t: 'Strength (stress)', ar: 'الإجهاد', lec: '02', d: 'The Internal Resistance offered by a part to an externally applied Force is called as Stress.', r: 'المقاومة اللي جوه القطعة قدام قوة جاية من بره.', rEn: 'The part’s internal resistance to a force from outside.' },
  { t: 'Tensile/Tension strength', ar: 'إجهاد الشد', lec: '02', d: 'The maximum tensile (pulling apart) load that a material can resist before fracture.', r: 'أقصى حمل شد قبل الكسر.', rEn: 'The biggest pulling-apart load before it breaks.' },
  { t: 'Compression', ar: 'إجهاد الضغط (الكبس)', lec: '02', d: 'A measure of the extent to which a material deforms under a compressive load prior to fracture.', r: 'مقياس لقد إيه بيتشوه تحت الكبس قبل الكسر.', rEn: 'How much it deforms under a squeezing load before it breaks.' },
  { t: 'Shear strength', ar: 'إجهاد القص', lec: '02', d: 'The maximum load a material can resist without separation when subjected to a shearing action.', r: 'أقصى حمل قص من غير ما ينفصل.', rEn: 'The biggest shearing load before it separates.' },
  { t: 'Torsion', ar: 'إجهاد اللي', lec: '02', d: 'The application of torque to a member to cause it to twist about its longitudinal axis. A crankshaft must be made of metal with superior torsional strength.', r: 'عزم بيلف القطعة حوالين محورها الطولي. مثال: عمود الكرنك.', rEn: 'A torque twisting a part about its long axis, like a crankshaft.' },
  { t: 'Elasticity', ar: 'المرونة', lec: '02', d: 'Describes the recovery of a material back to its original shape and size after being deformed, when a stress is removed.', r: 'بيرجع لشكله وحجمه الأصلي لما الإجهاد يتشال.', rEn: 'It goes back to its original shape and size when the stress is removed.' },
  { t: 'Plasticity', ar: 'اللدونة', lec: '02', d: 'The ability of a material to deform under load and retain its new shape when the load is removed.', r: 'بيتشوه ويفضل على شكله الجديد.', rEn: 'It deforms and keeps its new shape.' },
  { t: 'Yield stress', ar: 'إجهاد الخضوع', lec: '02', d: 'A measure of resistance to plastic deformation.', r: 'مقياس لمقاومة التشوه اللدن.', rEn: 'How well it resists permanent (plastic) deformation.' },
  { t: 'Yield strength', ar: 'حد الخضوع', lec: '02', d: 'The workable engineering strength of a metal to stay within its elastic limit. Exceeding a metal’s yield strength puts the metal into permanent deformation.', r: 'آخر الخط المستقيم؛ بعده تشوه دائم.', rEn: 'The end of the elastic part; past it the change is permanent.' },
  { t: 'Ultimate tensile strength (TS)', ar: 'أقصى مقاومة شد', lec: '02', d: 'A label on the stress–strain curve (L2 · S8): the highest point of the curve. Slide 9 marks it TS, at point M.', r: 'أعلى نقطة على المنحنى (M).', rEn: 'The top of the stress–strain curve (point M).' },
  { t: 'Uniform elongation', ar: 'الاستطالة المنتظمة', lec: '02', d: 'A label on the stress–strain curve (L2 · S8): from the start of the test up to the ultimate tensile strength.', r: 'العينة كلها بتطول بالتساوي، لحد أعلى نقطة.', rEn: 'The whole specimen stretches evenly, up to the top point.' },
  { t: 'Necking', ar: 'الرقبة (التخصّر)', lec: '02', d: 'A label on the stress–strain curve (L2 · S8): from the ultimate tensile strength to fracture. Slide 9 shows the specimen “Necking” after M, then F.', r: 'حتة واحدة بتخس بعد M لحد الكسر.', rEn: 'One spot thins after M, until it breaks at F.' },
  { t: 'Percent elongation', ar: 'نسبة الاستطالة', lec: '02', d: 'The increase in length over the original length.', r: 'الزيادة ÷ الطول الأصلي × 100.', rEn: 'Increase ÷ original length × 100.' },
  { t: 'Strain', ar: 'الانفعال', lec: '02', d: 'The change a material go through during elongation or shrinkage. It is given as a measure of deformation under load.', r: 'التغيير (تطويل أو انكماش). مقياس للتشوه.', rEn: 'The change in it (longer or shorter): a measure of deformation.' }
];
export const pairs = [
  ['Elasticity', 'recovers its original shape and size when the stress is removed', 'Plasticity', 'deforms under load and retains its new shape when the load is removed', 'المرن بيرجع، واللدن بيفضل.', 'Elastic goes back; plastic stays.'],
  ['Tensile strength', 'the maximum pulling-apart load before fracture', 'Compression', 'a measure of the extent to which a material deforms under a compressive load', 'الشد «أقصى حمل»، والضغط «مقياس للتشوه».', 'Tension is a maximum load; compression is a measure of deformation.'],
  ['Shear strength', 'maximum load without separation under a shearing action', 'Torsion', 'torque twisting a member about its longitudinal axis', 'القص بيزحلق، واللي بيلف.', 'Shear slides; torsion twists.'],
  ['Yield strength', 'the end of the straight elastic line; past it, permanent deformation', 'Ultimate tensile strength', 'the highest point of the curve (TS, M)', 'الخضوع بييجي الأول، والـ UTS هو القمة.', 'Yield comes first; the UTS is the top.'],
  ['Uniform elongation', 'the whole specimen lengthens evenly, up to the top of the curve', 'Necking', 'one spot thins after the top, until fracture', 'قبل M بالتساوي، وبعد M رقبة.', 'Before M it stretches evenly; after M it necks.'],
  ['Stress', 'the internal resistance to an external force (vertical axis)', 'Strain', 'the change during elongation or shrinkage (horizontal axis)', 'الإجهاد سبب لفوق، والانفعال نتيجة على الجنب.', 'Stress is the cause, up the side; strain is the result, along the bottom.']
];
export const triggers = [
  ['internal resistance, externally applied force', 'Stress', '02'],
  ['maximum load, pulling apart, before fracture', 'Tensile strength', '02'],
  ['extent to which a material deforms, compressive load', 'Compression', '02'],
  ['without separation, shearing action', 'Shear strength', '02'],
  ['torque, twist, longitudinal axis, crankshaft', 'Torsion', '02'],
  ['recovery, original shape and size, stress removed', 'Elasticity', '02'],
  ['retain its new shape, load removed', 'Plasticity', '02'],
  ['resistance to plastic deformation', 'Yield stress', '02'],
  ['workable engineering strength, elastic limit', 'Yield strength', '02'],
  ['exceeding the yield strength', 'Permanent deformation', '02'],
  ['highest point of the curve, TS, M', 'Ultimate tensile strength', '02'],
  ['thins in one spot, after M, before F', 'Necking', '02'],
  ['increase in length over the original length', 'Percent elongation', '02'],
  ['elongation or shrinkage, measure of deformation', 'Strain', '02']
];
