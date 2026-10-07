"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { EXPORT_FORMATS } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import { SectionCard, PanelTitle, PanelHint, ButtonRow, JewelButton } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import { TabRow, Tab } from "@/components/FillRuleVisualiser/ExportPanel/ExportPanel.styles";
import type { ExportPanelProps, FillRuleExportFormat, FillRuleName } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// Both rules are offered for export, since the point of the tool is deciding which one the shape needs.
const RULES: FillRuleName[] = ["nonzero", "evenodd"];

/*
  Multi-format export, mirroring the other goodies' ExportPanels: a tab per format, each a thin
  formatter over the one serialised d string, plus a rule switch so the same path can be copied out
  under either fill-rule.
*/
export default function ExportPanel({ d }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<FillRuleExportFormat["id"]>("svg");
  const [rule, setRule] = useState<FillRuleName>("evenodd");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = EXPORT_FORMATS.find((f) => f.id === activeFormat) ?? EXPORT_FORMATS[0];
  const code = format.build(d, rule);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Export</PanelTitle>
        <ButtonRow role="group" aria-label="Fill rule to export">
          {RULES.map((name) => (
            <JewelButton key={name} type="button" aria-pressed={rule === name} onClick={() => setRule(name)}>
              {name}
            </JewelButton>
          ))}
        </ButtonRow>
        <TabRow role="tablist" aria-label="Export format">
          {EXPORT_FORMATS.map((f) => (
            <Tab
              key={f.id}
              role="tab"
              type="button"
              aria-selected={f.id === activeFormat}
              data-selected={f.id === activeFormat ? "true" : undefined}
              onClick={() => setActiveFormat(f.id)}
            >
              {f.label}
            </Tab>
          ))}
        </TabRow>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
        {activeFormat === "clip-path" && (
          <PanelHint>
            <code>path()</code> coordinates are pixels from the element&apos;s top-left corner, so the box is sized to match the light table.
          </PanelHint>
        )}
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
