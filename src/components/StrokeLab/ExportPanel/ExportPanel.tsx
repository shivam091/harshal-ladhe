"use client";

import type { JSX } from "react";
import { toCssSnippet, toJsxSnippet, toSvgAttributesSnippet } from "@/components/StrokeLab/StrokeLab.utils";
import CodeSampler from "@/components/StrokeLab/CodeSampler/CodeSampler";
import { NotionCard, CardTitle, CardHint } from "@/components/StrokeLab/StrokeLab.styles";
import type { ExportPanelProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  The current stroke as a copyable snippet in three dialects: presentation attributes on an <svg>,
  a CSS rule (with the marching keyframes and their reduced-motion opt-out when marching is on),
  and JSX. Defaults are left out so each snippet only says what's different.
*/
export default function ExportPanel({ state, geometry }: ExportPanelProps): JSX.Element {
  const samples = [
    { id: "svg", label: "SVG attributes", language: "xml", code: toSvgAttributesSnippet(state, geometry) },
    { id: "css", label: "CSS", language: "css", code: toCssSnippet(state) },
    { id: "jsx", label: "JSX", language: "tsx", code: toJsxSnippet(state, geometry) }
  ];

  return (
    <>
      <NotionCard>
        <CardTitle>Pattern slip</CardTitle>
        <CardHint>Every stroke property is also a CSS property, so the same stroke can live in markup or a stylesheet — CSS wins over presentation attributes when both are set.</CardHint>
        <CodeSampler label="Stroke snippet format" samples={samples} />
      </NotionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
