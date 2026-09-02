// How an add() call should handle a day that doesn't exist in the target month (e.g. day 31 of a 30-day month).
export type OverflowMode = "constrain" | "reject";

// The three fields an add() call can shift a plain calendar date by.
export interface DurationLike {
  years?: number;
  months?: number;
  days?: number;
}

// Real calendar length of `month` (1-indexed) in `year`, leap years included — delegates to Date's own calendar math.
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/*
  A minimal, dependency-free stand-in for Temporal.PlainDate's from()/add()/toString() — just
  enough of the real API to power this sandbox in any environment, native Temporal or not. Used
  via `Temporal?.PlainDate ?? PlainDateLite` in App.tsx, so it only runs where the real thing
  isn't already available.
*/
export class PlainDateLite {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  // Parses a plain "YYYY-MM-DD" string — no timezone, no time-of-day, matching Temporal.PlainDate.from().
  static from(iso: string): PlainDateLite {
    const [year, month, day] = iso.split("-").map(Number);
    return new PlainDateLite(year, month, day);
  }

  // Returns a new PlainDateLite shifted by years/months/days — never mutates this instance.
  add(duration: DurationLike, options: { overflow?: OverflowMode } = {}): PlainDateLite {
    const overflow = options.overflow ?? "constrain";

    let year = this.year + (duration.years ?? 0);
    let month = this.month + (duration.months ?? 0);
    while (month > 12) {
      month -= 12;
      year += 1;
    }
    while (month < 1) {
      month += 12;
      year -= 1;
    }

    const maxDay = daysInMonth(year, month);
    let day = this.day;
    if (day > maxDay) {
      if (overflow === "reject") {
        throw new RangeError(`Day ${day} doesn't exist in ${year}-${String(month).padStart(2, "0")} (that month only has ${maxDay} days)`);
      }
      day = maxDay;
    }

    const monthShifted = new PlainDateLite(year, month, day);
    return duration.days ? monthShifted.addDays(duration.days) : monthShifted;
  }

  // Shifts by a whole number of days, letting the calendar itself handle month/year rollover.
  private addDays(count: number): PlainDateLite {
    const utc = new Date(Date.UTC(this.year, this.month - 1, this.day));
    utc.setUTCDate(utc.getUTCDate() + count);
    return new PlainDateLite(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate());
  }

  // ISO "YYYY-MM-DD" — matches Temporal.PlainDate's own toString() output.
  toString(): string {
    return `${String(this.year).padStart(4, "0")}-${String(this.month).padStart(2, "0")}-${String(this.day).padStart(2, "0")}`;
  }
}

// Reproduces the classic Date footgun: setMonth() rolls into the next month instead of clamping when the target month is shorter.
export function addMonthsWithLegacyDate(iso: string, months: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setMonth(date.getMonth() + months);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
