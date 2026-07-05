"use client";

import type { JSX } from "react";
import { Icon } from "@/components/Icon";
import type { AsideVariantProps } from "@/components/Aside/Aside.types";
import Aside from "@/components/Aside/Aside";
import { SuccessWrapper } from "@/components/Aside/AsideSuccess/AsideSuccess.styles";

// For tips and positive outcomes worth calling out.
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
