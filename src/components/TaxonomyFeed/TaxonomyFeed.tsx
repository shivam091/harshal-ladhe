"use client";

import type { JSX } from "react";
import { useMemo } from "react";
import FilterChips from "@/components/FilterChips";
import AnimatedPostList from "@/components/PostList/AnimatedPostList";
import { CONTENT_TYPE_ICONS } from "@/constants/content-type-icons";
import { useToggleSet } from "@/hooks/use-toggle-set";
import { TAXONOMY_ENTRY_LABELS, TAXONOMY_ENTRY_TYPES } from "@/utils/taxonomy-entries";
import type { PostListEntry } from "@/components/PostList/PostList.types";

// Pre-sorted on the server because the dates come from git history.
interface TaxonomyFeedProps {
  entries: PostListEntry[];
}

/*
  Tag and category archives mix formats, so readers can narrow to one. Every format always
  gets a chip so all archives look alike; formats the archive lacks are simply disabled.
*/
export default function TaxonomyFeed({ entries }: TaxonomyFeedProps): JSX.Element {
  const presentTypes = useMemo(
    () => TAXONOMY_ENTRY_TYPES.filter((type) => entries.some((entry) => (entry.type ?? "post") === type)),
    [entries]
  );
  const [selectedTypes, toggleType] = useToggleSet(presentTypes);

  const options = TAXONOMY_ENTRY_TYPES.map((type) => {
    const disabled = !presentTypes.includes(type);

    return {
      value: type,
      label: TAXONOMY_ENTRY_LABELS[type].plural,
      Icon: CONTENT_TYPE_ICONS[type],
      // A "0" badge adds nothing once the chip is disabled, so empty formats carry no count.
      count: disabled ? undefined : entries.filter((entry) => (entry.type ?? "post") === type).length,
      disabled
    };
  });

  const visibleEntries = useMemo(
    () => entries.filter((entry) => selectedTypes.has(entry.type ?? "post")),
    [entries, selectedTypes]
  );

  return (
    <>
      <FilterChips
        options={options}
        selected={selectedTypes}
        onToggle={toggleType}
        ariaLabel="Filter by content type"
      />

      <AnimatedPostList posts={visibleEntries} showTypeIcon />
    </>
  );
}

TaxonomyFeed.displayName = "TaxonomyFeed";
