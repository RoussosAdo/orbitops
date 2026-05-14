import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { createCheckoutSession } from "@/app/actions/billingActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import type { AppLanguage } from "@/app/lib/i18n";
import { dashboardCopy } from "@/app/lib/i18n";

type BillingCopy = (typeof dashboardCopy)[AppLanguage]["billingPage"];

type BillingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
  }>;
};

function getInvoiceStatusLabel(status: string, copy: BillingCopy) {
  if (status === "Paid") return copy.paid;
  if (status === "Pending") return copy.pending;
  if (status === "Failed") return copy.failed;
  return status;
}

function InvoiceStatusBadge({
  status,
  copy,
}: {
  status: string;
  copy: BillingCopy;
}) {
  const styles =
    status === "Paid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Failed"
      ? "bg-red-100 text-red-600"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {getInvoiceStatusLabel(status, copy)}
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
    <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
        {value}
      </p>

      {sublabel ? (
        <p className="mt-2 text-sm font-medium text-[var(--primary)]">
          {sublabel}
        </p>
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

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const workspace = await requireCurrentWorkspace();
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language].billingPage;
  const params = searchParams ? await searchParams : undefined;

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
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.emptyDescription}
          actionLabel={copy.billing}
        />

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 text-center shadow-[var(--shadow-sm)] sm:p-10">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {copy.noBillingProfile}
          </p>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {copy.noBillingProfileDescription}
          </p>
        </div>
      </section>
    );
  }

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "Pending"
  );
  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.manageBilling}
      />

      {params?.checkout === "success" ? (
  <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
    Payment completed. Your subscription has been activated.
  </div>
) : null}

{params?.checkout === "cancelled" ? (
  <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
    Checkout was cancelled. No changes were made.
  </div>
) : null}

{params?.checkout === "current" ? (
  <div className="rounded-[1.35rem] border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-medium text-sky-700">
    You are already on this plan.
  </div>
) : null}

{params?.checkout === "free" ? (
  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700">
    Your workspace has been moved to the Free plan.
  </div>
) : null}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <UsageCard
          label={copy.planPrice}
          value={`€${profile.monthlyPrice}`}
          sublabel={`${profile.billingCycle} ${copy.billingLower}`}
        />

        <UsageCard
          label={copy.paidInvoices}
          value={String(paidInvoices.length)}
          sublabel={`${pendingInvoices.length} ${copy.pendingLower}`}
        />

        <UsageCard
          label={copy.projectsUsage}
          value={`${projectsCount}/${profile.projectsIncluded}`}
        />

        <UsageCard
          label={copy.seatsUsage}
          value={`${seatsUsed}/${profile.seatsIncluded}`}
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            {copy.currentWorkspace}:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {profile.status}
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {copy.currentPlan}
              </p>

              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                    {profile.planName}
                  </h2>

                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    {profile.billingCycle} {copy.billingLower} ·{" "}
                    {profile.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-left md:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {copy.billingPeriod}
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
                    {copy.usageOverview}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {copy.planUsage}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  {copy.liveUsage}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <ProgressRow
                  label={copy.seatsUsage}
                  value={seatsUsed}
                  max={profile.seatsIncluded}
                  tone="purple"
                />

                <ProgressRow
                  label={copy.projectsUsage}
                  value={projectsCount}
                  max={profile.projectsIncluded}
                  tone="blue"
                />

                <ProgressRow
                  label={copy.paidInvoices}
                  value={paidInvoices.length}
                  max={Math.max(invoices.length, 1)}
                  tone="amber"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {copy.invoiceHistory}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {copy.invoices}
                  </h3>
                </div>

                <div className="w-fit rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
                  €{totalBilled} {copy.totalBilledLower}
                </div>
              </div>

              <div className="mt-5 hidden overflow-hidden rounded-[1.25rem] border border-[var(--border)] md:block">
                <table className="w-full border-collapse">
                  <thead className="bg-[var(--muted)]">
                    <tr className="text-left">
                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        {copy.invoice}
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        {copy.amount}
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        {copy.issued}
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        {copy.status}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`data-row ${
                          index !== invoices.length - 1
                            ? "border-t border-[var(--border)]"
                            : ""
                        }`}
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
                          <InvoiceStatusBadge
                            status={invoice.status}
                            copy={copy}
                          />
                        </td>
                      </tr>
                    ))}

                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-12 text-center">
                          <div className="mx-auto max-w-sm">
                            <p className="text-base font-semibold text-[var(--foreground)]">
                              {copy.noInvoicesYet}
                            </p>

                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {copy.noInvoicesDescription}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 space-y-4 md:hidden">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {copy.invoice}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                            {invoice.invoiceNo}
                          </p>
                        </div>

                        <InvoiceStatusBadge
                          status={invoice.status}
                          copy={copy}
                        />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {copy.amount}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                            €{invoice.amount}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {copy.issued}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                            {invoice.issuedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-10 text-center">
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {copy.noInvoicesYet}
                    </p>

                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {copy.noInvoicesDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {copy.payment}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {copy.paymentMethod}
              </h3>

              <div className="mt-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <p className="text-sm text-[var(--muted-foreground)]">
                  {copy.savedCard}
                </p>

                <p className="mt-2 break-words text-lg font-semibold text-[var(--foreground)]">
                  {profile.cardBrand &&
profile.cardLast4 &&
profile.cardBrand !== "-" &&
profile.cardLast4 !== "-" &&
profile.cardLast4 !== "Active"
  ? `${profile.cardBrand} ${copy.endingIn} ${profile.cardLast4}`
  : profile.status === "Free"
  ? "No payment method required"
  : "Payment active through Stripe"}
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {copy.planControls}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {copy.updatePlan}
              </h3>

              <form action={createCheckoutSession} className="mt-5 space-y-4">
                <select
                  name="planName"
                  defaultValue={profile.planName}
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro Workspace">Pro Workspace</option>
                  <option value="Enterprise">Enterprise</option>
                </select>

                <select
                  name="billingCycle"
                  defaultValue={profile.billingCycle}
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Monthly">{copy.monthly}</option>
                  <option value="Yearly">{copy.yearly}</option>
                </select>

                <button
                  type="submit"
                  className="h-12 w-full rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Continue to Checkout
                </button>
              </form>

              <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
                Paid plans redirect to Stripe Checkout. Free plan updates
                instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}