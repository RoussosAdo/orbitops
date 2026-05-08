import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import TeamRoleForm from "@/app/components/dashboard/team/team-role-form";
import RemoveMemberForm from "@/app/components/dashboard/team/team-member-form";
import RevokeInvitationForm from "@/app/components/dashboard/team/revoke-initation-form";

function TeamStatCard({
  label,
  value,
  meta,
  accent = "text-[var(--primary)]",
}: {
  label: string;
  value: string;
  meta?: string;
  accent?: string;
}) {
  return (
    <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </p>
      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
        {value}
      </h3>
      {meta ? <p className={`mt-2 text-sm font-medium ${accent}`}>{meta}</p> : null}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles =
    role === "OWNER"
      ? "bg-purple-100 text-purple-700"
      : role === "ADMIN"
      ? "bg-sky-100 text-sky-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default async function TeamPage() {
  const workspace = await requireCurrentWorkspace();
  const session = await getServerSession(authOptions);

  const [members, invitations, actorMembership] = await Promise.all([
    prisma.membership.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invitation.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { createdAt: "desc" },
    }),
    session?.user?.email
      ? prisma.membership.findFirst({
          where: {
            workspaceId: workspace.id,
            status: "ACTIVE",
            user: {
              email: session.user.email.toLowerCase(),
            },
          },
        })
      : null,
  ]);

  const actorRole = actorMembership?.role ?? "MEMBER";
  const canManageTeam = actorRole === "OWNER" || actorRole === "ADMIN";
  const isOwner = actorRole === "OWNER";

  const activeMembers = members.filter((member) => member.status === "ACTIVE");
  const pendingInvites = invitations.filter(
    (invite) => invite.status === "PENDING"
  );
  const ownersCount = members.filter(
    (member) => member.role === "OWNER" && member.status === "ACTIVE"
  ).length;
  const adminsCount = members.filter(
    (member) => member.role === "ADMIN" && member.status === "ACTIVE"
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Team"
        description="Manage workspace access, member roles, pending invites and collaboration permissions."
        actionLabel="Invite Member"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <TeamStatCard
          label="Active Members"
          value={String(activeMembers.length)}
          meta="Currently active"
        />
        <TeamStatCard
          label="Pending Invites"
          value={String(pendingInvites.length)}
          meta="Awaiting acceptance"
          accent="text-amber-600"
        />
        <TeamStatCard
          label="Owners"
          value={String(ownersCount)}
          meta="Workspace control"
          accent="text-purple-600"
        />
        <TeamStatCard
          label="Admins"
          value={String(adminsCount)}
          meta="Operational access"
          accent="text-sky-600"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Team Access
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Invite New Member
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Add teammates to{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {workspace.name}
              </span>{" "}
              and assign the right role before they join.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </div>
        </div>

        {canManageTeam ? (
          <form
            action="/api/team/invite"
            method="POST"
            className="mt-6 grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-[1.4fr_220px_180px]"
          >
            <input
              name="email"
              type="email"
              placeholder="Invite by email"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <select
              name="role"
              defaultValue="MEMBER"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] outline-none"
            >
              {isOwner && <option value="OWNER">Owner</option>}
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              Send Invite
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-5 py-4 text-sm text-[var(--muted-foreground)]">
            You have view access only. Only owners and admins can invite members or manage team permissions.
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Members
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                Workspace Members
              </h3>
            </div>

            <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              {members.length} total
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--muted)]">
                <tr className="text-left">
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    Member
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    Role
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    Status
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    Joined
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map((member, index) => {
                  const isLastOwner =
                    member.role === "OWNER" &&
                    member.status === "ACTIVE" &&
                    ownersCount <= 1;

                  const isSelf = actorMembership?.id === member.id;
                  const targetIsOwner = member.role === "OWNER";

                  const canEditRole =
                    canManageTeam &&
                    !isLastOwner &&
                    !isSelf &&
                    !(actorRole === "ADMIN" && targetIsOwner);

                  const canRemoveMember =
                    canManageTeam &&
                    !isLastOwner &&
                    !isSelf &&
                    !(actorRole === "ADMIN" && targetIsOwner);

                  return (
                    <tr
                      key={member.id}
                      className={`data-row ${
                        index !== members.length - 1
                          ? "border-t border-[var(--border)]"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {member.user.name || "Unnamed User"}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {member.user.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {canManageTeam ? (
                          <TeamRoleForm
                            membershipId={member.id}
                            defaultRole={member.role}
                            disabled={!canEditRole}
                          />
                        ) : (
                          <RoleBadge role={member.role} />
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={member.status} />
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        {canManageTeam ? (
                          <RemoveMemberForm
                            membershipId={member.id}
                            disabled={!canRemoveMember}
                          />
                        ) : (
                          <span className="text-xs font-medium text-[var(--muted-foreground)]">
                            No access
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      No team members found in this workspace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Invitations
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  Pending Invitations
                </h3>
              </div>

              <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                {pendingInvites.length} pending
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {pendingInvites.length > 0 ? (
                pendingInvites.map((invite) => {
                  const canRevoke =
                    canManageTeam &&
                    !(actorRole === "ADMIN" && invite.role === "OWNER");

                  return (
                    <div
                      key={invite.id}
                      className="card-hover rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                            {invite.email}
                          </p>
                          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                            Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                        </div>

                        <StatusBadge status={invite.status} />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <RoleBadge role={invite.role} />

                        {canManageTeam ? (
                          <RevokeInvitationForm invitationId={invite.id} />
                        ) : canRevoke ? null : (
                          <span className="text-xs font-medium text-[var(--muted-foreground)]">
                            No access
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    No pending invitations
                  </p>
                  <p className="mt-2">
                    New team invites will appear here until they are accepted.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Access Summary
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              Team Roles Overview
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Owners
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {ownersCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Admins
                </span>
                <span className="text-sm font-semibold text-sky-600">
                  {adminsCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Members
                </span>
                <span className="text-sm font-semibold text-[var(--primary)]">
                  {
                    members.filter(
                      (member) =>
                        member.role === "MEMBER" && member.status === "ACTIVE"
                    ).length
                  }
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Your access
                </span>
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {actorRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}