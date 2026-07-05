"use client";

import type { JSX} from "react";
import { useState, useId } from "react";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence } from "motion/react";
import IconCategories from "@/icons/IconCategories";
import IconChevronDown from "@/icons/IconChevronDown";
import { useBoop } from "@/hooks/use-boop";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
// One post as surfaced under a category — trimmed to what the accordion renders.
interface CategoryAccordionPost {
  slug: string;
  title: string;
  publishedAt: string | null;
}

// One category group: its display name, slug, post count, and its posts.
export interface CategoryAccordionItem {
  category: string;
  slug: string;
  count: number;
  posts: CategoryAccordionPost[];
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

// Pluralise "post"/"posts" for a count.
function postsLabel(count: number): string {
  return `${count} post${count === 1 ? "" : "s"}`;
}

/*
  One collapsible category row — the header links out to the /category/<slug>
  archive while the toggle reveals the category's posts inline.
*/
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
                aria-label={`View all posts in ${item.category}`}
              >
                {item.category}
              </CategoryLink>
            </AccordionTitle>

            <PostCount aria-label={`${postsLabel(item.count)} in ${item.category} category`}>
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
                aria-label={`Toggle all posts of ${item.category}`}
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
                  {item.posts.map((post) => (
                    <PostListItem key={post.slug}>
                      <PostTitle
                        as={Link}
                        href={`/post/${item.slug}/${post.slug}`}
                        title={post.title}
                        aria-label={`Read post: ${post.title}`}
                        dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }}
                      />
                      <DottedSeparator aria-hidden="true" />
                      {post.publishedAt && (
                        <PostPublishedAt dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </PostPublishedAt>
                      )}
                    </PostListItem>
                  ))}
                </PostList>
              </AccordionBody>
            )}
          </AnimatePresence>
        </AccordionItem>
      </Collapsible.Root>
    </>
  );
}

/*
  Accordion index of every category — each row expands to reveal its posts.
  Rows open independently, mirroring the multi-open Jekyll `data-accordion`.
*/
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
