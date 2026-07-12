"use client";

import { useEffect } from "react";

// Extends the Window type so TypeScript recognises the GA4 gtag function injected by the Google Analytics script.
declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: Record<string, string>) => void;
  }
}

// Attaches a single delegated click listener that fires GA4 events for any element carrying data-analytics-* attributes.
export function useAnalytics(): void {
  useEffect(() => {
    // Walks up the DOM from the click target to find the nearest analytics-annotated element.
    function handleClick(e: MouseEvent): void {
      const target = (e.target as Element).closest("[data-analytics-event]");
      if (!target) return;

      const event    = target.getAttribute("data-analytics-event");
      const label    = target.getAttribute("data-analytics-label") ?? "";
      const category = target.getAttribute("data-analytics-category") ?? "";

      // Silently skips if the event name is missing or gtag hasn't loaded yet.
      if (!event || typeof window.gtag !== "function") return;

      window.gtag("event", event, { event_label: label, event_category: category });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
