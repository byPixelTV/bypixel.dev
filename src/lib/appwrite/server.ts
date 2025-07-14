import { Client, Account, Databases, Users, Storage } from 'node-appwrite';

// Server-side client with API key for admin operations
const serverClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

// Server-side services
export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverUsers = new Users(serverClient);
export const serverStorage = new Storage(serverClient);

export { serverClient };