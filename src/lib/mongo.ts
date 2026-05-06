import { MongoClient, Db, Collection, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

function makeClient(): MongoClient {
  return new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
}

function getClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = makeClient();
    }
    return globalWithMongo._mongoClient;
  }
  return makeClient();
}

export let client = getClient();
export const db: Db = client.db("blog");

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function ensureConnected(retries = 5): Promise<void> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      // try a lightweight ping to ensure connection is usable
      if (!client) client = getClient();
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      // connected and healthy
      return;
    } catch (err) {
      try {
        await client.close();
      } catch {}
      // replace the client so subsequent calls recreate connection
      client = getClient();
      const backoff = Math.min(1000 * 2 ** attempt, 10000);
      attempt++;
      if (attempt >= retries) throw err;
      await wait(backoff);
    }
  }
}

// Add basic listeners in development to proactively handle closures
if (process.env.NODE_ENV === "development") {
  const origClient = client;
  try {
    // best-effort: attach listeners that will force close and recreate on error/close
    origClient.on?.("close", async () => {
      try {
        await origClient.close();
      } catch {}
      client = getClient();
    });
    origClient.on?.("error", async () => {
      try {
        await origClient.close();
      } catch {}
      client = getClient();
    });
  } catch {}
}

async function getDb(): Promise<Db> {
  await ensureConnected();
  return client.db("blog");
}

// Types
export interface Post {
  _id: ObjectId;
  userId: string;
  content: string;
  draft: boolean;
  creationDate: string;
  updateDate?: string;
  shortDescription: string;
  title: string;
  thumbnail?: string;
  slug: string;
  views: number;
}

export async function getPostsCollection(): Promise<Collection<Post>> {
  const db = await getDb();
  return db.collection<Post>("posts");
}

export type SerializedPost = Omit<Post, "_id"> & { _id: string };