import { z } from "zod";

const getUserQuerySchema = z.object({
    id: z.coerce.number(),
})

const CreateUserBodySchema = z.object({
    name: z.string().min(1, ),
    email: z.email(),
    password: z.string().min(8),
    weight: z.number().positive(),
    height: z.number().positive(),
    age: z.number().int().positive(),
    gender: z.enum(['M', 'F']),
    activityLevel: z.number().min(1).max(5),
});

const UpdateBodySchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1).optional(),
    age: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional(),
    activityLevel: z.number().min(1).max(5).optional(),
})

const DeleteUserSchema = z.object({
    id: z.coerce.number(),
})

export { getUserQuerySchema, CreateUserBodySchema, UpdateBodySchema, DeleteUserSchema }