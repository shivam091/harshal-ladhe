import type { JSX } from "react";
import {
  PANEL_W,
  PANEL_H,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_Y,
  CANVAS_W,
  CANVAS_H,
  CARD_X,
  CARD_Y,
  CARD_W,
  CARD_H,
  CARD_RADIUS,
  BACKDROP_SHAPES,
  CARD_TINT,
  CARD_BORDER,
  CARD_TEXT_COLOR,
  BLUR_STD_DEVIATION
} from "@/components/mdx/FilterVsBackdropFilterDiagram/FilterVsBackdropFilterDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FilterVsBackdropFilterDiagram/FilterVsBackdropFilterDiagram.styles";

// The 3 colorful shapes scattered behind the card, shared verbatim by both panels so the only
// difference between them is which parts of the scene the blur filter actually touches.
function BackdropShapes() {
  const { circle, square, triangle } = BACKDROP_SHAPES;
  return (
    <g>
      <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={circle.color} />
      <rect x={square.x} y={square.y} width={square.size} height={square.size} rx={6} fill={square.color} />
      <polygon points={triangle.points} fill={triangle.color} />
    </g>
  );
}

// The card's own content — a big glyph standing in for real text, since a legible difference in
// sharpness needs to be visible even at this diagram's small scale.
function CardGlyph() {
  return (
    <text
      x={CARD_X + CARD_W / 2}
      y={CARD_Y + CARD_H / 2 + 13}
      textAnchor="middle"
      fontSize={38}
      fontWeight={800}
      fill={CARD_TEXT_COLOR}
    >
      Aa
    </text>
  );
}

function CardChrome() {
  return (
    <rect
      x={CARD_X}
      y={CARD_Y}
      width={CARD_W}
      height={CARD_H}
      rx={CARD_RADIUS}
      fill={CARD_TINT}
      stroke={CARD_BORDER}
      strokeWidth={1.5}
    />
  );
}

/*
  Static SVG diagram of the single most important distinction in this post: `filter` blurs the
  element it's set on AND everything rendered inside it, while `backdrop-filter` blurs only what's
  already painted BEHIND the element, leaving the element's own content untouched. Left panel wraps
  the card (its tint + its "Aa" glyph) in one <feGaussianBlur>, so both blur together exactly like
  plain `filter` does. Right panel instead blurs a clipped duplicate of the backdrop shapes — sized
  to the card's own bounds, standing in for "what's visible through the card" — then draws the
  card's tint and glyph on top completely unfiltered, exactly like `backdrop-filter` does.
*/
export default function FilterVsBackdropFilterDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="filter-vs-backdrop-title filter-vs-backdrop-desc">
          <title id="filter-vs-backdrop-title">filter versus backdrop-filter, compared side by side</title>
          <desc id="filter-vs-backdrop-desc">
            Two identical scenes: a translucent card sitting over three colorful shapes. In the left
            panel, filter: blur() is applied to the card, so both the card and its own &quot;Aa&quot; text blur
            together, while the shapes behind it stay perfectly sharp. In the right panel,
            backdrop-filter: blur() is applied instead &mdash; the card&apos;s own &quot;Aa&quot; text stays completely
            crisp, and only the portion of the colorful shapes visible through the card blurs.
          </desc>

          <defs>
            <filter id="fvb-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={BLUR_STD_DEVIATION} />
            </filter>
            <clipPath id="fvb-card-clip">
              <rect x={CARD_X} y={CARD_Y} width={CARD_W} height={CARD_H} rx={CARD_RADIUS} />
            </clipPath>
          </defs>

          {/* Left panel — plain `filter`: the card and its own text blur together as one unit. */}
          <g transform={`translate(${PANEL_LEFT_X}, ${PANEL_Y})`}>
            <text x={PANEL_W / 2} y={-20} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">
              filter: blur(3px)
            </text>

            <rect width={PANEL_W} height={PANEL_H} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <BackdropShapes />

            {/* The whole card — tint, border, and glyph — is one filtered group, so blur touches all of it. */}
            <g filter="url(#fvb-blur)">
              <CardChrome />
              <CardGlyph />
            </g>

            <text x={PANEL_W / 2} y={PANEL_H + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-danger)">
              Card AND its &quot;Aa&quot; text blur together
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 40} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              (the shapes behind it stay sharp)
            </text>
          </g>

          {/* Right panel — `backdrop-filter`: only what's behind the card blurs; its own text stays crisp. */}
          <g transform={`translate(${PANEL_RIGHT_X}, ${PANEL_Y})`}>
            <text x={PANEL_W / 2} y={-20} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">
              backdrop-filter: blur(3px)
            </text>

            <rect width={PANEL_W} height={PANEL_H} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <BackdropShapes />

            {/* A blurred duplicate of the same shapes, clipped to the card's own bounds — standing in
                for "the backdrop, as seen through this element," which is all backdrop-filter touches. */}
            <g clipPath="url(#fvb-card-clip)">
              <g filter="url(#fvb-blur)">
                <BackdropShapes />
              </g>
            </g>

            {/* Card tint/border and glyph are drawn last, completely unfiltered — backdrop-filter never
                touches the element's own rendered content, only what's already behind it. */}
            <CardChrome />
            <CardGlyph />

            <text x={PANEL_W / 2} y={PANEL_H + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-success)">
              Only what&apos;s behind the card blurs
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 40} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              (&quot;Aa&quot; stays perfectly crisp)
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

FilterVsBackdropFilterDiagram.displayName = "FilterVsBackdropFilterDiagram";
