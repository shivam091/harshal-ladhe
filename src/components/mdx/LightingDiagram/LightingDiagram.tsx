import type { JSX } from "react";
import { Wrapper, Svg } from "@/components/mdx/LightingDiagram/LightingDiagram.styles";

/*
  Cross-section of an alpha channel read as terrain: flat at α = 0, a ramp up to a plateau at α = 1, and back down.
  The ramps stand in for a blurred edge — a hard edge would be a vertical cliff with no slope for light to catch.
*/
const BUMP_PATH = "M40,230 L110,230 C140,230 140,150 170,150 L230,150 C260,150 260,230 290,230 L340,230";

/*
  Two-panel static diagram of how SVG lighting reads its input: the side view shows alpha becoming height
  (scaled by surfaceScale) with a distant light arriving at its `elevation` angle, and the top view shows
  `azimuth` measured clockwise from +x. Exists because both ideas are spatial, and prose alone leaves readers
  guessing which way the angles turn.
*/
export default function LightingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 300" role="img" aria-labelledby="lighting-diagram-title lighting-diagram-desc">
          <title id="lighting-diagram-title">SVG lighting: alpha as a height map, elevation and azimuth</title>
          <desc id="lighting-diagram-desc">
            Left, a side view: the input&apos;s alpha channel is treated as terrain, flat where alpha is 0 and raised to a
            plateau where alpha is 1, the height being surfaceScale times alpha. Parallel rays from a distant light arrive
            at an angle labelled elevation, measured up from the flat surface. Right, a top view: azimuth is the direction
            toward the light in the x-y plane, measured from the positive x axis, clockwise on screen because the y axis
            points down.
          </desc>

          <defs>
            <marker id="lighting-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="lighting-diagram-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-attention)" />
            </marker>
          </defs>

          {/* Panel backgrounds and titles. */}
          <rect x={12} y={10} width={370} height={280} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
          <rect x={392} y={10} width={256} height={280} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
          <text x={197} y={34} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Side view: alpha as a height map</text>
          <text x={520} y={34} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Top view: azimuth</text>

          {/* The alpha "terrain" — filled so the raised plateau reads as solid surface. */}
          <path d={`${BUMP_PATH} Z`} fill="var(--color-bg-accent-muted)" stroke="none" />
          <path d={BUMP_PATH} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
          <text x={75} y={250} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">α = 0</text>
          <text x={208} y={140} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">α = 1</text>
          <text x={315} y={250} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">α = 0</text>

          {/* Height dimension — from the flat surface up to the plateau. */}
          <line x1={232} y1={150} x2={318} y2={150} stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={310} y1={154} x2={310} y2={226} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerStart="url(#lighting-diagram-arrow)" markerEnd="url(#lighting-diagram-arrow)" />
          <text x={318} y={194} fontSize={11} fill="var(--color-fg-muted)">height</text>

          {/* Distant light — a sun glyph with two parallel rays at a ~35° elevation. */}
          <circle cx={70} cy={66} r={12} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <line x1={84} y1={76} x2={182} y2={145} stroke="var(--color-fg-attention)" strokeWidth={2} markerEnd="url(#lighting-diagram-arrow-accent)" />
          <line x1={64} y1={86} x2={158} y2={152} stroke="var(--color-fg-attention)" strokeWidth={2} markerEnd="url(#lighting-diagram-arrow-accent)" />

          {/* Elevation angle — between the horizontal and the incoming ray. */}
          <line x1={84} y1={76} x2={150} y2={76} stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="3 3" />
          <path d="M124,76 A40,40 0 0,1 116.8,98.9" fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          <text x={132} y={92} fontSize={11} fill="var(--color-fg-default)">elevation</text>

          <text x={197} y={272} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">height = surfaceScale × α (blur α first for a soft bevel)</text>

          {/* Top view axes — +x to the right, +y downward, as in SVG user space. */}
          <circle cx={520} cy={150} r={70} fill="none" stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={440} y1={150} x2={602} y2={150} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#lighting-diagram-arrow)" />
          <text x={612} y={154} fontSize={11} fill="var(--color-fg-muted)">+x</text>
          <line x1={520} y1={72} x2={520} y2={230} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#lighting-diagram-arrow)" />
          <text x={530} y={244} fontSize={11} fill="var(--color-fg-muted)">+y</text>

          {/* Azimuth — direction toward the light, 45° here, with its angle arc. */}
          <line x1={520} y1={150} x2={569.5} y2={199.5} stroke="var(--color-fg-attention)" strokeWidth={2} markerEnd="url(#lighting-diagram-arrow-accent)" />
          <path d="M550,150 A30,30 0 0,1 541.2,171.2" fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          <text x={560} y={172} fontSize={11} fill="var(--color-fg-default)">azimuth 45°</text>
          <text x={566} y={220} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">toward the light</text>

          <text x={520} y={262} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">measured clockwise from +x,</text>
          <text x={520} y={277} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">because y points down</text>
        </Svg>
      </Wrapper>
    </>
  );
}

LightingDiagram.displayName = "LightingDiagram";
