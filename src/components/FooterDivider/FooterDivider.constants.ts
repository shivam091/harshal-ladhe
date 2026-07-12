// Enough balls for the fill to read as a wave rather than a single hover target.
export const NUM_BALLS = 8;

// Must match BallWrapper's size so the ball-centre maths lines up with what's painted.
export const BALL_SIZE_PX = 16;

// Must match Wrapper's gap so the ball-centre maths lines up with what's painted.
export const BALL_GAP_PX = 12;

// Wide enough that several balls respond at once, so the fill reads as a wave.
export const AREA_OF_EFFECT_RADIUS_PX = (BALL_SIZE_PX + BALL_GAP_PX) * 10;

// Just enough blur at rest that balls visibly come into focus as the cursor approaches.
export const MAX_BLUR_PX = 4;

// Starts tracking before the cursor reaches the row so the end balls begin filling as it approaches.
export const ROW_PROXIMITY_RADIUS_PX = (NUM_BALLS * (BALL_SIZE_PX + BALL_GAP_PX)) / 2 + AREA_OF_EFFECT_RADIUS_PX;

// Hand-picked rather than evenly spaced, since even hue steps make a less pleasant gradient.
export const BALL_COLORS: string[] = [
  "hsl(350deg 100% 65%)",
  "hsl(25deg 100% 65%)",
  "hsl(50deg 100% 65%)",
  "hsl(150deg 100% 65%)",
  "hsl(210deg 100% 65%)",
  "hsl(240deg 100% 65%)",
  "hsl(260deg 100% 70%)",
  "hsl(300deg 100% 65%)"
];
