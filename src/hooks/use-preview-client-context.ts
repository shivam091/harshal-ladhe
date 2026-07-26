import { useContext } from "react";
import { PreviewClientContext } from "@/components/Sandbox/PreviewPanel/PreviewClientContext";
import type { PreviewClientContextValue } from "@/interfaces/sandbox";

/*
  Reads the current preview client (iframe ref, error/log state, refresh/reset actions) —
  throws outside a PreviewClientProvider so a missing Provider fails loudly instead of silently
  rendering with undefined values.
*/
export function usePreviewClientContext(): PreviewClientContextValue {
  const context = useContext(PreviewClientContext);

  if (!context) {
    throw new Error(
      "usePreviewClientContext must be used within a PreviewClientProvider"
    );
  }

  return context;
}
