import type { JSX } from "react";
import { CELL, SAMPLES, ROW_Y } from "@/components/mdx/LuminanceAlphaDiagram/LuminanceAlphaDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/LuminanceAlphaDiagram/LuminanceAlphaDiagram.styles";

/*
  Static diagram running five mask-content swatches through both mask-type modes. Exists to pin down the two
  cases people get wrong: an opaque black shape hides under luminance but shows fully under alpha, and a
  transparent area hides under both — luminance mode multiplies brightness by alpha, it doesn't ignore alpha.
*/
export default function LuminanceAlphaDiagram(): JSX.Element {
  // Row metadata kept local so the label and the per-sample visibility lookup stay next to each other.
  const resultRows = [
    { y: ROW_Y.luminance, title: "mask-type=\"luminance\"", note: "luminance × alpha (default)", value: (index: number) => SAMPLES[index].luminance, label: (index: number) => SAMPLES[index].luminanceLabel },
    { y: ROW_Y.alpha, title: "mask-type=\"alpha\"", note: "alpha only, colour ignored", value: (index: number) => SAMPLES[index].alpha, label: (index: number) => SAMPLES[index].alphaLabel }
  ];

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 330" role="img" aria-labelledby="luminance-alpha-diagram-title luminance-alpha-diagram-desc">
          <title id="luminance-alpha-diagram-title">Luminance versus alpha mask diagram</title>
          <desc id="luminance-alpha-diagram-desc">
            Five mask-content swatches: opaque white, opaque gray, opaque black, white at 50 percent alpha, and
            fully transparent. Under a luminance mask the content shows 100 percent, partially, 0 percent, 50
            percent, and 0 percent. Under an alpha mask it shows 100, 100, 100, 50, and 0 percent, because only
            the swatch&apos;s transparency matters.
          </desc>

          <defs>
            {/* Checkerboard behind the swatches, so transparency reads as "see-through" instead of as a colour. */}
            <pattern id="luminance-alpha-diagram-checker" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="var(--color-bg-default)" />
              <rect width="6" height="6" fill="var(--color-border-muted)" />
              <rect x="6" y="6" width="6" height="6" fill="var(--color-border-muted)" />
            </pattern>
          </defs>

          {/* Row 1 — the mask content itself, each swatch over the checkerboard. */}
          <text x={20} y={ROW_Y.content + 26} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">mask content</text>
          <text x={20} y={ROW_Y.content + 44} fontSize={11} fill="var(--color-fg-muted)">what you draw</text>
          {SAMPLES.map((sample) => (
            <g key={sample.caption}>
              <rect x={sample.cx - CELL / 2} y={ROW_Y.content} width={CELL} height={CELL} fill="url(#luminance-alpha-diagram-checker)" />
              <rect x={sample.cx - CELL / 2} y={ROW_Y.content} width={CELL} height={CELL} fill={sample.fill} fillOpacity={sample.fillOpacity} stroke="var(--color-border-default)" strokeWidth={1} />
              <text x={sample.cx} y={ROW_Y.content + CELL + 16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{sample.caption}</text>
            </g>
          ))}

          {/* Rows 2 and 3 — how much of an accent-coloured element survives each swatch, per mask-type. */}
          {resultRows.map((row) => (
            <g key={row.title}>
              <text x={20} y={row.y + 26} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{row.title}</text>
              <text x={20} y={row.y + 44} fontSize={11} fill="var(--color-fg-muted)">{row.note}</text>
              {SAMPLES.map((sample, index) => (
                <g key={sample.caption}>
                  <rect x={sample.cx - CELL / 2} y={row.y} width={CELL} height={CELL} fill="var(--color-fg-accent)" fillOpacity={row.value(index)} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={sample.cx} y={row.y + CELL + 16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{row.label(index)}</text>
                </g>
              ))}
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

LuminanceAlphaDiagram.displayName = "LuminanceAlphaDiagram";
