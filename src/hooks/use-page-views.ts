"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getContentParams } from "@/lib/analytics";

// Long enough for streamed metadata to land, short enough that a page whose title really doesn't change still counts.
const TITLE_WAIT_MS = 1000;

/*
  next/script injects the gtag stub from its own effect, which on a slow hydration can run after this one; polling
  briefly keeps the landing page view, while outside production (no gtag at all) it just gives up.
*/
const GTAG_WAIT_MS = 3000;
const GTAG_POLL_MS = 100;

/*
  GA's own history-change page views fire on the URL change, before Next.js swaps in the new <title>, so GA filed
  pages under the title of the one before. Sending them from here, once the title has changed, keeps them apart. The
  first page is sent from here too (gtag's config has send_page_view off), so every view carries the content params.
  Counts exactly what GA's history-change tracking would: a new path or query string is a page view, a hash-only
  change (TOC and heading jumps) isn't. That GA setting must stay off in the stream, or back/forward is counted twice.
*/
export function usePageViews(): void {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const previousTitle = useRef<string | null>(null);

  useEffect(() => {
    function send(): void {
      previousTitle.current = document.title;
      // GA drops the fragment from page_location itself, so one page isn't split across its anchors in reports.
      const location = new URL(window.location.href);
      location.hash = "";
      // gtag may be blocked or, outside production, never loaded — tracking must never break navigation.
      window.gtag?.("event", "page_view", {
        page_title: document.title,
        page_location: location.href,
        ...getContentParams(pathname)
      });
    }

    // The first page's title is already in the server HTML, so only gtag has to be waited for.
    if (previousTitle.current === null) {
      previousTitle.current = document.title;
      const startedAt = Date.now();
      let poll: ReturnType<typeof setTimeout> | undefined;
      const sendWhenReady = (): void => {
        if (typeof window.gtag === "function") send();
        else if (Date.now() - startedAt < GTAG_WAIT_MS) poll = setTimeout(sendWhenReady, GTAG_POLL_MS);
      };
      sendWhenReady();
      return () => clearTimeout(poll);
    }

    if (document.title !== previousTitle.current) {
      send();
      return;
    }

    let sent = false;
    const observer = new MutationObserver(() => {
      if (document.title !== previousTitle.current) finish();
    });
    const timer = setTimeout(finish, TITLE_WAIT_MS);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    function finish(): void {
      if (sent) return;
      sent = true;
      observer.disconnect();
      clearTimeout(timer);
      send();
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname, search]);
}
