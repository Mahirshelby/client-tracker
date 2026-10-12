import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as clientService from "../services/clientService";
import { clientSchema, updateClientSchema } from "../validators/client";
import { parseBody } from "../utils/validate";
import { parseId } from "../utils/parseId";

export async function list(req: AuthRequest, res: Response) {
  const page = Math.max(parseInt(String(req.query.page ?? "1")) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "10")) || 10, 1), 50);
  const search = String(req.query.search ?? "").trim();
  res.json(await clientService.listClients(req.userId as number, { page, limit, search }));
}

export async function create(req: AuthRequest, res: Response) {
  const data = parseBody(clientSchema, req.body);
  res.status(201).json(await clientService.createClient(req.userId as number, data));
}

export async function getOne(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  res.json(await clientService.getClientWithTasks(req.userId as number, id));
}

export async function update(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  const data = parseBody(updateClientSchema, req.body);
  res.json(await clientService.updateClient(req.userId as number, id, data));
}

export async function remove(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  await clientService.deleteClient(req.userId as number, id);
  res.status(204).send();
}
