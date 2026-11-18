import { useState } from "react";
import type { CSSProperties, JSX } from "react";
import { compileField, detectFieldMode, validateCronField, CRON_FIELD_RANGES } from "@/components/CronBuilder/CronBuilder.utils";
import { useNumberDraft } from "@/hooks/use-number-draft";
import type { CronFieldMode, CronFieldModeInfo, FieldBuilderProps } from "@/components/CronBuilder/CronBuilder.types";
import { Card, Header, Dot, Label, SelectWrapper, Select, InlineRow, InlineLabel, NumberInput, TextInput, FieldError } from "@/components/CronBuilder/FieldBuilder/FieldBuilder.styles";

const MODE_OPTIONS: Array<{ value: CronFieldMode; label: string }> = [
  { value: "every", label: "Every value" },
  { value: "every-n", label: "Every N" },
  { value: "specific", label: "Specific values" },
  { value: "range", label: "Range" },
  { value: "range-step", label: "Range + step" },
  { value: "custom", label: "Custom" }
];

/*
  One cron field's dial: a mode select plus whatever inputs that mode needs (a step, a range, a
  comma list, or a bare custom text field). Always reads its current mode/values by parsing
  `state[fieldKey]` fresh via detectFieldMode — the raw field string is the only source of truth, so
  a preset or another field's own edit can never leave this widget showing stale values.
*/
export default function FieldBuilder({ fieldKey, label, min, max, accent, state, actions }: FieldBuilderProps): JSX.Element {
  const raw = state[fieldKey];
  const info = detectFieldMode(raw);
  // Validated against cron's own range (day of week allows 7 for Sunday), not the widget's 0–6, so a hand-typed 7 isn't flagged.
  const error = validateCronField(raw, CRON_FIELD_RANGES[fieldKey].min, CRON_FIELD_RANGES[fieldKey].max);
  const errorId = `cron-field-${fieldKey}-error`;

  /*
    Local drafts for the two free-text widgets (specific values, custom) — same reasoning as
    HexColorField: recompiling the field on every keystroke would otherwise strip a trailing comma
    or a partially-typed number as the user types, fighting their cursor. Resynced from `raw` only
    when it changed for a reason OTHER than this widget's own edit (a preset, switching
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

  /*
    Choosing "Custom" doesn't change the field string, and a simple string like "*" or "1-5" always
    re-detects as one of the structured modes — so without remembering the choice, the select would
    snap straight back and Custom could never be picked. Released when the field changes from outside
    (a preset), since the user's own typing always keeps the draft and the field equal.
  */
  const [customPinned, setCustomPinned] = useState(false);
  if (customPinned && raw !== customDraft) setCustomPinned(false);
  const mode: CronFieldMode = customPinned ? "custom" : info.mode;

  function commitMode(nextMode: CronFieldMode) {
    if (nextMode === "custom") {
      setCustomDraft(raw);
      setLastCustomRaw(raw);
      setCustomPinned(true);
      return;
    }
    setCustomPinned(false);
    const nextInfo: CronFieldModeInfo =
      nextMode === "every-n"
        ? { mode: nextMode, step: 1 }
        : nextMode === "specific"
          ? { mode: nextMode, values: [min] }
          : nextMode === "range"
            ? { mode: nextMode, rangeStart: min, rangeEnd: max }
            : nextMode === "range-step"
              ? { mode: nextMode, rangeStart: min, rangeEnd: max, step: 1 }
              : { mode: "every" };
    actions.setField(fieldKey, compileField(nextInfo));
  }

  function commitInfo(patch: Partial<CronFieldModeInfo>) {
    actions.setField(fieldKey, compileField({ ...info, ...patch }));
  }

  // Called unconditionally (hooks can't sit behind the mode switch) — every-n and range-step share one step, range and range-step share one start/end.
  const stepInput = useNumberDraft({ value: info.step ?? 1, min: 1, max, integer: true, onValueChange: (step) => commitInfo({ step }) });
  const rangeStart = info.rangeStart ?? min;
  const rangeEnd = info.rangeEnd ?? max;
  // Each bound is limited by the other, so the widgets can never build a backwards range like 10-5.
  const rangeStartInput = useNumberDraft({ value: rangeStart, min, max: rangeEnd, integer: true, onValueChange: (rangeStart) => commitInfo({ rangeStart }) });
  const rangeEndInput = useNumberDraft({ value: rangeEnd, min: rangeStart, max, integer: true, onValueChange: (rangeEnd) => commitInfo({ rangeEnd }) });

  return (
    <>
      <Card style={{ "--field-accent": accent } as CSSProperties}>
        <Header>
          <Dot aria-hidden="true" />
          <Label htmlFor={`cron-field-${fieldKey}`}>{label}</Label>
        </Header>

        <SelectWrapper>
          <Select id={`cron-field-${fieldKey}`} value={mode} onChange={(event) => commitMode(event.target.value as CronFieldMode)}>
            {MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </SelectWrapper>

        {mode === "every-n" && (
          <InlineRow>
            <InlineLabel>every</InlineLabel>
            <NumberInput
              type="number"
              min={1}
              max={max}
              {...stepInput}
            />
          </InlineRow>
        )}

        {mode === "range" && (
          <InlineRow>
            <NumberInput
              type="number"
              min={min}
              max={rangeEnd}
              {...rangeStartInput}
            />
            <InlineLabel>to</InlineLabel>
            <NumberInput
              type="number"
              min={rangeStart}
              max={max}
              {...rangeEndInput}
            />
          </InlineRow>
        )}

        {mode === "range-step" && (
          <InlineRow>
            <NumberInput
              type="number"
              min={min}
              max={rangeEnd}
              {...rangeStartInput}
            />
            <InlineLabel>to</InlineLabel>
            <NumberInput
              type="number"
              min={rangeStart}
              max={max}
              {...rangeEndInput}
            />
            <InlineLabel>step</InlineLabel>
            <NumberInput
              type="number"
              min={1}
              max={max}
              {...stepInput}
            />
          </InlineRow>
        )}

        {mode === "specific" && (
          <TextInput
            type="text"
            inputMode="numeric"
            placeholder={`e.g. ${min},${min + 1}`}
            value={valuesDraft}
            onChange={(event) => {
              const text = event.target.value;
              setValuesDraft(text);
              // Number() rather than parseInt, so "1-5" or "5x" is skipped instead of quietly read as 1 or 5; duplicates collapse.
              const values = Array.from(
                new Set(
                  text
                    .split(",")
                    .filter((part) => part.trim() !== "")
                    .map((part) => Number(part.trim()))
                    .filter((n) => Number.isInteger(n) && n >= min && n <= max)
                )
              );
              if (values.length > 0) {
                const compiled = compileField({ mode: "specific", values });
                // Marked as this widget's own write, so the resync above doesn't rewrite what's being typed into the sorted, de-duplicated form mid-keystroke.
                setLastValuesRaw(compiled);
                actions.setField(fieldKey, compiled);
              }
            }}
          />
        )}

        {mode === "custom" && (
          <TextInput
            type="text"
            value={customDraft}
            onChange={(event) => {
              setCustomDraft(event.target.value);
              actions.setField(fieldKey, event.target.value);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {error && <FieldError id={errorId}>{error}</FieldError>}
      </Card>
    </>
  );
}

FieldBuilder.displayName = "FieldBuilder";
