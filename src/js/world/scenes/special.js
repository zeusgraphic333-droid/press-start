// Immersive scenes — special: monolith (the boss: The Press) · nebula (raw stock, between things).
import { build, C, k, mix } from './kit.js';

export default N => ({
  /* The Press: an H-frame press; the ram slams onto a blank in the die, sparks fly at contact */
  monolith: () => build(N, 29, (P, n) => {
    const H = C.hot, W = C.chalk, S = C.steel;
    [-2.0, 1.66].forEach(x => { P.rect(n * .07, x, -2.3, .34, 4.5, k(S, .75)); P.box(n * .035, x, -2.3, .34, 4.5, W); });
    P.rect(n * .08, -2.25, 1.7, 4.5, .62, k(H, .7)); P.box(n * .03, -2.25, 1.7, 4.5, .62, W);
    P.rect(n * .08, -2.25, -2.3, 4.5, .55, k(H, .7)); P.box(n * .03, -2.25, -2.3, 4.5, .55, W);
    P.rect(n * .05, -.42, .9, .84, .8, k(S, .55));
    // the ram, drawn at contact (group 7 lifts it and slams it down)
    P.rect(n * .1, -1.25, -.5, 2.5, .52, H, 7); P.box(n * .03, -1.25, -.5, 2.5, .52, W, .015, 7);
    P.rect(n * .05, -.22, .02, .44, .95, k(H, .85), 7);
    P.poly(n * .05, [[-.45, -.5], [.45, -.5], [.22, -1.2], [-.22, -1.2]], k(W, .9), 7);
    // the die and the blank on it
    P.poly(n * .07, [[-1.1, -1.75], [1.1, -1.75], [1.1, -1.22], [.3, -1.22], [0, -1.55], [-.3, -1.22], [-1.1, -1.22]], k(S, .7));
    P.seg(n * .03, -1.3, -1.2, 1.3, -1.2, C.yellow, .012);
    P.sparks(n * .05, 0, -1.25, .45);
  }, .64),
  /* raw stock: a slow vortex of embers, with a few rising */
  nebula: () => build(N, 41, (P, n) => {
    for (let q = 0; q < n * .86; q++) { const rad = Math.pow(P.r(), .5) * 3.3, th = P.r() * Math.PI * 2, t = rad / 3.3; P.pt(Math.cos(th) * rad, P.g() * .42 * (1.2 - t * .6), Math.sin(th) * rad * .6, k(mix(mix(C.yellow, C.hot, t), C.violet, Math.max(0, t - .55) * 1.6), .35 + P.r() * .45), 0, [0, 0, 0, .1]); }
    P.sparks(n * .14, 0, -.6, 1.6, C.orange);
  }, .56)
});
