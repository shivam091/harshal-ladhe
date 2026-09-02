import type { CSSProperties, JSX } from "react";
import { compileBorderTrickDeclarations, computeClipPathPolygon } from "@/utils/triangle";
import { trianglePresets } from "@/data/triangle-presets";
import { Grid, PresetStage, PresetSample, PresetLabel } from "@/components/TriangleGenerator/PresetGallery/PresetGallery.styles";
import { SectionCard, PanelTitle } from "@/components/TriangleGenerator/TriangleGenerator.styles";
import type { PresetGalleryProps, TrianglePresetMeta } from "@/interfaces/triangle";

function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

// A small sample rendered with the preset's own technique/shape/direction at thumbnail scale (fixed 24x24 box) — a thumbnail that IS the shape, not a separate hand-drawn icon standing in for it.
function sampleStyle(preset: TrianglePresetMeta): CSSProperties {
  if (preset.technique === "border") return declarationsToStyle(compileBorderTrickDeclarations(preset.direction, 24, 24, preset.color));
  return { width: "24px", height: "24px", background: preset.color, clipPath: computeClipPathPolygon(preset.shape, preset.direction, preset.notch) };
}

export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {trianglePresets.map((preset) => (
            <PresetStage key={preset.slug} type="button" style={{ background: preset.pageColor }} onClick={() => actions.applyPreset(preset)}>
              <PresetSample style={sampleStyle(preset)} />
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetStage>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
