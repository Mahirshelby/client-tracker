import { HttpError } from "./errors";

export function parseId(value: unknown): number {
  const id = Number(value);
  if (!Number.isInteger(id)) throw new HttpError(400, "Invalid id");
  return id;
}
