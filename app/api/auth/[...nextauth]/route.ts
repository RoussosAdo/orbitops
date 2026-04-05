import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma"; // Σιγουρέψου ότι το path είναι σωστό

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Χρησιμοποιούμε JWT για ευκολία στο Dashboard
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };