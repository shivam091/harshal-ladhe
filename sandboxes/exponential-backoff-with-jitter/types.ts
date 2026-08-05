export interface RetryOptions {
  retries?: number;
  delay?: number;
  maxDelay?: number;
  jitter?: boolean;
  // Reports each computed wait so the demo can plot exactly when a retry fires.
  onWait?: (ms: number) => void;
  // Prefixes console output so concurrent clients stay distinguishable in the log.
  label?: string;
}

export interface RetryEvent {
  client: number;
  elapsedMs: number;
}
