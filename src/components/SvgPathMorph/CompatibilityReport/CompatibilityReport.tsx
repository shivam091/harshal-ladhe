"use client";

import type { JSX } from "react";
import { describeCommandCounts, elixirTone, formatNumber, keyframeLabel } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { ParchmentCard, PanelTitle, PanelHint } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import { Ledger, StepList, Step, StepMark, TravelLine } from "@/components/SvgPathMorph/CompatibilityReport/CompatibilityReport.styles";
import type { CompatibilityReportProps, MorphStepKind } from "@/components/SvgPathMorph/SvgPathMorph.types";

// An alchemical-looking glyph per step kind — decoration only, so each is hidden from assistive tech and the text carries the meaning.
const STEP_MARKS: Record<MorphStepKind, string> = {
  normalise: "☿",
  pad: "○",
  subdivide: "✂",
  rotate: "↻",
  reverse: "⇄",
  close: "◌"
};

/*
  The alchemist's notes: a ledger of each keyframe's original commands beside its normalised and
  matched counts, then every step the matcher took to make them morphable, and the total point
  travel before and after alignment — so nothing the tool did to the paths is hidden.
*/
export default function CompatibilityReport({ outcome }: CompatibilityReportProps): JSX.Element {
  if (!outcome.ok) {
    return (
      <>
        <ParchmentCard aria-labelledby="morph-report-title">
          <PanelTitle id="morph-report-title">Compatibility report</PanelTitle>
          <PanelHint>
            Keyframe {keyframeLabel(outcome.keyframeIndex)} won&apos;t parse, so there&apos;s nothing to compare yet. {outcome.error}
          </PanelHint>
        </ParchmentCard>
      </>
    );
  }

  const { keyframes, steps, travelBefore, travelAfter } = outcome.result.report;
  const saved = travelBefore > 0 ? Math.round((1 - travelAfter / travelBefore) * 100) : 0;

  return (
    <>
      <ParchmentCard aria-labelledby="morph-report-title">
        <PanelTitle id="morph-report-title">Compatibility report</PanelTitle>
        <Ledger>
          <caption>Command counts before and after matching</caption>
          <thead>
            <tr>
              <th scope="col">Keyframe</th>
              <th scope="col">Original commands</th>
              <th scope="col">Normalised</th>
              <th scope="col">Matched</th>
            </tr>
          </thead>
          <tbody>
            {keyframes.map((keyframe, index) => (
              <tr key={keyframe.label}>
                <th scope="row" style={{ color: elixirTone(index) }}>
                  {keyframe.label}
                </th>
                <td>
                  <code>{describeCommandCounts(keyframe.commandCounts)}</code>
                  <span> ({keyframe.commandTotal})</span>
                </td>
                <td>
                  {keyframe.normalisedSubpaths} × M, {keyframe.normalisedSegments} × C
                </td>
                <td>
                  {keyframe.matchedSubpaths} × M, {keyframe.matchedSegments} × C
                </td>
              </tr>
            ))}
          </tbody>
        </Ledger>
        {steps.length > 0 ? (
          <StepList>
            {steps.map((step, index) => (
              <Step key={index} data-kind={step.kind}>
                <StepMark aria-hidden="true">{STEP_MARKS[step.kind]}</StepMark>
                <span>{step.text}</span>
              </Step>
            ))}
          </StepList>
        ) : (
          <PanelHint>Already compatible — every keyframe was absolute cubics with matching counts, so nothing needed changing.</PanelHint>
        )}
        <TravelLine>
          Total point travel: {formatNumber(travelBefore, 1)} → {formatNumber(travelAfter, 1)} units
          {saved > 0 ? ` (${saved}% shorter after alignment)` : ""}
        </TravelLine>
      </ParchmentCard>
    </>
  );
}

CompatibilityReport.displayName = "CompatibilityReport";
