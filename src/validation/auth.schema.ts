import { z } from "zod";

const LoginBodySchema = z.object({
    email: z.string(),
    password: z.string().min(1),
})

export { LoginBodySchema };