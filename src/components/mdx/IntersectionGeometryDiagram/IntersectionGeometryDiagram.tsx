import type { JSX } from "react";
import {
  ROOT_X,
  ROOT_Y,
  ROOT_W,
  ROOT_H,
  ROOT_BOTTOM,
  EFFECTIVE_ROOT_BOTTOM,
  TARGET_X,
  TARGET_W,
  TARGET_Y,
  TARGET_H
} from "@/components/mdx/IntersectionGeometryDiagram/IntersectionGeometryDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/IntersectionGeometryDiagram/IntersectionGeometryDiagram.styles";

// x coordinate of the rootMargin bracket drawn just right of the root box.
const BRACKET_X = ROOT_X + ROOT_W + 14;

/*
  Static SVG diagram of IntersectionObserver's root/rootMargin/threshold geometry, using the
  post's own Scrollspy Navigation example (rootMargin: "0px 0px -50% 0px") as the concrete case:
  a negative bottom margin shrinks the effective root upward, and the target is only "intersecting"
  once it crosses into that shrunk region — not the moment it enters the raw viewport.
*/
export default function IntersectionGeometryDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 360 300" role="img" aria-labelledby="intersection-geometry-diagram-title intersection-geometry-diagram-desc">
          <title id="intersection-geometry-diagram-title">IntersectionObserver root, rootMargin, and threshold diagram</title>
          <desc id="intersection-geometry-diagram-desc">
            A root box representing the viewport, with a negative rootMargin shrinking its effective
            bottom edge upward into a strike-zone boundary. A target element straddles that boundary:
            the half inside the effective root is shaded as intersecting, the half in the excluded
            margin area below it is shaded as not intersecting.
          </desc>

          {/* Excluded margin zone — the strip of the raw root cut off by the negative rootMargin. */}
          <rect
            x={ROOT_X} y={EFFECTIVE_ROOT_BOTTOM} width={ROOT_W} height={ROOT_BOTTOM - EFFECTIVE_ROOT_BOTTOM}
            fill="var(--color-bg-muted)"
          />

          {/* root — the raw viewport or scroll container being watched, before rootMargin is applied. */}
          <rect
            x={ROOT_X} y={ROOT_Y} width={ROOT_W} height={ROOT_H} rx={6}
            fill="none" stroke="var(--color-border-muted)" strokeWidth={2} strokeDasharray="5 4"
          />
          <text x={ROOT_X + 10} y={ROOT_Y + 18} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">
            root
          </text>

          {/* effective root — root shrunk by rootMargin; this boundary is what "intersecting" is measured against. */}
          <rect
            x={ROOT_X} y={ROOT_Y} width={ROOT_W} height={EFFECTIVE_ROOT_BOTTOM - ROOT_Y} rx={6}
            fill="none" stroke="var(--color-border-attention-emphasis)" strokeWidth={2} strokeDasharray="5 4"
          />

          {/* Strike-zone boundary line — where the callback actually fires as the target crosses it. */}
          <line
            x1={ROOT_X} y1={EFFECTIVE_ROOT_BOTTOM} x2={ROOT_X + ROOT_W} y2={EFFECTIVE_ROOT_BOTTOM}
            stroke="var(--color-fg-attention)" strokeWidth={1.5}
          />

          {/* rootMargin bracket — spans the excluded strip, labeling it with the post's own example value. */}
          <line x1={BRACKET_X} y1={EFFECTIVE_ROOT_BOTTOM} x2={BRACKET_X} y2={ROOT_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.25} />
          <line x1={BRACKET_X - 4} y1={EFFECTIVE_ROOT_BOTTOM} x2={BRACKET_X + 4} y2={EFFECTIVE_ROOT_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.25} />
          <line x1={BRACKET_X - 4} y1={ROOT_BOTTOM} x2={BRACKET_X + 4} y2={ROOT_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.25} />
          <text x={BRACKET_X + 8} y={(EFFECTIVE_ROOT_BOTTOM + ROOT_BOTTOM) / 2 - 4} fontSize={9.5} fill="var(--color-fg-muted)">rootMargin:</text>
          <text x={BRACKET_X + 8} y={(EFFECTIVE_ROOT_BOTTOM + ROOT_BOTTOM) / 2 + 9} fontSize={9.5} fill="var(--color-fg-muted)">-50% (bottom)</text>

          {/* target — straddles the boundary: the portion inside the effective root is what's actually "visible" to the observer. */}
          <rect x={TARGET_X} y={TARGET_Y} width={TARGET_W} height={EFFECTIVE_ROOT_BOTTOM - TARGET_Y} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={2} />
          <rect x={TARGET_X} y={EFFECTIVE_ROOT_BOTTOM} width={TARGET_W} height={TARGET_Y + TARGET_H - EFFECTIVE_ROOT_BOTTOM} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" strokeWidth={2} />
          <text x={TARGET_X + TARGET_W / 2} y={TARGET_Y + TARGET_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-fg-default)">
            target
          </text>

          {/* Legend — restates root vs. effective root vs. the target's two states in one glance. */}
          <g fontSize={10.5}>
            <line x1={ROOT_X} y1={252} x2={ROOT_X + 16} y2={252} stroke="var(--color-border-muted)" strokeWidth={2} strokeDasharray="4 3" />
            <text x={ROOT_X + 22} y={256} fill="var(--color-fg-default)">root (viewport)</text>

            <line x1={ROOT_X} y1={270} x2={ROOT_X + 16} y2={270} stroke="var(--color-border-attention-emphasis)" strokeWidth={2} strokeDasharray="4 3" />
            <text x={ROOT_X + 22} y={274} fill="var(--color-fg-default)">effective root (after rootMargin)</text>

            <rect x={ROOT_X} y={284} width={14} height={12} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={ROOT_X + 20} y={294} fill="var(--color-fg-default)">target — intersecting</text>

            <rect x={210} y={284} width={14} height={12} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" />
            <text x={230} y={294} fill="var(--color-fg-default)">not intersecting</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

IntersectionGeometryDiagram.displayName = "IntersectionGeometryDiagram";
