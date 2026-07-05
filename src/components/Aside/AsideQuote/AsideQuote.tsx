"use client";

import type { JSX } from "react";
import type { AsideVariantProps } from "@/components/Aside/Aside.types";
import Aside from "@/components/Aside/Aside";
import { QuoteWrapper, QuoteChar } from "@/components/Aside/AsideQuote/AsideQuote.styles";

// For quoted material, set apart so it never reads as the author's own voice.
export default function AsideQuote({ title, children }: AsideVariantProps): JSX.Element {
  return (
    <>
      <Aside
        wrapper={QuoteWrapper}
        icon={<QuoteChar aria-hidden>“</QuoteChar>}
        leftEdgeVariant="circular"
        title={title}
      >
        {children}
      </Aside>
    </>
  );
}

AsideQuote.displayName = "AsideQuote";
