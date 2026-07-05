// UTC so a post's date never shifts by a day depending on the reader's timezone.
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

// Compact "DD Mon" (e.g. "09 Jul") so the date fits beside each timeline row.
export function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  });
}

// Spelled out in full so the compact on-page date can reveal the exact moment on hover.
export function fullTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
}

// UTC so the month never shifts by timezone.
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}
