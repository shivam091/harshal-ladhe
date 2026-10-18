import type { JSX } from "react";
import { BOX, UNITS } from "@/components/mdx/ContainerUnitsDiagram/ContainerUnitsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ContainerUnitsDiagram/ContainerUnitsDiagram.styles";

/*
  Static SVG diagram of the 4 container query length units (cqi, cqb, cqmin, cqmax) against a
  single box. cqi and cqb each measure a real axis of the box (width and height); cqmin/cqmax
  don't have an axis of their own — they resolve to whichever of those two is smaller or larger,
  which is the one fact this diagram exists to make concrete rather than abstract.
*/
export default function ContainerUnitsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 340" role="img" aria-labelledby="container-units-diagram-title container-units-diagram-desc">
          <title id="container-units-diagram-title">container query length units diagram</title>
          <desc id="container-units-diagram-desc">
            A container box wider than it is tall, with its width measured as cqi and its height
            measured as cqb. Since the box is wider than tall, cqmin (the smaller of the two)
            resolves to cqb, and cqmax (the larger of the two) resolves to cqi.
          </desc>

          <defs>
            <marker id="container-units-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} />

          {/* cqi — drawn outside the box so it reads as a measurement of the whole width, not content inside it. */}
          <line
            x1={BOX.x + 14}
            y1={BOX.y + BOX.h + 22}
            x2={BOX.x + BOX.w - 14}
            y2={BOX.y + BOX.h + 22}
            stroke="var(--color-fg-accent)"
            strokeWidth={2}
            markerStart="url(#container-units-arrow)"
            markerEnd="url(#container-units-arrow)"
          />
          <text x={BOX.x + BOX.w / 2} y={BOX.y + BOX.h + 40} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
            100cqi = full width
          </text>

          {/* cqb — outside the box for the same reason, so the two arrows read as a matched pair of measurements. */}
          <line
            x1={BOX.x + BOX.w + 22}
            y1={BOX.y + 14}
            x2={BOX.x + BOX.w + 22}
            y2={BOX.y + BOX.h - 14}
            stroke="var(--color-fg-accent)"
            strokeWidth={2}
            markerStart="url(#container-units-arrow)"
            markerEnd="url(#container-units-arrow)"
          />
          <text x={BOX.x + BOX.w + 34} y={BOX.y + BOX.h / 2} fontSize={12} fontWeight={600} fill="var(--color-fg-default)" transform={`rotate(90, ${BOX.x + BOX.w + 34}, ${BOX.y + BOX.h / 2})`}>
            100cqb = full height
          </text>

          {/* 4-unit legend, cqmin/cqmax called out as derived from cqi/cqb rather than measuring anything new. */}
          <g transform="translate(60, 268)">
            {UNITS.map((entry, index) => (
              <g key={entry.unit} transform={`translate(0, ${Math.floor(index / 2) * 34})`}>
                <g transform={`translate(${(index % 2) * 190}, 0)`}>
                  <text fontSize={13} fontWeight={700} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-accent)">
                    {entry.unit}
                  </text>
                  <text y={17} fontSize={11} fill="var(--color-fg-muted)">{entry.meaning}</text>
                </g>
              </g>
            ))}
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ContainerUnitsDiagram.displayName = "ContainerUnitsDiagram";
