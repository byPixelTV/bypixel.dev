import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Not Found | byPixelTV – Software Developer",
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
              <AlertCircle className="h-24 w-24 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The blog post you&apos;re looking for doesn&apos;t exist, has been removed, or is currently a draft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              <Button asChild className="text-black bg-white hover:bg-gray-300">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </BackgroundLayout>
    </>
  );
}