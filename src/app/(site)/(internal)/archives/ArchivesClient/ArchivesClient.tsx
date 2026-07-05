"use client";

import type { JSX } from "react";
import { useMemo, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import VisuallyHidden from "@/components/VisuallyHidden";
import FilterChips from "@/components/FilterChips";
import { CONTENT_TYPE_ICONS } from "@/constants/content-type-icons";
import { useToggleSet } from "@/hooks/use-toggle-set";
import { FILTER_ITEM_VARIANTS, FILTER_ITEM_TRANSITION, NO_MOTION_TRANSITION } from "@/constants/filter-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { groupArchiveItemsByYear } from "@/utils/archive-items";
import { formatDayMonth, fullTimestamp } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { ArchiveItem, ArchiveItemType } from "@/utils/archive-items";
import { TimelineWrapper } from "@/app/(site)/(internal)/archives/ArchivesClient/ArchiveClient.styles";

interface ArchivesClientProps {
  // Pre-sorted on the server because the dates come from git history.
  items: ArchiveItem[];
}

// Longest-form first, matching the order every other archive lists content types in.
const ALL_TYPES: ArchiveItemType[] = ["post", "tutorial", "snippet"];

// One lookup so chips and row indicators always label a type the same way.
const TYPE_LABELS: Record<ArchiveItemType, string> = {
  post: "Posts",
  tutorial: "Tutorials",
  snippet: "Snippets"
};

/*
  Client half of /archives — owns the content-type filter and re-derives the
  year grouping after every toggle. The default (all types selected) produces
  the exact same grouping the server already rendered, so there's no
  hydration mismatch; filtering after that is instant and purely client-side.
*/
export default function ArchivesClient({ items }: ArchivesClientProps): JSX.Element {
  const [selectedTypes, toggleType] = useToggleSet(ALL_TYPES);
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemTransition = prefersReducedMotion ? NO_MOTION_TRANSITION : FILTER_ITEM_TRANSITION;

  // Counts only dated items, since undated ones never reach the timeline and a chip shouldn't promise rows it can't show.
  const filterOptions = useMemo(
    () =>
      ALL_TYPES.map((type) => ({
        value: type,
        label: TYPE_LABELS[type],
        Icon: CONTENT_TYPE_ICONS[type],
        count: items.filter((item) => item.type === type && item.publishedAt).length
      })),
    [items]
  );

  const itemsByYear = useMemo(() => {
    const filtered = items.filter((item) => selectedTypes.has(item.type));
    return groupArchiveItemsByYear(filtered);
  }, [items, selectedTypes]);

  return (
    <>
      <FilterChips
        options={filterOptions}
        selected={selectedTypes}
        onToggle={toggleType}
        ariaLabel="Filter archive by content type"
      />

      <TimelineWrapper>
        <div className="timeline">
          {itemsByYear.map(({ year, items: yearItems }) => (
            <Fragment key={year}>
              <motion.div
                layout="position"
                transition={itemTransition}
                className="timeline-year"
                role="group"
                aria-labelledby={`year-${year}`}
              >
                <div id={`year-${year}`} className="timeline-left h2">
                  <VisuallyHidden>Year:</VisuallyHidden>
                  {year}
                </div>
                <div className="timeline-seperator" />
              </motion.div>

              <motion.ul
                layout="position"
                transition={itemTransition}
                className="timeline-items"
                role="list"
                aria-labelledby={`year-${year}`}
              >
                <VisuallyHidden as="li" role="presentation">
                  Items for year {year}
                </VisuallyHidden>

                {/*
                  popLayout takes an exiting row out of document flow immediately (instead of
                  waiting for its fade to finish), so surviving rows above/below can slide into
                  place at the same time — the effect that actually reads as "filtering", not
                  just "an item faded out somewhere".
                */}
                <AnimatePresence initial={false} mode="popLayout">
                  {yearItems.map((item) => {
                    const label = TYPE_LABELS[item.type];
                    const Icon = CONTENT_TYPE_ICONS[item.type];

                    return (
                      <motion.li
                        key={item.id}
                        layout="position"
                        variants={FILTER_ITEM_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={itemTransition}
                        className="timeline-item"
                        role="listitem"
                      >
                        <div className="timeline-left">
                          <VisuallyHidden>Published on:</VisuallyHidden>
                          {item.publishedAt && (
                            <time
                              dateTime={item.publishedAt}
                              title={`Published on ${fullTimestamp(item.publishedAt)}`}
                            >
                              {formatDayMonth(item.publishedAt)}
                            </time>
                          )}
                        </div>
                        <div className="timeline-seperator" />
                        <div className="timeline-right">
                          <Icon className="timeline-item-icon" size={16} aria-hidden />
                          <VisuallyHidden>{label}:</VisuallyHidden>
                          <Link
                            href={item.pathname}
                            className="timeline-item-title"
                            title={item.title}
                            dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(item.title) }}
                          />
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </Fragment>
          ))}
        </div>
      </TimelineWrapper>
    </>
  );
}

ArchivesClient.displayName = "ArchivesClient";
