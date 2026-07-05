import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Heading } from "@/components/TableOfContents/TableOfContents.types";

/*
  Collects all id-bearing headings (h2 up to maxLevel) inside #post-content, in document order.
  Re-runs on pathname change too: PostLayout is a shared segment layout, so navigating between
  posts (e.g. via RelatedPosts or prev/next) swaps #post-content's children without remounting
  this hook — without the pathname dependency the scrape would only ever reflect the first post visited.
*/
export function usePostHeadings(maxLevel: 2 | 3 | 4): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Only headings with an id can be linked to, so every selector filters on [id].
    const selectors = ["#post-content h2[id]"];
    if (maxLevel >= 3) selectors.push("#post-content h3[id]");
    if (maxLevel >= 4) selectors.push("#post-content h4[id]");

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(selectors.join(", "))
    );
    setHeadings(
      nodes.map((node) => {
        /*
          Clone so the live heading is untouched, then drop MDXHeadingAnchor's hash-link —
          otherwise its <a> (and icon) would get copied into the TOC's own <a>, nesting
          an anchor inside an anchor. What's left is the heading's real inline markup
          (e.g. <kbd> from a Markdown code span), which the TOC link renders as-is.
        */
        const clone = node.cloneNode(true) as HTMLElement;
        clone.querySelector("a")?.remove();

        return {
          id: node.id,
          html: (clone.innerHTML ?? "").trim(),
          level: parseInt(node.tagName[1]) as 2 | 3 | 4
        };
      })
    );
  }, [maxLevel, pathname]);

  return headings;
}
