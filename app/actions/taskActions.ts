"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export async function createTask(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Medium").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const projectIdRaw = String(formData.get("projectId") ?? "").trim();

  if (!title || !dueDate) {
    throw new Error("Task title and due date are required.");
  }

  let projectId: string | null = null;

  if (projectIdRaw) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectIdRaw,
        workspaceId: workspace.id,
      },
    });

    if (!project) {
      throw new Error("Selected project was not found in this workspace.");
    }

    projectId = project.id;
  }

  await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      projectId,
      title,
      priority,
      dueDate,
      completed: false,
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function updateTask(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const taskId = String(formData.get("taskId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Medium").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const projectIdRaw = String(formData.get("projectId") ?? "").trim();

  if (!taskId || !title || !dueDate) {
    throw new Error("Task id, title and due date are required.");
  }

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId: workspace.id,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found in current workspace.");
  }

  let projectId: string | null = null;

  if (projectIdRaw) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectIdRaw,
        workspaceId: workspace.id,
      },
    });

    if (!project) {
      throw new Error("Selected project was not found in this workspace.");
    }

    projectId = project.id;
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      priority,
      dueDate,
      projectId,
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  const workspace = await requireCurrentWorkspace();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId: workspace.id,
    },
  });

  if (!task) {
    throw new Error("Task not found in current workspace.");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !completed },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(formData: FormData) {
  const workspace = await requireCurrentWorkspace();

  const taskId = String(formData.get("taskId") ?? "").trim();

  if (!taskId) {
    throw new Error("Task id is required.");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId: workspace.id,
    },
  });

  if (!task) {
    throw new Error("Task not found in current workspace.");
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}