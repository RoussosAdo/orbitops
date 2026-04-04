import GradientCard from "@/app/components/dashboard/cards/GradientCard";
import ProjectCard from "@/app/components/dashboard/cards/ProjectCard";
import StatCard from "@/app/components/dashboard/cards/StatCard";

const stats = [
  { label: "Total Revenue", value: "$48,240", change: "+12.4%" },
  { label: "Active Projects", value: "18", change: "+4 this month" },
  { label: "Open Tasks", value: "64", change: "12 due today" },
  { label: "Team Members", value: "7", change: "+2 new invites" },
];

const projects = [
  { name: "Orbit Analytics", status: "In Progress", progress: "74%" },
  { name: "Client Portal", status: "Planning", progress: "21%" },
  { name: "Finance Sync", status: "Completed", progress: "100%" },
];

export default function DashboardPage() {
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
                Performance Overview
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                Revenue & Growth
              </h2>
            </div>

            <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary-dark)]">
              This Month
            </span>
          </div>

          <div className="mt-8 flex h-72 items-end gap-4 rounded-[1.5rem] bg-gradient-to-br from-[#e6faf3] to-[#e6f7fb] p-6">
            <div className="h-24 flex-1 rounded-t-2xl bg-[#a7dbc3]" />
            <div className="h-40 flex-1 rounded-t-2xl bg-[#87ced6]" />
            <div className="h-56 flex-1 rounded-t-2xl bg-[var(--primary)]" />
            <div className="h-36 flex-1 rounded-t-2xl bg-[#72c7d7]" />
            <div className="h-48 flex-1 rounded-t-2xl bg-[#41c99a]" />
            <div className="h-64 flex-1 rounded-t-2xl bg-[var(--secondary)]" />
          </div>
        </div>

        <div className="space-y-6">
          <GradientCard
            eyebrow="Current Plan"
            title="Pro Workspace"
            description="Manage teams, projects, clients and analytics in one clean workspace with premium controls."
            primaryAction="Manage Billing"
            secondaryAction="Compare Plans"
          />

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Recent Projects
            </p>

            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.name}
                  name={project.name}
                  status={project.status}
                  progress={project.progress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}