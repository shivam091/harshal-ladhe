"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Long enough for streamed metadata to land, short enough that a page whose title really doesn't change still counts.
const TITLE_WAIT_MS = 1000;

// GA's own history-change page views fire on the URL change, before Next.js swaps in the new <title>, so GA filed
// pages under the title of the one before. Sending them from here, once the title has changed, keeps them apart.
export function usePageViews(): void {
  const pathname = usePathname();
  const previousTitle = useRef<string | null>(null);

  useEffect(() => {
    // The first page's title is in the server HTML, and gtag's config sends that view itself.
    if (previousTitle.current === null) {
      previousTitle.current = document.title;
      return;
    }

    function send(): void {
      previousTitle.current = document.title;

      // gtag may be blocked or, outside production, never loaded — tracking must never break navigation.
      if (typeof window.gtag !== "function") return;
      window.gtag("event", "page_view", { page_title: document.title, page_location: window.location.href });
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
  }, [pathname]);
}
