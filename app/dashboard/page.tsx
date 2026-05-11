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
import { getCurrentLanguage } from "@/app/lib/language";
import { dashboardCopy } from "@/app/lib/i18n";

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
    <div className="group rounded-[1.45rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)] transition duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]">
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

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f7ff_100%)] text-[var(--primary)] transition group-hover:scale-105 group-hover:border-[var(--primary-light)]">
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
      className={`rounded-[1.7rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
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
    <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 shadow-[var(--shadow-xs)]">
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

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-all duration-500 ${toneClasses[tone]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const workspace = await requireCurrentWorkspace();
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language].overview;

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
    openTasks >= 8 ? copy.heavy : openTasks >= 4 ? copy.moderate : copy.stable;

  const workspaceHealth =
    highPriorityTasks >= 3 || pendingInvoices.length > 0
      ? copy.needsAttention
      : copy.healthy;

  const weeklyChartData = [
    { name: copy.weekdays.mon, value: 2 },
    { name: copy.weekdays.tue, value: 6 },
    { name: copy.weekdays.wed, value: 6 },
    { name: copy.weekdays.thu, value: 4 },
    { name: copy.weekdays.fri, value: 8 },
    { name: copy.weekdays.sat, value: 3 },
    { name: copy.weekdays.sun, value: 2 },
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
      <div className="grid gap-6 xl:grid-cols-[1.72fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[1.9rem] border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[rgba(109,94,252,0.08)] blur-3xl" />
          <div className="absolute left-10 top-16 h-24 w-24 rounded-full bg-[rgba(59,130,246,0.05)] blur-3xl" />

          <div className="relative border-b border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] px-6 py-7 md:px-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  {copy.operationsCenter}
                </div>

                <h1 className="mt-4 text-[2.8rem] font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                  {workspace.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-[15px]">
                  {copy.heroDescription}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)]">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {copy.workspace} {workspaceHealth}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)]">
                    <CircleAlert className="h-4 w-4 text-amber-500" />
                    {copy.workload} {workloadHealth}
                  </div>
                </div>
              </div>

              <div className="min-w-[280px] space-y-3">
                <WorkspaceSwitcher
                  currentWorkspaceId={workspace.id}
                  workspaces={workspaces}
                />

                <div className="grid grid-cols-2 gap-3">
                  <button className="inline-flex items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:bg-black">
                    {copy.createProject}
                  </button>

                  <button className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:bg-[var(--muted)]">
                    {copy.inviteTeam}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 md:px-7">
            <OverviewMetricCard
              icon={<Users className="h-5 w-5" />}
              label={copy.clients}
              value={String(totalClients)}
              meta={`${activeClients} ${copy.active}`}
            />
            <OverviewMetricCard
              icon={<FolderKanban className="h-5 w-5" />}
              label={copy.projects}
              value={String(totalProjects)}
              meta={`${completedProjects} ${copy.completed}`}
            />
            <OverviewMetricCard
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label={copy.openTasks}
              value={String(openTasks)}
              meta={`${completedTasks} ${copy.completed}`}
            />
            <OverviewMetricCard
              icon={<Receipt className="h-5 w-5" />}
              label={copy.invoices}
              value={String(invoices.length)}
              meta={`€${totalBilledAmount} ${copy.billed}`}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.9rem] border border-[var(--border)] bg-[var(--gradient-soft)] p-6 shadow-[var(--shadow-md)]">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(109,94,252,0.12)] blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
                  {copy.highlights}
                </p>

                <h2 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                  {copy.workspaceSignal}
                </h2>
              </div>

              <span className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--primary)] shadow-[var(--shadow-xs)]">
                {copy.live}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniStat
                label={copy.highPriorityTasks}
                value={String(highPriorityTasks)}
                accent="text-red-500"
              />
              <MiniStat
                label={copy.pendingInvoices}
                value={String(pendingInvoices.length)}
                accent="text-emerald-600"
              />
              <MiniStat
                label={copy.seatsUsed}
                value={
                  billingProfile
                    ? `${seatsUsed}/${billingProfile.seatsIncluded}`
                    : "—"
                }
                accent="text-amber-500"
              />
              <MiniStat
                label={copy.projectsUsage}
                value={
                  billingProfile
                    ? `${totalProjects}/${billingProfile.projectsIncluded}`
                    : "—"
                }
                accent="text-sky-500"
              />
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-4 shadow-[var(--shadow-xs)]">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                {copy.stableMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.72fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard
            eyebrow={copy.analytics}
            title={copy.weeklyOverview}
            className="shadow-[var(--shadow-md)]"
            rightSlot={
              <button className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--muted)]">
                {copy.details}
              </button>
            }
          >
            <OverviewBarChart data={weeklyChartData} />

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <MiniStat
                label={copy.clientsActivity}
                value={`${activeClients} ${copy.liveAccounts}`}
              />
              <MiniStat
                label={copy.taskPressure}
                value={`${openTasks} ${copy.activeTasks}`}
              />
              <MiniStat
                label={copy.billingExposure}
                value={`€${totalBilledAmount} ${copy.total}`}
              />
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              eyebrow={copy.performance}
              title={copy.executionSnapshot}
              rightSlot={
                <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  {copy.liveData}
                </span>
              }
            >
              <div className="space-y-3">
                {[
                  { label: copy.activeClients, value: activeClients },
                  { label: copy.completedProjects, value: completedProjects },
                  { label: copy.openTasks, value: openTasks },
                  { label: copy.completedTasks, value: completedTasks },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,#fbfcff_0%,#f7f9ff_100%)] p-4 transition hover:border-[var(--border-strong)]"
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

            <SectionCard eyebrow={copy.trend} title={copy.executionMomentum}>
              <OverviewLineChart data={momentumChartData} />
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              eyebrow={copy.projects}
              title={copy.projectStatusDistribution}
            >
              <div className="space-y-3">
                {[
                  { label: copy.planning, value: planningProjects },
                  { label: copy.inProgress, value: inProgressProjects },
                  { label: copy.inReview, value: inReviewProjects },
                  { label: copy.completed, value: completedProjects },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 transition hover:border-[var(--border-strong)]"
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

            <SectionCard eyebrow={copy.tasks} title={copy.priorityLoad}>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {copy.highPriority}
                  </span>
                  <span className="text-sm font-semibold text-red-500">
                    {highPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {copy.mediumPriority}
                  </span>
                  <span className="text-sm font-semibold text-amber-500">
                    {mediumPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {copy.lowPriority}
                  </span>
                  <span className="text-sm font-semibold text-emerald-500">
                    {lowPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {copy.totalTasks}
                  </span>
                  <span className="text-sm font-semibold text-[var(--primary)]">
                    {totalTasks}
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard eyebrow={copy.finance} title={copy.billingActivity}>
            <div className="space-y-3">
              {invoices.length > 0 ? (
                invoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 transition hover:border-[var(--border-strong)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-[var(--shadow-xs)]">
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
                  {copy.noRecentInvoiceActivity}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            eyebrow={copy.performance}
            title={copy.executionMomentum}
          >
            <OverviewLineChart data={momentumChartData} />
          </SectionCard>

          <SectionCard eyebrow={copy.subscription} title={copy.planUsage}>
            {billingProfile ? (
              <div className="space-y-4">
                <div className="rounded-[1.35rem] border border-[var(--border)] bg-[linear-gradient(180deg,#fbfcff_0%,#f7f9ff_100%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {copy.currentPlan}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-[var(--foreground)]">
                    {billingProfile.planName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {billingProfile.billingCycle} · €{billingProfile.monthlyPrice}
                  </p>
                </div>

                <ProgressRow
                  label={copy.seatsUsage}
                  value={seatsUsed}
                  max={billingProfile.seatsIncluded}
                  tone="purple"
                />
                <ProgressRow
                  label={copy.projectsUsage}
                  value={totalProjects}
                  max={billingProfile.projectsIncluded}
                  tone="blue"
                />
                <ProgressRow
                  label={copy.paidInvoices}
                  value={paidInvoices.length}
                  max={Math.max(invoices.length, 1)}
                  tone="amber"
                />
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
                {copy.noBillingProfile}
              </div>
            )}
          </SectionCard>

          <SectionCard
            eyebrow={copy.delivery}
            title={copy.recentProjects}
            rightSlot={
              <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--muted)]">
                {copy.viewAll}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4 transition hover:border-[var(--border-strong)]"
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
                  {copy.noRecentProjects}
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard eyebrow={copy.summary} title={copy.revenueSnapshot}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-[var(--shadow-xs)]">
                    <WalletCards className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {copy.totalBilled}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      €{totalBilledAmount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-[var(--shadow-xs)]">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {copy.completionRate}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      {taskClosureRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-[var(--shadow-xs)]">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {copy.taskClosure}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                      {taskClosureRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-500 shadow-[var(--shadow-xs)]">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {copy.paidInvoiceRate}
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