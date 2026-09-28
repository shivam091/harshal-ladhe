import type { JSX } from "react";
import { ANCHOR_X, GUIDE, ROWS } from "@/components/mdx/TextAnchorDiagram/TextAnchorDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/TextAnchorDiagram/TextAnchorDiagram.styles";

/*
  Static SVG diagram of the three text-anchor values against one vertical guide at a single x. Exists because
  text-anchor has no container to align within — seeing all three strings pinned to the same line makes it
  obvious that the value only chooses which part of the string lands on x.
*/
export default function TextAnchorDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 620 232" role="img" aria-labelledby="text-anchor-diagram-title text-anchor-diagram-desc">
          <title id="text-anchor-diagram-title">SVG text-anchor diagram</title>
          <desc id="text-anchor-diagram-desc">
            A vertical guide line marks one x coordinate. Three text rows all use that same x: with text-anchor start the
            text begins at the line and extends right, with middle it is centred on the line, and with end it finishes
            at the line and extends left.
          </desc>

          {/* Shared x guide — the only horizontal reference text-anchor ever uses. */}
          <line x1={ANCHOR_X} y1={GUIDE.y1} x2={ANCHOR_X} y2={GUIDE.y2} stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={ANCHOR_X} y={24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-accent)">x</text>

          {/* Rows — each string names its own text-anchor value and is anchored with it. */}
          {ROWS.map((row) => (
            <g key={row.value}>
              <text x={ANCHOR_X} y={row.y} textAnchor={row.value} fontSize={16} fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fill="var(--color-fg-default)">{`text-anchor="${row.value}"`}</text>
              <circle cx={ANCHOR_X} cy={row.y} r={4} fill="var(--color-fg-accent)" />
            </g>
          ))}

          {/* Caption — the same x in every row; in right-to-left text start and end trade sides. */}
          <text x={310} y={212} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">every row uses the same (x, y) — text-anchor only picks which part of the string lands on x</text>
          <text x={310} y={226} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">in right-to-left text, start and end swap sides</text>
        </Svg>
      </Wrapper>
    </>
  );
}

TextAnchorDiagram.displayName = "TextAnchorDiagram";
