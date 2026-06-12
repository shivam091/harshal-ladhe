"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

// Only the Core Web Vitals and their two diagnostics; Next's own custom metrics would only add noise to GA.
const METRICS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

/*
  CLS and INP are reported again, under the same id, each time the tab is hidden after being shown again. GA can only
  count and sum events, so a second report would count one page view twice and put it in two rating buckets; only the
  first report for each id is sent. A bfcache restore is a new page view with a new id, so it's still sent.
*/
const sent = new Set<string>();

/*
  CLS is scaled up because GA rounds event values to integers and CLS lives below 1.
*/
export function useWebVitals(): void {
  useReportWebVitals(({ name, value, id, rating }) => {
    if (!METRICS.has(name) || sent.has(id)) return;
    sent.add(id);

    trackEvent(name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_rating: rating,
      non_interaction: true
    });
  });
}
