import { getTutorialBySlug } from "@/data/tutorials";
import { getTutorialDates } from "@/lib/tutorials";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Canonical URL mirrors the /tutorial/<slug> route so share links match where the page actually lives.
export const buildTutorialMetadata = createContentMetadataBuilder(
  (tutorial) => `/tutorial/${tutorial.slug}`,
  getTutorialBySlug,
  getTutorialDates
);
