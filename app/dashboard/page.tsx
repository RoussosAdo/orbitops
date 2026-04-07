import GradientCard from "@/app/components/dashboard/cards/GradientCard";
import ProjectCard from "@/app/components/dashboard/cards/ProjectCard";
import StatCard from "@/app/components/dashboard/cards/StatCard";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export default async function DashboardPage() {
  const workspace = await requireCurrentWorkspace();

  const [clients, projects, tasks, billingProfile, invoices, seatsUsed] =
    await Promise.all([
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
    ]);

  const recentProjects = projects.slice(0, 3);

  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.status === "Active").length;

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

  const stats = [
    {
      label: "Total Clients",
      value: totalClients.toString(),
      change: `${activeClients} active`,
    },
    {
      label: "Total Projects",
      value: totalProjects.toString(),
      change: `${completedProjects} completed`,
    },
    {
      label: "Open Tasks",
      value: openTasks.toString(),
      change: `${completedTasks} completed`,
    },
    {
      label: "Invoices",
      value: invoices.length.toString(),
      change: `€${totalBilledAmount} total billed`,
    },
  ];

  return (
    <section className="space-y-6 bg-[var(--background)]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Workspace Overview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  Live Platform Metrics
                </h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {workspace.name}
                </p>
              </div>

              <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary-dark)]">
                Workspace Data
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Active Clients
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                  {activeClients}
                </h3>
              </div>

              <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Completed Projects
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                  {completedProjects}
                </h3>
              </div>

              <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Open Tasks
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                  {openTasks}
                </h3>
              </div>

              <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Completed Tasks
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                  {completedTasks}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
              <p className="text-sm text-[var(--muted-foreground)]">
                Projects by Status
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Planning
                  </span>
                  <span className="text-sm font-bold text-[var(--primary-dark)]">
                    {planningProjects}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    In Progress
                  </span>
                  <span className="text-sm font-bold text-[var(--primary-dark)]">
                    {inProgressProjects}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    In Review
                  </span>
                  <span className="text-sm font-bold text-[var(--primary-dark)]">
                    {inReviewProjects}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Completed
                  </span>
                  <span className="text-sm font-bold text-[var(--primary-dark)]">
                    {completedProjects}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
              <p className="text-sm text-[var(--muted-foreground)]">
                Tasks by Priority
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    High Priority
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {highPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Medium Priority
                  </span>
                  <span className="text-sm font-bold text-amber-700">
                    {mediumPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Low Priority
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {lowPriorityTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Total Tasks
                  </span>
                  <span className="text-sm font-bold text-[var(--primary-dark)]">
                    {totalTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Invoice Summary
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Paid Invoices
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {paidInvoices.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Pending Invoices
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {pendingInvoices.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Total Billed
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  €{totalBilledAmount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GradientCard
            eyebrow="Workspace Status"
            title="Operations Healthy"
            description="OrbitOps is now tracking workspace-level operational, billing and productivity metrics from live data."
            primaryAction="Live Metrics"
            secondaryAction="Workspace Ready"
          />

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Plan Usage
            </p>

            {billingProfile ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[var(--muted)] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                    Current Plan
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {billingProfile.planName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {billingProfile.billingCycle} · €{billingProfile.monthlyPrice}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--muted)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Seats Usage
                    </p>
                    <p className="text-sm font-bold text-[var(--primary-dark)]">
                      {seatsUsed}/{billingProfile.seatsIncluded}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--muted)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Projects Usage
                    </p>
                    <p className="text-sm font-bold text-[var(--primary-dark)]">
                      {totalProjects}/{billingProfile.projectsIncluded}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                No billing profile found for this workspace.
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Recent Projects
            </p>

            <div className="mt-4 space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    name={project.name}
                    status={project.status}
                    progress={`${project.progress}%`}
                  />
                ))
              ) : (
                <div className="rounded-2xl bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                  No recent projects yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}