import type { JSX } from "react";
import { PlusIcon, TrashIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { ContentAlignment, GridAlignment, GridAutoFlow, GridContainerControlsProps, GridTrack, TrackUnit } from "@/interfaces/layout-playground";
import { TrackRows, TrackRow, TrackSizeInput, TrackRemoveButton, AddTrackButton } from "@/components/LayoutPlayground/GridContainerControls/GridContainerControls.styles";

const UNITS: TrackUnit[] = ["fr", "px", "%", "auto"];
const AUTO_FLOWS: GridAutoFlow[] = ["row", "column", "row dense", "column dense"];
const ALIGNMENTS: GridAlignment[] = ["stretch", "start", "end", "center"];
const CONTENT_ALIGNMENTS: ContentAlignment[] = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch"];

interface TrackListProps {
  label: string;
  tracks: GridTrack[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  onCommit: () => void;
}

// One editable track list — used twice below (columns, rows) rather than pulled into its own file, since it's only ever needed from this one component, the same "used more than once but only within one file" threshold ShapeControls' local Slider already set for the clip-path tool.
function TrackList({ label, tracks, onAdd, onRemove, onUpdate, onCommit }: TrackListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <TrackRows>
          {tracks.map((track) => (
            <TrackRow key={track.id}>
              <TrackSizeInput
                type="number"
                min={0}
                disabled={track.unit === "auto"}
                value={track.size}
                aria-label={`${label} track size`}
                onChange={(event) => onUpdate(track.id, { size: Number(event.target.value) })}
                onBlur={onCommit}
              />
              <SelectWrapper>
                {/*
                  onBlur (not a same-tick onChange+onCommit call) is what checkpoints this —
                  useUndoStack's commit() closes over `state`/`pendingBaseline` from the last
                  completed render, so calling it synchronously right after onUpdate's setPresent
                  in the same handler would read stale pre-update values. onBlur fires on a later
                  render's callback instance instead, same as the size field beside it.
                */}
                <SelectInput
                  aria-label={`${label} track unit`}
                  value={track.unit}
                  onChange={(event) => onUpdate(track.id, { unit: event.target.value as TrackUnit })}
                  onBlur={onCommit}
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </SelectInput>
              </SelectWrapper>
              <TrackRemoveButton type="button" aria-label={`Remove ${label.toLowerCase()} track`} onClick={() => onRemove(track.id)}>
                <TrashIcon size={14} />
              </TrackRemoveButton>
            </TrackRow>
          ))}
        </TrackRows>
        <AddTrackButton type="button" onClick={onAdd}>
          <PlusIcon size={14} />
          Add track
        </AddTrackButton>
      </FieldWrapper>
    </>
  );
}

/*
  Every grid-only container property: the two track lists (grid-template-columns/rows) plus
  auto-flow and the four alignment keywords. Rendered only while state.mode === "grid" — the parent
  SectionCard swaps this out for FlexContainerControls entirely rather than showing both at once.
*/
export default function GridContainerControls({ state, actions }: GridContainerControlsProps): JSX.Element {
  const { columns, rows, autoFlow, justifyItems, alignItems, justifyContent, alignContent } = state.gridContainer;

  return (
    <>
      <TrackList label="Columns" tracks={columns} onAdd={actions.addColumnTrack} onRemove={actions.removeColumnTrack} onUpdate={actions.updateColumnTrack} onCommit={actions.commitDrag} />
      <TrackList label="Rows" tracks={rows} onAdd={actions.addRowTrack} onRemove={actions.removeRowTrack} onUpdate={actions.updateRowTrack} onCommit={actions.commitDrag} />

      <FieldWrapper>
        <FieldLabel htmlFor="layout-grid-auto-flow">Auto flow</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-grid-auto-flow" value={autoFlow} onChange={(event) => actions.updateGridContainer({ autoFlow: event.target.value as GridAutoFlow })}>
            {AUTO_FLOWS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-grid-justify-items">Justify items</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-grid-justify-items" value={justifyItems} onChange={(event) => actions.updateGridContainer({ justifyItems: event.target.value as GridAlignment })}>
            {ALIGNMENTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-grid-align-items">Align items</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-grid-align-items" value={alignItems} onChange={(event) => actions.updateGridContainer({ alignItems: event.target.value as GridAlignment })}>
            {ALIGNMENTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-grid-justify-content">Justify content</FieldLabel>
        <SelectWrapper>
          <SelectInput
            id="layout-grid-justify-content"
            value={justifyContent}
            onChange={(event) => actions.updateGridContainer({ justifyContent: event.target.value as ContentAlignment })}
          >
            {CONTENT_ALIGNMENTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-grid-align-content">Align content</FieldLabel>
        <SelectWrapper>
          <SelectInput
            id="layout-grid-align-content"
            value={alignContent}
            onChange={(event) => actions.updateGridContainer({ alignContent: event.target.value as ContentAlignment })}
          >
            {CONTENT_ALIGNMENTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>
    </>
  );
}

GridContainerControls.displayName = "GridContainerControls";
