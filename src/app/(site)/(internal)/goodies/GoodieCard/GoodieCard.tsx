"use client";

import type { JSX } from "react";
import { useState } from "react";
import Link from "next/link";
import type { Goodie as GoodieData } from "@/data/goodies";
import {
  Goodie,
  GoodieIcon,
  GoodieDetails,
  GoodieName,
  GoodieDescription
} from "@/app/(site)/(internal)/goodies/goodies.styles";

// Held for as long as the card is hovered or focused, so the icon stays "on" instead of flicking back.
export default function GoodieCard({ goodie }: { goodie: GoodieData }): JSX.Element {
  const [isActive, setIsActive] = useState(false);
  const activate = () => setIsActive(true);
  const deactivate = () => setIsActive(false);

  return (
    <>
      <Goodie>
        <Link
          href={goodie.href}
          title={goodie.name}
          onPointerEnter={activate}
          onPointerLeave={deactivate}
          onFocus={activate}
          onBlur={deactivate}
        >
          <GoodieIcon>
            <goodie.iconComponent isBooped={isActive} />
          </GoodieIcon>

          <GoodieDetails>
            <GoodieName>{goodie.name}</GoodieName>
            <GoodieDescription>{goodie.description}</GoodieDescription>
          </GoodieDetails>
        </Link>
      </Goodie>
    </>
  );
}

GoodieCard.displayName = "GoodieCard";
