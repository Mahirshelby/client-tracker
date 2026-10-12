import { Response, RequestHandler } from "express";
import { AuthRequest } from "../middleware/auth";

type Handler = (req: AuthRequest, res: Response) => Promise<unknown>;

// Sends any thrown error to the central error handler
export function asyncHandler(fn: Handler): RequestHandler {
  return (req, res, next) => {
    fn(req as AuthRequest, res).catch(next);
  };
}
