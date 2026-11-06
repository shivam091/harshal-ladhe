import type { JSX } from "react";
import type { AllowDiscreteTimelineDiagramProps } from "@/components/mdx/AllowDiscreteTimelineDiagram/AllowDiscreteTimelineDiagram.types";
import { AXIS_LEFT, AXIS_RIGHT, RAMP_H, VARIANTS } from "@/components/mdx/AllowDiscreteTimelineDiagram/AllowDiscreteTimelineDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/AllowDiscreteTimelineDiagram/AllowDiscreteTimelineDiagram.styles";

/*
  Static SVG diagram showing why `display` (and `content-visibility`/`overlay`) flip at a different point in
  the duration depending on direction: entering flips at 0% so the element exists for the whole transition,
  exiting flips at 100% so the element stays visible/interactive until the transition actually finishes. The
  overlay variant reuses the same timeline to show the top-layer exit breaking when overlay isn't transitioned.
*/
export default function AllowDiscreteTimelineDiagram({ variant = "display" }: AllowDiscreteTimelineDiagramProps): JSX.Element {
  const { title, description, rows } = VARIANTS[variant];
  // Variant-scoped ids, since a post can render both variants and SVG ids are page-global.
  const idPrefix = `allow-discrete-${variant}`;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 268" role="img" aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}>
          <title id={`${idPrefix}-title`}>{title}</title>
          <desc id={`${idPrefix}-desc`}>{description}</desc>

          <defs>
            <linearGradient id={`${idPrefix}-ramp-in`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-fg-accent)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--color-fg-accent)" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id={`${idPrefix}-ramp-out`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-fg-accent)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="var(--color-fg-accent)" stopOpacity={0.15} />
            </linearGradient>
          </defs>

          {rows.map((row) => (
            <g key={row.heading}>
              <text x={(AXIS_LEFT + AXIS_RIGHT) / 2} y={row.y - 44} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                {row.heading}
              </text>

              {/* Duration axis with 0%/100% ticks. */}
              <line x1={AXIS_LEFT} y1={row.y} x2={AXIS_RIGHT} y2={row.y} stroke="var(--color-border-muted)" strokeWidth={1.5} />
              <text x={AXIS_LEFT} y={row.y + RAMP_H + 20} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">0%</text>
              <text x={AXIS_RIGHT} y={row.y + RAMP_H + 20} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">100%</text>

              {/* Opacity/transform ramp across the full duration — always continuous, unlike the discrete flip. */}
              <rect x={AXIS_LEFT} y={row.y - RAMP_H / 2} width={AXIS_RIGHT - AXIS_LEFT} height={RAMP_H} rx={4} fill={`url(#${idPrefix}-ramp-${row.direction})`} />

              {/* The discrete-property flip: a single instantaneous marker, not a ramp. */}
              <line x1={row.flipX} y1={row.y - RAMP_H / 2 - 10} x2={row.flipX} y2={row.y + RAMP_H / 2 + 10} stroke="var(--color-fg-attention)" strokeWidth={2} />
              <circle cx={row.flipX} cy={row.y - RAMP_H / 2 - 10} r={3.5} fill="var(--color-fg-attention)" />
              <text
                x={row.flipX === AXIS_LEFT ? AXIS_LEFT + 4 : AXIS_RIGHT - 4} y={row.y - RAMP_H / 2 - 16}
                textAnchor={row.flipX === AXIS_LEFT ? "start" : "end"} fontSize={9.5} fill="var(--color-fg-attention)"
              >
                {row.flipLabel}
              </text>

              <text x={(AXIS_LEFT + AXIS_RIGHT) / 2} y={row.y + RAMP_H + 36} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                {row.caption}
              </text>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

AllowDiscreteTimelineDiagram.displayName = "AllowDiscreteTimelineDiagram";
