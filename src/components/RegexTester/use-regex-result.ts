"use client";

import { useEffect, useRef, useState } from "react";
import type { RegexResult, RegexMatchRequest, RegexMatchResponse } from "@/components/RegexTester/RegexTester.types";

// Long enough for any sane pattern on a pasted page of text, short enough that a runaway one is called out quickly.
const MATCH_TIMEOUT_MS = 1000;

// Shown while the very first result is on its way, so panels never flash "No matches" before the worker replies.
const PENDING_RESULT: RegexResult = { valid: true, error: null, matches: [], truncated: false };

/*
  Runs the pattern in a Web Worker rather than on the main thread. A pattern like `(a+)+$` against
  a few dozen characters backtracks exponentially — on the main thread that froze the whole tab, and
  a synchronous regex can't be interrupted. In a worker it can: if a job overruns the timeout, the
  worker is terminated and a fresh one is spun up for the next edit. A newer edit also terminates a
  still-running job, since its result would be stale anyway.
*/
export function useRegexResult(pattern: string, flags: string, testString: string): { result: RegexResult; pending: boolean } {
  // The inputs each answer was for — "pending" is just "the latest answer is for older inputs", so it never needs setting by hand.
  const [answer, setAnswer] = useState<{ pattern: string; flags: string; testString: string; result: RegexResult } | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const busyRef = useRef(false);
  const jobIdRef = useRef(0);

  useEffect(() => {
    // An unfinished job means the worker may be stuck backtracking — replace it rather than queue behind it.
    if (busyRef.current && workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (!workerRef.current) workerRef.current = new Worker(new URL("./regex-match.worker.ts", import.meta.url), { type: "module" });

    const worker = workerRef.current;
    const id = ++jobIdRef.current;
    busyRef.current = true;

    const timer = window.setTimeout(() => {
      if (id !== jobIdRef.current) return;
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      busyRef.current = false;
      setAnswer({ pattern, flags, testString, result: { valid: true, error: null, matches: [], truncated: false, timedOut: true } });
    }, MATCH_TIMEOUT_MS);

    function handleMessage(event: MessageEvent<RegexMatchResponse>) {
      if (event.data.id !== id) return;
      window.clearTimeout(timer);
      busyRef.current = false;
      setAnswer({ pattern, flags, testString, result: event.data.result });
    }

    worker.addEventListener("message", handleMessage);
    worker.postMessage({ id, pattern, flags, testString } satisfies RegexMatchRequest);

    return () => {
      window.clearTimeout(timer);
      worker.removeEventListener("message", handleMessage);
    };
  }, [pattern, flags, testString]);

  // Frees the worker when the tool unmounts.
  useEffect(() => () => workerRef.current?.terminate(), []);

  const pending = !answer || answer.pattern !== pattern || answer.flags !== flags || answer.testString !== testString;
  // While a newer job runs, the previous answer stays on screen rather than blanking every panel per keystroke.
  return { result: answer?.result ?? PENDING_RESULT, pending };
}
