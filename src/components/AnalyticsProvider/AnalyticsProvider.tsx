"use client";

import type { JSX} from "react";
import { Suspense, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { useEngagement } from "@/hooks/use-engagement";
import { useMixpanel } from "@/hooks/use-mixpanel";
import { usePageViews } from "@/hooks/use-page-views";
import { useReaderSignals } from "@/hooks/use-reader-signals";
import { useWebVitals } from "@/hooks/use-web-vitals";

// Own component because usePageViews reads search params, which needs a Suspense boundary of its own on static pages.
function PageViews(): null {
  usePageViews();
  return null;
}

PageViews.displayName = "PageViews";

// Client boundary so click, page-view and Web Vitals tracking are enabled once for the whole tree without making the
// layout a client component. The token comes from the layout, which alone knows whether this is production.
export default function AnalyticsProvider({ children, mixpanelToken }: { children: ReactNode; mixpanelToken: string | null }): JSX.Element {
  useMixpanel(mixpanelToken);
  useAnalytics();
  useWebVitals();
  useEngagement();
  useReaderSignals();
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
