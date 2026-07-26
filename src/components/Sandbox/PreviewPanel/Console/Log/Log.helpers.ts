import type { IconName } from "@/icons/icons";
import type { ConsoleLogMethod } from "@/components/Sandbox/Sandbox.types";

// Only warn/error-ish methods get a flagging icon — everything else reads fine as plain coloured text.
export function getIconForMethod(method: ConsoleLogMethod): IconName | null {
  switch (method) {
    case "warn":
      return "exclamationTriangle";
    case "error":
    case "assert":
      return "alertOctagon";
    default:
      return null;
  }
}

/*
  Bundler-serialised errors include a stack trace pointing at minified, bundler-internal chunks
  with no source mapping — strip it, keeping only the human-readable first line.
*/
export function stripBundlerStack(value: string): string {
  const stackStart = value.indexOf("\n    at ");
  return stackStart === -1 ? value : value.slice(0, stackStart);
}

/*
  Pretty-prints a non-string console argument; falls back to String() if it isn't serializable
  (e.g. contains a circular reference).
*/
export function stringify(value: unknown): string {
  if (value === undefined) return "undefined";

  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}
