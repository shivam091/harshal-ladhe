import type { JSX } from "react";
import { compileGradientValue } from "@/utils/gradient";
import type { PreviewPaneProps } from "@/interfaces/gradient";
import { PreviewStage, Swatch } from "@/components/GradientGenerator/PreviewPane/PreviewPane.styles";

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <PreviewStage>
        <Swatch style={{ backgroundImage: compileGradientValue(state) }} />
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
