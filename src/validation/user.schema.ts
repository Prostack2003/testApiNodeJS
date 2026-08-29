import { z } from "zod";

const getUserQuerySchema = z.object({
    id: z.coerce.number(),
})

const UpdateBodySchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1).optional(),
    age: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional(),
    activityLevel: z.number().min(1).max(5).optional(),
})

const DeleteUserSchema = z.object({
    id: z.coerce.number(),
})

export { getUserQuerySchema, UpdateBodySchema, DeleteUserSchema }