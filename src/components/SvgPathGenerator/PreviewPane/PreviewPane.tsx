import type { JSX } from "react";
import { compilePathData } from "@/utils/svg-path";
import PathOverlay from "@/components/SvgPathGenerator/PathOverlay/PathOverlay";
import type { PreviewPaneProps } from "@/interfaces/svg-path";
import { PreviewStage, RenderedSvg } from "@/components/SvgPathGenerator/PreviewPane/PreviewPane.styles";

/*
  The bounded stage the path renders within, exactly as it will look wherever the exported markup
  gets dropped — PathOverlay layers the draggable handles on top, sharing the same 0-100 viewBox so a
  handle's position always lines up with the vertex it edits.
*/
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const { vertices, closed, strokeColor, strokeWidth, lineCap, lineJoin, fillEnabled, fillColor, selection } = state;

  return (
    <>
      <PreviewStage>
        <RenderedSvg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={compilePathData(vertices, closed)}
            fill={fillEnabled ? fillColor : "none"}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin={lineJoin}
          />
        </RenderedSvg>

        <PathOverlay vertices={vertices} closed={closed} selection={selection} actions={actions} />
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
