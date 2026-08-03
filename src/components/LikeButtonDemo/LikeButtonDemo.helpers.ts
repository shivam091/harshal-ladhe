import type { Dispatch, SetStateAction } from "react";
import type { LikeClickResult } from "@/components/LikeHeart";
import type { PlayOptions } from "@/interfaces/icons/speaker";

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
  Playback speed for the per-click glug, scaled by how close `count` is to MAX_CLICKS — climbs from
  0.9 (lowest-pitched, on the first click) to 1.9 (highest-pitched, on the maxing click), so building
  up the heart reads as rising in pitch rather than the same note repeating.
*/
function getGlugPlaybackRate(count: number): number {
  return (count - 1) / (MAX_CLICKS - 1) + 0.9;
}

/*
  Builds the click handler LikeHeart calls on every click: every click celebrates (fills a bit more,
  bumps the count, bursts confetti, and plays a rising-pitch glug) until the cap is reached, where a
  satisfying pop plays alongside the final glug.
*/
export function createDemoLikeClickHandler(
  demoClicks: number,
  setDemoClicks: Dispatch<SetStateAction<number>>,
  setLikes: Dispatch<SetStateAction<number>>,
  playGlug: (options?: PlayOptions) => void,
  playPop: () => void
): () => LikeClickResult {
  return () => {
    const next = demoClicks + 1;
    setDemoClicks(next);
    setLikes((prev) => prev + 1);

    playGlug({ playbackRate: getGlugPlaybackRate(next) });
    if (next >= MAX_CLICKS) playPop();

    return {
      message: next >= MAX_CLICKS ? MILESTONE_MESSAGE : progressMessage(next),
      celebrate: true
    };
  };
}
