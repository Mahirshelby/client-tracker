import { prisma } from "../db";
import { HttpError } from "../utils/errors";
import { getOwnedClient } from "./clientService";

type TaskData = { title?: string; done?: boolean; dueDate?: Date };

async function getOwnedTask(userId: number, id: number) {
  const task = await prisma.task.findFirst({ where: { id, client: { userId } } });
  if (!task) throw new HttpError(404, "Task not found");
  return task;
}

export async function listTasks(userId: number, clientId: number) {
  await getOwnedClient(userId, clientId);
  return prisma.task.findMany({ where: { clientId }, orderBy: { createdAt: "desc" } });
}

export async function createTask(userId: number, clientId: number, data: TaskData & { title: string }) {
  await getOwnedClient(userId, clientId);
  return prisma.task.create({ data: { ...data, clientId } });
}

export async function updateTask(userId: number, id: number, data: TaskData) {
  await getOwnedTask(userId, id);
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(userId: number, id: number) {
  await getOwnedTask(userId, id);
  await prisma.task.delete({ where: { id } });
}
