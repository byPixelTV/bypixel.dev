"use client";

import { account, OAuthProvider } from "@/lib/appwrite/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function LoginContent() {
  const [showError, setShowError] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [showNotLoggedIn, setShowNotLoggedIn] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "true") setShowError(true);

    const disabled = searchParams.get("disabled");
    if (disabled === "true") setShowDisabled(true);

    const notLoggedIn = searchParams.get("not-logged-in");
    if (notLoggedIn === "true") setShowNotLoggedIn(true);
  }, [searchParams]);

  const loginWith = (provider: OAuthProvider) => {
    account.createOAuth2Token(
      provider,
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/failed`
    );
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {showError && (
        <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Login failed. Please try again.</AlertDescription>
        </Alert>
      )}
      {showDisabled && (
        <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Logins are currently disabled. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      {showNotLoggedIn && (
        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not logged in. Please log in to continue.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome
          </CardTitle>
          <CardDescription className="text-white/80">
            Sign in or create an account using your Discord account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => loginWith(OAuthProvider.Discord)}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 h-auto"
            size="lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Continue with Discord
          </Button>

          <div className="relative">
            <Separator className="bg-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/10 backdrop-blur-md px-2 text-xs text-white/80 rounded">
                Quick & Secure
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-white/80">
            <p>New users will automatically have an account created</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}