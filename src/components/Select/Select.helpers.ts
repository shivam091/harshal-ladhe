import type { SelectOption } from "@/components/Select/Select.types";

// Arrow keys and Home/End must never land on an option that can't be chosen.
export function findEnabledIndex<T extends string>(options: SelectOption<T>[], start: number, step: 1 | -1): number {
  for (let index = start; index >= 0 && index < options.length; index += step) {
    if (!options[index].disabled) return index;
  }
  return -1;
}

/*
  Lets keyboard users jump through a long list by typing, like a native select. Searching starts
  after the current option so repeated presses move on to the next match, and a run of the same
  letter ("bbb") cycles through every option starting with it rather than looking for "bbb".
*/
export function findTypeaheadIndex<T extends string>(options: SelectOption<T>[], query: string, currentIndex: number): number {
  const normalised = query.toLowerCase();
  const isRepeatedLetter = normalised.length > 1 && [...normalised].every((character) => character === normalised[0]);
  const search = isRepeatedLetter ? normalised[0] : normalised;
  const start = currentIndex < 0 ? 0 : currentIndex + (isRepeatedLetter || normalised.length === 1 ? 1 : 0);

  for (let offset = 0; offset < options.length; offset++) {
    const index = (start + offset) % options.length;
    const option = options[index];
    if (!option.disabled && option.label.toLowerCase().startsWith(search)) return index;
  }
  return -1;
}
