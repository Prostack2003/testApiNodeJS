import express from "express";
import usersController from "../controllers/users.controller";


const usersRouter = express.Router();

usersRouter.get("/:id", usersController.getUser);
usersRouter.patch("/:id", usersController.updateUser);

export default usersRouter;