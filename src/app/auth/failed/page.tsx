import AuthFailed from "@/components/auth/AuthFailed";
import BackgroundLayout from "@/components/BackgroundLayout";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Auth Failure | byPixelTV – Software Developer",
};

export default function AuthFailurePage() {
  return (
    <BackgroundLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
        <AuthFailed />
      </Suspense>
    </BackgroundLayout>
  );
}