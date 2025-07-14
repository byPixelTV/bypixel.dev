import BackgroundLayout from "@/components/BackgroundLayout";
import { Metadata } from "next";
import AuthSuccessContent from "@/components/auth/AuthSuccessContent";

export const metadata: Metadata = {
  title: "Auth Success | byPixelTV – Software Developer",
};

export default function AuthSuccessPage() {
  return (
    <BackgroundLayout>
      <AuthSuccessContent />
    </BackgroundLayout>
  );
}