"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !completed },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}