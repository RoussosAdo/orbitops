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
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  // 🔥 current logged-in user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { workspace: true },
      },
    },
  });

  if (!currentUser || currentUser.memberships.length === 0) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const workspace = currentUser.memberships[0].workspace;

  // 🔥 invited user
  const invitedUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!invitedUser) {
    console.log("User not registered yet");
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: invitedUser.id,
      workspaceId: workspace.id,
    },
  });

  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        userId: invitedUser.id,
        workspaceId: workspace.id,
        role: "MEMBER",
        status: "INVITED",
      },
    });

    console.log("✅ Member invited");
  } else {
    console.log("⚠️ Already member");
  }

  return NextResponse.redirect(new URL("/dashboard/team", req.url));
}