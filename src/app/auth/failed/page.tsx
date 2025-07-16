import AuthFailed from "@/components/auth/AuthFailed";
import BackgroundLayout from "@/components/BackgroundLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Failure | byPixelTV – Software Developer",
};

export default function AuthFailurePage() {
  return (
    <BackgroundLayout>
      <AuthFailed />
    </BackgroundLayout>
  );
}