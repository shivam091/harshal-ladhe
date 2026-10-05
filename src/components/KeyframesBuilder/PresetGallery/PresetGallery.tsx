import type { JSX } from "react";
import { keyframesPresets } from "@/data/keyframes-builder-presets";
import { SectionCard, PanelTitle } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import { Grid, PresetButton, PresetSvg, PresetRule, PresetDiamond, PresetLabel } from "@/components/KeyframesBuilder/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Thumbnail coordinate space — 100 wide so a stop's offset is its x position directly.
const THUMB_WIDTH = 100;
// Short and wide, so the thumbnail reads as a track rather than a chart.
const THUMB_HEIGHT = 14;
// Big enough to read at tile size, small enough that 10%-spaced stops (shake) don't merge.
const DIAMOND_SIZE = 6;

/*
  Each thumbnail is the preset's own exposure track in miniature — diamonds at its real offsets —
  so the rhythm of a shake (eleven even beats) or a heartbeat (two quick beats then a rest) is
  visible before it's applied, rather than hidden behind a generic icon.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <SectionCard aria-labelledby="keyframes-presets-title">
        <PanelTitle id="keyframes-presets-title">Presets</PanelTitle>
        <Grid>
          {keyframesPresets.map((preset) => (
            <PresetButton key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Apply ${preset.name} preset`}>
              <PresetSvg viewBox={`0 0 ${THUMB_WIDTH} ${THUMB_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
                <PresetRule x1={0} y1={THUMB_HEIGHT / 2} x2={THUMB_WIDTH} y2={THUMB_HEIGHT / 2} vectorEffect="non-scaling-stroke" />
                {preset.stops.map((stop) => (
                  <PresetDiamond
                    key={stop.offset}
                    x={stop.offset - DIAMOND_SIZE / 2}
                    y={THUMB_HEIGHT / 2 - DIAMOND_SIZE / 2}
                    width={DIAMOND_SIZE}
                    height={DIAMOND_SIZE}
                    transform={`rotate(45 ${stop.offset} ${THUMB_HEIGHT / 2})`}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
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
