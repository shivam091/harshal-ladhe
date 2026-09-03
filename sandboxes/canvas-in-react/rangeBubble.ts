// Must match the thumb's inline-size in shared/range-slider.css — keeps the floating bubble
// centered over the thumb at every position, not just the track's raw percentage (the thumb is
// inset by half its own width at each end of a native range input).
const THUMB_WIDTH = 16;

// Repositions a range input's floating value bubble so it stays centered over the thumb from one end of the track to the other.
export function positionRangeBubble(input: HTMLInputElement, bubble: HTMLElement) {
  const min = Number(input.min);
  const max = Number(input.max);
  const percent = ((Number(input.value) - min) / (max - min)) * 100;
  const offset = THUMB_WIDTH / 2 - (percent / 100) * THUMB_WIDTH;
  bubble.style.left = `calc(${percent}% + ${offset}px)`;
}
