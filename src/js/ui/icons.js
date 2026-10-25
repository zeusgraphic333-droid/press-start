// Hand-made icon set: chunky strokes, round caps, same 24px grid.
import { isRTL, t } from '../core/i18n.js';
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const CHEV_R = s('<path d="M9 5l7 7-7 7"/>'), CHEV_L = s('<path d="M15 5l-7 7 7 7"/>');
export const ICON = {
  /** "back" and "next" follow the reading direction (read at render time): back points right in Arabic, left in English */
  get back() { return isRTL() ? CHEV_R : CHEV_L; },
  get next() { return isRTL() ? CHEV_L : CHEV_R; },
  map: s('<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>'),
  book: s('<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>'),
  play: s('<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11" r=".6" fill="currentColor"/><circle cx="17.5" cy="13.5" r=".6" fill="currentColor"/>'),
  target: s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
  sound: s('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  mute: s('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  bag: s('<path d="M5 9.5C5 7.6 6.6 6 8.5 6h7C17.4 6 19 7.6 19 9.5V19c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1z"/><path d="M9 6V5a3 3 0 0 1 6 0v1"/><path d="M8.5 13h7v3.5h-7z"/>'),
  flame: s('<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.8 3-5.6 3.6-9.3 2.7 1.4 3.4 4 3.2 5.6 1-.6 1.8-1.8 2-3.2 2.4 2 4.2 4.4 4.2 7 0 3.5-2.5 6.1-6.5 6.1z"/>'),
  star: s('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z" fill="currentColor"/>'),
  check: s('<path d="M4.5 12.5l5 5 10-11"/>'),
  x: s('<path d="M6 6l12 12M18 6L6 18"/>'),
  lock: s('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>'),
  flag: s('<path d="M5 21V4M5 4.5c5-2.5 8 2.5 14 0v9c-6 2.5-9-2.5-14 0"/>'),
  heart: s('<path d="M12 20s-7.5-4.6-7.5-10.1C4.5 7.2 6.4 5 9 5c1.4 0 2.4.7 3 1.7.6-1 1.6-1.7 3-1.7 2.6 0 4.5 2.2 4.5 4.9C19.5 15.4 12 20 12 20z" fill="currentColor"/>'),
  trophy: s('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5c0 3 1.5 4.5 3.7 4.8M16 6h3.5c0 3-1.5 4.5-3.7 4.8M12 13v4M8.5 20h7M10 17h4"/>'),
  sparkle: s('<path d="M12 3c.6 4.5 3.5 7.4 8 8-4.5.6-7.4 3.5-8 8-.6-4.5-3.5-7.4-8-8 4.5-.6 7.4-3.5 8-8z" fill="currentColor"/>'),
  cards: s('<rect x="3.5" y="6" width="12" height="15" rx="2.5"/><path d="M8.5 6V5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-3"/>'),
  bolt: s('<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor"/>'),
  info: s('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.2"/>'),
  gear: s('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2L5.5 5.5"/>'),
  refresh: s('<path d="M19.5 8A8 8 0 1 0 20 13"/><path d="M20 3.5V8h-4.5"/>'),
  eye: s('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  swords: s('<path d="M4 4l10 10M4 4v4M4 4h4M20 4L10 14M20 4v4M20 4h-4M7 17l3-3M14 14l3 3M5.5 18.5l2 2M18.5 18.5l-2 2"/>'),
  portal: s('<rect x="3" y="4" width="18" height="14" rx="2.5"/><path d="M8 21h8M12 18v3M7 9h6M7 12.5h10"/>'),
  skull: s('<path d="M12 3c4.7 0 8 3.2 8 7.4 0 2.6-1.3 4.3-3 5.3V19c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1v-3.3c-1.7-1-3-2.7-3-5.3C4 6.2 7.3 3 12 3z"/><circle cx="9" cy="11" r="1.7" fill="currentColor"/><circle cx="15" cy="11" r="1.7" fill="currentColor"/>'),
  list: s('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>'),
  shuffle: s('<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.3-1.6 4.4-3.6M15 7h6M18 4l3 3-3 3M18 14l3 3-3 3"/>'),
  /** the illustrated (printed) look: two overprinted shapes */
  print: s('<circle cx="9" cy="9.5" r="5.5"/><rect x="10.5" y="10" width="9.5" height="9.5" rx="1.5"/>')
};
const SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5C11.1 16.9 7.1 12.9 1.5 12 7.1 11.1 11.1 7.1 12 1.5z" fill="currentColor"/></svg>';
/** 0–3 marks (the "stars" of this world, drawn as sparks) */
export const marks = (n, of = 3, cls = '') => `<span class="marks ${cls}" role="img" aria-label="${t('common.marks', { n, of })}">${Array.from({ length: of }, (_, i) => `<span class="${i < n ? 'on' : 'off'}">${SPARK}</span>`).join('')}</span>`;
export const starRow = marks;
