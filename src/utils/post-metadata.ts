import { getPostBySlug } from "@/data/posts";
import { getPostDates } from "@/lib/posts";
import { createContentMetadataBuilder } from "@/utils/content-metadata";
import { getPostUrl } from "@/utils/post-url";

// Canonical URL follows the /post/<category>/<slug> route so share links match where the page actually lives.
export const buildPostMetadata = createContentMetadataBuilder(getPostUrl, getPostBySlug, getPostDates);
