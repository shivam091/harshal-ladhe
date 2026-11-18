import type { CronFieldModeInfo, CronFields } from "@/components/CronBuilder/CronBuilder.types";

/*
  Parses one comma-separated segment of a cron field — "*", "*\/n", "a", "a-b", or "a-b/n" — into
  its concrete matching values within [min, max]. This is the FULL general grammar (used for
  matching and next-run search), independent of which of the builder's simpler named modes (see
  detectFieldMode below) a field happens to fit — a "custom" field with a compound expression like
  "1-5,10,20-25/5" still needs to resolve correctly here even though it has no single builder widget.
*/
function parseSegment(segment: string, min: number, max: number): number[] {
  const match = segment.match(/^(\*|\d+-\d+|\d+)(?:\/(\d+))?$/);
  if (!match) return [];
  const [, base, stepStr] = match;
  const step = stepStr ? parseInt(stepStr, 10) : 1;
  // A zero step would never advance the loop below — the page froze on a typed "*/0".
  if (step < 1) return [];

  let rangeMin = min;
  let rangeMax = max;
  if (base !== "*") {
    const rangeMatch = base.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      rangeMin = parseInt(rangeMatch[1], 10);
      rangeMax = parseInt(rangeMatch[2], 10);
    } else {
      rangeMin = parseInt(base, 10);
      // cron reads "a/n" as "from a to the end of the field, every n", not just the single value a.
      rangeMax = stepStr ? max : rangeMin;
    }
  }

  const values: number[] = [];
  for (let v = rangeMin; v <= rangeMax; v += step) {
    if (v >= min && v <= max) values.push(v);
  }
  return values;
}

export function parseCronField(raw: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const segment of raw.split(",")) {
    for (const v of parseSegment(segment.trim(), min, max)) values.add(v);
  }
  return Array.from(values).sort((a, b) => a - b);
}

/*
  Mirrors what crontab itself would reject — bad syntax, out-of-range values, a backwards range, a
  zero step — so a typo shows up as a clear message on the field rather than as a silently empty
  schedule that looks like an impossible date.
*/
export function validateCronField(raw: string, min: number, max: number): string | null {
  const trimmed = raw.trim();
  if (trimmed === "") return "Enter a value — use * for every value.";
  for (const segment of trimmed.split(",")) {
    const part = segment.trim();
    const match = part.match(/^(\*|(\d+)-(\d+)|(\d+))(?:\/(\d+))?$/);
    if (!match) return `"${part}" isn't valid cron syntax — use *, a number, a range like 1-5, a step like */15, or a comma list.`;
    const [, , rangeStart, rangeEnd, single, step] = match;
    const numbers = [rangeStart, rangeEnd, single].filter((n) => n !== undefined).map(Number);
    const outOfRange = numbers.find((n) => n < min || n > max);
    if (outOfRange !== undefined) return `${outOfRange} is out of range — this field accepts ${min}–${max}.`;
    if (rangeStart !== undefined && Number(rangeStart) > Number(rangeEnd)) return `The range ${rangeStart}-${rangeEnd} runs backwards — put the smaller number first.`;
    if (step !== undefined && Number(step) < 1) return "A step must be at least 1.";
  }
  return null;
}

// Day of week accepts 7 as well as 0 for Sunday, so it validates against the wider range cron itself allows.
export const CRON_FIELD_RANGES: Record<keyof CronFields, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 }
};

// The first invalid field, if any, so callers can refuse to describe or schedule a broken expression.
export function findCronError(fields: CronFields): { field: keyof CronFields; message: string } | null {
  for (const field of Object.keys(CRON_FIELD_RANGES) as Array<keyof CronFields>) {
    const message = validateCronField(fields[field], CRON_FIELD_RANGES[field].min, CRON_FIELD_RANGES[field].max);
    if (message) return { field, message };
  }
  return null;
}

/*
  cron (Vixie/cronie, and Kubernetes' robfig/cron) treats a day field as unrestricted whenever it
  starts with "*" — so "*\/2" still counts as unrestricted. That decides whether day of month and day
  of week combine with OR (both restricted) or AND (otherwise), and comparing against a bare "*" got
  it wrong. An unrestricted field still filters: "*\/2" in day of week only keeps every other day.
*/
export function isDayFieldRestricted(raw: string): boolean {
  return !raw.trim().startsWith("*");
}

// Day-of-week is special: both 0 and 7 mean Sunday in standard cron, so 7 is folded into 0 after parsing against the wider 0-7 range.
function parseDayOfWeekField(raw: string): number[] {
  return Array.from(new Set(parseCronField(raw, 0, 7).map((v) => (v === 7 ? 0 : v)))).sort((a, b) => a - b);
}

/*
  Classifies a field string into one of the builder's five simple widget shapes, or "custom" if it
  doesn't match any of them (a bare "*", "*\/n", "a-b", "a-b/n", or a plain comma list of numbers all
  count as simple; anything else — compound expressions, stray whitespace inside, etc. — falls back
  to "custom" so the builder shows a plain editable text field instead of guessing at a shape).
*/
export function detectFieldMode(raw: string): CronFieldModeInfo {
  const trimmed = raw.trim();
  if (trimmed === "*") return { mode: "every" };

  let m = trimmed.match(/^\*\/(\d+)$/);
  if (m) return { mode: "every-n", step: parseInt(m[1], 10) };

  m = trimmed.match(/^(\d+)-(\d+)\/(\d+)$/);
  if (m) return { mode: "range-step", rangeStart: parseInt(m[1], 10), rangeEnd: parseInt(m[2], 10), step: parseInt(m[3], 10) };

  m = trimmed.match(/^(\d+)-(\d+)$/);
  if (m) return { mode: "range", rangeStart: parseInt(m[1], 10), rangeEnd: parseInt(m[2], 10) };

  if (/^\d+(,\d+)*$/.test(trimmed)) return { mode: "specific", values: trimmed.split(",").map(Number) };

  return { mode: "custom", raw: trimmed };
}

// The inverse of detectFieldMode — rebuilds a raw field string from a builder widget's current mode/values, so editing a slider or a values list can round-trip back into the one source-of-truth string.
export function compileField(info: CronFieldModeInfo): string {
  switch (info.mode) {
    case "every":
      return "*";
    case "every-n":
      return `*/${info.step ?? 1}`;
    case "range":
      return `${info.rangeStart ?? 0}-${info.rangeEnd ?? 0}`;
    case "range-step":
      return `${info.rangeStart ?? 0}-${info.rangeEnd ?? 0}/${info.step ?? 1}`;
    case "specific":
      return info.values && info.values.length > 0 ? [...info.values].sort((a, b) => a - b).join(",") : "*";
    case "custom":
      return info.raw ?? "*";
  }
}

// Generous 8-year search horizon — long enough to always span at least one Feb 29 (a leap year occurs at least once every 4 years, with rare century-boundary exceptions this margin comfortably covers) so a pattern restricted to that date doesn't spuriously report no upcoming runs.
const SEARCH_HORIZON_DAYS = 366 * 8;

/*
  Finds the next `count` run times on or after `from`, honoring POSIX cron's day-of-month/day-of-week
  quirk: when BOTH fields are restricted (not "*"), a date matches if EITHER condition is true, not
  both. Outer loop advances one CALENDAR DAY at a time and only descends into an hour/minute scan on
  a day that already passed the (cheap) month/day-of-month/day-of-week check — this keeps the common
  case (e.g. "daily at 9am") fast, since most candidate days resolve at the outer check alone, while
  the worst case (an always-false combination) is still bounded to SEARCH_HORIZON_DAYS cheap checks.
*/
export function computeNextRuns(fields: CronFields, count: number, from: Date = new Date()): Date[] {
  const minuteSet = new Set(parseCronField(fields.minute, 0, 59));
  const hourSet = new Set(parseCronField(fields.hour, 0, 23));
  const domSet = new Set(parseCronField(fields.dayOfMonth, 1, 31));
  const monthSet = new Set(parseCronField(fields.month, 1, 12));
  const dowSet = new Set(parseDayOfWeekField(fields.dayOfWeek));

  if (findCronError(fields)) return [];
  if (minuteSet.size === 0 || hourSet.size === 0 || domSet.size === 0 || monthSet.size === 0 || dowSet.size === 0) return [];

  const domRestricted = isDayFieldRestricted(fields.dayOfMonth);
  const dowRestricted = isDayFieldRestricted(fields.dayOfWeek);

  const results: Date[] = [];
  const start = new Date(from.getTime());
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  let dayCursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  for (let dayIndex = 0; dayIndex < SEARCH_HORIZON_DAYS && results.length < count; dayIndex++) {
    const month = dayCursor.getMonth() + 1;
    const dom = dayCursor.getDate();
    const dow = dayCursor.getDay();

    // Both restricted → either day field may match (cron's OR quirk); otherwise both sets must match, and an unrestricted "*" set already contains every day.
    const dateMatches = monthSet.has(month) && (domRestricted && dowRestricted ? domSet.has(dom) || dowSet.has(dow) : domSet.has(dom) && dowSet.has(dow));

    if (dateMatches) {
      const isFirstDay = dayIndex === 0;
      for (let hour = 0; hour < 24 && results.length < count; hour++) {
        if (!hourSet.has(hour) || (isFirstDay && hour < start.getHours())) continue;
        for (let minute = 0; minute < 60 && results.length < count; minute++) {
          if (!minuteSet.has(minute)) continue;
          if (isFirstDay && hour === start.getHours() && minute < start.getMinutes()) continue;
          results.push(new Date(dayCursor.getFullYear(), dayCursor.getMonth(), dayCursor.getDate(), hour, minute, 0, 0));
        }
      }
    }

    dayCursor = new Date(dayCursor.getFullYear(), dayCursor.getMonth(), dayCursor.getDate() + 1);
  }

  return results;
}

