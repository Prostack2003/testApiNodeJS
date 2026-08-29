import { Request, Response, NextFunction } from "express";
import {createNewUser, deleteUserData, getUserById, updateUserData} from "../services/users.service";
import {User} from "../interfaces/domain.interfaces.ts";

async function getUser(req: Request, res: Response, next: NextFunction)  {
    try {
        const user = await getUserById(Number(req.params.id));
        return res.json(user);
    } catch (err) {
        next(err);
    }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await createNewUser(req.body);
        return res.json(user)
    } catch(err) {
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

export default { getUser, createUser, updateUser, deleteUser };