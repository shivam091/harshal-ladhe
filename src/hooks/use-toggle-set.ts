import { useState } from "react";

/*
  Starts with everything on and never lets the last value switch off — an empty filtered
  list isn't a useful state, and there'd be no active chip left to undo it.
*/
export function useToggleSet<T>(allValues: readonly T[]): [ReadonlySet<T>, (value: T) => void] {
  const [selected, setSelected] = useState<ReadonlySet<T>>(() => new Set(allValues));

  function toggle(value: T): void {
    setSelected((current) => {
      if (current.has(value) && current.size === 1) return current;

      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return [selected, toggle];
}
