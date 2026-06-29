import { getTutorialBySlug } from "@/data/tutorials";
import { getTutorialDates } from "@/lib/tutorials";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Builds Next.js metadata for a tutorial page from its registry entry (see createContentMetadataBuilder/buildContentMetadata).
export const buildTutorialMetadata = createContentMetadataBuilder(
  (tutorial) => `/tutorial/${tutorial.slug}`,
  getTutorialBySlug,
  getTutorialDates
);
