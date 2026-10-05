"use client";

import type { JSX } from "react";
import type { ContextControlsProps } from "@/components/UnitConverter/UnitConverter.types";
import Slider from "@/components/UnitConverter/Slider/Slider";
import { GroupDivider, GroupLabel, MatchWindowButton } from "@/components/UnitConverter/ContextControls/ContextControls.styles";

/*
  Every number a relative unit resolves against, grouped by what kind of thing it measures — font
  sizes, the viewport, then boxes — plus the output precision. Exposed as editable state rather than
  read from the page, since the point is to answer "what would this be over there", not here.
*/
export default function ContextControls({ state, actions }: ContextControlsProps): JSX.Element {
  const { context } = state;

  // A single commit for both axes, so matching the window is one undo step rather than two.
  function matchWindow() {
    actions.setContext({ viewportWidth: window.innerWidth, viewportHeight: window.innerHeight });
    actions.commitDrag();
  }

  return (
    <>
      <GroupLabel>Font sizes</GroupLabel>
      <Slider label="Root font-size (rem)" min={4} max={64} value={context.rootFontSize} suffix="px" onChange={(px) => actions.setContext({ rootFontSize: px })} onCommit={actions.commitDrag} />
      <Slider label="Parent font-size (em)" min={4} max={96} value={context.parentFontSize} suffix="px" onChange={(px) => actions.setContext({ parentFontSize: px })} onCommit={actions.commitDrag} />

      <GroupDivider />
      <GroupLabel>Viewport</GroupLabel>
      <Slider label="Viewport width (vw)" min={200} max={3840} value={context.viewportWidth} suffix="px" onChange={(px) => actions.setContext({ viewportWidth: px })} onCommit={actions.commitDrag} />
      <Slider label="Viewport height (vh)" min={200} max={2160} value={context.viewportHeight} suffix="px" onChange={(px) => actions.setContext({ viewportHeight: px })} onCommit={actions.commitDrag} />
      <MatchWindowButton type="button" onClick={matchWindow}>
        Use this window
      </MatchWindowButton>

      <GroupDivider />
      <GroupLabel>Boxes</GroupLabel>
      <Slider label="Container inline size (cqi)" min={40} max={2400} value={context.containerInlineSize} suffix="px" onChange={(px) => actions.setContext({ containerInlineSize: px })} onCommit={actions.commitDrag} />
      <Slider label="Parent width (%)" min={40} max={3840} value={context.parentWidth} suffix="px" onChange={(px) => actions.setContext({ parentWidth: px })} onCommit={actions.commitDrag} />

      <GroupDivider />
      <Slider label="Decimal places" min={0} max={6} value={state.precision} onChange={(decimals) => actions.setPrecision(decimals)} onCommit={actions.commitDrag} />
    </>
  );
}

ContextControls.displayName = "ContextControls";
