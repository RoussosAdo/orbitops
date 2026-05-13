import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import { dashboardCopy } from "@/app/lib/i18n";
import type { AppLanguage } from "@/app/lib/i18n";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import TeamRoleForm from "@/app/components/dashboard/team/team-role-form";
import RemoveMemberForm from "@/app/components/dashboard/team/team-member-form";
import RevokeInvitationForm from "@/app/components/dashboard/team/revoke-initation-form";

type TeamCopy = (typeof dashboardCopy)[AppLanguage]["teamPage"];

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

      {meta ? (
        <p className={`mt-2 text-sm font-medium ${accent}`}>{meta}</p>
      ) : null}
    </div>
  );
}

function getRoleLabel(role: string, copy: TeamCopy) {
  if (role === "OWNER") return copy.owner;
  if (role === "ADMIN") return copy.admin;
  if (role === "MEMBER") return copy.memberRole;
  return role;
}

function getStatusLabel(status: string, copy: TeamCopy) {
  if (status === "ACTIVE") return copy.activeStatus;
  if (status === "PENDING") return copy.pendingStatus;
  return status;
}

function RoleBadge({ role, copy }: { role: string; copy: TeamCopy }) {
  const styles =
    role === "OWNER"
      ? "bg-purple-100 text-purple-700"
      : role === "ADMIN"
      ? "bg-sky-100 text-sky-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {getRoleLabel(role, copy)}
    </span>
  );
}

function StatusBadge({ status, copy }: { status: string; copy: TeamCopy }) {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {getStatusLabel(status, copy)}
    </span>
  );
}

export default async function TeamPage() {
  const workspace = await requireCurrentWorkspace();
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language].teamPage;
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

  const membersCount = members.filter(
    (member) => member.role === "MEMBER" && member.status === "ACTIVE"
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.inviteMember}
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <TeamStatCard
          label={copy.activeMembers}
          value={String(activeMembers.length)}
          meta={copy.currentlyActive}
        />

        <TeamStatCard
          label={copy.pendingInvites}
          value={String(pendingInvites.length)}
          meta={copy.awaitingAcceptance}
          accent="text-amber-600"
        />

        <TeamStatCard
          label={copy.owners}
          value={String(ownersCount)}
          meta={copy.workspaceControl}
          accent="text-purple-600"
        />

        <TeamStatCard
          label={copy.admins}
          value={String(adminsCount)}
          meta={copy.operationalAccess}
          accent="text-sky-600"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {copy.teamAccess}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {copy.inviteNewMember}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {copy.inviteDescriptionStart}{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {workspace.name}
              </span>{" "}
              {copy.inviteDescriptionEnd}
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {copy.currentWorkspace}:{" "}
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
              placeholder={copy.inviteByEmail}
              className="h-12 min-w-0 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <select
              name="role"
              defaultValue="MEMBER"
              className="h-12 min-w-0 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] outline-none"
            >
              {isOwner ? <option value="OWNER">{copy.owner}</option> : null}
              <option value="ADMIN">{copy.admin}</option>
              <option value="MEMBER">{copy.memberRole}</option>
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              {copy.sendInvite}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-5 py-4 text-sm text-[var(--muted-foreground)]">
            {copy.viewOnlyMessage}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {copy.members}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {copy.workspaceMembers}
              </h3>
            </div>

            <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              {members.length} {copy.total}
            </span>
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-[1.25rem] border border-[var(--border)] md:block">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--muted)]">
                <tr className="text-left">
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {copy.member}
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {copy.role}
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {copy.status}
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {copy.joined}
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {copy.actions}
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
                            {member.user.name || copy.unnamedUser}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {member.user.email || copy.noEmail}
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
                          <RoleBadge role={member.role} copy={copy} />
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={member.status} copy={copy} />
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
                            {copy.noAccess}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      {copy.noTeamMembers}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-4 md:hidden">
            {members.length > 0 ? (
              members.map((member) => {
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
                  <div
                    key={member.id}
                    className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-[var(--foreground)]">
                          {member.user.name || copy.unnamedUser}
                        </p>
                        <p className="mt-1 break-all text-sm text-[var(--muted-foreground)]">
                          {member.user.email || copy.noEmail}
                        </p>
                      </div>

                      <StatusBadge status={member.status} copy={copy} />
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                          {copy.role}
                        </p>

                        <div className="mt-2">
                          {canManageTeam ? (
                            <TeamRoleForm
                              membershipId={member.id}
                              defaultRole={member.role}
                              disabled={!canEditRole}
                            />
                          ) : (
                            <RoleBadge role={member.role} copy={copy} />
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                          {copy.joined}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                          {copy.actions}
                        </p>

                        {canManageTeam ? (
                          <RemoveMemberForm
                            membershipId={member.id}
                            disabled={!canRemoveMember}
                          />
                        ) : (
                          <span className="text-xs font-medium text-[var(--muted-foreground)]">
                            {copy.noAccess}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">
                {copy.noTeamMembers}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {copy.invitations}
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  {copy.pendingInvitations}
                </h3>
              </div>

              <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                {pendingInvites.length} {copy.pending}
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
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-all text-sm font-semibold text-[var(--foreground)] sm:truncate">
                            {invite.email}
                          </p>

                          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                            {copy.expires}:{" "}
                            {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                        </div>

                        <StatusBadge status={invite.status} copy={copy} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <RoleBadge role={invite.role} copy={copy} />

                        {canRevoke ? (
                          <RevokeInvitationForm invitationId={invite.id} />
                        ) : (
                          <span className="text-xs font-medium text-[var(--muted-foreground)]">
                            {copy.noAccess}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {copy.noPendingInvitations}
                  </p>
                  <p className="mt-2">{copy.noPendingInvitationsDescription}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {copy.accessSummary}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {copy.teamRolesOverview}
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {copy.owners}
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {ownersCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {copy.admins}
                </span>
                <span className="text-sm font-semibold text-sky-600">
                  {adminsCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {copy.members}
                </span>
                <span className="text-sm font-semibold text-[var(--primary)]">
                  {membersCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {copy.yourAccess}
                </span>
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {getRoleLabel(actorRole, copy)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}