// The post's window-effect gradient (45deg, cyan → blue → pink), so the diagram matches the code above it.
export const GRADIENT_STOPS = ["#00f2fe", "#4facfe", "#f093fb"];

// The browser viewport — the box background-attachment: fixed pins the gradient to.
export const VIEWPORT = { width: 200, height: 190, y: 52 };

// Total height of the page scrolling behind the viewport, used to size and place the scrollbar thumb.
export const PAGE_HEIGHT = 300;

/*
  The same page at two scroll positions. Chapter Two is the heading to follow: it sits low in the first viewport
  and near the top of the second, so it's cut from two different parts of the one pinned gradient.
*/
export const PANELS = [
  { x: 40, scroll: 0, title: "Scrolled to the top", caption: "Chapter Two sits low: mostly blue" },
  { x: 300, scroll: 80, title: "Scrolled down 80px", caption: "Same heading, higher up: pinker" }
];

// Headings in page coordinates (baselines), each followed by a couple of placeholder body-text lines.
export const HEADINGS = [
  { text: "Chapter One", y: 50 },
  { text: "Chapter Two", y: 130 },
  { text: "Chapter Three", y: 210 }
];

// Placeholder paragraph lines under each heading, as offsets from its baseline plus a width.
export const BODY_LINES = [
  { dy: 16, width: 150 },
  { dy: 28, width: 118 }
];

// Scrollbar thumb, sized and placed from how much of the page the viewport shows.
export const THUMB_HEIGHT = (VIEWPORT.height * VIEWPORT.height) / PAGE_HEIGHT;

// Maps a scroll offset to the thumb's top edge inside the viewport.
export function thumbY(scroll: number): number {
  return (scroll / (PAGE_HEIGHT - VIEWPORT.height)) * (VIEWPORT.height - THUMB_HEIGHT);
}

// Glyph size for the page's headings.
export const HEADING_FONT_SIZE = 22;
