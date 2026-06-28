// Date stays an ISO string so it can feed <time dateTime> directly.
export interface ChangelogEntry {
  date: string;
  change: string;
}

// Plain data in, so any content type's registry entry can feed it as-is.
export interface ChangelogProps {
  entries: ChangelogEntry[];
}
