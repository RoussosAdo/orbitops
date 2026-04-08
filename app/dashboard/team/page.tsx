import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export default async function TeamPage() {
  const workspace = await requireCurrentWorkspace();

  const [members, invitations] = await Promise.all([
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
  ]);

  const activeMembers = members.filter((member) => member.status === "ACTIVE");
  const pendingInvites = invitations.filter(
    (invite) => invite.status === "PENDING"
  );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Team"
        description="Manage your workspace members, roles and invitation status."
        actionLabel="Invite Member"
      />

      <div className="mb-2">
        <p className="text-sm text-[var(--muted-foreground)]">
          Current workspace:{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {workspace.name}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[0_15px_40px_rgba(15,46,40,0.06)]">
          <p className="text-sm text-[var(--muted-foreground)]">Active Members</p>
          <h3 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
            {activeMembers.length}
          </h3>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[0_15px_40px_rgba(15,46,40,0.06)]">
          <p className="text-sm text-[var(--muted-foreground)]">Pending Invites</p>
          <h3 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
            {pendingInvites.length}
          </h3>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[0_15px_40px_rgba(15,46,40,0.06)]">
          <p className="text-sm text-[var(--muted-foreground)]">Workspace Roles</p>
          <h3 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
            {new Set(members.map((member) => member.role)).size}
          </h3>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <form
          action="/api/team/invite"
          method="POST"
          className="mb-6 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:flex-row"
        >
          <input
            name="email"
            type="email"
            placeholder="Invite by email"
            className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <select
            name="role"
            defaultValue="MEMBER"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Invite Member
          </button>
        </form>

        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--muted)]">
              <tr className="text-left">
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Member
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Email
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
              {members.map((member, index) => (
                <tr
                  key={member.id}
                  className={
                    index !== members.length - 1
                      ? "border-t border-[var(--border)]"
                      : ""
                  }
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {member.user.name || "Unnamed User"}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {member.user.email || "No email"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        member.role === "OWNER"
                          ? "bg-purple-100 text-purple-700"
                          : member.role === "ADMIN"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        member.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      —
                    </span>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
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

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Pending Invitations
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Invitations sent for this workspace that have not been accepted yet.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--muted)]">
              <tr className="text-left">
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Email
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Role
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Status
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Expires
                </th>
              </tr>
            </thead>

            <tbody>
              {pendingInvites.map((invite, index) => (
                <tr
                  key={invite.id}
                  className={
                    index !== pendingInvites.length - 1
                      ? "border-t border-[var(--border)]"
                      : ""
                  }
                >
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {invite.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        invite.role === "OWNER"
                          ? "bg-purple-100 text-purple-700"
                          : invite.role === "ADMIN"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {invite.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {invite.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {pendingInvites.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                  >
                    No pending invitations for this workspace.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}