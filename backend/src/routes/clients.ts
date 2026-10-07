import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware";

const router = Router();
router.use(requireAuth);

const clientSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// List with search + pagination
router.get("/", async (req: AuthRequest, res) => {
  const userId = req.userId as number;
  const page = Math.max(parseInt(String(req.query.page ?? "1")) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "10")) || 10, 1), 50);
  const search = String(req.query.search ?? "").trim();

  const where = {
    userId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.client.count({ where }),
  ]);

  res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// Create
router.post("/", async (req: AuthRequest, res) => {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid client data" });
  const client = await prisma.client.create({
    data: { ...parsed.data, userId: req.userId as number },
  });
  res.status(201).json(client);
});

// Read one (with tasks)
router.get("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const client = await prisma.client.findFirst({
    where: { id, userId: req.userId as number },
    include: { tasks: true },
  });
  if (!client) return res.status(404).json({ error: "Client not found" });
  res.json(client);
});

// Update
router.put("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = clientSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid client data" });
  const existing = await prisma.client.findFirst({ where: { id, userId: req.userId as number } });
  if (!existing) return res.status(404).json({ error: "Client not found" });
  const updated = await prisma.client.update({ where: { id }, data: parsed.data });
  res.json(updated);
});

// Delete
router.delete("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const existing = await prisma.client.findFirst({ where: { id, userId: req.userId as number } });
  if (!existing) return res.status(404).json({ error: "Client not found" });
  await prisma.client.delete({ where: { id } });
  res.status(204).send();
});

export default router;
