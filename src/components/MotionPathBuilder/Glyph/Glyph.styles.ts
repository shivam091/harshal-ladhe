import { styled } from "@linaria/react";

// Custom emoji or text drawn in the glyph box — the emoji font stack keeps a pasted 🚂 in colour rather than falling back to a monochrome outline.
export const GlyphText = styled.text`
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif;
  font-size: 22px;
  font-weight: 700;
`;
