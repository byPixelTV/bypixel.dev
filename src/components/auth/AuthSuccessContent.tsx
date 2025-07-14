"use client";

import { useEffect } from "react";
import { account } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { deleteUserIfNotAdmin } from "@/lib/actions/auth";
import { Models } from "appwrite";

export default function AuthSuccessContent() {
  const router = useRouter();

  // Retry function for getSession with proper typing
  async function getSessionWithRetry(retries = 5, delay = 300): Promise<Models.Session> {
    for (let i = 0; i < retries; i++) {
      try {
        const session = await account.getSession("current");
        return session;
      } catch (e) {
        if (i === retries - 1) throw e;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    // This should never be reached due to the throw in the loop, but TypeScript needs it
    throw new Error("Failed to get session after retries");
  }

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const session = await getSessionWithRetry();
        console.log("Authentication successful:", session);

        const user = await account.get();

        if (!user.labels?.includes("admin")) {
          await deleteUserIfNotAdmin(session.userId);
          router.push("/auth/login?disabled=true");
        } else {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error during auth handling:", error);
        router.push("/auth/login?error=true");
      }
    };

    handleSuccess();
  }, [router]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold">Authentication Successful</h1>
      <p>Redirecting...</p>
    </div>
  );
}