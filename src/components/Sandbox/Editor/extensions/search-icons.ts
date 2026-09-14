/*
  Small inline SVGs for the custom search panel, goto-line card, fold gutter, and breadcrumb bar —
  plain DOM, so the app's react-spring icon components (which need a mounted React tree per icon,
  and never unmount it once superseded) don't apply here.
*/
const ICON_ATTRIBUTES: Record<string, string> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

interface SvgStyleOverrides {
  fill?: string;
  stroke?: string;
}

/*
  `overrides` swaps the root's fill/stroke for icons that aren't the stroked-outline style every
  ICON_ATTRIBUTES default targets — e.g. Replace/Replace All below, traced as filled shapes, need
  fill:currentColor and stroke:none instead (leaving stroke at its default "currentColor" would
  otherwise outline every path at the shared 2px stroke-width, on top of its own fill).
*/
function createSvg(innerHtml: string, size: number, overrides?: SvgStyleOverrides): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  for (const [name, value] of Object.entries(ICON_ATTRIBUTES)) {
    svg.setAttribute(name, value);
  }
  if (overrides?.fill) svg.setAttribute("fill", overrides.fill);
  if (overrides?.stroke) svg.setAttribute("stroke", overrides.stroke);
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
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
export function createChevronIcon(direction: "up" | "down", size = 14): SVGSVGElement {
  return createSvg(`<polyline points="${CHEVRON_POINTS[direction]}" />`, size);
}

// Close control shared by the search panel and the goto-line card.
export function createCloseIcon(size = 14): SVGSVGElement {
  return createSvg(
    `<line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />`,
    size
  );
}

// Fold gutter's collapsed marker and the breadcrumb bar's "›" separator — same geometry as the registry's "chevronRight" icon.
export function createChevronRightIcon(size = 14): SVGSVGElement {
  return createSvg(`<polyline points="9 18 15 12 9 6" />`, size);
}

// Fold gutter's expanded marker — same geometry as the registry's "chevronDown" icon.
export function createChevronDownIcon(size = 14): SVGSVGElement {
  return createSvg(`<polyline points="6 10 12 16 18 10" />`, size);
}

/*
  Replace/Replace All are traced from VS Code's own codicons — filled shapes, not the
  stroked-outline language every other icon here uses. The fill:currentColor/stroke:none
  override (see createSvg) swaps that in wholesale at the root instead of repeating it on every
  path — leaving the shared stroke:currentColor in place would otherwise outline each path at
  the default 2px stroke-width on top of its own fill, muddying the glyph. Coordinates are the
  codicons' original 16x16 path data scaled x1.5 onto the shared 24x24 grid — a uniform scale
  from the origin, so it reproduces the exact glyph, just bigger.
*/
export function createReplaceIcon(size = 14): SVGSVGElement {
  return createSvg(
    `<path fill-rule="evenodd" clip-rule="evenodd" d="M15 4.2195C15.4425 3.9285 15.951 3.75 16.5 3.75C18.1545 3.75 19.5 5.2635 19.5 7.125C19.5 8.9865 18.1545 10.5 16.5 10.5C15.93 10.5 15.4035 10.3095 14.949 9.999C14.8455 10.29 14.5755 10.5 14.25 10.5C13.836 10.5 13.5 10.164 13.5 9.75V2.25C13.5 1.836 13.836 1.5 14.25 1.5C14.664 1.5 15 1.836 15 2.25V4.2195ZM15 7.125C15 8.1585 15.672 9 16.5 9C17.328 9 18 8.1585 18 7.125C18 6.0915 17.328 5.25 16.5 5.25C15.672 5.25 15 6.0915 15 7.125Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 13.5H10.5C11.328 13.5 12 14.172 12 15V22.5C12 23.328 11.328 24 10.5 24H3C2.172 24 1.5 23.328 1.5 22.5V15C1.5 14.172 2.172 13.5 3 13.5ZM7.5585 20.4675C7.215 20.7735 6.2985 20.952 5.745 20.259C5.4255 19.86 5.25 19.32 5.25 18.738C5.25 18.156 5.427 17.616 5.745 17.217C6.3015 16.521 7.2165 16.6995 7.56 17.0085C7.866 17.2875 8.34 17.2605 8.619 16.9545C8.8965 16.647 8.8725 16.173 8.5635 15.8955C7.383 14.8305 5.5995 15.0015 4.5735 16.2795C4.0425 16.9455 3.75 17.817 3.75 18.738C3.75 19.659 4.0425 20.532 4.5735 21.1965C5.145 21.9075 5.9175 22.3005 6.75 22.3005C7.4115 22.3005 8.0385 22.0515 8.562 21.5805C8.8695 21.303 8.895 20.829 8.6175 20.5215C8.3385 20.214 7.8645 20.187 7.5585 20.4675Z"/><path d="M6 6.75C6 5.5095 7.0095 4.5 8.25 4.5H11.253C11.667 4.5 12.003 4.836 12.003 5.25C12.003 5.664 11.667 6 11.253 6H8.253C7.839 6 7.503 6.3375 7.503 6.75V9.4395L9.222 7.7205C9.5145 7.428 9.99 7.428 10.2825 7.7205C10.575 8.013 10.575 8.4885 10.2825 8.781L7.2825 11.781C7.1355 11.9265 6.9435 12 6.7515 12C6.5595 12 6.3675 11.928 6.2205 11.781L3.2205 8.781C2.928 8.4885 2.928 8.013 3.2205 7.7205C3.513 7.428 3.9885 7.428 4.281 7.7205L6 9.4395V6.75Z"/>`,
    size,
    { fill: "currentColor", stroke: "none" }
  );
}

