import type { CSSProperties, JSX } from "react";
import { colorForIndex, compileContainerStyle, hasAnyArea, listAreaNames } from "@/utils/grid-template-builder";
import type { PreviewPaneProps } from "@/interfaces/grid-template-builder";
import { PreviewStage, Grid, PlaceholderItem } from "@/components/GridTemplateBuilder/PreviewPane/PreviewPane.styles";

// compileContainerStyle's keys are already camelCase (React's own style-object convention) — this is a type-only cast, not a transform, kept local since only the preview renders these as inline styles (ExportPanel reads the same declarations as plain CSS text instead, via a different formatter).
function toStyle(style: Record<string, string>): CSSProperties {
  return style as CSSProperties;
}

/*
  Live preview: named areas (once enabled and at least one is painted) render as one colored box
  per area, placed purely by `grid-area` name; otherwise every track cell gets its own numbered
  box so an empty/tracks-only grid still reads as an actual grid rather than a blank rectangle.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const showAreas = state.areasEnabled && hasAnyArea(state.areas);
  const areaNames = showAreas ? listAreaNames(state.areas) : [];
  const cellCount = state.columns.length * state.rows.length;

  return (
    <>
      <PreviewStage>
        <Grid style={toStyle(compileContainerStyle(state))}>
          {showAreas
            ? areaNames.map((name, index) => (
                <PlaceholderItem key={name} style={{ gridArea: name, background: colorForIndex(index) }}>
                  {name}
                </PlaceholderItem>
              ))
            : Array.from({ length: cellCount }, (_, index) => (
                <PlaceholderItem key={index} style={{ background: colorForIndex(index) }}>
                  {index + 1}
                </PlaceholderItem>
              ))}
        </Grid>
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
