// The figure frame shared by every figs/<zone>.js: viewBox 320 × 200 by default, with an accessible label.
import { esc } from '../../core/util.js';
export const box = (inner, vb = '0 0 320 200', label = '') => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}" class="fig-svg">${inner}</svg>`;
