import type { JSX } from "react";
import {
  FRAME_W,
  FRAME_H,
  T0_X,
  T1_X,
  TITLE_X,
  TITLE_Y,
  TITLE_W,
  TITLE_H,
  IMAGE_X,
  IMAGE_Y,
  IMAGE_W,
  IMAGE_H,
  PARAGRAPH_LINE_WIDTHS,
  PARAGRAPH_LINE_H,
  PARAGRAPH_LINE_GAP,
  PARAGRAPH_Y_NO_SLOT,
  PARAGRAPH_Y_WITH_SLOT,
  SKY_TOP,
  SKY_BOTTOM,
  SUN_COLOR,
  GROUND_COLOR,
  MOUNTAIN_COLOR,
  ROW_WITHOUT,
  ROW_WITH,
  ARROW_Y_WITHOUT,
  ARROW_Y_WITH,
  CANVAS_W,
  CANVAS_H
} from "@/components/mdx/AspectRatioClsDiagram/AspectRatioClsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/AspectRatioClsDiagram/AspectRatioClsDiagram.styles";

type ImageSlotState = "absent" | "placeholder" | "loaded";

interface FrameProps {
  x: number;
  y: number;
  imageState: ImageSlotState;
  paragraphY: number;
  // Only set on the "without aspect-ratio, after load" frame — a faint dashed line marking where the
  // paragraph used to sit before the image shoved it down.
  ghostParagraphY?: number;
}

// One mock card: a title bar, an image slot (absent, an empty placeholder, or a loaded photo), and a
// 3-line paragraph — the wireframe every frame in this diagram is built from.
function Frame({ x, y, imageState, paragraphY, ghostParagraphY }: FrameProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={FRAME_W} height={FRAME_H} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1} />
      <rect x={TITLE_X} y={TITLE_Y} width={TITLE_W} height={TITLE_H} rx={2} fill="var(--color-border-muted)" />

      {imageState === "placeholder" && (
        <rect
          x={IMAGE_X}
          y={IMAGE_Y}
          width={IMAGE_W}
          height={IMAGE_H}
          fill="var(--color-bg-muted)"
          stroke="var(--color-border-muted)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
      )}

      {imageState === "loaded" && (
        <g>
          <rect x={IMAGE_X} y={IMAGE_Y} width={IMAGE_W} height={IMAGE_H} fill="url(#aspect-ratio-cls-sky)" />
          <circle cx={IMAGE_X + IMAGE_W * 0.75} cy={IMAGE_Y + IMAGE_H * 0.28} r={IMAGE_H * 0.16} fill={SUN_COLOR} />
          <rect x={IMAGE_X} y={IMAGE_Y + IMAGE_H * 0.65} width={IMAGE_W} height={IMAGE_H * 0.35} fill={GROUND_COLOR} />
          <polygon
            points={`${IMAGE_X},${IMAGE_Y + IMAGE_H * 0.65} ${IMAGE_X + IMAGE_W * 0.32},${IMAGE_Y + IMAGE_H * 0.28} ${IMAGE_X + IMAGE_W * 0.58},${IMAGE_Y + IMAGE_H * 0.65}`}
            fill={MOUNTAIN_COLOR}
          />
          <rect x={IMAGE_X} y={IMAGE_Y} width={IMAGE_W} height={IMAGE_H} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />
        </g>
      )}

      {ghostParagraphY !== undefined && (
        <line
          x1={TITLE_X}
          y1={ghostParagraphY}
          x2={TITLE_X + PARAGRAPH_LINE_WIDTHS[0]}
          y2={ghostParagraphY}
          stroke="var(--color-fg-danger)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.6}
        />
      )}

      {PARAGRAPH_LINE_WIDTHS.map((lineWidth, index) => (
        <rect
          key={index}
          x={TITLE_X}
          y={paragraphY + index * PARAGRAPH_LINE_GAP}
          width={lineWidth}
          height={PARAGRAPH_LINE_H}
          rx={2}
          fill="var(--color-border-muted)"
        />
      ))}
    </g>
  );
}

// A short horizontal arrow between a row's t0 and t1 frames, labeled with what happens in between.
function LoadArrow({ y }: { y: number }) {
  const x1 = T0_X + FRAME_W + 8;
  const x2 = T1_X - 8;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#aspect-ratio-cls-arrow)" />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
        image loads
      </text>
    </g>
  );
}

