import type { JSX } from "react";
import Glyph from "@/components/MotionPathBuilder/Glyph/Glyph";
import { GLYPH_HEIGHT, GLYPH_LABELS, GLYPH_WIDTH } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { SectionCard, PanelTitle, FieldLabel, FieldInput } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { StockGrid, StockCard, StockName } from "@/components/MotionPathBuilder/RollingStock/RollingStock.styles";
import type { MotionPathGlyph, RollingStockProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Picker order — the loco first, since it's the layout's own rolling stock.
const GLYPHS: MotionPathGlyph[] = ["loco", "arrow", "plane", "dot", "car", "custom"];

/*
  Chooses what rides the rails. Every option is drawn nose-to-the-right so `offset-rotate: auto`
  needs no correction; the custom slot takes any emoji or short text, which is drawn in the same
  box (and exported the same way) as the built-in glyphs.
*/
export default function RollingStock({ state, actions }: RollingStockProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Rolling stock</PanelTitle>
        <StockGrid role="radiogroup" aria-label="Element on the track">
          {GLYPHS.map((glyph) => (
            <StockCard key={glyph}>
              <input type="radio" name="motion-path-glyph" value={glyph} checked={state.glyph === glyph} onChange={() => actions.applySetting("glyph", glyph)} />
              <svg width={GLYPH_WIDTH} height={GLYPH_HEIGHT} viewBox={`0 0 ${GLYPH_WIDTH} ${GLYPH_HEIGHT}`} fill="currentColor" aria-hidden="true">
                <Glyph glyph={glyph} customGlyph={state.customGlyph} />
              </svg>
              <StockName>{GLYPH_LABELS[glyph]}</StockName>
            </StockCard>
          ))}
        </StockGrid>
        {state.glyph === "custom" && (
          <FieldLabel>
            Custom emoji or text
            <FieldInput
              type="text"
              maxLength={8}
              value={state.customGlyph}
              onChange={(event) => actions.applySetting("customGlyph", event.target.value)}
            />
          </FieldLabel>
        )}
      </SectionCard>
    </>
  );
}

RollingStock.displayName = "RollingStock";
