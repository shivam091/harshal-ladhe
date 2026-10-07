"use client";

import { useMemo } from "react";
import type { JSX } from "react";
import { renderSvgTree } from "@/utils/svg-to-react-render";
import { lineDrawingPresets } from "@/data/line-drawing-animator-presets";
import { prepareArtwork } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import { SectionCard, PanelTitle } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import { Grid, PresetCard, PresetThumb, PresetName, PresetDescription } from "@/components/LineDrawingAnimator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

/*
  Correspondence cards for each preset, with a still thumbnail of the finished drawing. Thumbnails
  go through the same prepare-and-render path as the page, so they inherit its ink colour via
  currentColor and its own id prefixing.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  // Parsed once — the presets are static.
  const thumbnails = useMemo(
    () =>
      lineDrawingPresets.map((preset) => {
        const prepared = prepareArtwork(preset.source);
        return prepared.root ? renderSvgTree(prepared.root, { idPrefix: `ld-thumb-${preset.slug}-`, rootProps: { width: "100%", height: "100%", "aria-hidden": "true" } }) : null;
      }),
    []
  );

  return (
    <>
      <SectionCard aria-labelledby="ld-presets-title">
        <PanelTitle id="ld-presets-title">Correspondence</PanelTitle>
        <Grid>
          {lineDrawingPresets.map((preset, position) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} preset: ${preset.description}`}>
              <PresetThumb>{thumbnails[position]}</PresetThumb>
              <PresetName>{preset.name}</PresetName>
              <PresetDescription>{preset.description}</PresetDescription>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
