import express from "express";
import usersController from "../controllers/users.controller";
import validate from "../middleware/validate";
import {DeleteUserSchema, getUserQuerySchema, CreateUserBodySchema ,UpdateBodySchema} from "../validation/user.schema";
import authenticate from "../middleware/authenticate";


const usersRouter = express.Router();

usersRouter.get(
    "/:id",
    authenticate,
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
    authenticate,
    validate(UpdateBodySchema, 'body'),
    usersController.updateUser
);

usersRouter.delete(
    "/:id",
    authenticate,
    validate(DeleteUserSchema, 'params'),
    usersController.deleteUser
);

export default usersRouter;