import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as authService from "../services/authService";
import { credentialsSchema } from "../validators/auth";
import { parseBody } from "../utils/validate";

export async function register(req: AuthRequest, res: Response) {
  const { email, password } = parseBody(credentialsSchema, req.body);
  const result = await authService.register(email, password);
  res.status(201).json(result);
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = parseBody(credentialsSchema, req.body);
  res.json(await authService.login(email, password));
}

export async function me(req: AuthRequest, res: Response) {
  res.json(await authService.getProfile(req.userId as number));
}
