/*
  Must match the thumb's inline-size in range-slider.css — keeps the floating bubble centered
  over the thumb at every position, not just the track's raw percentage (the thumb is inset by
  half its own width at each end of a native range input).
*/
const THUMB_WIDTH = 16;

// Repositions a range input's floating value bubble so it stays centered over the thumb from one end of the track to the other.
export function positionRangeBubble(input, bubble) {
  const min = Number(input.min);
  const max = Number(input.max);
  const percent = ((Number(input.value) - min) / (max - min)) * 100;
  const offset = THUMB_WIDTH / 2 - (percent / 100) * THUMB_WIDTH;
  bubble.style.left = `calc(${percent}% + ${offset}px)`;
}

/*
  Formats a range input's current value, writes it into its bubble, then repositions the bubble —
  the update every plain "drag to see the number" slider needs on its `input` event. `format`
  defaults to the raw value; pass one for a unit (e.g. `(v) => `${v}px``). The slider's own <label>
  is left alone — it names the control, the bubble shows its live value, and the two shouldn't
  duplicate each other. A label that legitimately needs live text of its own (e.g. a property name
  that depends on some other control's state, not this slider's own value) sets that text directly
  and calls `positionRangeBubble` for the bubble instead of this.
*/
export function updateRangeSlider(input, bubble, format = (value) => value) {
  bubble.textContent = format(input.value);
  positionRangeBubble(input, bubble);
}
