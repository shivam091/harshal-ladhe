import { FileIcon, CodeBlockIcon, BulbIcon } from "@/components/Icon";
import type { TaxonomyEntryType } from "@/utils/taxonomy-entries";

// One icon per content type so archives, category, and tag lists mark a format identically.
export const CONTENT_TYPE_ICONS: Record<TaxonomyEntryType, typeof FileIcon> = {
  post: FileIcon,
  snippet: CodeBlockIcon,
  tutorial: BulbIcon
};
