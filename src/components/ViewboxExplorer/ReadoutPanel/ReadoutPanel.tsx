import type { JSX } from "react";
import { describeCombination, formatMatrix, formatNumber } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { Display, Reading, Explanation } from "@/components/ViewboxExplorer/ReadoutPanel/ReadoutPanel.styles";
import type { ReadoutPanelProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

/*
  The numbers the browser works out behind every print — scale, translate and the matrix they make
  together — beside a short explanation of why this combination produced them. The explanation is
  a polite live region, so a screen reader hears the outcome of each change without the readout
  digits being read out on every drag frame.
*/
export default function ReadoutPanel({ state, transform }: ReadoutPanelProps): JSX.Element {
  const { title, body } = describeCombination(state, transform);
  const translate = `translate(${formatNumber(transform.translateX)} ${formatNumber(transform.translateY)})`;
  const scale = `scale(${formatNumber(transform.scaleX)} ${formatNumber(transform.scaleY)})`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Exposure readout</PanelTitle>
        <Display>
          <Reading>
            <dt>Scale x</dt>
            <dd>×{formatNumber(transform.scaleX)}</dd>
          </Reading>
          <Reading>
            <dt>Scale y</dt>
            <dd>×{formatNumber(transform.scaleY)}</dd>
          </Reading>
          <Reading>
            <dt>Translate x</dt>
            <dd>{formatNumber(transform.translateX)}px</dd>
          </Reading>
          <Reading>
            <dt>Translate y</dt>
            <dd>{formatNumber(transform.translateY)}px</dd>
          </Reading>
          <Reading data-wide="true">
            <dt>Transform</dt>
            <dd>
              {translate} {scale}
            </dd>
          </Reading>
          <Reading data-wide="true">
            <dt>Matrix</dt>
            <dd>{formatMatrix(transform)}</dd>
          </Reading>
        </Display>
        <Explanation aria-live="polite">
          <h4>{title}</h4>
          {body.map((sentence) => (
            <p key={sentence}>{sentence}</p>
          ))}
        </Explanation>
      </SectionCard>
    </>
  );
}

ReadoutPanel.displayName = "ReadoutPanel";
