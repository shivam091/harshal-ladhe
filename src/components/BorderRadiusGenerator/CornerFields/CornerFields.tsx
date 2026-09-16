import type { JSX } from "react";
import { CORNER_NAMES } from "@/interfaces/border-radius";
import type { CornerFieldsProps, CornerName } from "@/interfaces/border-radius";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BorderRadiusGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import { Grid, CornerRow, CornerLabel, AxisField, AxisPrefix, AxisInput } from "@/components/BorderRadiusGenerator/CornerFields/CornerFields.styles";

// Human-readable label for each corner, in the same clockwise order CORNER_NAMES iterates.
const CORNER_LABELS: Record<CornerName, string> = { topLeft: "Top left", topRight: "Top right", bottomRight: "Bottom right", bottomLeft: "Bottom left" };

/*
  The literal "8-point radius control": one H and one V field per corner, always visible together
  so every value is readable and typeable at a glance rather than hidden behind a "select a corner
  first" step — RadiusOverlay's drag handles edit the exact same fields, just by dragging instead of
  typing. Collapses to a single shared slider when `uniform` is on, since all 8 values are locked
  equal then.
*/
export default function CornerFields({ state, actions }: CornerFieldsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Corners</PanelTitle>
        </PanelHeader>
        <PanelBody>
          {state.uniform ? (
            <Slider label="Radius" min={0} max={state.size / 2} value={state.corners.topLeft.h} suffix="px" onChange={actions.setUniformRadius} onCommit={actions.commitDrag} />
          ) : (
            <FieldWrapper>
              <FieldLabel>Pinch points</FieldLabel>
              <Grid>
                {CORNER_NAMES.map((corner) => (
                  <CornerRow key={corner} data-selected={state.selectedCorner === corner ? "true" : undefined}>
                    <CornerLabel>{CORNER_LABELS[corner]}</CornerLabel>
                    <AxisField>
                      <AxisPrefix>H</AxisPrefix>
                      <AxisInput
                        type="number"
                        min={0}
                        max={state.size / 2}
                        value={Math.round(state.corners[corner].h)}
                        aria-label={`${CORNER_LABELS[corner]} horizontal radius`}
                        onFocus={() => actions.selectCorner(corner)}
                        onChange={(event) => actions.setCorner(corner, { h: Number(event.target.value) })}
                        onBlur={actions.commitDrag}
                      />
                    </AxisField>
                    <AxisField>
                      <AxisPrefix>V</AxisPrefix>
                      <AxisInput
                        type="number"
                        min={0}
                        max={state.size / 2}
                        value={Math.round(state.corners[corner].v)}
                        aria-label={`${CORNER_LABELS[corner]} vertical radius`}
                        onFocus={() => actions.selectCorner(corner)}
                        onChange={(event) => actions.setCorner(corner, { v: Number(event.target.value) })}
                        onBlur={actions.commitDrag}
                      />
                    </AxisField>
                  </CornerRow>
                ))}
              </Grid>
            </FieldWrapper>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

CornerFields.displayName = "CornerFields";
