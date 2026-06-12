"use client";

import type { JSX} from "react";
import { type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { usePageViews } from "@/hooks/use-page-views";

// Client boundary so click and page-view tracking are enabled once for the whole tree without making the layout a client
// component.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  usePageViews();
  return <>{children}</>;
}

AnalyticsProvider.displayName = "AnalyticsProvider";
