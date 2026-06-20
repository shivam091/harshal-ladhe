"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  PageViewTracker — silently records a visit each time the path changes.

  Why a separate component?
    The parent (site)/layout.tsx is a server component. This thin "use client"
    boundary keeps usePathname() and the effect out of the layout's bundle.

  It renders nothing. On every pathname change it fires a fire-and-forget
  beacon to /api/views; failures are swallowed so tracking is invisible and
  never degrades the visitor's experience.
*/
export default function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const body = JSON.stringify({ slug: pathname });

    // Prefer sendBeacon so the request survives navigation/unload; fall back to fetch.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/views", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
