import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/app/actions/projectActions";

type ProjectsPageProps = {
  searchParams?: Promise<{
    edit?: string;
    q?: string;
    status?: string;
  }>;
};

function ProjectStatusBadge({ status }: { status: string }) {
  const styles =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Planning"
      ? "bg-amber-100 text-amber-700"
      : status === "In Review"
      ? "bg-sky-100 text-sky-700"
      : "bg-violet-100 text-violet-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const workspace = await requireCurrentWorkspace();
  const params = searchParams ? await searchParams : undefined;

  const editingId = params?.edit ?? null;
  const searchQuery = (params?.q ?? "").trim();
  const selectedStatus = (params?.status ?? "").trim();

  const [projects, clients] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
        ...(searchQuery
          ? {
              OR: [
                {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  budget: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  dueDate: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  team: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  client: {
                    is: {
                      name: {
                        contains: searchQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  client: {
                    is: {
                      company: {
                        contains: searchQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            }
          : {}),
        ...(selectedStatus && selectedStatus !== "All"
          ? {
              status: selectedStatus,
            }
          : {}),
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

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;
  const planningProjects = projects.filter(
    (project) => project.status === "Planning"
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Track delivery, monitor progress and manage active work across all linked clients."
        actionLabel="New Project"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">Total Projects</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {projects.length}
          </p>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">In Progress</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--primary)]">
            {inProgressProjects}
          </p>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">Planning / Completed</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-emerald-600">
            {planningProjects + completedProjects}
          </p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-6 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Create project
          </p>

          <form
            action={createProject}
            className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
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
              className="rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Create Project
            </button>
          </form>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <button
            type="button"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            Export
          </button>
        </div>

        <form
          method="GET"
          className="mb-6 grid gap-3 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-[1.3fr_220px_auto_auto]"
        >
          <input
            name="q"
            type="text"
            defaultValue={searchQuery}
            placeholder="Search by project, client, budget or team..."
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />

          <select
            name="status"
            defaultValue={selectedStatus || "All"}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Apply
          </button>

          <a
            href="/dashboard/projects"
            className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            Reset
          </a>
        </form>

        <div className="grid gap-5 xl:grid-cols-2">
          {projects.map((project) => {
            const isEditing = editingId === project.id;

            if (isEditing) {
              return (
                <article
                  key={project.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-5 shadow-sm xl:col-span-2"
                >
                  <form
                    action={updateProject}
                    className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
                  >
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
                      className="rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      Save Project
                    </button>

                    <a
                      href={`/dashboard/projects?q=${encodeURIComponent(
                        searchQuery
                      )}&status=${encodeURIComponent(
                        selectedStatus || "All"
                      )}`}
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
                className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      {project.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
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

                  <ProjectStatusBadge status={project.status} />
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
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Budget
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.budget}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Due Date
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.dueDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      Team
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.team}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
                    View Project
                  </button>

                  <a
                    href={`/dashboard/projects?edit=${project.id}&q=${encodeURIComponent(
                      searchQuery
                    )}&status=${encodeURIComponent(
                      selectedStatus || "All"
                    )}`}
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
              No projects found for the current filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}