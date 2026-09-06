import type { JSX } from "react";
import {
  SOURCE_HEX,
  SOURCE_BOX,
  DERIVED_HEX,
  DERIVED_BOX,
  CHANNELS,
  CHANNEL_ROW_X,
  CHANNEL_ROW_WIDTH,
  CHANNEL_ROW_Y,
  CHANNEL_ROW_HEIGHT
} from "@/components/mdx/RelativeColorChannelDiagram/RelativeColorChannelDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RelativeColorChannelDiagram/RelativeColorChannelDiagram.styles";

/*
  Static SVG diagram of relative color syntax's `from` keyword: a source swatch is decomposed into its
  3 oklch() channels (L, C, H), one channel (L) is adjusted with `calc(l * 0.6)`, and the result is
  reassembled into a derived swatch. The one fact this diagram exists to teach: C and H pass through
  completely untouched — only the channel you explicitly reference and change in the formula changes,
  everything else is carried over verbatim from the source color.
*/
export default function RelativeColorChannelDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 560 240" role="img" aria-labelledby="relative-color-channel-diagram-title relative-color-channel-diagram-desc">
          <title id="relative-color-channel-diagram-title">Relative color syntax channel diagram</title>
          <desc id="relative-color-channel-diagram-desc">
            A source swatch is decomposed into its lightness, chroma, and hue channels. The lightness
            channel is adjusted with calc(l times 0.6) while chroma and hue are carried over unchanged,
            and the three channels are reassembled into a derived swatch that is a darker version of the
            exact same hue.
          </desc>

          <defs>
            <marker id="relative-color-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Source swatch. */}
          <rect x={SOURCE_BOX.x} y={SOURCE_BOX.y} width={SOURCE_BOX.size} height={SOURCE_BOX.size} rx={10} fill={SOURCE_HEX} stroke="var(--color-border-muted)" strokeWidth={1} />
          <text x={SOURCE_BOX.x + SOURCE_BOX.size / 2} y={SOURCE_BOX.y + SOURCE_BOX.size + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">source</text>
          <text x={SOURCE_BOX.x + SOURCE_BOX.size / 2} y={SOURCE_BOX.y + SOURCE_BOX.size + 38} textAnchor="middle" fontSize={10.5} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-muted)">
            --brand-color
          </text>

          {/* Arrow from source into the decomposed channel rows, aimed at the vertical center of the 3-row stack. */}
          <line x1={SOURCE_BOX.x + SOURCE_BOX.size + 8} y1={138} x2={CHANNEL_ROW_X - 8} y2={138} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#relative-color-arrow)" />

          {/* 3 channel rows: L (highlighted, changes) then C and H (muted, pass through unchanged). */}
          {CHANNELS.map((channel, index) => {
            const y = CHANNEL_ROW_Y[index];
            const stroke = channel.changes ? "var(--color-border-accent-emphasis)" : "var(--color-border-muted)";
            const dash = channel.changes ? undefined : "4 3";
            return (
              <g key={channel.key}>
                <rect x={CHANNEL_ROW_X} y={y} width={CHANNEL_ROW_WIDTH} height={CHANNEL_ROW_HEIGHT} rx={8} fill="none" stroke={stroke} strokeWidth={1.5} strokeDasharray={dash} />
                <text x={CHANNEL_ROW_X + 12} y={y + 16} fontSize={11.5} fontWeight={600} fill="var(--color-fg-default)">{channel.label}</text>
                <text
                  x={CHANNEL_ROW_X + 12}
                  y={y + 32}
                  fontSize={11}
                  fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                  fill={channel.changes ? "var(--color-border-accent-emphasis)" : "var(--color-fg-muted)"}
                >
                  {channel.sourceValue} → {channel.formula} → {channel.derivedValue}
                </text>
                {!channel.changes && (
                  <text x={CHANNEL_ROW_X + CHANNEL_ROW_WIDTH - 12} y={y + 24} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">unchanged</text>
                )}
              </g>
            );
          })}

          {/* Arrow from decomposed channels into the reassembled derived swatch. */}
          <line x1={CHANNEL_ROW_X + CHANNEL_ROW_WIDTH + 8} y1={138} x2={DERIVED_BOX.x - 8} y2={138} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#relative-color-arrow)" />

          {/* Derived swatch. */}
          <rect x={DERIVED_BOX.x} y={DERIVED_BOX.y} width={DERIVED_BOX.size} height={DERIVED_BOX.size} rx={10} fill={DERIVED_HEX} stroke="var(--color-border-muted)" strokeWidth={1} />
          <text x={DERIVED_BOX.x + DERIVED_BOX.size / 2} y={DERIVED_BOX.y + DERIVED_BOX.size + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">derived</text>
          <text x={DERIVED_BOX.x + DERIVED_BOX.size / 2} y={DERIVED_BOX.y + DERIVED_BOX.size + 38} textAnchor="middle" fontSize={10.5} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-muted)">
            oklch(from ...)
          </text>

          <text x={280} y={228} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            oklch(from var(--brand-color) calc(l * 0.6) c h) — only L moves, C and H are carried over verbatim
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

RelativeColorChannelDiagram.displayName = "RelativeColorChannelDiagram";
