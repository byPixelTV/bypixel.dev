"use client";

import { PostsPage } from "@/app/admin/PostClient";
import BackgroundLayout from "@/components/BackgroundLayout";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      try {
        const session = await authClient.getSession();
        // Check if user has a session
        console.log("Checking session:", session.data);
        if (!session.data || !session.data.session) {
          router.push("/auth/login?not-logged-in=true");
          return;
        }

        setIsAuthenticated(true);

        // Check if user is admin
        const user = session.data?.user;
        const hasAdminLabel = user?.admin === true;
        
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
    return null; 
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-2xl font-bold">No access</h1>
        <p>You do not have permission to view this page.</p>
        <Button onClick={async () => {
          try {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/auth/login");
                }
              }
            })
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