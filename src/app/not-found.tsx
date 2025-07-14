import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | byPixelTV",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <BackgroundLayout>
        <div className="container mx-auto px-4 py-16 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <AlertTriangle className="h-32 w-32 text-yellow-400" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              404
            </h1>
            <h2 className="text-3xl font-semibold text-white mb-6">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist, has been moved, or you might have entered an incorrect URL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Link>
              </Button>
            </div>
            <div className="mt-12 text-sm text-gray-400">
              <p>If you believe this is an error, please contact me through my social media.</p>
            </div>
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
}