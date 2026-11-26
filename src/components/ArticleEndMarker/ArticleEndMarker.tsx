"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getContentParams, trackEvent } from "@/lib/analytics";

// Below this, reaching the end is a scroll-past rather than a read.
const MIN_READ_MS = 10_000;

/*
  Sends article_read once per page view when the reader reaches the end of the article. Only time with the tab
  visible counts, so a post left open in a background tab doesn't pass for a long read.
*/
export default function ArticleEndMarker(): JSX.Element {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Keyed on pathname because the layout, and so this marker, survives navigating from one article to the next.
  useEffect(() => {
    const marker = ref.current;
    if (!marker) return;

    let visibleMs = 0;
    let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let inView = false;
    let sent = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const elapsed = (): number => visibleMs + (visibleSince === null ? 0 : performance.now() - visibleSince);

    function check(): void {
      clearTimeout(timer);
      if (sent || !inView || visibleSince === null) return;

      const readMs = elapsed();
      // Reached early: still counts if the reader is at the end once enough visible time has passed.
      if (readMs < MIN_READ_MS) {
        timer = setTimeout(check, MIN_READ_MS - readMs);
        return;
      }

      sent = true;
      observer.disconnect();
      // To Mixpanel too, since its newsletter funnel has reading to the end as a step.
      trackEvent("article_read", {
        event_label: pathname,
        read_seconds: Math.round(readMs / 1000),
        content_group: getContentParams(pathname).content_group
      }, { mixpanel: true });
    }

    function handleVisibilityChange(): void {
      if (document.visibilityState === "visible") {
        visibleSince ??= performance.now();
      } else if (visibleSince !== null) {
        visibleMs += performance.now() - visibleSince;
        visibleSince = null;
      }
      check();
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      check();
    });
    observer.observe(marker);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return <div ref={ref} aria-hidden="true" />;
}

ArticleEndMarker.displayName = "ArticleEndMarker";
