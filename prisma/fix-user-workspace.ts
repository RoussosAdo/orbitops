import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function main() {
  const email = "roussos.ado@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: true,
    },
  });

  if (!user) {
    throw new Error(`User with email ${email} was not found.`);
  }

  if (user.memberships.length > 0) {
    console.log("User already has membership. No fix needed.");
    return;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: user.name ? `${user.name}'s Workspace` : "My Workspace",
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
      workspaceName: user.name ? `${user.name}'s Workspace` : "My Workspace",
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

  console.log("Workspace fix completed successfully.");
  console.log({
    userId: user.id,
    email: user.email,
    workspaceId: workspace.id,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Fix failed:");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });