import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleAlert,
  CreditCard,
  FolderKanban,
  Receipt,
  ShieldCheck,
  Users,
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
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
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
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
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
    { name: "W3", value: Math.max(completedTasks, 1) + 3 },
    { name: "W4", value: Math.max(completedProjects, 1) + 4 },
    { name: "W5", value: Math.max(totalClients, 1) + 4 },
    { name: "W6", value: Math.max(totalTasks, 1) + 3 },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--border)] px-6 py-6 md:px-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  Operations center
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
            Workspace signal
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            {workspaceHealth === "Healthy"
              ? "Operations Healthy"
              : "Review Required"}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
            OrbitOps is monitoring delivery progress, task pressure and billing
            activity from live workspace data.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                High priority tasks
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {highPriorityTasks}
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Pending invoices
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {pendingInvoices.length}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black">
              Live Metrics
            </button>

            <button className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white">
              Workspace Ready
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            eyebrow="Insights"
            title="Weekly Overview"
            rightSlot={
              <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                This week
              </span>
            }
          >
            <OverviewBarChart data={weeklyOverviewData} />
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
              <div className="grid gap-4">
                {[
                  { label: "Active Clients", value: activeClients },
                  { label: "Completed Projects", value: completedProjects },
                  { label: "Open Tasks", value: openTasks },
                  { label: "Completed Tasks", value: completedTasks },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5"
                  >
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {item.label}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Trend" title="Execution Momentum">
              <OverviewLineChart data={executionTrendData} />
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
        </div>

        <div className="space-y-6">
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

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Seats Usage
                    </p>
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {seatsUsed}/{billingProfile.seatsIncluded}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Projects Usage
                    </p>
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {totalProjects}/{billingProfile.projectsIncluded}
                    </p>
                  </div>
                </div>
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
                <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                  No recent invoice activity.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}