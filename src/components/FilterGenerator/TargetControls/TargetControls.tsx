import type { JSX } from "react";
import type { FilterTarget, TargetControlsProps } from "@/interfaces/filter";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import { SwitchHousing, SwitchHalf, SwitchCaption, HelperText } from "@/components/FilterGenerator/TargetControls/TargetControls.styles";

// The two positions this bench's main switch can be thrown to, plus the CSS property each one throws onto.
const TARGETS: Array<{ id: FilterTarget; label: string; caption: string }> = [
  { id: "filter", label: "Filter", caption: "filter" },
  { id: "backdropFilter", label: "Backdrop", caption: "backdrop-filter" }
];

/*
  Which CSS property every enabled lens in the rack compiles onto, styled as a physical two-position
  rocker switch rather than a plain segmented tab bar — "Filter" processes the preview subject
  itself; "Backdrop" processes whatever sits behind the translucent panel, which is what PreviewPane
  swaps to show and what unlocks the panel's gel tint in PanelControls below.
*/
export default function TargetControls({ state, actions }: TargetControlsProps): JSX.Element {
  const active = TARGETS.find((target) => target.id === state.target) ?? TARGETS[0];

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Target Switch</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <SwitchHousing role="radiogroup" aria-label="Filter target property">
            {TARGETS.map((target) => (
              <SwitchHalf
                key={target.id}
                type="button"
                role="radio"
                aria-checked={state.target === target.id}
                data-selected={state.target === target.id ? "true" : undefined}
                onClick={() => actions.setTarget(target.id)}
              >
                {target.label}
                <SwitchCaption>{target.caption}</SwitchCaption>
              </SwitchHalf>
            ))}
          </SwitchHousing>
          <HelperText>
            {active.id === "filter"
              ? "Thrown to FILTER — processes the preview subject itself."
              : "Thrown to BACKDROP — processes whatever sits behind the translucent panel, the mechanism glassmorphism relies on."}
          </HelperText>
        </PanelBody>
      </Panel>
    </>
  );
}

TargetControls.displayName = "TargetControls";
