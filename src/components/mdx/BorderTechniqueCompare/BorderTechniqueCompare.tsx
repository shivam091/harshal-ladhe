import type { JSX } from "react";
import { roundedRectPath, ringPath } from "@/components/mdx/common.helpers";
import {
  GRADIENT_START,
  GRADIENT_END,
  CODE_FONT,
  BACKDROP,
  CARD,
  BORDER,
  TECHNIQUES
} from "@/components/mdx/BorderTechniqueCompare/BorderTechniqueCompare.constants";
import { Wrapper, Svg } from "@/components/mdx/BorderTechniqueCompare/BorderTechniqueCompare.styles";

/*
  Static SVG comparison of the three gradient-border techniques, each drawn with border-radius set, on the same
  striped backdrop: border-image comes out square but hollow, background-clip rounded but solid, mask rounded and
  hollow. Exists because the differences only show up against a busy background — on a plain white page, all three
  look nearly identical, which is exactly why readers pick the wrong one.
*/
export default function BorderTechniqueCompare(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 214" role="img" aria-labelledby="border-technique-compare-title border-technique-compare-desc">
          <title id="border-technique-compare-title">Comparing border-image, background-clip, and mask gradient borders</title>
          <desc id="border-technique-compare-desc">
            Three gradient-bordered cards on a striped background, all with border-radius set. The border-image card has
            square corners, but its center is see-through. The background-clip card has rounded corners, but its solid
            center hides the stripes. The mask card has rounded corners and a see-through center.
          </desc>

          <defs>
            <pattern id="border-technique-compare-stripes" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={14} height={14} fill="var(--color-bg-accent-muted)" />
              <rect width={7} height={14} fill="var(--color-bg-attention-muted)" />
            </pattern>
            <linearGradient id="border-technique-compare-gradient" x1={0} y1={0} x2={1} y2={1}>
              <stop offset="0%" stopColor={GRADIENT_START} />
              <stop offset="100%" stopColor={GRADIENT_END} />
            </linearGradient>
          </defs>

          <rect x={BACKDROP.x} y={BACKDROP.y} width={BACKDROP.width} height={BACKDROP.height} rx={BACKDROP.radius} fill="url(#border-technique-compare-stripes)" />

          {TECHNIQUES.map((technique) => {
            // border-image ignores border-radius, so its ring is always drawn with square corners.
            const radius = technique.rounded ? CARD.radius : 0;
            const verdicts = [
              { ok: technique.rounded, label: "rounded corners" },
              { ok: technique.seeThrough, label: "see-through center" }
            ];

            return (
              <g key={technique.key}>
                <g transform={`translate(${technique.x}, ${CARD.y})`}>
                  {technique.seeThrough ? (
                    <path d={ringPath(0, 0, CARD.width, CARD.height, radius, BORDER)} fillRule="evenodd" fill="url(#border-technique-compare-gradient)" />
                  ) : (
                    <>
                      <path d={roundedRectPath(0, 0, CARD.width, CARD.height, radius)} fill="url(#border-technique-compare-gradient)" />
                      <path d={roundedRectPath(BORDER, BORDER, CARD.width - BORDER * 2, CARD.height - BORDER * 2, radius - BORDER)} fill="var(--color-bg-default)" />
                    </>
                  )}
                </g>

                <text x={technique.x + CARD.width / 2} y={BACKDROP.y + BACKDROP.height + 22} textAnchor="middle" fontSize={12} fontFamily={CODE_FONT} fontWeight={700} fill="var(--color-fg-default)">
                  {technique.key}
                </text>
                {verdicts.map((verdict, index) => (
                  <text
                    key={verdict.label} x={technique.x + CARD.width / 2} y={BACKDROP.y + BACKDROP.height + 40 + index * 15}
                    textAnchor="middle" fontSize={11} fill={verdict.ok ? "var(--color-fg-success)" : "var(--color-fg-danger)"}
                  >
                    {verdict.ok ? "✓" : "✗"} {verdict.label}
                  </text>
                ))}
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

BorderTechniqueCompare.displayName = "BorderTechniqueCompare";
