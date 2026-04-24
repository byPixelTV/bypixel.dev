import { MongoClient, Db, Collection, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

function getClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri);
    }
    return globalWithMongo._mongoClient;
  }
  return new MongoClient(uri);
}

export const client = getClient();
export const db: Db = client.db("blog");

async function getDb(): Promise<Db> {
  await client.connect(); 
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