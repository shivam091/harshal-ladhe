"use client";

import type { JSX } from "react";
import { LIMITS } from "@/components/StrokeLab/StrokeLab.helpers";
import Slider from "@/components/StrokeLab/Slider/Slider";
import { NotionCard, CardTitle, PropertyTag, CardHint, ControlRow, StudToggle, NotionButton } from "@/components/StrokeLab/StrokeLab.styles";
import type { StrokeLabPanelProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  The stretch test for vector-effect: scale the subject unevenly and watch an ordinary stroke
  stretch with it — fat on one axis, thin on the other — while non-scaling-stroke keeps its
  on-screen width. Scales about the cloth's centre so the subject stays in view.
*/
export default function ScaleDemo({ state, actions }: StrokeLabPanelProps): JSX.Element {
  const scaled = state.scaleX !== 1 || state.scaleY !== 1;

  return (
    <>
      <NotionCard>
        <CardTitle>
          Stretch test <PropertyTag>vector-effect</PropertyTag>
        </CardTitle>
        <ControlRow>
          <StudToggle>
            <input type="checkbox" checked={state.nonScalingStroke} onChange={(e) => actions.apply({ nonScalingStroke: e.target.checked })} />
            non-scaling-stroke
          </StudToggle>
          <NotionButton type="button" disabled={!scaled} onClick={() => actions.apply({ scaleX: 1, scaleY: 1 })}>
            Reset scale
          </NotionButton>
        </ControlRow>
        <Slider label="Scale X" min={LIMITS.scale.min} max={LIMITS.scale.max} step={0.05} decimals={2} suffix="×" value={state.scaleX} onChange={(v) => actions.update({ scaleX: v })} onCommit={actions.commitEdit} />
        <Slider label="Scale Y" min={LIMITS.scale.min} max={LIMITS.scale.max} step={0.05} decimals={2} suffix="×" value={state.scaleY} onChange={(v) => actions.update({ scaleY: v })} onCommit={actions.commitEdit} />
        <CardHint>
          A <code>transform</code> scales the stroke along with the geometry, so an uneven scale gives a calligraphic, lopsided line. <code>vector-effect: non-scaling-stroke</code> works out the stroke in screen space instead, keeping hairlines crisp on icons and charts that get resized.
        </CardHint>
      </NotionCard>
    </>
  );
}

ScaleDemo.displayName = "ScaleDemo";
