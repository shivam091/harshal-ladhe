import { type JSX } from "react";
import { BOX_H, BOX_W, MARKER_STYLES } from "@/components/mdx/GitRangeDiffDiagram/GitRangeDiffDiagram.constants";
import { GitRangeDiffMarker } from "@/components/mdx/GitRangeDiffDiagram/GitRangeDiffDiagram.types";

// One commit box, or a dashed empty slot when the commit has no counterpart on this side.
export default function CommitBox({ x, y, label, marker, highlight }: {
  x: number;
  y: number;
  label: string | null;
  marker: GitRangeDiffMarker;
  highlight: boolean;
}): JSX.Element {
  const style = MARKER_STYLES[marker];

  if (label === null) {
    return (
      <>
        <rect
          x={x} y={y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={6}
          fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 4"
        />
      </>
    );
  }

  return (
    <g>
      <>
        <rect
          x={x} y={y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={6}
          fill={highlight ? style.fill : "var(--color-bg-muted)"}
          stroke={highlight ? style.stroke : "var(--color-border-default)"}
          strokeWidth={1.5}
        />
        <text x={x + 10} y={y + 4} fontSize={11} fill="var(--color-fg-default)">{label}</text>
      </>
    </g>
  );
}
