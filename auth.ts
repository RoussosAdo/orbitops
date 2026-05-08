import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import { ensureUserWorkspace } from "@/app/lib/ensure-user-workspace";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: true,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      await ensureUserWorkspace({
        email: user.email,
        name: user.name,
      });

      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string }).id = user.id;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;

      await ensureUserWorkspace({
        email: user.email,
        name: user.name,
      });
    },
  },
};