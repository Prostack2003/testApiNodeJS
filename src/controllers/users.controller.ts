import { Request, Response, NextFunction } from "express";
import {getUserQuerySchema, UpdateBodySchema} from "../validation/user.schema";
import {getUserById, updateUserData} from "../services/users.service";

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

async function updateUser(req: Request, res: Response, next: NextFunction) {
    const parsedQuerySchema = UpdateBodySchema.safeParse(req.body);

    if (!parsedQuerySchema.success) {
        return res.status(400).json({
            error: "Один из параметров неправильный"
        })
    }

    try {
        const userUpdate= await updateUserData(parsedQuerySchema.data.id, parsedQuerySchema.data)


        return res.json(userUpdate);
    } catch (err) {
        next(err);
    }

}

export default { getUser, updateUser };