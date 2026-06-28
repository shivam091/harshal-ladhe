"use client";

import { usePathname } from "next/navigation";
import type { JSX } from "react";
import { pageNames } from "@/config/page-names";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";

/*
  Content-detail path segments whose pages render their own <h1> inside the
  [slug] layout — returning null here prevents a duplicate heading.
*/
const SELF_TITLED_SEGMENTS: string[] = ["/snippet/"];

/*
  Derived from the pathname so every page gets a heading without declaring one; self-titled
  detail pages are skipped so they never end up with a duplicate <h1>.
*/
export default function PageHeading(): JSX.Element | null {
  const pathname = usePathname();

  if (SELF_TITLED_SEGMENTS.some((seg) => pathname.includes(seg))) return null;

  const title = pageNames[pathname] || pathname.split("/").pop()?.replace(/-/g, " ") || "Page";

  return (
    <>
      <PageTitle id="page-title">
        {title}
      </PageTitle>
    </>
  );
}

PageHeading.displayName = "PageHeading";
