import type { JSX } from "react";
import { Wrapper, Svg } from "@/components/mdx/ViewboxViewportDiagram/ViewboxViewportDiagram.styles";

// viewBox (left) scaling up to fill a viewport window (right); colours are theme tokens so it repaints per theme.
export default function ViewboxViewportDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 800 380" role="img" aria-labelledby="viewbox-viewport-diagram-title viewbox-viewport-diagram-desc">
          <title id="viewbox-viewport-diagram-title">viewBox vs. viewport diagram</title>
          <desc id="viewbox-viewport-diagram-desc">
            A 100 by 100 user-unit viewBox containing a circle on the left, connected by an arrow labeled &quot;scales to fit&quot; to a
            200 by 200 pixel viewport window on the right, showing the same circle rendered larger inside a browser-style frame.
          </desc>

          <defs>
            <marker id="vvArrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <rect x={1} y={1} width={798} height={378} rx={16} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2} />

          <g fontFamily="'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'">
            {/* viewBox canvas */}
            <text x={150} y={40} textAnchor="middle" fontSize={18} fontWeight={600} fill="var(--color-fg-default)">
              viewBox (the canvas)
            </text>
            <text
              x={150}
              y={64}
              textAnchor="middle"
              fontSize={13}
              fill="var(--color-fg-accent)"
              fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            >
              viewBox=&quot;0 0 100 100&quot;
            </text>

            <rect x={40} y={90} width={220} height={220} fill="var(--color-bg-default)" stroke="var(--color-fg-muted)" strokeWidth={1} />
            <g stroke="var(--color-border-muted)" strokeWidth={1}>
              <line x1={95} y1={90} x2={95} y2={310} />
              <line x1={150} y1={90} x2={150} y2={310} />
              <line x1={205} y1={90} x2={205} y2={310} />
              <line x1={40} y1={145} x2={260} y2={145} />
              <line x1={40} y1={200} x2={260} y2={200} />
              <line x1={40} y1={255} x2={260} y2={255} />
            </g>
            <circle cx={150} cy={200} r={100} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

            <text x={40} y={82} fontSize={11} fill="var(--color-fg-muted)" fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
              (0,0)
            </text>
            <text
              x={260}
              y={326}
              textAnchor="end"
              fontSize={11}
              fill="var(--color-fg-muted)"
              fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            >
              (100,100)
            </text>

            <text x={150} y={352} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">
              100 &#215; 100 user units
            </text>

            {/* Arrow */}
            <line x1={275} y1={210} x2={486} y2={210} stroke="var(--color-fg-muted)" strokeWidth={3} markerEnd="url(#vvArrowhead)" />
            <text x={380} y={190} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
              scales to fit
            </text>
            <text x={380} y={234} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">
              same coordinates, bigger window
            </text>

            {/* Viewport window */}
            <text x={630} y={40} textAnchor="middle" fontSize={18} fontWeight={600} fill="var(--color-fg-default)">
              viewport (the window)
            </text>
            <text
              x={630}
              y={64}
              textAnchor="middle"
              fontSize={13}
              fill="var(--color-fg-accent)"
              fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            >
              width=&quot;200&quot; height=&quot;200&quot;
            </text>

            <rect x={500} y={90} width={260} height={260} rx={10} fill="var(--color-bg-default)" />
            {/* Title bar: rounded on the top two corners only */}
            <path
              d="M 510 90 L 750 90 A 10 10 0 0 1 760 100 L 760 116 L 500 116 L 500 100 A 10 10 0 0 1 510 90 Z"
              fill="var(--color-bg-muted)"
            />
            {/* Title bar / body divider */}
            <line x1={500} y1={116} x2={760} y2={116} stroke="var(--color-fg-muted)" strokeWidth={1} />
            {/* Window border */}
            <rect x={500} y={90} width={260} height={260} rx={10} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1} />
            <circle cx={514} cy={103} r={4} fill="var(--color-fg-danger)" />
            <circle cx={530} cy={103} r={4} fill="var(--color-fg-attention)" />
            <circle cx={546} cy={103} r={4} fill="var(--color-fg-success)" />

            <circle cx={630} cy={233} r={107} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />

            <text x={630} y={368} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">
              200 &#215; 200 px on the page
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ViewboxViewportDiagram.displayName = "ViewboxViewportDiagram";
