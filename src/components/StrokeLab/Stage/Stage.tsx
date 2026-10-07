"use client";

import { useId } from "react";
import type { CSSProperties, JSX } from "react";
import {
  cornerVerdict,
  dashArrayValue,
  dashPatternLength,
  dashesAreActive,
  effectiveLinejoin,
  fmt,
  marchDuration,
  miterClipPolygon,
  miterSpike,
  TEXT_SUBJECT,
  toPoints,
  vec,
  viewBoxCentre
} from "@/components/StrokeLab/StrokeLab.utils";
import { LIMITS, SUBJECT_OPTIONS } from "@/components/StrokeLab/StrokeLab.helpers";
import { NotionCard, CardTitle, CardHint, ControlRow, StudToggle, Field, TextInput, TextArea, VisuallyHiddenInput } from "@/components/StrokeLab/StrokeLab.styles";
import { CuttingCloth, StageSvg, marchingStroke, RibbonRail, Ribbon, Legend, LegendSwatch, ErrorText } from "@/components/StrokeLab/Stage/Stage.styles";
import type { StageProps, StrokeCorner, StrokeSubject } from "@/components/StrokeLab/StrokeLab.types";

// The miter-family joins — the only ones stroke-miterlimit has anything to say about.
const MITER_FAMILY = ["miter", "miter-clip", "arcs"];

