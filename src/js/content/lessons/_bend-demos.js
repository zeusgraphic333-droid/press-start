// The bend lesson's three demos, shared by bend.js and bend.en.js (words picked at render time with api.L):
//   bd-unfold — the same bracket measured two ways: Lt = A + B + BA or Lt = A + B − BD (unfold it, flip BA ↔ BD)
//   bd-k      — slide the neutral axis through the thickness: K = t / T, and the neutral arc (the BA) grows or shrinks
//   bd-spring — push the punch, lift it, watch the part open: included angle up, bend angle down, radius up
import { C, tx, svg, ah, arrow, dim, arcD, vSheet } from '../../data/figs/bend.js';

const f = v => +(+v).toFixed(2);
const rad = d => d * Math.PI / 180;
const reduced = () => document.documentElement.dataset.motion === 'reduce' || (document.documentElement.dataset.motion !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);
const num = (v, d = 0) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);
/** tween a value with requestAnimationFrame; returns cancel() */
function tween(from, to, ms, step, done) {
  if (reduced() || ms <= 0) { step(to); done?.(); return () => { }; }
  const t0 = performance.now(); let raf = 0, dead = false;
  const tick = now => { if (dead) return; const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; step(from + (to - from) * e); if (k < 1) raf = requestAnimationFrame(tick); else done?.(); };
  raf = requestAnimationFrame(tick);
  return () => { dead = true; cancelAnimationFrame(raf); };
}
const seg = (name, opts, on) => `<div class="bnd-seg" role="radiogroup" aria-label="${name}">${opts.map(([k, l]) => `<button type="button" role="radio" data-k="${k}" aria-checked="${k === on}">${l}</button>`).join('')}</div>`;

/* =====================================================================================================
   1 · the flat length, two ways
   ===================================================================================================== */
