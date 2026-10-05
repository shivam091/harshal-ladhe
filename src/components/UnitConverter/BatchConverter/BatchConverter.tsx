"use client";

import { useId } from "react";
import type { JSX } from "react";
import { convert, formatNumber, parseBatchValues } from "@/utils/unit-converter";
import { UNIT_META, UNIT_ORDER } from "@/data/unit-converter-units";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { BatchFields, BatchTextarea, TextInput, TableScroller, ScaleTable, ScaleSwatch, EmptyNote } from "@/components/UnitConverter/BatchConverter/BatchConverter.styles";
import { SectionCard, PanelTitle, PanelHint } from "@/components/UnitConverter/UnitConverter.styles";
import type { BatchConverterProps, CssUnit } from "@/components/UnitConverter/UnitConverter.types";

// Narrows the select's string value back to a CssUnit — the options only ever come from UNIT_ORDER, so anything else is ignored.
function toCssUnit(value: string): CssUnit | null {
  return (UNIT_ORDER as string[]).includes(value) ? (value as CssUnit) : null;
}

/*
  Converts a whole px scale at once — the usual job when moving a design's spacing or type tokens
  into rem. Uses the same context as the single converter, so the table and the exports below it
  always agree with the rows above.
*/
export default function BatchConverter({ state, actions }: BatchConverterProps): JSX.Element {
  const id = useId();
  const values = parseBatchValues(state.batchInput);

  return (
    <>
      <SectionCard>
        <PanelTitle>Batch scale</PanelTitle>
        <PanelHint>Paste a list of px values — commas, spaces or new lines all work.</PanelHint>

        <FieldWrapper>
          <FieldLabel htmlFor={`${id}-list`}>px values</FieldLabel>
          <BatchTextarea
            id={`${id}-list`}
            rows={2}
            spellCheck={false}
            value={state.batchInput}
            onChange={(event) => actions.setBatchInput(event.target.value)}
            onBlur={actions.commitDrag}
          />
        </FieldWrapper>

        <BatchFields>
          <FieldWrapper>
            <FieldLabel htmlFor={`${id}-unit`}>Convert to</FieldLabel>
            <SelectWrapper>
              <SelectInput
                id={`${id}-unit`}
                value={state.batchUnit}
                onChange={(event) => {
                  const unit = toCssUnit(event.target.value);
                  if (unit) actions.setBatchUnit(unit);
                }}
              >
                {UNIT_ORDER.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit} — {UNIT_META[unit].name}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor={`${id}-prefix`}>Custom property prefix</FieldLabel>
            <TextInput
              id={`${id}-prefix`}
              value={state.batchPrefix}
              maxLength={24}
              spellCheck={false}
              onChange={(event) => actions.setBatchPrefix(event.target.value)}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
        </BatchFields>

        {values.length === 0 ? (
          <EmptyNote>No numbers found in the list yet.</EmptyNote>
        ) : (
          <TableScroller>
            <ScaleTable>
              <thead>
                <tr>
                  <th scope="col">px</th>
                  <th scope="col">{state.batchUnit}</th>
                  <th scope="col">True length</th>
                </tr>
              </thead>
              <tbody>
                {values.map((px) => (
                  <tr key={px}>
                    <td>{px}px</td>
                    <td>
                      {formatNumber(convert(px, "px", state.batchUnit, state.context), state.precision)}
                      {state.batchUnit}
                    </td>
                    <td>
                      <ScaleSwatch style={{ inlineSize: `${Math.max(px, 0)}px` }} aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </ScaleTable>
          </TableScroller>
        )}
      </SectionCard>
    </>
  );
}

BatchConverter.displayName = "BatchConverter";
