// Format an ISO date string for display.
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

// Short "DD Mon" (e.g. "09 Jul") — the compact date shown in the archives timeline.
export function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  });
}

// Full "Month DD, YYYY at HH:MM AM" — used as the time element's tooltip.
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


// Formats an ISO date string as "Month Year" (e.g. "January 2026") for the
// last-modified label on each snippet card. UTC keeps dates from shifting by timezone.
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}
