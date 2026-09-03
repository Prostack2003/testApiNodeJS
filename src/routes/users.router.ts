import express from "express";
import usersController from "../controllers/users.controller";
import validate from "../middleware/validate";
import {
    DeleteUserSchema,
    getUserQuerySchema,
    CreateUserBodySchema,
    UpdateBodySchema,
    UpdateProfileBodySchema, ChangePasswordBodySchema
} from "../validation/user.schema";
import authenticate from "../middleware/authenticate";


const usersRouter = express.Router();

usersRouter.post(
    '/',
    validate(CreateUserBodySchema, 'body'),
    usersController.createUser
)
usersRouter.get(
    '/me',
    authenticate,
    usersController.getProfile
)
usersRouter.patch(
    '/me',
    authenticate,
    validate(UpdateProfileBodySchema, 'body'),
    usersController.updateProfile
)
usersRouter.post(
    '/me/change-password',
    authenticate,
    validate(ChangePasswordBodySchema, 'body'),
    usersController.changePassword
)


usersRouter.get(
    "/:id",
    authenticate,
    validate(getUserQuerySchema, 'params'),
    usersController.getUser
);
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