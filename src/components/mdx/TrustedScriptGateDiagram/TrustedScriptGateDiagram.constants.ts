// Flowchart boxes in drawing order, so the diagram reads top to bottom exactly as the CSP hook decides.
export const STEPS = [
  { id: "call", y: 10, h: 38, lines: ["eval(x) or new Function(…)"], tone: "neutral" },
  { id: "brand", y: 78, h: 46, lines: ["Are the body and every", "parameter a TrustedScript?"], tone: "question" },
  { id: "default", y: 160, h: 56, lines: ["Does the default policy return", "the same code unchanged?"], tone: "question" }
] as const;

// Left edge and width shared by every box in the main column, so the arrows between them stay vertical.
export const COLUMN_X = 20;
export const COLUMN_W = 220;
