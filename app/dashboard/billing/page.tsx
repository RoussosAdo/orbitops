import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { updateBillingPlan } from "@/app/actions/billingActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles =
    status === "Paid"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function UsageCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
        {value}
      </p>
      {sublabel ? (
        <p className="mt-2 text-sm font-medium text-[var(--primary)]">{sublabel}</p>
      ) : null}
    </div>
  );
}

function ProgressRow({
  label,
  value,
  max,
  tone = "purple",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "purple" | "blue" | "amber";
}) {
  const percentage = max === 0 ? 0 : Math.min((value / max) * 100, 100);

  const toneClasses = {
    purple: "bg-[var(--primary)]",
    blue: "bg-sky-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--muted-foreground)]">
          {value}/{max}
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full ${toneClasses[tone]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default async function BillingPage() {
  const workspace = await requireCurrentWorkspace();

  const [profile, invoices, projectsCount, seatsUsed] = await Promise.all([
    prisma.billingProfile.findUnique({
      where: {
        workspaceId: workspace.id,
      },
    }),
    prisma.invoice.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({
      where: {
        workspaceId: workspace.id,
      },
    }),
    prisma.membership.count({
      where: {
        workspaceId: workspace.id,
        status: "ACTIVE",
      },
    }),
  ]);

  if (!profile) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow="Workspace"
          title="Billing"
          description="Manage your plan, payment method and invoices."
          actionLabel="Billing"
        />

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            No billing profile found
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            This workspace does not have a billing profile yet.
          </p>
        </div>
      </section>
    );
  }

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "Pending");
  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Billing"
        description="Manage subscription usage, invoices, billing plan and payment details."
        actionLabel="Manage Billing"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <UsageCard
          label="Plan Price"
          value={`€${profile.monthlyPrice}`}
          sublabel={`${profile.billingCycle} billing`}
        />
        <UsageCard
          label="Paid Invoices"
          value={String(paidInvoices.length)}
          sublabel={`${pendingInvoices.length} pending`}
        />
        <UsageCard
          label="Projects Usage"
          value={`${projectsCount}/${profile.projectsIncluded}`}
        />
        <UsageCard
          label="Seats Usage"
          value={`${seatsUsed}/${profile.seatsIncluded}`}
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {profile.status}
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Current plan
              </p>

              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                    {profile.planName}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    {profile.billingCycle} billing · {profile.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Billing Period
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {profile.currentPeriod}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Usage Overview
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    Plan Usage
                  </h3>
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  Live usage
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <ProgressRow
                  label="Seats Usage"
                  value={seatsUsed}
                  max={profile.seatsIncluded}
                  tone="purple"
                />
                <ProgressRow
                  label="Projects Usage"
                  value={projectsCount}
                  max={profile.projectsIncluded}
                  tone="blue"
                />
                <ProgressRow
                  label="Paid Invoices"
                  value={paidInvoices.length}
                  max={Math.max(invoices.length, 1)}
                  tone="amber"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Invoice History
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    Invoices
                  </h3>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
                  €{totalBilled} total billed
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
                <table className="w-full border-collapse">
                  <thead className="bg-[var(--muted)]">
                    <tr className="text-left">
                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        Invoice
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        Amount
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        Issued
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={
                          index !== invoices.length - 1
                            ? "border-t border-[var(--border)]"
                            : ""
                        }
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                          {invoice.invoiceNo}
                        </td>

                        <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                          €{invoice.amount}
                        </td>

                        <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                          {invoice.issuedDate}
                        </td>

                        <td className="px-5 py-4">
                          <InvoiceStatusBadge status={invoice.status} />
                        </td>
                      </tr>
                    ))}

                    {invoices.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]"
                        >
                          No invoices found in this workspace.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Payment
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                Payment Method
              </h3>

              <div className="mt-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <p className="text-sm text-[var(--muted-foreground)]">Saved Card</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {profile.cardBrand} ending in {profile.cardLast4}
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Plan Controls
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                Update Plan
              </h3>

              <form action={updateBillingPlan} className="mt-5 space-y-4">
                <select
                  name="planName"
                  defaultValue={profile.planName}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro Workspace">Pro Workspace</option>
                  <option value="Enterprise">Enterprise</option>
                </select>

                <select
                  name="billingCycle"
                  defaultValue={profile.billingCycle}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Save Billing Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}