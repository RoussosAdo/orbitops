import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const formData = await req.formData();
  const membershipId = String(formData.get("membershipId") ?? "");

  if (!membershipId) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
  });

  if (!membership || membership.userId !== currentUser.id) {
    return NextResponse.redirect(new URL("/dashboard/team", req.url));
  }

  await prisma.membership.update({
    where: { id: membershipId },
    data: {
      status: "ACTIVE",
    },
  });

  return NextResponse.redirect(new URL("/dashboard/team", req.url));
}