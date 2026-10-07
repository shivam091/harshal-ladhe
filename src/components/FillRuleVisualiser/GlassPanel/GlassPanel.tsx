"use client";

import { useId, useRef } from "react";
import type { JSX, KeyboardEvent, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { clamp } from "@/utils/number";
import { CANVAS_SIZE, formatNumber, formatSigned, normaliseAngle, serialisePathData } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import { PaneFrame, Nameplate, VerdictTag, TableSvg, Handle, ControlArm } from "@/components/FillRuleVisualiser/GlassPanel/GlassPanel.styles";
import type { FillRuleName, FillRulePoint, GlassPanelProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// usePointDrag reports 0–100 percentages; this turns them into viewBox units.
const PERCENT_TO_UNITS = CANVAS_SIZE / 100;

// Long enough for the plumb line to leave the table at any angle from any origin.
const RAY_LENGTH = CANVAS_SIZE * 1.6;

// Distance from the plumb bob to its aim knob — far enough to grab without covering nearby crossings.
const AIM_RADIUS = 44;

// Arrow-key step for anchors and the plumb bob; Shift multiplies it for coarse moves.
const NUDGE = 1;
const NUDGE_FAST = 10;

// Arrow-key step for the aim knob in degrees; Shift jumps to 15° so the eight compass points are quick to reach.
const TURN = 5;
const TURN_FAST = 15;

// Winding-map buckets in paint order, paired with the CSS class that tints each one.
const TINT_BUCKETS = [
  { key: "-2", className: "tint--2" },
  { key: "-1", className: "tint--1" },
  { key: "1", className: "tint-1" },
  { key: "2", className: "tint-2" }
] as const;

// Human label for each variant's nameplate.
const VARIANT_LABEL: Record<GlassPanelProps["variant"], string> = {
  nonzero: "fill-rule: nonzero",
  evenodd: "fill-rule: evenodd",
  split: "nonzero | evenodd",
  overlay: "nonzero ⊃ evenodd"
};

// data-* attributes render the literal string "false"; this keeps idle handles free of noise attributes.
function flag(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

// Maps arrow keys to a unit direction, or null for any other key so handlers can bail early.
function arrowDelta(key: string): [number, number] | null {
  if (key === "ArrowLeft") return [-1, 0];
  if (key === "ArrowRight") return [1, 0];
  if (key === "ArrowUp") return [0, -1];
  if (key === "ArrowDown") return [0, 1];
  return null;
}

/*
  One light-table pane. It draws the glass for its rule (or both rules cut down a seam or stacked),
  the leaded came, direction chevrons, the laser plumb line with a solder blob and a ±1 arrow at
  every crossing, and every draggable handle. Each pane owns its own usePointDrag instance, since
  pointer percentages are measured against its own SVG, but all of them write to the same shared
  state, so dragging in either pane moves both.
*/
export default function GlassPanel({ variant, primary, subpaths, geometry, probe, ray, view, tool, activeSubpath, selection, actions }: GlassPanelProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { texture: `${uid}-texture`, hatch: `${uid}-hatch`, clear: `${uid}-clear`, left: `${uid}-left`, right: `${uid}-right` };

  const { activeId, startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: svgRef,
    onDrag: (id, percent) => {
      const point = { x: percent.x * PERCENT_TO_UNITS, y: percent.y * PERCENT_TO_UNITS };
      const [kind, a, b] = id.split(":");
      if (kind === "node") actions.moveNode(Number(a), Number(b), point);
      else if (kind === "c1" || kind === "c2") actions.moveControl(Number(a), Number(b), kind, point);
      else if (kind === "probe") actions.setProbe({ ...probe, x: point.x, y: point.y });
      else if (kind === "aim") actions.setProbe({ ...probe, angle: normaliseAngle((Math.atan2(point.y - probe.y, point.x - probe.x) * 180) / Math.PI) });
      else if (kind === "seam") actions.setView({ split: Math.round(point.x) });
    },
    onDragEnd: (id) => {
      if (id.startsWith("node") || id.startsWith("c")) actions.commitDrag();
    }
  });

  // Converts a pointer position into viewBox units — read fresh each time, since the pane resizes with the layout.
  function toCanvas(event: { clientX: number; clientY: number }): FillRulePoint | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const { left, top, width, height } = svg.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - left) / width) * CANVAS_SIZE, 0, CANVAS_SIZE),
      y: clamp(((event.clientY - top) / height) * CANVAS_SIZE, 0, CANVAS_SIZE)
    };
  }

  // A drag takes priority; otherwise, in ray mode, hovering previews a plumb line from under the pointer.
  function handleMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (activeId) {
      handlePointerMove(event);
      return;
    }
    if (tool !== "probe" || event.pointerType === "touch") return;
    actions.setHoverProbe(toCanvas(event));
  }

  // Clicks on handles are their own gesture; anywhere else either adds a point or pins the plumb line.
  function handleClick(event: MouseEvent<SVGSVGElement>) {
    if ((event.target as Element).closest("[data-handle]")) return;
    const point = toCanvas(event);
    if (!point) return;
    if (tool === "draw") actions.addNode(point);
    else {
      actions.setProbe({ ...probe, x: point.x, y: point.y });
      actions.setHoverProbe(null);
    }
  }

  // Starts a handle drag and drops any hover preview, so the pinned ray is the one that moves.
  function beginDrag(id: string) {
    return (event: ReactPointerEvent) => {
      actions.setHoverProbe(null);
      startDrag(id)(event);
    };
  }

  // Arrow keys nudge an anchor (one undo step each); Delete removes it; C toggles its incoming edge between line and curve.
  function handleNodeKey(event: KeyboardEvent, subpath: number, node: number) {
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      actions.deleteNode(subpath, node);
      return;
    }
    if (event.key === "c" || event.key === "C") {
      event.preventDefault();
      actions.toggleCurve(subpath, node);
      return;
    }
    const delta = arrowDelta(event.key);
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? NUDGE_FAST : NUDGE;
    actions.nudgeNode(subpath, node, delta[0] * step, delta[1] * step);
  }

  // Arrow keys move one control point; the live update plus checkpoint makes each press its own undo step.
  function handleControlKey(event: KeyboardEvent, subpath: number, node: number, which: "c1" | "c2", point: FillRulePoint) {
    const delta = arrowDelta(event.key);
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? NUDGE_FAST : NUDGE;
    actions.moveControl(subpath, node, which, { x: point.x + delta[0] * step, y: point.y + delta[1] * step });
    actions.commitDrag();
  }

  // Arrow keys walk the plumb bob across the table.
  function handleProbeKey(event: KeyboardEvent) {
    const delta = arrowDelta(event.key);
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? NUDGE_FAST : NUDGE;
    actions.setProbe({ ...probe, x: clamp(probe.x + delta[0] * step, 0, CANVAS_SIZE), y: clamp(probe.y + delta[1] * step, 0, CANVAS_SIZE) });
  }

  // Right/Down turn the plumb line clockwise, Left/Up anticlockwise — the same sense as the angle on screen.
  function handleAimKey(event: KeyboardEvent) {
    const delta = arrowDelta(event.key);
    if (!delta) return;
    event.preventDefault();
    const direction = delta[0] + delta[1];
    const step = event.shiftKey ? TURN_FAST : TURN;
    actions.setProbe({ ...probe, angle: normaliseAngle(Math.round((probe.angle + direction * step) / step) * step) });
  }

  // The glass for one rule: real browser fill-rule rendering normally, or the scanline winding map when it's switched on.
  function renderGlass(rule: FillRuleName) {
    if (view.windingMap) {
      return (
        <>
          {TINT_BUCKETS.map(({ key, className }) => (
            <path key={key} className={className} d={geometry.map.tints[key]} shapeRendering="crispEdges" />
          ))}
          {rule === "evenodd" && <path d={geometry.map.evenEnclosed} fill={`url(#${ids.clear})`} shapeRendering="crispEdges" />}
        </>
      );
    }
    return (
      <>
        <path className={`pane-${rule}`} d={geometry.d} fillRule={rule} />
        <path className="pane-texture" d={geometry.d} fillRule={rule} fill={`url(#${ids.texture})`} />
      </>
    );
  }

  // Overlay mode: hatched violet where only nonzero fills, solid glass where both rules agree (evenodd is always a subset of nonzero).
  function renderOverlay() {
    if (view.windingMap) return renderGlass("evenodd");
    return (
      <>
        <path d={geometry.d} fillRule="nonzero" fill={`url(#${ids.hatch})`} />
        {renderGlass("evenodd")}
      </>
    );
  }

  const radians = (probe.angle * Math.PI) / 180;
  const dir = { x: Math.cos(radians), y: Math.sin(radians) };
  // The chip side is the ray's anticlockwise normal, so labels sit above a rightward ray and alternate sides to avoid stacking.
  const normal = { x: dir.y, y: -dir.x };
  const aim = { x: probe.x + dir.x * AIM_RADIUS, y: probe.y + dir.y * AIM_RADIUS };
  const tabIndex = primary ? 0 : -1;
  const hiddenHandles = primary ? undefined : true;

  const verdicts: Array<{ rule: FillRuleName; inside: boolean }> =
    variant === "nonzero"
      ? [{ rule: "nonzero", inside: ray.nonzeroInside }]
      : variant === "evenodd"
        ? [{ rule: "evenodd", inside: ray.evenoddInside }]
        : [
            { rule: "nonzero", inside: ray.nonzeroInside },
            { rule: "evenodd", inside: ray.evenoddInside }
          ];

  return (
    <>
      <PaneFrame>
        <Nameplate>
          <code>{VARIANT_LABEL[variant]}</code>
          <span>
            {verdicts.map(({ rule, inside }) => (
              <VerdictTag key={rule} data-rule={rule} data-inside={flag(inside)}>
                {verdicts.length > 1 && `${rule}: `}
                {inside ? "filled" : "empty"}
              </VerdictTag>
            ))}
          </span>
        </Nameplate>
        <TableSvg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          data-tool={tool}
          role="group"
          aria-label={
            primary
              ? `Light table showing ${VARIANT_LABEL[variant]}. ${tool === "draw" ? "Click to add a point to the active subpath." : "Click to cast the ray from that point."} Tab to the points and the plumb bob to move them with the arrow keys.`
              : `Light table showing ${VARIANT_LABEL[variant]}, mirroring the first pane.`
          }
          onPointerMove={handleMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={() => actions.setHoverProbe(null)}
          onClick={handleClick}
        >
          <defs>
            <pattern id={ids.texture} width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <path className="streak" d="M-5 14 C 12 8, 30 20, 65 12" />
              <path className="streak" d="M-5 44 C 20 40, 34 52, 65 46" opacity="0.6" />
              <circle className="seed" cx="18" cy="30" r="1.4" />
              <circle className="seed" cx="44" cy="6" r="1" />
              <circle className="seed" cx="52" cy="34" r="1.6" />
            </pattern>
            <pattern id={ids.hatch} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line className="hatch-line" x1="0" y1="0" x2="0" y2="9" />
            </pattern>
            <pattern id={ids.clear} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect className="clear-wash" width="10" height="10" />
              <line className="clear-line" x1="0" y1="0" x2="0" y2="10" />
            </pattern>
            <clipPath id={ids.left}>
              <rect x="0" y="0" width={view.split} height={CANVAS_SIZE} />
            </clipPath>
            <clipPath id={ids.right}>
              <rect x={view.split} y="0" width={CANVAS_SIZE - view.split} height={CANVAS_SIZE} />
            </clipPath>
          </defs>

          {/* Glass. */}
          {(variant === "nonzero" || variant === "evenodd") && renderGlass(variant)}
          {variant === "split" && (
            <>
              <g clipPath={`url(#${ids.left})`}>{renderGlass("nonzero")}</g>
              <g clipPath={`url(#${ids.right})`}>{renderGlass("evenodd")}</g>
            </>
          )}
          {variant === "overlay" && renderOverlay()}

          {/* Leaded came — a heavy lead stroke with a lighter heart line, the active subpath's heart picked out in amber. */}
          <path className="came" d={geometry.d} />
          {subpaths.map((subpath, index) => (
            <path key={index} className="came-heart" data-active={flag(index === activeSubpath)} d={serialisePathData([subpath])} />
          ))}

          {/* Direction chevrons along each subpath. */}
          {view.arrows &&
            geometry.arrows.map((arrow, index) => (
              <path
                key={index}
                className="chevron"
                data-active={flag(arrow.subpath === activeSubpath)}
                d="M-6 -6 L6 0 L-6 6 L-3 0 Z"
                transform={`translate(${formatNumber(arrow.x)} ${formatNumber(arrow.y)}) rotate(${formatNumber(arrow.angle)})`}
              />
            ))}

          {/* Split seam, draggable, labelled on each side. */}
          {variant === "split" && (
            <>
              <line className="seam" x1={view.split} y1={0} x2={view.split} y2={CANVAS_SIZE} />
              <text className="seam-label" x={view.split - 8} y={20} textAnchor="end">
                nonzero
              </text>
              <text className="seam-label" x={view.split + 8} y={20}>
                evenodd
              </text>
              <Handle data-handle="" data-dragging={flag(activeId === "seam")} aria-hidden="true" onPointerDown={beginDrag("seam")}>
                <rect className="hit" x={view.split - 12} y={0} width={24} height={CANVAS_SIZE} />
              </Handle>
            </>
          )}

          {/* The laser plumb line. */}
          <line className="laser-glow" x1={probe.x} y1={probe.y} x2={probe.x + dir.x * RAY_LENGTH} y2={probe.y + dir.y * RAY_LENGTH} />
          <line className="laser-core" x1={probe.x} y1={probe.y} x2={probe.x + dir.x * RAY_LENGTH} y2={probe.y + dir.y * RAY_LENGTH} />

          {/* Crossings: an arrow along the edge's drawing direction, a solder blob, and the ±1 chip. */}
          {ray.crossings.map((crossing, index) => {
            const t = (crossing.tangent * Math.PI) / 180;
            const tx = Math.cos(t);
            const ty = Math.sin(t);
            const side = index % 2 === 0 ? 1 : -1;
            const chip = { x: crossing.x + normal.x * 20 * side, y: crossing.y + normal.y * 20 * side };
            return (
              <g key={index} data-sign={crossing.sign} pointerEvents="none">
                <line className="crossing-arrow" x1={crossing.x - tx * 15} y1={crossing.y - ty * 15} x2={crossing.x + tx * 11} y2={crossing.y + ty * 11} />
                <path
                  className="crossing-arrow-head"
                  d="M0 -5 L9 0 L0 5 Z"
                  transform={`translate(${formatNumber(crossing.x + tx * 11)} ${formatNumber(crossing.y + ty * 11)}) rotate(${formatNumber(crossing.tangent)})`}
                />
                <circle className="solder" cx={crossing.x} cy={crossing.y} r={4.5} />
                <rect className="crossing-chip" x={chip.x - 14} y={chip.y - 9} width={28} height={18} rx={9} />
                <text className="crossing-label" x={chip.x} y={chip.y + 4} textAnchor="middle">
                  {formatSigned(crossing.sign)}
                </text>
              </g>
            );
          })}

          {/* Control arms and handles for the selected anchor's two neighbouring control points. */}
          {selection &&
            (() => {
              const nodes = subpaths[selection.subpath]?.nodes ?? [];
              const anchor = nodes[selection.node];
              if (!anchor) return null;
              const nextIndex = (selection.node + 1) % nodes.length;
              const controls = [
                { which: "c2" as const, node: selection.node, point: anchor.c2 },
                { which: "c1" as const, node: nextIndex, point: nodes.length > 1 ? nodes[nextIndex].c1 : undefined }
              ];
              return controls.map(({ which, node, point }) => {
                if (!point) return null;
                const id = `${which}:${selection.subpath}:${node}`;
                return (
                  <g key={id}>
                    <ControlArm x1={anchor.x} y1={anchor.y} x2={point.x} y2={point.y} />
                    <Handle
                      data-handle=""
                      data-dragging={flag(activeId === id)}
                      tabIndex={tabIndex}
                      aria-hidden={hiddenHandles}
                      role="button"
                      aria-roledescription="draggable control point"
                      aria-label={`Control point at ${formatNumber(point.x)}, ${formatNumber(point.y)}. Arrow keys move it.`}
                      onPointerDown={beginDrag(id)}
                      onKeyDown={(event) => handleControlKey(event, selection.subpath, node, which, point)}
                    >
                      <circle className="hit" cx={point.x} cy={point.y} r={12} />
                      <circle className="focus-ring" cx={point.x} cy={point.y} r={9} />
                      <rect className="control" x={point.x - 4.5} y={point.y - 4.5} width={9} height={9} transform={`rotate(45 ${point.x} ${point.y})`} />
                    </Handle>
                  </g>
                );
              });
            })()}

          {/* Anchors — node 0 of each subpath is square, marking where its drawing order starts. */}
          {subpaths.map((subpath, s) =>
            subpath.nodes.map((node, n) => {
              const id = `node:${s}:${n}`;
              const isActive = s === activeSubpath;
              const isSelected = selection?.subpath === s && selection.node === n;
              const radius = isActive ? 6.5 : 5;
              return (
                <Handle
                  key={id}
                  data-handle=""
                  data-active-subpath={flag(isActive)}
                  data-selected={flag(isSelected)}
                  data-dragging={flag(activeId === id)}
                  tabIndex={tabIndex}
                  aria-hidden={hiddenHandles}
                  role="button"
                  aria-roledescription="draggable point"
                  aria-label={`Subpath ${s + 1}, point ${n + 1}${n === 0 ? " (start)" : ""} at ${formatNumber(node.x)}, ${formatNumber(node.y)}. Arrow keys move it, Delete removes it, C toggles a curve.`}
                  onFocus={() => actions.select({ subpath: s, node: n })}
                  onPointerDown={(event) => {
                    actions.select({ subpath: s, node: n });
                    beginDrag(id)(event);
                  }}
                  onKeyDown={(event) => handleNodeKey(event, s, n)}
                >
                  <circle className="hit" cx={node.x} cy={node.y} r={13} />
                  <circle className="focus-ring" cx={node.x} cy={node.y} r={radius + 4} />
                  {n === 0 ? (
                    <rect className="vertex" x={node.x - radius} y={node.y - radius} width={radius * 2} height={radius * 2} rx={1.5} />
                  ) : (
                    <circle className="vertex" cx={node.x} cy={node.y} r={radius} />
                  )}
                </Handle>
              );
            })
          )}

          {/* The plumb bob (ray origin) and its aim knob. */}
          <line className="aim-arm" x1={probe.x} y1={probe.y} x2={aim.x} y2={aim.y} pointerEvents="none" />
          <Handle
            data-handle=""
            data-dragging={flag(activeId === "aim")}
            tabIndex={tabIndex}
            aria-hidden={hiddenHandles}
            role="button"
            aria-roledescription="draggable aim"
            aria-label={`Ray direction ${formatNumber(normaliseAngle(probe.angle))} degrees. Arrow keys turn it.`}
            onPointerDown={beginDrag("aim")}
            onKeyDown={handleAimKey}
          >
            <circle className="hit" cx={aim.x} cy={aim.y} r={13} />
            <circle className="focus-ring" cx={aim.x} cy={aim.y} r={10} />
            <circle className="knob" cx={aim.x} cy={aim.y} r={6} />
          </Handle>
          <Handle
            data-handle=""
            data-dragging={flag(activeId === "probe")}
            tabIndex={tabIndex}
            aria-hidden={hiddenHandles}
            role="button"
            aria-roledescription="draggable point"
            aria-label={`Ray origin at ${formatNumber(probe.x)}, ${formatNumber(probe.y)}. Arrow keys move it.`}
            onPointerDown={beginDrag("probe")}
            onKeyDown={handleProbeKey}
          >
            <circle className="hit" cx={probe.x} cy={probe.y} r={14} />
            <circle className="focus-ring" cx={probe.x} cy={probe.y} r={11} />
            <path className="bob" d={`M${probe.x} ${probe.y - 9} L${probe.x + 6} ${probe.y} L${probe.x} ${probe.y + 9} L${probe.x - 6} ${probe.y} Z`} />
          </Handle>
        </TableSvg>
      </PaneFrame>
    </>
  );
}

GlassPanel.displayName = "GlassPanel";
