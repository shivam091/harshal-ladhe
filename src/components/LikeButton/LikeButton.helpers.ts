import type { Dispatch, SetStateAction } from "react";
import type { LikeClickResult } from "@/components/LikeHeart";

// Lets the heart re-open filled on return visits without waiting on the server.
function readHasLiked(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`liked:${slug}`) === "true";
}

/*
  Liked if either signal says so: localStorage is fast but lost on a cleared browser or new device,
  while the server's IP record survives both.
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
