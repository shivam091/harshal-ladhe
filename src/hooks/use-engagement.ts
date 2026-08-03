"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getContentParams, trackEvent } from "@/lib/analytics";
import { mixpanelTrack } from "@/lib/mixpanel";

// Quarters, coarse enough to keep events few yet still show where readers drop off.
const MILESTONES = [25, 50, 75, 100];

// Close enough to the bottom to count as all of it, since a sticky footer or rounding can keep 100 out of reach.
const BOTTOM_SLACK = 2;

// A reader who hasn't scrolled, typed or moved the pointer for this long has stopped reading, even with the tab open.
const IDLE_MS = 30_000;

// Fine enough for engaged seconds, and cheap enough to run for the whole visit.
const TICK_MS = 1000;

// Only where reading is the point; on listings a deep scroll means browsing, not reading.
const READ_GROUPS = new Set(["post", "tutorial", "snippet", "series"]);

// Touch included, so a phone reader who only scrolls with a thumb isn't taken for idle.
const ACTIVITY_EVENTS = ["scroll", "keydown", "pointerdown", "pointermove", "wheel", "touchstart"] as const;

// To the bottom of the viewport, so a short page that fits on screen counts as fully seen.
function scrolledPercent(): number {
  const { scrollHeight } = document.documentElement;
  if (scrollHeight <= 0) return 100;
  const seen = ((window.scrollY + window.innerHeight) / scrollHeight) * 100;
  return Math.min(100, Math.round(seen >= 100 - BOTTOM_SLACK ? 100 : seen));
}

/*
  A page view alone can't tell a read from a bounce. page_leave is resent whenever the tab hides, since a phone may
  never fire anything after that, and its view_id lets a report count only the last one per view.
*/
export function useEngagement(): void {
  const pathname = usePathname();

  useEffect(() => {
    const viewId = crypto.randomUUID();
    const content = getContentParams(pathname);
    const tracksDepth = READ_GROUPS.has(content.content_group);
    const reached = new Set<number>();
    let maxPercent = scrolledPercent();
    let engagedMs = 0;
    let lastActivity = performance.now();
    let scrolled = false;

    function onActivity(): void {
      lastActivity = performance.now();
    }

    function onScroll(): void {
      scrolled = true;
      const percent = scrolledPercent();
      maxPercent = Math.max(maxPercent, percent);
      if (!tracksDepth) return;
      for (const milestone of MILESTONES) {
        if (percent < milestone || reached.has(milestone)) continue;
        reached.add(milestone);
        trackEvent("scroll_depth", { percent: milestone, event_label: pathname, content_group: content.content_group });
      }
    }

    const ticker = setInterval(() => {
      if (document.visibilityState === "visible" && performance.now() - lastActivity < IDLE_MS) engagedMs += TICK_MS;
    }, TICK_MS);

    function sendLeave(): void {
      // A bounce with no time and no scroll says nothing a page view doesn't already.
      if (engagedMs === 0 && !scrolled) return;
      mixpanelTrack(
        "page_leave",
        {
          view_id: viewId,
          path: pathname,
          engaged_seconds: Math.round(engagedMs / 1000),
          max_scroll_percent: maxPercent,
          ...content
        },
        { transport: "sendBeacon" }
      );
    }

    function onVisibilityChange(): void {
      if (document.visibilityState === "hidden") sendLeave();
    }

    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, onActivity, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Keyed on pathname: a client-side navigation ends this view and starts the next one.
    return () => {
      clearInterval(ticker);
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, onActivity);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      sendLeave();
    };
  }, [pathname]);
}
