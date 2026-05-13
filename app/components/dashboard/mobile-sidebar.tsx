"use client";

import { X } from "lucide-react";
import Sidebar from "@/app/components/dashboard/sidebar";
import type { AppLanguage } from "@/app/lib/i18n";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
};

export default function MobileSidebar({
  isOpen,
  onClose,
  language,
}: MobileSidebarProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } xl:hidden`}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 h-dvh max-h-dvh overflow-hidden transition-transform duration-300 xl:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-dvh max-h-dvh w-[86vw] max-w-[340px] flex-col overflow-hidden bg-[#fcfdff] shadow-[var(--shadow-lg)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--border-strong)]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-full min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
            <Sidebar isMobile onNavigate={onClose} language={language} />
          </div>
        </div>
      </div>
    </>
  );
}