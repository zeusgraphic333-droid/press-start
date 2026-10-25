// The title as a particle formation: the name glows along its length in steel's temper colours, the way a bar
// heated at one end shows straw, gold, bronze, purple and blue. 'title:ar' · 'title:en' (main.js picks by language).
import * as FM from './formations.js';
export const TEMPER = ['#F6EBC0', '#E8C368', '#E39B3C', '#C97A43', '#B9668A', '#9468D2', '#4F7FE6', '#86BDF0'];
export function titleBuilders(P) {
  const w = P.mobile ? 5.0 : 9.0;
  P.builders['title:ar'] = () => FM.text(P.N, 'شدّ حيلك.', { font: '800 250px Changa', width: w, colors: TEMPER, seed: 61, embers: .015 });
  P.builders['title:en'] = () => FM.text(P.N, 'Bend, don’t break.', { font: '800 230px "Big Shoulders Display"', lines: ['Bend,', 'don’t break.'], rtl: false, width: P.mobile ? 4.2 : 6.6, colors: TEMPER, seed: 61, embers: .015 });
}
