import type { ConsoleLogEntry } from "@/components/Sandbox/Sandbox.types";

// Props for Console — the plain-text console output panel.
export interface ConsoleProps {
  logs: ConsoleLogEntry[];
}
