import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import {createProject, updateProject, deleteProject,} from "@/app/actions/projectActions";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  const workspace = await requireCurrentWorkspace();
  const params = searchParams ? await searchParams : undefined;
  const editingId = params?.edit ?? null;

  const [projects, clients] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        client: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Track delivery, progress and team ownership across active client workspaces."
        actionLabel="New Project"
      />

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <form
          action={createProject}
          className="mb-6 grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            name="name"
            type="text"
            placeholder="Project name"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <input
            name="budget"
            type="text"
            placeholder="Budget (e.g. $5,000)"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <input
            name="dueDate"
            type="text"
            placeholder="Due date"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <input
            name="team"
            type="text"
            placeholder="Team (e.g. 3 members)"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            required
          />

          <textarea
            name="description"
            placeholder="Project description"
            className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] md:col-span-2 xl:col-span-2"
            required
          />

          <select
            name="status"
            defaultValue="Planning"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            defaultValue="0"
            placeholder="Progress %"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          />

          <select
            name="clientId"
            defaultValue=""
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="">No client selected</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.company}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Create Project
          </button>
        </form>

        <div className="mb-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>
        </div>

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
          {projects.map((project) => {
            const isEditing = editingId === project.id;

            if (isEditing) {
              return (
                <article
                  key={project.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-5 shadow-sm xl:col-span-2"
                >
                  <form action={updateProject} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <input type="hidden" name="projectId" value={project.id} />

                    <input
                      name="name"
                      type="text"
                      defaultValue={project.name}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="budget"
                      type="text"
                      defaultValue={project.budget}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="dueDate"
                      type="text"
                      defaultValue={project.dueDate}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="team"
                      type="text"
                      defaultValue={project.team}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <textarea
                      name="description"
                      defaultValue={project.description}
                      className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none md:col-span-2 xl:col-span-2"
                      required
                    />

                    <select
                      name="status"
                      defaultValue={project.status}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <input
                      name="progress"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={project.progress}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                    />

                    <select
                      name="clientId"
                      defaultValue={project.clientId ?? ""}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                    >
                      <option value="">No client selected</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} — {client.company}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                      Save Project
                    </button>

                    <a
                      href="/dashboard/projects"
                      className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                    >
                      Cancel
                    </a>
                  </form>
                </article>
              );
            }

            return (
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

                    <p className="mt-3 text-xs font-medium text-[var(--muted-foreground)]">
                      Client:{" "}
                      <span className="font-semibold text-[var(--foreground)]">
                        {project.client
                          ? `${project.client.name} — ${project.client.company}`
                          : "No client linked"}
                      </span>
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

  <a
    href={`/dashboard/projects?edit=${project.id}`}
    className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
  >
    Edit
  </a>

  <form action={deleteProject}>
    <input type="hidden" name="projectId" value={project.id} />
    <button
      type="submit"
      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
    >
      Delete
    </button>
  </form>
</div>
              </article>
            );
          })}

          {projects.length === 0 && (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)] xl:col-span-2">
              No projects found in this workspace yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}