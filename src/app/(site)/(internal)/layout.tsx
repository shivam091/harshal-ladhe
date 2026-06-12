import type { JSX } from "react";
import PageHeading from "@/components/PageHeading";
import { Main, PageContent } from "@/app/(site)/route-shell.styles";

// Non-home routes share one PageHeading so titles stay consistent without each page rendering its own.
export default function InternalLayout({ children }: { children: React.ReactNode }): JSX.Element {
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
