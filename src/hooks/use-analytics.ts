"use client";

import { useEffect } from "react";

// gtag comes from an external script, so TypeScript has to be told it may exist on window.
declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: Record<string, string>) => void;
  }
}

// One delegated listener lets any element opt into tracking via data attributes, with no per-component handlers.
export function useAnalytics(): void {
  useEffect(() => {
    // closest() so clicks on an icon or label inside a tracked link still count.
    function handleClick(e: MouseEvent): void {
      const target = (e.target as Element).closest("[data-analytics-event]");
      if (!target) return;

      const event    = target.getAttribute("data-analytics-event");
      const label    = target.getAttribute("data-analytics-label") ?? "";
      const category = target.getAttribute("data-analytics-category") ?? "";

      // gtag may be blocked or not loaded yet — tracking must never break the click.
      if (!event || typeof window.gtag !== "function") return;

      window.gtag("event", event, { event_label: label, event_category: category });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
