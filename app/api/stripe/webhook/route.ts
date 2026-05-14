import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

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

function getPlanPrice(planName: string, billingCycle: BillingCycle) {
  const plan = planConfig[planName];

  if (!plan) return 0;

  return plan.price[billingCycle];
}

function getStripeStatusLabel(status: string) {
  if (status === "active" || status === "trialing") return "Active";
  if (status === "past_due") return "Past Due";
  if (status === "canceled") return "Canceled";
  if (status === "unpaid") return "Unpaid";
  if (status === "incomplete") return "Incomplete";
  if (status === "incomplete_expired") return "Incomplete Expired";

  return status;
}

function formatDateFromUnix(timestamp?: number | null) {
  if (!timestamp) return "Active subscription";

  return new Date(timestamp * 1000).toLocaleDateString();
}

function dateFromUnix(timestamp?: number | null) {
  if (!timestamp) return null;

  return new Date(timestamp * 1000);
}

function findPlanByPriceId(priceId?: string | null) {
  if (!priceId) return null;

  for (const [planName, config] of Object.entries(planConfig)) {
    if (config.priceId.Monthly === priceId) {
      return {
        planName,
        billingCycle: "Monthly" as BillingCycle,
        config,
      };
    }

    if (config.priceId.Yearly === priceId) {
      return {
        planName,
        billingCycle: "Yearly" as BillingCycle,
        config,
      };
    }
  }

  return null;
}

async function updateBillingFromSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method", "items.data.price"],
  });

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? null;
  const planFromPrice = findPlanByPriceId(priceId);

  const workspaceId = subscription.metadata?.workspaceId;
  const planName = subscription.metadata?.planName ?? planFromPrice?.planName;
  const billingCycle =
    (subscription.metadata?.billingCycle as BillingCycle | undefined) ??
    planFromPrice?.billingCycle;

  if (!workspaceId || !planName || !billingCycle) {
    console.error("Missing subscription metadata:", {
      workspaceId,
      planName,
      billingCycle,
      priceId,
      subscriptionId,
    });

    return;
  }

  const selectedPlan = planConfig[planName];

  if (!selectedPlan) {
    console.error("Invalid plan from subscription:", planName);
    return;
  }

  const defaultPaymentMethod =
    typeof subscription.default_payment_method === "object"
      ? subscription.default_payment_method
      : null;

  const cardBrand = defaultPaymentMethod?.card?.brand
    ? defaultPaymentMethod.card.brand.toUpperCase()
    : "Stripe";

  const cardLast4 = defaultPaymentMethod?.card?.last4 ?? "Active";

  const subscriptionWithPeriod = subscription as Stripe.Subscription & {
    current_period_end?: number;
  };

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  await prisma.billingProfile.upsert({
    where: {
      workspaceId,
    },
    update: {
      planName,
      billingCycle,
      monthlyPrice: getPlanPrice(planName, billingCycle),
      seatsIncluded: selectedPlan.seatsIncluded,
      projectsIncluded: selectedPlan.projectsIncluded,
      status: getStripeStatusLabel(subscription.status),
      cardBrand,
      cardLast4,
      currentPeriod: formatDateFromUnix(
        subscriptionWithPeriod.current_period_end
      ),
      currentPeriodEnd: dateFromUnix(subscriptionWithPeriod.current_period_end),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
    },
    create: {
      workspaceId,
      planName,
      billingCycle,
      monthlyPrice: getPlanPrice(planName, billingCycle),
      seatsUsed: 0,
      seatsIncluded: selectedPlan.seatsIncluded,
      projectsUsed: 0,
      projectsIncluded: selectedPlan.projectsIncluded,
      status: getStripeStatusLabel(subscription.status),
      cardBrand,
      cardLast4,
      currentPeriod: formatDateFromUnix(
        subscriptionWithPeriod.current_period_end
      ),
      currentPeriodEnd: dateFromUnix(subscriptionWithPeriod.current_period_end),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
    },
  });

  console.log("Billing profile synced from Stripe subscription:", {
    workspaceId,
    planName,
    billingCycle,
    subscriptionId,
    priceId,
    customerId,
  });
}

async function createPaidInvoiceFromStripeInvoice(stripeInvoice: Stripe.Invoice) {
  const invoiceAny = stripeInvoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null;
  };

  const subscriptionId =
    typeof invoiceAny.subscription === "string"
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id ?? null;

  if (!subscriptionId) {
    console.warn("Stripe invoice has no subscription id:", stripeInvoice.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const workspaceId = subscription.metadata?.workspaceId;

  if (!workspaceId) {
    console.error("Missing workspaceId on subscription metadata:", {
      subscriptionId,
      invoiceId: stripeInvoice.id,
    });

    return;
  }

  const billingProfile = await prisma.billingProfile.findUnique({
    where: {
      workspaceId,
    },
  });

  const amountPaid = Math.round((stripeInvoice.amount_paid ?? 0) / 100);
  const invoiceNo = `STRIPE-${stripeInvoice.id}`;

  await prisma.invoice.upsert({
    where: {
      stripeInvoiceId: stripeInvoice.id,
    },
    update: {
      workspaceId,
      billingProfileId: billingProfile?.id ?? null,
      invoiceNo,
      amount: amountPaid,
      status: "Paid",
      issuedDate: formatDateFromUnix(stripeInvoice.created),
      dueDate: formatDateFromUnix(stripeInvoice.created),
    },
    create: {
      workspaceId,
      billingProfileId: billingProfile?.id ?? null,
      stripeInvoiceId: stripeInvoice.id,
      invoiceNo,
      amount: amountPaid,
      status: "Paid",
      issuedDate: formatDateFromUnix(stripeInvoice.created),
      dueDate: formatDateFromUnix(stripeInvoice.created),
    },
  });

  console.log("Stripe invoice synced:", {
    workspaceId,
    invoiceNo,
    amountPaid,
  });
}

async function downgradeWorkspaceToFree(subscriptionId: string) {
  const profile = await prisma.billingProfile.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
  });

  if (!profile) {
    console.warn("No billing profile found for canceled subscription:", {
      subscriptionId,
    });
    return;
  }

  await prisma.billingProfile.update({
    where: {
      workspaceId: profile.workspaceId,
    },
    data: {
      planName: "Free",
      billingCycle: "Monthly",
      monthlyPrice: 0,
      seatsIncluded: 1,
      projectsIncluded: 3,
      status: "Free",
      cardBrand: "-",
      cardLast4: "-",
      currentPeriod: "Free plan",
      currentPeriodEnd: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
    },
  });

  console.log("Workspace downgraded to Free:", {
    workspaceId: profile.workspaceId,
    subscriptionId,
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const subscriptionId =
        typeof checkoutSession.subscription === "string"
          ? checkoutSession.subscription
          : checkoutSession.subscription?.id ?? null;

      if (subscriptionId) {
        await updateBillingFromSubscription(subscriptionId);
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;

      await updateBillingFromSubscription(subscription.id);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await downgradeWorkspaceToFree(subscription.id);
    }

    if (
      event.type === "invoice.payment_succeeded" ||
      event.type === "invoice.paid"
    ) {
      const stripeInvoice = event.data.object as Stripe.Invoice;

      await createPaidInvoiceFromStripeInvoice(stripeInvoice);

      const invoiceAny = stripeInvoice as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null;
      };

      const subscriptionId =
        typeof invoiceAny.subscription === "string"
          ? invoiceAny.subscription
          : invoiceAny.subscription?.id ?? null;

      if (subscriptionId) {
        await updateBillingFromSubscription(subscriptionId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler failed:", error);

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}