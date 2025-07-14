import { Client, Account, Databases, OAuthProvider } from "appwrite";

const PUBLIC_APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
const PUBLIC_APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
if (!PUBLIC_APPWRITE_ENDPOINT || !PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error("Appwrite endpoint and project ID must be set in environment variables.");
}

const client: Client = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID);

const account: Account = new Account(client);
const databases: Databases = new Databases(client);

// account.createOAuth2Session(
//     OAuthProvider.Github, // provider
//     'https://bypixel.dev/auth/success', // redirect here on success
//     'https://bypixel.dev/auth/failed'
// );

// account.createOAuth2Session(
//     OAuthProvider.Discord, // provider
//     'https://bypixel.dev/auth/success', // redirect here on success
//     'https://bypixel.dev/auth/failed'
// );

export { client, account, databases, OAuthProvider };