import type { JSX } from "react";
import { compileBoxShadowValue } from "@/utils/box-shadow";
import type { PreviewPaneProps } from "@/interfaces/box-shadow";
import { PreviewStage, Swatch } from "@/components/BoxShadowGenerator/PreviewPane/PreviewPane.styles";

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <PreviewStage style={{ background: state.pageColor }}>
        <Swatch style={{ background: state.surfaceColor, borderRadius: `${state.borderRadius}px`, boxShadow: compileBoxShadowValue(state) }} />
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