// Index-0 kept as an unused placeholder so a 1-based month value can index this array directly (MONTH_NAMES[1] === "January") without an off-by-one subtraction at every call site.
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Field names as the builder's cards label them, so an error message points at the card to fix.
const FIELD_LABELS: Record<keyof CronFields, string> = {
  minute: "Minute",
  hour: "Hour",
  dayOfMonth: "Day of month",
  month: "Month",
  dayOfWeek: "Day of week"
};

// Above this many resolved values a spelled-out list stops being easier to read than the field's own shape.
const MAX_LISTED_VALUES = 8;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// cron accepts 7 as a second spelling of Sunday, so day names wrap rather than reading "undefined".
function label(value: number, names?: string[]): string {
  if (!names) return String(value);
  return names === DOW_NAMES ? DOW_NAMES[value % 7] : names[value];
}

// "a" / "a and b" / "a, b and c" — British style, without the Oxford comma.
function describeValues(values: number[], names?: string[]): string {
  const labels = values.map((v) => label(v, names));
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

// "1st", "2nd", "3rd", "11th" — for "every 2nd day" style phrasing.
function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

// "Every minute" rather than "Every 1 minutes" when a step of 1 is written out.
function every(step: number | undefined, unit: string): string {
  return step === undefined || step === 1 ? `every ${unit}` : `every ${step} ${unit}s`;
}

// Sentence-case for a phrase that opens the description.
function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// The concrete values a field fires on, with Sunday-as-7 folded into 0 for day of week.
function resolvedValues(raw: string, min: number, max: number): number[] {
  const values = parseCronField(raw, min, max);
  return max === 7 ? Array.from(new Set(values.map((v) => v % 7))).sort((a, b) => a - b) : values;
}

// "09:00" style clock times for a list of hours at one fixed minute.
function clockTimes(hours: number[], minute: number): string {
  return describeValues(hours).replace(/\d+/g, (h) => `${pad2(Number(h))}:${pad2(minute)}`);
}

/*
  The minute + hour half of the sentence. The common shapes get natural phrasing ("At 09:00 and
  18:00", "Every 5 minutes, between 09:00 and 17:59"); anything else falls back to listing the
  minutes and hours it actually fires on, which is always correct even when it's less polished.
*/
function describeTime(minuteRaw: string, hourRaw: string): string {
  const minuteMode = detectFieldMode(minuteRaw);
  const detectedHourMode = detectFieldMode(hourRaw);
  // "*\/1" fires every hour, so it reads exactly like "*".
  const hourMode = detectedHourMode.mode === "every-n" && detectedHourMode.step === 1 ? { mode: "every" as const } : detectedHourMode;
  const minutes = resolvedValues(minuteRaw, 0, 59);
  const hours = resolvedValues(hourRaw, 0, 23);
  const singleMinute = minuteMode.mode === "specific" && minutes.length === 1 ? minutes[0] : null;

  if (hourMode.mode === "every") {
    if (minuteMode.mode === "every") return "Every minute";
    if (minuteMode.mode === "every-n") return capitalise(every(minuteMode.step, "minute"));
    if (singleMinute !== null) return `At minute ${singleMinute} past every hour`;
    return `At minutes ${describeValues(minutes)} past every hour`;
  }

  if (singleMinute !== null) {
    if (hourMode.mode === "every-n") return `At minute ${singleMinute} past ${every(hourMode.step, "hour")}`;
    if (hours.length <= MAX_LISTED_VALUES) return `At ${clockTimes(hours, singleMinute)}`;
    return `At minute ${singleMinute} past hours ${describeValues(hours)}`;
  }

  const minutePhrase =
    minuteMode.mode === "every" ? "Every minute" : minuteMode.mode === "every-n" ? capitalise(every(minuteMode.step, "minute")) : `At minutes ${describeValues(minutes)}`;
  if (hourMode.mode === "range") return `${minutePhrase}, between ${pad2(hourMode.rangeStart ?? 0)}:00 and ${pad2(hourMode.rangeEnd ?? 0)}:59`;
  if (hourMode.mode === "every-n") return `${minutePhrase}, during ${(hourMode.step ?? 1) === 1 ? "every hour" : `every ${ordinal(hourMode.step ?? 1)} hour`}`;
  return `${minutePhrase}, during the ${clockTimes(hours, 0)} hour${hours.length === 1 ? "" : "s"}`;
}

// Day-of-month clause — steps read as "every 2nd day" rather than the raw "every 2".
function describeDayOfMonth(raw: string): string {
  const info = detectFieldMode(raw);
  if (info.mode === "every-n") return (info.step ?? 1) === 1 ? "on every day of the month" : `on every ${ordinal(info.step ?? 1)} day of the month`;
  if (info.mode === "range") return `on days ${info.rangeStart} through ${info.rangeEnd} of the month`;
  if (info.mode === "range-step") return `on every ${ordinal(info.step ?? 1)} day of the month from the ${ordinal(info.rangeStart ?? 1)} through the ${ordinal(info.rangeEnd ?? 1)}`;
  const days = resolvedValues(raw, 1, 31);
  return `on day${days.length === 1 ? "" : "s"} ${describeValues(days)} of the month`;
}

// Month and day-of-week clauses — a plain range reads as "Monday through Friday", every other shape lists the names it resolves to.
function describeNamedField(raw: string, min: number, max: number, names: string[]): string {
  const info = detectFieldMode(raw);
  if (info.mode === "range" && (info.rangeEnd ?? 0) - (info.rangeStart ?? 0) >= 2) {
    return `${label(info.rangeStart ?? min, names)} through ${label(info.rangeEnd ?? max, names)}`;
  }
  return describeValues(resolvedValues(raw, min, max), names);
}

/*
  Assembles the full plain-English sentence, appending a clause per restricted field and — when both
  day-of-month AND day-of-week are restricted — a note about POSIX cron's well-known OR quirk: most
  cron implementations run the job when EITHER condition matches rather than requiring both, which
  is easy to misread as an AND from the raw fields alone. An invalid field short-circuits to its
  error, since describing a schedule cron would refuse to install would only mislead.
*/
export function describeCron(fields: CronFields): string {
  const error = findCronError(fields);
  if (error) return `Invalid ${FIELD_LABELS[error.field].toLowerCase()} field: ${error.message}`;

  const parts = [describeTime(fields.minute, fields.hour)];
  const domRestricted = isDayFieldRestricted(fields.dayOfMonth);
  const dowRestricted = isDayFieldRestricted(fields.dayOfWeek);

  if (detectFieldMode(fields.dayOfMonth).mode !== "every") parts.push(describeDayOfMonth(fields.dayOfMonth));
  if (detectFieldMode(fields.month).mode !== "every") parts.push(`in ${describeNamedField(fields.month, 1, 12, MONTH_NAMES)}`);
  if (detectFieldMode(fields.dayOfWeek).mode !== "every") parts.push(`on ${describeNamedField(fields.dayOfWeek, 0, 7, DOW_NAMES)}`);

  let sentence = parts.join(", ");
  if (domRestricted && dowRestricted) {
    sentence += " — note: most cron implementations run this when EITHER the day-of-month OR the day-of-week condition matches, not only when both do";
  }
  return sentence;
}

export function toCrontabLine(fields: CronFields): string {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
}

export function toGithubActionsYaml(fields: CronFields): string {
  return `on:\n  schedule:\n    - cron: "${toCrontabLine(fields)}"`;
}

export function toKubernetesCronJob(fields: CronFields): string {
  return `apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: example-cronjob\nspec:\n  schedule: "${toCrontabLine(fields)}"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n            - name: example\n              image: busybox\n              args: ["echo", "hello"]\n          restartPolicy: OnFailure`;
}
