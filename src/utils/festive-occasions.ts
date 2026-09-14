import type { FestiveDateRange, FestiveOccasion } from "@/constants/festive-occasions";

// Formats a date as "MM-DD".
function toMonthDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// Formats a date as "YYYY-MM-DD" in local time, so a "day" ends at the reader's own midnight.
export function toISODate(date: Date): string {
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

// Days a range spans; recurring "MM-DD" dates share a dummy leap year, and year-end wraps add a year back.
function rangeLength({ start, end }: FestiveDateRange): number {
  const toTime = (value: string) => Date.parse(value.length === 5 ? `2000-${value}` : value);
  const days = (toTime(end) - toTime(start)) / 86_400_000;
  return days < 0 ? days + 366 : days;
}

// Picks the shortest active occasion so a one-day festival isn't hidden by a longer one it overlaps; ties keep list order.
export function findActiveFestiveOccasion(occasions: FestiveOccasion[], now: Date): FestiveOccasion | null {
  return occasions
    .flatMap((occasion) => occasion.dateRanges.filter((range) => isWithinRange(now, range)).map((range) => ({ occasion, days: rangeLength(range) })))
    .sort((a, b) => a.days - b.days)[0]?.occasion ?? null;
}
