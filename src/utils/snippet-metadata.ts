import { getSnippetBySlug } from "@/data/snippets";
import { getSnippetDates } from "@/lib/snippets";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Builds Next.js metadata for a snippet page from its registry entry (see createContentMetadataBuilder/buildContentMetadata).
export const buildSnippetMetadata = createContentMetadataBuilder("snippet", getSnippetBySlug, getSnippetDates);
