"use client";

import { useId, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { formatNumber } from "@/utils/unit-converter";
import type { UnitRowProps } from "@/components/UnitConverter/UnitConverter.types";
import { Row, UnitTag, ValueInput, Basis } from "@/components/UnitConverter/ConversionTable/ConversionTable.styles";

/*
  One editable unit row. While focused it shows the person's own raw text (a draft) instead of the
  formatted value, so typing "1." or "-" isn't instantly rewritten to "1" or "0" under the cursor;
  every parseable keystroke still updates the other rows live.
*/
export default function UnitRow({ meta, value, basisPx, precision, isSource, actions }: UnitRowProps): JSX.Element {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const formatted = formatNumber(value, precision);

  // Accepts a pasted "24px" or "1.5rem" as well as a bare number, since people copy lengths straight out of stylesheets.
  function handleChange(text: string) {
    setDraft(text);
    const parsed = Number(text.trim().replace(new RegExp(`${meta.unit.replace("%", "\\%")}$`, "i"), "").trim());
    if (text.trim() !== "" && Number.isFinite(parsed)) actions.setValue(meta.unit, parsed);
  }

  // Arrow keys nudge like a native number field — Shift for 10, Alt for 0.1 — without number inputs' locale and scroll-wheel quirks.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
    const next = Number(formatNumber(value + (event.key === "ArrowUp" ? step : -step), Math.max(precision, 1)));
    setDraft(String(next));
    actions.setValue(meta.unit, next);
  }

  // Dropping the draft on blur snaps the field back to the formatted value, then checkpoints the whole edit as one undo step.
  function handleBlur() {
    setDraft(null);
    actions.commitDrag();
  }

  return (
    <>
      <Row data-source={isSource ? "true" : undefined}>
        <UnitTag htmlFor={id} title={meta.name}>
          {meta.unit}
        </UnitTag>
        <ValueInput
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          aria-label={`${meta.name} (${meta.unit})`}
          aria-describedby={`${id}-basis`}
          value={draft ?? formatted}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <Basis id={`${id}-basis`}>{meta.unit === "px" ? "reference unit" : `1${meta.unit} = ${formatNumber(basisPx, 3)}px`}</Basis>
      </Row>
    </>
  );
}

UnitRow.displayName = "UnitRow";
