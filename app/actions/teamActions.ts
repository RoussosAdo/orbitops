"use server";

import type { TeamActionState } from "@/app/types/team";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

async function getActorMembership(workspaceId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.membership.findFirst({
    where: {
      workspaceId,
      status: "ACTIVE",
      user: {
        email: session.user.email.toLowerCase(),
      },
    },
    include: {
      user: true,
    },
  });
}

function canManageTeam(role: string) {
  return role === "OWNER" || role === "ADMIN";
}

export async function updateMemberRole(
  _prevState: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  try {
    const workspace = await requireCurrentWorkspace();
    const actorMembership = await getActorMembership(workspace.id);

    if (!actorMembership) {
      return {
        ok: false,
        message: "You must be signed in to manage team members.",
      };
    }

    if (!canManageTeam(actorMembership.role)) {
      return {
        ok: false,
        message: "You do not have permission to manage team members.",
      };
    }

    const membershipId = String(formData.get("membershipId") ?? "").trim();
    const role = String(formData.get("role") ?? "")
      .trim()
      .toUpperCase() as WorkspaceRole;

    if (!membershipId || !role) {
      return {
        ok: false,
        message: "Membership id and role are required.",
      };
    }

    const allowedRoles = new Set<WorkspaceRole>(["OWNER", "ADMIN", "MEMBER"]);

    if (!allowedRoles.has(role)) {
      return {
        ok: false,
        message: "Invalid role.",
      };
    }

    const targetMembership = await prisma.membership.findFirst({
      where: {
        id: membershipId,
        workspaceId: workspace.id,
      },
      include: {
        user: true,
      },
    });

    if (!targetMembership) {
      return {
        ok: false,
        message: "Member not found in current workspace.",
      };
    }

    if (targetMembership.status !== "ACTIVE") {
      return {
        ok: false,
        message: "Only active members can be updated.",
      };
    }

    const actorIsAdmin = actorMembership.role === "ADMIN";
    const targetIsOwner = targetMembership.role === "OWNER";
    const targetIsSelf = targetMembership.id === actorMembership.id;

    if (targetIsSelf) {
      return {
        ok: false,
        message: "You cannot change your own role.",
      };
    }

    if (actorIsAdmin) {
      if (targetIsOwner) {
        return {
          ok: false,
          message: "Admins cannot change an owner's role.",
        };
      }

      if (role === "OWNER") {
        return {
          ok: false,
          message: "Admins cannot promote members to owner.",
        };
      }
    }

    if (targetMembership.role === "OWNER" && role !== "OWNER") {
      const ownersCount = await prisma.membership.count({
        where: {
          workspaceId: workspace.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      if (ownersCount <= 1) {
        return {
          ok: false,
          message: "You cannot demote the last owner.",
        };
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

    return {
      ok: true,
      message: "Member role updated successfully.",
    };
  } catch (error) {
    console.error("updateMemberRole error:", error);

    return {
      ok: false,
      message: "Something went wrong while updating the member role.",
    };
  }
}

export async function removeMember(
  _prevState: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  try {
    const workspace = await requireCurrentWorkspace();
    const actorMembership = await getActorMembership(workspace.id);

    if (!actorMembership) {
      return {
        ok: false,
        message: "You must be signed in to manage team members.",
      };
    }

    if (!canManageTeam(actorMembership.role)) {
      return {
        ok: false,
        message: "You do not have permission to remove team members.",
      };
    }

    const membershipId = String(formData.get("membershipId") ?? "").trim();

    if (!membershipId) {
      return {
        ok: false,
        message: "Membership id is required.",
      };
    }

    const targetMembership = await prisma.membership.findFirst({
      where: {
        id: membershipId,
        workspaceId: workspace.id,
      },
    });

    if (!targetMembership) {
      return {
        ok: false,
        message: "Member not found in current workspace.",
      };
    }

    const actorIsAdmin = actorMembership.role === "ADMIN";
    const targetIsOwner = targetMembership.role === "OWNER";
    const targetIsSelf = targetMembership.id === actorMembership.id;

    if (targetIsSelf) {
      return {
        ok: false,
        message: "You cannot remove yourself from the workspace.",
      };
    }

    if (actorIsAdmin && targetIsOwner) {
      return {
        ok: false,
        message: "Admins cannot remove an owner.",
      };
    }

    if (targetMembership.role === "OWNER") {
      const ownersCount = await prisma.membership.count({
        where: {
          workspaceId: workspace.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      if (ownersCount <= 1) {
        return {
          ok: false,
          message: "You cannot remove the last owner.",
        };
      }
    }

    await prisma.membership.delete({
      where: {
        id: membershipId,
      },
    });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Member removed successfully.",
    };
  } catch (error) {
    console.error("removeMember error:", error);

    return {
      ok: false,
      message: "Something went wrong while removing the member.",
    };
  }
}

export async function revokeInvitation(
  _prevState: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  try {
    const workspace = await requireCurrentWorkspace();
    const actorMembership = await getActorMembership(workspace.id);

    if (!actorMembership) {
      return {
        ok: false,
        message: "You must be signed in to manage invitations.",
      };
    }

    if (!canManageTeam(actorMembership.role)) {
      return {
        ok: false,
        message: "You do not have permission to revoke invitations.",
      };
    }

    const invitationId = String(formData.get("invitationId") ?? "").trim();

    if (!invitationId) {
      return {
        ok: false,
        message: "Invitation id is required.",
      };
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: invitationId,
        workspaceId: workspace.id,
      },
    });

    if (!invitation) {
      return {
        ok: false,
        message: "Invitation not found in current workspace.",
      };
    }

    if (actorMembership.role === "ADMIN" && invitation.role === "OWNER") {
      return {
        ok: false,
        message: "Admins cannot revoke owner invitations.",
      };
    }

    await prisma.invitation.delete({
      where: {
        id: invitationId,
      },
    });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Invitation revoked successfully.",
    };
  } catch (error) {
    console.error("revokeInvitation error:", error);

    return {
      ok: false,
      message: "Something went wrong while revoking the invitation.",
    };
  }
}