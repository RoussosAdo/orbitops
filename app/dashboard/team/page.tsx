import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  const currentUserEmail = session?.user?.email ?? null;

  const members = await prisma.membership.findMany({
    include: {
      user: true,
      workspace: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Team"
        description="Manage your workspace members, roles and invitation status."
        actionLabel="Invite Member"
      />

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
                  Workspace
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => {
                const canAccept =
                  member.status === "INVITED" &&
                  member.user.email === currentUserEmail;

                return (
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
                      {member.user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        {member.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          member.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : member.status === "INVITED"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                      {member.workspace.name}
                    </td>

                    <td className="px-5 py-4">
                      {canAccept ? (
                        <form action="/api/team/accept" method="POST">
                          <input
                            type="hidden"
                            name="membershipId"
                            value={member.id}
                          />
                          <button
                            type="submit"
                            className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            Accept
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                  >
                    No team members found.
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