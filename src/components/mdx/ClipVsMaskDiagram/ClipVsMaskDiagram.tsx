import type { JSX } from "react";
import { RADIUS, SOURCE, RESULTS, LEGEND } from "@/components/mdx/ClipVsMaskDiagram/ClipVsMaskDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ClipVsMaskDiagram/ClipVsMaskDiagram.styles";

/*
  Static diagram feeding one piece of boundary content — a circle filled with a white-to-black gradient — into
  both a <clipPath> and a <mask>. Exists to make the core difference visible at a glance: the clip keeps only
  the circle's outline and discards its fill, while the mask turns that same fill's brightness into opacity.
*/
export default function ClipVsMaskDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 350" role="img" aria-labelledby="clip-vs-mask-diagram-title clip-vs-mask-diagram-desc">
          <title id="clip-vs-mask-diagram-title">Clip versus mask diagram</title>
          <desc id="clip-vs-mask-diagram-desc">
            A circle filled with a white-to-black gradient is used two ways. As a clipPath, the square of content
            it is applied to becomes a solid circle: only the outline counts and the gradient is ignored. As a
            mask, the same square becomes a circle that is fully visible on the left and fades to invisible on
            the right, following the gradient&apos;s brightness. A legend shows white means fully shown, gray
            partly shown, and black hidden.
          </desc>

          <defs>
            {/* Literal mask values (white → black), theme-independent by design: they are the data a mask reads, not UI chrome. */}
            <linearGradient id="clip-vs-mask-diagram-source-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="white" />
              <stop offset="1" stopColor="black" />
            </linearGradient>
            {/* The mask result: accent content whose opacity follows the source gradient's brightness left to right. */}
            <linearGradient id="clip-vs-mask-diagram-fade-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--color-fg-accent)" stopOpacity={1} />
              <stop offset="1" stopColor="var(--color-fg-accent)" stopOpacity={0} />
            </linearGradient>
            <marker id="clip-vs-mask-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Source — the boundary content both branches start from. */}
          <text x={SOURCE.cx} y={92} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Boundary content</text>
          <circle cx={SOURCE.cx} cy={SOURCE.cy} r={RADIUS + 5} fill="url(#clip-vs-mask-diagram-source-gradient)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={SOURCE.cx} y={252} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">circle + white → black gradient</text>

          {/* Arrows fanning out from the source to each result, labelled with the property that applies it. */}
          <line x1={192} y1={150} x2={343} y2={110} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#clip-vs-mask-diagram-arrow)" />
          <text x={262} y={114} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">clip-path</text>
          <line x1={192} y1={190} x2={343} y2={234} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#clip-vs-mask-diagram-arrow)" />
          <text x={262} y={234} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">mask</text>

          {/* Clip result — ghost of the full content square, then a solid circle: the gradient had no effect. */}
          <rect x={RESULTS.clip.box.x} y={RESULTS.clip.box.y} width={RESULTS.clip.box.size} height={RESULTS.clip.box.size} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 4" />
          <circle cx={RESULTS.clip.cx} cy={RESULTS.clip.cy} r={RADIUS} fill="var(--color-fg-accent)" />
          <text x={472} y={90} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{RESULTS.clip.title}</text>
          <text x={472} y={108} fontSize={11} fill="var(--color-fg-muted)">{RESULTS.clip.note}</text>

          {/* Mask result — the same ghost square, now a circle fading out wherever the source gradient darkens. */}
          <rect x={RESULTS.mask.box.x} y={RESULTS.mask.box.y} width={RESULTS.mask.box.size} height={RESULTS.mask.box.size} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 4" />
          <circle cx={RESULTS.mask.cx} cy={RESULTS.mask.cy} r={RADIUS} fill="url(#clip-vs-mask-diagram-fade-gradient)" />
          <text x={472} y={245} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{RESULTS.mask.title}</text>
          <text x={472} y={263} fontSize={11} fill="var(--color-fg-muted)">{RESULTS.mask.note}</text>

          {/* Legend — how a (luminance) mask reads each value. */}
          <text x={40} y={333} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Mask values:</text>
          {LEGEND.map((item) => (
            <g key={item.label}>
              <rect x={item.x} y={320} width={16} height={16} fill={item.fill} stroke="var(--color-border-default)" strokeWidth={1} />
              <text x={item.x + 24} y={333} fontSize={11} fill="var(--color-fg-muted)">{item.label}</text>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

ClipVsMaskDiagram.displayName = "ClipVsMaskDiagram";
