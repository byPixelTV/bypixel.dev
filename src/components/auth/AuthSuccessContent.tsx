import { useEffect } from "react";
import { account } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation"; // Note: next/navigation, not next/router
import { deleteUserIfNotAdmin } from "@/lib/actions/auth";

export default function AuthSuccessContent() {
  const router = useRouter();

  useEffect(() => {
    // Handle successful authentication
    const handleSuccess = async () => {
      try {
        // Get user session
        const session = await account.getSession('current');
        console.log('Authentication successful:', session);

        // Check if the user is an admin
        if (!(await account.get()).labels.includes('admin')) {
          // logout user
            deleteUserIfNotAdmin(session.userId)
            .then(() => {
              router.push('/auth/login?disabled=true');
            })
            .catch((error) => {
              console.error('Error deleting user:', error);
              router.push('/auth/login?error=true');
            });
        } else {
          
        // Redirect to admin page
        router.push('/admin'); // or wherever you want to redirect
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // Redirect to login on error
        router.push('/auth/login?error=true');
      }
    };

    handleSuccess();
  }, [router]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold">Authentication Successful</h1>
      <p>Redirecting...</p>
    </div>
  );
}