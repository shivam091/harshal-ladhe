"use client";

import type { JSX } from "react";
import { effectiveLinejoin, fmt, limitAngle } from "@/components/StrokeLab/StrokeLab.utils";
import { LIMITS } from "@/components/StrokeLab/StrokeLab.helpers";
import Slider from "@/components/StrokeLab/Slider/Slider";
import { NotionCard, CardTitle, PropertyTag, CardHint, Badge } from "@/components/StrokeLab/StrokeLab.styles";
import { GaugeSvg, Verdict, CornerList } from "@/components/StrokeLab/SeamGauge/SeamGauge.styles";
import type { SeamGaugeProps, StrokeCorner } from "@/components/StrokeLab/StrokeLab.types";

// The gauge's scale runs from ratio 1 (a straight line) to this; anything sharper is pinned at the end.
const GAUGE_MAX = 10;

// Gauge drawing extents, in its own units.
const GAUGE = { left: 12, right: 308 };

// Ratio → x on the gauge, clamped so off-scale corners sit on the end stop.
function gaugeX(ratio: number): number {
  const r = Math.min(GAUGE_MAX, Math.max(1, Number.isFinite(ratio) ? ratio : GAUGE_MAX));
  return GAUGE.left + ((r - 1) / (GAUGE_MAX - 1)) * (GAUGE.right - GAUGE.left);
}

// A ratio as text, with infinity for a full reversal.
function ratioText(ratio: number): string {
  return Number.isFinite(ratio) ? fmt(ratio) : "∞";
}

/*
  stroke-miterlimit as a seam gauge: a steel rule marked in miter ratios, with each corner notched
  where its ratio falls and a red slider at the limit. Everything past the slider bevels. The readout
  spells out the sharpest corner's maths — ratio = 1 / sin(θ / 2), the same rule as the
  MiterLimitDiagram — and the cut-off angle the current limit implies.
*/
export default function SeamGauge({ state, actions, analysis, joinSupport }: SeamGaugeProps): JSX.Element {
  const { corners } = analysis;
  const join = effectiveLinejoin(state.linejoin, joinSupport);
  const applies = join === "miter" || join === "miter-clip" || join === "arcs";
  const sharpest = corners.reduce<StrokeCorner | null>((min, c) => (!min || c.angle < min.angle ? c : min), null);
  const limit = state.miterLimit;
  const cutoff = limitAngle(limit);
  const fallback = join === "miter" ? "bevel" : "clipped miter";
  const failing = corners.filter((c) => c.ratio > limit).length;

  return (
    <>
      <NotionCard>
        <CardTitle>
          Seam gauge <PropertyTag>stroke-miterlimit</PropertyTag>
        </CardTitle>

        <Slider label="stroke-miterlimit" min={LIMITS.miterLimit.min} max={LIMITS.miterLimit.max} step={0.1} decimals={1} value={limit} onChange={(v) => actions.update({ miterLimit: v })} onCommit={actions.commitEdit} />

        <GaugeSvg viewBox="0 0 320 70" role="img" aria-label={`Miter ratio gauge from 1 to ${GAUGE_MAX}, limit at ${fmt(limit, 1)}, ${corners.length} corners marked`}>
          <rect x={4} y={26} width={312} height={22} rx={3} fill="color-mix(in srgb, var(--color-fg-muted) 22%, var(--color-bg-default))" stroke="color-mix(in srgb, var(--color-fg-muted) 50%, transparent)" />
          {applies && <rect x={gaugeX(limit)} y={26} width={Math.max(0, GAUGE.right + 8 - gaugeX(limit))} height={22} fill="var(--haber-fail)" fillOpacity={0.14} />}
          {Array.from({ length: GAUGE_MAX }, (_, i) => i + 1).map((r) => (
            <g key={r}>
              <line x1={gaugeX(r)} x2={gaugeX(r)} y1={26} y2={34} stroke="var(--color-fg-default)" strokeOpacity={0.7} strokeWidth={1} />
              <text x={gaugeX(r)} y={45} textAnchor="middle" fontSize={8} fontFamily="ui-monospace, monospace" fill="var(--color-fg-default)">
                {r === GAUGE_MAX ? `${r}+` : r}
              </text>
            </g>
          ))}
          {corners.map((c) => {
            const x = gaugeX(c.ratio);
            const big = c.id === sharpest?.id;
            const tone = !applies ? "var(--haber-chalk)" : c.ratio > limit ? "var(--haber-fail)" : "var(--haber-pass)";
            return (
              <g key={c.id}>
                <polygon points={`${x - (big ? 5 : 3.5)},${big ? 12 : 16} ${x + (big ? 5 : 3.5)},${big ? 12 : 16} ${x},26`} fill={tone} />
                {big && (
                  <text x={x} y={9} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="ui-monospace, monospace" fill={tone}>
                    {c.id}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={gaugeX(limit)} x2={gaugeX(limit)} y1={22} y2={64} stroke="var(--haber-fail)" strokeWidth={2} />
          <polygon points={`${gaugeX(limit) - 6},64 ${gaugeX(limit) + 6},64 ${gaugeX(limit)},55`} fill="var(--haber-fail)" />
        </GaugeSvg>

        <Verdict aria-live="polite" data-tone={!sharpest || !applies ? "muted" : sharpest.ratio > limit ? "fail" : "pass"}>
          {!sharpest && <span>{analysis.ok ? "No corners to measure — this subject is smooth throughout, or (for text) its corners come from the font." : "Fix the path data to measure its corners."}</span>}
          {sharpest && (
            <>
              <span>
                Sharpest corner {sharpest.id}: θ = {fmt(sharpest.angle, 1)}°
              </span>
              <span>
                ratio = 1 / sin({fmt(sharpest.angle / 2, 1)}°) = {ratioText(sharpest.ratio)} {sharpest.ratio > limit ? ">" : "≤"} {fmt(limit, 1)}
              </span>
              <span>
                {!applies ? `stroke-linejoin is ${join}, so the limit doesn't apply.` : sharpest.ratio > limit ? `→ falls back to ${fallback}` : "→ the miter is drawn"}
              </span>
            </>
          )}
        </Verdict>

        {corners.length > 0 && (
          <CornerList aria-label="Every corner">
            {corners.map((c) => (
              <li key={c.id}>
                <Badge data-tone={!applies ? undefined : c.ratio > limit ? "fail" : "pass"}>
                  {c.id} {fmt(c.angle, 1)}° · {ratioText(c.ratio)}
                </Badge>
              </li>
            ))}
          </CornerList>
        )}

        <CardHint>
          The miter length is measured from the inner corner to the outer tip; the ratio is that ÷ <code>stroke-width</code>, so it depends only on the angle. A limit of <strong>{fmt(limit, 1)}</strong> bevels any corner sharper than <strong>{fmt(cutoff, 2)}°</strong>
          {applies && corners.length > 0 ? ` — ${failing} of ${corners.length} here.` : "."} The default is 4 (≈ 29°).
        </CardHint>
      </NotionCard>
    </>
  );
}

SeamGauge.displayName = "SeamGauge";
