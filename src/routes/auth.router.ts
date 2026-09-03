import express from "express";
import authController from "../controllers/auth.controller";
import {ForgotPasswordBodySchema, LoginBodySchema, ResetPasswordBodySchema} from "../validation/auth.schema";
import validate from "../middleware/validate";
import {forgotPasswordLimiter, loginLimiter, refreshLimiter, resetPasswordLimiter} from "../middleware/rateLimiters";

const authRouter = express.Router();

authRouter.post(
    '/login',
    loginLimiter,
    validate(LoginBodySchema, 'body'),
    authController.loginUser,
);

authRouter.post(
    '/refresh',
    refreshLimiter,
    authController.refreshUser,
)

authRouter.post(
    '/logout',
    authController.logoutUser
)

authRouter.post(
    '/forgot-password',
    forgotPasswordLimiter,
    validate(ForgotPasswordBodySchema, 'body'),
    authController.forgotPassword
)

authRouter.post(
    '/reset-password',
    resetPasswordLimiter,
    validate(ResetPasswordBodySchema, 'body'),
    authController.resetPassword
);

export default authRouter;