import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getClientIp, hashIp } from "@/lib/client-ip";

// A page-view counter as persisted in the database — one document per page slug.
type PageView = {
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

// Device type derived from the User-Agent string.
type DeviceType = "tablet" | "mobile" | "desktop" | "tv" | "unknown";

// MongoDB collection that stores per-page visit counters.
const COLLECTION = "page_views";

/*
  Collection of (slug, day, ipHash) markers used to dedupe unique visitors.
  A unique index on these three fields makes the first insert per visitor-per-day
  succeed and subsequent ones fail — that's our "is this a new unique visit" signal.
*/
const SEEN_COLLECTION = "page_view_seen";

// Only record slugs that look like real app paths — guards against junk payloads.
const SLUG_PATTERN = /^\/[\w\-/]*$/;

// Rough bot/crawler detection from the User-Agent.
const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|preview|monitor|lighthouse|headless/i;

/*
  Ensures the unique index backing visitor dedup exists. Runs at most once per
  warm process (the promise is cached), so steady-state requests pay nothing.
  A TTL index also expires markers after 2 days to keep the collection bounded.
*/
let seenIndexReady: Promise<unknown> | undefined;
function ensureSeenIndexes(db: Awaited<ReturnType<typeof getDb>>): Promise<unknown> {
  if (!seenIndexReady) {
    const coll = db.collection(SEEN_COLLECTION);
    seenIndexReady = Promise.all([
      coll.createIndex({ slug: 1, day: 1, ipHash: 1 }, { unique: true }),
      coll.createIndex({ at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 })
    ]).catch(() => {
      // Reset so a transient failure can be retried on the next request.
      seenIndexReady = undefined;
    });
  }
  return seenIndexReady;
}

// Resolves the referrer host (e.g. "google.com") from the Referer header, or "direct".
function getReferrerHost(req: NextRequest): string {
  const referer = req.headers.get("referer");
  if (!referer) return "direct";
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "");
    // Treat same-origin navigations as internal rather than a referral source.
    const self = req.headers.get("host");
    if (self && host === self.replace(/^www\./, "")) return "internal";
    return host || "direct";
  } catch {
    return "direct";
  }
}

// Country from a CDN/proxy geo header (Vercel/Cloudflare), or "unknown".
function getCountry(req: NextRequest): string {
  return (
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "unknown"
  ).toUpperCase();
}

/*
  Classifies the UA into a device type.
  Tablet is checked before mobile because many tablet UAs also contain "mobile".
*/
function getDevice(ua: string): DeviceType {
  if (!ua) return "unknown";
  if (/smart.?tv|hbbtv|netcast|nettv|appletv|roku|googletv|crkey|firetv|silk|tv safari/i.test(ua)) return "tv";
  if (/ipad|tablet|kindle|playbook|(android(?!.*mobile))|windows.*touch(?!.*phone)/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|windows phone|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux|x11|cros/i.test(ua)) return "desktop";
  return "unknown";
}

/*
  Sanitizes a dynamic map key for safe use in a Mongo dot-path. Dots and dollar
  signs are illegal in field names, so we strip them to avoid update errors.
*/
function safeKey(value: string): string {
  return value.replace(/[.$]/g, "_").slice(0, 64) || "unknown";
}

/*
  Returns true the first time a (slug, day, ipHash) combo is seen. Relies on a
  unique index on the seen collection: a duplicate insert throws code 11000,
  which we read as "already counted today".
*/
async function isNewUniqueVisitor(
  db: Awaited<ReturnType<typeof getDb>>,
  slug: string,
  day: string,
  ipHash: string
): Promise<boolean> {
  try {
    await ensureSeenIndexes(db);
    await db.collection(SEEN_COLLECTION).insertOne({ slug, day, ipHash, at: new Date() });
    return true;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) return false;
    // Any other error: don't double-count, treat as not-new.
    return false;
  }
}

/*
  GET /api/views?slug=<path> — returns the human visitor count for a slug.
  Returns `{ views: 0 }` on any error or missing document so the client always
  gets a valid shape without leaking internals.
*/
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const db = await getDb();
    const doc = await db
      .collection<PageView>(COLLECTION)
      .findOne({ _id: slug } as never, { projection: { visitorCount: 1 } });
    return NextResponse.json({ views: doc?.visitorCount ?? 0 });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

/*
  POST /api/views — silently increments the visit counters for a page slug.

  One document per slug (`_id` = slug). All counters use atomic `$inc`, so
  concurrent visits never lose a count. We always respond 204 so the client
  beacon stays invisible and never surfaces errors to the visitor.
*/
export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as { slug?: string };

    if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
      // Silently ignore bad input — never expose validation to a tracking beacon.
      return new NextResponse(null, { status: 204 });
    }

    const now = new Date();
    /*
     * toISOString() is UTC, which rolls over at 05:30 IST — shifting by +5:30
     * before slicing gives the correct IST calendar date for viewsByDay keys.
     */
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const day = new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
    const ua = req.headers.get("user-agent") ?? "";
    const isBot = BOT_PATTERN.test(ua);
    const db = await getDb();

    // Bots are tallied separately and never pollute the human-facing metrics.
    if (isBot) {
      await db.collection<PageView>(COLLECTION).updateOne(
        { _id: slug } as never,
        {
          $inc: { botCount: 1 },
          $set: { slug, updatedAt: now },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
      return new NextResponse(null, { status: 204 });
    }

    const ip = getClientIp(req);
    const referrer = safeKey(getReferrerHost(req));
    const country = safeKey(getCountry(req));
    const device = getDevice(ua);
    const isNew = await isNewUniqueVisitor(db, slug, day, hashIp(ip));

    const inc: Record<string, number> = {
      visitorCount: 1,
      [`referrers.${referrer}`]: 1,
      [`countries.${country}`]: 1,
      [`devices.${device}`]: 1,
      [`viewsByDay.${day}`]: 1
    };
    if (isNew) inc.uniqueVisitorCount = 1;

    await db.collection<PageView>(COLLECTION).updateOne(
      { _id: slug } as never,
      {
        $inc: inc,
        $set: { slug, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
  } catch {
    // Swallow everything — tracking must never affect the visitor's experience.
  }

  return new NextResponse(null, { status: 204 });
}
