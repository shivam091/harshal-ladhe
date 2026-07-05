"use client";

import type { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/components/Aside/Aside.types";
import Aside from "@/components/Aside/Aside";
import { WarningWrapper } from "@/components/Aside/AsideWarning/AsideWarning.styles";

// For pitfalls the reader shouldn't miss; the angular cap matches the triangle icon.
export default function AsideWarning({ title, children }: AsideVariantProps): JSX.Element {
  return (
    <>
      <Aside
        wrapper={WarningWrapper}
        icon={<Icon name="exclamationTriangle" size={32} />}
        leftEdgeVariant="triangular"
        title={title}
      >
        {children}
      </Aside>
    </>
  );
}

AsideWarning.displayName = "AsideWarning";
