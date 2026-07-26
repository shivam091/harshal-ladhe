import { StateEffect, StateField, type StateEffectType } from "@codemirror/state";

// One StateEffect + its backing StateField, wired together — the effect's dispatched value becomes the field's next value, otherwise it holds steady.
export interface ToggleField {
  effect: StateEffectType<boolean>;
  field: StateField<boolean>;
}

// One shape for every toolbar visibility toggle, so each changes only through its own effect.
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
