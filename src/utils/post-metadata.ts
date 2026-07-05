import { getPostBySlug } from "@/data/posts";
import { getPostDates } from "@/lib/posts";
import { createContentMetadataBuilder } from "@/utils/content-metadata";
import { getPostUrl } from "@/utils/post-url";

// Builds Next.js metadata for a post page from its registry entry (see createContentMetadataBuilder/buildContentMetadata).
export const buildPostMetadata = createContentMetadataBuilder(getPostUrl, getPostBySlug, getPostDates);
