import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  try {
    const headerStore = await headers();
    return await auth.api.getSession({ headers: new Headers(headerStore) });
  } catch {
    return null;
  }
}

export async function isServerAdmin() {
  const session = await getServerSession();
  return session?.user?.admin === true;
}

export async function isAdminFromHeaders(requestHeaders: Headers) {
  try {
    const session = await auth.api.getSession({ headers: requestHeaders });
    return session?.user?.admin === true;
  } catch {
    return false;
  }
}
