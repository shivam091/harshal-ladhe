"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { FestiveOccasion } from "@/constants/festive-occasions";
import { FESTIVE_OCCASIONS } from "@/constants/festive-occasions";
import { findActiveFestiveOccasions } from "@/utils/festive-occasions";
import { dismissFestiveBanner, pickUndismissedOccasion } from "@/components/FestiveBanner/FestiveBanner.helpers";

// Returned together so the dismiss action always targets the occasion currently on screen.
export interface ActiveFestiveOccasion {
  occasion: FestiveOccasion | null;
  dismiss: () => void;
}

// The `storage` event never fires in the tab that made the change, so in-tab dismissals need their own notification.
const listeners = new Set<() => void>();

// Closing the banner in one tab shouldn't leave it showing in the reader's other open tabs.
function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

// useSyncExternalStore needs a referentially stable snapshot to avoid render loops, which module-constant occasions give.
function getSnapshot(): FestiveOccasion | null {
  const now = new Date();
  return pickUndismissedOccasion(findActiveFestiveOccasions(FESTIVE_OCCASIONS, now), now);
}

// The reader's date and dismissals only exist in the browser, so the server can't know which banner to show.
function getServerSnapshot(): null {
  return null;
}

/*
  Dismissing re-picks rather than just hiding, so on days where festivals overlap the next one still gets its
  greeting instead of the banner going blank.
*/
export function useActiveFestiveOccasion(): ActiveFestiveOccasion {
  const occasion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Stable identity keeps the close button from re-rendering whenever the banner does.
  const dismiss = useCallback(() => {
    if (!occasion) return;
    dismissFestiveBanner(occasion, new Date());
    listeners.forEach((listener) => listener());
  }, [occasion]);

  return { occasion, dismiss };
}
