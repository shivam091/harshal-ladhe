"use client";

import type { JSX } from "react";
import { siteConfig } from "@/config/site";
import { useTimeGreeting } from "@/hooks/use-time-greeting";
import HeroRoleTyped from "@/components/HeroRoleTyped";
import {
  HeroWrap,
  NameLine,
  Tagline,
  RoleLine,
  HeroHeading,
  HeroSection,
  GreetingLine,
  HeroRoleSpan
} from "@/components/Hero/Hero.styles";

// A time-based greeting makes the landing page feel personal rather than static.
export default function Hero(): JSX.Element {
  const timeGreeting = useTimeGreeting();

  return (
    <>
      <HeroSection>
        <HeroWrap>
          <HeroHeading>
            <GreetingLine>
              {timeGreeting}
            </GreetingLine>
            <NameLine>
              I&apos;m {siteConfig.author.name} <span aria-hidden="true">👋</span>
            </NameLine>
          </HeroHeading>

          <Tagline>
            {siteConfig.tagline}
          </Tagline>

          <RoleLine>
            <HeroRoleSpan>
              I&apos;m a <HeroRoleTyped />.
            </HeroRoleSpan>
          </RoleLine>
        </HeroWrap>
      </HeroSection>
    </>
  );
}

Hero.displayName = "Hero";
