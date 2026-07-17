// One 60fps frame, in ms — the base unit the deceleration curve below is expressed in.
const FRAME = 1000 / 60;

/*
  Deletion cadence for the melt-away clear animation — starts fast (long remaining string)
  and decelerates toward the end so the last few characters visibly "settle" rather than
  vanishing at the same clip as the rest.
*/
export function getIntervalLength(inputValue: string, isClearingValue: boolean): number | null {
  if (!isClearingValue) return null;

  if (inputValue.length <= 1) return FRAME * 8;
  if (inputValue.length <= 2) return FRAME * 4;
  if (inputValue.length <= 5) return FRAME * 3;
  if (inputValue.length <= 10) return FRAME;
  return FRAME * 0.5;
}
