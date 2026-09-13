// One positional token in the `animation` shorthand: an example value paired with the longhand property it fills.
export interface ShorthandToken {
  value: string;
  property: string;
}

/*
  The nine `animation` shorthand tokens, in the exact positional order the browser expects them,
  using the same example values as this post's own `animation: bounce 1s ease-out 0s infinite
  alternate both running auto` reference.
*/
export const SHORTHAND_TOKENS: ShorthandToken[] = [
  { value: "bounce", property: "animation-name" },
  { value: "1s", property: "animation-duration" },
  { value: "ease-out", property: "animation-timing-function" },
  { value: "0s", property: "animation-delay" },
  { value: "infinite", property: "animation-iteration-count" },
  { value: "alternate", property: "animation-direction" },
  { value: "both", property: "animation-fill-mode" },
  { value: "running", property: "animation-play-state" },
  { value: "auto", property: "animation-timeline" }
];
