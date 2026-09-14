import type { FestiveDateRange, FestiveOccasion } from "@/constants/festive-occasions";

// Builds a zero-padded "MM-DD" key from a Date's local calendar fields.
function toMonthDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// Builds a zero-padded "YYYY-MM-DD" key from a Date's local calendar fields.
function toISODate(date: Date): string {
  const year = date.getFullYear();
  return `${year}-${toMonthDay(date)}`;
}

// True when `now` falls within a single date range — "YYYY-MM-DD" bounds compare as exact dates;
// "MM-DD" bounds recur every year and wrap correctly across a Dec → Jan boundary (e.g. "12-24" – "01-01").
function isWithinRange(now: Date, range: FestiveDateRange): boolean {
  const isRecurring = range.start.length === 5;
  const nowKey = isRecurring ? toMonthDay(now) : toISODate(now);

  if (range.start <= range.end) {
    return nowKey >= range.start && nowKey <= range.end;
  }

  return nowKey >= range.start || nowKey <= range.end;
}

// Returns the first occasion (in list order) whose dateRanges include `now`, or null if none match.
export function findActiveFestiveOccasion(
  occasions: FestiveOccasion[],
  now: Date
): FestiveOccasion | null {
  return occasions.find((occasion) => occasion.dateRanges.some((range) => isWithinRange(now, range))) ?? null;
}
