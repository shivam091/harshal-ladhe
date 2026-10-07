import { createElement } from "react";
import type { JSX } from "react";
import { GLYPH_DETAIL_OPACITY, GLYPH_SHAPES } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { GlyphText } from "@/components/MotionPathBuilder/Glyph/Glyph.styles";
import type { GlyphProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

/*
  The glyph's primitives with no wrapper of its own, so the same drawing can sit inside the moving
  element's <svg>, a ghost marker's <g> on the baseboard, or a picker swatch — and always match
  what the exports write out, since all of them read GLYPH_SHAPES.
*/
export default function Glyph({ glyph, customGlyph }: GlyphProps): JSX.Element {
  if (glyph === "custom") {
    return (
      <>
        <GlyphText x={24} y={15} textAnchor="middle" dominantBaseline="central">
          {customGlyph || "?"}
        </GlyphText>
      </>
    );
  }

  return (
    <>
      {GLYPH_SHAPES[glyph].map(({ tag, attrs, detail }, index) =>
        createElement(tag, { key: index, ...attrs, opacity: detail ? GLYPH_DETAIL_OPACITY : undefined })
      )}
    </>
  );
}

Glyph.displayName = "Glyph";
