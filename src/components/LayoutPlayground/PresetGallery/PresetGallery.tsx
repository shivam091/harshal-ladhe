import type { JSX } from "react";
import { compileContainerStyle, compileItemStyle } from "@/utils/layout-playground";
import { layoutPlaygroundPresets } from "@/data/layout-playground-presets";
import { SectionCard, PanelTitle } from "@/components/LayoutPlayground/LayoutPlayground.styles";
import { Grid, PresetButton, PresetStage, PresetSwatchItem, PresetLabel } from "@/components/LayoutPlayground/PresetGallery/PresetGallery.styles";
import type { LayoutPresetMeta, PresetGalleryProps } from "@/interfaces/layout-playground";

// PresetStage's own rendered size (2.5rem = 40px) — the scale factor below shrinks a preset's real, full-size container down to fit inside it via a single CSS transform rather than recomputing every track/gap value at a smaller unit, so the thumbnail is a genuine (if tiny) render of the same compiled styles the main preview uses.
const STAGE_SIZE = 40;

function PresetThumbnail({ preset }: { preset: LayoutPresetMeta }): JSX.Element {
  const containerStyle = compileContainerStyle({
    mode: preset.mode,
    gap: preset.gap,
    containerWidth: preset.containerWidth,
    flexContainer: preset.flexContainer,
    gridContainer: preset.gridContainer,
    items: preset.items,
    selectedItemId: null
  });
  const scale = STAGE_SIZE / preset.containerWidth;

  return (
    <>
      <PresetStage>
        <div style={{ ...containerStyle, inlineSize: `${preset.containerWidth}px`, blockSize: `${STAGE_SIZE / scale}px`, transform: `scale(${scale})`, transformOrigin: "center" }}>
          {preset.items.map((item) => (
            <PresetSwatchItem key={item.id} style={{ background: item.color, minInlineSize: "1.5rem", minBlockSize: "1.5rem", ...compileItemStyle(item, preset.mode) }} />
          ))}
        </div>
      </PresetStage>
    </>
  );
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {layoutPlaygroundPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetThumbnail preset={preset} />
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
