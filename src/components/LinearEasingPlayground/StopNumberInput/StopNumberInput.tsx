import type { JSX } from "react";
import { useNumberDraft } from "@/hooks/use-number-draft";
import { NumberField } from "@/components/LinearEasingPlayground/LinearEasingPlayground.styles";
import type { StopNumberInputProps } from "@/components/LinearEasingPlayground/StopNumberInput/StopNumberInput.types";

// Its own component so each stop row can hold a typing draft — hooks can't be called inside the stop list's map.
export default function StopNumberInput({ value, min, max, step, disabled, label, onValueChange }: StopNumberInputProps): JSX.Element {
  const draft = useNumberDraft({ value, min, max, onValueChange });

  return (
    <>
      <NumberField type="number" step={step} min={min} max={max} disabled={disabled} aria-label={label} {...draft} />
    </>
  );
}

StopNumberInput.displayName = "StopNumberInput";
