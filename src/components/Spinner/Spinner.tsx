"use client";

import type { JSX, CSSProperties } from "react";
import { LoaderIcon } from "@/components/Icon";
import { normalize } from "@/utils/number";
import type { SpinnerProps } from "@/components/Spinner/Spinner.types";
import { Wrapper } from "@/components/Spinner/Spinner.styles";

// Signals pending work with the site's own loader icon so waiting states match the rest of the iconography.
export default function Spinner({ size = 24, color, speed = 5, style = {}, ...delegated }: SpinnerProps): JSX.Element {
  const duration = normalize(speed, 1, 10, 2400, 200);

  return (
    <>
      <Wrapper
        style={{
          width: size,
          height: size,
          "--duration": `${duration}ms`,
          "--size": `${size}px`,
          color,
          ...style
        } as CSSProperties}
        {...delegated}
      >
        <LoaderIcon size={size} />
      </Wrapper>
    </>
  );
}

Spinner.displayName = "Spinner";
