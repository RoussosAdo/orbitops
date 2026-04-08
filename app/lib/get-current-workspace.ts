import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function getCurrentWorkspace() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

  if (activeWorkspaceId) {
    const selectedMembership = await prisma.membership.findFirst({
      where: {
        workspaceId: activeWorkspaceId,
        status: "ACTIVE",
        user: {
          email: session.user.email.toLowerCase(),
        },
      },
      include: {
        workspace: true,
      },
    });

    if (selectedMembership) {
      return selectedMembership.workspace;
    }
  }

  const fallbackMembership = await prisma.membership.findFirst({
    where: {
      status: "ACTIVE",
      user: {
        email: session.user.email.toLowerCase(),
      },
    },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!fallbackMembership) {
    return null;
  }

  return fallbackMembership.workspace;
}

export async function requireCurrentWorkspace() {
  const workspace = await getCurrentWorkspace();

  if (!workspace) {
    throw new Error("No active workspace found for current user.");
  }

  return workspace;
}

export async function getUserWorkspaces() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return [];
  }

  const memberships = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      user: {
        email: session.user.email.toLowerCase(),
      },
    },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return memberships.map((membership) => ({
    membershipId: membership.id,
    workspaceId: membership.workspace.id,
    workspaceName: membership.workspace.name,
    role: membership.role,
  }));
}