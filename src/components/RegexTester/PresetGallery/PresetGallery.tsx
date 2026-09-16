import type { JSX } from "react";
import { regexTesterPresets } from "@/data/regex-tester-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { Grid, PresetCard, PresetName, PresetPattern } from "@/components/RegexTester/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/regex-tester";

// A grid of curated pattern/test-string pairs, each swapping in a whole scenario at once — deliberately spanning the constructs the explain panel and highlighter both handle, so loading one doubles as a tour of the tool itself.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Presets</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {regexTesterPresets.map((preset) => (
              <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <PresetName>{preset.name}</PresetName>
                <PresetPattern>
                  /{preset.pattern}/{preset.flags}
                </PresetPattern>
              </PresetCard>
            ))}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
