import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

type AcceptInvitePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,46,40,0.06)]">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Invalid invite
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            This invite link is missing a token.
          </p>
        </div>
      </main>
    );
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { workspace: true },
  });

  if (!invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,46,40,0.06)]">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Invite not found
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            This invitation does not exist.
          </p>
        </div>
      </main>
    );
  }

  if (invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,46,40,0.06)]">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Invite expired
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            This invitation is no longer valid.
          </p>
        </div>
      </main>
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/accept-invite?token=${token}`);
  }

  const currentUserEmail = session.user.email.toLowerCase();
  const emailMatches = currentUserEmail === invitation.email.toLowerCase();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <div className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-[0_8px_30px_rgba(15,46,40,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          OrbitOps
        </p>

        <h1 className="mt-4 text-3xl font-bold text-[var(--foreground)]">
          Accept invitation
        </h1>

        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          You were invited to join{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {invitation.workspace.name}
          </span>
          .
        </p>

        <div className="mt-6 rounded-2xl bg-[var(--muted)] p-4 text-sm">
          <p>
            <span className="font-semibold">Invited email:</span>{" "}
            {invitation.email}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Your session email:</span>{" "}
            {currentUserEmail}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Role:</span> {invitation.role}
          </p>
        </div>

        {!emailMatches ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            You are signed in with a different account. Sign in with{" "}
            {invitation.email} to accept this invite.
          </p>
        ) : (
          <form action="/api/team/accept" method="POST" className="mt-6">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Accept invitation
            </button>
          </form>
        )}
      </div>
    </main>
  );
}