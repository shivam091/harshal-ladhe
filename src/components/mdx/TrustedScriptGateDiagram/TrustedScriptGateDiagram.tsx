import type { JSX } from "react";
import { STEPS, COLUMN_X, COLUMN_W } from "@/components/mdx/TrustedScriptGateDiagram/TrustedScriptGateDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/TrustedScriptGateDiagram/TrustedScriptGateDiagram.styles";

const MONO = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  Static SVG flowchart of the string-compilation check a browser runs once Trusted Types is enforced.
  It exists to show the order of the decisions (brand check first, default policy second, script-src
  last) because the order is what explains why a plain string can still pass while a look-alike cannot.
*/
export default function TrustedScriptGateDiagram(): JSX.Element {
  const centreX = COLUMN_X + COLUMN_W / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 372" role="img" aria-labelledby="trusted-script-gate-title trusted-script-gate-desc">
          <title id="trusted-script-gate-title">How a browser decides whether eval or new Function may run</title>
          <desc id="trusted-script-gate-desc">
            A flowchart. A call to eval or new Function first asks whether the body and every parameter are TrustedScript
            objects. If so, the code is trusted. If not, the browser asks the default policy to approve the full code; if it returns
            the same string, the code is trusted, otherwise an EvalError is thrown. Trusted code must still be allowed by the
            script-src directive, through the trusted-types-eval or unsafe-eval keyword.
          </desc>

          <defs>
            <marker id="trusted-script-gate-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {STEPS.map((step) => (
            <g key={step.id}>
              <rect
                x={COLUMN_X}
                y={step.y}
                width={COLUMN_W}
                height={step.h}
                rx={8}
                fill={step.tone === "question" ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
                stroke={step.tone === "question" ? "var(--color-border-accent-emphasis)" : "var(--color-border-muted)"}
                strokeWidth={1.5}
              />
              {step.lines.map((line, index) => (
                <text
                  key={line}
                  x={centreX}
                  y={step.y + step.h / 2 + (index - (step.lines.length - 1) / 2) * 15 + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={step.tone === "question" ? 600 : 500}
                  fontFamily={step.id === "call" ? MONO : undefined}
                  fill="var(--color-fg-default)"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}

          {/* Main column: call → brand check → default policy → blocked. */}
          <line x1={centreX} y1={48} x2={centreX} y2={76} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <line x1={centreX} y1={124} x2={centreX} y2={158} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <line x1={centreX} y1={216} x2={centreX} y2={252} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <text x={centreX + 8} y={144} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">no</text>
          <text x={centreX + 8} y={238} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">no</text>

          {/* Blocked outcome. */}
          <rect x={COLUMN_X} y={254} width={COLUMN_W} height={38} rx={8} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <text x={centreX} y={277} textAnchor="middle" fontSize={12} fontWeight={600} fontFamily={MONO} fill="var(--color-fg-danger)">
            ✕ throws EvalError
          </text>

          {/* Trusted outcome: both "yes" branches land in the same box. */}
          <rect x={300} y={80} width={130} height={126} rx={8} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={365} y={147} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-success)">
            ✓ trusted
          </text>
          <line x1={COLUMN_X + COLUMN_W} y1={101} x2={298} y2={101} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <line x1={COLUMN_X + COLUMN_W} y1={188} x2={298} y2={188} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <text x={258} y={94} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">yes</text>
          <text x={258} y={181} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">yes</text>

          {/* Last gate: trusted code still has to be allowed by script-src. */}
          <line x1={365} y1={206} x2={365} y2={298} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#trusted-script-gate-arrow)" />
          <rect x={240} y={300} width={190} height={62} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={335} y={322} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">script-src must still allow it</text>
          <text x={335} y={340} textAnchor="middle" fontSize={11} fontFamily={MONO} fill="var(--color-fg-muted)">{"'trusted-types-eval'"}</text>
          <text x={335} y={354} textAnchor="middle" fontSize={11} fontFamily={MONO} fill="var(--color-fg-muted)">{"or 'unsafe-eval'"}</text>
        </Svg>
      </Wrapper>
    </>
  );
}

TrustedScriptGateDiagram.displayName = "TrustedScriptGateDiagram";
