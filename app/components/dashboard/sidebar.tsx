"use client";

import Image from "next/image";
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
import type { AppLanguage } from "@/app/lib/i18n";
import { dashboardCopy } from "@/app/lib/i18n";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
  language: AppLanguage;
};

const navItems = [
  { labelKey: "overview", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "clients", href: "/dashboard/clients", icon: Briefcase },
  { labelKey: "projects", href: "/dashboard/projects", icon: FolderKanban },
  { labelKey: "tasks", href: "/dashboard/tasks", icon: SquareCheckBig },
  { labelKey: "team", href: "/dashboard/team", icon: Users },
  { labelKey: "billing", href: "/dashboard/billing", icon: WalletCards },
  { labelKey: "settings", href: "/dashboard/settings", icon: Settings },
] as const;

export default function Sidebar({
  isMobile = false,
  onNavigate,
  language,
}: SidebarProps) {
  const pathname = usePathname();
  const copy = dashboardCopy[language];

  return (
    <aside
      className={`${
        isMobile
          ? "flex min-h-full w-full flex-col overflow-y-auto bg-[#fcfdff]"
          : "hidden h-screen w-[276px] shrink-0 border-r border-[var(--border)] bg-[#fcfdff] xl:sticky xl:top-0 xl:flex xl:flex-col"
      }`}
    >
      <div className="px-4 pb-3 pt-4 sm:px-5">
        <div className="rounded-[1.35rem] border border-[var(--border)] bg-white px-4 py-3 shadow-[var(--shadow-xs)]">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
              <Image
                src="/orbitops-logo.png"
                alt="OrbitOps logo"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                OrbitOps
              </p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">
                {copy.brandSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[1.35rem] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-4 shadow-[var(--shadow-xs)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {copy.currentWorkspace}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {copy.workspaceTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            {copy.workspaceDescription}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {copy.mainMenu}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3 sm:px-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const Icon = item.icon;
          const label = copy.nav[item.labelKey];

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={onNavigate}
              className={`group flex items-center justify-between rounded-2xl px-4 py-2.5 transition ${
                isActive
                  ? "bg-[var(--foreground)] text-white shadow-[var(--shadow-md)]"
                  : "text-[var(--foreground)] hover:bg-white hover:shadow-[var(--shadow-xs)]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                    isActive
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:border-[var(--primary-light)] group-hover:text-[var(--primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="truncate text-sm font-semibold">{label}</span>
              </div>

              <span
                className={`ml-3 h-2 w-2 shrink-0 rounded-full transition ${
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
        <div className="overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="bg-[linear-gradient(135deg,rgba(109,94,252,0.10)_0%,rgba(79,70,229,0.06)_100%)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {copy.upgradeTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {copy.upgradeDescription}
            </p>
          </div>

          <div className="p-4 pt-0">
            <button className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black">
              {copy.upgradeButton}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}