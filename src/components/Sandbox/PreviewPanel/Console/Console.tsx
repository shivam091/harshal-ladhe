import type { JSX } from "react";
import Log from "@/components/Sandbox/PreviewPanel/Console/Log";
import type { ConsoleProps } from "@/interfaces/sandbox";
import { Empty, List } from "@/components/Sandbox/PreviewPanel/Console/Console.styles";

/*
  Plain-text console output for the sandboxed preview — replaces Sandpack's built-in SandpackConsole,
  which rendered every logged argument as syntax-highlighted, quoted code.
*/
export default function Console({ logs }: ConsoleProps): JSX.Element {
  if (logs.length === 0) {
    return (
      <>
        <Empty>No console output yet.</Empty>
      </>
    );
  }

  return (
    <>
      <List>
        {logs.map((entry) => (
          <Log key={entry.id} entry={entry} />
        ))}
      </List>
    </>
  );
}

Console.displayName = "Console";
