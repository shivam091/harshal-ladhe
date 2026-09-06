import type { JSX } from "react";
import {
  PIXEL_CELL,
  SVG_CHILDREN,
  CANVAS_DRAW_CALLS,
  PAINTED_PIXELS
} from "@/components/mdx/RetainedVsImmediateModeDiagram/RetainedVsImmediateModeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RetainedVsImmediateModeDiagram/RetainedVsImmediateModeDiagram.styles";

/*
  Static SVG diagram of the one distinction the whole "canvas vs SVG" decision framework is anchored on:
  SVG is retained-mode (every shape stays a real, individually addressable DOM node after it's drawn), while
  Canvas is immediate-mode (drawing commands run once and collapse into an opaque grid of pixels — the
  browser keeps no memory of "a circle was here", only what color each pixel ended up).
*/
export default function RetainedVsImmediateModeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 340" role="img" aria-labelledby="retained-vs-immediate-diagram-title retained-vs-immediate-diagram-desc">
          <title id="retained-vs-immediate-diagram-title">SVG retained mode vs Canvas immediate mode</title>
          <desc id="retained-vs-immediate-diagram-desc">
            Left panel: an SVG element tree where the root svg node has three named children — rect, circle, and
            path — each one a real, separately addressable DOM node that supports hover, click, and ARIA. Right
            panel: three Canvas drawing commands — fillRect, arc, and fillText — issued in order, all merging
            into a single shared pixel buffer where no individual shape can be queried back out afterward.
          </desc>

          <defs>
            <marker id="retained-immediate-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <pattern id="retained-immediate-pixel-grid" width={PIXEL_CELL} height={PIXEL_CELL} patternUnits="userSpaceOnUse">
              <rect width={PIXEL_CELL} height={PIXEL_CELL} fill="none" stroke="var(--color-border-muted)" strokeWidth={0.5} />
            </pattern>
          </defs>

          {/* Vertical divider between the two panels. */}
          <line x1={240} y1={20} x2={240} y2={310} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 4" />

          {/* ---------------------------- Left panel: SVG retained mode ---------------------------- */}

          <text x={120} y={20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-accent)">SVG — retained mode</text>

          <rect x={80} y={34} width={80} height={32} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-fg-accent)" strokeWidth={1.5} />
          <text x={120} y={54} textAnchor="middle" fontSize={12} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">{"<svg>"}</text>

          {SVG_CHILDREN.map((child) => (
            <line
              key={`line-${child.label}`}
              x1={120} y1={66}
              x2={child.x + child.w / 2} y2={child.y}
              stroke="var(--color-border-default)" strokeWidth={1.25}
            />
          ))}

          {SVG_CHILDREN.map((child) => (
            <g key={child.label}>
              <rect x={child.x} y={child.y} width={child.w} height={30} rx={5} fill="var(--color-bg-default)" stroke="var(--color-fg-accent)" strokeWidth={1.25} />
              <text x={child.x + child.w / 2} y={child.y + 19} textAnchor="middle" fontSize={10.5} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">{child.label}</text>
            </g>
          ))}

          {/* Dashed "still there" outline + cursor glyph on the circle node, to sell "individually addressable". */}
          <rect x={SVG_CHILDREN[1].x - 5} y={SVG_CHILDREN[1].y - 5} width={SVG_CHILDREN[1].w + 10} height={40} rx={7} fill="none" stroke="var(--color-fg-success)" strokeWidth={1.25} strokeDasharray="3 3" />
          <path d="M149,101 L149,117 L152.5,113.5 L155,120 L157.5,119 L155,112.5 L159.5,112.5 Z" fill="var(--color-fg-success)" />
          <text x={172} y={112} fontSize={9.5} fill="var(--color-fg-success)">hover</text>

          <text x={120} y={200} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">each node stays real: hover, click,</text>
          <text x={120} y={214} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">focus, and ARIA all just work</text>

          <text x={120} y={244} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">still queryable years later:</text>
          <text x={120} y={258} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-accent)">{"svg.querySelector('circle')"}</text>

          {/* ---------------------------- Right panel: Canvas immediate mode ---------------------------- */}

          <text x={360} y={20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-attention)">Canvas — immediate mode</text>

          {CANVAS_DRAW_CALLS.map((call) => (
            <g key={call.label}>
              <rect x={282} y={call.y} width={156} height={26} rx={13} fill="var(--color-bg-attention-muted)" stroke="var(--color-fg-attention)" strokeWidth={1.25} />
              <text x={360} y={call.y + 17} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">{call.label}</text>
              <line x1={360} y1={call.y + 26} x2={360} y2={148} stroke="var(--color-fg-muted)" strokeWidth={1.25} markerEnd="url(#retained-immediate-arrow)" />
            </g>
          ))}

          {/* Shared pixel buffer every draw call merges into. */}
          <rect x={290} y={154} width={140} height={76} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.25} />
          <rect x={290} y={154} width={140} height={76} fill="url(#retained-immediate-pixel-grid)" />
          {PAINTED_PIXELS.map((pixel, index) => (
            <rect key={index} x={290 + pixel.x} y={154 + pixel.y} width={pixel.size} height={pixel.size} fill="var(--color-fg-attention)" opacity={0.55} />
          ))}
          <text x={360} y={246} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">one shared pixel buffer</text>

          <text x={360} y={276} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">drawing done → shapes forgotten,</text>
          <text x={360} y={290} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">only pixel colors remain</text>

          <text x={360} y={314} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-attention)">{'ctx.getImageData() only — no "circle" left'}</text>
        </Svg>
      </Wrapper>
    </>
  );
}

RetainedVsImmediateModeDiagram.displayName = "RetainedVsImmediateModeDiagram";