export function createReplaceAllIcon(size = 14): SVGSVGElement {
  return createSvg(
    `<path d="M21 19.5V15C21 12.525 18.975 10.5 16.5 10.5H7.68L6.18 12H16.5C18.15 12 19.5 13.35 19.5 15V21C20.325 21 21 20.325 21 19.5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4985 8.25V4.125C16.4985 2.6475 15.18 1.875 13.875 1.875C12.543 1.875 11.9835 2.3295 11.844 2.469C11.5515 2.7615 11.5305 3.255 11.823 3.5475C12.114 3.8415 12.5685 3.8595 12.8625 3.567C12.8619 3.5674 12.8626 3.567 12.8625 3.567C12.881 3.555 13.1575 3.375 13.8735 3.375C13.9185 3.375 14.9985 3.384 14.9985 4.125V4.584C14.6925 4.5345 14.3265 4.5 13.8735 4.5C11.904 4.5 10.8735 5.631 10.8735 6.75C10.8735 7.869 11.904 9 13.8735 9C14.4315 9 14.865 8.9055 15.216 8.7765C15.3525 8.9145 15.54 9 15.7485 9C16.1625 9 16.4985 8.664 16.4985 8.25ZM13.875 6C14.433 6 14.784 6.057 15 6.111V7.2165C14.8605 7.3275 14.5455 7.5 13.875 7.5C12.9015 7.5 12.375 7.113 12.375 6.75C12.375 6.387 12.9015 6 13.875 6Z"/><path d="M7.5015 19.611C7.2855 19.557 6.9345 19.5 6.3765 19.5C5.403 19.5 4.8765 19.887 4.8765 20.25C4.8765 20.613 5.403 21 6.3765 21C7.047 21 7.362 20.8275 7.5015 20.7165V19.611Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18 22.5V15C18 14.172 17.328 13.5 16.5 13.5H3C2.172 13.5 1.5 14.172 1.5 15V22.5C1.5 23.328 2.172 24 3 24H16.5C17.328 24 18 23.328 18 22.5ZM6.3765 15.375C7.6815 15.375 9 16.1475 9 17.625V21.75C9 22.164 8.664 22.5 8.25 22.5C8.0415 22.5 7.854 22.4145 7.7175 22.2765C7.3665 22.4055 6.933 22.5 6.375 22.5C4.4055 22.5 3.375 21.369 3.375 20.25C3.375 19.131 4.4055 18 6.375 18C6.828 18 7.194 18.0345 7.5 18.084V17.625C7.5 16.884 6.42 16.875 6.375 16.875C5.6812 16.875 5.401 17.0446 5.3675 17.065C5.3653 17.0663 5.3642 17.067 5.364 17.067C5.07 17.3595 4.6155 17.3415 4.3245 17.0475C4.032 16.755 4.053 16.2615 4.3455 15.969C4.485 15.8295 5.0445 15.375 6.3765 15.375ZM12.495 17.4165C12.1755 17.8155 12 18.3555 12 18.9375C12 19.5195 12.1755 20.0595 12.495 20.4585C13.0485 21.1515 13.965 20.973 14.3085 20.667C14.6145 20.3865 15.0885 20.4135 15.3675 20.721C15.645 21.0285 15.621 21.5025 15.312 21.78C14.79 22.251 14.163 22.5 13.5 22.5C12.6675 22.5 11.8935 22.1085 11.3235 21.396C10.7925 20.73 10.5 19.8585 10.5 18.9375C10.5 18.0165 10.7925 17.1435 11.3235 16.479C12.3495 15.201 14.133 15.03 15.3135 16.095C15.621 16.3725 15.6465 16.8465 15.369 17.154C15.09 17.46 14.616 17.487 14.31 17.208C13.9665 16.899 13.0515 16.7205 12.495 17.4165Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21 9C22.6545 9 24 7.4865 24 5.625C24 3.7635 22.6545 2.25 21 2.25C20.451 2.25 19.9425 2.4285 19.5 2.7195V0.75C19.5 0.336 19.164 0 18.75 0C18.336 0 18 0.336 18 0.75V8.25C18 8.664 18.336 9 18.75 9C19.0755 9 19.3455 8.79 19.449 8.499C19.9035 8.8095 20.43 9 21 9ZM21 3.75C21.828 3.75 22.5 4.5915 22.5 5.625C22.5 6.6585 21.828 7.5 21 7.5C20.172 7.5 19.5 6.6585 19.5 5.625C19.5 4.5915 20.172 3.75 21 3.75Z"/><path d="M3 6.75C3 5.5095 4.0095 4.5 5.25 4.5H8.253C8.667 4.5 9.003 4.836 9.003 5.25C9.003 5.664 8.667 6 8.253 6H5.253C4.839 6 4.503 6.3375 4.503 6.75V9.4395L6.222 7.7205C6.5145 7.428 6.99 7.428 7.2825 7.7205C7.575 8.013 7.575 8.4885 7.2825 8.781L4.2825 11.781C4.1355 11.9265 3.9435 12 3.7515 12C3.5595 12 3.3675 11.928 3.2205 11.781L0.2205 8.781C-0.072 8.4885 -0.072 8.013 0.2205 7.7205C0.513 7.428 0.9885 7.428 1.281 7.7205L3 9.4395V6.75Z"/>`,
    size,
    { fill: "currentColor", stroke: "none" }
  );
}

