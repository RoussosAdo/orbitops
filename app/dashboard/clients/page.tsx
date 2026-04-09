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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        description="Manage your client relationships, monitor account status and keep your workspace organized."
        actionLabel="Add Client"
      />

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <form
          action={createClient}
          className="mb-6 grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <input
            name="name"
            type="text"
            placeholder="Client name"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <input
            name="company"
            type="text"
            placeholder="Company"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <select
            name="status"
            defaultValue="Active"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Create Client
          </button>
        </form>

        <div className="mb-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>
        </div>

        <form
          method="GET"
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <input
              name="q"
              type="text"
              defaultValue={searchQuery}
              placeholder="Search clients..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] md:max-w-sm"
            />

            <select
              name="status"
              defaultValue={selectedStatus || "All"}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Apply
            </button>

            <a
              href="/dashboard/clients"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
            >
              Reset
            </a>
          </div>

          <button
            type="button"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-light)]"
          >
            Export
          </button>
        </form>

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
                            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <input
                            name="company"
                            type="text"
                            defaultValue={client.company}
                            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <input
                            name="email"
                            type="email"
                            defaultValue={client.email}
                            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                            required
                          />

                          <select
                            name="status"
                            defaultValue={client.status}
                            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                          </select>

                          <button
                            type="submit"
                            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                          >
                            Save
                          </button>

                          <a
                            href={`/dashboard/clients?q=${encodeURIComponent(
                              searchQuery
                            )}&status=${encodeURIComponent(
                              selectedStatus || "All"
                            )}`}
                            className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
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
                    className={
                      index !== clients.length - 1
                        ? "border-t border-[var(--border)]"
                        : ""
                    }
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

                        <a
                          href={`/dashboard/clients?edit=${client.id}&q=${encodeURIComponent(
                            searchQuery
                          )}&status=${encodeURIComponent(
                            selectedStatus || "All"
                          )}`}
                          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                        >
                          Edit
                        </a>

                        <form action={deleteClient}>
                          <input type="hidden" name="clientId" value={client.id} />
                          <button
                            type="submit"
                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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
                    className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                  >
                    No clients found for the current filters.
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