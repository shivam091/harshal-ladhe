import { MongoClient, Db } from "mongodb";

/*
  Cached MongoDB connection for Next.js serverless / hot-reload environments.

  In development the module is re-evaluated on every hot reload, and in
  production each serverless invocation may reuse a warm container — both cases
  would otherwise open a new connection on every request and exhaust the pool.
  We stash the client promise on `globalThis` so it survives across reloads and
  invocations, ensuring a single shared pool.
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

// Returns the shared, connected database instance.
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
