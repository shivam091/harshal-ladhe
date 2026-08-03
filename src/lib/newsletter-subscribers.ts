import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyUnsubscribeToken } from "@/lib/mail/unsubscribe";

const COLLECTION = "newsletter_subscribers";

// Kept apart from subscribers, since those are deleted on unsubscribe and churn would otherwise leave no trace.
const UNSUBSCRIBES_COLLECTION = "newsletter_unsubscribes";

type Subscriber = {
  _id: ObjectId;
  email: string;
  country?: string;
  subscribedAt?: Date;
  source?: string | null;
  sourcePage?: string | null;
};

// "link" is the confirm page; "one_click" the RFC 8058 POST a mail provider sends on the reader's behalf.
export type UnsubscribeMethod = "link" | "one_click";

/*
  "gone" kept apart from "invalid", so a used link can say it was already done rather than look broken.
*/
export type UnsubscribeTarget =
  | { status: "invalid" }
  | { status: "gone" }
  | { status: "subscribed"; id: ObjectId; email: string };

export async function findUnsubscribeTarget(token: string): Promise<UnsubscribeTarget> {
  const subscriberId = verifyUnsubscribeToken(token);
  if (!subscriberId || !ObjectId.isValid(subscriberId)) return { status: "invalid" };

  const db = await getDb();
  const subscriber = await db.collection<Subscriber>(COLLECTION).findOne({ _id: new ObjectId(subscriberId) });
  return subscriber ? { status: "subscribed", id: subscriber._id, email: subscriber.email } : { status: "gone" };
}

/*
  Deleted rather than flagged, since subscribing turns away an address that's already stored, which would keep them
  from subscribing again.
*/
export async function unsubscribe(token: string, method: UnsubscribeMethod): Promise<string | null> {
  const target = await findUnsubscribeTarget(token);
  if (target.status !== "subscribed") return null;

  const db = await getDb();
  const subscriber = await db.collection<Subscriber>(COLLECTION).findOne({ _id: target.id });
  if (!subscriber) return null;

  // Recorded before the delete, so a failure here leaves the reader subscribed and able to retry rather than lost.
  await db.collection(UNSUBSCRIBES_COLLECTION).insertOne({
    email: subscriber.email,
    country: subscriber.country ?? null,
    subscribedAt: subscriber.subscribedAt ?? null,
    unsubscribedAt: new Date(),
    source: subscriber.source ?? null,
    sourcePage: subscriber.sourcePage ?? null,
    method
  });
  await db.collection<Subscriber>(COLLECTION).deleteOne({ _id: target.id });
  console.info(`[newsletter] Unsubscribed ${target.email}`);
  return target.email;
}
