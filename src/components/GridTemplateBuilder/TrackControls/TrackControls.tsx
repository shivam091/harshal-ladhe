import type { JSX } from "react";
import { PlusIcon, TrashIcon } from "@/components/Icon";
import { MAX_TRACKS } from "@/helpers/grid-template-builder-editor";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/GridTemplateBuilder/Slider/Slider";
import {
  TrackRows,
  TrackRow,
  TrackMainRow,
  MinMaxRow,
  MinMaxField,
  MinMaxLabel,
  TrackSizeInput,
  TrackRemoveButton,
  AddTrackButton
} from "@/components/GridTemplateBuilder/TrackControls/TrackControls.styles";
import type { TrackControlsProps, TrackUnit, TrackValueUnit, GridTrack } from "@/interfaces/grid-template-builder";

const UNITS: TrackUnit[] = ["fr", "px", "rem", "auto", "minmax"];
// minmax()'s own minimum position rejects the <flex> type (fr) per spec — only its maximum position may resolve to a flex share — so the min side's own unit choices leave "fr" out entirely rather than let someone build a value browsers would reject.
const MIN_UNITS: TrackValueUnit[] = ["px", "rem", "auto"];
const MAX_UNITS: TrackValueUnit[] = ["px", "rem", "fr", "auto"];

interface TrackListProps {
  label: string;
  tracks: GridTrack[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  onCommit: () => void;
}

// One editable track list — used twice below (columns, rows) rather than pulled into its own file, the same "used more than once but only within one file" threshold GridContainerControls' own TrackList already set for LayoutPlayground.
function TrackList({ label, tracks, onAdd, onRemove, onUpdate, onCommit }: TrackListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <TrackRows>
          {tracks.map((track) => (
            <TrackRow key={track.id}>
              <TrackMainRow>
                <TrackSizeInput
                  type="number"
                  min={0}
                  step={0.1}
                  disabled={track.unit === "auto" || track.unit === "minmax"}
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
                <TrackRemoveButton type="button" disabled={tracks.length <= 1} aria-label={`Remove ${label.toLowerCase()} track`} onClick={() => onRemove(track.id)}>
                  <TrashIcon size={14} />
                </TrackRemoveButton>
              </TrackMainRow>

              {track.unit === "minmax" && (
                <MinMaxRow>
                  <MinMaxLabel>minmax(min, max)</MinMaxLabel>
                  <MinMaxField>
                    <TrackSizeInput
                      type="number"
                      min={0}
                      step={0.1}
                      disabled={track.minUnit === "auto"}
                      value={track.minSize}
                      aria-label={`${label} track minimum size`}
                      onChange={(event) => onUpdate(track.id, { minSize: Number(event.target.value) })}
                      onBlur={onCommit}
                    />
                    <SelectWrapper>
                      <SelectInput
                        aria-label={`${label} track minimum unit`}
                        value={track.minUnit}
                        onChange={(event) => onUpdate(track.id, { minUnit: event.target.value as TrackValueUnit })}
                        onBlur={onCommit}
                      >
                        {MIN_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </SelectInput>
                    </SelectWrapper>
                  </MinMaxField>
                  <MinMaxField>
                    <TrackSizeInput
                      type="number"
                      min={0}
                      step={0.1}
                      disabled={track.maxUnit === "auto"}
                      value={track.maxSize}
                      aria-label={`${label} track maximum size`}
                      onChange={(event) => onUpdate(track.id, { maxSize: Number(event.target.value) })}
                      onBlur={onCommit}
                    />
                    <SelectWrapper>
                      <SelectInput
                        aria-label={`${label} track maximum unit`}
                        value={track.maxUnit}
                        onChange={(event) => onUpdate(track.id, { maxUnit: event.target.value as TrackValueUnit })}
                        onBlur={onCommit}
                      >
                        {MAX_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </SelectInput>
                    </SelectWrapper>
                  </MinMaxField>
                </MinMaxRow>
              )}
            </TrackRow>
          ))}
        </TrackRows>
        <AddTrackButton type="button" disabled={tracks.length >= MAX_TRACKS} onClick={onAdd}>
          <PlusIcon size={14} />
          Add track
        </AddTrackButton>
      </FieldWrapper>
    </>
  );
}

/*
  The two track lists (grid-template-columns/rows) plus the row/column gap sliders — everything
  needed to produce a grid's own container-level CSS short of the named areas, which AreaPainter
  owns instead since painting them needs the column/row COUNTS this component manages but not its
  own UI space.
*/
export default function TrackControls({ state, actions }: TrackControlsProps): JSX.Element {
  return (
    <>
      <TrackList label="Columns" tracks={state.columns} onAdd={actions.addColumnTrack} onRemove={actions.removeColumnTrack} onUpdate={actions.updateColumnTrack} onCommit={actions.commitDrag} />
      <TrackList label="Rows" tracks={state.rows} onAdd={actions.addRowTrack} onRemove={actions.removeRowTrack} onUpdate={actions.updateRowTrack} onCommit={actions.commitDrag} />
      <Slider label="Row gap" min={0} max={64} value={state.rowGap} suffix="px" onChange={actions.setRowGap} onCommit={actions.commitDrag} />
      <Slider label="Column gap" min={0} max={64} value={state.columnGap} suffix="px" onChange={actions.setColumnGap} onCommit={actions.commitDrag} />
    </>
  );
}

TrackControls.displayName = "TrackControls";
