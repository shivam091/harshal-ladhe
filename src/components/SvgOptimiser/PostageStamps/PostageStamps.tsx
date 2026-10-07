import type { JSX } from "react";
import { PASS_META, formatBytes } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import { MAX_PRECISION, MIN_PRECISION } from "@/components/SvgOptimiser/SvgOptimiser.helpers";
import Slider from "@/components/SvgOptimiser/Slider/Slider";
import { SectionCard, PanelTitle, HintText, BrassButton } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import {
  SheetActions,
  StampSheet,
  Stamp,
  StampCheckbox,
  StampBody,
  StampLabel,
  StampHint,
  Denomination,
  RoundTripNote
} from "@/components/SvgOptimiser/PostageStamps/PostageStamps.styles";
import type { PostageStampsProps, StampToggleProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// One stamp: the pass's toggle with its denomination — what it saved when stuck on, what it would still save when not.
function StampToggle({ meta, report, onChange }: StampToggleProps): JSX.Element {
  const saved = report?.saved ?? 0;
  const enabled = report?.enabled ?? false;
  const tone = saved > 0 ? "saved" : saved < 0 ? "cost" : "none";
  const id = `svg-optimiser-pass-${meta.id}`;

  return (
    <>
      <li>
        <Stamp htmlFor={id}>
          <StampCheckbox id={id} type="checkbox" checked={enabled} onChange={onChange} aria-describedby={`${id}-hint`} />
          <StampBody>
            <StampLabel>{meta.label}</StampLabel>
            <StampHint id={`${id}-hint`}>{meta.hint}</StampHint>
          </StampBody>
          <Denomination data-tone={tone}>
            {!enabled && <small>would save</small>}
            {saved > 0 ? `−${formatBytes(saved)}` : saved < 0 ? `+${formatBytes(-saved)}` : "0 B"}
          </Denomination>
        </Stamp>
      </li>
    </>
  );
}

StampToggle.displayName = "StampToggle";

/*
  The postage sheet: one stamp per pass, in the order the passes run, each showing the bytes it
  took off the parcel. Every toggle is its own undo step; the precision slider records one step
  per release rather than one per tick.
*/
export default function PostageStamps({ state, result, actions }: PostageStampsProps): JSX.Element {
  const allOn = PASS_META.every((meta) => state.passes[meta.id]);
  const allOff = PASS_META.every((meta) => !state.passes[meta.id]);

  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-31">Postage</PanelTitle>
        <HintText>Stick a stamp on to run that pass. Each one shows the bytes it took off the parcel.</HintText>
        <SheetActions>
          <BrassButton type="button" onClick={() => actions.setAllPasses(true)} disabled={allOn}>
            Stick all
          </BrassButton>
          <BrassButton type="button" onClick={() => actions.setAllPasses(false)} disabled={allOff}>
            Peel all
          </BrassButton>
        </SheetActions>

        <Slider
          id="svg-optimiser-precision"
          label="Numeric precision (decimal places)"
          min={MIN_PRECISION}
          max={MAX_PRECISION}
          value={state.precision}
          onChange={actions.setPrecision}
          onCommit={actions.commitEdit}
        />

        <StampSheet aria-label="Optimisation passes">
          {PASS_META.map((meta) => (
            <StampToggle
              key={meta.id}
              meta={meta}
              report={result.reports.find((report) => report.id === meta.id)}
              onChange={(event) => actions.togglePass(meta.id, event.target.checked)}
            />
          ))}
        </StampSheet>

        {!result.error && result.roundTrip !== 0 && (
          <RoundTripNote>
            Re-wrapping the markup (attribute layout, quotes, entities) {result.roundTrip > 0 ? "saved" : "added"} {formatBytes(Math.abs(result.roundTrip))} before
            any stamp was applied.
          </RoundTripNote>
        )}
      </SectionCard>
    </>
  );
}

PostageStamps.displayName = "PostageStamps";
