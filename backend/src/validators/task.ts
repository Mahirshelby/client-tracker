import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1),
  done: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = taskSchema.partial();
