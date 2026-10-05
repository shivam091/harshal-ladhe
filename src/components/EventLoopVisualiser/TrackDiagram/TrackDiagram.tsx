import type { JSX } from "react";
import Siding from "@/components/EventLoopVisualiser/Siding/Siding";
import Turntable from "@/components/EventLoopVisualiser/Turntable/Turntable";
import {
  DiagramTop,
  Sidings,
  LampPanel,
  ApiLamp,
  DueAt,
  EmptyNote,
  SubTitle,
  DepartureBoard,
  BoardLine,
  BoardNote
} from "@/components/EventLoopVisualiser/TrackDiagram/TrackDiagram.styles";
import type { TrackDiagramProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

/*
  The whole runtime for one snapshot, laid out as a signal-box diagram: the turntable shows which
  stage the loop is in, lamps show what the Web APIs are holding, sidings hold the queued work, and
  the departure board is the console. Purely presentational — every value comes from the snapshot.
*/
export default function TrackDiagram({ snapshot, hideConsole }: TrackDiagramProps): JSX.Element {
  const { phase } = snapshot;

  return (
    <>
      <DiagramTop>
        <Turntable phase={phase} clockMs={snapshot.clockMs} />
        <div>
          <SubTitle>Web APIs</SubTitle>
          <LampPanel aria-label="Pending Web APIs">
            {snapshot.webApis.length === 0 ? (
              <EmptyNote>No timers or requests pending</EmptyNote>
            ) : (
              snapshot.webApis.map((api) => (
                <ApiLamp key={api.id}>
                  {api.label}
                  <DueAt>due {api.dueAtMs} ms</DueAt>
                </ApiLamp>
              ))
            )}
          </LampPanel>
        </div>
      </DiagramTop>

      <Sidings>
        <Siding title="Call stack" cars={snapshot.stack} emptyLabel="Empty — the loop may pick new work" tone="stack" active={snapshot.stack.length > 0} />
        <Siding title="Microtasks" cars={snapshot.microtasks} emptyLabel="No microtasks queued" tone="micro" active={phase === "microtask"} />
        <Siding title="Task queue" cars={snapshot.macrotasks} emptyLabel="No tasks queued" tone="macro" active={phase === "task"} />
        <Siding title="rAF / render" cars={snapshot.rafCallbacks} emptyLabel="No frame callbacks" tone="raf" active={phase === "render"} />
      </Sidings>

      <div>
        <SubTitle>Console</SubTitle>
        <DepartureBoard aria-label="Console output">
          {hideConsole ? (
            <BoardNote>Output hidden until you reveal your prediction.</BoardNote>
          ) : snapshot.console.length === 0 ? (
            <BoardNote>Nothing logged yet</BoardNote>
          ) : (
            snapshot.console.map((line) => <BoardLine key={line.id}>{line.text}</BoardLine>)
          )}
        </DepartureBoard>
      </div>
    </>
  );
}

TrackDiagram.displayName = "TrackDiagram";
