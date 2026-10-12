import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as taskService from "../services/taskService";
import { taskSchema, updateTaskSchema } from "../validators/task";
import { parseBody } from "../utils/validate";
import { parseId } from "../utils/parseId";

export async function listForClient(req: AuthRequest, res: Response) {
  const clientId = parseId(req.params.clientId);
  res.json(await taskService.listTasks(req.userId as number, clientId));
}

export async function createForClient(req: AuthRequest, res: Response) {
  const clientId = parseId(req.params.clientId);
  const data = parseBody(taskSchema, req.body);
  res.status(201).json(await taskService.createTask(req.userId as number, clientId, data));
}

export async function update(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  const data = parseBody(updateTaskSchema, req.body);
  res.json(await taskService.updateTask(req.userId as number, id, data));
}

export async function remove(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  await taskService.deleteTask(req.userId as number, id);
  res.status(204).send();
}
