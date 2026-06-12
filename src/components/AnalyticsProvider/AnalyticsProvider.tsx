"use client";

import type { JSX} from "react";
import { type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { usePageViews } from "@/hooks/use-page-views";
import { useWebVitals } from "@/hooks/use-web-vitals";

// Client boundary so click, page-view and Web Vitals tracking are enabled once for the whole tree without making the
// layout a client component.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  usePageViews();
  useWebVitals();
  return <>{children}</>;
}

AnalyticsProvider.displayName = "AnalyticsProvider";
