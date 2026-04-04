"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBillingPlan(formData: FormData) {
  const planName = String(formData.get("planName") ?? "").trim();
  const billingCycle = String(formData.get("billingCycle") ?? "").trim();

  const profile = await prisma.billingProfile.findFirst();

  if (!profile || !planName || !billingCycle) return;

  await prisma.billingProfile.update({
    where: { id: profile.id },
    data: {
      planName,
      billingCycle,
    },
  });

  revalidatePath("/dashboard/billing");
}