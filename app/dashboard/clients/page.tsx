import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import {
  createClient,
  updateClient,
  deleteClient,
} from "@/app/actions/clientActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

type ClientsPageProps = {
  searchParams?: Promise<{
    edit?: string;
    q?: string;
    status?: string;
  }>;
};

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p
        className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${
          accent || "text-[var(--foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const workspace = await requireCurrentWorkspace();
  const params = searchParams ? await searchParams : undefined;

  const editingId = params?.edit ?? null;
  const searchQuery = (params?.q ?? "").trim();
  const selectedStatus = (params?.status ?? "").trim();

  const clients = await prisma.client.findMany({
    where: {
      workspaceId: workspace.id,
      ...(searchQuery
        ? {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                company: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(selectedStatus && selectedStatus !== "All"
        ? {
            status: selectedStatus,
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = clients.filter((client) => client.status === "Active").length;
  const pendingCount = clients.filter((client) => client.status === "Pending").length;
  const inactiveCount = clients.filter((client) => client.status === "Inactive").length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        description="Manage relationships, filter account status and keep your customer pipeline organized."
        actionLabel="Add Client"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Clients" value={String(clients.length)} />
        <SummaryCard
          label="Active Accounts"
          value={String(activeCount)}
          accent="text-emerald-600"
        />
        <SummaryCard
          label="Pending / Inactive"
          value={String(pendingCount + inactiveCount)}
          accent="text-[var(--primary)]"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--muted)] p-5">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Create Client
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              Add a new client account
            </h2>
          </div>

          <form
            action={createClient}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <input
              name="name"
              type="text"
              placeholder="Client name"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="company"
              type="text"
              placeholder="Company"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <select
              name="status"
              defaultValue="Active"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              Create Client
            </button>
          </form>
        </div>

        <div className="mt-6 mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <button
            type="button"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            Export
          </button>
        </div>

        <form
          method="GET"
          className="mb-6 grid gap-3 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-[1.3fr_220px_auto_auto]"
        >
          <input
            name="q"
            type="text"
            defaultValue={searchQuery}
            placeholder="Search by client, company or email..."
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />

          <select
            name="status"
            defaultValue={selectedStatus || "All"}
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Apply
          </button>

          <a
            href="/dashboard/clients"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            Reset
          </a>
        </form>

        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
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
              {clients.map((client, index) => {
                const isEditing = editingId === client.id;

                if (isEditing) {
                  return (
                    <tr
                      key={client.id}
                      className={
                        index !== clients.length - 1
                          ? "border-t border-[var(--border)]"
                          : ""
                      }
                    >
                      <td colSpan={5} className="px-5 py-4">
                        <form
                          action={updateClient}
                          className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-2 xl:grid-cols-6"
                        >
                          <input type="hidden" name="clientId" value={client.id} />

                          <input
                            name="name"
                            type="text"
                            defaultValue={client.name}
                            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <input
                            name="company"
                            type="text"
                            defaultValue={client.company}
                            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <input
                            name="email"
                            type="email"
                            defaultValue={client.email}
                            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <select
                            name="status"
                            defaultValue={client.status}
                            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                          </select>

                          <button
                            type="submit"
                            className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
                          >
                            Save
                          </button>

                          <a
                            href={`/dashboard/clients?q=${encodeURIComponent(
                              searchQuery
                            )}&status=${encodeURIComponent(
                              selectedStatus || "All"
                            )}`}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                          >
                            Cancel
                          </a>
                        </form>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={client.id}
                    className={`data-row ${
                      index !== clients.length - 1
                        ? "border-t border-[var(--border)]"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {client.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                      {client.company}
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                      {client.email}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={client.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]">
                          View
                        </button>

                        <a
                          href={`/dashboard/clients?edit=${client.id}&q=${encodeURIComponent(
                            searchQuery
                          )}&status=${encodeURIComponent(
                            selectedStatus || "All"
                          )}`}
                          className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                        >
                          Edit
                        </a>

                        <form action={deleteClient}>
                          <input type="hidden" name="clientId" value={client.id} />
                          <button
                            type="submit"
                            className="control-hover rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {clients.length === 0 && (
                <tr>
  <td
    colSpan={5}
    className="px-5 py-12 text-center"
  >
    <div className="mx-auto max-w-sm">
      <p className="text-base font-semibold text-[var(--foreground)]">
        No clients found
      </p>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Try adjusting your search or status filters to see more results.
      </p>
    </div>
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