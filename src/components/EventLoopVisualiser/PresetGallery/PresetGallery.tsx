import type { JSX } from "react";
import { eventLoopPresets } from "@/data/event-loop-presets";
import { SectionCard, PanelTitle } from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import { Grid, PresetButton, PresetName, PresetSummary } from "@/components/EventLoopVisualiser/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Text rather than thumbnails — a program's interesting part is the rule it shows, which a one-line summary says better than any miniature diagram.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {eventLoopPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetSummary>{preset.summary}</PresetSummary>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
