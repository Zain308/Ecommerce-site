"use client"; // Since NextAuth requires client-side interaction
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <>
          <p>Welcome, {session.user.name}!</p>
          <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <p>Please sign in</p>
          <button onClick={() => signIn("google")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
}
