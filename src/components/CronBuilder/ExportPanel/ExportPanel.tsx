"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCrontabLine, toGithubActionsYaml, toKubernetesCronJob } from "@/utils/cron-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { Segmented, Segment } from "@/components/CronBuilder/ExportPanel/ExportPanel.styles";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/CronBuilder/CronBuilder.styles";
import type { ExportPanelProps } from "@/interfaces/cron-builder";

// Three real places a cron string actually gets pasted — a bare crontab line, a GitHub Actions workflow schedule, and a Kubernetes CronJob manifest — reached through utils/cron-export.ts, which all three read from the same 5 fields via toCrontabLine.
const FORMATS = [
  { id: "crontab", label: "Crontab", language: "bash", build: toCrontabLine },
  { id: "github", label: "GitHub Actions", language: "yaml", build: toGithubActionsYaml },
  { id: "kubernetes", label: "Kubernetes", language: "yaml", build: toKubernetesCronJob }
] as const;

export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("crontab");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Export</PanelTitle>
          <Segmented role="tablist" aria-label="Export format">
            {FORMATS.map((f) => (
              <Segment
                key={f.id}
                role="tab"
                type="button"
                aria-selected={f.id === activeFormat}
                data-selected={f.id === activeFormat ? "true" : undefined}
                onClick={() => setActiveFormat(f.id)}
              >
                {f.label}
              </Segment>
            ))}
          </Segmented>
        </PanelHeader>
        <PanelBody>
          <CodeBlockWrapper>
            <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
            <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
            <Shimmer trigger={copyTrigger} />
          </CodeBlockWrapper>
        </PanelBody>
      </Panel>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
