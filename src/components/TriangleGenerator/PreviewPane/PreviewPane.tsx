import type { CSSProperties, JSX } from "react";
import { compileTriangleDeclarations } from "@/utils/triangle";
import type { PreviewPaneProps } from "@/interfaces/triangle";
import { PreviewStage, Shape } from "@/components/TriangleGenerator/PreviewPane/PreviewPane.styles";

// Converts compileTriangleDeclarations' ordered CSS pairs into a React style object — kept local to the preview rather than a shared utility, since it's a one-line fold only this component needs (ExportPanel reads the same declarations as plain CSS text instead, via a different formatter).
function declarationsToStyle(declarations: Array<[string, string]>): CSSProperties {
  return Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
}

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <PreviewStage style={{ background: state.pageColor }}>
        <Shape style={declarationsToStyle(compileTriangleDeclarations(state))} />
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
