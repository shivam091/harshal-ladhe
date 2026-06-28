import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getClientIp, hashIp } from "@/lib/client-ip";

// One document per slug so every counter can be bumped in a single atomic upsert.
type PageView = {
  // Doubles as the document `_id`, so upserts key on the path directly.
  slug: string;
  // Every human hit, repeats included — not a distinct-visitor count.
  visitorCount: number;
  // Approximate — deduped per day by hashed IP, so shared IPs undercount.
  uniqueVisitorCount: number;
  // Kept apart so crawlers never inflate visitorCount.
  botCount: number;
  // Keys pass through safeKey since Mongo field names can't contain dots.
  referrers: Record<string, number>;
  countries: Record<string, number>;
  devices: { tablet: number; mobile: number; desktop: number; tv: number; unknown: number };
  // Keyed by IST calendar day, not UTC; nothing prunes it, so it grows by one key per active day.
  viewsByDay: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
};

// Mirrors the `devices` keys so an increment can never target an unknown field.
type DeviceType = "tablet" | "mobile" | "desktop" | "tv" | "unknown";

// Counters live apart from dedup markers so the markers can expire without touching totals.
const COLLECTION = "page_views";

/*
  A unique (slug, day, ipHash) index turns "is this visitor new today?" into an
  insert that either succeeds or collides — atomic, with no read-then-write race.
*/
const SEEN_COLLECTION = "page_view_seen";

// Only record slugs that look like real app paths — guards against junk payloads.
const SLUG_PATTERN = /^\/[\w\-/]*$/;

// Deliberately rough — enough to keep common crawlers and link previewers out of the human metrics.
const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|preview|monitor|lighthouse|headless/i;

/*
  Dedup is only correct once the unique index exists; caching the promise means
  steady-state requests pay nothing, and the TTL keeps old markers from piling up.
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

// Buckets by host rather than full URL so referral sources aggregate instead of fragmenting.
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

// Relies on the edge's geo headers so no IP-lookup database is needed.
function getCountry(req: NextRequest): string {
  return (
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "unknown"
  ).toUpperCase();
}

// TV and tablet go first because their UAs often also match the broader mobile/desktop patterns.
function getDevice(ua: string): DeviceType {
  if (!ua) return "unknown";
  if (/smart.?tv|hbbtv|netcast|nettv|appletv|roku|googletv|crkey|firetv|silk|tv safari/i.test(ua)) return "tv";
  if (/ipad|tablet|kindle|playbook|(android(?!.*mobile))|windows.*touch(?!.*phone)/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|windows phone|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux|x11|cros/i.test(ua)) return "desktop";
  return "unknown";
}

// Header-derived keys land in a Mongo dot-path, where `.` and `$` would break or hijack the update.
function safeKey(value: string): string {
  return value.replace(/[.$]/g, "_").slice(0, 64) || "unknown";
}

// A duplicate-key error (11000) is the "already counted today" signal, not a failure.
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

// Answers `{ views: 0 }` on any failure so the client always gets a valid shape without leaking internals.
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
  Counters use atomic `$inc` so concurrent visits never lose a count, and the
  response is always 204 so the beacon never surfaces an error to the visitor.
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
