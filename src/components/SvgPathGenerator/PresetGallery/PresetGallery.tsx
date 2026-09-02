import type { JSX } from "react";
import { compilePathData } from "@/utils/svg-path";
import { svgPathPresets } from "@/data/svg-path-presets";
import { MagicWandIcon } from "@/components/Icon";
import { SectionCard, PanelTitle } from "@/components/SvgPathGenerator/SvgPathGenerator.styles";
import { Grid, PresetButton, PresetSwatch, PresetLabel } from "@/components/SvgPathGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/svg-path";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {svgPathPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetSwatch viewBox="0 0 100 100">
                <path d={compilePathData(preset.vertices, preset.closed)} fill="none" stroke="var(--color-fg-accent)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </PresetSwatch>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
          <PresetButton type="button" onClick={actions.shuffle} aria-label="Shuffle: generate a random path, keeping the current open/closed setting">
            <MagicWandIcon size={20} aria-hidden="true" />
            <PresetLabel>Shuffle</PresetLabel>
          </PresetButton>
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
