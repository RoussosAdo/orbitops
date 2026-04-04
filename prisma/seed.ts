import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("🌱 Seeding started...");
  console.log("DB:", process.env.DATABASE_URL);

  await prisma.client.deleteMany();
  console.log("Deleted clients");

  await prisma.project.deleteMany();
  console.log("Deleted projects");

  await prisma.task.deleteMany();
  console.log("Deleted tasks");

  await prisma.client.createMany({
    data: [
      {
        name: "Aether Labs",
        company: "Aether Labs Ltd",
        email: "contact@aetherlabs.io",
        status: "Active",
      },
      {
        name: "Nova Studio",
        company: "Nova Studio",
        email: "team@novastudio.dev",
        status: "Pending",
      },
      {
        name: "Helio Systems",
        company: "Helio Systems",
        email: "hello@heliosystems.com",
        status: "Active",
      },
      {
        name: "Vertex Finance",
        company: "Vertex Finance",
        email: "ops@vertexfinance.co",
        status: "Inactive",
      },
    ],
  });
  console.log("Inserted clients");

  await prisma.project.createMany({
    data: [
      {
        name: "Orbit Analytics",
        description:
          "Internal analytics workspace for reporting, insights and KPI monitoring.",
        status: "In Progress",
        progress: 74,
        budget: "$12,400",
        dueDate: "Sep 28, 2026",
        team: "4 members",
      },
      {
        name: "Client Portal",
        description:
          "Secure portal for clients to access deliverables, invoices and updates.",
        status: "Planning",
        progress: 21,
        budget: "$8,200",
        dueDate: "Oct 14, 2026",
        team: "3 members",
      },
      {
        name: "Finance Sync",
        description:
          "Automated billing and finance sync system for monthly reporting.",
        status: "Completed",
        progress: 100,
        budget: "$16,900",
        dueDate: "Aug 30, 2026",
        team: "5 members",
      },
    ],
  });
  console.log("Inserted projects");

  await prisma.task.createMany({
    data: [
      {
        title: "Design landing page UI",
        priority: "High",
        dueDate: "Sep 12",
        completed: false,
      },
      {
        title: "Fix billing API integration",
        priority: "High",
        dueDate: "Sep 10",
        completed: true,
      },
      {
        title: "Update dashboard analytics",
        priority: "Medium",
        dueDate: "Sep 18",
        completed: false,
      },
      {
        title: "Client feedback review",
        priority: "Low",
        dueDate: "Sep 22",
        completed: false,
      },
    ],
  });
  console.log("Inserted tasks");

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