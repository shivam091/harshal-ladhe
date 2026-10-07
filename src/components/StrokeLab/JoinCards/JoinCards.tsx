"use client";

import { useId } from "react";
import type { JSX } from "react";
import { LINEJOIN_OPTIONS } from "@/components/StrokeLab/StrokeLab.helpers";
import { NotionCard, CardTitle, PropertyTag, CardHint, Badge, VisuallyHiddenInput } from "@/components/StrokeLab/StrokeLab.styles";
import { CardRack, ButtonCard, JoinSvg, JoinName } from "@/components/StrokeLab/JoinCards/JoinCards.styles";
import type { JoinCardsProps } from "@/components/StrokeLab/StrokeLab.types";

// A ≈ 50° corner — sharp enough that miter, round and bevel look plainly different at preview size, but under the default limit.
const PREVIEW_CORNER = "12,50 40,10 68,50";

/*
  stroke-linejoin as button cards. Each preview really is drawn with that keyword through the style
  attribute, so the SVG 2 pair show exactly what this browser does with them — and the badge says
  whether it parses them at all or quietly falls back to miter.
*/
export default function JoinCards({ state, actions, joinSupport }: JoinCardsProps): JSX.Element {
  const uid = useId();
  const selected = LINEJOIN_OPTIONS.find((o) => o.value === state.linejoin);
  const isSvg2 = state.linejoin === "miter-clip" || state.linejoin === "arcs";

  return (
    <>
      <NotionCard>
        <CardTitle>
          Corners <PropertyTag>stroke-linejoin</PropertyTag>
        </CardTitle>
        <CardRack role="radiogroup" aria-label="stroke-linejoin">
          {LINEJOIN_OPTIONS.map((option) => {
            const svg2 = option.value === "miter-clip" || option.value === "arcs";
            return (
              <ButtonCard key={option.value}>
                <VisuallyHiddenInput type="radio" name={`${uid}-linejoin`} value={option.value} checked={state.linejoin === option.value} onChange={() => actions.apply({ linejoin: option.value })} />
                <JoinSvg viewBox="0 0 80 60" aria-hidden="true">
                  <polyline points={PREVIEW_CORNER} fill="none" stroke={state.strokeColour} strokeWidth={14} strokeMiterlimit={state.miterLimit} style={{ strokeLinejoin: option.value }} />
                  <polyline points={PREVIEW_CORNER} fill="none" stroke="var(--haber-chalk)" strokeWidth={1} strokeDasharray="3 2" />
                </JoinSvg>
                <JoinName>{option.value}</JoinName>
                {svg2 && <Badge data-tone={joinSupport[option.value] ? "pass" : "warn"}>{joinSupport[option.value] ? "SVG 2 ✓" : "SVG 2 → miter"}</Badge>}
              </ButtonCard>
            );
          })}
        </CardRack>
        <CardHint>{selected?.description}</CardHint>
        {isSvg2 && !joinSupport[state.linejoin] && (
          <CardHint>
            <Badge data-tone="warn">Fallback</Badge> This browser doesn&apos;t parse <code>{state.linejoin}</code>, so the declaration is dropped and the initial value, <code>miter</code>, is drawn — still subject to <code>stroke-miterlimit</code>. In CSS, write <code>stroke-linejoin: miter;</code> first and the SVG 2 value second, so unsupporting browsers keep the miter. The stage outlines in amber where SVG 2 would clip.
          </CardHint>
        )}
      </NotionCard>
    </>
  );
}

JoinCards.displayName = "JoinCards";
