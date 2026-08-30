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

export default authRouter;