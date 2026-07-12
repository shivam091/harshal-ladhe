"use client";

import type { JSX} from "react";
import { type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

// Wraps the hook in a client component so the server-rendered root layout can enable click tracking once for the whole tree.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  return <>{children}</>;
}

AnalyticsProvider.displayName = "AnalyticsProvider";
