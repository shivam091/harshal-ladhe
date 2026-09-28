import type { JSX } from "react";
import { STAR_PATH, CENTER_Y, SYMBOL_BOX, GRID_STEP, INSTANCES } from "@/components/mdx/SymbolViewBoxDiagram/SymbolViewBoxDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SymbolViewBoxDiagram/SymbolViewBoxDiagram.styles";

// Interior grid offsets for the symbol box — precomputed so the 4-unit lines skip the box's own outer edges.
const GRID_OFFSETS = Array.from({ length: SYMBOL_BOX.size / GRID_STEP - 1 }, (_, index) => (index + 1) * GRID_STEP);

/*
  Static diagram of one 24 × 24 symbol viewBox being mapped into several use boxes of different sizes. Exists to show
  that a symbol's geometry never changes — each use's width/height only sets the viewport its viewBox is fitted into,
  and when that viewport's aspect ratio differs, preserveAspectRatio (default xMidYMid meet) decides the fit.
  The stars are drawn with nested svg elements so the browser performs the very viewBox mapping being illustrated.
*/
export default function SymbolViewBoxDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 600 280" role="img" aria-labelledby="symbol-viewbox-diagram-title symbol-viewbox-diagram-desc">
          <title id="symbol-viewbox-diagram-title">How a symbol&apos;s viewBox scales into each use</title>
          <desc id="symbol-viewbox-diagram-desc">
            On the left, a symbol with viewBox 0 0 24 24 containing a star, drawn on a 24-unit grid. An arrow points to four use
            instances on the right: 16 by 16, 24 by 24 and 32 by 32 boxes show the same star scaled by 0.67, 1 and 1.33 times.
            A fourth 48 by 24 box has a different aspect ratio, so the star keeps its proportions at 1 times scale and is
            centred horizontally, with empty space on both sides, because of the default preserveAspectRatio xMidYMid meet.
          </desc>

          <defs>
            <marker id="symbol-viewbox-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Column headings — definition on the left, instances on the right. */}
          <text x={SYMBOL_BOX.x + SYMBOL_BOX.size / 2} y={52} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">symbol viewBox=&quot;0 0 24 24&quot;</text>
          <text x={386} y={52} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">use width × height</text>

          {/* The symbol's own canvas — a 24-unit grid with the star authored in it once. */}
          <rect x={SYMBOL_BOX.x} y={SYMBOL_BOX.y} width={SYMBOL_BOX.size} height={SYMBOL_BOX.size} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          {GRID_OFFSETS.map((offset) => (
            <g key={offset}>
              <line x1={SYMBOL_BOX.x + offset} y1={SYMBOL_BOX.y} x2={SYMBOL_BOX.x + offset} y2={SYMBOL_BOX.y + SYMBOL_BOX.size} stroke="var(--color-border-muted)" strokeWidth={1} />
              <line x1={SYMBOL_BOX.x} y1={SYMBOL_BOX.y + offset} x2={SYMBOL_BOX.x + SYMBOL_BOX.size} y2={SYMBOL_BOX.y + offset} stroke="var(--color-border-muted)" strokeWidth={1} />
            </g>
          ))}
          <svg x={SYMBOL_BOX.x} y={SYMBOL_BOX.y} width={SYMBOL_BOX.size} height={SYMBOL_BOX.size} viewBox="0 0 24 24">
            <path d={STAR_PATH} fill="var(--color-fg-accent)" />
          </svg>
          <text x={SYMBOL_BOX.x + SYMBOL_BOX.size / 2} y={212} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">authored once</text>
          <text x={SYMBOL_BOX.x + SYMBOL_BOX.size / 2} y={228} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">in 24-unit space</text>

          {/* Arrow: the one definition feeding every instance. */}
          <line x1={146} y1={CENTER_Y} x2={190} y2={CENTER_Y} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#symbol-viewbox-diagram-arrow)" />
          <text x={168} y={CENTER_Y - 10} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">per use</text>

          {/* The four use viewports — same viewBox fitted into each; the last one letterboxes because its aspect ratio differs. */}
          {INSTANCES.map((instance) => {
            const y = CENTER_Y - instance.height / 2;
            const centerX = instance.x + instance.width / 2;
            const fitted = Math.min(instance.width, instance.height);

            return (
              <g key={instance.label}>
                <rect x={instance.x} y={y} width={instance.width} height={instance.height} fill="var(--color-bg-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
                {instance.width !== instance.height && (
                  <rect x={centerX - fitted / 2} y={CENTER_Y - fitted / 2} width={fitted} height={fitted} fill="none" stroke="var(--color-border-default)" strokeWidth={1} strokeDasharray="2 2" />
                )}
                <svg x={instance.x} y={y} width={instance.width} height={instance.height} viewBox="0 0 24 24">
                  <path d={STAR_PATH} fill="var(--color-fg-accent)" />
                </svg>
                <text x={centerX} y={212} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{instance.label}</text>
                <text x={centerX} y={228} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{instance.note}</text>
              </g>
            );
          })}

          <text x={300} y={266} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">one 24 × 24 viewBox, fitted into each use box — preserveAspectRatio decides the fit</text>
        </Svg>
      </Wrapper>
    </>
  );
}

SymbolViewBoxDiagram.displayName = "SymbolViewBoxDiagram";
