import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { updateBillingPlan } from "@/app/actions/billingActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

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

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Billing"
        description="Manage your subscription, usage, invoices and payment method."
        actionLabel="Manage Billing"
      />

      <div className="mb-2">
        <p className="text-sm text-[var(--muted-foreground)]">
          Current workspace:{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {workspace.name}
          </span>
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Current Plan
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                  {profile.planName}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {profile.billingCycle} billing · {profile.status}
                </p>
              </div>

              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {profile.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Price
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  €{profile.monthlyPrice}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Seats
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {seatsUsed}/{profile.seatsIncluded}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Projects
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {projectsCount}/{profile.projectsIncluded}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
              <p className="text-sm font-medium text-[var(--muted-foreground)]">
                Billing Period
              </p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">
                {profile.currentPeriod}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Invoices
            </h3>

            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
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
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
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
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Payment Method
            </h3>

            <div className="mt-4 rounded-2xl bg-[var(--muted)] p-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Saved Card
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {profile.cardBrand} ending in {profile.cardLast4}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Update Plan
            </h3>

            <form action={updateBillingPlan} className="mt-4 space-y-4">
              <select
                name="planName"
                defaultValue={profile.planName}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
              >
                <option value="Free">Free</option>
                <option value="Starter">Starter</option>
                <option value="Pro Workspace">Pro Workspace</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select
                name="billingCycle"
                defaultValue={profile.billingCycle}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
              >
                Save Billing Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}