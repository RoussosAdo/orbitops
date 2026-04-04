"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const status = String(formData.get("status") ?? "Active").trim();

  if (!name || !company || !email) {
    return;
  }

  await prisma.client.create({
    data: {
      name,
      company,
      email,
      status,
    },
  });

  revalidatePath("/dashboard/clients");
}