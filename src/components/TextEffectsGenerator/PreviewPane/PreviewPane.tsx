import type { CSSProperties, JSX } from "react";
import { compileGradientFillDeclarations, compileTextShadowValue } from "@/utils/text-effects";
import type { PreviewPaneProps } from "@/interfaces/text-effects";
import { PreviewStage, PreviewText } from "@/components/TextEffectsGenerator/PreviewPane/PreviewPane.styles";

// Converts compileGradientFillDeclarations' ordered CSS pairs into a React style object — kept local to the preview rather than a shared utility, since it's a one-line fold only this component needs (ExportPanel reads the same declarations as plain CSS text instead, via a different formatter).
function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const textShadow = compileTextShadowValue(state.shadowLayers);
  const fillStyle: CSSProperties = state.gradientFill.enabled ? declarationsToStyle(compileGradientFillDeclarations(state.gradientFill)) : { color: state.textColor };

  return (
    <>
      <PreviewStage style={{ background: state.pageColor }}>
        <PreviewText style={{ fontSize: `${state.fontSize}px`, fontWeight: state.fontWeight, textShadow, ...fillStyle }}>{state.text || "Type something"}</PreviewText>
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
