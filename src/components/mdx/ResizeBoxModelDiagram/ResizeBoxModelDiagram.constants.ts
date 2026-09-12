// Left x coordinate of the outer border-box rect (includes border + padding + content).
export const BORDER_BOX_X = 60;
// Top y coordinate of the outer border-box rect.
export const BORDER_BOX_Y = 34;
// Width of the outer border-box rect.
export const BORDER_BOX_W = 240;
// Height of the outer border-box rect.
export const BORDER_BOX_H = 150;

// Uniform gap between the border-box edge and the content-box edge, standing in for border + padding.
export const PADDING = 32;
// Left x coordinate of the inner content-box rect, inset from the border-box by PADDING on every side.
export const CONTENT_BOX_X = BORDER_BOX_X + PADDING;
// Top y coordinate of the inner content-box rect.
export const CONTENT_BOX_Y = BORDER_BOX_Y + PADDING;
// Width of the inner content-box rect.
export const CONTENT_BOX_W = BORDER_BOX_W - PADDING * 2;
// Height of the inner content-box rect.
export const CONTENT_BOX_H = BORDER_BOX_H - PADDING * 2;

// Top-left corner the device-pixel-content-box callout's leader line starts from (content-box's own corner).
export const CALLOUT_ANCHOR_X = CONTENT_BOX_X + CONTENT_BOX_W;
// Matching y coordinate for the callout leader line's start point.
export const CALLOUT_ANCHOR_Y = CONTENT_BOX_Y + CONTENT_BOX_H / 2;
