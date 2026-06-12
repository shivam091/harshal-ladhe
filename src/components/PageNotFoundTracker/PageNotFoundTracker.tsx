"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// The 404 page is static and shared by every missing URL, so only the browser knows which path was asked for.
export default function PageNotFoundTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_not_found", { event_label: pathname });
  }, [pathname]);

  return null;
}

PageNotFoundTracker.displayName = "PageNotFoundTracker";
