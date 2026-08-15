// Width of each of the three area boxes.
export const BOX_W = 110;

// Height of each of the three area boxes.
export const BOX_H = 50;

// Gutter between adjacent boxes, wide enough to fit a labelled forward arrow.
export const GAP = 70;

// Top y coordinate of the three boxes.
export const BOX_Y = 70;

// Left x coordinate of each of the three boxes: Working Directory, Staging Area, Repository.
export const BOX_X = [20, 20 + BOX_W + GAP, 20 + 2 * (BOX_W + GAP)];

// y coordinate the reverse "git checkout / git restore" arc dips down to, below the boxes.
export const LOOP_Y = 175;
