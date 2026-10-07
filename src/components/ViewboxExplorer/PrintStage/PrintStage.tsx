"use client";

import { useId } from "react";
import type { JSX } from "react";
import { renderSvgTree } from "@/utils/svg-to-react-render";
import {
  clamp,
  drawingAsGroup,
  formatMatrix,
  formatNumber,
  formatPreserveAspectRatio,
  formatViewBox,
  gridLines,
  gridStepFor,
  rectPath
} from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import {
  Baseboard,
  StageSvg,
  Paper,
  PrintSvg,
  Spill,
  PrintGridLine,
  ShadeBand,
  MappedOutline,
  PaperEdge,
  StageLabel,
  Legend,
  LegendSwatch
} from "@/components/ViewboxExplorer/PrintStage/PrintStage.styles";
import type { PrintBand, PrintStageProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Bands narrower than this (in print pixels) are left unlabelled — the text would be wider than the band.
const LABEL_MIN_BAND = 30;

// data-* booleans render the literal string "false" otherwise — this keeps idle lines free of stray attributes.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

/*
  The print on the baseboard. The drawing on the paper is a real nested <svg> with the chosen
  attributes, so the browser renders it; the spill beyond the paper, the mapped viewBox outline and
  the border/crop bands all come from this tool's own transform. When the two line up, the maths
  has matched the spec.
*/
export default function PrintStage({ drawing, extent, state, transform, overlays }: PrintStageProps): JSX.Element {
  const prefix = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const { width: paperWidth, height: paperHeight } = state.viewport;
  const { mapped, visible } = transform;
  const isMeet = state.align !== "none" && state.meetOrSlice === "meet";
  const isSlice = state.align !== "none" && state.meetOrSlice === "slice";

  const overhang = Math.max(0, -mapped.x, -mapped.y, mapped.x + mapped.width - paperWidth, mapped.y + mapped.height - paperHeight);
  const margin = clamp(overhang + 16, 40, 180);
  const stageWidth = Math.max(paperWidth + margin * 2, 280);
  const stageHeight = Math.max(paperHeight + margin * 2, 180);
  const stageX = -(stageWidth - paperWidth) / 2;
  const stageY = -(stageHeight - paperHeight) / 2;
  const paper = { x: 0, y: 0, width: paperWidth, height: paperHeight };

  const gridStep = gridStepFor(extent);
  const xLines = overlays.grid ? gridLines(visible.x, visible.width, gridStep) : [];
  const yLines = overlays.grid ? gridLines(visible.y, visible.height, gridStep) : [];

  // Border bands on the paper (meet) or overhang bands off it (slice), each with a centre for its label.
  const bands: PrintBand[] = [];
  if (isMeet) {
    const leftSize = mapped.x;
    const rightSize = paperWidth - (mapped.x + mapped.width);
    const topSize = mapped.y;
    const bottomSize = paperHeight - (mapped.y + mapped.height);
    if (leftSize >= LABEL_MIN_BAND) bands.push({ key: "left", x: leftSize / 2, y: paperHeight / 2, size: leftSize });
    if (rightSize >= LABEL_MIN_BAND) bands.push({ key: "right", x: paperWidth - rightSize / 2, y: paperHeight / 2, size: rightSize });
    if (topSize >= LABEL_MIN_BAND / 2) bands.push({ key: "top", x: paperWidth / 2, y: topSize / 2 + 4, size: topSize });
    if (bottomSize >= LABEL_MIN_BAND / 2) bands.push({ key: "bottom", x: paperWidth / 2, y: paperHeight - bottomSize / 2 + 4, size: bottomSize });
  }
  if (isSlice) {
    const leftSize = -mapped.x;
    const rightSize = mapped.x + mapped.width - paperWidth;
    const topSize = -mapped.y;
    const bottomSize = mapped.y + mapped.height - paperHeight;
    if (leftSize >= LABEL_MIN_BAND) bands.push({ key: "left", x: Math.max(stageX + 24, -leftSize / 2), y: paperHeight / 2, size: leftSize });
    if (rightSize >= LABEL_MIN_BAND) bands.push({ key: "right", x: Math.min(stageX + stageWidth - 24, paperWidth + rightSize / 2), y: paperHeight / 2, size: rightSize });
    if (topSize >= LABEL_MIN_BAND / 2) bands.push({ key: "top", x: paperWidth / 2, y: Math.max(stageY + 14, -topSize / 2 + 4), size: topSize });
    if (bottomSize >= LABEL_MIN_BAND / 2) bands.push({ key: "bottom", x: paperWidth / 2, y: Math.min(stageY + stageHeight - 6, paperHeight + bottomSize / 2 + 4), size: bottomSize });
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Print on the baseboard</PanelTitle>
        <Baseboard>
          <StageSvg
            viewBox={`${stageX} ${stageY} ${stageWidth} ${stageHeight}`}
            width={stageWidth}
            height={stageHeight}
            role="img"
            aria-label={`A ${paperWidth} by ${paperHeight} pixel print of the drawing with viewBox ${formatViewBox(state.viewBox)} and preserveAspectRatio ${formatPreserveAspectRatio(state.align, state.meetOrSlice)}`}
          >
            <defs>
              <pattern id={`${prefix}-hatch`} patternUnits="userSpaceOnUse" width={7} height={7} patternTransform="rotate(45)">
                <rect width={7} height={7} fill="var(--safelight)" fillOpacity={0.12} />
                <line x1={0} y1={0} x2={0} y2={7} stroke="var(--safelight)" strokeWidth={2.5} strokeOpacity={0.7} />
              </pattern>
            </defs>

            {drawing.tree && (
              <Spill transform={formatMatrix(transform)} aria-hidden="true">
                {renderSvgTree(drawingAsGroup(drawing.tree), { idPrefix: `${prefix}-s-` })}
              </Spill>
            )}

            <Paper x={0} y={0} width={paperWidth} height={paperHeight} />
            <PrintSvg
              x={0}
              y={0}
              width={paperWidth}
              height={paperHeight}
              viewBox={formatViewBox(state.viewBox)}
              preserveAspectRatio={formatPreserveAspectRatio(state.align, state.meetOrSlice)}
            >
              {xLines.map((x) => (
                <PrintGridLine key={`x${x}`} x1={x} y1={visible.y} x2={x} y2={visible.y + visible.height} data-axis={boolAttr(x === 0)} />
              ))}
              {yLines.map((y) => (
                <PrintGridLine key={`y${y}`} x1={visible.x} y1={y} x2={visible.x + visible.width} y2={y} data-axis={boolAttr(y === 0)} />
              ))}
              {drawing.tree && renderSvgTree(drawingAsGroup(drawing.tree), { idPrefix: `${prefix}-p-` })}
            </PrintSvg>

            {overlays.borders && isMeet && <ShadeBand d={`${rectPath(paper)} ${rectPath(mapped)}`} fill={`url(#${prefix}-hatch)`} />}
            {overlays.borders && isSlice && <ShadeBand d={`${rectPath(mapped)} ${rectPath(paper)}`} fill={`url(#${prefix}-hatch)`} />}
            {overlays.outline && <MappedOutline x={mapped.x} y={mapped.y} width={mapped.width} height={mapped.height} />}
            <PaperEdge x={0} y={0} width={paperWidth} height={paperHeight} />

            {overlays.borders &&
              bands.map((band) => (
                <StageLabel key={band.key} x={band.x} y={band.y} textAnchor="middle" data-tone="safelight">
                  {isMeet ? "border" : "cropped"} {formatNumber(band.size, 0)}px
                </StageLabel>
              ))}
            <StageLabel x={paperWidth / 2} y={paperHeight + 16} textAnchor="middle">
              {paperWidth} × {paperHeight} px
            </StageLabel>
          </StageSvg>
        </Baseboard>
        <Legend aria-label="Overlay key">
          <li>
            <LegendSwatch data-kind="outline" aria-hidden="true" />
            viewBox mapped onto the paper
          </li>
          <li>
            <LegendSwatch data-kind="borders" aria-hidden="true" />
            {isSlice ? "cropped off the paper" : "letterbox borders"}
          </li>
          <li>
            <LegendSwatch data-kind="spill" aria-hidden="true" />
            image spilling past the paper
          </li>
        </Legend>
      </SectionCard>
    </>
  );
}

PrintStage.displayName = "PrintStage";