/*
  Static SVG diagram contrasting a page with no reserved `aspect-ratio` against one that has one, at two
  points in time: t0 (the HTML has parsed, but the image hasn't downloaded yet) and t1 (the image finishes
  loading). Without a reserved ratio, the image slot doesn't exist until the photo arrives, so the paragraph
  below it — already laid out at t0 — gets shoved down the moment the photo appears (a layout shift, the
  thing Cumulative Layout Shift measures). With `aspect-ratio: 16 / 9` set up front, the box's proportions
  are reserved from the very first frame — an empty placeholder sits where the photo will go — so the photo
  simply fills that reserved space at t1 with nothing around it needing to move at all.
*/
export default function AspectRatioClsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="aspect-ratio-cls-title aspect-ratio-cls-desc">
          <title id="aspect-ratio-cls-title">aspect-ratio and layout shift, before and after</title>
          <desc id="aspect-ratio-cls-desc">
            Two rows, each showing the same card at two points in time. Without a reserved aspect-ratio, the
            card has no image slot until the photo loads, so the paragraph below it starts higher up and then
            jumps down once the photo appears — a visible layout shift. With aspect-ratio: 16 / 9 set on the
            image, its box is reserved from the first frame as an empty placeholder, so the paragraph never
            moves — the photo simply fills the space already waiting for it.
          </desc>

          <defs>
            <linearGradient id="aspect-ratio-cls-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SKY_TOP} />
              <stop offset="100%" stopColor={SKY_BOTTOM} />
            </linearGradient>
            <marker id="aspect-ratio-cls-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Row 1 — no reserved aspect-ratio: the image slot only exists once the photo has loaded. */}
          <text x={T0_X} y={ROW_WITHOUT.labelY} fontSize={13} fontWeight={600} fill="var(--color-fg-danger)">
            ✕ No aspect-ratio reserved
          </text>

          <Frame x={T0_X} y={ROW_WITHOUT.frameY} imageState="absent" paragraphY={PARAGRAPH_Y_NO_SLOT} />
          <Frame
            x={T1_X}
            y={ROW_WITHOUT.frameY}
            imageState="loaded"
            paragraphY={PARAGRAPH_Y_WITH_SLOT}
            ghostParagraphY={PARAGRAPH_Y_NO_SLOT}
          />
          <LoadArrow y={ARROW_Y_WITHOUT} />

          <text x={T0_X + FRAME_W / 2} y={ROW_WITHOUT.timeLabelY} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            t = 0ms — HTML parsed
          </text>
          <text x={T1_X + FRAME_W / 2} y={ROW_WITHOUT.timeLabelY} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            t ≈ 400ms — image loads
          </text>
          <text x={CANVAS_W / 2} y={ROW_WITHOUT.captionY} textAnchor="middle" fontSize={11} fill="var(--color-fg-danger)">
            Content jumps down once the photo arrives — a layout shift.
          </text>

          {/* Row 2 — aspect-ratio: 16 / 9 reserved up front: the slot exists (empty) before the photo loads. */}
          <text x={T0_X} y={ROW_WITH.labelY} fontSize={13} fontWeight={600} fill="var(--color-fg-success)">
            ✓ aspect-ratio: 16 / 9 reserved
          </text>

          <Frame x={T0_X} y={ROW_WITH.frameY} imageState="placeholder" paragraphY={PARAGRAPH_Y_WITH_SLOT} />
          <Frame x={T1_X} y={ROW_WITH.frameY} imageState="loaded" paragraphY={PARAGRAPH_Y_WITH_SLOT} />
          <LoadArrow y={ARROW_Y_WITH} />

          <text x={T0_X + FRAME_W / 2} y={ROW_WITH.timeLabelY} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            t = 0ms — HTML parsed
          </text>
          <text x={T1_X + FRAME_W / 2} y={ROW_WITH.timeLabelY} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            t ≈ 400ms — image loads
          </text>
          <text x={CANVAS_W / 2} y={ROW_WITH.captionY} textAnchor="middle" fontSize={11} fill="var(--color-fg-success)">
            Nothing moves — the space was already reserved.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

AspectRatioClsDiagram.displayName = "AspectRatioClsDiagram";
