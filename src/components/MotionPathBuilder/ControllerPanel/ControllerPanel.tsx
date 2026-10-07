"use client";

import { useId } from "react";
import type { JSX } from "react";
import { clamp } from "@/utils/number";
import SpeedDial from "@/components/MotionPathBuilder/SpeedDial/SpeedDial";
import Slider from "@/components/MotionPathBuilder/Slider/Slider";
import { ControllerCase, PanelTitle, CaseHint, SegmentGroup, SegmentOption, FieldLabel, CheckRow } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import {
  ControllerTop,
  DirectionSlot,
  DirectionPosition,
  ControlGroup,
  GroupHeading,
  PairRow,
  CountInput
} from "@/components/MotionPathBuilder/ControllerPanel/ControllerPanel.styles";
import type { ControllerPanelProps, MotionPathDirection, MotionPathRotateMode } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// The direction switch's three throws, labelled the way a controller would print them.
const DIRECTIONS: { value: MotionPathDirection; label: string }[] = [
  { value: "normal", label: "Forward" },
  { value: "reverse", label: "Reverse" },
  { value: "alternate", label: "Shuttle" }
];

// The three ways to face along the track, labelled with the CSS keyword each one exports as.
const ROTATE_MODES: { value: MotionPathRotateMode; label: string }[] = [
  { value: "auto", label: "auto" },
  { value: "auto-reverse", label: "reverse" },
  { value: "fixed", label: "Fixed" }
];

/*
  The train controller: a speed dial for the run's duration, a three-way direction switch, and
  the timetable underneath — delay, repeats, heading, anchor and how much of the line to use.
  Continuous controls preview live and commit on release; switches commit at once.
*/
export default function ControllerPanel({ state, actions }: ControllerPanelProps): JSX.Element {
  const countId = useId();

  return (
    <>
      <ControllerCase aria-label="Controller">
        <PanelTitle>Controller</PanelTitle>

        <ControllerTop>
          <SpeedDial
            label="Journey time"
            min={0.5}
            max={20}
            step={0.1}
            value={state.duration}
            unit="seconds"
            onChange={(value) => actions.previewSetting("duration", value)}
            onCommit={actions.commitEdit}
          />
          <DirectionSlot>
            <legend>Direction</legend>
            {DIRECTIONS.map((option) => (
              <DirectionPosition key={option.value}>
                <input
                  type="radio"
                  name="motion-path-direction"
                  value={option.value}
                  checked={state.direction === option.value}
                  onChange={() => actions.applySetting("direction", option.value)}
                />
                {option.label}
              </DirectionPosition>
            ))}
          </DirectionSlot>
        </ControllerTop>
        <CaseHint>Shuttle is CSS&apos;s <code>alternate</code>: out along the line, then back again.</CaseHint>

        <ControlGroup>
          <GroupHeading>Timetable</GroupHeading>
          <Slider
            label="Delay before departure"
            min={0}
            max={5}
            step={0.1}
            decimals={1}
            suffix=" s"
            value={state.delay}
            onChange={(value) => actions.previewSetting("delay", value)}
            onCommit={actions.commitEdit}
          />
          <PairRow>
            <FieldLabel htmlFor={countId}>
              Runs
              <CountInput
                id={countId}
                type="number"
                min={1}
                max={20}
                step={1}
                value={state.iterations}
                disabled={state.infinite}
                onChange={(event) => {
                  const value = event.target.valueAsNumber;
                  if (Number.isFinite(value)) actions.applySetting("iterations", clamp(Math.round(value), 1, 20));
                }}
              />
            </FieldLabel>
            <CheckRow>
              <input type="checkbox" checked={state.infinite} onChange={(event) => actions.applySetting("infinite", event.target.checked)} />
              Run for ever
            </CheckRow>
          </PairRow>
        </ControlGroup>

        <ControlGroup>
          <GroupHeading>offset-rotate</GroupHeading>
          <SegmentGroup role="radiogroup" aria-label="Heading along the track">
            {ROTATE_MODES.map((option) => (
              <SegmentOption key={option.value}>
                <input
                  type="radio"
                  name="motion-path-rotate"
                  value={option.value}
                  checked={state.rotateMode === option.value}
                  onChange={() => actions.applySetting("rotateMode", option.value)}
                />
                {option.label}
              </SegmentOption>
            ))}
          </SegmentGroup>
          {state.rotateMode === "fixed" && (
            <Slider
              label="Fixed angle"
              min={-180}
              max={180}
              step={1}
              suffix="°"
              value={state.rotateAngle}
              onChange={(value) => actions.previewSetting("rotateAngle", value)}
              onCommit={actions.commitEdit}
            />
          )}
        </ControlGroup>

        <ControlGroup>
          <GroupHeading>offset-anchor</GroupHeading>
          <CaseHint>Which point of the element rides the rails — the brass dot on the loco.</CaseHint>
          <PairRow>
            <Slider
              label="Anchor x"
              min={0}
              max={100}
              suffix="%"
              value={state.anchorX}
              onChange={(value) => actions.previewSetting("anchorX", value)}
              onCommit={actions.commitEdit}
            />
            <Slider
              label="Anchor y"
              min={0}
              max={100}
              suffix="%"
              value={state.anchorY}
              onChange={(value) => actions.previewSetting("anchorY", value)}
              onCommit={actions.commitEdit}
            />
          </PairRow>
        </ControlGroup>

        <ControlGroup>
          <GroupHeading>offset-distance</GroupHeading>
          <PairRow>
            <Slider
              label="Depart at"
              min={0}
              max={100}
              suffix="%"
              value={state.startDistance}
              onChange={(value) => actions.previewSetting("startDistance", value)}
              onCommit={actions.commitEdit}
            />
            <Slider
              label="Arrive at"
              min={0}
              max={100}
              suffix="%"
              value={state.endDistance}
              onChange={(value) => actions.previewSetting("endDistance", value)}
              onCommit={actions.commitEdit}
            />
          </PairRow>
        </ControlGroup>
      </ControllerCase>
    </>
  );
}

ControllerPanel.displayName = "ControllerPanel";
