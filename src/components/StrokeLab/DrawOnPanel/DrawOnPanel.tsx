"use client";

import { useState } from "react";
import type { CSSProperties, JSX } from "react";
import { DRAW_ON_EASINGS, drawOnAnimation, TEXT_DRAW_LENGTH, TEXT_SUBJECT, toDrawOnCss, toDrawOnReact, toDrawOnSvg } from "@/components/StrokeLab/StrokeLab.utils";
import { FILL_MODE_OPTIONS, LIMITS, LOOP_OPTIONS } from "@/components/StrokeLab/StrokeLab.helpers";
import Slider from "@/components/StrokeLab/Slider/Slider";
import CodeSampler from "@/components/StrokeLab/CodeSampler/CodeSampler";
import { NotionCard, CardTitle, PropertyTag, CardHint, NotionButton, Field, Select } from "@/components/StrokeLab/StrokeLab.styles";
import { DrawOnGrid, Hoop, PreviewSvg, drawOnStroke, TimingGrid } from "@/components/StrokeLab/DrawOnPanel/DrawOnPanel.styles";
import type { DrawOnFillMode, DrawOnLoop, DrawOnPanelProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  The draw-on line animation: a live preview in a hoop, the animation shorthand's parts as controls,
  and the CSS / SVG / React exports. It autoplays only when motion is allowed; with reduced motion the
  preview rests on the finished line and plays a single pass only when asked.
*/
export default function DrawOnPanel({ state, actions, geometry, reducedMotion }: DrawOnPanelProps): JSX.Element {
  const [replayKey, setReplayKey] = useState(0);
  const [manualPlay, setManualPlay] = useState(false);
  const { drawOn } = state;
  const total = geometry.kind === "path" ? 1 : TEXT_DRAW_LENGTH;
  const animating = !reducedMotion || manualPlay;
  // A manual play under reduced motion is one pass, never an endless loop.
  const settings = reducedMotion ? { ...drawOn, loop: "once" as const } : drawOn;

  const style: CSSProperties = animating
    ? { strokeDasharray: total, strokeDashoffset: total, animation: drawOnAnimation(settings, "stroke-lab-draw-on") }
    : { strokeDasharray: total, strokeDashoffset: 0 };

  const strokeProps = {
    fill: "none",
    stroke: state.strokeColour,
    strokeWidth: state.strokeWidth,
    strokeLinecap: state.linecap,
    className: drawOnStroke,
    style
  };

  // Remounting the element restarts the CSS animation from its first frame.
  const replay = () => {
    setManualPlay(true);
    setReplayKey((k) => k + 1);
  };

  const samples = [
    { id: "css", label: "CSS", language: "css", code: toDrawOnCss(state, geometry) },
    { id: "svg", label: "SVG", language: "xml", code: toDrawOnSvg(state, geometry) },
    { id: "react", label: "React", language: "tsx", code: toDrawOnReact(state, geometry) }
  ];

  return (
    <>
      <NotionCard>
        <CardTitle>
          Draw-on line <PropertyTag>pathLength=&quot;1&quot;</PropertyTag>
        </CardTitle>
        <CardHint>
          The classic self-drawing line is one dash as long as the path, slid out of view with <code>stroke-dashoffset</code> and animated back to <code>0</code>. Normally that length comes from <code>getTotalLength()</code> and goes stale the moment the path changes. <code>pathLength=&quot;1&quot;</code> tells the browser to treat the path as exactly 1 unit long for every dash calculation, so <code>stroke-dasharray: 1</code> and an offset from <code>1</code> to <code>0</code> work on any path, at any size, with no measuring.
        </CardHint>

        <DrawOnGrid>
          <Hoop>
            <PreviewSvg viewBox={geometry.viewBox} role="img" aria-label={animating ? "Preview of the subject drawing itself on" : "The finished line (animation paused for reduced motion)"}>
              {geometry.kind === "path" ? (
                <path key={replayKey} d={geometry.d} pathLength={1} {...strokeProps} />
              ) : (
                <text key={replayKey} x={geometry.x} y={geometry.y} textAnchor="middle" fontFamily={TEXT_SUBJECT.fontFamily} fontSize={geometry.fontSize} fontWeight={TEXT_SUBJECT.fontWeight} {...strokeProps}>
                  {geometry.text}
                </text>
              )}
            </PreviewSvg>
            <NotionButton type="button" onClick={replay}>
              {reducedMotion && !manualPlay ? "Play one pass" : "Replay"}
            </NotionButton>
          </Hoop>

          <TimingGrid>
            <Slider label="Duration" min={LIMITS.duration.min} max={LIMITS.duration.max} step={0.1} decimals={1} suffix="s" value={drawOn.duration} onChange={(v) => actions.updateDrawOn({ duration: v }, false)} onCommit={actions.commitEdit} />
            <Slider label="Delay" min={LIMITS.delay.min} max={LIMITS.delay.max} step={0.1} decimals={1} suffix="s" value={drawOn.delay} onChange={(v) => actions.updateDrawOn({ delay: v }, false)} onCommit={actions.commitEdit} />
            <Field>
              Easing
              <Select value={drawOn.easing} onChange={(e) => actions.updateDrawOn({ easing: e.target.value }, true)}>
                {Object.entries(DRAW_ON_EASINGS).map(([key, easing]) => (
                  <option key={key} value={key}>
                    {easing.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              Fill mode
              <Select value={drawOn.fill} onChange={(e) => actions.updateDrawOn({ fill: e.target.value as DrawOnFillMode }, true)}>
                {FILL_MODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              Repeat
              <Select value={drawOn.loop} onChange={(e) => actions.updateDrawOn({ loop: e.target.value as DrawOnLoop }, true)}>
                {LOOP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
          </TimingGrid>
        </DrawOnGrid>

        <CardHint>
          <strong>{FILL_MODE_OPTIONS.find((o) => o.value === drawOn.fill)?.label}:</strong> {FILL_MODE_OPTIONS.find((o) => o.value === drawOn.fill)?.description}{" "}
          {LOOP_OPTIONS.find((o) => o.value === drawOn.loop)?.description} Every export switches the animation off under <code>prefers-reduced-motion: reduce</code> and shows the finished line instead.
        </CardHint>
        {state.linecap !== "butt" && geometry.kind === "path" && (
          <CardHint>
            With <code>{state.linecap}</code> caps, the hidden dash still ends exactly at the path&apos;s start, so some browsers paint a cap-sized dot there before the line begins. Use <code>butt</code> caps for a perfectly clean start.
          </CardHint>
        )}
        {geometry.kind === "text" && (
          <CardHint>
            <code>pathLength</code> isn&apos;t allowed on <code>&lt;text&gt;</code>, so text draws against a fixed {TEXT_DRAW_LENGTH}-unit dash instead — an estimate. Convert the text to outlines for an exact draw.
          </CardHint>
        )}

        <CodeSampler label="Draw-on export format" samples={samples} />
      </NotionCard>
    </>
  );
}

DrawOnPanel.displayName = "DrawOnPanel";
