import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Heading } from "@/components/TableOfContents/TableOfContents.types";

/*
  Re-runs on pathname change because navigating between posts swaps the content without
  remounting this hook, so the list would otherwise stay stuck on the first post visited.
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
          Cloned so the live heading is untouched, with its hash-link removed — copying it
          would nest an anchor inside the list's own anchor.
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
