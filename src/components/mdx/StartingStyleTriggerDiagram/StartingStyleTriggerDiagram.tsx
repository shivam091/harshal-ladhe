import type { JSX } from "react";
import {
  FIRES,
  DOES_NOT_FIRE,
  COLUMN_X,
  COLUMN_W,
  FIRST_ROW_Y,
  ROW_H,
  ROW_GAP,
} from "@/components/mdx/StartingStyleTriggerDiagram/StartingStyleTriggerDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/StartingStyleTriggerDiagram/StartingStyleTriggerDiagram.styles";

/*
  Drawn as two side-by-side lists because the useful question is "which side is mine?", and a single glance
  at matching cards answers it faster than a paragraph of exceptions. Colour tokens keep it legible in both themes.
*/
export default function StartingStyleTriggerDiagram(): JSX.Element {
  const columns = [
    { heading: "Starting style is used", cases: FIRES, tone: "success", mark: "✓" },
    { heading: "Nothing is applied", cases: DOES_NOT_FIRE, tone: "attention", mark: "✕" },
  ];

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 270" role="img" aria-labelledby="starting-style-trigger-title starting-style-trigger-desc">
          <title id="starting-style-trigger-title">When @starting-style applies and when it does not</title>
          <desc id="starting-style-trigger-desc">
            Two columns. The starting style is used when an element is inserted into the DOM, when display changes
            from none to a rendered value, when content-visibility is revealed, and on the first paint of the page.
            Nothing is applied when a class is added to an element that is already rendered, when a component
            re-renders, when a keyed list is reordered, or on an ordinary hover or state change.
          </desc>

          {columns.map((column, columnIndex) => {
            const x = COLUMN_X[columnIndex];
            const color = `var(--color-fg-${column.tone})`;

            return (
              <g key={column.heading}>
                <text x={x} y={28} fontSize={12} fontWeight={700} fill={color}>{column.heading}</text>

                {column.cases.map((item, rowIndex) => {
                  const y = FIRST_ROW_Y + rowIndex * (ROW_H + ROW_GAP);

                  return (
                    <g key={item.label}>
                      <rect x={x} y={y} width={COLUMN_W} height={ROW_H} rx={6} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1.5} />
                      <text x={x + 14} y={y + ROW_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{column.mark}</text>
                      <text x={x + 28} y={y + 19} fontSize={11.5} fontWeight={600} fill="var(--color-fg-default)">{item.label}</text>
                      <text x={x + 28} y={y + 34} fontSize={10} fill="var(--color-fg-muted)">{item.hint}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

StartingStyleTriggerDiagram.displayName = "StartingStyleTriggerDiagram";
