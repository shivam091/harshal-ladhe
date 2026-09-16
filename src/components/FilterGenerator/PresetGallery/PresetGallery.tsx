import type { JSX } from "react";
import { compileFilterValue } from "@/utils/filter";
import { filterPresets } from "@/data/filter-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import { Grid, Mount, Window, WindowPanel, MountLabel } from "@/components/FilterGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/filter";

// Every thumbnail renders on the same reference gradient (baked into Window's own CSS) regardless of a preset's own previewSubject — a photo would need per-thumbnail image loading for little benefit at this size, and the gradient alone already shows what each preset's functions actually do.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Slide Tray</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {filterPresets.map((preset) => {
              const value = compileFilterValue(preset);
              const isBackdrop = preset.target === "backdropFilter";
              return (
                <Mount key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                  <Window style={{ filter: isBackdrop ? "none" : value }}>
                    {isBackdrop && (
                      <WindowPanel style={{ backdropFilter: value, background: `color-mix(in srgb, ${preset.panelColor} ${preset.panelOpacity}%, transparent)` }} />
                    )}
                  </Window>
                  <MountLabel>{preset.name}</MountLabel>
                </Mount>
              );
            })}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
