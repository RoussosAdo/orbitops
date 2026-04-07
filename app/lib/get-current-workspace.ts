import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function getCurrentWorkspace() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const membership = await prisma.membership.findFirst({
    where: {
      user: {
        email: session.user.email,
      },
      status: "ACTIVE",
    },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!membership) {
    return null;
  }

  return membership.workspace;
}

export async function requireCurrentWorkspace() {
  const workspace = await getCurrentWorkspace();

  if (!workspace) {
    throw new Error("No active workspace found for current user.");
  }

  return workspace;
}