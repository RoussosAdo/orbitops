import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import crypto from "crypto";
import { sendInviteEmail } from "@/app/lib/mail";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

const DEFAULT_FREE_SEAT_LIMIT = 1;

function redirectToTeam(req: Request, status?: string) {
  const url = new URL("/dashboard/team", req.url);

  if (status) {
    url.searchParams.set("team", status);
  }

  return NextResponse.redirect(url);
}

function canManageTeam(role: string) {
  return role === "OWNER" || role === "ADMIN";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const workspace = await requireCurrentWorkspace();

  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "MEMBER").trim().toUpperCase();

  if (!email) {
    return redirectToTeam(req, "missing-email");
  }

  const allowedRoles = new Set(["OWNER", "ADMIN", "MEMBER"]);

  if (!allowedRoles.has(role)) {
    return redirectToTeam(req, "invalid-role");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email.toLowerCase(),
    },
  });

  if (!currentUser) {
    return redirectToTeam(req, "no-user");
  }

  const actorMembership = await prisma.membership.findFirst({
    where: {
      userId: currentUser.id,
      workspaceId: workspace.id,
      status: "ACTIVE",
    },
  });

  if (!actorMembership) {
    return redirectToTeam(req, "no-access");
  }

  if (!canManageTeam(actorMembership.role)) {
    return redirectToTeam(req, "no-permission");
  }

  if (actorMembership.role === "ADMIN" && role === "OWNER") {
    return redirectToTeam(req, "owner-invite-blocked");
  }

  const existingMember = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      memberships: {
        where: {
          workspaceId: workspace.id,
        },
      },
    },
  });

  if (existingMember && existingMember.memberships.length > 0) {
    return redirectToTeam(req, "already-member");
  }

  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email,
      workspaceId: workspace.id,
      status: "PENDING",
    },
  });

  let invitation = existingInvitation;

  if (!invitation) {
    const [billingProfile, activeMembersCount, pendingInvitesCount] =
      await Promise.all([
        prisma.billingProfile.findUnique({
          where: {
            workspaceId: workspace.id,
          },
        }),
        prisma.membership.count({
          where: {
            workspaceId: workspace.id,
            status: "ACTIVE",
          },
        }),
        prisma.invitation.count({
          where: {
            workspaceId: workspace.id,
            status: "PENDING",
          },
        }),
      ]);

    const seatsIncluded =
      billingProfile?.seatsIncluded ?? DEFAULT_FREE_SEAT_LIMIT;

    const usedSeats = activeMembersCount + pendingInvitesCount;

    if (usedSeats >= seatsIncluded) {
      return redirectToTeam(req, "seat-limit");
    }

    const token = crypto.randomBytes(32).toString("hex");

    invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role,
        status: "PENDING",
        workspaceId: workspace.id,
        invitedById: currentUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
  }

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    new URL(req.url).origin;

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const inviteLink = `${cleanBaseUrl}/accept-invite?token=${invitation.token}`;

  try {
    await sendInviteEmail({
      to: email,
      workspaceName: workspace.name,
      inviteLink,
      invitedByName: currentUser.name,
    });

    console.log("Invite email sent:", email);
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return redirectToTeam(req, "email-failed");
  }

  return redirectToTeam(req, existingInvitation ? "invite-resent" : "invite-sent");
}