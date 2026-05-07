import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChartColumnBig,
  CircleAlert,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  Receipt,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import WorkspaceSwitcher from "@/app/components/dashboard/WorkspaceSwitcher";
import OverviewBarChart from "@/app/components/dashboard/charts/OverviewBarChart";
import OverviewLineChart from "@/app/components/dashboard/charts/OverviewLineChart";
import { prisma } from "@/app/lib/prisma";
import {
  getUserWorkspaces,
  requireCurrentWorkspace,
} from "@/app/lib/get-current-workspace";

function Panel({
  eyebrow,
  title,
  children,
  rightSlot,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            {title}
          </h3>
        </div>

        {rightSlot}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function MetricTile({
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
    <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            {value}
          </p>
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

function MiniStat({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number;
  tone?: "primary" | "green" | "amber" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-500"
      : tone === "amber"
      ? "bg-amber-500"
      : tone === "red"
      ? "bg-red-500"
      : "bg-[var(--primary)]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--foreground)]">{label}</span>
        <span className="font-semibold text-[var(--muted-foreground)]">
          {value}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full ${toneClass}`}
          style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
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

  const recentProjects = projects.slice(0, 4);

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
  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "Pending"
  );

  const totalBilledAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  const workloadHealth =
    openTasks >= 8 ? "Heavy" : openTasks >= 4 ? "Moderate" : "Stable";

  const workspaceHealth =
    highPriorityTasks >= 3 || pendingInvoices.length > 0
      ? "Needs Attention"
      : "Healthy";

  const weeklyOverviewData = [
    { name: "Mon", value: Math.max(activeClients, 1) * 2 },
    { name: "Tue", value: Math.max(totalProjects, 1) * 3 },
    { name: "Wed", value: Math.max(openTasks, 1) * 2 },
    { name: "Thu", value: Math.max(completedTasks, 1) * 4 },
    { name: "Fri", value: Math.max(totalTasks, 1) * 2 },
    { name: "Sat", value: Math.max(completedProjects, 1) * 3 },
    { name: "Sun", value: Math.max(invoices.length, 1) * 2 },
  ];

  const executionTrendData = [
    { name: "W1", value: Math.max(totalProjects, 1) + 1 },
    { name: "W2", value: Math.max(openTasks, 1) + 2 },
    { name: "W3", value: Math.max(completedTasks, 1) + 2 },
    { name: "W4", value: Math.max(completedProjects, 1) + 3 },
    { name: "W5", value: Math.max(totalClients, 1) + 4 },
    { name: "W6", value: Math.max(totalTasks, 1) + 2 },
  ];

  const projectCompletionRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const invoicePaidRate =
    invoices.length > 0 ? Math.round((paidInvoices.length / invoices.length) * 100) : 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--border)] bg-[var(--gradient-soft)] px-6 py-6 md:px-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
                  Operations center
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                  {workspace.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-[15px]">
                  Centralize delivery, client relationships, billing oversight
                  and workspace execution in one premium control panel.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)]">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Workspace {workspaceHealth}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)]">
                    <CircleAlert className="h-4 w-4 text-amber-500" />
                    Workload {workloadHealth}
                  </div>
                </div>
              </div>

              <div className="min-w-[270px] space-y-3">
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
            <MetricTile
              icon={<Users className="h-5 w-5" />}
              label="Clients"
              value={String(totalClients)}
              meta={`${activeClients} active`}
            />
            <MetricTile
              icon={<FolderKanban className="h-5 w-5" />}
              label="Projects"
              value={String(totalProjects)}
              meta={`${completedProjects} completed`}
            />
            <MetricTile
              icon={<ClipboardList className="h-5 w-5" />}
              label="Open Tasks"
              value={String(openTasks)}
              meta={`${completedTasks} completed`}
            />
            <MetricTile
              icon={<Receipt className="h-5 w-5" />}
              label="Invoices"
              value={String(invoices.length)}
              meta={`€${totalBilledAmount} billed`}
            />
          </div>
        </div>

        <Panel
          eyebrow="Highlights"
          title="Workspace Signal"
          className="bg-white"
          rightSlot={
            <div className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              Live
            </div>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniStat
              icon={<Trophy className="h-4 w-4 text-white" />}
              label="High Priority Tasks"
              value={String(highPriorityTasks)}
              colorClass="bg-[var(--primary)] text-white"
            />
            <MiniStat
              icon={<Wallet className="h-4 w-4 text-white" />}
              label="Pending Invoices"
              value={String(pendingInvoices.length)}
              colorClass="bg-emerald-500 text-white"
            />
            <MiniStat
              icon={<BriefcaseBusiness className="h-4 w-4 text-white" />}
              label="Seats Used"
              value={
                billingProfile
                  ? `${seatsUsed}/${billingProfile.seatsIncluded}`
                  : String(seatsUsed)
              }
              colorClass="bg-amber-500 text-white"
            />
            <MiniStat
              icon={<ChartColumnBig className="h-4 w-4 text-white" />}
              label="Project Usage"
              value={
                billingProfile
                  ? `${totalProjects}/${billingProfile.projectsIncluded}`
                  : String(totalProjects)
              }
              colorClass="bg-sky-500 text-white"
            />
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Signal Summary
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
              {workspaceHealth === "Healthy"
                ? "Operations are stable. Delivery, tasks and finance are under control."
                : "There are warning points in workload or billing that need review."}
            </p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Panel
          eyebrow="Analytics"
          title="Weekly Overview"
          rightSlot={
            <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]">
              Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <OverviewBarChart data={weeklyOverviewData} />

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Clients activity
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {activeClients} live accounts
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Task pressure
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {openTasks} active tasks
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Billing exposure
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                €{totalBilledAmount} total
              </p>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Performance" title="Execution Momentum">
            <OverviewLineChart data={executionTrendData} />
          </Panel>

          <Panel eyebrow="Subscription" title="Plan Usage">
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
                  value={
                    billingProfile.seatsIncluded > 0
                      ? Math.round((seatsUsed / billingProfile.seatsIncluded) * 100)
                      : 0
                  }
                  tone="primary"
                />
                <ProgressRow
                  label="Projects Usage"
                  value={
                    billingProfile.projectsIncluded > 0
                      ? Math.round(
                          (totalProjects / billingProfile.projectsIncluded) * 100
                        )
                      : 0
                  }
                  tone="green"
                />
                <ProgressRow
                  label="Paid Invoices"
                  value={invoicePaidRate}
                  tone="amber"
                />
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                No billing profile found for this workspace.
              </div>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel eyebrow="Projects" title="Status Distribution">
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
        </Panel>

        <Panel eyebrow="Tasks" title="Priority Load">
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
        </Panel>

        <Panel
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
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel eyebrow="Finance" title="Billing Activity">
          <div className="space-y-3">
            {invoices.length > 0 ? (
              invoices.slice(0, 4).map((invoice) => (
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
                        {String(invoice.issuedDate)}
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
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                No recent invoice activity.
              </div>
            )}
          </div>
        </Panel>

        <Panel eyebrow="Summary" title="Revenue Snapshot">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--primary)]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Total billed
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    €{totalBilledAmount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Completion rate
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {projectCompletionRate}%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Task closure
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {taskCompletionRate}%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-500">
                  <ChartColumnBig className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Paid invoice rate
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {invoicePaidRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}