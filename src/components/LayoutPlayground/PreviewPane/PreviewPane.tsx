"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, JSX } from "react";
import { compileContainerStyle, compileItemStyle } from "@/utils/layout-playground";
import { toFixed } from "@/utils/number";
import type { PreviewPaneProps } from "@/interfaces/layout-playground";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/LayoutPlayground/LayoutPlayground.styles";
import { PreviewScroller, DraftingSheet, Container, Item, CornerTick, ItemLabel, DimensionOverlay, SHEET_BLUE, SHEET_INK } from "@/components/LayoutPlayground/PreviewPane/PreviewPane.styles";

// The four corners every drafted item marks with a CornerTick.
const CORNERS: Array<"tl" | "tr" | "bl" | "br"> = ["tl", "tr", "bl", "br"];

/*
  One measured gap between two visually-adjacent items, in Container-local pixel coordinates —
  `from`/`to` are the two edges the gap spans (an x range for a horizontal gap, a y range for a
  vertical one), and `cross` is where along the perpendicular axis to actually draw the line (the
  midpoint of the two items' shared overlap on that axis).
*/
interface DimensionAnnotation {
  orientation: "horizontal" | "vertical";
  from: number;
  to: number;
  cross: number;
  value: number;
}

// Minimum measured gap (px) worth drawing a dimension line for — filters out sub-pixel rounding noise between items with no real gap between them (e.g. two grid cells sharing an edge).
const MIN_MEASURABLE_GAP = 1;

/*
  Reads every item's real, rendered getBoundingClientRect() and pairs up visually-adjacent ones
  (sorted top-to-bottom then left-to-right, which tracks actual rendered position rather than
  `state.items` array order — order/grid-placement can visually reorder items independently of
  that array) to find each genuine on-screen gap between them. Measuring the DOM directly like this
  — the same technique RadiusOverlay already uses for its own drag math — means the dimension
  lines stay correct for every alignment keyword (space-between, space-around, wrap, ...) without
  this tool having to separately re-derive flexbox/grid's own layout algorithm in JavaScript.
*/
function measureGaps(container: HTMLDivElement, itemEls: HTMLDivElement[]): DimensionAnnotation[] {
  const containerRect = container.getBoundingClientRect();
  const rects = itemEls
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - containerRect.left, top: r.top - containerRect.top, right: r.right - containerRect.left, bottom: r.bottom - containerRect.top };
    })
    .sort((a, b) => (Math.abs(a.top - b.top) > 1 ? a.top - b.top : a.left - b.left));

  const annotations: DimensionAnnotation[] = [];
  for (let i = 0; i < rects.length - 1; i++) {
    const a = rects[i];
    const b = rects[i + 1];
    const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);

    if (verticalOverlap > 0 && b.left - a.right > MIN_MEASURABLE_GAP) {
      annotations.push({ orientation: "horizontal", from: a.right, to: b.left, cross: (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2, value: b.left - a.right });
    } else if (horizontalOverlap > 0 && b.top - a.bottom > MIN_MEASURABLE_GAP) {
      annotations.push({ orientation: "vertical", from: a.bottom, to: b.top, cross: (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2, value: b.top - a.bottom });
    }
  }
  return annotations;
}

// Half the length (px) of a dimension line's own perpendicular end-ticks.
const TICK_HALF_LENGTH = 5;

