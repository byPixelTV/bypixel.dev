"use client";

import { PostsPage } from "@/components/admin/posts-page";
import BackgroundLayout from "@/components/BackgroundLayout";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      try {
        // Check if user has a session
        const session = await account.getSession("current");
        if (!session) {
          router.push("/auth/login?not-logged-in=true");
          return;
        }

        setIsAuthenticated(true);

        // Check if user is admin
        const user = await account.get();
        const hasAdminLabel = user.labels.includes("admin");
        
        setIsAdmin(hasAdminLabel);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login?not-logged-in=true");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router push handles redirect
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-2xl font-bold">No access</h1>
        <p>You do not have permission to view this page.</p>
        <Button onClick={async () => {
          try {
            await account.deleteSession('current');
          } catch (error) {
            console.error('Logout error:', error);
          }
          router.push("/auth/login");
        }} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="dark">
      <BackgroundLayout>
        <PostsPage />
      </BackgroundLayout>
    </div>
  );
}