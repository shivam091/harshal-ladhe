"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { STEPS_EASING_CURVES } from "@/constants/steps-easing-curves";
import { solveStepsY } from "@/utils/steps-easing";
import type { StepsEasingName } from "@/types/steps-easing";
import type { StepsEasingRaceProps } from "@/interfaces/steps-easing-race";

// steps() jump-term race — thin wrapper around the generic CurveRace engine, backed by the shared STEPS_EASING_CURVES registry.
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
