import type { JSX } from "react";
import {
  ROW_H,
  SERVER_COL_X,
  CLIENT_COL_X,
  LABEL_X,
  HEADER_Y,
  HEADER_RULE_Y,
  FIRST_ROW_Y,
  SERVER_CLIENT_CAPABILITIES
} from "@/components/mdx/ServerClientComponentDiagram/ServerClientComponentDiagram.constants";
import { getCapabilityIconStyle } from "@/components/mdx/ServerClientComponentDiagram/ServerClientComponentDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/ServerClientComponentDiagram/ServerClientComponentDiagram.styles";

/*
  Static SVG comparison of what a Server Component and a Client Component can each do — the two kinds
  of components that coexist in a single RSC tree. Reading down the two icon columns makes the split
  concrete: interactivity (state, effects, handlers, browser APIs) is exclusively a Client Component
  trait, while top-level async/await and direct backend access are exclusively a Server Component
  trait — and the two lists don't overlap anywhere.
*/
export default function ServerClientComponentDiagram(): JSX.Element {
  const height = FIRST_ROW_Y + SERVER_CLIENT_CAPABILITIES.length * ROW_H + 16;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 560 ${height}`} role="img" aria-labelledby="server-client-component-diagram-title server-client-component-diagram-desc">
          <title id="server-client-component-diagram-title">Server Component vs Client Component capability comparison</title>
          <desc id="server-client-component-diagram-desc">
            A table comparing Server Components and Client Components across eight capabilities. Client
            Components support state, effects, event handlers, browser APIs, re-rendering after the
            initial load, and ship JS to the browser. Server Components support top-level async/await
            and direct backend access, and none of the client-only traits.
          </desc>

          <text x={SERVER_COL_X} y={HEADER_Y} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-border-success-emphasis)">
            Server
          </text>
          <text x={LABEL_X} y={HEADER_Y} fontSize={11} fill="var(--color-fg-muted)">Capability</text>
          <text x={CLIENT_COL_X} y={HEADER_Y} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-border-accent-emphasis)">
            Client
          </text>

          <line x1={20} y1={HEADER_RULE_Y} x2={540} y2={HEADER_RULE_Y} stroke="var(--color-border-muted)" strokeWidth={1} />

          {SERVER_CLIENT_CAPABILITIES.map((row, index) => {
            const y = FIRST_ROW_Y + index * ROW_H;
            const serverStyle = getCapabilityIconStyle(row.server);
            const clientStyle = getCapabilityIconStyle(row.client);

            return (
              <g key={row.label}>
                <text x={LABEL_X} y={y + 5} fontSize={12} fill="var(--color-fg-default)">{row.label}</text>

                <circle cx={SERVER_COL_X} cy={y} r={10} fill={serverStyle.fill} stroke={serverStyle.stroke} strokeWidth={1.5} />
                <text x={SERVER_COL_X} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-fg-default)">
                  {row.server ? "✓" : "✕"}
                </text>

                <circle cx={CLIENT_COL_X} cy={y} r={10} fill={clientStyle.fill} stroke={clientStyle.stroke} strokeWidth={1.5} />
                <text x={CLIENT_COL_X} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-fg-default)">
                  {row.client ? "✓" : "✕"}
                </text>

                {index < SERVER_CLIENT_CAPABILITIES.length - 1 && (
                  <line x1={20} y1={y + ROW_H / 2} x2={540} y2={y + ROW_H / 2} stroke="var(--color-border-muted)" strokeWidth={0.5} />
                )}
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

ServerClientComponentDiagram.displayName = "ServerClientComponentDiagram";
