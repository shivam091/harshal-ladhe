import type { CanvasEffectLifecycleNote, CanvasEffectLifecyclePhase, CanvasEffectLifecycleTone, CanvasEffectLifecycleToneStyle } from "@/components/mdx/CanvasEffectLifecycleDiagram/CanvasEffectLifecycleDiagram.types";

// API-call notes read as real code only in monospace.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Shared top edge, so the main timeline's boxes and arrows stay aligned.
export const MAIN_Y = 76;

// Shared height, so every main-timeline phase reads as the same kind of step.
export const MAIN_H = 40;

// Shared top edge, so the Strict Mode row's boxes and arrows stay aligned.
export const STRICT_Y = 206;

// Slimmer than the main timeline, since Strict Mode is a development-only aside.
export const STRICT_H = 32;

// Colour treatment per tone: success for setup and danger for cleanup, so the two halves of an effect pair up visually.
export const TONE_STYLES: Record<CanvasEffectLifecycleTone, CanvasEffectLifecycleToneStyle> = {
  neutral: { fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)", text: "var(--color-fg-default)" },
  success: { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)", text: "var(--color-fg-default)" },
  danger: { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)", text: "var(--color-fg-default)" },
  loop: { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)", text: "var(--color-fg-accent)", dash: "6 4" },
  ghost: { fill: "none", stroke: "var(--color-border-muted)", text: "var(--color-fg-muted)", dash: "4 3" }
};

// A component's canvas effect from first render to cleanup, with the loop span drawn longest because it's where the time goes.
export const MAIN_PHASES: CanvasEffectLifecyclePhase[] = [
  { x: 16, w: 64, label: "render", tone: "neutral" },
  { x: 96, w: 70, label: "commit", tone: "neutral" },
  { x: 182, w: 100, label: "effect setup", tone: "success" },
  { x: 298, w: 200, label: "loop runs — no re-renders", tone: "loop" },
  { x: 514, w: 76, label: "unmount", tone: "neutral" },
  { x: 606, w: 80, label: "cleanup", tone: "danger" }
];

// What each phase actually does, alternating above and below the boxes so neighbouring notes never collide.
export const MAIN_NOTES: CanvasEffectLifecycleNote[] = [
  { x: 48, y: 66, text: "JSX returned", mono: false, anchor: "middle" },
  { x: 232, y: 34, text: "getContext()", mono: true, anchor: "middle" },
  { x: 232, y: 50, text: "addEventListener()", mono: true, anchor: "middle" },
  { x: 232, y: 66, text: "start rAF loop / worker", mono: false, anchor: "middle" },
  { x: 686, y: 34, text: "cancelAnimationFrame()", mono: true, anchor: "end" },
  { x: 686, y: 50, text: "removeEventListener()", mono: true, anchor: "end" },
  { x: 686, y: 66, text: "worker.terminate()", mono: true, anchor: "end" },
  { x: 131, y: 136, text: "canvasRef.current", mono: true, anchor: "middle" },
  { x: 131, y: 152, text: "attached", mono: false, anchor: "middle" },
  { x: 552, y: 136, text: "component leaves", mono: false, anchor: "middle" },
  { x: 552, y: 152, text: "the page", mono: false, anchor: "middle" }
];

// Opens with a faded commit under the real one, because the extra pass happens straight after commit.
export const STRICT_PHASES: CanvasEffectLifecyclePhase[] = [
  { x: 96, w: 70, label: "commit", tone: "ghost" },
  { x: 182, w: 70, label: "setup", tone: "success" },
  { x: 268, w: 80, label: "cleanup", tone: "danger" },
  { x: 364, w: 70, label: "setup", tone: "success" }
];
