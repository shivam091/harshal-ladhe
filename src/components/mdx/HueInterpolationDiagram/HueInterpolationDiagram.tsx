import type { JSX } from "react";
import {
  PANEL_CENTER,
  RING_R,
  ARC_R,
  PANEL_OFFSET_X,
  HUE_A,
  HUE_B,
  HUE_A_COLOR,
  HUE_B_COLOR,
  MARKER_A,
  MARKER_B,
  ARC_POINT_A,
  ARC_POINT_B,
  SHORTER_ARC,
  LONGER_ARC
} from "@/components/mdx/HueInterpolationDiagram/HueInterpolationDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/HueInterpolationDiagram/HueInterpolationDiagram.styles";

// One arc's shape, reused identically by both panels below — only its flags/label/color differ.
interface ArcConfig {
  largeArc: number;
  sweep: number;
  degrees: number;
  throughLabel: string;
}

// One hue-wheel panel: a real conic-gradient ring (an accurate rainbow, not a hand-approximated wedge fan),
// two markers on the exact same two hues, and a highlighted arc showing the specific path traveled between them.
function HuePanel({ title, arc, arcColor }: { title: string; arc: ArcConfig; arcColor: string }): JSX.Element {
  const arcPath = `M ${ARC_POINT_A.x} ${ARC_POINT_A.y} A ${ARC_R} ${ARC_R} 0 ${arc.largeArc} ${arc.sweep} ${ARC_POINT_B.x} ${ARC_POINT_B.y}`;

  return (
    <g>
      <foreignObject x={PANEL_CENTER.x - RING_R} y={PANEL_CENTER.y - RING_R} width={RING_R * 2} height={RING_R * 2}>
        <div
          style={{
            width: RING_R * 2,
            height: RING_R * 2,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, hsl(0,75%,55%), hsl(60,75%,55%), hsl(120,75%,55%), hsl(180,75%,55%), hsl(240,75%,55%), hsl(300,75%,55%), hsl(360,75%,55%))",
            WebkitMask: "radial-gradient(closest-side, transparent 62%, #fff 64%)",
            mask: "radial-gradient(closest-side, transparent 62%, #fff 64%)",
            border: "1px solid var(--color-border-muted)"
          }}
        />
      </foreignObject>

      {/* The traveled arc — same two endpoints in every panel, only its curvature/direction changes. */}
      <path d={arcPath} fill="none" stroke={arcColor} strokeWidth={4} strokeLinecap="round" />

      {/* Hue markers — placed on the ring itself, at HUE_A and HUE_B, identical in every panel. */}
      <circle cx={MARKER_A.x} cy={MARKER_A.y} r={7} fill={HUE_A_COLOR} stroke="var(--color-fg-default)" strokeWidth={1.5} />
      <circle cx={MARKER_B.x} cy={MARKER_B.y} r={7} fill={HUE_B_COLOR} stroke="var(--color-fg-default)" strokeWidth={1.5} />

      <text x={PANEL_CENTER.x} y={PANEL_CENTER.y + RING_R + 34} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{title}</text>
      <text x={PANEL_CENTER.x} y={PANEL_CENTER.y + RING_R + 52} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{arc.degrees}deg — {arc.throughLabel}</text>
    </g>
  );
}

/*
  Static SVG diagram teaching the `shorter hue` / `longer hue` interpolation keywords: the SAME two hues
  (40deg amber, 250deg blue-violet) are marked on two identical hue wheels, but the highlighted arc between
  them takes a different path each time — the "shorter hue" panel travels the 150deg way, backward through
  magenta/violet, while "longer hue" travels the 210deg way, forward through green, cyan, and blue. The one
  fact this exists to teach: these keywords don't just change a direction, they change which intermediate
  colors a `color-mix()` or gradient passes through, even though the two endpoint colors never change.
*/
export default function HueInterpolationDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 560 300" role="img" aria-labelledby="hue-interpolation-diagram-title hue-interpolation-diagram-desc">
          <title id="hue-interpolation-diagram-title">Shorter hue vs longer hue interpolation diagram</title>
          <desc id="hue-interpolation-diagram-desc">
            Two identical hue wheels, each marking the same 40 degree amber hue and 250 degree blue-violet
            hue. The left wheel highlights the shorter, 150 degree arc between them, traveling backward
            through magenta and violet. The right wheel highlights the longer, 210 degree arc between the
            exact same two hues, traveling forward through green, cyan, and blue instead.
          </desc>

          <g>
            <HuePanel title="shorter hue (default)" arc={SHORTER_ARC} arcColor="var(--color-border-accent-emphasis)" />
          </g>
          <g transform={`translate(${PANEL_OFFSET_X}, 0)`}>
            <HuePanel title="longer hue" arc={LONGER_ARC} arcColor="var(--color-border-attention-emphasis)" />
          </g>

          <text x={280} y={16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            Same two hues in both wheels — {HUE_A}deg amber and {HUE_B}deg blue-violet — only the traveled arc differs.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

HueInterpolationDiagram.displayName = "HueInterpolationDiagram";
