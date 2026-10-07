"use client";

import { useId } from "react";
import type { JSX } from "react";
import { LIMITS, PAINT_ORDER_OPTIONS } from "@/components/StrokeLab/StrokeLab.helpers";
import Slider from "@/components/StrokeLab/Slider/Slider";
import { NotionCard, CardTitle, PropertyTag, CardHint, ControlRow, StudToggle, Field, ColourInput, VisuallyHiddenInput } from "@/components/StrokeLab/StrokeLab.styles";
import { PaintOrderDemo, OrderTabs, OrderTab } from "@/components/StrokeLab/ThreadControls/ThreadControls.styles";
import type { StrokeLabPanelProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  The thread itself — width, colour and stroke-opacity — plus the fill and paint-order, which only
  make sense together: paint-order decides whether the fill covers the inner half of the stroke.
  A fixed two-letter sample shows both orders at once, so the difference doesn't depend on the
  subject currently on the cloth.
*/
export default function ThreadControls({ state, actions }: StrokeLabPanelProps): JSX.Element {
  const uid = useId();
  const order = PAINT_ORDER_OPTIONS.find((o) => o.value === state.paintOrder);

  return (
    <>
      <NotionCard>
        <CardTitle>
          Thread <PropertyTag>stroke-width</PropertyTag>
        </CardTitle>
        <Slider label="stroke-width" min={LIMITS.strokeWidth.min} max={LIMITS.strokeWidth.max} value={state.strokeWidth} onChange={(v) => actions.update({ strokeWidth: v })} onCommit={actions.commitEdit} />
        <CardHint>The stroke is centred on the geometry — half of it lies outside the shape and half inside. Turn on the centreline overlay to see the split.</CardHint>

        <ControlRow>
          <Field>
            Stroke colour
            <ColourInput type="color" value={state.strokeColour} onChange={(e) => actions.update({ strokeColour: e.target.value })} onBlur={actions.commitEdit} />
          </Field>
          <Field>
            Fill colour
            <ColourInput type="color" value={state.fillColour} disabled={!state.fillEnabled} onChange={(e) => actions.update({ fillColour: e.target.value })} onBlur={actions.commitEdit} />
          </Field>
          <StudToggle>
            <input type="checkbox" checked={state.fillEnabled} onChange={(e) => actions.apply({ fillEnabled: e.target.checked })} />
            Fill the shape
          </StudToggle>
        </ControlRow>

        <Slider label="stroke-opacity" min={LIMITS.opacity.min} max={LIMITS.opacity.max} step={0.05} decimals={2} value={state.strokeOpacity} onChange={(v) => actions.update({ strokeOpacity: v })} onCommit={actions.commitEdit} />
        <CardHint>
          A see-through stroke shows the fill (and the centreline) through its inner half. Dashes and caps don&apos;t double up where they overlap — one stroke is painted once, so <code>stroke-opacity</code> stays even.
        </CardHint>

        <CardTitle as="h4">
          Paint order <PropertyTag>paint-order</PropertyTag>
        </CardTitle>
        <OrderTabs role="radiogroup" aria-label="paint-order">
          {PAINT_ORDER_OPTIONS.map((option) => (
            <OrderTab key={option.value}>
              <VisuallyHiddenInput type="radio" name={`${uid}-paint-order`} value={option.value} checked={state.paintOrder === option.value} onChange={() => actions.apply({ paintOrder: option.value })} />
              {option.label}
            </OrderTab>
          ))}
        </OrderTabs>
        <PaintOrderDemo viewBox="0 0 240 90" role="img" aria-label="The letter A twice: on the left with paint-order normal the thick stroke eats into the letter; on the right with paint-order stroke the fill sits on top and the letter keeps its shape.">
          {(["normal", "stroke"] as const).map((value, i) => (
            <g key={value}>
              <text x={60 + i * 120} y={66} textAnchor="middle" fontSize={64} fontWeight={800} fill={state.fillColour} stroke={state.strokeColour} strokeWidth={10} strokeLinejoin="round" paintOrder={value}>
                A
              </text>
              <text x={60 + i * 120} y={84} textAnchor="middle" fontSize={10} fontFamily="ui-monospace, monospace" fill="var(--color-fg-muted)">
                {value}
              </text>
            </g>
          ))}
        </PaintOrderDemo>
        <CardHint>
          {order?.description} Try it on the <strong>Text</strong> subject with a fill — it&apos;s the trick behind legible outlined labels.
        </CardHint>
      </NotionCard>
    </>
  );
}

ThreadControls.displayName = "ThreadControls";
