import type { JSX } from "react";
import { contrastRatio, evaluateWcag } from "@/utils/oklch";
import type { ContrastResultProps } from "@/interfaces/color-palette";
import { Stage, RatioRow, RatioValue, RatioLabel, BadgeRow, Badge, SamplePane, SampleLarge, SampleNormal } from "@/components/ColorPaletteGenerator/ContrastResult/ContrastResult.styles";

// Live WCAG 2.x contrast readout for the foreground/background pair — ratio, four pass/fail badges, and the actual pair rendered as text at both the "normal" and "large text" sizes those thresholds are defined against.
export default function ContrastResult({ state }: ContrastResultProps): JSX.Element {
  const wcag = evaluateWcag(contrastRatio(state.foreground, state.background));

  return (
    <>
      <Stage>
        <RatioRow>
          <RatioValue>{wcag.ratio.toFixed(2)}:1</RatioValue>
          <RatioLabel>contrast ratio</RatioLabel>
        </RatioRow>

        <BadgeRow>
          <Badge data-pass={wcag.aaNormal}>AA normal text</Badge>
          <Badge data-pass={wcag.aaLarge}>AA large text</Badge>
          <Badge data-pass={wcag.aaaNormal}>AAA normal text</Badge>
          <Badge data-pass={wcag.aaaLarge}>AAA large text</Badge>
        </BadgeRow>

        <SamplePane style={{ background: state.background }}>
          <SampleLarge style={{ color: state.foreground }}>Large text sample</SampleLarge>
          <SampleNormal style={{ color: state.foreground }}>Normal text sample — the quick brown fox jumps over the lazy dog.</SampleNormal>
        </SamplePane>
      </Stage>
    </>
  );
}

ContrastResult.displayName = "ContrastResult";
