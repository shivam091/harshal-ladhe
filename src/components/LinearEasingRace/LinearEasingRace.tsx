"use client";

import type { JSX } from "react";
import CurveRace from "@/components/CurveRace";
import { LINEAR_EASING_PRESETS } from "@/constants/linear-easing-presets";
import { resolveLinearEasingStops, solveLinearEasingY } from "@/utils/linear-easing";
import type { LinearEasingRaceProps } from "@/interfaces/linear-easing-race";

// Pre-resolved stops for every preset, computed once at module load since the presets themselves never change — avoids re-running the auto-spacing algorithm on every animation frame.
const RESOLVED_PRESET_STOPS = Object.fromEntries(
  Object.entries(LINEAR_EASING_PRESETS).map(([key, preset]) => [key, resolveLinearEasingStops(preset.stops)])
);

// linear() preset race — thin wrapper around the generic CurveRace engine, backed by the shared LINEAR_EASING_PRESETS registry.
export default function LinearEasingRace({ names, initialName }: LinearEasingRaceProps): JSX.Element {
  return (
    <>
      <CurveRace<string>
        names={names}
        initialName={initialName}
        getLabel={(name) => LINEAR_EASING_PRESETS[name].label}
        solve={(name, t) => solveLinearEasingY(t, RESOLVED_PRESET_STOPS[name])}
      />
    </>
  );
}

LinearEasingRace.displayName = "LinearEasingRace";
