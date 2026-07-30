"use client";

import type { JSX} from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSound } from "@/hooks/use-sound";
import LikeHeart, { BUTTON_SIZE_PX, LIKE_SPARKLE_COLORS } from "@/components/LikeHeart";
import Sparkles from "@/components/Sparkles";
import { fetchLikeStatus, createLikeClickHandler } from "@/components/LikeButton/LikeButton.helpers";
import type { LikeButtonProps as Props } from "@/components/LikeButton/LikeButton.types";

/*
  Real "like" heart rendered at the bottom of the Table of Contents, or —
  with `floating` — as a standalone fixed pill on pages with no TOC. Shows the
  post's total like count (fetched from MongoDB via /api/likes, keyed by
  pathname — the same slug convention HitCounter/PageViewTracker use for view
  counts). One like per visitor (deduped server-side by IP hash, since there's
  no login system) — clicking POSTs the like, and only once that succeeds does
  it fill in, sparkle, and persist the liked state locally. All the actual
  interaction (cursor tracking, bounce, particles, message) lives in the
  shared LikeHeart component this renders — this container only owns the
  real data: fetching, persisting, and what a click actually does. See
  LikeButtonDemo for the showcase variant that reuses the same LikeHeart
  with purely local state.
*/
export default function LikeButton({ floating = false }: Props): JSX.Element | null {
  const pathname = usePathname();

  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);

  /*
    Fill glug + a satisfying pop, played together — a real like always reaches "full" in one click,
    so the glug plays at a fixed near-top pitch (matching the top of LikeButtonDemo's rising-pitch
    range) rather than one scaled up from a running count.
  */
  const [playGlug] = useSound("/sounds/glug-b.mp3", { volume: 0.25, playbackRate: 1.9 });
  const [playPop] = useSound("/sounds/pop.mp3", { volume: 0.5 });

  // Loads the current like count and already-liked status once the pathname is known.
  useEffect(() => {
    fetchLikeStatus(pathname)
      .then(({ likes, alreadyLiked }) => {
        setLikes(likes);
        setHasLiked(alreadyLiked);
        if (alreadyLiked) window.localStorage.setItem(`liked:${pathname}`, "true");
      })
      .catch(() => {
        setLikes(0);
      });
  }, [pathname]);

  const rawHandleLikeClick = createLikeClickHandler(pathname, setLikes, setHasLiked);

  /*
    Click handler LikeHeart calls: POSTs the like, persists it locally, and celebrates with sound
    once it actually lands (not on a duplicate "already liked" response or a failed request).
  */
  const handleLikeClick = async () => {
    const result = await rawHandleLikeClick();
    if (result.celebrate) {
      playGlug();
      playPop();
    }
    return result;
  };

  return (
    <>
      <LikeHeart
        floating={floating}
        likes={likes}
        hasLiked={hasLiked}
        fillFraction={hasLiked ? 1 : 0}
        ariaLabel={hasLiked ? "Liked this post" : "Like this post"}
        alreadyLikedMessage="You already liked this! 💛"
        onLikeClick={handleLikeClick}
      >
        {/*
          Once liked (freshly, or already-liked on a return visit), a permanent
          sparkle overlay kicks in — the same treatment LikeButtonDemo shows on
          reaching its click cap. LikeHeart renders this as an independent
          sibling positioned over the button, not wrapped around it, so
          mounting it here never forces the button itself to remount.
        */}
        {hasLiked && (
          <Sparkles
            isToggleable={false}
            colors={LIKE_SPARKLE_COLORS}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <span style={{ display: "inline-block", inlineSize: BUTTON_SIZE_PX, blockSize: BUTTON_SIZE_PX }} />
          </Sparkles>
        )}
      </LikeHeart>
    </>
  );
}

LikeButton.displayName = "LikeButton";
