"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Team", href: "/dashboard/team" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar({
  isMobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isMobile
          ? "flex h-full w-[88vw] max-w-80 flex-col bg-white"
          : "hidden w-72 shrink-0 border-r border-[var(--border)] bg-white xl:flex xl:flex-col"
      }`}
    >
      <div className="border-b border-[var(--border)] px-6 py-7">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--primary)]">
          OrbitOps
        </p>

        <h2 className="mt-3 text-[2rem] font-bold leading-none text-[var(--foreground)]">
          Workspace
        </h2>

        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Neo Mint SaaS Platform
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-[0_10px_30px_rgba(18,185,129,0.22)]"
                  : "text-[var(--foreground)]/75 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-[1.5rem] bg-[var(--gradient-primary)] p-5 text-white shadow-[0_16px_40px_rgba(17,181,216,0.22)]">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-sm text-white/90">
            Unlock advanced analytics, billing controls and permissions.
          </p>

          <button className="mt-4 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}