import type { ReactNode } from "react";
import DashboardShell from "@/app/components/dashboard/dashboard-shell";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getCurrentLanguage } from "@/app/lib/language";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const language = await getCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardShell language={language}>{children}</DashboardShell>
    </div>
  );
}