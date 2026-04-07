"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export async function createProject(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "Planning").trim();
  const progress = Number(formData.get("progress") ?? 0);
  const budget = String(formData.get("budget") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const clientIdRaw = String(formData.get("clientId") ?? "").trim();

  if (!name || !description || !budget || !dueDate || !team) {
    throw new Error("All required project fields must be filled.");
  }

  const safeProgress = Number.isNaN(progress)
    ? 0
    : Math.max(0, Math.min(100, progress));

  let clientId: string | null = null;

  if (clientIdRaw) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientIdRaw,
        workspaceId: workspace.id,
      },
    });

    if (!client) {
      throw new Error("Selected client was not found in this workspace.");
    }

    clientId = client.id;
  }

  await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId,
      name,
      description,
      status,
      progress: safeProgress,
      budget,
      dueDate,
      team,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
}