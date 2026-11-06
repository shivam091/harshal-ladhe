import type { JSX } from "react";
import {
  CAPABILITIES,
  TOOLS,
  GRID_LEFT,
  COLUMN_W,
  FIRST_ROW_Y,
  ROW_H,
} from "@/components/mdx/ToolChoiceDiagram/ToolChoiceDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ToolChoiceDiagram/ToolChoiceDiagram.styles";

/*
  A matrix rather than a flowchart because readers arrive with a need ("I want a loop") and want the tool,
  and scanning one column answers that directly. Filled versus hollow marks keep it readable without colour.
*/
export default function ToolChoiceDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 250" role="img" aria-labelledby="tool-choice-title tool-choice-desc">
          <title id="tool-choice-title">Which animation tool covers which need</title>
          <desc id="tool-choice-desc">
            A matrix of four tools against five needs. @starting-style covers no-JavaScript entrances on mount.
            @keyframes adds loops and multi-step motion. The Web Animations API adds data-driven animation but needs
            JavaScript. View Transitions is the only one built for page-wide and shared-element transitions.
          </desc>

          {CAPABILITIES.map((lines, columnIndex) => {
            const cx = GRID_LEFT + columnIndex * COLUMN_W + COLUMN_W / 2;

            return (
              <g key={lines.join(" ")}>
                <text x={cx} y={30} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--color-fg-muted)">{lines[0]}</text>
                <text x={cx} y={42} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--color-fg-muted)">{lines[1]}</text>
              </g>
            );
          })}

          {TOOLS.map((tool, rowIndex) => {
            const y = FIRST_ROW_Y + rowIndex * ROW_H;
            const cy = y + ROW_H / 2;

            return (
              <g key={tool.name}>
                <line x1={20} y1={y} x2={GRID_LEFT + CAPABILITIES.length * COLUMN_W} y2={y} stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={20} y={cy + 4} fontSize={11.5} fontWeight={600} fill="var(--color-fg-default)">{tool.name}</text>

                {tool.covers.map((isCovered, columnIndex) => {
                  const cx = GRID_LEFT + columnIndex * COLUMN_W + COLUMN_W / 2;

                  return isCovered ? (
                    <circle key={columnIndex} cx={cx} cy={cy} r={7} fill="var(--color-fg-success)" />
                  ) : (
                    <circle key={columnIndex} cx={cx} cy={cy} r={4} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} />
                  );
                })}
              </g>
            );
          })}

          <text x={210} y={FIRST_ROW_Y + TOOLS.length * ROW_H + 24} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
            Reach for the highest row that covers what you need.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

ToolChoiceDiagram.displayName = "ToolChoiceDiagram";
