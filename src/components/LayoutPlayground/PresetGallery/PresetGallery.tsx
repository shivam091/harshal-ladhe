import type { JSX } from "react";
import { compileContainerStyle, compileItemStyle } from "@/utils/layout-playground";
import { layoutPlaygroundPresets } from "@/data/layout-playground-presets";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/LayoutPlayground/LayoutPlayground.styles";
import { Grid, PresetTile, PresetSheet, PresetPart, PresetLabel } from "@/components/LayoutPlayground/PresetGallery/PresetGallery.styles";
import type { LayoutPresetMeta, PresetGalleryProps } from "@/interfaces/layout-playground";

// PresetSheet's own rendered size (3rem = 48px) — the scale factor below shrinks a preset's real, full-size container down to fit inside it via a single CSS transform rather than recomputing every track/gap value at a smaller unit, so the thumbnail is a genuine (if tiny) render of the same compiled styles the main drawing uses.
const STAGE_SIZE = 48;

// One preset's own miniature drawing — same compileContainerStyle/compileItemStyle calls PreviewPane's real drawing uses, scaled down to fit PresetSheet.
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
      <PresetSheet>
        <div style={{ ...containerStyle, inlineSize: `${preset.containerWidth}px`, blockSize: `${STAGE_SIZE / scale}px`, transform: `scale(${scale})`, transformOrigin: "center" }}>
          {preset.items.map((item) => (
            <PresetPart key={item.id} style={{ color: item.color, minInlineSize: "1.5rem", minBlockSize: "1.5rem", ...compileItemStyle(item, preset.mode) }} />
          ))}
        </div>
      </PresetSheet>
    </>
  );
}

// Curated starting layouts, each a whole drawing (mode, container config, and every item's own placement) ready to load in one click — spans both Flexbox and Grid presets since switching mode is one of this tool's two core features.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Presets</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {layoutPlaygroundPresets.map((preset) => (
              <PresetTile key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                <PresetThumbnail preset={preset} />
                <PresetLabel>{preset.name}</PresetLabel>
              </PresetTile>
            ))}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
