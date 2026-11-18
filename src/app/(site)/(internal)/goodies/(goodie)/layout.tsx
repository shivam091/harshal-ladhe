"use client";

import type { JSX, ReactNode } from "react";
import { usePathname, notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { goodies } from "@/data/goodies";

/*
  Segment layout shared by every /goodies/<goodie> detail page (the /goodies index itself lives
  outside this route group and is unaffected). Renders the page's own <h1> and a ShareBar around
  each goodie's content, both titled from the matching entry in the goodies registry so a new
  goodie picks up a correctly-capitalized heading and share text for free — no per-page wiring
  needed beyond adding it to that registry. PageHeading's SELF_TITLED_SEGMENTS list excludes
  /goodies/ for this reason, mirroring how post/snippet/series layouts own their own <h1>.
*/
export default function GoodieLayout({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const goodie = goodies.find((g) => g.href === pathname.replace(/\/$/, ""));

  if (!goodie) notFound();

  return (
    <>
      <PageTitle id="page-title">{goodie.name}</PageTitle>
      {children}
      <ShareBar title={goodie.name} contentLabel="goodie" />
    </>
  );
}

GoodieLayout.displayName = "GoodieLayout";
