import { useState } from "react";
import type { JSX } from "react";
import { compileField, detectFieldMode } from "@/utils/cron";
import type { CronFieldMode, CronFieldModeInfo, FieldBuilderProps } from "@/interfaces/cron-builder";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { InlineRow, InlineLabel, NumberInput, TextInput } from "@/components/CronBuilder/FieldBuilder/FieldBuilder.styles";

const MODE_OPTIONS: Array<{ value: CronFieldMode; label: string }> = [
  { value: "every", label: "Every value" },
  { value: "every-n", label: "Every N" },
  { value: "specific", label: "Specific values" },
  { value: "range", label: "Range" },
  { value: "range-step", label: "Range + step" },
  { value: "custom", label: "Custom" }
];

function clampInt(text: string, min: number, max: number, fallback: number): number {
  const n = parseInt(text, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/*
  One cron field's widget: a mode select plus whatever inputs that mode needs (a step, a range, a
  comma list, or a bare custom text field). Always reads its current mode/values by parsing
  `state[fieldKey]` fresh via detectFieldMode — the raw field string is the only source of truth, so
  a preset, undo/redo, or another field's own edit can never leave this widget showing stale values.
*/
export default function FieldBuilder({ fieldKey, label, min, max, state, actions }: FieldBuilderProps): JSX.Element {
  const raw = state[fieldKey];
  const info = detectFieldMode(raw);

  /*
    Local drafts for the two free-text widgets (specific values, custom) — same reasoning as
    HexColorField: recompiling the field on every keystroke would otherwise strip a trailing comma
    or a partially-typed number as the user types, fighting their cursor. Resynced from `raw` only
    when it changed for a reason OTHER than this widget's own edit (a preset, undo/redo, switching
    modes and back) — the widget's own onChange keeps the draft and the committed value in lockstep,
    so the resync below never overwrites an in-progress edit with itself.
  */
  const [valuesDraft, setValuesDraft] = useState(() => (info.values ?? []).join(","));
  const [lastValuesRaw, setLastValuesRaw] = useState(raw);
  if (info.mode === "specific" && raw !== lastValuesRaw) {
    setLastValuesRaw(raw);
    setValuesDraft((info.values ?? []).join(","));
  }

  const [customDraft, setCustomDraft] = useState(raw);
  const [lastCustomRaw, setLastCustomRaw] = useState(raw);
  if (info.mode === "custom" && raw !== lastCustomRaw) {
    setLastCustomRaw(raw);
    setCustomDraft(raw);
  }

  function commitMode(mode: CronFieldMode) {
    const nextInfo: CronFieldModeInfo =
      mode === "every-n"
        ? { mode, step: 1 }
        : mode === "specific"
          ? { mode, values: [min] }
          : mode === "range"
            ? { mode, rangeStart: min, rangeEnd: max }
            : mode === "range-step"
              ? { mode, rangeStart: min, rangeEnd: max, step: 1 }
              : mode === "custom"
                ? { mode, raw }
                : { mode: "every" };
    actions.setField(fieldKey, compileField(nextInfo));
    actions.commitDrag();
  }

  function commitInfo(patch: Partial<CronFieldModeInfo>) {
    actions.setField(fieldKey, compileField({ ...info, ...patch }));
  }

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={`cron-field-${fieldKey}`}>{label}</FieldLabel>
        <SelectWrapper>
          <SelectInput id={`cron-field-${fieldKey}`} value={info.mode} onChange={(event) => commitMode(event.target.value as CronFieldMode)}>
            {MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>

        {info.mode === "every-n" && (
          <InlineRow>
            <InlineLabel>every</InlineLabel>
            <NumberInput
              type="number"
              min={1}
              max={max}
              value={info.step ?? 1}
              onChange={(event) => commitInfo({ step: clampInt(event.target.value, 1, max, info.step ?? 1) })}
              onBlur={actions.commitDrag}
            />
          </InlineRow>
        )}

        {info.mode === "range" && (
          <InlineRow>
            <NumberInput
              type="number"
              min={min}
              max={max}
              value={info.rangeStart ?? min}
              onChange={(event) => commitInfo({ rangeStart: clampInt(event.target.value, min, max, info.rangeStart ?? min) })}
              onBlur={actions.commitDrag}
            />
            <InlineLabel>to</InlineLabel>
            <NumberInput
              type="number"
              min={min}
              max={max}
              value={info.rangeEnd ?? max}
              onChange={(event) => commitInfo({ rangeEnd: clampInt(event.target.value, min, max, info.rangeEnd ?? max) })}
              onBlur={actions.commitDrag}
            />
          </InlineRow>
        )}

        {info.mode === "range-step" && (
          <InlineRow>
            <NumberInput
              type="number"
              min={min}
              max={max}
              value={info.rangeStart ?? min}
              onChange={(event) => commitInfo({ rangeStart: clampInt(event.target.value, min, max, info.rangeStart ?? min) })}
              onBlur={actions.commitDrag}
            />
            <InlineLabel>to</InlineLabel>
            <NumberInput
              type="number"
              min={min}
              max={max}
              value={info.rangeEnd ?? max}
              onChange={(event) => commitInfo({ rangeEnd: clampInt(event.target.value, min, max, info.rangeEnd ?? max) })}
              onBlur={actions.commitDrag}
            />
            <InlineLabel>step</InlineLabel>
            <NumberInput
              type="number"
              min={1}
              max={max}
              value={info.step ?? 1}
              onChange={(event) => commitInfo({ step: clampInt(event.target.value, 1, max, info.step ?? 1) })}
              onBlur={actions.commitDrag}
            />
          </InlineRow>
        )}

        {info.mode === "specific" && (
          <TextInput
            type="text"
            inputMode="numeric"
            placeholder={`e.g. ${min},${min + 1}`}
            value={valuesDraft}
            onChange={(event) => {
              const text = event.target.value;
              setValuesDraft(text);
              const values = text
                .split(",")
                .map((part) => parseInt(part.trim(), 10))
                .filter((n) => !Number.isNaN(n) && n >= min && n <= max);
              if (values.length > 0) actions.setField(fieldKey, compileField({ mode: "specific", values }));
            }}
            onBlur={actions.commitDrag}
          />
        )}

        {info.mode === "custom" && (
          <TextInput
            type="text"
            value={customDraft}
            onChange={(event) => {
              setCustomDraft(event.target.value);
              actions.setField(fieldKey, event.target.value);
            }}
            onBlur={actions.commitDrag}
          />
        )}
      </FieldWrapper>
    </>
  );
}

FieldBuilder.displayName = "FieldBuilder";
