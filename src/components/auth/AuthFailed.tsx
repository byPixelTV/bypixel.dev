"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthFailurePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
      <p>Please try again.</p>
      <div className="flex justify-end">
        <Button className="text-black hover:bg-gray-400 bg-white" onClick={() => router.push("/auth/login")}>Go back</Button>
      </div>
    </div>
  );
}