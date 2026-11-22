"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsentStatus } from "@/lib/consent";

type Utm = { source: string; medium: string; campaign: string; content: string; term: string; id: string };

type Landing = { referrer: string; utm?: Utm };

/*
  Module-level rather than a ref, so a remount of the layout (e.g. after the root 404 page) isn't taken for a new
  visit. document.referrer and the URL's UTM tags only describe how the visit began, so they ride on the first beacon
  alone; later navigations are internal by definition.
*/
let landing: Landing | null | undefined;

function readLanding(): Landing {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  return {
    referrer: document.referrer,
    utm: source
      ? {
        source,
        medium: params.get("utm_medium") ?? "",
        campaign: params.get("utm_campaign") ?? "",
        content: params.get("utm_content") ?? "",
        term: params.get("utm_term") ?? "",
        id: params.get("utm_id") ?? ""
      }
      : undefined
  };
}

/*
  A thin "use client" boundary so the server-rendered layout can track client-side
  navigations; failures are swallowed so tracking never degrades the visit.
*/
export default function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    // Captured before the skip below, so a visit that lands on an untracked page still keeps its source.
    if (landing === undefined) landing = readLanding();

    // Unsubscribe links carry a subscriber's signed token, which has no place in page-view stats.
    if (!pathname || pathname.startsWith("/unsubscribe/")) return;

    const source = landing ?? { referrer: "", internal: true };
    landing = null;
    const body = JSON.stringify({ slug: pathname, consent: readConsentStatus(), ...source });

    // Prefer sendBeacon so the request survives navigation/unload; fall back to fetch.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/views", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
