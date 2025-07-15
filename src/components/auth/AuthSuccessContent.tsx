"use client";

import { useEffect } from "react";
import { account } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { deleteUserIfNotAdmin } from "@/lib/actions/auth";

export default function AuthSuccessContent() {
  const router = useRouter();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const session = await account.get();

        if (!(await account.get()).labels.includes("admin")) {
          deleteUserIfNotAdmin(session.$id)
            .then(() => {
              router.push("/auth/login?disabled=true");
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              router.push("/auth/login?error=true");
            });
        } else {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error getting session:", error);
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
