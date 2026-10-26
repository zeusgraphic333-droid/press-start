// Question / lesson figures — strength. Each value is () => an <svg> string (box() + CSS variables). Format: docs/BRIEF.md § Figures.
import { box } from './box.js';
import { V, lab, arrow, loadBlock, curveD, toXY, axes, stressAt, f1 } from '../../content/lessons/_strength-kit.js';

const C = { ey: .2, sy: .74, eu: .55, ef: .95, sf: .64 };
/** box() draws a bare <svg>: wrap the drawing so unfilled paths stay unfilled and labels anchor left-to-right on Arabic pages */
const G = inner => `<g fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr">${inner}</g>`;

export default {
  /** four blocks A–D: A compression · B torsion · C tension · D shear */
  'st-loads4': () => {
    const s = .6, kinds = ['compression', 'torsion', 'tension', 'shear']; let g = '';
    kinds.forEach((k, i) => { const cx = 60 + i * 120; g += `<g transform="translate(${f1(cx - 120 * s)} 6) scale(${s})">${loadBlock(k, 1)}</g>` + lab(cx, 184, 'ABCD'[i], { size: 28, c: V.ink, w: 700 }); });
    return box(G(g), '0 0 480 192', 'Four blocks labelled A to D, each under a different load');
  },
  /** two bars pulled until they broke: X keeps a stretched, necked shape; Y goes back to plain blocks */
  'st-fig33': () => {
    const sty = `fill="${V.zc}" fill-opacity=".26" stroke="${V.ink}" stroke-width="1.8"`;
    const y0 = 58, y1 = 138, h = 20;
    const before = cx => `<rect x="${cx - 32}" y="${y0 - h / 2}" width="64" height="${h}" ${sty}/>`;
    const X = cx => `<path d="M${cx - 66} ${y1 - h / 2}Q${cx - 22} ${y1 - h / 2 + 3} ${cx - 6} ${y1 - 2}V${y1 + 2}Q${cx - 22} ${y1 + h / 2 - 3} ${cx - 66} ${y1 + h / 2}Z" ${sty}/><path d="M${cx + 66} ${y1 - h / 2}Q${cx + 22} ${y1 - h / 2 + 3} ${cx + 6} ${y1 - 2}V${y1 + 2}Q${cx + 22} ${y1 + h / 2 - 3} ${cx + 66} ${y1 + h / 2}Z" ${sty}/>`;
    const Y = cx => { const t = y1 - h / 2, b = y1 + h / 2; return `<path d="M${cx - 38} ${t}H${cx - 6}L${cx - 10} ${t + 5}L${cx - 6} ${t + 10}L${cx - 10} ${t + 15}L${cx - 6} ${b}H${cx - 38}Z" ${sty}/><path d="M${cx + 38} ${t}H${cx + 6}L${cx + 10} ${t + 5}L${cx + 6} ${t + 10}L${cx + 10} ${t + 15}L${cx + 6} ${b}H${cx + 38}Z" ${sty}/>`; };
    return box(G(
      `<path d="M160 18V182" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="4 5"/>` +
      before(80) + before(240) + X(80) + Y(240) +
      arrow(80, y0 + 16, 80, y1 - 18, { c: V.ink3, w: 1.3, h: 7 }) + arrow(240, y0 + 16, 240, y1 - 18, { c: V.ink3, w: 1.3, h: 7 }) +
      lab(80, 30, 'X', { size: 20, c: V.ink, w: 700 }) + lab(240, 30, 'Y', { size: 20, c: V.ink, w: 700 }) +
      lab(80, 176, 'after breaking', { size: 13, c: V.ink3, w: 500 }) + lab(240, 176, 'after breaking', { size: 13, c: V.ink3, w: 500 })),
      '0 0 320 192', 'Two bars X and Y, before and after being pulled until they broke');
  },
  /** a stress–strain curve with four points: D on the straight line, A at its end, B at the top, C at the end of the curve */
  'st-curve-pts': () => {
    const P = { x0: 46, y0: 176, w: 252, h: 136 };
    const pt = (e, s) => toXY(P, e, s);
    const D = pt(C.ey * .45, stressAt(C.ey * .45, C)), A = pt(C.ey, C.sy), B = pt(C.eu, 1), F = pt(C.ef, C.sf);
    const dot = (p, l, dx, dy) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="5" fill="${V.zt}"/>` + lab(p[0] + dx, p[1] + dy, l, { size: 18, c: V.ink, w: 700 });
    return box(G(axes(P, { top: 18, right: 312 }) + `<path d="${curveD(P, C)}" stroke="${V.zc}" stroke-width="3"/>` +
      dot(D, 'D', 14, 6) + dot(A, 'A', 14, 10) + dot(B, 'B', 0, -12) + dot(F, 'C', 14, 4)),
      '0 0 320 206', 'A stress–strain curve with points A, B, C and D');
  },
  /** slide 9's letters: TS at the top (point M), F at the end */
  'st-tsmf': () => {
    const c = { ey: .045, sy: .52, eu: .58, ef: .95, sf: .7 }, P = { x0: 48, y0: 176, w: 252, h: 136 };
    const M = toXY(P, c.eu, 1), F = toXY(P, c.ef, c.sf);
    return box(G(axes(P, { top: 18, right: 312 }) +
      `<path d="M${P.x0} ${f1(M[1])}H${f1(M[0])}" stroke="${V.ink3}" stroke-width="1.3" stroke-dasharray="6 4"/>` +
      `<path d="${curveD(P, c)}" stroke="${V.zc}" stroke-width="3"/>` +
      `<circle cx="${f1(M[0])}" cy="${f1(M[1])}" r="5" fill="${V.zt}"/><circle cx="${f1(F[0])}" cy="${f1(F[1])}" r="5" fill="${V.zt}"/>` +
      lab(P.x0 - 8, M[1] + 5, 'TS', { a: 'end', size: 15, c: V.ink, w: 700 }) + lab(M[0], M[1] - 11, 'M', { size: 16, c: V.ink, w: 700 }) + lab(F[0] + 10, F[1] - 4, 'F', { a: 'start', size: 16, c: V.ink, w: 700 })),
      '0 0 320 206', 'A stress–strain curve with TS at its highest point M and the end of the curve at F');
  }
};
