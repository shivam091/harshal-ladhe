import type { JSX } from "react";
import Hero from "@/components/Hero";
import { Main, PageHeading } from "@/app/(site)/route-shell.styles";

// Home swaps the internal PageHeading for the Hero so the landing page gets its own introduction.
export default function HomeLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {/* Hero renders inside <Main> — it carries the page's only <h1>, so it must live inside the main landmark to be reachable via the skip link. */}
      <Main id="main-content" tabIndex={-1}>
        <PageHeading aria-label="Introduction">
          <Hero />
        </PageHeading>

        {children}
      </Main>
    </>
  );
}
