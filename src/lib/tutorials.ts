/*
  Server-only tutorial date helpers. Read git history at build time (during static
  generation) for the tutorials list and OG metadata. The detail page gets its
  dates via the remark-content-metadata plugin instead; this covers the server
  contexts (list page, generateMetadata) that aren't part of MDX compilation.

  Git helpers are shared with the MDX plugins via lib/git-dates.mjs.
*/
import {
  createDatedLookup,
  createContentFilePath,
  createSortedContentLookup,
  type ContentDates,
  type DatedContent
} from "@/lib/content-dates";
import { tutorials, type Tutorial } from "@/data/tutorials";

// ISO date strings sourced from git history; null when the file has never been committed.
export type TutorialDates = ContentDates;

/*
  Returns the git-derived publish and last-modified dates for a tutorial slug,
  reading from cache on subsequent calls to avoid redundant git invocations.
*/
export const getTutorialDates = createDatedLookup(createContentFilePath("tutorial"));

/*
  Tutorial registry entry merged with its git-derived dates — used by the list page
  and any consumer that needs both content metadata and publication timestamps.
*/
export type DatedTutorial = DatedContent<Tutorial>;

// Returns all tutorials newest-first by git publish date — see createSortedContentLookup for the ordering rules.
export const getSortedTutorials = createSortedContentLookup(tutorials, getTutorialDates);
