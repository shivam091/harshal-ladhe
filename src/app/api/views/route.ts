import type { NextRequest} from "next/server";
import { NextResponse, after } from "next/server";
import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getPageUrl } from "@/utils/page-url";
import { getClientIp, hashVisitor } from "@/lib/client-ip";
import { BOT_PATTERN, getCountry, getIstDay, isDatacentreIp, safeKey } from "@/lib/visit-keys";
import type { ConsentStatus } from "@/lib/consent";
import { CONSENT_STATUSES } from "@/lib/consent";

// One document per slug so every counter can be bumped in a single atomic upsert.
type PageView = {
  // Doubles as the document `_id`, so upserts key on the path directly.
  slug: string;
  // Absolute address of the page, so a record can be opened straight from the database.
  url: string;
  // Every human hit, repeats included — not a distinct-visitor count.
  visitorCount: number;
  // Approximate — deduped per day by hashed IP, so shared IPs undercount.
  uniqueVisitorCount: number;
  // Kept apart so crawlers never inflate visitorCount.
  botCount: number;
  // Frozen pre-referrersByDay totals with no day attached; no longer written, kept so history isn't lost.
  referrers?: Record<string, number>;
  // Frozen pre-countriesByDay totals with no day attached; no longer written, kept so history isn't lost.
  countries?: Record<string, number>;
  // Frozen pre-devicesByDay totals with no day attached; no longer written, kept so history isn't lost.
  devices?: Partial<Record<DeviceType, number>>;
  // Frozen pre-countriesByDay daily totals; no longer written, kept so history isn't lost.
  viewsByDay?: Record<string, number>;
  /*
    Keyed by IST calendar day, then country; daily and per-country totals are summed
    from this rather than stored twice. Nothing prunes it, so it grows by one key per active day.
  */
  countriesByDay: Record<string, Record<string, number>>;
  // Same day keys as countriesByDay, so a device mix can be read for any period.
  devicesByDay: Record<string, Partial<Record<DeviceType, number>>>;
  // Same day keys again; referrer keys are sanitised because Mongo field names can't contain dots.
  referrersByDay: Record<string, Record<string, number>>;
  // Same day keys; splits views by the reader's consent answer, so the gap to GA's views can be attributed to declines.
  consentByDay?: Record<string, Partial<Record<ConsentStatus, number>>>;
  // Same day keys; whether gtag actually loaded for a view, so ad-blocked views can be told from consent-denied ones.
  gaByDay?: Record<string, Partial<Record<GaStatus, number>>>;
  // Same day keys; views that look automated, tallied so the gap to GA's bot-filtered views can be explained.
  suspectByDay?: Record<string, Partial<Record<SuspectKind, number>>>;
  // Same day keys; one key per "source|medium|campaign" so a campaign's traffic can be read without the landing URL.
  campaignsByDay?: Record<string, Record<string, number>>;
  createdAt: Date;
  updatedAt: Date;
};

// No "unknown" status: a view that leaves before the check sends no second beacon, so unknowns are the shortfall from
// the view count.
const GA_STATUSES = ["loaded", "blocked"] as const;

type GaStatus = (typeof GA_STATUSES)[number];

// Webdriver is proof of automation, so those views count as bots; a datacentre address is only a hint, so those stay
// human views and are just tallied.
type SuspectKind = "webdriver" | "datacentre";

// Mirrors the `devices` keys so an increment can never target an unknown field.
type DeviceType = "tablet" | "mobile" | "desktop" | "tv" | "unknown";

// Counters live apart from dedup markers so a page's totals stay one small document.
const COLLECTION = "page_views";

/*
  A unique (slug, day, ipHash) index turns "is this visitor new today?" into an
  insert that either succeeds or collides — atomic, with no read-then-write race.
*/
const SEEN_COLLECTION = "page_view_seen";

/*
  Markers are kept for good, like likes', so the admin can count distinct
  visitors over any period; earlier versions expired them through this index.
*/
const SEEN_TTL_INDEX = "at_1";

// MongoDB's codes for a collection or index that isn't there, i.e. nothing left to drop.
const NAMESPACE_NOT_FOUND = 26;
const INDEX_NOT_FOUND = 27;

// Only record slugs that look like real app paths — guards against junk payloads.
const SLUG_PATTERN = /^\/[\w\-/]*$/;

/*
  Dropped rather than left alone, because a TTL index already in a database
  would go on deleting markers whatever the code says.
*/
async function dropSeenTtl(coll: Collection): Promise<unknown> {
  try {
    return await coll.dropIndex(SEEN_TTL_INDEX);
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
    if (code !== INDEX_NOT_FOUND && code !== NAMESPACE_NOT_FOUND) throw err;
  }
}

/*
  Dedup is only correct once the unique index exists; caching the promise means
  steady-state requests pay nothing. The day index lets the admin count a
  period's visitors without a full scan.
*/
let seenIndexReady: Promise<unknown> | undefined;
function ensureSeenIndexes(db: Awaited<ReturnType<typeof getDb>>): Promise<unknown> {
  if (!seenIndexReady) {
    const coll = db.collection(SEEN_COLLECTION);
    seenIndexReady = Promise.all([
      coll.createIndex({ slug: 1, day: 1, ipHash: 1 }, { unique: true }),
      coll.createIndex({ day: 1, ipHash: 1 }),
      dropSeenTtl(coll)
    ]).catch(() => {
      // Reset so a transient failure can be retried on the next request.
      seenIndexReady = undefined;
    });
  }
  return seenIndexReady;
}

