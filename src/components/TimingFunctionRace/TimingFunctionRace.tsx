"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { EASING_CURVES } from "@/constants/easing-curves";
import { solveBezierY } from "@/utils/bezier";
import type { EasingCurveName } from "@/types/bezier";
import type { TimingFunctionRaceProps } from "@/interfaces/timing-function-race";

// Cubic-bezier curve race — thin wrapper around the generic CurveRace engine, backed by the shared EASING_CURVES registry.
export default function TimingFunctionRace({ names, initialName }: TimingFunctionRaceProps): JSX.Element {
  return (
    <>
      <CurveRace<EasingCurveName>
        names={names}
        initialName={initialName}
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
