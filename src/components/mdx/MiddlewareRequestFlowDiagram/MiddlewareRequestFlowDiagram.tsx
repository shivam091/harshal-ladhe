import type { JSX } from "react";
import {
  CANVAS_W,
  CANVAS_H,
  REQUEST_BOX_X,
  REQUEST_BOX_Y,
  REQUEST_BOX_W,
  REQUEST_BOX_H,
  MIDDLEWARE_BOX_X,
  MIDDLEWARE_BOX_Y,
  MIDDLEWARE_BOX_W,
  MIDDLEWARE_BOX_H,
  BRANCH_START_Y,
  COLUMN_CENTERS,
  METHOD_BOX_Y,
  METHOD_BOX_W,
  METHOD_BOX_H,
  RESULT_BOX_Y,
  RESULT_BOX_W,
  RESULT_BOX_H,
  MIDDLEWARE_OUTCOMES
} from "@/components/mdx/MiddlewareRequestFlowDiagram/MiddlewareRequestFlowDiagram.constants";
import { getMiddlewareOutcomeColor } from "@/components/mdx/MiddlewareRequestFlowDiagram/MiddlewareRequestFlowDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/MiddlewareRequestFlowDiagram/MiddlewareRequestFlowDiagram.styles";

/*
  Static SVG diagram of where middleware sits in the request lifecycle: every request funnels through
  one middleware.ts before routing or rendering ever runs, and that single function's return value
  fans out into exactly three outcomes — next() (carry on), redirect() (a real round trip), and
  rewrite() (serve something else, same URL). The point of drawing it as one trunk splitting into
  three branches, rather than three separate diagrams, is that only one of these three things can
  happen per request — they're mutually exclusive resolutions of the same function call, not features
  you mix and match.
*/
export default function MiddlewareRequestFlowDiagram(): JSX.Element {
  const requestCenterX = REQUEST_BOX_X + REQUEST_BOX_W / 2;
  const middlewareCenterX = MIDDLEWARE_BOX_X + MIDDLEWARE_BOX_W / 2;
  const middlewareBottomY = BRANCH_START_Y;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="middleware-request-flow-diagram-title middleware-request-flow-diagram-desc">
          <title id="middleware-request-flow-diagram-title">Middleware request flow diagram</title>
          <desc id="middleware-request-flow-diagram-desc">
            An incoming request flows into a single middleware.ts, which runs before routing or
            rendering. From there it fans into exactly one of three outcomes: NextResponse.next()
            continues to routing and rendering as normal; NextResponse.redirect() issues a real 3xx
            response that changes the browser&apos;s address bar and starts a new request;
            NextResponse.rewrite() serves different content internally while the address bar stays the
            same.
          </desc>

          <defs>
            {MIDDLEWARE_OUTCOMES.map((outcome) => {
              const color = getMiddlewareOutcomeColor(outcome.kind);
              return (
                <marker
                  key={outcome.kind}
                  id={`middleware-arrow-${outcome.kind}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill={color.stroke} />
                </marker>
              );
            })}
            <marker id="middleware-arrow-trunk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-muted)" />
            </marker>
          </defs>

          {/* Incoming request */}
          <rect x={REQUEST_BOX_X} y={REQUEST_BOX_Y} width={REQUEST_BOX_W} height={REQUEST_BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={requestCenterX} y={REQUEST_BOX_Y + REQUEST_BOX_H / 2 + 4} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--color-fg-default)">
            Incoming request
          </text>

          <line
            x1={requestCenterX}
            y1={REQUEST_BOX_Y + REQUEST_BOX_H}
            x2={middlewareCenterX}
            y2={MIDDLEWARE_BOX_Y}
            stroke="var(--color-border-muted)"
            strokeWidth={2}
            markerEnd="url(#middleware-arrow-trunk)"
          />

          {/* Middleware — the single function every matched request passes through */}
          <rect x={MIDDLEWARE_BOX_X} y={MIDDLEWARE_BOX_Y} width={MIDDLEWARE_BOX_W} height={MIDDLEWARE_BOX_H} rx={8} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={middlewareCenterX} y={MIDDLEWARE_BOX_Y + MIDDLEWARE_BOX_H / 2 - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">
            middleware.ts
          </text>
          <text x={middlewareCenterX} y={MIDDLEWARE_BOX_Y + MIDDLEWARE_BOX_H / 2 + 15} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">
            runs on the Edge Runtime, before routing/rendering
          </text>

          {MIDDLEWARE_OUTCOMES.map((outcome, index) => {
            const columnX = COLUMN_CENTERS[index];
            const color = getMiddlewareOutcomeColor(outcome.kind);
            const methodTop = METHOD_BOX_Y;
            const methodBottom = METHOD_BOX_Y + METHOD_BOX_H;

            return (
              <g key={outcome.kind}>
                <line
                  x1={middlewareCenterX}
                  y1={middlewareBottomY}
                  x2={columnX}
                  y2={methodTop}
                  stroke={color.stroke}
                  strokeWidth={1.75}
                  markerEnd={`url(#middleware-arrow-${outcome.kind})`}
                />

                <rect x={columnX - METHOD_BOX_W / 2} y={methodTop} width={METHOD_BOX_W} height={METHOD_BOX_H} rx={7} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={columnX} y={methodTop + METHOD_BOX_H / 2 + 4.5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">
                  {outcome.method}
                </text>

                <line x1={columnX} y1={methodBottom} x2={columnX} y2={RESULT_BOX_Y} stroke={color.stroke} strokeWidth={1.75} markerEnd={`url(#middleware-arrow-${outcome.kind})`} />

                <rect x={columnX - RESULT_BOX_W / 2} y={RESULT_BOX_Y} width={RESULT_BOX_W} height={RESULT_BOX_H} rx={7} fill="var(--color-bg-default)" stroke={color.stroke} strokeWidth={1} strokeDasharray="4 3" />
                <foreignObject x={columnX - RESULT_BOX_W / 2 + 8} y={RESULT_BOX_Y + 6} width={RESULT_BOX_W - 16} height={RESULT_BOX_H - 12}>
                  <div
                    style={{
                      fontSize: 10,
                      lineHeight: 1.35,
                      textAlign: "center",
                      color: "var(--color-fg-muted)",
                      fontFamily: "'Alan Sans', 'Source Sans 3', system-ui, sans-serif"
                    }}
                  >
                    {outcome.result}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

MiddlewareRequestFlowDiagram.displayName = "MiddlewareRequestFlowDiagram";
