// Small inline SVGs for the custom search panel and goto-line card — plain DOM, so the app's
// react-spring icon components (which need a React tree) don't apply here.
const ICON_ATTRIBUTES: Record<string, string> = {
  viewBox: "0 0 24 24",
  width: "14",
  height: "14",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

function createSvg(innerHtml: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  for (const [name, value] of Object.entries(ICON_ATTRIBUTES)) {
    svg.setAttribute(name, value);
  }
  svg.style.display = "block";
  svg.innerHTML = innerHtml;
  return svg;
}

// Same polyline coordinates as IconChevronDown's morph targets, for a pixel-consistent chevron.
const CHEVRON_POINTS: Record<"up" | "down", string> = {
  up: "6 14 12 8 18 14",
  down: "6 10 12 16 18 10"
};

// Previous/next-match nav buttons in the search panel.
export function createChevronIcon(direction: "up" | "down"): SVGSVGElement {
  return createSvg(`<polyline points="${CHEVRON_POINTS[direction]}" />`);
}

// Close control shared by the search panel and the goto-line card.
export function createCloseIcon(): SVGSVGElement {
  return createSvg(
    `<line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />`
  );
}
