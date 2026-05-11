import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import {
  createClient,
  updateClient,
  deleteClient,
} from "@/app/actions/clientActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import { dashboardCopy } from "@/app/lib/i18n";

type ClientsPageProps = {
  searchParams?: Promise<{
    edit?: string;
    q?: string;
    status?: string;
  }>;
};

function getStatusLabel(status: string, language: "en" | "el") {
  const labels = {
    en: {
      Active: "Active",
      Pending: "Pending",
      Inactive: "Inactive",
    },
    el: {
      Active: "Ενεργός",
      Pending: "Εκκρεμεί",
      Inactive: "Ανενεργός",
    },
  };

  return labels[language][status as "Active" | "Pending" | "Inactive"] ?? status;
}

function StatusBadge({
  status,
  language,
}: {
  status: string;
  language: "en" | "el";
}) {
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
      {getStatusLabel(status, language)}
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
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

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
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language];
  const clientsCopy = copy.clients;

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

  const activeCount = clients.filter(
    (client) => client.status === "Active"
  ).length;

  const pendingCount = clients.filter(
    (client) => client.status === "Pending"
  ).length;

  const inactiveCount = clients.filter(
    (client) => client.status === "Inactive"
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={clientsCopy.eyebrow}
        title={clientsCopy.title}
        description={clientsCopy.description}
        actionLabel={clientsCopy.addClient}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label={clientsCopy.totalClients}
          value={String(clients.length)}
        />

        <SummaryCard
          label={clientsCopy.activeAccounts}
          value={String(activeCount)}
          accent="text-emerald-600"
        />

        <SummaryCard
          label={clientsCopy.pendingInactive}
          value={String(pendingCount + inactiveCount)}
          accent="text-[var(--primary)]"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--muted)] p-5">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {clientsCopy.createClient}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {clientsCopy.addNewClientAccount}
            </h2>
          </div>

          <form
            action={createClient}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <input
              name="name"
              type="text"
              placeholder={clientsCopy.clientName}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="company"
              type="text"
              placeholder={clientsCopy.company}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="email"
              type="email"
              placeholder={clientsCopy.email}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <select
              name="status"
              defaultValue="Active"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="Active">{clientsCopy.active}</option>
              <option value="Pending">{clientsCopy.pending}</option>
              <option value="Inactive">{clientsCopy.inactive}</option>
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              {clientsCopy.createClient}
            </button>
          </form>
        </div>

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            {clientsCopy.currentWorkspace}:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <button
            type="button"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            {clientsCopy.export}
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
            placeholder={clientsCopy.searchPlaceholder}
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />

          <select
            name="status"
            defaultValue={selectedStatus || "All"}
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="All">{clientsCopy.allStatuses}</option>
            <option value="Active">{clientsCopy.active}</option>
            <option value="Pending">{clientsCopy.pending}</option>
            <option value="Inactive">{clientsCopy.inactive}</option>
          </select>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            {clientsCopy.apply}
          </button>

          <a
            href="/dashboard/clients"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            {clientsCopy.reset}
          </a>
        </form>

        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--muted)]">
              <tr className="text-left">
                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  {clientsCopy.client}
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  {clientsCopy.company}
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  {clientsCopy.email}
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  {clientsCopy.status}
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                  {clientsCopy.actions}
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
                          <input
                            type="hidden"
                            name="clientId"
                            value={client.id}
                          />

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
                            <option value="Active">{clientsCopy.active}</option>
                            <option value="Pending">{clientsCopy.pending}</option>
                            <option value="Inactive">{clientsCopy.inactive}</option>
                          </select>

                          <button
                            type="submit"
                            className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
                          >
                            {clientsCopy.save}
                          </button>

                          <a
                            href={`/dashboard/clients?q=${encodeURIComponent(
                              searchQuery
                            )}&status=${encodeURIComponent(
                              selectedStatus || "All"
                            )}`}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                          >
                            {clientsCopy.cancel}
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
                      <StatusBadge status={client.status} language={language} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]">
                          {clientsCopy.view}
                        </button>

                        <a
                          href={`/dashboard/clients?edit=${client.id}&q=${encodeURIComponent(
                            searchQuery
                          )}&status=${encodeURIComponent(
                            selectedStatus || "All"
                          )}`}
                          className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                        >
                          {clientsCopy.edit}
                        </a>

                        <form action={deleteClient}>
                          <input
                            type="hidden"
                            name="clientId"
                            value={client.id}
                          />

                          <button
                            type="submit"
                            className="control-hover rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            {clientsCopy.delete}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-sm">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        {clientsCopy.noClientsFound}
                      </p>

                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {clientsCopy.noClientsDescription}
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