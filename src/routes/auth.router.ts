import express from "express";
import authController from "../controllers/auth.controller";
import {LoginBodySchema} from "../validation/auth.schema";
import validate from "../middleware/validate";

const authRouter = express.Router();

authRouter.post(
    '/login',
    validate(LoginBodySchema, 'body'),
    authController.loginUser,
);

authRouter.post(
    '/refresh',
    authController.refreshUser,
)

authRouter.post(
    '/logout',
    authController.logoutUser
)

authRouter.post(
    '/forgot-password',
    authController.forgotPassword
)

authRouter.post(
    '/reset-password',
    authController.resetPassword
);

export default authRouter;