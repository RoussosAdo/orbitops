import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Track delivery, progress and team ownership across active client workspaces."
        actionLabel="New Project"
      />

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] md:max-w-sm">
              Search projects...
            </div>

            <div className="hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)] md:block">
              All Statuses
            </div>
          </div>

          <button className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-light)]">
            Filter
          </button>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(18,185,129,0.18)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
                    {project.description}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    project.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : project.status === "Planning"
                      ? "bg-amber-100 text-amber-700"
                      : project.status === "In Review"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--muted-foreground)]">
                    Progress
                  </span>
                  <span className="font-bold text-[var(--primary-dark)]">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4 rounded-2xl bg-[var(--muted)] p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                    Budget
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    {project.budget}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                    Due Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    {project.dueDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                    Team
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    {project.team}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]">
                  View Project
                </button>

                <button className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]">
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}