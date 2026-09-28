import type { JSX } from "react";
import { roundedRectPath, ringPath } from "@/components/mdx/common.helpers";
import {
  BOX,
  BORDER_WIDTH,
  PADDING_WIDTH,
  NOTE_X,
  NOTE_LINES
} from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.constants";
import { Svg } from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.styles";

/*
  Nested content/padding/border boxes, with the background drawn running under the (hatched, transparent) border
  band. Exists so "a transparent border is a window onto the background" is something the reader sees, not just
  reads, before any technique depends on it.
*/
export default function BoxModelView(): JSX.Element {
  const padding = { x: BOX.x + BORDER_WIDTH, y: BOX.y + BORDER_WIDTH, width: BOX.width - BORDER_WIDTH * 2, height: BOX.height - BORDER_WIDTH * 2 };
  const content = { x: padding.x + PADDING_WIDTH, y: padding.y + PADDING_WIDTH, width: padding.width - PADDING_WIDTH * 2, height: padding.height - PADDING_WIDTH * 2 };

  return (
    <Svg viewBox="0 0 540 242" role="img" aria-labelledby="border-box-model-diagram-title border-box-model-diagram-desc">
      <title id="border-box-model-diagram-title">Content, padding, and border boxes</title>
      <desc id="border-box-model-diagram-desc">
        Three nested rectangles: the content box in the middle, the padding box around it, and the border box on the
        outside. The element&apos;s background fills all of them, including the hatched border band, which is transparent —
        so the background shows through the border.
      </desc>

      <defs>
        {/* Diagonal hatching marks the border band as "transparent — you're seeing the background through it". */}
        <pattern id="border-box-model-hatch" width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={8} stroke="var(--color-fg-default)" strokeOpacity={0.35} strokeWidth={2} />
        </pattern>
      </defs>

      {/* The background, painted across the entire border box. */}
      <path d={roundedRectPath(BOX.x, BOX.y, BOX.width, BOX.height, BOX.radius)} fill="var(--color-bg-accent-muted)" />

      {/* Border band — hatched and outlined with dashes, since it's transparent. */}
      <path
        d={ringPath(BOX.x, BOX.y, BOX.width, BOX.height, BOX.radius, BORDER_WIDTH)} fillRule="evenodd"
        fill="url(#border-box-model-hatch)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="5 3"
      />
      {/* Labeled just above the box — inside the hatched band the text would be hard to read. */}
      <text x={BOX.x + 4} y={BOX.y - 8} fontSize={10.5} fontWeight={700} fill="var(--color-fg-default)">border box (border is transparent)</text>

      {/* Padding box edge. */}
      <text x={padding.x + 8} y={padding.y + 16} fontSize={10.5} fontWeight={600} fill="var(--color-fg-muted)">padding box</text>

      {/* Content box. */}
      <rect
        x={content.x} y={content.y} width={content.width} height={content.height} rx={4}
        fill="none" stroke="var(--color-border-default)" strokeWidth={1.5}
      />
      <text x={content.x + content.width / 2} y={content.y + content.height / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
        content box
      </text>

      {/* Explanatory notes on the right. */}
      {NOTE_LINES.map((line, index) => (
        <text
          key={`${index}-${line.text}`} x={NOTE_X} y={90 + index * 17} fontSize={11.5}
          fontWeight={line.bold ? 700 : 400} fill={line.bold ? "var(--color-fg-default)" : "var(--color-fg-muted)"}
        >
          {line.text}
        </text>
      ))}
    </Svg>
  );
}

BoxModelView.displayName = "BoxModelView";
