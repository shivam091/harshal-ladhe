import type { JSX } from "react";
import {
  GRADIENT_STOPS,
  SLICE_X,
  CLONE_X,
  LINES,
  TOTAL_WIDTH,
  LINE_OFFSETS,
  STRIP,
  STRIP_SCALE,
  LINE_FONT_SIZE
} from "@/components/mdx/BoxDecorationBreakDiagram/BoxDecorationBreakDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/BoxDecorationBreakDiagram/BoxDecorationBreakDiagram.styles";

/*
  Static SVG diagram comparing a wrapped gradient heading with and without box-decoration-break: clone. The left
  column cuts every line from one long strip (so line 1 is all orange and line 3 all purple); the right gives each
  line its own complete gradient. Exists because "the lines look disconnected" is hard to picture until the two
  are side by side.
*/
export default function BoxDecorationBreakDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 250" role="img" aria-labelledby="box-decoration-break-diagram-title box-decoration-break-diagram-desc">
          <title id="box-decoration-break-diagram-title">box-decoration-break: slice versus clone</title>
          <desc id="box-decoration-break-diagram-desc">
            Two copies of a heading wrapped onto three lines. On the left, without the fix, the lines are cut from one
            long orange-to-pink-to-purple strip laid end to end, so the first line is mostly orange and the last mostly
            purple. On the right, with box-decoration-break: clone, every line shows the complete gradient from orange
            to purple.
          </desc>

          <defs>
            {/* One gradient per line and per column — userSpaceOnUse so each is positioned on the line's own x range. */}
            {LINES.map((line, index) => (
              <linearGradient
                key={`slice-${line.text}`} id={`box-decoration-break-slice-${index}`} gradientUnits="userSpaceOnUse"
                x1={SLICE_X - LINE_OFFSETS[index]} y1={0} x2={SLICE_X - LINE_OFFSETS[index] + TOTAL_WIDTH} y2={0}
              >
                {GRADIENT_STOPS.map((color, stopIndex) => (
                  <stop key={color} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
                ))}
              </linearGradient>
            ))}
            {LINES.map((line, index) => (
              <linearGradient
                key={`clone-${line.text}`} id={`box-decoration-break-clone-${index}`} gradientUnits="userSpaceOnUse"
                x1={CLONE_X} y1={0} x2={CLONE_X + line.width} y2={0}
              >
                {GRADIENT_STOPS.map((color, stopIndex) => (
                  <stop key={color} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
                ))}
              </linearGradient>
            ))}
            <linearGradient id="box-decoration-break-strip" x1={0} y1={0} x2={1} y2={0}>
              {GRADIENT_STOPS.map((color, stopIndex) => (
                <stop key={color} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
          </defs>

          {/* Column titles. */}
          <text x={SLICE_X} y={28} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">Without the fix (slice)</text>
          <text x={CLONE_X} y={28} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">With box-decoration-break: clone</text>

          {/* Slice: one strip, divided into the three fragments it gets cut into. */}
          <rect x={SLICE_X} y={STRIP.y} width={STRIP.width} height={STRIP.height} rx={3} fill="url(#box-decoration-break-strip)" />
          {LINE_OFFSETS.slice(1).map((offset) => (
            <line key={offset} x1={SLICE_X + offset * STRIP_SCALE} y1={STRIP.y - 3} x2={SLICE_X + offset * STRIP_SCALE} y2={STRIP.y + STRIP.height + 3} stroke="var(--color-fg-default)" strokeWidth={2} />
          ))}
          {LINES.map((line, index) => (
            <text
              key={line.text} x={SLICE_X + (LINE_OFFSETS[index] + line.width / 2) * STRIP_SCALE} y={STRIP.y + STRIP.height + 16}
              textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)"
            >
              line {index + 1}
            </text>
          ))}

          {/* Clone: every fragment gets its own full-length strip. */}
          {LINES.map((line, index) => {
            const stripWidth = (STRIP.width - STRIP.gap * (LINES.length - 1)) / LINES.length;
            const x = CLONE_X + index * (stripWidth + STRIP.gap);
            return (
              <g key={line.text}>
                <rect x={x} y={STRIP.y} width={stripWidth} height={STRIP.height} rx={3} fill="url(#box-decoration-break-strip)" />
                <text x={x + stripWidth / 2} y={STRIP.y + STRIP.height + 16} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                  line {index + 1}
                </text>
              </g>
            );
          })}

          {/* The wrapped heading itself, rendered once per column. */}
          {LINES.map((line, index) => (
            <g key={line.text}>
              <text
                x={SLICE_X} y={line.baseline} textLength={line.width} lengthAdjust="spacingAndGlyphs"
                fontSize={LINE_FONT_SIZE} fontWeight={800} fill={`url(#box-decoration-break-slice-${index})`}
              >
                {line.text}
              </text>
              <text
                x={CLONE_X} y={line.baseline} textLength={line.width} lengthAdjust="spacingAndGlyphs"
                fontSize={LINE_FONT_SIZE} fontWeight={800} fill={`url(#box-decoration-break-clone-${index})`}
              >
                {line.text}
              </text>
            </g>
          ))}

          {/* Divider between the two columns. */}
          <line x1={270} y1={14} x2={270} y2={222} stroke="var(--color-border-muted)" strokeDasharray="4 3" />

          <text x={SLICE_X} y={238} fontSize={11} fill="var(--color-fg-muted)">each line gets one slice of the gradient</text>
          <text x={CLONE_X} y={238} fontSize={11} fill="var(--color-fg-muted)">each line gets the full gradient</text>
        </Svg>
      </Wrapper>
    </>
  );
}

BoxDecorationBreakDiagram.displayName = "BoxDecorationBreakDiagram";
