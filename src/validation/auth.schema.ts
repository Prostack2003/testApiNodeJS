import { z } from "zod";

const LoginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})

const ForgotPasswordBodySchema = z.object({
    email: z.email(),
})

const ResetPasswordBodySchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8),
})

export { LoginBodySchema, ForgotPasswordBodySchema, ResetPasswordBodySchema };