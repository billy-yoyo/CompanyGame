import { Router } from "express";
import T from "tsplate";
import { ControllerRouter } from "../apiLib/controller";
import { TAuthenticateUser, TCreateUser, TDeleteUser, TLoginResult, TLoginUser, TUser } from "../models/auth";
import * as auth from "../service/auth";
export const router = Router();
const controller = new ControllerRouter(router);

controller.post("/user", { body: TCreateUser, response: TUser }, async (req) => {
    const user = await auth.createUser(req.body);
    return user;
});

controller.delete("/user/:userId", { params: TDeleteUser }, async (req) => {
    await auth.deleteUser(req.params);
});

controller.post("/login", { body: TLoginUser, response: TLoginResult }, async (req) => {
    const result = await auth.loginUser(req.body);

    return result;
});

controller.post("/authenticate", { body: TAuthenticateUser, response: T.Boolean }, async (req) => {
    const result = await auth.authenticateUser(req.body);
    return result;
});
