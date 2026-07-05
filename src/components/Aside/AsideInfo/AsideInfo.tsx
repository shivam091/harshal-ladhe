"use client";

import { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/interfaces/aside";
import Aside from "@/components/Aside/Aside";
import { InfoWrapper } from "@/components/Aside/AsideInfo/AsideInfo.styles";

// Blue/accent informational aside — info-circle icon, circular accent-edge cap.
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
