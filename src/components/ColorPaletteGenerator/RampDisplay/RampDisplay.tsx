"use client";

import { useState } from "react";
import type { CSSProperties, JSX } from "react";
import { generateRamp } from "@/utils/color-ramp";
import { contrastRatio, hexToOklch } from "@/utils/oklch";
import { toFixed } from "@/utils/number";
import type { RampDisplayProps } from "@/interfaces/color-palette";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import {
  RecipeRow,
  RecipeTab,
  RampFan,
  RampChip,
  ChipTab,
  Detail,
  DetailEmpty,
  DetailHeader,
  DetailSwatch,
  DetailName,
  DetailHex,
  DetailStatRow,
  DetailStat,
  DetailStatLabel,
  DetailStatValue,
  UseBackgroundButton
} from "@/components/ColorPaletteGenerator/RampDisplay/RampDisplay.styles";

// The two selectable ramp algorithms — see utils/color-ramp.ts's own generateRamp for what each actually computes.
const MODES = [
  { id: "oklch", label: "OKLCH" },
  { id: "mix", label: "RGB mix" }
] as const;

// Total angular spread the fan swings across, split evenly on either side of the middle step — wide enough that all eleven steps read as visibly fanned without any two overlapping so much their tabs collide.
const FAN_SPREAD_DEG = 46;

/*
  The tool's flagship flourish: renders the generated ramp as a hand-fanned stack of swatch chips
  rather than a flat row, pivoting every chip from the same bottom-center anchor (see RampChip's own
  comment) so each step's own label tab stays legible despite the overlap. Hovering, focusing, or
  clicking a chip lifts it clear of the fan and reveals its exact hex/OKLCH value plus contrast
  against the current foreground/background pair.
*/
export default function RampDisplay({ state, actions }: RampDisplayProps): JSX.Element {
  const ramp = generateRamp(state.seedColor, state.rampMode);
  // "Lifted clear of the fan" state: hovered/focused wins over a click-pinned selection so moving the pointer always previews whatever it's over, while a click leaves that chip pulled out once the pointer moves away.
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const activeStepName = hoveredStep ?? selectedStep;
  const activeStep = ramp.find((step) => step.name === activeStepName) ?? null;

  const angleStep = ramp.length > 1 ? FAN_SPREAD_DEG / (ramp.length - 1) : 0;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Ramp Fan</PanelTitle>
          <RecipeRow role="tablist" aria-label="Ramp generation recipe">
            {MODES.map((mode) => (
              <RecipeTab
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={mode.id === state.rampMode}
                data-selected={mode.id === state.rampMode ? "true" : undefined}
                onClick={() => actions.setRampMode(mode.id)}
              >
                {mode.label}
              </RecipeTab>
            ))}
          </RecipeRow>
        </PanelHeader>

        <PanelBody>
          <RampFan role="list" aria-label="Generated color ramp">
            {ramp.map((step, index) => {
              const isActive = step.name === activeStepName;
              const angle = -FAN_SPREAD_DEG / 2 + angleStep * index;
              const style: CSSProperties = {
                background: step.hex,
                zIndex: isActive ? 100 : index,
                transform: isActive ? "translateY(-1.875rem) rotate(0deg) scale(1.08)" : `rotate(${angle}deg)`
              };

              return (
                <RampChip
                  key={step.name}
                  type="button"
                  role="listitem"
                  style={style}
                  aria-label={`Step ${step.name}: ${step.hex}`}
                  onMouseEnter={() => setHoveredStep(step.name)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onFocus={() => setHoveredStep(step.name)}
                  onBlur={() => setHoveredStep(null)}
                  onClick={() => setSelectedStep((prev) => (prev === step.name ? null : step.name))}
                >
                  <ChipTab>{step.name}</ChipTab>
                </RampChip>
              );
            })}
          </RampFan>

          {activeStep ? (
            <Detail>
              <DetailHeader>
                <DetailSwatch style={{ background: activeStep.hex }} />
                <DetailName>Step {activeStep.name}</DetailName>
                <DetailHex>{activeStep.hex}</DetailHex>
              </DetailHeader>

              <DetailStatRow>
                {(() => {
                  const { L, C, H } = hexToOklch(activeStep.hex);
                  return (
                    <DetailStat>
                      <DetailStatLabel>OKLCH</DetailStatLabel>
                      <DetailStatValue>
                        {toFixed(L, 3)} {toFixed(C, 3)} {toFixed(H, 1)}
                      </DetailStatValue>
                    </DetailStat>
                  );
                })()}
                <DetailStat>
                  <DetailStatLabel>vs. foreground</DetailStatLabel>
                  <DetailStatValue>{contrastRatio(activeStep.hex, state.foreground).toFixed(2)}:1</DetailStatValue>
                </DetailStat>
                <DetailStat>
                  <DetailStatLabel>vs. background</DetailStatLabel>
                  <DetailStatValue>{contrastRatio(activeStep.hex, state.background).toFixed(2)}:1</DetailStatValue>
                </DetailStat>
              </DetailStatRow>

              <UseBackgroundButton type="button" onClick={() => actions.useAsBackground(activeStep.hex)}>
                Use as background
              </UseBackgroundButton>
            </Detail>
          ) : (
            <Detail>
              <DetailEmpty>Hover, focus, or click a swatch to pull it out of the fan and inspect it.</DetailEmpty>
            </Detail>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

RampDisplay.displayName = "RampDisplay";
