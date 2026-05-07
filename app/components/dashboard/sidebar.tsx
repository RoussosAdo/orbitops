"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Settings,
  SquareCheckBig,
  Users,
  WalletCards,
} from "lucide-react";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Briefcase },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Tasks", href: "/dashboard/tasks", icon: SquareCheckBig },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Billing", href: "/dashboard/billing", icon: WalletCards },
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
          ? "flex h-full w-[88vw] max-w-80 flex-col bg-[#fcfdff]"
          : "hidden w-[276px] shrink-0 border-r border-[var(--border)] bg-[#fcfdff] xl:flex xl:flex-col"
      }`}
    >
      <div className="px-5 pb-5 pt-6">
        <div className="rounded-[1.6rem] border border-[var(--border)] bg-white px-4 py-4 shadow-[var(--shadow-xs)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-base font-bold text-white shadow-[var(--shadow-sm)]">
              O
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                OrbitOps
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Workspace platform
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.6rem] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-5 shadow-[var(--shadow-xs)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Current workspace
          </p>

          <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            Workspace
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            Manage clients, projects, tasks and billing in one place.
          </p>
        </div>
      </div>

      <div className="px-5">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
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
              prefetch={true}
              onClick={onNavigate}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                isActive
                  ? "bg-[var(--foreground)] text-white shadow-[var(--shadow-md)]"
                  : "text-[var(--foreground)] hover:bg-white hover:shadow-[var(--shadow-xs)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                    isActive
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:border-[var(--primary-light)] group-hover:text-[var(--primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold">{item.label}</span>
              </div>

              <span
                className={`h-2 w-2 rounded-full transition ${
                  isActive
                    ? "bg-white"
                    : "bg-[var(--border-strong)] group-hover:bg-[var(--primary-light)]"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 pt-0">
        <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="bg-[linear-gradient(135deg,rgba(109,94,252,0.10)_0%,rgba(79,70,229,0.06)_100%)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Need more control?
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Upgrade for deeper analytics, permissions and advanced billing visibility.
            </p>
          </div>

          <div className="p-4 pt-0">
            <button className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}