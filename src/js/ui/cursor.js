// A quiet custom cursor for fine pointers: a dot that leads and a ring that follows, growing over things you can press.
export function mountCursor() {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.createElement('div'), ring = document.createElement('div');
  dot.className = 'cur cur--dot'; ring.className = 'cur cur--ring';
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-cursor');
  let x = -100, y = -100, rx = -100, ry = -100, shown = false, raf = 0;
  const loop = () => { rx += (x - rx) * .2; ry += (y - ry) * .2; dot.style.transform = `translate(${x}px, ${y}px)`; ring.style.transform = `translate(${rx}px, ${ry}px)`; raf = requestAnimationFrame(loop); };
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; document.documentElement.classList.add('cursor-on'); }
    const t = e.target.closest?.('a, button, [role="tab"], [role="option"], label, summary, .fc, .gcard--flip, input, select');
    ring.classList.toggle('is-hot', !!t && !t.matches('input[type="text"], input[type="search"], input:not([type])'));
    ring.classList.toggle('is-text', !!e.target.closest?.('input[type="text"], input[type="search"], .onb__name, textarea'));
    ring.classList.toggle('is-drag', !!e.target.closest?.('.world__canvas') && !document.getElementById('screens').children.length);
  }, { passive: true });
  window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => { shown = false; document.documentElement.classList.remove('cursor-on'); });
  loop();
}
