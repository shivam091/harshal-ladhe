// Two panels, each running the exact same two filter primitives — a blur and a contrast boost —
// through an SVG <filter> chain in opposite orders, on the exact same crisp-edged circle.
export const PANEL_W = 180;
export const PANEL_H = 150;

const MARGIN = 10;
const PANEL_GAP = 40;

export const PANEL_LEFT_X = MARGIN;
export const PANEL_RIGHT_X = MARGIN + PANEL_W + PANEL_GAP;
export const PANEL_Y = 46;

export const CANVAS_W = PANEL_RIGHT_X + PANEL_W + MARGIN;
export const CANVAS_H = PANEL_Y + PANEL_H + 60;

/*
  The demo shape: a plain, hard-edged circle in one flat "ink" color — deliberately pure, with no
  midtones anywhere. That single choice is what makes the two panels diverge: contrast() has no
  gray pixels to push toward black or white until AFTER something has blurred the edge into one.
*/
export const CIRCLE_CX = PANEL_W / 2;
export const CIRCLE_CY = PANEL_H / 2 - 6;
export const CIRCLE_R = 44;
export const SHAPE_COLOR = "#1e293b"; // fixed "ink" content color, not a theme token
export const BACKDROP_COLOR = "#f8fafc"; // fixed "paper" content color the circle sits on

// Shared filter amounts — identical numbers in both panels; only the ORDER of the two filter
// primitives differs between the two <filter> definitions that use these.
export const BLUR_STD_DEVIATION = 5;
export const CONTRAST_AMOUNT = 3;

/*
  CSS filter(contrast(amount)) is defined as: result = amount * channel + (0.5 - 0.5 * amount) for
  each of R/G/B. <feComponentTransfer type="linear"> takes exactly that slope/intercept pair, so
  this reproduces contrast(3) precisely rather than approximating it.
*/
export const CONTRAST_SLOPE = CONTRAST_AMOUNT;
export const CONTRAST_INTERCEPT = 0.5 - 0.5 * CONTRAST_AMOUNT;
