"use client";

import {
  createTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask,
} from "@/app/actions/taskActions";
import { useMemo, useState } from "react";
import PageHeader from "@/app/components/dashboard/PageHeader";
import type { AppLanguage } from "@/app/lib/i18n";
import { dashboardCopy } from "@/app/lib/i18n";

type FilterTab = "all" | "active" | "completed";
type PriorityFilter = "all" | "High" | "Medium" | "Low";

type TaskItem = {
  id: string;
  title: string;
  priority: string;
  dueDate: string;
  completed: boolean;
  projectId: string | null;
  project?: {
    id: string;
    name: string;
  } | null;
};

type ProjectItem = {
  id: string;
  name: string;
};

type TasksPageProps = {
  tasks: TaskItem[];
  projects: ProjectItem[];
  workspaceName: string;
  language: AppLanguage;
};

function getPriorityLabel(priority: string, copy: typeof dashboardCopy.en.tasksPage) {
  if (priority === "High") return copy.high;
  if (priority === "Medium") return copy.medium;
  if (priority === "Low") return copy.low;
  return priority;
}

function PriorityBadge({
  priority,
  copy,
}: {
  priority: string;
  copy: typeof dashboardCopy.en.tasksPage;
}) {
  const styles =
    priority === "High"
      ? "bg-red-100 text-red-600"
      : priority === "Medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {getPriorityLabel(priority, copy)}
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

export default function TasksClientPage({
  tasks: initialTasks,
  projects,
  workspaceName,
  language,
}: TasksPageProps) {
  const copy = dashboardCopy[language].tasksPage;

  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleTask = async (id: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    await toggleTaskCompletion(id, completed);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "active"
          ? !task.completed
          : task.completed;

      const matchesPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "all"
          ? true
          : projectFilter === "none"
          ? !task.projectId
          : task.projectId === projectFilter;

      return matchesSearch && matchesTab && matchesPriority && matchesProject;
    });
  }, [tasks, search, activeTab, priorityFilter, projectFilter]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.newTask}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label={copy.totalTasks} value={String(tasks.length)} />
        <SummaryCard
          label={copy.completed}
          value={String(completedCount)}
          accent="text-emerald-600"
        />
        <SummaryCard
          label={copy.highPriority}
          value={String(highPriorityCount)}
          accent="text-red-500"
        />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--muted)] p-5">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {copy.createTask}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {copy.addNewTaskItem}
            </h2>
          </div>

          <form
            action={createTask}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <input
              name="title"
              type="text"
              placeholder={copy.taskTitle}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <input
              name="dueDate"
              type="text"
              placeholder={copy.dueDate}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              required
            />

            <select
              name="priority"
              defaultValue="Medium"
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="High">{copy.high}</option>
              <option value="Medium">{copy.medium}</option>
              <option value="Low">{copy.low}</option>
            </select>

            <select
              name="projectId"
              defaultValue=""
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="">{copy.noProjectSelected}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              {copy.createTask}
            </button>
          </form>
        </div>

        <div className="mt-6 mb-5">
          <p className="text-sm text-[var(--muted-foreground)]">
            {copy.currentWorkspace}:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspaceName}
            </span>
          </p>
        </div>

        <div className="mb-6 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-4">
          <div className="grid gap-3 xl:grid-cols-[1.2fr_auto_auto_auto_auto_auto]">
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`h-12 rounded-2xl px-4 text-sm font-semibold transition ${
                activeTab === "all"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {copy.all}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`h-12 rounded-2xl px-4 text-sm font-semibold transition ${
                activeTab === "active"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {copy.active}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`h-12 rounded-2xl px-4 text-sm font-semibold transition ${
                activeTab === "completed"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {copy.completed}
            </button>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as PriorityFilter)
              }
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="all">{copy.allPriorities}</option>
              <option value="High">{copy.high}</option>
              <option value="Medium">{copy.medium}</option>
              <option value="Low">{copy.low}</option>
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
            >
              <option value="all">{copy.allProjects}</option>
              <option value="none">{copy.noProjectLinkedFilter}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveTab("all");
                setPriorityFilter("all");
                setProjectFilter("all");
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
            >
              {copy.resetFilters}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isEditing = editingId === task.id;

              if (isEditing) {
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4"
                  >
                    <form
                      action={updateTask}
                      className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
                    >
                      <input type="hidden" name="taskId" value={task.id} />

                      <input
                        name="title"
                        type="text"
                        defaultValue={task.title}
                        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                        required
                      />

                      <input
                        name="dueDate"
                        type="text"
                        defaultValue={task.dueDate}
                        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                        required
                      />

                      <select
                        name="priority"
                        defaultValue={task.priority}
                        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                      >
                        <option value="High">{copy.high}</option>
                        <option value="Medium">{copy.medium}</option>
                        <option value="Low">{copy.low}</option>
                      </select>

                      <select
                        name="projectId"
                        defaultValue={task.projectId ?? ""}
                        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
                      >
                        <option value="">{copy.noProjectSelected}</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="h-12 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-semibold text-white transition hover:bg-black"
                        >
                          {copy.save}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                        >
                          {copy.cancel}
                        </button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div
                  key={task.id}
                  className={`fade-in-up flex items-center justify-between rounded-2xl border border-[var(--border)] p-4 ${
                    task.completed
                      ? "bg-[var(--muted)] opacity-80"
                      : "bg-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-bold transition ${
                        task.completed
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div>
                      <p
                        className={`font-semibold ${
                          task.completed
                            ? "text-[var(--muted-foreground)] line-through"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="text-sm text-[var(--muted-foreground)]">
                        {copy.due}: {task.dueDate}
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {copy.projectLabel}:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {task.project?.name ?? copy.noProjectLinked}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={task.priority} copy={copy} />

                    <button
                      type="button"
                      onClick={() => setEditingId(task.id)}
                      className="control-hover rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                    >
                      {copy.edit}
                    </button>

                    <form action={deleteTask}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="control-hover rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        {copy.delete}
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] px-6 py-12 text-center">
              <p className="text-base font-semibold text-[var(--foreground)]">
                {copy.noTasksFound}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {copy.noTasksDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}