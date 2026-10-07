"use client";

import type { JSX } from "react";
import { dashArrayValue, dashesAreActive, dashPatternLength, effectiveDashes, fmt, niceTickStep, tapeSegments } from "@/components/StrokeLab/StrokeLab.utils";
import { LIMITS } from "@/components/StrokeLab/StrokeLab.helpers";
import Slider from "@/components/StrokeLab/Slider/Slider";
import { NotionCard, CardTitle, PropertyTag, CardHint, ControlRow, StudToggle, NotionButton, TextInput, Badge } from "@/components/StrokeLab/StrokeLab.styles";
import { TapeSvg, SegmentList, SegmentTicket, TicketHead, RemoveButton, PatternReadout } from "@/components/StrokeLab/DashTape/DashTape.styles";
import type { DashTapeProps } from "@/components/StrokeLab/StrokeLab.types";

// Tape drawing width in its own units — the pattern is scaled to fit this.
const TAPE_WIDTH = 320;

// Most repeats the tape shows; enough to see the rhythm without turning a short pattern into noise.
const MAX_REPEATS = 4;

/*
  stroke-dasharray as a measuring tape: the effective pattern is laid out at scale with its stitches
  drawn in the current thread and linecap, the doubled half of an odd list ghosted, and every length
  editable as its own ticket. stroke-dashoffset and the marching ants live here too, since they only
  mean anything once there's a pattern to shift.
*/
export default function DashTape({ state, actions, reducedMotion }: DashTapeProps): JSX.Element {
  const { dashes } = state;
  const active = dashesAreActive(dashes);
  const patternLength = dashPatternLength(dashes);
  const repeats = active ? Math.max(1, Math.min(MAX_REPEATS, Math.floor(TAPE_WIDTH / patternLength))) : 1;
  const k = active ? TAPE_WIDTH / (patternLength * repeats) : 1;
  const step = niceTickStep(5 / k);
  const segments = tapeSegments(dashes);
  const odd = dashes.length % 2 === 1;
  const ticks = active ? Array.from({ length: Math.floor((patternLength * repeats) / step) + 1 }, (_, i) => i * step) : [];
  const stitchWidth = Math.min(8, Math.max(3, state.strokeWidth / 2));

  // Live edit of one length; NaN from a cleared box is treated as zero so the list never holds junk.
  const setLength = (index: number, value: number) => {
    const next = [...dashes];
    next[index] = Math.min(LIMITS.dash.max, Math.max(LIMITS.dash.min, Number.isFinite(value) ? value : 0));
    actions.update({ dashes: next });
  };

  const full = dashes.length >= LIMITS.dashCount.max;

  return (
    <>
      <NotionCard>
        <CardTitle>
          Measuring tape <PropertyTag>stroke-dasharray</PropertyTag>
        </CardTitle>

        <TapeSvg viewBox={`-8 0 ${TAPE_WIDTH + 16} 46`} role="img" aria-label={active ? `Dash pattern ${effectiveDashes(dashes).join(" ")}, repeating every ${fmt(patternLength)} units` : "No dash pattern — the stroke is solid"}>
          <rect x={-8} y={0} width={TAPE_WIDTH + 16} height={46} fill="color-mix(in srgb, var(--color-fg-attention) 10%, var(--color-bg-default))" />
          <rect x={-8} y={0} width={8} height={46} fill="var(--haber-brass)" />
          {ticks.map((t, i) => (
            <g key={t}>
              <line x1={t * k} y1={0} x2={t * k} y2={i % 5 === 0 ? 10 : 5} stroke="var(--color-fg-default)" strokeOpacity={0.6} strokeWidth={0.75} />
              {i % 5 === 0 && (
                <text x={t * k + 1.5} y={17} fontSize={7} fontFamily="ui-monospace, monospace" fill="var(--haber-fail)">
                  {fmt(t, 1)}
                </text>
              )}
            </g>
          ))}
          {active ? (
            Array.from({ length: repeats }, (_, r) =>
              segments
                .filter((s) => s.kind === "dash")
                .map((s) => (
                  <line
                    key={`${r}-${s.start}`}
                    x1={(r * patternLength + s.start) * k}
                    x2={(r * patternLength + s.start + s.length) * k}
                    y1={32}
                    y2={32}
                    stroke="var(--haber-thread)"
                    strokeWidth={stitchWidth}
                    strokeLinecap={state.linecap}
                    strokeOpacity={r === 0 && !s.repeat ? 1 : 0.35}
                  />
                ))
            )
          ) : (
            <line x1={0} x2={TAPE_WIDTH} y1={32} y2={32} stroke="var(--haber-thread)" strokeWidth={stitchWidth} />
          )}
          {active && <line x1={patternLength * k} x2={patternLength * k} y1={20} y2={44} stroke="var(--haber-brass)" strokeDasharray="2 2" strokeWidth={1} />}
        </TapeSvg>

        <PatternReadout>
          stroke-dasharray: {dashArrayValue(dashes)};
          {odd && active && <> → repeats as {effectiveDashes(dashes).map((n) => fmt(n)).join(" ")}</>}
        </PatternReadout>
        {odd && active && (
          <CardHint>
            <Badge data-tone="warn">Odd list</Badge> An odd number of lengths is repeated once to make it even, so the roles swap on the second pass — what was a dash becomes a gap. The ghosted stitches before the brass mark are that doubled half.
          </CardHint>
        )}
        {!active && dashes.length > 0 && <CardHint>Every length is zero, so the whole list is ignored and the stroke draws solid.</CardHint>}

        {dashes.length > 0 && (
          <SegmentList>
            {dashes.map((value, index) => {
              const kind = index % 2 === 0 ? "dash" : "gap";
              const label = `${kind === "dash" ? "Dash" : "Gap"} ${Math.floor(index / 2) + 1}`;
              return (
                <SegmentTicket key={index} data-kind={kind}>
                  <TicketHead>
                    <span>{label}</span>
                    <RemoveButton type="button" aria-label={`Remove ${label.toLowerCase()}`} onClick={() => actions.apply({ dashes: dashes.filter((_, i) => i !== index) })}>
                      ×
                    </RemoveButton>
                  </TicketHead>
                  <TextInput
                    type="number"
                    aria-label={`${label} length`}
                    min={LIMITS.dash.min}
                    max={LIMITS.dash.max}
                    step={1}
                    value={value}
                    onChange={(e) => setLength(index, e.target.valueAsNumber)}
                    onBlur={actions.commitEdit}
                  />
                </SegmentTicket>
              );
            })}
          </SegmentList>
        )}

        <ControlRow>
          <NotionButton type="button" disabled={full} onClick={() => actions.apply({ dashes: [...dashes, 12, 6].slice(0, LIMITS.dashCount.max) })}>
            + Dash &amp; gap
          </NotionButton>
          <NotionButton type="button" disabled={full} onClick={() => actions.apply({ dashes: [...dashes, 4] })}>
            + One length
          </NotionButton>
          <NotionButton type="button" disabled={dashes.length === 0} onClick={() => actions.apply({ dashes: [] })}>
            Solid (none)
          </NotionButton>
        </ControlRow>

        <CardTitle as="h4">
          Offset <PropertyTag>stroke-dashoffset</PropertyTag>
        </CardTitle>
        <Slider label="stroke-dashoffset" min={LIMITS.dashOffset.min} max={LIMITS.dashOffset.max} value={state.dashOffset} onChange={(v) => actions.update({ dashOffset: v })} onCommit={actions.commitEdit} />
        <CardHint>A positive offset pulls the pattern back towards the start; animating it downwards walks the stitches forwards along the path.</CardHint>

        <ControlRow>
          <StudToggle>
            <input type="checkbox" checked={state.march && !reducedMotion} disabled={reducedMotion || !active} onChange={(e) => actions.apply({ march: e.target.checked })} />
            March the ants
          </StudToggle>
        </ControlRow>
        {state.march && active && !reducedMotion && (
          <Slider label="March speed" min={LIMITS.marchSpeed.min} max={LIMITS.marchSpeed.max} value={state.marchSpeed} suffix=" u/s" onChange={(v) => actions.update({ marchSpeed: v })} onCommit={actions.commitEdit} />
        )}
        {reducedMotion && <CardHint>Marching is off because your system asks for reduced motion. The exported CSS still includes it, behind a <code>prefers-reduced-motion</code> opt-out.</CardHint>}
        {!active && !reducedMotion && <CardHint>Add a dash pattern to march it.</CardHint>}
      </NotionCard>
    </>
  );
}

DashTape.displayName = "DashTape";
