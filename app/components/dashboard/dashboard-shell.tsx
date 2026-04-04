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

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}