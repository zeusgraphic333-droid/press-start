// The scene catalogue: every idea the stage can show, by zone. Chapters name one with `scene: '<name>'`, and BOTH
// modes answer it: world/scenes/<zone>.js (particles) and world/scenes2d/<zone>.js (drafting-room drawings).
// Caption: [English title, Arabic line, English line] — Arabic pages show title + Arabic line, English pages title + English line.
// What each scene should picture is in docs/SCENES.md. Owner of this file: the integrator (ask before renaming anything).
export const SCENES_BY_ZONE = {
  design: {
    designer: ['Designer × Factory', 'اللي ترسمه لازم يتصنع', 'If you draw it, it has to be made'],
    sequence: ['Product Design Sequence', 'مراحل تصميم المنتج', 'Three lenses, six steps'],
    considerations: ['Personal vs objective', 'ذوقك ولا الأرقام؟', 'Two kinds of considerations'],
    methods: ['Manufacturing methods', 'طرق التصنيع الأربعة', 'Form · cut · join · finish'],
    forming: ['Forming', 'التشكيل', 'Liquid · plastic · solid state'],
    cuttingM: ['Cutting', 'القطع', 'Sheet · chip · nonchip · flame'],
    joining: ['Joining', 'الوصل', 'Solder · weld · adhesive · mechanical'],
    finishing: ['Finishing', 'التشطيب', 'Formed · abrasive · coatings'],
    matrix: ['Figure 1-1', 'مين يتعمل بإيه', 'Materials × manufacturing']
  },
  materials: {
    materialsTree: ['Materials', 'عيلة الخامات', 'Metals · plastics · rubber · natural'],
    classTree: ['Engineering materials', 'معادن ولا لا معادن', 'Metals vs non-metals'],
    metalsChart: ['Metals chart', 'شجرة المعادن', 'Ferrous · nonferrous · powdered'],
    atoms: ['Pure metal', 'معدن نقي', 'Atoms of the same type'],
    alloy: ['Alloy', 'سبيكة', 'Two or more elements'],
    ferrous: ['Ferrous', 'معادن حديدية', 'They contain iron'],
    nonferrous: ['Non-ferrous', 'معادن غير حديدية', 'No iron inside'],
    polymers: ['Polymers', 'البوليمرات', 'Thermosetting vs thermoplastic'],
    ceramics: ['Ceramics', 'السيراميك', 'Refractories · glass · cement'],
    elastomers: ['Rubber & elastomers', 'المطاط', 'Stretches and comes back']
  },
  strength: {
    stress: ['Stress', 'الإجهاد', 'Internal resistance to a force'],
    fourLoads: ['Four loads', 'أربع أنواع إجهاد', 'Tension · compression · shear · torsion'],
    tension: ['Tension', 'إجهاد الشد', 'Pulled apart'],
    compression: ['Compression', 'إجهاد الضغط (الكبس)', 'Pushed together'],
    shearStress: ['Shear', 'إجهاد القص', 'Sliding past each other'],
    torsion: ['Torsion', 'إجهاد اللي', 'Twisted about its axis'],
    elastic: ['Elasticity', 'المرونة', 'Back to its original shape'],
    plastic: ['Plasticity', 'اللدونة', 'Keeps its new shape'],
    curve: ['Stress–strain curve', 'منحنى الإجهاد والانفعال', 'From elastic to fracture'],
    yield: ['Yield strength', 'حد الخضوع', 'Past it, the change is permanent'],
    necking: ['Necking', 'الرقبة قبل الكسر', 'It thins, then it breaks'],
    elongation: ['Strain & elongation', 'الانفعال والاستطالة', 'How much longer it got']
  },
  props: {
    anvil: ['Properties of metals', 'كل معدن ليه شخصية', 'Mechanical and physical'],
    hardness: ['Hardness', 'الصلادة', 'Resists penetration and scratching'],
    ductile: ['Ductility', 'المطيلية', 'Drawn into fine wire'],
    brittle: ['Brittleness', 'القصافة (الهشاشة)', 'Breaks without stretching'],
    tough: ['Toughness', 'المتانة', 'Takes the hammer blow'],
    malleable: ['Malleability', 'المطاوعة', 'Rolled or hammered into sheet'],
    castable: ['Castability', 'القابلية للصب', 'How well it behaves molten'],
    resilience: ['Resilience', 'امتصاص الصدمات', 'Absorbs the shock, springs back'],
    machinable: ['Machinability', 'قابلية التشغيل', 'How easily a tool cuts it'],
    weldable: ['Weldability', 'قابلية اللحام', 'How well it joins by welding'],
    physical: ['Physical properties', 'الخواص الفيزيائية', 'Hard to change'],
    conductivity: ['Conductivity', 'التوصيل', 'Current and heat flow through'],
    expansion: ['Thermal expansion', 'التمدد الحراري', 'Higher melt, less expansion'],
    magnet: ['Ferromagnetism', 'المغناطيسية', 'Iron, nickel, cobalt line up'],
    melting: ['Melting point', 'نقطة الانصهار', 'Solid to liquid'],
    corrosion: ['Corrosion resistance', 'مقاومة التآكل', 'Oxygen and chemicals attack the surface']
  },
  iron: {
    irons: ['Cast irons', 'ستة أنواع حديد زهر', 'Six irons, six jobs'],
    castIron: ['Cast iron', 'الحديد الزهر', 'At least 2% carbon, 1–3% silicon'],
    grayIron: ['Gray iron', 'الحديد الزهر الرمادي', 'Damps vibration · engine blocks'],
    ductileIron: ['Ductile iron', 'الحديد الزهر المرن', 'Nodular · crankshafts'],
    whiteIron: ['White iron', 'الحديد الزهر الأبيض', 'Chilled · resists wear'],
    cgi: ['Compacted graphite iron', 'الحديد CGI', 'Engine blocks · brake drums'],
    malleableIron: ['Malleable iron', 'الحديد الزهر المطاوع', 'White iron, heat-treated'],
    alloyIrons: ['High-alloy irons', 'حديد زهر عالي السبائك', 'Up to 35% alloy'],
    crankshaft: ['Crankshaft', 'عمود الكرنك', 'It must not twist apart']
  },
  bend: {
    formingStates: ['Metal forming', 'تشكيل المعادن', 'Liquid · fluid · plastic · solid'],
    sheetGauge: ['Foil · sheet · plate', 'فويل ولا صاج ولا بليت', '0.15 mm to 6.35 mm'],
    stockShapes: ['Metal stock', 'أشكال الخامة', 'Solid · hollow · angle'],
    solidTree: ['Solid state forming', 'التشكيل في الحالة الصلبة', 'Simple · compound · stamping'],
    stamping: ['Punch · die · press', 'البنش والداي والمكبس', 'Sheet metal terminology'],
    neutralAxis: ['Neutral axis', 'المحور المتعادل', 'Outside stretches, inside squeezes'],
    flatLength: ['Bend allowance & deduction', 'الطول المفرود', 'Lt = A + B + BA · Lt = A + B − BD'],
    kFactor: ['K-factor', 'معامل K', 'K = t / T'],
    relief: ['Bend relief', 'فتحة التخفيف', 'Tear · obround · rectangle'],
    bendRadius: ['Bend radius', 'نصف قطر الثني', 'Bend it without kinking'],
    vBend: ['V-bending', 'الثني على شكل V', 'Low production · press brake'],
    airBend: ['Air bending', 'الثني في الهوا', 'The punch stops above the bottom'],
    edgeBend: ['Edge bending', 'ثني الحافة', 'High production · pressure pad'],
    springback: ['Springback', 'الارتداد', 'It opens up when the punch leaves'],
    flanging: ['Flanging', 'عمل شفة', 'Straight · stretch · shrink'],
    hemming: ['Hemming · seaming · curling', 'الحرف يتطوي ويتلف', 'Folded, locked, rolled'],
    rollForm: ['Roll forming', 'الدرفلة', 'Three rolls, one radius'],
    contRoll: ['Continuous roll forming', 'الدرفلة المستمرة', 'Station after station'],
    tube: ['Wire & tube forming', 'تشكيل السلك والمواسير', 'A mandrel stops the buckling']
  },
  compound: {
    spinning: ['Spinning', 'البرم على المخرطة', 'A spinning disc becomes a cup'],
    spinParts: ['The spinning lathe', 'أجزاء مخرطة البرم', 'Mandrel · clamp · roller tool'],
    spunShapes: ['Spun shapes', 'أشكال البرم الأساسية', 'Hemisphere · cone · cylinder'],
    hydro: ['Hydroforming', 'التشكيل بالسوائل', 'Water pressure does the work'],
    hydroTube: ['Tube hydroforming', 'هيدروفورمنج المواسير', 'Pressure from inside the tube'],
    hydroSheet: ['Sheet hydroforming', 'هيدروفورمنج الصاج', 'Forced into the female cavity'],
    drawing: ['Deep drawing', 'السحب العميق', 'The punch pushes the blank into the die'],
    drawSteps: ['Blank to cup', 'من بلانك لكوباية', 'Cans · car body panels']
  },
  cut: {
    cutTree: ['Metal cutting', 'قطع المعادن', 'Four ways to cut'],
    machining: ['Machining', 'التشغيل بالماكينات', 'Chip forming, to a tolerance'],
    thermal: ['Thermal cutting', 'القطع الحراري', 'Gas · laser · plasma'],
    shearing: ['Shearing', 'القص', 'Like scissors: punch against die'],
    clearance: ['Clearance', 'الخلوص', 'The gap decides the cut'],
    punchDie: ['Punch & die', 'البنش والداي', 'Convex male, concave female'],
    punchVsBlank: ['Punching vs blanking', 'تخريم ولا بلانكينج', 'Which piece do you keep?'],
    fineBlank: ['Fine blanking', 'البلانكينج الدقيق', 'An ejector pushes back'],
    cutOps: ['Cutting operations', 'عمليات القطع', 'Fourteen ways to cut sheet'],
    perforating: ['Notch · perforate · slot', 'نوتش وتخريم وشقوق', 'Holes and notches'],
    lancing: ['Lancing & slitting', 'قطع من غير ما يقع حاجة', 'No material removed'],
    cutoffParting: ['Cutoff vs parting', 'الفصل بخط ولا بقطعة', 'Scrap or no scrap'],
    trimShave: ['Trimming & shaving', 'تنضيف الحرف', 'Clean up the edge'],
    nibbling: ['Nibbling', 'القرض', 'Small overlapping bites'],
    emboss: ['Embossing', 'البصم البارز', 'Same contour, opposite direction'],
    coining: ['Coining', 'السكّ', 'Both sides impressed']
  },
  special: {
    monolith: ['The Press', 'المكبس', 'The exam waits under the ram'],
    nebula: ['Raw stock', 'خامة لسه ما اتشكّلتش', 'Before it takes shape']
  }
};
export const SCENE_INFO = Object.assign({}, ...Object.values(SCENES_BY_ZONE)); // names are unique across zones
/** the zone each scene belongs to (special scenes: 'special') */
export const SCENE_ZONE = Object.fromEntries(Object.entries(SCENES_BY_ZONE).flatMap(([z, o]) => Object.keys(o).map(n => [n, z])));
