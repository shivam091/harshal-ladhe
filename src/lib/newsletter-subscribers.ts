import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyUnsubscribeToken } from "@/lib/mail/unsubscribe";

const COLLECTION = "newsletter_subscribers";

type Subscriber = { _id: ObjectId; email: string };

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
export async function unsubscribe(token: string): Promise<string | null> {
  const target = await findUnsubscribeTarget(token);
  if (target.status !== "subscribed") return null;

  const db = await getDb();
  await db.collection<Subscriber>(COLLECTION).deleteOne({ _id: target.id });
  console.info(`[newsletter] Unsubscribed ${target.email}`);
  return target.email;
}
