export interface RetryOptions {
  retries?: number;
  delay?: number;
  maxDelay?: number;
}

export type Status = "idle" | "running" | "success" | "failed";