// One dimension line's own line + end-ticks + arrowheads + px label, drawn as an SVG <g> — the engineering-drawing convention of a measurement called out between two extension ticks with a labeled arrow run in between.
function DimensionLine({ annotation, index }: { annotation: DimensionAnnotation; index: number }): JSX.Element {
  const label = `${toFixed(annotation.value, 1)}px`;
  const labelWidth = label.length * 6 + 8;

  if (annotation.orientation === "horizontal") {
    const y = annotation.cross;
    return (
      <g key={index}>
        <line x1={annotation.from} y1={y - TICK_HALF_LENGTH} x2={annotation.from} y2={y + TICK_HALF_LENGTH} style={{ stroke: SHEET_INK, strokeWidth: 1 }} />
        <line x1={annotation.to} y1={y - TICK_HALF_LENGTH} x2={annotation.to} y2={y + TICK_HALF_LENGTH} style={{ stroke: SHEET_INK, strokeWidth: 1 }} />
        <line
          x1={annotation.from}
          y1={y}
          x2={annotation.to}
          y2={y}
          style={{ stroke: SHEET_INK, strokeWidth: 1 }}
          markerStart="url(#layout-playground-dim-arrow)"
          markerEnd="url(#layout-playground-dim-arrow)"
        />
        <rect x={(annotation.from + annotation.to) / 2 - labelWidth / 2} y={y - 17} width={labelWidth} height={14} rx={2} style={{ fill: SHEET_BLUE, stroke: SHEET_INK, strokeWidth: 0.5 }} />
        <text x={(annotation.from + annotation.to) / 2} y={y - 7} textAnchor="middle" style={{ fill: SHEET_INK, fontSize: 9, fontFamily: "'Source Code Pro', ui-monospace, monospace" }}>
          {label}
        </text>
      </g>
    );
  }

  const x = annotation.cross;
  return (
    <g key={index}>
      <line x1={x - TICK_HALF_LENGTH} y1={annotation.from} x2={x + TICK_HALF_LENGTH} y2={annotation.from} style={{ stroke: SHEET_INK, strokeWidth: 1 }} />
      <line x1={x - TICK_HALF_LENGTH} y1={annotation.to} x2={x + TICK_HALF_LENGTH} y2={annotation.to} style={{ stroke: SHEET_INK, strokeWidth: 1 }} />
      <line
        x1={x}
        y1={annotation.from}
        x2={x}
        y2={annotation.to}
        style={{ stroke: SHEET_INK, strokeWidth: 1 }}
        markerStart="url(#layout-playground-dim-arrow)"
        markerEnd="url(#layout-playground-dim-arrow)"
      />
      <rect x={x + 4} y={(annotation.from + annotation.to) / 2 - 7} width={labelWidth} height={14} rx={2} style={{ fill: SHEET_BLUE, stroke: SHEET_INK, strokeWidth: 0.5 }} />
      <text x={x + 4 + labelWidth / 2} y={(annotation.from + annotation.to) / 2 + 3} textAnchor="middle" style={{ fill: SHEET_INK, fontSize: 9, fontFamily: "'Source Code Pro', ui-monospace, monospace" }}>
        {label}
      </text>
    </g>
  );
}

/*
  The tool's flagship flourish: the live flex/grid container rendered as an actual blueprint
  drawing on a fixed cyanotype sheet — every item a drafted, cross-hatched rectangle with corner
  tick marks (see Item/CornerTick's own comments), and every real measured gap between
  visually-adjacent items annotated with an engineering dimension line (see measureGaps above).
  Clicking an item selects it — the same shortcut StopEditor's draggable handles and
  BoxShadowGenerator's layer chips both offer, so a user can jump straight to a box's own controls
  without hunting for it in the parts schedule.
*/
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [annotations, setAnnotations] = useState<DimensionAnnotation[]>([]);

  // Re-measures on every state change (an edit can move/resize items without necessarily resizing Container itself) and again whenever Container's own box actually changes size (e.g. wrap pushing it taller, or the browser's own font/layout settling a beat after paint).
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      if (!container) return;
      const itemEls = state.items.map((item) => itemRefs.current.get(item.id)).filter((el): el is HTMLDivElement => el != null);
      setAnnotations(measureGaps(container, itemEls));
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [state]);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Drawing</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <PreviewScroller>
            <DraftingSheet>
              <Container ref={containerRef} style={{ ...compileContainerStyle(state), inlineSize: `${state.containerWidth}px` }}>
                {state.items.map((item) => (
                  <Item
                    key={item.id}
                    ref={(el) => {
                      if (el) itemRefs.current.set(item.id, el);
                      else itemRefs.current.delete(item.id);
                    }}
                    style={{ "--part-color": item.color, ...compileItemStyle(item, state.mode) } as CSSProperties}
                    data-selected={state.selectedItemId === item.id ? "true" : undefined}
                    onClick={() => actions.selectItem(item.id)}
                  >
                    {CORNERS.map((corner) => (
                      <CornerTick key={corner} data-corner={corner} />
                    ))}
                    <ItemLabel>{item.label}</ItemLabel>
                  </Item>
                ))}

                <DimensionOverlay aria-hidden="true">
                  <defs>
                    <marker id="layout-playground-dim-arrow" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto-start-reverse">
                      <path d="M0,0 L6,3 L0,6 Z" style={{ fill: SHEET_INK }} />
                    </marker>
                  </defs>
                  {annotations.map((annotation, index) => (
                    <DimensionLine key={index} annotation={annotation} index={index} />
                  ))}
                </DimensionOverlay>
              </Container>
            </DraftingSheet>
          </PreviewScroller>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
