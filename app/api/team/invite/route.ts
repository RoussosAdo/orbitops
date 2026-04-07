import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import crypto from "crypto";
import { sendInviteEmail } from "@/app/lib/mail";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    include: {
      memberships: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!currentUser || currentUser.memberships.length === 0) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const workspace = currentUser.memberships[0].workspace;

  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email,
      workspaceId: workspace.id,
      status: "PENDING",
    },
  });

  let invitation = existingInvitation;

  if (!invitation) {
    const token = crypto.randomBytes(32).toString("hex");

    invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role: "MEMBER",
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

  const inviteLink = `${baseUrl}/accept-invite?token=${invitation.token}`;

  try {
    await sendInviteEmail({
      to: email,
      workspaceName: workspace.name,
      inviteLink,
      invitedByName: currentUser.name,
    });

    console.log("✅ Invite email sent:", email);
  } catch (error) {
    console.error("❌ Failed to send invite email:", error);
  }

  return NextResponse.redirect(new URL("/dashboard/team", req.url));
}