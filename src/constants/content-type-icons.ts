import { CodeBlockIcon, BulbIcon } from "@/components/Icon";
import type { TaxonomyEntryType } from "@/utils/taxonomy-entries";

// One icon per content type so archives, category, and tag lists mark a format identically.
export const CONTENT_TYPE_ICONS: Record<TaxonomyEntryType, typeof CodeBlockIcon> = {
  snippet: CodeBlockIcon,
  tutorial: BulbIcon
};
