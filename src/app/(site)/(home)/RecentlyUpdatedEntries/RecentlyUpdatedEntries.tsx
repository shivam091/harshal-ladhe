"use client";

import type { JSX } from "react";
import Link from "next/link";
import { useBoop } from "@/hooks/use-boop";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { TAXONOMY_ENTRY_LABELS, type TaxonomyEntryType } from "@/utils/taxonomy-entries";
import IconArrowRight from "@/icons/IconArrowRight";
import {
  RecentlyUpdatedEntriesList,
  RecentlyUpdatedEntryItem
} from "@/app/(site)/(home)/RecentlyUpdatedEntries/RecentlyUpdatedEntries.styles";

// One row's link — its own useBoop instance so hovering one entry doesn't boop the others.
function RecentlyUpdatedEntryLink({ type, title, href }: Omit<RecentlyUpdatedEntry, "slug">): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <Link
        href={href}
        className="recently-updated-entry"
        title={title}
        aria-label={`Read ${TAXONOMY_ENTRY_LABELS[type].singular.toLowerCase()}: ${title}`}
        onPointerEnter={triggerBoop}
        onFocus={triggerBoop}
      >
        <IconArrowRight isBooped={isBooped} />
        <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(title) }} />
      </Link>
    </>
  );
}

// Surfaces recently changed posts, tutorials, and snippets so returning readers spot updates; renders nothing when empty.
// One entry as surfaced in the list — the URL is resolved on the server so the row stays type-agnostic.
interface RecentlyUpdatedEntry {
  type: TaxonomyEntryType;
  slug: string;
  title: string;
  href: string;
}

// Props for the home page's RecentlyUpdatedEntries block.
interface RecentlyUpdatedEntriesProps {
  entries: RecentlyUpdatedEntry[];
}

export default function RecentlyUpdatedEntries({ entries }: RecentlyUpdatedEntriesProps): JSX.Element | null {
  if (entries.length === 0) return null;

  return (
    <>
      <RecentlyUpdatedEntriesList>
        {entries.map((entry) => (
          <RecentlyUpdatedEntryItem key={`${entry.type}-${entry.slug}`}>
            <RecentlyUpdatedEntryLink type={entry.type} title={entry.title} href={entry.href} />
          </RecentlyUpdatedEntryItem>
        ))}
      </RecentlyUpdatedEntriesList>
    </>
  );
}

RecentlyUpdatedEntries.displayName = "RecentlyUpdatedEntries";
