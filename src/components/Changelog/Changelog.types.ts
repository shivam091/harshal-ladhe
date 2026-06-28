// A single dated changelog entry.
export interface ChangelogEntry {
  date: string;
  change: string;
}

// Props for the reusable Changelog component, shared by snippets and posts.
export interface ChangelogProps {
  entries: ChangelogEntry[];
}
