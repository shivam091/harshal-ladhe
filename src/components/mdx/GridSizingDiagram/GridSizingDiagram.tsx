import type { JSX } from "react";
import { PANEL_W, PANEL_TOP, PANEL_H, FIT_LEFT, FIT_ITEM_W, FIT_X, FILL_LEFT, FILL_TRACK_W, FILL_X } from "@/components/mdx/GridSizingDiagram/GridSizingDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridSizingDiagram/GridSizingDiagram.styles";

/*
  Static SVG diagram comparing `auto-fit` and `auto-fill` on the same container width — the same 3 items,
  the same track minimum, but auto-fit collapses the unused tracks while auto-fill keeps them reserved.
*/
export default function GridSizingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 760 260" role="img" aria-labelledby="grid-sizing-diagram-title grid-sizing-diagram-desc">
          <title id="grid-sizing-diagram-title">auto-fit vs auto-fill diagram</title>
          <desc id="grid-sizing-diagram-desc">
            Two identically-wide containers, each using minmax(200px, 1fr) columns with 3 real items. On the left,
            auto-fit stretches the 3 items to fill the row, with no empty tracks. On the right, auto-fill keeps 2
            extra empty tracks reserved at fixed width, so the 3 items stay narrow instead of stretching.
          </desc>

          {/* Divider between the two panels. */}
          <line x1={380} y1={20} x2={380} y2={224} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />

          {/* auto-fit panel */}
          <text x={FIT_LEFT + PANEL_W / 2} y={30} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">auto-fit</text>
          <rect x={FIT_LEFT - 8} y={PANEL_TOP - 6} width={PANEL_W + 16} height={PANEL_H + 12} rx={10} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />
          {[0, 1, 2].map((index) => (
            <g key={`fit-${index}`}>
              <rect x={FIT_X[index]} y={PANEL_TOP} width={FIT_ITEM_W} height={PANEL_H} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
              <text x={FIT_X[index] + FIT_ITEM_W / 2} y={PANEL_TOP + PANEL_H / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">{index + 1}</text>
            </g>
          ))}
          <text x={FIT_LEFT + PANEL_W / 2} y={228} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">empty tracks collapse — items stretch</text>

          {/* auto-fill panel */}
          <text x={FILL_LEFT + PANEL_W / 2} y={30} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">auto-fill</text>
          <rect x={FILL_LEFT - 8} y={PANEL_TOP - 6} width={PANEL_W + 16} height={PANEL_H + 12} rx={10} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />
          {FILL_X.map((x, index) => (
            index < 3 ? (
              <g key={`fill-${index}`}>
                <rect x={x} y={PANEL_TOP} width={FILL_TRACK_W} height={PANEL_H} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                <text x={x + FILL_TRACK_W / 2} y={PANEL_TOP + PANEL_H / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">{index + 1}</text>
              </g>
            ) : (
              <rect key={`fill-${index}`} x={x} y={PANEL_TOP} width={FILL_TRACK_W} height={PANEL_H} rx={6} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="5 4" />
            )
          ))}
          <text x={FILL_LEFT + PANEL_W / 2} y={228} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">empty tracks reserved — items stay fixed</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridSizingDiagram.displayName = "GridSizingDiagram";
