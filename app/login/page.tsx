"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[rgba(109,94,252,0.10)] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden border-r border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                <Image
                  src="/orbitops-logo.png"
                  alt="OrbitOps logo"
                  fill
                  priority
                  className="object-contain p-1.5"
                />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  OrbitOps
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Workspace platform
                </p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Modern SaaS Operations
              </p>

              <h1 className="mt-4 max-w-md text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                Run clients, projects and billing in one place.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted-foreground)]">
                OrbitOps helps teams manage delivery, workspace operations,
                subscriptions and team access with a clean product-first
                experience.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Delivery
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Projects
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Track progress and linked clients.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Control
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Billing
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Plans, invoices and usage visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Product Access
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Sign in with your GitHub account to access your OrbitOps workspace
              securely.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                <Image
                  src="/orbitops-logo.png"
                  alt="OrbitOps logo"
                  fill
                  priority
                  className="object-contain p-1.5"
                />
              </div>

              <div>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  OrbitOps
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Workspace platform
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Welcome back
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Access your workspace dashboard securely and continue managing
                operations from one place.
              </p>

              {error && (
                <div className="mt-5 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  Sign-in failed:{" "}
                  {error === "OAuthAccountNotLinked"
                    ? "Email already in use with another provider."
                    : "Something went wrong with GitHub."}
                </div>
              )}

              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-black"
              >
                Continue with GitHub
              </button>

              <div className="mt-6 rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Secure access
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Authentication is handled through your GitHub account for a
                  faster and safer sign-in flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginContent />
    </Suspense>
  );
}