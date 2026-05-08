import Image from "next/image";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

type AcceptInvitePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

function InviteStateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[rgba(109,94,252,0.10)] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
        <div className="border-b border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-8">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
              <Image
                src="/orbitops-logo.png"
                alt="OrbitOps logo"
                fill
                priority
                className="object-contain p-1.5"
              />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                OrbitOps
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Workspace platform
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Invitation status
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            {title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
    </main>
  );
}

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <InviteStateCard
        title="Invalid invite"
        description="This invitation link is missing a valid token."
      />
    );
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { workspace: true },
  });

  if (!invitation) {
    return (
      <InviteStateCard
        title="Invite not found"
        description="This invitation does not exist or may have been removed."
      />
    );
  }

  if (invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    return (
      <InviteStateCard
        title="Invite expired"
        description="This invitation is no longer valid. Ask the workspace owner to send you a new one."
      />
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/accept-invite?token=${token}`);
  }

  const currentUserEmail = session.user.email.toLowerCase();
  const invitedEmail = invitation.email.toLowerCase();
  const emailMatches = currentUserEmail === invitedEmail;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[rgba(109,94,252,0.10)] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="hidden border-r border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                <Image
                  src="/orbitops-logo.png"
                  alt="OrbitOps logo"
                  fill
                  priority
                  className="object-contain p-1.5"
                />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  OrbitOps
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Workspace platform
                </p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Workspace Invitation
              </p>

              <h1 className="mt-4 max-w-md text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                Join a workspace and start collaborating.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted-foreground)]">
                You were invited to access a shared OrbitOps workspace where
                projects, tasks, billing and team collaboration are managed in
                one place.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Workspace
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {invitation.workspace.name}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Shared operational hub
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Access Role
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {invitation.role}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Assigned before joining
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Invite Details
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              This invitation was sent to{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {invitation.email}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                <Image
                  src="/orbitops-logo.png"
                  alt="OrbitOps logo"
                  fill
                  priority
                  className="object-contain p-1.5"
                />
              </div>

              <div>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  OrbitOps
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Workspace platform
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Accept invitation
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                Join workspace
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                You were invited to join{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {invitation.workspace.name}
                </span>{" "}
                in OrbitOps.
              </p>

              <div className="mt-6 space-y-3 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">
                    Invited email
                  </span>
                  <span className="text-right font-semibold text-[var(--foreground)]">
                    {invitation.email}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">
                    Your session
                  </span>
                  <span className="text-right font-semibold text-[var(--foreground)]">
                    {currentUserEmail}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">Role</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {invitation.role}
                  </span>
                </div>
              </div>

              {!emailMatches ? (
                <div className="mt-6 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  You are signed in with a different account. Sign in with{" "}
                  {invitation.email} to accept this invitation.
                </div>
              ) : (
                <form action="/api/team/accept" method="POST" className="mt-6">
                  <input type="hidden" name="token" value={token} />
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-black"
                  >
                    Accept invitation
                  </button>
                </form>
              )}

              <div className="mt-6 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Secure access
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Invitations are restricted to the email address they were sent
                  to for secure workspace access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}