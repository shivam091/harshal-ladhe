import type { JSX } from "react";
import {
  PANEL_W,
  PANEL_H,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_Y,
  CANVAS_W,
  CANVAS_H,
  CIRCLE_CX,
  CIRCLE_CY,
  CIRCLE_R,
  SHAPE_COLOR,
  BACKDROP_COLOR,
  BLUR_STD_DEVIATION,
  CONTRAST_SLOPE,
  CONTRAST_INTERCEPT
} from "@/components/mdx/FilterChainOrderDiagram/FilterChainOrderDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FilterChainOrderDiagram/FilterChainOrderDiagram.styles";

// The linear feFuncR/G/B triple that reproduces CSS's contrast(amount) exactly — shared by both
// filter chains below, since the two panels use the identical contrast amount, just in a different
// position in the chain.
function ContrastTransferFuncs() {
  return (
    <>
      <feFuncR type="linear" slope={CONTRAST_SLOPE} intercept={CONTRAST_INTERCEPT} />
      <feFuncG type="linear" slope={CONTRAST_SLOPE} intercept={CONTRAST_INTERCEPT} />
      <feFuncB type="linear" slope={CONTRAST_SLOPE} intercept={CONTRAST_INTERCEPT} />
    </>
  );
}

/*
  Static SVG diagram proving — with a real, browser-computed filter graph, not a drawn illustration
  — that chaining the same two filter functions in a different order can change the result. Both
  panels filter the exact same hard-edged, single-color circle with the exact same blur and contrast
  amounts; only the ORDER of the two <filter> primitives differs. Blurring first turns the crisp edge
  into a soft gray band that contrast() then has real midtones to push toward black/white, producing
  a narrower, harsher-edged ring. Applying contrast first is a no-op (the source circle is already
  pure black/white, with no midtones to push anywhere), so blurring it afterward produces a plain,
  wide, evenly soft edge — exactly as if contrast() had never been written at all.
*/
export default function FilterChainOrderDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="filter-chain-order-title filter-chain-order-desc">
          <title id="filter-chain-order-title">Filter function order changes the result</title>
          <desc id="filter-chain-order-desc">
            Two panels, each filtering the exact same solid, hard-edged circle with the exact same
            blur and contrast amounts, in opposite order. Blur then contrast produces a narrow,
            harsh-edged ring, because contrast has a blurred gray band to push toward black and
            white. Contrast then blur produces a plain, wide, smooth edge, because contrast has no
            effect on a pure black-and-white circle with no midtones — the blur afterward is
            unaffected by it.
          </desc>

          <defs>
            <filter id="fco-blur-then-contrast" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={BLUR_STD_DEVIATION} result="fco-blurred" />
              <feComponentTransfer in="fco-blurred">
                <ContrastTransferFuncs />
              </feComponentTransfer>
            </filter>

            <filter id="fco-contrast-then-blur" x="-60%" y="-60%" width="220%" height="220%">
              <feComponentTransfer in="SourceGraphic" result="fco-contrasted">
                <ContrastTransferFuncs />
              </feComponentTransfer>
              <feGaussianBlur in="fco-contrasted" stdDeviation={BLUR_STD_DEVIATION} />
            </filter>
          </defs>

          {/* Left panel — filter: blur(5px) contrast(3); blur runs first, so contrast has real midtones. */}
          <g transform={`translate(${PANEL_LEFT_X}, ${PANEL_Y})`}>
            <text x={PANEL_W / 2} y={-26} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--color-fg-default)">
              blur(5px) contrast(3)
            </text>
            <text x={PANEL_W / 2} y={-10} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              (blur applied first)
            </text>

            <rect width={PANEL_W} height={PANEL_H} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <rect x={16} y={16} width={PANEL_W - 32} height={PANEL_H - 32} fill={BACKDROP_COLOR} />
            <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill={SHAPE_COLOR} filter="url(#fco-blur-then-contrast)" />

            <text x={PANEL_W / 2} y={PANEL_H + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
              Narrow, harsh-edged ring
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 40} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              contrast reshapes the blurred gray band
            </text>
          </g>

          {/* Right panel — filter: contrast(3) blur(5px); contrast runs first, on a still-crisp edge. */}
          <g transform={`translate(${PANEL_RIGHT_X}, ${PANEL_Y})`}>
            <text x={PANEL_W / 2} y={-26} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--color-fg-default)">
              contrast(3) blur(5px)
            </text>
            <text x={PANEL_W / 2} y={-10} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              (contrast applied first)
            </text>

            <rect width={PANEL_W} height={PANEL_H} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <rect x={16} y={16} width={PANEL_W - 32} height={PANEL_H - 32} fill={BACKDROP_COLOR} />
            <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill={SHAPE_COLOR} filter="url(#fco-contrast-then-blur)" />

            <text x={PANEL_W / 2} y={PANEL_H + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
              Wide, smooth edge
            </text>
            <text x={PANEL_W / 2} y={PANEL_H + 40} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
              contrast had no midtones yet to change
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

FilterChainOrderDiagram.displayName = "FilterChainOrderDiagram";
