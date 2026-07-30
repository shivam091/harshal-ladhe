"use client";

import type { JSX} from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSound } from "@/hooks/use-sound";
import LikeHeart, { BUTTON_SIZE_PX, LIKE_SPARKLE_COLORS } from "@/components/LikeHeart";
import Sparkles from "@/components/Sparkles";
import { fetchLikeStatus, createLikeClickHandler } from "@/components/LikeButton/LikeButton.helpers";
import { trackEvent } from "@/lib/analytics";
import type { LikeButtonProps as Props } from "@/components/LikeButton/LikeButton.types";

/*
  One like per visitor, deduped server-side by IP hash since there's no login; the heart only
  fills in and persists once the like lands. This container owns the real data and leaves all
  interaction to the shared heart.
*/
export default function LikeButton({ floating = false }: Props): JSX.Element | null {
  const pathname = usePathname();

  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);

  /*
    A real like always fills in one click, so the glug plays at a fixed near-top pitch rather than
    one scaled from a running count.
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

  // Celebrates only once a like actually lands, not on a duplicate or a failed request.
  const handleLikeClick = async () => {
    const result = await rawHandleLikeClick();
    if (result.celebrate) {
      trackEvent("like", { event_label: pathname, method: floating ? "floating" : "inline" });
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
          Once liked, a permanent sparkle overlay kicks in, rendered as a sibling over the button so
          mounting it never remounts the button.
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
