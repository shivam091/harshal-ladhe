"use client";

import { useState } from "react";
import type { JSX } from "react";
import { Favicon } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import type { SiteFaviconProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Same failed-src trick as PreviewImage — a broken favicon falls back to the neutral square instead of the browser's broken-image icon.
export default function SiteFavicon({ src }: SiteFaviconProps): JSX.Element {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <>
      <Favicon aria-hidden="true">
        {src && failedSrc !== src && (
          // eslint-disable-next-line @next/next/no-img-element -- the favicon is an arbitrary user-supplied URL, outside next/image's remote-host allowlist.
          <img src={src} alt="" onError={() => setFailedSrc(src)} />
        )}
      </Favicon>
    </>
  );
}

SiteFavicon.displayName = "SiteFavicon";
