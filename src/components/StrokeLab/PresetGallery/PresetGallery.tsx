import type { JSX } from "react";
import { strokeLabPresets } from "@/data/stroke-lab-presets";
import { dashArrayValue, dashesAreActive } from "@/components/StrokeLab/StrokeLab.utils";
import { NotionCard, CardTitle } from "@/components/StrokeLab/StrokeLab.styles";
import { Drawer, ThreadCard, SampleSvg, CardName, CardBlurb } from "@/components/StrokeLab/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  The pattern drawer. Each card's sample is a real stroked line with the preset's dash pattern,
  cap and colour, so the drawer previews itself without rendering every subject.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <NotionCard>
        <CardTitle>Pattern drawer</CardTitle>
        <Drawer>
          {strokeLabPresets.map((preset) => {
            const dashes = preset.state.dashes ?? [];
            return (
              <ThreadCard key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} preset: ${preset.blurb}`}>
                <SampleSvg viewBox="0 0 160 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  <line
                    x1={12}
                    x2={148}
                    y1={12}
                    y2={12}
                    stroke={preset.state.strokeColour ?? "var(--haber-thread)"}
                    strokeWidth={Math.min(10, preset.state.strokeWidth ?? 6)}
                    strokeLinecap={preset.state.linecap ?? "butt"}
                    strokeDasharray={dashesAreActive(dashes) ? dashArrayValue(dashes) : undefined}
                  />
                </SampleSvg>
                <CardName>{preset.name}</CardName>
                <CardBlurb>{preset.blurb}</CardBlurb>
              </ThreadCard>
            );
          })}
        </Drawer>
      </NotionCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
