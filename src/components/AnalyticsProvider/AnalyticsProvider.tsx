"use client";

import type { JSX} from "react";
import { Suspense, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { usePageViews } from "@/hooks/use-page-views";
import { useWebVitals } from "@/hooks/use-web-vitals";

// Own component because usePageViews reads search params, which needs a Suspense boundary of its own on static pages.
function PageViews(): null {
  usePageViews();
  return null;
}

PageViews.displayName = "PageViews";

// Client boundary so click, page-view and Web Vitals tracking are enabled once for the whole tree without making the
// layout a client component.
export default function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  useAnalytics();
  useWebVitals();
  return (
    <>
      {/* Isolated so the search-params read never suspends, or client-renders, the page itself. */}
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
      {children}
    </>
  );
}

AnalyticsProvider.displayName = "AnalyticsProvider";
