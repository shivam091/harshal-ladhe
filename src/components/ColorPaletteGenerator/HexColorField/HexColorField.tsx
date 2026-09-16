"use client";

import { useState } from "react";
import type { JSX } from "react";
import { isValidHex } from "@/utils/oklch";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { ChipRow, ChipSwatch, HexInput } from "@/components/ColorPaletteGenerator/HexColorField/HexColorField.styles";
import type { HexColorFieldProps } from "@/interfaces/color-palette";

/*
  Pairs a native color swatch with a free-typed hex field. The swatch commits on every pick; the
  text field keeps its own local draft so a mid-edit string like "#6366f" (not yet 6 digits) isn't
  rejected keystroke-by-keystroke — it only reaches the shared editor state once it's a valid
  6-digit hex, and snaps back to the last valid value on blur otherwise.

  Resyncing the draft when `value` changes externally (undo/redo, a preset, the swap button) is done
  during render rather than in an effect — the React-recommended way to "adjust state when a prop
  changes" without an extra render pass — by tracking the last `value` seen and updating both it and
  the draft together whenever they diverge.
*/
export default function HexColorField({ id, label, value, onChange, onCommit }: HexColorFieldProps): JSX.Element {
  const [draft, setDraft] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  function handleTextChange(next: string) {
    setDraft(next);
    if (isValidHex(next)) onChange(next);
  }

  function handleTextBlur() {
    if (!isValidHex(draft)) setDraft(value);
    onCommit();
  }

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <ChipRow>
          <ChipSwatch id={id} type="color" value={value} onChange={(event) => onChange(event.target.value)} onBlur={onCommit} />
          <HexInput type="text" value={draft} maxLength={7} spellCheck={false} onChange={(event) => handleTextChange(event.target.value)} onBlur={handleTextBlur} />
        </ChipRow>
      </FieldWrapper>
    </>
  );
}

HexColorField.displayName = "HexColorField";
