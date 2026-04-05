import GradientCard from "@/app/components/dashboard/cards/GradientCard";
import ProjectCard from "@/app/components/dashboard/cards/ProjectCard";
import StatCard from "@/app/components/dashboard/cards/StatCard";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [clientsCount, projects, tasks] = await Promise.all([
    prisma.client.count(),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.task.findMany(),
  ]);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  type TaskRow = (typeof tasks)[number];
  type ProjectRow = (typeof projects)[number];

  const completedTasks = tasks.filter((task: TaskRow) => task.completed).length;
  const activeTasks = tasks.filter((task: TaskRow) => !task.completed).length;

  const stats = [
    {
      label: "Clients",
      value: clientsCount.toString(),
      change: "Live database data",
    },
    {
      label: "Projects",
      value: totalProjects.toString(),
      change: "Seeded from Prisma",
    },
    {
      label: "Open Tasks",
      value: activeTasks.toString(),
      change: `${completedTasks} completed`,
    },
    {
      label: "Completed Tasks",
      value: completedTasks.toString(),
      change: `${totalTasks} total tasks`,
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
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Workspace Overview
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                Live Platform Metrics
              </h2>
            </div>

            <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary-dark)]">
              Real Data
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">
                Total Clients
              </p>
              <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {clientsCount}
              </h3>
            </div>

            <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">
                Total Projects
              </p>
              <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {totalProjects}
              </h3>
            </div>

            <div className="rounded-[1.5rem] bg-[var(--muted)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">
                Active Tasks
              </p>
              <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {activeTasks}
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

        <div className="space-y-6">
          <GradientCard
            eyebrow="Database Status"
            title="Neon Connected"
            description="OrbitOps is now powered by a live PostgreSQL database with Prisma and seeded production-style records."
            primaryAction="Database Live"
            secondaryAction="Prisma Ready"
          />

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Recent Projects
            </p>

            <div className="mt-4 space-y-4">
              {projects.map((project: ProjectRow) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  status={project.status}
                  progress={`${project.progress}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}