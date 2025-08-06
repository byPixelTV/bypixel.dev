"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite/client";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (ran) return;

    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) return;

    const handleCallback = async () => {
      try {
        await account.createSession(userId, secret);

        router.push("/admin");
      } catch (err) {
        console.error("OAuth error:", err);
        router.push("/auth/login?error=true");
      }
    };

    handleCallback();
    setRan(true);
  }, [searchParams, router, ran]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold">Authentication Successful</h1>
      <p>Redirecting...</p>
    </div>
  );
}
