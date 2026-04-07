import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

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

      // Βεβαιώσου ότι μετά το adapter flow βρίσκουμε user στη βάση.
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { memberships: true },
      });

      // Αν για οποιονδήποτε λόγο δεν υπάρχει ακόμα στο ακριβές timing του callback,
      // άφησέ τον να περάσει. Θα τον πιάσουμε στο session flow αμέσως μετά.
      if (!dbUser) {
        return true;
      }

      if (dbUser.memberships.length === 0) {
        const workspace = await prisma.workspace.create({
          data: {
            name: user.name ? `${user.name}'s Workspace` : "My Workspace",
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

        await prisma.workspaceSettings.create({
          data: {
            workspaceId: workspace.id,
            workspaceName: user.name ? `${user.name}'s Workspace` : "My Workspace",
            companyEmail: user.email,
            timezone: "Europe/Athens",
            brandColor: "Neo Mint",
            emailNotifications: true,
            productUpdates: true,
            weeklyReports: false,
          },
        });

        await prisma.billingProfile.create({
          data: {
            workspaceId: workspace.id,
            planName: "Free",
            billingCycle: "Monthly",
            status: "Active",
            cardBrand: "-",
            cardLast4: "0000",
            currentPeriod: "No billing yet",
            monthlyPrice: 0,
            seatsUsed: 1,
            seatsIncluded: 1,
            projectsUsed: 0,
            projectsIncluded: 3,
          },
        });
      }

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

      const existingMembership = await prisma.membership.findFirst({
        where: {
          user: {
            email: user.email,
          },
        },
      });

      if (existingMembership) return;

      const workspace = await prisma.workspace.create({
        data: {
          name: user.name ? `${user.name}'s Workspace` : "My Workspace",
        },
      });

      await prisma.membership.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      await prisma.workspaceSettings.create({
        data: {
          workspaceId: workspace.id,
          workspaceName: user.name ? `${user.name}'s Workspace` : "My Workspace",
          companyEmail: user.email,
          timezone: "Europe/Athens",
          brandColor: "Neo Mint",
          emailNotifications: true,
          productUpdates: true,
          weeklyReports: false,
        },
      });

      await prisma.billingProfile.create({
        data: {
          workspaceId: workspace.id,
          planName: "Free",
          billingCycle: "Monthly",
          status: "Active",
          cardBrand: "-",
          cardLast4: "0000",
          currentPeriod: "No billing yet",
          monthlyPrice: 0,
          seatsUsed: 1,
          seatsIncluded: 1,
          projectsUsed: 0,
          projectsIncluded: 3,
        },
      });
    },
  },
};