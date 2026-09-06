import type { JSX } from "react";
import {
  CANVAS_W,
  CANVAS_H,
  SOURCE_X,
  SOURCE_Y,
  SOURCE_W,
  SOURCE_H,
  VARIANT_Y,
  VARIANT_W,
  VARIANT_H,
  VARIANT_GAP,
  VARIANT_START_X,
  SRCSET_VARIANTS,
  READOUT_X,
  READOUT_Y,
  READOUT_W,
  READOUT_H,
  READOUT_LINE_START_Y,
  READOUT_LINE_GAP,
  READOUT_SIZES_Y,
  BROWSER_X,
  BROWSER_Y,
  BROWSER_W,
  BROWSER_H
} from "@/components/mdx/SrcsetGenerationDiagram/SrcsetGenerationDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SrcsetGenerationDiagram/SrcsetGenerationDiagram.styles";

/*
  Static SVG diagram of how next/image builds a responsive image. Top: one source file fans out into
  several real, physically resized copies — the widths driven by the deviceSizes config, all generated
  equally, with no "preferred" one among them. Middle: the actual srcset/sizes string this produces,
  with one entry highlighted as a worked example. Bottom: a short arrow from a "Browser" box up into
  that highlighted entry — the point being that the browser, not the server and not next/image itself,
  is what picks a match, based on the element's rendered size and the screen's device pixel ratio.
*/
export default function SrcsetGenerationDiagram(): JSX.Element {
  const sourceCenterX = SOURCE_X + SOURCE_W / 2;
  const sourceBottomY = SOURCE_Y + SOURCE_H;
  const browserCenterX = BROWSER_X + BROWSER_W / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="srcset-generation-diagram-title srcset-generation-diagram-desc">
          <title id="srcset-generation-diagram-title">Diagram of next/image generating a responsive srcset</title>
          <desc id="srcset-generation-diagram-desc">
            One source file fans out into four generated width variants: 640w, 828w, 1200w, and 1920w,
            all produced equally. Below them, the resulting srcset and sizes attribute values are shown,
            with the 828w entry highlighted. A Browser box, labeled 900 pixel viewport and 1x device
            pixel ratio, has a short arrow pointing up into that highlighted entry, illustrating that the
            browser itself picks the matching entry, not the server and not next/image.
          </desc>

          {/* Source file */}
          <rect x={SOURCE_X} y={SOURCE_Y} width={SOURCE_W} height={SOURCE_H} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={sourceCenterX} y={SOURCE_Y + SOURCE_H / 2 - 2} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">
            source.jpg
          </text>
          <text x={sourceCenterX} y={SOURCE_Y + SOURCE_H / 2 + 13} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            2400 × 1600 original
          </text>

          {/* Fan-out to each generated variant */}
          {SRCSET_VARIANTS.map((variant, index) => {
            const x = VARIANT_START_X + index * (VARIANT_W + VARIANT_GAP);
            return (
              <line
                key={`edge-${variant.id}`}
                x1={sourceCenterX}
                y1={sourceBottomY}
                x2={x + VARIANT_W / 2}
                y2={VARIANT_Y}
                stroke="var(--color-fg-muted)"
                strokeWidth={1.5}
              />
            );
          })}

          {SRCSET_VARIANTS.map((variant, index) => {
            const x = VARIANT_START_X + index * (VARIANT_W + VARIANT_GAP);
            return (
              <g key={variant.id}>
                <rect x={x} y={VARIANT_Y} width={VARIANT_W} height={VARIANT_H} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                <text x={x + VARIANT_W / 2} y={VARIANT_Y + VARIANT_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                  {variant.widthLabel}
                </text>
              </g>
            );
          })}

          <text x={CANVAS_W / 2} y={VARIANT_Y + VARIANT_H + 20} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">
            one source file → several real, resized copies (widths driven by deviceSizes)
          </text>

          {/* Generated markup readout */}
          <rect x={READOUT_X} y={READOUT_Y} width={READOUT_W} height={READOUT_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={READOUT_X + 16} y={READOUT_Y + 18} fontSize={10.5} fontWeight={700} fontFamily="monospace" fill="var(--color-fg-muted)">
            srcset=
          </text>

          {SRCSET_VARIANTS.map((variant, index) => {
            const lineY = READOUT_LINE_START_Y + index * READOUT_LINE_GAP;
            return (
              <g key={`line-${variant.id}`}>
                {variant.selected && (
                  <rect x={READOUT_X + 10} y={lineY - 11} width={READOUT_W - 20} height={14} rx={3} fill="var(--color-bg-accent-muted)" />
                )}
                <text
                  x={READOUT_X + 16}
                  y={lineY}
                  fontSize={9.5}
                  fontFamily="monospace"
                  fontWeight={variant.selected ? 700 : 400}
                  fill={variant.selected ? "var(--color-fg-default)" : "var(--color-fg-muted)"}
                >
                  {variant.srcsetEntry}
                  {index < SRCSET_VARIANTS.length - 1 ? "," : ""}
                </text>
              </g>
            );
          })}

          <text x={READOUT_X + 16} y={READOUT_SIZES_Y} fontSize={9.5} fontFamily="monospace" fontStyle="italic" fill="var(--color-fg-muted)">
            sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;
          </text>

          {/* Browser picks the match — not the server */}
          <line
            x1={browserCenterX}
            y1={BROWSER_Y}
            x2={browserCenterX}
            y2={READOUT_Y + READOUT_H}
            stroke="var(--color-border-accent-emphasis)"
            strokeWidth={2}
          />
          <path d={`M ${browserCenterX - 5} ${READOUT_Y + READOUT_H + 8} L ${browserCenterX + 5} ${READOUT_Y + READOUT_H + 8} L ${browserCenterX} ${READOUT_Y + READOUT_H} Z`} fill="var(--color-border-accent-emphasis)" />

          <text x={browserCenterX + 16} y={(BROWSER_Y + READOUT_Y + READOUT_H) / 2 + 4} fontSize={9.5} fill="var(--color-fg-muted)">
            picks the highlighted
          </text>
          <text x={browserCenterX + 16} y={(BROWSER_Y + READOUT_Y + READOUT_H) / 2 + 16} fontSize={9.5} fill="var(--color-fg-muted)">
            line above
          </text>

          <rect x={BROWSER_X} y={BROWSER_Y} width={BROWSER_W} height={BROWSER_H} rx={8} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={browserCenterX} y={BROWSER_Y + BROWSER_H / 2 - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            Browser
          </text>
          <text x={browserCenterX} y={BROWSER_Y + BROWSER_H / 2 + 13} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
            900px viewport · 1x DPR
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

SrcsetGenerationDiagram.displayName = "SrcsetGenerationDiagram";
