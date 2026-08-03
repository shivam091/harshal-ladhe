"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  A thin "use client" boundary so the server-rendered layout can track client-side
  navigations; failures are swallowed so tracking never degrades the visit.
*/
export default function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    // Unsubscribe links carry a subscriber's signed token, which has no place in page-view stats.
    if (!pathname || pathname.startsWith("/unsubscribe/")) return;

    const body = JSON.stringify({ slug: pathname });

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
