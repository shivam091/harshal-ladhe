"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

// Only the Core Web Vitals and their two diagnostics; Next's own custom metrics would only add noise to GA.
const METRICS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

/*
  `value` is the delta, so summing a metric's events in GA gives its final value; CLS is scaled up because GA rounds
  event values to integers and CLS lives below 1.
*/
export function useWebVitals(): void {
  useReportWebVitals(({ name, delta, value, id, rating }) => {
    if (!METRICS.has(name)) return;

    trackEvent(name, {
      value: Math.round(name === "CLS" ? delta * 1000 : delta),
      metric_id: id,
      metric_value: value,
      metric_rating: rating,
      non_interaction: true
    });
  });
}
