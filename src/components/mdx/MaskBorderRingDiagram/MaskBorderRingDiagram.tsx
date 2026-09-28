import type { JSX } from "react";
import { roundedRectPath, ringPath } from "@/components/mdx/common.helpers";
import {
  GRADIENT_START,
  GRADIENT_END,
  PANEL,
  RING,
  KEEP_COLOR,
  STEPS,
  OPERATORS
} from "@/components/mdx/MaskBorderRingDiagram/MaskBorderRingDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MaskBorderRingDiagram/MaskBorderRingDiagram.styles";

/*
  Static SVG diagram of the mask-composite gradient border: two mask layers, the ring that `exclude` leaves behind,
  and that ring applied to a gradient over a striped backdrop. Exists because "exclude keeps only the
  non-overlapping parts" is abstract until the two layers and their difference are drawn side by side — and the
  striped backdrop is what shows this technique's one advantage over background-clip.
*/
export default function MaskBorderRingDiagram(): JSX.Element {
  const { width, height, radius } = PANEL;
  const full = roundedRectPath(0, 0, width, height, radius);
  const inner = roundedRectPath(RING, RING, width - RING * 2, height - RING * 2, radius - RING);
  const ring = ringPath(0, 0, width, height, radius, RING);

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 570 236" role="img" aria-labelledby="mask-border-ring-diagram-title mask-border-ring-diagram-desc">
          <title id="mask-border-ring-diagram-title">How mask-composite: exclude cuts out a gradient border</title>
          <desc id="mask-border-ring-diagram-desc">
            Four panels. Mask layer one is opaque only over the content box. Mask layer two is opaque over the whole box.
            Combining them with exclude keeps only the areas where exactly one layer is opaque, which is a ring the
            thickness of the padding. Applied to an orange-to-pink gradient over a striped background, that ring becomes
            a gradient border whose center is transparent, so the stripes show through.
          </desc>

          <defs>
            {/* Checkerboard = "transparent in the mask", the usual image-editor convention for cut-away areas. */}
            <pattern id="mask-border-ring-checker" width={10} height={10} patternUnits="userSpaceOnUse">
              <rect width={10} height={10} fill="var(--color-bg-default)" />
              <rect width={5} height={5} fill="var(--color-bg-muted)" />
              <rect x={5} y={5} width={5} height={5} fill="var(--color-bg-muted)" />
            </pattern>
            {/* A busy backdrop behind the result, so a see-through center is actually visible as see-through. */}
            <pattern id="mask-border-ring-stripes" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={12} height={12} fill="var(--color-bg-accent-muted)" />
              <rect width={6} height={12} fill="var(--color-bg-attention-muted)" />
            </pattern>
            <linearGradient id="mask-border-ring-gradient" x1={0} y1={0} x2={1} y2={0}>
              <stop offset="0%" stopColor={GRADIENT_START} />
              <stop offset="100%" stopColor={GRADIENT_END} />
            </linearGradient>
          </defs>

          {STEPS.map((step) => (
            <g key={step.key}>
              <text x={step.x + width / 2} y={PANEL.y - 14} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">
                {step.title}
              </text>

              <g transform={`translate(${step.x}, ${PANEL.y})`}>
                {step.key === "content" && (
                  <>
                    <path d={full} fill="url(#mask-border-ring-checker)" stroke="var(--color-border-default)" />
                    <path d={inner} fill={KEEP_COLOR} />
                  </>
                )}

                {step.key === "full" && <path d={full} fill={KEEP_COLOR} />}

                {step.key === "ring" && (
                  <>
                    <path d={full} fill="url(#mask-border-ring-checker)" stroke="var(--color-border-default)" />
                    <path d={ring} fillRule="evenodd" fill={KEEP_COLOR} />
                  </>
                )}

                {step.key === "result" && (
                  <>
                    {/* Backdrop extends past the element on every side, so the transparent center reads as "the page behind". */}
                    <rect x={-6} y={-6} width={width + 12} height={height + 12} rx={4} fill="url(#mask-border-ring-stripes)" />
                    <path d={ring} fillRule="evenodd" fill="url(#mask-border-ring-gradient)" />
                  </>
                )}
              </g>

              {step.code.map((line, index) => (
                <text
                  key={`${index}-${line}`} x={step.x + width / 2} y={PANEL.y + height + 22 + index * 14}
                  textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}

          {OPERATORS.map((operator) => (
            <text key={operator.label} x={operator.x} y={PANEL.y + height / 2 + 7} textAnchor="middle" fontSize={20} fill="var(--color-fg-muted)">
              {operator.label}
            </text>
          ))}

          {/* Legend for the mask panels' two fills. */}
          <g transform="translate(160, 212)">
            <rect width={12} height={12} rx={2} fill={KEEP_COLOR} />
            <text x={18} y={10} fontSize={10.5} fill="var(--color-fg-muted)">opaque = kept</text>
            <rect x={120} width={12} height={12} rx={2} fill="url(#mask-border-ring-checker)" stroke="var(--color-border-default)" />
            <text x={138} y={10} fontSize={10.5} fill="var(--color-fg-muted)">transparent = cut away</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

MaskBorderRingDiagram.displayName = "MaskBorderRingDiagram";
