"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import { GA_LINK_CLASS } from "@/lib/ga-link";
import {
  Card,
  CardHeader,
  LogoWrapper,
  CardName,
  CardVersion,
  CardDescription
} from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStackCard/CoreStackCard.styles";
import type { StackItem } from "@/data/stack";

// Owns the boop so hovering anywhere on the card, not just the logo, animates it.
export default function CoreStackCard({ item }: { item: StackItem }): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <Card
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={GA_LINK_CLASS.coreStack}
        onPointerEnter={triggerBoop}
      >
        <CardHeader>
          <LogoWrapper>
            <item.logoComponent size={32} isBooped={isBooped} />
          </LogoWrapper>
          <CardName>{item.name}</CardName>
          {item.version && <CardVersion>v{item.version}</CardVersion>}
        </CardHeader>
        <CardDescription>{item.description}</CardDescription>
      </Card>
    </>
  );
}

CoreStackCard.displayName = "CoreStackCard";
