"use client";

import { JSX } from "react";
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

// Home-page hero — time-based greeting, author name, tagline, and a typed role list.
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
