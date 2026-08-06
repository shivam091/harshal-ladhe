"use client";

import { useMemo, useState, Fragment, JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import VisuallyHidden from "@/components/VisuallyHidden";
import { FileIcon, CodeBlockIcon, BookOpenIcon } from "@/components/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { groupArchiveItemsByYear } from "@/utils/archive-items";
import { formatDayMonth, fullTimestamp } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { ArchiveItem } from "@/interfaces/archives";
import { ArchiveItemType } from "@/types/archives";
import { TimelineWrapper, FilterRow, FilterChip } from "@/app/(site)/(internal)/archives/ArchivesClient/ArchiveClient.styles";

interface ArchivesClientProps {
  /*
    Every post, snippet, and series, already sorted newest-first — computed
    server-side in page.tsx since it needs git history.
  */
  items: ArchiveItem[];
}

const ALL_TYPES: ArchiveItemType[] = ["post", "snippet", "series"];

// Enter/exit keyframes for a timeline row appearing/disappearing as the type filter changes.
const ITEM_VARIANTS = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 }
};

// Mirrors CategoryAccordion's easing curve, at a snappier duration suited to list reflow.
const ITEM_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

// Instant, no-motion fallback used everywhere above once prefers-reduced-motion is on.
const NO_MOTION_TRANSITION = { duration: 0 };

// Icon + label shown per content type, both on each filter chip and as a per-row indicator.
const TYPE_META: Record<ArchiveItemType, { label: string; Icon: typeof FileIcon }> = {
  post: { label: "Posts", Icon: FileIcon },
  snippet: { label: "Snippets", Icon: CodeBlockIcon },
  series: { label: "Series", Icon: BookOpenIcon }
};

/*
  Client half of /archives — owns the content-type filter and re-derives the
  year grouping after every toggle. The default (all three types selected)
  produces the exact same grouping the server already rendered, so there's no
  hydration mismatch; filtering after that is instant and purely client-side.
*/
export default function ArchivesClient({ items }: ArchivesClientProps): JSX.Element {
  const [selectedTypes, setSelectedTypes] = useState<Set<ArchiveItemType>>(
    () => new Set(ALL_TYPES)
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemTransition = prefersReducedMotion ? NO_MOTION_TRANSITION : ITEM_TRANSITION;

  function toggleType(type: ArchiveItemType): void {
    setSelectedTypes((current) => {
      // Never allow the last remaining type to be switched off — an empty
      // timeline isn't a useful state, and there'd be no chip left to undo it.
      if (current.has(type) && current.size === 1) return current;

      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  const itemsByYear = useMemo(() => {
    const filtered = items.filter((item) => selectedTypes.has(item.type));
    return groupArchiveItemsByYear(filtered);
  }, [items, selectedTypes]);

  return (
    <>
      <FilterRow role="group" aria-label="Filter archive by content type">
        {ALL_TYPES.map((type) => {
          const { label, Icon } = TYPE_META[type];
          const active = selectedTypes.has(type);

          return (
            <FilterChip
              key={type}
              type="button"
              data-active={active}
              aria-pressed={active}
              onClick={() => toggleType(type)}
            >
              <Icon size={16} aria-hidden />
              {label}
            </FilterChip>
          );
        })}
      </FilterRow>

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
                className="timeline-posts"
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
                    const { label, Icon } = TYPE_META[item.type];

                    return (
                      <motion.li
                        key={item.id}
                        layout="position"
                        variants={ITEM_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={itemTransition}
                        className="timeline-post"
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
                            className="post-title"
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
