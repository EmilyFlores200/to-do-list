import { z } from "zod";

export const ToDoValidator = z.object({
  title: z.string().optional(),
  text: z.string(),
});

export type ToDo = z.infer<typeof ToDoValidator>;
