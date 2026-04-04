"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceSettings(formData: FormData) {
  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const companyEmail = String(formData.get("companyEmail") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();
  const brandColor = String(formData.get("brandColor") ?? "").trim();

  const emailNotifications = formData.get("emailNotifications") === "on";
  const productUpdates = formData.get("productUpdates") === "on";
  const weeklyReports = formData.get("weeklyReports") === "on";

  const settings = await prisma.workspaceSettings.findFirst();

  if (!settings || !workspaceName || !companyEmail || !timezone || !brandColor) {
    return;
  }

  await prisma.workspaceSettings.update({
    where: { id: settings.id },
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
}