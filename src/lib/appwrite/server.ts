import { Client, Account, Databases, Users, Storage } from 'node-appwrite';

const PUBLIC_APPWRITE_ENDPOINT = process.env.PUBLIC_APPWRITE_ENDPOINT || '';
const PUBLIC_APPWRITE_PROJECT_ID = process.env.PUBLIC_APPWRITE_PROJECT_ID || '';
const PRIVATE_APPWRITE_API_KEY = process.env.PRIVATE_APPWRITE_API_KEY || '';

// Debug logging (remove after fixing)
console.log('Environment check:', {
  endpoint: PUBLIC_APPWRITE_ENDPOINT ? 'SET' : 'MISSING',
  projectId: PUBLIC_APPWRITE_PROJECT_ID ? 'SET' : 'MISSING',
  apiKey: PRIVATE_APPWRITE_API_KEY ? 'SET' : 'MISSING',
  nodeEnv: process.env.NODE_ENV
});

if (!PUBLIC_APPWRITE_ENDPOINT || !PUBLIC_APPWRITE_PROJECT_ID || !PRIVATE_APPWRITE_API_KEY) {
  throw new Error('Appwrite endpoint, project ID, and API key must be set in environment variables.');
}

// Server-side client with API key for admin operations
const serverClient = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(PRIVATE_APPWRITE_API_KEY);

// Server-side services
export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverUsers = new Users(serverClient);
export const serverStorage = new Storage(serverClient);

export { serverClient };