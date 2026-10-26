// Archive tables — props (Lecture 2 · slides 11–15). Format: docs/BRIEF.md § Archive.
// Flashcard keys (t) are the slide's own words; 'Bending (fibers)' keeps the card apart from sheet-metal bending (Lecture 3).
export const terms = [
  { t: 'Hardness', ar: 'الصلادة', lec: '02', d: 'The ability of a material to resist penetration and scratching.', r: 'يقاوم الغرز والخدش.', rEn: 'It resists being dented and scratched.' },
  { t: 'Ductility', ar: 'المطيلية', lec: '02', d: 'The ability of a material to be deformed plastically without rupture under tensile load. Due to this property material can lengthy into fine wire without fracture.', r: 'يتمط سلك رفيع تحت الشد من غير ما يتقطع.', rEn: 'It can be drawn into fine wire under tension without breaking.' },
  { t: 'Brittleness', ar: 'القصافة (الهشاشة)', lec: '02', d: 'The property of a material opposite to ductility. So cast iron is a brittle material.', r: 'عكس المطيلية. مثال: الحديد الزهر.', rEn: 'The opposite of ductility, like cast iron.' },
  { t: 'Bending (fibers)', ar: 'الثنى', lec: '02', d: 'Bending is characterized by the outside fibers of a beam in tension and the inside fibers in compression.', r: 'بره شد، وجوه ضغط.', rEn: 'Outside fibers in tension, inside fibers in compression.' },
  { t: 'Toughness', ar: 'المتانة', lec: '02', d: 'The ability of a material to resist deformation under stress; the property of a material to resist fracture against impact load like hammer blows. It is decreased when heated.', r: 'ياخد خبطة الشاكوش من غير كسر. بتقل بالحرارة.', rEn: 'It takes hammer blows without breaking; heat lowers it.' },
  { t: 'Malleability', ar: 'المطاوعة', lec: '02', d: 'The property of a material which allow the material to be rolled or hammered into sheets. Soft steel and wrought iron are examples.', r: 'يتدرفل أو يتطرق صاج. الصلب الطري والحديد المشغول.', rEn: 'Rolled or hammered into sheets: soft steel, wrought iron.' },
  { t: 'Castability', ar: 'القابلية للصب (السباكة)', lec: '02', d: 'The ease with which a metal can be cast into different shapes; concerned with the behavior of metal in its molten state.', r: 'سهولة الصب؛ سلوك المعدن وهو سايح.', rEn: 'How easily it casts: its behavior when molten.' },
  { t: 'Resilience', ar: 'مقاومة او امتصاص الصدمات', lec: '02', d: 'A property of material to absorb energy and to resist shock and impact loads, measured by the energy absorbed per unit volume within the elastic limit.', r: 'يمتص الطاقة جوه حد المرونة ويرجع.', rEn: 'It absorbs energy within the elastic limit and springs back.' },
  { t: 'Machinability', ar: 'قابلية التشغيل بالماكينات', lec: '02', d: 'The ease with which a given material may be worked or shaped with a cutting tool. Depends on chemical composition, structure and mechanical properties.', r: 'سهولة التشكيل بأداة قطع. (تركيب + بنية + ميكانيكي)', rEn: 'How easily a cutting tool shapes it (composition, structure, mechanical properties).' },
  { t: 'Weldability', ar: 'قابلية اللحام', lec: '02', d: 'The ability of material to be joined by welding. Depends on chemical composition, physical properties and heat treatment.', r: 'يتوصل باللحام. (تركيب + فيزيائي + معالجة حرارية)', rEn: 'It can be joined by welding (composition, physical properties, heat treatment).' },
  { t: 'Physical properties', ar: 'الخواص الفيزيائية', lec: '02', d: 'Inherent aspects of a material that are generally not easily altered; mechanical properties are changed by work hardening and/or heat treatment.', r: 'أصيلة وثابتة. الميكانيكية هي اللي بتتغير.', rEn: 'Built in and stable; the mechanical ones are what change.' },
  { t: 'Opacity/transparency', ar: 'العتامة/الشفافية', lec: '02', d: 'The ability to transmit light.', r: 'يعدّي الضوء ولا لأ.', rEn: 'Does it let light through?' },
  { t: 'Color', ar: 'اللون', lec: '02', d: 'The characteristic reflected wavelength.', r: 'الطول الموجي اللي بيرتد.', rEn: 'The wavelength it reflects.' },
  { t: 'Density', ar: 'الكثافة', lec: '02', d: 'Weight per unit volume (specific gravity).', r: 'الوزن في وحدة الحجم.', rEn: 'Weight per unit volume.' },
  { t: 'Electrical conductivity', ar: 'التوصيل الكهربي', lec: '02', d: 'The ease with which a material conducts a current.', r: 'سهولة مرور التيار.', rEn: 'How easily current flows.' },
  { t: 'Thermal conductivity', ar: 'التوصيل الحراري', lec: '02', d: 'The ease with which heat flows within and through a material.', r: 'سهولة مرور الحرارة.', rEn: 'How easily heat flows through it.' },
  { t: 'Thermal expansion', ar: 'التمدد الحراري', lec: '02', d: 'Expressed in units of 1/°F or 1/°C. Generally inversely proportional to the melting point: higher-melt temperature materials have less expansion. Steel is a significant exception.', r: 'انصهار أعلى = تمدد أقل. الصلب استثناء.', rEn: 'Higher melting point, less expansion; steel is the exception.' },
  { t: 'Ferromagnetism', ar: 'المغناطيسية', lec: '02', d: 'The alignment of iron, nickel, and cobalt atoms into domains.', r: 'حديد ونيكل وكوبالت بيصطفوا في domains.', rEn: 'Iron, nickel and cobalt atoms lining up into domains.' },
  { t: 'Melting point', ar: 'نقطة الانصهار', lec: '02', d: 'The energy required to separate a material’s atoms, changing its state from solid to liquid.', r: 'الطاقة اللي تحوّله من صلب لسايل.', rEn: 'The energy that turns it from solid to liquid.' },
  { t: 'Corrosion resistance', ar: 'مقاومة التآكل', lec: '02', d: 'The ability to resist surface deterioration caused primarily by oxygen, chemicals, or other agents. (In plastics also ultraviolet light, moisture and other environmental factors.)', r: 'يقاوم تلف السطح من الأكسجين والكيماويات.', rEn: 'It resists surface attack by oxygen and chemicals.' }
];
export const pairs = [
  ['Ductility', 'deformed plastically without rupture under tensile load: fine wire', 'Malleability', 'rolled or hammered into sheets', 'سلك ولا صاج؟ المطيلية سلك، والمطاوعة صاج.', 'Wire or sheet? Ductility is wire; malleability is sheet.'],
  ['Ductility', 'stretches into fine wire without fracture', 'Brittleness', 'the opposite of ductility (cast iron)', 'واحد بيتمط، والتاني بيطق.', 'One stretches; the other snaps.'],
  ['Toughness', 'resists fracture against impact load like hammer blows', 'Resilience', 'absorbs energy, measured within the elastic limit', 'المتانة ما يتكسرش، وامتصاص الصدمات يمتص ويرجع.', 'Toughness doesn’t break; resilience absorbs and springs back.'],
  ['Hardness', 'resists penetration and scratching', 'Toughness', 'resists fracture against impact loads', 'الصلادة خدش، والمتانة خبطة.', 'Hardness is about scratches; toughness about blows.'],
  ['Machinability', 'depends on chemical composition, structure, mechanical properties', 'Weldability', 'depends on chemical composition, physical properties, heat treatment', 'التشغيل ميكانيكي، واللحام فيزيائي وحراري.', 'Machining: mechanical; welding: physical and heat.'],
  ['Electrical conductivity', 'the ease with which a material conducts a current', 'Thermal conductivity', 'the ease with which heat flows within and through a material', 'تيار ولا حرارة؟', 'Current or heat?'],
  ['Mechanical properties', 'changed by work hardening and/or heat treatment', 'Physical properties', 'inherent, generally not easily altered', 'الميكانيكية بتتغير، والفيزيائية ثابتة.', 'Mechanical ones change; physical ones stay.']
];
export const triggers = [
  ['penetration and scratching', 'Hardness', '02'],
  ['fine wire, tensile load, without rupture', 'Ductility', '02'],
  ['opposite to ductility, cast iron', 'Brittleness', '02'],
  ['outside fibers in tension, inside in compression', 'Bending', '02'],
  ['impact load, hammer blows, decreased when heated', 'Toughness', '02'],
  ['rolled or hammered into sheets, soft steel, wrought iron', 'Malleability', '02'],
  ['molten state, cast into different shapes', 'Castability', '02'],
  ['energy absorbed per unit volume, elastic limit', 'Resilience', '02'],
  ['cutting tool; composition, structure, mechanical properties', 'Machinability', '02'],
  ['joined by welding; physical properties, heat treatment', 'Weldability', '02'],
  ['inherent, not easily altered', 'Physical properties', '02'],
  ['ability to transmit light', 'Opacity/transparency', '02'],
  ['characteristic reflected wavelength', 'Color', '02'],
  ['weight per unit volume, specific gravity', 'Density', '02'],
  ['1/°F or 1/°C, higher melt → less expansion, steel exception', 'Thermal expansion', '02'],
  ['iron, nickel, cobalt, domains', 'Ferromagnetism', '02'],
  ['energy to separate atoms, solid to liquid', 'Melting point', '02'],
  ['oxygen, chemicals; plastics: ultraviolet light, moisture', 'Corrosion resistance', '02']
];
