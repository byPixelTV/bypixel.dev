import { MongoClient, type Db, type Collection, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const globalWithMongo = globalThis as typeof globalThis & { _mongoClient?: MongoClient };
// The driver owns connection pooling and reconnects. Do not ping or close the pool per read.
export const client = (globalWithMongo._mongoClient ??= new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 15000,
}));
export const db: Db = client.db("blog");
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
  return db.collection<Post>("posts");
}

export type SerializedPost = Omit<Post, "_id"> & { _id: string };
