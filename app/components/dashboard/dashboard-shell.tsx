"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/app/components/dashboard/sidebar";
import Topbar from "@/app/components/dashboard/topbar";
import MobileSidebar from "@/app/components/dashboard/mobile-sidebar";
import type { AppLanguage } from "@/app/lib/i18n";

type DashboardShellProps = {
  children: ReactNode;
  language: AppLanguage;
};

export default function DashboardShell({
  children,
  language,
}: DashboardShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        language={language}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-[1720px]">
        <Sidebar language={language} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            language={language}
          />

          <main className="min-w-0 flex-1 px-3 py-4 sm:px-4 md:px-6 md:py-6 xl:px-8 xl:py-8">
            <div className="mx-auto w-full max-w-[1380px] min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}