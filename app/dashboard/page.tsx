import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleAlert,
  CreditCard,
  FolderKanban,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import WorkspaceSwitcher from "@/app/components/dashboard/WorkspaceSwitcher";
import OverviewBarChart from "@/app/components/dashboard/charts/OverviewBarChart";
import OverviewLineChart from "@/app/components/dashboard/charts/OverviewLineChart";
import { prisma } from "@/app/lib/prisma";
import {
  getUserWorkspaces,
  requireCurrentWorkspace,
} from "@/app/lib/get-current-workspace";

function OverviewMetricCard({
  icon,
  label,
  value,
  meta,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {label}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {value}
          </h3>
          <p className="mt-2 text-sm font-medium text-[var(--primary)]">
            {meta}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)] text-[var(--primary)]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
  rightSlot,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            {title}
          </h3>
        </div>

        {rightSlot}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent = "text-[var(--primary)]",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className={`mt-2 text-lg font-semibold ${accent}`}>{value}</p>
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
  tone?: "purple" | "green" | "amber" | "blue";
}) {
  const percentage = max === 0 ? 0 : Math.min((value / max) * 100, 100);

  const toneClasses = {
    purple: "bg-[var(--primary)]",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-sky-500",
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

export default async function DashboardPage() {
  const workspace = await requireCurrentWorkspace();

  const [
    clients,
    projects,
    tasks,
    billingProfile,
    invoices,
    seatsUsed,
    workspaces,
  ] = await Promise.all([
    prisma.client.findMany({
      where: {
        workspaceId: workspace.id,
      },
    }),
    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
      },
    }),
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
    prisma.membership.count({
      where: {
        workspaceId: workspace.id,
        status: "ACTIVE",
      },
    }),
    getUserWorkspaces(),
  ]);

  const recentProjects = projects.slice(0, 3);

  const totalClients = clients.length;
  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const openTasks = tasks.filter((task) => !task.completed).length;

  const planningProjects = projects.filter(
    (project) => project.status === "Planning"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;
  const inReviewProjects = projects.filter(
    (project) => project.status === "In Review"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;
  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length;

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "Pending"
  );

  const totalBilledAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  const invoiceCollectionRate =
    invoices.length > 0
      ? Math.round((paidInvoices.length / invoices.length) * 100)
      : 0;

  const taskClosureRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const workloadHealth =
    openTasks >= 8 ? "Heavy" : openTasks >= 4 ? "Moderate" : "Stable";

  const workspaceHealth =
    highPriorityTasks >= 3 || pendingInvoices.length > 0
      ? "Needs Attention"
      : "Healthy";

  const weeklyChartData = [
    { name: "Mon", value: 2 },
    { name: "Tue", value: 6 },
    { name: "Wed", value: 6 },
    { name: "Thu", value: 4 },
    { name: "Fri", value: 8 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 2 },
  ];

  const momentumChartData = [
    { name: "W1", value: 3 },
    { name: "W2", value: 5 },
    { name: "W3", value: 4 },
    { name: "W4", value: 5 },
    { name: "W5", value: 8 },
    { name: "W6", value: 7 },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] px-6 py-6 md:px-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  Operations center
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                  {workspace.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-[15px]">
                  Centralize delivery, client relationships, billing oversight
                  and day-to-day execution across your active workspace.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Workspace {workspaceHealth}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
                    <CircleAlert className="h-4 w-4 text-amber-500" />
                    Workload {workloadHealth}
                  </div>
                </div>
              </div>

              <div className="min-w-[260px] space-y-3">
                <WorkspaceSwitcher
                  currentWorkspaceId={workspace.id}
                  workspaces={workspaces}
                />

                <div className="grid grid-cols-2 gap-3">
                  <button className="inline-flex items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black">
                    Create Project
                  </button>

                  <button className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]">
                    Invite Team
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 md:px-7">
            <OverviewMetricCard
              icon={<Users className="h-5 w-5" />}
              label="Clients"
              value={String(totalClients)}
              meta={`${activeClients} active`}
            />
            <OverviewMetricCard
              icon={<FolderKanban className="h-5 w-5" />}
              label="Projects"
              value={String(totalProjects)}
              meta={`${completedProjects} completed`}
            />
            <OverviewMetricCard
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label="Open Tasks"
              value={String(openTasks)}
              meta={`${completedTasks} completed`}
            />
            <OverviewMetricCard
              icon={<Receipt className="h-5 w-5" />}
              label="Invoices"
              value={String(invoices.length)}
              meta={`€${totalBilledAmount} billed`}
            />
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--gradient-soft)] p-6 shadow-[var(--shadow-md)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
                Highlights
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                Workspace Signal
              </h2>
            </div>

            <span className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              Live
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniStat
              label="High priority tasks"
              value={String(highPriorityTasks)}
              accent="text-red-500"
            />
            <MiniStat
              label="Pending invoices"
              value={String(pendingInvoices.length)}
              accent="text-emerald-600"
            />
            <MiniStat
              label="Seats used"
              value={
                billingProfile
                  ? `${seatsUsed}/${billingProfile.seatsIncluded}`
                  : "—"
              }
              accent="text-amber-500"
            />
            <MiniStat
              label="Projects usage"
              value={
                billingProfile
                  ? `${totalProjects}/${billingProfile.projectsIncluded}`
                  : "—"
              }
              accent="text-sky-500"
            />
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Operations are stable. Delivery, task load and finance are under
              control.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            eyebrow="Analytics"
            title="Weekly Overview"
            rightSlot={
              <button className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]">
                Details ↗
              </button>
            }
          >
            <OverviewBarChart data={weeklyChartData} />

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <MiniStat
                label="Clients activity"
                value={`${activeClients} live accounts`}
              />
              <MiniStat
                label="Task pressure"
                value={`${openTasks} active tasks`}
              />
              <MiniStat
                label="Billing exposure"
                value={`€${totalBilledAmount} total`}
              />
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              eyebrow="Performance"
              title="Execution Snapshot"
              rightSlot={
                <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  Live data
                </span>
              }
            >
              <div className="space-y-3">
                {[
                  { label: "Active Clients", value: activeClients },
                  { label: "Completed Projects", value: completedProjects },
                  { label: "Open Tasks", value: openTasks },
                  { label: "Completed Tasks", value: completedTasks },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4"
                  >
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Trend" title="Execution Momentum">
              <OverviewLineChart data={momentumChartData} />
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard eyebrow="Projects" title="Status Distribution">
              <div className="space-y-3">
                {[
                  { label: "Planning", value: planningProjects },
                  { label: "In Progress", value: inProgressProjects },
                  { label: "In Review", value: inReviewProjects },
                  { label: "Completed", value: completedProjects },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-[var(--primary)]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Tasks" title="Priority Load">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    High Priority
                  </span>
                  <span className="text-sm font-semibold text-red-500">
                    {highPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Medium Priority
                  </span>
                  <span className="text-sm font-semibold text-amber-500">
                    {mediumPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Low Priority
                  </span>
                  <span className="text-sm font-semibold text-emerald-500">
                    {lowPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Total Tasks
                  </span>
                  <span className="text-sm font-semibold text-[var(--primary)]">
                    {totalTasks}
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard eyebrow="Finance" title="Billing Activity">
            <div className="space-y-3">
              {invoices.length > 0 ? (
                invoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)]">
                        <CreditCard className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {invoice.invoiceNo}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {invoice.issuedDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        €{invoice.amount}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                  No recent invoice activity.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard eyebrow="Performance" title="Execution Momentum">
            <OverviewLineChart data={momentumChartData} />
          </SectionCard>

          <SectionCard eyebrow="Subscription" title="Plan Usage">
            {billingProfile ? (
              <div className="space-y-4">
                <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Current Plan
                  </p>
                  <p className="mt-3 text-xl font-semibold text-[var(--foreground)]">
                    {billingProfile.planName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {billingProfile.billingCycle} · €{billingProfile.monthlyPrice}
                  </p>
                </div>

                <ProgressRow
                  label="Seats Usage"
                  value={seatsUsed}
                  max={billingProfile.seatsIncluded}
                  tone="purple"
                />
                <ProgressRow
                  label="Projects Usage"
                  value={totalProjects}
                  max={billingProfile.projectsIncluded}
                  tone="blue"
                />
                <ProgressRow
                  label="Paid Invoices"
                  value={paidInvoices.length}
                  max={Math.max(invoices.length, 1)}
                  tone="amber"
                />
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                No billing profile found for this workspace.
              </div>
            )}
          </SectionCard>

          <SectionCard
            eyebrow="Delivery"
            title="Recent Projects"
            rightSlot={
              <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]">
                View All
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                          {project.name}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {project.status}
                        </p>
                      </div>

                      <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                  No recent projects yet.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Summary" title="Revenue Snapshot">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)]">
                    <WalletCards className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Total billed
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      €{totalBilledAmount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Completion rate
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      {taskClosureRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Task closure
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      {taskClosureRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-500">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Paid invoice rate
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      {invoiceCollectionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}


