import type { JSX } from "react";
import { buildBezierPathD } from "@/utils/bezier";
import { easingCurvePresets } from "@/data/easing-curve-presets";
import { SectionCard, PanelTitle } from "@/components/EasingCurveEditor/EasingCurveEditor.styles";
import { Grid, PresetButton, PresetSvg, PresetCurve, PresetLabel } from "@/components/EasingCurveEditor/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/interfaces/easing-curve-editor";

const THUMBNAIL_SIZE = 32;

// The preset's own curve, plotted with the exact same buildBezierPathD call CurveGraph's underlying BezierGraph uses — a thumbnail that IS the curve, not a separate hand-drawn icon standing in for it.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Presets</PanelTitle>
        <Grid>
          {easingCurvePresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)}>
              <PresetSvg viewBox={`0 0 ${THUMBNAIL_SIZE} ${THUMBNAIL_SIZE}`} aria-hidden="true">
                <PresetCurve d={buildBezierPathD(preset.p1, preset.p2, THUMBNAIL_SIZE)} />
              </PresetSvg>
              <PresetLabel>{preset.name}</PresetLabel>
            </PresetButton>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
