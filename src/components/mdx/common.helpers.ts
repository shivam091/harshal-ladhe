/*
  SVG path for a rounded rectangle — a <path> instead of a <rect rx> so it can be combined with a second,
  inset rectangle into one `fillRule="evenodd"` ring.
*/
export function roundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  return [
    `M${x + r},${y}`,
    `H${x + width - r}`,
    `A${r},${r} 0 0 1 ${x + width},${y + r}`,
    `V${y + height - r}`,
    `A${r},${r} 0 0 1 ${x + width - r},${y + height}`,
    `H${x + r}`,
    `A${r},${r} 0 0 1 ${x},${y + height - r}`,
    `V${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    "Z"
  ].join(" ");
}

/*
  A hollow frame `thickness` wide — the exact shape a gradient border occupies — drawn as one path so the
  center is genuinely empty (whatever is behind the diagram shows through) rather than painted over. The inner
  corner radius shrinks by the thickness, matching how browsers round the padding-box edge of a bordered element.
*/
export function ringPath(x: number, y: number, width: number, height: number, radius: number, thickness: number): string {
  const outer = roundedRectPath(x, y, width, height, radius);
  const inner = roundedRectPath(x + thickness, y + thickness, width - thickness * 2, height - thickness * 2, radius - thickness);
  return `${outer} ${inner}`;
}
