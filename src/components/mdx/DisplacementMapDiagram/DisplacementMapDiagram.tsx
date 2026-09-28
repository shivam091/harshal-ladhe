import type { JSX } from "react";
import { SCALE, ARROW_MULTIPLIER, SWATCH_SIZE, SAMPLES } from "@/components/mdx/DisplacementMapDiagram/DisplacementMapDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/DisplacementMapDiagram/DisplacementMapDiagram.styles";

// Top edge of the swatch row, below the formula heading.
const SWATCH_Y = 50;

// Baseline of the arrow row.
const ARROW_Y = 180;

// Formats an offset with an explicit sign, since the direction of the shift is the whole point of the row.
function formatOffset(offset: number): string {
  if (offset === 0) return "0 (neutral)";
  return offset > 0 ? `+${offset}` : `−${Math.abs(offset)}`;
}

/*
  Static diagram of feDisplacementMap's core formula: a map channel value C in 0–1 becomes a sampling offset of
  scale × (C − 0.5). Exists to make the non-obvious part visible — 0.5 grey, not black, is "no movement", and
  black and white push by the same amount in opposite directions.
*/
export default function DisplacementMapDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 280" role="img" aria-labelledby="displacement-map-diagram-title displacement-map-diagram-desc">
          <title id="displacement-map-diagram-title">feDisplacementMap channel value to pixel offset</title>
          <desc id="displacement-map-diagram-desc">
            Five map pixels with channel values 0, 0.25, 0.5, 0.75 and 1, from black to white. With scale set to 40, the
            offset is scale times C minus 0.5, giving minus 20, minus 10, 0, plus 10 and plus 20 user units. The 0.5 value
            produces no offset. Each output pixel copies the source pixel at x plus the offset, so content appears to move
            the opposite way.
          </desc>

          <defs>
            <marker id="displacement-map-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          {/* Heading — the formula every column below evaluates. */}
          <text x={320} y={28} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--color-fg-default)">offset = scale × (C − 0.5)</text>

          {/* Map pixels — foreground-tinted by C over the page background, so 0 is empty and 1 is solid in either theme. */}
          {SAMPLES.map(({ value, cx }) => (
            <g key={value}>
              <rect x={cx - SWATCH_SIZE / 2} y={SWATCH_Y} width={SWATCH_SIZE} height={SWATCH_SIZE} rx={4} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1} />
              <rect x={cx - SWATCH_SIZE / 2} y={SWATCH_Y} width={SWATCH_SIZE} height={SWATCH_SIZE} rx={4} fill="var(--color-fg-default)" fillOpacity={value} />
              <text x={cx} y={SWATCH_Y + SWATCH_SIZE + 20} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">C = {value}</text>
            </g>
          ))}

          <text x={320} y={150} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">sampling offset in user units (scale = {SCALE})</text>

          {/* Offset arrows — a tick marks each pixel's own x, the arrow points to where it samples from. */}
          {SAMPLES.map(({ value, cx }) => {
            const offset = SCALE * (value - 0.5);

            return (
              <g key={value}>
                <line x1={cx} y1={ARROW_Y - 10} x2={cx} y2={ARROW_Y + 10} stroke="var(--color-border-default)" strokeWidth={1.5} />
                {offset === 0
                  ? <circle cx={cx} cy={ARROW_Y} r={4} fill="var(--color-fg-accent)" />
                  : <line x1={cx} y1={ARROW_Y} x2={cx + offset * ARROW_MULTIPLIER} y2={ARROW_Y} stroke="var(--color-fg-accent)" strokeWidth={2} markerEnd="url(#displacement-map-diagram-arrow)" />}
                <text x={cx} y={ARROW_Y + 30} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{formatOffset(offset)}</text>
              </g>
            );
          })}

          {/* Footnotes — where C comes from, and which way the content actually appears to move. */}
          <text x={320} y={242} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">C comes from in2, via xChannelSelector (horizontal) or yChannelSelector (vertical)</text>
          <text x={320} y={264} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">each output pixel copies the source pixel at x + offset, so content appears to move the other way</text>
        </Svg>
      </Wrapper>
    </>
  );
}

DisplacementMapDiagram.displayName = "DisplacementMapDiagram";
