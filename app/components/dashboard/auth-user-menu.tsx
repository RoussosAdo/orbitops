"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AuthUserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-2 shadow-[var(--shadow-xs)]">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-[var(--muted)]" />
        <div className="hidden sm:block">
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--muted)]" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";
  const userImage = session.user.image;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-3 py-2 shadow-[var(--shadow-xs)] sm:flex">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-sm font-bold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {userName}
          </p>
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {userEmail}
          </p>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--primary-light)] hover:bg-[var(--muted)]"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline">Sign out</span>
      </button>
    </div>
  );
}