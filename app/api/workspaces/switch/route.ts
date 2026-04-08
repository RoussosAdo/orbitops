import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!workspaceId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const membership = await prisma.membership.findFirst({
    where: {
      workspaceId,
      status: "ACTIVE",
      user: {
        email: session.user.email.toLowerCase(),
      },
    },
  });

  if (!membership) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", req.url));

  response.cookies.set("activeWorkspaceId", workspaceId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}