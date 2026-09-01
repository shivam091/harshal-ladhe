import type { JSX } from "react";
import { PANEL_W, PANEL_H, PANEL_GAP, CIRCLE_AREA_H, CHECKER_TILE, CIRCLE_A, CIRCLE_B, MASK_COMPOSITE_PANELS } from "@/components/mdx/MaskCompositeDiagram/MaskCompositeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MaskCompositeDiagram/MaskCompositeDiagram.styles";

/*
  Static SVG diagram of the 4 `mask-composite` operators — a 2x2 grid of panels, each showing the same two
  overlapping circles (A left, B right) with the resulting visible region filled in and everything else left
  as a checkerboard "hidden" pattern. Every panel reuses one shared clip-path (a circle matching B's position)
  to carve the overlap in or out, which is exactly how the compositing itself works — the diagram is built from
  the same primitive it's teaching.
*/
export default function MaskCompositeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg
          viewBox={`0 0 ${PANEL_W * 2 + PANEL_GAP} ${PANEL_H * 2 + PANEL_GAP}`}
          role="img"
          aria-labelledby="mask-composite-diagram-title mask-composite-diagram-desc"
        >
          <title id="mask-composite-diagram-title">CSS mask-composite operators diagram</title>
          <desc id="mask-composite-diagram-desc">
            Four panels, each showing two overlapping circles A and B composited with add, subtract, intersect,
            and exclude. Add fills everything in either circle. Subtract fills only A minus the overlap.
            Intersect fills only the overlap. Exclude fills either circle but not the overlap.
          </desc>

          <defs>
            <pattern id="mask-composite-checker" width={CHECKER_TILE * 2} height={CHECKER_TILE * 2} patternUnits="userSpaceOnUse">
              <rect width={CHECKER_TILE * 2} height={CHECKER_TILE * 2} fill="var(--color-bg-default)" />
              <rect width={CHECKER_TILE} height={CHECKER_TILE} fill="var(--color-bg-muted)" />
              <rect x={CHECKER_TILE} y={CHECKER_TILE} width={CHECKER_TILE} height={CHECKER_TILE} fill="var(--color-bg-muted)" />
            </pattern>

            {/* Shared clip: a circle matching B's position/size, reused unchanged inside every panel's own local coordinate system. */}
            <clipPath id="mask-composite-clip-b">
              <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} />
            </clipPath>
          </defs>

          {MASK_COMPOSITE_PANELS.map((panel, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const panelX = col * (PANEL_W + PANEL_GAP);
            const panelY = row * (PANEL_H + PANEL_GAP);

            return (
              <g key={panel.key} transform={`translate(${panelX}, ${panelY})`}>
                <rect width={PANEL_W} height={CIRCLE_AREA_H} rx={8} fill="url(#mask-composite-checker)" stroke="var(--color-border-muted)" strokeWidth={1} />

                {panel.key === "add" && (
                  <>
                    <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="var(--color-bg-accent-muted)" />
                    <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill="var(--color-bg-accent-muted)" />
                  </>
                )}

                {panel.key === "subtract" && (
                  <>
                    <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="var(--color-bg-accent-muted)" />
                    <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill="url(#mask-composite-checker)" />
                  </>
                )}

                {panel.key === "intersect" && (
                  <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="var(--color-bg-accent-muted)" clipPath="url(#mask-composite-clip-b)" />
                )}

                {panel.key === "exclude" && (
                  <>
                    <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="var(--color-bg-accent-muted)" />
                    <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill="var(--color-bg-accent-muted)" />
                    <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="url(#mask-composite-checker)" clipPath="url(#mask-composite-clip-b)" />
                  </>
                )}

                {/* Circle outlines drawn last so both boundaries stay legible regardless of fill logic above. */}
                <circle cx={CIRCLE_A.cx} cy={CIRCLE_A.cy} r={CIRCLE_A.r} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={CIRCLE_A.cx - 6} y={CIRCLE_A.cy - 34} fontSize={11} fill="var(--color-fg-muted)">A</text>
                <text x={CIRCLE_B.cx - 2} y={CIRCLE_B.cy - 34} fontSize={11} fill="var(--color-fg-muted)">B</text>

                <text x={PANEL_W / 2} y={CIRCLE_AREA_H + 22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.label}</text>
                <text x={PANEL_W / 2} y={CIRCLE_AREA_H + 40} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{panel.formula}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

MaskCompositeDiagram.displayName = "MaskCompositeDiagram";
