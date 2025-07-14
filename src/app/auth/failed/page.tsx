import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Failure | byPixelTV – Software Developer",
};

export default function AuthFailed() {
  return <p>❌ Login fehlgeschlagen. Versuch’s nochmal.</p>;
}