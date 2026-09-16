import type { JSX } from "react";
import { contrastRatio, evaluateWcag } from "@/utils/oklch";
import type { WcagResult } from "@/utils/oklch";
import type { ContrastResultProps } from "@/interfaces/color-palette";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import {
  Seal,
  StampBadge,
  StampGrade,
  StampCaption,
  SealMeta,
  RatioRow,
  RatioValue,
  RatioLabel,
  ThresholdRow,
  ThresholdChip,
  ProofPane,
  ProofLarge,
  ProofNormal
} from "@/components/ColorPaletteGenerator/ContrastResult/ContrastResult.styles";

// The stamp's own grade letters plus which ink tone to stamp it in — the single best claim the pair can make, from strongest (AAA) down to a plain fail.
function stampGrade(wcag: WcagResult): { grade: string; tone: "pass-high" | "pass" | "fail" } {
  if (wcag.aaaNormal) return { grade: "AAA", tone: "pass-high" };
  if (wcag.aaNormal) return { grade: "AA", tone: "pass" };
  if (wcag.aaLarge) return { grade: "AA*", tone: "pass" };
  return { grade: "FAIL", tone: "fail" };
}

/*
  The tool's other flagship flourish: the live WCAG readout for the foreground/background pair,
  presented as a print-shop quality-control stamp rather than a plain colored pill — the grade
  letters and ink color are the headline, with the raw ratio, the four individual threshold
  tickets, and a literal "press proof" of the pair as supporting detail underneath.
*/
export default function ContrastResult({ state }: ContrastResultProps): JSX.Element {
  const wcag = evaluateWcag(contrastRatio(state.foreground, state.background));
  const { grade, tone } = stampGrade(wcag);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Quality Check</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Seal>
            <StampBadge data-tone={tone} role="img" aria-label={`WCAG contrast grade: ${grade}`}>
              <StampGrade>{grade}</StampGrade>
              <StampCaption>WCAG 2.x</StampCaption>
            </StampBadge>

            <SealMeta>
              <RatioRow>
                <RatioValue>{wcag.ratio.toFixed(2)}:1</RatioValue>
                <RatioLabel>contrast ratio</RatioLabel>
              </RatioRow>
              <ThresholdRow>
                <ThresholdChip data-pass={wcag.aaNormal}>AA normal</ThresholdChip>
                <ThresholdChip data-pass={wcag.aaLarge}>AA large</ThresholdChip>
                <ThresholdChip data-pass={wcag.aaaNormal}>AAA normal</ThresholdChip>
                <ThresholdChip data-pass={wcag.aaaLarge}>AAA large</ThresholdChip>
              </ThresholdRow>
            </SealMeta>
          </Seal>

          <ProofPane style={{ background: state.background }}>
            <ProofLarge style={{ color: state.foreground }}>Large text proof</ProofLarge>
            <ProofNormal style={{ color: state.foreground }}>Normal text proof — the quick brown fox jumps over the lazy dog.</ProofNormal>
          </ProofPane>
        </PanelBody>
      </Panel>
    </>
  );
}

ContrastResult.displayName = "ContrastResult";
