"use client";

import { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/interfaces/aside";
import Aside from "@/components/Aside/Aside";
import { SuccessWrapper } from "@/components/Aside/AsideSuccess/AsideSuccess.styles";

// Green success/tip aside — check-circle icon, circular accent-edge cap.
export default function AsideSuccess({ title, children }: AsideVariantProps): JSX.Element {
  return (
    <>
      <Aside
        wrapper={SuccessWrapper}
        icon={<Icon name="checkCircle" size={32} />}
        leftEdgeVariant="circular"
        title={title}
      >
        {children}
      </Aside>
    </>
  );
}

AsideSuccess.displayName = "AsideSuccess";
