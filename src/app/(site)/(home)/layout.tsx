import { JSX } from "react";
import Hero from "@/components/Hero";
import { Main, PageHeading } from "@/app/(site)/route-shell.styles";

// Home-route layout
export default function HomeLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <>
      <PageHeading aria-label="Introduction">
        <Hero />
      </PageHeading>

      <Main id="main-content" tabIndex={-1}>
        {children}
      </Main>
    </>
  );
}
