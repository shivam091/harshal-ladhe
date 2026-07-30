import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getClientIp, hashIp } from "@/lib/client-ip";
import type { Like } from "@/types/like";

// MongoDB collection that stores per-post like counters.
const COLLECTION = "page_likes";

/*
  Collection of (slug, ipHash) markers used to dedupe likes. A unique index on
  both fields makes the first insert per visitor-per-slug succeed and every
  later one fail — that's our "has this IP already liked this page" signal.
  Unlike page_view_seen, there's no TTL here: a like is meant to be a
  permanent, one-time action per visitor, not reset daily.
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
      hasAlreadyLiked(db, slug, ipHash),
    ]);

    return NextResponse.json({ likes: doc?.likeCount ?? 0, alreadyLiked });
  } catch {
    return NextResponse.json({ likes: 0, alreadyLiked: false });
  }
}

/*
  POST /api/likes — increments the like counter for a post slug by 1, unless
  the requesting IP has already liked it, and returns the resulting total.
  One document per slug (`_id` = slug), atomic `$inc` so concurrent likes
  never lose a count.
*/
export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as { slug?: string };

    if (!slug || slug.length > 256 || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json({ likes: 0, alreadyLiked: false }, { status: 400 });
    }

    const db = await getDb();
    const ipHash = hashIp(getClientIp(req));

    await ensureSeenIndex(db);

    /*
      The unique index is the source of truth for "is this a new like": the
      insert succeeds exactly once per (slug, ipHash), so a duplicate-key
      error (code 11000) means this IP already liked this slug.
    */
    let isNewLike = true;
    try {
      await db.collection(SEEN_COLLECTION).insertOne({ slug, ipHash, at: new Date() });
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

    const now = new Date();
    const updated = await db.collection<Like>(COLLECTION).findOneAndUpdate(
      { _id: slug } as never,
      {
        $inc: { likeCount: 1 },
        $set: { slug, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ likes: updated?.likeCount ?? 1, alreadyLiked: false });
  } catch {
    return NextResponse.json({ likes: 0, alreadyLiked: false }, { status: 500 });
  }
}
