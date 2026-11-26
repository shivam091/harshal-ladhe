"use client";

import { useEffect, useRef } from "react";

// Long enough that a term is sent once the reader stops typing, not at every keystroke on the way to it.
const SETTLE_MS = 1500;

// Shorter terms are mostly the first letters of a longer one, which says nothing about what readers look for.
const MIN_TERM_LENGTH = 2;

/*
  Tells GA what readers search for: view_search_results when something matched, search_no_results when nothing did,
  both with search_term, so the admin's search terms report can list what readers don't find. Sent once the reader
  pauses, or closes the panel mid-pause, and once per term per opening, so retyping a term doesn't count it twice.
*/
export function useSearchTracking(query: string, hitCount: number): void {
  const sentRef = useRef(new Set<string>());
  // The latest term and its hit count, so the unmount flush sends what was on screen.
  const pendingRef = useRef<{ term: string; hitCount: number } | null>(null);

  useEffect(() => {
    const term = query.trim().toLowerCase();
    pendingRef.current = term.length >= MIN_TERM_LENGTH ? { term, hitCount } : null;
    if (!pendingRef.current) return;

    const timeout = setTimeout(() => send(sentRef.current, pendingRef.current), SETTLE_MS);
    return () => clearTimeout(timeout);
  }, [query, hitCount]);

  // Closing the panel before the pause ends still counts the term the reader settled on.
  useEffect(() => {
    const sent = sentRef.current;
    return () => send(sent, pendingRef.current);
  }, []);
}

// gtag may be blocked or not loaded yet; tracking must never break searching.
function send(sent: Set<string>, pending: { term: string; hitCount: number } | null): void {
  if (!pending || sent.has(pending.term)) return;

  sent.add(pending.term);
  const name = pending.hitCount > 0 ? "view_search_results" : "search_no_results";
  window.gtag?.("event", name, { search_term: pending.term, results_count: String(pending.hitCount) });
}
