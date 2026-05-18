"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function updateWorkspaceSettings(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const companyEmail = String(formData.get("companyEmail") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();
  const brandColor = String(formData.get("brandColor") ?? "").trim();

  const emailNotifications = formData.get("emailNotifications") === "on";
  const productUpdates = formData.get("productUpdates") === "on";
  const weeklyReports = formData.get("weeklyReports") === "on";

  if (!workspaceName || !companyEmail || !timezone || !brandColor) {
    redirect("/dashboard/settings?settings=missing-fields");
  }

  if (!isValidEmail(companyEmail)) {
    redirect("/dashboard/settings?settings=invalid-email");
  }

  await prisma.$transaction([
    prisma.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        name: workspaceName,
      },
    }),

    prisma.workspaceSettings.upsert({
      where: {
        workspaceId: workspace.id,
      },
      update: {
        workspaceName,
        companyEmail,
        timezone,
        brandColor,
        emailNotifications,
        productUpdates,
        weeklyReports,
      },
      create: {
        workspaceId: workspace.id,
        workspaceName,
        companyEmail,
        timezone,
        brandColor,
        emailNotifications,
        productUpdates,
        weeklyReports,
      },
    }),
  ]);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard/billing");

  redirect("/dashboard/settings?settings=updated");
}