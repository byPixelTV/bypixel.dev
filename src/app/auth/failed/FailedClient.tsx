"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AuthFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? '{"message": "Authentication failed"}';
  const errorMessage = JSON.parse(error).message === "OAuth provider failed to return email"
    ? "OAuth provider failed to return email. Please don't remove the email scope from the OAuth provider settings."
    : JSON.parse(error).message;

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
      <p>{errorMessage}</p>
      <p></p>
      <div className="flex justify-end">
        <Button className="text-black hover:bg-gray-400 bg-white" onClick={() => router.push("/auth/login")}>Go back</Button>
      </div>
    </div>
  );
}