// one real bracket: T = 2 mm, inside radius 3 mm. Measured to the bend: A 40 · B 30 · BA 6. To the outside corner:
// A 45 · B 35 · BD 4. Either way Lt = 76 mm (values a table or the exam gives you; the slides give no BA formula).
const U = { k: 3, A: 40, B: 30, BA: 6, A2: 45, B2: 35, BD: 4, T: 2, qx: 150, qy: 142 };
function unfoldSVG(mode, th) {
  const { k, qx, qy } = U;
  const tr = rad(Math.max(th, .001)), L = U.BA * k, r = L / tr;
  const P = th < .05 ? [qx - L, qy] : [qx - r * Math.sin(tr), qy - r * (1 - Math.cos(tr))];
  const dA = [-Math.cos(tr), -Math.sin(tr)], Aend = [P[0] + dA[0] * U.A * k, P[1] + dA[1] * U.A * k], Bend = [qx + U.B * k, qy];
  const arc = th < .05 ? `M${f(qx)} ${qy}L${f(P[0])} ${f(P[1])}` : `M${qx} ${qy}A${f(r)} ${f(r)} 0 0 1 ${f(P[0])} ${f(P[1])}`;
  const line = `M${f(Aend[0])} ${f(Aend[1])}L${f(P[0])} ${f(P[1])}${th < .05 ? `L${qx} ${qy}` : `A${f(r)} ${f(r)} 0 0 0 ${qx} ${qy}`}L${f(Bend[0])} ${qy}`;
  let s = `<path d="${line}" stroke="${C.ink}" stroke-width="${U.T * k + 2.4}"/><path d="${line}" stroke="${C.steel}" stroke-width="${U.T * k}"/>
    <path d="M${f(Aend[0])} ${f(Aend[1])}L${f(P[0])} ${f(P[1])}" stroke="${C.ink}" stroke-width="2"/><path d="M${qx} ${qy}L${f(Bend[0])} ${qy}" stroke="${C.ink}" stroke-width="2"/>
    <path d="${arc}" stroke="${C.zc}" stroke-width="3.2"/>`;
  const bent = th > 86, flat = th < 2, h = U.T * k / 2;
  if (bent && mode === 'ba') {
    s += `<path d="M${f(P[0] - h - 3)} ${f(Aend[1])}H${f(P[0] - 30)}M${f(P[0] - h - 3)} ${f(P[1])}H${f(P[0] - 30)}" stroke="${C.ink3}" stroke-width=".9"/>${dim(P[0] - 24, Aend[1], P[0] - 24, P[1])}${tx(P[0] - 34, (Aend[1] + P[1]) / 2 + 5, 'A = 40', { c: C.ink, z: 14, w: 600, a: 'end' })}
      <path d="M${qx} ${qy + h + 3}V${qy + 30}M${f(Bend[0])} ${qy + h + 3}V${qy + 30}" stroke="${C.ink3}" stroke-width=".9"/>${dim(qx, qy + 24, Bend[0], qy + 24)}${tx((qx + Bend[0]) / 2, qy + 42, 'B = 30', { c: C.ink, z: 14, w: 600 })}
      ${tx(qx + 14, qy - 18, 'BA = 6', { c: C.zt, z: 15, w: 700, a: 'start' })}<path d="M${qx + 12} ${qy - 20}L${f(qx - L * .55)} ${f(qy - L * .32)}" stroke="${C.ink3}"/>`;
  }
  if (bent && mode === 'bd') {
    const V = [P[0] - h, qy + h];
    s += `<path d="M${f(V[0])} ${f(P[1])}V${f(V[1])}H${qx}" stroke="${C.zt}" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${f(V[0])}" cy="${f(V[1])}" r="3.2" fill="${C.zt}"/>
      <path d="M${f(P[0] - h - 3)} ${f(Aend[1])}H${f(P[0] - 30)}M${f(V[0] - 3)} ${f(V[1])}H${f(P[0] - 30)}" stroke="${C.ink3}" stroke-width=".9"/>${dim(P[0] - 24, Aend[1], P[0] - 24, V[1])}${tx(P[0] - 34, (Aend[1] + V[1]) / 2 + 5, 'A = 45', { c: C.ink, z: 14, w: 600, a: 'end' })}
      <path d="M${f(V[0])} ${f(V[1] + 3)}V${qy + 30}M${f(Bend[0])} ${qy + h + 3}V${qy + 30}" stroke="${C.ink3}" stroke-width=".9"/>${dim(V[0], qy + 24, Bend[0], qy + 24)}${tx((V[0] + Bend[0]) / 2, qy + 42, 'B = 35', { c: C.ink, z: 14, w: 600 })}`;
  }
  if (flat && mode === 'ba') {
    const x0 = Aend[0], x1 = P[0];
    s += `${dim(x0, qy + 22, x1, qy + 22)}${dim(x1, qy + 22, qx, qy + 22, C.zt)}${dim(qx, qy + 22, Bend[0], qy + 22)}
      ${tx((x0 + x1) / 2, qy + 40, 'A = 40', { c: C.ink, z: 14, w: 600 })}${tx((x1 + qx) / 2, qy - 14, 'BA = 6', { c: C.zt, z: 14, w: 700 })}${tx((qx + Bend[0]) / 2, qy + 40, 'B = 30', { c: C.ink, z: 14, w: 600 })}`;
  }
  if (flat && mode === 'bd') {
    const x0 = Aend[0], xa = x0 + U.A2 * k, xb = Bend[0] - U.B2 * k;
    s += `<rect x="${f(xb)}" y="${qy - 26}" width="${f(xa - xb)}" height="52" fill="${C.hot}" fill-opacity=".14" stroke="${C.hot}" stroke-dasharray="3 3"/>
      ${dim(x0, qy - 18, xa, qy - 18)}${tx((x0 + xa) / 2, qy - 26, 'A = 45', { c: C.ink, z: 14, w: 600 })}
      ${dim(xb, qy + 20, Bend[0], qy + 20)}${tx((xb + Bend[0]) / 2, qy + 38, 'B = 35', { c: C.ink, z: 14, w: 600 })}
      ${tx((xa + xb) / 2, qy + 46, 'BD = 4', { c: C.hot, z: 14, w: 700 })}`;
  }
  if (flat) s += `${dim(Aend[0], qy + 58, Bend[0], qy + 58, C.ink2)}${tx((Aend[0] + Bend[0]) / 2, qy + 76, 'Lt = 76 mm', { c: C.ink, z: 15, w: 700 })}`;
  return svg('0 0 300 226', s, 'A bracket that bends and unfolds');
}
export function mountUnfold(el, api) {
  const L = api.L;
  let mode = 'ba', th = 90, stop = () => { };
  const seen = new Set();
  el.innerHTML = `<div class="bnd-demo bnd-unf">
    <div class="bnd-demo__fig"></div>
    <div class="bnd-demo__side">
      <span class="label">${L('A وB بيتقاسوا لحد فين؟', 'Where do A and B stop?')}</span>
      ${seg(L('نوع القياس', 'How it is measured'), [['ba', 'BA'], ['bd', 'BD']], 'ba')}
      <label class="bnd-range"><span class="label">${L('زاوية الثني', 'Bend angle')}</span><span class="hud-num bnd-unf__v">90°</span><input type="range" min="0" max="90" step="1" value="90" aria-label="${L('زاوية الثني', 'Bend angle')}"></label>
      <div class="bnd-btns"><button type="button" class="btn btn--sm" data-go="0">${L('افرد', 'Unfold')}</button><button type="button" class="btn btn--sm" data-go="90">${L('اثني', 'Bend')}</button></div>
      <p class="bnd-read" aria-live="polite"><b class="bnd-eq" dir="ltr"></b><small></small></p>
    </div></div>`;
  const fig = el.querySelector('.bnd-demo__fig'), range = el.querySelector('input'), read = el.querySelector('.bnd-read');
  const paint = () => {
    fig.innerHTML = unfoldSVG(mode, th);
    el.querySelector('.bnd-unf__v').textContent = Math.round(th) + '°'; range.value = Math.round(th);
    read.querySelector('.bnd-eq').textContent = mode === 'ba' ? 'Lt = A + B + BA = 40 + 30 + 6 = 76 mm' : 'Lt = A + B − BD = 45 + 35 − 4 = 76 mm';
    read.querySelector('small').innerHTML = mode === 'ba'
      ? L('A وB لحد ما الثنية تبدأ. الثنية نفسها ناقصة، فبنجمع الـ <bdi dir="ltr">BA</bdi>.', 'A and B stop where the bend starts. The bend itself is missing, so you add BA.')
      : L('A وB لحد الركن الخارجي. الحتة دي اتحسبت مرتين، فبنطرح الـ <bdi dir="ltr">BD</bdi>.', 'A and B run to the outside corner. That bit got counted twice, so you subtract BD.');
    if (th > 86) seen.add(mode + ':bent'); if (th < 2) seen.add(mode + ':flat');
    if (seen.size >= 3 && [...seen].some(k => k.startsWith('ba')) && [...seen].some(k => k.startsWith('bd'))) api.award(5, { from: read, key: 'demo:bd-unfold' });
  };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.k; el.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-checked', String(x === b))); api.sfx('click'); paint(); }));
  range.addEventListener('input', () => { stop(); th = +range.value; paint(); });
  el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { stop(); api.sfx('swoosh'); stop = tween(th, +b.dataset.go, 900, v => { th = v; paint(); }); }));
  paint();
  return () => stop();
}