// Search panel's select-all-matches button — several marked lines standing in for every match at once.
export function createSelectAllIcon(size = 14): SVGSVGElement {
  return createSvg(
    `<line x1="4" y1="6" x2="14" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="11" y2="18" />`,
    size
  );
}

// Search panel's "Find in Selection" toggle — a bracketed region standing in for a text selection, VS Code's own codicon shape.
export function createFindInSelectionIcon(size = 14): SVGSVGElement {
  return createSvg(
    `<path d="M9 4H6a2 2 0 0 0-2 2v3" /><path d="M9 20H6a2 2 0 0 1-2-2v-3" /><path d="M15 4h3a2 2 0 0 1 2 2v3" /><path d="M15 20h3a2 2 0 0 0 2-2v-3" /><line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="13" x2="14" y2="13" />`,
    size
  );
}

/*
  Match Case's "Aa" and Whole Word's "ab" — the lowercase letters are the same "ab" lettering
  traced into createReplaceAllIcon's codicon artwork above (its evenodd fill shapes, not
  hand-drawn strokes like every other icon here), reused instead of redrawn so both stay real
  VS Code letterforms rather than a hand-rolled bowl-plus-stem approximation (which previously
  misdrew Match Case's "a" as a "d"). Each glyph's coordinates below are that source path with a
  scale+offset baked directly into every point (via a small transform script, not by hand) to
  size and position it for its icon — not an SVG `transform`, so there's no extra wrapping `<g>`
  or runtime matrix to reason about, just the final path.
*/
const MATCH_CASE_LOWERCASE_A_PATH =
  "M20.0881 18.055V12.8575C20.0881 10.9959 18.4268 10.0225 16.7825 10.0225C15.1042 10.0225 14.3992 10.5952 14.2234 10.7709C13.8549 11.1395 13.8284 11.7613 14.197 12.1299C14.5636 12.5003 15.1363 12.523 15.5068 12.1544C15.506 12.1549 15.5069 12.1544 15.5068 12.1544C15.5301 12.1393 15.8785 11.9125 16.7806 11.9125C16.8373 11.9125 18.1981 11.9238 18.1981 12.8575V13.4358C17.8126 13.3735 17.3514 13.33 16.7806 13.33C14.299 13.33 13.0006 14.7551 13.0006 16.165C13.0006 17.5749 14.299 19 16.7806 19C17.4837 19 18.0299 18.8809 18.4722 18.7184C18.6441 18.8923 18.8804 19 19.1431 19C19.6648 19 20.0881 18.5766 20.0881 18.055ZM16.7825 15.22C17.4856 15.22 17.9278 15.2918 18.2 15.3599V16.7528C18.0242 16.8926 17.6273 17.11 16.7825 17.11C15.5559 17.11 14.8925 16.6224 14.8925 16.165C14.8925 15.7076 15.5559 15.22 16.7825 15.22Z";
