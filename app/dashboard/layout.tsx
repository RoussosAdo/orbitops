import type { ReactNode } from "react";
import DashboardShell from "@/app/components/dashboard/dashboard-shell";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getCurrentLanguage } from "@/app/lib/language";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getBrandThemeStyles } from "@/app/lib/brand-theme";

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

  const [language, workspace] = await Promise.all([
    getCurrentLanguage(),
    requireCurrentWorkspace(),
  ]);

  const settings = await prisma.workspaceSettings.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  const brandThemeStyles = getBrandThemeStyles(settings?.brandColor);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[var(--background)]"
      style={brandThemeStyles}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[var(--brand-page-bg)]" />

      <div className="pointer-events-none fixed left-[-10rem] top-[-10rem] -z-10 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-12rem] right-[-10rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-[var(--primary-light)]/20 blur-3xl" />

      <DashboardShell language={language}>{children}</DashboardShell>
    </div>
  );
}