import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getPageUrl } from "@/utils/page-url";
import { getClientIp, hashIp } from "@/lib/client-ip";
import { getCountry, getIstDay } from "@/lib/visit-keys";

// A post's like counter as persisted in the database — one document per post slug.
type Like = {
  // The post path (e.g. "/post/my-post"). Also used as the document `_id`.
  slug: string;
  // Absolute address of the page, so a record can be opened straight from the database.
  url: string;
  // Total number of likes recorded for this post.
  likeCount: number;
  /*
    Keyed by IST calendar day, then country; daily and per-country totals are summed
    from this rather than stored twice. Nothing prunes it, so it grows by one key per active day.
  */
  countriesByDay: Record<string, Record<string, number>>;
  // When this slug was first liked.
  createdAt: Date;
  // When this slug was last liked.
  updatedAt: Date;
};

// MongoDB collection that stores per-post like counters.
const COLLECTION = "page_likes";

/*
  Collection of (slug, ipHash) markers used to dedupe likes. A unique index on
  both fields makes the first insert per visitor-per-slug succeed and every
  later one fail — that's our "has this IP already liked this page" signal.
  There's no TTL here: a like is meant to be a permanent, one-time action
  per visitor, not reset daily.
*/
const SEEN_COLLECTION = "page_like_seen";

// Only record slugs that look like real app paths — guards against junk payloads.
const SLUG_PATTERN = /^\/[\w\-/]*$/;

/*
  Ensures the unique index backing like dedup exists. Runs at most once per
  warm process (the promise is cached), so steady-state requests pay nothing.
*/
let seenIndexReady: Promise<unknown> | undefined;
function ensureSeenIndex(db: Awaited<ReturnType<typeof getDb>>): Promise<unknown> {
  if (!seenIndexReady) {
    seenIndexReady = db
      .collection(SEEN_COLLECTION)
      .createIndex({ slug: 1, ipHash: 1 }, { unique: true })
      .catch(() => {
        // Reset so a transient failure can be retried on the next request.
        seenIndexReady = undefined;
      });
  }
  return seenIndexReady;
}

// Whether this (slug, ipHash) pair has already been recorded as a like.
async function hasAlreadyLiked(
  db: Awaited<ReturnType<typeof getDb>>,
  slug: string,
  ipHash: string
): Promise<boolean> {
  const doc = await db.collection(SEEN_COLLECTION).findOne({ slug, ipHash }, { projection: { _id: 1 } });
  return doc !== null;
}

/*
  GET /api/likes?slug=<path> — returns the like count for a slug, plus
  whether the requesting IP has already liked it (so a returning visitor with
  no localStorage record — new device, cleared storage — still sees the
  heart correctly filled instead of being able to like again).
*/
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ likes: 0, alreadyLiked: false });
  }

  try {
    const db = await getDb();
    const ipHash = hashIp(getClientIp(req));

    const [doc, alreadyLiked] = await Promise.all([
      db.collection<Like>(COLLECTION).findOne({ _id: slug } as never, { projection: { likeCount: 1 } }),
      hasAlreadyLiked(db, slug, ipHash)
    ]);

    return NextResponse.json({ likes: doc?.likeCount ?? 0, alreadyLiked });
  } catch {
    return NextResponse.json({ likes: 0, alreadyLiked: false });
  }
}

/*
  Deduped per IP, with an atomic `$inc` on one document per slug so concurrent likes never lose
  a count.
*/
export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as { slug?: string };

    if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json({ likes: 0, alreadyLiked: false }, { status: 400 });
    }

    const db = await getDb();
    const ipHash = hashIp(getClientIp(req));
    const now = new Date();
    const day = getIstDay(now);
    const country = await getCountry(req);

    await ensureSeenIndex(db);

    /*
      The unique index is the source of truth for "is this a new like": the
      insert succeeds exactly once per (slug, ipHash), so a duplicate-key
      error (code 11000) means this IP already liked this slug.
    */
    let isNewLike = true;
    try {
      await db.collection(SEEN_COLLECTION).insertOne({ slug, ipHash, country, at: now });
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        isNewLike = false;
      } else {
        throw err;
      }
    }

    if (!isNewLike) {
      const doc = await db.collection<Like>(COLLECTION).findOne({ _id: slug } as never, { projection: { likeCount: 1 } });
      return NextResponse.json({ likes: doc?.likeCount ?? 0, alreadyLiked: true });
    }

    const updated = await db.collection<Like>(COLLECTION).findOneAndUpdate(
      { _id: slug } as never,
      {
        $inc: {
          likeCount: 1,
          [`countriesByDay.${day}.${country}`]: 1
        },
        $set: { slug, url: getPageUrl(slug), updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ likes: updated?.likeCount ?? 1, alreadyLiked: false });
  } catch {
    return NextResponse.json({ likes: 0, alreadyLiked: false }, { status: 500 });
  }
}
