import type { JSX } from "react";
import { fillRulePresets } from "@/data/fill-rule-visualiser-presets";
import { SectionCard, PanelTitle } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import { Grid, PresetCard, Thumb, PresetName, PresetBlurb } from "@/components/FillRuleVisualiser/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// Thumbnails use each preset's d string as written — the browser renders arcs natively, so no parsing is needed just to preview.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Sample windows</PanelTitle>
        <Grid>
          {fillRulePresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} preset: ${preset.blurb}`}>
              <Thumb viewBox="0 0 800 400" aria-hidden="true">
                <path className="thumb-nonzero" d={preset.d} fillRule="nonzero" />
                <path className="thumb-evenodd" d={preset.d} fillRule="evenodd" transform="translate(400 0)" />
                <line className="thumb-mullion" x1={400} y1={0} x2={400} y2={400} />
              </Thumb>
              <PresetName>{preset.name}</PresetName>
              <PresetBlurb>{preset.blurb}</PresetBlurb>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
