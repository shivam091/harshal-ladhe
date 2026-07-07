// One seamless 40-unit period of the water's surface, repeated 4× (spans x -40..120)
export const WAVE_PATH = "M-40,0 Q-30,-3.5 -20,0 Q-10,3.5 0,0 Q10,-3.5 20,0 Q30,3.5 40,0 Q50,-3.5 60,0 Q70,3.5 80,0 Q90,-3.5 100,0 Q110,3.5 120,0 L120,140 L-40,140 Z";

// Top of the clip circle (r=32 centred at 40,40 in an 80×80 viewBox) — the brim at 100%.
const CIRCLE_TOP_Y = 8;

// Bottom of the clip circle — the empty level at 0%.
const CIRCLE_BOTTOM_Y = 72;

/* 
  Maps real navigation progress (0-100) to the water's vertical translateY, so the fill level
  is a literal readout rather than a looping animation running on its own timer.
*/
export function computeWaveLevelY(progress: number): number {
  return CIRCLE_BOTTOM_Y - (progress / 100) * (CIRCLE_BOTTOM_Y - CIRCLE_TOP_Y);
}
