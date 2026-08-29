import express from "express";
import usersController from "../controllers/users.controller";
import validate from "../middleware/validate";
import {DeleteUserSchema, getUserQuerySchema, CreateUserBodySchema ,UpdateBodySchema} from "../validation/user.schema";


const usersRouter = express.Router();

usersRouter.get(
    "/:id",
    validate(getUserQuerySchema, 'params'),
    usersController.getUser
);

usersRouter.post(
    '/',
    validate(CreateUserBodySchema, 'body'),
    usersController.createUser
)

usersRouter.patch(
    "/:id",
    validate(UpdateBodySchema, 'body'),
    usersController.updateUser
);

usersRouter.delete(
    "/:id",
    validate(DeleteUserSchema, 'params'),
    usersController.deleteUser
);

export default usersRouter;