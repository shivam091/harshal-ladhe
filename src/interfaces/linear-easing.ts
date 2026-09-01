// One stop in a linear() easing function: a progress value and an optional pinned position.
export interface LinearEasingStop {
  // Unique id for React keys and drag targeting — not part of the generated CSS.
  id: string;
  // Progress value at this stop. Unbounded, matching the CSS spec — can exceed 0-1 for bounce/spring overshoot.
  value: number;
  // Percentage (0-100) pinning this stop to an exact point in the duration. null means auto-spaced.
  position: number | null;
}

// A stop after auto-spacing has resolved every position to a concrete 0-100 percentage.
export interface ResolvedLinearEasingStop extends LinearEasingStop {
  resolvedPosition: number;
}

// One named linear() preset: its stops plus the display label shown in the playground's preset picker.
export interface LinearEasingPreset {
  label: string;
  stops: LinearEasingStop[];
}
