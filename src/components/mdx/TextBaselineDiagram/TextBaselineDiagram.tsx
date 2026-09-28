import type { JSX } from "react";
import { GLYPHS, LINE_SPAN, LABEL_X, BASELINES, TONE_STROKE } from "@/components/mdx/TextBaselineDiagram/TextBaselineDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/TextBaselineDiagram/TextBaselineDiagram.styles";

/*
  Static SVG diagram of one glyph run annotated with the baselines dominant-baseline can snap to. Exists because
  "which line is middle vs. central vs. hanging" is nearly impossible to picture from prose alone, and because the
  (x, y) anchor dot sitting on the alphabetic line is the single fact most people get wrong about <text>.
*/
export default function TextBaselineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 275" role="img" aria-labelledby="text-baseline-diagram-title text-baseline-diagram-desc">
          <title id="text-baseline-diagram-title">SVG text baselines diagram</title>
          <desc id="text-baseline-diagram-desc">
            The glyphs Hxgp drawn large, crossed by horizontal guide lines. From top to bottom: the hanging baseline near
            the top of the capitals, the x-height, central and middle close together around the middle of the lowercase
            letters, the alphabetic baseline the letters sit on, and the descender line below it where g and p end. The
            (x, y) anchor point of the text element sits on the alphabetic baseline at the start of the run.
          </desc>

          {/* Glyph run — muted so the guide lines drawn over it stay readable. */}
          <text x={GLYPHS.x} y={GLYPHS.y} fontSize={GLYPHS.fontSize} fill="var(--color-fg-muted)" opacity={0.55}>{GLYPHS.text}</text>

          {/* Guide lines — solid for dominant-baseline values, dashed for plain font metrics. */}
          {BASELINES.map((line) => (
            <g key={line.label}>
              <line x1={LINE_SPAN.x1} y1={line.y} x2={LINE_SPAN.x2} y2={line.y} stroke={TONE_STROKE[line.tone]} strokeWidth={line.tone === "accent" ? 2 : 1.25} strokeDasharray={line.kind === "metric" ? "4 4" : undefined} />
              <text x={line.side === "right" ? LABEL_X : LINE_SPAN.x1 - 10} y={line.y + 4} textAnchor={line.side === "right" ? "start" : "end"} fontSize={12} fontWeight={line.kind === "value" ? 600 : 400} fill={line.kind === "value" ? "var(--color-fg-default)" : "var(--color-fg-muted)"}>{line.label}</text>
            </g>
          ))}

          {/* Anchor point — the (x, y) of the <text>, on the alphabetic baseline at the start of the run. */}
          <circle cx={GLYPHS.x} cy={GLYPHS.y} r={5} fill="var(--color-fg-accent)" />
          <line x1={GLYPHS.x} y1={GLYPHS.y + 8} x2={GLYPHS.x} y2={226} stroke="var(--color-fg-accent)" strokeWidth={1} />
          <text x={GLYPHS.x} y={242} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-accent)">(x, y) anchor</text>

          {/* Caption — the line positions are illustrative; each font supplies its own. */}
          <text x={320} y={266} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">positions are approximate — every font defines its own baseline metrics</text>
        </Svg>
      </Wrapper>
    </>
  );
}

TextBaselineDiagram.displayName = "TextBaselineDiagram";
