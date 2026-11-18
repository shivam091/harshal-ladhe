"use client";

import { useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { clamp } from "@/utils/number";

// Bounds and callbacks for one number field; min/max are optional so an unbounded field can still use the same draft handling.
export interface UseNumberDraftOptions {
  value: number;
  min?: number;
  max?: number;
  // Rejects fractional input for fields where only whole numbers are meaningful (a cron step, a day of the week).
  integer?: boolean;
  onValueChange: (value: number) => void;
}

// Props spread straight onto an <input type="number">.
export interface NumberDraftInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  "aria-invalid": boolean;
}

/*
  Keeps a number input's text as a local draft, separate from the committed number. Clamping on
  every keystroke made the field impossible to clear: an empty string fell back to (or coerced to)
  a number straight away, so Backspace never emptied it and the next digit was appended — typing
  "0" after deleting a "3" produced "30", which then clamped to the maximum. Only an in-range draft
  is passed up while typing; anything else waits for blur, which snaps it back into range.
*/
export function useNumberDraft({ value, min, max, integer = false, onValueChange }: UseNumberDraftOptions): NumberDraftInputProps {
  const [draft, setDraft] = useState(() => String(value));
  const [lastValue, setLastValue] = useState(value);

  // Resync when the value changes from outside (a preset), but leave a draft such as "05" alone when it already equals the new value.
  if (value !== lastValue) {
    setLastValue(value);
    if (draft.trim() === "" || Number(draft) !== value) setDraft(String(value));
  }

  // A draft is only worth passing up when it's a finite number that already satisfies every constraint.
  function parseValid(text: string): number | null {
    if (text.trim() === "") return null;
    const n = Number(text);
    if (!Number.isFinite(n) || (integer && !Number.isInteger(n))) return null;
    if ((min !== undefined && n < min) || (max !== undefined && n > max)) return null;
    return n;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    setDraft(text);
    const n = parseValid(text);
    if (n !== null && n !== value) onValueChange(n);
  }

  function handleBlur() {
    const n = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(n)) {
      setDraft(String(value));
    } else {
      const rounded = integer ? Math.round(n) : n;
      const next = clamp(rounded, min ?? -Infinity, max ?? Infinity);
      if (next !== value) onValueChange(next);
      setDraft(String(next));
    }
  }

  return { value: draft, onChange: handleChange, onBlur: handleBlur, "aria-invalid": parseValid(draft) === null };
}
