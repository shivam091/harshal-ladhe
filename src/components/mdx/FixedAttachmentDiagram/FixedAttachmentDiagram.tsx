import type { JSX } from "react";
import {
  GRADIENT_STOPS,
  VIEWPORT,
  PANELS,
  HEADINGS,
  BODY_LINES,
  THUMB_HEIGHT,
  thumbY,
  HEADING_FONT_SIZE
} from "@/components/mdx/FixedAttachmentDiagram/FixedAttachmentDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FixedAttachmentDiagram/FixedAttachmentDiagram.styles";

/*
  Static SVG diagram of background-attachment: fixed on gradient text — one viewport at two scroll positions, with
  a single gradient pinned to the viewport's own coordinates. Exists because "the text is a moving window onto a
  still gradient" is easy to misread as the gradient scrolling along with the text.
*/
export default function FixedAttachmentDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 306" role="img" aria-labelledby="fixed-attachment-diagram-title fixed-attachment-diagram-desc">
          <title id="fixed-attachment-diagram-title">background-attachment: fixed turns text into a window</title>
          <desc id="fixed-attachment-diagram-desc">
            The same browser viewport shown twice, before and after scrolling down 80 pixels. A faint cyan-to-blue-to-pink
            gradient fills the viewport and stays in the same place in both. The page's headings scroll over it, so
            the heading Chapter Two, low in the first viewport, shows mostly blue, while in the second viewport, nearer
            the top, it shows pinker colors from the same gradient.
          </desc>

          <defs>
            {/*
              userSpaceOnUse in each panel's own translated coordinates, so both viewports resolve to the identical
              gradient — the diagram's version of "pinned to the viewport".
            */}
            <linearGradient id="fixed-attachment-gradient" gradientUnits="userSpaceOnUse" x1={0} y1={VIEWPORT.height} x2={VIEWPORT.width} y2={0}>
              {GRADIENT_STOPS.map((color, stopIndex) => (
                <stop key={color} offset={`${(stopIndex / (GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
            <clipPath id="fixed-attachment-viewport-clip">
              <rect x={0} y={0} width={VIEWPORT.width} height={VIEWPORT.height} rx={6} />
            </clipPath>
            <marker id="fixed-attachment-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {PANELS.map((panel) => (
            <g key={panel.title} transform={`translate(${panel.x} ${VIEWPORT.y})`}>
              <text x={VIEWPORT.width / 2} y={-12} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
                {panel.title}
              </text>

              <g clipPath="url(#fixed-attachment-viewport-clip)">
                {/* The whole pinned gradient, faded, so its fixed position is visible behind the page. */}
                <rect x={0} y={0} width={VIEWPORT.width} height={VIEWPORT.height} fill="url(#fixed-attachment-gradient)" opacity={0.15} />

                {/*
                  The page, shifted up by the scroll offset — only it moves between panels. Offset per element rather
                  than with a transformed <g>, which would drag the gradient's user space (and so the gradient) along.
                */}
                {HEADINGS.map((heading) => {
                  const y = heading.y - panel.scroll;
                  return (
                    <g key={heading.text}>
                      <text
                        x={VIEWPORT.width / 2 - 6} y={y} textAnchor="middle"
                        fontSize={HEADING_FONT_SIZE} fontWeight={800} fill="url(#fixed-attachment-gradient)"
                      >
                        {heading.text}
                      </text>
                      {BODY_LINES.map((line) => (
                        <rect
                          key={line.dy} x={(VIEWPORT.width - 12 - line.width) / 2} y={y + line.dy - 4}
                          width={line.width} height={5} rx={2.5} fill="var(--color-border-muted)"
                        />
                      ))}
                    </g>
                  );
                })}

                {/* Scrollbar thumb, to make the scroll offset readable at a glance. */}
                <rect x={VIEWPORT.width - 7} y={thumbY(panel.scroll) + 3} width={4} height={THUMB_HEIGHT - 6} rx={2} fill="var(--color-fg-muted)" opacity={0.6} />
              </g>

              <rect x={0} y={0} width={VIEWPORT.width} height={VIEWPORT.height} rx={6} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />

              <text x={VIEWPORT.width / 2} y={VIEWPORT.height + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
                {panel.caption}
              </text>
            </g>
          ))}

          {/* Scroll between the two states. */}
          <line x1={252} y1={VIEWPORT.y + 95} x2={288} y2={VIEWPORT.y + 95} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#fixed-attachment-arrow)" />
          <text x={270} y={VIEWPORT.y + 85} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">scroll</text>

          <text x={270} y={284} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
            The gradient never moves — it's pinned to the viewport.
          </text>
          <text x={270} y={299} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            The text scrolls across it, so the same heading shows a different slice.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

FixedAttachmentDiagram.displayName = "FixedAttachmentDiagram";
