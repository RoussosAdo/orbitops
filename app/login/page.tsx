"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          OrbitOps
        </p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-500">
          Access your workspace dashboard securely.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            Sign-in failed: {error === "OAuthAccountNotLinked" 
              ? "Email already in use with another provider" 
              : "Something went wrong with GitHub"}
          </div>
        )}

        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="mt-6 block w-full rounded-2xl bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Continue with GitHub
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}