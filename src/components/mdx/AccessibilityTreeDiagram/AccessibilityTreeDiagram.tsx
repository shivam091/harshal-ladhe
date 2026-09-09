import type { JSX } from "react";
import type { AccessibilityTreeDiagramProps } from "@/interfaces/accessibility-tree-diagram";
import { rowTopY, rowCenterY, diagramHeight } from "@/components/mdx/AccessibilityTreeDiagram/AccessibilityTreeDiagram.helpers";
import {
  ACCESSIBILITY_TREE_DIAGRAM_CONFIG,
  DOM_BOX_X,
  DOM_BOX_WIDTH,
  TREE_BOX_X,
  TREE_BOX_WIDTH,
  BOX_HEIGHT,
  CONNECTOR_START_X,
  CONNECTOR_END_X,
  HEADING_Y,
  TREE_HEADING
} from "@/components/mdx/AccessibilityTreeDiagram/AccessibilityTreeDiagram.constants";
import {
  Wrapper,
  Svg,
  columnHeadingClass,
  domBoxClass,
  domMarkupTextClass,
  domTextTextClass,
  accessibleBoxClass,
  inaccessibleBoxClass,
  accessibleTextClass,
  inaccessibleTextClass,
  connectorClass,
  connectorAccessibleClass,
  connectorInaccessibleClass
} from "@/components/mdx/AccessibilityTreeDiagram/AccessibilityTreeDiagram.styles";

/*
  Static, illustrative SVG diagram comparing a small DOM snippet against the accessibility tree it
  actually produces — the browser-internal, screen-reader-facing tree computed from semantics +
  ARIA + visibility (see the post's "The Accessibility Tree" section). The "good" variant shows
  semantic markup producing named/typed nodes; the "bad" variant shows the same UI built from divs
  producing nothing assistive tech can use. See AccessibilityTreeDiagram.constants.ts for both configs.
*/
export default function AccessibilityTreeDiagram({ variant }: AccessibilityTreeDiagramProps): JSX.Element {
  const config = ACCESSIBILITY_TREE_DIAGRAM_CONFIG[variant];
  const viewBoxHeight = diagramHeight(config.rows.length);

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 600 ${viewBoxHeight}`} role="img" aria-label={config.ariaLabel}>
          <defs>
            <marker id="a11y-tree-arrow-accessible" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={connectorAccessibleClass} />
            </marker>
            <marker id="a11y-tree-arrow-inaccessible" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={connectorInaccessibleClass} />
            </marker>
          </defs>

          <text x={DOM_BOX_X + DOM_BOX_WIDTH / 2} y={HEADING_Y} textAnchor="middle" className={columnHeadingClass}>
            {config.domHeading}
          </text>
          <text x={TREE_BOX_X + TREE_BOX_WIDTH / 2} y={HEADING_Y} textAnchor="middle" className={columnHeadingClass}>
            {TREE_HEADING}
          </text>

          {config.rows.map((row, index) => {
            const top = rowTopY(index);
            const centerY = rowCenterY(index);
            const treeBoxClass = row.node.accessible ? accessibleBoxClass : inaccessibleBoxClass;
            const markerId = row.node.accessible ? "a11y-tree-arrow-accessible" : "a11y-tree-arrow-inaccessible";
            const connectorVariantClass = row.node.accessible ? connectorAccessibleClass : connectorInaccessibleClass;

            return (
              <g key={row.dom.markup}>
                <rect x={DOM_BOX_X} y={top} width={DOM_BOX_WIDTH} height={BOX_HEIGHT} rx={8} className={domBoxClass} />
                <text x={DOM_BOX_X + 12} y={top + 28} className={domMarkupTextClass}>
                  {row.dom.markup}
                </text>
                <text x={DOM_BOX_X + 12} y={top + 50} className={domTextTextClass}>
                  {row.dom.text}
                </text>

                <line
                  x1={CONNECTOR_START_X}
                  y1={centerY}
                  x2={CONNECTOR_END_X}
                  y2={centerY}
                  className={`${connectorClass} ${connectorVariantClass}`}
                  markerEnd={`url(#${markerId})`}
                />

                <rect x={TREE_BOX_X} y={top} width={TREE_BOX_WIDTH} height={BOX_HEIGHT} rx={8} className={treeBoxClass} />
                {row.node.accessible ? (
                  <>
                    <text x={TREE_BOX_X + 12} y={top + 28} className={accessibleTextClass}>
                      role: {row.node.role}
                    </text>
                    <text x={TREE_BOX_X + 12} y={top + 50} className={accessibleTextClass}>
                      name: {row.node.name}
                    </text>
                  </>
                ) : (
                  <text x={TREE_BOX_X + 12} y={top + BOX_HEIGHT / 2 + 4} className={inaccessibleTextClass}>
                    ∅ not exposed to AT
                  </text>
                )}
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

AccessibilityTreeDiagram.displayName = "AccessibilityTreeDiagram";
