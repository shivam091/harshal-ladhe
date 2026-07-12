import type { JSX } from "react";
import PageHeading from "@/components/PageHeading";
import { Main, PageContent } from "@/app/(site)/route-shell.styles";

// Internal page layout — adds a dynamic PageHeading above the content slot for all non-home routes.
export default function InternalLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <>
      <Main id="main-content" tabIndex={-1}>
        <PageHeading />

        <PageContent aria-labelledby="page-title">
          {children}
        </PageContent>
      </Main>
    </>
  );
}
