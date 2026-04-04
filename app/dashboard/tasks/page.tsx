import { prisma } from "@/app/lib/prisma";
import TasksClientPage from "./TasksClientPage";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <TasksClientPage tasks={tasks} />;
}