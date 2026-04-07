"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export async function createClient(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "Active").trim();

  if (!name || !company || !email) {
    throw new Error("Name, company and email are required.");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      workspaceId: workspace.id,
      email,
    },
  });

  if (existingClient) {
    throw new Error("A client with this email already exists in this workspace.");
  }

  await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name,
      company,
      email,
      status,
    },
  });

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}