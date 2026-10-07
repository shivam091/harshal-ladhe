import type { JSX } from "react";
import { viewboxExplorerPresets } from "@/data/viewbox-explorer-presets";
import { computeViewBoxTransform, formatPreserveAspectRatio } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { Grid, PresetCard, Thumb, PresetName, PresetHint } from "@/components/ViewboxExplorer/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Room around each thumbnail's paper, so a slice preset's overhang still shows inside the well.
const THUMB_PAD = 0.35;

/*
  A contact sheet of framings. Each thumbnail is the preset's own paper with its mapped viewBox
  drawn by the same transform the print uses — a borders preset shows the frame inside the paper,
  a crop preset shows it spilling past — so the cards preview the idea without rendering the art.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Contact sheet</PanelTitle>
        <Grid>
          {viewboxExplorerPresets.map((preset) => {
            const { width, height } = preset.viewport;
            const mapped = computeViewBoxTransform(preset.viewBox, preset.viewport, preset.align, preset.meetOrSlice).mapped;
            const pad = Math.max(width, height) * THUMB_PAD;
            return (
              <PresetCard
                key={preset.slug}
                type="button"
                onClick={() => actions.applyPreset(preset)}
                aria-label={`Load the ${preset.name} preset: ${preset.hint}`}
              >
                <Thumb viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`} aria-hidden="true">
                  <rect width={width} height={height} fill="var(--color-bg-default)" />
                  <rect
                    x={mapped.x}
                    y={mapped.y}
                    width={mapped.width}
                    height={mapped.height}
                    fill="var(--safelight)"
                    fillOpacity={0.25}
                    stroke="var(--safelight)"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                </Thumb>
                <PresetName>{preset.name}</PresetName>
                <PresetHint>
                  {preset.hint} · <code>{formatPreserveAspectRatio(preset.align, preset.meetOrSlice)}</code>
                </PresetHint>
              </PresetCard>
            );
          })}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
