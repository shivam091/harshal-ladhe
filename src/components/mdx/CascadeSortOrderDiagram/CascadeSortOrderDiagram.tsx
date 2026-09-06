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

// Convenience lookups for the two rungs @layer actually lives inside — "!important — author" and "Normal — author".
const IMPORTANT_AUTHOR_RUNG = RUNGS[3];
const NORMAL_AUTHOR_RUNG = RUNGS[4];
const LAST_RUNG = RUNGS[RUNGS.length - 1];

/*
  Static SVG diagram of the complete, official cascade sort order with `@layer` correctly placed inside
  it — not as a 4th standalone criterion, but as a sub-ordering INSIDE the author-origin rungs. Reading
  top (highest priority) to bottom (lowest): origin & importance first (7 rungs), and only within the
  two author rungs does layer order get consulted at all — followed by specificity, then source order,
  exactly as the spec/MDN define it. The most common mental model error this corrects: assuming layers
  are compared against specificity and source order as peers, rather than being consulted first, with
  specificity and source order only ever acting as later tiebreakers within the same layer.
*/
export default function CascadeSortOrderDiagram(): JSX.Element {
  const bracketX = RUNG_X + RUNG_W + 24;
  const bracketTop = IMPORTANT_AUTHOR_RUNG.y;
  const bracketBottom = NORMAL_AUTHOR_RUNG.y + RUNG_H;
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
            A 7-rung vertical ladder, highest priority at the top: transition declarations; important
            user-agent; important user; important author; normal author; normal user; normal user-agent.
            Only the two author rungs involve cascade layers at all — inside the important author rung,
            the earlier-declared layer wins, and unlayered important styles are the lowest priority of the
            important tier. Inside the normal author rung, unlayered styles are the highest priority, and among
            layers the later-declared one wins. A side bracket notes that within those two rungs, ties
            are broken in order by layer, then by specificity, then by source order.
          </desc>

          <defs>
            <marker id="cascade-sort-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={RUNG_X} y={22} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
            Cascade sort order — highest priority first
          </text>

          {/* "Increasing priority" arrow running up the left side of the whole ladder. */}
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
              </g>
            );
          })}

          {/* Bracket calling out the two rungs where @layer, specificity, and source order actually apply. */}
          <path
            d={`M ${bracketX} ${bracketTop} h 10 v ${bracketBottom - bracketTop} h -10`}
            fill="none"
            stroke="var(--color-fg-muted)"
            strokeWidth={1.5}
          />
          <text x={bracketX + 18} y={bracketTop + 16} fontSize={11} fontWeight={600} fill="var(--color-fg-default)">
            Within these 2 rungs only:
          </text>
          <text x={bracketX + 18} y={bracketTop + 36} fontSize={10.5} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            ① Layer order
          </text>
          <text x={bracketX + 18} y={bracketTop + 54} fontSize={10.5} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            ② Specificity
          </text>
          <text x={bracketX + 18} y={bracketTop + 72} fontSize={10.5} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            ③ Source order
          </text>
          <text x={bracketX + 18} y={bracketTop + 96} fontSize={10} fill="var(--color-fg-muted)">
            (in that order, each one a
          </text>
          <text x={bracketX + 18} y={bracketTop + 112} fontSize={10} fill="var(--color-fg-muted)">
            tiebreak for the one above it)
          </text>

          <text x={RUNG_X} y={captionY} fontSize={11} fill="var(--color-fg-muted)">
            <tspan fontWeight={600} fill="var(--color-fg-default)">@layer</tspan> is not a 4th criterion — it only ever
            sorts rules that already share an author-origin/importance rung above.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

CascadeSortOrderDiagram.displayName = "CascadeSortOrderDiagram";
