import type { JSX } from "react";
import { LAYER_SIZE, LAYERS, BADGE_R, RESULT, BACKDROP_COLOR, GLOW_COLOR } from "@/components/mdx/GradientLayeringDiagram/GradientLayeringDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GradientLayeringDiagram/GradientLayeringDiagram.styles";

/*
  Static SVG diagram of comma-separated background gradient layering — 3 offset squares stacked like a deck
  of cards (drawn back-to-front so each corner peeks out), plus the composited result on the right. Exists
  to make one fact unmissable: the FIRST gradient listed in the CSS renders on TOP, not the last.
*/
export default function GradientLayeringDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 300" role="img" aria-labelledby="gradient-layering-diagram-title gradient-layering-diagram-desc">
          <title id="gradient-layering-diagram-title">gradient layering z-order diagram</title>
          <desc id="gradient-layering-diagram-desc">
            Three background layers stacked like offset cards — a light reflection, an ambient highlight glow,
            and the backdrop color. The layer listed first in the CSS renders on top, and all three composite
            together into the final glass-card effect shown on the right.
          </desc>

          <defs>
            <marker id="gradient-layering-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <linearGradient id="gradient-layering-sheen" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
            </linearGradient>
            <radialGradient id="gradient-layering-glow" cx="30%" cy="30%" r="65%">
              <stop offset="0%" stopColor={`rgba(${GLOW_COLOR}, 0.65)`} />
              <stop offset="100%" stopColor={`rgba(${GLOW_COLOR}, 0)`} />
            </radialGradient>
          </defs>

          {/* Stack drawn back-to-front, so the frontmost (first-listed) square's corner covers the others. */}
          {[...LAYERS].reverse().map((layer) => (
            <g key={layer.badge}>
              <rect x={layer.x} y={layer.y} width={LAYER_SIZE} height={LAYER_SIZE} rx={10} fill={BACKDROP_COLOR} stroke="var(--color-border-muted)" strokeWidth={1} />
              {layer.badge === "①" && <rect x={layer.x} y={layer.y} width={LAYER_SIZE} height={LAYER_SIZE} rx={10} fill="url(#gradient-layering-sheen)" />}
              {layer.badge === "②" && <rect x={layer.x} y={layer.y} width={LAYER_SIZE} height={LAYER_SIZE} rx={10} fill="url(#gradient-layering-glow)" />}
              <circle cx={layer.x + LAYER_SIZE - 12} cy={layer.y + LAYER_SIZE - 12} r={BADGE_R} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={layer.x + LAYER_SIZE - 12} y={layer.y + LAYER_SIZE - 8} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">{layer.badge}</text>
            </g>
          ))}

          {/* Legend mapping each badge to what it represents. */}
          <g transform="translate(20, 220)">
            {LAYERS.map((layer, index) => (
              <text key={layer.badge} x={0} y={index * 20} fontSize={12} fill="var(--color-fg-default)">{layer.badge} {layer.label}</text>
            ))}
          </g>

          {/* Arrow into the composited result. */}
          <line x1={200} y1={118} x2={258} y2={118} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#gradient-layering-arrow)" />
          <text x={229} y={104} textAnchor="middle" fontSize={16} fill="var(--color-fg-muted)">=</text>

          {/* Composited result — all 3 layers blended together, the actual glass-card effect. */}
          <g>
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill={BACKDROP_COLOR} />
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="url(#gradient-layering-glow)" />
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="url(#gradient-layering-sheen)" />
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={16} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          </g>
          <text x={RESULT.x + RESULT.size / 2} y={RESULT.y + RESULT.size + 20} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">what you actually see</text>

          <text x={230} y={280} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">first-listed layer = rendered on top</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GradientLayeringDiagram.displayName = "GradientLayeringDiagram";
