"use client";

import type { JSX} from "react";
import { type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

// Client boundary so click tracking is enabled once for the whole tree without making the layout a client component.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  return <>{children}</>;
}

AnalyticsProvider.displayName = "AnalyticsProvider";
