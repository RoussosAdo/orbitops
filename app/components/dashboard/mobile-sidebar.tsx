"use client";

import Sidebar from "@/app/components/dashboard/sidebar";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileSidebar({
  isOpen,
  onClose,
}: MobileSidebarProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } xl:hidden`}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 xl:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full">
          <Sidebar isMobile onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}