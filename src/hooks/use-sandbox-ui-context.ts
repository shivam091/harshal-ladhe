import { useContext } from "react";
import { SandboxUIContext } from "@/components/Sandbox/SandboxUIContext";
import type { SandboxUIContextValue } from "@/interfaces/sandbox";

/*
  Reads the current file-explorer/line-numbers toggle state — throws outside a SandboxUIProvider
  so a missing Provider fails loudly instead of silently rendering with undefined values.
*/
export function useSandboxUIContext(): SandboxUIContextValue {
  const context = useContext(SandboxUIContext);

  if (!context) {
    throw new Error("useSandboxUIContext must be used within a SandboxUIProvider");
  }

  return context;
}
