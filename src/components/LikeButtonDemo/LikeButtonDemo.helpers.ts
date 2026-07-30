import type { Dispatch, SetStateAction } from "react";
import type { LikeClickResult } from "@/components/LikeHeart";

// How many clicks it takes to max out the blog-post demo heart.
export const MAX_CLICKS = 16;

// Starting count the demo heart displays, purely cosmetic (no real page's count is ever read).
export const INITIAL_LIKES = 12;

// Message shown on a click that doesn't yet reach MAX_CLICKS.
const progressMessage = (count: number): string => `Liked! (${count}/${MAX_CLICKS}) ❤️`;

// Message shown on the click that reaches MAX_CLICKS.
const MILESTONE_MESSAGE = "Maxed out — thanks for all the love! 🎉✨";

// Message shown on any click after MAX_CLICKS has already been reached.
export const MAXED_MESSAGE = "You've maxed out this demo! 🎉";

/*
  Builds the click handler LikeHeart calls on every click: every click
  celebrates (fills a bit more, bumps the count, bursts confetti) until the
  cap is reached, via the given state setters.
*/
export function createDemoLikeClickHandler(
  demoClicks: number,
  setDemoClicks: Dispatch<SetStateAction<number>>,
  setLikes: Dispatch<SetStateAction<number>>
): () => LikeClickResult {
  return () => {
    const next = demoClicks + 1;
    setDemoClicks(next);
    setLikes((prev) => prev + 1);

    return {
      message: next >= MAX_CLICKS ? MILESTONE_MESSAGE : progressMessage(next),
      celebrate: true,
    };
  };
}
