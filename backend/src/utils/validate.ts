import { HttpError } from "./errors";

type Parser<T> = { safeParse: (data: unknown) => { success: boolean; data?: T } };

export function parseBody<T>(schema: Parser<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) throw new HttpError(400, "Invalid input");
  return result.data as T;
}
