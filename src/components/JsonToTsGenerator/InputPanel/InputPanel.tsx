import type { JSX } from "react";
import { jsonToTs } from "@/utils/json-to-ts";
import { tsToJson } from "@/utils/ts-to-json";
import type { ConversionDirection, InputPanelProps } from "@/interfaces/json-to-ts";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SegmentRow, SegmentButton, NameInput, SourceTextarea, ErrorText } from "@/components/JsonToTsGenerator/InputPanel/InputPanel.styles";

const DIRECTIONS: Array<{ value: ConversionDirection; label: string }> = [
  { value: "json-to-ts", label: "JSON → TS" },
  { value: "ts-to-json", label: "TS → JSON" }
];

// The editable half of the tool: which direction is active, the root name (a name to GENERATE for json-to-ts, or the interface to treat as root for ts-to-json), and the source text for whichever direction is currently selected — each direction keeps its own source field so switching to peek at the other never loses a draft.
export default function InputPanel({ state, actions }: InputPanelProps): JSX.Element {
  const isJsonToTs = state.direction === "json-to-ts";
  const source = isJsonToTs ? state.jsonSource : state.tsSource;
  const result = isJsonToTs ? jsonToTs(state.jsonSource, state.rootName) : tsToJson(state.tsSource, state.rootName);

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Direction</FieldLabel>
        <SegmentRow role="tablist" aria-label="Conversion direction">
          {DIRECTIONS.map((direction) => (
            <SegmentButton
              key={direction.value}
              type="button"
              role="tab"
              aria-selected={state.direction === direction.value}
              data-selected={state.direction === direction.value ? "true" : undefined}
              onClick={() => {
                actions.setDirection(direction.value);
                actions.commitDrag();
              }}
            >
              {direction.label}
            </SegmentButton>
          ))}
        </SegmentRow>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="json-to-ts-root-name">{isJsonToTs ? "Root type name" : "Root interface (optional)"}</FieldLabel>
        <NameInput
          id="json-to-ts-root-name"
          type="text"
          placeholder={isJsonToTs ? "Root" : "defaults to the first interface"}
          value={state.rootName}
          onChange={(event) => actions.setRootName(event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="json-to-ts-source">{isJsonToTs ? "JSON" : "TypeScript interfaces"}</FieldLabel>
        <SourceTextarea
          id="json-to-ts-source"
          spellCheck={false}
          data-invalid={result.error ? "true" : undefined}
          value={source}
          onChange={(event) => (isJsonToTs ? actions.setJsonSource(event.target.value) : actions.setTsSource(event.target.value))}
          onBlur={actions.commitDrag}
        />
        {result.error && <ErrorText>{result.error}</ErrorText>}
      </FieldWrapper>
    </>
  );
}

InputPanel.displayName = "InputPanel";
