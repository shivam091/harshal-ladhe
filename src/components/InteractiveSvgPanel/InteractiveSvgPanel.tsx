"use client";

import { useState } from "react";
import type { JSX } from "react";
import type { InteractiveSvgPanelProps, SvgDemoValue, SvgDemoValues, SvgDemoControl } from "@/interfaces/svg-demo";
import { getSvgDemoBySlug, resolveRangeMax } from "@/data/svg-demos";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import DemoControlField from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { PanelWrapper, PanelHeader, ControlsForm, PreviewPane } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.styles";

// Builds the initial values object from a demo's controls, keyed by control id.
function getDefaultValues(controls: SvgDemoControl[]): SvgDemoValues {
  return Object.fromEntries(controls.map((control) => [control.id, control.defaultValue]));
}

/*
  Client component: renders one demo's control form, its live-generated SVG source, and the live
  rendered preview — all three driven by a single `values` object. The demo itself is looked up
  from the svg-demos registry by slug, the same slug-based lookup <Sandbox> uses.
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

  /*
    Applies one control's new value, preserving every other control's current value, then reclamps
    every range control whose max derives from the value that just changed (e.g. shrinking `width`
    pulls `rx` back down if it no longer fits within width / 2).
  */
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
