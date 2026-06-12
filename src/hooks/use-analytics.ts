"use client";

import { useEffect } from "react";
import { trackEvent, type GaParams } from "@/lib/analytics";

// Attributes the handler reads itself; every other data-analytics-* attribute is sent as a parameter of its own.
const RESERVED = new Set(["event", "label", "category"]);

const PREFIX = "data-analytics-";

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
      if (!event) return;

      const params: GaParams = { event_label: label, event_category: category };
      for (const { name, value } of Array.from(target.attributes)) {
        if (!name.startsWith(PREFIX)) continue;
        const key = name.slice(PREFIX.length);
        if (!RESERVED.has(key)) params[key.replace(/-/g, "_")] = value;
      }

      trackEvent(event, params);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