/*
  The cutting cloth: the subject drawn with every stroke property applied for real, plus the
  teaching overlays — chalked centreline, hatched cap extensions, and each corner's miter spike
  (green when drawn, red and dashed when the limit bevels it). Overlays are drawn in the subject's
  own user space inside the same scale group, so they track the scale demo exactly.
*/
export default function Stage({ state, actions, geometry, analysis, reducedMotion, joinSupport }: StageProps): JSX.Element {
  const uid = useId();
  const hatchId = `${uid}-hatch`;
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;

  const [, , vbWidth] = geometry.viewBox.split(/\s+/).map(Number);
  // One "screen-ish" unit relative to the default 400-wide stage, so labels stay legible on a fitted custom path of any size.
  const u = vbWidth / 400;
  const centre = viewBoxCentre(geometry.viewBox);
  const w = state.strokeWidth;
  const half = w / 2;

  const dashed = dashesAreActive(state.dashes);
  const marching = state.march && dashed && !reducedMotion;
  const renderedJoin = effectiveLinejoin(state.linejoin, joinSupport);
  const svg2Unsupported = renderedJoin !== state.linejoin;
  const scaled = state.scaleX !== 1 || state.scaleY !== 1;
  // Non-scaling strokes stay screen-width while geometry scales, so user-space overlays would no longer line up — hide them rather than mislead.
  const overlaysAligned = !(state.nonScalingStroke && scaled);
  const sharpest = analysis.corners.reduce<StrokeCorner | null>((min, c) => (!min || c.angle < min.angle ? c : min), null);

  const style = {
    strokeLinejoin: state.linejoin,
    paintOrder: state.paintOrder,
    ...(marching && {
      "--march-from": state.dashOffset,
      "--march-to": state.dashOffset - dashPatternLength(state.dashes),
      "--march-duration": `${marchDuration(state.dashes, state.marchSpeed)}s`
    })
  } as CSSProperties;

  const strokeProps = {
    fill: state.fillEnabled ? state.fillColour : "none",
    stroke: state.strokeColour,
    strokeWidth: w,
    strokeOpacity: state.strokeOpacity,
    strokeLinecap: state.linecap,
    strokeMiterlimit: state.miterLimit,
    strokeDasharray: dashed ? dashArrayValue(state.dashes) : undefined,
    strokeDashoffset: dashed ? state.dashOffset : undefined,
    vectorEffect: state.nonScalingStroke ? "non-scaling-stroke" : undefined,
    className: marching ? marchingStroke : undefined,
    style
  };

  // A halo behind overlay labels — paint-order doing on the stage exactly what the paint-order card teaches.
  const labelProps = {
    fontFamily: "ui-monospace, monospace",
    fontSize: 10 * u,
    fontWeight: 700,
    stroke: "var(--color-bg-default)",
    strokeWidth: 3 * u,
    paintOrder: "stroke",
    strokeLinejoin: "round" as const
  };

  const subjectLabel = SUBJECT_OPTIONS.find((o) => o.value === state.subject)?.label ?? "Subject";
  const transform = scaled ? `translate(${fmt(centre.x)} ${fmt(centre.y)}) scale(${state.scaleX} ${state.scaleY}) translate(${fmt(-centre.x)} ${fmt(-centre.y)})` : undefined;

  return (
    <>
      <NotionCard aria-labelledby={titleId}>
        <CardTitle id={titleId}>Cutting cloth</CardTitle>

        <RibbonRail role="radiogroup" aria-label="Test subject">
          {SUBJECT_OPTIONS.map((option) => (
            <Ribbon key={option.value}>
              <VisuallyHiddenInput
                type="radio"
                name={`${uid}-subject`}
                value={option.value}
                checked={state.subject === option.value}
                onChange={() => actions.apply({ subject: option.value as StrokeSubject })}
              />
              {option.label}
            </Ribbon>
          ))}
        </RibbonRail>

        <CuttingCloth>
          <StageSvg viewBox={geometry.viewBox} role="img" aria-labelledby={`${uid}-svg-title ${uid}-svg-desc`}>
            <title id={`${uid}-svg-title`}>{`${subjectLabel} stitched with stroke-width ${fmt(w)}`}</title>
            <desc id={`${uid}-svg-desc`}>
              {`stroke-linecap ${state.linecap}, stroke-linejoin ${state.linejoin}${svg2Unsupported ? " (unsupported here, so drawn as miter)" : ""}, stroke-miterlimit ${fmt(state.miterLimit)}, stroke-dasharray ${dashArrayValue(state.dashes)}.`}
              {sharpest ? ` Sharpest corner ${sharpest.id} is ${fmt(sharpest.angle, 1)} degrees with a miter ratio of ${fmt(sharpest.ratio)}.` : ""}
            </desc>
            <defs>
              <pattern id={hatchId} patternUnits="userSpaceOnUse" width={5 * u} height={5 * u} patternTransform="rotate(45)">
                <line x1={0} y1={0} x2={0} y2={5 * u} stroke="var(--haber-brass)" strokeWidth={1.5 * u} />
              </pattern>
            </defs>

            <g transform={transform}>
              {geometry.kind === "path" ? (
                <path d={geometry.d} {...strokeProps} />
              ) : (
                <text x={geometry.x} y={geometry.y} textAnchor="middle" fontFamily={TEXT_SUBJECT.fontFamily} fontSize={geometry.fontSize} fontWeight={TEXT_SUBJECT.fontWeight} {...strokeProps}>
                  {geometry.text}
                </text>
              )}

              {state.overlays.caps && overlaysAligned &&
                analysis.ends.map((end) => {
                  const normal = { x: -end.direction.y, y: end.direction.x };
                  const a = vec.add(end.point, vec.scale(normal, half));
                  const b = vec.add(end.point, vec.scale(normal, -half));
                  const reach = vec.scale(end.direction, half);
                  const tickA = vec.add(end.point, vec.scale(normal, half + 5 * u));
                  const tickB = vec.add(end.point, vec.scale(normal, -half - 5 * u));
                  const labelAt = vec.add(end.point, vec.scale(end.direction, (state.linecap === "butt" ? 0 : half) + 14 * u));
                  return (
                    <g key={end.id} aria-hidden="true">
                      {state.linecap === "square" && (
                        <polygon points={toPoints([a, vec.add(a, reach), vec.add(b, reach), b])} fill={`url(#${hatchId})`} stroke="var(--haber-brass)" strokeWidth={1.25} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
                      )}
                      {state.linecap === "round" && (
                        <path d={`M${fmt(a.x)},${fmt(a.y)} A${fmt(half)},${fmt(half)} 0 0 0 ${fmt(b.x)},${fmt(b.y)} Z`} fill={`url(#${hatchId})`} stroke="var(--haber-brass)" strokeWidth={1.25} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
                      )}
                      <line x1={tickA.x} y1={tickA.y} x2={tickB.x} y2={tickB.y} stroke="var(--haber-brass)" strokeWidth={1.75} vectorEffect="non-scaling-stroke" />
                      <text x={labelAt.x} y={labelAt.y} textAnchor="middle" dominantBaseline="middle" fill="var(--haber-brass)" {...labelProps}>
                        {state.linecap === "butt" ? "flush" : `+${fmt(half, 1)}`}
                      </text>
                    </g>
                  );
                })}

              {state.overlays.corners && overlaysAligned &&
                analysis.corners.map((corner) => {
                  const verdict = cornerVerdict(corner, renderedJoin, state.miterLimit);
                  const spike = miterSpike(corner, w);
                  const miterFamily = MITER_FAMILY.includes(renderedJoin);
                  const overLimit = corner.ratio > state.miterLimit;
                  const tipReach = Number.isFinite(corner.ratio) ? Math.min(corner.ratio * half, w * 12) : w * 12;
                  const labelAt = vec.add(corner.point, vec.scale(corner.bisector, tipReach + 12 * u));
                  const tone = !miterFamily ? "var(--haber-chalk)" : overLimit ? "var(--haber-fail)" : "var(--haber-pass)";
                  const isSharpest = sharpest?.id === corner.id;
                  return (
                    <g key={corner.id} aria-hidden="true">
                      {miterFamily && verdict === "bevel" && (
                        <polygon points={toPoints([spike.outerIn, spike.tip, spike.outerOut])} fill="var(--haber-fail)" fillOpacity={0.12} stroke="var(--haber-fail)" strokeWidth={1.25} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                      )}
                      {(verdict === "clipped" || (svg2Unsupported && overLimit)) && (
                        <polygon points={toPoints(miterClipPolygon(corner, w, state.miterLimit))} fill="none" stroke="var(--color-fg-attention)" strokeWidth={1.25} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
                      )}
                      {miterFamily && verdict === "miter" && (
                        <line x1={corner.point.x} y1={corner.point.y} x2={spike.tip.x} y2={spike.tip.y} stroke="var(--haber-pass)" strokeWidth={1.25} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
                      )}
                      <circle cx={corner.point.x} cy={corner.point.y} r={(isSharpest ? 3.5 : 2.5) * u} fill={tone} />
                      <text x={labelAt.x} y={labelAt.y} textAnchor="middle" dominantBaseline="middle" fill={tone} {...labelProps} fontSize={(isSharpest ? 11 : 9.5) * u}>
                        {`${corner.id} ${Number.isFinite(corner.ratio) ? fmt(corner.ratio) : "∞"}`}
                      </text>
                    </g>
                  );
                })}

              {state.overlays.centreline &&
                (geometry.kind === "path" ? (
                  <g aria-hidden="true">
                    <path d={geometry.d} fill="none" stroke="var(--haber-chalk)" strokeWidth={1.25} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
                    {analysis.ends.map((end) => (
                      <circle key={end.id} cx={end.point.x} cy={end.point.y} r={2.5 * u} fill="var(--color-bg-default)" stroke="var(--haber-chalk)" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                    ))}
                  </g>
                ) : (
                  <text
                    aria-hidden="true"
                    x={geometry.x}
                    y={geometry.y}
                    textAnchor="middle"
                    fontFamily={TEXT_SUBJECT.fontFamily}
                    fontSize={geometry.fontSize}
                    fontWeight={TEXT_SUBJECT.fontWeight}
                    fill="none"
                    stroke="var(--haber-chalk)"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    vectorEffect="non-scaling-stroke"
                  >
                    {geometry.text}
                  </text>
                ))}
            </g>
          </StageSvg>
        </CuttingCloth>

        <Legend aria-label="Overlay key">
          {state.overlays.centreline && (
            <li>
              <LegendSwatch viewBox="0 0 24 12" aria-hidden="true">
                <line x1={1} y1={6} x2={23} y2={6} stroke="var(--haber-chalk)" strokeWidth={1.5} strokeDasharray="4 3" />
              </LegendSwatch>
              Centreline (the geometry)
            </li>
          )}
          {state.overlays.caps && (
            <li>
              <LegendSwatch viewBox="0 0 24 12" aria-hidden="true">
                <rect x={6} y={1} width={12} height={10} fill={`url(#${hatchId})`} stroke="var(--haber-brass)" strokeDasharray="3 2" />
              </LegendSwatch>
              Cap beyond the end
            </li>
          )}
          {state.overlays.corners && (
            <>
              <li>
                <LegendSwatch viewBox="0 0 24 12" aria-hidden="true">
                  <line x1={1} y1={6} x2={23} y2={6} stroke="var(--haber-pass)" strokeWidth={1.5} strokeDasharray="3 2" />
                </LegendSwatch>
                Miter drawn
              </li>
              <li>
                <LegendSwatch viewBox="0 0 24 12" aria-hidden="true">
                  <polygon points="2,11 12,1 22,11" fill="var(--haber-fail)" fillOpacity={0.15} stroke="var(--haber-fail)" strokeDasharray="3 2" />
                </LegendSwatch>
                Spike over the limit (bevelled)
              </li>
              {(state.linejoin === "miter-clip" || state.linejoin === "arcs") && (
                <li>
                  <LegendSwatch viewBox="0 0 24 12" aria-hidden="true">
                    <polygon points="2,11 8,3 16,3 22,11" fill="none" stroke="var(--color-fg-attention)" strokeDasharray="2 2" />
                  </LegendSwatch>
                  {svg2Unsupported ? "Where SVG 2 would clip (not drawn here)" : "Clipped miter"}
                </li>
              )}
            </>
          )}
        </Legend>

        <ControlRow role="group" aria-label="Overlays">
          <StudToggle>
            <input type="checkbox" checked={state.overlays.centreline} onChange={(e) => actions.updateOverlays({ centreline: e.target.checked })} />
            Centreline
          </StudToggle>
          <StudToggle>
            <input type="checkbox" checked={state.overlays.caps} onChange={(e) => actions.updateOverlays({ caps: e.target.checked })} disabled={geometry.kind === "text"} />
            Cap extensions
          </StudToggle>
          <StudToggle>
            <input type="checkbox" checked={state.overlays.corners} onChange={(e) => actions.updateOverlays({ corners: e.target.checked })} disabled={geometry.kind === "text"} />
            Miter spikes
          </StudToggle>
        </ControlRow>

        {!overlaysAligned && (state.overlays.caps || state.overlays.corners) && (
          <CardHint>
            Cap and miter overlays are hidden while <code>non-scaling-stroke</code> meets a scale other than 1 — the stroke keeps its on-screen width, so overlays measured in user units would no longer line up.
          </CardHint>
        )}

        {state.subject === "custom" && (
          <>
            <Field>
              Path data (<code>d</code>)
              <TextArea
                value={state.customPath}
                spellCheck={false}
                maxLength={LIMITS.customPath.max}
                aria-invalid={analysis.error ? "true" : "false"}
                aria-describedby={errorId}
                onChange={(e) => actions.update({ customPath: e.target.value })}
                onBlur={actions.commitEdit}
              />
            </Field>
            <ErrorText id={errorId} aria-live="polite">
              {analysis.error ?? ""}
            </ErrorText>
          </>
        )}

        {state.subject === "text" && (
          <Field>
            Text
            <TextInput type="text" value={state.text} maxLength={LIMITS.text.max} onChange={(e) => actions.update({ text: e.target.value })} onBlur={actions.commitEdit} />
          </Field>
        )}

        <CardHint>{SUBJECT_OPTIONS.find((o) => o.value === state.subject)?.description}</CardHint>
      </NotionCard>
    </>
  );
}

Stage.displayName = "Stage";
