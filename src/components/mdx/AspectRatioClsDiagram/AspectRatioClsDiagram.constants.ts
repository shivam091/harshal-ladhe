// One mock "card" frame — a wireframe of a title, an image slot, and a paragraph.
export const FRAME_W = 170;
export const FRAME_H = 190;

// Horizontal gap between the "before load" and "after load" frames in a row, wide enough for an arrow + label.
const FRAME_GAP_X = 70;

const MARGIN = 20;
export const T0_X = MARGIN;
export const T1_X = MARGIN + FRAME_W + FRAME_GAP_X;

// Shared wireframe geometry, identical in every frame — only whether the image slot exists yet, and where
// the paragraph starts, changes between frames.
export const TITLE_X = 14;
export const TITLE_Y = 14;
export const TITLE_W = FRAME_W - TITLE_X * 2;
export const TITLE_H = 12;

export const IMAGE_X = 14;
export const IMAGE_Y = 34;
export const IMAGE_W = FRAME_W - IMAGE_X * 2;
export const IMAGE_H = 90;

// Paragraph line widths (decreasing, like justified body copy trailing off) and shared geometry.
export const PARAGRAPH_LINE_WIDTHS = [IMAGE_W, IMAGE_W * 0.82, IMAGE_W * 0.62];
export const PARAGRAPH_LINE_H = 6;
export const PARAGRAPH_LINE_GAP = 16;

// Where the paragraph starts when there is no reserved image slot yet (right under the title).
export const PARAGRAPH_Y_NO_SLOT = IMAGE_Y;
// Where the paragraph starts once a 90px-tall image slot exists — reserved up front, or filled after load,
// the paragraph sits here either way.
export const PARAGRAPH_Y_WITH_SLOT = IMAGE_Y + IMAGE_H + 10;

// Fixed "photo" colors — same schematic scene and palette as ObjectFitModesDiagram / ObjectPositionDiagram,
// so a loaded image slot reads as "the same kind of photo" across every diagram in this post.
export const SKY_TOP = "#38bdf8";
export const SKY_BOTTOM = "#bae6fd";
export const SUN_COLOR = "#fbbf24";
export const GROUND_COLOR = "#4ade80";
export const MOUNTAIN_COLOR = "#64748b";

// Row layout — "without" (top, danger) and "with" (bottom, success), each: a label, a t0/t1 frame pair, a
// per-frame timestamp caption, and a one-line verdict caption spanning both frames.
export const ROW_WITHOUT = {
  labelY: 22,
  frameY: 38,
  timeLabelY: 38 + FRAME_H + 14,
  captionY: 38 + FRAME_H + 14 + 20
};

export const ROW_WITH = {
  labelY: ROW_WITHOUT.captionY + 34,
  frameY: ROW_WITHOUT.captionY + 34 + 16,
  timeLabelY: ROW_WITHOUT.captionY + 34 + 16 + FRAME_H + 14,
  captionY: ROW_WITHOUT.captionY + 34 + 16 + FRAME_H + 14 + 20
};

// Vertical midpoint of a row's frames, used to center the "image loads →" arrow between t0 and t1.
export const ARROW_Y_WITHOUT = ROW_WITHOUT.frameY + FRAME_H / 2;
export const ARROW_Y_WITH = ROW_WITH.frameY + FRAME_H / 2;

export const CANVAS_W = T1_X + FRAME_W + MARGIN;
export const CANVAS_H = ROW_WITH.captionY + 16;
