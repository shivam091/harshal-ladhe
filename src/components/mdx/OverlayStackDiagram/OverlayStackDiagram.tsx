import type { JSX } from "react";
import { LAYER_SIZE, OVERLAY_LAYERS, RESULT, PHOTO_FROM, PHOTO_TO } from "@/components/mdx/OverlayStackDiagram/OverlayStackDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/OverlayStackDiagram/OverlayStackDiagram.styles";

/*
  Static SVG diagram of a hero `background-image` overlay stack — 2 offset squares (gradient tint in front,
  photo behind), plus the composited hero result with sample text on the right. Exists to make the same fact
  GradientLayeringDiagram makes for glassmorphism, but in the overlay-specific context this post is actually
  about: the gradient tint must be listed FIRST to render on top of the photo, not after it.
*/
export default function OverlayStackDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 300" role="img" aria-labelledby="overlay-stack-diagram-title overlay-stack-diagram-desc">
          <title id="overlay-stack-diagram-title">CSS gradient overlay stacking order diagram</title>
          <desc id="overlay-stack-diagram-desc">
            Two background layers stacked like offset cards — a gradient tint listed first, and a photo listed
            second. The tint renders on top of the photo, and together they composite into the final hero
            banner shown on the right, with sample heading text now legible over the tinted area.
          </desc>

          <defs>
            <marker id="overlay-stack-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <linearGradient id="overlay-stack-photo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={PHOTO_FROM} />
              <stop offset="100%" stopColor={PHOTO_TO} />
            </linearGradient>
            <linearGradient id="overlay-stack-tint" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
            </linearGradient>
          </defs>

          {/* Stack drawn back-to-front, so the frontmost (first-listed, tint) square's corner covers the photo. */}
          {[...OVERLAY_LAYERS].reverse().map((layer) => (
            <g key={layer.badge}>
              <rect
                x={layer.x}
                y={layer.y}
                width={LAYER_SIZE}
                height={LAYER_SIZE}
                rx={10}
                fill={layer.badge === "②" ? "url(#overlay-stack-photo)" : "var(--color-bg-default)"}
                stroke="var(--color-border-muted)"
                strokeWidth={1}
              />
              {layer.badge === "①" && <rect x={layer.x} y={layer.y} width={LAYER_SIZE} height={LAYER_SIZE} rx={10} fill="url(#overlay-stack-tint)" />}
              <circle cx={layer.x + LAYER_SIZE - 12} cy={layer.y + LAYER_SIZE - 12} r={11} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={layer.x + LAYER_SIZE - 12} y={layer.y + LAYER_SIZE - 8} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">{layer.badge}</text>
            </g>
          ))}

          {/* Legend mapping each badge to what it represents. */}
          <g transform="translate(20, 220)">
            {OVERLAY_LAYERS.map((layer, index) => (
              <text key={layer.badge} x={0} y={index * 20} fontSize={12} fill="var(--color-fg-default)">{layer.badge} {layer.label}</text>
            ))}
          </g>

          {/* Arrow into the composited result. */}
          <line x1={200} y1={118} x2={258} y2={118} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#overlay-stack-arrow)" />
          <text x={229} y={104} textAnchor="middle" fontSize={16} fill="var(--color-fg-muted)">=</text>

          {/* Composited result — photo tinted by the gradient, with sample heading text to show the legibility payoff. */}
          <g>
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="url(#overlay-stack-photo)" />
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="url(#overlay-stack-tint)" />
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
            <text x={RESULT.x + RESULT.size / 2} y={RESULT.y + RESULT.size - 16} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">Hero Title</text>
          </g>
          <text x={RESULT.x + RESULT.size / 2} y={RESULT.y + RESULT.size + 20} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">what you actually see</text>

          <text x={230} y={280} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">first-listed layer = rendered on top</text>
        </Svg>
      </Wrapper>
    </>
  );
}

OverlayStackDiagram.displayName = "OverlayStackDiagram";
