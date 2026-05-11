import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import { dashboardCopy } from "@/app/lib/i18n";
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

function getProjectStatusLabel(status: string, language: "en" | "el") {
  const labels = {
    en: {
      Planning: "Planning",
      "In Progress": "In Progress",
      "In Review": "In Review",
      Completed: "Completed",
    },
    el: {
      Planning: "Σχεδιασμός",
      "In Progress": "Σε εξέλιξη",
      "In Review": "Σε έλεγχο",
      Completed: "Ολοκληρωμένο",
    },
  };

  return (
    labels[language][
      status as "Planning" | "In Progress" | "In Review" | "Completed"
    ] ?? status
  );
}

function ProjectStatusBadge({
  status,
  language,
}: {
  status: string;
  language: "en" | "el";
}) {
  const styles =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Planning"
      ? "bg-amber-100 text-amber-700"
      : status === "In Review"
      ? "bg-sky-100 text-sky-700"
      : "bg-violet-100 text-violet-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {getProjectStatusLabel(status, language)}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${
          accent || "text-[var(--foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const workspace = await requireCurrentWorkspace();
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language];
  const projectsCopy = copy.projects;

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
        eyebrow={projectsCopy.eyebrow}
        title={projectsCopy.title}
        description={projectsCopy.description}
        actionLabel={projectsCopy.newProject}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label={projectsCopy.totalProjects}
          value={String(projects.length)}
        />

        <SummaryCard
          label={projectsCopy.inProgress}
          value={String(inProgressProjects)}
          accent="text-[var(--primary)]"
        />

        <SummaryCard
          label={projectsCopy.planningCompleted}
          value={String(planningProjects + completedProjects)}
          accent="text-emerald-600"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--muted)] p-5">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {projectsCopy.createProject}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {projectsCopy.addNewDeliveryStream}
            </h2>
          </div>

          <form
            action={createProject}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            <input
              name="name"
              type="text"
              placeholder={projectsCopy.projectName}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="budget"
              type="text"
              placeholder={projectsCopy.budgetPlaceholder}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="dueDate"
              type="text"
              placeholder={projectsCopy.dueDate}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="team"
              type="text"
              placeholder={projectsCopy.teamPlaceholder}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <textarea
              name="description"
              placeholder={projectsCopy.projectDescription}
              className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] md:col-span-2 xl:col-span-2"
              required
            />

            <select
              name="status"
              defaultValue="Planning"
              className="h-[120px] rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="Planning">{projectsCopy.planning}</option>
              <option value="In Progress">{projectsCopy.inProgress}</option>
              <option value="In Review">{projectsCopy.inReview}</option>
              <option value="Completed">{projectsCopy.completed}</option>
            </select>

            <input
              name="progress"
              type="number"
              min="0"
              max="100"
              defaultValue="0"
              placeholder={projectsCopy.progressPlaceholder}
              className="h-[120px] rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            />

            <select
              name="clientId"
              defaultValue=""
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="">{projectsCopy.noClientSelected}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} — {client.company}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              {projectsCopy.createProject}
            </button>
          </form>
        </div>

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            {projectsCopy.currentWorkspace}:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>

          <button
            type="button"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            {projectsCopy.export}
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
            placeholder={projectsCopy.searchPlaceholder}
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />

          <select
            name="status"
            defaultValue={selectedStatus || "All"}
            className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="All">{projectsCopy.allStatuses}</option>
            <option value="Planning">{projectsCopy.planning}</option>
            <option value="In Progress">{projectsCopy.inProgress}</option>
            <option value="In Review">{projectsCopy.inReview}</option>
            <option value="Completed">{projectsCopy.completed}</option>
          </select>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            {projectsCopy.apply}
          </button>

          <a
            href="/dashboard/projects"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            {projectsCopy.reset}
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
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="budget"
                      type="text"
                      defaultValue={project.budget}
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="dueDate"
                      type="text"
                      defaultValue={project.dueDate}
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                      required
                    />

                    <input
                      name="team"
                      type="text"
                      defaultValue={project.team}
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
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
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                    >
                      <option value="Planning">{projectsCopy.planning}</option>
                      <option value="In Progress">{projectsCopy.inProgress}</option>
                      <option value="In Review">{projectsCopy.inReview}</option>
                      <option value="Completed">{projectsCopy.completed}</option>
                    </select>

                    <input
                      name="progress"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={project.progress}
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                    />

                    <select
                      name="clientId"
                      defaultValue={project.clientId ?? ""}
                      className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                    >
                      <option value="">{projectsCopy.noClientSelected}</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} — {client.company}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      {projectsCopy.saveProject}
                    </button>

                    <a
                      href={`/dashboard/projects?q=${encodeURIComponent(
                        searchQuery
                      )}&status=${encodeURIComponent(
                        selectedStatus || "All"
                      )}`}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                    >
                      {projectsCopy.cancel}
                    </a>
                  </form>
                </article>
              );
            }

            return (
              <article
                key={project.id}
                className="card-hover fade-in-up rounded-[1.55rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]"
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
                      {projectsCopy.client}:{" "}
                      <span className="font-semibold text-[var(--foreground)]">
                        {project.client
                          ? `${project.client.name} — ${project.client.company}`
                          : projectsCopy.noClientLinked}
                      </span>
                    </p>
                  </div>

                  <ProjectStatusBadge
                    status={project.status}
                    language={language}
                  />
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--muted-foreground)]">
                      {projectsCopy.progress}
                    </span>

                    <span className="font-bold text-[var(--primary-dark)]">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#8b80ff_0%,#6d5efc_55%,#5546f0_100%)] transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {projectsCopy.budget}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.budget}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {projectsCopy.dueDate}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.dueDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {projectsCopy.team}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {project.team}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button className="control-hover rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                    {projectsCopy.viewProject}
                  </button>

                  <a
                    href={`/dashboard/projects?edit=${project.id}&q=${encodeURIComponent(
                      searchQuery
                    )}&status=${encodeURIComponent(
                      selectedStatus || "All"
                    )}`}
                    className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                  >
                    {projectsCopy.edit}
                  </a>

                  <form action={deleteProject}>
                    <input type="hidden" name="projectId" value={project.id} />

                    <button
                      type="submit"
                      className="control-hover rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      {projectsCopy.delete}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}

          {projects.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--muted)] p-10 text-center text-sm text-[var(--muted-foreground)] xl:col-span-2">
              <p className="text-base font-semibold text-[var(--foreground)]">
                {projectsCopy.noProjectsFound}
              </p>

              <p className="mt-2">{projectsCopy.noProjectsDescription}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}