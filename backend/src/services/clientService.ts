import { prisma } from "../db";
import { HttpError } from "../utils/errors";

type ClientData = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
};

// Every client query is scoped to the owner, so users never see each other's data
export async function getOwnedClient(userId: number, id: number) {
  const client = await prisma.client.findFirst({ where: { id, userId } });
  if (!client) throw new HttpError(404, "Client not found");
  return client;
}

export async function listClients(
  userId: number,
  opts: { page: number; limit: number; search: string }
) {
  const { page, limit, search } = opts;
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

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createClient(userId: number, data: ClientData & { name: string }) {
  return prisma.client.create({ data: { ...data, userId } });
}

export async function getClientWithTasks(userId: number, id: number) {
  const client = await prisma.client.findFirst({
    where: { id, userId },
    include: { tasks: true },
  });
  if (!client) throw new HttpError(404, "Client not found");
  return client;
}

export async function updateClient(userId: number, id: number, data: ClientData) {
  await getOwnedClient(userId, id);
  return prisma.client.update({ where: { id }, data });
}

export async function deleteClient(userId: number, id: number) {
  await getOwnedClient(userId, id);
  await prisma.client.delete({ where: { id } });
}
