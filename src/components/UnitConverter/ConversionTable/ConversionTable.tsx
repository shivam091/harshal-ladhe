"use client";

import type { JSX } from "react";
import { fromPx, pxPerUnit, toPx } from "@/utils/unit-converter";
import { UNIT_META, UNIT_ORDER } from "@/data/unit-converter-units";
import UnitRow from "@/components/UnitConverter/ConversionTable/UnitRow";
import { RowList } from "@/components/UnitConverter/ConversionTable/ConversionTable.styles";
import { SectionCard, PanelTitle, PanelHint } from "@/components/UnitConverter/UnitConverter.styles";
import type { ConversionTableProps } from "@/components/UnitConverter/UnitConverter.types";

// Resolves the typed value to px once, then fans it out to every row — so all eight readings always describe exactly the same length.
export default function ConversionTable({ state, actions }: ConversionTableProps): JSX.Element {
  const lengthPx = toPx(state.value, state.sourceUnit, state.context);

  return (
    <>
      <SectionCard>
        <PanelTitle>Convert</PanelTitle>
        <PanelHint>Type in any row — every other unit follows. Arrow keys nudge by 1 (Shift ×10, Alt ×0.1).</PanelHint>
        <RowList>
          {UNIT_ORDER.map((unit) => (
            <UnitRow
              key={unit}
              meta={UNIT_META[unit]}
              value={unit === state.sourceUnit ? state.value : fromPx(lengthPx, unit, state.context)}
              basisPx={pxPerUnit(unit, state.context)}
              precision={state.precision}
              isSource={unit === state.sourceUnit}
              actions={actions}
            />
          ))}
        </RowList>
      </SectionCard>
    </>
  );
}

ConversionTable.displayName = "ConversionTable";
