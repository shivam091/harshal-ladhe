import type { CSSProperties, JSX } from "react";
import { compileGradientFillDeclarations, compileTextShadowValue } from "@/utils/text-effects";
import { textEffectsPresets } from "@/data/text-effects-presets";
import { Grid, PresetStage, PresetSample, PresetLabel } from "@/components/TextEffectsGenerator/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import type { PresetGalleryProps, TextEffectsPresetMeta } from "@/interfaces/text-effects";

function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

// A small "Ag" sample rendered with the preset's own shadow/gradient/colors on its own page color — a thumbnail that IS the effect at reduced size, not a separate hand-drawn icon standing in for it.
function sampleStyle(preset: TextEffectsPresetMeta): CSSProperties {
  const textShadow = compileTextShadowValue(preset.shadowLayers);
  const fillStyle = preset.gradientFill.enabled ? declarationsToStyle(compileGradientFillDeclarations(preset.gradientFill)) : { color: preset.textColor };
  return { textShadow, ...fillStyle };
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {textEffectsPresets.map((preset) => (
            <PresetStage key={preset.slug} type="button" style={{ background: preset.pageColor }} onClick={() => actions.applyPreset(preset)}>
              <PresetSample style={sampleStyle(preset)}>Ag</PresetSample>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetStage>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
