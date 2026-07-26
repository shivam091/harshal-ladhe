"use client";

import { createContext, useState, JSX } from "react";
import type {
  SandboxUIContextValue,
  SandboxUIProviderProps
} from "@/interfaces/sandbox";
import type { PreviewPanelTab } from "@/types/sandbox";
import type { SplitPaneDirection } from "@/types/split-pane";

// Backing context for useSandboxUIContext — exported so that hook can read it without owning the Provider.
export const SandboxUIContext = createContext<SandboxUIContextValue | null>(
  null
);

/*
  Bridges file-explorer/line-numbers/active-tab/layout-override state between SandboxClient and the
  toolbar/PreviewPanel's own toggles, which are siblings, not parent/child.
*/
export function SandboxUIProvider({
  defaultShowLineNumbers,
  defaultLayout = null,
  children
}: SandboxUIProviderProps): JSX.Element {
  // Every sandbox starts with its file explorer closed — reopen it via FileExplorerButton in the toolbar.
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(defaultShowLineNumbers);
  const [activeTab, setActiveTab] = useState<PreviewPanelTab>("output");
  const [layoutOverride, setLayoutOverride] = useState<SplitPaneDirection | null>(defaultLayout);

  const toggleFileExplorer = () => setShowFileExplorer((v) => !v);
  const toggleLineNumbers = () => setShowLineNumbers((v) => !v);

  // Auto -> Stacked -> Side-by-side -> Auto, so a forced layout always has a way back to the responsive default.
  const cycleLayoutOverride = () =>
    setLayoutOverride((current) => {
      if (current === null) return "vertical";
      if (current === "vertical") return "horizontal";
      return null;
    });

  return (
    <>
      <SandboxUIContext.Provider
        value={{
          showFileExplorer,
          toggleFileExplorer,
          showLineNumbers,
          toggleLineNumbers,
          activeTab,
          setActiveTab,
          layoutOverride,
          cycleLayoutOverride
        }}
      >
        {children}
      </SandboxUIContext.Provider>
    </>
  );
}
