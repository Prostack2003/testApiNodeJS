import { z } from "zod";

const getUserQuerySchema = z.object({
    id: z.coerce.number(),
})

export { getUserQuerySchema }