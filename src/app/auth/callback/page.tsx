import BackgroundLayout from "@/components/BackgroundLayout";
import { Metadata } from "next";
import AuthCallback from "@/components/auth/AuthCallback";

export const metadata: Metadata = {
  title: "Auth Success | byPixelTV – Software Developer",
};

export default function AuthSuccessPage() {
  return (
    <BackgroundLayout>
      <AuthCallback />
    </BackgroundLayout>
  );
}