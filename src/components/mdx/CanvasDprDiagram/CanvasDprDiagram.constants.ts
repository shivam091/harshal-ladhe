import type { PixelCell } from "@/components/mdx/CanvasDprDiagram/CanvasDprDiagram.types";

// Code captions read as real code only in monospace.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Big enough that single device pixels stay visible once the SVG shrinks to phone width.
export const AREA_SIZE = 192;

// Leaves room above the patches for each panel's title and code line.
export const AREA_Y = 68;

// Keeps the blurry patch centred in the left half of the viewBox.
export const LEFT_AREA_X = 44;

// Keeps the sharp patch centred in the right half of the viewBox.
export const RIGHT_AREA_X = 364;

// The screen is the same in both panels; only the backing store changes, so this count must not.
export const DEVICE_PIXELS = 12;

// 2 is the most common high-DPI ratio and the easiest stretch to see as a 2 × 2 block.
export const DPR = 2;

// Derived rather than hard-coded so the grid always divides the patch exactly.
export const DEVICE_PX_SIZE = AREA_SIZE / DEVICE_PIXELS;

// Centred so both resolutions rasterise an identical, symmetric shape.
const CIRCLE_CENTRE = AREA_SIZE / 2;

// Large enough that the curved edge crosses many pixels, where blur and stair-stepping show.
const CIRCLE_RADIUS = 68;

// Enough sub-samples for believable anti-aliasing without noticeable render cost.
const SAMPLES = 8;

// Guarantees the blocky and crisp versions are genuinely the same circle, differing only in resolution.
function rasteriseCircle(count: number): PixelCell[] {
  const size = AREA_SIZE / count;
  const cells: PixelCell[] = [];

  for (let row = 0; row < count; row += 1) {
    for (let column = 0; column < count; column += 1) {
      let inside = 0;

      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const px = (column + (sx + 0.5) / SAMPLES) * size;
          const py = (row + (sy + 0.5) / SAMPLES) * size;

          if (Math.hypot(px - CIRCLE_CENTRE, py - CIRCLE_CENTRE) <= CIRCLE_RADIUS) {
            inside += 1;
          }
        }
      }

      if (inside > 0) {
        cells.push({ x: column * size, y: row * size, size, alpha: inside / (SAMPLES * SAMPLES) });
      }
    }
  }

  return cells;
}

// An un-scaled backing store has too few pixels for the screen — the cause of the blur.
export const BLURRY_CELLS = rasteriseCircle(DEVICE_PIXELS / DPR);

// A DPR-scaled backing store matches the screen pixel for pixel — the fix.
export const SHARP_CELLS = rasteriseCircle(DEVICE_PIXELS);

// An un-scaled canvas pixel spans DPR device pixels, which is the whole problem in one number.
export const BLURRY_CANVAS_PX_SIZE = DEVICE_PX_SIZE * DPR;

// An edge pixel, because the 2 × 2 stretch is easiest to spot where the circle fades out.
export const BLURRY_HIGHLIGHT = { x: BLURRY_CANVAS_PX_SIZE, y: BLURRY_CANVAS_PX_SIZE, size: BLURRY_CANVAS_PX_SIZE };

// A matching edge pixel, so the two highlights compare like with like.
export const SHARP_HIGHLIGHT = { x: DEVICE_PX_SIZE * 2, y: DEVICE_PX_SIZE * 3, size: DEVICE_PX_SIZE };

// The physical screen grid, identical in both panels because the hardware never changes.
export const DEVICE_GRID_LINES = Array.from({ length: DEVICE_PIXELS - 1 }, (_, index) => (index + 1) * DEVICE_PX_SIZE);

// Canvas-pixel boundaries make each stretched 2 × 2 block visible against the screen grid.
export const BLURRY_CANVAS_GRID_LINES = Array.from(
  { length: DEVICE_PIXELS / DPR - 1 },
  (_, index) => (index + 1) * BLURRY_CANVAS_PX_SIZE
);
