"use client";

import { useEffect, useState } from "react";
import type { ImageMeasurement } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// A finished measurement tagged with the src it belongs to, so a stale result for a previous URL is never mistaken for the current one.
interface MeasuredResult {
  src: string;
  measurement: ImageMeasurement;
}

// How long to wait after the last keystroke before trying to load a typed URL — loading every intermediate half-URL would spray failed requests.
const LOAD_DEBOUNCE_MS = 350;

/*
  Loads `src` into an off-screen Image() and reports its natural pixel size — the only way to learn
  real dimensions on a static site with no server to inspect the file. Only the async onload/onerror
  callbacks set state; "loading" is derived by comparing the stored result's src with the current
  one, which avoids a synchronous setState inside the effect and keeps the result tied to its URL.
*/
export function useOpenGraphImage(src: string): ImageMeasurement {
  const [result, setResult] = useState<MeasuredResult | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const image = new Image();

    const timer = setTimeout(() => {
      image.onload = () => {
        if (!cancelled) setResult({ src, measurement: { status: "loaded", width: image.naturalWidth, height: image.naturalHeight } });
      };
      image.onerror = () => {
        if (!cancelled) setResult({ src, measurement: { status: "error" } });
      };
      image.src = src;
    }, src.startsWith("blob:") ? 0 : LOAD_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  if (!src) return { status: "none" };
  if (!result || result.src !== src) return { status: "loading" };
  return result.measurement;
}
