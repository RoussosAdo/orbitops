import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function main() {
  const email = "roussos.ado@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("Found user:", user.email);

  let workspace = await prisma.workspace.findFirst();

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "OrbitOps Workspace",
      },
    });

    console.log("Created workspace:", workspace.id);
  } else {
    console.log("Existing workspace:", workspace.id);
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      workspaceId: workspace.id,
    },
  });

  if (!existingMembership) {
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    });

    console.log("Created membership:", membership.id);
  } else {
    console.log("Membership already exists:", existingMembership.id);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });