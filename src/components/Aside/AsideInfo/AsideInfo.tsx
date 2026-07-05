"use client";

import type { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/components/Aside/Aside.types";
import Aside from "@/components/Aside/Aside";
import { InfoWrapper } from "@/components/Aside/AsideInfo/AsideInfo.styles";

// For neutral side notes that add context without urgency.
export default function AsideInfo({ title, children }: AsideVariantProps): JSX.Element {
  return (
    <>
      <Aside
        wrapper={InfoWrapper}
        icon={<Icon name="infoCircle" size={32} />}
        leftEdgeVariant="circular"
        title={title}
      >
        {children}
      </Aside>
    </>
  );
}

AsideInfo.displayName = "AsideInfo";
