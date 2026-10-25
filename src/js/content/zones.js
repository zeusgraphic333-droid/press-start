// The districts of the course. `tp` = question-bank topics; `n` = suggested order (lecture order) on the orbit.
// scene = the formation the hub and the level background show (world/scenes/info.js).
// color/dark = the glowing temper colour of the night shift + its deep partner · paper = [marker ink, text ink] for the
// drafting room (keep in sync with styles/90-illustrated.css § per-district marker inks).
// Names: ar / en (enShort: the orbit label) · tag + blurb: Arabic, tagEn + blurbEn: English (pick with L() at render time).
// Colours follow steel's temper colours (the oxide film steel shows as it heats: pale straw → straw → gold → bronze →
// purple → blue → pale blue); the exam glows like the forge.
export const ZONES = [
  { id: 'design', scene: 'designer', n: 1, ar: 'المصمم والمصنع', en: 'Designer × Factory', enShort: 'Designer', lec: '01', color: '#F2E2A0', dark: '#9C8A45', paper: ['#E2B93B', '#7A5A0E'], tp: ['design'],
    tag: 'اللي ترسمه لازم يتصنع', blurb: 'ليه مصمم المنتج محتاج هندسة الإنتاج. ومراحل التصميم من الفكرة لحد المنتج، وطرق التصنيع الأربعة.', tagEn: 'If you draw it, it has to be made', blurbEn: 'Why a product designer needs production engineering. The design sequence from idea to product, and the four families of manufacturing.' },
  { id: 'materials', scene: 'materialsTree', n: 2, ar: 'عيلة الخامات', en: 'Engineering Materials', enShort: 'Materials', lec: '01·02', color: '#E8C368', dark: '#9A7A2C', paper: ['#D99A3A', '#84520F'], tp: ['materials'],
    tag: 'قبل ما تشكّل، اعرف الخامة', blurb: 'معادن ولا لا معادن؟ حديدي ولا غير حديدي؟ معدن نقي ولا سبيكة؟ شجرة الخامات كلها.', tagEn: 'Know the material before you shape it', blurbEn: 'Metal or non-metal? Ferrous or nonferrous? Pure metal or alloy? The whole family tree of materials.' },
  { id: 'strength', scene: 'curve', n: 3, ar: 'الإجهاد والانفعال', en: 'Stress & Strain', enShort: 'Stress & Strain', lec: '02', color: '#E39B3C', dark: '#9C6118', paper: ['#D0782A', '#8A4512'], tp: ['strength'],
    tag: 'شد، ضغط، قص، لي', blurb: 'إزاي المعدن بيقاوم القوة. المرونة واللدونة ونقطة الخضوع، ومنحنى الإجهاد والانفعال لحد الكسر.', tagEn: 'Pull, push, shear, twist', blurbEn: 'How metal resists a force. Elasticity, plasticity, the yield point, and the stress–strain curve all the way to fracture.' },
  { id: 'props', scene: 'anvil', n: 4, ar: 'خواص المعادن', en: 'Properties of Metals', enShort: 'Properties', lec: '02', color: '#C97A43', dark: '#8A4A1F', paper: ['#B8643A', '#7A3C1C'], tp: ['props'],
    tag: 'كل معدن ليه شخصية', blurb: 'صلادة ومطيلية وقصافة ومتانة ومطاوعة… وخواص فيزيائية زي الكثافة والتوصيل والتمدد ونقطة الانصهار.', tagEn: 'Every metal has a character', blurbEn: 'Hardness, ductility, brittleness, toughness, malleability… and physical properties like density, conductivity, expansion and melting point.' },
  { id: 'iron', scene: 'irons', n: 5, ar: 'الحديد الزهر', en: 'Cast Irons', enShort: 'Cast Irons', lec: '02', color: '#B9668A', dark: '#7E3858', paper: ['#9B4F7E', '#6C2E55'], tp: ['iron'],
    tag: 'ستة أنواع حديد، ستة شغلانات', blurb: 'رمادي ومرن وأبيض وCGI ومطاوع وعالي السبائك. مين بيتعمل منه بلوك موتور، ومين بيتعمل منه كسّارة.', tagEn: 'Six irons, six jobs', blurbEn: 'Gray, ductile, white, CGI, malleable and high-alloy. Which one becomes an engine block, which one a crusher.' },
  { id: 'bend', scene: 'neutralAxis', n: 6, ar: 'ثني الصاج', en: 'Sheet Metal Bending', enShort: 'Bending', lec: '03', color: '#9468D2', dark: '#5E3C98', paper: ['#6A4FC1', '#46308F'], tp: ['bend'],
    tag: 'اثني من غير ما تكسر', blurb: 'التشكيل في الحالة الصلبة، والصاج والفويل والبليت، والمحور المتعادل، والـ K-factor، والـ springback، وعمليات الثني.', tagEn: 'Bend it without breaking it', blurbEn: 'Solid-state forming, sheet, foil and plate, the neutral axis, the K-factor, springback and every bending operation.' },
  { id: 'compound', scene: 'spinning', n: 7, ar: 'الثني المركّب', en: 'Compound Bending', enShort: 'Spin · Hydro · Draw', lec: '04', color: '#4F7FE6', dark: '#2B4FA8', paper: ['#3B6FD8', '#234A9E'], tp: ['compound'],
    tag: 'لف، ميّه، وسحب عميق', blurb: 'البرم على المخرطة (Spinning)، والتشكيل بضغط الميّه (Hydroforming)، والسحب العميق (Deep drawing).', tagEn: 'Spin it, flood it, draw it', blurbEn: 'Spinning on a lathe, forming with water pressure (hydroforming), and deep drawing.' },
  { id: 'cut', scene: 'punchDie', n: 8, ar: 'قطع المعادن', en: 'Metal Cutting', enShort: 'Cutting', lec: '05', color: '#86BDF0', dark: '#3A78B0', paper: ['#4E9AD8', '#1F5E94'], tp: ['cut'],
    tag: 'البنش والداي', blurb: 'القص والتخريم والـ blanking، والخلوص بين البنش والداي، و١٤ عملية قطع وتشكيل للصاج.', tagEn: 'Punch meets die', blurbEn: 'Shearing, punching and blanking, the clearance between punch and die, and 14 sheet-metal operations.' },
  { id: 'boss', scene: 'monolith', n: 9, ar: 'الامتحان', en: 'The Exam', enShort: 'The Exam', lec: '', color: '#FF5A1F', dark: '#B53A0E', paper: ['#F05A1E', '#B53A0E'], tp: [],
    tag: 'المكبس مستنيك', blurb: 'معركة المكبس، وامتحان البورتال بالتايمر، ووضع الانتقام من غلطاتك.', tagEn: 'The press is waiting', blurbEn: 'The Press boss fight, the timed Portal exam, and Revenge mode for your mistakes.' }
];
export const ZONE = Object.fromEntries(ZONES.map(z => [z.id, z]));
