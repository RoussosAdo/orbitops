import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  if (invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  if (session.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: currentUser.id,
      workspaceId: invitation.workspaceId,
    },
  });

  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        userId: currentUser.id,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
        status: "ACTIVE",
      },
    });
  } else {
    await prisma.membership.update({
      where: { id: existingMembership.id },
      data: {
        status: "ACTIVE",
      },
    });
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: {
      status: "ACCEPTED",
    },
  });

  return NextResponse.redirect(new URL("/dashboard/team", req.url));
}