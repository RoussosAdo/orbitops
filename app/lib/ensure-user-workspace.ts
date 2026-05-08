import "server-only";
import { prisma } from "@/app/lib/prisma";

type EnsureUserWorkspaceParams = {
  email: string;
  name?: string | null;
};

export async function ensureUserWorkspace({
  email,
  name,
}: EnsureUserWorkspaceParams) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      memberships: {
        where: {
          status: "ACTIVE",
        },
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  if (user.memberships.length > 0) {
    return user;
  }

  const workspaceName = name?.trim()
    ? `${name.trim()}'s Workspace`
    : "My Workspace";

  const workspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  await prisma.workspaceSettings.create({
    data: {
      workspaceId: workspace.id,
      workspaceName: workspaceName,
      companyEmail: user.email ?? "hello@orbitops.app",
      timezone: "Europe/Athens",
      brandColor: "Neo Mint",
      emailNotifications: true,
      productUpdates: true,
      weeklyReports: false,
    },
  });

  await prisma.billingProfile.create({
    data: {
      workspaceId: workspace.id,
      planName: "Free",
      billingCycle: "Monthly",
      status: "Active",
      cardBrand: "-",
      cardLast4: "0000",
      currentPeriod: "No billing yet",
      monthlyPrice: 0,
      seatsUsed: 1,
      seatsIncluded: 1,
      projectsUsed: 0,
      projectsIncluded: 3,
    },
  });

  return prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      memberships: {
        where: {
          status: "ACTIVE",
        },
        include: {
          workspace: true,
        },
      },
    },
  });
}