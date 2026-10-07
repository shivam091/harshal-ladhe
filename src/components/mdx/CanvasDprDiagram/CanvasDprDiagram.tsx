import type { JSX } from "react";
import {
  MONO_FONT,
  AREA_SIZE,
  AREA_Y,
  LEFT_AREA_X,
  RIGHT_AREA_X,
  BLURRY_CELLS,
  SHARP_CELLS,
  BLURRY_HIGHLIGHT,
  SHARP_HIGHLIGHT,
  DEVICE_GRID_LINES,
  BLURRY_CANVAS_GRID_LINES
} from "@/components/mdx/CanvasDprDiagram/CanvasDprDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasDprDiagram/CanvasDprDiagram.styles";

// The physical screen grid is what both backing stores are judged against.
function DeviceGrid(): JSX.Element {
  return (
    <g stroke="var(--color-border-default)" strokeWidth={0.75}>
      {DEVICE_GRID_LINES.map((offset) => <line key={`v-${offset}`} x1={offset} y1={0} x2={offset} y2={AREA_SIZE} />)}
      {DEVICE_GRID_LINES.map((offset) => <line key={`h-${offset}`} x1={0} y1={offset} x2={AREA_SIZE} y2={offset} />)}
    </g>
  );
}

// Makes the invisible mismatch between CSS size and backing-store size on high-DPI screens concrete.
export default function CanvasDprDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 600 384" role="img" aria-labelledby="canvas-dpr-diagram-title canvas-dpr-diagram-desc">
          <title id="canvas-dpr-diagram-title">Canvas devicePixelRatio diagram</title>
          <desc id="canvas-dpr-diagram-desc">
            Two zoomed-in patches of the same high-DPI screen, each a 12 by 12 grid of physical device pixels showing part
            of a circle drawn on a canvas. On the left, labelled &quot;Blurry: canvas.width = 100&quot;, the canvas has
            only half as many pixels as the screen, so each canvas pixel is stretched across a 2 by 2 block of device
            pixels; one such block is outlined, and the circle&apos;s edge is chunky and soft from being upscaled. On the
            right, labelled &quot;Sharp: canvas.width = 100 × dpr&quot;, every device pixel gets its own canvas pixel, so
            one outlined pixel maps to exactly one device pixel and the circle&apos;s edge is fine and crisp. A shared
            caption notes that devicePixelRatio is 2 and that the canvas&apos;s CSS size stays 100 by 100 pixels in both.
          </desc>

          <defs>
            <filter id="canvas-dpr-upscale-blur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation={4} />
            </filter>
            <clipPath id="canvas-dpr-area-clip">
              <rect width={AREA_SIZE} height={AREA_SIZE} />
            </clipPath>
          </defs>
          <g transform={`translate(${LEFT_AREA_X}, 0)`}>
            <text x={AREA_SIZE / 2} y={26} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--color-fg-danger)">
              Blurry
            </text>
            <text x={AREA_SIZE / 2} y={48} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">
              canvas.width = 100
            </text>
            <g transform={`translate(0, ${AREA_Y})`}>
              <rect width={AREA_SIZE} height={AREA_SIZE} fill="var(--color-bg-default)" />
              <g clipPath="url(#canvas-dpr-area-clip)">
                <g filter="url(#canvas-dpr-upscale-blur)">
                  {BLURRY_CELLS.map((cell) => (
                    <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width={cell.size} height={cell.size} fill="var(--color-fg-accent)" fillOpacity={cell.alpha} />
                  ))}
                </g>
              </g>
              <DeviceGrid />
              <g stroke="var(--color-fg-muted)" strokeWidth={1.5}>
                {BLURRY_CANVAS_GRID_LINES.map((offset) => <line key={`v-${offset}`} x1={offset} y1={0} x2={offset} y2={AREA_SIZE} />)}
                {BLURRY_CANVAS_GRID_LINES.map((offset) => <line key={`h-${offset}`} x1={0} y1={offset} x2={AREA_SIZE} y2={offset} />)}
              </g>
              <rect width={AREA_SIZE} height={AREA_SIZE} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <rect
                x={BLURRY_HIGHLIGHT.x}
                y={BLURRY_HIGHLIGHT.y}
                width={BLURRY_HIGHLIGHT.size}
                height={BLURRY_HIGHLIGHT.size}
                fill="none"
                stroke="var(--color-fg-attention)"
                strokeWidth={3}
              />
            </g>
            <text x={AREA_SIZE / 2} y={AREA_Y + AREA_SIZE + 26} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-attention)">
              1 canvas px → 2 × 2 device px
            </text>
            <text x={AREA_SIZE / 2} y={AREA_Y + AREA_SIZE + 44} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              (upscaled, so edges go soft)
            </text>
          </g>
          <g transform={`translate(${RIGHT_AREA_X}, 0)`}>
            <text x={AREA_SIZE / 2} y={26} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--color-fg-success)">
              Sharp
            </text>
            <text x={AREA_SIZE / 2} y={48} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-accent)">
              canvas.width = 100 × dpr
            </text>
            <g transform={`translate(0, ${AREA_Y})`}>
              <rect width={AREA_SIZE} height={AREA_SIZE} fill="var(--color-bg-default)" />
              {SHARP_CELLS.map((cell) => (
                <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width={cell.size} height={cell.size} fill="var(--color-fg-accent)" fillOpacity={cell.alpha} />
              ))}
              <DeviceGrid />
              <rect width={AREA_SIZE} height={AREA_SIZE} fill="none" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <rect
                x={SHARP_HIGHLIGHT.x}
                y={SHARP_HIGHLIGHT.y}
                width={SHARP_HIGHLIGHT.size}
                height={SHARP_HIGHLIGHT.size}
                fill="none"
                stroke="var(--color-fg-attention)"
                strokeWidth={3}
              />
            </g>
            <text x={AREA_SIZE / 2} y={AREA_Y + AREA_SIZE + 26} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-attention)">
              1 canvas px → 1 device px
            </text>
            <text x={AREA_SIZE / 2} y={AREA_Y + AREA_SIZE + 44} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
              (native, so edges stay crisp)
            </text>
          </g>
          <text x={300} y={AREA_Y + AREA_SIZE + 84} textAnchor="middle" fontSize={13} fontFamily={MONO_FONT} fill="var(--color-fg-default)">
            devicePixelRatio = 2
          </text>
          <text x={300} y={AREA_Y + AREA_SIZE + 104} textAnchor="middle" fontSize={13} fill="var(--color-fg-muted)">
            CSS size stays 100 × 100px in both
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasDprDiagram.displayName = "CanvasDprDiagram";
