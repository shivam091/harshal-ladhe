import type { JSX } from "react";
import {
  CANVAS_W,
  CANVAS_H,
  SOURCE_BOX_X,
  SOURCE_BOX_Y,
  SOURCE_BOX_W,
  SOURCE_BOX_H,
  ENDPOINT_BOX_X,
  ENDPOINT_BOX_Y,
  ENDPOINT_BOX_W,
  ENDPOINT_BOX_H,
  COLUMN_CENTERS,
  CONDITION_BOX_Y,
  CONDITION_BOX_W,
  CONDITION_BOX_H,
  RESULT_BOX_Y,
  RESULT_BOX_W,
  RESULT_BOX_H,
  IMAGE_FORMAT_OUTCOMES
} from "@/components/mdx/ImageFormatNegotiationDiagram/ImageFormatNegotiationDiagram.constants";
import { getImageFormatColor } from "@/components/mdx/ImageFormatNegotiationDiagram/ImageFormatNegotiationDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/ImageFormatNegotiationDiagram/ImageFormatNegotiationDiagram.styles";

/*
  Static SVG diagram of format negotiation: one stored source file, one optimization endpoint, and
  exactly one request's Accept header deciding which of three formats comes back. The point of drawing
  it as a single trunk fanning into three columns — rather than three separate images — is that there
  is still only one file on disk; nothing here is a separate manual export per format. The same markup,
  the same stored file, and a different visitor's browser is the entire mechanism.
*/
export default function ImageFormatNegotiationDiagram(): JSX.Element {
  const sourceCenterX = SOURCE_BOX_X + SOURCE_BOX_W / 2;
  const endpointCenterX = ENDPOINT_BOX_X + ENDPOINT_BOX_W / 2;
  const endpointBottomY = ENDPOINT_BOX_Y + ENDPOINT_BOX_H;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="image-format-negotiation-diagram-title image-format-negotiation-diagram-desc">
          <title id="image-format-negotiation-diagram-title">Image format negotiation diagram</title>
          <desc id="image-format-negotiation-diagram-desc">
            One stored source file flows into a single optimization endpoint, which reads each
            request&apos;s Accept header. It fans into exactly one of three outcomes per request: AVIF is
            served when the Accept header lists AVIF support; WebP is served when AVIF is absent but WebP
            is listed; the original format, such as JPEG or PNG, is served when neither is accepted. Only
            one file exists on disk in every case.
          </desc>

          <defs>
            {IMAGE_FORMAT_OUTCOMES.map((outcome) => {
              const color = getImageFormatColor(outcome.kind);
              return (
                <marker
                  key={outcome.kind}
                  id={`image-format-arrow-${outcome.kind}`}
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
            <marker id="image-format-arrow-trunk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-muted)" />
            </marker>
          </defs>

          {/* Source file */}
          <rect x={SOURCE_BOX_X} y={SOURCE_BOX_Y} width={SOURCE_BOX_W} height={SOURCE_BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={sourceCenterX} y={SOURCE_BOX_Y + SOURCE_BOX_H / 2 + 4} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--color-fg-default)">
            source.jpg (one file, stored once)
          </text>

          <line
            x1={sourceCenterX}
            y1={SOURCE_BOX_Y + SOURCE_BOX_H}
            x2={endpointCenterX}
            y2={ENDPOINT_BOX_Y}
            stroke="var(--color-border-muted)"
            strokeWidth={2}
            markerEnd="url(#image-format-arrow-trunk)"
          />

          {/* Optimization endpoint — the single place every request's Accept header is inspected */}
          <rect x={ENDPOINT_BOX_X} y={ENDPOINT_BOX_Y} width={ENDPOINT_BOX_W} height={ENDPOINT_BOX_H} rx={8} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={endpointCenterX} y={ENDPOINT_BOX_Y + ENDPOINT_BOX_H / 2 - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">
            /_next/image optimization endpoint
          </text>
          <text x={endpointCenterX} y={ENDPOINT_BOX_Y + ENDPOINT_BOX_H / 2 + 15} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">
            reads the request&apos;s Accept header
          </text>

          {IMAGE_FORMAT_OUTCOMES.map((outcome, index) => {
            const columnX = COLUMN_CENTERS[index];
            const color = getImageFormatColor(outcome.kind);
            const conditionTop = CONDITION_BOX_Y;
            const conditionBottom = CONDITION_BOX_Y + CONDITION_BOX_H;

            return (
              <g key={outcome.kind}>
                <line
                  x1={endpointCenterX}
                  y1={endpointBottomY}
                  x2={columnX}
                  y2={conditionTop}
                  stroke={color.stroke}
                  strokeWidth={1.75}
                  markerEnd={`url(#image-format-arrow-${outcome.kind})`}
                />

                <rect x={columnX - CONDITION_BOX_W / 2} y={conditionTop} width={CONDITION_BOX_W} height={CONDITION_BOX_H} rx={7} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={columnX} y={conditionTop + CONDITION_BOX_H / 2 - 3} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">
                  {outcome.label}
                </text>
                <text x={columnX} y={conditionTop + CONDITION_BOX_H / 2 + 13} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--color-fg-muted)">
                  {outcome.condition}
                </text>

                <line x1={columnX} y1={conditionBottom} x2={columnX} y2={RESULT_BOX_Y} stroke={color.stroke} strokeWidth={1.75} markerEnd={`url(#image-format-arrow-${outcome.kind})`} />

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

ImageFormatNegotiationDiagram.displayName = "ImageFormatNegotiationDiagram";
