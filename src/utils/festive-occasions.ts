import type { FestiveDateRange, FestiveOccasion } from "@/constants/festive-occasions";

// Recurring ranges carry no year, so dates are compared in the same "MM-DD" form.
function toMonthDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// Local time rather than UTC, so a festival day starts and ends at the reader's own midnight.
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  return `${year}-${toMonthDay(date)}`;
}

// Ranges can wrap past Dec 31 (e.g. "12-30" to "01-02"), which a plain start ≤ date ≤ end check would miss.
function isWithinRange(now: Date, range: FestiveDateRange): boolean {
  const isRecurring = range.start.length === 5;
  const nowKey = isRecurring ? toMonthDay(now) : toISODate(now);

  if (range.start <= range.end) {
    return nowKey >= range.start && nowKey <= range.end;
  }

  return nowKey >= range.start || nowKey <= range.end;
}

// Overlapping festivals are ranked by length; a dummy leap year keeps "02-29" ranges measurable.
function rangeLength({ start, end }: FestiveDateRange): number {
  const toTime = (value: string) => Date.parse(value.length === 5 ? `2000-${value}` : value);
  const days = (toTime(end) - toTime(start)) / 86_400_000;
  return days < 0 ? days + 366 : days;
}

/*
  Shortest range first, so a one-day festival isn't buried under a longer one it overlaps — and the longer one is
  still next in line once the first is dismissed.
*/
export function findActiveFestiveOccasions(occasions: FestiveOccasion[], now: Date): FestiveOccasion[] {
  return occasions
    .map((occasion) => ({ occasion, days: Math.min(...occasion.dateRanges.filter((range) => isWithinRange(now, range)).map(rangeLength)) }))
    .filter(({ days }) => Number.isFinite(days))
    .sort((a, b) => a.days - b.days)
    .map(({ occasion }) => occasion);
}

/*
  A dismissal needs a real calendar date to last until, but recurring ranges carry no year — and one that wraps
  past Dec 31 ends in the following year.
*/
export function getActiveRangeEndDate(occasion: FestiveOccasion, now: Date): string | null {
  const range = occasion.dateRanges
    .filter((candidate) => isWithinRange(now, candidate))
    .sort((a, b) => rangeLength(a) - rangeLength(b))[0];

  if (!range) return null;
  if (range.end.length !== 5) return range.end;

  const wrapsIntoNextYear = range.start > range.end && toMonthDay(now) >= range.start;
  return `${now.getFullYear() + (wrapsIntoNextYear ? 1 : 0)}-${range.end}`;
}
