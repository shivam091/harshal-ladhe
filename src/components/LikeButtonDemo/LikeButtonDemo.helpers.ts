import type { Dispatch, SetStateAction } from "react";
import type { LikeClickResult } from "@/components/LikeHeart";
import type { PlayOptions } from "@/hooks/use-sound";

// Enough clicks that filling the heart feels like a build-up rather than a single tap.
export const MAX_CLICKS = 16;

// Starting count the demo heart displays, purely cosmetic (no real page's count is ever read).
export const INITIAL_LIKES = 12;

// Shows progress toward the cap so repeat clicks feel like they're building to something.
const progressMessage = (count: number): string => `Liked! (${count}/${MAX_CLICKS}) ❤️`;

// Marks the maxing click as the payoff, distinct from ordinary progress.
const MILESTONE_MESSAGE = "Maxed out — thanks for all the love! 🎉✨";

// Acknowledges clicks past the cap so the heart never seems unresponsive.
export const MAXED_MESSAGE = "You've maxed out this demo! 🎉";

// Climbs from 0.9 to 1.9 across the clicks so building up the heart rises in pitch rather than repeating one note.
function getGlugPlaybackRate(count: number): number {
  return (count - 1) / (MAX_CLICKS - 1) + 0.9;
}

// Every click celebrates with a rising-pitch glug until the cap, so building up the heart feels rewarding.
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
