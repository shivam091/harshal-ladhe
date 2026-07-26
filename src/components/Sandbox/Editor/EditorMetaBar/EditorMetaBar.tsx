import { JSX } from "react";
import MetaBar from "@/components/Sandbox/MetaBar";
import { formatSelection } from "@/components/Sandbox/MetaBar/MetaBar.helpers";
import type { EditorMetaBarProps } from "@/interfaces/sandbox";
import { Position, SelectionInfo } from "@/components/Sandbox/MetaBar/MetaBar.styles";

/*
  Status bar under the editor column — current line/column and selection stats, mirroring the
  Ln/Col readout most code editors show.
*/
export default function EditorMetaBar({ cursorInfo }: EditorMetaBarProps): JSX.Element {
  const selection = cursorInfo ? formatSelection(cursorInfo) : null;

  return (
    <>
      <MetaBar>
        <Position>
          Ln {cursorInfo?.line ?? "–"}, Col {cursorInfo?.column ?? "–"}
        </Position>
        {selection && <SelectionInfo>{selection}</SelectionInfo>}
      </MetaBar>
    </>
  );
}

EditorMetaBar.displayName = "EditorMetaBar";
