/*
  Server-only: reads git history, so it can't ship to the client. Exists for the
  contexts outside MDX compilation, where the remark plugin can't supply dates.
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

// Memoised because list pages and metadata ask for the same slug's dates repeatedly.
export const getTutorialDates = createDatedLookup(createContentFilePath("tutorial"));

// Lets list views sort and display by date without a second lookup per entry.
export type DatedTutorial = DatedContent<Tutorial>;

// Newest-first by git publish date so the list leads with what's fresh.
export const getSortedTutorials = createSortedContentLookup(tutorials, getTutorialDates);
