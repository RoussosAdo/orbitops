"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export async function updateBillingPlan(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const planName = String(formData.get("planName") ?? "").trim();
  const billingCycle = String(formData.get("billingCycle") ?? "").trim();

  if (!planName || !billingCycle) {
    throw new Error("Plan and billing cycle are required.");
  }

  const existingProfile = await prisma.billingProfile.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (!existingProfile) {
    throw new Error("Billing profile not found for current workspace.");
  }

  const planConfig: Record<
    string,
    { monthlyPrice: number; seatsIncluded: number; projectsIncluded: number }
  > = {
    Free: {
      monthlyPrice: 0,
      seatsIncluded: 1,
      projectsIncluded: 3,
    },
    Starter: {
      monthlyPrice: billingCycle === "Yearly" ? 12 : 15,
      seatsIncluded: 3,
      projectsIncluded: 10,
    },
    "Pro Workspace": {
      monthlyPrice: billingCycle === "Yearly" ? 24 : 29,
      seatsIncluded: 10,
      projectsIncluded: 25,
    },
    Enterprise: {
      monthlyPrice: billingCycle === "Yearly" ? 79 : 99,
      seatsIncluded: 100,
      projectsIncluded: 500,
    },
  };

  const selectedPlan = planConfig[planName];

  if (!selectedPlan) {
    throw new Error("Invalid billing plan selected.");
  }

  await prisma.billingProfile.update({
    where: {
      workspaceId: workspace.id,
    },
    data: {
      planName,
      billingCycle,
      monthlyPrice: selectedPlan.monthlyPrice,
      seatsIncluded: selectedPlan.seatsIncluded,
      projectsIncluded: selectedPlan.projectsIncluded,
      status: "Active",
    },
  });

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");
}