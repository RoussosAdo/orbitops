"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

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
    throw new Error("All settings fields are required.");
  }

  const settings = await prisma.workspaceSettings.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (!settings) {
    throw new Error("Workspace settings not found.");
  }

  await prisma.workspaceSettings.update({
    where: { workspaceId: workspace.id },
    data: {
      workspaceName,
      companyEmail,
      timezone,
      brandColor,
      emailNotifications,
      productUpdates,
      weeklyReports,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}