import type { JSX } from "react";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import MetaBar from "@/components/Sandbox/MetaBar";
import { formatSelection, getLanguageLabel, formatFileSize } from "@/components/Sandbox/MetaBar/MetaBar.helpers";
import type { EditorMetaBarProps } from "@/components/Sandbox/Editor/EditorMetaBar/EditorMetaBar.types";
import { Position, SelectionInfo, Metric } from "@/components/Sandbox/MetaBar/MetaBar.styles";

// Sandpack's virtual filesystem has no per-file/user-selectable encoding to reflect — every file is UTF-8, same as a real editor would show for any plain-text file it opens.
const ENCODING_LABEL = "UTF-8";

// Mirrors the status bar most code editors show, so readers find position and file details where they expect.
export default function EditorMetaBar({ cursorInfo }: EditorMetaBarProps): JSX.Element {
  const { code } = useActiveCode();
  const { sandpack } = useSandpack();
  const selection = cursorInfo ? formatSelection(cursorInfo) : null;

  return (
    <>
      <MetaBar>
        <Position>
          Ln {cursorInfo?.line ?? "–"}, Col {cursorInfo?.column ?? "–"}
        </Position>
        {selection && <SelectionInfo>{selection}</SelectionInfo>}
        <Metric>{getLanguageLabel(sandpack.activeFile)}</Metric>
        <Metric>{formatFileSize(code)}</Metric>
        <Metric>{ENCODING_LABEL}</Metric>
      </MetaBar>
    </>
  );
}

EditorMetaBar.displayName = "EditorMetaBar";
