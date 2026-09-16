import type { CSSProperties, JSX } from "react";
import { compileGradientFillDeclarations, compileTextShadowValue } from "@/utils/text-effects";
import { textEffectsPresets } from "@/data/text-effects-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import { Grid, SpecimenCard, SpecimenSample, SpecimenLabel } from "@/components/TextEffectsGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps, TextEffectsPresetMeta } from "@/interfaces/text-effects";

// Converts compileGradientFillDeclarations' ordered CSS pairs into a React style object — its own copy rather than importing PreviewPane's (that one is a private helper local to its own file, same pattern BoxShadowGenerator's PresetGallery follows by calling compileBoxShadowValue directly rather than reaching into PreviewPane).
function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

// Renders each preset's "Ag" sample with its own shadow/gradient/color exactly as PreviewPane would — a thumbnail that IS the effect at reduced size, not a separate hand-drawn icon standing in for it.
function sampleStyle(preset: TextEffectsPresetMeta): CSSProperties {
  const textShadow = compileTextShadowValue(preset.shadowLayers);
  const fillStyle = preset.gradientFill.enabled ? declarationsToStyle(compileGradientFillDeclarations(preset.gradientFill)) : { color: preset.textColor };
  return { textShadow, ...fillStyle };
}

// A gallery of curated starting looks — neon, 3D, fire, glitch, emboss, chrome, sunset, and outline — each swapping in a whole shadow/gradient/color set at once while leaving the user's own typed text untouched (see applyPreset's own comment).
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Presets</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {textEffectsPresets.map((preset) => (
              <SpecimenCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <SpecimenSample style={{ background: preset.pageColor, ...sampleStyle(preset) }}>Ag</SpecimenSample>
                <SpecimenLabel>{preset.name}</SpecimenLabel>
              </SpecimenCard>
            ))}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
