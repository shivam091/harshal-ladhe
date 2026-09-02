import { detectFieldMode } from "@/utils/cron";
import type { CronFields } from "@/interfaces/cron-builder";

// Index-0 kept as an unused placeholder so a 1-based month value can index this array directly (MONTH_NAMES[1] === "January") without an off-by-one subtraction at every call site.
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function label(value: number, names?: string[]): string {
  return names ? names[value] : String(value);
}

// "a" / "a and b" / "a, b, and c" — the Oxford-comma list form used for every field's own set of specific values.
function describeValues(values: number[], names?: string[]): string {
  const labels = values.map((v) => label(v, names));
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

// Generic per-field phrasing used for day-of-month/month/day-of-week, and as the minute/hour fallback when no special-cased combination in describeTime below applies.
function describeFieldGeneric(raw: string, names?: string[]): string {
  const info = detectFieldMode(raw);
  switch (info.mode) {
    case "every":
      return "every value";
    case "every-n":
      return `every ${info.step}`;
    case "range":
      return `${label(info.rangeStart ?? 0, names)} through ${label(info.rangeEnd ?? 0, names)}`;
    case "range-step":
      return `every ${info.step} from ${label(info.rangeStart ?? 0, names)} through ${label(info.rangeEnd ?? 0, names)}`;
    case "specific":
      return describeValues(info.values ?? [], names);
    case "custom":
      return `"${raw}"`;
  }
}

// A handful of common minute+hour combinations read far more naturally spelled out ("At 09:00", "Every 15 minutes") than the generic per-field fallback would; anything outside these shapes still gets a correct, if less polished, description from describeFieldGeneric.
function describeTime(minuteRaw: string, hourRaw: string): string {
  const minuteMode = detectFieldMode(minuteRaw);
  const hourMode = detectFieldMode(hourRaw);

  if (minuteMode.mode === "every" && hourMode.mode === "every") return "Every minute";
  if (minuteMode.mode === "every-n" && hourMode.mode === "every") return `Every ${minuteMode.step} minutes`;
  if (minuteMode.mode === "specific" && minuteMode.values?.length === 1 && hourMode.mode === "every") return `At minute ${minuteMode.values[0]} past every hour`;
  if (minuteMode.mode === "specific" && minuteMode.values?.length === 1 && hourMode.mode === "specific" && hourMode.values?.length === 1) {
    return `At ${pad2(hourMode.values[0])}:${pad2(minuteMode.values[0])}`;
  }
  if (minuteMode.mode === "specific" && minuteMode.values?.length === 1 && hourMode.mode === "every-n") return `At minute ${minuteMode.values[0]} past every ${hourMode.step} hours`;

  return `At minute(s) ${describeFieldGeneric(minuteRaw)} past hour(s) ${describeFieldGeneric(hourRaw)}`;
}

/*
  Assembles the full plain-English sentence, appending a clause per restricted field and — when both
  day-of-month AND day-of-week are restricted — a note about POSIX cron's well-known OR quirk: most
  cron implementations run the job when EITHER condition matches rather than requiring both, which
  is easy to misread as an AND from the raw fields alone.
*/
export function describeCron(fields: CronFields): string {
  const parts = [describeTime(fields.minute, fields.hour)];

  const domMode = detectFieldMode(fields.dayOfMonth);
  const monthMode = detectFieldMode(fields.month);
  const dowMode = detectFieldMode(fields.dayOfWeek);

  if (domMode.mode !== "every") parts.push(`on day ${describeFieldGeneric(fields.dayOfMonth)} of the month`);
  if (monthMode.mode !== "every") parts.push(`in ${describeFieldGeneric(fields.month, MONTH_NAMES)}`);
  if (dowMode.mode !== "every") parts.push(`on ${describeFieldGeneric(fields.dayOfWeek, DOW_NAMES)}`);

  let sentence = parts.join(", ");
  if (domMode.mode !== "every" && dowMode.mode !== "every") {
    sentence += " — note: most cron implementations run this when EITHER the day-of-month OR the day-of-week condition matches, not only when both do";
  }
  return sentence;
}
