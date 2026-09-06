import type { JSX } from "react";
import {
  CANVAS_W,
  CANVAS_H,
  COLUMN_CENTERS,
  NODE_W,
  NODE_H,
  TITLE_Y,
  REQUEST_Y,
  MIDDLEWARE_Y,
  OUTCOME_Y,
  OUTCOME_H,
  NOTE_Y,
  AB_VISIT_SCENARIOS
} from "@/components/mdx/AbBucketingDiagram/AbBucketingDiagram.constants";
import { getAbBucketColor } from "@/components/mdx/AbBucketingDiagram/AbBucketingDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/AbBucketingDiagram/AbBucketingDiagram.styles";

const TEXT_FONT_FAMILY = "'Alan Sans', 'Source Sans 3', system-ui, sans-serif";

/*
  Static SVG diagram of the property that makes cookie-based A/B testing actually work: a bucket is
  assigned exactly once, the first time a visitor shows up with no bucket cookie, and every visit
  after that is just middleware reading the same cookie back rather than re-rolling. Both columns
  deliberately land the same visitor in the same bucket (B) — the thing to notice isn't which bucket
  it is, it's that the right-hand column's middleware step does no assignment at all, and the outcome
  is identical either way.
*/
export default function AbBucketingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="ab-bucketing-diagram-title ab-bucketing-diagram-desc">
          <title id="ab-bucketing-diagram-title">Cookie-based A/B bucketing diagram</title>
          <desc id="ab-bucketing-diagram-desc">
            Two columns. First: a visitor arrives with no ab-bucket cookie, middleware hashes a new
            random id to assign bucket B, sets an ab-bucket cookie, and rewrites to home-variant-b.
            Second: a visitor arrives already carrying an ab-bucket=b cookie, middleware just reads
            that value with no new assignment, and rewrites to the same home-variant-b — the same
            outcome, reached without picking a bucket again.
          </desc>

          <defs>
            <marker id="ab-bucketing-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-muted)" />
            </marker>
          </defs>

          {AB_VISIT_SCENARIOS.map((scenario, index) => {
            const columnX = COLUMN_CENTERS[index];
            const bucketColor = getAbBucketColor(scenario.bucket);
            const requestBottom = REQUEST_Y + NODE_H;
            const middlewareBottom = MIDDLEWARE_Y + NODE_H;

            return (
              <g key={scenario.title}>
                <text x={columnX} y={TITLE_Y} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="var(--color-fg-default)">
                  {scenario.title}
                </text>

                <rect x={columnX - NODE_W / 2} y={REQUEST_Y} width={NODE_W} height={NODE_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={columnX} y={REQUEST_Y + NODE_H / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                  {scenario.requestLabel}
                </text>

                <line x1={columnX} y1={requestBottom} x2={columnX} y2={MIDDLEWARE_Y} stroke="var(--color-border-muted)" strokeWidth={1.75} markerEnd="url(#ab-bucketing-arrow)" />

                <rect x={columnX - NODE_W / 2} y={MIDDLEWARE_Y} width={NODE_W} height={NODE_H} rx={8} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                <foreignObject x={columnX - NODE_W / 2 + 10} y={MIDDLEWARE_Y + 4} width={NODE_W - 20} height={NODE_H - 8}>
                  <div style={{ fontSize: 10.5, lineHeight: 1.3, textAlign: "center", color: "var(--color-fg-default)", fontFamily: TEXT_FONT_FAMILY, display: "flex", alignItems: "center", justifyContent: "center", blockSize: "100%" }}>
                    middleware.ts — {scenario.middlewareAction}
                  </div>
                </foreignObject>

                <line x1={columnX} y1={middlewareBottom} x2={columnX} y2={OUTCOME_Y} stroke="var(--color-border-muted)" strokeWidth={1.75} markerEnd="url(#ab-bucketing-arrow)" />

                <rect x={columnX - NODE_W / 2} y={OUTCOME_Y} width={NODE_W} height={OUTCOME_H} rx={8} fill={bucketColor.fill} stroke={bucketColor.stroke} strokeWidth={1.5} />
                <text x={columnX} y={OUTCOME_Y + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
                  Bucket {scenario.bucket.toUpperCase()}
                </text>
                <text x={columnX} y={OUTCOME_Y + 39} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                  {scenario.rewriteTarget}
                </text>
                <text x={columnX} y={OUTCOME_Y + 54} textAnchor="middle" fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">
                  {scenario.setsCookie ? "sets a new Set-Cookie header" : "no Set-Cookie needed"}
                </text>

                <text x={columnX} y={NOTE_Y} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
                  {index === 0 ? "assigned once" : "same cookie, same bucket"}
                </text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

AbBucketingDiagram.displayName = "AbBucketingDiagram";
