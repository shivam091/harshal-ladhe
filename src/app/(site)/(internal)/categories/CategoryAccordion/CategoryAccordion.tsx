"use client";

import type { JSX} from "react";
import { useState, useId } from "react";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence } from "motion/react";
import IconCategories from "@/icons/IconCategories";
import IconChevronDown from "@/icons/IconChevronDown";
import { FileIcon, CodeBlockIcon, BulbIcon } from "@/components/Icon";
import { useBoop } from "@/hooks/use-boop";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { getEntryCountParts, TAXONOMY_ENTRY_LABELS } from "@/utils/taxonomy-entries";
import type { TaxonomyEntryType } from "@/utils/taxonomy-entries";
// One post, tutorial, or snippet as surfaced under a category — trimmed to what the accordion renders.
interface CategoryAccordionEntry {
  type: TaxonomyEntryType;
  slug: string;
  title: string;
  // Resolved on the server, since a post's URL follows its first category rather than this one.
  pathname: string;
  publishedAt: string | null;
}

// One category group: its display name, slug, entry count, and its entries.
export interface CategoryAccordionItem {
  category: string;
  slug: string;
  count: number;
  entries: CategoryAccordionEntry[];
}
import {
  AccordionList,
  AccordionItem,
  AccordionHeader,
  AccordionTitle,
  CategoryLink,
  PostCount,
  AccordionToggle,
  AccordionBody,
  PostList,
  PostListItem,
  PostTitle,
  DottedSeparator,
  PostPublishedAt
} from "@/app/(site)/(internal)/categories/CategoryAccordion/CategoryAccordion.styles";

// Collapsed/expanded keyframes for a row's revealed post-list panel.
const PANEL_VARIANTS = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit:    { height: 0, opacity: 0 }
};

// Per-property easing/duration for the panel reveal — height and opacity animate at slightly different speeds.
const PANEL_TRANSITION = {
  height:  { duration: 0.3,  ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }
};

// Same icons as the archives so a format is recognisable at a glance wherever it's listed.
const ENTRY_TYPE_ICONS: Record<TaxonomyEntryType, typeof FileIcon> = {
  post: FileIcon,
  snippet: CodeBlockIcon,
  tutorial: BulbIcon
};

// Links out to the archive and reveals entries inline, so readers can skim without leaving the page.
function CategoryRow({ item }: { item: CategoryAccordionItem }): JSX.Element {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const [isBooped, triggerBoop] = useBoop();
  // Separate from the diamonds' boop — the chevron reacts to hover, not to opening.
  const [isChevronBooped, triggerChevronBoop] = useBoop();

  // Boops the diamonds only when opening — not on collapse or hover.
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) triggerBoop();
  };

  return (
    <>
      <Collapsible.Root open={open} onOpenChange={handleOpenChange} asChild>
        <AccordionItem data-expanded={open || undefined}>
          <AccordionHeader>
            <AccordionTitle>
              <IconCategories isBooped={isBooped} />
              <CategoryLink
                as={Link}
                href={`/category/${item.slug}`}
                aria-label={`View everything in ${item.category}`}
              >
                {item.category}
              </CategoryLink>
            </AccordionTitle>

            <PostCount aria-label={`${getEntryCountParts(item.entries).join(", ")} in ${item.category} category`}>
              {item.count}
            </PostCount>

            {/*
              aria-controls is only set while the panel is actually mounted — AnimatePresence
              unmounts it on collapse, and a stale reference to a since-removed id is worse
              than omitting the attribute when there's nothing (yet) to control.
            */}
            <Collapsible.Trigger asChild>
              <AccordionToggle
                type="button"
                aria-controls={open ? panelId : undefined}
                aria-label={`Toggle everything in ${item.category}`}
                onPointerEnter={triggerChevronBoop}
              >
                <IconChevronDown direction={open ? "up" : "down"} isBooped={isChevronBooped} />
              </AccordionToggle>
            </Collapsible.Trigger>
          </AccordionHeader>

          <AnimatePresence initial={false}>
            {open && (
              <AccordionBody
                id={panelId}
                key="panel"
                variants={PANEL_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PANEL_TRANSITION}
              >
                <PostList>
                  {item.entries.map((entry) => {
                    const EntryIcon = ENTRY_TYPE_ICONS[entry.type];

                    return (
                      <PostListItem key={`${entry.type}-${entry.slug}`}>
                        {/* Decorative — the link's aria-label already names the content type. */}
                        <EntryIcon className="entry-type-icon" size={16} aria-hidden />
                        <PostTitle
                          as={Link}
                          href={entry.pathname}
                          title={entry.title}
                          aria-label={`Read ${TAXONOMY_ENTRY_LABELS[entry.type].singular.toLowerCase()}: ${entry.title}`}
                          dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(entry.title) }}
                        />
                        <DottedSeparator aria-hidden="true" />
                        {entry.publishedAt && (
                          <PostPublishedAt dateTime={entry.publishedAt}>
                            {formatDate(entry.publishedAt)}
                          </PostPublishedAt>
                        )}
                      </PostListItem>
                    );
                  })}
                </PostList>
              </AccordionBody>
            )}
          </AnimatePresence>
        </AccordionItem>
      </Collapsible.Root>
    </>
  );
}

// Rows open independently so readers can compare several categories at once.
export default function CategoryAccordion({ items }: { items: CategoryAccordionItem[] }): JSX.Element {
  return (
    <>
       <AccordionList>
        {items.map((item) => (
          <CategoryRow key={item.slug} item={item} />
        ))}
      </AccordionList>
    </>
  );
}

CategoryAccordion.displayName = "CategoryAccordion";
