import type { ArchiveItemType } from "@/types/archives";

// One post, snippet, or series, normalized enough to share a single timeline row.
export interface ArchiveItem {
  id: string;
  type: ArchiveItemType;
  title: string;
  slug: string;
  pathname: string;
  publishedAt: string | null;
}

// Archive items published in a single calendar year, newest-first.
export interface ArchiveItemsByYear {
  year: string;
  items: ArchiveItem[];
}
