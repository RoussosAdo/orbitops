import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  console.log("ACCEPT ROUTE HIT");

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.log("No session email, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const token = String(formData.get("token") ?? "").trim();

  console.log("session email:", session.user.email);
  console.log("token:", token);

  if (!token) {
    console.log("Missing token");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  console.log(
    "invitation found:",
    invitation?.email,
    invitation?.status,
    invitation?.workspaceId
  );

  if (!invitation) {
    console.log("Invitation not found");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  if (invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    console.log("Invitation invalid or expired");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const sessionMatchesInvite =
    session.user.email.toLowerCase() === invitation.email.toLowerCase();

  console.log("session matches invite:", sessionMatchesInvite);

  if (!sessionMatchesInvite) {
    console.log("Signed in with wrong account");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
  });

  console.log("current user id:", currentUser?.id);

  if (!currentUser) {
    console.log("Current user not found");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: currentUser.id,
      workspaceId: invitation.workspaceId,
    },
  });

  console.log("existing membership:", existingMembership?.id ?? null);

  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        userId: currentUser.id,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
        status: "ACTIVE",
      },
    });
    console.log("Created new membership");
  } else {
    await prisma.membership.update({
      where: { id: existingMembership.id },
      data: {
        role: invitation.role,
        status: "ACTIVE",
      },
    });
    console.log("Updated existing membership");
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: {
      status: "ACCEPTED",
    },
  });

  console.log("Invitation accepted successfully");

  return NextResponse.redirect(new URL("/dashboard", req.url));
}