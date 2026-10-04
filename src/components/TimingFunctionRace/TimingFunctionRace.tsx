"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { EASING_CURVES } from "@/constants/easing-curves";
import type { EasingCurveName } from "@/constants/easing-curves";
import { solveBezierY } from "@/utils/bezier";
import type { TimingFunctionRaceProps } from "@/components/TimingFunctionRace/TimingFunctionRace.types";

// Races bezier curves by name, so a race and the graphs beside it always use the same numbers.
export default function TimingFunctionRace({ names, initialName, stacked }: TimingFunctionRaceProps): JSX.Element {
  return (
    <>
      <CurveRace<EasingCurveName>
        names={names}
        initialName={initialName}
        stacked={stacked}
        getLabel={(name) => EASING_CURVES[name].label}
        solve={(name, t) => {
          const { p1, p2 } = EASING_CURVES[name];
          return solveBezierY(t, p1, p2);
        }}
      />
    </>
  );
}

TimingFunctionRace.displayName = "TimingFunctionRace";
