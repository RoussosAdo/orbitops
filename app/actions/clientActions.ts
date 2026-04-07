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

export async function updateClient(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const clientId = String(formData.get("clientId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "Active").trim();

  if (!clientId || !name || !company || !email) {
    throw new Error("Client id, name, company and email are required.");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId: workspace.id,
    },
  });

  if (!existingClient) {
    throw new Error("Client not found in current workspace.");
  }

  const duplicateEmail = await prisma.client.findFirst({
    where: {
      workspaceId: workspace.id,
      email,
      NOT: {
        id: clientId,
      },
    },
  });

  if (duplicateEmail) {
    throw new Error("Another client with this email already exists in this workspace.");
  }

  await prisma.client.update({
    where: {
      id: clientId,
    },
    data: {
      name,
      company,
      email,
      status,
    },
  });

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}

export async function deleteClient(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const clientId = String(formData.get("clientId") ?? "").trim();

  if (!clientId) {
    throw new Error("Client id is required.");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId: workspace.id,
    },
  });

  if (!existingClient) {
    throw new Error("Client not found in current workspace.");
  }

  await prisma.client.delete({
    where: {
      id: clientId,
    },
  });

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}