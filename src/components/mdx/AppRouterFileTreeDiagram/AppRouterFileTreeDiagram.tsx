import type { JSX } from "react";
import {
  APP_ROUTER_FILE_NODES,
  APP_ROUTER_FILE_EDGES,
  APP_ROUTER_FILE_NOTES
} from "@/components/mdx/AppRouterFileTreeDiagram/AppRouterFileTreeDiagram.constants";
import { getAppRouterFileNodeColor } from "@/components/mdx/AppRouterFileTreeDiagram/AppRouterFileTreeDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/AppRouterFileTreeDiagram/AppRouterFileTreeDiagram.styles";

/*
  Static SVG diagram of an app/ directory: every file defaults to a Server Component (green), except
  error.tsx, which the framework forces to be a Client Component (blue) because an error boundary needs
  class-lifecycle state a Server Component can't hold. loading.tsx is called out separately too, since it
  quietly becomes a Suspense boundary rather than just "a loading spinner file."
*/
export default function AppRouterFileTreeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 320" role="img" aria-labelledby="app-router-file-tree-title app-router-file-tree-desc">
          <title id="app-router-file-tree-title">Diagram of an App Router app/ directory</title>
          <desc id="app-router-file-tree-desc">
            An app folder containing layout.tsx, page.tsx, loading.tsx, error.tsx, and a nested dashboard
            folder with its own layout.tsx, page.tsx, and loading.tsx. Every file is a Server Component by
            default, shown in green, except error.tsx, shown in blue because the framework forces it to be
            a Client Component. loading.tsx is annotated as an automatic Suspense boundary, and error.tsx is
            annotated as forced client because it needs component state.
          </desc>

          {APP_ROUTER_FILE_EDGES.map((edge, index) => (
            <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          ))}

          {APP_ROUTER_FILE_NODES.map((node) => {
            const color = getAppRouterFileNodeColor(node.kind);
            return (
              <g key={node.id}>
                <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                  {node.label}
                </text>
              </g>
            );
          })}

          {APP_ROUTER_FILE_NOTES.map((note, index) => (
            <g key={index} fontSize={9.5} fill="var(--color-fg-muted)">
              <text x={note.cx} y={note.y1} textAnchor="middle">{note.line1}</text>
              <text x={note.cx} y={note.y2} textAnchor="middle">{note.line2}</text>
            </g>
          ))}

          {/* Legend — left-aligns to the leftmost node's left edge (layout.tsx, x=10). */}
          <g fontSize={11}>
            <rect x={10} y={262} width={17} height={17} rx={4} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" />
            <text x={34} y={276} fill="var(--color-fg-default)">folder (route segment)</text>

            <rect x={220} y={262} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={244} y={276} fill="var(--color-fg-default)">Server Component (default)</text>

            <rect x={470} y={262} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={494} y={276} fill="var(--color-fg-default)">Client Component</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

AppRouterFileTreeDiagram.displayName = "AppRouterFileTreeDiagram";