/* =====================================================================================================
   2 · the K-factor: where the neutral axis sits inside the thickness
   ===================================================================================================== */
function kSVG(t, T) {
  const k = 28, cx = 190, cy = 116, ri = 40, tp = T * k, ro = ri + tp, rn = ri + t * k, xe = 300, yt = 14;
  const body = `M${cx - ro} ${yt}V${cy}${arcD(cx, cy, ro, 180, 90, '')}H${xe}V${cy + ri}H${cx}${arcD(cx, cy, ri, 90, 180, '')}V${yt}Z`;
  const comp = `M${cx - rn} ${cy}${arcD(cx, cy, rn, 180, 90, '')}V${cy + ri}${arcD(cx, cy, ri, 90, 180, '')}Z`;
  const tens = `M${cx - ro} ${cy}${arcD(cx, cy, ro, 180, 90, '')}V${cy + rn}${arcD(cx, cy, rn, 90, 180, '')}Z`;
  const s = `<path d="${body}" fill="${C.steel}" fill-opacity=".18"/><path d="${tens}" fill="${C.hot}" fill-opacity=".22"/><path d="${comp}" fill="${C.zc}" fill-opacity=".3"/>
    <path d="${body}" stroke="${C.ink}" stroke-width="1.6"/>
    <path d="M${cx - rn} ${yt - 4}V${cy}" stroke="${C.zt}" stroke-width="1.6" stroke-dasharray="5 4"/><path d="M${cx} ${f(cy + rn)}H${xe + 4}" stroke="${C.zt}" stroke-width="1.6" stroke-dasharray="5 4"/>
    <path d="${arcD(cx, cy, rn, 180, 90)}" stroke="${C.zt}" stroke-width="3.4"/>
    <path d="M${xe + 2} ${cy + ri}H${xe + 22}M${xe + 2} ${cy + ro}H${xe + 22}M${xe + 6} ${f(cy + rn)}H${xe + 46}" stroke="${C.ink3}" stroke-width=".9"/>
    ${dim(xe + 16, cy + ri, xe + 16, cy + ro)}${tx(xe + 24, cy + ri + tp - 6, 'T', { c: C.ink, z: 18, w: 700, a: 'start' })}
    ${t * k > 12 ? dim(xe + 40, cy + ri, xe + 40, cy + rn, C.zt) : ''}${tx(xe + 46, f(cy + ri + t * k / 2 + 6), 't', { c: C.zt, z: 18, w: 700, a: 'start' })}
    ${tx(cx - ri + 8, yt + 30, 'inside', { c: C.ink2, z: 15, w: 600, a: 'start' })}${tx(cx - ri + 8, yt + 48, 'compressed', { c: C.ink3, z: 13.5, a: 'start' })}
    ${tx(cx - ro - 8, yt + 30, 'outside', { c: C.ink2, z: 15, w: 600, a: 'end' })}${tx(cx - ro - 8, yt + 48, 'stretched', { c: C.ink3, z: 13.5, a: 'end' })}
    ${tx(266, 98, 'neutral arc = BA', { c: C.zt, z: 15.5, w: 700 })}<path d="M236 104L${f(cx - rn * .7071 + 2)} ${f(cy + rn * .7071 - 2)}" stroke="${C.ink3}"/>`;
  return svg('0 0 372 236', s, 'A bend section with the neutral axis');
}
export function mountK(el, api) {
  const L = api.L, T = 2;
  let t = .8, moves = 0;
  el.innerHTML = `<div class="bnd-demo bnd-k">
    <div class="bnd-demo__fig"></div>
    <div class="bnd-demo__side">
      <label class="bnd-range"><span class="label">${L('حرّك المحور (t)', 'Move the axis (t)')}</span><span class="hud-num bnd-k__t" dir="ltr">0.80 mm</span><input type="range" min="0" max="${T * 100}" step="5" value="80" aria-label="t"></label>
      <div class="bnd-k__math" dir="ltr"><span>K = t / T</span><b class="hud-num bnd-k__eq"></b></div>
      <div class="bnd-k__bar" aria-hidden="true"><i></i></div>
      <p class="bnd-read" aria-live="polite"><b></b><small></small></p>
    </div></div>`;
  const fig = el.querySelector('.bnd-demo__fig'), range = el.querySelector('input'), read = el.querySelector('.bnd-read'), bar = el.querySelector('.bnd-k__bar i');
  const paint = () => {
    const K = t / T;
    fig.innerHTML = kSVG(t, T);
    el.querySelector('.bnd-k__t').textContent = num(t, 2) + ' mm';
    el.querySelector('.bnd-k__eq').textContent = `${num(t, 2)} / ${num(T, 2)} = ${num(K, 2)}`;
    bar.style.setProperty('--p', (40 + t * 28) / (40 + T * 28));
    const [a, b] = K < .02 ? [L('المحور على السطح اللي جوه', 'The axis sits on the inside surface'), L('K = 0', 'K = 0')]
      : K > .98 ? [L('المحور على السطح اللي بره', 'The axis sits on the outside surface'), L('K = 1', 'K = 1')]
      : Math.abs(K - .5) < .03 ? [L('المحور في نص التخانة بالظبط', 'The axis is exactly in the middle'), 'K = 0.5']
      : K < .5 ? [L('المحور أقرب لجوه', 'The axis is nearer the inside'), L('القوس أقصر، فالـ BA أقل.', 'A shorter arc, so a smaller BA.')]
      : [L('المحور أقرب لبره', 'The axis is nearer the outside'), L('القوس أطول، فالـ BA أكبر.', 'A longer arc, so a bigger BA.')];
    read.querySelector('b').textContent = a; read.querySelector('small').textContent = b;
  };
  range.addEventListener('input', () => { t = range.value / 100; moves++; paint(); if (moves > 6) api.award(5, { from: range, key: 'demo:bd-k' }); });
  paint();
}

