"use client";

import type { JSX} from "react";
import { useState } from "react";
import { useSound } from "@/hooks/use-sound";
import LikeHeart, { BUTTON_SIZE_PX, LIKE_SPARKLE_COLORS } from "@/components/LikeHeart";
import Sparkles from "@/components/Sparkles";
import {
  MAX_CLICKS,
  INITIAL_LIKES,
  MAXED_MESSAGE,
  createDemoLikeClickHandler
} from "@/components/LikeButtonDemo/LikeButtonDemo.helpers";

/*
  Shows the like interaction inline in prose without touching any real count — local state that
  resets on reload. Repeat clicks build up to a milestone instead of the real button's single
  click, and all demo config lives here so the heart stays presentation-only.
*/
export default function LikeButtonDemo(): JSX.Element | null {
  const [likes, setLikes] = useState(INITIAL_LIKES);
  /*
    Click tally (0..MAX_CLICKS). Each click fills the heart a little further
    instead of jumping straight to full, so repeat clicking reads as "building
    up" rather than an instant on/off — reaching the cap is the payoff moment,
    where `hasLiked` flips true and the Sparkles overlay kicks in.
  */
  const [demoClicks, setDemoClicks] = useState(0);
  const hasLiked = demoClicks >= MAX_CLICKS;

  // Rising-pitch glug per click, plus a pop on the click that reaches MAX_CLICKS.
  const [playGlug] = useSound("/sounds/glug-b.mp3", { volume: 0.25 });
  const [playPop] = useSound("/sounds/pop.mp3", { volume: 0.5 });

  // Each click builds toward the cap rather than toggling, unlike the real button's single like.
  const handleLikeClick = createDemoLikeClickHandler(demoClicks, setDemoClicks, setLikes, playGlug, playPop);

  return (
    <>
      <LikeHeart
        standalone
        likes={likes}
        hasLiked={hasLiked}
        fillFraction={Math.min(demoClicks, MAX_CLICKS) / MAX_CLICKS}
        ariaLabel={
          hasLiked
            ? `Maxed out this demo heart at ${MAX_CLICKS}/${MAX_CLICKS} — for show only, doesn't count toward anything real`
            : `Like this demo heart (${demoClicks}/${MAX_CLICKS} so far) — for show only, doesn't count toward anything real`
        }
        alreadyLikedMessage={MAXED_MESSAGE}
        onLikeClick={handleLikeClick}
      >
        {/*
          Once maxed out, a permanent sparkle overlay kicks in, rendered as a sibling over the button so
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

LikeButtonDemo.displayName = "LikeButtonDemo";
