"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { LINEAR_EASING_CURVES } from "@/constants/linear-easing-presets";
import { resolveLinearEasingStops, solveLinearEasingY } from "@/utils/linear-easing";
import type { LinearEasingRaceProps } from "@/components/LinearEasingRace/LinearEasingRace.types";

// Resolved once at load, since the curves never change and the race reads them on every animation frame.
const RESOLVED_PRESET_STOPS = Object.fromEntries(
  Object.entries(LINEAR_EASING_CURVES).map(([key, preset]) => [key, resolveLinearEasingStops(preset.stops)])
);

// Races linear() curves exactly like bezier ones, so demos in both posts look and behave the same.
export default function LinearEasingRace({ names, initialName }: LinearEasingRaceProps): JSX.Element {
  return (
    <>
      <CurveRace<string>
        names={names}
        initialName={initialName}
        getLabel={(name) => LINEAR_EASING_CURVES[name].label}
        solve={(name, t) => solveLinearEasingY(t, RESOLVED_PRESET_STOPS[name])}
      />
    </>
  );
}

LinearEasingRace.displayName = "LinearEasingRace";
