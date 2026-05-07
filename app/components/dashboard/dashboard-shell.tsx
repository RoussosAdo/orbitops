"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/app/components/dashboard/sidebar";
import Topbar from "@/app/components/dashboard/topbar";
import MobileSidebar from "@/app/components/dashboard/mobile-sidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="mx-auto flex min-h-screen max-w-[1720px]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 px-5 py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
            <div className="mx-auto w-full max-w-[1380px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}