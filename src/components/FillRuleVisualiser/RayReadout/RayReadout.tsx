import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import { describeDirection, formatNumber, formatSigned, normaliseAngle } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import { SectionCard, PanelTitle, PanelHint } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import {
  RuleGrid,
  RuleCard,
  RuleName,
  Working,
  Term,
  Verdict,
  TallySvg,
  CrossingTable,
  DirectionGlyph,
  TableScroller
} from "@/components/FillRuleVisualiser/RayReadout/RayReadout.styles";
import type { RayReadoutProps, TallyMarksProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// Width of one five-bar gate of tally marks, including the gap after it.
const GATE_WIDTH = 26;

// Evenodd only cares how many crossings there are, so they're counted the way a glazier counts panes: in gates of five.
function TallyMarks({ count }: TallyMarksProps): JSX.Element {
  const gates = Math.ceil(count / 5);
  return (
    <>
      <TallySvg viewBox={`0 0 ${Math.max(1, gates) * GATE_WIDTH} 20`} width={Math.max(1, gates) * GATE_WIDTH} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => {
          const gate = Math.floor(index / 5);
          const position = index % 5;
          const x = gate * GATE_WIDTH;
          return position === 4 ? (
            <line key={index} data-strike="" x1={x - 1} y1={16} x2={x + 19} y2={4} />
          ) : (
            <line key={index} x1={x + 2 + position * 5} y1={2} x2={x + 2 + position * 5} y2={18} />
          );
        })}
      </TallySvg>
    </>
  );
}

TallyMarks.displayName = "TallyMarks";

/*
  The bench notes for the current ray: nonzero's running ±1 sum and evenodd's tally side by side,
  each with its verdict, then a log of every crossing in the order the ray meets it. The visible
  readout follows the hover preview; the polite live region only speaks for the pinned ray, so
  sweeping the pointer across the table doesn't flood a screen reader.
*/
export default function RayReadout({ probe, ray, announcement, previewing }: RayReadoutProps): JSX.Element {
  const { crossings, winding, count } = ray;
  const parity = count % 2 === 1 ? "odd" : "even";

  return (
    <>
      <SectionCard aria-labelledby="fill-rule-readout-title">
        <PanelTitle id="fill-rule-readout-title">Plumb line</PanelTitle>
        <PanelHint>
          {previewing ? "Previewing from the pointer — click to pin the ray here. " : ""}
          From <code>({formatNumber(probe.x)}, {formatNumber(probe.y)})</code>, heading {formatNumber(normaliseAngle(probe.angle))}° ({describeDirection(probe.angle)}),
          crossing {count} {count === 1 ? "edge" : "edges"}.
        </PanelHint>

        <RuleGrid>
          <RuleCard data-rule="nonzero" data-inside={ray.nonzeroInside ? "true" : undefined}>
            <RuleName>nonzero</RuleName>
            <Working>
              {crossings.length === 0 && <span>no crossings</span>}
              {crossings.map((crossing, index) => (
                <Term key={index} data-sign={crossing.sign}>
                  {formatSigned(crossing.sign)}
                </Term>
              ))}
              <span>= {formatSigned(winding)}</span>
            </Working>
            <Verdict>{ray.nonzeroInside ? "winding ≠ 0 → inside, filled" : "winding = 0 → outside, empty"}</Verdict>
          </RuleCard>

          <RuleCard data-rule="evenodd" data-inside={ray.evenoddInside ? "true" : undefined}>
            <RuleName>evenodd</RuleName>
            <Working>
              {count > 0 && <TallyMarks count={count} />}
              <span>
                {count} {count === 1 ? "crossing" : "crossings"}
              </span>
            </Working>
            <Verdict>{ray.evenoddInside ? `${parity} → inside, filled` : `${parity} → outside, empty`}</Verdict>
          </RuleCard>
        </RuleGrid>

        {crossings.length > 0 && (
          <TableScroller tabIndex={0} role="region" aria-label="Crossings in the order the ray meets them">
            <CrossingTable>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Edge runs</th>
                  <th scope="col">Subpath</th>
                  <th scope="col">±1</th>
                  <th scope="col">Winding</th>
                  <th scope="col">Count</th>
                </tr>
              </thead>
              <tbody>
                {crossings.map((crossing, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <DirectionGlyph data-sign={crossing.sign} aria-hidden="true" style={{ transform: `rotate(${formatNumber(crossing.tangent)}deg)` }}>
                        →
                      </DirectionGlyph>
                      {describeDirection(crossing.tangent)}
                    </td>
                    <td>{crossing.subpath + 1}</td>
                    <td>{formatSigned(crossing.sign)}</td>
                    <td>{formatSigned(crossing.running)}</td>
                    <td>{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </CrossingTable>
          </TableScroller>
        )}

        <VisuallyHidden aria-live="polite" aria-atomic="true">
          {announcement}
        </VisuallyHidden>
      </SectionCard>
    </>
  );
}

RayReadout.displayName = "RayReadout";
