import type { JSX } from "react";
import { motionPathPresets } from "@/data/motion-path-builder-presets";
import { STAGE_HEIGHT, STAGE_WIDTH, buildPathData } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { SectionCard, PanelTitle } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { Grid, PresetCard, PresetThumb, PresetName } from "@/components/MotionPathBuilder/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Static track thumbnails — a moving loco on every card would be a distraction, and five more animations for nothing.
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Layout plans</PanelTitle>
        <Grid>
          {motionPathPresets.map((preset) => (
            <PresetCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} layout`}>
              <PresetThumb viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden="true">
                <path d={buildPathData(preset.vertices, preset.closed)} fill="none" stroke="var(--rail-steel)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d={buildPathData(preset.vertices, preset.closed)}
                  fill="none"
                  stroke="var(--rail-sleeper)"
                  strokeWidth={8}
                  strokeDasharray="4 8"
                  strokeLinejoin="round"
                />
              </PresetThumb>
              <PresetName>{preset.name}</PresetName>
            </PresetCard>
          ))}
        </Grid>
      </SectionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
