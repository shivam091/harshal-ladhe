"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { STEPS_EASING_CURVES, type StepsEasingName } from "@/constants/steps-easing-curves";
import { solveStepsY } from "@/utils/steps-easing";
import type { StepsEasingRaceProps } from "@/components/StepsEasingRace/StepsEasingRace.types";

// steps() race — reuses the generic CurveRace engine so only the steps() solver is specific to this demo.
export default function StepsEasingRace({ names, initialName }: StepsEasingRaceProps): JSX.Element {
  return (
    <>
      <CurveRace<StepsEasingName>
        names={names}
        initialName={initialName}
        getLabel={(name) => STEPS_EASING_CURVES[name].label}
        solve={(name, t) => {
          const { n, jumpTerm } = STEPS_EASING_CURVES[name];
          return solveStepsY(t, n, jumpTerm);
        }}
      />
    </>
  );
}

StepsEasingRace.displayName = "StepsEasingRace";
