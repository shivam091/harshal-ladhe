import type { Dispatch, SetStateAction } from "react";
import type { LikeClickResult } from "@/components/LikeHeart";

/*
  Reads whether this browser has already liked the given slug, so the heart re-opens filled on
  return visits.
*/
function readHasLiked(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`liked:${slug}`) === "true";
}

/*
  Fetches the current count and this browser/IP's prior-liked state for
  `pathname`. "Liked" is the OR of two signals: localStorage (fast, but lost
  if storage is cleared or on a new device) and the server's IP-based record
  (survives both) — either one being true means liked.
*/
export async function fetchLikeStatus(pathname: string): Promise<{ likes: number; alreadyLiked: boolean }> {
  const r = await fetch(`/api/likes?slug=${encodeURIComponent(pathname)}`);
  const d = await r.json();

  return ({
    likes: d.likes ?? 0,
    alreadyLiked: Boolean(d.alreadyLiked) || readHasLiked(pathname)
  });
}

// Only fills in and persists once the server confirms, so a failed request never looks like a like.
export function createLikeClickHandler(
  pathname: string,
  setLikes: Dispatch<SetStateAction<number | null>>,
  setHasLiked: Dispatch<SetStateAction<boolean>>
): () => Promise<LikeClickResult> {
  return () =>
    fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: pathname })
    })
      .then((r) => r.json())
      .then((d: { likes?: number; alreadyLiked?: boolean }) => {
        setLikes((prev) => (typeof d.likes === "number" ? d.likes : (prev ?? 0) + 1));
        setHasLiked(true);
        window.localStorage.setItem(`liked:${pathname}`, "true");

        return d.alreadyLiked
          ? { message: "You already liked this! 💛", celebrate: false }
          : { message: "Thanks for the love! ❤️", celebrate: true };
      })
      .catch(
        (): LikeClickResult => ({
          // No API confirmation — nothing to celebrate; leave the heart as-is so the user can retry.
          message: "",
          celebrate: false
        })
      );
}
