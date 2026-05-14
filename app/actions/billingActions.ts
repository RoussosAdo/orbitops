"use server";

import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type BillingCycle = "Monthly" | "Yearly";

type PlanConfig = {
  price: {
    Monthly: number;
    Yearly: number;
  };
  seatsIncluded: number;
  projectsIncluded: number;
  priceId: {
    Monthly?: string;
    Yearly?: string;
  };
};

const planConfig: Record<string, PlanConfig> = {
  Free: {
    price: {
      Monthly: 0,
      Yearly: 0,
    },
    seatsIncluded: 1,
    projectsIncluded: 3,
    priceId: {},
  },
  Starter: {
    price: {
      Monthly: 15,
      Yearly: 144,
    },
    seatsIncluded: 3,
    projectsIncluded: 10,
    priceId: {
      Monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
      Yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
    },
  },
  "Pro Workspace": {
    price: {
      Monthly: 29,
      Yearly: 288,
    },
    seatsIncluded: 10,
    projectsIncluded: 25,
    priceId: {
      Monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      Yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
  },
  Enterprise: {
    price: {
      Monthly: 99,
      Yearly: 948,
    },
    seatsIncluded: 100,
    projectsIncluded: 500,
    priceId: {
      Monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      Yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    },
  },
};

function normalizeBillingCycle(value: string): BillingCycle {
  return value === "Yearly" ? "Yearly" : "Monthly";
}

function getPlanPrice(plan: PlanConfig, billingCycle: BillingCycle) {
  return plan.price[billingCycle];
}

function getStripePriceId(plan: PlanConfig, billingCycle: BillingCycle) {
  return plan.priceId[billingCycle];
}

function getCleanAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL in environment variables.");
  }

  return appUrl.replace(/\/$/, "");
}

export async function updateBillingPlan(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const planName = String(formData.get("planName") ?? "").trim();
  const billingCycle = normalizeBillingCycle(
    String(formData.get("billingCycle") ?? "").trim()
  );

  const selectedPlan = planConfig[planName];

  if (!selectedPlan) {
    throw new Error("Invalid billing plan selected.");
  }

  await prisma.billingProfile.upsert({
    where: {
      workspaceId: workspace.id,
    },
    update: {
      planName,
      billingCycle,
      monthlyPrice: getPlanPrice(selectedPlan, billingCycle),
      seatsIncluded: selectedPlan.seatsIncluded,
      projectsIncluded: selectedPlan.projectsIncluded,
      status: planName === "Free" ? "Free" : "Active",
      cardBrand: planName === "Free" ? "-" : "Stripe",
      cardLast4: planName === "Free" ? "-" : "Active",
      currentPeriod: planName === "Free" ? "Free plan" : "Active subscription",
      currentPeriodEnd: null,
      stripeCustomerId: planName === "Free" ? null : undefined,
      stripeSubscriptionId: planName === "Free" ? null : undefined,
      stripePriceId: planName === "Free" ? null : undefined,
    },
    create: {
      workspaceId: workspace.id,
      planName,
      billingCycle,
      monthlyPrice: getPlanPrice(selectedPlan, billingCycle),
      seatsUsed: 0,
      seatsIncluded: selectedPlan.seatsIncluded,
      projectsUsed: 0,
      projectsIncluded: selectedPlan.projectsIncluded,
      status: planName === "Free" ? "Free" : "Active",
      cardBrand: planName === "Free" ? "-" : "Stripe",
      cardLast4: planName === "Free" ? "-" : "Active",
      currentPeriod: planName === "Free" ? "Free plan" : "Active subscription",
      currentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
    },
  });

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");
}

export async function createCheckoutSession(formData: FormData) {
  const workspace = await requireCurrentWorkspace();
  const session = await getServerSession(authOptions);

  const planName = String(formData.get("planName") ?? "").trim();
  const billingCycle = normalizeBillingCycle(
    String(formData.get("billingCycle") ?? "").trim()
  );

  const selectedPlan = planConfig[planName];

  if (!selectedPlan) {
    throw new Error("Invalid billing plan selected.");
  }

  const existingProfile = await prisma.billingProfile.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (
    existingProfile?.planName === planName &&
    existingProfile?.billingCycle === billingCycle &&
    existingProfile?.status === "Active"
  ) {
    redirect("/dashboard/billing?checkout=current");
  }

  if (planName === "Free") {
    await updateBillingPlan(formData);
    redirect("/dashboard/billing?checkout=free");
  }

  const priceId = getStripePriceId(selectedPlan, billingCycle);

  if (!priceId) {
    throw new Error(
      `Missing Stripe price id for ${planName} ${billingCycle}. Add it in your .env file.`
    );
  }

  const cleanAppUrl = getCleanAppUrl();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existingProfile?.stripeCustomerId ?? undefined,
    customer_email: existingProfile?.stripeCustomerId
      ? undefined
      : session?.user?.email ?? undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${cleanAppUrl}/dashboard/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${cleanAppUrl}/dashboard/billing?checkout=cancelled`,
    metadata: {
      workspaceId: workspace.id,
      planName,
      billingCycle,
    },
    subscription_data: {
      metadata: {
        workspaceId: workspace.id,
        planName,
        billingCycle,
      },
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe checkout session URL was not created.");
  }

  redirect(checkoutSession.url);
}

export async function createBillingPortalSession() {
  const workspace = await requireCurrentWorkspace();

  const profile = await prisma.billingProfile.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (!profile?.stripeCustomerId) {
    redirect("/dashboard/billing?checkout=no-customer");
  }

  const cleanAppUrl = getCleanAppUrl();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripeCustomerId,
    return_url: `${cleanAppUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}