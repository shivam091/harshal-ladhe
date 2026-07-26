import type { JSX } from "react";
import type { MetaBarProps } from "@/interfaces/sandbox";
import { Root } from "@/components/Sandbox/MetaBar/MetaBar.styles";

// Thin status bar shared by the editor (EditorMetaBar) and preview (PreviewPanel) columns.
export default function MetaBar({ children }: MetaBarProps): JSX.Element {
  return (
    <>
      <Root>
        {children}
      </Root>
    </>
  );
}

MetaBar.displayName = "MetaBar";
