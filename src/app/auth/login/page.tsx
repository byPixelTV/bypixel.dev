import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import LoginContent from "@/app/auth/login/LoginClient";

export const metadata: Metadata = {
  title: "Login | byPixelTV – Software Developer",
};

export default function LoginPage() {
  return (
    <BackgroundLayout>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Suspense fallback={<LoginSkeleton />}>
          <LoginContent />
        </Suspense>
      </div>
    </BackgroundLayout>
  );
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}