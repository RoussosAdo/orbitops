"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Settings,
  SquareCheckBig,
  Users,
} from "lucide-react";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Tasks", href: "/dashboard/tasks", icon: SquareCheckBig },
  { label: "Team", href: "/dashboard/team", icon: BriefcaseBusiness },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
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
          ? "flex h-full w-[88vw] max-w-80 flex-col bg-[#fbfcff]"
          : "hidden w-[292px] shrink-0 border-r border-[var(--border)] bg-[#fbfcff] xl:flex xl:flex-col"
      }`}
    >
      <div className="px-6 pb-6 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-sm font-bold text-white shadow-[var(--shadow-sm)]">
            O
          </div>

          <div>
            <p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              OrbitOps
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Workspace platform
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.65rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Current workspace
          </p>

          <h2 className="mt-3 text-[1.95rem] font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            Workspace
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Manage clients, projects, tasks and billing from one operations hub.
          </p>
        </div>
      </div>

      <div className="px-4">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Main Menu
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-[0_14px_34px_rgba(109,94,252,0.24)]"
                  : "text-[var(--foreground)] hover:bg-white hover:text-[var(--foreground)] hover:shadow-[var(--shadow-xs)]"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  isActive
                    ? "bg-white/14"
                    : "bg-transparent group-hover:bg-[var(--muted)]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? "text-white"
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                  }`}
                />
              </div>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 pt-0">
        <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--gradient-soft)] p-5 shadow-[var(--shadow-xs)]">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Need more control?
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Upgrade for advanced analytics, workspace permissions and better financial visibility.
          </p>

          <button className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}