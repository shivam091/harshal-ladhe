// A page-view counter as persisted in the database — one document per page slug.
export type PageView = {
  // The page path (e.g. "/contact"). Also used as the document `_id`.
  slug: string;
  // Total number of recorded visits to this page (every hit, including repeats).
  visitorCount: number;
  // Approximate distinct visitors, deduped per day via a hashed IP signal.
  uniqueVisitorCount: number;
  // Number of hits attributed to bots/crawlers (counted aside, not in visitorCount).
  botCount: number;
  // Traffic sources: referrer host → hit count, e.g. { "google.com": 30 }.
  referrers: Record<string, number>;
  // Geo breakdown: ISO country code → hit count, e.g. { "IN": 40 }.
  countries: Record<string, number>;
  // Device split derived from the User-Agent.
  devices: { tablet: number; mobile: number; desktop: number; tv: number; unknown: number };
  // Per-day trend: "YYYY-MM-DD" → hit count. Pruned periodically to bound size.
  viewsByDay: Record<string, number>;
  // When this slug was first recorded.
  createdAt: Date;
  // When this slug was last visited.
  updatedAt: Date;
};
