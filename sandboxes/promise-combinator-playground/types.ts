// Which Promise static method the playground currently runs against the three simulated tasks.
export type CombinatorKind = "all" | "allSettled" | "race" | "any";

// A single simulated task's tunable behavior: how long it takes to settle, and whether it fails.
export interface TaskConfig {
  label: string;
  delayMs: number;
  shouldFail: boolean;
}

// A task's live settle state, independent of whichever combinator is racing it.
export type TaskStatus = "pending" | "resolved" | "rejected";

export interface TaskState {
  status: TaskStatus;
  elapsedMs: number | null;
}
