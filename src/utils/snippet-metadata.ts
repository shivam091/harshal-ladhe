import { getSnippetBySlug } from "@/data/snippets";
import { getSnippetDates } from "@/lib/snippets";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Canonical URL mirrors the /snippet/<slug> route so share links match where the page actually lives.
export const buildSnippetMetadata = createContentMetadataBuilder(
  (snippet) => `/snippet/${snippet.slug}`,
  getSnippetBySlug,
  getSnippetDates
);
