import type { JSX } from "react";
import {
  BEFORE,
  PANELS,
  ROW_W,
  ROW_H,
  ROW_GAP,
  LIST_Y,
  COLUMN_GAP,
} from "@/components/mdx/KeyedListDiagram/KeyedListDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/KeyedListDiagram/KeyedListDiagram.styles";

// Top edge of a list row by position, shared by both columns.
function rowY(index: number): number {
  return LIST_Y + index * (ROW_H + ROW_GAP);
}

/*
  Static SVG diagram of the same list update rendered with stable keys and with index keys: @starting-style only
  fires for brand-new DOM nodes, so the key strategy decides which item actually gets the entrance.
*/
export default function KeyedListDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 250" role="img" aria-labelledby="keyed-list-title keyed-list-desc">
          <title id="keyed-list-title">Which list item gets the @starting-style entrance, by key strategy</title>
          <desc id="keyed-list-desc">
            A new result N is added to the top of the list A, B, C. With stable keys, the existing nodes for A, B and C
            move down and a single new node is created for N, so only N animates in. With index keys, the first three
            nodes are reused in place and now show N, A and B, and the one new node is appended at the end showing C,
            so C animates in even though it was already in the list, and N appears without an entrance.
          </desc>

          <defs>
            <marker id="keyed-list-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {PANELS.map((panel) => {
            const afterX = panel.x + ROW_W + COLUMN_GAP;

            return (
              <g key={panel.heading}>
                <text x={panel.x + (ROW_W * 2 + COLUMN_GAP) / 2} y={24} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                  {panel.heading}
                </text>
                <text x={panel.x + ROW_W / 2} y={LIST_Y - 12} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">before</text>
                <text x={afterX + ROW_W / 2} y={LIST_Y - 12} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">after</text>

                {BEFORE.map((content, index) => (
                  <g key={content}>
                    <rect x={panel.x} y={rowY(index)} width={ROW_W} height={ROW_H} rx={4} fill="var(--color-bg-default)" stroke="var(--color-border-default)" />
                    <text x={panel.x + ROW_W / 2} y={rowY(index) + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{content}</text>
                  </g>
                ))}

                {panel.after.map((row, index) => {
                  const isNew = row.reusedFrom === null;
                  return (
                    <g key={index}>
                      {!isNew && (
                        <line
                          x1={panel.x + ROW_W + 4} y1={rowY(row.reusedFrom as number) + ROW_H / 2}
                          x2={afterX - 4} y2={rowY(index) + ROW_H / 2}
                          stroke="var(--color-fg-muted)" strokeWidth={1.25} markerEnd="url(#keyed-list-arrow)"
                        />
                      )}
                      <rect
                        x={afterX} y={rowY(index)} width={ROW_W} height={ROW_H} rx={4}
                        fill={isNew ? "var(--color-bg-accent-muted)" : "var(--color-bg-default)"}
                        stroke={isNew ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
                        strokeWidth={isNew ? 2 : 1} strokeDasharray={isNew ? "4 3" : undefined}
                      />
                      <text x={afterX + ROW_W / 2} y={rowY(index) + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={isNew ? 600 : 400} fill={isNew ? "var(--color-fg-accent)" : "var(--color-fg-default)"}>
                        {row.content}
                      </text>
                      {isNew && (
                        <text x={afterX + ROW_W / 2} y={rowY(index) - 3} textAnchor="middle" fontSize={8.5} fill="var(--color-fg-accent)">new node ✨</text>
                      )}
                    </g>
                  );
                })}

                <text x={panel.x + (ROW_W * 2 + COLUMN_GAP) / 2} y={rowY(4) + 16} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
                  {panel.caption}
                </text>
              </g>
            );
          })}

          <text x={210} y={244} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">Arrows show which existing DOM node renders each row after the update.</text>
        </Svg>
      </Wrapper>
    </>
  );
}

KeyedListDiagram.displayName = "KeyedListDiagram";
