// Colour roles, so setup and cleanup read as a matched pair at a glance.
export type CanvasEffectLifecycleTone = "neutral" | "success" | "danger" | "loop" | "ghost";

// Fill, stroke, label colour and optional dash for one tone, kept together so each tone stays consistent everywhere.
export interface CanvasEffectLifecycleToneStyle {
  // Muted fill keeps the label readable in every theme.
  fill: string;
  // Emphasis stroke carries the tone's meaning when fills look alike.
  stroke: string;
  // Matches the stroke so the label inherits the tone's meaning.
  text: string;
  // SVG stroke-dasharray, for tones that should read as ongoing or not-really-there.
  dash?: string;
}

// A phase as data, so both rows are laid out from the same shape and stay aligned.
export interface CanvasEffectLifecyclePhase {
  // Phases share one row, so only the horizontal position varies.
  x: number;
  // Width of the box, so the loop span can be visibly longer than the instant phases.
  w: number;
  // Phase names are what the diagram teaches, so they live with the geometry.
  label: string;
  // Tone, not raw colours, so every theme repaints the pairing consistently.
  tone: CanvasEffectLifecycleTone;
}

// Phase details as data, since a box label alone doesn't say what the phase actually does.
export interface CanvasEffectLifecycleNote {
  // Notes sit beside their phase, not inside it, so they need their own position.
  x: number;
  // Alternating above and below the boxes keeps neighbouring notes from colliding.
  y: number;
  // Box labels alone don't say what a phase actually does.
  text: string;
  // Real API calls need monospace so they read as code, not prose.
  mono: boolean;
  // Horizontal anchor, so notes near the right edge can hug it without overflowing.
  anchor: "start" | "middle" | "end";
}
