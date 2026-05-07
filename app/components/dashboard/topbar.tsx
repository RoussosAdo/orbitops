"use client";

import { Bell, Command, Search } from "lucide-react";
import AuthUserMenu from "@/app/components/dashboard/auth-user-menu";

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-xl text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--border-strong)] xl:hidden"
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Workspace
            </p>
            <h1 className="mt-1 text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Dashboard Overview
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] md:flex">
            <Search className="h-4 w-4" />
            <span>Search anything...</span>
            <span className="rounded-lg border border-[var(--border)] bg-white px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
              ⌘K
            </span>
          </div>

          <button className="hidden h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--primary-light)] hover:text-[var(--primary)] md:inline-flex">
            Invite Team
          </button>

          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--primary-light)] hover:text-[var(--primary)] lg:flex">
            <Bell className="h-4 w-4" />
          </button>

          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--primary-light)] hover:text-[var(--primary)] lg:flex">
            <Command className="h-4 w-4" />
          </button>

          <AuthUserMenu />
        </div>
      </div>
    </header>
  );
}