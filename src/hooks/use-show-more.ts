import { useEffect, useRef, useState } from "react";

/*
  Delay before revealing the next batch. Content fed through this hook is a static,
  already-available array (no CMS/DB round trip) — this just keeps the trigger's
  loading state perceptible instead of an instant swap.
*/
const REVEAL_DELAY = 350;

// Options for useShowMore.
interface UseShowMoreOptions {
  // Items shown before any "show more" trigger.
  initialCount: number;
  // Additional items revealed per trigger.
  loadCount: number;
}

// Return shape of useShowMore.
interface UseShowMoreResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  isLoading: boolean;
  showMore: () => void;
}

/*
  Batches a static array behind a "show more" trigger: initialCount items up front,
  loadCount more revealed (after a short perceptible delay) each call to showMore().
  Content-agnostic — reused across posts, series, and any future paginated feed.
*/
export function useShowMore<T>(
  items: T[],
  { initialCount, loadCount }: UseShowMoreOptions
): UseShowMoreResult<T> {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clears any pending reveal if the consuming component unmounts mid-delay.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function showMore() {
    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      setVisibleCount(count => count + loadCount);
      setIsLoading(false);
    }, REVEAL_DELAY);
  }

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    isLoading,
    showMore
  };
}
