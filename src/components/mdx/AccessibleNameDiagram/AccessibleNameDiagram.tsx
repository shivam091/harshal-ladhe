import type { JSX } from "react";
import { BOX_RADIUS, DECISION_COLUMN, RESULT_COLUMN, ROW_HEIGHT, START, ROWS, NO_NAME, ROLE_NOTE } from "@/components/mdx/AccessibleNameDiagram/AccessibleNameDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/AccessibleNameDiagram/AccessibleNameDiagram.styles";

// Theme tokens per result tone, so a skipped element and a named one are told apart by colour as well as wording.
const TONE_COLORS = {
  danger: { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" },
  success: { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
};

/*
  Static flowchart of how a browser computes an SVG element's accessible name. Exists to correct the most
  common misconception about SVG accessibility — that <title> is the primary name — by showing it as the
  last-resort fallback after aria-hidden, aria-labelledby, and aria-label, plus the role="img" side effect
  that silently hides every labelled child.
*/
export default function AccessibleNameDiagram(): JSX.Element {
  const decisionCenterX = DECISION_COLUMN.x + DECISION_COLUMN.width / 2;
  const resultCenterX = RESULT_COLUMN.x + RESULT_COLUMN.width / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 500" role="img" aria-labelledby="accessible-name-diagram-title accessible-name-diagram-desc">
          <title id="accessible-name-diagram-title">SVG accessible name computation flowchart</title>
          <desc id="accessible-name-diagram-desc">
            Starting from an SVG element, the browser first checks aria-hidden=&quot;true&quot;; if set, the element and its
            subtree are skipped. Otherwise aria-labelledby wins if present, then aria-label, then the first title child
            as a fallback. If none apply, the element has no accessible name. A footnote explains that role=&quot;img&quot; on
            the root makes all children presentational, so titles on inner shapes are not exposed.
          </desc>

          <defs>
            <marker id="accessible-name-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Start pill — the element being named. */}
          <rect x={START.x} y={START.y} width={START.width} height={START.height} rx={START.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={decisionCenterX} y={START.y + START.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">An SVG element</text>
          <line x1={decisionCenterX} y1={START.y + START.height} x2={decisionCenterX} y2={ROWS[0].y - 4} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#accessible-name-diagram-arrow)" />

          {/* The four ordered checks, each with its "yes" branch to a result box and its "no" arrow down to the next check. */}
          {ROWS.map((row, index) => {
            const centerY = row.y + ROW_HEIGHT / 2;
            const nextTop = index < ROWS.length - 1 ? ROWS[index + 1].y : NO_NAME.y;
            const tone = TONE_COLORS[row.tone];

            return (
              <g key={row.question}>
                <rect x={DECISION_COLUMN.x} y={row.y} width={DECISION_COLUMN.width} height={ROW_HEIGHT} rx={BOX_RADIUS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                <text x={decisionCenterX} y={centerY + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{row.question}</text>

                <line x1={DECISION_COLUMN.x + DECISION_COLUMN.width} y1={centerY} x2={RESULT_COLUMN.x - 4} y2={centerY} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#accessible-name-diagram-arrow)" />
                <text x={(DECISION_COLUMN.x + DECISION_COLUMN.width + RESULT_COLUMN.x) / 2} y={centerY - 8} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">yes</text>

                <rect x={RESULT_COLUMN.x} y={row.y} width={RESULT_COLUMN.width} height={ROW_HEIGHT} rx={BOX_RADIUS} fill={tone.fill} stroke={tone.stroke} strokeWidth={1.5} />
                <text x={resultCenterX} y={row.y + 20} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{row.result}</text>
                <text x={resultCenterX} y={row.y + 37} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{row.detail}</text>

                <line x1={decisionCenterX} y1={row.y + ROW_HEIGHT} x2={decisionCenterX} y2={nextTop - 4} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#accessible-name-diagram-arrow)" />
                <text x={decisionCenterX + 8} y={(row.y + ROW_HEIGHT + nextTop) / 2 + 4} fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">no</text>
              </g>
            );
          })}

          {/* Terminal "no name" box — reached only when every check above said no. */}
          <rect x={NO_NAME.x} y={NO_NAME.y} width={NO_NAME.width} height={NO_NAME.height} rx={BOX_RADIUS} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <text x={decisionCenterX} y={NO_NAME.y + 20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">No accessible name</text>
          <text x={decisionCenterX} y={NO_NAME.y + 37} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">a meaningful graphic is announced as nothing</text>

          {/* role="img" side-effect footnote — it changes what the children expose, not how the root is named. */}
          <rect x={ROLE_NOTE.x} y={ROLE_NOTE.y} width={ROLE_NOTE.width} height={ROLE_NOTE.height} rx={BOX_RADIUS} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={ROLE_NOTE.x + ROLE_NOTE.width / 2} y={ROLE_NOTE.y + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Side branch: role=&quot;img&quot; on the root makes every child presentational</text>
          <text x={ROLE_NOTE.x + ROLE_NOTE.width / 2} y={ROLE_NOTE.y + 40} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">inner shapes, &lt;text&gt;, and their own &lt;title&gt;s are flattened into one image and never named individually</text>
        </Svg>
      </Wrapper>
    </>
  );
}

AccessibleNameDiagram.displayName = "AccessibleNameDiagram";
