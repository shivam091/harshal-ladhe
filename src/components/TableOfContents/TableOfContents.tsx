"use client";

import { JSX, useState, useEffect, useCallback, CSSProperties } from "react";
import { TableOfContentsProps } from "@/interfaces/table-of-contents";
import { usePostHeadings } from "@/hooks/use-post-headings";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { getStylesForDepth } from "@/components/TableOfContents/TableOfContents.helpers";
import {
  TocWrapper,
  TocTitle,
  TocList,
  ContentLinkHeading
} from "@/components/TableOfContents/TableOfContents.styles";

/*
  Sticky sidebar navigation for post pages: lists the post's headings, highlights the section
  currently in view, and smooth-scrolls to a section on click. Renders nothing if the post has no headings.
  LikeButton is a sibling of this component (rendered by the post layout, not here) so it stays
  visible even on posts with no headings, where this component renders null.
*/
export default function TableOfContents({ maxLevel = 3 }: TableOfContentsProps): JSX.Element | null {
  // Drives the fade/slide-in entrance animation — false during SSR, flipped true after hydration.
  const [mounted, setMounted] = useState(false);
  const headings = usePostHeadings(maxLevel);
  const activeId = useActiveHeading(headings);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intercepts link clicks to smooth-scroll to the target section instead of the default jump.
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /*
    Keyboard equivalent of handleClick: on Enter, moves focus to the target heading
    (scrolling it into view) so keyboard users land at the section they picked.
  */
  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      (document.querySelector(href) as HTMLElement | null)?.focus({
        preventScroll: false,
      });
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <>
      <TocWrapper
        aria-label="Table of contents"
        style={{
          opacity: mounted ? 1 : 0,
          "--x": mounted ? "0px" : "20px",
        } as CSSProperties}
      >
        <TocTitle>Table of Contents</TocTitle>

        <TocList>
          {headings.map((heading) => (
            <li key={heading.id}>
              <ContentLinkHeading
                href={`#${heading.id}`}
                style={getStylesForDepth(heading.level, activeId === heading.id)}
                onClick={handleClick}
                onKeyUp={handleKeyUp}
                dangerouslySetInnerHTML={{ __html: heading.html }}
              />
            </li>
          ))}
        </TocList>
      </TocWrapper>
    </>
  );
}

TableOfContents.displayName = "TableOfContents";
