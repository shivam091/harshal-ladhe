"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

// Only the Core Web Vitals and their two diagnostics; Next's own custom metrics would only add noise to GA.
const METRICS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

/*
  CLS and INP report again each time the tab is hidden after they grew, and GA counts every report as a sample, which
  inflated the counts, split one page load across ratings and dragged the mean down. Only a metric's first report is
  sent, so each page load is one sample; for CLS and INP that's the value when the tab is first hidden, which for most
  visits is the end of it.
*/
const reported = new Set<string>();

// CLS is scaled up because GA rounds event values to integers and CLS lives below 1.
export function useWebVitals(): void {
  useReportWebVitals(({ name, value, id, rating }) => {
    if (!METRICS.has(name) || reported.has(id)) return;
    reported.add(id);

    trackEvent(name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_rating: rating,
      non_interaction: true
    });
  });
}
