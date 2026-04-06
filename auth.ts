import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

export const authOptions = {
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
    async signIn({
      user,
    }: {
      user: { email?: string | null; name?: string | null };
    }) {
      if (!user.email) return false;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { memberships: true },
      });

      // Αν ο user δεν υπάρχει ακόμα, άστο να συνεχίσει.
      // Ο adapter θα τον δημιουργήσει.
      if (!dbUser) {
        return true;
      }

      // Αν υπάρχει αλλά δεν έχει workspace/membership, φτιάξ' το.
      if (dbUser.memberships.length === 0) {
        const workspace = await prisma.workspace.create({
          data: {
            name: `${user.name || "Workspace"}`,
          },
        });

        await prisma.membership.create({
          data: {
            userId: dbUser.id,
            workspaceId: workspace.id,
            role: "OWNER",
            status: "ACTIVE",
          },
        });
      }

      return true;
    },

    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };