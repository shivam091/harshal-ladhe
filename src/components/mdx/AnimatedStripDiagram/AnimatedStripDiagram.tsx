import type { JSX } from "react";
import {
  GRADIENT_STOPS,
  WINDOW,
  TILE_WIDTH,
  STRIP,
  ROWS,
  tileEdges,
  WORD_FONT_SIZE
} from "@/components/mdx/AnimatedStripDiagram/AnimatedStripDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/AnimatedStripDiagram/AnimatedStripDiagram.styles";

/*
  Static SVG diagram of the background-size: 200% panning trick — the same text box at three keyframe positions,
  each showing the strip it's cut from and the slice it actually displays. Exists because "only half the gradient
  is visible, and 200% lands back on 0%" is a moving picture that prose alone can't hold still.
*/
export default function AnimatedStripDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 330" role="img" aria-labelledby="animated-strip-diagram-title animated-strip-diagram-desc">
          <title id="animated-strip-diagram-title">Animated gradient text: panning a double-width strip</title>
          <desc id="animated-strip-diagram-desc">
            A gradient strip from orange to pink to blue and back to orange, twice as wide as the text, shown at three
            background-position values. The text box stays still and shows only the half of the strip behind it. At
            0% it shows the first half, orange through pink, at 100% the second half, blue back to orange, and at
            200% the strip has moved one full copy so
            the text looks exactly as it did at 0%, which is why the loop has no visible jump.
          </desc>

          <defs>
            {/* One repeating gradient per row, anchored where that row's tile starts — spreadMethod repeat stands in for background-repeat. */}
            {ROWS.map((row, index) => (
              <linearGradient
                key={row.position} id={`animated-strip-${index}`} gradientUnits="userSpaceOnUse" spreadMethod="repeat"
                x1={row.tileStart} y1={0} x2={row.tileStart + TILE_WIDTH} y2={0}
              >
                {GRADIENT_STOPS.map((color, stopIndex) => (
                  <stop key={`${color}-${stopIndex}`} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
                ))}
              </linearGradient>
            ))}
          </defs>

          <text x={24} y={26} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            background-size: 200% — the text is a fixed window onto a double-width strip
          </text>

          {ROWS.map((row, index) => (
            <g key={row.position} transform={`translate(0 ${row.y})`}>
              {/* Row label: the keyframe value and what it means. */}
              <text x={24} y={11} fontSize={12} fontWeight={700} fill="var(--color-fg-default)" fontFamily="'Source Code Pro', ui-monospace, monospace">
                {row.position}
              </text>
              <text x={24} y={28} fontSize={10} fill="var(--color-fg-muted)">{row.caption}</text>

              {/* The strip around the text, faded, with the part behind the text drawn at full strength. */}
              <rect x={STRIP.x} y={0} width={STRIP.width} height={STRIP.height} fill={`url(#animated-strip-${index})`} opacity={0.3} />
              <rect x={WINDOW.x} y={0} width={WINDOW.width} height={STRIP.height} fill={`url(#animated-strip-${index})`} />
              <rect
                x={WINDOW.x - 2} y={-3} width={WINDOW.width + 4} height={STRIP.height + 6} rx={3}
                fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2}
              />

              {/* Ticks where one copy of the gradient meets the next — both sides are the same orange. */}
              {tileEdges(row.tileStart).map((x) => (
                <line key={x} x1={x} y1={-6} x2={x} y2={STRIP.height + 6} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="2 2" />
              ))}

              {/* Guides from the window down to the text it paints. */}
              <line x1={WINDOW.x} y1={STRIP.height + 4} x2={WINDOW.x} y2={56} stroke="var(--color-border-muted)" strokeDasharray="3 3" />
              <line x1={WINDOW.x + WINDOW.width} y1={STRIP.height + 4} x2={WINDOW.x + WINDOW.width} y2={56} stroke="var(--color-border-muted)" strokeDasharray="3 3" />

              <text
                x={WINDOW.x} y={50} textLength={WINDOW.width} lengthAdjust="spacingAndGlyphs"
                fontSize={WORD_FONT_SIZE} fontWeight={800} fill={`url(#animated-strip-${index})`}
              >
                Gradient
              </text>
            </g>
          ))}

          {/* Legend for the ticks. */}
          <line x1={24} y1={310} x2={24} y2={322} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="2 2" />
          <text x={32} y={320} fontSize={11} fill="var(--color-fg-muted)">
            tile edge — matching end stops hide the jump from 200% back to 0%
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

AnimatedStripDiagram.displayName = "AnimatedStripDiagram";
