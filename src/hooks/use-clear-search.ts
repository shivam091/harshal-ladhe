import { useRef, useState, type RefObject } from "react";
import useInterval from "@/hooks/use-interval";
import { getIntervalLength } from "@/components/Search/SearchBox/SearchBox.helpers";

// Args for useClearSearch — the lifted query state it drives, plus the input to refocus once cleared.
interface UseClearSearchArgs {
  // Current text in the search input, read each tick to know how many characters are left to delete.
  inputValue: string;
  // Setter for the lifted query state — called once per tick to peel off the trailing character.
  setInputValue: (value: string) => void;
  // Ref to the search input, refocused once the melt-away animation finishes clearing it.
  inputRef: RefObject<HTMLInputElement | null>;
}

/*
  Drives the clear button's "melt away" animation — instead of blanking the input instantly,
  deletes one character per tick at the decelerating cadence above until empty, then refocuses
  the search input (but only if focus is still on the clear button, i.e. the user hasn't
  clicked elsewhere in the meantime).
*/
export function useClearSearch({ inputValue, setInputValue, inputRef }: UseClearSearchArgs) {
  // True for the duration of the melt-away animation — gates the ticking interval below.
  const [isClearingValue, setIsClearingValue] = useState(false);
  // Ref to the clear button itself, checked below to decide whether refocusing the input is appropriate.
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  useInterval(() => {
    if (!inputValue) {
      setIsClearingValue(false);

      // Only steal focus back to the input if the user hasn't already clicked elsewhere.
      if (document.activeElement === clearButtonRef.current) {
        window.requestAnimationFrame(() => {
          inputRef.current?.focus({ preventScroll: true });
        });
      }
      return;
    }

    // Peels off the trailing character each tick.
    setInputValue(inputValue.slice(0, -1));
  }, getIntervalLength(inputValue, isClearingValue));

  return { clearButtonRef, isClearingValue, setIsClearingValue };
}
