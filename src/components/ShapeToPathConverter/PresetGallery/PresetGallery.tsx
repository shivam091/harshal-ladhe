import type { JSX } from "react";
import { shapeToPathPresets } from "@/data/shape-to-path-presets";
import { buildPathData, convertShape } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { SectionCard, PanelTitle } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import { Grid, PresetButton, PresetSwatch, PresetLabel } from "@/components/ShapeToPathConverter/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Thumbnails are drawn from each preset's converted path, which doubles as a visual check that every example converts.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Worked examples</PanelTitle>
        <Grid>
          {shapeToPathPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} example, a <${preset.shape.kind}>`}>
              <PresetSwatch viewBox="0 0 100 100" aria-hidden="true">
                <path
                  d={buildPathData(convertShape(preset.shape).steps, "absolute", 2)}
                  fill="color-mix(in srgb, var(--book-ink) 12%, transparent)"
                  stroke="var(--book-ink)"
                  strokeWidth={5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </PresetSwatch>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
