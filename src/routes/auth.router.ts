import express from "express";
import authController from "../controllers/auth.controller";
import {ForgotPasswordBodySchema, LoginBodySchema, ResetPasswordBodySchema} from "../validation/auth.schema";
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
    validate(ForgotPasswordBodySchema, 'body'),
    authController.forgotPassword
)

authRouter.post(
    '/reset-password',
    validate(ResetPasswordBodySchema, 'body'),
    authController.resetPassword
);

export default authRouter;