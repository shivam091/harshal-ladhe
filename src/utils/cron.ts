import type { CronFieldModeInfo, CronFields } from "@/interfaces/cron-builder";

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

  let rangeMin = min;
  let rangeMax = max;
  if (base !== "*") {
    const rangeMatch = base.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      rangeMin = parseInt(rangeMatch[1], 10);
      rangeMax = parseInt(rangeMatch[2], 10);
    } else {
      rangeMin = rangeMax = parseInt(base, 10);
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

  if (minuteSet.size === 0 || hourSet.size === 0 || domSet.size === 0 || monthSet.size === 0 || dowSet.size === 0) return [];

  const domRestricted = fields.dayOfMonth.trim() !== "*";
  const dowRestricted = fields.dayOfWeek.trim() !== "*";

  const results: Date[] = [];
  const start = new Date(from.getTime());
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  let dayCursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  for (let dayIndex = 0; dayIndex < SEARCH_HORIZON_DAYS && results.length < count; dayIndex++) {
    const month = dayCursor.getMonth() + 1;
    const dom = dayCursor.getDate();
    const dow = dayCursor.getDay();

    const dateMatches =
      monthSet.has(month) &&
      (domRestricted && dowRestricted ? domSet.has(dom) || dowSet.has(dow) : domRestricted ? domSet.has(dom) : dowRestricted ? dowSet.has(dow) : true);

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
