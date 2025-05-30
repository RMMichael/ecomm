import { z } from "zod";

// Define the Zod schema for a user
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().optional(),
});

// Infer the TypeScript type from the schema
export type User = z.infer<typeof UserSchema>;
