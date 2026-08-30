import { Request, Response, NextFunction } from "express";
import { authUser } from "../services/auth.service";

async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const {email, password} = req.body;
        const userData = await authUser(email, password);
        return res.status(200).json(userData);

    } catch (err) {
        next(err);
    }

}

export default { loginUser }