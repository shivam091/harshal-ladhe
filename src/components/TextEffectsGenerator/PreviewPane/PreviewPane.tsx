import type { CSSProperties, JSX } from "react";
import { compileGradientFillDeclarations, compileTextShadowValue } from "@/utils/text-effects";
import type { PreviewPaneProps } from "@/interfaces/text-effects";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import { Stage, SpotlightGlow, DustMotes, StageText } from "@/components/TextEffectsGenerator/PreviewPane/PreviewPane.styles";

// Converts compileGradientFillDeclarations' ordered CSS pairs into a React style object — kept local to the preview rather than a shared utility, since it's a one-line fold only this component needs (ExportPanel reads the same declarations as plain CSS text instead, via a different formatter).
function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

/*
  The tool's flagship flourish: the live text rendered large on its own dark, spotlit stage — see
  PreviewPane.styles.ts's own comment on why that backdrop stays fixed-dark regardless of the site's
  theme. SpotlightGlow and DustMotes are purely ambient (aria-hidden, reduced-motion-safe); the text
  itself is always the actual subject rendered through compileTextShadowValue/
  compileGradientFillDeclarations, the same compilers ExportPanel and PresetGallery read from.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const textShadow = compileTextShadowValue(state.shadowLayers);
  const fillStyle: CSSProperties = state.gradientFill.enabled ? declarationsToStyle(compileGradientFillDeclarations(state.gradientFill)) : { color: state.textColor };

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Stage</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Stage>
            <SpotlightGlow aria-hidden="true" />
            <DustMotes aria-hidden="true" />
            <StageText style={{ fontSize: `${state.fontSize}px`, fontWeight: state.fontWeight, textShadow, ...fillStyle }}>{state.text || "Type something"}</StageText>
          </Stage>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
