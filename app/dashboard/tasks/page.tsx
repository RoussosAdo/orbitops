import { prisma } from "@/app/lib/prisma";
import TasksClientPage from "./TasksClientPage";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export default async function TasksPage() {
  const workspace = await requireCurrentWorkspace();

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <TasksClientPage
      tasks={tasks}
      projects={projects}
      workspaceName={workspace.name}
    />
  );
}