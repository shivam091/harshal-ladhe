"use client";

import { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/interfaces/aside";
import Aside from "@/components/Aside/Aside";
import { WarningWrapper } from "@/components/Aside/AsideWarning/AsideWarning.styles";

// Amber warning aside — exclamation-triangle icon, triangular accent-edge cap to match.
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
