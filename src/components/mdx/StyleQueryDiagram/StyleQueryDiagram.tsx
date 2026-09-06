import type { JSX } from "react";
import { PANELS, PANEL_W, PANEL_H } from "@/components/mdx/StyleQueryDiagram/StyleQueryDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/StyleQueryDiagram/StyleQueryDiagram.styles";

/*
  Static SVG diagram of `@container style()`. Two card containers, identically sized, each setting
  --theme to a different value — the query matches (or doesn't) based on that COMPUTED VALUE, not
  on either container's size, which is the one distinction this diagram exists to make visible: two
  boxes that look interchangeable by dimension alone can still resolve a style query differently.
*/
export default function StyleQueryDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 230" role="img" aria-labelledby="style-query-diagram-title style-query-diagram-desc">
          <title id="style-query-diagram-title">@container style() theme diagram</title>
          <desc id="style-query-diagram-desc">
            Two identically sized card containers. The left sets --theme to light, the right sets it
            to dark. @container style(--theme: dark) matches only the right card — the query
            resolves against that custom property&apos;s computed value, not either container&apos;s size.
          </desc>

          <defs>
            <marker id="style-query-arrow-accent" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
            <marker id="style-query-arrow-muted" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={330} y={16} textAnchor="middle" fontSize={12.5} fontWeight={600} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
            @container style(--theme: dark)
          </text>
          <line x1={330} y1={24} x2={330} y2={50} stroke="var(--color-fg-accent)" strokeWidth={2} markerEnd="url(#style-query-arrow-accent)" />

          {PANELS.map((panel) => {
            const isDark = panel.theme === "dark";
            const cardFill = isDark ? "#121212" : "#ffffff";
            const cardStroke = isDark ? "#333333" : "#d0d0d5";
            const titleFill = isDark ? "#ffffff" : "#1a1a1a";
            const bodyFill = isDark ? "#5c5c66" : "#c7c7cf";
            const centerX = panel.x + PANEL_W / 2;

            return (
              <g key={panel.theme}>
                <rect x={panel.x} y={30} width={PANEL_W} height={24} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={centerX} y={46} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-muted)">
                  {panel.themeValue}
                </text>

                <line x1={centerX} y1={56} x2={centerX} y2={PANEL_H - 60} stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#style-query-arrow-muted)" />

                <rect x={panel.x} y={PANEL_H - 60} width={PANEL_W} height={90} rx={10} fill={cardFill} stroke={cardStroke} strokeWidth={1.5} />
                <rect x={panel.x + 16} y={PANEL_H - 42} width={80} height={9} rx={4} fill={titleFill} />
                <rect x={panel.x + 16} y={PANEL_H - 24} width={128} height={6} rx={3} fill={bodyFill} />
                <rect x={panel.x + 16} y={PANEL_H - 12} width={96} height={6} rx={3} fill={bodyFill} />

                <text
                  x={centerX}
                  y={PANEL_H + 46}
                  textAnchor="middle"
                  fontSize={11.5}
                  fontWeight={600}
                  fill={isDark ? "var(--color-fg-success)" : "var(--color-fg-muted)"}
                >
                  {isDark ? "✓ matches" : "✕ does not match"}
                </text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

StyleQueryDiagram.displayName = "StyleQueryDiagram";
