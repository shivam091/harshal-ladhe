"use client";

import type { JSX} from "react";
import { type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

// Mounts useAnalytics once at the tree root so click-based GA4 tracking is active for all descendants.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  return <>{children}</>;
}

AnalyticsProvider.displayName = "AnalyticsProvider";
