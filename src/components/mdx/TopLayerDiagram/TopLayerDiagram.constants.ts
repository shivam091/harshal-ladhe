// Same edge for both planes, so the top layer visibly spans the whole document beneath it.
export const PLANE_LEFT = 20;
// Same edge for both planes, so neither looks narrower than the other.
export const PLANE_RIGHT = 400;

// Sits above the document, because the top layer is composited over everything else.
export const TOP_LAYER_Y = 34;
// Tall enough to hold the dialog and its backdrop.
export const TOP_LAYER_H = 96;
// Leaves a visible gap below the top layer, so the two planes read as separate.
export const DOCUMENT_Y = 176;
// Tall enough to nest the dialog inside its clipping, transformed ancestors.
export const DOCUMENT_H = 150;

// The dialog's source position, deep inside ancestors that would normally clip it.
export const DIALOG_DOM = { x: 196, y: 270, w: 70, h: 34 };
// The dialog's painted position once promoted, clear of every ancestor.
export const DIALOG_TOP = { x: 160, y: 58, w: 100, h: 50 };
