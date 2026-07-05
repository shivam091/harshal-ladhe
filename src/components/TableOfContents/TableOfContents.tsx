"use client";

import type { JSX, CSSProperties } from "react";
import { useState, useEffect, useCallback } from "react";
import type { TableOfContentsProps } from "@/components/TableOfContents/TableOfContents.types";
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
  Lets readers see where they are in a long post and jump between sections. Anything that must
  stay visible on posts without headings lives outside it, since it renders nothing then.
*/
export default function TableOfContents({ maxLevel = 3 }: TableOfContentsProps): JSX.Element | null {
  // Gated on hydration so the entrance animation plays on the client instead of the server render.
  const [mounted, setMounted] = useState(false);
  const headings = usePostHeadings(maxLevel);
  const activeId = useActiveHeading(headings);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth-scrolls instead of the default jump so readers keep their sense of place.
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      /*
        getElementById, not querySelector(href) — slugs like "4-transition-delay" start with a
        digit, which querySelector rejects as an invalid CSS identifier unless escaped.
      */
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Moves focus to the target heading so keyboard users continue from the section they picked.
  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      document.getElementById(href.slice(1))?.focus({
        preventScroll: false
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
          "--x": mounted ? "0px" : "20px"
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
                data-analytics-event="toc_click"
                data-analytics-label={heading.id}
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
