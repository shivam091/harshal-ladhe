import type { JSX } from "react";
import type { MetaBarProps } from "@/components/Sandbox/MetaBar/MetaBar.types";
import { Root } from "@/components/Sandbox/MetaBar/MetaBar.styles";

// One status bar component so the editor and preview columns read as a pair.
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
