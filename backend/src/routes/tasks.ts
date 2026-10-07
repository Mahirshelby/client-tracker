import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware";

const router = Router();

const taskSchema = z.object({
  title: z.string().min(1),
  done: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
});

// List tasks for a client
router.get("/clients/:clientId/tasks", requireAuth, async (req: AuthRequest, res) => {
  const clientId = Number(req.params.clientId);
  if (!Number.isInteger(clientId)) return res.status(400).json({ error: "Invalid id" });
  const client = await prisma.client.findFirst({ where: { id: clientId, userId: req.userId as number } });
  if (!client) return res.status(404).json({ error: "Client not found" });
  const tasks = await prisma.task.findMany({ where: { clientId }, orderBy: { createdAt: "desc" } });
  res.json(tasks);
});

// Create a task for a client
router.post("/clients/:clientId/tasks", requireAuth, async (req: AuthRequest, res) => {
  const clientId = Number(req.params.clientId);
  if (!Number.isInteger(clientId)) return res.status(400).json({ error: "Invalid id" });
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid task data" });
  const client = await prisma.client.findFirst({ where: { id: clientId, userId: req.userId as number } });
  if (!client) return res.status(404).json({ error: "Client not found" });
  const task = await prisma.task.create({ data: { ...parsed.data, clientId } });
  res.status(201).json(task);
});

// Update a task
router.put("/tasks/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = taskSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid task data" });
  const existing = await prisma.task.findFirst({ where: { id, client: { userId: req.userId as number } } });
  if (!existing) return res.status(404).json({ error: "Task not found" });
  const task = await prisma.task.update({ where: { id }, data: parsed.data });
  res.json(task);
});

// Delete a task
router.delete("/tasks/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const existing = await prisma.task.findFirst({ where: { id, client: { userId: req.userId as number } } });
  if (!existing) return res.status(404).json({ error: "Task not found" });
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

export default router;
