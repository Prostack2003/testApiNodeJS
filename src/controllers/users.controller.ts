import { Request, Response, NextFunction } from "express";
import {deleteUserData, getUserById, updateUserData} from "../services/users.service";

async function getUser(req: Request, res: Response, next: NextFunction)  {
    try {
        const user = await getUserById(Number(req.params.id));
        return res.json(user);
    } catch (err) {
        next(err);
    }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userUpdate= await updateUserData(Number(req.params.id), req.body)
        return res.json(userUpdate);
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const deleteUser = await deleteUserData(Number(req.params.id));
        return res.json(deleteUser);
    } catch (err) {
        next(err);
    }
}

export default { getUser, updateUser, deleteUser };