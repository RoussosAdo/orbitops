"use client";

import AuthUserMenu from "@/app/components/dashboard/auth-user-menu";

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-xl text-[var(--foreground)] shadow-sm xl:hidden"
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <div>
          <p className="text-sm text-[var(--muted-foreground)]">Welcome back</p>
          <h1 className="text-xl font-bold text-[var(--foreground)] md:text-2xl">
            Dashboard Overview
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden min-w-52 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-sm md:block">
          Search anything...
        </div>

        <button className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[var(--primary-light)] hover:text-[var(--primary-dark)]">
          Invite Team
        </button>

        <div className="flex items-center gap-3">
  <button className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-light)]">
    Invite Team
  </button>

  <AuthUserMenu />
</div>
      </div>
    </header>
  );
}