"use client";

import { useState } from "react";
import type { JSX } from "react";
import { isValidHex } from "@/utils/oklch";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { HexRow, SwatchInput, HexTextInput } from "@/components/ColorMixPlayground/HexColorField/HexColorField.styles";
import type { HexColorFieldProps } from "@/interfaces/color-mix";

// Its own copy of ColorPaletteGenerator's HexColorField rather than a cross-tool import — every goodie owns its copy of shared-shaped controls.
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
        <HexRow>
          <SwatchInput id={id} type="color" value={value} onChange={(event) => onChange(event.target.value)} onBlur={onCommit} />
          <HexTextInput type="text" value={draft} maxLength={7} spellCheck={false} onChange={(event) => handleTextChange(event.target.value)} onBlur={handleTextBlur} />
        </HexRow>
      </FieldWrapper>
    </>
  );
}

HexColorField.displayName = "HexColorField";
