import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { CONSENT_EVENTS, CONSENT_STATUSES } from "@/lib/consent";
import type { ConsentEvent } from "@/lib/consent";
import { BOT_PATTERN, getCountry, getIstDay } from "@/lib/visit-keys";

// One document per IST day, so a whole day's banner activity is a single small upsert.
type ConsentDay = {
  // Doubles as the document `_id`, like page views' slug.
  day: string;
  // Event counts per country, not people; nothing here identifies a reader.
  countries: Record<string, Partial<Record<ConsentEvent | "changed", number>>>;
  createdAt: Date;
  updatedAt: Date;
};

// Kept apart from page_views because a banner impression belongs to no page.
const COLLECTION = "consent_choices";

// Deliberately small body: the beacon only names what happened and what the reader had answered before.
type ConsentBeacon = {
  event?: unknown;
  previous?: unknown;
};

/*
  Counts only: no IP, cookie or hash is stored, since a reader who declined analytics shouldn't be recognisable
  here either. The response is always 204 so the beacon never surfaces an error to the visitor.
*/
export async function POST(req: NextRequest) {
  try {
    if (BOT_PATTERN.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

    const beacon = (await req.json()) as ConsentBeacon;
    const event = CONSENT_EVENTS.find((name) => name === beacon.event);
    if (!event) return new NextResponse(null, { status: 204 });

    const previous = CONSENT_STATUSES.find((status) => status === beacon.previous) ?? "pending";
    const country = await getCountry(req);
    const now = new Date();
    const day = getIstDay(now);

    const inc: Record<string, number> = { [`countries.${country}.${event}`]: 1 };
    // Flipping an earlier answer is worth seeing apart from a first answer, as it points to a banner people regret.
    if (event !== "shown" && (previous === "granted" || previous === "denied") && previous !== event) inc[`countries.${country}.changed`] = 1;

    const db = await getDb();
    await db.collection<ConsentDay>(COLLECTION).updateOne(
      { _id: day } as never,
      { $inc: inc, $set: { day, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
  } catch {
    // Swallow everything — counting the banner must never affect the visitor's experience.
  }

  return new NextResponse(null, { status: 204 });
}
