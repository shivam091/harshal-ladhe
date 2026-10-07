"use client";

import { useId } from "react";
import type { JSX } from "react";
import { LINECAP_OPTIONS } from "@/components/StrokeLab/StrokeLab.helpers";
import { NotionCard, CardTitle, PropertyTag, CardHint, VisuallyHiddenInput } from "@/components/StrokeLab/StrokeLab.styles";
import { SpoolRack, Spool, SpoolSvg, SpoolName } from "@/components/StrokeLab/ThreadSpools/ThreadSpools.styles";
import type { StrokeLabPanelProps } from "@/components/StrokeLab/StrokeLab.types";

// Where the drawn thread's geometry ends in each spool picture — the brass tick sits here so the cap's overhang is measurable.
const THREAD_END = 88;

/*
  stroke-linecap as a rack of thread spools. Each reel's loose end is drawn with that cap at a
  fixed width, past a brass tick at the true end of the path, so butt's flush cut and the w/2
  overhang of round and square are visible before you pick one.
*/
export default function ThreadSpools({ state, actions }: StrokeLabPanelProps): JSX.Element {
  const uid = useId();
  const selected = LINECAP_OPTIONS.find((o) => o.value === state.linecap);

  return (
    <>
      <NotionCard>
        <CardTitle>
          Thread ends <PropertyTag>stroke-linecap</PropertyTag>
        </CardTitle>
        <SpoolRack role="radiogroup" aria-label="stroke-linecap">
          {LINECAP_OPTIONS.map((option) => (
            <Spool key={option.value}>
              <VisuallyHiddenInput type="radio" name={`${uid}-linecap`} value={option.value} checked={state.linecap === option.value} onChange={() => actions.apply({ linecap: option.value })} />
              <SpoolSvg viewBox="0 0 120 52" aria-hidden="true">
                <rect x={4} y={6} width={30} height={6} rx={2} fill="var(--haber-wood-dark)" />
                <rect x={4} y={40} width={30} height={6} rx={2} fill="var(--haber-wood-dark)" />
                <rect x={8} y={12} width={22} height={28} fill={state.strokeColour} />
                {[16, 20, 24, 28, 32, 36].map((y) => (
                  <line key={y} x1={8} x2={30} y1={y} y2={y - 2} stroke="var(--color-bg-default)" strokeOpacity={0.35} strokeWidth={0.75} />
                ))}
                <line x1={30} y1={26} x2={THREAD_END} y2={26} stroke={state.strokeColour} strokeWidth={14} strokeLinecap={option.value} />
                <line x1={30} y1={26} x2={THREAD_END} y2={26} stroke="var(--haber-chalk)" strokeWidth={1} strokeDasharray="3 2" />
                <line x1={THREAD_END} y1={12} x2={THREAD_END} y2={40} stroke="var(--haber-brass)" strokeWidth={1.5} />
                {option.value !== "butt" && (
                  <text x={THREAD_END + 13} y={50} textAnchor="middle" fontSize={8} fontFamily="ui-monospace, monospace" fill="var(--haber-brass)">
                    +w/2
                  </text>
                )}
              </SpoolSvg>
              <SpoolName>{option.label.toLowerCase()}</SpoolName>
            </Spool>
          ))}
        </SpoolRack>
        <CardHint>
          {selected?.description} Caps apply to <strong>every dash</strong>, not just the path&apos;s two ends — which is how a zero-length dash with a round cap becomes a dot, and why square caps can close up a short gap.
        </CardHint>
      </NotionCard>
    </>
  );
}

ThreadSpools.displayName = "ThreadSpools";
