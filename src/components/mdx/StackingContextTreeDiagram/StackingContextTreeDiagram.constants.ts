// Matches the site's code font, so the CSS inside the diagram reads like the code blocks around it.
export const CODE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  Badge colours per outcome, so the "version number" pills read as winner / loser / context at a glance and the
  legend in the caption can't disagree with the drawing.
*/
export const BADGE_COLORS = {
  win: { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)", text: "var(--color-fg-success)" },
  lose: { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)", text: "var(--color-fg-danger)" },
  neutral: { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)", text: "var(--color-fg-accent)" }
};

/*
  The post's running example: a sticky header beside a <main> that holds a modal. Each node carries its effective
  "version number" — the modal's 9999 written as 1.9999 because it can never outrank its parent's 1.
*/
export const NODES = [
  { key: "root", x: 230, y: 16, width: 180, height: 48, tag: "<html>", css: "root stacking context", badge: null, outcome: "neutral" },
  { key: "header", x: 40, y: 116, width: 230, height: 56, tag: "<header>", css: "position: sticky; z-index: 10", badge: "10", outcome: "win" },
  { key: "main", x: 370, y: 116, width: 230, height: 56, tag: "<main>", css: "position: relative; z-index: 1", badge: "1", outcome: "neutral" },
  { key: "modal", x: 370, y: 236, width: 230, height: 56, tag: "<div class=\"modal\">", css: "position: fixed; z-index: 9999", badge: "1.9999", outcome: "lose" }
] as const;

// Plain coordinates rather than a layout algorithm — four fixed nodes don't justify one.
export const EDGES = [
  [320, 64, 155, 116],
  [320, 64, 485, 116],
  [485, 172, 485, 236]
];

// Outlines <main>'s stacking context, so readers can see the boundary the modal's 9999 can't cross.
export const CONTEXT_BOX = { x: 354, y: 100, width: 262, height: 222 };
