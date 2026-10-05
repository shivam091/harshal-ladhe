import type { JSX } from "react";
import { openGraphPresets } from "@/data/open-graph-presets";
import { Grid, PresetCard, PresetName, PresetMeta } from "@/components/OpenGraphPreview/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import type { PresetGalleryProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Each preset replaces the whole form in one undoable step, so trying one never costs the current draft.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {openGraphPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetMeta>{preset.blurb}</PresetMeta>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
