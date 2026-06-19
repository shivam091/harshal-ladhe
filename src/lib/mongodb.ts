import type { Db } from "mongodb";
import { MongoClient } from "mongodb";

/*
  Hot reloads re-evaluate this module in development, which would open a fresh
  connection each time and exhaust the pool — so the dev client promise lives on
  `globalThis`. Production evaluates the module once per warm instance.
*/

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

// Augment the global type so we can cache the connection promise without `any`.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

// Awaits the shared connection so callers never touch a client that is still connecting.
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
