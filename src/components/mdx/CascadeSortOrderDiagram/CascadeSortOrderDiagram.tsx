import type { JSX } from "react";
import {
  MONO_FONT,
  RUNGS,
  TONE_COLORS,
  RUNG_X,
  RUNG_W,
  RUNG_H
} from "@/components/mdx/CascadeSortOrderDiagram/CascadeSortOrderDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CascadeSortOrderDiagram/CascadeSortOrderDiagram.styles";

// The tiebreak note starts level with the first rung layers apply to, so it reads as belonging to the @layer rungs.
const IMPORTANT_AUTHOR_RUNG = RUNGS[3];

// The arrow and caption are measured from the bottom rung, so adding or removing a rung can't leave them stranded.
const LAST_RUNG = RUNGS[RUNGS.length - 1];

// In the order the cascade applies them; layer order is starred because only the two @layer rungs ever consult it.
const TIEBREAKERS = ["① Inline style=\"\"", "② Layer order*", "③ Specificity", "④ Source order"];

/*
  Static SVG diagram of the cascade's origin-and-importance ladder. Exists to correct the common mental model of
  `@layer` as a fourth criterion weighed alongside specificity and source order: layer order only separates
  declarations that already tie on a rung, after inline styles and before specificity, and only on the two
  author rungs.
*/
export default function CascadeSortOrderDiagram(): JSX.Element {
  const noteX = RUNG_X + RUNG_W + 24;
  const noteTop = IMPORTANT_AUTHOR_RUNG.y;
  const arrowX = RUNG_X - 20;
  const arrowBottom = LAST_RUNG.y + RUNG_H;
  const arrowTop = RUNGS[0].y;
  const captionY = arrowBottom + 40;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 640 ${captionY + 30}`} role="img" aria-labelledby="cascade-sort-order-title cascade-sort-order-desc">
          <title id="cascade-sort-order-title">Complete CSS cascade sort order with cascade layers diagram</title>
          <desc id="cascade-sort-order-desc">
            An 8-rung vertical ladder, highest priority at the top: transitions; important user-agent;
            important user; important author; animations; normal author; normal user; normal user-agent.
            Only the two author rungs involve cascade layers — inside the important author rung, the
            earlier-declared layer wins, and unlayered important styles are the lowest priority. Inside the
            normal author rung, unlayered styles are the highest priority, and among layers the
            later-declared one wins. A side note lists the tiebreakers for declarations that share a rung,
            in order: inline style attribute, layer order on the author rungs only, specificity, then
            source order.
          </desc>

          <defs>
            <marker id="cascade-sort-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={RUNG_X} y={22} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            Cascade sort order — highest priority first
          </text>

          {/* One arrow for the whole ladder, so the direction of priority reads at a glance without labelling every rung. */}
          <line x1={arrowX} y1={arrowBottom} x2={arrowX} y2={arrowTop} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#cascade-sort-arrow)" />
          <text x={arrowX} y={(arrowTop + arrowBottom) / 2} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)" transform={`rotate(-90, ${arrowX}, ${(arrowTop + arrowBottom) / 2})`}>
            higher priority
          </text>

          {RUNGS.map((rung) => {
            const tone = TONE_COLORS[rung.tone];
            return (
              <g key={rung.label}>
                <rect x={RUNG_X} y={rung.y} width={RUNG_W} height={RUNG_H} rx={8} fill={tone.bg} stroke={tone.border} strokeWidth={1.5} />
                <text x={RUNG_X + 16} y={rung.y + 26} fontSize={13} fontWeight={600} fontFamily={MONO_FONT} fill={tone.text}>
                  {rung.label}
                </text>
                <text x={RUNG_X + 16} y={rung.y + 46} fontSize={10.5} fill="var(--color-fg-muted)">
                  {rung.sublabel}
                </text>
                {rung.layerNote && (
                  <>
                    <rect x={RUNG_X + RUNG_W - 70} y={rung.y + 12} width={58} height={20} rx={10} fill="none" stroke={tone.border} strokeWidth={1.25} />
                    <text x={RUNG_X + RUNG_W - 41} y={rung.y + 26} textAnchor="middle" fontSize={10.5} fontWeight={600} fontFamily={MONO_FONT} fill={tone.text}>
                      @layer
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Beside the ladder rather than as rungs, because these only ever break ties within a rung. */}
          <text x={noteX} y={noteTop + 16} fontSize={11} fontWeight={600} fill="var(--color-fg-default)">
            Ties within a rung, in order:
          </text>
          {TIEBREAKERS.map((tiebreaker, index) => (
            <text key={tiebreaker} x={noteX} y={noteTop + 38 + index * 18} fontSize={10.5} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
              {tiebreaker}
            </text>
          ))}
          <text x={noteX} y={noteTop + 38 + TIEBREAKERS.length * 18 + 8} fontSize={10} fill="var(--color-fg-muted)">
            * only on the two
          </text>
          <text x={noteX} y={noteTop + 38 + TIEBREAKERS.length * 18 + 24} fontSize={10} fill="var(--color-fg-muted)">
            @layer rungs
          </text>

          <text x={RUNG_X} y={captionY} fontSize={11} fill="var(--color-fg-muted)">
            <tspan fontWeight={600} fill="var(--color-fg-default)">@layer</tspan> only separates declarations that
            already share one of the two author rungs.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

CascadeSortOrderDiagram.displayName = "CascadeSortOrderDiagram";
