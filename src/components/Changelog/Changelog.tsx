import type { JSX } from "react";
import { formatDate } from "@/utils/date";
import type { ChangelogProps } from "@/components/Changelog/Changelog.types";
import {
  ChangelogSection,
  ChangelogTitle,
  ChangelogEntries,
  ChangelogEntryItem
} from "@/components/Changelog/Changelog.styles";

// Reusable changelog — a dated list of revisions. Shared by snippets and posts.
export default function Changelog({ entries }: ChangelogProps): JSX.Element | null {
  if (!entries || entries.length === 0) return null;

  return (
    <>
      <ChangelogSection aria-labelledby="changelog-title">
        <ChangelogTitle id="changelog-title">Changelog</ChangelogTitle>
        <ChangelogEntries>
          {entries.map((entry) => (
            <ChangelogEntryItem key={`${entry.date}-${entry.change}`}>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time> — {entry.change}
            </ChangelogEntryItem>
          ))}
        </ChangelogEntries>
      </ChangelogSection>
    </>
  );
}

Changelog.displayName = "Changelog";
