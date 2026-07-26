import { StateEffect, StateField, type StateEffectType } from "@codemirror/state";

// One StateEffect + its backing StateField, wired together — the effect's dispatched value becomes the field's next value, otherwise it holds steady.
export interface ToggleField {
  effect: StateEffectType<boolean>;
  field: StateField<boolean>;
}

/*
  A boolean CodeMirror StateField that only ever changes via its own StateEffect — the shape
  shared by every visibility toggle (indent guides, sticky scroll, breadcrumbs) that a toolbar
  button dispatches into the editor. `initial` seeds the field before any effect fires.
*/
export function createToggleField(initial: boolean): ToggleField {
  const effect = StateEffect.define<boolean>();

  const field = StateField.define<boolean>({
    create: () => initial,
    update(value, tr) {
      for (const toggled of tr.effects) {
        if (toggled.is(effect)) return toggled.value;
      }
      return value;
    }
  });

  return { effect, field };
}
