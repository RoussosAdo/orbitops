"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeamMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "Developer").trim();
  const status = String(formData.get("status") ?? "Pending").trim();

  if (!name || !email) return;

  await prisma.teamMember.create({
    data: {
      name,
      email,
      role,
      status,
    },
  });

  revalidatePath("/dashboard/team");
}

export async function deleteTeamMember(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) return;

  await prisma.teamMember.delete({
    where: { id },
  });

  revalidatePath("/dashboard/team");
}