// What the beacon reports about how the visit began; only the first page of a visit carries referrer and utm.
type ViewBeacon = {
  slug?: string;
  referrer?: unknown;
  internal?: unknown;
  utm?: unknown;
  consent?: unknown;
  // Set by browsers under automation (Selenium, Playwright, Puppeteer), which real readers never are.
  webdriver?: unknown;
  // On a second beacon of its own, so the view itself never waits for the gtag check.
  ga?: unknown;
};

// Each campaign part is capped so one long tag can't crowd the others out of the key.
const UTM_PART_MAX = 40;

// Six parts fit with their separators; the shorter default would cut off the last ones.
const CAMPAIGN_KEY_MAX = 256;

/*
  Buckets by host rather than full URL so referral sources aggregate instead of fragmenting. The beacon's own Referer
  header is always this site's page, so the page's document.referrer from the body is what counts; the header is only
  a fallback for a client that predates it.
*/
function getReferrerHost(req: NextRequest, beacon: ViewBeacon): string {
  if (beacon.internal === true) return "internal";

  const referer = "referrer" in beacon
    ? (typeof beacon.referrer === "string" ? beacon.referrer : "")
    : req.headers.get("referer");
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

function utmPart(value: unknown): string {
  const part = typeof value === "string" ? value.trim().toLowerCase().slice(0, UTM_PART_MAX) : "";
  return part || "(none)";
}

// Only a landing URL tagged with utm_source counts as a campaign; the other tags alone say too little. Content, term
// and id come last so a key stored before they were counted still reads as the first three.
function getCampaignKey(utm: unknown): string | null {
  if (!utm || typeof utm !== "object") return null;
  const { source, medium, campaign, content, term, id } = utm as Record<string, unknown>;
  if (typeof source !== "string" || !source.trim()) return null;
  const parts = [source, medium, campaign, content, term, id].map(utmPart);
  return safeKey(parts.join("|"), CAMPAIGN_KEY_MAX);
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

/*
  A duplicate-key error (11000) is the "already counted today" signal, not a failure.
  The country rides along so the admin can count one country's visitors too.
*/
async function isNewUniqueVisitor(
  db: Awaited<ReturnType<typeof getDb>>,
  slug: string,
  day: string,
  ipHash: string,
  country: string
): Promise<boolean> {
  try {
    await ensureSeenIndexes(db);
    await db.collection(SEEN_COLLECTION).insertOne({ slug, day, ipHash, country, at: new Date() });
    return true;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) return false;
    // Other errors count as not-new, since a missed unique visitor beats a double count.
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
    const beacon = (await req.json()) as ViewBeacon;
    const { slug } = beacon;

    if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
      // Silently ignore bad input — never expose validation to a tracking beacon.
      return new NextResponse(null, { status: 204 });
    }

    const now = new Date();
    const day = getIstDay(now);
    const ua = req.headers.get("user-agent") ?? "";
    const isWebdriver = beacon.webdriver === true;
    const isBot = BOT_PATTERN.test(ua) || isWebdriver;
    const db = await getDb();

    // The tag-status beacon only adds to its own counter, so it can never count a view twice; bots are ignored.
    const ga = GA_STATUSES.find((status) => status === beacon.ga);
    if (ga) {
      if (!isBot) {
        await db.collection<PageView>(COLLECTION).updateOne(
          { _id: slug } as never,
          { $inc: { [`gaByDay.${day}.${ga}`]: 1 }, $set: { updatedAt: now } }
        );
      }
      return new NextResponse(null, { status: 204 });
    }

    // Bots are tallied separately and never pollute the human-facing metrics.
    if (isBot) {
      await db.collection<PageView>(COLLECTION).updateOne(
        { _id: slug } as never,
        {
          $inc: { botCount: 1, ...(isWebdriver ? { [`suspectByDay.${day}.webdriver`]: 1 } : {}) },
          $set: { slug, url: getPageUrl(slug), updatedAt: now },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
      return new NextResponse(null, { status: 204 });
    }

    const ip = getClientIp(req);
    const referrer = safeKey(getReferrerHost(req, beacon));
    const campaign = getCampaignKey(beacon.utm);
    const country = await getCountry(req);
    const device = getDevice(ua);
    const consent = CONSENT_STATUSES.find((state) => state === beacon.consent) ?? "pending";
    const isNew = await isNewUniqueVisitor(db, slug, day, hashVisitor(ip), country);

    const inc: Record<string, number> = {
      visitorCount: 1,
      [`countriesByDay.${day}.${country}`]: 1,
      [`devicesByDay.${day}.${device}`]: 1,
      [`referrersByDay.${day}.${referrer}`]: 1,
      [`consentByDay.${day}.${consent}`]: 1
    };
    if (campaign) inc[`campaignsByDay.${day}.${campaign}`] = 1;
    if (isNew) inc.uniqueVisitorCount = 1;

    await db.collection<PageView>(COLLECTION).updateOne(
      { _id: slug } as never,
      {
        $inc: inc,
        $set: { slug, url: getPageUrl(slug), updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );

    // After the response, because the network lookup can be slow and must never hold up the beacon.
    after(async () => {
      try {
        if (!(await isDatacentreIp(ip))) return;
        await db.collection<PageView>(COLLECTION).updateOne({ _id: slug } as never, { $inc: { [`suspectByDay.${day}.datacentre`]: 1 } });
      } catch {
        // A missed tally is harmless.
      }
    });
  } catch {
    // Swallow everything — tracking must never affect the visitor's experience.
  }

  return new NextResponse(null, { status: 204 });
}
