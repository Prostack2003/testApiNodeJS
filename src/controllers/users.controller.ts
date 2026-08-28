import { Request, Response, NextFunction } from "express";
import { getUserQuerySchema } from "../validation/user.schema";
import { getUserById } from "../services/users.service";

async function getUser(req: Request, res: Response, next: NextFunction)  {
    const parsedQuerySchema = getUserQuerySchema.safeParse(req.params);

    if (!parsedQuerySchema.success) {
        return res.status(400).json({
            error: "id должен быть числом!",
        })
    }

    try {
        const user = await getUserById(parsedQuerySchema.data.id);

        return res.json(user);
    } catch (err) {
        next(err);
    }
}

export default { getUser };