const WHOLE_WORD_LOWERCASE_A_PATH =
  "M10.7982 14.9V9.95C10.7982 8.177 9.216 7.25 7.65 7.25C6.0516 7.25 5.3802 7.7954 5.2128 7.9628C4.8618 8.3138 4.8366 8.906 5.1876 9.257C5.5368 9.6098 6.0822 9.6314 6.435 9.2804C6.4343 9.2809 6.4351 9.2804 6.435 9.2804C6.4572 9.266 6.789 9.05 7.6482 9.05C7.7022 9.05 8.9982 9.0608 8.9982 9.95V10.5008C8.631 10.4414 8.1918 10.4 7.6482 10.4C5.2848 10.4 4.0482 11.7572 4.0482 13.1C4.0482 14.4428 5.2848 15.8 7.6482 15.8C8.3178 15.8 8.838 15.6866 9.2592 15.5318C9.423 15.6974 9.648 15.8 9.8982 15.8C10.395 15.8 10.7982 15.3968 10.7982 14.9ZM7.65 12.2C8.3196 12.2 8.7408 12.2684 9 12.3332V13.6598C8.8326 13.793 8.4546 14 7.65 14C6.4818 14 5.85 13.5356 5.85 13.1C5.85 12.6644 6.4818 12.2 7.65 12.2Z";
const WHOLE_WORD_LOWERCASE_B_PATH =
  "M16.2 15.8C18.1854 15.8 19.8 13.9838 19.8 11.75C19.8 9.5162 18.1854 7.7 16.2 7.7C15.5412 7.7 14.931 7.9142 14.4 8.2634V5.9C14.4 5.4032 13.9968 5 13.5 5C13.0032 5 12.6 5.4032 12.6 5.9V14.9C12.6 15.3968 13.0032 15.8 13.5 15.8C13.8906 15.8 14.2146 15.548 14.3388 15.1988C14.8842 15.5714 15.516 15.8 16.2 15.8ZM16.2 9.5C17.1936 9.5 18 10.5098 18 11.75C18 12.9902 17.1936 14 16.2 14C15.2064 14 14.4 12.9902 14.4 11.75C14.4 10.5098 15.2064 9.5 16.2 9.5Z";

// Match Case toggle — hand-drawn capital "A" (stroked, matching every other icon here) beside the real codicon lowercase "a".
export function createMatchCaseIcon(size = 17): SVGSVGElement {
  return createSvg(
    `<path d="M3 19 L7 6 L11 19" /><line x1="4.6" y1="14" x2="9.4" y2="14" /><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" stroke="none" d="${MATCH_CASE_LOWERCASE_A_PATH}" />`,
    size
  );
}

// Whole Word toggle — the real codicon "ab", underlined to signal a word boundary.
export function createMatchWholeWordIcon(size = 17): SVGSVGElement {
  return createSvg(
    `<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" stroke="none" d="${WHOLE_WORD_LOWERCASE_A_PATH}" /><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" stroke="none" d="${WHOLE_WORD_LOWERCASE_B_PATH}" /><line x1="3" y1="18.5" x2="21" y2="18.5" />`,
    size
  );
}

export function createUseRegexpIcon(size = 17): SVGSVGElement {
  return createSvg(
    `<text x="12" y="17" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="700" fill="currentColor" stroke="none">.*</text>`,
    size
  );
}
