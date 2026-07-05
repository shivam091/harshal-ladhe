import type { CSSProperties } from "react";

// Inline rather than selector-based because depth and active state are only known at render time.
type LinkStyle = CSSProperties & { "--font-size-px"?: number };

// Indent and spacing follow depth so the list mirrors the article's outline at a glance.
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
