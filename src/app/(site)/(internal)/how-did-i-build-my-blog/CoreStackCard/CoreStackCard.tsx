"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import {
  Card,
  CardHeader,
  LogoWrapper,
  CardName,
  CardVersion,
  CardDescription
} from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStackCard/CoreStackCard.styles";
import type { StackItem } from "@/data/stack";

// Clickable stack card — owns the boop timer and passes isBooped down to the logo so card hover drives the animation.
export default function CoreStackCard({ item }: { item: StackItem }): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <Card
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event="core_stack_click"
        data-analytics-label={item.name}
        data-analytics-category="engagement"
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
