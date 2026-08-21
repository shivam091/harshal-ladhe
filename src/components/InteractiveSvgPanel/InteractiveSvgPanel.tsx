"use client";

import { useState } from "react";
import type { JSX } from "react";
import type { InteractiveSvgPanelProps } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.types";
import type { SvgDemoValue, SvgDemoValues, SvgDemoControl } from "@/data/svg-demos";
import { getSvgDemoBySlug, resolveRangeMax } from "@/data/svg-demos";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import DemoControlField from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { PanelWrapper, PanelHeader, ControlsForm, PreviewPane } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.styles";

// Every demo opens on its registry defaults so the first render matches the authored example.
function getDefaultValues(controls: SvgDemoControl[]): SvgDemoValues {
  return Object.fromEntries(controls.map((control) => [control.id, control.defaultValue]));
}

/*
  One `values` object drives the controls, the generated source and the preview, so all three
  always agree.
*/
export default function InteractiveSvgPanel({ slug }: InteractiveSvgPanelProps): JSX.Element | null {
  const demo = getSvgDemoBySlug(slug);
  /*
    Hooks can't be called conditionally, so state/derived values are seeded unconditionally
    and the component bails out in JSX below when the slug doesn't resolve.
  */
  const [values, setValues] = useState<SvgDemoValues>(() => getDefaultValues(demo?.controls ?? []));
  const [copyTrigger, setCopyTrigger] = useState(0);
  const code = (demo?.render(values) ?? "").trim();
  const html = useHighlightedCode(code, "html");

  if (!demo) return null;

  const { controls } = demo;

  // Reclamps dependent ranges so a derived max is never exceeded (e.g. shrinking `width` pulls `rx` back within width / 2).
  function handleChange(id: string, value: SvgDemoValue): void {
    setValues((prev) => {
      const next = { ...prev, [id]: value };
      for (const control of controls) {
        if (control.type !== "range") continue;
        const max = resolveRangeMax(control, next);
        if (Number(next[control.id]) > max) next[control.id] = max;
      }
      return next;
    });
  }

  return (
    <>
      <PanelWrapper>
        <PanelHeader>{demo.title}</PanelHeader>
        <ControlsForm>
          {demo.controls.map((control) => (
            <DemoControlField key={control.id} control={control} value={values[control.id]} values={values} onChange={handleChange} />
          ))}
        </ControlsForm>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre
            tabIndex={0}
            role="region"
            aria-label="Live-updating SVG source"
            data-has-copy-button
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
        {/* code comes from this demo's own registry entry (author-authored, not user input) — same trust boundary as SvgSnippet's preview. */}
        <PreviewPane dangerouslySetInnerHTML={{ __html: code }} />
      </PanelWrapper>
    </>
  );
}

InteractiveSvgPanel.displayName = "InteractiveSvgPanel";