/* =====================================================================================================
   3 · springback: bend it in the tool, lift the punch, watch it open
   ===================================================================================================== */
// a demo model (exaggerated so you can see it, not from the slides): the first 6° of bend are all elastic and come
// back; past that point the part keeps the plastic share and still gives back a little (2.5% of the rest)
const YIELD = 6;
export const springOf = beta => Math.min(beta, YIELD) + .025 * Math.max(0, beta - YIELD);
function springSVG(beta, punchY, after, betaTool) {
  const cx = 160, top = 132, w = 62, half = 45, depth = w; // a 90° V-die
  const inc = 180 - beta, hs = inc / 2; // the sheet's legs: half the included angle from the vertical
  const ay = top + w * Math.tan(rad(beta / 2)) * (beta > .2 ? 1 : 0);
  const rr = after ? 7 + 9 * Math.min(1, (betaTool - beta) / 10) : 7;
  let s = `<path d="M${cx - 132} ${top}H${f(cx - w)}L${cx} ${top + depth}L${f(cx + w)} ${top}H${cx + 132}V${top + depth + 18}H${cx - 132}Z" fill="${C.steel}" fill-opacity=".42" stroke="${C.ink}" stroke-width="1.4"/>
    <path d="M${cx - 140} ${top + depth + 18}H${cx + 140}" stroke="${C.ink3}"/>`;
  if (after) s += `<path d="M${cx - 96} ${top + depth - 96}L${cx} ${top + depth}L${cx + 96} ${top + depth - 96}" stroke="${C.ink3}" stroke-dasharray="4 3"/>${tx(cx + 100, top + depth - 100, 'tool', { c: C.ink3, z: 12.5, a: 'start' })}`;
  s += `<path d="${vSheet(cx, ay, Math.max(hs, 45.01), 122, 7, rr)}" fill="${C.zc}" fill-opacity=".55" stroke="${C.ink}" stroke-width="1.4"/>`;
  const py = punchY;
  s += `<path d="M${cx - 20} ${py - 150}H${cx + 20}V${f(py - 20)}L${cx} ${f(py)}L${cx - 20} ${f(py - 20)}Z" fill="${C.steel}" fill-opacity=".2" stroke="${C.ink}" stroke-width="1.4"/>`;
  if (after) {
    const ua = ay - 7 / Math.sin(rad(Math.max(hs, 45.01)));
    s += `<path d="${arcD(cx, ua, 34, 270 - hs, 270 + hs)}" stroke="${C.zt}" stroke-width="1.4"/>${ah(...[cx + 34 * Math.cos(rad(270 + hs)), ua + 34 * Math.sin(rad(270 + hs))], rad(360 + hs), C.zt, 6)}
      ${tx(cx, ua - 42, `α′ = ${num(180 - beta, 1)}°`, { c: C.zt, z: 15, w: 700 })}`;
  }
  return svg('0 0 320 236', s, 'A punch bending a sheet in a V-die');
}
export function mountSpring(el, api) {
  const L = api.L;
  const cx = 160, top = 132, w = 62;
  let beta = 0, betaTool = 0, phase = 'press', stop = () => { };
  const tipY = b => (top + w * Math.tan(rad(b / 2))) - 7 / Math.sin(rad(Math.max(90 - b / 2, 45.01)));
  el.innerHTML = `<div class="bnd-demo bnd-spr">
    <div class="bnd-demo__fig"></div>
    <div class="bnd-demo__side">
      <label class="bnd-range"><span class="label">${L('انزل بالبنش', 'Push the punch down')}</span><span class="hud-num bnd-spr__v">0%</span><input type="range" min="0" max="100" step="1" value="0" aria-label="${L('البنش', 'Punch')}"></label>
      <div class="bnd-btns"><button type="button" class="btn btn--zone btn--sm" data-a="lift" disabled>${L('شيل البنش', 'Lift the punch')}</button><button type="button" class="btn btn--sm" data-a="again" hidden>${L('من الأول', 'Again')}</button></div>
      <div class="bnd-spr__chips"><span class="chip bnd-spr__st"></span></div>
      <dl class="bnd-spr__dl" dir="ltr"></dl>
      <p class="bnd-read" aria-live="polite"><b></b><small></small></p>
    </div></div>`;
  const fig = el.querySelector('.bnd-demo__fig'), range = el.querySelector('input'), lift = el.querySelector('[data-a="lift"]'), again = el.querySelector('[data-a="again"]');
  const dl = el.querySelector('.bnd-spr__dl'), read = el.querySelector('.bnd-read'), st = el.querySelector('.bnd-spr__st');
  let punchY = 40;
  const paint = () => {
    fig.innerHTML = springSVG(beta, punchY, phase === 'after', betaTool);
    const inc = 180 - beta;
    el.querySelector('.bnd-spr__v').textContent = range.value + '%';
    const elastic = betaTool <= YIELD;
    st.textContent = phase === 'press' && betaTool > 0 ? (elastic ? L('لسه elastic: هيرجع كله', 'Still elastic: it will all come back') : L('عدّى الـ yield: الثنية هتفضل', 'Past the yield point: the bend will stay')) : '';
    st.hidden = !st.textContent; st.classList.toggle('chip--zone', !elastic);
    if (phase === 'press') {
      dl.innerHTML = `<dt>bend angle</dt><dd class="hud-num">${num(beta)}°</dd><dt>included angle</dt><dd class="hud-num">${num(inc)}°</dd>`;
      read.querySelector('b').textContent = betaTool ? L('الصاج واخد شكل العدة', 'The sheet takes the shape of the tool') : L('الصاج لسه مفرود', 'The sheet is still flat');
      read.querySelector('small').innerHTML = betaTool ? L('دلوقتي اضغط «شيل البنش» وشوف هيحصل إيه.', 'Now press “Lift the punch” and watch.') : L('حرّك السلايدر لتحت عشان تثني.', 'Move the slider to bend it.');
    } else if (phase === 'after') {
      const back = betaTool - beta;
      dl.innerHTML = `<dt>in the tool · α<sub>b</sub>′</dt><dd class="hud-num">${num(180 - betaTool, 1)}°</dd><dt>after · α′</dt><dd class="hud-num">${num(inc, 1)}°</dd><dt>bend angle</dt><dd class="hud-num">${num(betaTool, 1)}° → ${num(beta, 1)}°</dd>`;
      if (betaTool <= YIELD) {
        read.querySelector('b').textContent = L('رجع مفرود خالص!', 'It went all the way back flat!');
        read.querySelector('small').innerHTML = L('ما عدّيتش الـ <bdi dir="ltr">yield</bdi>، فالثنية كلها كانت <bdi dir="ltr">elastic</bdi>. فاكر محاضرة ٢؟', 'You never passed the yield point, so the whole bend was elastic. Remember Lecture 2?');
      } else {
        read.querySelector('b').innerHTML = L(`فتح <bdi dir="ltr">${num(back, 1)}°</bdi>: ده الـ <bdi dir="ltr">springback</bdi>`, `It opened ${num(back, 1)}°: that’s springback`);
        read.querySelector('small').innerHTML = L('الزاوية المحصورة كبرت، زاوية الثني قلت، ونص القطر كبر. (الرقم مكبّر عشان تشوفه.)', 'The included angle grew, the bend angle shrank, and the radius grew. (Exaggerated so you can see it.)');
      }
    }
  };
  range.addEventListener('input', () => {
    if (phase !== 'press') return;
    const v = range.value / 100; // the first fifth brings the punch down to the sheet, the rest bends it
    if (v < .2) { beta = 0; punchY = 40 + (tipY(0) - 40) * v / .2; } else { beta = 90 * (v - .2) / .8; punchY = tipY(beta); }
    betaTool = beta; lift.disabled = beta <= 0; paint();
  });
  lift.addEventListener('click', () => {
    if (phase !== 'press' || betaTool <= 0) return;
    phase = 'lift'; range.disabled = true; lift.disabled = true; api.sfx('whoosh');
    const from = punchY, end = Math.max(0, betaTool - springOf(betaTool));
    stop = tween(from, 30, 450, v => { punchY = v; fig.innerHTML = springSVG(beta, punchY, false, betaTool); }, () => {
      phase = 'after';
      stop = tween(betaTool, end, 650, v => { beta = v; paint(); }, () => { again.hidden = false; again.focus({ preventScroll: true }); api.sfx(betaTool > YIELD ? 'flip' : 'boop'); if (betaTool > 60) api.award(5, { from: read, key: 'demo:bd-spring' }); });
    });
  });
  again.addEventListener('click', () => { stop(); phase = 'press'; beta = 0; betaTool = 0; punchY = 40; range.value = 0; range.disabled = false; lift.disabled = true; again.hidden = true; api.sfx('click'); paint(); });
  paint();
  return () => stop();
}
