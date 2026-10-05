"use client";

import { useState } from "react";
import type { JSX } from "react";
import { ImageFrame, ImagePlaceholder } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import type { PreviewImageProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Remembers which src failed rather than a boolean, so typing a new URL automatically clears the failed state without an effect to reset it.
export default function PreviewImage({ src, alt, aspect, children }: PreviewImageProps): JSX.Element {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src.length > 0 && failedSrc !== src;

  return (
    <>
      <ImageFrame data-aspect={aspect}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URLs and blob: uploads can't go through next/image's configured loader or remote-host allowlist.
          <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
        ) : (
          <ImagePlaceholder>{src.length > 0 ? "Image failed to load" : "No image"}</ImagePlaceholder>
        )}
        {children}
      </ImageFrame>
    </>
  );
}

PreviewImage.displayName = "PreviewImage";
