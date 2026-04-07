import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("🌱 Seeding started...");
  console.log("DB:", process.env.DATABASE_URL);

  // 1) Clean in safe order
  await prisma.invitation.deleteMany();
  console.log("Deleted invitations");

  await prisma.session.deleteMany();
  console.log("Deleted sessions");

  await prisma.account.deleteMany();
  console.log("Deleted accounts");

  await prisma.membership.deleteMany();
  console.log("Deleted memberships");

  await prisma.invoice.deleteMany();
  console.log("Deleted invoices");

  await prisma.billingProfile.deleteMany();
  console.log("Deleted billing profiles");

  await prisma.task.deleteMany();
  console.log("Deleted tasks");

  await prisma.project.deleteMany();
  console.log("Deleted projects");

  await prisma.client.deleteMany();
  console.log("Deleted clients");

  await prisma.workspaceSettings.deleteMany();
  console.log("Deleted workspace settings");

  await prisma.workspace.deleteMany();
  console.log("Deleted workspaces");

  // 2) Workspace first
  const workspace = await prisma.workspace.create({
    data: {
      name: "OrbitOps Workspace",
    },
  });
  console.log("Inserted workspace");

  // 3) Optional owner membership if user already exists
  const ownerUser = await prisma.user.findUnique({
    where: { email: "roussos.ado@gmail.com" },
  });

  if (ownerUser) {
    await prisma.membership.create({
      data: {
        userId: ownerUser.id,
        workspaceId: workspace.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    });
    console.log("Inserted owner membership");
  } else {
    console.log("Skipped owner membership because user does not exist yet");
  }

  // 4) Settings
  await prisma.workspaceSettings.create({
    data: {
      workspaceId: workspace.id,
      workspaceName: "OrbitOps Workspace",
      companyEmail: "hello@orbitops.app",
      timezone: "Europe/Athens",
      brandColor: "Neo Mint",
      emailNotifications: true,
      productUpdates: true,
      weeklyReports: false,
    },
  });
  console.log("Inserted workspace settings");

  // 5) Clients
  const client1 = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: "Aether Labs",
      company: "Aether Labs Ltd",
      email: "contact@aetherlabs.io",
      status: "Active",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: "Nova Studio",
      company: "Nova Studio",
      email: "team@novastudio.dev",
      status: "Pending",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: "Helio Systems",
      company: "Helio Systems",
      email: "hello@heliosystems.com",
      status: "Active",
    },
  });

  const client4 = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: "Vertex Finance",
      company: "Vertex Finance",
      email: "ops@vertexfinance.co",
      status: "Inactive",
    },
  });

  console.log("Inserted clients");

  // 6) Projects
  const project1 = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId: client1.id,
      name: "Orbit Analytics",
      description:
        "Internal analytics workspace for reporting, insights and KPI monitoring.",
      status: "In Progress",
      progress: 74,
      budget: "$12,400",
      dueDate: "Sep 28, 2026",
      team: "4 members",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId: client2.id,
      name: "Client Portal",
      description:
        "Secure portal for clients to access deliverables, invoices and updates.",
      status: "Planning",
      progress: 21,
      budget: "$8,200",
      dueDate: "Oct 14, 2026",
      team: "3 members",
    },
  });

  const project3 = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId: client3.id,
      name: "Finance Sync",
      description:
        "Automated billing and finance sync system for monthly reporting.",
      status: "Completed",
      progress: 100,
      budget: "$16,900",
      dueDate: "Aug 30, 2026",
      team: "5 members",
    },
  });

  console.log("Inserted projects");

  // 7) Tasks
  await prisma.task.createMany({
    data: [
      {
        workspaceId: workspace.id,
        projectId: project1.id,
        title: "Design landing page UI",
        priority: "High",
        dueDate: "Sep 12",
        completed: false,
      },
      {
        workspaceId: workspace.id,
        projectId: project2.id,
        title: "Fix billing API integration",
        priority: "High",
        dueDate: "Sep 10",
        completed: true,
      },
      {
        workspaceId: workspace.id,
        projectId: project1.id,
        title: "Update dashboard analytics",
        priority: "Medium",
        dueDate: "Sep 18",
        completed: false,
      },
      {
        workspaceId: workspace.id,
        projectId: project3.id,
        title: "Client feedback review",
        priority: "Low",
        dueDate: "Sep 22",
        completed: false,
      },
    ],
  });
  console.log("Inserted tasks");

  // 8) Billing profile
  const billingProfile = await prisma.billingProfile.create({
    data: {
      workspaceId: workspace.id,
      planName: "Pro Workspace",
      billingCycle: "Monthly",
      status: "Active",
      cardBrand: "Visa",
      cardLast4: "4242",
      currentPeriod: "Apr 1, 2026 - Apr 30, 2026",
      monthlyPrice: 29,
      seatsUsed: 3,
      seatsIncluded: 10,
      projectsUsed: 3,
      projectsIncluded: 15,
    },
  });
  console.log("Inserted billing profile");

  // 9) Invoices
  await prisma.invoice.createMany({
    data: [
      {
        workspaceId: workspace.id,
        billingProfileId: billingProfile.id,
        clientId: client1.id,
        invoiceNo: "INV-2026-001",
        amount: 29,
        status: "Paid",
        issuedDate: "Apr 1, 2026",
        dueDate: "Apr 1, 2026",
      },
      {
        workspaceId: workspace.id,
        billingProfileId: billingProfile.id,
        clientId: client2.id,
        invoiceNo: "INV-2026-002",
        amount: 29,
        status: "Paid",
        issuedDate: "Mar 1, 2026",
        dueDate: "Mar 1, 2026",
      },
      {
        workspaceId: workspace.id,
        billingProfileId: billingProfile.id,
        clientId: client4.id,
        invoiceNo: "INV-2026-003",
        amount: 29,
        status: "Pending",
        issuedDate: "May 1, 2026",
        dueDate: "May 1, 2026",
      },
    ],
  });
  console.log("Inserted invoices");

  console.log("✅ Seeding finished successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });