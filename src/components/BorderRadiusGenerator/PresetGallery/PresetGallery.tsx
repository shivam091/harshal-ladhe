import type { JSX } from "react";
import { compileBlobValue } from "@/utils/border-radius";
import { borderRadiusPresets } from "@/data/border-radius-presets";
import { CORNER_NAMES } from "@/interfaces/border-radius";
import type { BorderRadiusEditorState, BorderRadiusPresetMeta, CornerName, CornerRadius, PresetGalleryProps } from "@/interfaces/border-radius";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import { Grid, ShelfTile, ShelfStage, ShelfPiece, ShelfLabel } from "@/components/BorderRadiusGenerator/PresetGallery/PresetGallery.styles";

// Must match ShelfPiece's own rendered size (2rem = 32px) — see that styled-component's own comment for why clip-path forces this 1:1 relationship rather than allowing CSS to just scale a full-size thumbnail down.
const THUMBNAIL_SIZE = 32;

/*
  Scales a preset's corners (authored at its own, much larger, `size`) down to THUMBNAIL_SIZE before
  compiling — a rounded family would visually survive an unscaled thumbnail fine (border-radius
  just clamps an overflowing value), but clip-path's path() coordinates are absolute px in the
  element's own box, so an unscaled squircle preset would clip almost the entire tiny tile away.
*/
function previewValue(preset: BorderRadiusPresetMeta): { property: "border-radius" | "clip-path"; value: string } {
  const scale = THUMBNAIL_SIZE / preset.size;
  const scaleCorner = (corner: CornerRadius): CornerRadius => ({ h: corner.h * scale, v: corner.v * scale });
  const corners = Object.fromEntries(CORNER_NAMES.map((name) => [name, scaleCorner(preset.corners[name])])) as Record<CornerName, CornerRadius>;

  const state: BorderRadiusEditorState = {
    family: preset.family,
    corners,
    uniform: false,
    curvature: preset.curvature,
    surfaceColor: preset.surfaceColor,
    pageColor: preset.pageColor,
    size: THUMBNAIL_SIZE,
    selectedCorner: null
  };
  return compileBlobValue(state);
}

// Curated finished shapes on display, each a whole "piece" (shape + clay color + worktable color) ready to pick up in one click — the tool's counterpart to FamilyControls' raw shape-only swatches.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Preset Shelf</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Grid>
            {borderRadiusPresets.map((preset) => {
              const { property, value } = previewValue(preset);
              return (
                <ShelfTile key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
                  <ShelfStage style={{ background: preset.pageColor }}>
                    <ShelfPiece style={{ background: preset.surfaceColor, borderRadius: property === "border-radius" ? value : "0", clipPath: property === "clip-path" ? value : "none" }} />
                  </ShelfStage>
                  <ShelfLabel>{preset.name}</ShelfLabel>
                </ShelfTile>
              );
            })}
          </Grid>
        </PanelBody>
      </Panel>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
