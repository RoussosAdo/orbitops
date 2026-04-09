"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export async function updateMemberRole(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const membershipId = String(formData.get("membershipId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim().toUpperCase();

  if (!membershipId || !role) {
    throw new Error("Membership id and role are required.");
  }

  const allowedRoles = new Set(["OWNER", "ADMIN", "MEMBER"]);

  if (!allowedRoles.has(role)) {
    throw new Error("Invalid role.");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      id: membershipId,
      workspaceId: workspace.id,
    },
  });

  if (!membership) {
    throw new Error("Member not found in current workspace.");
  }

  if (membership.role === "OWNER" && role !== "OWNER") {
    const ownersCount = await prisma.membership.count({
      where: {
        workspaceId: workspace.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    });

    if (ownersCount <= 1) {
      throw new Error("You cannot demote the last owner.");
    }
  }

  await prisma.membership.update({
    where: {
      id: membershipId,
    },
    data: {
      role,
    },
  });

  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard");
}

export async function removeMember(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const membershipId = String(formData.get("membershipId") ?? "").trim();

  if (!membershipId) {
    throw new Error("Membership id is required.");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      id: membershipId,
      workspaceId: workspace.id,
    },
  });

  if (!membership) {
    throw new Error("Member not found in current workspace.");
  }

  if (membership.role === "OWNER") {
    const ownersCount = await prisma.membership.count({
      where: {
        workspaceId: workspace.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    });

    if (ownersCount <= 1) {
      throw new Error("You cannot remove the last owner.");
    }
  }

  await prisma.membership.delete({
    where: {
      id: membershipId,
    },
  });

  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard");
}

export async function revokeInvitation(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const invitationId = String(formData.get("invitationId") ?? "").trim();

  if (!invitationId) {
    throw new Error("Invitation id is required.");
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: invitationId,
      workspaceId: workspace.id,
    },
  });

  if (!invitation) {
    throw new Error("Invitation not found in current workspace.");
  }

  await prisma.invitation.delete({
    where: {
      id: invitationId,
    },
  });

  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard");
}