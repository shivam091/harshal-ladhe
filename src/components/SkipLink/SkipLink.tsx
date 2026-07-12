"use client";

import type { JSX} from "react";
import { useCallback } from "react";
import Button from "@/components/Button";
import type { SkipLinkProps } from "@/components/SkipLink/SkipLink.types";
import { SkipLinkWrapper } from "@/components/SkipLink/SkipLink.styles";

// Lets keyboard and screen-reader users bypass the header nav instead of tabbing through it on every page.
export default function SkipLink({ skipTo = "#main-content" }: SkipLinkProps): JSX.Element {
  // Handled manually so focus actually lands on the target and the jump scrolls smoothly instead of snapping.
  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      const target = document.querySelector<HTMLElement>(skipTo);
      if (!target) return;

      // Makes a non-interactive target focusable without adding it to the tab order.
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      // Otherwise focus() would jump instantly and override the smooth scroll.
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [skipTo]);

  // The wrapper owns the slide animation so it never overrides the Button's own transitions.
  return (
    <>
      <SkipLinkWrapper>
        <Button
          href={skipTo}
          size="sm"
          onClick={handleClick}
        >
          Skip to main content
        </Button>
      </SkipLinkWrapper>
    </>
  );
}

SkipLink.displayName = "SkipLink";
