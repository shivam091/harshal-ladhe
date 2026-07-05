"use client";

import { JSX } from "react";
import type { AsideVariantProps } from "@/interfaces/aside";
import Aside from "@/components/Aside/Aside";
import { QuoteWrapper, QuoteChar } from "@/components/Aside/AsideQuote/AsideQuote.styles";

// Italicised blockquote-style aside — a large decorative “ replaces the corner icon.
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
