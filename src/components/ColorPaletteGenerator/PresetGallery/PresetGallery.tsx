import type { JSX } from "react";
import { colorPalettePresets } from "@/data/color-palette-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import { Grid, TicketCard, Swatches, SwatchDot, TicketLabel } from "@/components/ColorPaletteGenerator/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/color-palette";

// Each ticket's three dots ARE the preset's own seed/foreground/background — a real preview of what applying it changes, not a separate hand-drawn thumbnail.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Swatch Library</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {colorPalettePresets.map((preset) => (
              <TicketCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <Swatches>
                  <SwatchDot style={{ background: preset.seedColor }} />
                  <SwatchDot style={{ background: preset.foreground }} />
                  <SwatchDot style={{ background: preset.background }} />
                </Swatches>
                <TicketLabel>{preset.name}</TicketLabel>
              </TicketCard>
            ))}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
