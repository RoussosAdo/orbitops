import PageHeader from "@/app/components/dashboard/PageHeader";

const clients = [
  {
    name: "Aether Labs",
    company: "Aether Labs Ltd",
    email: "contact@aetherlabs.io",
    status: "Active",
  },
  {
    name: "Nova Studio",
    company: "Nova Studio",
    email: "team@novastudio.dev",
    status: "Pending",
  },
  {
    name: "Helio Systems",
    company: "Helio Systems",
    email: "hello@heliosystems.com",
    status: "Active",
  },
  {
    name: "Vertex Finance",
    company: "Vertex Finance",
    email: "ops@vertexfinance.co",
    status: "Inactive",
  },
];

export default function ClientsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        description="Manage your client relationships, monitor account status and keep your workspace organized."
        actionLabel="Add Client"
      />

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] md:max-w-sm">
              Search clients...
            </div>

            <div className="hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] md:block">
              All Statuses
            </div>
          </div>

          <button className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-light)]">
            Export
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--muted)]">
              <tr className="text-left">
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Client
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Company
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Email
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Status
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client, index) => (
                <tr
                  key={client.email}
                  className={index !== clients.length - 1 ? "border-t border-[var(--border)]" : ""}
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {client.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {client.company}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {client.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        client.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : client.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]">
                        View
                      </button>
                      <button className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}