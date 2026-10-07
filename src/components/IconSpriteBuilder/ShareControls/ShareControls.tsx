"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { encodeShareableState, toShareableState, MAX_SHARE_URL_LENGTH } from "@/components/IconSpriteBuilder/IconSpriteBuilder.helpers";
import { AlbumLeaf, PanelTitle, HintText } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import type { ShareControlsProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

/*
  Computes the permalink fresh on every render rather than syncing it into the URL bar, which
  would spam browser history. Starter icons travel as short references, but a large album of
  custom artwork can outgrow what a URL reliably carries — past that limit the link is withheld
  and the sprite download (plus the local autosave) is offered instead.
*/
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;
  const tooLong = url.length > MAX_SHARE_URL_LENGTH;

  return (
    <>
      <AlbumLeaf>
        <PanelTitle data-plate="Pl. IV">Share this album</PanelTitle>
        {tooLong ? (
          <HintText role="status">
            This album is too large for a reliable link ({Math.round(url.length / 1000)}k characters, limit {MAX_SHARE_URL_LENGTH / 1000}k). Download the sprite from the
            cover instead — it re-imports cleanly — and your album stays autosaved in this browser.
          </HintText>
        ) : (
          <>
            <HintText>Copy a link to these exact icons, ids and options.</HintText>
            <CopyLink url={url} />
          </>
        )}
      </AlbumLeaf>
    </>
  );
}

ShareControls.displayName = "ShareControls";
