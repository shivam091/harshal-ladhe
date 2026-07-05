import type { CSSProperties } from "react";

/*
  Inline styles applied per link — depth indent + active highlight.
  Active color overrides the default opacity-0.7 via an explicit color + opacity:1.
*/
type LinkStyle = CSSProperties & { "--font-size-px"?: number };

// Maps a heading level to its link styling: h2 gets extra top margin, h3/h4 get progressively deeper indents.
export function getStylesForDepth(level: (2 | 3 | 4), isActive: boolean): LinkStyle {
  const base: LinkStyle = {
    color: isActive ? "var(--color-fg-link)" : undefined,
    opacity: isActive ? 1 : undefined
  };

  switch (level) {
    case 2:
      return { ...base, marginBlockStart: 12, "--font-size-px": 16 };
    case 3:
      return { ...base, marginBlockStart: 4, "--font-size-px": 14, paddingInlineStart: 12 };
    case 4:
      return { ...base, marginBlockStart: 4, "--font-size-px": 14, paddingInlineStart: 24 };
    default:
      throw new Error("Unsupported heading size: " + level);
  }
}
