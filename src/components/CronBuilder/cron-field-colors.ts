import type { CronFieldKey } from "@/components/CronBuilder/CronBuilder.types";

/*
  One accent hue per cron field, shared between the field rail, the expression hero's token chips,
  and the preset cards so the same field always reads as the same color everywhere in the tool.
  Stored as full hsl() strings (not raw H/S/L tuples) so they can be dropped straight into a
  `--field-accent` custom property, same convention as RainbowDivider's SEGMENT_COLORS.
*/
export const FIELD_COLORS: Record<CronFieldKey, string> = {
  minute: "hsl(190deg 75% 42%)",
  hour: "hsl(261deg 60% 62%)",
  dayOfMonth: "hsl(35deg 90% 48%)",
  month: "hsl(333deg 70% 56%)",
  dayOfWeek: "hsl(213deg 80% 58%)"
};

// Canonical left-to-right field order, matching the 5-token cron string — reused by the field rail and the expression hero so a token's position always maps to the same field.
export const FIELD_ORDER: Array<{ key: CronFieldKey; label: string; short: string; min: number; max: number }> = [
  { key: "minute", label: "Minute", short: "min", min: 0, max: 59 },
  { key: "hour", label: "Hour", short: "hour", min: 0, max: 23 },
  { key: "dayOfMonth", label: "Day of month", short: "dom", min: 1, max: 31 },
  { key: "month", label: "Month", short: "mon", min: 1, max: 12 },
  { key: "dayOfWeek", label: "Day of week", short: "dow", min: 0, max: 6 }
];
