import type { JSX } from "react";
import type { AnchorSide } from "@/interfaces/popover-anchor-builder";
import { popoverAnchorBuilderPresets } from "@/data/popover-anchor-builder-presets";
import { Grid, PresetCard, PresetGlyph, PresetLabel } from "@/components/PopoverAnchorBuilder/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/PopoverAnchorBuilder/PopoverAnchorBuilder.styles";
import type { PresetGalleryProps } from "@/interfaces/popover-anchor-builder";

// Same compass glyphs AnchorSideControls uses, so a preset card's icon reads as "this is where it'll end up" before it's even applied.
const GLYPHS: Record<AnchorSide, string> = { top: "▲", right: "▶", bottom: "▼", left: "◀", center: "●" };

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {popoverAnchorBuilderPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetGlyph>{GLYPHS[preset.anchorSide]}</PresetGlyph>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
