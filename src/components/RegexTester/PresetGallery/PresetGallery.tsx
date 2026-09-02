import type { JSX } from "react";
import { regexTesterPresets } from "@/data/regex-tester-presets";
import { Grid, PresetCard, PresetName, PresetPattern } from "@/components/RegexTester/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/RegexTester/RegexTester.styles";
import type { PresetGalleryProps } from "@/interfaces/regex-tester";

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {regexTesterPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetName>{preset.name}</PresetName>
              <PresetPattern>/{preset.pattern}/{preset.flags}</PresetPattern>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
