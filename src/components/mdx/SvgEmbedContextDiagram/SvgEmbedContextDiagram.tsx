import type { JSX } from "react";
import { COLUMN_START_X, COLUMN_WIDTH, ROW_START_Y, ROW_HEIGHT, COLUMNS, ROWS } from "@/components/mdx/SvgEmbedContextDiagram/SvgEmbedContextDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/SvgEmbedContextDiagram/SvgEmbedContextDiagram.styles";

/*
  Static capability grid for the four ways one SVG file can be embedded — inline, as an image, as its own nested
  document, or rasterized onto a canvas. Exists because "my SVG works inline but breaks as an <img>" is one of the
  most common SVG surprises, and the cause is never the file itself: it's which context the file was placed into.
*/
export default function SvgEmbedContextDiagram(): JSX.Element {
  // Derived from the data so adding a row or column never leaves a rule or footnote stranded mid-grid.
  const gridRight = COLUMN_START_X + COLUMNS.length * COLUMN_WIDTH;
  // Footnotes hang off the last row rather than a fixed y, for the same reason.
  const gridBottom = ROW_START_Y + ROWS.length * ROW_HEIGHT;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 370" role="img" aria-labelledby="svg-embed-context-diagram-title svg-embed-context-diagram-desc">
          <title id="svg-embed-context-diagram-title">What an SVG can do in each embedding context</title>
          <desc id="svg-embed-context-diagram-desc">
            A grid comparing inline svg, img or CSS background, object or iframe, and drawing to canvas. Inline SVG can
            load external resources, run scripts, respond to hover and pointer events, animate, receive page CSS, and
            expose selectable, accessible text. As an img or CSS background it can only animate declaratively; it loads
            no external resources, runs no scripts, has no interactivity, ignores page CSS, and is exposed only through
            its alt text. As an object or iframe it can do everything except receive the host page&apos;s CSS. Drawn to a
            canvas it is a single static frame of pixels with none of these capabilities.
          </desc>

          {/* Column headers — the four embedding contexts, each on two lines. */}
          {COLUMNS.map((column, columnIndex) => (
            <g key={column.lines.join(" ")}>
              {column.lines.map((line, lineIndex) => (
                <text key={line} x={COLUMN_START_X + columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2} y={28 + lineIndex * 16} textAnchor="middle" fontSize={lineIndex === 0 ? 11 : 12} fontWeight={lineIndex === 0 ? 400 : 600} fill={lineIndex === 0 ? "var(--color-fg-muted)" : "var(--color-fg-default)"}>{line}</text>
              ))}
            </g>
          ))}

          {/* Header rule — separates the context names from the capability rows. */}
          <line x1={16} y1={ROW_START_Y - 4} x2={gridRight} y2={ROW_START_Y - 4} stroke="var(--color-border-default)" strokeWidth={1.5} />

          {/* Capability rows — label + example on the left, one yes/no verdict per context on the right. */}
          {ROWS.map((row, rowIndex) => {
            // Every element in the row is offset from this one baseline so the row stays internally aligned.
            const rowY = ROW_START_Y + rowIndex * ROW_HEIGHT;

            return (
              <g key={row.label}>
                <text x={16} y={rowY + 19} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{row.label}</text>
                <text x={16} y={rowY + 34} fontSize={10} fill="var(--color-fg-muted)">{row.example}</text>
                {row.cells.map((cell, columnIndex) => {
                  // Left edge of this verdict's column, shared by its pill and its label.
                  const cellX =COLUMN_START_X + columnIndex * COLUMN_WIDTH;

                  return (
                    <g key={COLUMNS[columnIndex].lines.join(" ")}>
                      <rect x={cellX + 6} y={rowY + 6} width={COLUMN_WIDTH - 12} height={ROW_HEIGHT - 12} rx={6} fill={cell.ok ? "var(--color-bg-success-muted)" : "var(--color-bg-danger-muted)"} stroke={cell.ok ? "var(--color-border-success-emphasis)" : "var(--color-border-danger-emphasis)"} strokeWidth={1} />
                      <text x={cellX + COLUMN_WIDTH / 2} y={rowY + 25} textAnchor="middle" fontSize={12} fontWeight={600} fill={cell.ok ? "var(--color-fg-default)" : "var(--color-fg-danger)"}>
                        {cell.ok ? "✓" : "✗"} {cell.note ?? (cell.ok ? "yes" : "no")}
                      </text>
                    </g>
                  );
                })}
                <line x1={16} y1={rowY + ROW_HEIGHT} x2={gridRight} y2={rowY + ROW_HEIGHT} stroke="var(--color-border-muted)" strokeWidth={1} />
              </g>
            );
          })}

          {/* Footnotes — the two caveats that most often explain a "works inline, breaks elsewhere" bug. */}
          <text x={16} y={gridBottom + 24} fontSize={11} fill="var(--color-fg-muted)">Resources inlined as data: URIs inside the SVG still render in every context.</text>
          <text x={16} y={gridBottom + 42} fontSize={11} fill="var(--color-fg-muted)">A canvas can only draw an SVG via an image, so it inherits every image restriction, then freezes it.</text>
        </Svg>
      </Wrapper>
    </>
  );
}

SvgEmbedContextDiagram.displayName = "SvgEmbedContextDiagram";
