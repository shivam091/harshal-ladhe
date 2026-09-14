import type { FestiveDateRange, FestiveOccasion } from "@/constants/festive-occasions";

// Formats a date as "MM-DD".
function toMonthDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// Formats a date as "YYYY-MM-DD".
function toISODate(date: Date): string {
  const year = date.getFullYear();
  return `${year}-${toMonthDay(date)}`;
}

// Checks whether a date falls within a range.
function isWithinRange(now: Date, range: FestiveDateRange): boolean {
  const isRecurring = range.start.length === 5;
  const nowKey = isRecurring ? toMonthDay(now) : toISODate(now);

  if (range.start <= range.end) {
    return nowKey >= range.start && nowKey <= range.end;
  }

  return nowKey >= range.start || nowKey <= range.end;
}

// Finds the first matching occasion.
export function findActiveFestiveOccasion(occasions: FestiveOccasion[], now: Date): FestiveOccasion | null {
  return occasions.find((occasion) => occasion.dateRanges.some((range) => isWithinRange(now, range))) ?? null;
}
