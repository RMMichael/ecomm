import { z } from "zod";

// Define the Zod schema for a user
export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    age: z.number().optional(),
});

export const Session = z.object({
    id: z.string(),
    userId: z.number(),
    expiresAt: z.date(),
});


// Infer the TypeScript type from the schema
export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof Session>;
