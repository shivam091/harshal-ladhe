import type { JSX } from "react";
import { compileFilterValue } from "@/utils/filter";
import type { PreviewPaneProps } from "@/interfaces/filter";
import { PreviewStage, GlassPanel } from "@/components/FilterGenerator/PreviewPane/PreviewPane.styles";

// A fixed, vivid multi-hue gradient — reads saturate/hue-rotate/grayscale/invert far more clearly than a flat color or a muted photo would, which is the point of defaulting to it over the site's own (comparatively low-saturation) portrait photos.
const REFERENCE_GRADIENT = "linear-gradient(135deg, #f97316 0%, #ec4899 33%, #8b5cf6 66%, #06b6d4 100%)";

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const backgroundImage = state.previewSubject === "gradient" ? REFERENCE_GRADIENT : `url(/assets/img/${state.previewImageId}.png)`;
  const value = compileFilterValue(state);

  return (
    <>
      <PreviewStage style={{ backgroundImage, filter: state.target === "filter" ? value : "none" }}>
        {state.target === "backdropFilter" && (
          <GlassPanel style={{ backdropFilter: value, background: `color-mix(in srgb, ${state.panelColor} ${state.panelOpacity}%, transparent)` }} />
        )}
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
