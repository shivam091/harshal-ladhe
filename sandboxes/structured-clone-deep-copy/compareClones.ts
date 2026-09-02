export interface CloneCheck {
  label: string;
  passed: boolean;
}

export interface CloneReport {
  method: string;
  error: string | null;
  checks: CloneCheck[];
}

// Builds a fresh sample object with a Date, a Map, an undefined property, and (optionally) a
// self-reference, so both cloning strategies can be compared against the exact same shape.
export function createSample(withCircularRef: boolean): Record<string, unknown> {
  const sample: Record<string, unknown> = {
    label: "clone me",
    createdAt: new Date(),
    scores: new Map([
      ["alice", 10],
      ["bob", 7]
    ]),
    missing: undefined
  };

  if (withCircularRef) sample.self = sample;

  return sample;
}

// Clones via the classic JSON round-trip, catching the TypeError it throws on circular structures.
export function cloneWithJSON(sample: Record<string, unknown>): CloneReport {
  try {
    const clone = JSON.parse(JSON.stringify(sample));
    return { method: "JSON.parse(JSON.stringify())", error: null, checks: runChecks(sample, clone) };
  } catch (error) {
    return { method: "JSON.parse(JSON.stringify())", error: (error as Error).message, checks: [] };
  }
}

// Clones via the native structuredClone() API.
export function cloneWithStructuredClone(sample: Record<string, unknown>): CloneReport {
  try {
    const clone = structuredClone(sample);
    return { method: "structuredClone()", error: null, checks: runChecks(sample, clone) };
  } catch (error) {
    return { method: "structuredClone()", error: (error as Error).message, checks: [] };
  }
}

// Runs the same set of type/shape assertions against a clone, regardless of which method produced it.
function runChecks(original: Record<string, unknown>, clone: Record<string, unknown>): CloneCheck[] {
  return [
    { label: "createdAt stays a Date instance", passed: clone.createdAt instanceof Date },
    { label: "scores stays a Map instance", passed: clone.scores instanceof Map },
    { label: "'missing' key is preserved (even as undefined)", passed: "missing" in clone },
    { label: "clone is a separate object, not the same reference", passed: clone !== original }
  ];
}
