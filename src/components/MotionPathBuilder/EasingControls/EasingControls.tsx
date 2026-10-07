import type { JSX } from "react";
import { toPlotPoint, buildBezierPathD } from "@/utils/bezier";
import { resolveBezier, resolveEasingCss } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { SectionCard, PanelTitle, PanelHint, SegmentGroup, SegmentOption, FieldLabel, FieldInput } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { EasingBody, CurvePreview, CurveLine, CurveGuide, CurveHandle, BezierFields, EasingValue } from "@/components/MotionPathBuilder/EasingControls/EasingControls.styles";
import type { EasingControlsProps, MotionPathEasingKeyword } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// The preview plot's size in its own units; the shared bezier helpers inset the curve from the edges for us.
const PLOT_SIZE = 100;

// The keywords on the selector — custom isn't one, it lights up on its own once a number is typed.
const KEYWORDS: Exclude<MotionPathEasingKeyword, "custom">[] = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];

// Field labels for the four cubic-bezier numbers, in argument order.
const BEZIER_LABELS = ["x1", "y1", "x2", "y2"] as const;

/*
  Timing for the run: CSS keywords or a hand-typed cubic-bezier, with a small plot of whichever
  curve is in force. Built on the same bezier helpers as the Easing Curve Editor, so a curve
  looks identical in both tools. Values are held to 0–1 so the SMIL export's keySplines stay valid.
*/
export default function EasingControls({ state, actions }: EasingControlsProps): JSX.Element {
  const bezier = resolveBezier(state.easing, state.bezier);
  const p1: [number, number] = [bezier[0], bezier[1]];
  const p2: [number, number] = [bezier[2], bezier[3]];
  const [x1, y1] = toPlotPoint(p1, PLOT_SIZE);
  const [x2, y2] = toPlotPoint(p2, PLOT_SIZE);
  const [sx, sy] = toPlotPoint([0, 0], PLOT_SIZE);
  const [ex, ey] = toPlotPoint([1, 1], PLOT_SIZE);
  const css = resolveEasingCss(state.easing, state.bezier);

  return (
    <>
      <SectionCard>
        <PanelTitle>Easing</PanelTitle>
        <SegmentGroup role="radiogroup" aria-label="Timing keyword">
          {KEYWORDS.map((keyword) => (
            <SegmentOption key={keyword}>
              <input type="radio" name="motion-path-easing" value={keyword} checked={state.easing === keyword} onChange={() => actions.setEasingKeyword(keyword)} />
              {keyword}
            </SegmentOption>
          ))}
          <SegmentOption aria-disabled={state.easing !== "custom"}>
            <input type="radio" name="motion-path-easing" value="custom" checked={state.easing === "custom"} disabled={state.easing !== "custom"} readOnly />
            custom
          </SegmentOption>
        </SegmentGroup>

        <EasingBody>
          <CurvePreview viewBox={`0 0 ${PLOT_SIZE} ${PLOT_SIZE}`} role="img" aria-label={`Easing curve: ${css}`}>
            <CurveGuide x1={sx} y1={sy} x2={x1} y2={y1} />
            <CurveGuide x1={ex} y1={ey} x2={x2} y2={y2} />
            <CurveLine d={buildBezierPathD(p1, p2, PLOT_SIZE)} />
            <CurveHandle cx={x1} cy={y1} r={3.5} />
            <CurveHandle cx={x2} cy={y2} r={3.5} />
          </CurvePreview>
          <BezierFields>
            {BEZIER_LABELS.map((label, index) => (
              <FieldLabel key={label}>
                {label}
                <FieldInput
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={bezier[index]}
                  onChange={(event) => {
                    if (event.target.value !== "") actions.setBezierValue(index, event.target.valueAsNumber);
                  }}
                />
              </FieldLabel>
            ))}
          </BezierFields>
        </EasingBody>
        <PanelHint>
          Running <EasingValue>{css}</EasingValue>. Typing a number switches to a custom curve; both axes stay within 0–1 because SMIL&apos;s{" "}
          <code>keySplines</code> can&apos;t overshoot.
        </PanelHint>
      </SectionCard>
    </>
  );
}

EasingControls.displayName = "EasingControls";
