"use client";

import {
  createTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask,
} from "@/app/actions/taskActions";
import { useMemo, useState } from "react";
import PageHeader from "@/app/components/dashboard/PageHeader";

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
};

export default function TasksClientPage({
  tasks: initialTasks,
  projects,
  workspaceName,
}: TasksPageProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");
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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Tasks"
        description="Track your team’s daily work, priorities and deadlines."
        actionLabel="New Task"
      />

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
        <form
          action={createTask}
          className="mb-6 grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <input
            name="title"
            type="text"
            placeholder="Task title"
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

          <select
            name="priority"
            defaultValue="Medium"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            name="projectId"
            defaultValue=""
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
          >
            <option value="">No project selected</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Create Task
          </button>
        </form>

        <div className="mb-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspaceName}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] md:max-w-sm"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "all"
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("active")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "active"
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("completed")}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "completed"
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as PriorityFilter)
                }
                className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
              >
                <option value="all">All Projects</option>
                <option value="none">No Project Linked</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

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
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
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
                        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                        required
                      />

                      <input
                        name="dueDate"
                        type="text"
                        defaultValue={task.dueDate}
                        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                        required
                      />

                      <select
                        name="priority"
                        defaultValue={task.priority}
                        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>

                      <select
                        name="projectId"
                        defaultValue={task.projectId ?? ""}
                        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                      >
                        <option value="">No project selected</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-2xl border border-[var(--border)] p-4 transition ${
                    task.completed
                      ? "bg-[var(--muted)] opacity-70"
                      : "bg-white hover:shadow-[0_12px_30px_rgba(15,46,40,0.06)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
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
                        Due: {task.dueDate}
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Project:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {task.project?.name ?? "No project linked"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {task.priority}
                    </span>

                    <button
                      type="button"
                      onClick={() => setEditingId(task.id)}
                      className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                    >
                      Edit
                    </button>

                    <form action={deleteTask}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] px-6 py-10 text-center">
              <p className="text-base font-semibold text-[var(--foreground)]">
                No tasks found
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Try changing your search or filter selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}