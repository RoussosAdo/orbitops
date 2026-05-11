"use client";

import { Bell, Languages, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthUserMenu from "@/app/components/dashboard/auth-user-menu";
import type { AppLanguage } from "@/app/lib/i18n";
import { dashboardCopy } from "@/app/lib/i18n";

type TopbarProps = {
  onOpenMobileMenu: () => void;
  language: AppLanguage;
};

export default function Topbar({ onOpenMobileMenu, language }: TopbarProps) {
  const router = useRouter();
  const copy = dashboardCopy[language];

  const toggleLanguage = async () => {
    const nextLanguage = language === "en" ? "el" : "en";

    const formData = new FormData();
    formData.set("language", nextLanguage);

    await fetch("/api/language/switch", {
      method: "POST",
      body: formData,
    });

    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/78 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 md:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-xl text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--border-strong)] xl:hidden"
            aria-label={copy.openNavigation}
          >
            ☰
          </button>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              {copy.workspace}
            </p>
            <h1 className="mt-1 text-[2.05rem] font-semibold tracking-[-0.05em] text-[var(--foreground)]">
              {copy.dashboardOverview}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] md:flex">
            <Search className="h-4 w-4" />
            <span>{copy.searchPlaceholder}</span>
            <span className="rounded-lg border border-[var(--border)] bg-white px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
              ⌘K
            </span>
          </div>

          <button className="hidden h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--primary-light)] hover:text-[var(--primary)] md:inline-flex">
            {copy.inviteTeam}
          </button>

          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--primary-light)] hover:text-[var(--primary)] lg:flex">
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={copy.languageLabel}
            title={copy.languageLabel}
            className="hidden h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--primary-light)] hover:text-[var(--primary)] lg:inline-flex"
          >
            <Languages className="h-4 w-4" />
            <span>{copy.languageShort}</span>
          </button>

          <AuthUserMenu />
        </div>
      </div>
    </header>
  );
}