import { Request, Response, NextFunction } from "express";
import {
    changeUserPassword,
    createNewUser,
    deleteUserData,
    getUserById,
    getUserProfile,
    updateUserData,
} from "../services/users.service";

async function getUser(req: Request, res: Response, next: NextFunction)  {
    try {
        let tokenId = undefined;
        if (req.user) {
            tokenId = req.user.id
        }
        const user = await getUserById(Number(req.params.id), Number(tokenId));
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
        let tokenId = undefined;
        if (req.user) {
            tokenId = req.user.id
        }
        const userUpdate= await updateUserData(Number(req.params.id), Number(tokenId), req.body)
        return res.json(userUpdate);
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        let tokenId = undefined;
        if (req.user) {
            tokenId = req.user.id
        }
        const deleteUser = await deleteUserData(Number(req.params.id), Number(tokenId));
        return res.json(deleteUser);
    } catch (err) {
        next(err);
    }
}

async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await getUserProfile(Number(req.user?.id));
        return res.json({ user });
    } catch (err) {
        next(err);
    }
}

async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id
        const tokenId = req.user?.id
        const updates = req.body;

        const updateUser = await updateUserData(Number(userId), Number(tokenId), updates);
        return res.json({ user: updateUser });
    } catch (err) {
        next(err);
    }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id
        const body = req.body;

        await changeUserPassword(Number(userId), body.oldPassword, body.newPassword);
        return res.status(200).json({
            message: 'Пароль успешно изменён'
        });
    } catch (err) {
        next(err);
    }
}

export default {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
};