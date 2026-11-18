import { runRegex } from "@/components/RegexTester/RegexTester.utils";
import type { RegexMatchRequest, RegexMatchResponse } from "@/components/RegexTester/RegexTester.types";

// The worker's own global scope, narrowed to the two members it uses — the DOM lib types `self` as a Window.
const scope = self as unknown as {
  addEventListener: (type: "message", listener: (event: MessageEvent<RegexMatchRequest>) => void) => void;
  postMessage: (message: RegexMatchResponse) => void;
};

// Matching runs here, off the main thread, so a catastrophically backtracking pattern can be terminated instead of freezing the page.
scope.addEventListener("message", (event) => {
  const { id, pattern, flags, testString } = event.data;
  scope.postMessage({ id, result: runRegex(pattern, flags, testString) });
});
